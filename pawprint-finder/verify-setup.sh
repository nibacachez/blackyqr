#!/bin/bash
# verify-setup.sh - Script para verificar que el proyecto está correctamente configurado

echo "🔍 Verificando configuración del proyecto Pawprint Finder..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Función para mostrar resultado
check_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    ERRORS=$((ERRORS + 1))
  fi
}

# Verificar Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  check_result 0 "Node.js instalado: $NODE_VERSION"
else
  check_result 1 "Node.js NO está instalado (requerido: >= 18.0.0)"
fi

# Verificar npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  check_result 0 "npm instalado: $NPM_VERSION"
else
  check_result 1 "npm NO está instalado"
fi

# Verificar node_modules
if [ -d "node_modules" ]; then
  check_result 0 "node_modules encontrado"
else
  check_result 1 "node_modules NO encontrado. Ejecuta: npm install --legacy-peer-deps"
fi

# Verificar .env.local
if [ -f ".env.local" ]; then
  check_result 0 ".env.local existe"
  
  # Verificar variables necesarias
  if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local; then
    check_result 0 "NEXT_PUBLIC_SUPABASE_URL configurado"
  else
    check_result 1 "NEXT_PUBLIC_SUPABASE_URL NO configurado en .env.local"
  fi
  
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
    check_result 0 "NEXT_PUBLIC_SUPABASE_ANON_KEY configurado"
  else
    check_result 1 "NEXT_PUBLIC_SUPABASE_ANON_KEY NO configurado en .env.local"
  fi
  
  if grep -q "NEXT_PUBLIC_APP_URL=" .env.local; then
    check_result 0 "NEXT_PUBLIC_APP_URL configurado"
  else
    check_result 1 "NEXT_PUBLIC_APP_URL NO configurado en .env.local"
  fi
else
  check_result 1 ".env.local NO existe. Copia .env.example a .env.local"
fi

# Verificar archivos clave
REQUIRED_FILES=(
  "package.json"
  "tsconfig.json"
  "next.config.js"
  "tailwind.config.ts"
  ".eslintrc.json"
  ".prettierrc"
  "middleware.ts"
  "app/layout.tsx"
  "app/(auth)/auth/page.tsx"
  "lib/supabase/client.ts"
  "hooks/useAuth.tsx"
)

echo ""
echo "📁 Verificando archivos requeridos:"
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    check_result 0 "$file"
  else
    check_result 1 "$file"
  fi
done

# Verificar directorios
REQUIRED_DIRS=(
  "app"
  "components"
  "hooks"
  "lib"
  "public"
)

echo ""
echo "📂 Verificando directorios:"
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    check_result 0 "$dir/"
  else
    check_result 1 "$dir/ NO existe"
  fi
done

# Resumen
echo ""
echo "════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Todas las verificaciones pasaron${NC}"
  echo ""
  echo "🚀 Puedes ejecutar: npm run dev"
  exit 0
else
  echo -e "${RED}✗ Se encontraron $ERRORS errores${NC}"
  echo ""
  echo "Por favor revisa los errores anteriores y ejecuta:"
  echo "  1. npm install --legacy-peer-deps"
  echo "  2. Copiar .env.example a .env.local"
  echo "  3. Actualizar las variables de entorno"
  exit 1
fi
