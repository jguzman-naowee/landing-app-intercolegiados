/* Notas del modo dev (DC-084): UI, lógica y traducción a Flutter por sección de Inicio.
   Solo el prototipo las lee; `backticks` se pinta como código y `codigo` es Dart. */
window.LANDING_DEV = {

  header: {
    titulo: 'Header flotante',
    ui: [
      'Barra de app (no navbar web): logo + perfil. Nivel 1: marca y sesión siempre a la vista.',
      'Flota sobre el hero, sin fondo propio hasta que haya contenido debajo.'
    ],
    logica: [
      'Transparente con logo blanco; pasado ≈ 64 % del hero pasa a vidrio (blur + borde) y suma 8 px.',
      'Lo decide el `scroll` de `#lp-scroll` (`onScroll`); transición de 240 ms.'
    ],
    flutter: {
      widgets: [
        '`Scaffold(extendBodyBehindAppBar: true)` + `CustomScrollView` con `SliverAppBar(pinned: true)`, o un header propio dentro de un `Stack`.',
        '`ScrollController` + `ValueNotifier<bool>` para el umbral; vidrio con `ClipRect` + `BackdropFilter(filter: ImageFilter.blur(...))`.',
        '`SafeArea` o `MediaQuery.of(context).padding.top` para la barra de estado.'
      ],
      tip: 'Escuchá el scroll con un `ValueNotifier` y un `ValueListenableBuilder`: se reconstruye solo el header, no toda la página.',
      codigo: [
        'final vidrio = ValueNotifier(false);',
        'controller.addListener(() => vidrio.value = controller.offset > umbral);',
        'ValueListenableBuilder<bool>(',
        '  valueListenable: vidrio,',
        '  builder: (_, v, __) => v',
        '      ? ClipRect(child: BackdropFilter(',
        '          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16), child: barra))',
        '      : barra);'
      ].join('\n')
    },
    medidas: [
      'Barra de estado 44 px + barra 64 px (72 px en vidrio); logo 158×58; perfil de 44 px con ícono de 24.',
      'Vidrio: fondo blanco al 66 %, `blur(16px) saturate(1.4)`, borde inferior violeta-700 al 12 %.',
      'Capa `absolute` arriba con `z-index: 4`; el contenido corre por debajo.'
    ]
  },

  hero: {
    titulo: 'Hero · portada animada',
    ui: [
      'Entrada a sangre tras el estado y el header: el momento emocional (nivel 1). Pantalla, no banner.',
      'Escena vectorial animada + deportista recortada + fundido a blanco.'
    ],
    logica: [
      'Figuras en bucle CSS (6–20 s); la deportista hace un zoom suave de 10 s.',
      'Un `IntersectionObserver` pausa todo fuera de pantalla; con «reducir movimiento» se apaga.',
      'Toda la portada es un botón: «Inscripciones» (hoy, aviso).'
    ],
    flutter: {
      widgets: [
        '`Stack` + `Positioned` para escena, deportista y titular; fundido con `ShaderMask` (`BlendMode.dstIn`) + `LinearGradient`.',
        'Escena: `AnimationController..repeat(reverse: true)` con `Transform`/`ScaleTransition`, o `CustomPaint` para las figuras.',
        'Pausa fuera de pantalla: `VisibilityDetector` (paquete `visibility_detector`) + `TickerMode(enabled: ...)`.'
      ],
      tip: 'Un solo `AnimationController` mueve varias figuras con `Tween` distintos; pausalo con `TickerMode`, sin destruirlo.',
      codigo: [
        'Stack(children: [',
        '  const EscenaAnimada(),',
        '  Positioned(left: 40, bottom: 132, width: 328, child: ShaderMask(',
        '    blendMode: BlendMode.dstIn, child: Image.asset(Imagenes.deportista),',
        '    shaderCallback: (r) => const LinearGradient(begin: Alignment.topCenter,',
        '      end: Alignment.bottomCenter, colors: [Colors.black, Colors.transparent],',
        '      stops: [.54, .78]).createShader(r))),',
        ']);'
      ].join('\n')
    },
    medidas: [
      'Alto 660 px, sin padding superior; el cuerpo sube sobre su base con `margin-top: -237px`.',
      'Deportista: 328 px de ancho, a 40 px del borde izquierdo y 132 px del fondo; máscara 54 % → 78 %.',
      'Escena: máscara 46 % → 73 %; sol de 300 px, balón de 92; deriva 11 y 18 s; zoom de la deportista 1 → 1,06.'
    ]
  },

  titular: {
    titulo: 'Titular',
    ui: [
      'Mensaje de campaña en texto real, centrado sobre el fundido. Nivel 1, junto al hero.'
    ],
    logica: [
      'Sin gestos. Entra con la home: sube y aparece en 620 ms.'
    ],
    flutter: {
      widgets: [
        '`Text` con `TextAlign.center`; interlineado con `height: 38 / 36` y `letterSpacing: -0.72` (en px, no en em).',
        'Trazo: un segundo `Text` debajo con `foreground: Paint()..style = PaintingStyle.stroke`; halo con `TextStyle.shadows`.'
      ],
      tip: 'En `TextStyle`, `color` y `foreground` son excluyentes: armá una base sin color y derivá dos estilos con `copyWith`.',
      codigo: [
        'final base = TextStyle(fontSize: 36, height: 38 / 36, letterSpacing: -0.72,',
        '    fontWeight: FontWeight.w700);',
        'Stack(children: [',
        '  Text(titular, textAlign: TextAlign.center, style: base.copyWith(foreground: Paint()',
        '    ..style = PaintingStyle.stroke..strokeWidth = 3..color = Colors.white)),',
        '  Text(titular, textAlign: TextAlign.center, style: base.copyWith(color: violeta)),',
        ']);'
      ].join('\n')
    },
    medidas: [
      '36/38 px, bold 700, `letter-spacing: -0.02em` (-0,72 px), color `--nws-jic-violeta-titular`.',
      'Margen 0 24 40 px; trazo de 3 px blanco al 85 % y halo de hasta 60 px.'
    ]
  },

  competencias: {
    titulo: 'Competencias',
    ui: [
      'Accesos principales: Calendario y Resultados. Nivel 2: lo que el usuario viene a hacer.',
      'Tarjetas de acceso de app (ícono + rótulo + toque), no un menú de enlaces.'
    ],
    logica: [
      'Con `landing.app.salidas` activo, push de ≈ 300 ms a una vista inmersiva; hoy solo avisa.',
      'Presión inmediata: escala .97 y brillo en 100 ms.'
    ],
    flutter: {
      widgets: [
        '`Row` de dos `Expanded` con `SizedBox(width: 12)`, o `GridView.count(crossAxisCount: 2, shrinkWrap: true)`.',
        'Tarjeta: `Material` + `InkWell`, o `GestureDetector` + `AnimatedScale(scale: pulsado ? .97 : 1)` para la presión estilo iOS.',
        'Ícono en círculo: `Container` con `BoxDecoration(shape: BoxShape.circle)`; sombra con `BoxShadow`.'
      ],
      tip: 'Para un look iOS usá `GestureDetector` + `AnimatedScale`: la onda de `InkWell` se siente de Material.'
    },
    medidas: [
      'Título 24/32 bold. Rejilla de 2 columnas, gap 12, margen lateral 24.',
      'Tarjeta: alto mín. 72, padding 12/10/12/12, radio 20 (`--naotech-radius-xxl`), sombra `--nws-sombra-1`.',
      'Rótulo 18/22 semibold violeta-900; ícono en círculo de 40 px con glifo de 28.'
    ]
  },

  novedades: {
    titulo: 'Novedades · mazo de noticias',
    ui: [
      'Mazo de tarjetas apiladas: manda la de adelante, las de atrás asoman. Nivel 2: contenido vivo.',
      'Gesto + tarjeta, no un carrusel de web con flechas ni puntos.'
    ],
    logica: [
      'La de adelante sigue al dedo 1:1; su foto va más lenta (parallax de 30 px).',
      'Soltada a más de 90 px o 0,5 px/ms, sale y pasa al fondo; si no, vuelve con resorte.',
      'Autopaso cada 5 s; se pausa al tocar, fuera de pantalla o con «reducir movimiento».'
    ],
    flutter: {
      widgets: [
        '`Stack` de `Positioned` (una por carta) con `GestureDetector(onHorizontalDragUpdate/End)`; el arrastre va en `Transform.translate`.',
        'Resorte al soltar: `AnimationController.animateWith(SpringSimulation(...))`, o `AnimatedPositioned` con `Curves.easeOutBack`.',
        'Detalle con foto compartida: `Hero` + `Navigator.push(PageRouteBuilder)`; alternativa `OpenContainer` (paquete `animations`).',
        'Sin hacerlo a mano: `PageView.builder` con `viewportFraction`, o un swiper de cartas (`flutter_card_swiper`, `appinio_swiper`: verificar).',
        'Autopaso: `Timer.periodic` cancelado en `dispose`, con `VisibilityDetector` y `MediaQuery.of(context).disableAnimations`.',
        'Botón: `FilledButton` con `styleFrom(minimumSize: Size(224, 56))`.'
      ],
      tip: 'Guardá el arrastre en un `ValueNotifier<double>` y derivá de él escala y posición de las cartas de atrás.',
      codigo: [
        'GestureDetector(',
        '  onHorizontalDragUpdate: (d) => dx.value += d.delta.dx,',
        '  onHorizontalDragEnd: (d) {',
        '    final sale = dx.value.abs() > 90 || d.primaryVelocity!.abs() > 500;',
        '    sale ? avanzar(dx.value.sign) : volver(); // volver() = resorte',
        '  },',
        '  child: Stack(children: cartas.reversed.map(construirCarta).toList()),',
        ')'
      ].join('\n')
    },
    medidas: [
      'Mazo: alto 460, margen lateral 24; cartas de 303 px de ancho, radio 20, sombra `--nws-sombra-2`.',
      'Altura 437 / 382 / 318, desfase izquierdo 0 / 36 / 72, brillo 1 / .92 / .84.',
      'Titular de carta 21/26 bold, máx. 2 líneas; fecha 14/20; compartir: círculo de 36 px a 14 px del borde.',
      'Botón: 56 px de alto, semibold, violeta-titular; 24 px de aire arriba. Sección a 40 px de Competencias.'
    ]
  },

  galeria: {
    titulo: 'Galería multimedia',
    ui: [
      'Por defecto, carrusel «una a la vez»: una foto cuadrada por vez con dots debajo, como Instagram o las historias de WhatsApp. Pedido del Director Ejecutivo.',
      'A la derecha del título, un control de dos opciones (una a la vez / cuadrícula). La cuadrícula es el mosaico de columnas alternadas de antes.',
      'La ciudad va en un badge sobre cada foto, en las dos vistas.'
    ],
    logica: [
      'Carrusel con `scroll-snap` (`mandatory`, `stop: always`): una foto por gesto; los dots siguen al scroll y el activo es una pastilla.',
      'Tocar la foto avanza a la siguiente y, desde la última, vuelve a la primera. Los dots y las flechas ←/→ también navegan.',
      'Tocar una tesela de la cuadrícula abre el carrusel en esa foto, sin animación de scroll. No es una salida: nada navega.',
      'La vista elegida vive solo en memoria: cada carga arranca en carrusel. El cambio de vista es un fundido de 200 ms (sin animación con «reducir movimiento»).'
    ],
    flutter: {
      widgets: [
        'Carrusel: `SizedBox(height: 392)` + `PageView.builder` con `PageController(viewportFraction: 1)`; cada página, `AspectRatio(aspectRatio: 1)` + `ClipRRect(borderRadius: BorderRadius.circular(20))`. `PageView` no tiene alto propio: sin `SizedBox` o `Expanded` falla.',
        'Márgenes: `Padding(horizontal: 18)` fuera del `PageView` y `Padding(horizontal: 6)` por página dan foto de 380 y 12 entre fotos, igual que el prototipo.',
        'Foto: `Image.network(fit: BoxFit.cover, alignment: Alignment(x, y))`, donde `x = 2 * pos - 1` (el `pos` del prototipo en porcentaje). Badge con `Positioned(left: 8, bottom: 8)`.',
        'Tocar para avanzar: `GestureDetector` o `InkWell` con `controller.nextPage(duration:, curve:)`; en la última, `controller.animateToPage(0, duration:, curve:)`. Con `MediaQuery.disableAnimationsOf(context)` usar `jumpToPage`.',
        'Dots: `Row` de `AnimatedContainer` (ancho 8, o 20 el activo) dentro de un `SizedBox(width: 24, height: 44)` tocable, con `Semantics(label: ..., selected: ...)`; o el paquete `smooth_page_indicator` (verificar).',
        'Toggle: `SegmentedButton<VistaGaleria>` (Material 3) con `ButtonSegment(icon:, tooltip:)` y `selected: {vista}`, o `ToggleButtons`.',
        'Cuadrícula: `ListView.builder(scrollDirection: Axis.horizontal)` con una `Column` de 2 teselas por columna. `GridView.builder` sirve si las teselas son iguales; para alturas alternadas, `flutter_staggered_grid_view` (verificar).',
        'Fundido entre vistas: `AnimatedSwitcher(duration: Duration(milliseconds: 200))` con una `ValueKey` por vista.'
      ],
      tip: 'Guardá el índice en el estado de la pantalla y creá el `PageController(initialPage: indice)` al montar el carrusel: con la cuadrícula visible el `PageView` no existe y `jumpToPage` fallaría.',
      codigo: [
        'PageView.builder(',
        '  controller: PageController(viewportFraction: 1, initialPage: indice),',
        '  itemCount: fotos.length,',
        '  onPageChanged: (i) => setState(() => indice = i),',
        '  itemBuilder: (_, i) => GestureDetector(',
        '    onTap: avanzar, // nextPage; en la última, animateToPage(0)',
        '    child: Padding(padding: const EdgeInsets.symmetric(horizontal: 6),',
        '      child: AspectRatio(aspectRatio: 1, child: FotoConCiudad(fotos[i])))),',
        ');'
      ].join('\n')
    },
    medidas: [
      'Foto cuadrada de 380 px (margen lateral 24), radio 20, sombra `--nws-sombra-1`, 12 px entre fotos.',
      'Dots: punto de 8 px, activo en pastilla de 20×8, violeta-700; área táctil de 24×44. Van a unos 16 px de la foto.',
      'Control de vista: dos botones de 44 px (círculo visible de 40), ícono de 22, borde de 1 px gray-300, pastilla; activo en violeta al 12 %.',
      'Título y control en una fila; 20 px hasta la foto. Cuadrícula: columnas de 166 px (205 + 150, alternadas), gap 16, 14 entre filas.',
      'Badge: 13/16 semibold, padding 4/8, pastilla violeta-700 al 88 %, a 8 px de la esquina inferior izquierda. Sección a 48 px de la anterior.'
    ]
  },

  video: {
    titulo: 'Video tutoriales',
    ui: [
      'Tarjeta compacta: video corto + enlace «Ver todos». Nivel 3: ayuda y formación.',
      'Mini-reproductor mudo, no un embed de web con controles.'
    ],
    logica: [
      'Arranca al 50 % de su duración y al terminar vuelve al 50 % (no al 0).',
      'Corre con ≥ 40 % visible (`IntersectionObserver`) y se pausa al salir; sin sonido.',
      'Con «reducir movimiento» no reproduce.'
    ],
    flutter: {
      widgets: [
        '`video_player`: `VideoPlayerController.asset(...)` o `.networkUrl(Uri.parse(...))`, `setVolume(0)`, `setLooping(false)`, `seekTo(duration ~/ 2)`.',
        'Autoplay por visibilidad: `VisibilityDetector` (paquete `visibility_detector`) con `info.visibleFraction >= .4`.',
        'Render: `ClipRRect` + `AspectRatio(aspectRatio: 16 / 9)` + `VideoPlayer(controller)`; tarjeta con `Row` de dos `Expanded`.'
      ],
      tip: 'Para el «loop al 50 %» escuchá el controlador y, al final, hacé `seekTo(duration ~/ 2)` + `play()`; `setLooping(true)` volvería al 0.',
      codigo: [
        'await c.initialize();',
        'await c.setVolume(0);',
        'await c.setLooping(false);',
        'await c.seekTo(c.value.duration ~/ 2);',
        'c.addListener(() { final v = c.value;',
        '  if (v.position >= v.duration) c.seekTo(v.duration ~/ 2).then((_) => c.play()); });',
        'VisibilityDetector(key: const Key("video"), child: VideoPlayer(c), onVisibilityChanged: (i) =>',
        '    i.visibleFraction >= .4 ? c.play() : c.pause());'
      ].join('\n')
    },
    medidas: [
      'Tarjeta: margen lateral 24, radio 20, sombra `--nws-sombra-1`; media al 50 % de ancho, margen 8, borde de 2 px violeta al 20 %, radio 12.',
      'Video 16:9 con `object-fit: cover`; play decorativo de 32 px a 8 px de la esquina.',
      'Texto 16/20 regular violeta-900; enlace 14/20 semibold subrayado, zona táctil de 44 px.',
      'Sección a 48 px de la anterior.'
    ]
  },

  cita: {
    titulo: 'Cita institucional',
    ui: [
      'Frase institucional sola y centrada, cierre antes del pie. Nivel 3: respaldo de marca.'
    ],
    logica: [
      'Texto estático. El pie arranca justo debajo (se solapa 32 px) y sube a violeta.'
    ],
    flutter: {
      widgets: [
        '`Padding` + `Center` + `Text(textAlign: TextAlign.center)`; no hay `text-wrap: balance`, acotá el ancho con `ConstrainedBox`.',
        '`SliverToBoxAdapter` si la pantalla es un `CustomScrollView`.'
      ],
      tip: 'Definí el estilo en el `TextTheme` (p. ej. `bodyLarge`) y que la cita lo tome del tema, sin números sueltos en el widget.'
    },
    medidas: [
      '19/28 px, peso 500, color violeta-700; centrado con `text-wrap: balance`.',
      'Padding 32 arriba, 24 a los lados y 40 abajo; fondo `--naotech-app-background`.'
    ]
  },

  footer: {
    titulo: 'Footer institucional',
    ui: [
      'Mindeporte como firma, logos aliados y aviso legal. Nivel 3: confianza y créditos.',
      'Sube de transparente a violeta oscuro y queda bajo el tabbar de vidrio.'
    ],
    logica: [
      'Sin interacción. Logos de un color en blanco por filtro CSS; el resto, a color.',
      'Se extiende 100 px bajo el contenido para que el tabbar siempre tenga violeta detrás (en vista plana no cuelga).'
    ],
    flutter: {
      widgets: [
        '`SliverFillRemaining(hasScrollBody: false)` o `SliverToBoxAdapter` con `Container` y `BoxDecoration(gradient: LinearGradient(..., stops: [0, .45, 1]))`.',
        'Logos blancos: `ColorFiltered(colorFilter: ColorFilter.mode(Colors.white, BlendMode.srcIn))` sobre `Image` o `SvgPicture` (`flutter_svg`).',
        'Con `Scaffold(extendBody: true)` el contenido pasa bajo la barra inferior: sumá su alto al padding de abajo.'
      ],
      tip: 'Con `extendBody: true`, el último widget necesita padding inferior igual al alto del tabbar o quedará tapado.'
    },
    medidas: [
      'Degradé: transparente → violeta-700 al 45 % → violeta-900; arranca 32 px sobre la cita.',
      'Padding 96 arriba, 24 laterales y 116 abajo (100 de tabbar + 16); gap 16.',
      'Logo Mindeporte de 64 px de alto (máx. 192); demás logos de 32 px (máx. 96), gap 20; legal 14/20 al 85 %.'
    ]
  },

  tabbar: {
    titulo: 'Tabbar inferior',
    ui: [
      'Tres destinos (Juegos, Medallas, Certificados) + indicador de inicio. Nivel 1: navegación global.',
      'Patrón nativo: zona del pulgar, ícono sobre rótulo; una web usaría menú superior.'
    ],
    logica: [
      'Vidrio: blanco al 78 % con desenfoque; el contenido pasa por debajo.',
      'Medallas y Certificados muestran un toast con fecha estimada (6 s); «Juegos» es la activa.'
    ],
    flutter: {
      widgets: [
        'Material 3: `NavigationBar` + `NavigationDestination`. iOS: `CupertinoTabBar` (verificar si desenfoca con fondo translúcido).',
        'Vidrio: `ClipRect` + `BackdropFilter(ImageFilter.blur)` con `backgroundColor` semitransparente y `Scaffold(extendBody: true)`.',
        'Estado activo: `selectedIndex` + `NavigationBarThemeData` (`labelTextStyle`, `indicatorColor: Colors.transparent`).',
        'Indicador de inicio: `SafeArea` con `MediaQuery.of(context).padding.bottom`; el aviso de las pestañas sin destino, con un `OverlayEntry`.'
      ],
      tip: '`NavigationBar` mide 80 px por defecto (Material 3): pasale `height: 60` para igualar este prototipo.',
      codigo: [
        'Scaffold(',
        '  extendBody: true,',
        '  bottomNavigationBar: ClipRect(child: BackdropFilter(',
        '    filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),',
        '    child: NavigationBar(height: 60, selectedIndex: i,',
        '      backgroundColor: Colors.white.withValues(alpha: .78),',
        '      destinations: destinos))));'
      ].join('\n')
    },
    medidas: [
      'Pestaña de 60 px; rótulo 16/20 medium; ícono de 26 px; barra con 4 px de padding arriba y a los lados.',
      'Indicador de inicio de 26 px. Bloque `absolute` abajo con `z-index: 4` (en vista plana pasa al flujo).',
      'Vidrio: blanco al 78 %, `blur(20px) saturate(1.8)`, borde superior fino al 14 % de gray-900. Activa: color primario + semibold.',
      'El scroll deja 100 px libres abajo para que el último contenido no quede tapado.'
    ]
  },

  transversales: {
    titulo: 'Transversales · splash, toasts y vistas',
    ui: [
      'Splash: foto con zoom lento, tinte violeta y barra de carga; sale con un fundido de 420 ms.',
      'Toasts: avisos oscuros de una línea que entran desde arriba, dentro del teléfono.',
      'Vistas inmersivas (Calendario / Resultados): pantallas completas que entran de lado.'
    ],
    logica: [
      'Splash de 2,2 s con Ken Burns y logo a 1,69×; luego la home entra escalonada.',
      'Toasts de 4,2 s (6 s en pestañas), deduplicados por `key`; lo sin destino avisa «Disponible próximamente».',
      'Vistas: push de ≈ 300 ms, home `inert`; Esc o «Volver» cierran y devuelven el foco.',
      'Detalle de noticia (foto compartida, 560 ms) y hoja de evento: hoy apagados por `salidas`.'
    ],
    flutter: {
      widgets: [
        'Splash: `flutter_native_splash` para el arranque nativo y un widget propio con `TweenAnimationBuilder` y `LinearProgressIndicator`.',
        'Toasts: `OverlayEntry` + `SlideTransition` desde `Offset(0, -1)`. Un `SnackBar` flotante sale abajo; para arriba, `OverlayEntry` o `MaterialBanner`.',
        'Vistas: `Navigator.push` con `PageRouteBuilder` + `SlideTransition` (300 ms), o `CupertinoPageRoute` (incluye el gesto de volver).',
        'Hojas: `showModalBottomSheet` o `DraggableScrollableSheet`; foto compartida con `Hero`.',
        'Tokens y accesibilidad: `ThemeData` + `ThemeExtension` + `TextTheme`; `SafeArea`; `MediaQuery.of(context).disableAnimations` para «reducir movimiento».',
        'Fuente: declarar Google Sans en `pubspec.yaml` (`fonts:`); vía `google_fonts`, verificar disponibilidad y licencia.'
      ],
      tip: 'Para que las vistas cubran el tabbar usá el `Navigator` raíz (`rootNavigator: true`); con un navegador anidado el tabbar queda fijo.',
      codigo: [
        'Navigator.of(context, rootNavigator: true).push(PageRouteBuilder(',
        '  transitionDuration: const Duration(milliseconds: 300),',
        '  pageBuilder: (_, __, ___) => const CalendarioPage(),',
        '  transitionsBuilder: (_, a, __, child) => SlideTransition(',
        '    position: Tween(begin: const Offset(1, 0), end: Offset.zero)',
        '        .animate(CurvedAnimation(parent: a, curve: const Cubic(.32, .72, 0, 1))),',
        '    child: child)));'
      ].join('\n')
    },
    medidas: [
      'Splash: logo de 130 px (zoom a 1,69×), MinDeporte de 80 px a 54 px del fondo; barra de carga de 4 px, al 20 % de los bordes y a 34 px.',
      'Toast: a 64 px del borde superior, 16 px de margen lateral, fondo app-color-900, radio 12, padding 12/16, entrada de 300 ms.',
      'Vistas: `inset: 0`, `z-index: 4`, sombra lateral; hoja de evento con radio de 28 arriba.',
      'Detalle de noticia: foto de 470 px y curva `cubic-bezier(.32, .72, 0, 1)`.'
    ]
  }
};
