# Calendario Oficial (No oficial) - Copa Mundial FIFA 2026 🏆

Este proyecto es una aplicación web sencilla y rápida que permite a los usuarios suscribirse o descargar el calendario completo de los **104 partidos** de la Copa del Mundo de la FIFA 2026 en su aplicación de calendario favorita (Google Calendar, Apple Calendar, Outlook, etc.) a través del formato universal `.ics`.

## Características

- **Suscripciones Dinámicas:** Al suscribirse, cualquier cambio futuro en las fechas, sedes o equipos que avancen de ronda se sincronizará automáticamente en los dispositivos de los usuarios.
- **Generador ICS:** Un script de Node.js que toma la información estructurada de un JSON y construye un archivo `.ics` válido y compatible con múltiples zonas horarias y reglas de actualización.

## Estructura del Proyecto

- `worldcup_matchs.json`: La base de datos central de los partidos (fecha, hora en UTC, equipos, estadio, ronda, etc.).
- `generate-ics.js`: Script de Node.js que lee el `JSON` y construye/actualiza el archivo `worldcup_2026_v2.ics`.
- `index.html`, `styles.css`, `scripts.js`: Archivos de la interfaz visual del usuario.
- `worldcup_2026_v2.ics`: El archivo de calendario final que es consumido por los dispositivos.

## ¿Cómo Actualizar los Partidos?

A medida que avance el mundial y se definan los clasificados a octavos de final, cuartos, etc., sigue estos pasos:

1. **Modifica los Datos:** Abre el archivo `worldcup_matchs.json` y actualiza los campos `"team1"` o `"team2"` con los nombres reales de los países.
2. **Genera el Calendario:** Abre tu terminal y ejecuta el script para reconstruir el archivo `.ics` con los nuevos datos:
   ```bash
   node generate-ics.js
   ```
3. **Despliega en Firebase:** Sube los cambios actualizados a Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```
   *Nota: Es posible que los usuarios de Google Calendar demoren entre 12-24 horas en ver el cambio reflejado automáticamente. Los usuarios de Apple Calendar pueden forzar la recarga presionando `Cmd + R`.*

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, Vanilla JavaScript.
- **Backend / Scripting:** Node.js.
- **Hosting:** Firebase Hosting (`worldcup-calendar-2026.web.app`).

## Autor y Licencia

Desarrollado para proveer una solución simple y efectiva para todos los aficionados que no se quieren perder ni un solo partido de la Copa Mundial 2026. Datos basados en el cronograma oficial de la FIFA.

