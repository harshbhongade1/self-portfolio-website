import { getSupabaseAdmin } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Response headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const { localStore } = await import('./_lib/localStore.js');
    return res.status(200).json({
      configured: true,
      stats: localStore.getStats(),
    });
  }

  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const [{ count: totalVisits }, { count: uniqueVisitors }, { count: activeSessions }] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('visitors').select('*', { count: 'exact', head: true }),
      supabase.from('active_sessions').select('*', { count: 'exact', head: true }).gte('last_active_at', fiveMinutesAgo),
    ]);

    return res.status(200).json({
      configured: true,
      stats: {
        totalVisits: totalVisits || 0,
        uniqueVisitors: uniqueVisitors || 0,
        activeVisitors: activeSessions || 0,
      },
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}
