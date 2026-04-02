import type { Condiciones } from "@/types/contrato";

// ── Número a palabras (español argentino, 0–9.999.999) ────────

const UNIDADES = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE",
  "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE",
  "DIECIOCHO", "DIECINUEVE"];
const DECENAS = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
  "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

function menosDeMillon(n: number): string {
  if (n === 0) return "";
  if (n < 20) return UNIDADES[n]!;
  if (n < 100) {
    const dec = Math.floor(n / 10);
    const uni = n % 10;
    return uni === 0 ? DECENAS[dec]! : `${DECENAS[dec]} Y ${UNIDADES[uni]}`;
  }
  if (n === 100) return "CIEN";
  if (n < 1000) {
    const cen = Math.floor(n / 100);
    const resto = n % 100;
    return resto === 0 ? CENTENAS[cen]! : `${CENTENAS[cen]} ${menosDeMillon(resto)}`;
  }
  const miles = Math.floor(n / 1000);
  const resto = n % 1000;
  const prefMiles = miles === 1 ? "MIL" : `${menosDeMillon(miles)} MIL`;
  return resto === 0 ? prefMiles : `${prefMiles} ${menosDeMillon(resto)}`;
}

export function numeroAPalabras(n: number): string {
  if (n === 0) return "CERO";
  if (n >= 1_000_000) {
    const mill = Math.floor(n / 1_000_000);
    const resto = n % 1_000_000;
    const prefMill = mill === 1 ? "UN MILLÓN" : `${menosDeMillon(mill)} MILLONES`;
    return resto === 0 ? prefMill : `${prefMill} ${menosDeMillon(resto)}`;
  }
  return menosDeMillon(n);
}

// ── Formato monto PDF (ej: 600000 → "600.000") ────────────────

export function formatMontoPDF(n: number): string {
  return n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

// ── Fecha en formato largo ────────────────────────────────────
// "2026-03-01" → "UNO de MARZO de 2026"

const DIAS_PALABRAS: Record<number, string> = {
  1: "UNO", 2: "DOS", 3: "TRES", 4: "CUATRO", 5: "CINCO", 6: "SEIS", 7: "SIETE",
  8: "OCHO", 9: "NUEVE", 10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE",
  14: "CATORCE", 15: "QUINCE", 16: "DIECISÉIS", 17: "DIECISIETE", 18: "DIECIOCHO",
  19: "DIECINUEVE", 20: "VEINTE", 21: "VEINTIUNO", 22: "VEINTIDÓS", 23: "VEINTITRÉS",
  24: "VEINTICUATRO", 25: "VEINTICINCO", 26: "VEINTISÉIS", 27: "VEINTISIETE",
  28: "VEINTIOCHO", 29: "VEINTINUEVE", 30: "TREINTA", 31: "TREINTA Y UNO",
};

const MESES = ["", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${DIAS_PALABRAS[d] ?? d} de ${MESES[m]} de ${y}`;
}

// Fecha corta tipo "01/03/2026"
export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

// ── Calcular fecha fin ────────────────────────────────────────

export function calcularFechaFin(inicioISO: string, meses: number): string {
  const [y, m, d] = inicioISO.split("-").map(Number);
  if (!y || !m || !d) return "";
  const fin = new Date(y, m - 1 + meses, d - 1);
  const yy = fin.getFullYear();
  const mm = String(fin.getMonth() + 1).padStart(2, "0");
  const dd = String(fin.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// ── Descripción del ajuste ────────────────────────────────────

export function descripcionAjuste(ajuste: Condiciones["ajuste"]): string {
  const periodos: Record<string, string> = {
    trimestral:    "trimestralmente",
    semestral:     "semestralmente",
    cuatrimestral: "cuatrimestralmente",
    mensual:       "mensualmente",
  };
  const periodo = periodos[ajuste.tipo] ?? ajuste.tipo;
  return `${periodo} por el Índice ${ajuste.indice} (Índice de Precios al Consumidor)`;
}

// ── Duración en palabras ──────────────────────────────────────

export function duracionEnPalabras(meses: number): string {
  if (meses === 24) return "VEINTICUATRO (24)";
  if (meses === 36) return "TREINTA Y SEIS (36)";
  if (meses === 12) return "DOCE (12)";
  if (meses === 18) return "DIECIOCHO (18)";
  return `${numeroAPalabras(meses)} (${meses})`;
}

// ── Día de pago en palabras ───────────────────────────────────

export function diaEnPalabras(dia: number): string {
  return `${DIAS_PALABRAS[dia] ?? String(dia)} (${dia})`;
}
