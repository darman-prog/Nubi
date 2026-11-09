# 04 · Diseño visual y UX

**Versión:** 0.1 (borrador) · **Fecha:** 2026-11-05 · **Depende de:** `01-PRD.md`, `03-diseno-de-juego.md`

---

## 1. Dirección visual

**Concepto:** un cielo que va del **amanecer** (tema claro) a la **noche** (tema oscuro), con islas flotantes sobre nubes suaves. Redondeado, cálido y tranquilo: el producto trata de dormir, así que **no debe sobreestimular**.

**Principios**

1. **Calma.** Formas redondeadas, movimiento lento, pocos elementos por pantalla.
2. **Claridad antes que decoración.** Una idea por tarjeta; mucho espacio en blanco.
3. **Evidencia visible.** El nivel de evidencia es un elemento de primera clase, no una nota al pie.
4. **Sin alarma.** Nada de rojo, signos de exclamación ni símbolos de peligro para hablar de horas de sueño.
5. **Mobile-first.** Diseñado para una mano y un pulgar.
6. **Nada depende solo del color.** Todo estado usa ícono + texto.

---

## 2. Nubi (personaje)

**Forma:** nube redondeada, blanca-lavanda, con dos ojos grandes y una boca pequeña. Dos "manitas" de nube. Sin extremidades detalladas. Cabe en 48 px y se reconoce.

**Expresiones (SVG por estado):** `neutral`, `feliz`, `curiosa` (inclina la cabeza), `pensando` (puntos sobre la cabeza), `celebrando`, `soñolienta` (ojos entrecerrados, gorro opcional), `apoyando` (ojos suaves, inclinación hacia el usuario).

**Voz:** tuteo, frases cortas, humor suave, curiosidad. Ejemplos:

| Situación         | Sí                                                                      | No                                                            |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Bienvenida         | "¡Hola! Soy Nubi. Me encanta entender por qué dormimos como dormimos." | "Bienvenido a la plataforma educativa de higiene del sueño." |
| Error en cadena    | "Mmm, estos dos no se conectan así. ¿Qué podría ir en medio?"        | "Incorrecto."                                                 |
| Reto no cumplido   | "Gracias por contarme. Con eso también aprendemos."                     | "No cumpliste tu objetivo."                                   |
| Noche tarde (v0.2) | "Se hizo tarde en el cielo. Esto sigue mañana, ¿vale?"                 | "Deberías estar durmiendo."                                  |
| Ayuda              | "No tienes que resolver esto solo."                                      | "Consulta a un especialista inmediatamente."                  |

**Accesorios cosméticos:** gorro de dormir, bufanda de estrellas, lentes de luna, etc. (ver `03` §4).

---

## 3. Sistema visual

### 3.1 Color (contraste verificado)

Los pares siguientes se calcularon con la fórmula de contraste de WCAG. **Texto normal requiere ≥ 4,5:1**; los pares usados cumplen con holgura.

#### Tema claro ("Amanecer")

| Token            | Hex         | Uso                                    | Contraste                                                                         |
| ---------------- | ----------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `--bg`         | `#F7F5FF` | Fondo                                  | —                                                                                |
| `--surface`    | `#FFFFFF` | Tarjetas                               | —                                                                                |
| `--text`       | `#1E1B3A` | Texto principal                        | 15,29 sobre `--bg` · 16,50 sobre `--surface`                                 |
| `--text-muted` | `#4B4777` | Texto secundario                       | 7,89 · 8,51                                                                      |
| `--primary`    | `#5043C9` | Botones, enlaces, foco                 | texto `#FFFFFF` sobre `--primary`: 7,03 · `--primary` sobre `--bg`: 6,51 |
| `--accent`     | `#FFC15A` | Sol, destacados, sellos                | texto `#1E1B3A` sobre `--accent`: 10,23                                       |
| `--ev-3`       | `#0F6B4B` | Evidencia: Bien establecido            | 6,03 sobre `--bg` · 6,51 sobre `--surface`                                   |
| `--ev-2`       | `#1B5FA8` | Evidencia: Probable                    | 5,99 · 6,46                                                                      |
| `--ev-1`       | `#7A3FA0` | Evidencia: Aún se investiga           | 6,39 · 6,89                                                                      |
| `--error`      | `#B3261E` | Errores técnicos (no horas de sueño) | 6,06 · 6,54                                                                      |

#### Tema oscuro ("Noche")

| Token            | Hex         | Uso                          | Contraste                                                                         |
| ---------------- | ----------- | ---------------------------- | --------------------------------------------------------------------------------- |
| `--bg`         | `#121029` | Fondo                        | —                                                                                |
| `--surface`    | `#1C1A40` | Tarjetas                     | —                                                                                |
| `--text`       | `#EEEBFF` | Texto principal              | 15,87 sobre `--bg` · 14,13 sobre `--surface`                                 |
| `--text-muted` | `#BDB8EA` | Texto secundario             | 9,90 · 8,82                                                                      |
| `--primary`    | `#A99BFF` | Botones, enlaces, foco       | texto `#121029` sobre `--primary`: 7,79 · `--primary` sobre `--bg`: 7,79 |
| `--accent`     | `#FFD47A` | Luna, destacados, sellos     | texto `#121029` sobre `--accent`: 13,21                                       |
| `--ev-3`       | `#6FDDB0` | Evidencia: Bien establecido  | 11,17 · 9,95                                                                     |
| `--ev-2`       | `#8CC4FF` | Evidencia: Probable          | 10,12 · 9,01                                                                     |
| `--ev-1`       | `#D2A8FF` | Evidencia: Aún se investiga | 9,53 · 8,48                                                                      |
| `--error`      | `#FF8A8A` | Errores técnicos            | 8,18 · 7,28                                                                      |

**Reglas**

- **Tema por defecto:** el del sistema (`prefers-color-scheme`); ajuste manual en Ajustes.
- **Foco:** contorno de 3 px con `--primary`, desplazado 2 px; visible en ambos temas.
- **Bordes de controles:** `--text-muted` (≥ 7:1 sobre el fondo), grosor 1.5–2 px.
- **Cielo del mapa (decorativo):** degradado de `#CFE3FF` a `--bg` (claro) y de `#0B0A1E` a `--surface` (oscuro). No transmite información.
- Si se agrega un color nuevo, **verificar contraste** antes de usarlo y registrarlo aquí.

### 3.2 Niveles de evidencia (componente visual)

| Nivel | Texto             | Ícono               | Color      |
| ----- | ----------------- | -------------------- | ---------- |
| E3    | Bien establecido  | ● (círculo lleno)  | `--ev-3` |
| E2    | Probable          | ◐ (medio lleno)     | `--ev-2` |
| E1    | Aún se investiga | ○ (círculo vacío) | `--ev-1` |

La insignia siempre muestra ícono **y** texto. Al tocarla abre una hoja que explica qué significa el nivel.

### 3.3 Tipografía

| Rol      | Fuente                                                       | Notas                         |
| -------- | ------------------------------------------------------------ | ----------------------------- |
| Títulos | **Fredoka** (redondeada, amable)                       | Pesos 500 y 600               |
| Cuerpo   | **Nunito**                                             | Pesos 400, 600 y 700          |
| Respaldo | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | Obligatorio como *fallback* |

- **Autoalojadas** (archivos `woff2` dentro del proyecto) para **no hacer peticiones a terceros** (privacidad de menores). Subconjunto latino (incluye á, é, í, ó, ú, ñ, ü, ¿, ¡). Presupuesto: ≤ 70 KB en total (fuentes variables: un archivo por familia con todos los pesos).
- Ambas se distribuyen con licencia abierta (SIL OFL); **verificar la licencia en el repositorio de cada fuente al descargarlas** y registrarla en `/licenses`.
- `font-display: swap`.

| Escala          | Tamaño | Uso                                              |
| --------------- | ------- | ------------------------------------------------ |
| `--text-xs`   | 14 px   | Pies y notas (solo con `--text-muted` o mejor) |
| `--text-base` | 17 px   | Cuerpo                                           |
| `--text-lg`   | 20 px   | Texto destacado                                  |
| `--text-xl`   | 24 px   | Títulos de sección                             |
| `--text-2xl`  | 30 px   | Títulos de pantalla                             |
| `--text-3xl`  | 38 px   | Portada y celebraciones                          |

Interlineado 1,5 en cuerpo y 1,2 en títulos. Longitud de línea ≤ 60 caracteres. Ajuste de tamaño de texto por el usuario (100 %, 125 %, 150 %).

### 3.4 Espaciado, forma y elevación

- **Espaciado:** múltiplos de 4 px (`4, 8, 12, 16, 24, 32, 48`).
- **Radios:** `12 px` (tarjetas), `999 px` (botones y píldoras), `20 px` (hojas inferiores).
- **Elevación:** sombras suaves y difusas en tema claro; en tema oscuro se usa borde sutil en lugar de sombra.
- **Área táctil:** mínimo **44×44 px** en todo control (el mínimo de WCAG 2.2 es 24 px).

---

## 4. Navegación y estructura

### 4.1 Mapa del sitio

```
Portada
└── Mapa (inicio)
    ├── Isla (llegada → historia → retos → sello)
    │   └── Armador de cadenas
    ├── Pasaporte
    ├── Diario
    └── Ayuda
        └── Ajustes
            ├── Fuentes
            ├── Exportar / importar
            ├── Borrar mis datos
            └── Acerca de
```

El **Diario** vuelve a la v0.1 con entrada mínima y una columna; la lectura semanal queda para v0.2. La composición responsive y el contrato de hojas están en [`../adr/016-responsive-paridad-movil.md`](../adr/016-responsive-paridad-movil.md).

### 4.2 Barra inferior (móvil)

Cuatro destinos: **Mapa · Pasaporte · Diario · Ayuda**. **Ajustes** vive dentro de Ayuda. La barra es la misma en móvil y desktop; en desktop la columna se centra a 640 px. La isla, el pasaporte y la niebla son hojas modales en ambos; la coronación no muestra barra.

### 4.3 Mapa del archipiélago

- **Disposición vertical:** se asciende desde la **Isla Nido** (abajo) hacia el **Mirador** (arriba); las zonas son franjas de altura: Zona 1 Entender, Zona 2 Causas, Zona 3 Efectos, Zona 4 Cuidar.
- Las islas se posicionan según un archivo de datos (`/content`), no en el código de la interfaz.
- **Ruta sugerida:** línea punteada de nubes.
- **Estados de isla:** nueva (brillo suave), actual/siguiente (trazo primario), completada (sello dorado) y en niebla (trazo punteado, sin navegación de isla). Las **no disponibles** muestran niebla y el texto "En construcción".
- **Al tocar:** una transición de nubes cubre el cambio de vista y se abre la hoja de la isla en la etapa **Llegada**. Con "reducir animaciones", el cambio es directo.
- **Etapas de la isla:** `llegada → historia → retos → sello`; el armador de cadenas vive dentro de `retos`.
- **Para lector de pantalla y teclado:** el mapa se expone como una **lista ordenada de islas** (nombre, zona, estado).

---

## 5. Inventario de pantallas

> **Alcance v0.1:** Portada, Mapa, Isla (`llegada`, `historia`, `retos`, `sello`), Hoja de fuente, Pasaporte, Diario (entrada), Ayuda, Ajustes, Exportar/importar, Borrar datos, Acerca de, Coronación y No encontrada. La lectura semanal del Diario y el onboarding quedan para v0.2/v1.0.

| ID   | Pantalla                     | Propósito                                                | Estados a diseñar                             |
| ---- | ---------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| S-01 | Bienvenida (Nido)            | Presentar a Nubi                                          | Primera vez / retorno                          |
| S-02 | Onboarding (1–3)            | Cómo funciona, privacidad local, apodo opcional          | Saltar, error de apodo                         |
| S-03 | **Mapa**               | Elegir isla; ver ruta y progreso                          | Primera vez, con progreso, sin conexión       |
| S-04 | Isla · Llegada              | Nubi presenta la isla                                     | —                                             |
| S-05 | Isla · Explora              | Carrusel de tarjetas                                      | Primera / intermedia / última tarjeta         |
| S-06 | Tarjeta · Ver fuente        | Hoja inferior con cita, población, diseño, limitaciones | Fuente cargada                                 |
| S-07 | Isla · Juega                | Contenedor de mecánicas `MEC-xx`                       | Cada mecánica, completada                     |
| S-08 | Isla · Conecta              | Puentes entrantes/salientes                               | Con y sin puentes disponibles                  |
| S-09 | **Armador de cadenas** | `MEC-01`                                                | Vacío, parcial, correcto, incorrecto, resumen |
| S-10 | Isla · Reto                 | Aceptar el reto                                           | Aceptado / "ahora no"                          |
| S-11 | Pasaporte                    | Sellos y zonas                                            | Vacío, con progreso                           |
| S-12 | **Diario · Entrada (v0.1)** | Registro matutino en ≤ 30 s                              | Nuevo, editando, ya registrado hoy             |
| S-13 | Diario · Semana (v0.2)      | Lectura de la semana con aviso neutral                   | < 5 entradas, con datos                        |
| S-14 | Fuentes                      | Todas las referencias                                     | Lista por isla                                 |
| S-15 | **Ayuda**              | Hablar con un adulto                                      | Con y sin línea verificada                    |
| S-16 | Ajustes                      | Tema, movimiento, texto, sonido, datos                    | —                                             |
| S-17 | Exportar / importar          | Archivo de progreso                                       | Éxito, error de esquema, confirmación        |
| S-18 | Borrar mis datos             | Confirmación doble                                       | Confirmación, hecho                           |
| S-19 | Acerca de                    | Qué es, aviso médico, licencias                         | —                                             |

**Estados globales:** sin conexión (el contenido sigue disponible), almacenamiento no disponible (banner con opción de exportar), cargando (esqueleto), error genérico (texto simple y botón "Intentar de nuevo").

### Wireframes (referencia, 360×640)

**S-03 Mapa**

```
┌───────────────────────────────┐
│ (Nubi) Archipiélago        ⚙  │
├───────────────────────────────┤
│        ☁ Isla Mirador         │  Zona 4
│   ☁ Isla Taller     ☁(niebla) │
│  · · · ·                      │
│   ☁ Isla Ánimo    ☁ Cerebro   │  Zona 3
│  · · · ·                      │
│   ☁ Isla Horarios  ☁(niebla)  │  Zona 2
│  · · · ·                      │
│        ☁ Isla Reloj           │  Zona 1
│  · · · ·                      │
│        ☁ Isla Nido  (Nubi)    │
├───────────────────────────────┤
│ Mapa │ Pasaporte │ Ayuda │
└───────────────────────────────┘
```

**S-05 Explora (tarjeta)**

```
┌───────────────────────────────┐
│ ← Isla Ánimo        ●○○○○     │
│ ┌───────────────────────────┐ │
│ │      [ilustración]        │ │
│ │ Poco sueño, más tensión   │ │
│ │ En un estudio con 50 ...  │ │
│ │ ◐ Probable   [Ver fuente] │ │
│ └───────────────────────────┘ │
│        [ Siguiente → ]        │
└───────────────────────────────┘
```

**S-09 Armador de cadenas**

```
┌───────────────────────────────┐
│ ← Del reloj al ánimo          │
│ ┌ El reloj se corre ─────────┐│
│          ☁ puente             │
│ ┌ [ hueco 2 ] ───────────────┐│
│          ☁ puente             │
│ ┌ [ hueco 3 ] ───────────────┐│
│          ☁ puente             │
│ ┌ Más tensión e irritabilidad┐│
│ Piezas: (A) (B) (C) (D)       │
│ [ Probar cadena ]  [ Pista ]  │
└───────────────────────────────┘
```

**S-12 Diario**

```
┌───────────────────────────────┐
│ ¿Cómo amaneciste?             │
│ Me acosté:     [ 11:30 p. m. ]│
│ Me levanté:    [  6:00 a. m. ]│
│ Ánimo: 😞 🙁 😐 🙂 😊 (con texto)│
│ Pantallas en la cama: Sí  No  │
│          [ Guardar ]          │
└───────────────────────────────┘
```

---

## 6. Catálogo de componentes

| Componente                    | Descripción                                                              | Estados                                             |
| ----------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| `NubiBubble`                | Burbuja de diálogo con avatar y expresión                               | Normal, saltable, sin avatar                        |
| `IslaNode`                  | Isla en el mapa                                                           | Nueva, visitada, completada, en construcción, foco |
| `PuenteLine`                | Conexión entre islas o eslabones, con insignia de evidencia              | Normal, resaltado                                   |
| `CardIdea`                  | Tarjeta de una idea con ilustración, texto, insignia y "Ver fuente"      | —                                                  |
| `EvidenceBadge`             | Ícono + texto de nivel; abre explicación                                | E1, E2, E3                                          |
| `SourceSheet`               | Hoja inferior con cita, población, diseño, limitaciones, enlace externo | Abierta, cerrada                                    |
| `ChainSlot` / `PieceChip` | Hueco y pieza del armador                                                 | Vacío, lleno, válido, no válido, enfocado        |
| `StampSlot`                 | Casilla del pasaporte                                                     | Vacía, ganada                                      |
| `ProgressDots`              | Indicador de etapa o tarjeta                                              | —                                                  |
| `MoodPicker`                | 5 rostros con texto                                                       | Sin selección, seleccionado                        |
| `TimePicker`                | Selector de hora grande y táctil                                         | Con valor por defecto                               |
| `Button`                    | Primario, secundario, texto                                               | Normal, foco, presionado, deshabilitado             |
| `BottomNav`                 | 4 destinos: Mapa, Pasaporte, Diario, Ayuda                                | Activo, foco                                        |
| `Toast` / `Banner`        | Mensajes breves                                                           | Info, error técnico                                |
| `ConfirmDialog`             | Confirmaciones                                                            | Borrar datos, importar                              |
| `ToggleChoice`              | Sí / Más o menos / No                                                   | —                                                  |

Todos los componentes viven en una sola biblioteca interna (`shared/ui`), usan los tokens de §3 y no contienen textos de contenido.

---

## 7. Movimiento

| Token            | Valor     | Uso                             |
| ---------------- | --------- | ------------------------------- |
| `--dur-fast`   | 120 ms    | Cambios de estado de controles  |
| `--dur`        | 240 ms    | Transiciones de tarjeta y hojas |
| `--dur-slow`   | 400 ms    | Aparición de celebraciones     |
| `--dur-flight` | ≤ 800 ms | Vuelo de Nubi entre islas       |

- Curvas suaves (*ease-out*); sin rebotes bruscos.
- **Nada parpadea más de 3 veces por segundo.**
- **Con "reducir animaciones"** (sistema o ajuste manual): sin parallax, sin bucles, sin vuelos; solo desvanecimientos de 120 ms. Las ayudas de Nubi pasan a ser estáticas.
- Las animaciones de ambiente (estrellas, nubes) son opcionales y se pausan al ocultar la pestaña.

---

## 8. Accesibilidad (checklist de cada pantalla)

Objetivo: **WCAG 2.2 AA**. Ninguna pantalla se considera terminada sin cumplir:

1. Contraste de texto ≥ 4,5:1 y de componentes/íconos ≥ 3:1, en **ambos** temas.
2. Todo control alcanzable y operable con **teclado**, con orden lógico y foco visible.
3. Área táctil ≥ 44×44 px (nunca menos de 24 px).
4. **Nada solo con color:** ícono + texto en niveles de evidencia, estados de isla y validación de cadenas.
5. Estructura semántica: un `h1` por pantalla, jerarquía de encabezados, regiones (`main`, `nav`).
6. **Atributo de idioma** `es-CO` en el documento.
7. Etiquetas accesibles en todos los controles e imágenes significativas; ilustraciones decorativas con `alt=""`.
8. El **mapa** se puede recorrer como lista; el estado de cada isla se anuncia.
9. Mecánicas con arrastrar tienen alternativa por toque y teclado.
10. **Sin límites de tiempo.**
11. Respeta `prefers-reduced-motion` y el ajuste manual; sin destellos > 3 por segundo.
12. Texto ajustable hasta 150 % (y legible con zoom del navegador al 200 %) sin pérdida de contenido.
13. Orden de lectura correcto con lector de pantalla; mensajes dinámicos con `aria-live` educado.
14. Las hojas modales atrapan el foco, se cierran con `Esc` y devuelven el foco al origen.
15. Formularios con etiquetas visibles, ayuda y errores en texto claro.
16. Sin pérdida de funcionalidad en orientación horizontal.
17. Lenguaje claro: frases cortas, sin jerga sin explicar.
18. Las insignias de evidencia se leen completas ("Probable: estudios con adolescentes, aún limitados").
19. Pruebas automáticas (axe) sin violaciones críticas **y** revisión manual con teclado y un lector de pantalla.

---

## 9. Microcopy

**Reglas:** verbos de acción, tuteo, sin culpa, sin tecnicismos, sin signos de exclamación en exceso.

| Elemento           | Texto                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Ver evidencia      | "Ver fuente"                                                                                     |
| Validar cadena     | "Probar cadena"                                                                                  |
| Pista              | "Una pista"                                                                                      |
| Reto               | "Lo pruebo esta noche" / "Ahora no"                                                              |
| Diario             | "¿Cómo amaneciste?" · "Guardar" · "Saltar hoy"                                               |
| Experimento        | "¿Lo probaste?" · "Sí" · "Más o menos" · "No"                                              |
| Isla no disponible | "En construcción. Pronto habrá más."                                                          |
| Evidencia          | "Bien establecido" · "Probable" · "Aún se investiga"                                          |
| Borrar             | "Borrar mis datos" → "Esto elimina todo lo guardado en este dispositivo. No se puede deshacer." |
| Aviso              | "Esta app informa y no reemplaza a un profesional de la salud."                                  |

**Evitar:** "Incorrecto", "Fallaste", "Deberías", "Tienes que", "Malo", "Peligroso".

---

## 10. Ilustración e iconografía

- **Estilo:** vectorial, formas suaves, degradados sutiles, nubes y estrellas; paleta del §3.1.
- **Formato:** ilustraciones en **WebP HD** (800 px escenas/miniaturas, 1280 px piezas grandes) con canal alfa cuando se montan sobre UI; SVG solo para iconos de interfaz y las siluetas de nube del mapa. Presupuesto: miniatura ≤ 40 KB, escena ≤ 90 KB (800 px) y ≤ 180 KB (1280 px), con carga diferida por isla. *(Antes se exigía SVG ≤ 20 KB: la vectorización degradaba el arte; decisión en `docs/adr/014-arte-webp-hd.md`.)*
- **Origen y licencias:** propias o con licencia abierta/comercial verificada; si se genera con IA, revisar derechos y dejar registro. **Q-04 respondida (2026-11-05):** generación con Google **Nano Banana 2.1**, recorte y **WebP HD** (ADR-014); el material intermedio no se distribuye; todo recurso registra autor, proceso y licencia en `/licenses` (prompts y pipeline: `mockups/kitPrompts.md`). **Cada recurso registra autor y licencia en `/licenses`.**
- **Nombres:** `isla-reloj.webp`, `nubi-curiosa.webp`, `escena-reloj-1.webp`, `icon-ev-3.svg`.
- **Prohibido:** personajes con derechos de terceros, imágenes de personas reales sin autorización, imágenes que muestren pantallas, camas o cuerpos de forma sugestiva.

### Motivos por isla (MVP)

| Isla     | Motivo visual                             | Ícono distintivo |
| -------- | ----------------------------------------- | ----------------- |
| Nido     | Nido de nubes con huevo-luna              | Nido              |
| Reloj    | Torre-reloj con luna y sol                | Reloj             |
| Horarios | Campana escolar y calendario              | Campana           |
| Ánimo   | Isla con rostros y arcoíris suave        | Cara              |
| Cerebro  | Isla con engranajes y libros              | Engranaje         |
| Taller   | Banco de trabajo con herramientas de nube | Llave             |

Cada isla se distingue por **forma e ícono**, no solo por color.

### Inventario mínimo de recursos del MVP

Nubi (9 expresiones + 3 accesorios) · 6 islas + versión en niebla · fondo del cielo (claro/oscuro) · 3 íconos de evidencia · 5 rostros de ánimo · íconos de navegación (4) y de ajustes · 6 sellos de isla · 28 escenas WebP dedicadas para cada momento de la historia (ADR-018) · ícono de la PWA (192, 512 y *maskable*) · imagen para compartir.

---

## 11. Diseño adaptable

La composición es la misma en móvil y desktop: una sola columna, barra inferior de 4 destinos y hojas modales. El escritorio solo cambia el ancho de la columna y el fondo.

| Ancho | Columna | Navegación y hojas |
|---|---|---|
| **320–767 px** | 100 %, máx. 480 | Barra inferior 4; hoja inferior; 100dvh si la altura es corta |
| **768–1023 px** | 560 centrada | Barra inferior 4; hoja inferior máx. 560 |
| **≥ 1024 px** | 640 centrada sobre cielo | Barra inferior 4 dentro de la columna; hoja inferior máx. 640, centrada |

- **320 px:** ancho de reflujo WCAG al 400 %; el logo de portada usa `min(340px, 100%)` y no hay scroll horizontal.
- **844×390 (horizontal):** la hoja pasa a 100dvh y la barra se oculta/inertiza mientras está abierta; no se convierte en panel lateral.
- **150 % de texto:** la columna sigue siendo una sola; no hay columnas que colapsar.
- Hojas: `dialog` modal en ambos, foco atrapado, `Esc` y foco de vuelta al disparador. El mapa queda inerte mientras están abiertas.
- DOM: `nav → main → dialog`; el skip link salta al contenido.

---

## 12. Flujos clave

| Flujo                       | Pasos                                                         |
| --------------------------- | ------------------------------------------------------------- |
| **Primera vez**       | S-01 → S-02 → S-03 → elegir isla                           |
| **Recorrer una isla** | S-04 → S-05 (+S-06) → S-07 → S-08 → S-10 → vuelve a S-03 |
| **Armar una cadena**  | S-08 → S-09 → resumen → sello de puente                    |
| **Diario**            | S-03 (invitación) → S-12 → (con ≥ 5 entradas) S-13        |
| **Pedir ayuda**       | Cualquier pantalla → Ayuda (S-15) en un toque                |
| **Borrar datos**      | S-16 → S-18 (doble confirmación)                            |
