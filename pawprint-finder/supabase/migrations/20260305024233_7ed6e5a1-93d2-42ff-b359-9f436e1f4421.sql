
-- Allow owners to delete their own mascotas
CREATE POLICY "Allow owner delete on mascotas"
ON public.mascotas
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Restrict insert to own mascotas
DROP POLICY IF EXISTS "Allow authenticated insert on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner insert on mascotas"
ON public.mascotas
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Restrict update to own mascotas
DROP POLICY IF EXISTS "Allow authenticated update on mascotas" ON public.mascotas;
CREATE POLICY "Allow owner update on mascotas"
ON public.mascotas
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

-- Create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
