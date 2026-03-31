# Roadmap: Generación de contratos con IA — Feature Futura

> **Estado:** Descartado del MVP. Candidato a feature premium post-lanzamiento.
> **Decisión tomada:** 2026-03-31 — Orka optó por template fijo en MVP por razones de seguridad legal y velocidad al mercado.

---

## Qué es esta feature

En lugar de usar un template legal fijo, la IA analiza los contratos históricos del cliente (cargados en la base de datos) y genera un borrador de contrato nuevo basado en los patrones detectados — cláusulas recurrentes, estilo redaccional, condiciones habituales por tipo de contrato.

---

## Por qué no entra en el MVP

| Razón | Detalle |
|-------|---------|
| **Riesgo legal** | La IA puede alucinar cláusulas. Un contrato de alquiler con errores tiene consecuencias legales reales para Almada. |
| **Costo de desarrollo** | 2-3 semanas extra vs 0 con template fijo. |
| **Validación humana** | Almada no tiene expertise legal para detectar errores en texto generado. Requeriría revisión de abogado. |
| **Costo de API** | ~$0.05–$0.20 por contrato generado (Claude API). Escalable pero requiere modelo de negocio definido. |
| **Calidad dependiente de datos** | Necesita suficientes contratos históricos para dar buenos resultados. Al inicio, Almada tiene pocos. |

---

## Diseño propuesto para la versión futura

### Approach recomendado: IA como asistente, no como generador

En lugar de que la IA genere el contrato entero, actúa como capa de sugerencias sobre el template fijo:

1. **El wizard sigue existiendo** — el usuario completa los datos como siempre.
2. **Al llegar a Step 6 (Opcionales / Cláusulas especiales)**, la IA analiza los contratos históricos del mismo tipo y sugiere cláusulas adicionales frecuentes.
3. **El usuario elige** cuáles incorporar — con un click, se agregan al campo `clausulaEspecial`.
4. **El template legal base no cambia** — solo las cláusulas extras son influenciadas por IA.

Esto elimina el riesgo de texto legal alucinado en las partes críticas (condiciones, plazos, montos).

---

## Stack técnico necesario

```typescript
// Nueva dependencia
import Anthropic from "@anthropic-ai/sdk"

// Nueva Server Action
// actions/ia.actions.ts
sugerirClausulasAction(contratoId, tipo) → string[]
```

```typescript
// Prompt base
`Analizá estos contratos de alquiler de tipo ${tipo} y sugerí hasta 5 cláusulas
adicionales que aparecen frecuentemente y podrían ser relevantes para un nuevo contrato.
Contratos históricos: ${historicos}
Devolvé SOLO las cláusulas, sin explicación, en formato de lista.`
```

---

## Modelo de negocio sugerido

- **Plan Base:** Template fijo — incluido en el precio base.
- **Plan Pro:** Sugerencias de IA por contrato — add-on mensual o por uso.
- **Costo estimado para Orka:** $0.02–$0.10 por llamada a Claude API (modelo haiku).
- **Precio sugerido al cliente:** $X/mes o $Y por contrato generado con IA.

---

## Condiciones para activar esta feature

- [ ] Almada tiene al menos 20 contratos cargados por tipo (base mínima para que la IA tenga patrones)
- [ ] Orka valida el output con un abogado antes del lanzamiento
- [ ] Se agrega disclaimer en la UI: *"Las sugerencias son orientativas. Revisá siempre con un profesional."*
- [ ] Se define pricing del add-on IA
- [ ] Se implementa rate limiting para controlar costos de API

---

## Referencia técnica

- Modelo recomendado: `claude-haiku-4-5-20251001` (rápido y económico para sugerencias)
- SDK: `@anthropic-ai/sdk`
- Ver documentación: `claude-api` skill en Claude Code
