"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, BarChart2 } from "lucide-react";
import { siteConfig } from "@/config/site";

const ITEMS = [
  { href: "/",          label: "Dashboard", Icon: LayoutDashboard },
  { href: "/contratos", label: "Contratos", Icon: FileText        },
  { href: "/clientes",  label: "Clientes",  Icon: Users           },
  { href: "/analytics", label: "Analytics", Icon: BarChart2       },
] as const;

const AUTH_ROUTES = ["/login", "/auth"];

export default function MobileHeader() {
  const pathname = usePathname();

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="lg:hidden sticky top-0 z-40 flex flex-col"
      style={{
        background: "var(--color-surface-lowest)",
        borderBottom: "1px solid rgba(15,58,95,0.07)",
        boxShadow: "0 2px 12px rgba(15,58,95,0.04)",
      }}
    >
      {/* Brand row */}
      <div className="flex items-center justify-between px-4 h-12">
        <div
          className="text-sm font-bold"
          style={{
            fontFamily: "var(--font-jakarta), sans-serif",
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          className="text-xs"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Gestión de alquileres
        </div>
      </div>

      {/* Nav row */}
      <nav
        className="flex items-center px-2 pb-1"
        style={{ borderTop: "1px solid rgba(15,58,95,0.05)" }}
      >
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all"
              style={{
                color: active
                  ? "var(--color-primary-container)"
                  : "var(--color-on-surface-variant)",
                background: active ? "rgba(15,58,95,0.06)" : "transparent",
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span
                className="text-[10px] font-medium"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
