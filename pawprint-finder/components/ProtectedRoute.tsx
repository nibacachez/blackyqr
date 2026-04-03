'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'moderator';
  redirectTo?: string;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * 
 * Uso:
 * ```tsx
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 * ```
 * 
 * Con rol requerido:
 * ```tsx
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, userRole } = useAuth();

  useEffect(() => {
    if (loading) return;

    // No hay usuario autenticado
    if (!user) {
      router.replace(redirectTo);
      return;
    }

    // Se requiere un rol específico
    if (requiredRole && userRole !== requiredRole) {
      router.replace('/unauthorized'); // o redirigir a un dashboard por defecto
      return;
    }
  }, [user, loading, userRole, router, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // No renderizar nada si no hay usuario
  if (!user) {
    return null;
  }

  // Verificar rol si es requerido
  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
