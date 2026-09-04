
CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.app_secrets TO service_role;
ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages app secrets" ON public.app_secrets;
CREATE POLICY "Service role manages app secrets"
  ON public.app_secrets FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Move the VAPID keypair out of the world-readable cache table.
INSERT INTO public.app_secrets (key, value)
SELECT 'vapid_keys', data FROM public.api_cache WHERE cache_key = 'vapid_keys'
ON CONFLICT (key) DO NOTHING;

DELETE FROM public.api_cache WHERE cache_key = 'vapid_keys';

-- Restore non-sensitive profile reads (email intentionally excluded).
GRANT SELECT (id, display_name, username, show_username, created_at, comment_reply_alerts)
  ON public.profiles TO authenticated;
GRANT SELECT (id, display_name, username, show_username)
  ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;

DROP POLICY IF EXISTS "Anyone can read public profile fields" ON public.profiles;
CREATE POLICY "Anyone can read public profile fields"
  ON public.profiles FOR SELECT TO anon
  USING (true);
