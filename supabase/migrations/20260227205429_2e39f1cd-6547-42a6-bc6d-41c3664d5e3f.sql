
-- Add username and email columns
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Backfill existing profiles with email from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id;

-- Update trigger function to store username + email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Drop the restrictive SELECT policy and replace with open one for username lookup
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);
