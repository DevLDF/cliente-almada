# CLAUDE.md — Cliente: Almada & Cía

---

## Arquitectura (respetar siempre)

🔴 **CORE — nunca modificar:** `/lib/supabase`, `/middleware.ts`, `/components/ui`, `/types/index.ts`
🟡 **CONFIG — solo estos archivos:** `/config/site.ts`, `/config/features.ts`
🟢 **EXTENSIÓN — agregar libremente:** `/app/[feature]/`, `/actions/`, `/validations/`, `/components/`

**Prohibiciones clave:** no usar `any`, no crear Server Actions sin ZSA, no tocar CORE, no hardcodear nombre del cliente (usar `siteConfig.name`), no agregar dependencias sin preguntar.

---

## Contexto del cliente

**Cliente:** Almada & Cía — inmobiliaria de gestión de alquileres.
**Base:** forkeado de `vertical-inmobiliaria`. Aplicar todas las reglas y dominio de ese vertical.

### Features activas

```
hasContracts  ✅
hasProperties ✅
hasTenants    ✅
```

---

## Regla de trabajo

No proponer ni implementar features que no hayan sido aprobadas explícitamente por DevLDF.
