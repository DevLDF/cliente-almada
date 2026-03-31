import { useFormContext, useFieldArray } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";
import { emptyPersona } from "@/types/contrato";

type FormValues = z.infer<typeof crearContratoSchema>;

export default function Step2Locatarios(_: { tipo: string }) {
  const { register, control, formState: { errors } } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "locatarios" });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Datos de los locatarios</h2>
      <p className="text-sm text-gray-400 mb-6">Inquilinos que firman el contrato</p>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const e = errors.locatarios?.[index];
          return (
            <div key={field.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Locatario {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoTexto
                  label="Nombre completo *"
                  {...register(`locatarios.${index}.nombre`)}
                  error={e?.nombre?.message}
                  placeholder="María López"
                  className="sm:col-span-2"
                />
                <CampoTexto
                  label="DNI *"
                  {...register(`locatarios.${index}.dni`)}
                  error={e?.dni?.message}
                  placeholder="12345678"
                />
                <CampoTexto
                  label="CUIT / CUIL"
                  {...register(`locatarios.${index}.cuit`)}
                  placeholder="27-12345678-4"
                />
                <CampoTexto
                  label="Fecha de nacimiento"
                  {...register(`locatarios.${index}.nacimiento`)}
                  type="date"
                />
                <CampoTexto
                  label="Teléfono"
                  {...register(`locatarios.${index}.telefono`)}
                  placeholder="+54 9 2244 000000"
                />
                <CampoTexto
                  label="Domicilio"
                  {...register(`locatarios.${index}.domicilio`)}
                  placeholder="Calle Mitre 123"
                  className="sm:col-span-2"
                />
                <CampoTexto
                  label="Ciudad"
                  {...register(`locatarios.${index}.ciudad`)}
                />
                <CampoTexto
                  label="Provincia"
                  {...register(`locatarios.${index}.provincia`)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append(emptyPersona())}
        className="mt-4 w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#0F3A5F] hover:text-[#0F3A5F] transition-colors"
      >
        + Agregar locatario
      </button>
    </div>
  );
}
