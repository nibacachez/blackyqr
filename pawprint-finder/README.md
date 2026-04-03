# Pawprint Finder - BlackyQR

**Código QR inteligente para proteger a tu mascota** 🐾🐱

Una plataforma web moderna construida con Next.js, Supabase y Tailwind CSS para ayudarte a proteger a tu mascota mediante códigos QR.

## 🌟 Características

- ✅ **Autenticación Moderna**
  - Registro con Gmail (Google OAuth)
  - Registro con email y contraseña
  - Validación de seguridad en contraseña
  - Logout seguro

- ✅ **Validación de Contraseña**
  - Mínimo 8 caracteres
  - Al menos una mayúscula (A-Z)
  - Al menos una minúscula (a-z)
  - Al menos un número (0-9)
  - Feedback en tiempo real

- ✅ **Stack Moderno**
  - Next.js 14 con App Router
  - React 18
  - TypeScript
  - Tailwind CSS
  - Supabase (backend + auth)

- ✅ **Listo para Producción**
  - Desplegable en Vercel
  - ESLint y Prettier configurados
  - TypeScript strict mode
  - Middleware de seguridad

## 🚀 Inicio Rápido

### 1. Clonar y Instalar (2 min)

```bash
git clone <tu-repositorio>
cd pawprint-finder
npm install --legacy-peer-deps
```

### 2. Configurar Variables (3 min)

```bash
cp .env.example .env.local
# Edita con tus credenciales de Supabase
```

### 3. Ejecutar Localmente (1 min)

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 4. Probar Autenticación (2 min)

- Click en "Comenzar"
- Ir a `/auth`
- Selecciona "Continuar con Gmail" o email/contraseña

**Total:** ~8 minutos ⏱️

## 📚 Documentación

| Guía | Para | Tiempo |
|------|------|--------|
| [QUICKSTART.md](QUICKSTART.md) | Empezar rápido | 5 min |
| [COMPLETE_SETUP.md](COMPLETE_SETUP.md) | Configuración detallada | 15 min |
| [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) | Configurar OAuth | 20 min |
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | Despliegue | 30 min |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Desarrollo local | 20 min |
| [FAQ.md](FAQ.md) | Preguntas frecuentes | - |
| [ÍNDICE_DOCUMENTACIÓN.md](ÍNDICE_DOCUMENTACIÓN.md) | Índice completo | - |

**👉 [Lee el QUICKSTART.md para empezar en 5 minutos](QUICKSTART.md)**

## 🏗️ Estructura

```
pawprint-finder/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Rutas de autenticación
│   ├── (dashboard)/    # Rutas protegidas
│   └── api/            # API endpoints
├── components/         # Componentes React
├── hooks/              # Custom hooks (useAuth)
├── lib/                # Utilidades y configuración
└── public/             # Archivos estáticos
```

## 🔐 Autenticación

### Opción 1: Gmail (Recomendado)
```
1. Click "Continuar con Google"
2. Autorizar
3. ¡Listo!
```

### Opción 2: Email/Contraseña
```
1. Nombre + Apellido + Email + Contraseña
2. Validación automática
3. Confirmar email
4. Iniciar sesión
```

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev          # Servidor local
npm run build        # Build producción
npm start            # Producción local

# Calidad
npm run lint         # Verificar ESLint
npm run lint:fix     # Arreglar automáticamente
npm run format       # Formatear código
npm run type-check   # Verificar TypeScript

# Verificación
npm run verify-setup # Verificar configuración
npm run setup        # Instalar y verificar

# Testing
npm test             # Ejecutar tests
npm run test:watch   # Watch mode
```

## 🌐 Despliegue

### En Vercel (Recomendado)

1. Push a GitHub
2. Ir a https://vercel.com/new
3. Importar repositorio
4. Agregar variables de entorno
5. Deploy automático

Ver [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) para detalles.

## 🤝 Tecnologías

| Tecnología | Versión | Para |
|-----------|---------|------|
| Next.js | ^14.2.0 | Framework web |
| React | ^18.3.1 | Bibliotec UI |
| TypeScript | ^5.8.3 | Tipos |
| Supabase | ^2.98.0 | Backend + Auth |
| Tailwind CSS | ^3.4.17 | Estilos |
| ESLint | ^8.57.0 | Linting |
| Prettier | ^3.1.1 | Formato |

## 📋 Verificación Pre-Deploy

```bash
✓ npm install --legacy-peer-deps
✓ npm run verify-setup
✓ npm run lint
✓ npm run type-check
✓ npm run build
✓ Probar en localhost:3000
✓ Configurar variables en Vercel
✓ Deploy
```

## ❓ ¿Problemas?

1. **Lee [FAQ.md](FAQ.md)** - 90% de problemas están documentados
2. **Ejecuta:** `npm run verify-setup`
3. **Revisa logs:** F12 en navegador
4. **Contacta equipo:** Si persiste

## 📝 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Cuenta en Supabase (gratuita)
- Cuenta en Google para OAuth (opcional)

## 🔑 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=       # Tu URL de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Tu clave anónima
NEXT_PUBLIC_APP_URL=            # http://localhost:3000 (o tu dominio)
NODE_ENV=development            # development o production
```

## 📞 Soporte

- 📚 **Documentación:** Ver carpeta de docs
- 🐛 **Reportar bug:** GitHub Issues
- 💬 **Preguntas:** Consulta [FAQ.md](FAQ.md)
- 👥 **Equipo:** Contacta desarrolladores

## 📄 Licencia

Privada - © 2026 BlackyQR

---

## 🎯 Siguiente Paso

**[👉 EMPEZAR: Lee QUICKSTART.md](QUICKSTART.md)**

O si ya instalaste:
```bash
npm install --legacy-peer-deps
npm run dev
# Abre http://localhost:3000
```

---

**Hecho con ❤️ para los amigos peludos** 🐾

Versión: 1.0.0 | Estado: ✅ Producción | Última actualización: Marzo 2026

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
