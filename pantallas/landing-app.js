/**
 * App JIN · app de Juegos Intercolegiados, dentro del marco de teléfono.
 * Maqueta «JIN Landing y App», frame 153 v2 (node 13004:13907), a su ancho
 * real (428 px), llevada a patrones de app iOS sobre el SDK de Naowee.
 *
 * Escenario con toolbar + zoom + teléfono), con
 * el marco a 428 en vez de 390 para que las medidas del Figma entren 1:1.
 * El render es cromo + silueta + splash (igual en las dos pasadas del
 * router, ver `estable`); mount pinta el contenido debajo del splash.
 *
 * Estructura: portada inmersiva (foto a sangre detrás del estado y del
 * header, titular blanco sobre degradé) → Menú (íconos de app) → Novedades
 * como mazo de tarjetas que se desliza con el dedo → Descubre más noticias →
 * Galería (carrusel una a la vez o mosaico horizontal). Pestañas abajo.
 *
 * Del SDK: NwtIconButton, NwtButton, NwtAvatarIcon (íconos del menú),
 * NwtTabs (pestañas), NwtIconLabel (fecha/lugar), NwtDivider, NwtToast
 * (dentro del teléfono), íconos naotech-icon-*. NO EXISTEN EN EL SDK y se
 * componen con tokens (nws-lp* en app.css): el header flotante, la portada,
 * el mazo de tarjetas, el mosaico y la barra de pestañas iOS.
 * Nada navega todavía: cada pieza responde "Disponible próximamente".
 */
window.PANTALLAS = window.PANTALLAS || {};
window.PANTALLAS['landing-app'] = (function () {

  var ANCHO = 428, ALTO = 926, BORDE = 12;

  function sk(S, w, h, extra) {
    return S.h('span', { class: S.cls('nws-skel', extra), style: 'width:' + w + ';height:' + h });
  }

  function barraEstado(S, hora) {
    return S.h('div', { class: 'nws-mob__status nwt-smalltext-font-semibold', 'aria-hidden': 'true' },
      S.h('span', null, hora),
      S.h('div', { class: 'nws-mob__status__r' },
        S.h('span', { class: 'nws-mob__status__sig' }, '<i></i><i></i><i></i><i></i>'),
        S.h('span', { class: 'nws-mob__status__bat' })));
  }

  /* Header flotante: logo · perfil (círculo blanco de 44, como el Figma).
     Sobre la portada va transparente —la banda violeta es de la portada— con
     logo blanco; al pasar la portada se vuelve material con división. */
  function accion(S, icono, label, extra) {
    return S.iconButton({ icon: icono, size: 'small', variant: 'mute', theme: 'neutral', label: label, cls: S.cls('nws-lpx__accion', extra), attrs: { 'data-toast': label } });
  }
  function header(S) {
    return S.h('header', { class: 'nws-lpx__bar' },
      S.h('img', { class: 'nws-lpx__logo', src: window.JIC.logos.intercolegiados, alt: 'Juegos Intercolegiados' }),
      S.h('div', { class: 'nws-lpx__acciones' },
        accion(S, 'user', 'Iniciar sesión', 'nws-lpx__accion--perfil')));
  }

  /* El set naotech-icon no trae balón: SVG propio que hereda currentColor. */
  var BALON = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6c2.6 3.6 2.6 9.2 0 12.8M18.4 5.6c-2.6 3.6-2.6 9.2 0 12.8"/></svg>';

  /* Barra de pestañas inferior = NwtTabs a lo ancho, ícono sobre rótulo. */
  function tabbar(S, A) {
    return S.h('nav', { class: 'nws-lpx__tabbar', 'aria-label': 'Navegación principal' },
      S.tabs({ fullWidth: true, theme: 'primary', value: 'inicio', items: A.tabs.map(function (t) { return { label: t.label, value: t.id, icon: t.id === 'inicio' ? null : t.icono, iconHtml: t.id === 'inicio' ? BALON : null }; }) }));
  }
  /* Indicador de inicio del sistema (cromo del dispositivo, no de la app). */
  function homeIndicator(S) { return S.h('div', { class: 'nws-lpx__home', 'aria-hidden': 'true' }); }

  /* Silueta: mismo ritmo vertical que la vista real. */
  function esqueleto(S) {
    return S.h('div', { 'aria-busy': 'true' },
      sk(S, '100%', '660px', 'nws-lpv__skel-portada'),
      S.h('div', { class: 'nws-lpv__cuerpo' },
        sk(S, '30%', 'var(--naotech-sizing-24)'),
        S.h('div', { class: 'nws-lpv__menu' }, sk(S, '100%', '72px'), sk(S, '100%', '72px'))));
  }

  function tituloSeccion(S, texto) {
    return S.h('h2', { class: 'nws-lpv__h2' }, S.esc(texto));
  }

  /* Tarjeta del mazo de noticias: foto a sangre, velo, titular blanco, fecha
     y lugar (NwtIconLabel) y compartir en un círculo blanco arriba. */
  function tarjeta(S, n, i) {
    return S.h('article', { class: 'nws-lpv__carta', 'data-pos': i, 'data-i': i, tabindex: i === 0 ? 0 : -1, role: 'button', 'aria-label': n.titulo + ' · abrir noticia' },
      S.h('div', { class: 'nws-lpv__carta-foto' }, S.h('img', { src: n.img, alt: '', draggable: 'false' })),
      S.iconButton({ icon: 'share', size: 'small', variant: 'mute', theme: 'neutral', label: 'Compartir', cls: 'nws-lpv__compartir', attrs: { 'data-toast': 'Compartir' } }),
      S.h('div', { class: 'nws-lpv__carta-txt' },
        S.h('h3', { class: 'nws-lpv__carta-t' }, S.esc(n.corto || n.titulo)),
        S.h('div', { class: 'nws-lpv__carta-meta' },
          S.iconLabel({ icon: 'calendar', label: n.fechaCorta, cls: 'nws-lpv__meta' }))));
  }

  /* Escena vectorial de la portada: solo SVG/CSS, sin imágenes (DC-005). */
  function escenaPortada() {
    var sv = function (c, vb, d) { return '<div class="nws-lpfx__o ' + c + '"><svg viewBox="' + vb + '" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg></div>'; };
    return '<div class="nws-lpfx" aria-hidden="true">' +
      '<i class="nws-lpfx__luz nws-lpfx__luz--a"></i><i class="nws-lpfx__luz nws-lpfx__luz--b"></i><i class="nws-lpfx__luz nws-lpfx__luz--c"></i>' +
      '<div class="nws-lpfx__capa nws-lpfx__capa--lenta">' +
        '<i class="nws-lpfx__o nws-lpfx__sol"></i>' +
        sv('nws-lpfx__arcos', '0 0 360 360', '<path d="M40 200A150 150 0 0 1 190 50" stroke="#f7d500" stroke-width="7"/><path d="M68 262A180 180 0 0 1 250 34" stroke="#f7d500" stroke-width="5" opacity=".7"/>') +
        sv('nws-lpfx__tri nws-lpfx__tri--a', '0 0 60 54', '<path d="M30 5L56 49H4Z" stroke="#fff" stroke-width="3" opacity=".55"/>') +
      '</div>' +
      '<div class="nws-lpfx__capa nws-lpfx__capa--rapida">' +
        sv('nws-lpfx__balon', '0 0 100 100', '<g stroke="#fff" stroke-width="3.5" opacity=".85"><circle cx="50" cy="50" r="42"/><path d="M50 8V92M8 50H92M20 20C40 38 40 62 20 80M80 20C60 38 60 62 80 80"/></g>') +
        sv('nws-lpfx__tri nws-lpfx__tri--b', '0 0 60 54', '<path d="M30 5L56 49H4Z" stroke="#f7d500" stroke-width="3.5"/>') +
        sv('nws-lpfx__aro', '0 0 40 40', '<circle cx="20" cy="20" r="15" stroke="#f07e8c" stroke-width="4"/>') +
        '<i class="nws-lpfx__punto nws-lpfx__punto--a"></i><i class="nws-lpfx__punto nws-lpfx__punto--b"></i>' +
        '<i class="nws-lpfx__linea nws-lpfx__linea--a"></i><i class="nws-lpfx__linea nws-lpfx__linea--b"></i><i class="nws-lpfx__linea nws-lpfx__linea--c"></i>' +
      '</div></div>';
  }

  /* Galería: carrusel «una a la vez» (por defecto) y cuadrícula comparten
     `A.mosaico`; la foto N tiene el mismo índice (`data-i`) en las dos vistas. */
  var VISTAS_GALERIA = [
    { id: 'una', icono: 'view-galery', label: 'Ver una foto a la vez' },
    { id: 'grid', icono: 'view-grid', label: 'Ver en cuadrícula' }
  ];
  function seccionGaleria(S, L, fotos) {
    var e = S.esc, total = fotos.length, cols = [];
    for (var c = 0; c < total; c += 2) { cols.push(fotos.slice(c, c + 2)); } /* columnas de 2 teselas (alta+baja / baja+alta) */
    function foto(f) { return S.h('img', { src: f.img, alt: '', style: 'object-position:' + f.pos, draggable: 'false' }); }
    function ciudad(f) { return f.ciudad ? S.h('span', { class: 'nws-lpv__ciudad', 'aria-hidden': 'true' }, S.icon('gps-pin-filled') + S.h('span', null, e(f.ciudad))) : ''; }
    return S.h('section', { class: 'nws-lpv__galeria', id: 'lpv-galeria', 'data-dev': 'galeria' },
      S.h('div', { class: 'nws-lpv__h2-fila' },
        S.h('h2', { class: 'nws-lpv__h2' }, e(L.galeria.titulo)),
        S.h('div', { class: 'nws-lpv__vistas', role: 'group', 'aria-label': 'Vista de la galería' }, VISTAS_GALERIA.map(function (v, i) {
          return S.h('button', { type: 'button', class: 'nws-lpv__vista-btn', 'data-gal-vista': v.id, 'aria-pressed': i === 0 ? 'true' : 'false', 'aria-label': v.label, title: v.label }, S.icon(v.icono));
        }))),
      S.h('div', { class: 'nws-lpv__vista', id: 'lpv-gal-una' },
        S.h('div', { class: 'nws-lpv__pista', role: 'region', 'aria-roledescription': 'carrusel', 'aria-label': 'Galería multimedia', tabindex: 0 }, fotos.map(function (f, i) {
          return S.h('div', { class: 'nws-lpv__slide', 'data-i': i, role: 'group', 'aria-roledescription': 'diapositiva', 'aria-label': (i + 1) + ' de ' + total + (f.ciudad ? ' · ' + f.ciudad : '') }, foto(f), ciudad(f));
        })),
        S.h('div', { class: 'nws-lpv__dots' }, fotos.map(function (f, i) {
          return S.h('button', { type: 'button', class: S.cls('nws-lpv__dot', i === 0 && 'nws-lpv__dot--activo'), 'data-i': i, 'aria-label': 'Ir a la foto ' + (i + 1) + ' de ' + total, 'aria-current': i === 0 ? 'true' : null });
        }))),
      S.h('div', { class: 'nws-lpv__vista', id: 'lpv-gal-grid', hidden: true },
        S.h('div', { class: 'nws-lpv__mosaico', role: 'group', 'aria-label': 'Galería multimedia en cuadrícula' }, cols.map(function (col, k) {
          return S.h('div', { class: S.cls('nws-lpv__col', k % 2 && 'nws-lpv__col--inv') }, col.map(function (f, j) {
            var i = k * 2 + j;
            return S.h('button', { type: 'button', class: 'nws-lpv__tesela nws-ios-press', 'data-i': i, 'aria-label': 'Foto ' + (i + 1) + ' de ' + total + (f.ciudad ? ' · ' + f.ciudad : '') + ' · ver en grande' }, foto(f), ciudad(f));
          }).join(''));
        }))));
  }

  function contenido(S, L) {
    var e = S.esc, A = L.app, P = A.portada, V = A.videotutoriales;
    var noticias = [L.novedad].concat(L.noticias);
    return S.h('div', { class: 'nws-lpv' },
      /* Portada (Figma 13016:39009): fondo violeta animado en vez de foto
         (DC-005), a sangre detrás del estado y del header, con fundido a blanco */
      S.h('section', { class: 'nws-lpv__portada', 'data-dev': 'hero', 'data-toast': 'inscribete', role: 'button', tabindex: 0, 'aria-label': P.alt },
        escenaPortada(),
        /* DC-015: deportista recortada sobre el fondo de marca; el fundido va en la caja y el zoom en la imagen */
        S.h('div', { class: 'nws-lpv__atleta', 'aria-hidden': 'true' },
          S.h('img', { src: P.img, alt: '', draggable: 'false' }))),
      S.h('div', { class: 'nws-lpv__cuerpo' },
        /* Titular (texto real, no en la imagen) sobre el fundido */
        S.h('h1', { class: 'nws-lpv__titular', 'data-dev': 'titular' },e(P.titular[0]) + '<br>' + e(P.titular[1])),
        /* DC-070: título de sección en vez de repetir «competencias» en cada tarjeta */
        S.h('section', { class: 'nws-lpv__accesos', 'data-dev': 'competencias', 'aria-label': A.competencias.titulo },
          tituloSeccion(S, A.competencias.titulo),
          /* Accesos: NwtAvatarIcon del SDK tal cual (tema primario). Sin salidas,
             `data-inerte` cuenta como gancho en app.js: el toque no hace nada. */
          S.h('div', { class: 'nws-lpv__menu' }, A.menu.map(function (m) {
            return S.h('button', Object.assign({ type: 'button', class: 'nws-lpv__app nws-ios-press', 'aria-label': m.label }, A.salidas ? { 'data-vista': m.vista } : { 'data-inerte': '1' }),
              S.avatarIcon({ icon: m.icono, theme: 'primary' }),
              S.h('span', { class: 'nws-lpv__app-txt' },
                S.h('span', { class: 'nws-lpv__app-l' },
                  S.h('span', { class: 'nws-lpv__app-l1' }, e(m.label)))),
              S.icon('chevron-right', 'nws-lpv__app-c'));
          }))),
        S.h('section', { class: 'nws-lpv__novedades', 'data-dev': 'novedades', 'aria-label': A.novedades.titulo },
          tituloSeccion(S, A.novedades.titulo),
          /* Mazo: la de adelante se arrastra con el dedo; al soltarla con
             fuerza (o pasado el umbral) se va y queda al fondo */
          S.h('div', { class: 'nws-lpv__mazo', id: 'lpv-mazo', 'aria-roledescription': 'mazo de noticias', 'aria-live': 'polite' },
            noticias.map(function (n, i) { return tarjeta(S, n, i); }).reverse().join('')),
          S.h('div', { class: 'nws-lpv__mas' },
            S.button({ label: 'Descubre más noticias', size: 'large', theme: 'primary', attrs: { 'data-toast': 'Otras noticias' } }))),
        seccionGaleria(S, L, A.mosaico),
        S.h('section', { class: 'nws-lpv__videos', 'data-dev': 'video', 'aria-label': V.titulo },
          tituloSeccion(S, V.titulo),
          S.h('div', { class: 'nws-lpv__vt' },
            S.h('div', { class: 'nws-lpv__vt-media' },
              S.h('video', { class: 'nws-lpv__vt-video', src: V.video, poster: V.poster, muted: true, playsinline: true, preload: 'metadata', 'aria-label': V.alt, 'data-vt': '1' }),
              S.h('span', { class: 'nws-lpv__vt-play', 'aria-hidden': 'true' }, S.icon('play'))),
            S.h('div', { class: 'nws-lpv__vt-info' },
              S.h('h3', { class: 'nws-lpv__vt-t' }, e(V.nombre)),
              S.h('a', Object.assign({ class: 'nws-lpv__vt-a' }, A.salidas ? { href: V.url, target: '_blank', rel: 'noopener' } : { role: 'button', tabindex: 0, 'data-toast': 'Video tutoriales' }), e(V.enlace)))))),
      conector(S, A.quote),
      pie(S, A.footer, A.version));
  }

  /* DC-080/083: la frase institucional va sola, como cita sobre el fondo de la app,
     antes del degradé del pie (sin filete ni comilla decorativa). */
  function conector(S, Q) {
    return S.h('blockquote', { class: 'nws-lpv__quote', 'data-dev': 'cita' },
      S.h('p', { class: 'nws-lpv__quote-t' }, S.esc(Q.texto)));
  }

  /* Pie de la app: logos en blanco (filtro solo en los de color único)
     para que lean sobre el morado; nada navega, todo es maqueta. */
  function pie(S, F, version) {
    var g = window.JIC.logos;
    function logo(src, cls, alt) { return S.h('img', { class: 'nws-lpv__pie-logo ' + cls, src: src, alt: alt, draggable: 'false' }); }
    return S.h('footer', { class: 'nws-lpv__pie', 'data-dev': 'footer' },
      logo(g.mindeporte, 'nws-lpv__pie-logo--blanco nws-lpv__pie-logo--principal', 'Ministerio del Deporte'),
      S.h('div', { class: 'nws-lpv__pie-logos' },
        logo(g.intercolegiadosPie, 'nws-lpv__pie-logo--blanco', 'Juegos Intercolegiados'),
        logo(g.colombia, '', 'Colombia'),
        logo(g.govco, '', 'gov.co')),
      S.h('p', { class: 'nws-lpv__pie-legal' },
        S.h('span', { class: 'nws-lpv__pie-legal-l' }, S.esc(F.legal1)),
        S.h('span', { class: 'nws-lpv__pie-legal-l' }, S.esc(F.legal2))),
      S.h('p', { class: 'nws-lpv__pie-version' }, S.esc(version)));
  }

  /* Splash: imagen con Ken Burns (DC-010, en vez de loader) y el logo de
     Deporte fijo abajo en una capa aparte, para que no siga el zoom. */
  function splash(S, L) {
    var sp = L.app.splash;
    return S.h('div', { class: 'nws-lps nws-lps--kb', id: 'lps', role: 'img', 'aria-label': sp.alt, style: '--nws-lps-carga:' + sp.ms + 'ms' },
      S.h('img', { class: 'nws-lps__img', src: sp.img, alt: '', style: '--nws-lps-ms:' + (sp.ms + 600) + 'ms' }),
      S.h('div', { class: 'nws-lps__tinte' }),
      S.h('img', { class: 'nws-lps__logo-jic', src: window.JIC.logos.intercolegiados, alt: '' }),
      S.h('img', { class: 'nws-lps__logo-min', src: window.JIC.logos.mindeporte, alt: '' }),
      S.h('div', { class: 'nws-lps__estado' }, barraEstado(S, L.hora)),
      S.h('div', { class: 'nws-lps__carga', id: 'lps-carga', role: 'progressbar', 'aria-label': 'Cargando la app', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', style: '--nws-lps-carga:' + sp.ms + 'ms' },
        S.h('span', { class: 'nws-lps__carga-relleno' })));
  }

  /* Pantalla del teléfono: estado + header y pestañas + indicador de inicio
     son capas SOBRE el scroll (el contenido pasa por debajo). */
  function pantalla(S, L, cuerpo) {
    return S.h('div', { class: 'nws-lpi__top nws-lpi__top--sobre', id: 'lpi-top', 'data-dev': 'header' }, barraEstado(S, L.hora), header(S)) +
      S.h('div', { class: 'nws-lp__scroll', id: 'lp-scroll' }, S.h('div', { id: 'lp-view' }, cuerpo)) +
      S.h('div', { class: 'nws-lpi__bottom', 'data-dev': 'tabbar' }, tabbar(S, L.app), homeIndicator(S)) +
      S.h('div', { class: 'nws-mob__toast', id: 'mob-toast' }) +
      splash(S, L);
  }

  /* ---------- mazo de noticias · "Screen Transitions" (Sam Atmore) ----------
     · la de adelante sigue al dedo 1:1 en horizontal, sin girar, y su foto
       va más lenta (parallax: la imagen se corre al revés, hasta 30px);
     · las de atrás avanzan CON el gesto: la siguiente crece y se corre a la
       posición de adelante en proporción al arrastre (no al soltar);
     · al soltar pasado el umbral (o con fuerza) sale de lado achicándose y
       entra por atrás; si no, todo vuelve con resorte;
     · tocarla la expande a pantalla completa (detalle) y al cerrar vuelve a
       su lugar por el mismo camino;
     · paginado automático cada PAGINA ms (sin indicador); se pausa al
       tocar, con el detalle abierto, fuera de pantalla y con "reducir
       movimiento". */
  var PAGINA = 5000;
  var POS = [{ left: 0, h: 437, b: 1 }, { left: 36, h: 382, b: .92 }, { left: 72, h: 318, b: .84 }];
  function mazo(el, dotsEl, scrollEl, alAbrir) {
    var cartas = Array.prototype.slice.call(el.querySelectorAll('.nws-lpv__carta')).reverse(); // [0] = la de adelante
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = dotsEl ? Array.prototype.slice.call(dotsEl.children) : [];
    var timer = null, visible = false, pausado = false, volando = false, abierto = false;
    var ANCHO_SALIDA = 380, UMBRAL = 90;

    function limpiar(c) { c.style.left = ''; c.style.height = ''; c.style.filter = ''; c.style.transform = ''; var im = c.querySelector('img'); if (im) { im.style.transform = ''; } }
    function ubicar() {
      cartas.forEach(function (c, i) {
        c.setAttribute('data-pos', Math.min(i, 2));
        c.style.zIndex = String(10 - i);
        c.tabIndex = i === 0 ? 0 : -1;
      });
      var activa = +cartas[0].getAttribute('data-i');
      dots.forEach(function (d, i) {
        d.classList.remove('nwt-view-indicator__dot--active');
        if (i === activa) { void d.offsetWidth; d.classList.add('nwt-view-indicator__dot--active'); }
      });
      programar();
    }
    function programar() {
      clearTimeout(timer); timer = null;
      var corre = visible && !pausado && !abierto && !reducido;
      if (dotsEl) { dotsEl.classList.toggle('nws-lpv__pags--corre', corre); }
      if (corre) { timer = setTimeout(function () { avanzar(-1); }, PAGINA); }
    }
    /* avance del gesto (0..1): las de atrás se acercan a la posición de la
       de adelante en proporción al arrastre */
    function acercar(p) {
      for (var i = 1; i < Math.min(cartas.length, 3); i++) {
        var a = POS[i], b = POS[i - 1], c = cartas[i];
        c.style.left = (a.left + (b.left - a.left) * p) + 'px';
        c.style.height = (a.h + (b.h - a.h) * p) + 'px';
        c.style.filter = 'brightness(' + (a.b + (b.b - a.b) * p).toFixed(3) + ')';
      }
    }
    /* la de adelante sale de lado achicándose; las demás avanzan; ella entra
       por el fondo con un fundido */
    function avanzar(dir) {
      if (volando || cartas.length < 2) { return; }
      var c = cartas[0]; volando = true; clearTimeout(timer);
      c.classList.add('nws-lpv__carta--sale');
      c.style.transform = 'translateX(' + (dir * ANCHO_SALIDA) + 'px) scale(.86)';
      var im = c.querySelector('img'); if (im) { im.style.transform = 'translateX(' + (-dir * 30) + 'px) scale(1.2)'; }
      cartas.slice(1).forEach(limpiar);
      cartas.push(cartas.shift());
      /* las demás ya toman su posición nueva (con su transición de resorte) */
      cartas.forEach(function (x, i) { if (x !== c) { x.setAttribute('data-pos', Math.min(i, 2)); x.style.zIndex = String(10 - i); } });
      setTimeout(function () {
        /* la que salió pasa al fondo sin transición, invisible, y aparece */
        c.classList.remove('nws-lpv__carta--sale');
        c.classList.add('nws-lpv__carta--sin');
        limpiar(c); c.style.opacity = '0';
        c.setAttribute('data-pos', Math.min(cartas.length - 1, 2)); c.style.zIndex = String(10 - (cartas.length - 1));
        void c.offsetWidth;
        c.classList.remove('nws-lpv__carta--sin');
        c.style.opacity = '';
        volando = false;
        ubicar();
      }, reducido ? 0 : 320);
    }
    var drag = null;
    function down(ev) {
      var c = ev.target.closest('.nws-lpv__carta');
      if (!c || c !== cartas[0] || volando || ev.target.closest('.nws-lpv__compartir')) { return; }
      drag = { c: c, x0: ev.clientX, y0: ev.clientY, dx: 0, t: [], movio: false, id: ev.pointerId };
      pausado = true; programar();
    }
    function move(ev) {
      if (!drag || ev.pointerId !== drag.id) { return; }
      var dx = ev.clientX - drag.x0, dy = ev.clientY - drag.y0;
      /* umbral de 8px antes de decidir: si es vertical, es scroll */
      if (!drag.movio) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) { return; }
        if (Math.abs(dy) > Math.abs(dx)) { soltar(false); return; }
        drag.movio = true;
        cartas.forEach(function (x) { x.classList.add('nws-lpv__carta--arrastra'); });
        try { drag.c.setPointerCapture(ev.pointerId); } catch (e) { /* */ }
      }
      drag.dx = dx;
      drag.t.push({ x: ev.clientX, t: performance.now() }); if (drag.t.length > 5) { drag.t.shift(); }
      var p = Math.min(Math.abs(dx) / (ANCHO_SALIDA * .8), 1);
      drag.c.style.transform = 'translateX(' + dx + 'px) scale(' + (1 - p * .08).toFixed(3) + ')';
      var im = drag.c.querySelector('img'); if (im) { im.style.transform = 'translateX(' + Math.max(-30, Math.min(30, -dx * .12)).toFixed(1) + 'px) scale(1.2)'; }
      acercar(p);
    }
    function velocidad() {
      var t = drag.t; if (t.length < 2) { return 0; }
      var a = t[0], b = t[t.length - 1]; return (b.x - a.x) / Math.max(1, b.t - a.t); // px/ms
    }
    function soltar(evaluar) {
      if (!drag) { return; }
      var c = drag.c, dx = drag.dx, v = evaluar ? velocidad() : 0, movio = drag.movio;
      cartas.forEach(function (x) { x.classList.remove('nws-lpv__carta--arrastra'); });
      drag = null; pausado = false;
      if (!movio) { ubicar(); return; }
      c._arrastrada = true; setTimeout(function () { c._arrastrada = false; }, 0);
      if (Math.abs(dx) > UMBRAL || Math.abs(v) > 0.5) {
        avanzar((dx || v) > 0 ? 1 : -1);
      } else {
        cartas.forEach(limpiar); // todo vuelve con el resorte
        ubicar();
      }
    }
    function up(ev) { if (drag && ev.pointerId === drag.id) { soltar(true); } }
    function click(ev) {
      var c = ev.target.closest('.nws-lpv__carta');
      if (!c) { return; }
      if (c._arrastrada) { ev.stopPropagation(); ev.preventDefault(); return; }
      if (ev.target.closest('.nws-lpv__compartir')) { return; }
      /* tocar la de adelante la abre; tocar una de atrás la trae adelante */
      ev.stopPropagation(); ev.preventDefault();
      if (c === cartas[0]) { abrir(c); } else { avanzar(-1); }
    }
    function abrir(c) {
      if (!alAbrir || volando) { return; }
      abierto = true; programar();
      alAbrir(c, function () { abierto = false; programar(); });
    }
    function tecla(ev) {
      var c = ev.target.closest('.nws-lpv__carta');
      if (!c || c !== cartas[0]) { return; }
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); abrir(c); }
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') { ev.preventDefault(); avanzar(ev.key === 'ArrowLeft' ? -1 : 1); }
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('keydown', tecla);
    /* solo corre mientras se ve al menos la mitad del mazo dentro del
       scroll del teléfono (medido, no IntersectionObserver: el teléfono va
       escalado y recortado, y así la cuenta es la misma en todos lados) */
    function medir() {
      var b = el.getBoundingClientRect(), v = scrollEl.getBoundingClientRect();
      var dentro = Math.min(b.bottom, v.bottom) - Math.max(b.top, v.top);
      var ahora = dentro >= b.height / 2;
      if (ahora !== visible) { visible = ahora; programar(); }
    }
    scrollEl.addEventListener('scroll', medir, { passive: true });
    ubicar(); medir();
    return function () {
      clearTimeout(timer); scrollEl.removeEventListener('scroll', medir);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true); el.removeEventListener('keydown', tecla);
    };
  }

  /* ---------- detalle de la noticia ----------
     Foto a sangre arriba (detrás del estado) que se funde a blanco hacia el
     texto; debajo el contenido del Figma frame 102 (fecha, titular,
     autoría, cuerpo, "Leer noticia completa").
     Transición de elemento compartido, SIN animar tamaño (nada de layout
     por cuadro): la foto ya está en su caja final y se anima solo
     transform (escala + posición) y clip-path (recorte con radio), así va
     por GPU. Arranca recortada exactamente a la caja de la carta y se abre
     hasta la portada del artículo; al volver hace la misma animación al
     revés. Curva de iOS (0.32, 0.72, 0, 1). */
  var CURVA = 'cubic-bezier(.32, .72, 0, 1)', DUR_DET = 560, ALTO_FOTO = 470;
  function detalle(S, L, mob, n, carta, alCerrar) {
    var e = S.esc;
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dur = reducido ? 1 : DUR_DET;
    var m = mob.getBoundingClientRect(), k = m.width / mob.offsetWidth; /* el teléfono puede ir escalado (zoom) */
    function caja(el) { var r = el.getBoundingClientRect(); return { top: (r.top - m.top) / k, left: (r.left - m.left) / k, w: r.width / k, h: r.height / k }; }

    var d = document.createElement('div');
    d.className = 'nws-lpd';
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', n.titulo);
    d.innerHTML =
      S.h('div', { class: 'nws-lpd__scroll' },
        S.h('div', { class: 'nws-lpd__foto' }, S.h('img', { src: n.img, alt: '' })),
        S.h('article', { class: 'nws-lpd__art' },
          S.h('p', { class: 'nwt-smalltext-font-regular nws-lpd__fecha' }, e(n.fecha)),
          S.h('h2', { class: 'nws-lpd__t' }, e(n.titulo)),
          S.h('div', { class: 'nws-lpd__cuerpo' },
            n.autoria ? S.h('p', { class: 'nws-lpd__autoria' }, e(n.autoria)) : '',
            S.h('p', { class: 'nws-lpd__texto' }, e(n.cuerpo || n.resumen || ''))),
          S.h('div', { class: 'nws-lpd__acc' },
            S.button({ label: 'Leer noticia completa', size: 'large', theme: 'primary', cls: 'nws-lpd__leer', attrs: { 'data-toast': 'novedad' } })))) +
      S.h('div', { class: 'nws-lpd__estado' }, barraEstado(S, L.hora)) +
      S.iconButton({ icon: 'chevron-left', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Volver', cls: 'nws-lpd__volver', attrs: { 'data-cerrar': true } });
    mob.appendChild(d);
    var slot = d.querySelector('.nws-lpd__foto');

    /* la foto que viaja: en su caja FINAL (portada del artículo) */
    var W = mob.offsetWidth, H = ALTO_FOTO;
    var vuela = document.createElement('div');
    vuela.className = 'nws-lpd__vuela';
    vuela.style.width = W + 'px'; vuela.style.height = H + 'px';
    vuela.innerHTML = '<img src="' + n.img + '" alt=""><span class="nws-lpd__vuela-fundido"></span>';
    mob.appendChild(vuela);

    /* transform + clip-path que hacen que la foto final "sea" la carta */
    function comoCarta() {
      var c = caja(carta.querySelector('.nws-lpv__carta-foto'));
      var s = Math.max(c.w / W, c.h / H);                  /* cubre la carta, como object-fit: cover */
      var tx = c.left + c.w / 2 - W * s / 2, ty = c.top + c.h / 2 - H * s / 2;
      var ix = (W * s - c.w) / 2 / s, iy = (H * s - c.h) / 2 / s, r = 20 / s;
      return { transform: 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')',
               clipPath: 'inset(' + iy.toFixed(2) + 'px ' + ix.toFixed(2) + 'px ' + iy.toFixed(2) + 'px ' + ix.toFixed(2) + 'px round ' + r.toFixed(2) + 'px)' };
    }
    function comoPortada(scrollY) {
      return { transform: 'translate(0px,' + (-scrollY) + 'px) scale(1)', clipPath: 'inset(0px 0px 0px 0px round 0px)' };
    }
    var fundido = vuela.querySelector('.nws-lpd__vuela-fundido');
    slot.style.visibility = 'hidden'; carta.style.visibility = 'hidden';
    var ida = vuela.animate([comoCarta(), comoPortada(0)], { duration: dur, easing: CURVA, fill: 'forwards' });
    fundido.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: CURVA, fill: 'forwards' });
    d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur * .6, delay: dur * .15, easing: 'ease-out', fill: 'backwards' });
    d.querySelector('.nws-lpd__art').animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: dur, delay: dur * .2, easing: CURVA, fill: 'backwards' });
    /* al terminar (onfinish, con respaldo por tiempo por si el navegador
       pausa la animación, p. ej. pestaña en segundo plano) */
    function unaVez(fn) { var hecho = false; return function () { if (!hecho) { hecho = true; fn(); } }; }
    var llego = unaVez(function () { if (!cerrando) { slot.style.visibility = ''; vuela.style.display = 'none'; } });
    ida.onfinish = llego; setTimeout(llego, dur + 80);

    var cerrando = false;
    function cerrar() {
      if (cerrando) { return; } cerrando = true;
      var sc = d.querySelector('.nws-lpd__scroll'), y = Math.min(sc.scrollTop, H);
      vuela.style.display = ''; slot.style.visibility = 'hidden';
      var vuelta = vuela.animate([comoPortada(y), comoCarta()], { duration: dur, easing: CURVA, fill: 'forwards' });
      fundido.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * .7, easing: CURVA, fill: 'forwards' });
      d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * .45, easing: 'ease-in', fill: 'forwards' });
      var volvio = unaVez(function () {
        carta.style.visibility = ''; vuela.remove(); d.remove();
        document.removeEventListener('keydown', esc);
        alCerrar();
      });
      vuelta.onfinish = volvio; setTimeout(volvio, dur + 80);
    }
    function esc(ev) { if (ev.key === 'Escape') { cerrar(); } }
    d.addEventListener('click', function (ev) { if (ev.target.closest('[data-cerrar]')) { cerrar(); } });
    document.addEventListener('keydown', esc);
  }

  /* ---------- galería: carrusel con scroll-snap + cuadrícula ----------
     Solo en memoria. Tocar la foto avanza (la última vuelve a la primera);
     tocar una tesela abre el carrusel en esa foto. */
  function galeria(sec) {
    var pista = sec.querySelector('.nws-lpv__pista');
    var slides = Array.prototype.slice.call(sec.querySelectorAll('.nws-lpv__slide'));
    var dots = Array.prototype.slice.call(sec.querySelectorAll('.nws-lpv__dot'));
    var botones = Array.prototype.slice.call(sec.querySelectorAll('[data-gal-vista]'));
    var vistas = { una: sec.querySelector('#lpv-gal-una'), grid: sec.querySelector('#lpv-gal-grid') };
    var n = slides.length, idx = 0, vista = 'una', rumbo = -1, raf = 0, timer = 0, arr = null, suprimir = false;
    if (!pista || !n) { return function () {}; }
    function reducido() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
    /* px de layout entre una foto y la siguiente: el teléfono se escala con transform */
    function paso() { return n > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : pista.clientWidth; }
    function izqDe(i) { return slides[i].offsetLeft - slides[0].offsetLeft; }

    function marcar(i) {
      idx = i;
      dots.forEach(function (d, k) {
        d.classList.toggle('nws-lpv__dot--activo', k === i);
        if (k === i) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
      });
    }
    /* Con un scroll programado en curso se ignora el scroll intermedio: si no, los dots
       volverían atrás a mitad de camino. `rumbo` es la foto a la que se va. */
    function leer() {
      raf = 0;
      var p = paso(); if (!p) { return; }
      var i = Math.max(0, Math.min(n - 1, Math.round(pista.scrollLeft / p)));
      if (rumbo >= 0) { if (i !== rumbo) { return; } rumbo = -1; }
      if (i !== idx) { marcar(i); }
    }
    function ir(i, suave) {
      i = Math.max(0, Math.min(n - 1, i));
      marcar(i); rumbo = i;
      pista.scrollTo({ left: izqDe(i), behavior: suave && !reducido() ? 'smooth' : 'auto' });
      clearTimeout(timer);
      timer = setTimeout(function () { rumbo = -1; leer(); }, suave ? 1000 : 80);
    }
    function cambiar(v) {
      if (v === vista) { return; }
      vista = v; rumbo = -1;
      Object.keys(vistas).forEach(function (k) { vistas[k].hidden = k !== v; });
      botones.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-gal-vista') === v ? 'true' : 'false'); });
      if (v === 'una') { pista.scrollLeft = izqDe(idx); } /* oculto pierde el scroll: se reubica ya visible */
      if (vistas[v].animate && !reducido()) { vistas[v].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'cubic-bezier(.4, 0, .2, 1)' }); }
    }

    function alClic(ev) {
      if (suprimir) { suprimir = false; ev.preventDefault(); ev.stopPropagation(); return; }
      var t = ev.target, el;
      if ((el = t.closest('[data-gal-vista]'))) { cambiar(el.getAttribute('data-gal-vista')); }
      else if ((el = t.closest('.nws-lpv__dot'))) { ir(+el.getAttribute('data-i'), true); }
      else if (t.closest('.nws-lpv__slide')) { ir(idx + 1 < n ? idx + 1 : 0, true); }
      else if ((el = t.closest('.nws-lpv__tesela'))) { marcar(+el.getAttribute('data-i')); cambiar('una'); }
    }
    function alTeclear(ev) {
      var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
      if (d) { ev.preventDefault(); ir(idx + d, true); }
    }
    function alScroll() { if (!raf) { raf = requestAnimationFrame(leer); } }
    function alTocar() { rumbo = -1; } /* el dedo o la rueda toman el mando */

    /* Con mouse el overflow nativo no se arrastra: se sigue el puntero sin snap y al soltar se asienta. */
    function alBajar(ev) {
      if (ev.pointerType !== 'mouse' || ev.button !== 0) { return; }
      arr = { x: ev.clientX, izq: pista.scrollLeft, mov: false }; rumbo = -1;
    }
    function alMover(ev) {
      if (!arr) { return; }
      var dx = ev.clientX - arr.x;
      if (!arr.mov && Math.abs(dx) > 5) { arr.mov = true; pista.classList.add('nws-lpv__pista--arrastra'); try { pista.setPointerCapture(ev.pointerId); } catch (e) {} }
      if (arr.mov) { pista.scrollLeft = arr.izq - dx; }
    }
    function alSoltar(ev) {
      var a = arr; arr = null;
      if (!a || !a.mov) { return; }
      pista.classList.remove('nws-lpv__pista--arrastra');
      var dx = ev.clientX - a.x, p = paso() || 1, i = Math.round(a.izq / p);
      ir(dx < -p * 0.2 ? i + 1 : dx > p * 0.2 ? i - 1 : i, true);
      suprimir = true; setTimeout(function () { suprimir = false; }, 0); /* el clic que sigue al arrastre no avanza */
    }

    sec.addEventListener('click', alClic);
    pista.addEventListener('keydown', alTeclear);
    pista.addEventListener('scroll', alScroll, { passive: true });
    pista.addEventListener('scrollend', function () { if (rumbo < 0 || Math.abs(pista.scrollLeft - izqDe(rumbo)) < 2) { rumbo = -1; leer(); } });
    pista.addEventListener('touchstart', alTocar, { passive: true });
    pista.addEventListener('wheel', alTocar, { passive: true });
    pista.addEventListener('pointerdown', alBajar);
    pista.addEventListener('pointermove', alMover);
    pista.addEventListener('pointerup', alSoltar);
    pista.addEventListener('pointercancel', alSoltar);
    return function () { clearTimeout(timer); cancelAnimationFrame(raf); sec.removeEventListener('click', alClic); };
  }

  /* ---------- modo dev (DC-084): notas por sección sobre la vista plana ----------
     Herramienta del prototipo, no de la app. Ancho: notas a la derecha con conector;
     angosto: <details> bajo cada sección. Texto en pantallas/landing-dev.js. */
  var ORDEN_DEV = ['header', 'hero', 'titular', 'competencias', 'novedades', 'galeria', 'video', 'cita', 'footer', 'tabbar'];
  var DEV_ANCHO_MIN = 1100, DEV_NOTA = 440, DEV_SEPARA = 44;
  var DEV_ABIERTO = /[?&]abierto\b/.test(location.search); /* ?plana&dev&abierto despliega todo (capturas) */
  function modoDev(S, mob) {
    var stage = mob.closest('#stage');
    var capa = null, extra = [], vigentes = [], notas = [], ro = null, activo = false, ancho = false, raf = 0;

    function fmt(t) { return S.esc(t).replace(/`([^`]+)`/g, '<code>$1</code>'); }
    function lista(a) { return a && a.length ? S.h('ul', null, a.map(function (t) { return S.h('li', null, fmt(t)); })) : ''; }
    function bloque(clave, rotulo, html) {
      return html ? S.h('div', { class: 'nws-dev__b' }, S.h('span', { class: 'nws-dev__pill nws-dev__pill--' + clave }, rotulo), html) : '';
    }
    /* ancho: UI y lógica a la vista, Flutter y medidas a pedido (si no, las notas se acumulan hacia abajo) */
    function cuerpo(n, plegar) {
      var f = n.flutter || {};
      var mas = bloque('flutter', 'Flutter', lista(f.widgets) +
          (f.tip ? S.h('p', { class: 'nws-dev__tip' }, S.h('strong', null, 'Tip ') + fmt(f.tip)) : '') +
          (f.codigo ? S.h('pre', null, S.h('code', null, S.esc(f.codigo))) : '')) +
        bloque('medidas', 'Medidas', lista(n.medidas));
      return bloque('ui', 'UI', lista(n.ui)) + bloque('logica', 'Lógica', lista(n.logica)) +
        (plegar ? S.h('details', { class: 'nws-dev__mas', open: DEV_ABIERTO }, S.h('summary', null, 'Flutter y medidas'), mas) : mas);
    }
    function titulo(it) { return S.h('span', { class: 'nws-dev__n', 'aria-hidden': 'true' }, it.num) + S.h('span', null, S.esc(it.n.titulo)); }

    /* offsetTop sumado hasta #mob: no lo alteran los transform de las animaciones de entrada */
    function topDe(el) { var y = 0; for (var n = el; n && n !== mob; n = n.offsetParent) { y += n.offsetTop; } return y; }

    function secciones() {
      var d = window.LANDING_DEV || {}, out = [];
      ORDEN_DEV.forEach(function (id, i) {
        var el = mob.querySelector('[data-dev="' + id + '"]');
        if (el && d[id]) { out.push({ id: id, num: i + 1, el: el, n: d[id] }); }
      });
      return out;
    }

    function limpiar() {
      if (capa) { capa.remove(); capa = null; }
      extra.forEach(function (e) { e.remove(); }); extra = [];
      mob.querySelectorAll('.nws-dev--foco').forEach(function (e) { e.classList.remove('nws-dev--foco'); });
      if (stage) { stage.style.removeProperty('padding-bottom'); }
    }

    /* Las notas fijas de la derecha no deben quedar bajo los switches flotantes (arriba a la derecha). */
    function bajoSwitch(izq, w) {
      var sw = document.getElementById('ctrl-modo-dev'); if (!sw) { return 0; }
      var r = sw.getBoundingClientRect(), b = mob.getBoundingClientRect();
      return b.left + izq + w > r.left ? Math.max(0, r.bottom + 8 - (b.top + window.scrollY)) : 0;
    }

    function colocar() {
      if (!capa) { return; }
      var m = mob.offsetWidth, adentro = mob.getBoundingClientRect().left < 36, previa = -1e9;
      vigentes.forEach(function (it) {
        it.top = topDe(it.el);
        it.badge = Math.max(it.top + 6, previa + 24); previa = it.badge; /* header y hero comparten borde superior */
        var b = capa.querySelector('[data-dev-num="' + it.id + '"]');
        b.style.top = it.badge + 'px'; b.style.left = (adentro ? 6 : -28) + 'px';
      });
      if (!ancho) { return; }
      var izq = m + DEV_SEPARA;
      var w = Math.max(240, Math.min(DEV_NOTA, ((stage ? stage.clientWidth : window.innerWidth) - m) / 2 - DEV_SEPARA - 12));
      var libre = bajoSwitch(izq, w), trazos = '';
      notas.forEach(function (it, i) {
        var nota = capa.querySelector('[data-dev-nota="' + it.id + '"]');
        nota.style.left = izq + 'px'; nota.style.width = w + 'px';
        var t = Math.max(it.el ? it.top : 0, libre); /* si dos notas se pisan, la siguiente baja lo mínimo */
        nota.style.top = t + 'px';
        libre = t + nota.offsetHeight + 12;
        if (!it.el) { return; }
        var y1 = it.badge + 10, y2 = t + 23, xm = m + 10 + (i % 8) * 4;
        trazos += '<path d="M' + m + ' ' + y1 + ' H' + xm + (y2 !== y1 ? ' V' + y2 : '') + ' H' + izq + '"/><circle cx="' + m + '" cy="' + y1 + '" r="3"/>';
      });
      capa.querySelector('.nws-dev__lineas').innerHTML = trazos;
      /* las notas son absolutas: se amplía el escenario para que la página las alcance */
      if (stage) { stage.style.setProperty('padding-bottom', (64 + Math.max(0, libre - mob.offsetHeight)) + 'px', 'important'); }
    }

    function insertar() {
      var grupo = null;
      notas.forEach(function (it) {
        var d = document.createElement('details');
        d.className = 'nws-dev__nota nws-dev__nota--inline' + (it.id === 'cita' ? ' nws-dev__nota--sobre-pie' : '');
        d.setAttribute('data-dev-nota', it.id);
        d.innerHTML = S.h('summary', { class: 'nws-dev__t' }, titulo(it)) + cuerpo(it.n, false);
        d.open = DEV_ABIERTO;
        extra.push(d);
        if (!it.el) { mob.appendChild(d); return; }
        /* header, hero y titular se solapan: sus notas van juntas tras el titular, sin separar portada y cuerpo */
        if (it.id === 'header' || it.id === 'hero' || it.id === 'titular') {
          if (!grupo) {
            grupo = document.createElement('div'); grupo.className = 'nws-dev__grupo';
            mob.querySelector('[data-dev="titular"]').insertAdjacentElement('afterend', grupo); extra.push(grupo);
          }
          grupo.appendChild(d);
        } else { it.el.insertAdjacentElement('afterend', d); }
      });
    }

    function pintar() {
      limpiar();
      vigentes = secciones(); if (!vigentes.length) { return; }
      var t = (window.LANDING_DEV || {}).transversales;
      notas = vigentes.concat(t ? [{ id: 'transversales', num: 'T', el: null, n: t }] : []);
      ancho = window.innerWidth >= DEV_ANCHO_MIN;
      capa = document.createElement('div');
      capa.className = 'nws-dev'; capa.setAttribute('role', 'region'); capa.setAttribute('aria-label', 'Anotaciones del modo desarrollador');
      capa.innerHTML = (ancho ? '<svg class="nws-dev__lineas" aria-hidden="true"></svg>' : '') +
        vigentes.map(function (it) { return S.h('span', { class: 'nws-dev__num', 'data-dev-num': it.id, 'aria-hidden': 'true' }, it.num); }).join('') +
        (ancho ? notas.map(function (it) {
          return S.h('aside', { class: 'nws-dev__nota', 'data-dev-nota': it.id, 'aria-label': 'Nota ' + it.num + ': ' + it.n.titulo },
            S.h('div', { class: 'nws-dev__t' }, titulo(it)), cuerpo(it.n, true));
        }).join('') : '');
      capa.addEventListener('toggle', alCambiar, true); /* toggle no burbujea: al plegar o desplegar se reacomodan las notas */
      mob.appendChild(capa);
      if (!ancho) { insertar(); }
      colocar();
    }

    /* un solo repintado por cuadro: resize y cambios de alto llegan en ráfagas */
    function alCambiar() {
      if (raf || !activo) { return; }
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (activo) { (window.innerWidth >= DEV_ANCHO_MIN) !== ancho ? pintar() : colocar(); }
      });
    }
    function resaltar(ev) {
      var n = ev.target.closest && ev.target.closest('[data-dev-nota]');
      mob.querySelectorAll('.nws-dev--foco').forEach(function (e) { e.classList.remove('nws-dev--foco'); });
      var s = n && mob.querySelector('[data-dev="' + n.getAttribute('data-dev-nota') + '"]');
      if (s) { s.classList.add('nws-dev--foco'); }
    }

    function ocultar() {
      if (!activo) { return; }
      activo = false;
      document.removeEventListener('mouseover', resaltar);
      window.removeEventListener('resize', alCambiar);
      if (ro) { ro.disconnect(); ro = null; }
      cancelAnimationFrame(raf); raf = 0;
      limpiar();
    }
    return {
      mostrar: function () {
        if (activo) { return; }
        activo = true;
        document.addEventListener('mouseover', resaltar);
        window.addEventListener('resize', alCambiar);
        if (window.ResizeObserver) {
          ro = new ResizeObserver(alCambiar);
          ro.observe(mob); ro.observe(mob.querySelector('#lp-view'));
        }
        pintar();
      },
      ocultar: ocultar,
      destruir: ocultar
    };
  }

  return {
    fullscreen: true,
    estable: true,
    titulo: 'App JIN',

    render: function (ctx) {
      var S = ctx.S, rol = ctx.rol, L = ctx.D.landing;
      var plana = false;
      try {
        plana = /[?&]plana\b/.test(location.search) || localStorage.getItem('proto.vistaPlana') === '1';
      } catch (e) {}
      if (plana) {
        document.documentElement.classList.add('nws-modo-plano');
        document.body.classList.add('nws-modo-plano');
      } else {
        document.documentElement.classList.remove('nws-modo-plano');
        document.body.classList.remove('nws-modo-plano');
      }
      /* Modo dev: la preferencia se recuerda aparte, pero solo actúa con la vista plana. */
      var dev = false;
      try { dev = /[?&]dev\b/.test(location.search) || localStorage.getItem('proto.modoDev') === '1'; } catch (e) {}
      document.body.classList.toggle('nws-modo-dev', plana && dev);

      var switchDev = S.h('div', { class: 'nws-switch-flotante nws-switch-flotante--dev', id: 'ctrl-modo-dev', role: 'group', 'aria-label': 'Modo desarrollador', title: 'Anotar cada sección con su UI, su lógica y su traducción a Flutter' },
        S.h('span', { class: 'nws-switch-flotante__txt' }, 'Modo dev'),
        S.switchControl({ id: 'btn-switch-dev', checked: dev, label: 'Activar modo desarrollador' }));

      var switchHtml =S.h('div', { class: 'nws-switch-flotante', id: 'ctrl-vista-plana', role: 'group', 'aria-label': 'Modo de visualización', title: 'Alternar entre capa de presentación y vista plana' },
        S.h('span', { class: 'nws-switch-flotante__txt' }, 'Vista plana'),
        S.switchControl({
          id: 'btn-switch-plana',
          checked: plana,
          label: 'Alternar entre capa de presentación y vista plana'
        }));

      return S.h('div', { class: 'nws-col', style: 'height:100%;background:var(--naotech-app-color-100)' },
        switchHtml,
        switchDev,
        S.toolbar({
          body: S.h('div', { class: 'nws-row nws-title-light' }, S.h('div', { class: 'nws-title__naowee' }, window.NAOWEE.icono), S.title({ text: 'App JIN', subtitle: 'Juegos Intercolegiados' })),
          actions: ''
        }),
        S.h('div', { class: 'nws-phone-stage', id: 'stage' },
          S.h('div', { class: 'nws-phone-zoom' },
            S.iconButton({ icon: 'zoom-out', size: 'small', variant: 'mute', theme: 'neutral', label: 'Alejar', attrs: { 'data-zoom': 'out' } }),
            S.iconButton({ icon: 'refresh', size: 'small', variant: 'mute', theme: 'neutral', label: 'Ajustar al espacio disponible', attrs: { 'data-zoom': 'fit' } }),
            S.iconButton({ icon: 'zoom-in', size: 'small', variant: 'mute', theme: 'neutral', label: 'Acercar', attrs: { 'data-zoom': 'in' } }),
            S.iconButton({ icon: 'play', size: 'small', variant: 'mute', theme: 'neutral', label: 'Ver splash otra vez', attrs: { 'data-splash': true } })),
          S.h('div', { class: 'nws-phone nws-phone--lp', id: 'phone', 'nwt-theme': rol.theme },
            S.h('div', { class: 'nws-phone__screen nws-lp nws-lp--app nws-lp--ios nws-lp--inmersiva', id: 'mob' },
              pantalla(S, L, esqueleto(S))))));
    },

    /* Geometría, no dato: el marco mide (428+24)×(926+24) y se encoge para
       caber en el escenario. Corre en las dos pasadas del router. */
    ajustar: function (root, ctx, mult) {
      var stage = root.querySelector('#stage'), phone = root.querySelector('#phone');
      if (!stage || !phone) { return; }
      if (document.body.classList.contains('nws-modo-plano')) {
        phone.style.transform = 'none';
        return;
      }
      var r = stage.getBoundingClientRect();
      var fit = Math.min((r.width - 48) / (ANCHO + BORDE * 2), (r.height - 48) / (ALTO + BORDE * 2), 1);
      phone.style.transform = 'scale(' + (fit * (mult || 1)).toFixed(3) + ')';
    },

    mount: function (root, ctx) {
      var S = ctx.S, L = ctx.D.landing, self = this;
      var mob = root.querySelector('#mob'), phone = root.querySelector('#phone');
      var sc = mob.querySelector('#lp-scroll'), top = mob.querySelector('#lpi-top');

      /* El contenido se pinta debajo del splash; el splash se va cuando
         cumplió su tiempo (medido desde que empezó la carga, así el router y
         el splash no suman dos esperas) y la home entra escalonada. */
      mob.querySelector('#lp-view').innerHTML = contenido(S, L);
      ctx.posicionarIndicadores(mob);
      var offGaleria = galeria(mob.querySelector('#lpv-galeria'));
      var noticias = [L.novedad].concat(L.noticias);
      var offMazo = mazo(mob.querySelector('#lpv-mazo'), null, sc, function (carta, alCerrar) {
        ctx.cerrarToast();
        /* landing.app.salidas = false: la home no navega, solo avisa (se reactiva en datos.js). */
        if (!L.app.salidas) { ctx.proximamente('Detalle de noticia', carta); alCerrar(); return; }
        detalle(S, L, mob, noticias[+carta.getAttribute('data-i')], carta, alCerrar);
      });
      var vistas = window.LANDING_VISTAS.montar(S, L, mob, { barraEstado: barraEstado, posicionarIndicadores: ctx.posicionarIndicadores });
      var timers = [];
      var lento = /[?&]lento\b/.test(location.search);
      /* La barra dura lo mismo que el splash; `ya` descuenta lo transcurrido
         antes de montar para que llegue a 100 justo cuando el splash se va. */
      function cargaSplash(ms, ya) {
        var c = mob.querySelector('#lps-carga'); if (!c) { return; }
        c.style.setProperty('--nws-lps-carga', ms + 'ms'); c.style.setProperty('--nws-lps-ya', -ya + 'ms');
        c.parentNode.style.setProperty('--nws-lps-carga', ms + 'ms'); /* el logo hereda la duración del splash */
        c.setAttribute('aria-valuenow', '0');
      }
      function ocultarSplash(tras) {
        var sp = mob.querySelector('#lps'); if (!sp) { return; }
        timers.push(setTimeout(function () {
          var c = mob.querySelector('#lps-carga'); if (c) { c.setAttribute('aria-valuenow', '100'); }
          sp.classList.add('nws-lps--fuera');
          mob.classList.add('nws-lp--entra');
          timers.push(setTimeout(function () { sp.hidden = true; }, 520));
          /* la clase de entrada se quita cuando terminó la última (≈1,1 s) */
          timers.push(setTimeout(function () { mob.classList.remove('nws-lp--entra'); }, 1300));
        }, tras));
      }
      function mostrarSplash() {
        var sp = mob.querySelector('#lps'); if (!sp) { return; }
        timers.forEach(clearTimeout); timers = [];
        ctx.cerrarToast();
        sp.hidden = false; sp.classList.remove('nws-lps--fuera', 'nws-lps--kb');
        cargaSplash(lento ? 4000 : L.app.splash.ms, 0);
        void sp.offsetWidth; sp.classList.add('nws-lps--kb'); /* reinicia el Ken Burns y la barra */
        sc.scrollTop = 0; onScroll();
        ocultarSplash(lento ? 4000 : L.app.splash.ms);
      }
      /* `nws-lps--kb` ya viene en el HTML: las animaciones corren desde el primer frame, sin salto. */
      var yaEspero = lento ? 4000 : 520;
      cargaSplash(lento ? 4000 : L.app.splash.ms, lento ? 4000 : 0);
      ocultarSplash(Math.max(0, (lento ? 4000 : L.app.splash.ms) - yaEspero));

      /* Header sobre la portada: transparente con íconos blancos; cuando la
         portada ya pasó por debajo, material blanco con división. */
      var portada = mob.querySelector('.nws-lpv__portada');
      /* pausa las luces y figuras cuando la portada sale de vista */
      var vigia = null;
      if (portada && window.IntersectionObserver) {
        vigia = new IntersectionObserver(function (en) {
          portada.classList.toggle('nws-lpfx--pausa', !en[0].isIntersecting);
        });
        vigia.observe(portada);
      }
      /* Tutorial: arranca y vuelve al 50 % (el loop nativo volvería al 0); solo corre en pantalla. */
      var vt = mob.querySelector('[data-vt]');
      if (vt) {
        var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        var medio = function () { if (vt.duration) { vt.currentTime = vt.duration * 0.5; } };
        vt.muted = true;
        vt.addEventListener('loadedmetadata', medio);
        vt.addEventListener('ended', function () { medio(); if (vt.dataset.vis === '1') { vt.play().catch(function () {}); } });
        if (vt.readyState > 0) { medio(); }
        if (!quieto && window.IntersectionObserver) {
          new IntersectionObserver(function (en) {
            var dentro = en[0].isIntersecting;
            vt.dataset.vis = dentro ? '1' : '0';
            if (dentro) { vt.play().catch(function () {}); } else { vt.pause(); }
          }, { root: sc, threshold: 0.4 }).observe(vt);
        }
      }
      function onScroll() {
        /* la foto se funde a blanco hacia el 66 % de su alto: desde ahí el
           logo blanco ya no se leería, así que el header pasa a material */
        /* el material suma 8px: se descuentan para medir igual en ambos estados */
        var limite = portada ? portada.offsetHeight * 0.64 - (top.offsetHeight - (top.classList.contains('nws-lpi__top--sobre') ? 0 : 8)) : 0;
        top.classList.toggle('nws-lpi__top--sobre', sc.scrollTop < limite);
      }

      var zoom = { mult: 1 };
      function aplicarZoom() { self.ajustar(root, ctx, zoom.mult); }

      var ctrlPlana = root.querySelector('#ctrl-vista-plana');
      var btnPlana = root.querySelector('#btn-switch-plana');
      var ctrlDev = root.querySelector('#ctrl-modo-dev');
      var btnDev = root.querySelector('#btn-switch-dev');
      var notasDev = modoDev(S, mob);
      var prefDev = !!btnDev && btnDev.getAttribute('aria-checked') === 'true'; /* ya resuelta en render: ?dev o lo recordado */

      function toggleVistaPlana(forzar) {
        var activa = typeof forzar === 'boolean' ? forzar : !document.body.classList.contains('nws-modo-plano');
        document.documentElement.classList.toggle('nws-modo-plano', activa);
        document.body.classList.toggle('nws-modo-plano', activa);
        if (btnPlana) {
          btnPlana.classList.toggle('nwt-switch--checked', activa);
          btnPlana.setAttribute('aria-checked', activa ? 'true' : 'false');
        }
        try { localStorage.setItem('proto.vistaPlana', activa ? '1' : '0'); } catch (e) {}

        if (activa) {
          var sp = mob.querySelector('#lps');
          if (sp) { sp.hidden = true; sp.classList.add('nws-lps--fuera'); }
          phone.style.transform = 'none';
        } else {
          aplicarZoom();
        }
        ctx.posicionarIndicadores(mob);
        aplicarDev();
      }

      function onSwitchClick(ev) {
        ev.preventDefault();
        toggleVistaPlana();
      }

      if (ctrlPlana) {
        ctrlPlana.addEventListener('click', onSwitchClick);
      }

      /* El modo dev solo actúa con la vista plana: al apagarla se oculta y la preferencia queda guardada. */
      function aplicarDev() {
        var activo = prefDev && document.body.classList.contains('nws-modo-plano');
        document.body.classList.toggle('nws-modo-dev', activo);
        if (btnDev) {
          btnDev.classList.toggle('nwt-switch--checked', prefDev);
          btnDev.setAttribute('aria-checked', prefDev ? 'true' : 'false');
        }
        if (activo) { notasDev.mostrar(); } else { notasDev.ocultar(); }
      }
      function onDevClick(ev) {
        ev.preventDefault();
        prefDev = !prefDev;
        try { localStorage.setItem('proto.modoDev', prefDev ? '1' : '0'); } catch (e) {}
        aplicarDev();
      }
      if (ctrlDev) { ctrlDev.addEventListener('click', onDevClick); }

      if (document.body.classList.contains('nws-modo-plano')) {
        var spInicial = mob.querySelector('#lps');
        if (spInicial) { spInicial.hidden = true; spInicial.classList.add('nws-lps--fuera'); }
        phone.style.transform = 'none';
      }
      aplicarDev();

      function onClick(ev) {
        var z = ev.target.closest('[data-zoom]');
        if (z) {
          var a = z.getAttribute('data-zoom');
          if (a === 'in') { zoom.mult = Math.min(2, zoom.mult + 0.15); }
          if (a === 'out') { zoom.mult = Math.max(0.5, zoom.mult - 0.15); }
          if (a === 'fit') { zoom.mult = 1; }
          aplicarZoom(); return;
        }
        if (ev.target.closest('[data-splash]')) { mostrarSplash(); return; }
        /* Calendario y Resultados (tarjetas): vista inmersiva; el foco vuelve a la tarjeta */
        var vi = ev.target.closest('[data-vista]');
        if (vi) { vistas.abrir(vi.getAttribute('data-vista'), vi); return; }
        /* Medallas/Certificados (pestañas): aviso propio con fecha estimada (datos.js) */
        var tab = ev.target.closest('.nws-lpx__tabbar [data-tab]');
        if (tab && tab.getAttribute('data-tab') !== 'inicio') {
          var it = L.app.tabs.filter(function (m) { return m.id === tab.getAttribute('data-tab'); })[0];
          if (it && it.toast) {
            ctx.toast({ key: 'aviso:' + it.id, title: it.toast.titulo, message: it.toast.desde, theme: 'neutral', icon: 'info', ms: 6000, origen: tab });
          }
        }
      }
      /* Enter/espacio sobre lo que no es <button> */
      function onKey(ev) {
        if (ev.key !== 'Enter' && ev.key !== ' ') { return; }
        var t = ev.target.closest('.nws-lp [role="button"][data-toast]'); if (!t) { return; }
        ev.preventDefault(); t.click();
      }
      sc.addEventListener('scroll', onScroll, { passive: true });
      root.addEventListener('click', onClick);
      root.addEventListener('keydown', onKey);
      window.addEventListener('resize', aplicarZoom);
      onScroll();
      aplicarZoom();
      return function () {
        document.documentElement.classList.remove('nws-modo-plano');
        document.body.classList.remove('nws-modo-plano');
        if (ctrlPlana) { ctrlPlana.removeEventListener('click', onSwitchClick); }
        document.body.classList.remove('nws-modo-dev');
        if (ctrlDev) { ctrlDev.removeEventListener('click', onDevClick); }
        notasDev.destruir();
        timers.forEach(clearTimeout);
        offMazo();
        offGaleria();
        vistas.destruir();
        if (vigia) { vigia.disconnect(); }
        sc.removeEventListener('scroll', onScroll);
        root.removeEventListener('click', onClick);
        root.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', aplicarZoom);
      };
    }
  };
})();
