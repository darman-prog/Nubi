# Despliegue en Vercel (staging)

Para qué: conectar el repo y publicar una URL de revisión de Nubi sin backend.
Cuándo leer: antes de importar el proyecto, cambiar variables o promover a producción.

## Requisitos

- Repo GitHub `darman-prog/Nubi` y cuenta de Vercel.
- `npm run check` y `npm run build` en verde en local.
- Node 22 local o el que fije Vercel; `package.json` declara `engines.node: 22.x`.

## Importar el proyecto

1. Vercel → Add New → Project → importar `darman-prog/Nubi`.
2. Framework Preset: **Vite**. Root Directory: `./`. Build y Output salen de `vercel.json`.
3. Environment Variables: `CONTENT_GATE=dev` en Production, Preview y Development.
   No crees variables `VITE_*` ni secretos: la app no los usa.
4. Deploy. La build ejecuta `npm ci` y `npm run check && npm run build`.
5. Si el plan lo permite, activa Deployment Protection para previews.

El entorno "Production" de Vercel apunta a `main`, pero se usa como **staging** mientras el contenido esté en `draft`.

## Verificar

- `curl.exe -I https://<url>/` → 200, `content-type: text/html`, `x-robots-tag: noindex`.
- Cabeceras: `x-content-type-options: nosniff`, `referrer-policy: no-referrer`, `permissions-policy`, `x-frame-options: DENY`, `strict-transport-security`.
- `curl.exe -I https://<url>/mapa`, `/isla/reloj/retos` y `/diario` → 200 HTML (rewrites SPA).
- `curl.exe -I https://<url>/assets/<hash>.js` → `cache-control: public, max-age=31536000, immutable`.
- En navegador: tema, `localStorage`, exportar/importar y navegación profunda.
- No hay `.map` en `dist`; si pides una URL `.map`, el rewrite SPA puede devolver HTML, pero nunca un mapa.

## Staging y promoción

- Mientras `content/evidence/evidence.json` tenga `status: draft`, no pongas `CONTENT_GATE=prod`: el build falla por RF-23.
- Para promover: contenido en `source_verified` o `professional_reviewed`, cambiar `CONTENT_GATE=prod`, quitar `X-Robots-Tag: noindex` de `vercel.json`, ejecutar `npm run check`, desplegar y configurar el dominio.
- La promoción a producción y los tags `pilot-*`/`v*` del doc 05 §11 quedan pendientes.

## Rollback

- Vercel → Deployments → deployment anterior → Promote to Production / Instant Rollback.
- `git revert` del commit de configuración. No hay migraciones ni datos que revertir; `localStorage` no se toca.

## Límites conocidos

- Sin PWA/offline (RNF-05), sin Lighthouse/Playwright y sin CSP (T-15).
- Sin analíticas de terceros ni Vercel Analytics (RNF-04).
- `localStorage` es por origen: los datos de `localhost:3000` no aparecen en la URL de Vercel; usa exportar/importar.
- Vercel puede registrar IPs en sus logs; revisa el aviso de privacidad y el consentimiento del piloto con menores.
- No se usa `vercel dev`; para desarrollo local basta `npm run dev`.

## Problemas frecuentes

- **Build falla por contenido:** revisa `CONTENT_GATE`; con `prod` y fichas `draft` falla a propósito.
- **Ruta profunda da 404:** revisa `rewrites` en `vercel.json`.
- **Assets no cargan:** revisa `outputDirectory: dist` y que el build haya generado `dist/assets`.
- **Aparecen sourcemaps:** revisa `sourcemap: false` en `vite.config.ts` y vuelve a desplegar.
- **No aparecen las cabeceras:** confirma que `vercel.json` está en la raíz y que el deployment es el nuevo.
