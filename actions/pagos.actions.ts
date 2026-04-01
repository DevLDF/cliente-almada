"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { marcarPagadoSchema, generarCalendarioSchema } from "@/validations/pago.schema";
import type { Condiciones } from "@/types/contrato";

// ─────────────────────────────────────────────────────────────────────────────
// Listar pagos de un contrato
// ─────────────────────────────────────────────────────────────────────────────

export const listarPagosAction = createServerAction()
  .input(z.object({ contrato_id: z.string().uuid() }))
  .handler(async ({ input }) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pagos_calendario")
      .select("*")
      .eq("contrato_id", input.contrato_id)
      .order("numero_cuota", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  });

// ─────────────────────────────────────────────────────────────────────────────
// Generar / regenerar el calendario de pagos de un contrato
// ─────────────────────────────────────────────────────────────────────────────

export const generarCalendarioAction = createServerAction()
  .input(generarCalendarioSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Obtener datos del contrato
    const { data: contrato, error: contrError } = await supabase
      .from("contratos")
      .select("data")
      .eq("id", input.contrato_id)
      .single();

    if (contrError || !contrato) throw new Error("Contrato no encontrado");

    const condiciones = (contrato.data as { condiciones: Condiciones })
      .condiciones;

    if (!condiciones?.fechaInicio || !condiciones?.duracionMeses) {
      throw new Error(
        "El contrato no tiene condiciones completas. Completá los pasos de fechas y montos primero."
      );
    }

    const cuotas = calcularCuotas(condiciones);

    // Eliminar calendario existente y regenerar
    await supabase
      .from("pagos_calendario")
      .delete()
      .eq("contrato_id", input.contrato_id);

    const rows = cuotas.map((c, i) => ({
      contrato_id: input.contrato_id,
      user_id: user.id,
      numero_cuota: i + 1,
      fecha_vencimiento: c.fechaVencimiento,
      monto_calculado: c.monto,
      estado: "pendiente" as const,
      notas: "",
    }));

    const { error } = await supabase.from("pagos_calendario").insert(rows);
    if (error) throw new Error(error.message);

    revalidatePath(`/contratos/${input.contrato_id}/calendario`);
    return { cuotas: cuotas.length };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Marcar cuota como pagada
// ─────────────────────────────────────────────────────────────────────────────

export const marcarPagadoAction = createServerAction()
  .input(marcarPagadoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from("pagos_calendario")
      .update({
        estado: "pagado",
        fecha_pago: input.fecha_pago ?? new Date().toISOString().split("T")[0],
        notas: input.notas ?? "",
      })
      .eq("id", input.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Desmarcar cuota como pagada
// ─────────────────────────────────────────────────────────────────────────────

export const desmarcarPagadoAction = createServerAction()
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from("pagos_calendario")
      .update({ estado: "pendiente", fecha_pago: null, notas: "" })
      .eq("id", input.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Lógica de cálculo de cuotas
// ─────────────────────────────────────────────────────────────────────────────

function calcularCuotas(condiciones: Condiciones) {
  const { fechaInicio, duracionMeses, montoInicial, pagoDia, ajuste } =
    condiciones;

  const periodMap: Record<string, number> = {
    mensual: 1,
    trimestral: 3,
    cuatrimestral: 4,
    semestral: 6,
  };

  const periodoMeses = periodMap[ajuste.tipo] ?? 3;

  // Parseo seguro sin depender de timezone
  const [yearStr, monthStr] = fechaInicio.split("-");
  const baseYear = parseInt(yearStr ?? "2025");
  const baseMonth = parseInt(monthStr ?? "1") - 1; // 0-indexed

  let montoActual = montoInicial;
  const cuotas: { fechaVencimiento: string; monto: number }[] = [];

  for (let i = 0; i < duracionMeses; i++) {
    // Aplicar ajuste al inicio de cada período (excepto mes 1)
    if (i > 0 && i % periodoMeses === 0 && ajuste.porcentaje > 0) {
      montoActual = Math.round(montoActual * (1 + ajuste.porcentaje / 100));
    }

    const totalMeses = baseMonth + i;
    const cuotaYear = baseYear + Math.floor(totalMeses / 12);
    const cuotaMonth = (totalMeses % 12) + 1; // 1-indexed para ISO

    const fechaVencimiento = `${cuotaYear}-${String(cuotaMonth).padStart(2, "0")}-${String(pagoDia).padStart(2, "0")}`;

    cuotas.push({ fechaVencimiento, monto: montoActual });
  }

  return cuotas;
}
