---
id: 009
status: en-curso
created: 2026-11-15
updated: 2026-11-15
---
# Feature 009 — Corrección Editorial, Copy Visible y Trazabilidad de Evidencia

> Unificación ortográfica, gramatical y de estilo en el contenido pedagógico (`content/`) y en el copy de interfaz (`src/features/**`), retiro de etiquetas visibles de nivel de evidencia y cierre de puntos ciegos del validador.

## Objetivo
Corregir ortografía, gramática, terminología, redundancias y atribución de evidencia sin agregar nuevas mecánicas, rediseñar la arquitectura ni sustituir la revisión médica humana (`professional_reviewed`).

## Alcance
| Incluye | Excluye |
|---|---|
| Copy visible en `src/features/**`, `content/islands/*.json`, `content/evidence/evidence.json` y `content/graph/*.json` | Nuevas mecánicas (`MEC-04`, `retoReal`), backend o cambios de dominio |
| Retiro de etiquetas visibles de nivel (`Bien establecido`, `Probable`, `Aún se investiga`, `Nivel E*`) en UI | Eliminación del campo interno `level` (`E1`/`E2`/`E3`) en esquemas y JSON |
| Regla `3 de 4` actividades sin `Cadena` obligatoria en islas de 4 actividades (`Cerebro` y `Taller`) | Paso 6 / Gate `D2` (`EV-007b` y `EV-018`), diferido hasta confirmación |
| Ampliación de `scripts/validate-content.ts`, campo opcional `isSimplified` (`D5`) y sincronización de `docs/ListadoDocumentos/` | Revisión clínica humana (`professional_reviewed`) |

## Decisiones (Gates)
| ID | Decisión | Estado |
|---|---|---|
| **D1** | `EE.UU.` sin espacio en prosa y documentos | Aplicado en `content/` y `docs/` |
| **D2** | Estado `draft` vs. `source_verified` y fichas `EV-007b` / `EV-018` | **Diferido** por solicitud del usuario (Paso 6 en pausa) |
| **D3** | Documentar que en v0.1 el reto es la cadena y posponer `retoReal` a v0.2 | Aplicado en `docs/ListadoDocumentos/02-contenido-y-evidencia.md` |
| **D4** | Retirar `WeekSimulator` (`MEC-04`) de código y docs hasta v0.2 | Aplicado en `src/` y `docs/ListadoDocumentos/{02,03}` |
| **D5** | Añadir `isSimplified?: boolean` opcional en `EscenaSchema` y mostrarlo en UI | Aplicado en `island.ts`, `StoryStage.tsx`, `animo.json`, `cerebro.json` y `05` |
| **D6** | Documentar `C-01` como refuerzo progresivo entre `Reloj` (1 hueco) y `Ánimo` (2 huecos) | Aplicado en `docs/ListadoDocumentos/02-contenido-y-evidencia.md` |
| **D7** | Documentar `C-04` en `Taller` como síntesis de regularidad fin de semana | Aplicado en `docs/ListadoDocumentos/02-contenido-y-evidencia.md` |
| **QA-1..3** | Variar `PR-2`/`MR-04` en `Horarios`, quitar etiquetas visibles de nivel (`PR-33`) y permitir cualquier 3 de 4 mecánicas | Aplicado y verificado |

## Criterios de aceptación (Given-When-Then)
| N.º | Escenario / Condición | Resultado Esperado | Evidencia |
|---|---|---|---|
| 1 | Etiquetas de etapa y copy UI (Fase 1) | Sin `sintoma` crudo, sin `Conquista`, `Aún no tienes sellos`, `Inhala suavemente` / `Sostén`, feedback con tarjeta en `StudyDetective` y copia de `Ayuda` corregida | `StoryStage.spec.tsx`, `SealStage.spec.tsx`, `PassportSheet.spec.tsx`, `HelpScreen.spec.tsx`, `mechanics.spec.tsx` |
| 2 | Retiro de etiquetas visibles de nivel | No se muestran `Bien establecido`, `Probable`, `Aún se investiga` ni `Nivel E*` en `CloudCard`, `SourceBlock`, `ChainBuilder` ni `HelpScreen`; `PR-33` no menciona esa etiqueta | `ChainBuilder.spec.tsx`, `HelpScreen.spec.tsx`, `animo.json` |
| 3 | Regla 3 de 4 actividades | Completar cualquier combinación de 3 mecánicas en `Cerebro` o `Taller` desbloquea el sello sin exigir `Cadena` | `ChallengesStage.spec.tsx` |
| 4 | Contenido, validador y docs (Fases 2–5) | `npm run validate:content`, `npm run check` y `npm run build` en verde; 3 reglas nuevas en `validate-content.ts` y badge `Explicación simplificada` en `StoryStage` | `validate.spec.ts` (11 tests), `StoryStage.spec.tsx` (2 tests), suite completa (33 archivos, 106 tests) |
