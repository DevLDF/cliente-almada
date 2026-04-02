"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { crearContratoSchema } from "@/validations/contrato.schema";
import { emptyContrato } from "@/types/contrato";
import { actualizarContratoAction } from "@/actions/contratos.actions";
import type { z } from "zod";
import Step1Locador from "./steps/Step1Locador";
import Step2Locatarios from "./steps/Step2Locatarios";
import Step3Inmueble from "./steps/Step3Inmueble";
import Step4Condiciones from "./steps/Step4Condiciones";
import Step5Garantes from "./steps/Step5Garantes";
import Step6Opcionales from "./steps/Step6Opcionales";

type FormValues = z.infer<typeof crearContratoSchema>;

const STEPS = [
  { label: "Locador",     fields: ["locador"] as const },
  { label: "Locatarios",  fields: ["locatarios"] as const },
  { label: "Inmueble",    fields: ["inmueble"] as const },
  { label: "Condiciones", fields: ["condiciones"] as const },
  { label: "Garantes",    fields: ["garantes"] as const },
  { label: "Final",       fields: ["nombre", "opcionales"] as const },
];

const STEP_COMPONENTS = [
  Step1Locador,
  Step2Locatarios,
  Step3Inmueble,
  Step4Condiciones,
  Step5Garantes,
  Step6Opcionales,
];

interface ContratoRow {
  id: string;
  tipo: "vivienda" | "comercial" | "galpon";
  nombre: string;
  data: Record<string, unknown>;
}

export default function ContratoWizard({ contrato }: { contrato: ContratoRow }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const defaults = emptyContrato(contrato.tipo);
  const initialData = { ...defaults, ...(contrato.data as Partial<FormValues>) };

  const form = useForm<FormValues>({
    resolver: zodResolver(crearContratoSchema) as never,
    defaultValues: {
      ...initialData,
      tipo: contrato.tipo,
      nombre: contrato.nombre !== "Sin nombre" ? contrato.nombre : (initialData.nombre ?? ""),
    },
    mode: "onTouched",
  });

  async function saveCurrentStep() {
    const values = form.getValues();
    const nombre = derivarNombre(values);
    await actualizarContratoAction({
      id: contrato.id,
      ...values,
      nombre,
    });
  }

  async function handleNext() {
    const fieldsToValidate = [...(STEPS[step]?.fields ?? [])] as Parameters<typeof form.trigger>[0];
    const valid = await form.trigger(fieldsToValidate);
    if (!valid) return;

    setSaving(true);
    setSaveError(null);
    try {
      await saveCurrentStep();
      if (step === STEPS.length - 1) {
        router.push("/contratos");
      } else {
        setStep((s) => s + 1);
      }
    } catch {
      setSaveError("No se pudo guardar. Revisá tu conexión e intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrev() {
    setStep((s) => s - 1);
  }

  const CurrentStep = STEP_COMPONENTS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/contratos")}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← Contratos
          </button>
          <span className="text-sm font-medium text-gray-500 capitalize">
            {contrato.tipo}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < step
                      ? "bg-[#0F3A5F] text-white"
                      : i === step
                      ? "bg-[#0F3A5F] text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs mt-1 hidden sm:block ${
                    i === step ? "text-[#0F3A5F] font-medium" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-[#0F3A5F] h-1 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <FormProvider {...form}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <CurrentStep tipo={contrato.tipo} />
          </div>

          {/* Save error */}
          {saveError && (
            <div className="mt-4 px-4 py-3 rounded-lg text-sm" style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>
              {saveError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={handlePrev}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ← Anterior
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0F3A5F] rounded-lg hover:bg-[#1E5A8A] transition-colors disabled:opacity-50 min-w-[130px]"
            >
              {saving ? "Guardando..." : isLast ? "Guardar contrato" : "Siguiente →"}
            </button>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

function derivarNombre(values: Partial<FormValues>): string {
  const locatario = values.locatarios?.[0]?.nombre;
  const direccion = values.inmueble?.direccion;
  if (locatario && direccion) return `${locatario} — ${direccion}`;
  if (locatario) return locatario;
  return values.nombre || "Sin nombre";
}
