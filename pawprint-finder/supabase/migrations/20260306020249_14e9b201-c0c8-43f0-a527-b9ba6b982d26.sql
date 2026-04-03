-- Drop the overly permissive public SELECT policy on the base table
DROP POLICY "Allow public read on mascotas" ON public.mascotas;

-- Owners can read their own full rows (including owner_contact_encrypted)
CREATE POLICY "Allow owner select on mascotas"
ON public.mascotas
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

-- Create a public view that excludes owner PII (security_barrier prevents optimization leaks)
-- Regular view (not security_invoker) runs as the view owner, bypassing RLS on the base table
CREATE VIEW public.mascotas_public
WITH (security_barrier = true) AS
  SELECT id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, created_at, updated_at
  FROM public.mascotas;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.mascotas_public TO anon, authenticated;