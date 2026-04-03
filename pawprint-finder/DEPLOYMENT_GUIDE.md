# 🚀 GUÍA RÁPIDA DE DESPLIEGUE EN VERCEL

## Paso 1: Preparar tu código

```bash
# Navega a tu directorio del proyecto
cd pawprint-finder

# Instala dependencias
npm install

# Verifica que todo está bien
npm run build
npm run lint
```

## Paso 2: Crear repositorio en GitHub

```bash
# Inicializa git si no exists
git init
git add .
git commit -m "Migrate from Vite/React to Next.js with Vercel backend"
git branch -M main

# Sube a GitHub
git remote add origin https://github.com/tuusuario/pawprint-finder.git
git push -u origin main
```

## Paso 3: Conectar a Vercel

### Opción A: Desde la web (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona "Import Git Repository"
3. Conecta tu cuenta de GitHub
4. Busca y selecciona `pawprint-finder`
5. Configura el proyecto (Next.js se detectará automáticamente)

### Opción B: Desde la CLI

```bash
# Instala Vercel CLI
npm install -g vercel

# Desde tu directorio del proyecto
vercel

# Responde las preguntas y Vercel deployará
```

## Paso 4: Agregar Variables de Entorno

En el dashboard de Vercel:

1. Ve a Settings > Environment Variables
2. Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

3. **Importante**: Selecciona "Production", "Preview", y "Development" en checkboxes
4. Haz click en "Save and Redeploy"

## Paso 5: Configurar URLs de Redirección en Supabase

En el dashboard de Supabase:

1. Ve a Authentication > Redirect URLs
2. Agrega:
   - `https://your-app-name.vercel.app/auth`
   - `https://your-app-name.vercel.app/auth/callback`

## Paso 6: Actualizar CORS en Supabase (Opcional)

Si experimentas problemas CORS:

1. Ve a Project Settings > API
2. En "URL Configuration", agrega:
   - `https://your-app-name.vercel.app`

## ✅ Verificar el despliegue

1. Abre tu URL de Vercel: `https://your-app-name.vercel.app`
2. Verifica que la página de inicio carga
3. Intenta crear una cuenta
4. Registra una mascota
5. Verifica que se generó el QR

## 🔄 Despliegues automáticos

Cada vez que hagas `git push` a main:
- Vercel automaticamente construirá y deployará nueva versión
- Verifica el status en el dashboard de Vercel

## 🐛 Troubleshooting

### Error: "Build failed"
```bash
# Revisa los logs
vercel logs --scope=cuandoescriba

# O verifica localmente
npm run build
npm run lint
```

### Error: "Supabase connection failed"
- Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son correctas
- Asegúrate de que el proyecto Supabase esté activo y accesibles desde internet

### Error: "RLS policy violation"
- Verifica las políticas RLS en Supabase
- Regenera las keys si es necesario

## 📊 Monitorar en producción

1. En el dashboard de Vercel, ve a "Analytics"
2. Revisa:
   - Core Web Vitals
   - Queries por ruta
   - Errores (Edge Runtime)

## 🔐 Seguridad en Producción

**ANTES de ir a producción:**

- [ ] Cambiar NEXT_PUBLIC_APP_URL a tu dominio actual
- [ ] Revisar y actualizar RLS policies
- [ ] Habilitar MFA en Supabase
- [ ] Configurar custom domain en Vercel (opcional)
- [ ] Configurar CORS restrictivo
- [ ] Revisar logs de Vercel regularmente

## 📱 Dominio personalizado (Opcional)

1. En Vercel Settings > Domains
2. Agrega tu dominio (ej: `blackyqr.com`)
3. Actualiza DNS records según las instrucciones
4. Actualiza NEXT_PUBLIC_APP_URL con tu dominio nuevo

## 🎉 ¡Listo!

Tu aplicación está ahora en producción con:
- ✅ Backend serverless en Vercel
- ✅ Base de datos en Supabase
- ✅ Autenticación segura
- ✅ CDN global
- ✅ Auto-scaling

---

**Preguntas?** Revisa la documentación:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Guide](https://supabase.com/docs)
