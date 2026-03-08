-- Add note and group_name columns to watchlist table
ALTER TABLE public.watchlist ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE public.watchlist ADD COLUMN IF NOT EXISTS group_name text;

-- Allow users to update their own watchlist entries (for notes/groups)
CREATE POLICY "Users update own watchlist" ON public.watchlist FOR UPDATE USING (auth.uid() = user_id);