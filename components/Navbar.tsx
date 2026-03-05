import Link from 'next/link';

export default function Navbar(){
  return (
    <nav className="bg-primary text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold">B</div>
          <Link href="/" className="font-semibold">BlackyQR</Link>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tienda">Tienda</Link>
        </div>
      </div>
    </nav>
  )
}
