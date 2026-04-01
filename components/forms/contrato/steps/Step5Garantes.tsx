import { useFormContext, useFieldArray } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";

type FormValues = z.infer<typeof crearContratoSchema>;

const emptyGarante = () => ({
  nombre: "",
  dni: "",
  cuit: "",
  nacimiento: "",
  domicilio: "",
  ciudad: "Las Flores",
  provincia: "Buenos Aires",
  telefono: "",
  relacion: "",
});

export default function Step5Garantes(_: { tipo: string }) {
  const { register, control, formState: { errors } } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "garantes" });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Garantes</h2>
      <p className="text-sm text-gray-400 mb-6">
        Opcional — podés continuar sin agregar garantes
      </p>

      {fields.length === 0 ? (
        <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl mb-4">
          <p className="text-sm">Sin garantes por el momento</p>
        </div>
      ) : (
        <div className="space-y-6 mb-4">
          {fields.map((field, index) => {
            const e = errors.garantes?.[index];
            return (
              <div key={field.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Garante {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CampoTexto
                    label="Nombre completo *"
                    {...register(`garantes.${index}.nombre`)}
                    error={e?.nombre?.message}
                    placeholder="Carlos Rodríguez"
                    className="sm:col-span-2"
                  />
                  <CampoTexto
                    label="DNI *"
                    {...register(`garantes.${index}.dni`)}
                    error={e?.dni?.message}
                    placeholder="12345678"
                  />
                  <CampoTexto
                    label="Relación con el locatario"
                    {...register(`garantes.${index}.relacion`)}
                    placeholder="Padre, cónyuge, empleador..."
                  />
                  <CampoTexto
                    label="Teléfono"
                    {...register(`garantes.${index}.telefono`)}
                    placeholder="+54 9 2244 000000"
                  />
                  <CampoTexto
                    label="CUIT / CUIL"
                    {...register(`garantes.${index}.cuit`)}
                    placeholder="20-12345678-9"
                  />
                  <CampoTexto
                    label="Domicilio"
                    {...register(`garantes.${index}.domicilio`)}
                    placeholder="Calle San Martín 789"
                    className="sm:col-span-2"
                  />
                  <CampoTexto
                    label="Ciudad"
                    {...register(`garantes.${index}.ciudad`)}
                  />
                  <CampoTexto
                    label="Provincia"
                    {...register(`garantes.${index}.provincia`)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => append(emptyGarante())}
        className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#0F3A5F] hover:text-[#0F3A5F] transition-colors"
      >
        + Agregar garante
      </button>
    </div>
  );
}
