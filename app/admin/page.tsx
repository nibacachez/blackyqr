export default async function AdminPage() {
  return (
    <section className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold">Panel Admin</h1>
      <p className="mt-4">Solo accesible por rol `admin`. Aquí se podrán ver/descargar QRs.</p>
    </section>
  );
}
