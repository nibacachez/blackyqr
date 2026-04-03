# Guía Completa de Configuración - Pawprint Finder

## 1. CONFIGURACIÓN DE SUPABASE

### 1.1 Crear Tabla de Perfiles

Ejecuta el SQL en la Consola SQL de Supabase (Supabase Dashboard → SQL Editor):

```sql
-- Crear tabla profiles
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin
      WHERE admin.id = auth.uid() AND admin.role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin
      WHERE admin.id = auth.uid() AND admin.role = 'admin'
    )
  );

-- Función trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.2 Configurar Google OAuth en Supabase

1. Ve a Supabase Dashboard → Authentication → Providers
2. Busca "Google" y haz clic en "Enable"
3. Necesitarás obtener credentials de Google Cloud:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto (o usa uno existente)
   - Ve a "APIs & Services" → "Credentials"
   - Crea "OAuth 2.0 Client ID" (tipo: Web application)
   - URIs autorizados:
     - `http://localhost:3000/auth/callback` (desarrollo)
     - `https://tudominio.com/auth/callback` (producción)
   - Copia Client ID y Client Secret
4. Pega en Supabase → Google provider
5. Guarda los cambios

### 1.3 Desactivar Verificación de Email (DESARROLLO SOLAMENTE)

⚠️ **SOLO PARA DESARROLLO LOCAL**

1. Ve a Supabase Dashboard → Authentication → Providers → Email
2. Desactiva "Confirm email"
3. En producción, **ACTÍVALO NUEVAMENTE**

### 1.4 Crear Usuario Administrador

En Supabase Dashboard → SQL Editor, ejecuta:

```sql
INSERT INTO public.profiles (id, email, role)
VALUES (
  gen_random_uuid(),
  'n.ibacache.z@gmail.com',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```

Luego:
1. Ve a Authentication → Users
2. Crea manualmente un usuario con email "n.ibacache.z@gmail.com"
3. Usa una contraseña temporal y actualízala después

---

## 2. VARIABLES DE ENTORNO

Crear archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Obtener valores:
1. Ve a Supabase Dashboard → Project Settings → API
2. Copia URL y Anon Key
3. Pégalos en `.env.local`

---

## 3. FLUJO DE AUTENTICACIÓN

### Login con Google
1. Usuario hace clic en "Continuar con Google"
2. Redirige a Google OAuth
3. Google redirige a `/auth/callback`
4. Sistema crea perfil automáticamente con rol = 'user'
5. Redirige a `/dashboard` (o página principal)

### Login con Email/Password
1. Usuario ingresa email y contraseña
2. Sistema verifica credenciales
3. Si es nuevo usuario y verificación está desactivada, se crea perfil automáticamente
4. Acceso inmediato al dashboard

### Admin Panel
- URL: `/admin`
- **Solo accesible si rol = 'admin'**
- Permite ver lista de usuarios
- Permite cambiar roles (user ↔ admin)

---

## 4. ESTRUCTURA DEL PROYECTO

```
app/
├── page.tsx              # Home (dashboard después de login)
├── layout.tsx            # RootLayout + providers
├── globals.css           # Estilos globales
├── (auth)/
│   └── auth/
│       └── page.tsx      # Página de login
├── admin/
│   └── page.tsx          # Panel de administración
└── api/
    └── auth/
        └── callback/
            └── route.ts  # OAuth callback

hooks/
├── useAuth.tsx           # Hook + AuthProvider

lib/
└── supabase/
    └── client.ts         # Cliente Supabase
```

---

## 5. DEPLOY EN VERCEL

### 5.1 Preparar Repositorio

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit"

# Conectar a GitHub
git remote add origin https://github.com/tuusuario/pawprint-finder.git
git push -u origin main
```

### 5.2 Deployar en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Haz login con GitHub
3. "Import Project"
4. Selecciona tu repositorio
5. Configura Build Settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 5.3 Agregar Variables de Entorno

En Vercel Dashboard:
1. Ve a Project Settings → Environment Variables
2. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = valor de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = valor de Supabase
   - `NEXT_PUBLIC_APP_URL` = `https://tudominio.vercel.app`

3. Aplica a `Production` y `Preview`

### 5.4 Configurar Google OAuth para Producción

1. Ve a Google Cloud Console
2. En "Authorized redirect URIs", agrega:
   - `https://tudominio.vercel.app/auth/callback`
3. Ve a Supabase → Google Provider
4. Agrega el nuevo redirect URI

### 5.5 Deploy Automático

Cada push a `main` deployará automáticamente.

---

## 6.TROUBLESHOOTING

### Problema: "Error de autenticación" al login

**Solución:**
- Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén en `.env.local`
- Verifica que la tabla `profiles` existe en Supabase
- Verifica que el trigger de auto-creación está activo

### Problema: Google OAuth no funciona

**Solución:**
- Verifica que Google provider está activado en Supabase
- Verifica que el redirect URI es correcto
- Verifica que Client ID/Secret están en Supabase

### Problema: Admin panel dice "Acceso denegado"

**Solución:**
- Verifica que el email del usuario está registrado con rol = 'admin' en tabla `profiles`
- Ejecuta manualmente:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'tuEmail@gmail.com';
```

### Problema: La página de login se ve en blanco

**Solución:**
- Verifica que todas las dependencias están instaladas: `npm install`
- Limpia Next.js cache: `rm -rf .next`
- Reinicia servidor: `npm run dev`

---

## 7. PRÓXIMAS FUNCIONALIDADES

- [ ] Crear QR codes para mascotas
- [ ] Sistema de reportes de mascotas perdidas
- [ ] Notificaciones en tiempo real
- [ ] Integración con mapas
- [ ] Dashboard de estadísticas

