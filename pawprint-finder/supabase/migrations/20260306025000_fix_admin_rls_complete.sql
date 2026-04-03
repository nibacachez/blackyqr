-- ============================================
-- COMPLETE ADMIN RLS FIX
-- Execute this in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure profiles table has role column with default
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Step 2: Drop all problematic policies
DROP POLICY IF EXISTS "admin_read_all_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner read on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner insert on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner update on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner delete on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;

-- Step 3: Recreate policies with correct logic
-- Policy 1: ADMIN can read ALL mascotas
CREATE POLICY "admin_select_all_mascotas"
  ON public.mascotas
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policy 2: OWNER can read their own mascotas
CREATE POLICY "owner_select_own_mascotas"
  ON public.mascotas
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
  );

-- Policy 3: OWNER can insert their own mascotas
CREATE POLICY "owner_insert_own_mascotas"
  ON public.mascotas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
  );

-- Policy 4: OWNER or ADMIN can update
CREATE POLICY "owner_admin_update_mascotas"
  ON public.mascotas
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policy 5: OWNER or ADMIN can delete
CREATE POLICY "owner_admin_delete_mascotas"
  ON public.mascotas
  FOR DELETE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Policy 6: Anonymous can read through public view
CREATE POLICY "anon_read_mascotas_public"
  ON public.mascotas
  FOR SELECT
  TO anon
  USING (true);

-- Step 4: Ensure proper grants
REVOKE ALL ON TABLE public.mascotas FROM anon;
GRANT SELECT (id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, created_at, updated_at)
  ON TABLE public.mascotas
  TO anon;

-- Step 5: Verify RLS is enabled
ALTER TABLE public.mascotas ENABLE ROW LEVEL SECURITY;

-- SUCCESS - Run the following to verify the setup:
-- SELECT * FROM public.profiles WHERE role = 'admin';
