-- Recreate public view as security invoker to avoid SECURITY DEFINER behavior
CREATE OR REPLACE VIEW public.mascotas_public
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  m.id,
  m.nombre,
  m.raza,
  m.caracteristicas,
  m.foto_url,
  m.qr_url,
  m.owner_id,
  m.created_at,
  m.updated_at
FROM public.mascotas m;

-- Allow anonymous users to read pet rows (needed by security_invoker view),
-- while still protecting owner contact via column-level privileges.
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;
CREATE POLICY "anon_read_public_mascotas"
ON public.mascotas
FOR SELECT
TO anon
USING (true);

-- Remove broad anon table select and grant only safe columns
REVOKE SELECT ON TABLE public.mascotas FROM anon;
GRANT SELECT (id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, created_at, updated_at)
ON TABLE public.mascotas
TO anon;