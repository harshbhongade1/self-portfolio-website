import { getSupabaseAdmin, verifyAdminRequest, parseRequestBody } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authCheck = await verifyAdminRequest(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status).json({ error: authCheck.error });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const { localStore } = await import('../_lib/localStore.js');
    const body = await parseRequestBody(req);
    const result = localStore.purge(body);
    return res.status(200).json(result);
  }

  try {
    const body = await parseRequestBody(req);
    const { action = 'retention_cleanup', days = 30 } = body;

    if (action === 'retention_cleanup') {
      const retentionDays = Math.max(1, parseInt(days, 10));
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

      const { error: viewsErr } = await supabase
        .from('page_views')
        .delete()
        .lt('created_at', cutoffDate);

      const { error: sessionsErr } = await supabase
        .from('active_sessions')
        .delete()
        .lt('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (viewsErr || sessionsErr) {
        return res.status(500).json({ error: 'Failed to complete retention cleanup' });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully pruned activity logs older than ${retentionDays} days.`,
      });
    }

    if (action === 'purge_all') {
      // Purge all analytics records
      await supabase.from('page_views').delete().neq('id', 0);
      await supabase.from('active_sessions').delete().neq('session_id', '');
      await supabase.from('visitors').delete().neq('visitor_id', '');

      return res.status(200).json({
        success: true,
        message: 'All analytics records and visitor logs have been purged.',
      });
    }

    return res.status(400).json({ error: 'Invalid purge action specified' });
  } catch (err) {
    console.error('Purge operation error:', err);
    return res.status(500).json({ error: 'Internal server error executing purge' });
  }
}
