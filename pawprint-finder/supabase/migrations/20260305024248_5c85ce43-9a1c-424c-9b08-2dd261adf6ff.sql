
-- Fix profiles RLS: restrict insert/update to own profile
DROP POLICY IF EXISTS "Allow authenticated insert on profiles" ON public.profiles;
CREATE POLICY "Allow own insert on profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Allow authenticated update on profiles" ON public.profiles;
CREATE POLICY "Allow own update on profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- Fix rescate_reports insert policy to be truly public (anon can insert)
DROP POLICY IF EXISTS "Allow public insert on rescate_reports" ON public.rescate_reports;
CREATE POLICY "Allow anon insert on rescate_reports"
ON public.rescate_reports
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
