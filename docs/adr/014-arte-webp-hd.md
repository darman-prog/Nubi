# ADR 014: Arte en WebP HD (reemplaza la regla SVG ≤ 20 KB del doc 04 §10)

**Fecha:** 2026-11-07 · **Estado:** Confirmada · **Reemplaza:** regla de formato de `docs/ListadoDocumentos/04-diseno-visual-ux.md` §10

## Contexto

El doc 04 §10 exigía SVG ≤ 20 KB por ilustración. Al aplicar esa regla con vectorizado automático, el arte generado con Nano Banana perdía los brillos internos, los degradados suaves y el defringe del recorte; además, las escenas panorámicas superaban el presupuesto incluso tras simplificar. En paralelo, el alcance de arte se recortó a 11 escenas para no inflar el proyecto (feature 001). Los navegadores objetivo (Chrome Android y Safari iOS, últimas 2 versiones) soportan WebP con canal alfa.

## Decisión

- Ilustraciones y escenas en **WebP** (con alfa cuando se montan sobre UI).
- Tamaños: 800 px de ancho para escenas y miniaturas; 1280 px para piezas grandes (hero, coronación); miniaturas de mapa 256-400 px.
- Presupuesto por archivo: miniatura ≤ 40 KB; escena 800 px ≤ 90 KB; escena 1280 px ≤ 180 KB.
- Carga diferida por isla y `loading="lazy"` fuera del primer viewport.
- SVG queda solo para iconos de interfaz y las siluetas de nube del mapa (ADR-05).
- Proceso: `scripts/process_art_hd.py` (recorte flood-fill + defringe) y `scripts/optimize_webp.py` (compresión); registro en `licenses/`.

## Consecuencias

- Positivas: calidad visual conservada; escenas legibles a 360 px; menos peso que PNG.
- Negativas: los recursos dejan de ser vectoriales (no escalan al infinito); el presupuesto de RNF-02 depende de medir el peso real.
- Mitigación: budgets de imagen en T-15 (Lighthouse), lazy loading y `srcset` 800/1280. Si una escena supera 180 KB, se reexporta con menor calidad o se divide.

## Alternativas descartadas

- SVG ≤ 20 KB con vectorizado: degradaba el arte (brillos, degradados y bordes).
- PNG: 3-5x más peso con el mismo resultado visual.
- AVIF: mejor compresión, pero se prioriza WebP por soporte y por ser el pipeline ya implementado; reevaluar en v1.
