import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";

type FormValues = z.infer<typeof crearContratoSchema>;

export default function Step6Opcionales(_: { tipo: string }) {
  const { register } = useFormContext<FormValues>();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Detalles finales</h2>
      <p className="text-sm text-gray-400 mb-6">Cláusulas adicionales y nombre del contrato</p>

      <div className="space-y-5">
        <CampoTexto
          label="Nombre del contrato"
          {...register("nombre")}
          placeholder="García — Mitre 456 (se auto-completa)"
        />

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <input
            type="checkbox"
            id="inmuebleEnVenta"
            {...register("opcionales.inmuebleEnVenta")}
            className="mt-0.5 w-4 h-4 rounded accent-amber-600"
          />
          <label htmlFor="inmuebleEnVenta" className="text-sm text-amber-800 cursor-pointer">
            <span className="font-medium">Inmueble en venta</span>
            <span className="block text-amber-600 text-xs mt-0.5">
              El locatario tiene derecho de preferencia en la compra
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cláusula especial
          </label>
          <textarea
            {...register("opcionales.clausulaEspecial")}
            rows={4}
            placeholder="Cualquier condición adicional acordada entre las partes..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Opcional — será incluida en el contrato generado
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">¿Todo listo?</p>
          <p className="text-xs text-gray-400">
            Al guardar, el contrato quedará registrado. Podés editarlo en cualquier momento desde la lista de contratos.
          </p>
        </div>
      </div>
    </div>
  );
}
