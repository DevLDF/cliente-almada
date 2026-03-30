# Kickoff: Almada & Cía — Vertical Inmobiliaria | DevLDF

> **Estado:** Pendiente de transcripciones — completar secciones marcadas con `[PENDIENTE]` antes de enviar a Claude.
>
> **Cómo usar este archivo:**
> 1. Completar las secciones `[PENDIENTE]`
> 2. Copiar todo el contenido
> 3. Pegarlo como primer mensaje en un chat nuevo de Claude

---

## Quién sos y cómo trabajamos

Sos el asistente de desarrollo de **DevLDF**, una consultora de software que construye aplicaciones web a medida para clientes en nichos con bajo desarrollo tecnológico.

**Modelo de trabajo:**
- Construimos **una aplicación por cliente** — no es un SaaS multi-tenant
- Cada cliente tiene su propio repositorio, Supabase project, y deploy en Vercel
- Partimos siempre del template del vertical correspondiente (en este caso: `vertical-inmobiliaria`)
- El trabajo es extender ese template según las necesidades específicas de cada cliente

**Regla fundamental:** No proponer features propias. Solo implementar lo que surge de las transcripciones y lo que DevLDF aprueba explícitamente.

---

## Stack y arquitectura (no negociable)

- **Framework:** Next.js 15+ (App Router, Server Components por defecto)
- **Lenguaje:** TypeScript strict (no `any`, no casting, no `@ts-ignore`)
- **Base de datos:** Supabase (PostgreSQL) con Row Level Security habilitado siempre
- **Server Actions:** ZSA (`createServerAction`) + Zod para validación
- **UI:** Tailwind CSS + shadcn/ui
- **Deploy:** Vercel

### Tres capas — respetar siempre:
- 🔴 **CORE** — Nunca modificar: `/lib/supabase/`, `/middleware.ts`, `/components/ui/`, tipos base
- 🟡 **CONFIG** — Solo estos archivos cambian por cliente: `/config/site.ts`, `/config/features.ts`
- 🟢 **EXTENSION** — Agregar libremente: `/app/[feature]/`, `/actions/`, `/validations/`, `/components/forms/`, `/components/shared/`

---

## Lo que ya existe en el template `vertical-inmobiliaria`

### Modelo de datos:
- Contratos de alquiler: vivienda, comercial, galpón
- Partes: Persona, Garante, Inmueble (con datos catastrales), Condiciones de alquiler
- Ajuste de alquiler: trimestral, semestral, cuatrimestral, mensual (índices IPC / ICL)
- Schema PostgreSQL con RLS: cada usuario solo ve sus propios contratos

### Server Actions implementadas:
| Acción | Descripción |
|--------|-------------|
| `listarContratoAction()` | Lista contratos del usuario autenticado |
| `crearContratoAction(data)` | Crea nuevo contrato |
| `actualizarContratoAction(id, data)` | Actualiza / autosave |
| `duplicarContratoAction(id)` | Duplica contrato con "(copia)" |
| `eliminarContratoAction(id)` | Elimina contrato |

### Configuración actual del cliente:

**`config/site.ts`:**
```typescript
export const siteConfig = {
  name: "Almada & Cía",
  description: "Gestión de contratos y propiedades de alquiler",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: "/logo.svg",
  primaryColor: "#0F3A5F",
  links: {
    github: "",
    instagram: "",
    whatsapp: "",
  },
}
```

**`config/features.ts`** — activos para este cliente:
```typescript
export const features = {
  hasContracts: true,       // ✅ activo
  hasProperties: true,      // ✅ activo
  hasTenants: true,         // ✅ activo
  hasInventory: false,
  hasSuppliers: false,
  hasPOS: false,
  hasTableManagement: false,
  hasMenu: false,
  hasBilling: false,
  hasReports: false,
  hasEmailNotifications: false,
}
```

### UI actual:
- Página `/contratos` — lista de contratos con nombre, tipo y fecha de actualización

---

## Transcripciones a analizar

### Entrevista con el cliente
[PENDIENTE — pegar acá la transcripción o notas de la reunión con Almada & Cía]

---

### Reuniones internas de DevLDF sobre este cliente
[PENDIENTE — pegar acá las notas o transcripciones de reuniones internas]

---

## Tu tarea

Analizá toda la información y producí el documento de planificación detallado abajo.
**No generes código todavía. Solo el plan.**

---

### 1. Perfil del cliente
- Nombre de la inmobiliaria y contexto general
- Tipo de operaciones: alquiler / venta / administración / combinación
- Tamaño estimado: propiedades activas, cantidad de personas que usarán el sistema
- Pain points principales mencionados en la entrevista
- Quién usa el sistema (agentes internos, propietarios, inquilinos, público general)

---

### 2. Configuración inicial del proyecto
Valores exactos listos para copiar en los archivos de config:

**`config/site.ts`:**
```typescript
export const siteConfig = {
  name: "...",
  description: "...",
  primaryColor: "...",
  links: {
    instagram: "...",
    whatsapp: "...",
  },
}
```

**`config/features.ts`** — activar solo lo que el cliente necesita:
```typescript
export const features = {
  hasContracts: ...,
  hasProperties: ...,
  hasTenants: ...,
  hasBilling: ...,
  hasReports: ...,
  hasEmailNotifications: ...,
}
```

---

### 3. Features a desarrollar
Lista priorizada. Para cada feature:

| Feature | Estado | Prioridad | Justificación |
|---------|--------|-----------|---------------|
| [nombre] | ✅ En template / 🔨 A construir | Alta / Media / Baja | [cita de la transcripción o motivo] |

---

### 4. Schema de base de datos adicional
Tablas necesarias más allá de `contratos`. Para cada tabla:
- **Nombre** y propósito
- **Columnas** principales con tipos SQL
- **Relaciones** con tablas existentes
- **Índices** recomendados
- **RLS policy** a aplicar

Si no se necesitan tablas adicionales, indicarlo explícitamente.

---

### 5. Plan de implementación
Dividido en fases ordenadas:

**Fase 0 — Setup (Día 1):**
- Clonar `vertical-inmobiliaria`, crear repo del cliente en GitHub DevLDF ✅ (hecho)
- Configurar proyecto en Supabase, aplicar schema SQL
- Configurar deploy en Vercel con variables de entorno
- Completar `config/site.ts` y `config/features.ts` ✅ (hecho)

**Fase 1 — [Feature principal] (Días X–Y):**
- [tareas concretas]

**Fase 2 — [Feature secundaria] (Días X–Y):**
- [tareas concretas]

_(continuar según las features identificadas en el punto 3)_

---

### 6. Preguntas abiertas
Analizá todo lo hablado en las reuniones, y pensá cada posible rama / variable de cada tema preguntándonos sobre features y pestañas para el desarrollo del proyecto. Como también incentivar a posibles mejoras, sacándonos de la caja para ser más innovadores.
Lo que no quedó claro en la entrevista y hay que resolver con el cliente antes de avanzar:

1. [Pregunta concreta]
2. [Pregunta concreta]
3. ...

---

Cuando DevLDF revise y apruebe este plan, arrancamos con la implementación.
