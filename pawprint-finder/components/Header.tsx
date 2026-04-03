'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Header() {
  const router = useRouter();
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
      toast.success('Sesión cerrada');
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Blacky<span className="text-primary">QR</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <Link href="/admin-dashboard">
              <Button variant="outline" size="sm" className="text-xs">
                Panel Admin
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-3">
            <span>{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
