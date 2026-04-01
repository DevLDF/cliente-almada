"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import {
  generarCalendarioAction,
  marcarPagadoAction,
  desmarcarPagadoAction,
} from "@/actions/pagos.actions";
import type { PagoCalendario } from "@/validations/pago.schema";

interface ContratoRow {
  id: string;
  nombre: string;
  tipo: "vivienda" | "comercial" | "galpon";
}

interface Props {
  contrato: ContratoRow;
  pagosIniciales: PagoCalendario[];
}

export default function CalendarioPagos({ contrato, pagosIniciales }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  function getEstado(pago: PagoCalendario): "pendiente" | "vencido" | "pagado" {
    if (pago.estado === "pagado") return "pagado";
    const [y, m, d] = pago.fecha_vencimiento.split("-").map(Number);
    const venc = new Date(y!, (m ?? 1) - 1, d ?? 1);
    return venc < hoy ? "vencido" : "pendiente";
  }

  const pagadas = pagosIniciales.filter((p) => p.estado === "pagado").length;
  const vencidas = pagosIniciales.filter((p) => getEstado(p) === "vencido").length;
  const pendientes = pagosIniciales.filter((p) => getEstado(p) === "pendiente").length;

  const proximoAlerta = pagosIniciales.find((p) => {
    if (p.estado === "pagado") return false;
    const [y, m, d] = p.fecha_vencimiento.split("-").map(Number);
    const venc = new Date(y!, (m ?? 1) - 1, d ?? 1);
    const diff = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  async function handleGenerar() {
    setGenerando(true);
    setGenError(null);
    const [, err] = await generarCalendarioAction({ contrato_id: contrato.id });
    if (err) {
      setGenError(err.message);
    } else {
      router.refresh();
    }
    setGenerando(false);
  }

  async function handleMarcarPagado(id: string) {
    setLoadingId(id);
    await marcarPagadoAction({ id });
    router.refresh();
    setLoadingId(null);
  }

  async function handleDesmarcar(id: string) {
    setLoadingId(id);
    await desmarcarPagadoAction({ id });
    router.refresh();
    setLoadingId(null);
  }

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/contratos")}
            className="flex items-center gap-1.5 text-xs font-medium mb-3"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Contratos
          </button>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {contrato.nombre}
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
              letterSpacing: "-0.02em",
            }}
          >
            Calendario de pagos
          </h1>
          {pagosIniciales.length > 0 && (
            <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
              {pagosIniciales.length} cuotas · {pagadas} pagadas
              {vencidas > 0 ? ` · ${vencidas} vencidas` : ""} · {pendientes} pendientes
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/contratos/${contrato.id}/editar`}
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{
              color: "var(--color-primary-container)",
              background: "rgba(15,58,95,0.08)",
            }}
          >
            Editar contrato
          </a>
          <button
            onClick={handleGenerar}
            disabled={generando}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw size={14} strokeWidth={2} className={generando ? "animate-spin" : ""} />
            {generando
              ? "Generando..."
              : pagosIniciales.length === 0
              ? "Generar calendario"
              : "Regenerar"}
          </button>
        </div>
      </div>

      {genError && (
        <div
          className="mb-4 p-4 rounded-2xl text-sm"
          style={{ background: "#fff1f0", color: "#b91c1c" }}
        >
          {genError}
        </div>
      )}

      {/* Alerta próximo vencimiento */}
      {proximoAlerta && (
        <div
          className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm"
          style={{ background: "rgba(124,88,0,0.08)", color: "var(--color-tertiary)" }}
        >
          <AlertTriangle size={16} strokeWidth={2} />
          <span>
            La cuota <strong>#{proximoAlerta.numero_cuota}</strong> vence el{" "}
            <strong>{formatFecha(proximoAlerta.fecha_vencimiento)}</strong>
          </span>
        </div>
      )}

      {/* Estado vacío */}
      {pagosIniciales.length === 0 && (
        <div
          className="rounded-[2rem] p-16 text-center max-w-md"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p
            className="font-semibold mb-1"
            style={{ color: "var(--color-on-background)" }}
          >
            Sin cuotas generadas
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Hacé clic en &ldquo;Generar calendario&rdquo; para crear las cuotas del contrato
          </p>
        </div>
      )}

      {/* Tabla de cuotas */}
      {pagosIniciales.length > 0 && (
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
              gridTemplateColumns: "60px 1fr 160px 120px 140px",
              color: "var(--color-on-surface-variant)",
              borderBottom: "1px solid rgba(15,58,95,0.06)",
            }}
          >
            <span>#</span>
            <span>Vencimiento</span>
            <span className="text-right">Monto</span>
            <span className="text-center">Estado</span>
            <span />
          </div>

          {/* Filas */}
          {pagosIniciales.map((pago, idx) => {
            const estado = getEstado(pago);
            const isLoading = loadingId === pago.id;
            const isLast = idx === pagosIniciales.length - 1;

            return (
              <div
                key={pago.id}
                className="grid items-center px-6 py-3.5 transition-colors"
                style={{
                  gridTemplateColumns: "60px 1fr 160px 120px 140px",
                  borderBottom: isLast ? "none" : "1px solid rgba(15,58,95,0.05)",
                  background:
                    estado === "vencido"
                      ? "rgba(124,88,0,0.03)"
                      : estado === "pagado"
                      ? "rgba(0,106,101,0.02)"
                      : "transparent",
                }}
              >
                <span
                  className="text-sm tabular-nums font-medium"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {pago.numero_cuota}
                </span>

                <div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-on-background)" }}
                  >
                    {formatFecha(pago.fecha_vencimiento)}
                  </span>
                  {pago.fecha_pago && (
                    <span
                      className="block text-xs"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      Pagado: {formatFecha(pago.fecha_pago)}
                    </span>
                  )}
                </div>

                <p
                  className="text-sm font-semibold tabular-nums text-right"
                  style={{ color: "var(--color-on-background)" }}
                >
                  {formatMonto(pago.monto_calculado)}
                </p>

                <div className="flex justify-center">
                  <EstadoBadge estado={estado} />
                </div>

                <div className="flex justify-end">
                  {estado !== "pagado" ? (
                    <button
                      onClick={() => handleMarcarPagado(pago.id)}
                      disabled={isLoading}
                      className="text-xs font-semibold disabled:opacity-50"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {isLoading ? "..." : "Marcar pagado"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDesmarcar(pago.id)}
                      disabled={isLoading}
                      className="text-xs disabled:opacity-50"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {isLoading ? "..." : "Desmarcar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: "pendiente" | "vencido" | "pagado" }) {
  const map = {
    pendiente: {
      label: "Pendiente",
      bg: "rgba(0,36,65,0.07)",
      color: "var(--color-primary-container)",
    },
    vencido: {
      label: "Vencida",
      bg: "rgba(124,88,0,0.12)",
      color: "var(--color-tertiary)",
    },
    pagado: {
      label: "Pagada",
      bg: "rgba(0,106,101,0.10)",
      color: "var(--color-secondary)",
    },
  };
  const { label, bg, color } = map[estado];
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString("es-AR");
}

function formatMonto(monto: number): string {
  return monto.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
