import { getSupabaseAdmin, verifyAdminRequest } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Enforce Server-Side Administrator Authentication
  const authCheck = await verifyAdminRequest(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status).json({ error: authCheck.error });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const { localStore } = await import('../_lib/localStore.js');
    const url = new URL(req.url, 'http://localhost');
    const range = url.searchParams.get('range') || '30d';
    const search = url.searchParams.get('search') || '';
    const deviceFilter = url.searchParams.get('device') || '';
    const pageFilter = url.searchParams.get('pagePath') || '';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '15', 10)));

    const result = localStore.getAnalyticsData({
      range,
      search,
      deviceFilter,
      pageFilter,
      page: pageNum,
      limit,
    });

    return res.status(200).json({
      success: true,
      user: { email: authCheck.user.email },
      ...result,
    });
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const range = url.searchParams.get('range') || '30d'; // 'today', '7d', '30d', 'all'
    const search = url.searchParams.get('search') || '';
    const deviceFilter = url.searchParams.get('device') || '';
    const pageFilter = url.searchParams.get('pagePath') || '';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '25', 10)));
    const offset = (pageNum - 1) * limit;

    const now = new Date();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    let startDateIso = null;
    if (range === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDateIso = startOfDay.toISOString();
    } else if (range === '7d') {
      startDateIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === '30d') {
      startDateIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    // 2. Compute Summary Metrics
    const todayStartIso = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalViews },
      { count: uniqueVisitors },
      { count: returningVisitors },
      { count: viewsToday },
      { count: views7d },
      { count: views30d },
      { count: activeSessions },
    ] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('visitors').select('*', { count: 'exact', head: true }),
      supabase.from('visitors').select('*', { count: 'exact', head: true }).gt('visit_count', 1),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStartIso),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgoIso),
      supabase.from('active_sessions').select('*', { count: 'exact', head: true }).gte('last_active_at', fiveMinutesAgo),
    ]);

    // 3. Page Popularity (Most-viewed pages)
    let pagePopularityQuery = supabase.from('page_views').select('page_path');
    if (startDateIso) {
      pagePopularityQuery = pagePopularityQuery.gte('created_at', startDateIso);
    }
    const { data: pageRows } = await pagePopularityQuery.limit(5000);
    const pageCounts = {};
    (pageRows || []).forEach((row) => {
      const p = row.page_path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const mostViewedPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // 4. Device and Browser Breakdown
    const { data: visitorProfiles } = await supabase
      .from('visitors')
      .select('device, browser, os')
      .limit(2000);

    const deviceBreakdown = { Desktop: 0, Mobile: 0, Tablet: 0, Other: 0 };
    const browserBreakdown = {};
    const osBreakdown = {};

    (visitorProfiles || []).forEach((v) => {
      const dev = v.device || 'Other';
      deviceBreakdown[dev] = (deviceBreakdown[dev] || 0) + 1;

      const br = v.browser || 'Other';
      browserBreakdown[br] = (browserBreakdown[br] || 0) + 1;

      const o = v.os || 'Other';
      osBreakdown[o] = (osBreakdown[o] || 0) + 1;
    });

    // 5. Daily Traffic Series (Last 14 days for timeline chart)
    const fourteenDaysAgoIso = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyViewRows } = await supabase
      .from('page_views')
      .select('created_at, visitor_id')
      .gte('created_at', fourteenDaysAgoIso)
      .order('created_at', { ascending: true })
      .limit(5000);

    const dailyTrendMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().slice(0, 10);
      dailyTrendMap[dateKey] = { date: dateKey, views: 0, unique: new Set() };
    }

    (dailyViewRows || []).forEach((row) => {
      const dateKey = row.created_at.slice(0, 10);
      if (dailyTrendMap[dateKey]) {
        dailyTrendMap[dateKey].views += 1;
        dailyTrendMap[dateKey].unique.add(row.visitor_id);
      }
    });

    const dailyTrends = Object.values(dailyTrendMap).map((d) => ({
      date: d.date,
      views: d.views,
      uniqueVisitors: d.unique.size,
    }));

    // 6. Detailed Activity Logs with Join on Visitor Profile
    let logsQuery = supabase
      .from('page_views')
      .select(
        `
        id,
        page_path,
        referrer,
        created_at,
        visitor_id,
        visitors!inner (
          visitor_id,
          browser,
          os,
          device,
          country,
          city,
          visit_count,
          first_seen_at,
          last_seen_at
        )
      `,
        { count: 'exact' }
      );

    if (startDateIso) {
      logsQuery = logsQuery.gte('created_at', startDateIso);
    }
    if (pageFilter) {
      logsQuery = logsQuery.eq('page_path', pageFilter);
    }
    if (deviceFilter) {
      logsQuery = logsQuery.eq('visitors.device', deviceFilter);
    }
    if (search) {
      logsQuery = logsQuery.or(
        `page_path.ilike.%${search}%,referrer.ilike.%${search}%,visitor_id.ilike.%${search}%`
      );
    }

    logsQuery = logsQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: logRecords, count: totalLogsCount, error: logsError } = await logsQuery;
    if (logsError) {
      console.error('Error fetching logs:', logsError);
    }

    // Format logs for response (masking sensitive visitor ids for clean presentation)
    const formattedLogs = (logRecords || []).map((row) => {
      const v = row.visitors || {};
      const rawVid = row.visitor_id || 'unknown';
      const maskedVid = rawVid.length > 10 ? `${rawVid.slice(0, 6)}...${rawVid.slice(-4)}` : rawVid;

      return {
        id: row.id,
        visitorId: rawVid,
        maskedVisitorId: maskedVid,
        pagePath: row.page_path,
        referrer: row.referrer || 'Direct',
        timestamp: row.created_at,
        browser: v.browser || 'Unavailable',
        os: v.os || 'Unavailable',
        device: v.device || 'Desktop',
        location:
          v.country && v.country !== 'Unavailable'
            ? v.city && v.city !== 'Unavailable'
              ? `${v.city}, ${v.country}`
              : v.country
            : 'Unavailable',
        visitCount: v.visit_count || 1,
        firstSeen: v.first_seen_at,
        lastSeen: v.last_seen_at,
      };
    });

    // 7. Consented Contacts (Voluntary submissions)
    const { data: contacts } = await supabase
      .from('consented_contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    return res.status(200).json({
      success: true,
      user: { email: authCheck.user.email },
      summary: {
        totalViews: totalViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        returningVisitors: returningVisitors || 0,
        viewsToday: viewsToday || 0,
        views7d: views7d || 0,
        views30d: views30d || 0,
        activeVisitors: activeSessions || 0,
      },
      mostViewedPages,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      dailyTrends,
      logs: formattedLogs,
      pagination: {
        page: pageNum,
        limit,
        totalRecords: totalLogsCount || 0,
        totalPages: Math.ceil((totalLogsCount || 0) / limit),
      },
      contacts: contacts || [],
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    return res.status(500).json({ error: 'Failed to generate analytics data' });
  }
}
