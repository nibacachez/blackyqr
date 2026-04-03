# 🔧 DEBUG: Admin Dashboard muestra 0 mascotas

## Problema Reportado
Admin inicia sesión, se redirige a `/admin-dashboard`, pero el panel muestra 0 mascotas aunque hay mascotas registradas en Supabase.

---

## ✅ CHECKLIST DE SOLUCIÓN

### 1️⃣ Verificar que la tabla `profiles` tenga columna `role`

```sql
-- Ejecuta en Supabase SQL Editor:
DESCRIBE public.profiles;
-- O
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'profiles';
```

**Debería mostrar una columna `role` con tipo VARCHAR o similar**

Si NO existe, ejecuta:
```sql
ALTER TABLE public.profiles ADD COLUMN role VARCHAR(50) DEFAULT 'user';
```

---

### 2️⃣ Verificar que RLS esté habilitado en `mascotas`

```sql
-- Ejecuta en Supabase SQL Editor:
ALTER TABLE public.mascotas ENABLE ROW LEVEL SECURITY;
```

---

### 3️⃣ Limpiar y recrear todas las políticas RLS

**⚠️ IMPORTANTE: Ejecuta EXACTAMENTE este script completo:**

```sql
-- DROP ALL POLICIES FIRST
DROP POLICY IF EXISTS "admin_read_all_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "admin_select_all_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner read on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "owner_select_own_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner insert on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "owner_insert_own_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner update on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "owner_admin_update_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner delete on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "owner_admin_delete_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "anon_read_mascotas_public" ON public.mascotas;

-- NOW CREATE NEW POLICIES
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

-- Verify RLS is enabled
ALTER TABLE public.mascotas ENABLE ROW LEVEL SECURITY;
```

---

### 4️⃣ Verificar que tu usuario sea admin

```sql
-- Ver TODOS los usuarios y sus roles:
SELECT id, email, role FROM profiles;

-- Si tu usuario NO tiene role='admin', actualízalo:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tuEmail@admin.com';

-- Verifica que se actualizó:
SELECT id, email, role FROM profiles WHERE email = 'tuEmail@admin.com';
```

---

### 5️⃣ Verificar que haya mascotas en la tabla

```sql
-- Ver cuántas mascotas hay:
SELECT COUNT(*) as total_mascotas FROM public.mascotas;

-- Ver las mascotas:
SELECT id, nombre, owner_id FROM public.mascotas LIMIT 10;

-- Si no hay mascotas:
-- - Registra una mascota desde la app primero
-- - O inserta una de prueba:
INSERT INTO public.mascotas (
  id, nombre, raza, caracteristicas, foto_url, owner_contact_encrypted, owner_id, qr_url
) VALUES (
  'test-pet-' || gen_random_uuid()::text,
  'Mascota de Prueba',
  'Labrador',
  '{"species":"Perro","color":"Negro","description":"Test"}',
  'https://example.com/photo.jpg',
  '{"name":"Admin","phone":"1234567890"}',
  'USER_ID_AQUI',  -- Reemplaza con tu user ID
  'https://example.com/qr'
);
```

---

### 6️⃣ Verificar la Consola del Navegador

1. Abre tu app en el navegador
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**
4. Inicia sesión como admin
5. Busca mensajes como:
   - ✅ `Successfully fetched X pets for admin`
   - ❌ `Error loading pets: ...`
   - ❌ `RLS policy violation`

---

## 🧪 PRUEBA FINAL

Después de ejecutar todo:

1. **En el navegador:**
   - Abre DevTools (F12) → Console
   - Borra el localStorage: `localStorage.clear()`
   - Recarga la página
   - Inicia sesión como admin
   - Verifica que aparezca: `Successfully fetched X pets for admin`

2. **En la app:**
   - Deberías ver la tabla con todas las mascotas
   - Cada fila debería mostrar: nombre, propietario, teléfono, botones de QR y descarga

---

## 🚨 Si SIGUE sin funcionar

1. **Copia TODO en la consola del navegador (F12 → Console):**
   ```javascript
   console.log('User:', JSON.stringify({
     user: auth.user,
     role: auth.userRole,
     timestamp: new Date().toISOString()
   }, null, 2));
   ```

2. **Comparte:**
   - El mensaje completo de error de la Consola
   - El resultado de: `SELECT * FROM profiles WHERE email = 'tuEmail@admin.com';`
   - El resultado de: `SELECT COUNT(*) FROM public.mascotas;`

---

## 📝 Notas Importantes

- ✅ Las políticas RLS se aplican en **nivel de base de datos**
- ✅ El cliente de Supabase respeta automáticamente las políticas RLS
- ✅ Si un usuario NO cumple con la política RLS, la consulta retorna 0 filas (no error)
- ✅ Por eso el admin ve "0 mascotas" en lugar de un error

---

**Si todo funciona correctamente después de estos pasos, el problema estaba en la RLS no estar bien configurada. 🎉**
