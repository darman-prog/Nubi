# ADR 017: Hosting estático en Vercel (staging)

**Fecha:** 2026-11-08 · **Estado:** Confirmada

## Contexto

Nubi es una SPA React/Vite sin backend, con `BrowserRouter`, contenido JSON empaquetado y estado en `localStorage`. El doc 05 §7 exige reescribir todas las rutas a `index.html`; §11 define `main` → staging. Todo el contenido está en `draft` y RF-23 prohíbe un build `prod` con draft. PWA, Playwright y Lighthouse siguen pendientes.

## Decisión

- Vercel como hosting estático: framework Vite, `dist`, `vercel.json` versionado.
- `installCommand: npm ci`; `buildCommand: npm run check && npm run build`; Node 22.x.
- `rewrites` de todas las rutas a `/index.html`; sin `api/`, Functions, Analytics ni Image Optimization.
- Cabeceras básicas: `X-Content-Type-Options`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, `X-Frame-Options: DENY`, HSTS y `X-Robots-Tag: noindex` mientras sea staging.
- `CONTENT_GATE=dev` en Vercel hasta que el contenido pase a `source_verified`/`professional_reviewed`; CSP y Lighthouse quedan para T-15.
- Sourcemaps desactivados en producción.
- `CONTENT_GATE` es de build y no se expone al cliente; no hay secretos.

## Consecuencias

- Positivas: CDN, TLS y previews sin backend; configuración versionada; rollback inmediato; salida estática portable.
- Negativas: dependencia de Vercel; sin CSP todavía; sin PWA/offline; el entorno "Production" de Vercel se usa como staging hasta la compuerta de contenido.
- Mitigaciones: `vercel.json` portable; promoción documentada; `noindex` y Deployment Protection si el plan lo permite; CSP en T-15.

## Alternativas descartadas

- Netlify o Cloudflare Pages: viables, pero Vercel es el destino pedido y su preview basta.
- GitHub Pages: sin rewrites, cabeceras ni previews por rama con la misma comodidad.
- Servidor propio: coste operativo innecesario para una SPA estática.
