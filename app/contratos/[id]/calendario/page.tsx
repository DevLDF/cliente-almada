import { obtenerContratoAction } from "@/actions/contratos.actions";
import { listarPagosAction } from "@/actions/pagos.actions";
import CalendarioPagos from "@/components/contratos/CalendarioPagos";
import { notFound } from "next/navigation";
import type { PagoCalendario } from "@/validations/pago.schema";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CalendarioPage({ params }: Props) {
  const { id } = await params;

  const [contrato, errContrato] = await obtenerContratoAction({ id });
  if (errContrato || !contrato) notFound();

  const [pagos] = await listarPagosAction({ contrato_id: id });

  const contratoData = contrato.data as { locatarios?: { nombre?: string; telefono?: string }[] } | null;
  const locatario = contratoData?.locatarios?.[0];

  return (
    <CalendarioPagos
      contrato={{
        id: contrato.id,
        nombre: contrato.nombre,
        tipo: contrato.tipo,
        locatarioNombre: locatario?.nombre ?? "",
        locatarioTelefono: locatario?.telefono ?? "",
      }}
      pagosIniciales={(pagos ?? []) as PagoCalendario[]}
    />
  );
}
