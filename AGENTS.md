# AGENTS.md — Nubi y el Archipiélago del Sueño

Plantilla y configuración de agentes para el proyecto Nubi.

## Stack
- **Frontend:** React + Vite + TypeScript estricto (SPA estática sin backend, PWA con `vite-plugin-pwa`).
- **Validación de contenido:** Zod (`content/schema/`).
- **Estilos:** Tokens CSS nativos (`src/styles/`), SVG inline, temas claro (Amanecer) y oscuro (Noche).
- **Persistencia:** `localStorage` local detrás de `StorageService` versionado (`nubi:v1`), exportar/importar JSON. Sin backend ni cookies.
- **Testing:** Vitest (unitarias/dominio), Testing Library (componentes), Playwright (E2E), axe-core (a11y), Lighthouse CI.

## Comandos
- `npm run dev` (iniciar servidor de desarrollo Vite)
- `npm run build` (compilación de producción)
- `npm run test` (pruebas unitarias con Vitest)
- `npm run test:e2e` (pruebas E2E con Playwright)
- `npm run validate:content` (validador de esquemas de contenido)
- `npm run lint` / `npm run typecheck` (análisis estático y chequeo de tipos)

## Estructura clave
- `docs/`: Paquete documental canónico (`00-README`, `01-PRD`, `02-contenido`, `03-juego`, `04-ux`, `05-arquitectura`, `adr/`).
- `content/`: Fuente de verdad de datos (JSON validados con Zod: evidencia, islas, grafo, diálogos). Los componentes nunca contienen textos de salud o contenido.
- `src/domain/`: Lógica de negocio pura en TypeScript sin dependencias de UI ni DOM.
- `src/features/`: Módulos de la SPA (mapa, islas, armador de cadenas, diario, pasaporte, ajustes).
- `src/shared/ui/`: Biblioteca visual accesible (WCAG 2.2 AA).
