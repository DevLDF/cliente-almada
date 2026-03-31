import { obtenerContratoAction } from "@/actions/contratos.actions";
import ContratoWizard from "@/components/forms/contrato/ContratoWizard";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarContratoPage({ params }: Props) {
  const { id } = await params;
  const [contrato, err] = await obtenerContratoAction({ id });

  if (err || !contrato) notFound();

  return <ContratoWizard contrato={contrato} />;
}
