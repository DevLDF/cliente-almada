"use server";

import { createServerAction } from "zsa";
import { createClient } from "@/lib/supabase/server";

// ── Ingresos cobrados por mes — últimos 12 meses ──────────────

export const ingresosMensualesAction = createServerAction().handler(async () => {
  const supabase = await createClient();

  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 11, 1);
  const inicioStr = inicio.toISOString().split("T")[0]!;

  const { data, error } = await supabase
    .from("pagos_calendario")
    .select("fecha_vencimiento, monto_calculado")
    .eq("estado", "pagado")
    .gte("fecha_vencimiento", inicioStr)
    .order("fecha_vencimiento", { ascending: true });

  if (error) throw new Error(error.message);

  // Inicializar los 12 meses en orden con 0
  const byMonth = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, 0);
  }

  for (const p of data ?? []) {
    const key = p.fecha_vencimiento.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + (p.monto_calculado ?? 0));
  }

  return Array.from(byMonth.entries()).map(([key, cobrado]) => {
    const [year, month] = key.split("-").map(Number);
    const label = new Date(year!, (month ?? 1) - 1, 1).toLocaleDateString("es-AR", {
      month: "short",
      year: "2-digit",
    });
    return { key, label, cobrado };
  });
});

// ── Ticket promedio e ingresos por tipo de contrato ───────────

export const ticketPromedioPorTipoAction = createServerAction().handler(async () => {
  const supabase = await createClient();

  const { data: contratos, error } = await supabase
    .from("contratos")
    .select("tipo, data");

  if (error) throw new Error(error.message);

  const byTipo = new Map<string, { suma: number; count: number }>();

  for (const c of contratos ?? []) {
    const monto =
      (c.data as { condiciones?: { montoInicial?: number } })?.condiciones
        ?.montoInicial ?? 0;
    if (monto === 0) continue;
    const entry = byTipo.get(c.tipo) ?? { suma: 0, count: 0 };
    entry.suma += monto;
    entry.count += 1;
    byTipo.set(c.tipo, entry);
  }

  return (["vivienda", "comercial", "galpon"] as const)
    .filter((tipo) => byTipo.has(tipo))
    .map((tipo) => {
      const { suma, count } = byTipo.get(tipo)!;
      return { tipo, promedio: Math.round(suma / count), total: suma, count };
    });
});
