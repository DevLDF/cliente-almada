/**
 * lib/contract-html-generator.ts
 * Genera el texto de cada cláusula del contrato para el preview HTML del editor.
 * Reutiliza helpers de lib/pdf/helpers.ts — no duplicar lógica.
 */

import type { Contrato, ContractType } from "@/types/contrato";
import {
  numeroAPalabras,
  formatMontoPDF,
  fechaLarga,
  calcularFechaFin,
  descripcionAjuste,
  duracionEnPalabras,
  diaEnPalabras,
} from "@/lib/pdf/helpers";

// Tipo del estado interno del editor (sin metadatos del row de DB)
export type ContratoData = Omit<Contrato, "id" | "createdAt" | "updatedAt">;

export interface Clausula {
  id: string;
  titulo: string;
  texto: string;
}

// ── Texto de cláusulas individuales ──────────────────────────────

function buildIntro(d: ContratoData): string {
  const { locador, locatarios } = d;
  const locadorTexto = [
    locador.nombre ? locador.nombre.toUpperCase() : "___________",
    "argentino/a",
    locador.dni ? `con Documento Nacional de Identidad N° ${locador.dni}` : "",
    locador.cuit ? `CUIT/CUIL N° ${locador.cuit}` : "",
    locador.nacimiento ? `nacido/a el ${locador.nacimiento}` : "",
    locador.domicilio ? `con domicilio real en ${locador.domicilio}, ${locador.ciudad}, ${locador.provincia}` : "",
  ].filter(Boolean).join(", ");

  const locatariosTexto = locatarios.map((l) => {
    const partes = [
      l.nombre ? l.nombre.toUpperCase() : "___________",
      "argentino/a",
      l.dni ? `con Documento Nacional de Identidad N° ${l.dni}` : "",
      l.cuit ? `CUIT/CUIL N° ${l.cuit}` : "",
      l.nacimiento ? `nacido/a el ${l.nacimiento}` : "",
      l.domicilio ? `con domicilio real en ${l.domicilio}, ${l.ciudad}, ${l.provincia}` : "",
    ].filter(Boolean);
    return partes.join(", ");
  }).join("; y ");

  return `Entre ${locadorTexto}, en lo sucesivo la parte LOCADORA; y por la otra ${locatariosTexto}, en adelante denominada/s la parte LOCATARIA, todos hábiles para contratar, convienen celebrar el presente Contrato de Locación, sujeto a las siguientes cláusulas y/o condiciones.`;
}

function buildPrimera(d: ContratoData, tipo: ContractType): string {
  const { inmueble } = d;
  const esVivienda = tipo === "vivienda";
  const esGalpon = tipo === "galpon";

  const tipoInmueble = esVivienda
    ? "el INMUEBLE DE USO HABITACIONAL"
    : esGalpon
    ? "el INMUEBLE"
    : "el INMUEBLE DE USO COMERCIAL";

  let texto = `La parte LOCADORA cede en locación a la parte LOCATARIA, y esta acepta de plena conformidad, ${tipoInmueble} situado en ${inmueble.direccion || "___________"}, ${inmueble.ciudad}, Provincia de ${inmueble.provincia}.`;

  const cat = inmueble.catastro;
  if (cat && (cat.circunscripcion || cat.seccion || cat.manzana || cat.parcela || cat.partida)) {
    const catastroPartes = [
      cat.circunscripcion ? `Circunscripción ${cat.circunscripcion}` : "",
      cat.seccion ? `Sección ${cat.seccion}` : "",
      cat.manzana ? `Manzana ${cat.manzana}` : "",
      cat.parcela ? `Parcela ${cat.parcela}` : "",
      cat.partida ? `Partida Inmobiliaria ${cat.partida}` : "",
    ].filter(Boolean).join("; ");
    texto += ` Nomenclatura Catastral: ${catastroPartes}.`;
  }

  if (inmueble.descripcionFisica) {
    texto += ` ${inmueble.descripcionFisica}`;
  }

  if (inmueble.muebles) {
    texto += ` Forman parte de la presente locación los siguientes muebles, artefactos y efectos: ${inmueble.muebles}, todo en perfecto estado de uso.`;
  }

  const instalaciones = [
    inmueble.servicios.electricidad && "energía eléctrica",
    inmueble.servicios.gas && "gas natural",
    inmueble.servicios.agua && "agua corriente",
    inmueble.servicios.cloacas && "desagüe cloacal",
  ].filter(Boolean).join(", ");

  if (instalaciones) {
    texto += ` Instalaciones: el inmueble cuenta con ${instalaciones}, de acuerdo a las reglamentaciones vigentes.`;
  }

  return texto;
}

function buildSegunda(d: ContratoData): string {
  const { condiciones } = d;
  const fechaFin = condiciones.fechaInicio
    ? calcularFechaFin(condiciones.fechaInicio, condiciones.duracionMeses)
    : "";

  let texto = `El término de duración del presente contrato se ha estipulado en ${duracionEnPalabras(condiciones.duracionMeses)} meses`;
  if (condiciones.fechaInicio) {
    texto += `, a contar del día ${fechaLarga(condiciones.fechaInicio)}, siendo su vencimiento impostergable el día ${fechaLarga(fechaFin)}.`;
  } else {
    texto += ".";
  }
  return texto;
}

function buildTercera(d: ContratoData, tipo: ContractType): string {
  const { condiciones } = d;
  const periodosMap: Record<string, string> = {
    trimestral: "tres (3)",
    semestral: "seis (6)",
    cuatrimestral: "cuatro (4)",
    mensual: "uno (1)",
  };
  const periodosMeses = periodosMap[condiciones.ajuste.tipo] ?? "tres (3)";

  let texto = `Las partes convienen un alquiler mensual INICIAL en la suma de PESOS ${numeroAPalabras(condiciones.montoInicial)} ($ ${formatMontoPDF(condiciones.montoInicial)}.-), para los primeros ${periodosMeses} meses del presente contrato; para los siguientes períodos y hasta su finalización, dicho importe se actualizará ${descripcionAjuste(condiciones.ajuste)}. Para el caso de que dicho coeficiente no se encuentre disponible al momento del recálculo, se aplicará el del mes inmediato anterior y luego se actualizará con el próximo vencimiento.`;

  if (tipo === "comercial") {
    texto += " El precio es libre de impuestos, contemplándose que deberá sumársele el IVA en caso de corresponder.";
  }

  return texto;
}

function buildCuarta(d: ContratoData, tipo: ContractType): string {
  const { inmueble, condiciones } = d;
  const esGalpon = tipo === "galpon";

  let texto = "Se establece el siguiente acuerdo respecto al pago de servicios:";

  if (inmueble.servicios.electricidad) {
    texto += " Energía Eléctrica: a cargo del 100% de la LOCATARIA.";
  }
  if (inmueble.servicios.agua) {
    texto += " Agua Corriente y Cloaca: a cargo del 100% de la LOCATARIA.";
  }
  if (inmueble.servicios.gas && !esGalpon) {
    texto += " Gas Natural: a cargo del 100% de la LOCATARIA.";
  }

  texto += ` Tasa Municipal (Alumbrado, Barrido y Limpieza): a cargo de ${condiciones.tasaMunicipal === "locatario" ? "la LOCATARIA" : "el LOCADOR"}.`;
  texto += ` Impuesto Inmobiliario: a cargo de ${condiciones.impuestoInmobiliario === "locador" ? "el LOCADOR" : "la LOCATARIA"}.`;
  texto += " Todas las facturas originales, una vez abonadas, serán entregadas a la parte LOCADORA.";

  return texto;
}

function buildQuinta(d: ContratoData): string {
  const { condiciones } = d;
  const lugarPago = condiciones.lugarPago?.trim()
    ? condiciones.lugarPago
    : "Almada & Cía. Avda. San Martín 349 esquina Sordeaux, Las Flores, Provincia de Buenos Aires";

  return `Las partes pactan de pleno y común acuerdo que el pago del alquiler deberá ser efectuado por adelantado del uno (1) al ${diaEnPalabras(condiciones.pagoDia)} de cada mes en el domicilio designado: ${lugarPago}.`;
}

const TEXTO_SEXTA = `Al término del contrato la parte LOCATARIA desocupará el inmueble y lo entregará a entera satisfacción de la parte LOCADORA, debiendo entregarlo en buen estado y limpio. Caso contrario, a partir del inmediato vencimiento del presente, deberá abonar además del importe equivalente al último mes de contrato que corresponda, una multa diaria equivalente al cincuenta por ciento (50%) del mencionado importe y hasta la entrega del inmueble a la parte LOCADORA. Esta suma será abonada en concepto de cláusula penal indemnizatoria.`;

const TEXTO_SEPTIMA = `La parte LOCATARIA recibirá el inmueble en el estado que se encuentra y se obliga a conservarlo y restituirlo en el mismo estado, salvo el deterioro producido por el uso normal, siendo responsable de todo daño que por su culpa o negligencia sufriera el inmueble. Queda obligada a realizar todas las reparaciones locativas que sean necesarias durante la vigencia del contrato. Al momento de la devolución deberá entregarlo pintado en tonos claros.`;

function buildGarantes(d: ContratoData): string {
  return d.garantes.map((g) => {
    const partes = [
      g.nombre ? g.nombre.toUpperCase() : "___________",
      g.dni ? `DNI N° ${g.dni}` : "",
      g.cuit ? `CUIT/CUIL ${g.cuit}` : "",
      g.domicilio ? `con domicilio en ${g.domicilio}, ${g.ciudad}` : "",
      g.relacion ? `(${g.relacion})` : "",
    ].filter(Boolean).join(", ");
    return `${partes}, en carácter de fiador solidario, liso, llano y principal pagador, renunciando expresamente a los beneficios de excusión y división, garantiza el fiel cumplimiento de todas las obligaciones emergentes del presente contrato por parte de la LOCATARIA.`;
  }).join("\n\n");
}

function nombreClausula(n: number): string {
  const nombres = ["", "PRIMERO", "SEGUNDO", "TERCERO", "CUARTO", "QUINTO",
    "SEXTO", "SÉPTIMO", "OCTAVO", "NOVENO", "DÉCIMO", "UNDÉCIMO", "DUODÉCIMO"];
  return nombres[n] ?? `${n}°`;
}

// ── Generador principal ───────────────────────────────────────────

export function generarClausulas(data: ContratoData, tipo: ContractType): Clausula[] {
  const clausulas: Clausula[] = [
    { id: "INTRO",    titulo: "",                               texto: buildIntro(data) },
    { id: "PRIMERA",  titulo: "PRIMERO – OBJETO:",              texto: buildPrimera(data, tipo) },
    { id: "SEGUNDA",  titulo: "SEGUNDO – PLAZO:",               texto: buildSegunda(data) },
    { id: "TERCERA",  titulo: "TERCERO – IMPORTE DEL ALQUILER:", texto: buildTercera(data, tipo) },
    { id: "CUARTA",   titulo: "CUARTO – EXPENSAS, SERVICIOS Y TASAS:", texto: buildCuarta(data, tipo) },
    { id: "QUINTA",   titulo: "QUINTO – PERÍODO Y LUGAR DE PAGO:", texto: buildQuinta(data) },
    { id: "SEXTA",    titulo: "SEXTO – DESOCUPACIÓN:",          texto: TEXTO_SEXTA },
    { id: "SEPTIMA",  titulo: "SÉPTIMO – CONSERVACIÓN DEL INMUEBLE:", texto: TEXTO_SEPTIMA },
  ];

  let n = 8;
  if (data.opcionales?.inmuebleEnVenta) {
    clausulas.push({
      id: "VENTA",
      titulo: `${nombreClausula(n++)} – INMUEBLE EN VENTA:`,
      texto: "La parte LOCATARIA manifiesta tener conocimiento que el inmueble objeto del presente contrato se encuentra a la venta; situación que acepta, y en caso de producirse la misma, se obliga a entregar el inmueble totalmente desocupado a la parte LOCADORA dentro de los ciento ochenta (180) días de recibir la notificación correspondiente.",
    });
  }

  if (data.opcionales?.clausulaEspecial?.trim()) {
    clausulas.push({
      id: "ESPECIAL",
      titulo: `${nombreClausula(n++)} – CLÁUSULA ESPECIAL:`,
      texto: data.opcionales.clausulaEspecial,
    });
  }

  if (data.garantes?.length) {
    clausulas.push({
      id: "FIANZA",
      titulo: `${nombreClausula(n++)} – FIANZA:`,
      texto: buildGarantes(data),
    });
  }

  return clausulas;
}

// ── Helper para el cierre del contrato ───────────────────────────

export function buildCierre(data: ContratoData): string {
  const ejemplares = data.garantes?.length ? "tres (3)" : "dos (2)";
  let texto = `En prueba de conformidad, las partes firman el presente contrato en ${ejemplares} ejemplares de un mismo tenor y a un solo efecto, en la ciudad de Las Flores, Provincia de Buenos Aires.`;
  if (data.condiciones.fechaInicio) {
    texto += ` Fecha: ${fechaLarga(data.condiciones.fechaInicio)}.`;
  }
  return texto;
}
