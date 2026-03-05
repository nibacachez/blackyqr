import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-3xl mx-auto text-center mt-12">
      <h1 className="text-4xl font-bold text-primary">BlackyQR</h1>
      <p className="mt-4 text-gray-700">Registro seguro de mascotas y QR para rescate.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/register" className="px-4 py-2 bg-primary text-white rounded">Crear cuenta</Link>
        <Link href="/login" className="px-4 py-2 border border-primary text-primary rounded">Iniciar sesión</Link>
      </div>
    </section>
  );
}
