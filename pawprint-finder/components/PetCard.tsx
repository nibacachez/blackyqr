'use client';

import type { Pet } from '@/lib/petStore';
import { Trash2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QRCodeDisplay from './QRCodeDisplay';

interface PetCardProps {
  pet: Pet;
  reportsCount: number;
  onDelete: (id: string) => void;
  isOwner?: boolean;
}

export default function PetCard({
  pet,
  reportsCount,
  onDelete,
  isOwner = false,
}: PetCardProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <div className="gradient-card rounded-xl border border-border overflow-hidden shadow-card group hover:border-primary/30 transition-colors">
        <div className="aspect-[4/3] overflow-hidden relative">
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-4xl">
              🐾
            </div>
          )}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-foreground">
            {pet.species}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.breed} · {pet.color}
            </p>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{pet.description}</p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>📍 {reportsCount} reporte{reportsCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQR(true)}
              className="flex-1 text-xs"
            >
              <QrCode className="w-4 h-4 mr-1" />
              Ver QR
            </Button>
            {isOwner && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(pet.id)}
                className="text-xs"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Código QR de {pet.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <QRCodeDisplay
              petId={pet.id}
              petName={pet.name}
              size={300}
              showDownloadButton={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
