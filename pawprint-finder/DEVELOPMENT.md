# Guía de Desarrollo Local

## Configuración Inicial

### 1. Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0 (o pnpm/yarn/bun)
- Git
- Una cuenta en Supabase
- Una cuenta en Google Cloud Console (para OAuth)

### 2. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/[your-org]/pawprint-finder.git
cd pawprint-finder

# Instalar dependencias
npm install --legacy-peer-deps
# o con pnpm (más rápido)
pnpm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local con tus valores
# Variables necesarias:
# NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-clave-anonima]
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Obtener credenciales de Supabase:
1. Ir a https://supabase.com/dashboard
2. Seleccionar tu proyecto
3. Settings > API > Copiar valores de la sección "Project API Keys"

### 4. Ejecutar en Desarrollo

```bash
npm run dev
# o
pnpm dev
```

Abrirá automáticamente http://localhost:3000

## Desarrollo Diario

### Estructura de Trabajo

```
Feature/bug → Branch → Desarrollo → Testing Local → Pull Request → Merge → Deploy
```

### Crear una Rama de Feature

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama
git checkout -b feature/nombre-del-feature

# O para bugs
git checkout -b fix/nombre-del-bug
```

### Commands Útiles

```bash
# Formato de código
npm run format

# Verificar errores de linting
npm run lint

# Arreglar problemas de ESLint automáticamente
npm run lint:fix

# Verificar tipos de TypeScript
npm run type-check

# Ejecutar tests
npm test

# Watch mode para tests
npm run test:watch

# Build de producción (para probar localmente)
npm run build
npm start
```

### Ciclo de Desarrollo

1. **Crear componente/función:**
```bash
# Crear en la carpeta apropiada
touch components/SelectPetBreed.tsx
```

2. **Escribir código con tipos:**
```tsx
interface SelectPetBreedProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectPetBreed({
  value,
  onChange,
  disabled = false,
}: SelectPetBreedProps) {
  // Implementación
}
```

3. **Escribir test (si aplica):**
```bash
# Tests van en __tests__ o junto al componente
# Nombre: ComponentName.test.ts(x)
npm test SelectPetBreed
```

4. **Formato y linting:**
```bash
npm run lint:fix
npm run format
npm run type-check
```

5. **Commit:**
```bash
git add .
git commit -m "feat: agregar componente SelectPetBreed

- Permitir seleccionar raza de mascota
- Validación de entrada
- Estilos responsivos"

git push origin feature/nombre
```

## Testing en Desarrollo

### Casos de Prueba Manuales

#### Autenticación
- [ ] Registro con Gmail
- [ ] Registro con email/contraseña
- [ ] Login con email/contraseña
- [ ] Logout
- [ ] Cambio de contraseña
- [ ] Reset de contraseña

#### Validación
- [ ] Contraseña < 8 caracteres
- [ ] Contraseña sin mayúsculas
- [ ] Contraseña sin minúsculas
- [ ] Contraseña sin números
- [ ] Email inválido
- [ ] Campo requerido vacío

#### UI/UX
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Responsive en desktop
- [ ] Tema claro funciona
- [ ] Tema oscuro funciona
- [ ] Animaciones suaves

### Testing Automated

```bash
# Crear test file
touch app/__tests__/auth.test.tsx

# Test content
import { render, screen } from '@testing-library/react';
import AuthPage from '@/app/(auth)/auth/page';

describe('AuthPage', () => {
  it('should render login form', () => {
    render(<AuthPage />);
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
  });
});

# Ejecutar
npm test
```

## Debugging

### Usando Console

```tsx
// En componentes (cliente)
console.log('Debug:', variable);

// En servidor
import { logger } from '@/lib/logger'; // Si existe
```

### VS Code Debugger

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### DevTools del Navegador

- F12 en Chrome/Firefox
- Ir a Console > Ver errores
- Network tab para ver requests API
- Application > Storage para verificar cookies/localStorage

## Performance

### Analizar Performance

```bash
# Lighthouse
npm run build
npm start
# Luego Ctrl+Shift+J > Lighthouse tab
```

### Optimizaciones Comunes

```tsx
// ❌ Evitar renders innecesarios
const value = expensiveOperation(); // En cada render

// ✅ Usar useMemo
const value = useMemo(() => expensiveOperation(), [dependencies]);

// ❌ Llamadas a API en componentes
function MyComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
}

// ✅ Usar React Query
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });
```

## Troubleshooting

### Error: Cannot find module '@/...'

Solución:
```bash
# Verificar tsconfig.json tiene:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Reiniciar servidor VS Code
```

### Port 3000 ya está en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :3000
kill -9 [PID]

# O usar otro puerto
npm run dev -- -p 3001
```

### Build falla

```bash
# Limpiar cache
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

## Git Workflow

### Branches

- `main`: Producción
- `develop`: Desarrollo
- `feature/*`: Nuevas características
- `fix/*`: Correcciones de bugs
- `refactor/*`: Refactorización

### Commits

```bash
# Buena práctica
git commit -m "feat: descripción breve

Descripción más larga explicando por qué el cambio.
- Punto 1
- Punto 2

Fixes #123
"

# Conventional Commits
# feat: nueva característica
# fix: corrección de bug
# docs: documentación
# style: cambios de formato
# refactor: refactorización
# test: agregar tests
# chore: tareas de mantenimiento
```

### Pull Requests

- Descripción clara del cambio
- Link a issues relacionados
- Screenshots si es cambio visual
- Checklist de testing

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Preguntas Frecuentes

**P: ¿Cómo agregar una nueva variable de entorno?**
R: Agregarla a `.env.example`, luego a `.env.local`. Si es pública, prefixar con `NEXT_PUBLIC_`.

**P: ¿Cómo conectarme a una base de datos diferente?**
R: Cambiar `NEXT_PUBLIC_SUPABASE_URL` en `.env.local` y usar ese proyecto de Supabase.

**P: ¿Hay que hacer build antes de commit?**
R: No, git usará ESLint/TypeScript automáticamente si tienes husky configurado.

## Soporte

Contactar al equipo de desarrollo o crear una issue en GitHub.
