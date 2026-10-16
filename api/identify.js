import { getSupabaseAdmin, parseRequestBody } from './_lib/supabase.js';

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
    const { visitorId, name, email, message = '' } = body;

    // Strict input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      const { localStore } = await import('./_lib/localStore.js');
      const contact = localStore.addContact({
        visitorId,
        name: name.trim().slice(0, 100),
        email: email.trim().slice(0, 120),
        message: message.trim().slice(0, 500),
      });
      return res.status(200).json({
        success: true,
        message: 'Thank you for connecting! Your details have been stored securely.',
        id: contact.id,
      });
    }
    const { data, error } = await supabase.from('consented_contacts').insert({
      visitor_id: visitorId || null,
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 120),
      message: message.trim().slice(0, 500),
      created_at: new Date().toISOString(),
    }).select('id').single();

    if (error) {
      console.error('Error recording voluntary contact:', error);
      return res.status(500).json({ error: 'Failed to save contact details' });
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for connecting! Your details have been stored securely.',
      id: data.id,
    });
  } catch (err) {
    console.error('Error in identify handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
