# Guía de Despliegue en Vercel

## Prerequisites

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub con tu código
- Proyecto Supabase configurado con Google OAuth

## Paso 1: Preparar el Repositorio

1. Asegurarse de que todos los cambios están en git:
```bash
git add .
git commit -m "Configurar Next.js con Supabase y Google OAuth"
git push origin main
```

2. Crear un archivo `.gitignore` si no existe:
```
node_modules/
.env.local
.env*.local
.next/
build/
dist/
.DS_Store
*.pem
```

## Paso 2: Desplegar en Vercel

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New..." > "Project"
3. Seleccionar tu repositorio de GitHub
4. Click en "Import"
5. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
   - `NEXT_PUBLIC_APP_URL`: https://[your-domain].vercel.app
6. Click en "Deploy"

### Opción 2: Usar Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Para variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## Paso 3: Actualizar Variables de Entorno en Producción

1. En Vercel Dashboard, ir al proyecto
2. Settings > Environment Variables
3. Actualizar `NEXT_PUBLIC_APP_URL` con tu dominio de Vercel
4. Verificar que todas las variables están configuradas correctamente

## Paso 4: Actualizar Google OAuth en Producción

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. En Credenciales, actualizar los URIs autorizados:
```
https://[your-domain].vercel.app
https://[your-domain].vercel.app/auth/callback
```

## Paso 5: Actualizar Supabase

1. Ir al Supabase Dashboard
2. Authentication > URL Configuration
3. Configurar la URL de producción:
```
https://[your-project].supabase.co
```

4. En Authentication > Providers > Google
5. Verificar que el Client ID y Secret son correctos

## Verificar el Despliegue

1. Ir a https://[your-domain].vercel.app
2. Probar el flujo de autenticación:
   - Ir a /auth
   - Click en "Continuar con Google"
   - Autorizar el acceso
   - Deberías ser redirigido a /dashboard

## Comando para Verificar Build Localmente

```bash
# Build de producción
npm run build

# Iniciar server de producción
npm start

# Abrir en http://localhost:3000
```

## Solución de Problemas en Producción

### Error 500 al iniciar sesión
- Verificar que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son correctas
- Ver los logs en Vercel > Your Project > Deployments > Latest > Logs

### Redirect URI mismatch en OAuth
- Verificar que NEXT_PUBLIC_APP_URL coincida con el dominio de Vercel
- Actualizar Google Cloud Console y Supabase con el dominio correcto

### Variables de entorno no se cargan
- En Vercel, ir a Settings > Environment Variables
- Hacer un redeploy después de cambiar variables

## Monitoreo

1. En Vercel Dashboard, ir a Analytics
2. Monitorear:
   - Core Web Vitals
   - Requests
   - Error rates

## Rolling Back

Si necesitas revertir a una versión anterior:

1. En Vercel Dashboard, ir a Deployments
2. Seleccionar el deployment anterior
3. Click en los 3 puntos > Promote to Production

## Referencias

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Best Practices](https://nextjs.org/docs/deployment)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions/quickstart)
