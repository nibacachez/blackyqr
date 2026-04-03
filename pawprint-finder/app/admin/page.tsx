'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export default function AdminPage() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      toast.error('Acceso denegado. No eres administrador.');
      router.push('/');
    }
  }, [user, userRole, loading, router]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
    } catch (error) {
      toast.error('Error al actualizar rol');
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Panel de administración 👑
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold transition"
          >
            Volver al inicio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <p className="text-blue-600 dark:text-blue-300 text-sm font-semibold">Total de usuarios</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{users.length}</p>
          </div>

          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <p className="text-green-600 dark:text-green-300 text-sm font-semibold">Administradores</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <p className="text-purple-600 dark:text-purple-300 text-sm font-semibold">Usuarios regulares</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestión de usuarios</h2>
          </div>

          {loadingUsers ? (
            <div className="px-6 py-8 text-center">
              <p>Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">No hay usuarios aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Rol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <td className="px-6 py-4">
                        <p className="text-slate-900 dark:text-white font-medium">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            user.role === 'admin'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {user.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2 flex">
                        {user.role === 'user' ? (
                          <button
                            onClick={() => updateUserRole(user.id, 'admin')}
                            disabled={updatingUserId === user.id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded text-sm font-semibold transition"
                          >
                            {updatingUserId === user.id ? 'Actualizando...' : 'Hacer admin'}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserRole(user.id, 'user')}
                            disabled={updatingUserId === user.id}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded text-sm font-semibold transition"
                          >
                            {updatingUserId === user.id ? 'Actualizando...' : 'Quitar admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
