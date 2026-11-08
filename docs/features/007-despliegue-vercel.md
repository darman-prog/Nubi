---
id: 007
status: en-curso
area: infraestructura
tarea: -
created: 2026-11-08
updated: 2026-11-08
---
# Feature 007 — Despliegue en Vercel (staging)

> SPA estática en Vercel con rewrites, gate de calidad, cabeceras básicas y noindex hasta que el contenido pase revisión.
## Objetivo
Publicar una URL de revisión estable de Nubi sin backend, con build reproducible y rollback inmediato.
## Contexto
La app usa `BrowserRouter` (`src/app/App.tsx:11`) y rutas profundas (`src/app/routes.tsx:18-38`), así que el hosting debe reescribir a `index.html`. Todo el contenido está en `draft` (`content/evidence/evidence.json`) y RF-23 prohíbe un build `prod` con draft. PWA, Playwright y Lighthouse siguen pendientes.
## Alcance
| Incluye | Excluye |
|---|---|
| `vercel.json`, Node 22, sourcemaps off, rewrites y cabeceras básicas | CSP (T-15), PWA/offline (RNF-05), Lighthouse/Playwright |
| Gate `npm run check && npm run build` en Vercel | Backend, Functions, Analytics, Image Optimization |
| ADR, guía, spec, backlog y corrección de docs | Dominio propio y promoción a producción |
## Criterios de aceptación
| N.º | Criterio verificable | Comando | Evidencia |
|---|---|---|---|
| 1 | `check` y `build` verdes | `npm run check` y `npm run build` | Bitácora |
| 2 | `vercel.json` con `dist`, rewrite SPA y cabeceras | `node -e "const c=require('./vercel.json'); if(c.outputDirectory!=='dist'||!c.rewrites?.some(r=>r.destination==='/index.html')) process.exit(1)"` | Exit 0 |
| 3 | HTML sin scripts/estilos inline y sin `.map` | `node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); if(/<style|<script(?![^>]*src=)/.test(h)) process.exit(1)"` y `Get-ChildItem -Recurse dist -Filter *.map` | Vacío |
| 4 | Preview READY y rutas profundas 200 HTML | `curl.exe -I https://<preview>/mapa` | 200 |
| 5 | Cabeceras básicas y `noindex` | `curl.exe -I https://<preview>/` | Cabeceras |
| 6 | Assets con caché inmutable | `curl.exe -I https://<preview>/assets/<hash>.js` | `max-age=31536000, immutable` |
| 7 | Docs y backlog | `Test-Path docs/adr/017-hosting-vercel.md`; `Select-String docs/features/BACKLOG.md -Pattern '007'` | Existen |
## Runner
| Campo | Valor |
|---|---|
| estado | en-curso |
| dueño | usuario |
| paso | 3/5 |
| siguiente | conectar repo en Vercel y verificar preview |
| bloqueado_por | - |
| ultimo_handoff | H-001 |
## Handoff
H-001: build → usuario (2026-11-08), conectar repo y desplegar; ver `docs/guias/despliegue-vercel.md`.
## Pasos
1. Fijar Node 22 y desactivar sourcemaps.
2. Crear `vercel.json` y añadir `.vercel/` a `.gitignore`.
3. Documentar ADR, guía, spec, backlog y corregir 006/AGENTS.
4. Desplegar preview en Vercel (manual del usuario) y verificar.
5. Cerrar la feature tras la verificación.
## Bitácora
| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| 1 | 2026-11-08 | `npm run check` y `npm run build` | 0 | `3b11600` |
| 2 | 2026-11-08 | `node -e` sobre `vercel.json` | 0 | `673bceb` |
| 3 | 2026-11-08 | `node -e` sobre `dist/index.html` y `Get-ChildItem` | 0 | `3b11600` |
## Rollback
`git revert` de los commits de configuración; en Vercel, Promote to Production del deployment anterior. Sin migraciones ni datos que revertir.
## Cierre
- Fila resumen en `docs/features/BACKLOG.md`; decisión de arquitectura: `ADR 017`.
