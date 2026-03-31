import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const enSieteDias = new Date(hoy);
  enSieteDias.setDate(hoy.getDate() + 7);
  const mesActualInicio = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    { count: totalContratos },
    { data: vencidosData },
    { data: proximosData },
    { data: cobradoData },
  ] = await Promise.all([
    supabase.from("contratos").select("*", { count: "exact", head: true }),
    supabase
      .from("pagos_calendario")
      .select("id")
      .lt("fecha_vencimiento", hoy.toISOString().split("T")[0])
      .eq("estado", "pendiente"),
    supabase
      .from("pagos_calendario")
      .select("id, numero_cuota, fecha_vencimiento, monto_calculado, contrato_id, contratos(nombre)")
      .gte("fecha_vencimiento", hoy.toISOString().split("T")[0]!)
      .lte("fecha_vencimiento", enSieteDias.toISOString().split("T")[0]!)
      .eq("estado", "pendiente")
      .order("fecha_vencimiento", { ascending: true })
      .limit(5),
    supabase
      .from("pagos_calendario")
      .select("monto_calculado")
      .eq("estado", "pagado")
      .gte("fecha_pago", mesActualInicio),
  ]);

  const totalVencidos = vencidosData?.length ?? 0;
  const cobradoMes =
    cobradoData?.reduce((sum, p) => sum + (p.monto_calculado ?? 0), 0) ?? 0;
  const proximosVencimientos = proximosData ?? [];
  const saludPct =
    totalContratos && totalContratos > 0
      ? Math.max(0, Math.round(((totalContratos - totalVencidos) / totalContratos) * 100))
      : 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Resumen general
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-on-background)",
            letterSpacing: "-0.02em",
          }}
        >
          Bienvenido,{" "}
          <span style={{ color: "var(--color-primary-container)" }}>
            Director.
          </span>
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {totalContratos
            ? `Gestionás ${totalContratos} contrato${totalContratos !== 1 ? "s" : ""} activo${totalContratos !== 1 ? "s" : ""}.`
            : "Creá tu primer contrato para comenzar."}
        </p>
      </div>

      <div className="px-5 max-w-2xl mx-auto space-y-4 pb-8">
        {/* Fila 1: Contratos + Salud */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Contratos activos"
            value={String(totalContratos ?? 0)}
            Icon={FileText}
            iconBg="rgba(0,36,65,0.08)"
            iconColor="var(--color-primary-container)"
          />
          <div
            className="rounded-[2rem] p-5 flex flex-col justify-between"
            style={{
              background: "var(--color-surface-lowest)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-3"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Salud portfolio
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-jakarta), sans-serif",
                    color: "var(--color-on-background)",
                  }}
                >
                  {saludPct}%
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-secondary)" }}
                >
                  Al día
                </p>
              </div>
              <SaludRing pct={saludPct} />
            </div>
          </div>
        </div>

        {/* Fila 2: Cobrado + Vencidos */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Cobrado este mes"
            value={formatMonto(cobradoMes)}
            Icon={TrendingUp}
            iconBg="rgba(0,106,101,0.10)"
            iconColor="var(--color-secondary)"
            small
          />
          <MetricCard
            label="Pagos vencidos"
            value={String(totalVencidos)}
            Icon={AlertTriangle}
            iconBg={
              totalVencidos > 0
                ? "rgba(124,88,0,0.12)"
                : "rgba(0,36,65,0.06)"
            }
            iconColor={
              totalVencidos > 0
                ? "var(--color-tertiary)"
                : "var(--color-on-surface-variant)"
            }
            alert={totalVencidos > 0}
          />
        </div>

        {/* Próximos vencimientos */}
        <div
          className="rounded-[2rem] p-5"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock
                size={16}
                strokeWidth={1.8}
                style={{ color: "var(--color-primary-container)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-on-background)" }}
              >
                Próximos vencimientos
              </p>
            </div>
            <Link
              href="/contratos"
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--color-primary-container)" }}
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {proximosVencimientos.length === 0 ? (
            <p
              className="text-sm text-center py-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              No hay vencimientos en los próximos 7 días
            </p>
          ) : (
            <div className="space-y-3">
              {proximosVencimientos.map((p) => {
                const contratoNombre =
                  (p.contratos as { nombre?: string } | null)?.nombre ??
                  "Contrato";
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3"
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
                          {contratoNombre}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          Cuota #{p.numero_cuota} ·{" "}
                          {formatFecha(p.fecha_vencimiento)}
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
                );
              })}
            </div>
          )}
        </div>

        {/* Banner celebratorio */}
        {totalVencidos === 0 && (totalContratos ?? 0) > 0 && (
          <div
            className="rounded-[2rem] p-5 text-center"
            style={{ background: "#fffbf0" }}
          >
            <p
              className="text-sm font-bold mb-1"
              style={{
                fontFamily: "var(--font-jakarta), sans-serif",
                color: "var(--color-tertiary)",
              }}
            >
              ¡Excelente gestión este mes!
            </p>
            <p className="text-xs" style={{ color: "var(--color-tertiary)" }}>
              Todos los contratos están al día.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  Icon,
  iconBg,
  iconColor,
  alert = false,
  small = false,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  iconBg: string;
  iconColor: string;
  alert?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className="rounded-[2rem] p-5 flex flex-col justify-between"
      style={{
        background: "var(--color-surface-lowest)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: iconBg }}
      >
        <Icon size={18} strokeWidth={1.8} style={{ color: iconColor }} />
      </div>
      <div>
        <p
          className={`font-bold leading-none ${small ? "text-xl" : "text-2xl"}`}
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: alert ? iconColor : "var(--color-on-background)",
          }}
        >
          {value}
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function SaludRing({ pct }: { pct: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const progress = circ - (pct / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--color-surface-container)"
        strokeWidth="4"
      />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={progress}
      />
    </svg>
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
