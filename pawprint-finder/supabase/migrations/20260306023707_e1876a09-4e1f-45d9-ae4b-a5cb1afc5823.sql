-- Revert mascotas_public to SECURITY DEFINER behavior (keeps public QR reads through safe projected columns)
ALTER VIEW public.mascotas_public
SET (security_invoker = false, security_barrier = true);

-- Remove broad anonymous SELECT policy on base table to avoid any direct exposure of sensitive owner contact data
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;

-- Restore standard table select privilege for anon (RLS still blocks base-table reads without a matching policy)
GRANT SELECT ON TABLE public.mascotas TO anon;