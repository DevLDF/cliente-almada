# 🏠 vertical-inmobiliaria

> Vertical de **LF Software Studio** para inmobiliarias.
> Construido sobre [`boilerplate-tecnico`](https://github.com/DevLDF/boilerplate-tecnico).

Incluye: gestión de contratos de alquiler (vivienda, comercial, galpón) con preview en tiempo real, autosave, y exportación a PDF.

```
base-template (boilerplate-tecnico)
      │
      └── vertical-inmobiliaria  ← este repo
              │
              └── cliente-almada
              └── cliente-[nombre]
```

---

## Qué agrega este vertical sobre la base

| Carpeta | Contenido |
|---|---|
| `config/features.ts` | `hasContracts`, `hasProperties`, `hasTenants` activados |
| `types/contrato.ts` | Tipos inferidos desde Zod |
| `validations/contrato.schema.ts` | Schema completo del contrato de alquiler |
| `actions/contratos.actions.ts` | CRUD completo con ZSA + Supabase |
| `app/contratos/` | Rutas: lista, nuevo, editar |
| `supabase/schema.sql` | Tabla `contratos` con RLS listo para ejecutar |

---

## Setup para un cliente nuevo

```bash
# 1. Crear repo desde este template
gh repo create DevLDF/cliente-[nombre] --template DevLDF/vertical-inmobiliaria --private

# 2. Clonar y editar SOLO estos dos archivos:
#    config/site.ts   → nombre, logo, colores
#    config/features.ts → módulos activos

# 3. Crear proyecto Supabase y ejecutar supabase/schema.sql

# 4. cp .env.example .env.local  y completar con keys del cliente

# 5. npm install && npm run dev
# 6. vercel --prod
```

---

## 🏗️ Stack heredado de la base

Para que la IA no alucine y el código sea indestructible, estandarizamos en una sola dirección:

| Capa | Tecnología | Razón |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.5.14 (App Router) | Versión estable con soporte de seguridad activo. RSC + Streaming nativos. |
| **Lenguaje** | TypeScript strict | Cero `any`. Los errores se detectan en compile-time, no en producción. |
| **Base de Datos** | Supabase (PostgreSQL) | RLS nativo, Auth incluido, Storage, Realtime. Todo en uno. |
| **Comunicación** | Server Actions + ZSA | Mutaciones tipadas de punta a punta, sin API REST intermedia. |
| **Validación** | Zod | Contrato de datos en runtime. Si no pasa Zod, no entra a la DB. |
| **UI** | shadcn/ui + Tailwind CSS | Componentes que la IA conoce de memoria. Accesibles por defecto. |
| **Deploy** | Vercel | Preview deployments automáticos en cada PR. |

---

## 🔒 Seguridad de Grado Industrial

### Row Level Security (RLS) — Supabase

RLS es la política que vive **dentro de PostgreSQL**, no en el código. Garantiza que un usuario solo pueda leer y escribir sus propios datos, incluso si hay un bug en el código de aplicación.

```sql
-- Ejemplo: Un usuario solo puede ver SUS propiedades
CREATE POLICY "Usuarios ven sus propias propiedades"
ON propiedades FOR SELECT
USING (auth.uid() = user_id);

-- Un admin puede ver todas
CREATE POLICY "Admins ven todo"
ON propiedades FOR SELECT
USING (auth.role() = 'admin');
```

**Regla de hierro:** Toda tabla nueva en Supabase debe tener RLS activado desde el primer día.

```sql
ALTER TABLE nueva_tabla ENABLE ROW LEVEL SECURITY;
```

### Validación de Capas con Zod

Los datos pasan por tres capas de validación antes de tocar la base de datos:

```
Browser (form HTML) → Schema Zod en /validations → Server Action (ZSA) → Supabase RLS
     Capa 1                   Capa 2                    Capa 3             Capa 4
```

Nunca se confía en datos del cliente. Siempre se valida en el servidor.

### Middleware de Sesión

El `middleware.ts` en la raíz intercepta **cada request** y refresca el token de Supabase automáticamente. Sin esto, las sesiones expiran silenciosamente y el usuario queda en un estado inconsistente.

```ts
// middleware.ts — gestión automática de sesión
export async function middleware(request: NextRequest) {
  return await updateSession(request) // refresca el JWT en cada request
}
```

---

## 💰 Análisis de Costos: Hobby vs Pro

### Vercel

| Feature | Hobby (Free) | Pro ($20/mes) |
| :--- | :--- | :--- |
| Bandwidth | 100 GB/mes | 1 TB/mes |
| Builds | 100/día | Sin límite |
| Preview Deployments | ✅ | ✅ |
| Custom Domains | 1 | Ilimitados |
| Analytics | Básico | Avanzado |
| **Ideal para** | MVP / validación | Clientes en producción |

### Supabase

| Feature | Free | Pro ($25/mes) |
| :--- | :--- | :--- |
| Base de datos | 500 MB | 8 GB |
| Auth usuarios | Ilimitados | Ilimitados |
| Almacenamiento | 1 GB | 100 GB |
| Edge Functions | 500K invocaciones | 2M invocaciones |
| Backups | ❌ | Diarios |
| SLA | ❌ | 99.9% uptime |
| **Ideal para** | MVP / demo | Producción real |

**Estrategia de la consultora:** Arrancar cada cliente en Free, migrar a Pro cuando supere las métricas de uso. El costo de $45/mes (Vercel Pro + Supabase Pro) se justifica a partir del segundo mes de MRR.

---

## 🏗️ Sistema de dos niveles

Este repo es el **Nivel 1 (Base)**. Nunca se entrega directamente a un cliente.

```
base-template  ←  este repo
      │
      ├── vertical-inmobiliaria   (Nivel 2) → contratos, alquileres, propiedades
      ├── vertical-restaurante    (Nivel 2) → menú, mesas, pedidos
      └── vertical-ropa           (Nivel 2) → inventario, proveedores, ventas
              │
              └── cliente-almada            (Nivel 3) → fork del vertical, customizado
              └── cliente-X                 (Nivel 3) → otro cliente del mismo rubro
```

**Cómo crear un cliente nuevo:**
```bash
# 1. Crear repo desde el vertical correspondiente (botón "Use this template" en GitHub)
gh repo create DevLDF/cliente-X --template DevLDF/vertical-inmobiliaria --private

# 2. Clonar y configurar
git clone https://github.com/DevLDF/cliente-X
# Editar SOLO: config/site.ts y config/features.ts

# 3. Crear proyecto Supabase nuevo para ese cliente
# 4. Actualizar .env.local con sus keys
# 5. Deploy: vercel --prod
```

---

## 📁 Anatomía del Repositorio

```
/
├── app/                  → Routing y Vistas (Next.js App Router)
├── actions/              → Lógica de Negocio (Server Actions con ZSA)
├── config/               → ⚙️  Configuración por cliente
│   ├── site.ts           →     Nombre, logo, colores, dominio
│   └── features.ts       →     Feature flags (qué módulos están activos)
├── validations/          → Contratos de Datos (Schemas Zod)
├── lib/
│   └── supabase/         → 🔴 CORE — no modificar
├── components/
│   ├── ui/               → 🔴 CORE — shadcn/ui, no modificar
│   ├── forms/            → Formularios construidos sobre Zod
│   └── shared/           → Componentes compuestos reutilizables
├── types/                → Tipos TypeScript inferidos de Zod
├── hooks/                → Custom Hooks de React (solo cliente)
├── migrations/           → Changelog de cambios del core para propagar
├── middleware.ts          → 🔴 CORE — Gestión de sesión Supabase
├── .env.example          → Variables de entorno documentadas
├── CLAUDE.md             → Reglas estrictas para la IA
└── tsconfig.json         → TypeScript strict mode
```

### Descripción detallada

**`/app`** — Solo routing, layouts y pages. Sin lógica de negocio. Cada `page.tsx` delega todo a components y llama Server Actions. Regla: si estás escribiendo `fetch()` o lógica SQL acá, lo estás haciendo mal.

**`/actions`** — El cerebro. Server Actions organizadas por dominio (`user.actions.ts`, `property.actions.ts`). Todas usan `createServerAction()` de ZSA con schema Zod. El handler recibe el input ya validado y tipado.

**`/validations`** — Los contratos. Un archivo por dominio (`user.schema.ts`, `property.schema.ts`). Son la fuente de verdad. Los tipos de TypeScript se infieren desde acá, nunca se escriben a mano.

**`/lib/supabase`** — La fontanería. Tres clientes, cada uno para su contexto:
- `client.ts` → Client Components (browser)
- `server.ts` → Server Components y Server Actions
- `middleware.ts` → Middleware de Next.js

**`/components/ui`** — Átomos base de shadcn/ui. No se modifican directamente: se extienden.

**`/components/forms`** — Formularios complejos construidos sobre `react-hook-form` + resolvers de Zod. Leen los schemas de `/validations` para auto-generarse.

**`/components/shared`** — Piezas reutilizables entre features: `DataTable`, `PageHeader`, `ConfirmDialog`. Pueden usar hooks y llamar Server Actions.

---

## 🔄 Flujo de Datos

```
Usuario en el Browser
        │
        ▼
app/page.tsx              → Renderiza el layout y los componentes
        │
        ▼
components/forms/         → Captura el input del usuario
        │
        ▼
actions/x.actions.ts      → Valida con Zod, ejecuta lógica de negocio
        │
        ▼
lib/supabase/server.ts    → Persiste en PostgreSQL con RLS activo
        │
        ▼
validations/x.schema.ts   → Define el contrato en toda la cadena
```

---

## 🤖 Workflow con Claude Code

Para mantener la integridad arquitectónica, toda instrucción a Claude debe respetar:

1. **Leer `CLAUDE.md`** antes de cualquier tarea — contiene las reglas absolutas.
2. **Schema-first:** Antes de crear una tabla o formulario, definir el schema en `/validations`.
3. **Server-First:** No usar `'use client'` a menos que sea estrictamente necesario.
4. **No duplicar tipos:** Los tipos se infieren desde Zod, nunca se definen manualmente.

---

## 🗺️ Roadmap de Evolución

El chasis es vivo. Estas son las próximas integraciones planificadas:

| Tecnología | Estado | Propósito |
| :--- | :--- | :--- |
| **Drizzle ORM** | Planificado | Query builder tipado sobre Supabase/PostgreSQL. Reemplaza queries manuales. |
| **Sentry** | Planificado | Monitoreo de errores en producción. Alertas automáticas. |
| **Playwright** | Planificado | Testing E2E automatizado. Valida flows críticos antes de cada deploy. |
| **Resend** | Planificado | Emails transaccionales (confirmación, recuperación de cuenta). |
| **Stripe** | Por cliente | Pagos y suscripciones. Se integra en cada proyecto que lo requiera. |

---

## 🛠️ Setup para el equipo

```bash
# 1. Clonar el repo del cliente asignado
git clone https://github.com/DevLDF/[nombre-cliente]

# 2. Configurar variables de entorno
cp .env.example .env.local
# Completar con las Supabase keys del cliente

# 3. Instalar dependencias
npm install

# 4. Levantar en local
npm run dev
```

### Workflow Git

```
main        ← producción, protegido (requiere PR + review)
develop     ← integración diaria
feat/xxx    ← features nuevas
fix/xxx     ← bugfixes
```

**Reglas del equipo:**
- Nadie pushea directo a `main` — todo pasa por PR
- Cambios al CORE del base-template → PR con review del otro integrante
- Cambios al CORE se documentan en `/migrations/` antes de propagarse

### División de responsabilidades sugerida
- Cada cliente tiene un "dueño" asignado que es el punto de contacto
- Los cambios al `base-template` los revisan ambos antes de mergear
- Los verticales se desarrollan colaborativamente según la carga de trabajo

> Ante cualquier duda sobre arquitectura: leer `CLAUDE.md`.
> Ante cualquier duda sobre un cliente: hablar con el dueño asignado de ese proyecto.
