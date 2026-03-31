/**
 * types/contrato.ts
 * Tipos inferidos desde contrato.schema.ts — no editar manualmente.
 */

import type { z } from "zod";
import type {
  contratoSchema,
  personaSchema,
  garanteSchema,
  inmuebleSchema,
  condicionesSchema,
} from "@/validations/contrato.schema";

export type ContractType = "vivienda" | "comercial" | "galpon";
export type AjusteType = "trimestral" | "semestral" | "cuatrimestral" | "mensual";

export type Persona = z.infer<typeof personaSchema>;
export type Garante = z.infer<typeof garanteSchema>;
export type Inmueble = z.infer<typeof inmuebleSchema>;
export type Condiciones = z.infer<typeof condicionesSchema>;
export type Contrato = z.infer<typeof contratoSchema>;

/** Fábrica de persona vacía con defaults de Argentina */
export const emptyPersona = (): Persona => ({
  nombre: "",
  dni: "",
  cuit: "",
  nacimiento: "",
  domicilio: "",
  ciudad: "Las Flores",
  provincia: "Buenos Aires",
  telefono: "",
});

/** Fábrica de contrato vacío con defaults por tipo */
export const emptyContrato = (tipo: ContractType = "vivienda"): Omit<Contrato, "id" | "createdAt" | "updatedAt"> => ({
  tipo,
  nombre: "",
  locador: emptyPersona(),
  locatarios: [emptyPersona()],
  inmueble: {
    direccion: "",
    ciudad: "Las Flores",
    provincia: "Buenos Aires",
    catastro: { circunscripcion: "I", seccion: "", manzana: "", parcela: "", partida: "" },
    descripcionFisica: "",
    servicios: { electricidad: true, gas: false, agua: true, cloacas: true },
    muebles: "",
    destinoUso: tipo === "vivienda" ? "vivienda familiar" : tipo === "comercial" ? "uso comercial" : "depósito y actividades afines",
  },
  condiciones: {
    fechaInicio: "",
    duracionMeses: tipo === "comercial" ? 36 : 24,
    montoInicial: 0,
    moneda: "ARS",
    ajuste: { tipo: "trimestral", indice: "IPC" },
    pagoDia: 5,
    lugarPago: "",
    impuestoInmobiliario: "locador",
    tasaMunicipal: "locatario",
  },
  garantes: [],
  opcionales: { inmuebleEnVenta: false, clausulaEspecial: "" },
});
