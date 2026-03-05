#!/bin/bash

# BlackyQR Setup Script — instala dependencias y prepara el proyecto

set -e

echo "🚀 BlackyQR Setup — Instalando dependencias..."
npm install

echo "✅ Dependencias instaladas."
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Configura Supabase:"
echo "   - Crea un proyecto en https://supabase.com"
echo "   - Copia SUPABASE_URL y keys a .env.local"
echo "   - Ejecuta 'npm run setup:db' para crear tablas (ver más abajo)"
echo ""
echo "2. Generador de secretos (opcional):"
echo "   - ENCRYPTION_SECRET: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
echo "   - CLEANUP_SECRET: openssl rand -base64 32"
echo ""
echo "3. Configurar SMTP (Gmail):"
echo "   - Usa App Password en Gmail (no tu contraseña normal)"
echo "   - Añade a .env.local"
echo ""
echo "4. Ejecutar localmente:"
echo "   npm run dev"
echo "   Abre http://localhost:3000"
echo ""
echo "5. Deploy en Vercel:"
echo "   - git push a GitHub"
echo "   - Usa Vercel CLI: vercel"
echo "   - O conecta repo en Vercel Dashboard"
echo ""
echo "6. Base de datos en Supabase:"
echo "   - En SQL Editor, pega el contenido de supabase.sql"
echo "   - Crea bucket 'qrcodes' en Storage (público)"
echo ""
echo "✨ Listo para desarrollar. ¡Lee README.md para más detalles!"
