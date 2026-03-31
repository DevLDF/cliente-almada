import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";

type FormValues = z.infer<typeof crearContratoSchema>;

const SERVICIOS = [
  { key: "electricidad" as const, label: "Electricidad" },
  { key: "gas" as const, label: "Gas" },
  { key: "agua" as const, label: "Agua" },
  { key: "cloacas" as const, label: "Cloacas" },
];

export default function Step3Inmueble({ tipo }: { tipo: string }) {
  const { register, formState: { errors } } = useFormContext<FormValues>();
  const e = errors.inmueble;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Datos del inmueble</h2>
      <p className="text-sm text-gray-400 mb-6">Propiedad objeto del contrato</p>

      <div className="space-y-6">
        {/* Ubicación */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Ubicación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto
              label="Dirección *"
              {...register("inmueble.direccion")}
              error={e?.direccion?.message}
              placeholder="Calle Mitre 456"
              className="sm:col-span-2"
            />
            <CampoTexto
              label="Ciudad"
              {...register("inmueble.ciudad")}
              placeholder="Las Flores"
            />
            <CampoTexto
              label="Provincia"
              {...register("inmueble.provincia")}
            />
          </div>
        </div>

        {/* Catastro */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Datos catastrales</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <CampoTexto label="Circunscripción" {...register("inmueble.catastro.circunscripcion")} />
            <CampoTexto label="Sección" {...register("inmueble.catastro.seccion")} />
            <CampoTexto label="Manzana" {...register("inmueble.catastro.manzana")} />
            <CampoTexto label="Parcela" {...register("inmueble.catastro.parcela")} />
            <CampoTexto label="Partida" {...register("inmueble.catastro.partida")} className="sm:col-span-2" />
          </div>
        </div>

        {/* Descripción y servicios */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Características</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción física</label>
              <textarea
                {...register("inmueble.descripcionFisica")}
                rows={2}
                placeholder="Casa de 3 ambientes con patio..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
              <div className="flex flex-wrap gap-3">
                {SERVICIOS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`inmueble.servicios.${key}`)}
                      className="w-4 h-4 rounded accent-[#0F3A5F]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <CampoTexto
              label="Mobiliario / equipamiento"
              {...register("inmueble.muebles")}
              placeholder="Cocina completa, lavarropas..."
            />
            <CampoTexto
              label="Destino de uso"
              {...register("inmueble.destinoUso")}
              placeholder={tipo === "vivienda" ? "Vivienda familiar" : tipo === "comercial" ? "Uso comercial" : "Depósito y actividades afines"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
