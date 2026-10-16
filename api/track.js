import { parseUserAgent, parseRequestBody } from './_lib/supabase.js';
import { storage } from './_lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseRequestBody(req);
    const { pagePath = '/', referrer = '', isHeartbeat = false } = body;

    // Capture visitor IP address from Vercel / proxy headers
    let rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    if (rawIp.startsWith('::ffff:')) {
      rawIp = rawIp.replace('::ffff:', '');
    } else if (rawIp === '::1') {
      rawIp = '127.0.0.1';
    }

    // Geolocation from Vercel edge headers
    const country = req.headers['x-vercel-ip-country'] || 'India';
    const city = req.headers['x-vercel-ip-city'] || (rawIp === '127.0.0.1' ? 'Localhost' : 'Nagpur');

    // Parse User-Agent
    const uaString = req.headers['user-agent'] || '';
    const { device, os, browser } = parseUserAgent(uaString);

    let referrerDomain = 'Direct';
    if (referrer) {
      try {
        const parsedUrl = new URL(referrer);
        referrerDomain = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        referrerDomain = 'Other';
      }
    }

    const stats = await storage.recordVisit({
      ip: rawIp,
      page: pagePath,
      referrer: referrerDomain,
      browser,
      os,
      device,
      city,
      country,
      isHeartbeat,
    });

    return res.status(200).json({
      success: true,
      ip: rawIp,
      stats,
    });
  } catch (err) {
    console.error('Error tracking visit:', err);
    return res.status(500).json({ error: 'Failed to record visit' });
  }
}
