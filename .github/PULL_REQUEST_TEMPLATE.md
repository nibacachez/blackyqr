<!-- Título: feat|fix|chore(scope): breve descripción -->

## Qué cambia
Breve resumen del objetivo del PR (1-2 líneas).

## Archivos clave modificados
- `app/...`
- `lib/...`

## Cómo probar localmente
1. Copia `.env.example` → `.env.local` y completa las variables mínimas: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ENCRYPTION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `EMAIL_*`, `CLEANUP_SECRET`.
2. Ejecuta:

```bash
npm install
npm run dev
```
3. Reproducir el flujo afectado (por ejemplo, crear mascota o enviar ubicación).

## Checklist
- [ ] `npm run dev` reproduce el flujo descrito
- [ ] No se exponen secrets en el repo
- [ ] Validación Zod en los endpoints afectados
- [ ] Si aplica: añadí/actualicé tests o script de verificación

## Notas para reviewers
- Variables de entorno necesarias para verificar: `CLEANUP_SECRET`, `EMAIL_*`, `ENCRYPTION_SECRET`.
- Cambios que afectan privacidad (encriptación, exposición de datos): describir riesgos y mitigaciones.
