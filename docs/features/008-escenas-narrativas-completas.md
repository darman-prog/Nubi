---
id: 008
status: en-curso
created: 2026-11-08
updated: 2026-11-08
---
# Feature 008 — Escenas Narrativas Completas del Archipiélago

> Expansión del inventario de arte para dotar de una ilustración WebP HD dedicada a cada una de las 28 escenas narrativas del archipiélago (3 en Nido + 5 en cada una de las 5 islas jugables).

## Objetivo
Eliminar la repetición de imágenes y escenas sin ilustración en la etapa de historia (`StoryStage`), asegurando que cada una de las 28 escenas del contenido pedagógico cuente con su propia pieza gráfica panorámica en WebP HD a 800 px.

## Contexto
En la feature 001 y el ADR 014 se fijó un límite temporal de 11 escenas. La experiencia interactiva en móvil requiere que los preadolescentes vean evolucionar visualmente cada momento narrativo (síntoma → mecanismo/causa → recomendación/cierre) sin que las escenas 3, 4 y 5 recurran a la imagen genérica de la isla.

## Alcance
| Incluye | Excluye |
|---|---|
| Generación y post-proceso de 17 escenas narrativas faltantes | Modificación de textos pedagógicos ya validados en Zod |
| Vinculación de `ilustracion: "arte/escenas/<slug>-<n>.webp"` en `content/islands/*.json` | Islas en niebla fuera del MVP (sin evidencia) |
| Presupuesto WebP ≤ 90 KB por escena a 800 px | Animaciones de video |

## Inventario de las 17 Escenas Faltantes
1. **Isla Nido (2):** `nido-2.webp` (viaje por el archipiélago), `nido-3.webp` (promesa de pasaporte con sello).
2. **Isla Reloj (3):** `reloj-3.webp` (8-10 horas), `reloj-4.webp` (estudio 68.4%), `reloj-5.webp` (sin culpa).
3. **Isla Horarios (3):** `horarios-3.webp` (sol sale más tarde), `horarios-4.webp` (tres nubes conversando), `horarios-5.webp` (puente con chispa).
4. **Isla Ánimo (3):** `animo-3.webp` (tormenta mínima y arcoíris), `animo-4.webp` (freno de niebla), `animo-5.webp` (arco de estrellas y ganas).
5. **Isla Cerebro (3):** `cerebro-3.webp` (estantería desordenada), `cerebro-4.webp` (cuatro lunas y libro intacto), `cerebro-5.webp` (dos bibliotecarios comparando).
6. **Isla Taller (3):** `taller-3.webp` (luz natural de mañana), `taller-4.webp` (pantallas lejos de la cama), `taller-5.webp` (Nubi respirando en calma).

## Criterios de aceptación (Given-When-Then)
| N.º | Escenario / Condición | Resultado Esperado | Evidencia |
|---|---|---|---|
| 1 | Cobertura en islas jugables | Cada una de las 28 escenas tiene su ilustración en WebP | `arte/escenas/*.webp` (28 archivos) |
| 2 | Presupuesto de peso | Cada escena a 800 px pesa ≤ 90 KB | `scripts/optimize_webp.py` |
| 3 | Integración en JSON | Cada objeto de `historia` en `content/islands/*.json` tiene su propiedad `ilustracion` válida | `npm run validate:content` |
| 4 | Navegación en StoryStage | Al avanzar por la historia, cada paso presenta su ilustración específica sin saltar al fallback | `StoryStage.tsx` |
