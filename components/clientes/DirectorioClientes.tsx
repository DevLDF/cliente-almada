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
    <div className="min-h-screen p-8" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
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

        {/* Tabs + búsqueda en header para desktop */}
        <div className="flex items-center gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-on-surface-variant)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, DNI o dirección..."
              className="input-field pl-10 w-72"
              style={{ borderRadius: "1.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="inline-flex rounded-2xl p-1 gap-1 mb-6"
        style={{ background: "var(--color-surface-container)" }}
      >
        {(["propietarios", "inquilinos"] as const).map((t) => {
          const active = tab === t;
          const count = t === "propietarios" ? propietarios.length : inquilinos.length;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setQuery(""); }}
              className="py-2 px-5 rounded-xl text-sm font-semibold capitalize transition-all"
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

      {/* Lista */}
      {filtrada.length === 0 ? (
        <div
          className="rounded-[2rem] p-16 text-center max-w-md mt-8"
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
        <div
          className="rounded-[2rem] overflow-hidden"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Cabecera */}
          <div
            className="grid items-center px-6 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{
              gridTemplateColumns: "48px 1fr 130px 1fr 1fr 80px",
              color: "var(--color-on-surface-variant)",
              borderBottom: "1px solid rgba(15,58,95,0.06)",
            }}
          >
            <span />
            <span>Nombre</span>
            <span>DNI</span>
            <span>Teléfono</span>
            <span>Dirección</span>
            <span />
          </div>

          {/* Filas */}
          {filtrada.map((cliente, i) => {
            const inicial = cliente.nombre.charAt(0).toUpperCase();
            const colores = [
              { bg: "rgba(0,106,101,0.12)", color: "var(--color-secondary)" },
              { bg: "rgba(0,36,65,0.10)", color: "var(--color-primary-container)" },
              { bg: "rgba(124,88,0,0.12)", color: "var(--color-tertiary)" },
            ];
            const col = colores[inicial.charCodeAt(0) % colores.length]!;
            const isLast = i === filtrada.length - 1;

            return (
              <div
                key={`${cliente.dni}-${i}`}
                className="grid items-center px-6 py-3.5 transition-colors hover:bg-[rgba(15,58,95,0.02)]"
                style={{
                  gridTemplateColumns: "48px 1fr 130px 1fr 1fr 80px",
                  borderBottom: isLast ? "none" : "1px solid rgba(15,58,95,0.05)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: col.bg,
                    color: col.color,
                    fontFamily: "var(--font-jakarta), sans-serif",
                  }}
                >
                  {inicial}
                </div>

                {/* Nombre */}
                <p
                  className="font-semibold text-sm truncate pr-4"
                  style={{ color: "var(--color-on-background)" }}
                >
                  {cliente.nombre}
                </p>

                {/* DNI */}
                <p
                  className="text-sm"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {cliente.dni}
                </p>

                {/* Teléfono */}
                <div className="flex items-center gap-1.5">
                  {cliente.telefono ? (
                    <>
                      <Phone size={12} strokeWidth={1.8} style={{ color: "var(--color-on-surface-variant)" }} />
                      <span className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                        {cliente.telefono}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm" style={{ color: "rgba(66,71,78,0.35)" }}>—</span>
                  )}
                </div>

                {/* Dirección */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {cliente.inmueble_direccion ? (
                    <>
                      <MapPin size={12} strokeWidth={1.8} className="shrink-0" style={{ color: "var(--color-on-surface-variant)" }} />
                      <span
                        className="text-sm truncate"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {cliente.inmueble_direccion}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm" style={{ color: "rgba(66,71,78,0.35)" }}>—</span>
                  )}
                </div>

                {/* Link */}
                <div className="text-right">
                  <Link
                    href={`/contratos/${cliente.contrato_id}/editar`}
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary-container)" }}
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
