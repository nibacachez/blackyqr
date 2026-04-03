'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPetById, saveReport } from '@/lib/petStore';
import type { Pet } from '@/lib/petStore';
import { MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function RescuePage() {
  const params = useParams();
  const petId = params.petId as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!petId) {
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      try {
        const pet = await getPetById(petId);
        setPet(pet);
      } catch (error) {
        console.error('Error loading pet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleShareLocation = async () => {
    if (!petId || !pet) return;

    setSending(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      await saveReport(
        petId,
        position.coords.latitude,
        position.coords.longitude,
        message.trim() || undefined
      );

      setSent(true);
      toast.success('¡Ubicación compartida exitosamente!');
    } catch (error: any) {
      console.error('Error sharing location:', error);
      toast.error('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso al GPS.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="gradient-card rounded-xl border border-border p-8 text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Mascota no encontrada</h1>
          <p className="text-muted-foreground">
            Este código QR no está asociado a ninguna mascota registrada. Por favor contacta al dueño.
          </p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="gradient-card rounded-xl border border-border p-8 text-center max-w-sm">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">¡Gracias por tu ayuda!</h1>
          <p className="text-muted-foreground">
            Tu ubicación fue compartida con el dueño de <strong className="text-foreground">{pet.name}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            El dueño se pondrá en contacto contigo lo antes posible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 h-64 gradient-glow pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Pet Info */}
          <div className="gradient-card rounded-xl border border-border p-8 shadow-card mb-6">
            <div className="flex gap-6">
              {pet.photoUrl ? (
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-4xl">🐾</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">{pet.name}</h1>
                <div className="space-y-1 text-muted-foreground">
                  <p>{pet.species} · {pet.breed}</p>
                  <p>Color: {pet.color}</p>
                  {pet.description && <p>Características: {pet.description}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Owner Contact */}
          {pet.ownerName && (
            <div className="gradient-card rounded-xl border border-border p-6 shadow-card mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Contacto del dueño</h2>
              <p className="text-foreground mb-1">
                <strong>{pet.ownerName}</strong>
              </p>
              <p className="text-muted-foreground">{pet.ownerPhone}</p>
            </div>
          )}

          {/* Location Sharing */}
          <div className="gradient-card rounded-xl border border-border p-8 shadow-card">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">¿Encontraste a {pet.name}?</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Mensaje (opcional)
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntale al dueño dónde lo encontraste, en qué condiciones está, etc."
                  className="bg-muted border-border min-h-20"
                  disabled={sending}
                />
              </div>

              <Button
                onClick={handleShareLocation}
                disabled={sending}
                className="w-full gradient-primary text-primary-foreground py-6 text-lg rounded-lg shadow-glow hover:opacity-90 transition-opacity"
              >
                {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <MapPin className="w-5 h-5 mr-2" />
                Compartir ubicación
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Tu información personal está protegida. Solo se compartirá tu ubicación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
