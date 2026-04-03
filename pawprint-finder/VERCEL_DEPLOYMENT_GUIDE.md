# 🚀 Guía de Despliegue a Vercel - Pawprint Finder

## Descripción General
Esta guía te ayudará a desplegar la aplicación Pawprint Finder en Vercel con autenticación de Supabase y gestión de roles de administrador.

---

## 📋 Requisitos Previos

- ✅ Repositorio de GitHub con el proyecto (`pawprint-finder`)
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Proyecto de Supabase configurado
- ✅ Variables de entorno de Supabase (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 🔗 Paso 1: Conectar GitHub a Vercel

### 1.1 Accede a Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign up"** o **"Log in"**
3. Elige **GitHub** como proveedor de autenticación
4. Autoriza a Vercel para acceder a tus repositorios

### 1.2 Importar el Proyecto
1. Una vez en el dashboard de Vercel, haz clic en **"New Project"**
2. Busca y selecciona el repositorio `pawprint-finder`
3. Haz clic en **"Import"**

---

## 🔐 Paso 2: Configurar Variables de Entorno

### 2.1 En Vercel:
1. En la página de configuración del proyecto, ve a **"Settings"** → **"Environment Variables"**
2. Añade las siguientes variables:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://qyyygvvdksdmcpfomeul.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación en producción | `https://pawprint-finder.vercel.app` |

### 2.2 Dónde Encontrar estas Variables:
**En Supabase Dashboard:**
1. Ve a tu proyecto → **"Settings"** → **"API"**
2. Copia en el apartado **"Project URL"** (es tu `NEXT_PUBLIC_SUPABASE_URL`)
3. Copia la **"anon"** key bajo "Project API Keys" (es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 🏗️ Paso 3: Configuración Next.js

El proyecto ya incluye:
- ✅ `vercel.json` con configuración de build
- ✅ `next.config.js` optimizado para Vercel
- ✅ `package.json` con scripts de build

**No requiere cambios adicionales** — Vercel detectará automáticamente que es un proyecto Next.js.

---

## 🚀 Paso 4: Desplegar

### 4.1 Despliegue Automático:
1. Una vez configuradas las variables de entorno, haz clic en **"Deploy"**
2. Vercel construirá automáticamente el proyecto
3. Espera a que se complete el build (generalmente 2-5 minutos)

### 4.2 Despliegue Manual (desde Git):
```bash
# Simplemente haz push a tu repositorio GitHub
git push origin main
```
Vercel se desplegará automáticamente cada vez que hagas push a `main`.

---

## ✅ Verificar Despliegue

Después del despliegue:

1. **Accede a tu aplicación:**
   - Ve a tu dominio de Vercel (ej: `https://pawprint-finder.vercel.app`)
   - Deberías ver la página de inicio con:
     - ✅ Botones de "Inicia sesión" y "Regístrate"
     - ✅ Código QR escaneable en la página principal

2. **Verifica la URL del QR:**
   - El código QR debe apuntar a `https://pawprint-finder.vercel.app`
   - Escanéalo desde un teléfono para verificar que funciona

3. **Verifica la conectividad con Supabase:**
   - Haz clic en "Inicia sesión"
   - Intenta registrar una cuenta
   - Si se crea exitosamente, Supabase está conectado ✅

---

## 👑 Paso 5: Configurar Usuario Administrador

### 5.1 Crear el Usuario Admin en Supabase

1. **Registra el usuario en la app:**
   - Accede a tu aplicación
   - Ve a "Regístrate"
   - Usa el email: `n.ibacache.z@gmail.com`
   - Crea una contraseña segura

2. **Obtén el UUID del usuario:**
   - Ve a tu proyecto Supabase → **"SQL Editor"**
   - Ejecuta esta query:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'n.ibacache.z@gmail.com';
   ```
   - Copia el `id` (UUID)

### 5.2 Actualizar el Rol a Admin

1. **En Supabase SQL Editor:**
   - Copia el UUID obtenido arriba
   - Ejecuta:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'n.ibacache.z@gmail.com';
   ```

2. **Verifica:**
   ```sql
   SELECT id, email, role FROM public.profiles WHERE email = 'n.ibacache.z@gmail.com';
   ```
   Deberías ver `role = 'admin'` ✅

### 5.3 Acceder al Panel Admin

1. **Inicia sesión con el usuario admin:**
   - Email: `n.ibacache.z@gmail.com`
   - Inicia sesión en tu aplicación

2. **Dashboard Admin:**
   - Después de iniciar sesión, verás un panel azul que dice "Panel de Administrador 👑"
   - Haz clic en "Ir al Panel Admin"

3. **En el Panel Admin:**
   - ✅ Verás tabla de usuarios
   - ✅ Botones para cambiar roles
   - ✅ Estadísticas de usuarios

---

## 🔄 Despliegue Continuo

Vercel desplegará automáticamente cuando:
- Hagas un `git push` a la rama `main`
- Hagas un pull request (despliegue de preview)
- Cambies variables de entorno

**Para ver el estado de despliegues:**
1. En Vercel Dashboard, selecciona tu proyecto
2. Ve a **"Deployments"**
3. Verás el historial de todos los despliegues

---

## 🐛 Solucionar Problemas

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de Vercel
- Asegúrate de que el código está compilado localmente: `npm run build`

### Error: "Supabase not found"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén correctas
- Recuerda que deben ser públicas (NEXT_PUBLIC_)

### El QR no funciona
- Asegúrate de que `NEXT_PUBLIC_APP_URL` sea la URL correcta de Vercel
- Escanea el QR desde un dispositivo móvil conectado a internet

### Autenticación no funciona
- Verifica que Supabase esté activo
- En Supabase → Settings → Auth, asegúrate que el provider esté habilitado

---

## 📊 Monitoreo

Para monitorear tu aplicación:

1. **En Vercel:**
   - Dashboard → Proyecto → "Analytics"
   - Ver requests, performance, edge functions

2. **En Supabase:**
   - Dashboard → "Logs" para ver queries
   - "Monitoring" para ver performance

---

## 🎯 Resumen Final

✅ Proyecto conectado a GitHub  
✅ Variables de entorno configuradas  
✅ Build optimizado para Vercel  
✅ Autenticación con Supabase  
✅ Gestión de roles funcionando  
✅ QR generado dinámicamente  
✅ Dashboard admin disponible  

**Tu aplicación está lista para producción!** 🚀

---

## 📞 Soporte

Para más información:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
