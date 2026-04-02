"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Punto {
  key: string;
  label: string;
  cobrado: number;
}

interface Props {
  data: Punto[];
}

export function GraficoIngresosMensuales({ data }: Props) {
  const tieneData = data.some((p) => p.cobrado > 0);

  if (!tieneData) {
    return (
      <div
        className="flex items-center justify-center h-48 text-sm"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        Sin pagos registrados en los últimos 12 meses
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#006a65" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#006a65" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(15,58,95,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#42474e" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#42474e" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatMontoEje}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,106,101,0.15)" }} />
        <Area
          type="monotone"
          dataKey="cobrado"
          stroke="#006a65"
          strokeWidth={2}
          fill="url(#gradTeal)"
          dot={false}
          activeDot={{ r: 4, fill: "#006a65", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-3 py-2 text-xs shadow-md"
      style={{
        background: "var(--color-surface-lowest)",
        border: "1px solid rgba(15,58,95,0.08)",
      }}
    >
      <p className="font-semibold mb-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
        {label}
      </p>
      <p className="font-bold" style={{ color: "var(--color-secondary)" }}>
        {formatMonto(payload[0]!.value)}
      </p>
    </div>
  );
}

function formatMontoEje(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
}

function formatMonto(monto: number): string {
  if (monto >= 1_000_000) return `$${(monto / 1_000_000).toFixed(1)}M`;
  return monto.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
