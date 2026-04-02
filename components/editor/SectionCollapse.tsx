"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SectionCollapse({ title, badge, open, onToggle, children }: Props) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(15,58,95,0.06)",
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[rgba(15,58,95,0.02)]"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(15,58,95,0.07)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className="transition-transform shrink-0"
          style={{
            color: "var(--color-on-surface-variant)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Content */}
      {open && (
        <div
          className="px-5 pb-5 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(15,58,95,0.05)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
