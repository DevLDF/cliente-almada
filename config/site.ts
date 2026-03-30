/**
 * config/site.ts
 * ─────────────────────────────────────────────────────────────
 * Único archivo que cambia por cliente.
 * Al clonar el template para un cliente nuevo, solo editá este archivo.
 */

export const siteConfig = {
  /** Nombre visible en la UI, emails y metadata */
  name: "Almada & Cía",

  /** Descripción corta para SEO y metadata */
  description: "Gestión de contratos y propiedades de alquiler",

  /** Dominio de producción del cliente (sin trailing slash) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Ruta al logo dentro de /public */
  logo: "/logo.svg",

  /** Color primario de la marca (usado en Tailwind como variable CSS) */
  primaryColor: "#0F3A5F",

  /** Links del footer / navegación pública */
  links: {
    github: "",
    instagram: "",
    whatsapp: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
