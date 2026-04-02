"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ContratoData } from "@/lib/contract-html-generator";
import { emptyPersona } from "@/types/contrato";
import type { Garante } from "@/types/contrato";
import { SectionCollapse } from "@/components/editor/SectionCollapse";
import { FormField, Textarea } from "@/components/editor/FormField";
import { PersonaForm } from "@/components/editor/sections/PersonaForm";

interface Props {
  data: ContratoData;
  onUpdate: (d: ContratoData) => void;
  onHighlight: (e: React.FocusEvent<HTMLElement>) => void;
  onScrollTo: (clauseId: string) => void;
  open: boolean;
  onToggle: () => void;
  onActivate: () => void;
}

function emptyGarante(): Garante {
  return { ...emptyPersona(), relacion: "" };
}

export function OpcionalesSection({ data, onUpdate, onHighlight, onScrollTo, open, onToggle, onActivate }: Props) {
  const { garantes, opcionales } = data;

  function handleFocus(e: React.FocusEvent<HTMLElement>) {
    onActivate();
    onScrollTo("FIANZA");
    onHighlight(e);
  }

  const badgeParts: string[] = [];
  if (garantes.length) badgeParts.push(`${garantes.length} garante${garantes.length > 1 ? "s" : ""}`);
  if (opcionales?.inmuebleEnVenta) badgeParts.push("en venta");
  if (opcionales?.clausulaEspecial?.trim()) badgeParts.push("cláusula especial");
  const badge = badgeParts.length ? badgeParts.join(" · ") : undefined;

  return (
    <SectionCollapse title="Opcionales" badge={badge} open={open} onToggle={onToggle}>

      {/* Garantes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
            Garantes ({garantes.length})
          </p>
          {garantes.length < 2 && (
            <button
              type="button"
              onClick={() => onUpdate({ ...data, garantes: [...garantes, emptyGarante()] })}
              className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--color-primary-container)" }}
            >
              <Plus size={12} />
              Agregar
            </button>
          )}
        </div>

        {garantes.length === 0 && (
          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}>
            Sin garantes — la sección de fianza no aparecerá en el contrato.
          </p>
        )}

        {garantes.map((g, idx) => (
          <div
            key={idx}
            className="mb-3"
            style={{
              border: "1px solid rgba(15,58,95,0.08)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                Garante {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = garantes.filter((_, i) => i !== idx);
                  onUpdate({ ...data, garantes: next });
                }}
                className="transition-opacity hover:opacity-70"
                style={{ color: "#b91c1c" }}
              >
                <Trash2 size={12} />
              </button>
            </div>
            <PersonaForm
              persona={g}
              onUpdate={(p) => {
                const next = [...garantes];
                next[idx] = { ...p, relacion: g.relacion };
                onUpdate({ ...data, garantes: next });
              }}
              onHighlight={onHighlight}
              onActivate={() => { onActivate(); onScrollTo("FIANZA"); }}
            />
          </div>
        ))}
      </div>

      {/* Inmueble en venta */}
      <div>
        <label
          className="flex items-start gap-3 cursor-pointer"
          onFocus={handleFocus}
        >
          <input
            type="checkbox"
            checked={opcionales?.inmuebleEnVenta ?? false}
            onChange={(e) => onUpdate({
              ...data,
              opcionales: { ...opcionales, inmuebleEnVenta: e.target.checked },
            })}
            data-highlight="inmueble en venta|ciento ochenta (180) días"
            style={{ accentColor: "var(--color-primary)", width: "14px", height: "14px", marginTop: "2px" }}
          />
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--color-on-background)" }}>
              Inmueble en venta
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}>
              Agrega cláusula de desocupación a 180 días si se vende
            </p>
          </div>
        </label>
      </div>

      {/* Cláusula especial */}
      <FormField label="Cláusula especial" hint="Texto libre que se agrega al contrato">
        <Textarea
          value={opcionales?.clausulaEspecial ?? ""}
          onChange={(e) => onUpdate({
            ...data,
            opcionales: { ...opcionales, clausulaEspecial: e.target.value },
          })}
          onFocus={(e) => {
            onActivate();
            onScrollTo("ESPECIAL");
            onHighlight(e);
          }}
          rows={4}
          placeholder="Texto de cláusula especial..."
        />
      </FormField>
    </SectionCollapse>
  );
}
