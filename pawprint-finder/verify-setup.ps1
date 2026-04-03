# verify-setup.ps1 - Script para verificar configuración del proyecto en Windows

Write-Host "🔍 Verificando configuración del proyecto Pawprint Finder..." -ForegroundColor Cyan
Write-Host ""

# Contador de errores
$errors = 0

# Función para mostrar resultado
function Check-Result {
  param(
    [bool]$success,
    [string]$message
  )
  
  if ($success) {
    Write-Host "✓" -ForegroundColor Green -NoNewline
    Write-Host " $message"
  }
  else {
    Write-Host "✗" -ForegroundColor Red -NoNewline
    Write-Host " $message"
    $script:errors += 1
  }
}

# Verificar Node.js
$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if ($hasNode) {
  $nodeVersion = node -v
  Check-Result $true "Node.js instalado: $nodeVersion"
}
else {
  Check-Result $false "Node.js NO está instalado (requerido: >= 18.0.0)"
}

# Verificar npm
$hasNpm = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)
if ($hasNpm) {
  $npmVersion = npm -v
  Check-Result $true "npm instalado: $npmVersion"
}
else {
  Check-Result $false "npm NO está instalado"
}

# Verificar node_modules
if (Test-Path "node_modules") {
  Check-Result $true "node_modules encontrado"
}
else {
  Check-Result $false "node_modules NO encontrado. Ejecuta: npm install --legacy-peer-deps"
}

# Verificar .env.local
if (Test-Path ".env.local") {
  Check-Result $true ".env.local existe"
  
  # Leer archivo
  $envContent = Get-Content ".env.local"
  
  # Verificar variables
  if ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL=") {
    Check-Result $true "NEXT_PUBLIC_SUPABASE_URL configurado"
  }
  else {
    Check-Result $false "NEXT_PUBLIC_SUPABASE_URL NO configurado"
  }
  
  if ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_ANON_KEY=") {
    Check-Result $true "NEXT_PUBLIC_SUPABASE_ANON_KEY configurado"
  }
  else {
    Check-Result $false "NEXT_PUBLIC_SUPABASE_ANON_KEY NO configurado"
  }
  
  if ($envContent | Select-String "NEXT_PUBLIC_APP_URL=") {
    Check-Result $true "NEXT_PUBLIC_APP_URL configurado"
  }
  else {
    Check-Result $false "NEXT_PUBLIC_APP_URL NO configurado"
  }
}
else {
  Check-Result $false ".env.local NO existe. Copia .env.example a .env.local"
}

# Verificar archivos clave
$requiredFiles = @(
  "package.json",
  "tsconfig.json",
  "next.config.js",
  "tailwind.config.ts",
  ".eslintrc.json",
  ".prettierrc",
  "middleware.ts",
  "app\layout.tsx",
  "app\(auth)\auth\page.tsx",
  "lib\supabase\client.ts",
  "hooks\useAuth.tsx"
)

Write-Host ""
Write-Host "📁 Verificando archivos requeridos:" -ForegroundColor Cyan
foreach ($file in $requiredFiles) {
  $exists = Test-Path $file
  Check-Result $exists $file
}

# Verificar directorios
$requiredDirs = @(
  "app",
  "components",
  "hooks",
  "lib",
  "public"
)

Write-Host ""
Write-Host "📂 Verificando directorios:" -ForegroundColor Cyan
foreach ($dir in $requiredDirs) {
  $exists = Test-Path $dir -PathType Container
  Check-Result $exists "$dir\"
}

# Resumen
Write-Host ""
Write-Host "════════════════════════════════════════════"
if ($errors -eq 0) {
  Write-Host "✓ Todas las verificaciones pasaron" -ForegroundColor Green
  Write-Host ""
  Write-Host "🚀 Puedes ejecutar: npm run dev" -ForegroundColor Green
  exit 0
}
else {
  Write-Host "✗ Se encontraron $errors errores" -ForegroundColor Red
  Write-Host ""
  Write-Host "Por favor revisa los errores anteriores:" -ForegroundColor Yellow
  Write-Host "  1. npm install --legacy-peer-deps"
  Write-Host "  2. Copiar .env.example a .env.local"
  Write-Host "  3. Actualizar las variables de entorno"
  exit 1
}
