-- ============================================
-- CREATE/UPDATE ADMIN USER
-- Execute this in Supabase SQL Editor AFTER creating the user in Auth
-- ============================================

-- Step 1: Ensure profiles table exists with role column
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Update the admin user role
-- Replace 'ADMIN_USER_ID' with the actual UUID of the admin user from auth.users
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'n.ibacache.z@gmail.com';

-- Step 3: If the user doesn't exist yet, you can manually insert after creating in Auth:
-- INSERT INTO public.profiles (id, email, role)
-- VALUES ('ADMIN_USER_ID', 'n.ibacache.z@gmail.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Step 4: Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
CREATE POLICY "Admin can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- SUCCESS
-- Run the following query to verify:
-- SELECT id, email, role FROM public.profiles WHERE email = 'n.ibacache.z@gmail.com';
