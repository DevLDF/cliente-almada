"use client";

import type { ContratoData } from "@/lib/contract-html-generator";
import type { AjusteType } from "@/types/contrato";
import { SectionCollapse } from "@/components/editor/SectionCollapse";
import { FormField, Input, Select } from "@/components/editor/FormField";

interface Props {
  data: ContratoData;
  onUpdate: (d: ContratoData) => void;
  onHighlight: (e: React.FocusEvent<HTMLElement>) => void;
  onScrollTo: (clauseId: string) => void;
  open: boolean;
  onToggle: () => void;
  onActivate: () => void;
}

const DURACION_OPTIONS = [
  { value: "12",  label: "12 meses" },
  { value: "18",  label: "18 meses" },
  { value: "24",  label: "24 meses" },
  { value: "30",  label: "30 meses" },
  { value: "36",  label: "36 meses" },
  { value: "48",  label: "48 meses" },
];

const AJUSTE_OPTIONS = [
  { value: "trimestral",    label: "Trimestral" },
  { value: "cuatrimestral", label: "Cuatrimestral" },
  { value: "semestral",     label: "Semestral" },
  { value: "mensual",       label: "Mensual" },
];

const AJUSTE_HIGHLIGHT: Record<AjusteType, string> = {
  trimestral:    "CUARTO (4to.)|TRIMESTRALMENTE|trimestralmente|cada trimestre",
  cuatrimestral: "CUARTO (4to.)|CUATRIMESTRALMENTE|cuatrimestralmente",
  semestral:     "SEXTO (6to.)|SEMESTRALMENTE|semestralmente",
  mensual:       "mensualmente",
};

const INDICE_OPTIONS = [
  { value: "IPC", label: "IPC (Índice de Precios al Consumidor)" },
  { value: "ICL", label: "ICL (Índice de Contratos de Locación)" },
];

const PAGO_DIA_OPTIONS = Array.from({ length: 28 }, (_, i) => ({
  value: String(i + 1),
  label: `Día ${i + 1}`,
}));

export function CondicionesSection({ data, onUpdate, onHighlight, onScrollTo, open, onToggle, onActivate }: Props) {
  const { condiciones } = data;

  function setCond<K extends keyof typeof condiciones>(field: K, value: typeof condiciones[K]) {
    onUpdate({ ...data, condiciones: { ...condiciones, [field]: value } });
  }

  function handleFocusSegunda(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("SEGUNDA");
    onHighlight(e);
  }

  function handleFocusTercera(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("TERCERA");
    onHighlight(e);
  }

  function handleFocusCuarta(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("CUARTA");
    onHighlight(e);
  }

  function handleFocusQuinta(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("QUINTA");
    onHighlight(e);
  }

  const montoFormatted = condiciones.montoInicial
    ? `$ ${condiciones.montoInicial.toLocaleString("es-AR")}`
    : undefined;

  return (
    <SectionCollapse title="Condiciones" badge={montoFormatted} open={open} onToggle={onToggle}>

      {/* Fechas y duración — cláusula SEGUNDA */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
          Plazo
        </p>
        <div className="flex flex-col gap-3">
          <FormField label="Fecha de inicio" required>
            <Input
              type="date"
              value={condiciones.fechaInicio}
              onChange={(e) => setCond("fechaInicio", e.target.value)}
              onFocus={handleFocusSegunda}
            />
          </FormField>
          <FormField label="Duración">
            <Select
              value={String(condiciones.duracionMeses)}
              options={DURACION_OPTIONS}
              onChange={(e) => setCond("duracionMeses", parseInt(e.target.value))}
              onFocus={handleFocusSegunda}
            />
          </FormField>
        </div>
      </div>

      {/* Monto y ajuste — cláusula TERCERA */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
          Alquiler
        </p>
        <div className="flex flex-col gap-3">
          <FormField label="Monto mensual inicial ($)" required>
            <Input
              type="number"
              value={condiciones.montoInicial || ""}
              onChange={(e) => setCond("montoInicial", Number(e.target.value))}
              onFocus={handleFocusTercera}
              placeholder="600000"
              min={0}
            />
          </FormField>
          <FormField label="Tipo de ajuste">
            <Select
              value={condiciones.ajuste.tipo}
              options={AJUSTE_OPTIONS}
              onChange={(e) => {
                const tipo = e.target.value as AjusteType;
                onUpdate({
                  ...data,
                  condiciones: {
                    ...condiciones,
                    ajuste: { ...condiciones.ajuste, tipo },
                  },
                });
              }}
              onFocus={(e) => {
                onActivate();
                onScrollTo("TERCERA");
                const tipo = (e.target as HTMLSelectElement).value as AjusteType;
                const hint = AJUSTE_HIGHLIGHT[tipo] ?? "";
                const syntheticEvent = Object.assign(e, {
                  target: Object.assign(e.target, { dataset: { highlight: hint } }),
                });
                onHighlight(syntheticEvent);
              }}
              data-highlight={AJUSTE_HIGHLIGHT[condiciones.ajuste.tipo]}
            />
          </FormField>
          <FormField label="Índice de ajuste">
            <Select
              value={condiciones.ajuste.indice}
              options={INDICE_OPTIONS}
              onChange={(e) => onUpdate({
                ...data,
                condiciones: { ...condiciones, ajuste: { ...condiciones.ajuste, indice: e.target.value as "IPC" | "ICL" } },
              })}
              onFocus={handleFocusTercera}
            />
          </FormField>
        </div>
      </div>

      {/* Impuestos — cláusula CUARTA */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
          Impuestos
        </p>
        <div className="flex flex-col gap-3">
          <FormField label="Impuesto Inmobiliario">
            <div className="flex gap-2">
              {(["locador", "locatario"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCond("impuestoInmobiliario", v)}
                  onFocus={handleFocusCuarta}
                  data-highlight={v === "locador" ? "LOCADOR" : "LOCATARIA"}
                  className="flex-1 text-xs font-medium py-1.5 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${condiciones.impuestoInmobiliario === v ? "var(--color-primary)" : "rgba(15,58,95,0.15)"}`,
                    background: condiciones.impuestoInmobiliario === v ? "rgba(15,58,95,0.08)" : "transparent",
                    color: condiciones.impuestoInmobiliario === v ? "var(--color-primary-container)" : "var(--color-on-surface-variant)",
                  }}
                >
                  {v === "locador" ? "Locador" : "Locatario"}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Tasa Municipal">
            <div className="flex gap-2">
              {(["locador", "locatario"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCond("tasaMunicipal", v)}
                  onFocus={handleFocusCuarta}
                  data-highlight={v === "locador" ? "LOCADOR" : "LOCATARIA"}
                  className="flex-1 text-xs font-medium py-1.5 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${condiciones.tasaMunicipal === v ? "var(--color-primary)" : "rgba(15,58,95,0.15)"}`,
                    background: condiciones.tasaMunicipal === v ? "rgba(15,58,95,0.08)" : "transparent",
                    color: condiciones.tasaMunicipal === v ? "var(--color-primary-container)" : "var(--color-on-surface-variant)",
                  }}
                >
                  {v === "locador" ? "Locador" : "Locatario"}
                </button>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      {/* Pago — cláusula QUINTA */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
          Pago
        </p>
        <div className="flex flex-col gap-3">
          <FormField label="Día de pago">
            <Select
              value={String(condiciones.pagoDia)}
              options={PAGO_DIA_OPTIONS}
              onChange={(e) => setCond("pagoDia", parseInt(e.target.value))}
              onFocus={handleFocusQuinta}
            />
          </FormField>
          <FormField label="Lugar de pago" hint="Dejar vacío para usar domicilio de Almada & Cía">
            <Input
              type="text"
              value={condiciones.lugarPago ?? ""}
              onChange={(e) => setCond("lugarPago", e.target.value)}
              onFocus={handleFocusQuinta}
              placeholder="Almada & Cía. Avda. San Martín 349..."
            />
          </FormField>
        </div>
      </div>
    </SectionCollapse>
  );
}
