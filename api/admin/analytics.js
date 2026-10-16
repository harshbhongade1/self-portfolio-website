import { verifyAdminRequest } from '../_lib/supabase.js';
import { storage } from '../_lib/storage.js';

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

  // 1. Verify administrator authentication
  const authCheck = await verifyAdminRequest(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status).json({ error: authCheck.error });
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const range = url.searchParams.get('range') || '30d';
    const search = url.searchParams.get('search') || '';
    const deviceFilter = url.searchParams.get('device') || '';
    const pageFilter = url.searchParams.get('pagePath') || '';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(url.searchParams.get('limit') || '15', 10)));

    const analytics = await storage.getAnalyticsData({
      range,
      search,
      deviceFilter,
      pageFilter,
      page: pageNum,
      limit,
    });

    return res.status(200).json({
      success: true,
      user: { email: authCheck.user.email || 'HarshBhongade' },
      ...analytics,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Failed to generate analytics' });
  }
}
