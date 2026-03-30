# CLAUDE.md — Reglas del Proyecto

Estas reglas son **obligatorias** en todo el proyecto. No hay excepciones.

---

## Stack obligatorio

- **Next.js 15** con App Router (versión 15.5.14 — estable, con soporte de seguridad activo)
- **TypeScript** en modo estricto (`strict: true`)
- **Zod** para toda validación de datos
- **ZSA** (`zsa`) para todas las Server Actions

---

## Arquitectura de capas — Regla fundamental

Este repo tiene tres capas. Cada capa tiene reglas distintas:

### 🔴 CORE — Nunca modificar
Estos archivos son idénticos en todos los proyectos. Cambiarlos rompe la propagación de updates desde el base-template.

```
/lib/supabase/**     → clientes estandarizados de DB
/middleware.ts       → auth refresh automático
/components/ui/**    → shadcn/ui intocable
/types/index.ts      → tipos base compartidos
```

### 🟡 CONFIG — Solo estos archivos cambian por cliente
Al clonar para un nuevo cliente, únicamente se editan estos dos archivos:

```
/config/site.ts      → nombre, logo, colores, dominio
/config/features.ts  → qué módulos están activos (feature flags)
```

### 🟢 EXTENSIÓN — Agregar libremente por vertical/cliente
Nuevas features se agregan en estas carpetas, nunca reemplazando el core:

```
/app/[feature]/                    → nuevas rutas
/actions/[feature].actions.ts      → nuevas server actions
/validations/[feature].schema.ts   → nuevos schemas Zod
/components/[vertical]/            → nuevos componentes
```

**Regla:** Si necesitás modificar algo del CORE para que una feature funcione, es una señal de que la feature está mal diseñada. Revisá el approach.

---

## TypeScript — Reglas estrictas

```json
// tsconfig.json debe tener siempre:
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- **Prohibido** usar `any`. Usar `unknown` y tipar correctamente.
- **Prohibido** usar `as TipoX` para castear sin validación previa.
- **Prohibido** ignorar errores con `// @ts-ignore` o `// @ts-expect-error` sin comentario justificado.
- Los tipos de dominio **siempre** se infieren desde schemas Zod:

```ts
// ✅ Correcto
export type User = z.infer<typeof userSchema>

// ❌ Prohibido
export type User = { id: string; name: string }
```

---

## Zod — Uso obligatorio

- **Todo input de Server Action** debe tener un schema Zod en `/validations`.
- **Todo dato externo** (API, DB, env vars) debe pasar por `schema.parse()` o `schema.safeParse()`.
- Los schemas viven en `/validations`, nunca inline en components o actions.
- Nombrar schemas con sufijo `Schema`: `userSchema`, `projectSchema`.

```ts
// ✅ Correcto
import { userCreateSchema } from '@/validations/user.schema'

// ❌ Prohibido — validación inline
const parsed = z.object({ name: z.string() }).parse(data)
```

---

## Server Actions — ZSA obligatorio

**Todas** las Server Actions usan `createServerAction` de `zsa`:

```ts
// ✅ Patrón correcto
'use server'
import { createServerAction } from 'zsa'
import { userCreateSchema } from '@/validations/user.schema'

export const createUserAction = createServerAction()
  .input(userCreateSchema)
  .handler(async ({ input }) => {
    // input ya está tipado y validado
    const user = await db.user.create({ data: input })
    return user
  })
```

- **Prohibido** crear Server Actions sin ZSA (`'use server'` solo, sin `createServerAction`).
- El `handler` recibe `input` ya validado — no re-validar dentro del handler.
- Los errores se propagan con `throw new Error()` o retornando el error estructurado de ZSA.

---

## Estructura de archivos

```
/app             → Solo routing, layouts, pages
/actions         → Server Actions (ZSA). Un archivo por dominio.
/config          → Configuración por cliente (site.ts, features.ts)
/lib/supabase    → Clientes Supabase (client, server, middleware) — CORE
/validations     → Schemas Zod. Un archivo por dominio.
/components/ui   → Componentes shadcn/ui — CORE, no modificar
/components/shared → Componentes compuestos reutilizables
/types           → Tipos inferidos de schemas Zod
/hooks           → Custom hooks de React (solo cliente)
/migrations      → Changelog de cambios del base-template para propagar
```

### Reglas de importación

- `/app` puede importar desde `/components`, `/actions`, `/types`, `/config`
- `/actions` puede importar desde `/lib/supabase`, `/validations`, `/types`, `/config`
- `/components` **NO** importa desde `/lib/supabase` directamente
- `/lib/supabase` no importa desde `/actions` ni `/components`
- Cualquier componente puede importar desde `/config`

---

## Next.js 15 — Reglas

- **App Router siempre**. No usar Pages Router.
- Los Server Components son el default. Agregar `'use client'` solo cuando sea necesario.
- Los datos se fetchean en Server Components o Server Actions, nunca con `useEffect` + `fetch` del cliente.
- Las rutas dinámicas usan `generateStaticParams` cuando sea posible.

---

## Supabase — Reglas

- Usar el cliente correcto según el contexto:
  - Server Components/Actions → `lib/supabase/server.ts`
  - Client Components → `lib/supabase/client.ts`
  - Middleware → `lib/supabase/middleware.ts`
- **Nunca** usar la service key en código de cliente.
- Las queries reutilizables van en `lib/supabase/`, no inline en components.
- **Toda tabla nueva** debe tener RLS activado desde el primer commit.

---

## Feature flags — Uso correcto

```ts
// ✅ Correcto — verificar el flag antes de renderizar
import { features } from "@/config/features"

export default function Sidebar() {
  return (
    <nav>
      {features.hasContracts && <Link href="/contratos">Contratos</Link>}
      {features.hasInventory && <Link href="/inventario">Inventario</Link>}
    </nav>
  )
}
```

---

## Propagación de cambios del base-template

Cuando se hace un cambio importante en el CORE del base-template:
1. Se documenta en `/migrations/YYYY-MM-DD-descripcion.md`
2. Se propaga a los repos de verticales y clientes usando Claude Code:
   ```
   "Aplicá el cambio documentado en migrations/YYYY-MM-DD-descripcion.md
    sin modificar las customizaciones específicas de este proyecto"
   ```

---

## Lo que Claude NO debe hacer

- Generar tipos TypeScript manuales si existe un schema Zod equivalente
- Crear Server Actions sin ZSA
- Usar `fetch` en `useEffect` para obtener datos de Supabase
- Ignorar errores de TypeScript
- Agregar dependencias no aprobadas sin preguntar
- Modificar archivos del CORE (`/lib/supabase`, `/middleware.ts`, `/components/ui`)
- Crear archivos fuera de la estructura definida sin justificación
- Hardcodear el nombre del cliente — siempre usar `siteConfig.name` de `/config/site.ts`
