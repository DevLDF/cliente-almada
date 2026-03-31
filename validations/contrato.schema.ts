import { z } from "zod";

// ── Sub-schemas ───────────────────────────────────────────────

export const personaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  dni: z.string().min(7, "DNI inválido").max(9),
  cuit: z.string().optional().default(""),
  nacimiento: z.string().optional().default(""),
  domicilio: z.string().optional().default(""),
  ciudad: z.string().optional().default("Las Flores"),
  provincia: z.string().optional().default("Buenos Aires"),
  telefono: z.string().optional().default(""),
});

export const garanteSchema = personaSchema.extend({
  relacion: z.string().optional(),
});

export const catastroSchema = z.object({
  circunscripcion: z.string().optional().default("I"),
  seccion: z.string().optional().default(""),
  manzana: z.string().optional().default(""),
  parcela: z.string().optional().default(""),
  partida: z.string().optional().default(""),
});

export const inmuebleSchema = z.object({
  direccion: z.string().min(1, "La dirección es obligatoria"),
  ciudad: z.string().optional().default("Las Flores"),
  provincia: z.string().optional().default("Buenos Aires"),
  catastro: catastroSchema.optional().default({}),
  descripcionFisica: z.string().optional().default(""),
  servicios: z.object({
    electricidad: z.boolean().default(true),
    gas: z.boolean().default(false),
    agua: z.boolean().default(true),
    cloacas: z.boolean().default(true),
  }).default({}),
  muebles: z.string().optional().default(""),
  destinoUso: z.string().optional().default("vivienda familiar"),
});

export const condicionesSchema = z.object({
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  duracionMeses: z.number().int().min(1).max(120),
  montoInicial: z.number().min(0),
  moneda: z.enum(["ARS", "USD"]).default("ARS"),
  ajuste: z.object({
    tipo: z.enum(["trimestral", "semestral", "cuatrimestral", "mensual"]).default("trimestral"),
    indice: z.enum(["IPC", "ICL"]).default("IPC"),
    primerAjusteMes: z.number().optional(),
  }),
  pagoDia: z.number().int().min(1).max(28).default(5),
  lugarPago: z.string().optional().default(""),
  impuestoInmobiliario: z.enum(["locador", "locatario"]).default("locador"),
  tasaMunicipal: z.enum(["locador", "locatario"]).default("locatario"),
});

// ── Schema principal ──────────────────────────────────────────

export const contratoSchema = z.object({
  id: z.string().uuid(),
  tipo: z.enum(["vivienda", "comercial", "galpon"]),
  nombre: z.string().min(1, "El nombre del contrato es obligatorio"),
  locador: personaSchema,
  locatarios: z.array(personaSchema).min(1, "Al menos un locatario es requerido"),
  inmueble: inmuebleSchema,
  condiciones: condicionesSchema,
  garantes: z.array(garanteSchema).default([]),
  opcionales: z.object({
    inmuebleEnVenta: z.boolean().default(false),
    clausulaEspecial: z.string().optional().default(""),
  }).default({}),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ── Schemas para Server Actions ───────────────────────────────

export const crearContratoSchema = contratoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const actualizarContratoSchema = contratoSchema.partial().required({ id: true });

export const idContratoSchema = z.object({
  id: z.string().uuid(),
});
