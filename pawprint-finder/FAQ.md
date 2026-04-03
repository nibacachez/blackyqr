# FAQ - Preguntas Frecuentes

## 🤔 Preguntas Comunes

### ¿Cuál es la diferencia entre Gmail OAuth y email/contraseña?

**Gmail (OAuth):**
- ✅ Usuario: Un click, autoriza con Google
- ✅ Seguridad: Google maneja la contraseña
- ✅ Velocidad: Registro instantáneo
- ⚠️ Requisito: Cuenta de Google

**Email/Contraseña:**
- ✅ Flexible: Cualquier cuenta email
- ✅ Control: El usuario crea su contraseña
- ✓ Validación: Mínimo 8 caracteres (segura)
- ⚠️ Lento: Necesita confirmación de email

**Recomendación:** Ofrecer ambas opciones (así hacemos nosotros).

---

### ¿Cómo cambio mi contraseña?

Actualmente no hay función de "olvidé contraseña". Para agregar:

1. Crear ruta `/forgot-password`
2. Usar `supabase.auth.resetPasswordForEmail()`
3. Link en email
4. Ruta `/reset-password`
5. Cambiar contraseña

Ver documentación de Supabase.

---

### ¿Por qué pide nombre Y apellido separados?

Porque:
1. Es más amigable que un campo genérico de "nombre completo"
2. Valida el formato esperado
3. Permite búsquedas mejoradas
4. Es estándar en formularios profesionales

---

### ¿Puedo usar otro proveedor OAuth? (GitHub, Discord, etc)

**Sí, es muy simple:**

1. Ir a Supabase Dashboard > Authentication > Providers
2. Buscar el proveedor
3. Configurar credenciales
4. Habilitar
5. En el código, cambiar:
   ```tsx
   // De
   provider: 'google'
   
   // A
   provider: 'github' // o 'discord', etc
   ```

---

### ¿Dónde se guardan las contraseñas? ¿Son seguras?

**Supabase maneja la seguridad:**
- Encriptadas con bcrypt (estándar de seguridad)
- Nunca se transmiten en texto plano
- No las almacenamos en texto plano
- Certificación SOC 2 Type II
- GDPR compliant

**Más info:** https://supabase.com/docs/guides/auth

---

### ¿Cómo agrego más campos al registro?

**Ejemplo: Agregar "Teléfono"**

En `app/(auth)/auth/page.tsx`:

```tsx
// 1. Estado
const [form, setForm] = useState({
  // ... existentes
  phone: '', // ← NUEVO
});

// 2. Input
<Input
  value={form.phone}
  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
  placeholder="+34 123 456 789"
/>

// 3. Guardar en Supabase
await signUp(form.email, form.password, fullName, form.phone);
```

---

### ¿Puedo ver quién se registró?

**Sí, en Supabase:**

1. Dashboard > Authentication > Users
2. Ver lista de usuarios registrados
3. Email, fecha, proveedor

**Para ver datos personalizados:**

Crear tabla `profiles` y guardar info adicional.

---

### ¿Cómo hago que el dashboard sea privado?

Usar el componente `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <YourDashboard />
    </ProtectedRoute>
  );
}
```

---

### ¿Puedo restringir por rol (admin, user)?

**Sí:**

```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

Para esto necesitas:
1. Tabla `profiles` con columna `role`
2. Actualizar `useAuth` para cargar el rol
3. Usar en `ProtectedRoute`

---

### ¿Cómo veo los logs?

**Localmente:**
```bash
npm run dev
# Ver console del navegador (F12)
```

**En Vercel:**
1. Dashboard > [Tu Proyecto]
2. Ir a la pestaña "Logs"
3. O "Function logs" para edge functions

---

### ¿Puedo cambiar el tema (colores)?

**Sí, en `tailwind.config.ts`:**

```ts
theme: {
  extend: {
    colors: {
      primary: '#tu-color',
      secondary: '#otro-color',
    }
  }
}
```

Luego reiniciar desarrollo: `npm run dev`

---

### ¿Cómo agrego dark mode?

**Ya está incluido:**

```tsx
// En app/(auth)/auth/page.tsx o cualquier componente
<ThemedElement className="bg-background text-foreground">
  {/* Automáticamente adapta al tema */}
</ThemedElement>
```

---

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot find module '@/..."

**Causa:** Alias de TypeScript no configurado
**Solución:**
```bash
# Verificar en tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Reiniciar VS Code:
# Ctrl+Shift+P > "Reload Window"
```

---

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Causa:** `.env.local` no tiene la variable
**Solución:**
```bash
# 1. Verificar .env.local existe
ls -la .env.local

# 2. Tiene la variable?
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local

# 3. Si no, copiar y editar:
cp .env.example .env.local

# 4. Reiniciar servidor:
npm run dev
```

---

### Error: "Module not found: @supabase/supabase-js"

**Causa:** Dependencias no instaladas
**Solución:**
```bash
npm install --legacy-peer-deps
# o si ya está
npm install --force
```

---

### Error: "Port 3000 is already in use"

**Causa:** Otra aplicación usa el puerto
**Soluciones:**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

macOS/Linux:
```bash
lsof -i :3000
kill -9 [número]
```

O usa otro puerto:
```bash
npm run dev -- -p 3001
```

---

### Error: "redirect_uri_mismatch" en OAuth

**Causa:** URLs no coinciden
**Solución:**
1. Verificar en `.env.local`:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # O para producción:
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   ```

2. Verificar en Google Cloud Console:
   - Ir a Credenciales
   - Verificar URIs autorizados
   - Debe incluir:
     ```
     http://localhost:3000/auth/callback
     https://tu-dominio.vercel.app/auth/callback
     ```

3. Reiniciar servidor

---

### Error: "Invalid JSON in .env.local"

**Causa:** Caracteres especiales sin escape
**Solución:**
```bash
# Verificar con cat (Linux/Mac) o type (Windows)
cat .env.local

# Si tiene caracteres especiales, entrecomillar:
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
# En lugar de
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

### Error: "Too many requests" en Supabase

**Causa:** Rate limiting activado
**Solución:**
```bash
# Esperar unos minutos
# O consultar límites en Supabase Dashboard
```

---

### Build falla: "Type error: ..."

**Causa:** Error de TypeScript
**Solución:**
```bash
npm run type-check
# Ver el error específico

# Arreglarlo (por ejemplo, agregar tipo)
# Luego reintentar:
npm run build
```

---

## ⚡ Tips de Productividad

### 1. Hot Reload

El desarrollo automático recarga cambios. Para forzar refresh:
```bash
npm run dev
# Cambias un archivo y guarda (Ctrl+S)
# El navegador refresca automáticamente
```

### 2. Debugging en VS Code

Crea `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "request": "launch",
      "type": "node",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

Luego F5 para iniciar debugging.

### 3. Console.log Avanzado

```typescript
// ❌ Evitar
console.log("value:", value);

// ✅ Mejor
console.log({ value });

// ❌ Perder en producción
console.log("Debug:", data);

// ✅ Usar variable
const DEBUG = false;
if (DEBUG) console.log("Debug:", data);
```

### 4. Agregar Alias Personalizados

En `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@hooks/*": ["./hooks/*"]
    }
  }
}
```

Luego usar:
```tsx
import { Button } from "@components/ui/button";
import { useAuth } from "@hooks/useAuth";
```

---

## 📚 Recursos Útiles

| Recurso | URL |
|---------|-----|
| Documentación Next.js | https://nextjs.org/docs |
| Documentación Supabase | https://supabase.com/docs |
| Documentación TypeScript | https://www.typescriptlang.org/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| React Hooks | https://react.dev/reference/react/hooks |
| ESLint Rules | https://eslint.org/docs/rules |
| Vercel Docs | https://vercel.com/docs |

---

## 🎯 Próxima Funcionalidad Común

¿Qué agregar después?

1. **Recuperación de Contraseña**
   - Enviar email de reset
   - Cambiar contraseña

2. **2FA (Autenticación de dos factores)**
   - Supabase lo soporta
   - Agregara SMS o authenticator

3. **Redireccionamiento Inteligente**
   - Si eres admin → `/admin-dashboard`
   - Si eres user → `/dashboard`
   - Si no estás autenticado → `/auth`

4. **Invitaciones de Email**
   - Invitar usuarios
   - Código único
   - Expiración automática

5. **Perfil de Usuario**
   - Editar nombre, email
   - Cambiar contraseña
   - Ver historial de login

---

¿No ves tu pregunta? **Contacta al equipo de desarrollo** o crea una issue en GitHub.

---

**Última actualización:** Marzo 2026  
**Versión:** 1.0.0
