import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";

type FormValues = z.infer<typeof crearContratoSchema>;

export default function Step1Locador(_: { tipo: string }) {
  const { register, formState: { errors } } = useFormContext<FormValues>();
  const e = errors.locador;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Datos del locador</h2>
      <p className="text-sm text-gray-400 mb-6">Propietario o titular del inmueble</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoTexto
          label="Nombre completo *"
          {...register("locador.nombre")}
          error={e?.nombre?.message}
          placeholder="Juan García"
          className="sm:col-span-2"
        />
        <CampoTexto
          label="DNI *"
          {...register("locador.dni")}
          error={e?.dni?.message}
          placeholder="12345678"
        />
        <CampoTexto
          label="CUIT / CUIL"
          {...register("locador.cuit")}
          placeholder="20-12345678-9"
        />
        <CampoTexto
          label="Fecha de nacimiento"
          {...register("locador.nacimiento")}
          type="date"
        />
        <CampoTexto
          label="Teléfono"
          {...register("locador.telefono")}
          placeholder="+54 9 2244 000000"
        />
        <CampoTexto
          label="Domicilio"
          {...register("locador.domicilio")}
          placeholder="Calle Mitre 123"
          className="sm:col-span-2"
        />
        <CampoTexto
          label="Ciudad"
          {...register("locador.ciudad")}
          placeholder="Las Flores"
        />
        <CampoTexto
          label="Provincia"
          {...register("locador.provincia")}
          placeholder="Buenos Aires"
        />
      </div>
    </div>
  );
}
