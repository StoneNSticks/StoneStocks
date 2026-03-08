
-- Push subscription storage for Web Push API
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own subscriptions" ON public.push_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subscriptions" ON public.push_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own subscriptions" ON public.push_subscriptions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Service role can read all subscriptions for sending notifications
CREATE POLICY "Service role reads all subscriptions" ON public.push_subscriptions
  FOR SELECT TO service_role
  USING (true);

-- Track sent earnings notifications to avoid duplicates
CREATE TABLE public.earnings_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  symbol text NOT NULL,
  earnings_date date NOT NULL,
  notified_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol, earnings_date)
);

ALTER TABLE public.earnings_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.earnings_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages notifications" ON public.earnings_notifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
