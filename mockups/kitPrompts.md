# Kit de prompts — Nubi y el Archipiélago del Sueño

*Prompts para generar todo el arte del proyecto con Google Gemini "Nano Banana" (modelo `gemini-nano-banana-2.1`) y entregarlo en WebP HD. Para qué sirve: producir las ~60 piezas del flujo v0.1 (D-16) con estilo, personaje y paleta consistentes. Cuándo leerlo: al generar arte en el paso "Arte WebP HD" del plan.*

**Alineado al flujo v0.1 y ADR-018:** pantallas de referencia en `mockups/stitch/flujo-arte/` (01 portada → 10 coronación). El arte de contenido son **28 ilustraciones de escena** (la historia narrada por Nubi con una pieza dedicada por momento: 3 en Isla Nido y 5 en cada una de las 5 islas jugables), más miniaturas, sellos, Nubi y piezas de portada/coronación. Las islas sin evidencia (Pantalla, Energía, Tormenta, Ambiente, Cuerpo, Luna, Riesgo, Monstruos, Mirador) **no llevan arte**: en el mapa son siluetas de niebla genéricas (PRD D-06 / R-02).

---

## 1. Reglas de uso (aplican a todo el kit)

- **Modelo**: `gemini-nano-banana-2.1` (API de Gemini o AI Studio). Resolución **1K**; la salida final se entrega en **WebP HD** (800/1280 px) con el pipeline de la §9.
- **Referencias obligatorias**:
  - Toda escena → adjuntar el **ancla de estilo** (`arte/ancla-estilo.png`).
  - Si Nubi aparece → adjuntar **`arte/nubi-base.png`**.
- **Texto dentro de las imágenes: nunca**. Las escenas narran visualmente; las frases, cifras, niveles de evidencia y fuentes los pinta la interfaz (doc 02 §1 y doc 04).
- **La historia manda**: cada escena ilustra la escena de `docs/ListadoDocumentos/02-contenido-y-evidencia.md` correspondiente. No inventar afirmaciones de salud en el arte; la alegoría puede ser libre, el mensaje no.
- **Tono**: 13-17, tierno sin ser infantil, calma, "cuento onírico" (04 §1). Nada aterrador; nada de colores de alarma.
- **Prohibido**: personas reales, personajes con derechos de terceros, imaginería sugestiva, rojo de alarma, texto incrustado.
- **Privacidad**: no subir fotos ni datos personales.
- **Descartes**: espera ~1 de cada 3 generaciones; elige por tandas.

## 2. Inventario y nombres

| Grupo                                       | Cantidad     | Proporción | Fondo                                    | Archivo final (WebP)                                       |
| ------------------------------------------- | ------------ | ----------- | ---------------------------------------- | --------------------------------------------------------- |
| Escenas de historia (Nido 3 + 5 islas × 5) | **28** | 16:9 | **integrado** (cielo de la escena) | `arte/escenas/<isla>-<n>.webp` |
| Miniaturas de isla (mapa)                   | 6            | 1:1         | **alpha** (recorte)                | `arte/islas/<slug>.webp`                                 |
| Sello por isla                              | 6            | 1:1         | **alpha** (recorte)                | `arte/sellos/sello-<slug>.webp`                          |
| Nubi: expresiones                           | 9 (incluye base y narrando) | 1:1         | **alpha** (recorte)                | `arte/nubi/nubi-<expresion>.webp`                        |
| Nubi: accesorios                            | 3            | 1:1         | **alpha** (recorte)                | `arte/nubi/acc-<nombre>.webp`                            |
| Portada (hero) y coronación                | 2            | 4:5         | integrado                                | `arte/hero-portada.webp`, `arte/coronacion.webp`        |
| PWA + Open Graph                            | 4            | 1:1 / 16:9  | integrado (maskable obligatorio)         | `public/pwa-192.png`, `512`, `maskable`, `og.png` |

**Regla de fondo:** las piezas que se montan sobre tarjetas, sellos o mapa (Nubi, accesorios, sellos y miniaturas de isla) van con **alpha**; las que son una atmósfera completa (28 escenas, hero, coronación, PWA/OG) van con **fondo integrado** — si no, flotan sobre el layout y hay que reconstruir el ambiente en CSS. Nano Banana **no produce transparencia fiable**: para las piezas con alpha se genera sobre **fondo blanco liso**, se recorta con `scripts/process_art_hd.py` (flood-fill + defringe) y se comprime con `scripts/optimize_webp.py`.

Los 28 nombres: `nido-1…3`, `reloj-1…5`, `horarios-1…5`, `animo-1…5`, `cerebro-1…5`, `taller-1…5`.

---

## 3. P0 — Ancla de estilo

Primero e iterar; la elegida se guarda como `arte/ancla-estilo.png` y se adjunta a todo.

```
Ilustración vectorial plana de una isla flotante de fantasía sobre un mar de
nubes, al amanecer. Paleta pastel: lavanda, rosa suave, azul cielo, acento
amarillo luna. Trazo grueso redondeado, sin degradados complejos, texturas
mínimas. Estilo cuento infantil moderno para preadolescentes, tierno pero no
bebé, sensación de calma. Composición centrada, proporción 16:9. Sin texto,
sin personas, sin marcas.
```

## 4. P1 — Nubi

**Base** (adjuntar ancla; la ganadora = `arte/nubi-base.png`):

```
El personaje mascota "Nubi": una nube pequeña y redondeada, blanco-lavanda,
cara sencilla con dos ojos grandes y boca pequeña, dos "manitas" de nube,
mismo estilo de la imagen de referencia. Fondo liso blanco. Proporción 1:1.
Sin texto.
```

**Expresiones** (adjuntar `nubi-base.png`; prefijo `Mismo personaje de las imágenes de referencia, con la expresión [X]. Fondo liso blanco, 1:1, sin texto.`):

| # | [X]                                                      |
| - | -------------------------------------------------------- |
| 1 | *neutral — sonrisa pequeña serena, parpadeo simple*  |
| 2 | *feliz — sonrisa amplia, ojos brillantes*             |
| 3 | *curiosa — cabeza inclinada, ceja levantada*          |
| 4 | *pensando — puntos de pensamiento sobre la cabeza*    |
| 5 | *celebrando — manitas arriba, estrellas alrededor*    |
| 6 | *soñolienta — ojos entrecerrados, ladeada*           |
| 7 | *apoyando — ojos suaves, inclinación hacia adelante* |

**Accesorios** (1:1, fondo blanco; se componen en el SVG): *gorro de dormir de nube con borla*, *bufanda de estrellas*, *lentes de luna*.

**Nubi "narrando"** (para la cabecera de la historia): mismo personaje, medio cuerpo, expresión curiosa, fondo transparente/simple. Guardar como `nubi-narrando`.

## 5. P2 — Miniaturas de isla (mapa)

Adjuntar ancla; 1:1; una idea visual central. Motivos del doc 04 §10:

| Isla                    | Prompt (SUBJETO)                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Nido (`nido`)         | *nido de nubes con un huevo-luna descansando dentro, luz de amanecer rosada*                 |
| Reloj (`reloj`)       | *torre-reloj con cara de luna encendida y cara de sol dormida detrás*                       |
| Horarios (`horarios`) | *campana del cielo con cordel de estrella y calendario de nubes, páginas simples sin texto* |
| Ánimo (`animo`)      | *isla con rostros de nubes y un arcoíris suave; una cara con gotitas, otra sonriente*       |
| Cerebro (`cerebro`)   | *isla del cerebro con engranajes en calma y libros flotando, luz tenue cálida*              |
| Taller (`taller`)     | *banco de trabajo de nubes con herramientas suaves y chispas de estrella*                    |

**Niebla genérica** (una sola, para las 9 pendientes): *silueta de isla tapada por niebla clara, contorno redondeado, sin detalle interior*.

## 6. P3 — Escenas de la historia (28 escenas completas · ADR-018)

> Regla de cobertura completa: Se levanta el recorte previo de 11 escenas. Cada momento de la historia cuenta con su propia ilustración narrativa (3 en Isla Nido + 5 en cada una de las 5 islas jugables). Las 11 escenas ya producidas se conservan y se habilitan los 17 prompts restantes para completar el archipiélago.

**Plantilla** (adjuntar ancla; si aparece Nubi, adjuntar `nubi-base`; proporción 16:9; sin texto):

```
Ilustración de cuento onírico: [SITUACIÓN]. Composición clara con una sola
idea central, mucho aire, formas suaves redondeadas, paleta lavanda/rosa
suave/azul cielo con acento amarillo luna. Mismo estilo que la imagen de
referencia. Sin texto, sin números, sin personas reales.
```

**Regla de las 3 capas**: cada isla repite el arco *síntoma → causa → efecto/cierre*. La escena 1 engancha con una situación reconocible; las intermedias explican el mecanismo; la última cierra con honestidad (lo que se sabe y lo que no).

### Isla Nido — 3 escenas (bienvenida, sin afirmaciones de salud)

| # | Acto    | [SITUACIÓN]                                                                                                 |
| - | ------- | ------------------------------------------------------------------------------------------------------------ |
| 1 | llegada (producida) | *nido gigante y acogedor sobre la nube más alta, con Nubi asomada y un pasaporte de viaje abierto*        |
| 2 | viaje   | *archipiélago visto desde el nido: 6 islas encendidas y el resto en niebla suave, ruta de nubes punteada* |
| 3 | promesa | *Nubi entregando un sello dorado en forma de nube a un pasaporte abierto*                                  |

### Isla Reloj — 5 escenas

| # | Acto         | [SITUACIÓN]                                                                                                                |
| - | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 1 | síntoma (producida) | *habitación-nube a medianoche: ojos abiertos bajo la manta, luna alta, dos relojes pequeños discutiendo en la almohada* |
| 2 | causa (producida) | *reloj de arena-pubertad que se inclina y su arena cae hacia la noche, con estrellas desplazándose*                      |
| 3 | necesidad    | *cama-nube con colcha de estrellas donde brillan entre 8 y 10 estrellitas alineadas*                                      |
| 4 | sin culpa    | *nube pequeña descansando con dignidad en su almohada, mirada tranquila, sin señal de regaño*                          |
| 5 | dato honesto | *archipiélago de cuartos-nube vistos de lejos: 7 con ojeras suaves y 3 descansados, sin cifras ni texto*                 |

### Isla Horarios — 5 escenas

| # | Acto             | [SITUACIÓN]                                                                                                                             |
| - | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | síntoma (producida) | *campana escolar al amanecer sonando sobre una cama que aún duerme*                                                                   |
| 2 | causa (producida) | *dos relojes gemelos en extremos de la isla: uno madrugador con maletín, otro fiestero con gafas de sol, unidos por una cuerda floja* |
| 3 | recomendación   | *campana del cielo inclinada hacia la mañana, con un sol que sale más tarde, sin texto*                                              |
| 4 | no depende de ti | *tres nubes reunidas conversando alrededor de una mesa de nube (familia, colegio, orientación), gesto amable*                         |
| 5 | puente           | *puente de nubes que une la isla Horarios con la isla Ánimo, con una chispa de conexión en el centro*                                |

### Isla Ánimo — 5 escenas

| # | Acto           | [SITUACIÓN]                                                                                            |
| - | -------------- | ------------------------------------------------------------------------------------------------------- |
| 1 | síntoma (producida) | *fila de nubes adolescentes con caritas tensas y cansadas, sin números ni gráficos*                 |
| 2 | lo notan (producida) | *nube joven con mejillas infladas y una nube adulta mirando con ternura, gesto de "te noto distinto"* |
| 3 | no es tristeza | *nube con una tormenta mínima sobre la cabeza y un arcoíris tenue detrás, emoción ambigua*        |
| 4 | freno          | *freno hecho de niebla deteniendo con suavidad a un rayito travieso*                                  |
| 5 | ganas          | *nube frente a un arco de estrellas que se cruza en el cielo, mirada curiosa y expectante*            |

### Isla Cerebro — 5 escenas

| # | Acto            | [SITUACIÓN]                                                                                                       |
| - | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1 | marco (producida) | *biblioteca-torre dentro de una cabeza-isla: libros que se guardan solos durante la noche*                       |
| 2 | una noche corta (producida) | *luna con un reloj pequeño de 4 horas junto a una lista de palabras convertida en estrellitas, apenas alterada* |
| 3 | varias noches   | *estantería de nubes que se desordena poco a poco, libros que se caen de su sitio*                              |
| 4 | cuatro noches   | *libro intacto después de cuatro lunas alineadas, atmosfera neutra*                                             |
| 5 | no coinciden    | *dos bibliotecarios-nube comparando libros distintos abiertos, gesto de "depende de lo que mides"*               |

### Isla Taller — 5 escenas

| # | Acto            | [SITUACIÓN]                                                                                                |
| - | --------------- | ----------------------------------------------------------------------------------------------------------- |
| 1 | propuesta (producida) | *banco de trabajo de nubes con 3 experimentos sencillos alineados (no una receta), pictogramas sin texto* |
| 2 | hora estable (producida) | *despertador-sol que suena igual en día de colegio y en fin de semana, dos escenas pequeñas*            |
| 3 | luz natural     | *ventana de nube con un rayo de sol de mañana entrando sobre una cara tranquila*                         |
| 4 | pantallas lejos | *cama-nube con el celular descansando al otro lado de la habitación, distancia clara*                    |
| 5 | respiración    | *Nubi inflándose y desinflándose despacio, con ondas suaves alrededor (sin texto)*                      |

> Cada escena lleva, además, un **alt** de 1 frase para implementación (ej.: "Nubi inflándose despacio dentro de una nube"), que se escribe en `/content`, no en el arte.

## 7. P4 — Sellos (6)

Plantilla (adjuntar ancla; 1:1; sin texto):

```
Sello circular dorado estilo pasaporte de viaje, anillo punteado, brillo
suave, con [ÍCONO] en el centro. Paleta dorada cálida (#D89A2B, #F3DCA6)
sobre fondo transparente. Mismo estilo que la referencia. Sin texto.
```

Íconos: Nido = huevo-luna · Reloj = reloj de sol/luna · Horarios = campana · Ánimo = cara suave · Cerebro = engranaje con libro · Taller = llave/herramienta.

## 8. P5 — Portada, coronación y PWA

- **Hero portada** (4:5, adjuntar ancla + `nubi-base`): *Nubi grande flotando frente al archipiélago al amanecer, islas en niebla al fondo, espacio libre arriba para el título (el texto lo pone la interfaz)*.
- **Coronación** (4:5): *Nubi con gorro de dormir y bufanda de estrellas, rodeado de 6 sellos flotantes y un arcoíris suave; celebración serena, sin fuegos artificiales*.
- **PWA/OG**: salen de `nubi-base` y del hero; exportar 192/512/maskable (1:1) y OG 1200×630 (16:9). Se exportan en PNG porque WebP no cubre bien maskable ni Open Graph en todos los destinos; el resto del arte va en WebP (ADR-014).

## 9. Post-proceso: de Nano Banana a WebP HD

1. Elegir por tanda (1 de cada 2-3).
2. Recortar con `scripts/process_art_hd.py` (flood-fill exterior + defringe; conserva brillos internos).
3. Optimizar con `scripts/optimize_webp.py` a 800 px (escenas/miniaturas) o 1280 px (hero/coronación), apuntando a ≤ 90 KB y ≤ 180 KB.
4. Nombrar según §2 y registrar en `licenses/`.
5. Los originales quedan en `arte/generados/` y no se distribuyen.

## 10. Presupuesto y estado

- Generación: 28 escenas + 6 miniaturas + 6 sellos + 12 Nubi + hero + coronación + descartes ≈ **65-80 imágenes ≈ $3-4** por API a 1K (gratis en la app con límites).
- El costo de vectorización desaparece: el post-proceso es local con `scripts/process_art_hd.py` y `scripts/optimize_webp.py`.
- Estado: pendiente aprobar `ancla-estilo.png` y `nubi-base.png`; después generar por islas (una isla por tanda para mantener consistencia).

## 11. Notas

- `kitPrompts.md` responde a **Q-04** (imágenes: Nano Banana + vectorizado) y alimenta doc 04 §10. Las islas sin evidencia siguen bloqueadas (doc 02 §1.7 y §8).
- Fuente de precios (oct-2026): [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).
- Si cambias una escena del doc 02, cambia su prompt aquí en el mismo commit (la historia y el arte no se separan).
