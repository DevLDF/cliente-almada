import { z } from "zod";

export const marcarPagadoSchema = z.object({
  id: z.string().uuid(),
  fecha_pago: z.string().optional(),
  notas: z.string().optional(),
});

export const generarCalendarioSchema = z.object({
  contrato_id: z.string().uuid(),
});

// Tipo del row de la tabla pagos_calendario
export type PagoCalendario = {
  id: string;
  contrato_id: string;
  user_id: string;
  numero_cuota: number;
  fecha_vencimiento: string;
  monto_calculado: number;
  estado: "pendiente" | "pagado" | "vencido";
  fecha_pago: string | null;
  notas: string;
  created_at: string;
  updated_at: string;
};
