"use server";

import { createServerAction } from "zsa";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  crearContratoSchema,
  actualizarContratoSchema,
  idContratoSchema,
} from "@/validations/contrato.schema";
import { emptyContrato } from "@/types/contrato";

// ── Crear borrador (solo tipo) ────────────────────────────────

export const crearBorradorContratoAction = createServerAction()
  .input(z.object({ tipo: z.enum(["vivienda", "comercial", "galpon"]) }))
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("contratos")
      .insert({
        user_id: user.id,
        nombre: "Sin nombre",
        tipo: input.tipo,
        data: emptyContrato(input.tipo),
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

// ── Listar contratos del usuario ──────────────────────────────

export const listarContratosAction = createServerAction().handler(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contratos")
    .select("id, nombre, tipo, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
});

// ── Obtener un contrato por ID ────────────────────────────────

export const obtenerContratoAction = createServerAction()
  .input(idContratoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contratos")
      .select("*")
      .eq("id", input.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

// ── Crear contrato ────────────────────────────────────────────

export const crearContratoAction = createServerAction()
  .input(crearContratoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("contratos")
      .insert({
        user_id: user.id,
        nombre: input.nombre,
        tipo: input.tipo,
        data: input,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

// ── Actualizar contrato (autosave) ────────────────────────────

export const actualizarContratoAction = createServerAction()
  .input(actualizarContratoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from("contratos")
      .update({
        nombre: input.nombre,
        tipo: input.tipo,
        data: input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ── Duplicar contrato ─────────────────────────────────────────

export const duplicarContratoAction = createServerAction()
  .input(idContratoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data: original, error: fetchError } = await supabase
      .from("contratos")
      .select("*")
      .eq("id", input.id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const { data, error } = await supabase
      .from("contratos")
      .insert({
        user_id: user.id,
        nombre: `${original.nombre} (copia)`,
        tipo: original.tipo,
        data: { ...original.data, nombre: `${original.nombre} (copia)` },
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

// ── Eliminar contrato ─────────────────────────────────────────

export const eliminarContratoAction = createServerAction()
  .input(idContratoSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from("contratos")
      .delete()
      .eq("id", input.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });
