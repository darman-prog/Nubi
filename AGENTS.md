# AGENTS.md — Nubi y el Archipiélago del Sueño

Plantilla y configuración de agentes para el proyecto Nubi.

## Stack
- **Frontend:** React + Vite + TypeScript estricto (SPA estática sin backend; PWA pendiente).
- **Validación de contenido:** Zod (`content/schema/`).
- **Estilos:** Tokens CSS nativos (`src/styles/`), SVG inline, temas claro (Amanecer) y oscuro (Noche).
- **Persistencia:** `localStorage` local detrás de `StorageService` versionado (`nubi:v1`), exportar/importar JSON. Sin backend ni cookies.
- **Testing:** Vitest (unitarias/dominio), Testing Library (componentes) y ESLint con `jsx-a11y`; Playwright, axe-core y Lighthouse pendientes.

## Comandos
- `npm run dev` (iniciar servidor de desarrollo Vite)
- `npm run build` (compilación de producción)
- `npm run test` (pruebas unitarias con Vitest)
- `npm run check` (fronteras, tipos, lint y tests)
- `npm run validate:content` (validador de esquemas de contenido)
- `npm run lint` / `npm run typecheck` (análisis estático y chequeo de tipos)

## Despliegue
- Vercel (staging) con `vercel.json`; ver `docs/guias/despliegue-vercel.md`.

## Estructura clave
- `docs/`: Paquete documental canónico (`00-README`, `01-PRD`, `02-contenido`, `03-juego`, `04-ux`, `05-arquitectura`, `adr/`).
- `content/`: Fuente de verdad de datos (JSON validados con Zod: evidencia, islas, grafo, diálogos). Los componentes nunca contienen textos de salud o contenido.
- `src/domain/`: Lógica de negocio pura en TypeScript sin dependencias de UI ni DOM.
- `src/features/`: Módulos de la SPA (mapa, islas, armador de cadenas, diario, pasaporte, ajustes).
- `src/shared/ui/`: Biblioteca visual accesible (WCAG 2.2 AA).
