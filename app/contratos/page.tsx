import { listarContratosAction } from "@/actions/contratos.actions";
import Link from "next/link";
import { Plus, FileText, Building2, Warehouse } from "lucide-react";

const TIPO_CONFIG = {
  vivienda: {
    label: "Vivienda",
    Icon: FileText,
    bg: "rgba(0,106,101,0.10)",
    color: "var(--color-secondary)",
  },
  comercial: {
    label: "Comercial",
    Icon: Building2,
    bg: "rgba(0,36,65,0.08)",
    color: "var(--color-primary-container)",
  },
  galpon: {
    label: "Galpón",
    Icon: Warehouse,
    bg: "rgba(124,88,0,0.10)",
    color: "var(--color-tertiary)",
  },
} as const;

export default async function ContratosPage() {
  const [contratos, err] = await listarContratosAction();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Header */}
      <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Gestión
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
              letterSpacing: "-0.02em",
            }}
          >
            Mis contratos
          </h1>
          <Link
            href="/contratos/nuevo"
            className="btn-primary flex items-center gap-1.5 shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            Nuevo
          </Link>
        </div>
      </div>

      <div className="px-5 max-w-2xl mx-auto space-y-3 pb-8">
        {err && (
          <div
            className="p-4 rounded-2xl text-sm"
            style={{ background: "#fff1f0", color: "#b91c1c" }}
          >
            Error al cargar contratos: {err.message}
          </div>
        )}

        {!err && contratos?.length === 0 && (
          <div
            className="rounded-[2rem] p-10 text-center"
            style={{
              background: "var(--color-surface-lowest)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "rgba(0,36,65,0.06)" }}
            >
              <FileText
                size={24}
                strokeWidth={1.5}
                style={{ color: "var(--color-primary-container)" }}
              />
            </div>
            <p
              className="font-semibold mb-1"
              style={{ color: "var(--color-on-background)" }}
            >
              No hay contratos todavía
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Creá tu primer contrato para comenzar
            </p>
            <Link href="/contratos/nuevo" className="btn-primary inline-flex">
              Crear el primero
            </Link>
          </div>
        )}

        {contratos?.map((c) => {
          const config = TIPO_CONFIG[c.tipo as keyof typeof TIPO_CONFIG] ?? TIPO_CONFIG.vivienda;
          const { Icon } = config;
          return (
            <div
              key={c.id}
              className="rounded-[2rem] p-5 flex items-center gap-4"
              style={{
                background: "var(--color-surface-lowest)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Ícono tipo */}
              <div
                className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: config.bg }}
              >
                <Icon size={20} strokeWidth={1.8} style={{ color: config.color }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: "var(--color-on-background)" }}
                >
                  {c.nombre}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {new Date(c.updated_at).toLocaleDateString("es-AR")}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Link
                  href={`/contratos/${c.id}/editar`}
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-primary-container)" }}
                >
                  Editar
                </Link>
                <Link
                  href={`/contratos/${c.id}/calendario`}
                  className="text-xs"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Pagos
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
