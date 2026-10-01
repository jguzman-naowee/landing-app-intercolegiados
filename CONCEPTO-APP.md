# App JIN — marco de concepto

De una web responsive a una aplicación: qué se cambió, por qué, y las reglas para
no volver atrás. Parte de la landing pública de Juegos Intercolegiados (la que se ve
en el celular, con header, hamburguesa y banners apilados) y llega a la App JIN de
este repo.

> Base de este documento: la landing original (capturas de Jorge), los 82
> comentarios de diseño resueltos en `design-comments-done.md` y el código de la
> carpeta. Lo que no se probó en pantalla está marcado como pendiente al final.

---

## 1. La idea en una frase

**Una web responsive te muestra todo el contenido en una página larga. Una app te
lleva a un lugar a la vez.** La App JIN deja de ser «el sitio, achicado» y pasa a ser
un producto con entrada, navegación propia, jerarquía clara y respuesta al toque.

## 2. Por qué la primera versión se sentía web

| Señal | En la landing original | Qué comunica |
|---|---|---|
| Cabecera | Barra blanca fija con logo, botón «Iniciar sesión ↗» y hamburguesa | Un sitio con menú desplegable |
| Navegación | Todo por scroll; secciones apiladas sin orden de importancia | No hay «dónde estoy» |
| Banners | El texto vive **dentro** de la imagen («La edición 2026… ¡ya arranca!», «Consulta nuestros videotutoriales») | Es un folleto, no una interfaz |
| Un solo acceso | «Conoce más» con una única tarjeta de Calendario centrada | Contenido suelto, sin sistema |
| Listas | «Otras noticias» con miniatura + título + «ver más →» | Patrón de blog |
| Enlaces | «ver más», «Iniciar sesión», redes: todos salen del sitio | Nada se resuelve adentro |
| Pie | Logos, URL, íconos de redes, franja gov.co al final de la página | Pie de página institucional |
| Ritmo | Márgenes y tamaños distintos en cada bloque | Sin escala tipográfica ni de espacio |

Ninguna de estas piezas está mal en una web. Juntas, en un teléfono, delatan que es
una web.

## 3. Principios del cambio

1. **Entrada con intención.** La app abre con un splash propio (imagen de marca,
   logo que crece, barra de progreso). Hay un momento de «entrar», no un salto a una
   página.
2. **Navegación abajo, al alcance del pulgar.** La hamburguesa desaparece. Una barra
   de pestañas fija (Juegos · Medallas · Certificados) dice dónde estás y a dónde
   puedes ir.
3. **Un nivel de importancia por pantalla.** Primero lo que se quiere que la persona
   haga o sepa; después lo que explora; al final lo institucional.
4. **Texto real, no texto en imagen.** Titulares, rótulos y botones son texto de la
   interfaz: se leen, escalan y se pueden traducir. Las imágenes solo ilustran.
5. **Lo secundario se abre como vista, no como página.** Calendario y Resultados se
   abren inmersivos, a pantalla completa, con transición de entrada y botón de volver.
   Se nota el cambio de lugar.
6. **Todo responde al toque.** Presión visible en tarjetas y botones, toasts dentro
   del teléfono, nada «muerto». Lo que aún no existe contesta «Disponible
   próximamente» en vez de quedarse mudo.
7. **Cromo que desaparece.** El header flota transparente sobre el hero y solo se
   vuelve material (vidrio) cuando hay contenido debajo.
8. **Un sistema, no piezas.** Tokens, una escala tipográfica y un ritmo vertical
   único. Si algo no sale de ahí, hay que justificarlo.

## 4. Jerarquía de la información (Inicio)

De arriba abajo, de lo más importante a lo más institucional:

| Nivel | Qué | Cómo se resuelve |
|---|---|---|
| 1. Mensaje | Titular contextual («¡Ya jugamos la fase regional!») | h1 de 36 px sobre el hero, con halo para leerse sobre el degradé |
| 2. Marca y emoción | Hero con la deportista sobre morado animado | Imagen a sangre bajo el estado y el header; fundido a blanco |
| 3. Acción | **Competencias**: Calendario y Resultados | Dos tarjetas a ancho completo, ícono + rótulo, abren vistas inmersivas |
| 4. Actualidad | **Novedades**: mazo de noticias | Tarjetas deslizables, título a 2 líneas, detalle expandible |
| 5. Exploración | **Galería multimedia** | Mosaico con badge de ciudad |
| 6. Ayuda | **Video tutoriales** | Tarjeta con video (arranca al 50 %) y «Ver todos» |
| 7. Confianza | Cita institucional y footer | Frase de respaldo + logos sobre degradé morado |

Comparado con la web: se redujo de siete bloques de igual peso a una secuencia con
un protagonista (el mensaje y el hero) y un único bloque de acciones.

### Navegación

- **Pestañas:** Juegos (inicio, con balón), Medallas, Certificados. Las dos últimas
  aún no tienen contenido: muestran un toast corto con la fecha estimada.
- **Vistas inmersivas:** Calendario (mes, cuadrícula, agenda del día, detalle) y
  Resultados (por ahora, solo el texto «Vista de resultados»).
- **Sin enlaces que saquen de la app**, salvo el de la lista de videos de YouTube.

## 5. Reglas del sistema

### Tipografía (Google Sans)

| Uso | Tamaño | Peso |
|---|---|---|
| Titular (h1) | 36 / 38 | Bold |
| Título de sección (h2) | 24 | Bold |
| Título de tarjeta / rótulo | 16–18 (noticias 21) | Semibold–Bold |
| Texto corrido y secundario | 14 mínimo | Regular |
| Badges | 13 | Semibold |
| Pestañas | 16 | Medio |

Regla dura: **nada por debajo de 14 px** salvo badges (13). Los títulos de tarjeta
nunca por debajo de 16.

### Espacio

- Margen lateral de la pantalla: **24 px**.
- Entre un título y su contenido: variable `--nws-gap-titulo` (20 px). Hoy tiene
  excepciones pedidas a mano: «Competencias» y «Novedades» a 0, titular a 40 px.
- Tarjetas: radio grande (`--naotech-radius-xxl`), sombra suave, fondo blanco.
- Toque mínimo: 44 px.

### Color y contraste

- Violeta de marca para titular, acentos y borde de video; amarillo y naranja de
  apoyo; fondo de app neutro.
- Texto sobre degradé: no se ajusta el degradé, se le da **presencia al texto**
  (halo blanco). Se probó mover el fundido y se descartó: se prefirió ver el hero
  junto al titular.
- Sobre fotos: velo oscuro en la parte inferior de la tarjeta y texto blanco.

### Movimiento

- Entrada escalonada de Inicio (titular, tarjetas, mazo), solo `transform` y
  `opacity`.
- Hero con luces y figuras en CSS/SVG, zoom suave de la deportista, logo del splash
  que crece de 130 a ~220 px.
- Todo respeta `prefers-reduced-motion`.
- Vistas inmersivas: entrada tipo *push* de unos 300 ms.

### Feedback

- Toasts dentro del teléfono: negros, entran desde arriba, una línea de título y una
  de dato.
- Presión visible (`nws-ios-press`) en tarjetas, teselas y botones.

## 6. Qué hace que deje de parecer web (checklist)

Antes de dar una pantalla por buena, que cumpla:

- [ ] ¿Hay un solo mensaje principal y se lee en 2 segundos?
- [ ] ¿La navegación está abajo y dice dónde estoy?
- [ ] ¿Los textos son interfaz, no imagen?
- [ ] ¿Lo secundario se abre como vista (con entrada y «volver»), no como scroll?
- [ ] ¿Todo lo tocable responde, o avisa que aún no existe?
- [ ] ¿Cada tamaño sale de la escala y cada espacio del ritmo?
- [ ] ¿Funciona con movimiento reducido?
- [ ] ¿Nada queda hardcodeado a un tenant (colores, textos, logos)?

## 7. Cómo se trabajó

1. Se partió del Figma «JIN Landing y App» y del SDK de Naowee (foundations + `Nwt*`).
2. Cada ajuste se pidió **sobre la pantalla**, con el overlay de comentarios
   (`tune-exp`), con selector, tamaño y estilo capturados. Fueron más de 80 en dos
   días.
3. Cada comentario se resolvió con su propio agente, se regeneró `index.html` y se
   marcó como resuelto, con nota de qué se hizo.
4. Lo que el SDK no tiene se compone con tokens (clases `nws-*`): el header
   flotante, el hero, el mazo, la tabbar iOS, las vistas inmersivas.

## 8. Pendiente y supuestos

- **Contenido de ejemplo:** eventos del calendario, ciudades de la galería (salvo
  Florencia), fechas de los toasts y titulares cortos de noticias son inventados;
  están marcados como ejemplo en `datos.js`. Reemplazar por datos reales.
- **Medallas, Certificados y Resultados** aún no tienen contenido propio.
- **Sin verificar en pantalla:** abrir las vistas desde las tarjetas, los toasts de
  las pestañas, el header con efecto vidrio al hacer scroll, la tarjeta de video y la
  galería bajo el scroll.
- **Inconsistencia a decidir:** los títulos ya no están todos a 20 px de su
  contenido (por comentarios puntuales). Conviene fijar una regla única.
- **Texto del título del video:** «Conoce cómo usar la plataforma» es una versión
  gramatical que se eligió; falta confirmación.
- **Prototipo, no producto:** es HTML/CSS/JS plano sobre el CSS real del SDK. No es
  código migrable a React.
