"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calcularEstadoContrato } from "@/lib/contrato-utils";

// ── Resumen mensual de cobros ─────────────────────────────────
// Devuelve cobrado (pagado) y proyectado (pendiente) para un mes dado.

export const resumenMensualAction = createServerAction()
  .input(z.object({ mes: z.number().int().min(1).max(12), anio: z.number().int() }))
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const inicioMes = `${input.anio}-${String(input.mes).padStart(2, "0")}-01`;
    const lastDay = new Date(input.anio, input.mes, 0).getDate();
    const finMes = `${input.anio}-${String(input.mes).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const [cobradoRes, proyectadoRes] = await Promise.all([
      supabase
        .from("pagos_calendario")
        .select("monto_calculado")
        .eq("estado", "pagado")
        .gte("fecha_vencimiento", inicioMes)
        .lte("fecha_vencimiento", finMes),
      supabase
        .from("pagos_calendario")
        .select("monto_calculado")
        .eq("estado", "pendiente")
        .gte("fecha_vencimiento", inicioMes)
        .lte("fecha_vencimiento", finMes),
    ]);

    const cobrado = cobradoRes.data?.reduce((s, p) => s + (p.monto_calculado ?? 0), 0) ?? 0;
    const proyectado = proyectadoRes.data?.reduce((s, p) => s + (p.monto_calculado ?? 0), 0) ?? 0;

    return { cobrado, proyectado };
  });

// ── Resumen de contratos por estado ──────────────────────────
// Calcula vigentes / por_vencer / vencidos / borradores server-side.

export const contratosResumenAction = createServerAction().handler(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("contratos").select("id, data");
  if (error) throw new Error(error.message);

  let vigentes = 0;
  let porVencer = 0;
  let vencidos = 0;
  let borradores = 0;

  for (const c of data ?? []) {
    const condiciones = (
      c.data as { condiciones?: { fechaInicio?: string; duracionMeses?: number } }
    )?.condiciones;
    const estado = calcularEstadoContrato(condiciones);
    if (!estado) borradores++;
    else if (estado === "vigente") vigentes++;
    else if (estado === "por_vencer") porVencer++;
    else vencidos++;
  }

  return {
    total: data?.length ?? 0,
    vigentes,
    porVencer,
    vencidos,
    borradores,
  };
});
