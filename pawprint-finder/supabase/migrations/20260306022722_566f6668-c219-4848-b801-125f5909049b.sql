-- Drop the overly permissive SELECT policy on rescate_reports
DROP POLICY "Allow authenticated read on rescate_reports" ON public.rescate_reports;

-- Only pet owners can read reports for their pets
CREATE POLICY "owners_read_own_pet_reports"
ON public.rescate_reports
FOR SELECT
TO authenticated
USING (
  mascota_id IN (
    SELECT id FROM public.mascotas WHERE owner_id = auth.uid()
  )
);