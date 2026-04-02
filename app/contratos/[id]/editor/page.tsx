import { notFound } from "next/navigation";
import { obtenerContratoAction } from "@/actions/contratos.actions";
import { ContratoEditor } from "@/components/editor/ContratoEditor";
import type { ContractType } from "@/types/contrato";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [contrato, err] = await obtenerContratoAction({ id });

  if (err || !contrato) {
    notFound();
  }

  return (
    <ContratoEditor
      contrato={{
        id: contrato.id,
        nombre: contrato.nombre,
        tipo: contrato.tipo as ContractType,
        data: contrato.data as Record<string, unknown>,
      }}
    />
  );
}
