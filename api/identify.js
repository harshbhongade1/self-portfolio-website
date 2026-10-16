import { parseRequestBody } from './_lib/supabase.js';
import { storage } from './_lib/storage.js';

export default async function handler(req, res) {
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
    const { name, email, message = '' } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    const contact = await storage.addContact({
      ip,
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 120),
      message: message.trim().slice(0, 500),
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for connecting! Your details have been stored securely.',
      id: contact.id,
    });
  } catch (err) {
    console.error('Identify error:', err);
    return res.status(500).json({ error: 'Failed to record contact' });
  }
}
