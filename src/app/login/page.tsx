"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      console.log("Login successful");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 mt-16 bg-white rounded-2xl shadow-xl border border-blue-100">
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/globe.svg"
          alt="Logo Ente de Turismo Tucumán"
          width={56}
          height={56}
          className="mb-2 opacity-90"
        />
        <h1 className="text-2xl font-bold text-blue-900 text-center leading-tight">
          Calendario de Eventos
        </h1>
        <span className="text-sm font-medium text-blue-600 text-center">
          Ente de Turismo de Tucumán
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ejemplo@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
