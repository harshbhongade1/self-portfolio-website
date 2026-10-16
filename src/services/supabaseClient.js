import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your_supabase_anon_public_key'
  );
};

// Client-side Supabase instance (only uses public anon key, never service_role key)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const ADMIN_STORAGE_KEY = 'hb_admin_session';

// Auth helper utilities
export async function adminSignIn(identifier, password) {
  // First attempt authentication via backend /api/admin/login
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: identifier.trim(), password }),
    });

    const data = await res.json();
    if (res.ok && data.session) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data.session));
      return data;
    }

    if (data.error && !supabase) {
      throw new Error(data.error);
    }
  } catch (err) {
    if (!supabase) throw err;
  }

  // Fallback to direct client Supabase sign-in if available
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    if (data?.session) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data.session));
      return data;
    }
  }

  throw new Error('Authentication failed. Please verify your credentials.');
}

export async function adminSignOut() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out of Supabase:', err);
    }
  }
}

export async function getAdminSession() {
  // Check local session store first
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.access_token) {
        return parsed;
      }
    }
  } catch {
    // ignore parse error
  }

  if (!supabase) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session;
  } catch {
    return null;
  }
}
