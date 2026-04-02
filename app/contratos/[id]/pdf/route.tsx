import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { ContratoTemplate } from "@/lib/pdf/contrato-template";
import type { Contrato } from "@/types/contrato";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data: contrato, error } = await supabase
    .from("contratos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !contrato) {
    return new Response("Contrato no encontrado", { status: 404 });
  }

  const contratoData = contrato.data as Omit<Contrato, "id" | "createdAt" | "updatedAt">;

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<ContratoTemplate
      contrato={{
        ...contratoData,
        id: contrato.id,
        nombre: contrato.nombre,
        tipo: contrato.tipo,
        createdAt: contrato.created_at,
        updatedAt: contrato.updated_at,
      }}
    />) as any
  );

  const nombreArchivo = `contrato-${contrato.nombre.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
