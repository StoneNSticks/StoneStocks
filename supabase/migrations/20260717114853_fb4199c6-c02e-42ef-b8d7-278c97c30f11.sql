
-- Restrict profiles SELECT to authenticated users (removes public email exposure)
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
CREATE POLICY "Authenticated can read profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

-- Lock down SECURITY DEFINER functions so they are not callable via the Data API
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
