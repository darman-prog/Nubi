---
id: 004
status: cerrada
created: 2026-11-07
updated: 2026-11-07
---
# Feature 004 — Servicios Núcleo y Persistencia Local (T-03)

> `StorageService` versionado (`nubi:v1`), ajustes aplicables al DOM, exportar/importar y fallback en memoria.

## Objetivo
Que el progreso (islas, sellos derivados, cadenas) viva en el dispositivo con un contrato estable, migrable y recuperable ante datos corruptos o almacenamiento no disponible.

## Alcance
| Incluye | Excluye |
|---|---|
| `UserStateV1` en Zod + estado inicial | UI de ajustes y pasaporte (T-04/T-06) |
| `StorageService`: load/save debounce/clear/export/import/fallback/cuota | Service Worker y persistencia PWA (T-13) |
| `SettingsService`: tema, reducir animaciones, tamaño de texto, sonido | Sincronización entre pestañas |
| Pruebas unitarias de todos los caminos | Cifrado (no aplica: datos no sensibles) |

## Criterios de aceptación
| N.º | Escenario | Resultado esperado | Evidencia |
|---|---|---|---|
| 1 | Guardar y recargar | El estado vuelve íntegro | `storage.spec.ts` |
| 2 | Dato corrupto | Se respalda en `nubi:v1:corrupt` y se empieza limpio | `storage.spec.ts` |
| 3 | Cuota excedida | No lanza; sigue en memoria y marca no disponible | `storage.spec.ts` |
| 4 | Importar JSON inválido | Devuelve error y no modifica el almacenamiento | `storage.spec.ts` |
| 5 | Sin `localStorage` | Funciona en memoria con `available=false` | `storage.spec.ts` |
| 6 | Ajustes | Persisten y se aplican como atributos en `<html>` | `settings.spec.ts` |
| 7 | `npm run test/typecheck/lint/build` | Todo en verde | Salida de comandos |

- La escala de texto se persiste y aplica como atributo; el escalado visual de tokens se implementa en la UI (T-04).

## Pasos ejecutados
1. Esquema `UserStateV1` y fábrica de estado inicial.
2. `StorageService` con debounce, respaldo y fallback.
3. `SettingsService` con aplicación al DOM.
4. Pruebas y cableado en `main.tsx`.

## Cierre
- Verificado el 2026-11-07: `typecheck`, `test` (21 pruebas), `lint` y `build` en verde.
- Fallback en memoria y respaldo de datos corruptos cubiertos por pruebas.
