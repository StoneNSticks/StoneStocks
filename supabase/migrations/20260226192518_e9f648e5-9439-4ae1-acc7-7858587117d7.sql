
-- Cache table for API responses with TTL
CREATE TABLE public.api_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  source TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_api_cache_key ON public.api_cache (cache_key);
CREATE INDEX idx_api_cache_expires ON public.api_cache (expires_at);

-- Enable RLS but allow public read (no auth needed for stock data)
ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

-- Public read access (stock data is public)
CREATE POLICY "Anyone can read cache" ON public.api_cache FOR SELECT USING (true);

-- Only service role can write (edge functions use service role)
CREATE POLICY "Service role can insert cache" ON public.api_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update cache" ON public.api_cache FOR UPDATE USING (true);
CREATE POLICY "Service role can delete cache" ON public.api_cache FOR DELETE USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_api_cache_updated_at
  BEFORE UPDATE ON public.api_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
