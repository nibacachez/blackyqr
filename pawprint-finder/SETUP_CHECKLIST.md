# 📋 Checklist de Configuración - Pawprint Finder

Sigue este checklist para completar la configuración y despliegue de tu proyecto.

## ✅ Fase 1: Configuración Inicial (Local)

### 1.1 Preparación del Proyecto
- [ ] He clonado el repositorio
  ```bash
  git clone <tu-repo>
  cd pawprint-finder
  ```

- [ ] He instalado las dependencias
  ```bash
  npm install --legacy-peer-deps
  ```

### 1.2 Variables de Entorno
- [ ] He copiado `.env.example` a `.env.local`
  ```bash
  cp .env.example .env.local
  ```

- [ ] He obtenido credenciales de Supabase
  - [ ] URL del proyecto: `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Clave anónima: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] De: https://supabase.com/dashboard > Settings > API

- [ ] He actualizado `.env.local` con mis credenciales

### 1.3 Verificación
- [ ] Ejecuté `npm run verify-setup` (o script correspondiente)
  - [ ] Todos los archivos están presentes
  - [ ] Todas las variables están configuradas
  - [ ] No hay errores críticos

### 1.4 Desarrollo Local
- [ ] He ejecutado `npm run dev`
- [ ] La aplicación se abre en `http://localhost:3000`
- [ ] No hay errores en la consola

---

## ✅ Fase 2: Google OAuth (Opcional pero Recomendado)

### 2.1 Google Cloud Console
- [ ] He accedido a: https://console.cloud.google.com/
- [ ] He creado un nuevo proyecto
  - [ ] Nombre: "pawprint-finder" (o similar)
  - [ ] Organizació: (opcional)

- [ ] He habilitado Google+ API
  - [ ] Búsqueda: "Google+ API"
  - [ ] Click en "Habilitar"

### 2.2 Credenciales OAuth
- [ ] He creado credenciales OAuth 2.0
  - [ ] Tipo: "Aplicación web"
  - [ ] Nombre: "pawprint-finder-web"

- [ ] He configurado URIs para desarrollo
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:3000/auth/callback`

- [ ] He copiado las credenciales
  - [ ] Client ID: `_____________________`
  - [ ] Client Secret: `_____________________`

### 2.3 Configuración en Supabase
- [ ] He abierto: https://supabase.com/dashboard
- [ ] He seleccionado mi proyecto
- [ ] He ido a: Authentication > Providers > Google
- [ ] He pegado las credenciales
  - [ ] Client ID
  - [ ] Client Secret
- [ ] He habilitado el proveedor (toggle)

### 2.4 Prueba de Google OAuth
- [ ] He navegado a `http://localhost:3000/auth`
- [ ] He seleccionado "Registrarse con Gmail"
- [ ] He hecho click en "Continuar con Google"
- [ ] He autorizado el acceso
- [ ] He sido redirigido a `/dashboard`

---

## ✅ Fase 3: Pruebas de Funcionalidad

### 3.1 Autenticación
- [ ] **Registro con email/contraseña**
  - [ ] Nombre y Apellido requeridos
  - [ ] Email válido
  - [ ] Contraseña: mínimo 8 caracteres
  - [ ] Contraseña: al menos una mayúscula
  - [ ] Contraseña: al menos una minúscula
  - [ ] Contraseña: al menos un número
  - [ ] El botón se habilita solo si la contraseña es válida
  - [ ] Email de confirmación se envía

- [ ] **Login con email/contraseña**
  - [ ] Puedo iniciar sesión si confirmé email
  - [ ] Redirección a `/dashboard` funciona
  - [ ] Puedo ver el dashboard

- [ ] **Google OAuth**
  - [ ] El botón está visible
  - [ ] Redirige correctamente a Google
  - [ ] Se crea la cuenta automáticamente
  - [ ] Redirección a `/dashboard` funciona

- [ ] **Logout**
  - [ ] Hay botón de logout en el dashboard
  - [ ] Logout funciona correctamente
  - [ ] Soy redirigido a la página de inicio

### 3.2 Validación
- [ ] **Contraseña débil < 8 caracteres**
  - [ ] Se muestra error
  - [ ] El botón está deshabilitado
  - [ ] Se sugiere agregar caracteres

- [ ] **Sin mayúscula**
  - [ ] Se muestra error
  - [ ] Se sugiere agregar mayúscula

- [ ] **Sin minúscula**
  - [ ] Se muestra error
  - [ ] Se sugiere agregar minúscula

- [ ] **Sin número**
  - [ ] Se muestra error
  - [ ] Se sugiere agregar número

### 3.3 UI/UX
- [ ] **Responsive en móvil**
  - [ ] Abierto en F12 > Device toggle
  - [ ] Todo se ve bien en 320px
  - [ ] Entrada de texto es accesible

- [ ] **Responsive en tablet**
  - [ ] Se ve bien en 768px

- [ ] **Responsive en desktop**
  - [ ] Se ve bien en 1920px

- [ ] **Tema oscuro funciona**
  - [ ] Click en toggle de tema
  - [ ] El tema cambia
  - [ ] Los colores son correctos

- [ ] **Tema claro funciona**
  - [ ] El tema cambia al hacerle click
  - [ ] El contraste es adecuado

- [ ] **Animaciones funcionales**
  - [ ] Las transiciones son suaves
  - [ ] Los spinners animan correctamente

---

## ✅ Fase 4: Calidad de Código

- [ ] He ejecutado `npm run lint`
  - [ ] No hay errores críticos
  - [ ] Warnings son aceptables

- [ ] He ejecutado `npm run lint:fix`
  - [ ] Problemas auto-reparables se arreglaron

- [ ] He ejecutado `npm run format`
  - [ ] El código está formateado correctamente

- [ ] He ejecutado `npm run type-check`
  - [ ] No hay errores de TypeScript

- [ ] He ejecutado `npm run build`
  - [ ] Build completado sin errores
  - [ ] Output en `.next/` está completo

---

## ✅ Fase 5: Despliegue en Vercel

### 5.1 Preparación
- [ ] He añadido todos los cambios a Git
  ```bash
  git add .
  git commit -m "feat: configuración completa de Supabase OAuth"
  git push origin main
  ```

- [ ] Mi repositorio está en GitHub (público o privado)

### 5.2 Crear Proyecto en Vercel
- [ ] He accedido a: https://vercel.com
- [ ] He hecho click en "New Project"
- [ ] He seleccionado mi repositorio
- [ ] He hecho click en "Import"

### 5.3 Configurar Variables en Vercel
- [ ] He ido a Settings > Environment Variables
- [ ] He agregado:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://[proyecto].supabase.co`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[tu-clave]`
  - [ ] `NEXT_PUBLIC_APP_URL` = `https://[tu-dominio].vercel.app`
  - [ ] `NODE_ENV` = `production`

### 5.4 Deploy
- [ ] He hecho click en "Deploy"
- [ ] El deploy se completó exitosamente
- [ ] Mi URL es: `https://[tu-dominio].vercel.app`

### 5.5 Actualizar Google OAuth para Producción
- [ ] He accedido a Google Cloud Console
- [ ] He actualizado los URIs autorizados:
  - [ ] `https://[tu-dominio].vercel.app`
  - [ ] `https://[tu-dominio].vercel.app/auth/callback`

### 5.6 Prueba en Producción
- [ ] He accedido a: `https://[tu-dominio].vercel.app`
- [ ] La aplicación carga correctamente
- [ ] Registro con email/contraseña funciona
- [ ] Google OAuth funciona
- [ ] Login funciona
- [ ] El dashboard es accesible

---

## ✅ Fase 6: Post-Despliegue

### 6.1 Monitoreo
- [ ] He activado Analytics en Vercel
- [ ] He revisar los Core Web Vitals
- [ ] No hay errores en Deployments
- [ ] El proyecto está accesible 24/7

### 6.2 Documentación
- [ ] He leído `COMPLETE_SETUP.md`
- [ ] He leído `DEVELOPMENT.md`
- [ ] He guardado referencias locales

### 6.3 Seguridad
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay secretos en código fuente
- [ ] Las variables están en Vercel, no en Git

### 6.4 Mantenimiento
- [ ] He configurado notificaciones en GitHub
- [ ] He establecido un plan de actualizaciones
- [ ] He documentado cambios futuros

---

## 📊 Resumen

| Fase | Estado | Fecha |
|------|--------|-------|
| 1. Configuración Inicial | ☐ Completado | _____ |
| 2. Google OAuth | ☐ Completado | _____ |
| 3. Funcionalidad | ☐ Completado | _____ |
| 4. Calidad de Código | ☐ Completado | _____ |
| 5. Despliegue Vercel | ☐ Completado | _____ |
| 6. Post-Despliegue | ☐ Completado | _____ |

---

## 🆘 Si Algo Falla

### Error de Setup
```bash
npm run verify-setup
# Verifica todos los archivos y variables
```

### Error en Build
```bash
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### OAuth no Funciona
1. Verificar credenciales en `.env.local`
2. Verificar que Google OAuth está habilitado en Supabase
3. Verificar URIs en Google Cloud Console
4. Ver: `GOOGLE_OAUTH_SETUP.md`

### Vercel Deploy Falla
1. Ver logs en Vercel > Deployments > Latest
2. Verificar variables de entorno
3. Ejecutar build localmente: `npm run build`
4. Ver: `VERCEL_DEPLOYMENT.md`

---

## 🎉 ¡Felicidades!

Si completaste todo el checklist, tu proyecto está:
- ✅ Completamente configurado
- ✅ En producción en Vercel
- ✅ Con Google OAuth funcional
- ✅ Con validación de contraseña segura
- ✅ Listo para usuarios reales

**Siguientes pasos:**
1. Compartir URL con usuarios
2. Recopilar feedback
3. Implementar mejoras
4. Mantener actualizado

---

**Guía de referencia rápida:**

| Acción | Comando |
|--------|---------|
| Iniciar desarrollo | `npm run dev` |
| Build | `npm run build` |
| Verificar | `npm run verify-setup` |
| Linting | `npm run lint:fix` |
| Formato | `npm run format` |
| TypeScript | `npm run type-check` |

---

**Últimas preguntas antes de ir a producción:**

1. ¿Están correos confirmados todos mis usuarios?
2. ¿He probado el flujo de OAuth completamente?
3. ¿Están las variables de entorno configuradas en Vercel?
4. ¿He actualizado Google OAuth URIs?
5. ¿He probado el sitio en producción?

Si respondiste **SÍ** a todas, ¡**estás listo para producción!** 🚀
