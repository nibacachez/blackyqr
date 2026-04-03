# 🔐 Instrucciones de Configuración - Sistema de Admin

## ✅ Lo que ya está hecho en el código:

1. **Dashboard de usuarios normales** (`/dashboard`)
   - ❌ QR completamente oculto (solo ven foto, nombre, descripción)
   - ❌ Botón de eliminar solo visible para propietario
   - ✅ Admins redirigidos automáticamente a `/admin-dashboard`

2. **Panel Admin** (`/admin-dashboard`)
   - ✅ Ver TODAS las mascotas de TODOS los usuarios
   - ✅ Ver datos del propietario (nombre, teléfono)
   - ✅ Ver y descargar códigos QR
   - ✅ Botón "Nueva mascota" para que el admin registre mascotas él mismo
   - ✅ Tabla con búsqueda avanzada

3. **Una sola cuenta admin**
   - ✅ Un usuario con `role = 'admin'` en tabla `profiles`
   - ✅ Puede ver todas las mascotas
   - ✅ Puede descargar todos los QRs
   - ✅ Puede registrar mascotas nuevas

---

## 📋 Pasos que DEBES hacer en Supabase

### **PASO IMPORTANTE - Ejecutar Migración SQL:**

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta TODO el siguiente script de una vez:

```sql
-- ============================================
-- COMPLETE ADMIN RLS FIX
-- Execute this in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure profiles table has role column with default
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Step 2: Drop all problematic policies
DROP POLICY IF EXISTS "admin_read_all_mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner read on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner insert on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner update on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "Allow owner delete on mascotas" ON public.mascotas;
DROP POLICY IF EXISTS "anon_read_public_mascotas" ON public.mascotas;

-- Step 3: Recreate policies with correct logic
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

-- Step 5: Verify RLS is enabled
ALTER TABLE public.mascotas ENABLE ROW LEVEL SECURITY;
```

✅ **Este script está en:** `supabase/migrations/20260306025000_fix_admin_rls_complete.sql`

### Paso 2: Establecer un usuario como admin

En **Supabase Dashboard** → **SQL Editor**, ejecuta:

```sql
-- Reemplaza 'admin@example.com' con el email real
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- Verifica que se actualizó correctamente
SELECT id, email, role FROM profiles WHERE role = 'admin';
```

### Paso 3: Verificar que la tabla profiles tenga la columna role

```sql
-- Ver la estructura de la tabla profiles
SELECT * FROM profiles LIMIT 1;
```

Si no existe la columna `role`, agrégala:

```sql
ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'user';
```

---

## 🧪 Prueba el Sistema

1. **Inicia sesión con usuario normal**
   - Ve a `/dashboard`
   - Deberías ver:
     ✅ Foto de mascota
     ✅ Nombre
     ✅ Descripción
     ❌ QR (completamente oculto)
   - Botón "Eliminar" visible

2. **Inicia sesión con usuario admin**
   - Deberías ser redirigido automáticamente a `/admin-dashboard`
   - Deberías ver:
     ✅ Tabla con TODAS las mascotas de TODOS los usuarios
     ✅ Datos del propietario (nombre, teléfono)
     ✅ Botones "Ver QR" y "Descargar"
     ✅ Botón "Nueva mascota" en el header

3. **Admin registra una mascota**
   - Haz clic en "Nueva mascota"
   - Completa el formulario
   - La mascota se registra con `owner_id = admin_user_id`

---

## 🔒 Seguridad

- ✅ Usuarios normales NUNCA ven QR digital en `/dashboard`
- ✅ Usuarios normales NUNCA ven datos de otros usuarios
- ✅ Admin ve TODAS las mascotas (para gestión)
- ✅ RLS de Supabase controla el acceso a nivel de base de datos
- ✅ Admin puede registrar mascotas también (como usuario normal)

---

## 📞 Datos que ve cada rol

### Usuario Normal
- Su foto de mascota
- Su nombre de mascota
- Su descripción
- Reporte de avistamientos
- ❌ QR digital
- ❌ Nombre del propietario (si ve mascota de otro)
- ❌ Teléfono del propietario

### Admin
- Foto de TODAS las mascotas
- Nombre de TODAS las mascotas
- ✅ QR digital de TODAS las mascotas (ver + descargar PNG)
- ✅ Nombre del propietario
- ✅ Teléfono del propietario
- Raza, color, descripción de todas

---

## ❓ Troubleshooting

### 🔴 PROBLEMA: Admin accede pero muestra 0 mascotas

**Causas comunes:**

1. **¿La migración SQL no fue ejecutada?**
   - ✅ Abre Supabase Dashboard → SQL Editor
   - ✅ Copia TODO el script de `supabase/migrations/20260306025000_fix_admin_rls_complete.sql`
   - ✅ Ejecuta el script completo
   - ✅ Verifica que no haya errores (pueden ignorarse los "DROP POLICY IF EXISTS")

2. **¿El usuario NO tiene role = 'admin'?**
   - ✅ En Supabase, ve a SQL Editor
   - ✅ Ejecuta: `SELECT id, email, role FROM profiles;`
   - ✅ Busca tu usuario en la lista
   - ✅ Si role es 'user' o NULL, ejecuta: `UPDATE profiles SET role = 'admin' WHERE email = 'tuEmail@admin.com';`

3. **¿Hay mascotas en la tabla?**
   - ✅ En Supabase, ve a SQL Editor
   - ✅ Ejecuta: `SELECT COUNT(*) as total FROM public.mascotas;`
   - ✅ Si el resultado es 0, registra una mascota primero desde la app

4. **¿Hay un error en la Consola del Navegador?**
   - ✅ Abre tu navegador → F12 (Developer Tools)
   - ✅ Ve a la pestaña "Console"
   - ✅ Busca mensajes de error rojo
   - ✅ Copia el error y comparte

---

### **PASOS PARA DEBUGGEAR:**

1. **Verifica que RLS esté habilitado:**
   ```sql
   SELECT relname, rowsecurity FROM pg_class WHERE relname = 'mascotas';
   -- Debería mostrar: rowsecurity = true
   ```

2. **Verifica las políticas RLS:**
   ```sql
   SELECT policyname, qual, with_check 
   FROM pg_policies 
   WHERE tablename = 'mascotas';
   ```

3. **Verifica tu rol de usuario:**
   ```sql
   SELECT id, email, role FROM profiles WHERE email = 'tuEmail@admin.com';
   ```

4. **Intenta una consulta como admin:**
   ```sql
   -- Simula una consulta como tu usuario admin
   SELECT * FROM mascotas LIMIT 5;
   -- Si sale error de RLS, significa que la política no está permitiendo el acceso
   ```

---

**Problema: Usuario normal sigue viendo QR**
- ❌ El caché del navegador (limpia cookies/localStorage)
- ✅ DevTools → Application → Clear Site Data
- ✅ Recarga la página

**Problema: Admin no puede registrar mascotas**
- ❌ Verifica que `owner_insert_own_mascotas` exista
- ✅ En SQL Editor, ejecuta el script de migración nuevamente

**Problema: Error "Error cargando las mascotas"**
- ✅ Abre la Consola (F12) y busca el mensaje completo de error
- ✅ Si dice "RLS", significa que la política no está bien
- ✅ Ejecuta el script de migración nuevamente

## 📁 Archivos modificados

- ✅ `src/components/PetCard.tsx` - QR solo si isOwner=true
- ✅ `src/pages/Dashboard.tsx` - isOwner={false}
- ✅ `src/pages/AdminDashboard.tsx` - Agregado botón "Nueva mascota"
- ✅ `src/hooks/useAuth.tsx` - Trae role desde profiles
- ✅ `src/pages/AuthPage.tsx` - Redirecciona según rol
- ✅ `supabase/migrations/20260306024000_add_admin_rls_policies.sql` - Políticas RLS

---

¡Sistema listo! 🎉
