'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { savePet } from '@/lib/petStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPetPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    species: 'Perro',
    breed: '',
    color: '',
    description: '',
    ownerName: '',
    ownerPhone: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth');
    }
  }, [authLoading, user, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name.trim() || !form.ownerName.trim()) {
      toast.error('El nombre de la mascota y del dueño son obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      await savePet({ ...form, photoUrl: '' }, user.id, photoFile || undefined);
      toast.success(`${form.name} fue registrado exitosamente`);
      router.replace('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Error registrando mascota');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Registrar mascota</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div
            className="gradient-card border border-border border-dashed rounded-xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-xl object-cover" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Sube una foto</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WebP hasta 5MB</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={submitting}
            />
          </div>

          {/* Pet Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-foreground">Nombre de la mascota *</Label>
              <Input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="ej: Max"
                className="bg-muted border-border"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Especie</Label>
              <select
                value={form.species}
                onChange={(e) => update('species', e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground disabled:opacity-50"
                disabled={submitting}
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Conejo</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Raza</Label>
              <Input
                value={form.breed}
                onChange={(e) => update('breed', e.target.value)}
                placeholder="ej: Labrador"
                className="bg-muted border-border"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Color</Label>
              <Input
                value={form.color}
                onChange={(e) => update('color', e.target.value)}
                placeholder="ej: Blanco y negro"
                className="bg-muted border-border"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Características especiales, señas particulares, etc."
              className="bg-muted border-border min-h-24"
              disabled={submitting}
            />
          </div>

          {/* Owner Info */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="font-display text-lg font-semibold text-foreground">Información del dueño</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground">Tu nombre *</Label>
                <Input
                  value={form.ownerName}
                  onChange={(e) => update('ownerName', e.target.value)}
                  placeholder="Tu nombre completo"
                  className="bg-muted border-border"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Tu teléfono *</Label>
                <Input
                  value={form.ownerPhone}
                  onChange={(e) => update('ownerPhone', e.target.value)}
                  placeholder="Tu número de teléfono"
                  className="bg-muted border-border"
                  disabled={submitting}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              📍 Tu información será encriptada y solo visible para ti. Quien encuentre a tu mascota podrá compartir su ubicación sin ver tus datos.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full gradient-primary text-primary-foreground py-6 rounded-lg shadow-glow hover:opacity-90 transition-opacity"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Registrar mascota y generar QR
          </Button>
        </form>
      </div>
    </div>
  );
}
