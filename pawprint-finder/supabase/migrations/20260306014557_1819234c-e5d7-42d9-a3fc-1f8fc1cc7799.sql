-- Rate limit function: max 10 reports per pet per hour
CREATE OR REPLACE FUNCTION public.check_rescue_report_rate_limit(pet_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 10
  FROM rescate_reports
  WHERE mascota_id = pet_id
    AND created_at > now() - interval '1 hour';
$$;

-- Drop old permissive INSERT policy
DROP POLICY IF EXISTS "Allow anon insert on rescate_reports" ON rescate_reports;

-- Create new INSERT policy with rate limiting
CREATE POLICY "Allow rate limited anon insert on rescate_reports"
ON rescate_reports
FOR INSERT
TO anon, authenticated
WITH CHECK (
  check_rescue_report_rate_limit(mascota_id)
);