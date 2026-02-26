
-- Tighten write policies to service_role only
DROP POLICY "Service role can insert cache" ON public.api_cache;
DROP POLICY "Service role can update cache" ON public.api_cache;
DROP POLICY "Service role can delete cache" ON public.api_cache;

CREATE POLICY "Service role can insert cache" ON public.api_cache 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update cache" ON public.api_cache 
  FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete cache" ON public.api_cache 
  FOR DELETE USING (auth.role() = 'service_role');
