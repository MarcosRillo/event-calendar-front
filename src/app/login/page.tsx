"use client";

import Image from "next/image";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function Login() {
  const { formData, error, loading, handleChange, handleSubmit } = useLoginForm();

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
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
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
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
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
