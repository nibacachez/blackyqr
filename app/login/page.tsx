"use client";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) return alert("Entrada inválida");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Error al iniciar sesión: ' + error.message);
    // On success, redirect to dashboard
    router.push('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input aria-label="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
        <input aria-label="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" className="p-2 border rounded" />
        <button type="submit" className="mt-2 bg-primary text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
