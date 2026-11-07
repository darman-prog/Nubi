# Nubi y el Archipiélago del Sueño — Paquete de documentación

**Versión:** 0.1 (borrador para confirmar) · **Fecha:** 2026-11-05
**Qué es:** aplicativo web, pensado primero para celular, para que adolescentes (13–17 años) entiendan las **causas del sueño insuficiente y sus efectos**, mediante un mapa de islas, tarjetas, juegos y cadenas causa → efecto.

Este paquete existe para que una persona o un agente de IA pueda construir el producto **sin tener que redefinir la idea** en cada tarea.

---

## 1. Documentos y orden de lectura

| # | Archivo | Responde | Lo lee quien… |
|---|---|---|---|
| 01 | `01-PRD.md` | ¿Qué se construye y por qué? Alcance, requisitos, métricas, decisiones | **Siempre primero** |
| 02 | `02-contenido-y-evidencia.md` | ¿Qué información lleva? Fichas de evidencia, grafo de causas y efectos, contenido por isla | Quien escribe contenido o muestra datos de salud |
| 03 | `03-diseno-de-juego.md` | ¿Cómo funcionan las mecánicas? Bucles, cadenas, minijuegos, diario, pasaporte | Quien implementa lógica de juego |
| 04 | `04-diseno-visual-ux.md` | ¿Cómo se ve y se siente? Nubi, paleta, tipografía, pantallas, accesibilidad | Quien implementa interfaz |
| 05 | `05-arquitectura-tecnica.md` | ¿Cómo se construye? Stack, datos, estructura, pruebas, plan de tareas | Quien programa |

**Jerarquía de verdad** (si dos documentos se contradicen, gana el de arriba):
1. `01-PRD.md` — alcance, decisiones y requisitos.
2. `02-contenido-y-evidencia.md` — todo lo que se afirme sobre salud y sueño.
3. `03`, `04` y `05` — cómo se implementa lo anterior.

Ningún documento repite lo que ya dice otro: se enlaza por ID (por ejemplo `RF-07`, `EV-007`).

---

## 2. Convenciones de identificadores

| Prefijo | Significado | Dónde vive |
|---|---|---|
| `D-xx` | Decisión de producto | PRD §13 |
| `Q-xx` | Pregunta abierta | PRD §14 |
| `RF-xx` / `RNF-xx` | Requisito funcional / no funcional | PRD §7–8 |
| `EV-xxx` | Ficha de evidencia | Contenido §4 |
| `N-…` / `B-xx` / `C-xx` | Nodo / puente (arista) / cadena del grafo | Contenido §5 |
| `ISL-…` | Isla | Contenido §6 |
| `MR-xx` | Ítem de mito o realidad | Contenido §6 |
| `MEC-xx` | Mecánica de juego | Juego §6 |
| `S-xx` | Pantalla | Diseño visual §5 |
| `ADR-xx` | Decisión técnica | Arquitectura §1 |
| `T-xx` | Tarea de implementación | Arquitectura §12 |

---

## 3. Reglas para agentes de IA (obligatorias)

1. **Lee `01-PRD.md` antes de cualquier tarea** y respeta su alcance. No agregues funciones que no estén en el PRD.
2. **Nunca inventes afirmaciones de salud, cifras ni estudios.** Solo se muestra contenido que tenga una ficha `EV-xxx` en el documento 02. Si falta la evidencia, deja `TODO(evidencia)` y no lo publiques.
3. **Todo texto visible vive en `/content`**, no dentro de componentes. Los componentes no contienen frases de contenido.
4. **Privacidad por diseño:** sin cuentas, sin servidor de datos de usuario, sin analíticas ni scripts, fuentes o imágenes de terceros. Todo dato del usuario queda en su dispositivo.
5. **Lenguaje al adolescente:** tuteo, frases cortas, sin culpar, sin diagnosticar, sin alarmismo. Nubi nunca regaña ni da consejos médicos.
6. **Temas sensibles** (depresión, suicidio, trastornos del sueño, medicación, suplementos): sigue el protocolo del documento 02 §7. En caso de duda, no escribas el contenido y deja `TODO(revisión profesional)`.
7. **Accesibilidad no es opcional:** cada pantalla cumple el checklist del documento 04 §8 antes de darse por terminada.
8. **Mecánicas sin presión:** no agregues rachas, rankings, vidas, temporizadores de presión ni puntajes de "salud del sueño" (lista completa en documento 03 §12).
9. **Trabaja por tareas pequeñas** con criterios de aceptación (plantilla en documento 05 §12). Una tarea = un cambio verificable.
10. **Ante una ambigüedad o contradicción:** no asumas. Deja `TODO(decisión)` y avisa; si se resuelve, se registra en PRD §13.
11. **No cambies decisiones registradas** (`D-xx`, `ADR-xx`) sin que quede una nueva decisión que la reemplace.
12. **Mantén la documentación sincronizada:** si el código cambia un comportamiento descrito aquí, actualiza el documento correspondiente en el mismo cambio.

---

## 4. Glosario

| Término | Definición |
|---|---|
| **Nubi** | Nube mascota que guía al usuario. Personaje, no autoridad médica. |
| **Archipiélago** | El mapa principal: conjunto de islas flotantes sobre nubes. |
| **Isla** | Un tema del sueño. Tiene 5 etapas: Llegada, Explora, Juega, Conecta, Reto. |
| **Zona** | Agrupación de islas: 1 Entender, 2 Causas, 3 Efectos, 4 Cuidar. |
| **Nodo** | Un factor o efecto concreto del sueño (por ejemplo "El reloj se retrasa en la pubertad"). |
| **Puente** | Conexión causa → efecto entre dos nodos, con un nivel de evidencia. |
| **Cadena** | Secuencia de nodos unidos por puentes. Es la mecánica estrella. |
| **Ficha de evidencia** | Registro de una afirmación con su fuente, población, diseño y nivel. |
| **Nivel de evidencia** | Qué tan respaldada está una afirmación: *Bien establecido*, *Probable*, *Aún se investiga*. |
| **Reto real** | Acción pequeña para probar esa noche. Se premia probarlo, no lograrlo. |
| **Sello** | Marca del pasaporte que se gana por aprender o probar, nunca por dormir X horas. |
| **Pasaporte** | Vista de progreso: sellos y zonas. |
| **Diario** | Registro matutino de menos de 30 segundos (hora de acostarse, de levantarse, ánimo). |
| **MVP** | Primera versión que se prueba con adolescentes: ver PRD §6. |

---

## 5. Estado del paquete

- **2026-11-05 (act.)**: Q-04 respondida (imágenes: Nano Banana 2.1 + vectorizado a SVG) y D-09 reemplazada por **D-15** / **ADR-13** (framework **React**); detalle en [`../adr/013-framework-react.md`](../adr/013-framework-react.md) y prompts en `kitPrompts.md` (raíz del repo). El corte de trabajo en curso es el hito **H1–H3** del PRD.
- Todas las decisiones marcadas **"Propuesta"** en el PRD §13 están por confirmar.
- El contenido de salud está en estado **borrador, extraído del documento de bases de investigación**; requiere verificación con fuentes primarias y revisión por un profesional antes de publicarse (documento 02 §9).
- Las islas sin respaldo en las bases de investigación (Pantalla, Energía, Ambiente, Cuerpo, entre otras) están **fuera del MVP** hasta tener fichas de evidencia (documento 02 §8).
