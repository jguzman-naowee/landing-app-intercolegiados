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
5. **Lo secundario se abre como vista, no como página.** «Regional de conjuntos» (desde
   la tarjeta de la fase regional) se abre inmersiva, a pantalla completa, con
   transición de entrada y botón de volver. Se nota el cambio de lugar.
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
| 1. Mensaje | Titular de campaña («¡Juntos llegamos más lejos!») | h1 de 36 px sobre el hero, con halo para leerse sobre el degradé |
| 2. Marca y emoción | Hero con la deportista sobre morado animado | Imagen a sangre bajo el estado y el header; fundido a blanco |
| 3. Acción | **Fase regional**: Calendario y Resultados | Una tarjeta a ancho completo, ícono + rótulo; abre «Regional de conjuntos» (regionales con ciudad y foto). Es la única salida activa de la home |
| 4. Actualidad | **Novedades**: mazo de noticias | Tarjetas deslizables, título a 2 líneas, detalle expandible |
| 5. Exploración | **Galería multimedia** | Carrusel de una foto a la vez (o cuadrícula) con badge de ciudad; tocar la foto la abre a pantalla completa con zoom |
| 6. Ayuda | **Video tutoriales** | Tarjeta con video (arranca al 50 %) y «Ver todos» |
| 7. Confianza | Cita institucional y footer | Frase de respaldo + logos sobre degradé morado |

Comparado con la web: se redujo de siete bloques de igual peso a una secuencia con
un protagonista (el mensaje y el hero) y un único bloque de acciones.

### Navegación

- **Pestañas:** Juegos (inicio, con balón), Medallas, Certificados. Las dos últimas
  aún no tienen contenido: muestran un toast corto con la fecha estimada.
- **Vistas inmersivas:** «Fase Regional» (activa): cabecera con volver; título y «Cambiar» alineados por
  arriba; subtítulo en dos líneas; panel de fases (colapsado) y pestañas Individual | Conjuntos en píldora.
  Debajo, una cuadrícula de 2 columnas con una tarjeta por regional (foto, ciudad, nombre y flecha). Dos ejes,
  como «Eventos y fases» de la web: «Cambiar» despliega el panel con la fase (Fase Regional o Fase Final
  Nacional, la actual con check) y las pestañas eligen el tipo (Individual o Conjuntos). Al cambiar de fase
  cambia el título; al cambiar cualquiera de los dos se reordena el contenido de abajo.
  Conjuntos lista las ocho regionales de la web (Pacífico, Eje Cafetero, Centro Oriente, Centro Sur, Caribe 1, Caribe 2, Amazonía y Orinoquía, con su sede); Individual lista los cuatro eventos de atletismo que reciben dos regionales cada uno (Montería, Sopó, Armenia y Villavicencio). Con una sola tarjeta (Fase Final Nacional, Bogotá) ocupa todo el espacio disponible. Tocar una
  tarjeta sigue avisando «Disponible próximamente»; no navega. Dentro de una regional, «Fase de Conjuntos» (o de Individuales) muestra los controles en la zona violeta (deporte, búsqueda, mes y género/edad) y, en una hoja sangrada de borde a borde, el calendario con los deportes fijos a la izquierda (una fila por deporte) y los días que se desplazan; cada tarjeta cae en la fila de su deporte, con Inicio y Final bajo el número del día. Los días de la cabecera solo marcan el rango; tocar una tarjeta del calendario abre el deporte con ese día. En atletismo se entra a la prueba (hits y final directa, podio y «Ver más» de cada enfrentamiento); en los deportes de conjunto, a sus pruebas por sexo y edad, con las fichas Partidos | Grupos | Posiciones y el detalle de cada partido (parciales por cuartos, tiempos o sets, y nómina). Voleibol del Pacífico y las pruebas de atletismo de Villavicencio usan datos reales de la web; marcas, parciales y nóminas son de ejemplo. Las fechas del calendario de atletismo salen de la web (Villavicencio: 26 y 27 de sept; Montería, Sopó y Armenia: 29 de sept al 2 de oct). Calendario (mes, cuadrícula, agenda
  del día, detalle) y Resultados (solo el texto «Vista de resultados») siguen en el
  código, sin camino de entrada.
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
  excepciones pedidas a mano: «Fase regional» y «Novedades» a 0, titular a 40 px.
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
