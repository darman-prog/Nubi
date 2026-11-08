# ADR 015: Arquitectura frontend React y presupuesto de deuda

**Fecha:** 2026-11-08 · **Estado:** Confirmada · **Complementa a:** ADR-013 (framework React) · **Actualizada por:** ADR-016 (rutas, navegación, paneles y responsive)

## Contexto

La SPA nació con `src/core` y `content/schema`, pero sin capa de composición, sin features y sin UI compartida. El doc 05 §4 conserva un modelo anterior (`Card`, 5 etapas) que contradice el esquema real (`Escena`, `Pregunta`, `Reto`; etapas `llegada`, `historia`, `retos` y `sello`). Las pantallas se construirán una por una y existe riesgo de dos deudas: god components por falta de límites y una app inflada por inyección de dependencias.

## Decisión

### Capas

```
app          composición raíz: rutas, layouts, providers, transición
features     pantallas y componentes de cada flujo
core         aplicación + infraestructura del navegador
domain       reglas puras, sin React ni DOM
shared       UI genérica, hooks y utilidades sin dominio
```

- Las dependencias apuntan hacia adentro: `app → features → core → domain`.
- `features` no importa otra feature; comparte `core`, `domain` y `shared`.
- `domain` solo importa tipos de `content/schema`.
- `core` no importa React ni `features`.
- `shared/ui` no importa `core`, `domain`, `features` ni `state`.
- `app` es el único que conoce todas las capas y no contiene lógica de negocio.

### Piezas clave

- **Estado:** un `UserStateStore` en `core` y un solo contexto React (`UserState`). Sin Redux, Zustand ni contenedor DI.
- **Contenido:** `ContentRepository` creado desde JSON validado con Zod. Las features no importan JSON de `content/`.
- **Arte:** `import.meta.glob` sobre `arte/**/*.webp`; no se duplica el arte en `public/`.
- **Estilos:** CSS Modules por feature + tokens globales. Sin Tailwind, sin estilos inline salvo variables dinámicas.
- **Iconos:** SVG inline en `shared/ui`; sin Material Symbols ni CDN.
- **Fuentes:** autoalojadas (`@fontsource` en `devDependencies` o WOFF2 propios).
- **Rutas:** `BrowserRouter` + lazy por feature. Pasaporte, isla y niebla son hojas sobre el mapa; ayuda y coronación son pantallas completas.
- **Tests:** dominio puro, core con almacenamiento en memoria y componentes con Testing Library. E2E en la feature 007.

### Presupuesto de deuda

| Métrica | Límite | Verificación |
|---|---|---|
| Contextos React | 1 (`UserState`) | `check:boundaries` |
| Costuras inyectadas | 2 (`StorageLike`, `ContentData`) | Revisión |
| Dependencias runtime | 4: React, React DOM, React Router, Zod | `check:boundaries` |
| Orquestador de pantalla | ≤180 líneas | `check:boundaries` |
| Componente o servicio | ≤200 líneas | `check:boundaries` |
| Dominio | ≤150 líneas por archivo | `check:boundaries` |
| Imports feature→feature | 0 | `check:boundaries` |
| React/DOM en `domain` | 0 | `check:boundaries` |
| Dominio en `shared/ui` | 0 | `check:boundaries` |
| `any` explícito | 0 | ESLint + TypeScript estricto |
| Textos de contenido hardcodeados | 0 (salvo etiquetas de UI) | Revisión |
| Dependencia nueva | ADR | Revisión |

Los límites de líneas se avisan al 90 % y fallan al 100 %. Las excepciones se justifican en el commit, no se silencian.

### Chequeo automático

`npm run check:boundaries` ejecuta `scripts/check-boundaries.mjs` (Node puro, sin dependencias):

- `feature-to-feature`: una feature no importa otra.
- `domain-purity`: `domain` no importa React, DOM, `core`, `features`, `app` ni `shared`.
- `domain-globals`: `domain` no usa `window`, `document`, `localStorage`, `sessionStorage` ni `navigator`.
- `core-no-react`: `core` no importa React, `features` ni `app`.
- `ui-purity`: `shared/ui` no importa `core`, `domain`, `features`, `app` ni `state`.
- `feature-storage`: las features no usan `localStorage` ni `sessionStorage`.
- `feature-content`: las features no importan JSON de `content/`.
- `contexts`: como máximo un `createContext`.
- `runtime-deps`: solo las cuatro dependencias permitidas.
- `line-budget`: límites por carpeta y por archivo de pantalla.
- `cycles`: sin ciclos de imports.

El chequeo corre en `prebuild` y en `npm run check`, y tiene un `--self-test` para que no se rompa en silencio.

### Checkpoint

Después de portada y mapa se revisan líneas por archivo, contextos, imports entre capas, ciclos y tamaño del bundle. Si la estructura se siente pesada, se simplifica antes de la tercera pantalla.

## Consecuencias

- **Positivas:** límites explícitos, dominio testeable, UI reemplazable y deuda visible desde el primer commit.
- **Negativas:** más carpetas e imports; el chequeo puede dar falsos positivos y hay que mantener la allowlist.
- **Mitigación:** script ≤350 líneas (herramienta de build, no código de app), reglas explícitas, self-test y revisión en cada pantalla. Si el script crece, se divide o se reemplaza por `dependency-cruiser` como `devDependency` y se registra en un ADR.

## Alternativas descartadas

- **`application`/`infrastructure` separadas:** ceremonia sin una segunda implementación; `core` ya cumple esa función.
- **Contenedor DI:** infla la app y oculta dependencias; bastan dos costuras y un contexto.
- **Feature-sliced:** más independencia, pero sobre-ingeniería para seis pantallas que comparten contenido y estado.
- **Tailwind, Google Fonts o Material Symbols:** tokens propios, privacidad de menores y funcionamiento offline.
- **Rutas de pantalla completa para isla y pasaporte:** no coinciden con los mockups y pierden el scroll del mapa.
