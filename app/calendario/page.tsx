import { CalendarDays } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto w-full">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Próximamente
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-on-background)",
            letterSpacing: "-0.02em",
          }}
        >
          Cronograma Global
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-5">
        <div
          className="rounded-[2rem] p-10 text-center max-w-sm w-full"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-ambient)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] mb-5"
            style={{ background: "rgba(0,36,65,0.07)" }}
          >
            <CalendarDays
              size={28}
              strokeWidth={1.5}
              style={{ color: "var(--color-primary-container)" }}
            />
          </div>
          <p
            className="text-lg font-bold mb-2"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
            }}
          >
            Vista de calendario global
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Pronto podrás ver todos los vencimientos, cobros e hitos en un
            cronograma mensual unificado.
          </p>
        </div>
      </div>
    </div>
  );
}
