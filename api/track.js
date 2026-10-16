import { getSupabaseAdmin, hashIp, parseUserAgent, parseRequestBody } from './_lib/supabase.js';

export default async function handler(req, res) {
  // CORS & method check
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseRequestBody(req);
    const { visitorId, sessionId, pagePath = '/', referrer = '', isHeartbeat = false } = body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: 'visitorId and sessionId are required' });
    }

    // IP processing: Hash server-side with HMAC, never store raw IP
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
    const ipHash = hashIp(rawIp);

    // Approximate Geo info from trusted Vercel platform headers only
    const country = req.headers['x-vercel-ip-country'] || 'Unavailable';
    const city = req.headers['x-vercel-ip-city'] || 'Unavailable';

    // Categorized User Agent (non-invasive)
    const uaString = req.headers['user-agent'] || '';
    const { device, os, browser } = parseUserAgent(uaString);

    // Clean referrer domain
    let referrerDomain = 'Direct';
    if (referrer) {
      try {
        const parsedUrl = new URL(referrer);
        referrerDomain = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        referrerDomain = 'Other';
      }
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      const { localStore } = await import('./_lib/localStore.js');
      const stats = localStore.recordVisit({
        visitorId,
        sessionId,
        pagePath,
        referrerDomain,
        browser,
        os,
        device,
        country: country !== 'Unavailable' ? country : 'India',
        city: city !== 'Unavailable' ? city : 'Nagpur',
        isHeartbeat,
      });

      return res.status(200).json({
        success: true,
        configured: true,
        stats,
      });
    }

    const now = new Date().toISOString();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // 1. Maintain Active Sessions (heartbeat or visit)
    await supabase.from('active_sessions').upsert({
      session_id: sessionId,
      visitor_id: visitorId,
      page_path: pagePath,
      last_active_at: now,
    });

    // Clean up inactive sessions (> 5 minutes)
    await supabase.from('active_sessions').delete().lt('last_active_at', fiveMinutesAgo);

    // 2. If it's a heartbeat, do NOT increment visits or record page_views
    if (!isHeartbeat) {
      // Check for duplicate rapid page views (e.g. React StrictMode, remount, or refresh within 15 seconds)
      const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000).toISOString();
      const { data: recentViews } = await supabase
        .from('page_views')
        .select('id')
        .eq('visitor_id', visitorId)
        .eq('page_path', pagePath)
        .gte('created_at', fifteenSecondsAgo)
        .limit(1);

      const isDuplicate = recentViews && recentViews.length > 0;

      if (!isDuplicate) {
        // Query existing visitor
        const { data: existingVisitor } = await supabase
          .from('visitors')
          .select('visitor_id, visit_count')
          .eq('visitor_id', visitorId)
          .maybeSingle();

        if (existingVisitor) {
          // Returning visitor: update last seen, increment count
          await supabase
            .from('visitors')
            .update({
              last_seen_at: now,
              visit_count: (existingVisitor.visit_count || 1) + 1,
              browser,
              os,
              device,
              country,
              city,
            })
            .eq('visitor_id', visitorId);
        } else {
          // New visitor profile
          await supabase.from('visitors').insert({
            visitor_id: visitorId,
            ip_hash: ipHash,
            first_seen_at: now,
            last_seen_at: now,
            visit_count: 1,
            browser,
            os,
            device,
            country,
            city,
            referrer_domain: referrerDomain,
          });
        }

        // Record discrete page view
        await supabase.from('page_views').insert({
          visitor_id: visitorId,
          session_id: sessionId,
          page_path: pagePath,
          referrer: referrerDomain,
          created_at: now,
        });
      }
    }

    // 3. Fetch up-to-date aggregate stats for real-time counter response
    const [{ count: totalVisits }, { count: uniqueVisitors }, { count: activeVisitors }] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('visitors').select('*', { count: 'exact', head: true }),
      supabase.from('active_sessions').select('*', { count: 'exact', head: true }).gte('last_active_at', fiveMinutesAgo),
    ]);

    return res.status(200).json({
      success: true,
      configured: true,
      stats: {
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitors || 0,
        activeVisitors: Math.max(1, activeVisitors || 1), // At least current active visitor
      },
    });
  } catch (err) {
    console.error('Error tracking visit:', err);
    return res.status(500).json({ error: 'Internal server error processing visit event' });
  }
}
