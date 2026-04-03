'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode.react';

export default function Home() {
  const { user, loading, userRole, signOut } = useAuth();
  const router = useRouter();
  const [appUrl, setAppUrl] = useState<string>('');

  useEffect(() => {
    // Set the app URL for the QR code
    setAppUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Pawprint Finder 🐾
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Sistema inteligente de QR para mascotas
          </p>
          
          {/* QR Code Section */}
          <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-lg p-6 inline-block">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
              Escanea para acceder a la app:
            </p>
            <QRCode 
              value={appUrl} 
              size={200} 
              level="H"
              includeMargin={true}
              fgColor="#000"
              bgColor="#fff"
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
              {appUrl}
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Inicia sesión
            </Link>
            <Link
              href="/auth?signup=true"
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold transition"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Bienvenido, {user.email}
          </h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>

        {userRole === 'admin' && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Panel de Administrador 👑
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Tienes acceso a funciones administrativas.
            </p>
            <Link
              href="/admin"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Ir al Panel Admin
            </Link>
          </div>
        )}

        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Tu Información
          </h2>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Rol:</span> {userRole === 'admin' ? '👑 Administrador' : '👤 Usuario'}</p>
            <p><span className="font-semibold">ID:</span> {user.id.substring(0, 8)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
