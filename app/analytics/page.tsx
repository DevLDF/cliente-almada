import {
  ingresosMensualesAction,
  ticketPromedioPorTipoAction,
} from "@/actions/analytics.actions";
import { contratosResumenAction } from "@/actions/dashboard.actions";
import { GraficoIngresosMensuales } from "@/components/shared/analytics/GraficoIngresosMensuales";
import { TablaTicketPromedio } from "@/components/shared/analytics/TablaTicketPromedio";
import { TrendingUp, FileText, BarChart2 } from "lucide-react";

export default async function AnalyticsPage() {
  const [[ingresos], [tickets], [resumen]] = await Promise.all([
    ingresosMensualesAction(),
    ticketPromedioPorTipoAction(),
    contratosResumenAction(),
  ]);

  const totalCobrado = (ingresos ?? []).reduce((s, p) => s + p.cobrado, 0);
  const promedioGeneral =
    (tickets ?? []).length > 0
      ? Math.round(
          (tickets ?? []).reduce((s, t) => s + t.promedio * t.count, 0) /
            (tickets ?? []).reduce((s, t) => s + t.count, 0)
        )
      : 0;
  const contratosActivos =
    (resumen?.vigentes ?? 0) +
    (resumen?.porVencer ?? 0) +
    (resumen?.vencidos ?? 0);

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Análisis
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-on-background)",
            letterSpacing: "-0.02em",
          }}
        >
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
          Ingresos y métricas de los últimos 12 meses
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="Total cobrado (12 meses)"
          value={formatMonto(totalCobrado)}
          bg="rgba(0,106,101,0.10)"
          color="var(--color-secondary)"
          Icon={TrendingUp}
        />
        <KpiCard
          label="Ticket promedio"
          value={promedioGeneral > 0 ? formatMonto(promedioGeneral) : "—"}
          bg="rgba(0,36,65,0.08)"
          color="var(--color-primary-container)"
          Icon={BarChart2}
        />
        <KpiCard
          label="Contratos activos"
          value={String(contratosActivos)}
          bg="rgba(124,88,0,0.10)"
          color="var(--color-tertiary)"
          Icon={FileText}
          detail={
            resumen
              ? `${resumen.vigentes} vig. · ${resumen.porVencer} p/vencer · ${resumen.vencidos} venc.`
              : undefined
          }
        />
      </div>

      {/* Gráfico + Tabla */}
      <div className="grid grid-cols-3 gap-4">
        {/* Gráfico ingresos — 2 cols */}
        <div
          className="col-span-2 rounded-[2rem] p-6"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-on-background)" }}
              >
                Ingresos mensuales
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                Pagos marcados como cobrados · últimos 12 meses
              </p>
            </div>
            {totalCobrado > 0 && (
              <p
                className="text-base font-bold tabular-nums"
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  color: "var(--color-secondary)",
                }}
              >
                {formatMonto(totalCobrado)}
              </p>
            )}
          </div>
          <GraficoIngresosMensuales data={ingresos ?? []} />
        </div>

        {/* Tabla ticket promedio — 1 col */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--color-on-background)" }}
          >
            Ticket por categoría
          </p>
          <p className="text-xs mb-5" style={{ color: "var(--color-on-surface-variant)" }}>
            Monto inicial promedio por tipo
          </p>
          <TablaTicketPromedio filas={tickets ?? []} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-componente KPI
// ─────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  bg,
  color,
  Icon,
  detail,
}: {
  label: string;
  value: string;
  bg: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  detail?: string;
}) {
  return (
    <div
      className="rounded-[2rem] p-5 flex flex-col justify-between"
      style={{
        background: "var(--color-surface-lowest)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
        <Icon size={18} strokeWidth={1.8} style={{ color }} />
      </div>
      <div>
        <p
          className="text-2xl font-bold leading-none tabular-nums"
          style={{ fontFamily: "var(--font-jakarta), sans-serif", color: "var(--color-on-background)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
          {label}
        </p>
        {detail && (
          <p className="text-[10px] mt-1.5" style={{ color: "var(--color-on-surface-variant)" }}>
            {detail}
          </p>
        )}
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
