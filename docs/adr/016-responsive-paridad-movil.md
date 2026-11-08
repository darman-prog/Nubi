# ADR 016: Responsive de paridad móvil, Diario y hoja modal

**Fecha:** 2026-11-08 · **Estado:** Confirmada · **Actualiza:** ADR-015 (rutas, navegación y paneles)

## Contexto

Los mockups del flujo están pensados para 390×844. El producto se revisará desde un computador, pero no puede convertirse en otro producto: el escritorio debe conservar la misma composición, el mismo orden y las mismas interacciones que el celular. El plan anterior de ADR-015 proponía riel lateral, panel no modal y portada partida; eso reformulaba el `flujo-arte` y además contradecía el foco atrapado.

El Diario también se había quedado fuera de la v0.1 sin una decisión registrada, aunque el PRD (RF-11), el doc 03 y el doc 04 lo incluyen. El riesgo R-03 del PRD es precisamente que no se use.

## Decisión

### Paridad de composición

- Una sola columna centrada: **480 px** en móvil, **560 px** en tablet, **640 px** en desktop.
- El desktop solo cambia el ancho de la columna y el fondo; no añade riel, panel lateral, portada partida, dos columnas ni “modo juego”.
- La barra inferior de **4 destinos** (Mapa · Pasaporte · Diario · Ayuda) es la misma en móvil y desktop.
- La isla, el pasaporte y la niebla son **hojas modales en ambos**: `dialog`, `aria-modal`, foco atrapado, `Esc`, mapa inerte y foco de vuelta al disparador.
- DOM: `nav → main → dialog`. La barra va antes del contenido; la hoja, después. El skip link salta al main.
- La cadena usa el ancho de la hoja (640 en desktop, 100 % en móvil). Si cabe en dos columnas, las usa; no hay un estado exclusivo de escritorio.

### Rutas

- `/isla/:slug/:etapa` (`llegada`, `historia`, `retos`, `sello`) es la fuente de verdad.
- `/isla/:slug` redirige a la primera etapa o abre la niebla si la isla es `coming_soon`.
- Cerrar navega a `/mapa`; el botón atrás conserva el historial; redimensionar u orientar no pierde la etapa.
- `/diario` es una página de una columna, no una hoja.

### Diario v0.1

- Formulario de ≤ 30 s: acostarse, levantarse, ánimo 1–5 y pantallas en la cama.
- Una entrada por día; se edita la de hoy; omitir un día no penaliza.
- Últimas 7 noches con horas y ánimo; sin interpretación, sin puntajes y sin colores de alarma.
- Sin texto libre, sin backend, sin analíticas; exportar/importar y borrar todo ya lo cubren.
- Lectura semanal y sellos de Diario: v0.2.
- Dominio: `sleepMinutes`, `isPlausible`, `upsertDiaryEntry`; pruebas unitarias.

### Breakpoints y casos límite

| Ancho | Columna | Hoja |
|---|---|---|
| 320–767 | 100 %, máx. 480 | Inferior; 100dvh si la altura es corta |
| 768–1023 | 560 | Inferior, máx. 560 |
| ≥1024 | 640 | Inferior, máx. 640, centrada |
| 844×390 | 560 | 100dvh; barra oculta/inertizada mientras está abierta |

- 320 px es el ancho de reflujo WCAG al 400 %; el logo de portada usa `min(340px, 100%)`.
- `(orientation: landscape) and (max-height: 560px)` evita que la hoja de 90dvh más la barra de 64 deje sin espacio.
- Texto al 150 %: la columna sigue siendo una sola; no hay columnas que colapsar.

## Consecuencias

- **Positivas:** el flujo es idéntico en ambos; menos código y menos estados; el Diario cierra el ciclo del producto; la hoja modal tiene un contrato único de foco.
- **Negativas:** el desktop no aprovecha todo el ancho para un layout nativo; el Diario añade una talla M; la hoja bloquea el mapa también en desktop.
- **Mitigación:** una columna de 640 con fondo de cielo y aire alrededor; el Diario se limita a v0.1; la cadena usa el ancho de la hoja sin un modo extra.

## Alternativas descartadas

- **Riel + panel lateral no modal:** cambia la interacción y el `flujo-arte`; el mapa activo exige otro contrato de foco.
- **Portada split y Diario/Ayuda en dos columnas:** añade composiciones que el celular no tiene.
- **Mantener 3 destinos y cortar el Diario:** contradice el PRD, el doc 03 y el riesgo R-03; exigiría actualizar 01/03/04.
- **Etapa como estado interno de la isla:** rompe enlaces directos, atrás y cambio de tamaño.
