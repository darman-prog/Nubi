# 01 · PRD — Nubi y el Archipiélago del Sueño

**Versión:** 0.1 (borrador para confirmar) · **Fecha:** 2026-11-05 · **Estado:** raíz de la documentación (ver `00-README.md`)

---

## 1. Resumen

**Qué es.** Un aplicativo web, pensado primero para celular, donde una nube mascota (**Nubi**) guía al adolescente por un **archipiélago de islas flotantes**. Cada isla es un tema del sueño. La información se presenta "masticada": tarjetas, juegos, simuladores y, sobre todo, **cadenas causa → efecto** que muestran cómo una cosa lleva a otra.

**Qué lo hace distinto.** No es una lista de consejos. El producto enseña a *entender* por qué un horario, un hábito o una decisión afecta el ánimo, la memoria o el rendimiento, y muestra **qué tan sólida es la evidencia de cada conexión**. Cierra el ciclo con un **diario de sueño mínimo** para que el usuario vea su propio patrón.

**Qué no es.** No diagnostica, no trata, no reemplaza a un profesional, no recomienda medicamentos ni suplementos.

---

## 2. Problema y oportunidad

Base: documento de bases de investigación del proyecto (revisión documental narrativa).

- La Academia Americana de Medicina del Sueño (AASM) recomienda **8 a 10 horas** para adolescentes de 13 a 18 años (EV-001). En datos de EE. UU. citados en esa misma posición, **68,4 %** de los estudiantes de bachillerato duerme 7 horas o menos en noches de colegio (EV-002). *Dato de EE. UU.: en Colombia hay pocas cifras de colegios y los estudios disponibles son sobre todo de universitarios.*
- Las causas se combinan: biológicas (el reloj biológico se retrasa en la pubertad), escolares (entradas tempranas) y de estilo de vida (tareas, pantallas, vida social).
- Dormir poco se asocia con irritabilidad, peor regulación emocional, cambios en el sistema de recompensa y, según el diseño del estudio, peor retención a largo plazo.
- **Brecha:** hay poca información clara en español para adolescentes, y casi nada que muestre las *relaciones* entre causas y efectos con honestidad sobre lo que se sabe y lo que no.
- **Riesgo de los productos existentes:** consejos del tipo "acuéstate temprano" que ignoran las causas estructurales y culpan al adolescente.

---

## 3. Usuarios

| Usuario | Rol | Qué necesita | Prioridad |
|---|---|---|---|
| **Adolescente 13–17** | Usuario principal | Entender por qué duerme mal sin sentirse juzgado, algo breve, visual y que funcione en el celular | Primaria |
| **Docente / orientador** | Canal de uso en colegio | Un recurso de 15–20 min que pueda usar con un grupo, sin crear cuentas | Secundaria |
| **Familia** | Apoyo | Entender que no es pereza y qué reglas de casa ayudan | Secundaria (v1.0) |
| **Profesional (psicólogo, pediatra)** | Revisor y derivación | Que el contenido sea fiel a la evidencia y exista un camino claro a consulta | Revisor |

**Persona guía (adolescente):** *Sofía, 15 años.* Se acuesta tarde, entra temprano al colegio y se siente irritable, pero cree que "es su carácter". Usa el celular casi todo el día. No instalaría una app solo para dormir mejor; sí abriría un enlace que le manden en clase o que vea en redes si es corto y entretenido.

---

## 4. Objetivos y métricas

**Objetivo del producto:** que el adolescente **entienda** una cadena causa → efecto del sueño y **pruebe** un cambio pequeño, registrando cómo le va.

| ID | Métrica | Cómo se mide | Meta inicial (a calibrar en piloto) |
|---|---|---|---|
| M-01 | Completa al menos una cadena causa → efecto en su primera sesión | Observación en piloto | ≥ 60 % |
| M-02 | Registra ≥ 3 mañanas de diario en los primeros 7 días | Observación / revisión en piloto con consentimiento | ≥ 30 % |
| M-03 | Mejora en comprensión | Mini quiz de 3–5 preguntas al inicio y al final (piloto) | Más aciertos al final que al inicio en la mayoría |
| M-04 | Tiempo hasta completar la primera isla | Observación | ≤ 8 min |
| M-05 | Calidad de contenido | Revisión automática y manual | **0** afirmaciones de salud publicadas sin ficha de evidencia y sin nivel visible |
| M-06 | Usabilidad percibida | Cuestionario breve (p. ej. SUS) en piloto | A definir tras la primera ronda |

**Nota:** las metas son hipótesis de partida, no compromisos. No hay analíticas en el MVP (D-10), por lo que se miden con piloto observado.

### No-objetivos (explícitos)

- No hay cuentas, registro, correo ni nombre real.
- No hay ranking, puntajes de "salud del sueño", rachas ni comparaciones entre usuarios.
- No se dan consejos de medicación, melatonina ni suplementos.
- No se diagnostican trastornos ni se interpretan síntomas del usuario.
- No hay chat libre con IA dentro de la app.
- No es una app para menores de 13 ni para adultos (sección de adultos solo informativa, v1.0).
- No incluye monetización ni publicidad.

---

## 5. Principios de producto

1. **Honestidad sobre la evidencia.** Cada afirmación muestra de dónde viene y qué tan sólida es. Decir "aún se investiga" es una función, no una debilidad.
2. **Sin culpa.** Varias causas son biológicas o escolares y no dependen del adolescente. El tono nunca regaña.
3. **Sin presión ni ansiedad por dormir.** Se premia aprender y probar, nunca "dormir X horas".
4. **Privacidad total y local.** Cuida a menores: nada sale del dispositivo.
5. **Breve y visual.** Una idea por tarjeta; sesiones de 5–10 minutos.
6. **Un adulto siempre a un toque.** La ayuda es visible en todo momento.
7. **Accesible desde el inicio.** Contraste, reducir animaciones, teclado y lector de pantalla.

---

## 6. Alcance por fases

### Mapa de islas y fase

| Zona | Isla | Fase | Estado de evidencia (ver doc. 02) |
|---|---|---|---|
| — | **Isla Nido** (inicio) | **MVP** | No requiere evidencia |
| 1 Entender | **Isla Reloj** | **MVP** | Sólida (EV-001…004) |
| 1 Entender | Isla Luna | v1.0 | Fuente débil: requiere fuente primaria |
| 2 Causas | **Isla Horarios** | **MVP** | Sólida / parcial (EV-004…006) |
| 2 Causas | Isla Pantalla | v0.2+ | **Pendiente de evidencia** |
| 2 Causas | Isla Energía | v1.0 | **Pendiente de evidencia** |
| 2 Causas | Isla Tormenta | v1.0 | **Pendiente de evidencia** |
| 2 Causas | Isla Ambiente | v1.0 | **Pendiente de evidencia** |
| 3 Efectos | **Isla Ánimo** | **MVP** | Probable (EV-007…010) |
| 3 Efectos | **Isla Cerebro** | **MVP** | Mixta (EV-011…013) |
| 3 Efectos | Isla Cuerpo | v1.0 | **Pendiente de evidencia** |
| 3 Efectos | Isla Riesgo | v1.0 | Parcial (EV-014…016) + pendientes |
| 4 Cuidar | **Isla Taller** | **MVP** | Orientación (EV-021) |
| 4 Cuidar | Isla Monstruos | v1.0 | **Pendiente de evidencia** y revisión profesional obligatoria |
| 4 Cuidar | Isla Mirador | v0.2 (diario) / v1.0 (recursos y autotest) | Autotest solo con instrumentos validados |

**Por qué este MVP:** la cadena **Reloj → Horarios → Ánimo/Cerebro → Taller** es la que mejor respalda la evidencia disponible y demuestra el diferenciador del producto (puentes causa → efecto) y el ciclo completo (entender → probar → registrar).

### Versiones

- **MVP (v0.1):** Nido + 5 islas (Reloj, Horarios, Ánimo, Cerebro, Taller) · armador de cadenas · mito o realidad y minijuegos · retos · diario mínimo · pasaporte · fuentes · ayuda · ajustes · PWA instalable · exportar/importar · validador de contenido.
- **v0.2:** lectura de la semana (insights del diario) · "Noche y mañana" · Nubi nocturno · Isla Pantalla (si hay evidencia) · refinamientos del piloto.
- **v1.0:** islas restantes con evidencia aprobada · sección para adultos · modo clase · recordatorio `.ics` · diario imprimible.

---

## 7. Requisitos funcionales

Prioridad MoSCoW: **M** debe, **S** debería, **C** podría. Fase: MVP / v0.2 / v1.0.

| ID | Requisito | Prior. | Fase | Criterios de aceptación |
|---|---|---|---|---|
| RF-01 | **Onboarding con Nubi** en la Isla Nido: presenta el mapa, el pasaporte y la privacidad local | M | MVP | Máximo 3 pantallas, saltables; se completa en < 60 s; apodo opcional (≤ 20 caracteres) sin pedir nombre real ni correo; al terminar se crea el estado local |
| RF-02 | **Mapa del archipiélago** con islas, ruta sugerida libre y Nubi que vuela a la isla tocada | M | MVP | Muestra las islas definidas en `/content`; las no disponibles se ven "en construcción" y no abren contenido; estados nueva/visitada/completada con ícono y texto (no solo color); navegable con teclado y como lista para lector de pantalla |
| RF-03 | **Isla en 5 etapas:** Llegada, Explora, Juega, Conecta, Reto | M | MVP | Indicador de etapa; el progreso se guarda por etapa; se retoma donde quedó; se puede salir en cualquier momento sin perder lo avanzado |
| RF-04 | **Tarjetas de idea** (3–5 por isla, una idea por tarjeta) | M | MVP | ≤ 45 palabras por tarjeta; toda tarjeta con afirmación de salud muestra `EvidenceBadge` y botón "Ver fuente" (cita, población, diseño, limitaciones); el build falla si una tarjeta de salud no tiene `evidenceId` |
| RF-05 | **Al menos una mecánica de juego por isla** del catálogo `MEC-xx` | M | MVP | Cada isla del MVP incluye ≥ 1 mecánica; todas funcionan sin arrastrar (alternativa por toque/teclado) |
| RF-06 | **Puentes por isla** en la etapa Conecta | M | MVP | Muestra puentes entrantes (causas) y salientes (efectos) con nivel de evidencia; tocar un puente lleva a la isla relacionada; los puentes `pendiente` nunca aparecen |
| RF-07 | **Armador de cadenas causa → efecto** (`MEC-01`) | M | MVP | Valida la cadena contra el grafo `/content/graph`; feedback por eslabón; admite varias cadenas válidas; muestra el nivel de evidencia del eslabón más débil; no usa puntaje numérico |
| RF-08 | **"Noche y mañana":** simulador que muestra cómo una decisión nocturna se refleja en los efectos del día siguiente (`MEC-08`) | S | v0.2 | Solo usa conexiones con ficha de evidencia; muestra el nivel de evidencia de cada efecto; sin números de salud |
| RF-09 | **Reto real** por isla | M | MVP | El usuario acepta el reto; se gana el sello al aceptarlo; a la mañana siguiente (al abrir el diario) Nubi pregunta "¿lo probaste?" con Sí / Más o menos / No, y las tres respuestas son válidas y sin juicio |
| RF-10 | **Pasaporte:** sellos y progreso por zona | M | MVP | Muestra sellos de isla, de puente, de curiosidad y de diario; sin rachas, sin pérdida de sellos, sin ranking |
| RF-11 | **Diario de sueño mínimo** | M | MVP | Registro en ≤ 30 s: hora de acostarse, hora de levantarse, ánimo (5 opciones con rostro y texto); opcionales: pantallas antes de dormir (sí/no), reto probado; se puede omitir cualquier día; cálculo correcto cuando se cruza la medianoche; editable el mismo día |
| RF-12 | **Lectura de la semana** (`insights` neutrales del diario) | S | v0.2 | Solo con ≥ 5 entradas; texto neutro y con aviso "es solo tu semana, no un diagnóstico"; sin colores de alarma; sin metas de horas |
| RF-13 | **Exportar e importar progreso** (archivo) | S | MVP | Exporta un archivo versionado; importar valida el esquema y avisa antes de reemplazar datos; errores se explican en lenguaje simple |
| RF-14 | **Diario imprimible** para llevar a un adulto o profesional | C | v1.0 | Vista de impresión con las entradas del rango elegido |
| RF-15 | **Ayuda siempre visible:** "Hablar con un adulto" | M | MVP | Accesible desde cualquier pantalla en un toque; lista señales para consultar (mucho sueño en el día, ronquido fuerte, pesadillas frecuentes, malestar emocional intenso) y orienta a un adulto o profesional; líneas de ayuda solo si están verificadas con fuente oficial (Q-07) |
| RF-16 | **Fuentes:** pantalla con todas las referencias por isla | M | MVP | Cada fuente muestra cita completa, población, diseño y nivel; enlace externo marcado como tal |
| RF-17 | **Ajustes:** tema claro/oscuro, reducir animaciones, tamaño de texto, sonido, exportar/importar, **borrar mis datos** | M | MVP | "Borrar mis datos" elimina todo el estado local tras confirmación; los ajustes persisten |
| RF-18 | **PWA instalable y con contenido offline** | S | MVP | Se puede añadir a la pantalla de inicio; tras la primera carga, el contenido funciona sin conexión; se sugiere instalar para proteger los datos en iOS (ver doc. 05 §14) |
| RF-19 | **Sección para adultos** (familias y docentes) | C | v1.0 | Contenido breve basado en las recomendaciones de la investigación; sin gamificación |
| RF-20 | **Modo clase:** guion para docentes de una sesión de 15–20 min | C | v1.0 | Documento imprimible y enlace directo a una ruta sugerida |
| RF-21 | **Nubi nocturno:** si se usa tarde, sugiere continuar mañana y ofrece tema oscuro | S | v0.2 | Se muestra como máximo una vez por sesión; nunca bloquea el uso; desactivable |
| RF-22 | **Recordatorio matutino** como archivo `.ics` | C | v1.0 | Descarga un evento recurrente editable; sin notificaciones push |
| RF-23 | **Validador de contenido en el build** | M | MVP | El build falla si: hay contenido que no cumple el esquema; una afirmación de salud no tiene `evidenceId`; hay una ficha con estado `draft` en una build de producción; un puente apunta a un nodo inexistente |

---

## 8. Requisitos no funcionales

| ID | Requisito | Criterio |
|---|---|---|
| RNF-01 | **Accesibilidad** | WCAG 2.2 nivel AA; checklist del doc. 04 §8 |
| RNF-02 | **Rendimiento** | JS inicial ≤ 250 KB gzip; LCP ≤ 2.5 s en 4G simulado con dispositivo de gama media; INP ≤ 200 ms |
| RNF-03 | **Compatibilidad** | Últimas 2 versiones mayores de Chrome (Android) y Safari (iOS); pantallas desde 360×640 px; funciona también en escritorio |
| RNF-04 | **Privacidad** | Sin cookies, sin terceros (analíticas, fuentes, CDN de librerías), CSP estricta; datos solo en el dispositivo; borrado total disponible |
| RNF-05 | **Offline** | Contenido y mecánicas disponibles sin conexión tras la primera carga |
| RNF-06 | **Seguridad del contenido** | Todo texto de usuario se trata como texto plano; nunca se inserta HTML de usuario |
| RNF-07 | **Legibilidad** | Nivel de lectura de secundaria básica; frases de 20 palabras o menos en promedio; sin tecnicismos sin explicación |
| RNF-08 | **Mantenibilidad** | TypeScript estricto; lógica de dominio pura con cobertura ≥ 90 %; contenido como datos |
| RNF-09 | **Movimiento** | Respeta `prefers-reduced-motion` y un ajuste manual; sin destellos > 3 por segundo |
| RNF-10 | **Idioma** | Español de Colombia (tuteo); textos en `/content` listos para traducir |

---

## 9. Seguridad de contenido (resumen)

Detalle y reglas completas en `02-contenido-y-evidencia.md` §1 y §7.

- Solo se publica contenido con **ficha de evidencia**.
- Los temas sensibles (depresión, suicidio, trastornos del sueño, medicación) siguen un **protocolo** y requieren revisión profesional.
- Las cifras de otros países se rotulan con su origen; no se presentan como datos del usuario.
- La app **no recomienda melatonina, medicamentos ni suplementos**.

---

## 10. Riesgos y mitigaciones

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R-01 | Afirmaciones de salud incorrectas o exageradas | Alto | Fichas de evidencia, validador en build, revisión profesional (Q-02), lenguaje "se asocia" en vez de "causa" |
| R-02 | La Isla Pantalla (la más esperada) tiene el menor respaldo en las bases | Alto | Fuera del MVP hasta reunir fuentes específicas; no usar el mecanismo de "luz azul" sin evidencia |
| R-03 | Los usuarios no llegan al diario | Alto | Diario en el centro de la navegación inferior; ≤ 30 s; reto → diario como bucle |
| R-04 | Gamificación genera ansiedad por dormir | Medio | Sin rachas ni metas de horas; premiar aprender y probar |
| R-05 | Pérdida de datos locales (en iOS Safari, el almacenamiento puede borrarse tras días sin uso) | Medio | PWA instalable, exportar/importar, pedir almacenamiento persistente (doc. 05 §14) |
| R-06 | Alcance excesivo (13 islas) | Alto | MVP de 5 islas; el resto depende de evidencia |
| R-07 | Fuente débil para recomendaciones (un blog clínico) | Medio | Rotular como "orientación", no presentar como eficacia probada; sustituir por fuentes primarias |
| R-08 | Temas de depresión e ideación suicida | Alto | No publicar cifras ni gamificar; solo en Ayuda con redacción revisada |
| R-09 | Piloto con menores | Alto | Consentimiento de tutores y asentimiento del menor; acompañamiento; sin recolección de datos personales |
| R-10 | Rendimiento en celulares de gama baja | Medio | Presupuestos de rendimiento; SVG simples; animaciones opcionales |
| R-11 | Derechos de ilustraciones y fuentes tipográficas | Bajo | Licencias abiertas o propias, registradas (doc. 04 §10) |
| R-12 | Cadena integrada percibida como "probada" | Medio | Etiquetar como "Aún se investiga" y explicar que integra estudios distintos (EV-022) |

---

## 11. Plan por hitos

| Hito | Entregable | Criterio de salida |
|---|---|---|
| H0 | Documentación (este paquete) confirmada | Decisiones `D-xx` confirmadas; preguntas `Q-01…Q-03` respondidas |
| H1 | Esqueleto técnico + sistema de diseño | Proyecto, CI, tokens, componentes base, validador de contenido |
| H2 | **Isla Reloj completa** de punta a punta | Las 5 etapas funcionan con contenido real, persistencia y accesibilidad |
| H3 | Grafo + armador de cadenas | Cadena `C-01` jugable con feedback por eslabón |
| H4 | Reto + diario + pasaporte | Bucle reto → diario cerrado |
| H5 | Resto de islas MVP con contenido | Horarios, Ánimo, Cerebro, Taller completos |
| H6 | Endurecimiento | Accesibilidad, rendimiento, PWA y pruebas E2E en verde |
| H7 | **Piloto con adolescentes** | 5–8 participantes, métricas M-01…M-06 recogidas |
| H8 | Ajustes y v0.2 | Backlog priorizado con lo aprendido |

*No se asignan fechas: dependen de la capacidad del equipo (Q-01).*

---

## 12. Plan de validación

**Piloto (H7):**
- **Participantes:** 5–8 adolescentes de 13 a 17 años.
- **Requisitos:** consentimiento de tutores y asentimiento del menor; si es en un colegio, autorización de la institución (Q-03); acompañamiento de un adulto; sin recoger nombre ni datos personales; no grabar sin consentimiento expreso.
- **Contenido permitido en piloto:** como mínimo con estado `source_verified` (verificado con fuente primaria) y revisión de un profesional si es posible (doc. 02 §9).
- **Sesión (20–30 min):** quiz inicial (3–5 preguntas) → recorrer la Isla Reloj → armar una cadena → quiz final → entrevista breve.
- **Qué observar:** dónde dudan, qué eslabón de la cadena falla, si entienden las etiquetas de evidencia, si el tono resulta regañón, si encuentran la Ayuda y el diario.
- **Seguimiento opcional (7 días):** uso del diario y de un reto.

---

## 13. Registro de decisiones

Estado: **Propuesta** (por confirmar) · **Confirmada** · **Reemplazada**.

| ID | Decisión | Razón | Estado |
|---|---|---|---|
| D-01 | Público primario: **13–17 años** | Rango de las recomendaciones AASM (13–18) y menor complejidad de consentimiento al excluir 18 | Propuesta |
| D-02 | Canal: acceso libre por enlace; diseñado también para uso guiado en colegio | Un adolescente rara vez busca una app de sueño por cuenta propia | Propuesta |
| D-03 | Métrica principal: comprensión de una cadena (M-01) y uso del diario (M-02) | Mide entendimiento y cambio de conducta, no visitas | Propuesta |
| D-04 | Sin cuentas ni backend; datos locales; exportar/importar | Privacidad de menores y menor alcance técnico | Propuesta |
| D-05 | MVP = Nido + Reloj, Horarios, Ánimo, Cerebro, Taller + diario | Es la cadena con mejor respaldo y demuestra el diferenciador | Propuesta |
| D-06 | Islas sin evidencia (Pantalla, Energía, Tormenta, Ambiente, Cuerpo, Monstruos…) fuera del MVP | Evitar afirmaciones sin respaldo | Propuesta |
| D-07 | Gamificación sin presión: sellos por aprender y probar; sin rachas, rankings ni metas de horas | Evitar ansiedad por dormir | Propuesta |
| D-08 | Todo puente y tarjeta con afirmación muestra su **nivel de evidencia** | Honestidad y diferenciación | Propuesta |
| D-09 | *(Reemplazada por D-15 / ADR-13)* | — | **Reemplazada (2026-11-05)** |
| D-15 | Stack: **React** (Vite + TypeScript estricto, SPA sin backend, PWA). Reemplaza D-09/ADR-01; la arquitectura del doc 05 se conserva (detalle en [`docs/adr/013-framework-react.md`](../adr/013-framework-react.md)) | Quien desarrolla domina JS/React; la premisa del ADR-01 era incorrecta | **Confirmada (2026-11-05)** |
| D-10 | Sin analíticas en el MVP; medir con piloto observado | Privacidad de menores | Propuesta |
| D-11 | Ayuda siempre visible; líneas de ayuda solo tras verificar en fuente oficial | No publicar datos de contacto sin verificar | Propuesta |
| D-12 | Nombre provisional: *Nubi y el Archipiélago del Sueño* | Nombre del concepto original | Propuesta |
| D-13 | Español de Colombia con tuteo | Público objetivo y tono cercano | Propuesta |
| D-14 | La app no recomienda medicamentos, melatonina ni suplementos | Seguridad | Propuesta |

---

## 14. Preguntas abiertas

| ID | Pregunta | Por qué importa | Bloquea |
|---|---|---|---|
| Q-01 | ¿Cuál es el contexto del proyecto (curso, cliente, iniciativa propia) y la capacidad de tiempo? | Define el peso del canal escolar, del piloto y de las fechas | Hitos |
| Q-02 | ¿Quién revisará el contenido como profesional (pediatra, psicólogo o especialista del sueño)? | Sin revisión no debería publicarse a escala | H7 / publicación |
| Q-03 | ¿Hay acceso a un colegio o grupo para el piloto, con autorizaciones? | Requisito ético para trabajar con menores | H7 |
| Q-04 | ¿Quién crea las ilustraciones? **Respondida (2026-11-05):** generadas con **Google Nano Banana 2.1** y **vectorizadas a SVG** (≤ 20 KB por ilustración), para cumplir 04 §10; sin distribuir ráster; registro de origen y licencia en `/licenses`. Proceso y prompts: `kitPrompts.md` (raíz). | Define estilo, costo y derechos | ~~H1~~ Respondida |
| Q-05 | ¿El rango definitivo es 13–17 o incluye 12? | Cambia tono y consentimiento | H0 |
| Q-06 | ¿Se muestra una tarjeta de apoyo si el ánimo registrado es bajo varios días seguidos? | Delicado: requiere validación profesional | v0.2 |
| Q-07 | ¿Qué líneas de ayuda de Colombia se incluyen y cuáles están vigentes? | No incluir números de memoria; verificar en fuente oficial | RF-15 |
| Q-08 | ¿Dónde se hospeda y con qué dominio? | Afecta cabeceras de seguridad (CSP) | H6 |

---

## 15. Trazabilidad (visión rápida)

| Objetivo | Requisitos | Mecánicas (`03`) | Contenido (`02`) |
|---|---|---|---|
| Entender causas y efectos | RF-03, 04, 06, 07 | MEC-01, 02, 05 | §5 grafo, §6 islas |
| Probar un cambio pequeño | RF-09, 11 | MEC-06, 07 | §6 retos |
| Ver su propio patrón | RF-11, 12 | Diario (doc. 03 §7) | — |
| Confianza y honestidad | RF-04, 16, 23 | — | §2–4 niveles y fichas |
| Seguridad y cuidado | RF-15, 17 | — | §7 protocolo |
