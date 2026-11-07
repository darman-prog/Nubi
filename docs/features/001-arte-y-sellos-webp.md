---
id: 001
status: cerrada
created: 2026-11-06
updated: 2026-11-07
---
# Feature 001 — Unificación y Generación de Arte en WebP HD

> Estandarización de todo el arte visual de Nubi (expresiones, islas, escenas y sellos) en formato WebP de alta definición con recorte limpio sin halo y eliminación de archivos obsoletos.

## Objetivo
Disponer de todos los recursos gráficos definitivos del proyecto en alta resolución, coherentes con la dirección de arte de libro de cuentos (`arte/ancla-estilo.jpg`), sin halos blancos en fondos oscuros y sin archivos SVG/PNG duplicados.

## Contexto
El intento de vectorización extrema a SVG (<20 KB) degradó severamente la calidad de las ilustraciones. Se decidió unificar en WebP HD preservando brillos internos y limpiando la franja lateral morada generada por compresión sin `exact=True`.

## Alcance
| Incluye | Excluye |
|---|---|
| Generación de 18 piezas de arte faltantes en `arte/generados/` | Animaciones de las ilustraciones |
| Creación de 6 sellos de pasaporte ilustrados acordes a Nubi | Interactividad en la UI (T-05…T-10) |
| Algoritmo de recorte exterior por *flood-fill* y defringe | Backend o servicios externos |
| Eliminación de 65+ archivos obsoletos (.svg, .png duplicados) | — |

## Criterios de aceptación (Given-When-Then)
| N.º | Escenario / Condición | Resultado Esperado | Evidencia |
|---|---|---|---|
| 1 | Nubi o accesorios con fondo transparente | Brillos blancos internos intactos y borde exterior oscuro limpio sin halo | [`arte/nubi/*.webp`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/arte/nubi/) |
| 2 | Islas y escenas narrativas panorámicas | Fondos de cielo integrados en WebP a 800px y 1280px con alta fidelidad | [`arte/islas/*.webp`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/arte/islas/), [`arte/escenas/*.webp`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/arte/escenas/) |
| 3 | Sellos del pasaporte | Insignias circulares ilustradas con fondo transparente sin franja lateral morada | [`arte/sellos/*.webp`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/arte/sellos/) |
| 4 | Carpeta `arte/` limpia | Sin duplicados .png ni archivos .svg antiguos | `scripts/process_art_hd.py` (`cleanup_duplicates_and_temp_files`) |

## Pasos ejecutados
1. Generación de activos faltantes y sellos con IA y respaldo en `arte/generados/`.
2. Desarrollo de `scripts/process_art_hd.py` con algoritmo *flood-fill* exterior y descontaminación.
3. Corrección de franja morada lateral con `ImageFilter.MaxFilter` y parámetro `exact=True`.
4. Borrado automatizado de archivos temporales y SVG antiguos.

## Cierre
- Verificación visual completada en modo claro y fondo oscuro.
- Recursos integrados y listos para consumo en componentes de la SPA.
