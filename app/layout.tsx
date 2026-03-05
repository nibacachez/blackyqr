import "../globals.css";
import React from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "BlackyQR",
  description: "Plataforma segura para registrar mascotas y generar QR"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
