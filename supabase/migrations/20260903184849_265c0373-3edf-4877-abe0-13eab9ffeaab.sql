-- Restrict profiles: only the owner can read their full row (incl. email).
DROP POLICY IF EXISTS "Authenticated can read profiles" ON public.profiles;

CREATE POLICY "Users read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Public-safe view for community features: no email exposed.
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = off) AS
SELECT id, username, display_name, show_username, created_at
FROM public.profiles;

REVOKE ALL ON public.public_profiles FROM PUBLIC;
GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT ALL ON public.public_profiles TO service_role;