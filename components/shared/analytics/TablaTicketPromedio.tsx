const TIPO_CONFIG = {
  vivienda:  { label: "Vivienda",  bg: "rgba(0,106,101,0.10)", color: "var(--color-secondary)"         },
  comercial: { label: "Comercial", bg: "rgba(0,36,65,0.08)",   color: "var(--color-primary-container)" },
  galpon:    { label: "Galpón",    bg: "rgba(124,88,0,0.10)",  color: "var(--color-tertiary)"          },
} as const;

interface FilaTipo {
  tipo: "vivienda" | "comercial" | "galpon";
  promedio: number;
  total: number;
  count: number;
}

interface Props {
  filas: FilaTipo[];
}

export function TablaTicketPromedio({ filas }: Props) {
  if (filas.length === 0) {
    return (
      <p className="text-sm text-center py-6" style={{ color: "var(--color-on-surface-variant)" }}>
        Sin contratos con monto registrado
      </p>
    );
  }

  return (
    <div>
      {/* Cabecera */}
      <div
        className="grid text-xs font-semibold uppercase tracking-wide px-4 py-2"
        style={{
          gridTemplateColumns: "1fr 80px 120px 120px",
          color: "var(--color-on-surface-variant)",
          borderBottom: "1px solid rgba(15,58,95,0.06)",
        }}
      >
        <span>Categoría</span>
        <span className="text-right">Contratos</span>
        <span className="text-right">Ticket prom.</span>
        <span className="text-right">Total acum.</span>
      </div>

      {/* Filas */}
      {filas.map((f, idx) => {
        const cfg = TIPO_CONFIG[f.tipo];
        const isLast = idx === filas.length - 1;
        return (
          <div
            key={f.tipo}
            className="grid items-center px-4 py-3"
            style={{
              gridTemplateColumns: "1fr 80px 120px 120px",
              borderBottom: isLast ? "none" : "1px solid rgba(15,58,95,0.04)",
            }}
          >
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold w-fit"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
            <p
              className="text-sm font-medium text-right tabular-nums"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {f.count}
            </p>
            <p
              className="text-sm font-semibold text-right tabular-nums"
              style={{ color: "var(--color-on-background)" }}
            >
              {formatMonto(f.promedio)}
            </p>
            <p
              className="text-sm text-right tabular-nums"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {formatMonto(f.total)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function formatMonto(monto: number): string {
  if (monto >= 1_000_000) return `$${(monto / 1_000_000).toFixed(1)}M`;
  return monto.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
