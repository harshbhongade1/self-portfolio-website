import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase admin client with service_role key for secure backend operations
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Client for auth token verification using public anon key or service key
export function getSupabaseAuthClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Keyed HMAC-SHA256 for IP address hashing.
 * Never stores raw IP addresses in database or analytics responses.
 */
export function hashIp(ip) {
  if (!ip) return 'anonymous';
  const salt = process.env.IP_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'harsh-portfolio-salt-2025';
  return crypto.createHmac('sha256', salt).update(String(ip).trim()).digest('hex').substring(0, 24);
}

/**
 * Extract sanitized, categorized client info from User-Agent string.
 * Avoids invasive fingerprinting; strictly categorizes high-level environment.
 */
export function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase();

  // Device Category
  let device = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    device = 'Mobile';
  }

  // OS Category
  let os = 'Other';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';

  // Browser Category
  let browser = 'Other';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

  return { device, os, browser };
}

/**
 * Server-side authorization check for Admin endpoints.
 * Verifies Bearer JWT with Supabase Auth, and ensures user email matches ADMIN_EMAIL.
 */
export async function verifyAdminRequest(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, status: 401, error: 'Missing or malformed Authorization header' };
  }

  const token = authHeader.split(' ')[1];

  // Check if token is local admin token
  if (token && token.startsWith('loc_')) {
    const { verifyAdminToken } = await import('../admin/login.js');
    const payload = verifyAdminToken(token);
    if (payload) {
      return { authorized: true, user: { email: payload.email || 'HarshBhongade' } };
    }
    return { authorized: false, status: 401, error: 'Invalid or expired local admin session token' };
  }

  const authClient = getSupabaseAuthClient();
  if (!authClient) {
    return { authorized: false, status: 503, error: 'Database service is unconfigured' };
  }

  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user) {
    return { authorized: false, status: 401, error: 'Invalid or expired session token' };
  }

  // Check against authorized administrator email
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const userEmail = (user.email || '').toLowerCase().trim();

  // If ADMIN_EMAIL is set, enforce strict match
  if (configuredAdminEmail && userEmail !== configuredAdminEmail) {
    return {
      authorized: false,
      status: 403,
      error: `Access Denied: Account '${userEmail}' is not designated as an administrator.`,
    };
  }

  return { authorized: true, user };
}

/**
 * Safely parse request body across Vercel serverless and local Node/Vite environments.
 */
export async function parseRequestBody(req) {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}
