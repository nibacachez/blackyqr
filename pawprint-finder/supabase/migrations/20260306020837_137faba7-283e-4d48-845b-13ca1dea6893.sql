CREATE OR REPLACE FUNCTION public.get_decrypted_owner_contact(mascota_id uuid, passphrase text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  cipher bytea;
  result jsonb;
  is_owner boolean;
BEGIN
  -- Check the caller owns this pet
  SELECT (owner_id = auth.uid()) INTO is_owner FROM mascotas WHERE id = mascota_id;
  
  IF is_owner IS NULL THEN
    RETURN NULL; -- pet not found
  END IF;

  IF NOT is_owner THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  SELECT owner_contact_encrypted::bytea INTO cipher FROM mascotas WHERE id = mascota_id;
  IF cipher IS NULL THEN
    RETURN NULL;
  END IF;

  result := decrypt_owner_contact(cipher, passphrase);
  RETURN result;
END;
$function$;