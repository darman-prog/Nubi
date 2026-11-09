# ADR 018: Escenas narrativas completas (expansión a 28 escenas en WebP HD)

**Fecha:** 2026-11-08 · **Estado:** Confirmada · **Reemplaza:** cláusula de límite de 11 escenas de `docs/adr/014-arte-webp-hd.md`

## Contexto

En el ADR 014 y la feature 001, el alcance de las escenas narrativas se recortó temporalmente a 11 piezas (2 por isla jugable y 1 para Isla Nido) como medida de contención de alcance en la fase inicial de prototipado.

En las pruebas de producto y revisión visual del flujo narrativo (`StoryStage`), las escenas 3, 4 y 5 de cada isla caen actualmente en un fallback que repite la miniatura/héroe de la isla. Esto debilita la inmersión pedagógica y el storytelling emocional guiado por Nubi.

Para ofrecer una experiencia de juego completa y atractiva a los preadolescentes (13–17 años), se requiere que cada momento de la historia cuente con su propia ilustración narrativa dedicada.

## Decisión

1. **Expansión a 28 escenas narrativas completas:**
   - **Isla Nido:** 3 escenas (llegada, viaje, promesa).
   - **Isla Reloj:** 5 escenas (síntoma, causa, necesidad, sin culpa, dato honesto).
   - **Isla Horarios:** 5 escenas (síntoma, causa, recomendación, no depende de ti, puente).
   - **Isla Ánimo:** 5 escenas (síntoma, lo notan, no es tristeza, freno, ganas).
   - **Isla Cerebro:** 5 escenas (marco, noche corta, varias noches, cuatro noches, no coinciden).
   - **Isla Taller:** 5 escenas (propuesta, hora estable, luz natural, pantallas lejos, respiración).
   - **Total:** 28 escenas (11 ya producidas + 17 nuevas).

2. **Parámetros técnicos y calidad (consistentes con ADR-014):**
   - **Formato:** WebP HD con fondo de cielo integrado.
   - **Dimensiones:** 800 px de ancho (relación 16:9).
   - **Presupuesto:** ≤ 90 KB por escena.
   - **Carga diferida:** `loading="lazy"` en `StoryStage`.
   - **Estilo:** Paleta pastel onírica derivada de `arte/ancla-estilo.jpg`, trazo limpio, sin texto incrustado y con Nubi consistente cuando aparezca.

3. **Integración progresiva en contenido:**
   - A medida que cada escena se genera y post-procesa en `arte/escenas/<slug>-<n>.webp`, se vincula en `content/islands/<slug>.json` mediante el campo `"ilustracion": "arte/escenas/<slug>-<n>.webp"`.

## Consecuencias

- **Positivas:** Experiencia narrativa 100% ilustrada sin escenas huérfanas ni repetición visual; se respeta el diseño de cada evidencia científica de `docs/02-contenido-y-evidencia.md`.
- **Negativas:** 17 generaciones adicionales y su correspondiente post-proceso de optimización WebP.
- **Mitigación:** Los prompts ya están especificados en `mockups/kitPrompts.md`; el pipeline local de compresión (`scripts/optimize_webp.py`) mantiene cada escena por debajo del límite de 90 KB.

## Alternativas descartadas

- **Mantener 11 escenas fijas:** Forzaba a repetir el arte de la isla en 17 momentos de la historia, produciendo fatiga visual y sensación de contenido incompleto.
- **Usar ilustraciones abstractas reutilizables entre islas:** Diluía la fidelidad científica de cada evidencia médica respaldada en el PRD.
