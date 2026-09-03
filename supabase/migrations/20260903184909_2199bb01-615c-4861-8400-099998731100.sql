DROP VIEW IF EXISTS public.public_profiles;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;

-- Community features need to resolve other users' display names.
CREATE POLICY "Authenticated can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Column-level privileges: the email column is never readable through the API.
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, username, display_name, show_username, comment_reply_alerts, created_at)
  ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;