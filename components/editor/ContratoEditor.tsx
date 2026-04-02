"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import type { ContractType } from "@/types/contrato";
import { emptyContrato } from "@/types/contrato";
import { actualizarContratoAction } from "@/actions/contratos.actions";
import { fechaLarga } from "@/lib/pdf/helpers";
import type { ContratoData } from "@/lib/contract-html-generator";
import { ContractPreview } from "@/components/editor/ContractPreview";
import { PartesSection } from "@/components/editor/sections/PartesSection";
import { InmuebleSection } from "@/components/editor/sections/InmuebleSection";
import { CondicionesSection } from "@/components/editor/sections/CondicionesSection";
import { OpcionalesSection } from "@/components/editor/sections/OpcionalesSection";
import { BotonDescargarPDF } from "@/components/shared/BotonDescargarPDF";

type Section = "partes" | "inmueble" | "condiciones" | "opcionales";

interface ContratoRow {
  id: string;
  nombre: string;
  tipo: ContractType;
  data: Record<string, unknown>;
}

interface Props {
  contrato: ContratoRow;
}

const SECTION_CLAUSE_MAP: Record<Section, string> = {
  partes:      "INTRO",
  inmueble:    "PRIMERA",
  condiciones: "SEGUNDA",
  opcionales:  "FIANZA",
};

function derivarNombre(d: ContratoData): string {
  const locatario = d.locatarios?.[0]?.nombre;
  const direccion = d.inmueble?.direccion;
  if (locatario && direccion) return `${locatario} — ${direccion}`;
  if (locatario) return locatario;
  return "Sin nombre";
}

export function ContratoEditor({ contrato }: Props) {
  const defaults = emptyContrato(contrato.tipo);
  const [data, setData] = useState<ContratoData>(() => ({
    ...defaults,
    ...(contrato.data as Partial<ContratoData>),
  }));
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [openSections, setOpenSections] = useState<Record<Section, boolean>>({
    partes: true,
    inmueble: false,
    condiciones: false,
    opcionales: false,
  });
  const [highlightTerms, setHighlightTerms] = useState<string[]>([]);
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [saved, setSaved] = useState(true);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Autosave ────────────────────────────────────────────────────

  const updateData = useCallback((updated: ContratoData) => {
    setData(updated);
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const nombre = derivarNombre(updated);
      await actualizarContratoAction({ id: contrato.id, ...updated, nombre });
      setSaved(true);
    }, 800);
  }, [contrato.id]);

  // ── Scroll al preview ───────────────────────────────────────────

  function scrollToClause(clauseId: string) {
    const el = previewRef.current?.querySelector(`[data-clause="${clauseId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Activar sección (colapsa hermanas) ──────────────────────────

  function activateSection(section: Section) {
    const isNew = activeSection !== section;
    setActiveSection(section);
    setOpenSections({
      partes:      section === "partes",
      inmueble:    section === "inmueble",
      condiciones: section === "condiciones",
      opcionales:  section === "opcionales",
    });
    if (isNew) {
      scrollToClause(SECTION_CLAUSE_MAP[section]);
    }
  }

  // ── Highlight sync ──────────────────────────────────────────────

  function captureHighlight(e: React.FocusEvent<HTMLElement>) {
    const el = e.target as HTMLInputElement;
    const hint = el.dataset?.highlight;
    if (hint) {
      setHighlightTerms(hint.split("|").map((s) => s.trim()));
      return;
    }
    if (el.type === "date" && el.value) {
      setHighlightTerms([fechaLarga(el.value)]);
      return;
    }
    if (el.type === "number" && el.value) {
      const n = Number(el.value);
      setHighlightTerms([n.toLocaleString("es-AR")]);
      return;
    }
    if ((el as HTMLTextAreaElement | HTMLInputElement).value?.length > 1) {
      setHighlightTerms([(el as HTMLInputElement).value]);
    } else {
      setHighlightTerms([]);
    }
  }

  // ── Toggle sección ──────────────────────────────────────────────

  function toggleSection(section: Section) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const sectionProps = (section: Section) => ({
    data,
    onUpdate: updateData,
    onHighlight: captureHighlight,
    onScrollTo: scrollToClause,
    open: openSections[section],
    onToggle: () => toggleSection(section),
    onActivate: () => activateSection(section),
  });

  return (
    <>
      {/* ── Mobile fallback ── */}
      <div
        className="lg:hidden flex flex-col items-center justify-center p-8 text-center gap-4"
        style={{ minHeight: "100vh", background: "var(--color-surface)" }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          El editor de contratos requiere una pantalla más grande.
        </p>
        <Link
          href="/contratos"
          className="text-sm font-medium"
          style={{ color: "var(--color-primary-container)" }}
        >
          ← Volver a contratos
        </Link>
      </div>

      {/* ── Desktop editor ── */}
      <div
        className="hidden lg:flex"
        style={{ height: "100vh", overflow: "hidden", background: "var(--color-surface)" }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="flex flex-col overflow-hidden shrink-0"
          style={{
            width: "420px",
            borderRight: "1px solid rgba(15,58,95,0.07)",
            background: "var(--color-surface-lowest)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3 shrink-0"
            style={{ borderBottom: "1px solid rgba(15,58,95,0.07)" }}
          >
            <div className="flex items-center gap-3">
              <Link
                href="/contratos"
                className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <ArrowLeft size={13} />
                Contratos
              </Link>
              <span
                className="text-xs font-semibold truncate max-w-[160px]"
                style={{ color: "var(--color-on-background)" }}
              >
                {contrato.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xs"
                style={{ color: saved ? "var(--color-secondary)" : "var(--color-on-surface-variant)" }}
              >
                {saved ? "✓ Guardado" : "Guardando…"}
              </span>
              <BotonDescargarPDF contratoId={contrato.id} variant="icon" />
            </div>
          </div>

          {/* Tipo badge */}
          <div
            className="px-5 py-2 shrink-0"
            style={{ borderBottom: "1px solid rgba(15,58,95,0.05)" }}
          >
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
              style={{
                background: "rgba(15,58,95,0.07)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {contrato.tipo === "galpon" ? "Galpón" : contrato.tipo.charAt(0).toUpperCase() + contrato.tipo.slice(1)}
            </span>
          </div>

          {/* Secciones — scrollable */}
          <div className="flex-1 overflow-y-auto">
            <PartesSection {...sectionProps("partes")} />
            <InmuebleSection {...sectionProps("inmueble")} />
            <CondicionesSection {...sectionProps("condiciones")} />
            <OpcionalesSection {...sectionProps("opcionales")} />
          </div>
        </div>

        {/* ── RIGHT PANEL — Preview ── */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ background: "#e8eaed" }}
        >
          {/* Zoom controls */}
          <div
            className="flex items-center justify-end gap-2 px-4 py-2 shrink-0"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            {activeSection && (
              <span
                className="text-xs mr-auto px-2.5 py-1 rounded-full"
                style={{ background: "rgba(15,58,95,0.08)", color: "var(--color-primary-container)" }}
              >
                Editando: {
                  activeSection === "partes" ? "Partes" :
                  activeSection === "inmueble" ? "Inmueble" :
                  activeSection === "condiciones" ? "Condiciones" :
                  "Opcionales"
                }
              </span>
            )}
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
              title="Reducir"
            >
              <ZoomOut size={14} style={{ color: "var(--color-on-surface-variant)" }} />
            </button>
            <span
              className="text-xs w-10 text-center"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
              title="Ampliar"
            >
              <ZoomIn size={14} style={{ color: "var(--color-on-surface-variant)" }} />
            </button>
          </div>

          {/* Scrollable preview */}
          <div className="flex-1 overflow-y-auto p-6" ref={previewRef}>
            <ContractPreview
              data={data}
              tipo={contrato.tipo}
              highlightTerms={highlightTerms}
              activeSection={activeSection}
              zoom={previewZoom}
            />
          </div>
        </div>
      </div>
    </>
  );
}
