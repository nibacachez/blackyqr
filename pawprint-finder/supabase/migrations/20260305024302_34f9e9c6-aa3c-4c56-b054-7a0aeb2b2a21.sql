
-- Fix function search paths
ALTER FUNCTION public.cleanup_rescate_reports() SET search_path = public;
ALTER FUNCTION public.update_mascotas_updated_at() SET search_path = public;
