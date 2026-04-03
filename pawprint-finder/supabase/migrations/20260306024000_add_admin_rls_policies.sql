-- Allow admin users to read all mascotas with full details
-- This allows admins to download QR codes and see owner contact information
DROP POLICY IF EXISTS "admin_read_all_mascotas" ON public.mascotas;
CREATE POLICY "admin_read_all_mascotas"
  ON public.mascotas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Keep existing owner read policy (owners can read their own mascotas)
DROP POLICY IF EXISTS "Allow owner read on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner read on mascotas"
  ON public.mascotas
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Restrict insert to own mascotas (users can only register their own pets)
DROP POLICY IF EXISTS "Allow owner insert on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner insert on mascotas"
  ON public.mascotas
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Restrict update to own mascotas (only admin or owner can update)
DROP POLICY IF EXISTS "Allow owner update on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner update on mascotas"
  ON public.mascotas
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow delete for owner or admin
DROP POLICY IF EXISTS "Allow owner delete on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner delete on mascotas"
  ON public.mascotas
  FOR DELETE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ensure public/anonymous users can still read through mascotas_public view
-- (this remains unchanged, uses public view without sensitive data)
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;
CREATE POLICY "anon_read_public_mascotas"
  ON public.mascotas
  FOR SELECT
  TO anon
  USING (true);

-- Revoke all anon access to base table, grant only safe columns
REVOKE SELECT ON TABLE public.mascotas FROM anon;
GRANT SELECT (id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, created_at, updated_at)
  ON TABLE public.mascotas
  TO anon;
