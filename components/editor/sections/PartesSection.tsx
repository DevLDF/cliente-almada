"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import type { ContratoData } from "@/lib/contract-html-generator";
import { emptyPersona } from "@/types/contrato";
import { SectionCollapse } from "@/components/editor/SectionCollapse";
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

export function PartesSection({ data, onUpdate, onHighlight, onScrollTo, open, onToggle, onActivate }: Props) {
  const [locadorOpen, setLocadorOpen] = useState(true);
  const [locatariosOpen, setLocatariosOpen] = useState(false);

  function handleActivate() {
    onActivate();
    onScrollTo("INTRO");
  }

  const badge = `${1 + data.locatarios.length} parte${1 + data.locatarios.length !== 1 ? "s" : ""}`;

  return (
    <SectionCollapse title="Partes" badge={badge} open={open} onToggle={onToggle}>
      {/* Locador */}
      <div
        style={{
          border: "1px solid rgba(15,58,95,0.08)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setLocadorOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[rgba(15,58,95,0.02)]"
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Locador / Propietario
          </span>
          <ChevronDown
            size={13}
            className="transition-transform"
            style={{
              color: "var(--color-on-surface-variant)",
              transform: locadorOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        </button>
        {locadorOpen && (
          <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(15,58,95,0.05)" }}>
            <div className="pt-3">
              <PersonaForm
                persona={data.locador}
                onUpdate={(p) => onUpdate({ ...data, locador: p })}
                onHighlight={onHighlight}
                onActivate={handleActivate}
              />
            </div>
          </div>
        )}
      </div>

      {/* Locatarios */}
      <div
        style={{
          border: "1px solid rgba(15,58,95,0.08)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setLocatariosOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[rgba(15,58,95,0.02)]"
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Locatarios ({data.locatarios.length})
          </span>
          <ChevronDown
            size={13}
            className="transition-transform"
            style={{
              color: "var(--color-on-surface-variant)",
              transform: locatariosOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        </button>
        {locatariosOpen && (
          <div className="px-4 pb-4 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(15,58,95,0.05)" }}>
            {data.locatarios.map((l, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between pt-3 pb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Locatario {idx + 1}
                  </span>
                  {data.locatarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = data.locatarios.filter((_, i) => i !== idx);
                        onUpdate({ ...data, locatarios: next });
                      }}
                      className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                      style={{ color: "#b91c1c" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <PersonaForm
                  persona={l}
                  onUpdate={(p) => {
                    const next = [...data.locatarios];
                    next[idx] = p;
                    onUpdate({ ...data, locatarios: next });
                  }}
                  onHighlight={onHighlight}
                  onActivate={handleActivate}
                />
              </div>
            ))}

            {data.locatarios.length < 3 && (
              <button
                type="button"
                onClick={() => onUpdate({ ...data, locatarios: [...data.locatarios, emptyPersona()] })}
                className="flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-70 pt-1"
                style={{ color: "var(--color-primary-container)" }}
              >
                <Plus size={13} />
                Agregar locatario
              </button>
            )}
          </div>
        )}
      </div>
    </SectionCollapse>
  );
}
