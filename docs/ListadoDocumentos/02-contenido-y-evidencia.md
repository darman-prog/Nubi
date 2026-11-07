# 02 · Contenido y evidencia

**Versión:** 0.1 (borrador) · **Fecha:** 2026-11-05 · **Depende de:** `01-PRD.md`

> **Aviso de origen.** Todas las fichas de este documento se extrajeron del documento de bases de investigación del proyecto (revisión documental narrativa), no de las fuentes primarias. Por eso **ninguna está aprobada para publicación**: primero deben verificarse con el artículo original (estado `source_verified`) y revisarse por un profesional (estado `professional_reviewed`). Ver §9.

---

## 1. Reglas editoriales

### Voz
- Tuteo, frases cortas (promedio ≤ 20 palabras), nivel de lectura de secundaria básica.
- Explica los términos técnicos la primera vez ("amígdala: la zona del cerebro que reacciona rápido a las amenazas").
- Tono curioso y cálido. Nunca regaña, nunca amenaza, nunca promete.

### Rigor
1. **Una afirmación = una ficha de evidencia.** Sin ficha, no se publica.
2. **Lenguaje proporcional a la evidencia:**
   - Estudios de asociación → "se asocia con", "en un estudio…". Nunca "causa" ni "produce".
   - Resultados mixtos → "depende", "los estudios no coinciden".
3. **Cita siempre la población.** "En un estudio con 50 adolescentes de 14 a 17 años…". No generalices a "todos los adolescentes".
4. **Separa adolescentes de adultos.** Un hallazgo en adultos o jóvenes de 23 años no se presenta como hallazgo en adolescentes (EV-010, EV-015).
5. **Rotula el origen geográfico de las cifras.** El 68,4 % es de EE. UU. Los datos de Colombia son de universitarios (EV-020).
6. **Explicaciones simplificadas** (metáforas como "el freno de las emociones") llevan la etiqueta *explicación simplificada*.
7. **No uses el mecanismo de "luz azul", "melatonina por pantallas" ni cifras de cafeína** hasta tener fichas específicas (§8).
8. **No recomiendes** medicamentos, melatonina ni suplementos.
9. **No diagnostiques ni interpretes síntomas del usuario.**
10. **Cierres honestos:** donde los datos son mixtos, la tarjeta final lo dice ("esto no significa que trasnochar sea gratis").

### Palabras a evitar
"Causa" (en estudios de asociación), "demostrado", "siempre", "nunca", "peligroso", "adicción", "enfermedad", "trastorno" (salvo en Ayuda y con revisión).

---

## 2. Niveles de evidencia

| Nivel | Etiqueta en la interfaz | Cuándo se usa | Ícono |
|---|---|---|---|
| **E3** | **Bien establecido** | Posición oficial de una sociedad científica o hallazgo consistente en revisiones | ● (lleno) |
| **E2** | **Probable** | Estudios con adolescentes con resultados consistentes, pero pocos, pequeños o de un solo grupo | ◐ (medio) |
| **E1** | **Aún se investiga** | Resultados mixtos, hallazgos en otra población, fuente débil o interpretación que integra estudios distintos | ○ (vacío) |
| **E0** | — (no se muestra) | Sin ficha o con ficha restringida | — |

La etiqueta siempre combina **ícono + texto** (nunca solo color). Un puente muestra el nivel de su **ficha más débil**.

---

## 3. Plantilla de ficha de evidencia

```yaml
id: EV-000
claim_technical: "Afirmación precisa, tal como la sostiene la fuente"
claim_teen: "Versión para adolescente (≤ 45 palabras)"
source:
  citation: "Autores (año). Título. Revista, volumen(número), páginas."
  url: "https://…"
  source_type: "estudio-experimental | revisión | posición-oficial | fuente-clínica | dato-de-vigilancia"
population: "Quiénes participaron (edad, n, contexto)"
design: "Qué se hizo (noches, horas, laboratorio o casa)"
finding: "Qué se encontró"
limitations: "Qué no permite concluir"
level: E1 | E2 | E3
geography: "EE. UU. | Colombia | n/d"
used_in: [ISL-RELOJ, B-01]
restricted: false
status: draft | source_verified | professional_reviewed
verified_by: ""
verified_on: ""
```

**Reglas de estado:**
- `draft`: extraído del documento de bases. No publicable.
- `source_verified`: alguien leyó la fuente primaria y confirmó cita, población y hallazgo. Permitido en **piloto**.
- `professional_reviewed`: un profesional aprobó la redacción final. Requerido en **producción**.

---

## 4. Matriz de evidencia (extraída de las bases de investigación)

Todas con estado `draft`. La columna "Verificar" indica qué debe confirmarse con la fuente primaria.

### 4.1 Referencias generales y causas

| ID | Afirmación (borrador para adolescentes) | Fuente | Población / diseño | Nivel | Usada en | Verificar |
|---|---|---|---|---|---|---|
| **EV-001** | Para tu edad (13 a 18 años), se recomienda dormir entre 8 y 10 horas. | Watson et al. (2017), posición de la AASM | Posición oficial de sociedad científica | **E3** | ISL-RELOJ, MEC-04 | Cita exacta del rango |
| **EV-002** | En EE. UU., 68,4 % de los estudiantes de bachillerato duerme 7 horas o menos en las noches de colegio. | CDC, citado en Watson et al. (2017) | Dato de vigilancia, EE. UU. | **E3** (geografía: EE. UU.) | ISL-RELOJ | Año y metodología del dato CDC; **rotular "EE. UU."** |
| **EV-003** | En la pubertad el reloj biológico se corre: cambian la fase, la melatonina y la sensibilidad a la luz. Por eso te da sueño más tarde. | Carskadon et al. (2004) | Revisión sobre regulación del sueño adolescente | **E3** | ISL-RELOJ, B-01 | Que el texto de la fuente respalde cada parámetro citado |
| **EV-004** | Muchos adolescentes duermen poco y lo hacen en un momento del reloj que no es el ideal; además influyen tareas, redes y horarios del colegio. Por eso pedir "acuéstate temprano" no alcanza. | Carskadon et al. (2004) | Revisión | **E3** | ISL-RELOJ, ISL-HORARIOS, B-02 | La frase final es una conclusión de las bases: confirmar o reformular |
| **EV-005** | La AASM recomienda que los colegios empiecen a las 8:30 a. m. o más tarde. | Watson et al. (2017) | Posición oficial | **E3** | ISL-HORARIOS, B-03 | Cita exacta |
| **EV-006** | Cuando el horario de dormir cambia mucho entre semana y fin de semana, se ha visto asociación con cambios en cómo el cerebro responde a las recompensas. | Hasler et al. (2012) | Adolescentes sanos; neuroimagen; n no registrado en las bases | **E1** | ISL-HORARIOS, B-05 | n, edades, dirección exacta de la diferencia horaria |
| **EV-008** | Dormir de forma insuficiente se asocia con peor rendimiento escolar, problemas de salud psicosocial y conductas de riesgo. Faltan estudios que sigan a las mismas personas en el tiempo. | Shochat et al. (2014), revisión sistemática | Revisión | **E2** | ISL-ÁNIMO, ISL-RIESGO | Redacción de "conductas de riesgo" (ver §7) |

### 4.2 Efectos: emoción

| ID | Afirmación (borrador) | Fuente | Población / diseño | Nivel | Usada en | Verificar |
|---|---|---|---|---|---|---|
| **EV-007** | En un estudio con 50 adolescentes de 14 a 17 años, cinco noches con 6,5 horas en cama (frente a 10 horas) los dejaron más tensos, enojados y cansados. Tanto ellos como sus padres notaron más irritabilidad. | Baum et al. (2014) | 50 adolescentes de 14–17 años; 5 noches; en casa | **E2** | ISL-ÁNIMO, B-06 | Si fue asignación aleatoria; instrumentos. *Es la evidencia más clara de las bases; candidata a E3 si se suman réplicas.* |
| **EV-007b** | En ese mismo estudio no hubo diferencias en depresión. En esta edad el malestar puede verse como irritabilidad más que como tristeza. | Baum et al. (2014) | Ídem | **E2** | ISL-ÁNIMO | La segunda frase es interpretación de los autores: confirmar |
| **EV-009** | Tras dormir menos, algunas personas dijeron que les costaba más manejar emociones negativas, aunque no se vieron cambios en la actividad cerebral medida. | Tamm et al. (2019) | Un grupo joven y uno mayor (no son solo adolescentes); resonancia magnética | **E1** | ISL-ÁNIMO | Edades exactas |
| **EV-010** | En adultos se describió mayor reactividad de la amígdala tras una noche sin dormir (cercano al 60 %). | Yoo et al. (2007) | **Adultos** | **E1** | **Uso interno; no publicar como dato de adolescentes** | Todo |
| **EV-018** | *Explicación simplificada:* la corteza prefrontal actúa como un freno de la amígdala; en la adolescencia esos circuitos aún se desarrollan, y cuando el freno funciona peor hay más irritabilidad e impulsividad. | Baum et al. (2014) y marco conceptual de las bases | Modelo conceptual | **E2** (modelo) | ISL-ÁNIMO | Alinear con revisiones de neurodesarrollo |

### 4.3 Efectos: memoria

| ID | Afirmación (borrador) | Fuente | Población / diseño | Nivel | Usada en | Verificar |
|---|---|---|---|---|---|---|
| **EV-011** | Con una noche de solo 4 horas, 22 adolescentes de 14 a 16 años no recordaron significativamente peor una lista de palabras. | Kopasz et al. (2010) | 22 adolescentes de 14–16; una noche de 4 h en cama; laboratorio | **E1** | ISL-CEREBRO, MR-02 | Diseño y tarea |
| **EV-012** | Con cuatro noches de entre 9 y 5 horas en cama, 88 adolescentes sanos no mostraron diferencias en la consolidación de memoria, ni a las 4 semanas. | Voderholzer et al. (2011) | 88 adolescentes sanos; 4 noches; 9, 8, 7, 6 o 5 h | **E1** | ISL-CEREBRO | Diseño |
| **EV-013** | Tras varias noches de poco sueño, los adolescentes retuvieron peor el material de clase cuando se les evaluó días después. | Cousins et al. (2019) | Adolescentes; control de 30 con 9 h; pruebas a los 30 min y a los 3 días | **E2** | ISL-CEREBRO | n total, edades, tipo de material |
| **EV-C01** | *Afirmación compuesta:* en memoria los estudios no coinciden; parece depender de cuántas noches se duerme poco y de qué se aprende. | EV-011, EV-012, EV-013 | Síntesis | **E1** | ISL-CEREBRO, MR-02 | La explicación de por qué difieren es una **hipótesis plausible**, no probada |

### 4.4 Efectos: motivación y recompensa

| ID | Afirmación (borrador) | Fuente | Población / diseño | Nivel | Usada en | Verificar |
|---|---|---|---|---|---|---|
| **EV-014** | En jóvenes de 11 a 13 años, dormir menos y más tarde se asoció con menor activación de una zona del cerebro que anticipa la recompensa. | Holm et al. (2009) | 58 jóvenes de 11–13; actigrafía en casa + resonancia | **E1** | ISL-ÁNIMO, B-08 | Zona (núcleo caudado) |
| **EV-015** | En jóvenes de unos 23 años, una noche sin dormir aumentó la actividad de otra zona de recompensa al ganar dinero. | Mullin et al. (2013) | 27 jóvenes, edad media 23; una noche sin dormir | **E1** | **Contraste interno; no publicar como dato de adolescentes** | Todo |
| **EV-016** | La pérdida crónica de sueño y el desfase del reloj biológico se relacionan con más sensibilidad a la recompensa e impulsividad. | Logan et al. (2018) | Revisión | **E1** | ISL-RIESGO, B-09 | La app **no debe mencionar adicciones** (título de la fuente) |
| **EV-M01** | *Mensaje honesto de motivación:* los estudios miden cómo responde el cerebro a las recompensas; el efecto sobre las ganas de estudiar aún no se ha medido de forma directa. | Síntesis de EV-014…016 | Síntesis | **E1** | ISL-ÁNIMO | — |

### 4.5 Intervenciones y orientación

| ID | Afirmación (borrador) | Fuente | Población / diseño | Nivel | Usada en | Verificar |
|---|---|---|---|---|---|---|
| **EV-021a** | Mantener una hora de despertar estable, también en fines de semana, es una idea que se propone para regular el sueño. | Formación Psicoterapia (2026) | **Fuente clínica de divulgación (blog)** | **E1** | ISL-TALLER | **Sustituir por fuente primaria** |
| **EV-021b** | Buscar luz natural por la mañana y reducir la luz de las pantallas cerca de la hora de dormir. | Watson et al. (2017) / Formación Psicoterapia (2026) | Posición oficial / blog | **E1** | ISL-TALLER | **Las bases atribuyen a Watson (2017) la recomendación sobre dispositivos; confirmar en el original** |
| **EV-021c** | Un rato de baja estimulación antes de dormir, respiración lenta y escaneo corporal pueden ayudar a bajar la activación. | Formación Psicoterapia (2026) | Blog clínico, no estudio con adolescentes | **E1** | ISL-TALLER, MEC-07 | **Sustituir por fuente primaria** |
| **EV-022** | *Interpretación integrada:* dormir poco → más irritabilidad → cuesta concentrarse → estudio menos constante → se retiene peor a largo plazo. Es una lectura que une estudios distintos, no un resultado probado en una sola investigación. | Bases de investigación (integra Baum 2014, Logan 2018, Cousins 2019) | Interpretación | **E1** | C-03 | Rotular siempre como *hipótesis integrada* |
| **EV-023** | Conviene hablar con un adulto o profesional si tienes mucho sueño en el día, roncas fuerte o tienes pesadillas frecuentes. | Recomendaciones de las bases / Formación Psicoterapia (2026) | Orientación clínica | **E1** (pero de bajo riesgo y conservadora) | Ayuda, ISL-TALLER | Revisión profesional |

### 4.6 Fichas restringidas o de uso interno

| ID | Contenido | Tratamiento |
|---|---|---|
| **EV-017** | Dormir poco se asocia con síntomas depresivos, ideación suicida y conductas de riesgo (Watson et al., 2017) | **RESTRINGIDA.** No se publica como tarjeta, juego ni cifra. Solo informa el protocolo de §7 y la pantalla de Ayuda con redacción revisada. |
| **EV-019** | Fases NREM y REM y su papel en memoria y emoción (Formación Psicoterapia, 2026) | **Fuente débil.** No publicar (Isla Luna es v1.0) sin fuente primaria. |
| **EV-020** | Datos de Colombia: ~80 % de mala calidad de sueño en estudiantes de medicina (Machado 2015, citado en Aguilera Rojas et al., 2020); 58 % de "mal dormidor" en ciencias de la salud de la Universidad de Boyacá (Corredor Gamba y Polanía Robayo, s. f.); prevalencia de trastornos del sueño > 20 % en 5–17 años (Rosero Bolaños y Ortega Enríquez, 2022, según estudios previos) | **No publicar como dato de colegios.** Si se usa, rotular la población (universitarios) y el origen. |

---

## 5. Grafo de causas y efectos

### 5.1 Nodos del MVP

| ID | Nodo (texto para el usuario) | Isla |
|---|---|---|
| `N-RELOJ` | El reloj biológico se corre en la pubertad | ISL-RELOJ |
| `N-DORMIR-TARDE` | Te da sueño más tarde | ISL-RELOJ |
| `N-COLEGIO-TEMPRANO` | El colegio empieza temprano | ISL-HORARIOS |
| `N-HORARIO-CAMBIANTE` | El horario cambia mucho entre semana y fin de semana | ISL-HORARIOS |
| `N-POCO-SUENO` | Duermes menos horas de las que necesitas | ISL-HORARIOS (nodo hub) |
| `N-IRRITABILIDAD` | Más tensión, enojo e irritabilidad | ISL-ÁNIMO |
| `N-REGULACION` | Cuesta más controlar las reacciones | ISL-ÁNIMO |
| `N-RECOMPENSA` | Cambia cómo responde el cerebro a las recompensas | ISL-ÁNIMO |
| `N-IMPULSIVIDAD` | Más búsqueda de cosas intensas o impulsivas | ISL-RIESGO (v1.0; en el MVP solo como destino opcional) |
| `N-CONCENTRACION` | Cuesta más concentrarse | ISL-CEREBRO |
| `N-ESTUDIO-INCONSTANTE` | Estudias con menos constancia | ISL-CEREBRO |
| `N-RETENCION` | Recuerdas peor a largo plazo lo que estudiaste | ISL-CEREBRO |

### 5.2 Puentes (aristas) del MVP

| ID | Desde → Hacia | Nivel | Evidencia | Etiqueta honesta |
|---|---|---|---|---|
| **B-01** | `N-RELOJ` → `N-DORMIR-TARDE` | **E3** | EV-003 | "Bien establecido" |
| **B-02** | `N-DORMIR-TARDE` → `N-POCO-SUENO` | **E3** | EV-004 | "Bien establecido" |
| **B-03** | `N-COLEGIO-TEMPRANO` → `N-POCO-SUENO` | **E3** | EV-004, EV-005 | "Bien establecido" |
| **B-04** | `N-HORARIO-CAMBIANTE` → `N-DORMIR-TARDE` | **pendiente** | — | **No publicar** (falta ficha que respalde esta relación) |
| **B-05** | `N-HORARIO-CAMBIANTE` → `N-RECOMPENSA` | **E1** | EV-006 | "Aún se investiga" |
| **B-06** | `N-POCO-SUENO` → `N-IRRITABILIDAD` | **E2** | EV-007 | "Probable" |
| **B-07** | `N-POCO-SUENO` → `N-REGULACION` | **E2** | EV-007, EV-009 | "Probable" (el eslabón con adolescentes es EV-007; EV-009 es E1) |
| **B-08** | `N-POCO-SUENO` → `N-RECOMPENSA` | **E1** | EV-014 (EV-015 solo como contraste interno) | "Aún se investiga" (la dirección cambia según edad y tipo de pérdida de sueño) |
| **B-09** | `N-RECOMPENSA` → `N-IMPULSIVIDAD` | **E1** | EV-016 | "Aún se investiga" (v1.0) |
| **B-10** | `N-POCO-SUENO` → `N-RETENCION` | **E1** | EV-011, EV-012, EV-013, EV-C01 | "Aún se investiga: depende de cuántas noches" |
| **B-11** | `N-IRRITABILIDAD` → `N-CONCENTRACION` | **E1** | EV-022 | "Aún se investiga (hipótesis integrada)" |
| **B-12** | `N-CONCENTRACION` → `N-ESTUDIO-INCONSTANTE` | **E1** | EV-022 | Ídem |
| **B-13** | `N-ESTUDIO-INCONSTANTE` → `N-RETENCION` | **E1** | EV-022 | Ídem |

> **B-04 es una lección:** el ejemplo "horario cambiante → duermes tarde" parece obvio, pero las bases no lo respaldan con una ficha. Se queda en pendiente hasta tener fuente.

### 5.3 Cadenas jugables del MVP

| ID | Nombre | Eslabones | Nivel del eslabón más débil |
|---|---|---|---|
| **C-01** | Del reloj al ánimo | `N-RELOJ` → `N-DORMIR-TARDE` → `N-POCO-SUENO` → `N-IRRITABILIDAD` | **E2 · Probable** |
| **C-02** | Colegio temprano y ánimo | `N-COLEGIO-TEMPRANO` → `N-POCO-SUENO` → `N-REGULACION` | **E2 · Probable** |
| **C-03** | La cadena del estudio *(hipótesis integrada)* | `N-POCO-SUENO` → `N-IRRITABILIDAD` → `N-CONCENTRACION` → `N-ESTUDIO-INCONSTANTE` → `N-RETENCION` | **E1 · Aún se investiga** |
| **C-04** | Del fin de semana a la recompensa | `N-HORARIO-CAMBIANTE` → `N-RECOMPENSA` | **E1 · Aún se investiga** |

### 5.4 Puentes pendientes (fase 2; no usar)

| Puente deseado | Necesita |
|---|---|
| Pantalla de noche → melatonina → dormir tarde | Revisión sistemática o guía de sociedad científica con adolescentes; no basta "luz azul" |
| Cafeína o bebidas energéticas → dormir tarde | Guías pediátricas y estudios con adolescentes |
| Estrés o ansiedad → dormir mal | Estudios con adolescentes sobre hiperactivación y sueño |
| Ruido, luz, temperatura → calidad de sueño | Guías de higiene del sueño con respaldo |
| Poco sueño → defensas, crecimiento, apetito | Revisiones con población adolescente |
| Somnolencia → accidentes y decisiones | Estudios sobre conducción y somnolencia en jóvenes |

---

## 6. Contenido por isla (MVP)

Formato por isla: objetivo → tarjetas → mito o realidad → quiz → reto → conexiones. Los textos son **borradores**: se usan como punto de partida para escribir los archivos de `/content`. Cada tarjeta indica su ficha.

### ISL-NIDO · Isla Nido (inicio)

**Objetivo:** orientarse y entender cómo funciona la app.
**Guion de Nubi (3 pantallas):**
1. "¡Hola! Soy Nubi. Vivo en las nubes y me encanta entender por qué dormimos como dormimos."
2. "Cada isla es un tema. Entra a la que quieras: no hay orden obligatorio. Gana sellos por aprender y por probar cosas."
3. "Aquí no hay cuentas. Lo que guardes se queda en tu celular. Y si algo te preocupa, el botón de ayuda siempre está a un toque."

**Apodo:** "¿Cómo quieres que te llame? (puedes saltarte esto)".

### ISL-RELOJ · Isla Reloj (Zona 1)

**Objetivo de aprendizaje:** entender que dormir tarde en la adolescencia tiene una base biológica y que se necesitan 8–10 horas.

**Tarjetas (Explora):**
1. **"Tu cuerpo pide entre 8 y 10 horas."** Para tu edad, la Academia Americana de Medicina del Sueño recomienda dormir de 8 a 10 horas. *(EV-001)*
2. **"Dos relojes dentro de ti."** Uno acumula sueño mientras estás despierto: cuanto más tiempo, más ganas de dormir. El otro es el reloj biológico: marca cuándo es fácil dormir y cuándo estar alerta. *(EV-003; explicación simplificada)*
3. **"En la pubertad, el reloj se corre."** Cambian la fase del reloj, la melatonina y la sensibilidad a la luz. Por eso muchos adolescentes sienten sueño más tarde. *(EV-003)*
4. **"No es pereza."** Dormir tarde a tu edad tiene una parte biológica. Por eso decir "acuéstate temprano" no alcanza. *(EV-004)*
5. **"¿Cuántos duermen poco?"** En EE. UU., 68,4 % de los estudiantes de bachillerato duerme 7 horas o menos en las noches de colegio. En Colombia todavía hay pocos datos de colegios. *(EV-002; rotular EE. UU.)*

**Mito o realidad:**
- **MR-01** "Si te da sueño tarde es porque eres perezoso." → **Mito.** El reloj biológico se corre en la pubertad. *(EV-003, EV-004)*
- **MR-05** "Dormir de 8 a 10 horas es cosa de niños." → **Realidad: es lo que se recomienda de 13 a 18 años.** *(EV-001)*

**Mini quiz (3 preguntas):** horas recomendadas; qué cambia con la pubertad; qué es la presión de sueño. Reintentos ilimitados con explicación.

**Reto real:** "Esta noche, anota a qué hora te da sueño de verdad." *(sin afirmación de salud; alimenta el diario)*

**Conecta:** efecto de la isla → `ISL-HORARIOS` (B-02), `ISL-ÁNIMO` (vía C-01).

### ISL-HORARIOS · Isla Horarios (Zona 2)

**Objetivo:** entender que el colegio temprano y los cambios de horario se combinan con un reloj corrido, y que parte del problema no depende del adolescente.

**Tarjetas:**
1. **"Reloj corrido + colegio temprano."** Muchos adolescentes duermen poco y a una hora del reloj que no es la ideal. Las tareas, las redes y el horario del colegio se suman. *(EV-004)*
2. **"Los médicos del sueño lo saben."** La Academia Americana de Medicina del Sueño recomienda que los colegios empiecen a las 8:30 a. m. o más tarde. *(EV-005)*
3. **"Cuando el horario cambia mucho."** Si te acuestas y levantas a horas muy distintas entre semana y fin de semana, en un estudio con adolescentes se vio relación con cambios en cómo el cerebro responde a las recompensas. Todavía se investiga. *(EV-006)*
4. **"Lo que no depende de ti… y cómo hablarlo."** No controlas el horario del colegio, pero sí puedes conversar con tu familia o con orientación sobre tareas y evaluaciones concentradas en la noche. *(Recomendaciones de las bases para familias y colegios; no es afirmación de salud)*

**Mito o realidad:**
- **MR-04** "Los colegios empiezan temprano porque así debe ser." → **Realidad: una sociedad médica recomienda empezar más tarde.** *(EV-005)*

**Juego:** `MEC-04 Arma tu semana` (simulador de horas; sin afirmaciones de salud más allá de la banda de EV-001).

**Reto real:** "Elige una hora de despertar y trata de mantenerla también el fin de semana." *(EV-021a; presentarla como idea para probar)*

**Conecta:** causas ← `ISL-RELOJ`; efectos → `ISL-ÁNIMO`, `ISL-CEREBRO`.

### ISL-ÁNIMO · Isla Ánimo (Zona 3)

**Objetivo:** entender que dormir poco puede aumentar la irritabilidad y que no siempre es "tu carácter".

**Tarjetas:**
1. **"Poco sueño, más tensión."** En un estudio con 50 adolescentes de 14 a 17 años, cinco noches con 6,5 horas en cama los dejaron más tensos, enojados y cansados. *(EV-007)*
2. **"Los demás lo notan."** Tanto los adolescentes como sus padres notaron más irritabilidad y más dificultad para controlar las reacciones. *(EV-007)*
3. **"A veces no parece tristeza."** En ese estudio no hubo diferencias en depresión. A esta edad el malestar puede verse más como irritabilidad. *(EV-007b)*
4. **"El freno de las emociones."** *(Explicación simplificada)* Una zona del cerebro actúa como freno de otra que reacciona rápido a las amenazas. En la adolescencia estos circuitos aún se están desarrollando; si el freno funciona peor, aumentan la irritabilidad y las respuestas impulsivas. *(EV-018)*
5. **"¿Y las ganas?"** Los estudios miden cómo el cerebro responde a las recompensas, y los resultados cambian según la edad y el tipo de pérdida de sueño. El efecto sobre las ganas de estudiar aún no se ha medido de forma directa. *(EV-M01)*

**Mito o realidad:**
- **MR-03** "Con 6 horas y media estás bien." → **Mito, en un estudio.** Con cinco noches a 6,5 horas, los adolescentes se sintieron más tensos, enojados y cansados. *(EV-007)*
- **MR-06** "Si estás irritable siempre, es tu carácter." → **No siempre.** Dormir poco puede aumentar la irritabilidad; vale la pena revisar cómo estás durmiendo antes de culparte. *(EV-007)*

**Quiz:** 3 preguntas (qué se midió, qué no se encontró, qué significa "aún se investiga").

**Reto real:** "Mañana, al registrar tu diario, anota también cómo te sentiste." *(conecta con RF-11)*

**Conecta:** causas ← `ISL-HORARIOS`, `ISL-RELOJ` (C-01, C-02); efecto → `ISL-CEREBRO` (C-03).

### ISL-CEREBRO · Isla Cerebro (Zona 3)

**Objetivo:** aprender a leer evidencia mixta y entender que el efecto en memoria depende de cuántas noches y de qué se aprende.

**Tarjetas:**
1. **"Tres momentos de la memoria."** Primero se aprende (codificar), luego el cerebro lo guarda mientras duermes (consolidar) y después lo recuerdas. El poco sueño puede interferir en cualquiera. *(Marco conceptual; explicación simplificada)*
2. **"Una noche corta: poco efecto en el laboratorio."** En un estudio con 22 adolescentes de 14 a 16 años, una noche de 4 horas no cambió de forma significativa el recuerdo de una lista de palabras. *(EV-011)*
3. **"Varias noches seguidas: otra historia."** En otro estudio, tras varias noches de poco sueño los adolescentes retuvieron peor el material de clase cuando se les evaluó días después. *(EV-013)*
4. **"Cuatro noches tampoco se notó."** En otro estudio con 88 adolescentes y entre 5 y 9 horas en cama, no se vieron diferencias en memoria, ni a las 4 semanas. *(EV-012)*
5. **"¿Por qué no coinciden?"** Los estudios cambian en cuántas noches restringen, qué miden (palabras sueltas o contenido de clase) y qué edades tienen. Es una explicación posible; ningún estudio la probó directamente. *(EV-C01)*
6. **Cierre obligatorio:** "Esto no significa que trasnochar sea gratis: en la Isla Ánimo mira qué pasó con la tensión y el enojo." *(regla editorial 10)*

**Mito o realidad:**
- **MR-02** "Una noche corta borra todo lo que estudiaste." → **Depende.** En un estudio con una noche de 4 horas no se vio efecto en el recuerdo de palabras; con varias noches, otro estudio sí vio peor retención de lo estudiado en clase. *(EV-011, EV-013, EV-C01)*

**Juego:** `MEC-05 Detective de estudios`.

**Reto real:** "Escribe tus próximas 2 evaluaciones y cuántas horas planeas dormir la noche anterior." *(planificación; sin afirmación de salud)*

**Conecta:** causas ← `ISL-HORARIOS`, `ISL-ÁNIMO`; cadena C-03.

### ISL-TALLER · Isla Taller (Zona 4)

**Objetivo:** convertir lo aprendido en un experimento personal de una semana.

**Contenido:**
- **Mensaje de encuadre:** "Estas son ideas para probar, no una receta. Si algo no te funciona, es normal."
- **Experimentos disponibles** (elige hasta 3):
  1. Mantener una hora de despertar parecida entre semana y fin de semana. *(EV-021a)*
  2. Buscar luz natural por la mañana. *(EV-021b)*
  3. Dejar el celular y otras pantallas lejos de la cama. *(EV-021b; verificar cita)*
  4. Un rato tranquilo antes de dormir (sin pantallas ni discusiones). *(EV-021c)*
  5. Respiración lenta con Nubi (`MEC-07`). *(EV-021c)*
- **Banda de referencia:** 8–10 horas para tu edad. *(EV-001)*
- **Después de 7 días:** Nubi muestra tu diario y pregunta qué notaste, sin juicios.

**Mito o realidad:** ninguno (evitar sobrecargar).

**Conecta:** todas las islas de causas y efectos; **Ayuda** (EV-023).

---

## 7. Protocolo de temas sensibles

| Tema | Regla |
|---|---|
| **Depresión, ideación suicida, autolesión** | No publicar cifras ni tarjetas sobre su relación con el sueño (EV-017). No gamificar. Si se menciona, solo en **Ayuda**, con redacción revisada por un profesional y guiada por buenas prácticas de comunicación segura. Nunca describir métodos. |
| **Conductas de riesgo** | Formular en términos generales ("tomar decisiones más impulsivas"). No mencionar sustancias ni adicciones (título de EV-016). |
| **Trastornos del sueño** (apnea, insomnio, parasomnias, piernas inquietas) | No explicar síntomas para autodiagnóstico. Dar señales para **hablar con un adulto o profesional** (EV-023). La Isla Monstruos es v1.0 y requiere revisión profesional obligatoria. |
| **Medicación, melatonina, suplementos** | La app **no recomienda ni desaconseja productos**. Si el usuario pregunta, Nubi dice que eso se habla con un médico. |
| **Autotest** | Solo con instrumentos **validados para adolescentes**. Los cuestionarios mencionados en las bases (Índice de Calidad de Sueño de Pittsburgh y escala de Epworth) son de uso clínico: no usarlos como autotest hasta confirmar versiones validadas para la edad y el idioma. |
| **Diario con ánimo bajo repetido** | Decisión pendiente (Q-06). Si se implementa, una tarjeta suave que sugiere hablar con un adulto de confianza y enlaza a Ayuda; sin diagnóstico ni alarmas. Requiere validación profesional. |
| **Líneas de ayuda** | No incluir números de memoria. Solo los verificados en fuente oficial de Colombia (Q-07). |
| **Aviso general** | "Esta app informa y no reemplaza a un profesional de la salud." Visible en Ayuda y Acerca. |

**Pantalla de Ayuda ("Hablar con un adulto"):**
- Mensaje: "No tienes que resolver esto solo."
- Señales para consultar: mucho sueño durante el día, ronquido fuerte, pesadillas frecuentes, sentirte mal de forma intensa o por muchos días.
- Qué hacer: hablar con un adulto de confianza (familia, docente, orientación) o con un profesional de la salud.
- Línea de ayuda: `TODO(verificar fuente oficial)`.

---

## 8. Islas pendientes de evidencia

| Isla | Qué falta | Tipo de fuente aceptable |
|---|---|---|
| Pantalla | Efecto de pantallas, redes y notificaciones sobre hora de dormir y duración; mecanismo de la luz azul (es de lo más debatido) | Revisiones sistemáticas con adolescentes; guías de sociedades pediátricas o de sueño |
| Energía | Cafeína, bebidas energéticas, comidas nocturnas | Guías pediátricas; estudios con adolescentes |
| Tormenta | Estrés y ansiedad vs. sueño | Revisiones; guías clínicas |
| Ambiente | Ruido, luz, temperatura, cama | Guías de higiene del sueño |
| Cuerpo | Defensas, crecimiento, apetito | Revisiones con población adolescente |
| Riesgo | Somnolencia, accidentes, decisiones | Estudios en jóvenes conductores o seguridad vial |
| Luna | Fases del sueño, REM | Fuente primaria o libro de texto, no blogs |
| Monstruos | Insomnio, apnea, sonambulismo, pesadillas | Guías clínicas pediátricas, revisión profesional obligatoria |
| Mirador | Autotest | Instrumentos validados para adolescentes y en español |

**Criterios de aceptación de una fuente:**
1. Prioridad: sociedades científicas (por ejemplo AASM), revisiones sistemáticas, estudios revisados por pares, organismos de salud (OMS, entidades pediátricas).
2. Debe indicar población y diseño. Si no es de adolescentes, se rotula.
3. Evitar blogs, sitios comerciales y páginas sin autoría verificable.
4. Las fuentes de divulgación solo orientan; no respaldan afirmaciones de eficacia.
5. Toda fuente nueva se registra con su ficha `EV-xxx` antes de usarse.

---

## 9. Flujo de revisión y compuertas

```
draft → source_verified → professional_reviewed
```

| Entorno | Estado mínimo exigido |
|---|---|
| Desarrollo | `draft` (con marca visible "BORRADOR" en la interfaz) |
| Piloto con adolescentes | `source_verified` + acompañamiento de un adulto |
| Producción pública | `professional_reviewed` |

El **validador de contenido** (RF-23) lee el estado de cada ficha y bloquea la build que supere lo permitido para el entorno.

**Tareas de verificación inmediatas** (para pasar de `draft` a `source_verified`):
1. Abrir cada artículo de la matriz §4 y confirmar cita, población, n y hallazgo.
2. Confirmar la atribución a Watson et al. (2017) de las recomendaciones sobre dispositivos electrónicos.
3. Reemplazar EV-021a/b/c y EV-019 por fuentes primarias.
4. Confirmar el año y la metodología del dato CDC (EV-002).
5. Completar los campos "n" y edades faltantes (EV-006, EV-009, EV-013, EV-014).
