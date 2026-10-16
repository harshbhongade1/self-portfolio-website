import crypto from 'crypto';
import { getSupabaseAuthClient, parseRequestBody } from '../_lib/supabase.js';

export function createAdminToken(user) {
  const secret = process.env.IP_SALT || process.env.ADMIN_PASSWORD_HASH || 'harsh-portfolio-salt-2025';
  const payload = {
    sub: user.username || user.email || 'HarshBhongade',
    email: user.email || 'HarshBhongade',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  return `loc_${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || !token.startsWith('loc_')) return null;
  const parts = token.slice(4).split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const secret = process.env.IP_SALT || process.env.ADMIN_PASSWORD_HASH || 'harsh-portfolio-salt-2025';
  const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

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
    const { identifier = '', password = '' } = body;
    const cleanId = String(identifier).trim();
    const cleanPw = String(password).trim();

    if (!cleanId || !cleanPw) {
      return res.status(400).json({ error: 'Username/Email and Password are required.' });
    }

    // 1. Check configured administrator credentials (username: HarshBhongade / password: Harsh@1912)
    const adminUser = (process.env.ADMIN_USERNAME || 'HarshBhongade').toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'harshbhongade@portfolio.local').toLowerCase();
    const secret = process.env.IP_SALT || 'harsh-portfolio-salt-2025';
    const computedHash = crypto.createHmac('sha256', secret).update(cleanPw).digest('hex');
    const expectedHash = process.env.ADMIN_PASSWORD_HASH || '4a1a8f44a29b39a362118e81c4ab31245b6af4c986abed846d656a4f0c047478';

    const idMatches = cleanId.toLowerCase() === adminUser || cleanId.toLowerCase() === adminEmail || cleanId.toLowerCase() === 'harshbhongade';
    const pwMatches = computedHash === expectedHash || cleanPw === 'Harsh@1912';

    if (idMatches && pwMatches) {
      const token = createAdminToken({ username: 'HarshBhongade', email: 'HarshBhongade' });
      return res.status(200).json({
        success: true,
        session: {
          access_token: token,
          user: {
            email: 'HarshBhongade',
            user_metadata: { name: 'Harsh Bhongade', role: 'Administrator' },
          },
        },
      });
    }

    // 2. Fallback to Supabase Auth if cloud credentials configured
    const authClient = getSupabaseAuthClient();
    if (authClient) {
      const { data, error } = await authClient.auth.signInWithPassword({
        email: cleanId,
        password: cleanPw,
      });

      if (!error && data?.session) {
        return res.status(200).json({
          success: true,
          session: data.session,
        });
      }
    }

    return res.status(401).json({
      error: 'Invalid username or password. Please verify your administrator credentials.',
    });
  } catch (err) {
    console.error('Login handler error:', err);
    return res.status(500).json({ error: 'Authentication service encountered an error' });
  }
}
