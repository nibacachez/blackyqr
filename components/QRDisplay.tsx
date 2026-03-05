import React from 'react';

export default function QRDisplay({ dataUrl }: { dataUrl: string }){
  return (
    <div className="p-2 border rounded inline-block">
      <img src={dataUrl} alt="QR" />
    </div>
  );
}
