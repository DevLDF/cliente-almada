"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const ITEMS = [
  { href: "/",           label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/contratos",  label: "Contratos",  Icon: FileText        },
  { href: "/clientes",   label: "Clientes",   Icon: Users           },
  { href: "/calendario", label: "Calendario", Icon: CalendarDays    },
] as const;

const AUTH_ROUTES = ["/login", "/auth"];

export default function Sidebar() {
  const pathname = usePathname();

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50 shrink-0"
      style={{
        background: "var(--color-surface-lowest)",
        borderRight: "1px solid rgba(15,58,95,0.07)",
        boxShadow: "2px 0 24px rgba(15,58,95,0.04)",
      }}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div
          className="text-base font-bold leading-tight"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Gestión de alquileres
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-6 mb-4"
        style={{ height: "1px", background: "rgba(15,58,95,0.06)" }}
      />

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: active ? "rgba(15,58,95,0.08)" : "transparent",
                color: active
                  ? "var(--color-primary-container)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
                style={{
                  background: active ? "rgba(15,58,95,0.10)" : "transparent",
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--color-secondary)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-5 text-xs"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </aside>
  );
}
