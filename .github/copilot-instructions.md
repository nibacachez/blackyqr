# Instrucciones para agentes de código (Copilot)

Breve: proyecto Next.js (App Router, TypeScript) que usa Supabase para almacenamiento y nodemailer para notificaciones. Prioridad: privacidad (datos de dueño encriptados) y minimización de datos.

- **Arquitectura (big picture):**
  - Frontend y API integrados con Next.js App Router (`app/`). Rutas de API están en `app/api/*` (ej.: `app/api/mascotas/create/route.ts`).
  - Persistencia: Supabase (cliente público en `lib/supabase.ts`, admin en `lib/supabaseClient.ts` que usa `SUPABASE_SERVICE_ROLE_KEY`).
  - Encriptación: AES-256-GCM centralizada en `lib/crypto.ts` y helpers `encryptOwnerContact` / `decryptOwnerContact` en `lib/supabaseClient.ts`.
  - Storage: subida de QR en `lib/storage.ts` (usada por `mascotas/create`).
  - Protecciones: `middleware.ts` redirige a `/login` si no hay cookie o header; rutas protegidas: `/dashboard`, `/admin`.

- **Flujos clave y archivos**
  - Registrar mascota: `POST app/api/mascotas/create/route.ts` — valida con Zod (`lib/validation.ts`), encripta contacto, inserta en `mascotas`, genera QR que apunta a `/rescate/[id]` y sube imagen.
  - Reporte de ubicación: `POST app/api/enviar-ubicacion/route.ts` — valida, desencripta contacto servidor-side, guarda `rescate_reports` con `expires_at` y envía email al dueño.
  - Limpieza: `POST app/api/cleanup-reports/route.ts` — protegido por `x-admin-secret` o `SUPABASE_SERVICE_ROLE_KEY`.

- **Variables de entorno críticas** (ver `.env.example`)
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (admin)
  - `ENCRYPTION_SECRET` (32 bytes base64) — imprescindible para `lib/crypto.ts` y `supabaseClient`.
  - `NEXT_PUBLIC_SITE_URL` — usada para generar URLs QR en `mascotas/create`.
  - `EMAIL_SERVER`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `ADMIN_EMAIL` — nodemailer
  - `CLEANUP_SECRET` — para el endpoint de limpieza cron

- **Convenciones y patrones específicos del proyecto**
  - Minimización: nunca almacenar owner email/phone en claro — usar `encryptOwnerContact` antes de guardar (`mascotas.owner_contact_encrypted`).
  - Validación: usar Zod desde `lib/validation.ts` en cada endpoint (`MascotaSchema`, `LocationSchema`).
  - Server-only secrets: operaciones de desencriptación y envío de email deben ocurrir solo en server-side (endpoints bajo `app/api` o en `lib/*` usando `SUPABASE_SERVICE_ROLE_KEY`).
  - No exponer datos sensibles en la página pública `app/rescate/[id]/page.tsx` — muestra sólo datos no sensibles y un botón para compartir ubicación.

- **Comandos y workflows de desarrollo**
  - Instalar y ejecutar localmente:

    npm install
    npm run dev

  - Scripts útiles:
    - `npm run build` — produce build de Next.js
    - `npm run test:cleanup` — ejecuta `scripts/cleanup-test.js` para probar `cleanup-reports`.

- **Integraciones y seguridad**
  - Supabase: admin-only operations deben usar `SUPABASE_SERVICE_ROLE_KEY` en `lib/supabaseClient.ts`.
  - Emails: nodemailer configurado en endpoints; errores de envío se logean server-side (no divulgarlos al cliente).
  - Cron/cleanup: programar POST a `/api/cleanup-reports` con header `x-admin-secret` o usar el service role.

- **Ejemplos rápidos (copiar/ajustar)**
  - Generar QR URL (desde `mascotas/create`): `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/rescate/${id}`
  - Desencriptar contacto (servidor): `decryptOwnerContact(encrypted)` en `lib/supabaseClient.ts`.
  - Proteger endpoint cleanup: comprobar `x-admin-secret` === `process.env.CLEANUP_SECRET` o Authorization Bearer service role.

- **Dónde mirar primero (rápido onboarding)**
  - `README.md`, `README_SETUP.md` — setup y secrets
  - `app/api/mascotas/create/route.ts`, `app/api/enviar-ubicacion/route.ts`, `app/api/cleanup-reports/route.ts`
  - `lib/supabaseClient.ts`, `lib/crypto.ts`, `lib/validation.ts`, `lib/storage.ts`
  - `middleware.ts` y `app/layout.tsx` (rutas protegidas y layout)

Si algo no está claro o quieres que incluya ejemplos de PRs, pruebas unitarias o reglas de estilo adicionales, indícame qué agregar y lo itero.

*** Fin de instrucciones para agentes ***

## Ejemplos rápidos para contribuir

- **Plantilla mínima de PR (recomendada):**
  - Título: `feat|fix|chore(scope): breve descripción`
  - Descripción: objetivo del cambio, archivos modificados clave, riesgos y cómo probarlo localmente.
  - Checklist: `npm run dev` reproduce el flujo; variables `CLEANUP_SECRET`/email configuradas para pruebas; no exponer `ENCRYPTION_SECRET`.

- **Fragmento de test de integración (manual) — `cleanup-reports`:**
  - Uso rápido con Node (scripts/cleanup-test.js existe):

```bash
export CLEANUP_SECRET=mi-secret
export CLEANUP_URL=http://localhost:3000/api/cleanup-reports
node scripts/cleanup-test.js
```

  - Ejemplo de verificación automática rápida (Node):

```js
// test/cleanup.spec.js (ejemplo rápido)
import fetch from 'node-fetch';
const url = process.env.CLEANUP_URL || 'http://localhost:3000/api/cleanup-reports';
const secret = process.env.CLEANUP_SECRET || 'mi-secret';

async function run() {
  const res = await fetch(url, { method: 'POST', headers: { 'x-admin-secret': secret } });
  console.log('status', res.status, 'body', await res.text());
}
run();
```

- **Pruebas de endpoints que envían email:**
  - Ejecutar localmente con variables `EMAIL_*` apuntando a un servicio de pruebas (Mailtrap o cuentas SMTP de testing).
  - Los errores de envío se deben revisar en la salida del servidor (`console.error`) y no deben filtrarse al cliente.

- **Qué añadir en una PR para estos cambios:**
  - Referencia de issue/POC, pasos reproducibles (variables de entorno mínimas), y cualquier secreto necesario documentado para reviewers (no en el repo).

Si quieres que añada los archivos de test de ejemplo (`test/cleanup.spec.js`) o una plantilla de PR en `.github/PULL_REQUEST_TEMPLATE.md`, dime y los creo.
