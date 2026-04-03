@echo off
REM verify-setup.cmd - Script para verificar configuración en Windows

echo.
echo Verificando configuracion del proyecto Pawprint Finder...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
  echo [OK] Node.js instalado: %NODE_VERSION%
) else (
  echo [ERROR] Node.js NO esta instalado (requerido: ^>= 18.0.0)
)

REM Verificar npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
  echo [OK] npm instalado: %NPM_VERSION%
) else (
  echo [ERROR] npm NO esta instalado
)

REM Verificar node_modules
if exist "node_modules\" (
  echo [OK] node_modules encontrado
) else (
  echo [ERROR] node_modules NO encontrado. Ejecuta: npm install --legacy-peer-deps
)

REM Verificar .env.local
if exist ".env.local" (
  echo [OK] .env.local existe
  
  REM Verificar variables (simple check)
  findstr /M "NEXT_PUBLIC_SUPABASE_URL=" .env.local >nul
  if %ERRORLEVEL% EQU 0 (
    echo [OK] NEXT_PUBLIC_SUPABASE_URL configurado
  ) else (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_URL NO configurado
  )
  
  findstr /M "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local >nul
  if %ERRORLEVEL% EQU 0 (
    echo [OK] NEXT_PUBLIC_SUPABASE_ANON_KEY configurado
  ) else (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_ANON_KEY NO configurado
  )
  
  findstr /M "NEXT_PUBLIC_APP_URL=" .env.local >nul
  if %ERRORLEVEL% EQU 0 (
    echo [OK] NEXT_PUBLIC_APP_URL configurado
  ) else (
    echo [ERROR] NEXT_PUBLIC_APP_URL NO configurado
  )
) else (
  echo [ERROR] .env.local NO existe. Copia .env.example a .env.local
)

echo.
echo Verificando archivos requeridos:
if exist "package.json" echo [OK] package.json
if exist "tsconfig.json" echo [OK] tsconfig.json
if exist "next.config.js" echo [OK] next.config.js
if exist "tailwind.config.ts" echo [OK] tailwind.config.ts
if exist ".eslintrc.json" echo [OK] .eslintrc.json
if exist ".prettierrc" echo [OK] .prettierrc
if exist "middleware.ts" echo [OK] middleware.ts
if exist "app\layout.tsx" echo [OK] app\layout.tsx

echo.
echo Verificando directorios:
if exist "app\" echo [OK] app\
if exist "components\" echo [OK] components\
if exist "hooks\" echo [OK] hooks\
if exist "lib\" echo [OK] lib\
if exist "public\" echo [OK] public\

echo.
echo ════════════════════════════════════════════
echo.
echo Si todo esta OK, ejecuta: npm run dev
echo.
pause
