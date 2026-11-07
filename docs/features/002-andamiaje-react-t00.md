---
id: 002
status: cerrada
created: 2026-11-07
updated: 2026-11-07
---
# Feature 002 — Andamiaje Base de la SPA en React (T-00)

> Inicialización de la arquitectura técnica en React + TypeScript estricto, configuración de herramientas de calidad (Vitest, ESLint, Prettier) y diseño visual base accesible.

## Objetivo
Establecer los cimientos ejecutables de la aplicación según `docs/ListadoDocumentos/05-arquitectura-tecnica.md` (T-00) y `docs/adr/013-framework-react.md`, garantizando compilación estricta y pruebas automatizadas.

## Contexto
Reemplazo formal de la premisa original de Angular por React (ADR-013), manteniendo intacta la regla de contenido agnóstico (`/content`), persistencia local pura y diseño visual sin dependencias de terceros.

## Alcance
| Incluye | Excluye |
|---|---|
| Configuración de Vite, TypeScript estricto, ESLint 9 (`jsx-a11y`) y Prettier | Componentes funcionales completos de islas (T-06) |
| Entorno de pruebas unitarias con Vitest y Testing Library | Esquemas Zod definitivos (T-02) |
| Estructura de carpetas canónica (`src/core`, `domain`, `features`, `content`) | Lógica de grafos y cadenas (T-08) |
| Tokens CSS y temas de contraste WCAG 2.2 AA (Amanecer / Noche) | Service Worker PWA (T-13) |

## Criterios de aceptación (Given-When-Then)
| N.º | Escenario / Condición | Resultado Esperado | Evidencia |
|---|---|---|---|
| 1 | Chequeo de tipos estricto | Cero errores de tipos y prohibición total de `any` | `npm run typecheck` (`tsc --noEmit`) |
| 2 | Suite de pruebas unitarias | Vitest configurado con jsdom y ejecución limpia de pruebas | `npm run test` (`src/domain/sample.spec.ts`) |
| 3 | Compilación de producción | Bundle optimizado sin advertencias en `dist/` | `npm run build` (Vite 5 / ES2022) |
| 4 | Linter de accesibilidad y código | ESLint 9 con `eslint-plugin-jsx-a11y` sin violaciones | `npm run lint` |
| 5 | Tokens y temas accesibles | Variables CSS con contraste ≥ 4.5:1 y selector de foco 3px | [`src/styles/tokens.css`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/src/styles/tokens.css), [`theme.css`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/src/styles/theme.css) |

## Pasos ejecutados
1. Definición de dependencias y scripts en [`package.json`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/package.json).
2. Creación de `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` y `eslint.config.js`.
3. Estructuración del árbol de directorios canónico en `src/` y `content/`.
4. Creación del cascarón accesible en [`src/App.tsx`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Nubi/src/App.tsx) y estilos semánticos.
5. Validación completa de scripts de calidad (`typecheck`, `test`, `build`, `lint`).

## Cierre
- Todos los criterios de aceptación verificados y pasando en verde.
- Base lista para abordar T-02 (Esquemas Zod) y T-03 (Servicios núcleo).
