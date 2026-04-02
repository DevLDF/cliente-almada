"use client";

import { FileDown } from "lucide-react";

interface Props {
  contratoId: string;
  variant?: "icon" | "button";
}

export function BotonDescargarPDF({ contratoId, variant = "button" }: Props) {
  const href = `/contratos/${contratoId}/pdf`;

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Descargar contrato en PDF"
        className="inline-flex items-center text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        <FileDown size={15} strokeWidth={1.8} />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 btn-primary text-sm"
    >
      <FileDown size={14} strokeWidth={2} />
      Descargar PDF
    </a>
  );
}
