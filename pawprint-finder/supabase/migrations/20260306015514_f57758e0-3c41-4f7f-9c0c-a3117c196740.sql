-- Add storage RLS policies for the mascotas bucket
-- Public read is intentional (rescue page is public), but restrict write operations

-- Only authenticated users can upload to their own folder
CREATE POLICY "Owners can upload pet photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mascotas'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only owners can update their own files
CREATE POLICY "Owners can update own pet photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mascotas'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only owners can delete their own files
CREATE POLICY "Owners can delete own pet photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'mascotas'
  AND (storage.foldername(name))[1] = auth.uid()::text
);