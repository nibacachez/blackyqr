-- Drop the overly permissive profiles SELECT policy
DROP POLICY "Allow authenticated read on profiles" ON public.profiles;

-- Users can only read their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());