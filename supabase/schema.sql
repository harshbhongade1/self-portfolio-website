-- ==============================================================================
-- HARSH BHONGADE PORTFOLIO - DATABASE SCHEMA & SECURITY POLICIES
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Create schema tables

-- Visitors table: stores privacy-conscious anonymous visitor profiles
CREATE TABLE IF NOT EXISTS public.visitors (
  visitor_id TEXT PRIMARY KEY,
  ip_hash TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visit_count INT NOT NULL DEFAULT 1,
  browser TEXT DEFAULT 'Unknown',
  os TEXT DEFAULT 'Unknown',
  device TEXT DEFAULT 'desktop',
  country TEXT DEFAULT 'Unavailable',
  city TEXT DEFAULT 'Unavailable',
  referrer_domain TEXT DEFAULT 'Direct'
);

-- Page views table: records discrete page visit events
CREATE TABLE IF NOT EXISTS public.page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES public.visitors(visitor_id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active sessions table: tracks current active visitors with heartbeat timeout
CREATE TABLE IF NOT EXISTS public.active_sessions (
  session_id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consented contacts table: optional voluntary identification by visitors
CREATE TABLE IF NOT EXISTS public.consented_contacts (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT REFERENCES public.visitors(visitor_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Performance indexes for analytics aggregation
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_active ON public.active_sessions(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON public.visitors(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_ip_hash ON public.visitors(ip_hash);
CREATE INDEX IF NOT EXISTS idx_consented_contacts_created_at ON public.consented_contacts(created_at DESC);

-- 3. Row Level Security (RLS) Configuration
-- We enable RLS on all tables to ensure strict authorization.
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consented_contacts ENABLE ROW LEVEL SECURITY;

-- Anonymous public clients must NEVER have arbitrary SELECT or DELETE access to analytics!
-- The serverless API functions run with the service_role key to safely record visits
-- and admin endpoints authenticate using Supabase Auth JWT before reading data.

-- Authenticated Admin Policies (for direct Supabase client access if authenticated as admin):
CREATE POLICY "Admins have full access to visitors"
  ON public.visitors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to page_views"
  ON public.page_views
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to active_sessions"
  ON public.active_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to consented_contacts"
  ON public.consented_contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Automatic Maintenance Function: Purge old logs according to retention period
CREATE OR REPLACE FUNCTION public.purge_analytics_logs(days_to_keep INT DEFAULT 90)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_views_count BIGINT;
  deleted_sessions_count BIGINT;
BEGIN
  -- Delete page views older than retention period
  DELETE FROM public.page_views
  WHERE created_at < (now() - (days_to_keep || ' days')::INTERVAL);
  GET DIAGNOSTICS deleted_views_count = ROW_COUNT;

  -- Delete inactive sessions older than 1 day
  DELETE FROM public.active_sessions
  WHERE last_active_at < (now() - INTERVAL '1 day');
  GET DIAGNOSTICS deleted_sessions_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'status', 'success',
    'deleted_page_views', deleted_views_count,
    'deleted_stale_sessions', deleted_sessions_count,
    'retention_days', days_to_keep
  );
END;
$$;
