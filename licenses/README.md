# Registro de Licencias y Origen de Recursos (`/licenses`)

Registro exigido por `docs/ListadoDocumentos/04-diseno-visual-ux.md` (§3.3 y §10) y `docs/ListadoDocumentos/05-arquitectura-tecnica.md` (`RT-07`).

## 1. Fuentes tipográficas autoalojadas

Todas las fuentes se sirven localmente desde `src/styles/fonts/` sin peticiones a terceros (`RNF-04`).

| Familia | Archivo | Licencia | Notas |
|---|---|---|---|
| **Fredoka** (variable `300 700`) | `src/styles/fonts/fredoka-latin.woff2` | SIL Open Font License (OFL) 1.1 | Uso libre para títulos; subconjunto latino |
| **Nunito** (variable `200 1000`) | `src/styles/fonts/nunito-latin.woff2` | SIL Open Font License (OFL) 1.1 | Uso libre para cuerpo de texto; subconjunto latino |

## 2. Ilustraciones y arte gráfico (`arte/`)

| Recurso | Ruta | Origen y modelo | Licencia / Derechos |
|---|---|---|---|
| Ancla de estilo y personaje base **Nubi** | `arte/ancla-estilo.jpg`, `arte/nubi/*.webp` | Generación original para el proyecto Nubi (`gemini-nano-banana-2.1` / Gemini) | Activos propios del proyecto; sin marcas ni personajes de terceros |
| Miniaturas de islas y sellos | `arte/islas/*.webp`, `arte/sellos/*.webp` | Generación original para el proyecto Nubi + post-proceso local (`scripts/process_art_hd.py`, `scripts/optimize_webp.py`) | Activos propios del proyecto |
| Escenas narrativas (28 piezas) | `arte/escenas/*.webp` | Generación original para el proyecto Nubi (`nido-1..3`, `reloj-1..5`, `horarios-1..5`, `animo-1..5`, `cerebro-1..5`, `taller-1..5`) | Activos propios del proyecto |
| Portada y coronación | `arte/hero-portada.webp`, `arte/coronacion.webp` | Generación original para el proyecto Nubi | Activos propios del proyecto |
| Íconos UI y siluetas de nube | `src/shared/ui/`, `src/features/map/components/CloudSilhouettes.tsx` | SVG inline escritos para el proyecto | Código y diseño propios del proyecto |

## 3. Reglas de distribución

- Los originales en bruto (`arte/generados/`, `arte/nubiExpresiones/`) no se incluyen en el bundle de distribución (`dist/`).
- Ningún recurso realiza peticiones externas en tiempo de ejecución.
