"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface Props {
  cobrado: number;
  proyectado: number;
}

export function FiltroCobros({ cobrado, proyectado }: Props) {
  const [vista, setVista] = useState<"real" | "proyectado">("real");

  const valor = vista === "real" ? cobrado : proyectado;
  const isReal = vista === "real";

  return (
    <div
      className="rounded-[2rem] p-5 flex flex-col justify-between"
      style={{
        background: "var(--color-surface-lowest)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Toggle */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl w-fit mb-3"
        style={{ background: "var(--color-surface-container)" }}
      >
        <button
          onClick={() => setVista("real")}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
          style={{
            background: isReal ? "var(--color-surface-lowest)" : "transparent",
            color: isReal ? "var(--color-secondary)" : "var(--color-on-surface-variant)",
            boxShadow: isReal ? "var(--shadow-card)" : "none",
          }}
        >
          Real
        </button>
        <button
          onClick={() => setVista("proyectado")}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
          style={{
            background: !isReal ? "var(--color-surface-lowest)" : "transparent",
            color: !isReal ? "var(--color-tertiary)" : "var(--color-on-surface-variant)",
            boxShadow: !isReal ? "var(--shadow-card)" : "none",
          }}
        >
          Proyectado
        </button>
      </div>

      {/* Valor */}
      <div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
          style={{
            background: isReal ? "rgba(0,106,101,0.10)" : "rgba(124,88,0,0.10)",
          }}
        >
          <TrendingUp
            size={18}
            strokeWidth={1.8}
            style={{
              color: isReal ? "var(--color-secondary)" : "var(--color-tertiary)",
            }}
          />
        </div>
        <p
          className="text-xl font-bold leading-none"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: isReal ? "var(--color-secondary)" : "var(--color-tertiary)",
          }}
        >
          {formatMonto(valor)}
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {isReal ? "Cobrado este mes" : "Pendiente este mes"}
        </p>
      </div>
    </div>
  );
}

function formatMonto(monto: number): string {
  if (monto >= 1_000_000) return `$${(monto / 1_000_000).toFixed(1)}M`;
  return monto.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
