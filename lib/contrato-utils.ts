/**
 * lib/contrato-utils.ts
 * Helpers de dominio compartidos entre página de contratos, dashboard y actions.
 */

export type EstadoContrato = "vigente" | "por_vencer" | "vencido";

export function calcularEstadoContrato(
  condiciones: { fechaInicio?: string; duracionMeses?: number } | undefined
): EstadoContrato | null {
  if (!condiciones?.fechaInicio || !condiciones.duracionMeses) return null;
  const inicio = new Date(condiciones.fechaInicio);
  const fin = new Date(inicio);
  fin.setMonth(fin.getMonth() + condiciones.duracionMeses);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diasRestantes = (fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
  if (diasRestantes < 0) return "vencido";
  if (diasRestantes <= 30) return "por_vencer";
  return "vigente";
}
