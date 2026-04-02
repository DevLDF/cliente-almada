"use client";

import React from "react";
import { generarClausulas, buildCierre, type ContratoData } from "@/lib/contract-html-generator";
import type { ContractType } from "@/types/contrato";
import { siteConfig } from "@/config/site";

type Section = "partes" | "inmueble" | "condiciones" | "opcionales";

interface Props {
  data: ContratoData;
  tipo: ContractType;
  highlightTerms: string[];
  activeSection: Section | null;
  zoom: number;
}

// ── Highlight de términos en el texto ────────────────────────────

function HighlightText({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length || !text) return <>{text}</>;

  const escaped = terms
    .filter((t) => t.trim().length > 0)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (!escaped.length) return <>{text}</>;

  const pattern = escaped.join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);
  const matchSet = new Set(terms.map((t) => t.toUpperCase()));

  return (
    <>
      {parts.map((part, i) =>
        matchSet.has(part.toUpperCase()) ? (
          <mark
            key={i}
            style={{
              background: "#fef08a",
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ── Mapeo sección activa → cláusulas ─────────────────────────────

const SECTION_ACTIVE_CLAUSES: Record<Section, string[]> = {
  partes:      ["INTRO"],
  inmueble:    ["PRIMERA"],
  condiciones: ["SEGUNDA", "TERCERA", "CUARTA", "QUINTA"],
  opcionales:  ["VENTA", "ESPECIAL", "FIANZA"],
};

function isClausulaActive(id: string, activeSection: Section | null): boolean {
  if (!activeSection) return false;
  return SECTION_ACTIVE_CLAUSES[activeSection]?.includes(id) ?? false;
}

// ── Título por tipo de contrato ───────────────────────────────────

function getTitulo(tipo: ContractType): string {
  return tipo === "vivienda"
    ? "CONTRATO DE LOCACIÓN DE VIVIENDA"
    : "CONTRATO DE LOCACIÓN";
}

// ── Componente principal ──────────────────────────────────────────

export function ContractPreview({ data, tipo, highlightTerms, activeSection, zoom }: Props) {
  const clausulas = generarClausulas(data, tipo);
  const cierre = buildCierre(data);

  return (
    <div
      style={{
        transformOrigin: "top center",
        transform: `scale(${zoom})`,
        width: `${100 / zoom}%`,
        marginLeft: `${((zoom - 1) / 2 / zoom) * 100}%`,
      }}
    >
      {/* A4 document */}
      <div
        style={{
          background: "white",
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: "48px 56px 64px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "10.5pt",
          lineHeight: "1.6",
          color: "#1a1a1a",
        }}
      >
        {/* Título */}
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "12pt",
            letterSpacing: "1px",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          {getTitulo(tipo)}
        </div>

        {/* Intro — partes */}
        {clausulas.filter((c) => c.id === "INTRO").map((c) => (
          <div
            key={c.id}
            data-clause={c.id}
            style={{
              marginBottom: "14px",
              textAlign: "justify",
              paddingLeft: isClausulaActive(c.id, activeSection) ? "10px" : "0",
              borderLeft: isClausulaActive(c.id, activeSection)
                ? "3px solid var(--color-primary)"
                : "3px solid transparent",
              transition: "border-color 0.2s, padding-left 0.2s",
            }}
          >
            <HighlightText text={c.texto} terms={highlightTerms} />
          </div>
        ))}

        <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "10px 0" }} />

        {/* Cláusulas */}
        {clausulas
          .filter((c) => c.id !== "INTRO")
          .map((c) => (
            <div
              key={c.id}
              data-clause={c.id}
              style={{
                marginBottom: "14px",
                paddingLeft: isClausulaActive(c.id, activeSection) ? "10px" : "0",
                borderLeft: isClausulaActive(c.id, activeSection)
                  ? "3px solid var(--color-primary)"
                  : "3px solid transparent",
                transition: "border-color 0.2s, padding-left 0.2s",
              }}
            >
              {c.titulo && (
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    marginTop: "10px",
                  }}
                >
                  {c.titulo}
                </p>
              )}
              <p style={{ textAlign: "justify" }}>
                <HighlightText text={c.texto} terms={highlightTerms} />
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "10px 0 0" }} />
            </div>
          ))}

        {/* Cierre */}
        <p style={{ textAlign: "justify", marginTop: "10px", marginBottom: "32px" }}>
          <HighlightText text={cierre} terms={highlightTerms} />
        </p>

        {/* Firmas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px 32px",
            marginTop: "40px",
          }}
        >
          {/* Locador */}
          <FirmaBloque
            nombre={data.locador.nombre || "___________"}
            dni={data.locador.dni}
            rol="LOCADOR/A"
          />

          {/* Locatarios */}
          {data.locatarios.map((l, i) => (
            <FirmaBloque
              key={i}
              nombre={l.nombre || "___________"}
              dni={l.dni}
              rol="LOCATARIO/A"
            />
          ))}

          {/* Garantes */}
          {data.garantes?.map((g, i) => (
            <FirmaBloque
              key={i}
              nombre={g.nombre || "___________"}
              dni={g.dni}
              rol="FIADOR/A SOLIDARIO/A"
            />
          ))}

          {/* Inmobiliaria */}
          <FirmaBloque
            nombre={siteConfig.name.toUpperCase()}
            dni=""
            rol="INMOBILIARIA"
            subtitulo="Avda. San Martín 349, Las Flores"
          />
        </div>
      </div>
    </div>
  );
}

// ── Bloque de firma ───────────────────────────────────────────────

function FirmaBloque({
  nombre,
  dni,
  rol,
  subtitulo,
}: {
  nombre: string;
  dni: string;
  rol: string;
  subtitulo?: string;
}) {
  return (
    <div style={{ paddingTop: "32px" }}>
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: "6px",
          textAlign: "center",
          fontSize: "8.5pt",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{nombre.toUpperCase()}</p>
        {dni && <p style={{ color: "#555" }}>DNI N° {dni}</p>}
        {subtitulo && <p style={{ color: "#555" }}>{subtitulo}</p>}
        <p style={{ color: "#555" }}>{rol}</p>
      </div>
    </div>
  );
}
