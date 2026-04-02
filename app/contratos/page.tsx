import { listarContratosAction } from "@/actions/contratos.actions";
import Link from "next/link";
import { Plus, FileText, Building2, Warehouse } from "lucide-react";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { RenovarButton } from "@/components/contratos/RenovarButton";
import { calcularEstadoContrato } from "@/lib/contrato-utils";
import type { EstadoContrato } from "@/lib/contrato-utils";

const ESTADO_CONFIG: Record<
  EstadoContrato,
  { label: string; bg: string; color: string }
> = {
  vigente:    { label: "Vigente",    bg: "rgba(0,106,101,0.10)", color: "var(--color-secondary)"         },
  por_vencer: { label: "Por vencer", bg: "rgba(124,88,0,0.12)",  color: "var(--color-tertiary)"          },
  vencido:    { label: "Vencido",    bg: "rgba(180,20,20,0.10)", color: "#b41414"                        },
};

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
    <div className="min-h-screen p-8" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Gestión
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
              letterSpacing: "-0.02em",
            }}
          >
            Contratos
          </h1>
          {contratos && contratos.length > 0 && (
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {contratos.length} contrato{contratos.length !== 1 ? "s" : ""} registrado{contratos.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link
          href="/contratos/nuevo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} strokeWidth={2.5} />
          Nuevo contrato
        </Link>
      </div>

      {err && (
        <div
          className="p-4 rounded-2xl text-sm mb-4"
          style={{ background: "#fff1f0", color: "#b91c1c" }}
        >
          Error al cargar contratos: {err.message}
        </div>
      )}

      {!err && contratos?.length === 0 && (
        <div
          className="rounded-[2rem] p-16 text-center max-w-md mx-auto mt-16"
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
            className="text-sm mb-5"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Creá tu primer contrato para comenzar
          </p>
          <Link href="/contratos/nuevo" className="btn-primary inline-flex">
            Crear el primero
          </Link>
        </div>
      )}

      {/* Tabla de contratos */}
      {contratos && contratos.length > 0 && (
        <div
          className="rounded-[2rem] overflow-hidden"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Cabecera tabla */}
          <div
            className="grid items-center px-6 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{
              gridTemplateColumns: "40px 1fr 100px 110px 140px 160px",
              color: "var(--color-on-surface-variant)",
              borderBottom: "1px solid rgba(15,58,95,0.06)",
            }}
          >
            <span />
            <span>Contrato</span>
            <span>Tipo</span>
            <span>Estado</span>
            <span>Actualizado</span>
            <span className="text-right">Acciones</span>
          </div>

          {/* Filas */}
          <div>
            {contratos.map((c, idx) => {
              const config =
                TIPO_CONFIG[c.tipo as keyof typeof TIPO_CONFIG] ??
                TIPO_CONFIG.vivienda;
              const { Icon } = config;
              const isLast = idx === contratos.length - 1;
              const data = c.data as {
                locatarios?: { nombre?: string; telefono?: string }[];
                condiciones?: { fechaInicio?: string; duracionMeses?: number };
              };
              const locatario = data?.locatarios?.[0];
              const estado = calcularEstadoContrato(data?.condiciones);
              const estadoConfig = estado ? ESTADO_CONFIG[estado] : null;
              return (
                <div
                  key={c.id}
                  className="grid items-center px-6 py-4 transition-colors hover:bg-[rgba(15,58,95,0.02)]"
                  style={{
                    gridTemplateColumns: "40px 1fr 100px 110px 140px 160px",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(15,58,95,0.05)",
                  }}
                >
                  {/* Ícono */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: config.bg }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                      style={{ color: config.color }}
                    />
                  </div>

                  {/* Nombre */}
                  <p
                    className="font-semibold text-sm truncate pr-4"
                    style={{ color: "var(--color-on-background)" }}
                  >
                    {c.nombre}
                  </p>

                  {/* Badge tipo */}
                  <div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: config.bg, color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Badge estado */}
                  <div>
                    {estadoConfig && (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: estadoConfig.bg, color: estadoConfig.color }}
                      >
                        {estadoConfig.label}
                      </span>
                    )}
                  </div>

                  {/* Fecha */}
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {new Date(c.updated_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-3">
                    {locatario && (
                      <WhatsAppButton
                        telefono={locatario.telefono ?? ""}
                        nombre={locatario.nombre ?? ""}
                      />
                    )}
                    <Link
                      href={`/contratos/${c.id}/calendario`}
                      className="text-xs font-medium"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      Pagos
                    </Link>
                    {(estado === "vencido" || estado === "por_vencer") && (
                      <RenovarButton contratoId={c.id} />
                    )}
                    <Link
                      href={`/contratos/${c.id}/editar`}
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-primary-container)" }}
                    >
                      Editar →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
