---
id: 006
status: en-curso
created: 2026-11-08
updated: 2026-11-08
---
# Feature 006 — UI completa, responsive de paridad y Diario

> Una columna de 480/560/640, barra inferior de 4 destinos, hojas modales en móvil y desktop, rutas de isla por etapa y Diario mínimo.
## Objetivo
Sustituir los placeholders por el flujo real con arte y contenido, sin crear un producto distinto en desktop. La misma composición, el mismo orden y las mismas interacciones en todos los anchos.
## Alcance
| Incluye | Excluye |
|---|---|
| Columna 480/560/640 y barra inferior de 4 destinos | Riel lateral, panel no modal, portada split o dos columnas |
| Hojas modales de pasaporte, isla y niebla en ambos | Lectura semanal del Diario (v0.2) |
| `/isla/:slug/:etapa` con atrás, enlace directo y resize | Onboarding (v1.0) |
| Diario mínimo: entrada, edición de hoy y últimas 7 noches | Sellos de Diario y texto libre |
| Matriz Playwright + axe 320/390/844×390/1024/1440 | PWA y Lighthouse (features posteriores) |
## Criterios de aceptación
| N.º | Criterio verificable | Comando | Evidencia |
|---|---|---|---|
| 1 | `npm run check` y `npm run build` verdes | `npm run check` | Bitácora |
| 2 | 4 destinos en 320, 390, 1024 y 1440 sin scroll horizontal | `npm run test:e2e -- --grep responsive` | Playwright |
| 3 | `/isla/reloj/retos` abre hoja modal en 390 y 1440; Esc cierra y devuelve foco | `npm run test:e2e -- --grep isla` | Playwright |
| 4 | Diario guarda, recarga y edita la entrada de hoy | `npx vitest run src/domain/diary` y `npm run test:e2e -- --grep diario` | Vitest/Playwright |
| 5 | DOM `nav → main → dialog` y skip link al main | `npx vitest run src/app/layouts` | Vitest |
| 6 | Sin violaciones axe serious/critical en 390 y 1440 | `npm run test:e2e -- --grep a11y` | Playwright |
| 7 | 320 px (reflujo) y 844×390 (hoja 100dvh) sin desbordes | `npm run test:e2e -- --grep responsive` | Playwright |

## Runner
| Campo | Valor |
|---|---|
| estado | en-curso |
| dueño | build |
| paso | 0/7 |
| siguiente | ADR-016 + docs 01/03/04/05 |
| bloqueado_por | - |
| ultimo_handoff | - |

## Pasos
1. ADR-016 y corrección documental.
2. Shell de columna, tokens responsive y `AppNav` de 4 destinos.
3. Hoja modal por ruta y gestión de foco.
4. Portada responsive.
5. Mapa, isla, cadena y pasaporte.
6. Diario mínimo.
7. Ayuda, coronación y matriz Playwright/axe.

## Bitácora
| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| - | - | - | - | - |

## Rollback
`git revert` de los commits de la feature; el estado local no se migra porque `schemaVersion` sigue en 1.

## Cierre
- Fila resumen del changelog.
- Decisión de arquitectura: `ADR-016`.
