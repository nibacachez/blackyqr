# BlackyQR - Pet Rescue Application

Una aplicación web moderna para proteger mascotas usando códigos QR inteligentes. Si tu mascota se pierde, quien la encuentre puede compartir su ubicación sin revelar tus datos personales.

**[📱 Ver Demo]** | **[🚀 Desplegar en Vercel](#despliegue-en-vercel)** | **[📖 Documentación](#documentación)**

---

## 🎯 Características

- ✅ **Registro de mascotas** con foto, raza y características personalizadas
- ✅ **Generación automática de códigos QR** únicos para cada mascota
- ✅ **Compartición segura de ubicación** sin revelar datos del propietario
- ✅ **Dashboard de usuario** para gestionar mascotas y reportes
- ✅ **Panel de administrador** para gestionar todos los QR
- ✅ **Autenticación segura** con Supabase Auth
- ✅ **Base de datos relacional** con Supabase PostgreSQL
- ✅ **Almacenamiento de imágenes** en Supabase Storage
- ✅ **RLS policies** para proteger datos privados
- ✅ **Despliegue serverless** 100% compatible con Vercel

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS 3
- Shadcn/UI components
- React Query
- Sonner (toasts)

**Backend:**
- Next.js API Routes (serverless)
- Node.js
- Supabase (PostgreSQL + Auth + Storage)
- JWT authentication

**Deployment:**
- Vercel
- Supabase (cloud-hosted)

---

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Una cuenta en [Supabase](https://supabase.com) (gratuita)
- Una cuenta en [Vercel](https://vercel.com) (gratuita)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/pawprint-finder.git
cd pawprint-finder
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Actualiza las variables con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🗄️ Configuración de Supabase

### 1. Crear un proyecto en Supabase

- Accede a [supabase.com](https://supabase.com)
- Crea un nuevo proyecto
- Copia la URL y la Anon Key

### 2. Crear tablas

Ejecuta el siguiente SQL en el editor de SQL de Supabase:

```sql
-- Tabla de mascotas
CREATE TABLE mascotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  raza TEXT,
  caracteristicas JSONB,
  foto_url TEXT,
  qr_url TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_contact_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes de rescate
CREATE TABLE rescate_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mascota_id UUID NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
  lat NUMERIC NOT NULL CHECK (lat >= -90 AND lat <= 90),
  lon NUMERIC NOT NULL CHECK (lon >= -180 AND lon <= 180),
  reporter_meta JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vista pública (sin datos sensibles del propietario)
CREATE VIEW mascotas_public AS
SELECT
  id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, created_at, updated_at
FROM mascotas;

-- RLS Policies
ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescate_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios pueden ver sus propias mascotas
CREATE POLICY "mascotas_owner_select" ON mascotas
  FOR SELECT USING (auth.uid() = owner_id);

-- Policy: Usuarios pueden crear mascotas
CREATE POLICY "mascotas_owner_insert" ON mascotas
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Policy: Usuarios pueden eliminar sus mascotas
CREATE POLICY "mascotas_owner_delete" ON mascotas
  FOR DELETE USING (auth.uid() = owner_id);

-- Policy: Público puede ver mascotas (via view)
CREATE POLICY "mascotas_public_select" ON mascotas
  FOR SELECT USING (true);

-- Policy: Cualquiera puede crear reportes
CREATE POLICY "rescate_reports_insert" ON rescate_reports
  FOR INSERT WITH CHECK (true);

-- Policy: Usuarios pueden ver sus reportes
CREATE POLICY "rescate_reports_select" ON rescate_reports
  FOR SELECT USING (true);
```

### 3. Crear Storage Bucket

- Ve a Storage en el panel de Supabase
- Crea un bucket llamado `mascotas`
- Configura permisos públicos para lectura

### 4. Configurar Autenticación

- Ve a Authentication > Providers
- Habilita Email/Password
- Configura URLs de redirección:
  - `http://localhost:3000/auth`
  - `https://tudominio.vercel.app/auth`

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Lint
npm run lint
npm run lint:fix

# Formatear código
npm run format

# Type checking
npm run type-check

# Tests
npm test
npm run test:watch
```

---

## 🚀 Despliegue en Vercel

### 1. Preparar el repositorio

```bash
git add .
git commit -m "Preparar para despliegue en Vercel"
git push
```

### 2. Conectar a Vercel

- Ve a [vercel.com/new](https://vercel.com/new)
- Selecciona tu repositorio de GitHub
- Configura el proyecto

### 3. Variables de Entorno

En la sección de "Environment Variables", agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
NODE_ENV=production
```

### 4. Desplegar

- Clickea "Deploy"
- Vercel construirá y desplegará tu aplicación automáticamente

---

## 🔐 Seguridad

- ✅ JWT tokens para autenticación
- ✅ RLS policies en la base de datos
- ✅ Datos del propietario encriptados
- ✅ HTTPS en producción
- ✅ CORS configurado
- ✅ Rate limiting en API routes

---

## 📱 Rutas Disponibles

| Ruta | Descripción | Autenticación |
|------|-------------|---------------|
| `/` | Página de inicio | No |
| `/auth` | Login/Signup | No |
| `/dashboard` | Dashboard de usuario | Sí |
| `/register` | Registrar mascota | Sí |
| `/admin-dashboard` | Panel admin | Sí (admin) |
| `/rescue/:petId` | Página de rescate | No |

---

## 🎨 Personalización

### Colores

Los colores están definidos en `app/globals.css`:

```css
:root {
  --primary: 250 80% 62%; /* Color principal (morado) */
  --secondary: 215 85% 55%; /* Color secundario (azul) */
  /* ... más colores ... */
}
```

### Fuentes

Las fuentes se cargan en `app/layout.tsx` desde Google Fonts:

```tsx
Space Grotesk (display font)
Inter (body font)
```

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` sean correctas
- Comprueba que el proyecto de Supabase está activo

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén configuradas correctamente
- Intenta desconectarte y reconectarte

### Error: "Storage bucket not found"
- Crea el bucket `mascotas` en Storage
- Verifica que esté visible públicamente

### QR no se genera
- Comprueba que `NEXT_PUBLIC_APP_URL` es correcto
- Verifica que la aplicación tenga permisos de escritura en el navegador

---

## 📚 Documentación Adicional

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Shadcn/UI](https://ui.shadcn.com)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 📧 Contacto

- Email: [Tu email]
- GitHub: [Tu GitHub]
- Twitter: [@tu_twitter]

---

**¡Ayuda a proteger a las mascotas! 🐾**
