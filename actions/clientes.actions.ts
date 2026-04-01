"use server";

import { createServerAction } from "zsa";
import { createClient } from "@/lib/supabase/server";
import type { Persona } from "@/types/contrato";

type ClienteRow = {
  nombre: string;
  dni: string;
  telefono: string;
  contrato_id: string;
  contrato_nombre: string;
  inmueble_direccion: string;
};

type ContratoData = {
  locador?: Persona;
  locatarios?: Persona[];
  inmueble?: { direccion?: string };
};

// ─────────────────────────────────────────────────────────────────────────────
// Propietarios (locadores) extraídos de los contratos existentes
// ─────────────────────────────────────────────────────────────────────────────

export const listarLocadoresAction = createServerAction().handler(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contratos")
    .select("id, nombre, data");

  if (error) throw new Error(error.message);

  const seen = new Set<string>();
  const locadores: ClienteRow[] = [];

  for (const contrato of data ?? []) {
    const d = contrato.data as ContratoData;
    const locador = d?.locador;
    if (!locador?.nombre || !locador.dni) continue;

    if (!seen.has(locador.dni)) {
      seen.add(locador.dni);
      locadores.push({
        nombre: locador.nombre,
        dni: locador.dni,
        telefono: locador.telefono ?? "",
        contrato_id: contrato.id as string,
        contrato_nombre: contrato.nombre as string,
        inmueble_direccion: d?.inmueble?.direccion ?? "",
      });
    }
  }

  return locadores.sort((a, b) => a.nombre.localeCompare(b.nombre));
});

// ─────────────────────────────────────────────────────────────────────────────
// Inquilinos (locatarios) extraídos de los contratos existentes
// ─────────────────────────────────────────────────────────────────────────────

export const listarLocatariosAction = createServerAction().handler(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contratos")
    .select("id, nombre, data");

  if (error) throw new Error(error.message);

  const seen = new Set<string>();
  const locatarios: ClienteRow[] = [];

  for (const contrato of data ?? []) {
    const d = contrato.data as ContratoData;
    for (const locatario of d?.locatarios ?? []) {
      if (!locatario?.nombre || !locatario.dni) continue;
      if (!seen.has(locatario.dni)) {
        seen.add(locatario.dni);
        locatarios.push({
          nombre: locatario.nombre,
          dni: locatario.dni,
          telefono: locatario.telefono ?? "",
          contrato_id: contrato.id as string,
          contrato_nombre: contrato.nombre as string,
          inmueble_direccion: d?.inmueble?.direccion ?? "",
        });
      }
    }
  }

  return locatarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
});
