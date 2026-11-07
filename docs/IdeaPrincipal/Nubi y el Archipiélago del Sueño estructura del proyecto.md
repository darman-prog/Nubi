# Nubi y el Archipiélago del Sueño

*Estructura del aplicativo web para que los adolescentes entiendan las causas del sueño y sus efectos*

## Concepto

Nubi, una nube mascota, guía al usuario por un **archipiélago de islas flotantes sobre nubes**. Cada isla es un tema del sueño. La información no se presenta como texto plano, sino "masticada": tarjetas, simuladores, juegos y alegorías visuales.

## El mapa: un archipiélago en el cielo

**Isla Nido (inicio):** Nubi te recibe, explica cómo navegar y te entrega tu pasaporte de viaje.

### Zona 1 · Entender el sueño (la base)

- **Isla Luna:** qué es dormir, las fases y el REM.
- **Isla Reloj:** ritmo circadiano, melatonina y por qué en la adolescencia el cuerpo se duerme más tarde.

### Zona 2 · Causas: lo que roba tu sueño

- **Isla Pantalla:** celular, redes, luz azul y notificaciones.
- **Isla Energía:** cafeína, bebidas energéticas y comidas nocturnas.
- **Isla Tormenta:** estrés, ansiedad y la mente que no se apaga.
- **Isla Horarios:** colegio temprano, desvelos de fin de semana y "jet lag social".
- **Isla Ambiente:** ruido, luz, temperatura y cama.

### Zona 3 · Efectos: lo que pasa cuando duermes poco

- **Isla Cerebro:** memoria, atención y rendimiento en el estudio.
- **Isla Ánimo:** irritabilidad, emociones y ansiedad.
- **Isla Cuerpo:** defensas, crecimiento, apetito y energía.
- **Isla Riesgo:** somnolencia, accidentes y malas decisiones.

### Zona 4 · Cómo cuidar tu sueño

- **Isla Taller:** armar tu rutina de sueño.
- **Isla Monstruos:** insomnio, apnea, sonambulismo y pesadillas, siempre con "habla con un adulto o profesional".
- **Isla Mirador:** autotest, diario de sueño y recursos confiables.

Son 13 islas, pero no hace falta lanzar todo junto: se puede empezar con las 5 o 6 más importantes y agregar el resto después.

## Cómo se navega

- **Mapa central:** las islas flotan sobre nubes y Nubi vuela de una a otra cuando tocas una.
- **Ruta sugerida, pero libre:** una línea de nubes recomienda el orden, aunque el usuario puede ir donde quiera.
- **Pasaporte:** cada isla visitada da un sello y avanza el progreso.

## Lo que hace especial al proyecto: las conexiones causa → efecto

Como el tema es *causas y efectos*, las islas se conectan con **puentes de nubes** que muestran cadenas reales. Por ejemplo:

> Pantalla de noche → baja la melatonina → duermes tarde → colegio temprano → poco sueño → cansancio y mal ánimo

El usuario puede armar esa cadena él mismo o ver cómo una decisión de la noche se refleja en las islas de efectos al día siguiente. Esto convierte la información en algo que se *entiende* y no solo se lee.

## Estructura interna de cada isla

1. **Llegada:** Nubi presenta la isla en 2 o 3 frases.
2. **Explora:** 3 a 5 tarjetas visuales, una idea por tarjeta.
3. **Juega:** simulador, mito o realidad, o un mini quiz.
4. **Conecta:** enlace a las islas relacionadas (causa o efecto).
5. **Reto real:** una acción pequeña para esa noche, y se gana el sello.

## Decisiones técnicas

- **Aplicativo web** pensado primero para celular, con modo "reducir animaciones" y buen contraste.
- **Sin cuentas ni registro:** el progreso y el diario se guardan solo en el dispositivo, lo cual cuida la privacidad de menores.
- **Fuentes visibles** en cada isla (OMS, pediatría, Sleep Foundation).

## Próximo paso propuesto

Construir un **prototipo del mapa de islas con Nubi**, que incluya la Isla Nido y una isla completa de muestra (por ejemplo la Isla Pantalla, que muestra bien el formato causa → efecto). La alternativa es ajustar primero la lista de islas antes de prototipar.
