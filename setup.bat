@echo off
REM BlackyQR Setup Script para Windows — instala dependencias y prepara el proyecto

echo.
echo 🚀 BlackyQR Setup — Instalando dependencias...
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias.
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas.
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Configura Supabase:
echo    - Crea un proyecto en https://supabase.com
echo    - Copia SUPABASE_URL y keys a .env.local
echo    - Ejecuta los comandos en supabase.sql en el SQL Editor
echo.
echo 2. Generador de secretos:
echo    - ENCRYPTION_SECRET:
echo      node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo    - CLEANUP_SECRET: openssl rand -base64 32 (o genera uno aleatorio)
echo.
echo 3. Configurar SMTP (Gmail):
echo    - Usa App Password en Gmail (no tu contraseña normal)
echo    - Añade a .env.local
echo.
echo 4. Ejecutar localmente:
echo    npm run dev
echo    Abre http://localhost:3000
echo.
echo 5. Deploy en Vercel:
echo    - git push a GitHub
echo    - Usa Vercel CLI: vercel
echo    - O conecta repo en Vercel Dashboard
echo.
echo 6. Base de datos en Supabase:
echo    - En SQL Editor, pega el contenido de supabase.sql
echo    - Crea bucket 'qrcodes' en Storage (público opcional)
echo.
echo ✨ Listo para desarrollar. ¡Lee README.md para más detalles!
echo.
