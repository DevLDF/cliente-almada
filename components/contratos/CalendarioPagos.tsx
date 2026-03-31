"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  // Fecha de hoy (sin hora) para comparar vencimientos
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

  // Próximo pago con vencimiento en los próximos 7 días
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/contratos")}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← Contratos
          </button>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs text-center">
            {contrato.nombre}
          </span>
          <a
            href={`/contratos/${contrato.id}/editar`}
            className="text-sm text-[#1E5A8A] hover:underline"
          >
            Editar
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Título + botón generar */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Calendario de pagos
            </h1>
            {pagosIniciales.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                {pagosIniciales.length} cuotas · {pagadas} pagadas
                {vencidas > 0 ? ` · ${vencidas} vencidas` : ""} ·{" "}
                {pendientes} pendientes
              </p>
            )}
          </div>
          <button
            onClick={handleGenerar}
            disabled={generando}
            className="shrink-0 px-4 py-2 text-sm font-semibold bg-[#0F3A5F] text-white rounded-lg hover:bg-[#1E5A8A] transition-colors disabled:opacity-50"
          >
            {generando
              ? "Generando..."
              : pagosIniciales.length === 0
              ? "Generar calendario"
              : "Regenerar"}
          </button>
        </div>

        {genError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {genError}
          </div>
        )}

        {/* Alerta próximo vencimiento */}
        {proximoAlerta && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            ⚠️ La cuota #{proximoAlerta.numero_cuota} vence el{" "}
            <strong>
              {formatFecha(proximoAlerta.fecha_vencimiento)}
            </strong>
          </div>
        )}

        {/* Estado vacío */}
        {pagosIniciales.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="mb-1">No hay cuotas generadas todavía</p>
            <p className="text-xs">
              Hacé clic en &ldquo;Generar calendario&rdquo; para crear las
              cuotas del contrato
            </p>
          </div>
        )}

        {/* Tabla de cuotas */}
        {pagosIniciales.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Vencimiento
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Monto
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagosIniciales.map((pago) => {
                  const estado = getEstado(pago);
                  const isLoading = loadingId === pago.id;

                  return (
                    <tr
                      key={pago.id}
                      className={
                        estado === "vencido" ? "bg-red-50/60" : undefined
                      }
                    >
                      <td className="px-4 py-3 text-gray-500 tabular-nums">
                        {pago.numero_cuota}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {formatFecha(pago.fecha_vencimiento)}
                        {pago.fecha_pago && (
                          <span className="block text-xs text-gray-400">
                            Pagado: {formatFecha(pago.fecha_pago)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">
                        {formatMonto(pago.monto_calculado)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <EstadoBadge estado={estado} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {estado !== "pagado" ? (
                          <button
                            onClick={() => handleMarcarPagado(pago.id)}
                            disabled={isLoading}
                            className="text-xs font-medium text-[#1E5A8A] hover:underline disabled:opacity-50"
                          >
                            {isLoading ? "..." : "Marcar pagado"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDesmarcar(pago.id)}
                            disabled={isLoading}
                            className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            {isLoading ? "..." : "Desmarcar"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes y helpers
// ─────────────────────────────────────────────────────────────────────────────

function EstadoBadge({
  estado,
}: {
  estado: "pendiente" | "vencido" | "pagado";
}) {
  const map = {
    pendiente: { label: "Pendiente", cls: "bg-blue-50 text-blue-700" },
    vencido: { label: "Vencida", cls: "bg-red-100 text-red-700" },
    pagado: { label: "Pagada", cls: "bg-green-50 text-green-700" },
  };
  const { label, cls } = map[estado];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
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
