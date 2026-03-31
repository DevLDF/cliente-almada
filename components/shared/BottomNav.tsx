"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
} from "lucide-react";

const TABS = [
  { href: "/",          label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/contratos", label: "Contratos",  Icon: FileText        },
  { href: "/clientes",  label: "Clientes",   Icon: Users           },
  { href: "/calendario",label: "Calendario", Icon: CalendarDays    },
] as const;

const AUTH_ROUTES = ["/login", "/auth"];

export default function BottomNav() {
  const pathname = usePathname();

  // Ocultar en rutas de autenticación
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.80)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(15,58,95,0.08)",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-colors"
              style={{
                color: active
                  ? "var(--color-primary-container)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              <div
                className="relative flex items-center justify-center w-8 h-8 rounded-2xl transition-colors"
                style={{
                  background: active
                    ? "rgba(15,58,95,0.10)"
                    : "transparent",
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {active && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "var(--color-secondary)" }}
                  />
                )}
              </div>
              <span
                className="text-[10px] leading-none"
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
