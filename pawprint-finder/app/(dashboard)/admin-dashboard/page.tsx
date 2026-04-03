'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllPetsForAdmin, downloadQRCodeAsImage } from '@/lib/petStore';
import type { Pet } from '@/lib/petStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Loader2, Search, Plus } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, userRole } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, userRole, router]);

  useEffect(() => {
    if (!user || userRole !== 'admin') return;

    const loadPets = async () => {
      try {
        const data = await getAllPetsForAdmin();
        setPets(data);
      } catch (error) {
        console.error('Error loading pets:', error);
        toast.error(
          'Error cargando las mascotas: ' + (error instanceof Error ? error.message : 'Unknown error')
        );
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [user, userRole]);

  const handleDownloadQR = async (petId: string, petName: string) => {
    setDownloadingId(petId);
    try {
      await downloadQRCodeAsImage(petId, petName);
      toast.success(`QR de ${petName} descargado`);
    } catch {
      toast.error('Error descargando el QR');
    } finally {
      setDownloadingId('');
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.ownerPhone.includes(searchTerm)
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Panel Admin</h1>
            <p className="text-muted-foreground">Gestiona todos los códigos QR de mascotas</p>
          </div>
          <Button className="gradient-primary text-primary-foreground rounded-lg shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Nueva mascota
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre, dueño o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>

        {/* Table */}
        <div className="gradient-card rounded-xl border border-border overflow-hidden shadow-card">
          {filteredPets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron mascotas' : 'No hay mascotas registradas'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Mascota</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Especie</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dueño</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Registrado</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map((pet) => (
                    <tr key={pet.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {pet.photoUrl && (
                            <img
                              src={pet.photoUrl}
                              alt={pet.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{pet.name}</p>
                            <p className="text-sm text-muted-foreground">{pet.breed}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{pet.species}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{pet.ownerName}</td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{pet.ownerPhone}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(pet.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadQR(pet.id, pet.name)}
                          disabled={downloadingId === pet.id}
                          className="text-xs"
                        >
                          {downloadingId === pet.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-1" />
                              QR
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Total: {filteredPets.length} de {pets.length} mascotas
        </p>
      </div>
    </div>
  );
}
