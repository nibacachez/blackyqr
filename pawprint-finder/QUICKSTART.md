# Quick Start Guide para Pawprint Finder

## Configuración Inicial

### 1. Instalar Dependencias
```bash
# Con npm
npm install --legacy-peer-deps

# O con pnpm (recomendado)
pnpm install

# O con yarn
yarn install

# O con bun
bun install
```

### 2. Configurar Variables de Entorno

1. Copiar `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Actualizar `.env.local` con tus valores de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. (Optional) Para habilitar Google OAuth, ver `GOOGLE_OAUTH_SETUP.md`

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Flujo de Autenticación

### Registro de Usuarios

#### Opción 1: Con Gmail (Recomendado)
1. Ir a `http://localhost:3000/auth`
2. Seleccionar "Registrarse con Gmail"
3. Click en "Continuar con Google"
4. Autorizar el acceso
5. Serás redirigido a `/dashboard`

#### Opción 2: Con Email y Contraseña
1. Ir a `http://localhost:3000/auth`
2. Seleccionar "Registrarse con email y contraseña"
3. Ingresar nombre, apellido y email
4. Ingresar contraseña con:
   - Mínimo 8 caracteres
   - Al menos una mayúscula
   - Al menos una minúscula
   - Al menos un número
5. Confirmar email (linkrevisa tu bandeja de entrada)
6. Iniciar sesión

### Login

1. Ir a `http://localhost:3000/auth`
2. Opción 1: Click en "Continuar con Google"
3. Opción 2: Ingresar email y contraseña

## Estructura del Proyecto

```
pawprint-finder/
├── app/                      # App Router de Next.js
│   ├── (auth)/              # Grupo de rutas de autenticación
│   │   └── auth/
│   │       ├── page.tsx      # Página de login/registro
│   │       └── callback/     # OAuth callback
│   ├── (dashboard)/         # Grupo de rutas protegidas
│   │   ├── dashboard/       # Dashboard principal
│   │   └── admin-dashboard/ # Panel de administrador
│   ├── api/                 # API routes
│   └── layout.tsx           # Layout principal
├── components/              # Componentes React reutilizables
│   ├── ui/                  # Componentes de UI (button, input, etc)
│   └── *.tsx               # Componentes específicos
├── hooks/                   # Custom React hooks
│   └── useAuth.tsx         # Hook de autenticación
├── lib/                     # Funciones utilitarias
│   ├── supabase/           # Configuración de Supabase
│   ├── passwordValidator.ts # Validación de contraseñas
│   ├── supabaseConfig.ts   # Configuración de OAuth
│   └── utils.ts            # Utilidades generales
├── public/                  # Archivos estáticos
├── .env.local              # Variables de entorno (gitignore)
├── .env.example            # Template de variables
├── next.config.js          # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind CSS
└── tsconfig.json           # Configuración de TypeScript
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build de producción
npm start            # Iniciar servidor de producción

# Calidad de código
npm run lint         # Verificar errores de ESLint
npm run lint:fix     # Arreglar errores de ESLint automáticamente
npm run format       # Formatear código con Prettier
npm run type-check   # Verificar tipos de TypeScript

# Testing
npm test             # Ejecutar tests con Jest
npm run test:watch   # Ejecutar tests en modo watch
```

## Despliegue

### En Vercel (Recomendado)
1. Pushear cambios a GitHub
2. Ir a [Vercel](https://vercel.com)
3. Conectar repositorio
4. Configurar variables de entorno
5. Deploy automático

Ver `VERCEL_DEPLOYMENT.md` para instrucciones detalladas.

## Solución de Problemas

### Error: "Cannot find module '@/...'"
- Verificar que `tsconfig.json` tiene la configuración de paths
- Reiniciar el servidor de desarrollo

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Verificar que `.env.local` existe y tiene las variables correctas
- Reiniciar el servidor de desarrollo

### Error al iniciar sesión con Google
- Verificar que Google OAuth está activado en Supabase
- Ver `GOOGLE_OAUTH_SETUP.md`
- Verificar que `NEXT_PUBLIC_APP_URL` es correcto

### Base de datos vacía
- Ejecutar migraciones de Supabase:
```bash
supabase db push
```

## Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Soporte

Para reportar issues o sugerencias, contacta al equipo de desarrollo.

## Licencia

Este proyecto está bajo licencia privada.
