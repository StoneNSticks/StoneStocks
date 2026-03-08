
CREATE TABLE public.portfolio_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  shares numeric NOT NULL DEFAULT 0,
  avg_cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own positions" ON public.portfolio_positions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own positions" ON public.portfolio_positions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own positions" ON public.portfolio_positions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own positions" ON public.portfolio_positions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_portfolio_positions_updated_at
  BEFORE UPDATE ON public.portfolio_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
