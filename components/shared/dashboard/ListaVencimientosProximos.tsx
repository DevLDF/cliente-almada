"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

type Tipo = "vivienda" | "comercial" | "galpon";

interface VencimientoItem {
  id: string;
  numero_cuota: number;
  fecha_vencimiento: string;
  monto_calculado: number;
  contratoNombre: string;
  contratoTipo: Tipo | null;
}

interface Props {
  items: VencimientoItem[];
}

const FILTROS: { key: Tipo | "todos"; label: string }[] = [
  { key: "todos",    label: "Todos"     },
  { key: "vivienda", label: "Vivienda"  },
  { key: "comercial",label: "Comercial" },
  { key: "galpon",   label: "Galpón"    },
];

export function ListaVencimientosProximos({ items }: Props) {
  const [filtro, setFiltro] = useState<Tipo | "todos">("todos");

  const filtrados =
    filtro === "todos" ? items : items.filter((i) => i.contratoTipo === filtro);

  return (
    <div>
      {/* FiltroCategoria */}
      {items.length > 0 && (
        <div className="flex items-center gap-1 mb-4">
          {FILTROS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className="text-xs font-medium px-3 py-1 rounded-full transition-all"
              style={{
                background:
                  filtro === key
                    ? "rgba(15,58,95,0.10)"
                    : "transparent",
                color:
                  filtro === key
                    ? "var(--color-primary-container)"
                    : "var(--color-on-surface-variant)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Lista */}
      {filtrados.length === 0 ? (
        <p
          className="text-sm text-center py-6"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {items.length === 0
            ? "No hay vencimientos en los próximos 7 días"
            : "Sin vencimientos para esta categoría"}
        </p>
      ) : (
        <div className="space-y-3">
          {filtrados.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 py-2"
              style={{ borderBottom: "1px solid rgba(15,58,95,0.05)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(124,88,0,0.10)" }}
                >
                  <AlertTriangle
                    size={14}
                    strokeWidth={2}
                    style={{ color: "var(--color-tertiary)" }}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--color-on-background)" }}
                  >
                    {p.contratoNombre}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Cuota #{p.numero_cuota} · {formatFecha(p.fecha_vencimiento)}
                  </p>
                </div>
              </div>
              <p
                className="shrink-0 text-sm font-semibold tabular-nums"
                style={{ color: "var(--color-on-background)" }}
              >
                {formatMonto(p.monto_calculado)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString("es-AR");
}

function formatMonto(monto: number): string {
  if (monto >= 1_000_000) return `$${(monto / 1_000_000).toFixed(1)}M`;
  return monto.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
