import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { crearContratoSchema } from "@/validations/contrato.schema";
import { CampoTexto } from "../CampoTexto";

type FormValues = z.infer<typeof crearContratoSchema>;

export default function Step4Condiciones(_: { tipo: string }) {
  const { register, formState: { errors } } = useFormContext<FormValues>();
  const e = errors.condiciones;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Condiciones económicas</h2>
      <p className="text-sm text-gray-400 mb-6">Plazos, montos y ajustes</p>

      <div className="space-y-6">
        {/* Vigencia */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Vigencia</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto
              label="Fecha de inicio *"
              {...register("condiciones.fechaInicio")}
              error={e?.fechaInicio?.message}
              type="date"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (meses) *</label>
              <input
                type="number"
                {...register("condiciones.duracionMeses", { valueAsNumber: true })}
                min={1}
                max={120}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent"
              />
              {e?.duracionMeses?.message && (
                <p className="text-xs text-red-500 mt-1">{e.duracionMeses.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Monto */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Monto inicial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto mensual (ARS) *</label>
              <input
                type="number"
                {...register("condiciones.montoInicial", { valueAsNumber: true })}
                min={0}
                step={100}
                placeholder="150000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent"
              />
              {e?.montoInicial?.message && (
                <p className="text-xs text-red-500 mt-1">{e.montoInicial.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día de pago</label>
              <input
                type="number"
                {...register("condiciones.pagoDia", { valueAsNumber: true })}
                min={1}
                max={28}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ajuste */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Ajuste</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periodicidad</label>
              <select
                {...register("condiciones.ajuste.tipo")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent bg-white"
              >
                <option value="trimestral">Trimestral</option>
                <option value="cuatrimestral">Cuatrimestral</option>
                <option value="semestral">Semestral</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Índice</label>
              <select
                {...register("condiciones.ajuste.indice")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent bg-white"
              >
                <option value="IPC">IPC</option>
                <option value="ICL">ICL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% manual</label>
              <input
                type="number"
                {...register("condiciones.ajuste.porcentaje", { valueAsNumber: true })}
                min={0}
                max={100}
                step={0.1}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Impuestos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Cargas impositivas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impuesto inmobiliario</label>
              <select
                {...register("condiciones.impuestoInmobiliario")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent bg-white"
              >
                <option value="locador">A cargo del locador</option>
                <option value="locatario">A cargo del locatario</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa municipal</label>
              <select
                {...register("condiciones.tasaMunicipal")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent bg-white"
              >
                <option value="locatario">A cargo del locatario</option>
                <option value="locador">A cargo del locador</option>
              </select>
            </div>
          </div>
        </div>

        <CampoTexto
          label="Lugar de pago"
          {...register("condiciones.lugarPago")}
          placeholder="Oficina Almada & Cía — Mitre 123, Las Flores"
        />
      </div>
    </div>
  );
}
