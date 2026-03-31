"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MapPin, Search } from "lucide-react";

type ClienteRow = {
  nombre: string;
  dni: string;
  telefono: string;
  contrato_id: string;
  contrato_nombre: string;
  inmueble_direccion: string;
};

interface Props {
  propietarios: ClienteRow[];
  inquilinos: ClienteRow[];
}

export default function DirectorioClientes({ propietarios, inquilinos }: Props) {
  const [tab, setTab] = useState<"propietarios" | "inquilinos">("propietarios");
  const [query, setQuery] = useState("");

  const lista = tab === "propietarios" ? propietarios : inquilinos;
  const filtrada = query
    ? lista.filter(
        (c) =>
          c.nombre.toLowerCase().includes(query.toLowerCase()) ||
          c.dni.includes(query) ||
          c.inmueble_direccion.toLowerCase().includes(query.toLowerCase())
      )
    : lista;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Directorio
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-on-background)",
            letterSpacing: "-0.02em",
          }}
        >
          Clientes
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
          Propietarios e inquilinos vinculados a contratos.
        </p>
      </div>

      <div className="px-5 max-w-2xl mx-auto space-y-4 pb-8">
        {/* Tabs */}
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: "var(--color-surface-container)" }}
        >
          {(["propietarios", "inquilinos"] as const).map((t) => {
            const active = tab === t;
            const count = t === "propietarios" ? propietarios.length : inquilinos.length;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); setQuery(""); }}
                className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold capitalize transition-all"
                style={{
                  background: active ? "var(--color-surface-lowest)" : "transparent",
                  color: active ? "var(--color-primary-container)" : "var(--color-on-surface-variant)",
                  boxShadow: active ? "var(--shadow-card)" : "none",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? "rgba(0,36,65,0.08)" : "rgba(0,0,0,0.05)",
                    color: active ? "var(--color-primary-container)" : "var(--color-on-surface-variant)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, DNI o dirección..."
            className="input-field pl-10"
            style={{ borderRadius: "1.5rem" }}
          />
        </div>

        {/* Lista */}
        {filtrada.length === 0 ? (
          <div
            className="rounded-[2rem] p-10 text-center"
            style={{ background: "var(--color-surface-lowest)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--color-on-background)" }}>
              {query ? "Sin resultados" : `No hay ${tab} registrados`}
            </p>
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              {query
                ? "Probá con otro término de búsqueda."
                : "Los clientes aparecen automáticamente al crear contratos."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrada.map((cliente, i) => (
              <ClienteCard key={`${cliente.dni}-${i}`} cliente={cliente} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClienteCard({ cliente }: { cliente: ClienteRow }) {
  const inicial = cliente.nombre.charAt(0).toUpperCase();
  const colores = [
    { bg: "rgba(0,106,101,0.12)", color: "var(--color-secondary)" },
    { bg: "rgba(0,36,65,0.10)", color: "var(--color-primary-container)" },
    { bg: "rgba(124,88,0,0.12)", color: "var(--color-tertiary)" },
  ];
  const col = colores[inicial.charCodeAt(0) % colores.length]!;

  return (
    <div
      className="rounded-[2rem] p-5 flex items-center gap-4"
      style={{ background: "var(--color-surface-lowest)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold"
        style={{ background: col.bg, color: col.color, fontFamily: "var(--font-jakarta), sans-serif" }}
      >
        {inicial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm"
          style={{ color: "var(--color-on-background)" }}
        >
          {cliente.nombre}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
          DNI {cliente.dni}
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          {cliente.telefono && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              <Phone size={11} strokeWidth={1.8} />
              {cliente.telefono}
            </span>
          )}
          {cliente.inmueble_direccion && (
            <span
              className="flex items-center gap-1 text-xs truncate max-w-[180px]"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              <MapPin size={11} strokeWidth={1.8} />
              {cliente.inmueble_direccion}
            </span>
          )}
        </div>
      </div>

      {/* Link al contrato */}
      <Link
        href={`/contratos/${cliente.contrato_id}/editar`}
        className="shrink-0 text-xs font-semibold"
        style={{ color: "var(--color-primary-container)" }}
      >
        Ver →
      </Link>
    </div>
  );
}
