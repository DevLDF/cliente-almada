# Kickoff: Almada & Cía — Vertical Inmobiliaria

---

## Transcripción de la reunión con el cliente
[pegar acá]

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

**Fuente:** Reunión interna DevLDF — 30 mar 2026, 11:19 GMT-03:00
**Participantes:** Lautaro Risso (LR) · Francisco Lerra (FL)

---

#### Decisiones clave sobre el MVP

**Foco total en contratos de alquiler para inmobiliarias**
- Se descartó apuntar al segmento de abogados/escribanías en esta etapa: "el ámbito legal asociado a los abogados es más riguroso, mientras que una inmobiliaria o escribanía podría ser un punto de entrada más fácil" (FL, 00:01:09).
- Contratos es el MVP ideal: menos trabajo que otras verticales, puede funcionar con una sola pestaña en su versión mínima, y genera ingresos recurrentes rápidos.
- Plan go-to-market: construir el MVP → presentarlo a Almada (u otra inmobiliaria) → obtener feedback → iterar.

**Categorías de contratos: tres, separadas en DB**
- vivienda / comercio / galpón — ya definidas en el template.
- Diferencia principal: plazos mínimos de duración (FL, 00:12:16).
- Decisión: la generación de un contrato nuevo se alimenta solo de los contratos históricos de la misma categoría, no mezclados (LR+FL, 00:17:14).
- Cláusulas extra: campo libre para el usuario, como válvula de escape para casos atípicos.

---

#### Features acordadas para el MVP

| Feature | Decisión |
|---------|----------|
| Generación de contratos por categoría | ✅ Core del MVP |
| Calendario automático (fechas de pago y vencimiento) | ✅ Incluir en MVP — "fácil de agregar una vez que el contrato base esté funcionando" (FL, 00:10:58) |
| Botón WhatsApp para recordatorio de pago | ✅ Incluir en MVP — acceder al perfil del inquilino y abrir WhatsApp con su número (FL, 00:22:30) |
| Dashboard con resumen mensual | ✅ Incluir en MVP — ingresos mensuales, alquiler promedio, filtros por categoría (FL, 00:25:30–00:28:21) |
| Pestaña analítica | ✅ Incluir en MVP — métricas: ingresos totales, ticket promedio (por categoría: casa/galpón/comercio), porcentaje retenido por inmobiliaria (LR, 00:28:21–00:29:18) |

**Features explícitamente fuera del MVP:**
- **Gestión de arreglos/mantenimiento** (calefón, electricista, etc.): "no es tan estándar, requiere la intermediación y decisión manual del dueño" → "automatizarlo no vale la pena en la etapa inicial" (LR, 00:30:17). Candidato a add-on futuro.
- **OCR de DNI** para autocompletar datos de inquilinos y garantes: tecnológicamente posible pero excluido del MVP (FL, 00:20:15).
- **API de actualización de leyes de alquiler**: FL investigó una API paga que trackea cambios legislativos → "habría que ver cómo es el funcionamiento, qué te trae, cuáles son las opciones pagas" (00:08:37). Tarea pendiente de investigación, no incluir en MVP.

---

#### Modelo de negocio

- Plan base + add-ons (recordatorio por WhatsApp = add-on pago, estilo suscripción por niveles).
- La referencia visual para el pricing fue una pantalla de plan/servicios adicionales que LR mostró de otra app (00:32:14).

---

#### Arquitectura y stack confirmados

- El desarrollador externo revisó el boilerplate y confirmó que la arquitectura multi-nivel (boilerplate → vertical → cliente) "es sólida, escalable, es un modelo Template con personalización vertical" (01:11:10–01:12:26).
- **Next.js 15.5** (no 16): "la estabilidad vale más que la vanguardia tecnológica. Usar la versión de Next 15 que tenga buen soporte y siga recibiendo fixes de seguridad" (desarrollador, 01:36:23–01:40:38). Stack obligatorio ya fijado en CLAUDE.md.
- Riesgo principal identificado: propagación de cambios del template base a todos los repositorios hijos → mitigable con Claude Code + script que aplique el cambio en cada repo (LR+FL, 01:13:21–01:20:04).
- Estructura robusta pero no limitante: "definir capas con responsabilidades claras — lo que no se toca versus lo que se extiende" (desarrollador, 01:21:09).

---

#### Flujo de trabajo Git acordado

- Trabajo por feature: cada socio trabaja en una rama (`feature/dashboard`, `feature/contratos`, etc.) sin tocar `main` directamente.
- Nivel Git: básico — saben commitear y crear branches.
- Code review antes de cada merge a main.
- Comunicación: Slack (permite automatizaciones futuras y facilita incorporar nuevos miembros).

---

#### Próximos pasos acordados en la reunión

1. Definir cómo cargar los contratos históricos (genéricos o por categoría) y cómo se genera el nuevo contrato → pendiente validar con Claude.
2. FL: definir estándar de proceso de desarrollo (lista de pasos para trabajar prolijo y subir código sin conflictos) → ya materializado en `WORKFLOW.md`.
3. Marcar `boilerplate-tecnico` como template en GitHub y crear el vertical inmobiliaria → ✅ hecho.
4. Almada como primer proyecto cliente → ✅ repo creado.
5. LR: pasar esta reunión a Claude para llenar el KICKOFF → esta tarea.

---

## Protocolo de trabajo con Claude

Antes de iniciar cualquier feature no trivial, Claude **entra en plan mode**, explora el código existente, y hace todas las preguntas necesarias. Las decisiones se registran en `PLAN.md` y este `KICKOFF.md` antes de escribir una sola línea de código.

**Regla:** Si hay ambigüedad sobre producto, arquitectura o infraestructura → plan mode primero. No asumir, no improvisar.

---

## Tu tarea

Analizá las transcripciones y producí un plan con estas secciones:

**1. Perfil del cliente**
Nombre, tipo de operaciones, tamaño estimado, quién usa el sistema, pain points principales.

**2. Configuración**
Valores listos para copiar en `config/site.ts` y `config/features.ts`.

**3. Features a desarrollar**
Tabla priorizada: feature / estado (✅ en template / 🔨 a construir) / prioridad / justificación.

**4. Schema de DB adicional**
Tablas necesarias más allá de las existentes: nombre, columnas, relaciones, RLS. Si no hacen falta, indicarlo.

**5. Plan de implementación**
Fases ordenadas con tareas concretas.

**6. Preguntas**
Hacé todas las preguntas que necesites para no dejar nada suelto durante el desarrollo:
- Lo que no quedó claro en la reunión
- Decisiones de producto que hay que tomar antes de arrancar
- Casos borde que podrían aparecer y conviene definir ahora
- Ideas o mejoras que podrían sumar valor al cliente

No generes código. Solo el plan. DevLDF lo revisa y aprueba antes de arrancar.
