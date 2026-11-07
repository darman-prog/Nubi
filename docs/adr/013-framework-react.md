# ADR 013: Framework React (reemplaza ADR-01 y D-09)

**Fecha:** 2026-11-05 · **Estado:** Confirmada · **Reemplaza a:** ADR-01 (doc 05 §1) y D-09 (doc 01 §13, pasará a ser D-15)

## Contexto

ADR-01 de `docs/ListadoDocumentos/05-arquitectura-tecnica.md` eligió Angular porque "es el stack que ya domina el equipo y los agentes lo manejan bien". Quien desarrolla el proyecto declaró dominar **JS/React** y no Angular: la premisa del ADR-01 queda invalidada.

El producto no depende del framework. D-04 (sin backend), ADR-02 (contenido como datos), ADR-07 (zod), el contrato de `StorageService` (doc 05 §5), el dominio puro (doc 05 §6) y los presupuestos de rendimiento (doc 05 §9) son agnósticos del framework.

## Decisión

- **Stack:** Vite + React + TypeScript estricto (sin `any`), SPA estática sin backend, igual que el resto de la arquitectura del paquete.
- **ADR-02…ADR-12 se conservan sin cambios.** Los puntos Angular-específicos se adaptan así:
  - Componentes standalone + OnPush + signals → componentes funcionales de React; el estado del usuario persistido vive en el `StorageService` del doc 05 §5 (tras una librería de estado mínima, no dentro de componentes).
  - `@angular/service-worker` (ADR-04, PWA) → se elige el equivalente al llegar a T-13 (por ejemplo `vite-plugin-pwa`); misma meta: instalable + offline.
  - Angular CDK `drag-drop` (ADR-05) → **no se adopta ninguna librería de arrastre**: el camino principal del armador de cadenas es "tocar la pieza y luego el hueco" más teclado (doc 03 §5.3); el arrastre es una mejora futura y no bloquea.
- La estructura de carpetas de doc 05 §3 se conserva (nombres de carpetas, no el andamiaje Angular).

## Consecuencias

- **Positivas:** velocidad de desarrollo real del equipo; todo el modelo de datos, compuertas de evidencia y anti-patrones se aplican igual.
- **Negativas:** el riesgo RT-02 ("peso del paquete Angular") se relee como "peso del paquete React"; los presupuestos de §9 obligan a medir de todos modos en CI (Lighthouse en T-15).
- **Mitigación:** carga diferida por *feature*, medición del JS inicial en el build; doc 05 conserva sus secciones como referencia con una nota de adaptación hasta que T-00/T-15 actualicen los detalles.

## Alternativas descartadas

- **Angular (ADR-01 original):** curva de aprendizaje sin razón; su premisa "el equipo ya domina Angular" era incorrecta.
- **SvelteKit / Preact:** más livianos; solo se reevaluarán si RNF-02 (rendimiento en gama baja) no se cumple, tal como ya lo preveía el propio ADR-01.
