import { createClient } from "@/lib/supabase/server";
import { resumenMensualAction, contratosResumenAction } from "@/actions/dashboard.actions";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { FiltroCobros } from "@/components/shared/dashboard/FiltroCobros";
import { ListaVencimientosProximos } from "@/components/shared/dashboard/ListaVencimientosProximos";

export default async function DashboardPage() {
  const supabase = await createClient();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const enSieteDias = new Date(hoy);
  enSieteDias.setDate(hoy.getDate() + 7);

  const [
    [resumenMes],
    [resumenContratos],
    { data: proximosData },
    { data: vencidosData },
  ] = await Promise.all([
    resumenMensualAction({ mes: hoy.getMonth() + 1, anio: hoy.getFullYear() }),
    contratosResumenAction(),
    supabase
      .from("pagos_calendario")
      .select("id, numero_cuota, fecha_vencimiento, monto_calculado, contrato_id, contratos(nombre, tipo)")
      .gte("fecha_vencimiento", hoy.toISOString().split("T")[0]!)
      .lte("fecha_vencimiento", enSieteDias.toISOString().split("T")[0]!)
      .eq("estado", "pendiente")
      .order("fecha_vencimiento", { ascending: true })
      .limit(20),
    supabase
      .from("pagos_calendario")
      .select("id")
      .lt("fecha_vencimiento", hoy.toISOString().split("T")[0]!)
      .eq("estado", "pendiente"),
  ]);

  const cobrado = resumenMes?.cobrado ?? 0;
  const proyectado = resumenMes?.proyectado ?? 0;
  const totalVencidosPagos = vencidosData?.length ?? 0;

  const resumen = resumenContratos ?? { total: 0, vigentes: 0, porVencer: 0, vencidos: 0, borradores: 0 };
  const contratosActivos = resumen.vigentes + resumen.porVencer + resumen.vencidos;
  const saludPct =
    contratosActivos > 0
      ? Math.round((resumen.vigentes / contratosActivos) * 100)
      : 100;

  const proximosVencimientos = (proximosData ?? []).map((p) => {
    const contrato = p.contratos as { nombre?: string; tipo?: string } | null;
    return {
      id: p.id,
      numero_cuota: p.numero_cuota,
      fecha_vencimiento: p.fecha_vencimiento,
      monto_calculado: p.monto_calculado,
      contratoNombre: contrato?.nombre ?? "Contrato",
      contratoTipo: (contrato?.tipo ?? null) as "vivienda" | "comercial" | "galpon" | null,
    };
  });

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Resumen general
        </p>
        <div className="flex items-end justify-between">
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
            className="text-sm mb-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {resumen.total > 0
              ? `${resumen.total} contrato${resumen.total !== 1 ? "s" : ""} en el sistema.`
              : "Creá tu primer contrato para comenzar."}
          </p>
        </div>
      </div>

      {/* Métricas — 4 columnas */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        {/* Contratos activos con breakdown */}
        <div
          className="rounded-[2rem] p-5 flex flex-col justify-between"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: "rgba(0,36,65,0.08)" }}
          >
            <FileText size={18} strokeWidth={1.8} style={{ color: "var(--color-primary-container)" }} />
          </div>
          <div>
            <p
              className="text-2xl font-bold leading-none"
              style={{
                fontFamily: "var(--font-jakarta), sans-serif",
                color: "var(--color-on-background)",
              }}
            >
              {contratosActivos}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
              Contratos
            </p>
            {contratosActivos > 0 && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {resumen.vigentes > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(0,106,101,0.10)", color: "var(--color-secondary)" }}>
                    {resumen.vigentes} vigente{resumen.vigentes !== 1 ? "s" : ""}
                  </span>
                )}
                {resumen.porVencer > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(124,88,0,0.12)", color: "var(--color-tertiary)" }}>
                    {resumen.porVencer} por vencer
                  </span>
                )}
                {resumen.vencidos > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(180,20,20,0.10)", color: "#b41414" }}>
                    {resumen.vencidos} vencido{resumen.vencidos !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Salud portfolio */}
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
              <p className="text-xs mt-0.5" style={{ color: "var(--color-secondary)" }}>
                Vigentes
              </p>
            </div>
            <SaludRing pct={saludPct} />
          </div>
        </div>

        {/* FiltroCobros — toggle Real / Proyectado */}
        <FiltroCobros cobrado={cobrado} proyectado={proyectado} />

        {/* Pagos vencidos */}
        <div
          className="rounded-[2rem] p-5 flex flex-col justify-between"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: totalVencidosPagos > 0 ? "rgba(124,88,0,0.12)" : "rgba(0,36,65,0.06)",
            }}
          >
            <AlertTriangle
              size={18}
              strokeWidth={1.8}
              style={{
                color: totalVencidosPagos > 0
                  ? "var(--color-tertiary)"
                  : "var(--color-on-surface-variant)",
              }}
            />
          </div>
          <div>
            <p
              className="text-2xl font-bold leading-none"
              style={{
                fontFamily: "var(--font-jakarta), sans-serif",
                color: totalVencidosPagos > 0 ? "var(--color-tertiary)" : "var(--color-on-background)",
              }}
            >
              {totalVencidosPagos}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
              Pagos vencidos
            </p>
          </div>
        </div>
      </div>

      {/* Fila inferior: próximos vencimientos + panel */}
      <div className="grid grid-cols-3 gap-4">
        {/* Próximos vencimientos — 2 cols */}
        <div
          className="col-span-2 rounded-[2rem] p-6"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={16} strokeWidth={1.8} style={{ color: "var(--color-primary-container)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--color-on-background)" }}>
                Próximos vencimientos
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-1"
                style={{
                  background: "rgba(0,36,65,0.06)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                7 días
              </span>
            </div>
            <Link
              href="/contratos"
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--color-primary-container)" }}
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <ListaVencimientosProximos items={proximosVencimientos} />
        </div>

        {/* Panel derecho */}
        <div className="flex flex-col gap-4">
          {/* Banner */}
          {totalVencidosPagos === 0 && contratosActivos > 0 ? (
            <div
              className="rounded-[2rem] p-6 text-center"
              style={{ background: "var(--color-tertiary-surface)" }}
            >
              <p
                className="text-sm font-bold mb-1"
                style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  color: "var(--color-tertiary)",
                }}
              >
                ¡Excelente gestión!
              </p>
              <p className="text-xs" style={{ color: "var(--color-tertiary)" }}>
                Todos los contratos están al día.
              </p>
            </div>
          ) : totalVencidosPagos > 0 ? (
            <div
              className="rounded-[2rem] p-6"
              style={{ background: "rgba(124,88,0,0.08)" }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: "var(--color-tertiary)" }}>
                {totalVencidosPagos} pago{totalVencidosPagos !== 1 ? "s" : ""} vencido{totalVencidosPagos !== 1 ? "s" : ""}
              </p>
              <p className="text-xs mb-3" style={{ color: "var(--color-tertiary)" }}>
                Revisá los contratos con deuda pendiente.
              </p>
              <Link href="/contratos" className="text-xs font-semibold" style={{ color: "var(--color-tertiary)" }}>
                Ir a contratos →
              </Link>
            </div>
          ) : null}

          {/* Acciones rápidas */}
          <div
            className="rounded-[2rem] p-6 flex-1"
            style={{
              background: "var(--color-surface-lowest)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Acciones rápidas
            </p>
            <div className="space-y-2">
              <Link
                href="/contratos/nuevo"
                className="flex items-center gap-2 text-sm font-medium py-2"
                style={{ color: "var(--color-primary-container)" }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(15,58,95,0.10)" }}
                >
                  +
                </span>
                Nuevo contrato
              </Link>
              <Link
                href="/contratos"
                className="flex items-center gap-2 text-sm font-medium py-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  <FileText size={12} />
                </span>
                Ver contratos
              </Link>
              <Link
                href="/clientes"
                className="flex items-center gap-2 text-sm font-medium py-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  <FileText size={12} />
                </span>
                Ver clientes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes server
// ─────────────────────────────────────────────────────────────────────────────

function SaludRing({ pct }: { pct: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const progress = circ - (pct / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-surface-container)" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={progress}
      />
    </svg>
  );
}
