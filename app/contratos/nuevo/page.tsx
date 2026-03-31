"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearBorradorContratoAction } from "@/actions/contratos.actions";

const TIPOS = [
  {
    tipo: "vivienda" as const,
    label: "Vivienda",
    descripcion: "Alquiler residencial",
    icon: "🏠",
  },
  {
    tipo: "comercial" as const,
    label: "Comercial",
    descripcion: "Local u oficina",
    icon: "🏢",
  },
  {
    tipo: "galpon" as const,
    label: "Galpón",
    descripcion: "Depósito o uso industrial",
    icon: "🏭",
  },
];

export default function NuevoContratoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelect(tipo: "vivienda" | "comercial" | "galpon") {
    setLoading(tipo);
    const [data] = await crearBorradorContratoAction({ tipo });
    if (data) {
      router.push(`/contratos/${data.id}/editar`);
    } else {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <button
            onClick={() => router.push("/contratos")}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block"
          >
            ← Volver a contratos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo contrato</h1>
          <p className="text-gray-500 text-sm mt-1">Seleccioná el tipo de alquiler</p>
        </div>

        <div className="grid gap-3">
          {TIPOS.map(({ tipo, label, descripcion, icon }) => (
            <button
              key={tipo}
              onClick={() => handleSelect(tipo)}
              disabled={loading !== null}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-[#0F3A5F] hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-3xl">{icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-400">{descripcion}</p>
              </div>
              {loading === tipo ? (
                <span className="text-sm text-gray-400">Creando...</span>
              ) : (
                <span className="text-gray-300">→</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
