"use client";
import { useState } from "react";
import { z } from "zod";
import { RegisterSchema } from "../../lib/validation";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = RegisterSchema.safeParse({ email, password });
    if (!parsed.success) return alert("Entrada inválida");

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert('Error al registrar: ' + error.message);
    // Supabase may send confirmation email depending on settings
    alert('Registro exitoso. Revisa tu email para confirmar (si aplica).');
    router.push('/login');
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-semibold">Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input aria-label="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
        <input aria-label="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña (mín 8)" type="password" className="p-2 border rounded" />
        <button type="submit" className="mt-2 bg-primary text-white py-2 rounded">Registrar</button>
      </form>
    </div>
  );
}
