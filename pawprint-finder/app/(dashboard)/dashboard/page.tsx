'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPets, deletePet, getReportsCount } from '@/lib/petStore';
import type { Pet } from '@/lib/petStore';
import PetCard from '@/components/PetCard';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, userRole } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth');
      } else if (userRole === 'admin') {
        router.replace('/admin-dashboard');
      }
    }
  }, [authLoading, user, userRole, router]);

  const { data: pets = [], isLoading, error } = useQuery({
    queryKey: ['pets', user?.id],
    queryFn: () => (user ? getPets(user.id) : Promise.resolve([])),
    enabled: !!user && userRole !== 'admin',
  });

  const { data: reportCounts = {} } = useQuery({
    queryKey: ['reportCounts', pets],
    queryFn: async () => {
      const counts: Record<string, number> = {};
      for (const pet of pets) {
        counts[pet.id] = await getReportsCount(pet.id);
      }
      return counts;
    },
    enabled: pets.length > 0,
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id);
      queryClient.invalidateQueries({ queryKey: ['pets', user?.id] });
      toast.success('Mascota eliminada');
    } catch {
      toast.error('Error eliminando mascota');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground font-semibold mb-2">Error cargando mascotas</p>
          <p className="text-muted-foreground">{(error as any).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Mis mascotas</h1>
            <p className="text-muted-foreground">Gestiona los códigos QR de tus mascotas</p>
          </div>
          <Link href="/register">
            <Button className="gradient-primary text-primary-foreground rounded-lg shadow-glow hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4 mr-2" />
              Nueva mascota
            </Button>
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="gradient-card rounded-xl border border-border p-12 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">No tienes mascotas registradas</h2>
            <p className="text-muted-foreground mb-6">Comienza registrando tu primera mascota para recibir un código QR</p>
            <Link href="/register">
              <Button className="gradient-primary text-primary-foreground rounded-lg shadow-glow hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4 mr-2" />
                Registrar mascotas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                reportsCount={reportCounts[pet.id] || 0}
                onDelete={handleDelete}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
