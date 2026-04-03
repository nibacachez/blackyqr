
-- Drop the broken RESTRICTIVE policies on ubicaciones
DROP POLICY IF EXISTS "ubicaciones_write_admin" ON ubicaciones;
DROP POLICY IF EXISTS "ubicaciones_select_authenticated" ON ubicaciones;

-- Create proper PERMISSIVE policies
-- Authenticated users can read locations for their own pets
CREATE POLICY "ubicaciones_select_own_pets"
  ON ubicaciones FOR SELECT
  TO authenticated
  USING (
    mascota_id IN (SELECT id FROM mascotas WHERE owner_id = auth.uid())
  );

-- Authenticated users can insert locations for their own pets
CREATE POLICY "ubicaciones_insert_own_pets"
  ON ubicaciones FOR INSERT
  TO authenticated
  WITH CHECK (
    mascota_id IN (SELECT id FROM mascotas WHERE owner_id = auth.uid())
  );
