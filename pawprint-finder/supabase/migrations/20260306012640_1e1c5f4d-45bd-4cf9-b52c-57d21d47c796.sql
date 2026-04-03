
DROP POLICY IF EXISTS "Allow own update on profiles" ON profiles;

CREATE POLICY "Allow own update on profiles"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
