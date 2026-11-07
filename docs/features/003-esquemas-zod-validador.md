---
id: 003
status: cerrada
created: 2026-11-07
updated: 2026-11-07
---
# Feature 003 — Esquemas Zod y Validador de Contenido (T-02)

> Modelo de contenido del recorrido v0.1 en Zod, validador con las compuertas del doc 05 §4 y datos semilla de Nido y Reloj.

## Objetivo
Que `/content` sea la fuente de verdad validada: el build falla si una afirmación de salud no tiene ficha, si una cadena usa un puente pendiente o si el texto rompe los límites editoriales.

## Contexto
Sustituye el stub `scripts/validate-content.js`. El modelo usa `historia: Escena[]` (D-16) en lugar de tarjetas; doc 05 §4 se actualizará en T-06.

## Alcance
| Incluye | Excluye |
|---|---|
| Esquemas Zod en `content/schema/` (evidencia, grafo, isla/escena/pregunta, cadena) | Contenido de las 4 islas restantes (T-14) |
| Validador con las 8 reglas del doc 05 §4 y compuerta `CONTENT_GATE` | UI de islas (T-06) |
| Semilla real: Nido, Reloj + stubs de Horarios/Ánimo/Cerebro + grafo y evidencia | Sincronizar doc 05 §4 (T-06) |
| Pruebas de casos buenos y malos del validador | Playwright/E2E |

## Criterios de aceptación
| N.º | Escenario | Resultado esperado | Evidencia |
|---|---|---|---|
| 1 | `npm run validate:content` | Sale en verde con la semilla | Salida de Vitest |
| 2 | Escena de salud sin `evidenceId` | Falla con mensaje explícito | Prueba de `validateContent` |
| 3 | Puente `pending` referenciado por una cadena | Falla | Prueba de fixtures |
| 4 | Cadena con salto inválido | Falla | Prueba de fixtures |
| 5 | Texto > 45 palabras o palabra prohibida | Falla | Prueba de fixtures |
| 6 | `CONTENT_GATE=prod` con fichas `draft` | Falla | Prueba de fixtures |
| 7 | `npm run build` | Ejecuta el validador antes de compilar | `prebuild` en package.json |

## Pasos ejecutados
1. Esquemas y tipos inferidos en `content/schema/`.
2. Validador `scripts/validate-content.ts` + pruebas en `content/schema/validate.spec.ts`.
3. Semilla en `content/{evidence,graph,islands}/`.
4. Scripts de npm y `prebuild`.

## Cierre
- Verificado el 2026-11-07: `validate:content`, `typecheck`, `test`, `lint` y `build` en verde.
- Semilla de Nido/Reloj validada; el build ejecuta el validador por `prebuild`.
