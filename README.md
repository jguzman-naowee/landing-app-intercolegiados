# Plantilla de prototipo Naowee — alta fidelidad sobre el SDK

Paquete de front plano (HTML/CSS/JS, sin npm ni build) para montar prototipos
de alta fidelidad con el SDK real de Naowee. Viene con **un solo perfil, App JIN** (app móvil dentro de un marco de
teléfono) y datos de demostración. Está listo para recibir el prototipo de un cliente
nuevo.

## Abrirlo

Doble clic en `index.html`: una sola página con todo embebido, funciona sin
servidor. Es el mismo archivo que se publica.

Entrada: directo al splash de la App JIN, sin selector de perfil.
`?lento` alarga las cargas simuladas a 4 s para revisar las siluetas.

| Perfil | Pantallas |
|---|---|
| App JIN | `#/` app de Juegos Intercolegiados en marco de teléfono de 428 px (Figma «JIN Landing y App», frame 153) |

## Cómo sumar un cliente / un rol

1. **Datos** — `datos.js`: en `entidad` va quién firma el prototipo (hoy
   solo Naowee). En `roles` se agrega el rol (`id`, `rol`, `nombre`,
   `iniciales`, `organizacion`, `portal`, `theme`, `color`, `descripcion`,
   `inicio`). Si usa el shell con sidebar, su menú va en `menus[id]`.
2. **Pantalla** — `pantallas/<rol>-<vista>.js` con la forma de siempre:
   `{ titulo, render(ctx), mount(root, ctx) → cleanup }`. `fullscreen: true`
   si no usa el shell (como la app del conductor); `toolbar(ctx)` opcional.
3. **Registrar** — cargar el script en `dev.html` (antes de `app.js`) y
   sumar su ruta en `RUTAS` (`app.js`).
4. **Regenerar** — `python3 publicar.py` → `index.html`.

El selector de perfil pinta solo los roles que haya en `datos.js`.
Co-branding con el logo de un cliente: la fila `.nws-brand__tenant` del
sidebar y la derecha de `.nws-mob__marca` en la app móvil están reservadas.

## Regla de alcance

Nada queda mudo. Lo que está fuera del prototipo (botones sin gancho,
paginador, secciones del menú sin pantalla) responde con un toast de una
línea, **"‹función› · Disponible próximamente"** — sale de `proximamente()` en
`app.js`: botones con `data-toast`, enlaces del menú a rutas que no están en
`RUTAS`, y una red de seguridad para cualquier control clickeable sin `data-*`.

**Es** una maqueta de alta fidelidad: carga el CSS real de
`sdk-frontend-foundations` y emite la misma anatomía que los `Nwt*` de
`sdk-react-components`. **No es** código migrable: no hay React.

## Estructura

```
index.html      LA página: todo embebido (generada — no se edita a mano)
dev.html        mesa de trabajo con archivos separados — de acá sale index.html
publicar.py     genera index.html desde dev.html (concatena y embebe)
app.css         lo que el SDK no tiene (prefijo nws-), todo en tokens
sdk.js          anatomía de los Nwt*, leída del compilado
marca.js        logo e isotipo de Naowee (SVG inline) + favicon
marca-jic.js    marca del cliente: logos JIC/MinDeporte/gov.co + íconos de redes
assets/landing/ imágenes de la landing (publicar.py las embebe como data URI)
datos.js        los datos, en JSON
app.js          sesión por rol, router por hash, shell (sidebar + toolbar)
pantallas/      landing-app.js (la App JIN)
vendor/         copia literal del dist de foundations. NO SE EDITA
```

## Flujo de trabajo

1. Editar las fuentes (`dev.html`, `app.css`, `datos.js`, `pantallas/*.js`).
   Para ver mientras se edita: `python3 -m http.server` y abrir `dev.html`.
2. `python3 publicar.py` → `index.html`.
3. Publicar `index.html` (el visor de artifacts bloquea `<link rel="stylesheet">`
   externos; por eso todo va embebido).

## Actualizar el SDK

```bash
S=~/Naowee/sdk-frontend-foundations
cp $S/dist/styles.css vendor/foundations.css
cp $S/dist/components.css $S/dist/icons.css vendor/
```
Volver a aplicar la ruta del `@font-face` en `vendor/icons.css` (→ `./icons.woff`)
y regenerar `vendor/fonts.css` desde `$S/fonts/inter.scss`.
