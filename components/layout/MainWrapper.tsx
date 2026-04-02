"use client";

import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/auth"];

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <main
      className={`flex-1 min-h-screen${isAuth ? "" : " ml-60"}`}
      style={{ background: "var(--color-surface)" }}
    >
      {children}
    </main>
  );
}
