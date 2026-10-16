import { verifyAdminRequest, parseRequestBody } from '../_lib/supabase.js';
import { storage } from '../_lib/storage.js';

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

  try {
    const body = await parseRequestBody(req);
    const result = storage.purge(body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Purge error:', err);
    return res.status(500).json({ error: 'Failed to execute purge' });
  }
}
