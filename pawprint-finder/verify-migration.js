/**
 * VERIFICACIÓN FINAL DE MIGRACIÓN A NEXT.JS
 * 
 * Ejecuta este file para verificar que todo está en su lugar
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Pages
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'app/(auth)/auth/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/register/page.tsx',
  'app/(dashboard)/admin-dashboard/page.tsx',
  'app/rescue/[petId]/page.tsx',
  
  // API Routes
  'app/api/auth/user/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/pets/route.ts',
  'app/api/pets/[id]/route.ts',
  
  // Components
  'components/Header.tsx',
  'components/PetCard.tsx',
  'components/QRCodeDisplay.tsx',
  'components/theme-provider.tsx',
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/dialog.tsx',
  
  // Lib
  'lib/utils.ts',
  'lib/petStore.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/supabase/types.ts',
  
  // Hooks
  'hooks/useAuth.tsx',
  
  // Middleware
  'middleware.ts',
  
  // Config
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  '.env.local.example',
  '.prettierrc',
  'jest.config.js',
];

const missingFiles = [];
const foundFiles = [];

console.log('🔍 Verificando archivos...\n');

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    foundFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file}`);
  }
});

console.log('\n📊 RESUMEN');
console.log('━'.repeat(50));
console.log(`Total de archivos: ${requiredFiles.length}`);
console.log(`Encontrados: ${foundFiles.length} ✅`);
console.log(`Faltantes: ${missingFiles.length} ❌`);

if (missingFiles.length > 0) {
  console.log('\n⚠️  ARCHIVOS FALTANTES:');
  missingFiles.forEach((file) => {
    console.log(`   - ${file}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODO LISTO! La migración está completa.\n');
  console.log('Próximos pasos:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('3. Verifica http://localhost:3000');
  process.exit(0);
}
