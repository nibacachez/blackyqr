#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores ANSI
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

let errors = 0;

function checkResult(success, message) {
  if (success) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    errors++;
  }
}

console.log(
  `\n${colors.cyan}🔍 Verificando configuración del proyecto Pawprint Finder...${colors.reset}\n`
);

// Verificar Node.js
try {
  const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
  checkResult(true, `Node.js instalado: ${nodeVersion}`);
} catch {
  checkResult(false, 'Node.js NO está instalado (requerido: >= 18.0.0)');
}

// Verificar npm
try {
  const npmVersion = execSync('npm -v', { encoding: 'utf-8' }).trim();
  checkResult(true, `npm instalado: ${npmVersion}`);
} catch {
  checkResult(false, 'npm NO está instalado');
}

// Verificar node_modules
const nodeModulesExists = fs.existsSync('node_modules');
checkResult(nodeModulesExists, 'node_modules encontrado');

// Verificar .env.local
const envLocalExists = fs.existsSync('.env.local');
checkResult(envLocalExists, '.env.local existe');

if (envLocalExists) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  
  checkResult(
    envContent.includes('NEXT_PUBLIC_SUPABASE_URL='),
    'NEXT_PUBLIC_SUPABASE_URL configurado'
  );
  
  checkResult(
    envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY='),
    'NEXT_PUBLIC_SUPABASE_ANON_KEY configurado'
  );
  
  checkResult(
    envContent.includes('NEXT_PUBLIC_APP_URL='),
    'NEXT_PUBLIC_APP_URL configurado'
  );
}

// Verificar archivos clave
console.log(`\n${colors.cyan}📁 Verificando archivos requeridos:${colors.reset}`);

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  '.eslintrc.json',
  '.prettierrc',
  'middleware.ts',
  path.join('app', 'layout.tsx'),
  path.join('app', '(auth)', 'auth', 'page.tsx'),
  path.join('lib', 'supabase', 'client.ts'),
  path.join('hooks', 'useAuth.tsx'),
];

for (const file of requiredFiles) {
  const exists = fs.existsSync(file);
  checkResult(exists, file);
}

// Verificar directorios
console.log(`\n${colors.cyan}📂 Verificando directorios:${colors.reset}`);

const requiredDirs = ['app', 'components', 'hooks', 'lib', 'public'];

for (const dir of requiredDirs) {
  const exists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  checkResult(exists, `${dir}/`);
}

// Resumen
console.log('\n════════════════════════════════════════════');

if (errors === 0) {
  console.log(
    `${colors.green}✓ Todas las verificaciones pasaron${colors.reset}\n`
  );
  console.log(`${colors.green}🚀 Puedes ejecutar: npm run dev${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(
    `${colors.red}✗ Se encontraron ${errors} errores${colors.reset}\n`
  );
  console.log(`${colors.yellow}Por favor revisa los errores anteriores:${colors.reset}`);
  console.log('  1. npm install --legacy-peer-deps');
  console.log('  2. Copiar .env.example a .env.local');
  console.log('  3. Actualizar las variables de entorno\n');
  process.exit(1);
}
