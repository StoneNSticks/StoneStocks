-- Add parent_id for threaded replies
ALTER TABLE stock_comments ADD COLUMN parent_id uuid REFERENCES stock_comments(id) ON DELETE CASCADE;

-- Add DELETE policy on stock_votes for vote toggle-off
CREATE POLICY "Users delete own votes" ON stock_votes FOR DELETE USING (auth.uid() = user_id);

-- Add privacy and notification settings to profiles
ALTER TABLE profiles ADD COLUMN show_username boolean NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN comment_reply_alerts boolean NOT NULL DEFAULT false;