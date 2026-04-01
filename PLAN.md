# Plan de Proyecto — Almada & Cía | Orka
> **Generado:** 2026-03-30 | **Estado:** ✅ Aprobado por Orka

---

## Decisiones confirmadas

| Tema | Decisión |
|------|----------|
| Formulario | Wizard 6 pasos con autosave por paso |
| Usuarios | Un solo usuario — RLS actual suficiente |
| Comisión % | No entra en MVP |
| PDF | Sí — `@react-pdf/renderer`, template legal fijo por tipo + datos dinámicos. On-demand (botón). |
| Moneda | Solo ARS |
| Históricos | Carga manual uno a uno con el wizard. Sirven como base para duplicar y editar. |
| Alertas vencimiento | 7 días de anticipación |
| Renovación | Botón "Renovar" pre-llena wizard con datos del contrato anterior |
| WhatsApp | Mensaje fijo con variables — no editable por el usuario |
| Cláusulas PDF | Texto legal fijo por tipo (vivienda/comercial/galpón) + datos del formulario |
| Generación IA | **Fuera del MVP** — ver `ROADMAP_IA_CONTRATOS.md`. MVP usa template fijo. |
| IPC/ICL % ajuste | Campo manual `ajuste.porcentaje` en Step 4. Futuro: reemplazar por API. |
| Dashboard | Gestión de cobros: toggle pagado/pendiente por fila + filtro Proyectado vs Real |
| Autenticación | Email + contraseña. JWT 1h, refresh rotation, logout por inactividad 30min, HTTPS |

---

## 1. Perfil del cliente

**Almada & Cía** — Inmobiliaria en Las Flores, Buenos Aires.
- Operaciones: administración de alquileres (vivienda, comercial, galpón)
- Usuarios del sistema: agentes internos (un solo usuario en MVP)
- ⚠️ Pendiente entrevista cliente: propiedades activas, pain points, links institucionales

---

## 2. Configuración inicial del proyecto

### `config/features.ts` — cambio necesario
```typescript
hasReports: true,   // ← activar (dashboard + analytics)
```

### `config/site.ts` — pendiente cliente
```typescript
links: {
  instagram: "...",  // ⚠️ PENDIENTE CLIENTE
  whatsapp: "...",   // ⚠️ PENDIENTE CLIENTE — número institucional
}
```

---

## 3. Features a desarrollar

| Feature | Estado | Prioridad | Justificación |
|---------|--------|-----------|---------------|
| Formulario wizard de contrato | 🔨 A construir | Alta | Core del MVP — la UI no existe |
| Calendario de pagos y vencimientos | 🔨 A construir | Alta | "Fácil de agregar una vez que el contrato base esté funcionando" (FL) |
| Botón WhatsApp recordatorio | 🔨 A construir | Alta | Acceso directo al inquilino con mensaje pre-cargado |
| Dashboard resumen mensual | 🔨 A construir | Alta | Ingresos, promedios, alertas de vencimiento a 7 días |
| Flujo de renovación | 🔨 A construir | Media | Botón "Renovar" al vencer — pre-llena wizard |
| Pestaña Analytics | 🔨 A construir | Media | Ingresos totales, ticket promedio por categoría |
| PDF del contrato | 🔨 A construir | Media | Template legal por tipo + datos — ⚠️ bloqueado hasta recibir modelo de Almada |
| Cláusula especial libre | ✅ En template | Media | Campo `clausulaEspecial` en `opcionales` |
| Ajuste IPC/ICL | ✅ En template | Media | Schema completo — UI a construir |
| Gestión de mantenimiento | ❌ Fuera del MVP | Baja | Add-on futuro |
| OCR de DNI | ❌ Fuera del MVP | Baja | Post-MVP |
| API de leyes de alquiler | ❌ Fuera del MVP | Baja | Pendiente investigación |

---

## 4. Schema de base de datos adicional

### Nueva tabla: `pagos_calendario`

```sql
CREATE TABLE pagos_calendario (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id      UUID REFERENCES contratos(id) ON DELETE CASCADE NOT NULL,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  numero_cuota     INT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  monto_calculado  NUMERIC(12, 2) NOT NULL,
  estado           TEXT NOT NULL DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente', 'pagado', 'vencido')),
  fecha_pago       DATE,
  notas            TEXT DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE pagos_calendario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus propios pagos"
ON pagos_calendario FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX pagos_contrato_id_idx ON pagos_calendario (contrato_id);
CREATE INDEX pagos_fecha_vencimiento_idx ON pagos_calendario (fecha_vencimiento);
CREATE INDEX pagos_estado_idx ON pagos_calendario (estado);
```

### Índice adicional en tabla existente
```sql
-- Para búsqueda dentro del JSONB de contratos
CREATE INDEX contratos_data_gin_idx ON contratos USING GIN (data);
```

### Cambio en schema de validación
Agregar `telefono` a `personaSchema` en `validations/contrato.schema.ts` (requerido para WhatsApp):
```typescript
telefono: z.string().optional().default(""),
```

---

## 5. Plan de implementación

### Fase 0 — Setup ✅ COMPLETADA (2026-03-31)
- [x] Configurar proyecto en Supabase — schema aplicado (`contratos` + `pagos_calendario` + índice GIN)
- [x] `.env.local` verificado y corregido (`NEXT_PUBLIC_SITE_URL` → localhost)
- [x] `hasReports: true` en `config/features.ts` (ya estaba)
- [x] `telefono` en `personaSchema` y `emptyPersona` (ya estaba)
- [x] Tailwind v4 + postcss instalado y configurado
- [x] `app/layout.tsx` + `globals.css` + `app/page.tsx`
- [x] Login page + auth callback + middleware con protección de rutas
- ⚠️ Deploy en Vercel pendiente — conectar repo GitHub `DevLDF/cliente-almada` en Vercel dashboard (Settings → Git)

---

### Fase 1 — Wizard de contrato ✅ COMPLETADA (2026-03-31)
**Rama:** `feature/formulario-contrato` (mergeada a main)

- [x] `app/contratos/nuevo/page.tsx` — selector de tipo (vivienda / comercial / galpón)
- [x] `app/contratos/[id]/editar/page.tsx` — carga contrato y renderiza wizard
- [x] `components/forms/contrato/ContratoWizard.tsx` — wizard con barra de progreso y autosave
- [x] `components/forms/contrato/CampoTexto.tsx` — input reutilizable con label + error
- [x] `components/forms/contrato/steps/Step1Locador.tsx`
- [x] `components/forms/contrato/steps/Step2Locatarios.tsx` (useFieldArray — múltiples)
- [x] `components/forms/contrato/steps/Step3Inmueble.tsx`
- [x] `components/forms/contrato/steps/Step4Condiciones.tsx`
- [x] `components/forms/contrato/steps/Step5Garantes.tsx` (useFieldArray — múltiples)
- [x] `components/forms/contrato/steps/Step6Opcionales.tsx` (nombre + cláusula especial + inmueble en venta)
- [x] `actions/contratos.actions.ts` — agregado `crearBorradorContratoAction`
- [x] `types/contrato.ts` — corregido `emptyContrato` (porcentaje en ajuste)

Lógica implementada:
- react-hook-form + zodResolver + validación por step con `form.trigger(fields)`
- Flujo: seleccionar tipo → `crearBorradorContratoAction` → wizard autosave por paso
- Nombre del contrato se deriva automáticamente: `locatario — dirección`
- Edición: misma página `/contratos/[id]/editar` carga datos existentes del JSONB

---

### Fase 2 — Calendario de pagos ✅ COMPLETADA (2026-03-31)
**Rama:** `feature/calendario-pagos` (mergeada a main)

- [x] `validations/pago.schema.ts`
- [x] `actions/pagos.actions.ts` — `generarCalendarioAction`, `marcarPagadoAction`, `desmarcarPagadoAction`, `listarPagosContratoAction`
- [x] `app/contratos/[id]/calendario/page.tsx` — tabla de cuotas con estado y acciones
- [x] `components/contratos/CalendarioPagos.tsx` — Client Component con toggle pagado/vencido

---

### Fase A — Rediseño visual "The Friendly Architect" ✅ COMPLETADA (2026-04-01)
**Rama:** `feature/rediseno-fase-a` (mergeada a main)

- [x] Design system en `app/globals.css` — tokens Navy/Teal/Amber, fonts Jakarta + Manrope
- [x] `components/shared/Sidebar.tsx` — nav fijo w-60, reemplaza BottomNav
- [x] Dashboard (`app/page.tsx`) — grid 4 métricas + panel lateral, layout desktop
- [x] Contratos (`app/contratos/page.tsx`) — tabla con CSS grid, empty state
- [x] Clientes (`DirectorioClientes.tsx`) — tabla con avatar + búsqueda en header
- [x] CalendarioPagos — migrado a design tokens, header consistente
- [x] fix(supabase): RLS `auth.uid()` → `(select auth.uid())` en contratos y pagos_calendario
- [x] fix(supabase): `update_updated_at` function `search_path` mutable

---

### Fase 3 — WhatsApp (Días 9–10)
**Rama:** `feature/whatsapp`

- `components/shared/WhatsAppButton.tsx`
  - URL: `https://wa.me/{telefono}?text={mensaje_codificado}`
  - Mensaje: `"Hola {nombre}, te recordamos que el {fecha} vence la cuota {N} de tu alquiler por $\{monto\}. Ante cualquier consulta, comunicate con nosotros."`
  - Sin teléfono cargado: tooltip "Agregar teléfono al contrato"
- Integrar en lista de contratos y página de calendario

---

### Fase 4 — Flujo de renovación (Día 11)
**Rama:** `feature/renovacion`

- Estado calculado (no en DB): `vigente | por_vencer | vencido` — deriva de `fechaInicio + duracionMeses`
- Badge de estado en lista de contratos
- Botón "Renovar" en contrato vencido → `duplicarContratoAction` + redirect al wizard pre-llenado

---

### Fase 5 — Dashboard (Días 12–14)
**Rama:** `feature/dashboard`

- `app/dashboard/page.tsx` — página principal post-login
- `actions/dashboard.actions.ts`
  - `resumenMensualAction(mes, anio)`
  - `contratosActivosAction()`
  - `alquilerPromedioAction(tipo?)`
  - `marcarPagadoAction(pagoId, fechaPago)` — toggle pagado/pendiente
- `components/shared/dashboard/TarjetaKPI.tsx`
- `components/shared/dashboard/FiltroCategoria.tsx`
- `components/shared/dashboard/ListaVencimientosProximos.tsx` — alertas a 7 días
- `components/shared/dashboard/FiltroCobros.tsx` — toggle Proyectado (pendiente) / Real (pagado)

**Vista proyectada:** pagos futuros en estado `pendiente` — muestra el flujo de caja esperado.
**Vista real:** pagos marcados como `pagado` — muestra lo efectivamente cobrado.

---

### Fase 6 — Analytics (Días 15–16)
**Rama:** `feature/analytics`

- `app/analytics/page.tsx`
- `components/shared/analytics/GraficoIngresosMensuales.tsx` — últimos 12 meses (Recharts)
- `components/shared/analytics/TablaTicketPromedio.tsx` — por categoría

Métricas: ingresos totales, ticket promedio por tipo, contratos activos/vencidos/por vencer

---

### Fase 7 — PDF del contrato (Días 17–19)
**Rama:** `feature/pdf-contrato`

⚠️ **Bloqueada hasta recibir modelo de contrato (Word/PDF) de Almada para cada tipo**

- Librería: `@react-pdf/renderer`
- `lib/pdf/contrato-vivienda.tsx`
- `lib/pdf/contrato-comercial.tsx`
- `lib/pdf/contrato-galpon.tsx`
- `components/shared/BotonDescargarPDF.tsx` — Client Component
- `app/contratos/[id]/pdf/route.ts` — API route que devuelve el PDF como stream

Contenido: cláusulas legales fijas del tipo + todos los datos del formulario

---

### Fase 8 — Pulido + QA (Días 20–21)
- Sidebar: Contratos / Dashboard / Analytics
- `EmptyState` en todas las páginas
- Loading states y error boundaries
- Responsive mobile
- Revisión final RLS Supabase

---

## 6. Pendientes para primera reunión con Almada

1. Instagram y WhatsApp institucional → para `config/site.ts`
2. Cantidad de contratos activos actuales
3. Modelo de contrato base (Word/PDF) por tipo → desbloqueante de Fase 7
4. Pain points del proceso actual (gestión manual, errores frecuentes, etc.)

---

## Resumen ejecutivo

| Fase | Feature | Días |
|------|---------|------|
| 0 | Setup Supabase + Vercel | 1 |
| 1 | Formulario wizard | 4 |
| 2 | Calendario de pagos | 3 |
| 3 | WhatsApp | 2 |
| 4 | Renovación | 1 |
| 5 | Dashboard | 3 |
| 6 | Analytics | 2 |
| 7 | PDF | 3 |
| 8 | Pulido + QA | 2 |
| **Total** | | **~21 días hábiles** |
