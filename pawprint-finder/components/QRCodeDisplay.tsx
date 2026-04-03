'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { downloadQRCodeAsImage } from '@/lib/petStore';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  petId: string;
  petName?: string;
  size?: number;
  showDownloadButton?: boolean;
}

export default function QRCodeDisplay({
  petId,
  petName,
  size = 200,
  showDownloadButton = false,
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const rescueUrl = `${process.env.NEXT_PUBLIC_APP_URL}/rescue/${petId}`;

  const handleDownload = async () => {
    if (!petName) {
      toast.error('Se requiere el nombre de la mascota para descargar');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadQRCodeAsImage(petId, petName);
      toast.success('QR descargado exitosamente');
    } catch {
      toast.error('Error descargando el QR');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-lg bg-foreground p-3">
        <QRCode
          value={rescueUrl}
          size={size}
          bgColor="hsl(220, 20%, 92%)"
          fgColor="hsl(230, 25%, 7%)"
          level="H"
          includeMargin={true}
        />
      </div>
      {showDownloadButton && petName && (
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="sm"
          className="gradient-primary text-primary-foreground"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Descargando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </>
          )}
        </Button>
      )}
      <p className="text-xs text-muted-foreground text-center">
        Escanea este código para reportar a {petName && `a ${petName}`}
      </p>
    </div>
  );
}
