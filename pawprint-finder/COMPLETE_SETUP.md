# Configuración Completa de Pawprint Finder con Supabase y Vercel

Este documento cubre la configuración completa y funcionamiento de tu proyecto Next.js con Supabase y Google OAuth.

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Cuenta en Supabase (https://supabase.com)
- Cuenta en Google Cloud Console (https://console.cloud.google.com)
- Cuenta en Vercel (https://vercel.com) para despliegue

## 🚀 Inicio Rápido (5 minutos)

### 1. Clonar y Configurar

```bash
git clone <tu-repositorio>
cd pawprint-finder

# Instalar dependencias
npm install --legacy-peer-deps

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Variables de Entorno

Edita `.env.local` con tus valores de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Obtener credenciales:**
1. Abre [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a Settings > API
4. Copia `Project URL` y `anon public key`

### 3. Ejecutar Localmente

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 4. Probar Autenticación

- Ir a `/auth`
- Seleccionar "Registrarse con Gmail" o email/contraseña
- Las contraseñas deben tener:
  - Mínimo 8 caracteres
  - Al menos una mayúscula (A-Z)
  - Al menos una minúscula (a-z)
  - Al menos un número (0-9)

## 📁 Estructura del Proyecto

```
pawprint-finder/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # Grupo de rutas de autenticación
│   │   └── auth/
│   │       ├── page.tsx             # Página principal de login/registro
│   │       └── callback/            # Ruta de callback para Google OAuth
│   │           └── route.ts
│   ├── (dashboard)/                 # Rutas protegidas (requieren autenticación)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── admin-dashboard/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── api/                         # API Routes
│   │   ├── auth/                    # Rutas de autenticación
│   │   ├── pets/                    # Gestión de mascotas
│   │   └── reports/                 # Reportes de rescate
│   ├── layout.tsx                   # Layout raíz (con AuthProvider)
│   ├── page.tsx                     # Página de inicio
│   └── globals.css                  # Estilos globales
│
├── components/                       # Componentes React
│   ├── ui/                          # Componentes de UI reutilizables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   └── textarea.tsx
│   ├── ProtectedRoute.tsx           # Componente para proteger rutas
│   ├── Header.tsx
│   ├── PetCard.tsx
│   ├── QRCodeDisplay.tsx
│   └── theme-provider.tsx
│
├── hooks/                            # Custom React Hooks
│   ├── useAuth.tsx                  # Contexto y hook de autenticación
│   └── use-mobile.tsx               # Detector de dispositivo móvil
│
├── lib/                              # Funciones utilitarias
│   ├── supabase/
│   │   ├── client.ts                # Cliente de Supabase para navegador
│   │   ├── server.ts                # Cliente de Supabase para servidor
│   │   └── types.ts                 # Tipos de base de datos
│   ├── passwordValidator.ts         # Validación de contraseñas
│   ├── supabaseConfig.ts            # Configuración de OAuth
│   ├── petStore.ts                  # Funciones CRUD para mascotas
│   └── utils.ts                     # Utilidades generales
│
├── public/                           # Archivos estáticos
│   └── robots.txt
│
├── supabase/                         # Configuración local de Supabase
│   ├── config.toml
│   └── migrations/                  # Migraciones de base de datos
│
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Configuración de TypeScript
├── next.config.js                    # Configuración de Next.js
├── tailwind.config.ts                # Configuración de Tailwind CSS
├── .eslintrc.json                    # Configuración de ESLint
├── .prettierrc                       # Configuración de Prettier
├── middleware.ts                     # Middleware de Next.js
├── .env.example                      # Template de variables
├── .env.local                        # Variables (gitignore)
│
├── GOOGLE_OAUTH_SETUP.md            # Guía detallada de Google OAuth
├── VERCEL_DEPLOYMENT.md             # Guía de despliegue en Vercel
├── QUICKSTART.md                    # Guía de inicio rápido
├── DEVELOPMENT.md                   # Guía de desarrollo local
└── COMPLETE_SETUP.md                # Este archivo
```

## 🔐 Flujo de Autenticación

### Componentes Clave

**1. `hooks/useAuth.tsx`**
- Contexto de autenticación global
- Funciones: `signUp()`, `signIn()`, `signInWithGoogle()`, `signOut()`
- Propiedades: `user`, `session`, `loading`, `userRole`

**2. `app/(auth)/auth/page.tsx`**
- Página de login/registro
- Interfaz con opción de Gmail o email/contraseña
- Validación de contraseña en tiempo real

**3. `app/(auth)/auth/callback/route.ts`**
- Ruta de callback para Google OAuth
- Intercambia código por sesión
- Redirige a `/dashboard`

**4. `lib/passwordValidator.ts`**
- Valida requisitos de contraseña
- Proporciona sugerencias
- Retorna errores y estado

### Flujo 1: Registro con Gmail

```
Usuario
  ↓
Click "Continuar con Google"
  ↓
Google OAuth Dialog
  ↓
Autorización
  ↓
Redirect a /auth/callback
  ↓
Intercambiar código por sesión
  ↓
Redirigir a /dashboard
  ↓
Usuario Autenticado
```

### Flujo 2: Registro con Email/Contraseña

```
Usuario
  ↓
Ingresar: nombre, apellido, email, contraseña
  ↓
Validación de contraseña (8 chars, mayúscula, minúscula, número)
  ↓
Click "Crear cuenta"
  ↓
`signUp()` llama a Supabase
  ↓
Email de confirmación enviado
  ↓
Usuario confirma email
  ↓
Usuario puede iniciar sesión
```

## 🔧 Variables de Entorno Explicadas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://abc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública para el cliente | `eyJhbG...` |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | `http://localhost:3000` |
| `NODE_ENV` | Ambiente | `development` o `production` |

**Nota:** `NEXT_PUBLIC_` significa que son públicas (seguro exponer en cliente)

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build de producción
npm start                # Ejecutar servidor de producción

# Calidad
npm run lint             # Verificar ESLint
npm run lint:fix         # Arreglar errores automáticamente
npm run format           # Formatear código con Prettier
npm run type-check       # Verificar tipos TypeScript

# Verificación
npm run verify-setup     # Verificar configuración
npm run setup            # Instalar y verificar

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Watch mode para tests
```

## 🌐 Despliegue en Vercel

### Paso 1: Preparar Repositorio

```bash
git add .
git commit -m "feat: configuración completa de Supabase y OAuth"
git push origin main
```

### Paso 2: Conectar a Vercel

1. Ir a https://vercel.com/new
2. Seleccionar tu repositorio de GitHub
3. Click "Import"

### Paso 3: Configurar Variables

En Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-clave]
NEXT_PUBLIC_APP_URL=https://[tu-dominio].vercel.app
NODE_ENV=production
```

### Paso 4: Deploy

Click "Deploy" - Vercel construirá y desplegará automáticamente

## 🔑 Google OAuth - Pasos Detalladós

> Ver `GOOGLE_OAUTH_SETUP.md` para instrucciones completas

**Resumen:**
1. Crear proyecto en Google Cloud Console
2. Crear credenciales OAuth 2.0
3. Configurar URI autorizados
4. Agregar credenciales en Supabase
5. Habilitar proveedor Google

## 🐛 Solución de Problemas

### "redirect_uri_mismatch" en OAuth
**Solución:**
- Verificar que `NEXT_PUBLIC_APP_URL` en `.env.local` sea correcto
- Agregar URI a Google Cloud Console
- Reiniciar servidor (`npm run dev`)

### "Module not found" para `@/...`
**Solución:**
- Verificar `tsconfig.json` tiene config de paths
- VS Code: Ctrl+Shift+P > "Reload Window"

### Puerto 3000 ocupado
**Solución:**
```bash
npm run dev -- -p 3001
```

### Build falla
**Solución:**
```bash
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Docs](https://developers.google.com/identity/oauth2)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. ✅ Instalar dependencias: `npm install --legacy-peer-deps`
2. ✅ Configurar `.env.local` con credenciales de Supabase
3. ✅ Configurar Google OAuth (ver `GOOGLE_OAUTH_SETUP.md`)
4. ✅ Ejecutar `npm run dev`
5. ✅ Probar flujos de autenticación en `/auth`
6. ✅ Desplegar en Vercel (ver `VERCEL_DEPLOYMENT.md`)

## 📞 Soporte

Para problemas o preguntas:
1. Revisar las guías (GOOGLE_OAUTH_SETUP.md, VERCEL_DEPLOYMENT.md)
2. Verificar configuración con: `npm run verify-setup`
3. Contactar al equipo de desarrollo

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026  
**Licencia:** Privada
