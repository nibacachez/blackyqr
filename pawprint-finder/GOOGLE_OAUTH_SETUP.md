# Guía de Configuración de Google OAuth en Supabase

## Paso 1: Configurar Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
   - Click en el selector de proyectos en la parte superior
   - Click en "Nuevo proyecto"
   - Nombre: "pawprint-finder" (o similar)
   - Click en "Crear"

3. Habilitar Google+ API
   - En el panel de búsqueda, escribir "Google+ API"
   - Seleccionar "Google+ API"
   - Click en "Habilitar"

4. Crear credenciales OAuth 2.0
   - Ir a "Credenciales" en la barra lateral
   - Click en "+ CREAR CREDENCIALES"
   - Seleccionar "ID de cliente de OAuth"
   - Si se pide, configurar pantalla de consentimiento:
     - Tipo de usuario: "Externo"
     - Rellenar información básica (nombre de la aplicación, email, etc.)
     - Agregar scopes: `email`, `profile`, `openid`
   - Tipo de aplicación: "Aplicación web"
   - Nombre: "pawprint-finder-web"

5. Configurar URIs autorizados
   - Para desarrollo local:
     - `http://localhost:3000`
     - `http://localhost:3000/auth/callback`
   - Para producción:
     - Sustituir `localhost:3000` con tu dominio de Vercel

6. Copiar las credenciales
   - ID de cliente: `GOOGLE_CLIENT_ID`
   - Secreto de cliente: `GOOGLE_CLIENT_SECRET`

## Paso 2: Configurar Supabase

1. Ir al [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a "Authentication" > "Providers"
4. Buscar y seleccionar "Google"
5. Pegar las credenciales:
   - Client ID: Tu Google Client ID
   - Client Secret: Tu Google Client Secret
6. Habilitar el proveedor (toggle en la esquina superior derecha)

## Paso 3: Configurar Variables de Entorno

En tu archivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Para producción: NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Node Environment
NODE_ENV=development
```

## Paso 4: Probar el Flujo de Registro

1. Ejecutar el proyecto: `npm run dev`
2. Ir a `http://localhost:3000/auth`
3. Seleccionar "Registrarse con Gmail"
4. Click en "Continuar con Google"
5. Autorizar el acceso
6. Deberás ser redirigido a `/dashboard`

## Paso 5: Desplegar en Vercel

1. Actualizar `NEXT_PUBLIC_APP_URL` en variables de entorno de Vercel
   - Ir a Settings > Environment Variables
   - Actualizar la variable con tu dominio de Vercel

2. Actualizar Google Cloud Console
   - Agregar tu dominio de Vercel a los URIs autorizados:
     - `https://[your-domain].vercel.app`
     - `https://[your-domain].vercel.app/auth/callback`

## Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verificar que el URI en Google Cloud Console coincida exactamente con el de Supabase
- Incluir el protocolo (http/https) y el puerto si es necesario

### Error: "Client id not found"
- Verificar que el Client ID es correcto en Supabase
- Asegurarse de que el proveedor Google está habilitado en Supabase

### El usuario no se redirige después de OAuth
- Verificar que `NEXT_PUBLIC_APP_URL` sea correcta
- Revisar que la ruta `/auth/callback` está configurada en `app/(auth)/auth/callback/route.ts`

## Referencias

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/oauth2)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
