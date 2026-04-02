"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { renovarContratoAction } from "@/actions/contratos.actions";

interface Props {
  contratoId: string;
}

export function RenovarButton({ contratoId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRenovar() {
    setLoading(true);
    const [data, err] = await renovarContratoAction({ id: contratoId });
    if (!err && data) {
      router.push(`/contratos/${data.id}/editar`);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleRenovar}
      disabled={loading}
      className="text-xs font-semibold transition-opacity hover:opacity-70 disabled:opacity-40"
      style={{ color: "var(--color-secondary)" }}
    >
      {loading ? "..." : "Renovar →"}
    </button>
  );
}
