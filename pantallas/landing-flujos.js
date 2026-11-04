/* Estructura de las pantallas Flutter, con datos congelados de app.flujos.
   Solo describe contenido y filtros. La única pila vive en landing-vistas.js.
   Visual: el de la app real (design_system + competition_card, day_chip,
   group_standings, start_list, match_detail): cabecera violeta en la regional,
   tarjetas blancas de radio 20 y borde gris, chips de día en caja, filas de
   tabla con insignias de posición y escudos de color sin logo. */
window.LANDING_FLUJOS = function (S, L) {
  'use strict';
  var F = L.app.flujos, e = S.esc, h = S.h;
  var ESCUDOS = ['#3A48A8', '#8055A3', '#646587', '#F05705', '#434CE4', '#293377'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function texto(t) { return h('p', null, e(t)); }
  function titulo(t) { return h('h2', null, e(t)); }
  function tarjeta(cls, cuerpo) { return h('article', { class: 'nws-fl__tarjeta ' + (cls || '') }, cuerpo); }
  function accion(label, id, clave) {
    return S.button({ label: label, theme: 'primary', variant: 'quiet', cls: 'nws-fl__accion', attrs: { 'data-flujo': id, 'data-clave': clave == null ? '' : clave } });
  }
  function pendiente(label) { return S.button({ label: label, theme: 'neutral', variant: 'quiet', cls: 'nws-fl__accion', attrs: { 'data-toast': label } }); }
  /* Fila que abre otra vista: toda la tarjeta es el botón (como en la app). */
  function enlace(id, clave, contenido, cls) {
    return h('button', { type: 'button', class: 'nws-fl__fila ' + (cls || ''), 'data-flujo': id, 'data-clave': clave == null ? '' : String(clave) }, contenido);
  }
  function ir() { return S.icon('chevron-right', 'nws-fl__ir'); }
  function tabs(labels, st, vivo) {
    return S.tabs({ cls: 'nws-fl__tabs' + (vivo ? ' nws-fl__tabs--vivo' : ''), theme: 'primary', fullWidth: true, value: String(st.tab || 0), items: labels.map(function (label, i) { return { value: String(i), label: label }; }) });
  }
  /* Filtro: campo de 48 px, radio 10 y borde gris (NaoweeSelect). El `change` lo escucha landing-vistas.js. */
  var MARCADOR = { departamento: 'Buscar departamento', municipio: 'Buscar municipio', deporte: 'Selecciona un deporte', categoria: 'Selecciona una categoría', llave: 'Selecciona una llave' };
  /* bloqueado: el campo se ve, pero no se puede elegir hasta tener el dato anterior (como NaoweeSelect de Municipio).
     marcador: texto propio del campo cuando no hay valor; sin etiqueta no se pinta el rótulo de arriba. */
  function select(label, key, opciones, st, bloqueado, marcador) {
    var texto0 = marcador || (bloqueado ? 'Elige primero un departamento' : (MARCADOR[key] || 'Todos'));
    var attrs = { 'data-filtro': key, class: st[key] ? 'nws-fl__select' : 'nws-fl__select nws-fl__select--vacio' };
    if (bloqueado) { attrs.disabled = true; }
    return h('label', { class: 'nws-fl__filtro' + (bloqueado ? ' nws-fl__filtro--off' : '') + (label ? '' : ' nws-fl__filtro--sin-rotulo') },
      label ? h('span', { class: 'nws-fl__filtro-t' }, e(label)) : '',
      h('select', attrs, [{ valor: '', label: texto0 }].concat(opciones.map(function (x) { return { valor: x, label: x }; })).map(function (x) {
        return h('option', { value: x.valor, selected: (st[key] || '') === x.valor }, e(x.label));
      })));
  }
  /* Buscador en píldora (NaoweeSearchField). El `input` lo escucha landing-vistas.js. */
  function buscar(st, label) {
    return h('div', { class: 'nws-fl__buscar-caja' }, h('label', { class: 'nws-fl__filtro' }, h('span', { class: 'nws-fl__filtro-t' }, 'Buscar'), h('input', { class: 'nws-fl__buscar', type: 'search', placeholder: label, 'aria-label': label, value: st.busqueda || '', 'data-filtro': 'busqueda' })));
  }
  function coincide(t, q) { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().indexOf((q || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()) >= 0; }
  /* Píldora de estado: Finalizado verde, En curso rojo con punto, Programado azul. */
  function estadoPill(t) {
    var clase = { 'Finalizado': 'ok', 'En curso': 'vivo', 'Programado': 'info', 'En pausa': 'pausa', 'Cancelado': 'error', 'Retirado': 'error' }[t] || 'neutro';
    return h('span', { class: 'nws-fl__pill nws-fl__pill--' + clase }, e(t));
  }
  /* Escudo sin logo: inicial sobre un color fijo elegido por el nombre (como la app). */
  function escudo(nombre) {
    var suma = 0, i; for (i = 0; i < nombre.length; i++) { suma += nombre.charCodeAt(i); }
    return h('span', { class: 'nws-fl__escudo', style: 'background:' + ESCUDOS[suma % ESCUDOS.length], 'aria-hidden': 'true' }, e(nombre.charAt(0)));
  }
  function sede(k) { return F.sedes[+k || 0]; }
  function competencia(k) { return F.competencias.filter(function (c) { return c.id === k; })[0] || F.competencias[0]; }
  function regional(k) { return L.app.regionales.items[+String(k || '').split(':').pop() || 0]; }
  function deRegional(c, k) { return c.tipo === (String(k || '').indexOf('individuales:') === 0 ? 'individual' : 'equipo'); }
  function eje(c, k) { return deRegional(c, 'individuales:0') && String(k).indexOf('individuales:') === 0 ? c.prueba : c.deporte; }
  function deportesRegional(k) { return F.competencias.filter(function (c) { return deRegional(c, k); }).map(function (c) { return eje(c, k); }); }
  function categoriasRegional(k) { return F.competencias.filter(function (c) { return deRegional(c, k); }).map(function (c) { return c.categoria; }); }
  function datoFila(label, valor) {
    return h('div', { class: 'nws-fl__dato' }, h('span', { class: 'nws-fl__dato-l' }, e(label)), h('span', { class: 'nws-fl__dato-v' }, e(valor)));
  }
  function vista(id, k, st) {
    var eyebrow = null, t, sub = null, violeta = false, b, x, foto = null, naranja = false, barraLogo = false, pie = null, zona = null, resumen = null, zonaLista = false;
    if (id === 'regional') {
      x = regional(k); t = String(k).indexOf('individuales:') === 0 ? 'Regional de atletismo' : 'Regional de conjuntos'; sub = x.nombre.replace(/^Regional /, '') + ' - Sede ' + x.ciudad; violeta = true; st.regSub = sub; st.regK = k; st.regTitulo = t;
      b = +st.tab ? tabs(F.regionalTabs, st) : '';
      if (+st.tab === 1) {
        b += h('p', { class: 'nws-fl__intro' }, e('Explora las sedes donde se realizarán las competencias.')) + select('Departamento', 'departamento', [sede(0).departamento], st);
        b += select('Municipio', 'municipio', [sede(0).municipio], st, !st.departamento);
        b += st.municipio
          ? h('div', { class: 'nws-fl__sedes' }, F.sedes.map(function (v, i) {
            return h('button', { type: 'button', class: 'nws-fl__sede', 'data-flujo': 'sede', 'data-clave': String(i) },
              h('span', { class: 'nws-fl__sede-cab' }, h('span', { class: 'nws-fl__sede-tx' }, h('span', { class: 'nws-fl__sede-t' }, e(v.nombre)), h('span', { class: 'nws-fl__sede-d' }, e(v.direccion))), h('span', { class: 'nws-fl__sede-ubic', 'aria-hidden': 'true' }, PIN)),
              h('img', { class: 'nws-fl__sede-img', src: v.img, alt: '' }));
          }).join(''))
          : h('div', { class: 'nws-fl__vacio' }, h('img', { class: 'nws-fl__vacio-img', src: F.ilustracionVacio, alt: '' }), h('strong', null, 'Elige un municipio'), h('p', null, e('Selecciona un departamento y luego un municipio para ver sus escenarios deportivos.')));
      } else if (+st.tab === 2) {
        b += h('p', { class: 'nws-fl__intro' }, e(F.logistica.texto)) + h('hr', { class: 'nws-fl__divisor' })
          + h('div', { class: 'nws-fl__poliza' }, DOC + h('span', null, 'Pólizas'))
          + (F.logistica.documentos.length
            ? F.logistica.documentos.map(function (doc) { return h('button', { type: 'button', class: 'nws-fl__doc', 'data-toast': doc }, DOC + h('span', { class: 'nws-fl__doc-t' }, e(doc)) + FLECHA); }).join('')
            : h('p', { class: 'nws-fl__vacio-t' }, 'Todavía no hay documentos publicados.'));
      } else {
        /* Calendario: controles en la zona violeta y matriz de días por deportes en la hoja sangrada (sin pestañas). */
        zona = zonaRegional(st, k); resumen = resumenFiltros(st, k); b = matrizRegional(st, k);
      }
    } else if (id === 'login') {
      t = 'Iniciar sesión'; naranja = true;
      /* pantalla de inicio de sesión de la app: solo la maqueta; ningún botón envía datos */
      var logo = (window.JIC && window.JIC.logos && window.JIC.logos.mindeporte) || 'assets/landing/logo-mindeporte.svg';
      var ojo = '<svg class="nws-fl__login-ojo" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9c2.2 3.2 5.2 5 9 5s6.8-1.8 9-5M6 13l-2 3M12 14.5V18M18 13l2 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      b = h('img', { class: 'nws-fl__login-logo', src: logo, alt: 'Deporte' })
        + h('h1', { class: 'nws-fl__login-t' }, 'Bienvenido a <strong>Juegos Intercolegiados Nacionales 2026</strong> 👋')
        + h('p', { class: 'nws-fl__login-sub' }, 'Ingresa tus credenciales para acceder a tu perfil y gestionar tu información deportiva.')
        + h('label', { class: 'nws-fl__login-campo' }, h('span', null, 'Correo electrónico o código DANE <b>*</b>'), h('input', { type: 'text', placeholder: 'correo@ejemplo.com o código DANE', autocomplete: 'off' }))
        + h('label', { class: 'nws-fl__login-campo' }, h('span', null, 'Contraseña <b>*</b>'), h('span', { class: 'nws-fl__login-pass' }, h('input', { type: 'password', placeholder: 'Ingresa tu contraseña', autocomplete: 'off' }), ojo))
        + h('p', { class: 'nws-fl__login-olvido' }, '¿Olvidaste la contraseña? ' + h('button', { type: 'button', class: 'nws-fl__login-link nws-fl__login-link--naranja', 'data-toast': 'Recuperar contraseña' }, 'Recuperar'))
        + h('button', { type: 'button', class: 'nws-fl__login-btn', 'data-flujo': 'perfil', 'data-clave': '' }, 'Iniciar sesión')
        + h('p', { class: 'nws-fl__login-legal' }, h('button', { type: 'button', class: 'nws-fl__login-link', 'data-toast': 'Política de tratamiento de datos' }, 'Política de tratamiento de datos') + ' y ' + h('button', { type: 'button', class: 'nws-fl__login-link', 'data-toast': 'Términos y condiciones' }, 'Términos y condiciones'))
        + h('p', { class: 'nws-fl__login-ayuda' }, '💬 ¿NECESITAS AYUDA?')
        + h('p', { class: 'nws-fl__login-ayuda-t' }, 'Si tienes dudas o problemas con la activación de tu cuenta, puedes comunicarte con el equipo de soporte.');
    } else if (id === 'perfil') {
      t = 'Perfil de la institución'; barraLogo = true;
      /* perfil de la institución (institution_profile_screen.dart) con datos de ejemplo */
      var cal = '<svg class="nws-fl__inst-cal" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h16M9 3v4M15 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      var verif = '<svg class="nws-fl__inst-ver" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#d74009"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var celdaP = function (l, v) { return h('div', { class: 'nws-fl__celda' }, h('span', { class: 'nws-fl__celda-l' }, e(l)), h('span', { class: 'nws-fl__celda-v' }, e(v))); };
      var cardP = function (tit, celdas) { return tarjeta('nws-fl__inst-card', h('h2', null, e(tit)) + h('div', { class: 'nws-fl__grid' }, celdas.join(''))); };
      b = h('div', { class: 'nws-fl__inst-cab' }, h('span', { class: 'nws-fl__inst-av' }, 'I' + verif),
          h('div', { class: 'nws-fl__inst-tx' }, h('span', { class: 'nws-fl__inst-pill' }, cal + 'Inscripción 23 de Septiembre, 2026'), h('h1', { class: 'nws-fl__inst-n' }, 'INSTITUCIÓN DE EJEMPLO'), h('p', { class: 'nws-fl__inst-d' }, 'Código DANE 999000000001')))
        + cardP('Datos básicos', [celdaP('Correo electrónico', 'correo@ejemplo.com'), celdaP('Teléfono', 'No asignado')])
        + cardP('Datos de ubicación', [celdaP('Departamento', 'VALLE DE LOS VIENTOS'), celdaP('Municipio', 'VILLA AURORA'), celdaP('Dirección', 'No asignado')])
        + cardP('Datos del representante', [celdaP('Nombre representante', 'Representante de ejemplo'), celdaP('Tipo de documento', 'No asignado'), celdaP('Número de documento', 'No asignado')]);
      pie = h('button', { type: 'button', class: 'nws-fl__pie-it nws-fl__pie-it--act', 'aria-current': 'page' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Perfil</span>')
        + h('button', { type: 'button', class: 'nws-fl__pie-it', 'data-flujo': 'inscritos', 'data-clave': '' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>Inscritos</span>');
    } else if (id === 'inscritos') {
      t = 'Inscritos'; barraLogo = true;
      /* listas de inscritos (registered_sportman_and_team_and_support_staff_screen.dart y sportsman_registered_list.dart) */
      var lista = st.lista || '';
      var filas = lista === ''
        ? F.deportistas.map(function (a, i) {
          var con = i % 2 === 0;
          return h('button', { type: 'button', class: 'nws-fl__insc-fila nws-fl__insc-fila--btn', 'data-flujo': 'atleta', 'data-clave': String(i) }, h('span', { class: 'nws-fl__insc-doc' }, '10203040' + (50 + i)),
            h('span', { class: 'nws-fl__insc-linea' }, h('span', { class: 'nws-fl__insc-n' }, e(a.nombre)),
              h('span', { class: 'nws-fl__insc-dep' }, h('img', { src: ICONO_DEPORTE[a.deporte] || ICONO_PIN, alt: '' }), e(a.deporte)), ir()),
            h('span', { class: 'nws-fl__insc-apoyo' + (con ? ' nws-fl__insc-apoyo--con' : '') }, con ? 'Con personal de apoyo' : 'Sin personal de apoyo'));
        }).join('')
        : (lista === 'Personal de apoyo'
          ? h('button', { type: 'button', class: 'nws-fl__insc-fila nws-fl__insc-fila--btn', 'data-flujo': 'apoyo', 'data-clave': '' }, h('span', { class: 'nws-fl__insc-doc' }, '1020304099'),
            h('span', { class: 'nws-fl__insc-linea' }, h('span', { class: 'nws-fl__insc-n' }, 'Marisol Aurora Cielo'), h('span', { class: 'nws-fl__insc-dep' }, h('img', { src: ICONO_DEPORTE['Atletismo'], alt: '' }), 'Atletismo'), ir()),
            h('span', { class: 'nws-fl__insc-rol' }, 'Docente/Entrenador'), h('span', { class: 'nws-fl__insc-apoyo nws-fl__insc-apoyo--con' }, 'Asignado'))
          : h('button', { type: 'button', class: 'nws-fl__insc-fila nws-fl__insc-fila--btn', 'data-flujo': 'equipo', 'data-clave': '' }, h('span', { class: 'nws-fl__insc-rol' }, 'Equipo inscrito'),
            h('span', { class: 'nws-fl__insc-linea' }, h('span', { class: 'nws-fl__insc-n' }, e(competencia('baloncesto').prueba + ' - ' + competencia('baloncesto').categoria.replace(' · ', ' '))),
              h('span', { class: 'nws-fl__insc-dep' }, h('img', { src: ICONO_DEPORTE['Baloncesto'], alt: '' }), 'Baloncesto'), ir())));
      b = h('div', { class: 'nws-fl__insc-cab' }, h('h2', null, 'Listas de inscritos'),
          h('button', { type: 'button', class: 'nws-fl__insc-act', 'data-toast': 'Actualizar', 'aria-label': 'Actualizar' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'))
        + h('p', { class: 'nws-fl__insc-t' }, 'Busca en la lista tus estudiantes y personal de apoyo inscritos.')
        + h('div', { class: 'nws-fl__insc-filtros' }, h('input', { class: 'nws-fl__buscar nws-fl__buscar--pill', type: 'search', placeholder: 'Buscar', 'aria-label': 'Buscar', 'data-search': '' }),
          h('button', { type: 'button', class: 'nws-fl__sel-btn', 'data-fl-hoja': 'abrir', 'aria-haspopup': 'dialog' }, h('span', null, e({ '': 'Deportistas', 'Personal de apoyo': 'P. de apoyo', 'Equipos': 'Equipos' }[lista])), '<svg viewBox="0 0 16 10" aria-hidden="true"><path d="M2 2l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
          + h('div', { class: 'nws-fl__hoja' }, h('div', { class: 'nws-fl__hoja-velo', 'data-fl-hoja': 'cerrar' }),
            h('div', { class: 'nws-fl__hoja-panel', role: 'dialog', 'aria-label': 'Elige una opción' }, h('span', { class: 'nws-fl__hoja-asa' }),
              h('div', { class: 'nws-fl__hoja-cab' }, h('h3', null, 'Elige una opción'), h('button', { type: 'button', 'data-fl-hoja': 'cerrar', 'aria-label': 'Cerrar' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>')),
              [['', 'Deportistas'], ['Personal de apoyo', 'Personal de apoyo'], ['Equipos', 'Equipos']].map(function (o) { return h('button', { type: 'button', class: 'nws-fl__hoja-op', 'data-fl-opcion': o[0] }, e(o[1])); }).join(''))))
        + h('div', { class: 'nws-fl__insc-lista' }, filas);
      pie = h('button', { type: 'button', class: 'nws-fl__pie-it', 'data-vw-cerrar': 'true' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Perfil</span>')
        + h('button', { type: 'button', class: 'nws-fl__pie-it nws-fl__pie-it--act', 'aria-current': 'page' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>Inscritos</span>');
    } else if (id === 'equipo') {
      t = 'Perfil del grupo'; barraLogo = true; x = competencia('baloncesto');
      /* perfil del grupo (registered_team_details_screen.dart): estructura según el código, datos de ejemplo */
      b = h('button', { type: 'button', class: 'nws-fl__atras', 'data-vw-cerrar': 'true', 'aria-label': 'Volver' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        + h('h2', { class: 'nws-fl__apoyo-t' }, 'Perfil del grupo')
        + h('div', { class: 'nws-fl__apoyo-cab' }, h('span', { class: 'nws-fl__reg-ico', 'aria-hidden': 'true' }, h('img', { class: 'nws-fl__reg-img', src: ICONO_DEPORTE['Baloncesto'], alt: '' })), h('p', { class: 'nws-fl__apoyo-n' }, e(x.prueba + ' - ' + x.categoria.replace(' · ', ' '))))
        + h('div', { class: 'nws-fl__minmax' }, h('span', null, 'Mínimo <strong>5</strong>'), h('span', null, 'Máximo <strong>12</strong>'))
        + h('div', { class: 'nws-fl__equipo-acc' }, h('button', { type: 'button', class: 'nws-fl__btn-sec', 'data-toast': 'Inscribir P. de apoyo' }, 'Inscribir P. de apoyo'), h('button', { type: 'button', class: 'nws-fl__btn-pri', 'data-toast': 'Inscribir deportista' }, 'Inscribir deportista'))
        + tabs(['Deportistas', 'Personal de apoyo'], st);
      if (+st.tab === 1) {
        b += h('h2', { class: 'nws-fl__apoyo-sec' }, 'Personal de apoyo asignado')
          + h('div', { class: 'nws-fl__apoyo-fila' }, h('span', { class: 'nws-fl__apoyo-doc' }, '1020304099'), h('span', { class: 'nws-fl__apoyo-nom' }, 'Marisol Aurora Cielo'), h('span', { class: 'nws-fl__apoyo-doc' }, 'Sin rol asignado'));
      } else {
        b += h('div', { class: 'nws-fl__insc-cab' }, h('h2', { class: 'nws-fl__apoyo-sec nws-fl__apoyo-sec--sm' }, 'Deportistas Actuales'), h('span', { class: 'nws-fl__apoyo-doc' }, '2 de 12'))
          + F.deportistas.filter(function (a) { return a.deporte === 'Baloncesto'; }).map(function (a, i) { return h('div', { class: 'nws-fl__apoyo-fila' }, h('span', { class: 'nws-fl__apoyo-doc' }, '10203040' + (53 + i)), h('span', { class: 'nws-fl__apoyo-nom' }, e(a.nombre))); }).join('');
      }
    } else if (id === 'atleta') {
      x = F.deportistas[+k || 0]; t = 'Perfil del deportista'; barraLogo = true;
      /* perfil del deportista inscrito de la app: datos de ejemplo */
      var partes = String(x.categoria).split(' · '), sexo = /Fem/.test(partes[1] || '') ? 'Mujer' : 'Hombre';
      var cardA = function (tit, cuerpo) { return tarjeta('nws-fl__inst-card', h('h2', null, e(tit)) + cuerpo); };
      b = h('button', { type: 'button', class: 'nws-fl__atras', 'data-vw-cerrar': 'true', 'aria-label': 'Volver' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        + h('h2', { class: 'nws-fl__apoyo-t' }, 'Perfil del deportista')
        + h('div', { class: 'nws-fl__apoyo-cab' }, h('span', { class: 'nws-fl__apoyo-av nws-fl__apoyo-av--g', 'aria-hidden': 'true' }, e(x.nombre.charAt(0))), h('p', { class: 'nws-fl__apoyo-n' }, e(x.nombre)))
        + cardA('Info. Personal', h('div', { class: 'nws-fl__grid' }, celdaX('Fecha de nacimiento', '15 de mayo, 2010'), celdaX('Sexo', sexo),
          h('div', { class: 'nws-fl__celda' }, h('span', { class: 'nws-fl__celda-l' }, 'Deporte'), h('span', { class: 'nws-fl__chip-dep' }, h('img', { src: ICONO_DEPORTE[x.deporte] || ICONO_PIN, alt: '' }), e(x.deporte)))))
        + cardA('Info. Deportiva', h('div', { class: 'nws-fl__grid' }, celdaX('Tipo de deporte', x.deporte === 'Atletismo' ? 'Individual' : 'Equipo'), celdaX('Categoría', partes[0])))
        + cardA('Personal de apoyo', h('div', { class: 'nws-fl__grid' }, celdaX('Nombre', 'Marisol Aurora Cielo')));
      pie = h('button', { type: 'button', class: 'nws-fl__pie-it', 'data-vw-cerrar': 'true' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Perfil</span>')
        + h('button', { type: 'button', class: 'nws-fl__pie-it nws-fl__pie-it--act', 'aria-current': 'page' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><span>Inscritos</span>');
    } else if (id === 'apoyo') {
      t = 'Perfil del personal de apoyo'; barraLogo = true;
      /* perfil del personal de apoyo de la app: datos de ejemplo */
      var dep = function (nom) { return h('span', { class: 'nws-fl__insc-dep' }, h('img', { src: ICONO_DEPORTE['Atletismo'], alt: '' }), e(nom)); };
      b = h('button', { type: 'button', class: 'nws-fl__atras', 'data-vw-cerrar': 'true', 'aria-label': 'Volver' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        + h('h2', { class: 'nws-fl__apoyo-t' }, 'Perfil del personal de apoyo')
        + h('div', { class: 'nws-fl__apoyo-cab' }, h('span', { class: 'nws-fl__apoyo-av', 'aria-hidden': 'true' }, 'M'),
          h('div', { class: 'nws-fl__apoyo-tx' }, h('span', { class: 'nws-fl__insc-apoyo nws-fl__insc-apoyo--con' }, 'Asignado'), h('p', { class: 'nws-fl__apoyo-n' }, 'Marisol Aurora Cielo'), h('p', { class: 'nws-fl__apoyo-r' }, 'Entrenador')))
        + tarjeta('nws-fl__apoyo-info', h('h3', null, 'Info. Personal') + h('div', { class: 'nws-fl__grid' }, celdaX('Instituciones', '1 asignadas'), celdaX('Email', 'marisol@ejemplo.com')))
        + tabs(['Instituciones', 'Deportes', 'Deportistas'], st);
      if (+st.tab === 1) {
        b += h('h2', { class: 'nws-fl__apoyo-sec' }, 'Deportes asignados') + h('span', { class: 'nws-fl__apoyo-dep' }, h('img', { src: ICONO_DEPORTE['Atletismo'], alt: '' }), 'Atletismo - Juvenil');
      } else if (+st.tab === 2) {
        b += h('h2', { class: 'nws-fl__apoyo-sec' }, 'Deportistas asignados')
          + [['1020304050', 'Elian Brisaclara'], ['1020304052', 'Darío Nubecalma']].map(function (d) { return h('div', { class: 'nws-fl__apoyo-fila' }, h('span', { class: 'nws-fl__apoyo-doc' }, d[0]), h('span', { class: 'nws-fl__apoyo-nom' }, d[1]), h('span', { class: 'nws-fl__apoyo-doc' }, 'Atletismo - Juvenil')); }).join('')
          + h('button', { type: 'button', class: 'nws-fl__agregar', 'data-toast': 'Agregar deportistas' }, '+ Agregar deportistas');
      } else {
        b += h('h2', { class: 'nws-fl__apoyo-sec' }, 'Instituciones relacionadas')
          + h('div', { class: 'nws-fl__apoyo-fila nws-fl__apoyo-fila--inst' }, h('span', { class: 'nws-fl__apoyo-fila-l' }, h('span', { class: 'nws-fl__apoyo-nom' }, 'Institución de ejemplo'), h('span', { class: 'nws-fl__apoyo-doc' }, 'Entrenador')), dep('Atletismo'));
      }
    } else if (id === 'noticias') {
      t = 'Noticias';
      b = h('h1', { class: 'nws-fl__h1 nws-fl__h1--noticias' }, 'Noticias') + [L.novedad].concat(L.noticias).map(function (n, i) {
        return enlace('noticia', i, h('img', { class: 'nws-fl__noti-img', src: n.img, alt: '' })
          + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__noti-t' }, e(n.titulo)), h('span', { class: 'nws-fl__noti-f' }, e(n.fecha))), 'nws-fl__fila--noticia');
      }).join('');
    } else if (id === 'noticia') {
      x = [L.novedad].concat(L.noticias)[+k || 0]; t = 'Noticia';
      b = h('img', { class: 'nws-fl__noticia-foto', src: x.img, alt: '' }) + h('p', { class: 'nws-fl__noticia-fecha' }, e(x.fecha))
        + h('h1', { class: 'nws-fl__noticia-t' }, e(x.titulo)) + (x.autoria ? h('p', { class: 'nws-fl__noticia-aut' }, e(x.autoria)) : '')
        + h('p', { class: 'nws-fl__noticia-txt' }, e(x.cuerpo || x.resumen))
        + h('button', { type: 'button', class: 'nws-fl__noticia-btn', 'data-toast': 'Leer noticia completa' }, 'Leer noticia completa');
    } else if (id === 'sedes') {
      x = competencia(k); t = 'Sedes';
      b = (x.sedes || [x.sede]).map(function (n) {
        var v = sede(n);
        return tarjeta('nws-fl__sede-modal', h('p', { class: 'nws-fl__sm-t' }, e(v.nombre)) + h('p', { class: 'nws-fl__sm-d' }, e(v.direccion)) + h('img', { class: 'nws-fl__sm-img', src: v.img, alt: '' }));
      }).join('');
    } else if (id === 'sede') {
      x = sede(k); t = 'Sede deportiva'; foto = x.img;
      /* como la pantalla de sede de la app: la foto es la cabecera (el botón volver va encima) y la tarjeta
         blanca la cubre con nombre, dirección, botón de ubicación, divisor y zonas */
      b = tarjeta('nws-fl__sede-card', h('div', { class: 'nws-fl__sede-cab' },
          h('div', { class: 'nws-fl__sede-tx' }, h('h1', { class: 'nws-fl__sede-t' }, e(x.nombre)), h('p', { class: 'nws-fl__sede-dir' }, e(x.direccion))),
          h('button', { type: 'button', class: 'nws-fl__sede-pin', 'data-toast': 'Ver ubicación', 'aria-label': 'Ver ubicación' }, PIN))
        + h('hr', { class: 'nws-fl__divisor' }) + titulo('Zonas del escenario')
        + h('ul', { class: 'nws-fl__lista' }, x.zonas.map(function (z) { return h('li', null, e(z)); })));
    } else if (id === 'competencias') {
      t = 'Todas las competencias'; x = regional(k);
      var nombreReg = (String(k).indexOf('individuales:') === 0 ? 'Regional de individuales' : 'Regional de conjuntos') + ' · ' + x.nombre.replace(/^Regional /, '');
      b = tarjeta('nws-fl__cabecera-reg', h('div', { class: 'nws-fl__reg-fila' }, h('span', { class: 'nws-fl__reg-ico', 'aria-hidden': 'true' }, h('img', { class: 'nws-fl__reg-img', src: ICONO_PIN, alt: '' })),
          h('div', { class: 'nws-fl__reg-tx' }, h('p', { class: 'nws-fl__reg-t' }, e(nombreReg)), h('p', { class: 'nws-fl__reg-sub' }, 'Todas las competencias')))
        + dias(st))
        + tabs(['Competencias', 'En vivo'], st, F.competencias.some(function (c) { return deRegional(c, k) && c.estado === 'En curso'; })) + h('h2', { class: 'nws-fl__explora' }, 'Explora')
        + select('', 'deporte', deportesRegional(k), st, false, 'Buscar por deporte') + h('div', { 'data-fl-lista': true }, listaCompetencias(st, k));
    } else if (id === 'deporte') {
      /* Nivel deporte: se entra al deporte y, por día, se ven sus pruebas; cada prueba abre su competencia. */
      x = competencia(k); t = x.deporte; violeta = true; sub = st.regSub || null;
      var fechasD = st.dias || F.dias, stD = st;
      /* Si se entra desde una prueba (atletismo), el título es la prueba y la franja trae solo sus días. */
      if (st.prueba && x.eventos) {
        var evD = x.eventos.filter(function (q) { return q.nombre === st.prueba; })[0], agD = agDe(x, st);
        if (evD) {
          var corteD = Math.ceil(agD.dias.length / 2), diasP = agD.dias.filter(function (_, i) { return evD.mitad === 2 || (evD.mitad === 0 ? i < corteD : i >= corteD); });
          t = tituloPrueba(evD, x); fechasD = diasP; stD = Object.assign({}, st); stD.ag = Object.assign({}, st.ag || {}); stD.ag[x.id] = { dias: diasP, cuenta: diasP.map(function () { return (evD.hits || 0) + 1; }) };
        }
      }
      if (st.prueba && x.eventos && evD) {
        /* Dentro de la prueba (atletismo): morado con la regional, la prueba, la sede y los días; abajo Series y, si ya hay, Podio general. */
        var rp = datosPrueba(x, evD, fechasD), diaP = fechasD.indexOf(st.dia) >= 0 ? st.dia : fechasD[0], hayPodio = rp.estado === 'Finalizado';
        zona = diasZona(fechasD, diaP, x, stD, true); zonaLista = true; eyebrow = st.regTitulo || null;
        var seriesDia = rp.porDia[diaP] || [];
        var vistaSeries = h('h2', { class: 'nws-fl__explora' }, 'Enfrentamientos del día')
          + h('div', { class: 'nws-fl__se-l' }, seriesDia.map(function (q, i) { return serieTarjeta(q, i, rp.estado, x); }).join(''));
        var pod = function (n) {
          var a = rp.general[n - 1];
          return h('div', { class: 'nws-fl__pd nws-fl__pd--' + n },
            h('span', { class: 'nws-fl__pd-av' }, h('i', null, ICO_USR), h('span', { class: 'nws-fl__pd-m' }, n)),
            h('b', null, e(a.nombre)), h('small', null, e(a.departamento)), h('span', { class: 'nws-fl__pd-v' }, e(a.marca)));
        };
        var vistaPodio = h('div', { class: 'nws-fl__cab-r' }, h('h2', { class: 'nws-fl__explora' }, 'Podio general'), estadoPill(rp.estado))
          + h('div', { class: 'nws-fl__pdio', role: 'group', 'aria-label': 'Podio general' }, pod(2) + pod(1) + pod(3))
          + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja nws-fl__rf-l--sep' }, rp.general.slice(3, 8).map(function (a, i) { return filaRes(a, i + 4, [a.departamento], true); }).join(''));
        var fichas = hayPodio ? h('div', { class: 'nws-fl__tabs nws-fl__ch', role: 'group', 'aria-label': 'Ver' },
          h('button', { type: 'button', class: S.cls('nws-fl__ch-b', +st.tab !== 1 && 'nws-fl__ch-b--on'), 'data-tab': '0', 'aria-pressed': +st.tab !== 1 ? 'true' : 'false' }, 'Enfrentamientos'),
          h('button', { type: 'button', class: S.cls('nws-fl__ch-b', +st.tab === 1 && 'nws-fl__ch-b--on'), 'data-tab': '1', 'aria-pressed': +st.tab === 1 ? 'true' : 'false' }, ICO_COPA, 'Podio general')) : '';
        b = fichas + (hayPodio && +st.tab === 1 ? vistaPodio : vistaSeries);
        return { titulo: t, sub: sub, violeta: true, eyebrow: eyebrow, html: b, zona: zona, zonaLista: true, sinTitulo: true, dev: 'fl-deporte' };
      }
      if (x.tipo === 'equipo') {
        /* Deporte de conjunto: sus pruebas (sexo y edad) con los partidos del día; cada una abre sus partidos. */
        var icoE = ICONO_DEPORTE[x.deporte] || ICONO_PIN, agE = agDe(x, st), diaE = fechasD.indexOf(st.dia) >= 0 ? st.dia : agE.dias[0];
        zona = diasZona(fechasD, diaE, x, st, true); zonaLista = true; eyebrow = st.regTitulo || null; t = x.deporte;
        b = h('h2', { class: 'nws-fl__explora' }, 'Pruebas del día') + h('div', { class: 'nws-fl__filas' }, pruebasEq(x).map(function (pr) {
          var n = partidosEq(x, pr.i, diaE, st).length;
          return h('button', { type: 'button', class: 'nws-fl__fila nws-fl__fila--tarjeta', 'data-flujo': 'competencia', 'data-clave': x.id, 'data-prueba': pr.i },
            h('span', { class: 'nws-fl__cuadro' }, h('img', { class: 'nws-fl__cuadro-img', src: icoE, alt: '' }))
            + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__fila-t' }, e(pr.rotulo)), h('span', { class: 'nws-fl__fila-m' }, n ? n + (n === 1 ? ' partido' : ' partidos') + ' · ' + fechaCorta(diaE).replace(/^\w+, /, '') : 'Sin partidos este día'))
            + ir());
        }).join(''));
        return { titulo: t, sub: sub, violeta: true, eyebrow: eyebrow, html: b, zona: zona, zonaLista: true, sinTitulo: true, dev: 'fl-deporte' };
      }
      var icoD = ICONO_DEPORTE[x.deporte] || ICONO_PIN, diaD = fechasD.indexOf(st.dia) >= 0 ? st.dia : agDe(x, stD).dias[0], pruebasD = pruebasDelDia(x, diaD, stD).filter(function (pr) { return !st.prueba || pr.nombre === st.prueba; });
      zona = diasZona(fechasD, diaD, x, stD); zonaLista = true;
      b = pruebasD.length
        ? h('h2', { class: 'nws-fl__explora' }, pruebasD.length === 1 ? '1 prueba' : pruebasD.length + ' pruebas') + h('div', { class: 'nws-fl__filas' }, pruebasD.map(function (pr) {
          return enlace('competencia', x.id,
            h('span', { class: 'nws-fl__cuadro' }, h('img', { class: 'nws-fl__cuadro-img', src: icoD, alt: '' }))
            + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__fila-t' }, e(pr.nombre)), h('span', { class: 'nws-fl__fila-m' }, e(pr.n + ' ' + (pr.n === 1 ? pr.unidad.replace(/s$/, '') : pr.unidad))))
            + ir(), 'nws-fl__fila--tarjeta');
        }).join(''))
        : texto('No hay pruebas este día.');
    } else if (id === 'serie') {
      /* «Ver más» de una serie (atletismo): todos los deportistas con institución, departamento y el botón del perfil; sin marca si no se ha corrido. */
      x = competencia(k); violeta = true;
      var evS = (x.eventos || []).filter(function (q) { return q.nombre === st.prueba; })[0] || (x.eventos || [])[0], agS = agDe(x, st);
      var corteS = Math.ceil(agS.dias.length / 2), diasS = agS.dias.filter(function (_, i) { return evS.mitad === 2 || (evS.mitad === 0 ? i < corteS : i >= corteS); });
      var rs = datosPrueba(x, evS, diasS), qs = rs.todas.filter(function (q) { return q.n === +st.serie; })[0] || rs.todas[0], hechoS = rs.estado === 'Finalizado';
      b = h('div', { class: 'nws-fl__cab-r' }, h('h2', { class: 'nws-fl__explora' }, 'Resultado de la prueba'), estadoPill(rs.estado))
        + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja nws-fl__rf-l--det' }, qs.filas.map(function (f, i) { return filaRes(f, i + 1, [f.institucion, f.departamento], hechoS, true); }).join(''));
      return { titulo: qs.fin ? 'Final Directa' : 'Hit ' + qs.hit + ' · Ronda Clasificación', violeta: true, eyebrow: tituloPrueba(evS, x), html: b, sinAviso: true, hoja: true, dev: 'fl-serie' };
    } else if (id === 'competencia' && competencia(k).tipo === 'equipo') {
      /* Prueba de un deporte de conjunto: fichas Partidos | Posiciones. */
      x = competencia(k); violeta = true; sub = st.regSub || null;
      var pe = pruebasEq(x)[+st.prueba || 0], agC = agDe(x, st), fechasQ = st.dias || F.dias, diaQ = agC.dias.indexOf(st.dia) >= 0 ? st.dia : agC.dias[0], icoQ = ICONO_DEPORTE[x.deporte] || ICONO_PIN;
      var psQ = partidosEq(x, pe.i, diaQ, st), tabQ = +st.tab || 0, todosQ = [];
      agC.dias.forEach(function (d) { partidosEq(x, pe.i, d, st).forEach(function (m) { todosQ.push(m); }); });
      var ficha = function (n, txt, cuenta) { return h('button', { type: 'button', class: S.cls('nws-fl__ch-b', tabQ === n && 'nws-fl__ch-b--on'), 'data-tab': String(n), 'aria-pressed': tabQ === n ? 'true' : 'false' }, txt, cuenta != null ? h('span', { class: 'nws-fl__ch-n' }, cuenta) : ''); };
      var fichasQ = h('div', { class: 'nws-fl__tabs nws-fl__ch', role: 'group', 'aria-label': 'Ver' }, ficha(0, 'Partidos'), ficha(1, 'Grupos'), ficha(2, 'Posiciones'));
      if (tabQ === 2) {
        var tq = tablaEq(x, pe.i, st);
        b = fichasQ + Object.keys(tq).sort().map(function (g) {
          return h('h2', { class: 'nws-fl__explora' }, e(g)) + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja nws-fl__pos-t' + (tq[g][0].sets ? ' nws-fl__pos-t--sets' : '') }, h('div', { class: 'nws-fl__pos-h' }, '<span>#</span><span>Equipo</span><span>PJ</span><span>G</span><span>P</span>' + (tq[g][0].sets ? '<span>SG</span><span>SP</span>' : '') + '<span>DIF</span><span>PTS</span>')
            + tq[g].map(function (r, i) { var d = r.pf - r.pc; return h('div', { class: 'nws-fl__pos-r' }, h('span', { class: 'nws-fl__rf-p' }, i + 1), h('span', { class: 'nws-fl__pos-e' }, e(r.q.nombre), h('small', null, e(r.q.departamento))), h('span', null, r.pj), h('span', null, r.g), h('span', null, r.p), r.sets ? h('span', null, r.pf) + h('span', null, r.pc) : '', h('span', { class: 'nws-fl__pos-d' }, (d > 0 ? '+' : '') + d), h('span', { class: 'nws-fl__pos-p' }, r.pts)); }).join(''));
        }).join('');
      } else if (tabQ === 1) {
        /* Todos: los enfrentamientos de la prueba en todos los días, agrupados por día */
        b = fichasQ + (todosQ.length ? agC.dias.map(function (d) {
          var del = todosQ.filter(function (m) { return m.dia === d; }); if (!del.length) { return ''; }
          return h('h2', { class: 'nws-fl__explora' }, e(fechaCorta(d))) + h('div', { class: 'nws-fl__se-l' }, del.map(function (m) { return partidoCompacto(m, x); }).join(''));
        }).join('') : texto('No hay partidos en esta prueba.'));
      } else {
        b = fichasQ + h('h2', { class: 'nws-fl__explora' }, 'Partidos del día') + (psQ.length ? h('div', { class: 'nws-fl__se-l' }, psQ.map(function (m, i) { return partidoTarjeta(m, i, x, pe.i, icoQ); }).join('')) : texto('No hay partidos este día.'));
      }
      return { titulo: pe.titulo, sub: sub, violeta: true, eyebrow: st.regTitulo || null, html: b, sinAviso: true, hoja: true, dev: 'fl-competencia' };
    } else if (id === 'competencia') {
      x = competencia(k); t = x.prueba + ' ' + x.categoria.replace(' · ', ' '); violeta = true; sub = st.regSub || null;
      var ico = ICONO_DEPORTE[x.deporte] || ICONO_PIN, fechasC = st.dias || F.dias, diaC = st.dia || agDe(x, st).dias[0];
      zona = diasZona(fechasC, diaC, x, st); zonaLista = true;
      var partidos = partidosDelDia(x, diaC, st);
      b = tabs(['Competencias', 'En vivo', 'Posiciones', 'Sedes'], st, (x.enCursoRondas || []).length > 0)
        + select('', 'llave', x.rondas, st, false, 'Buscar por llave');
      var visibles = partidos.filter(function (m) { return (!st.llave || st.llave === m.ronda) && (+st.tab !== 1 || (x.enCursoRondas || []).indexOf(m.ronda) >= 0); });
      if (!partidos.length) { b += texto('No hay competencias este día.'); }
      else if (+st.tab === 1 && !visibles.length) { b += texto('No hay enfrentamientos en curso este día.'); }
      else {
        b += h('div', { class: 'nws-fl__filas' }, visibles.map(function (m) {
          var vivo = (x.enCursoRondas || []).indexOf(m.ronda) >= 0;
          return enlace(x.tipo === 'equipo' ? 'partido' : 'salida', x.id,
            h('span', { class: 'nws-fl__hora' }, h('img', { class: 'nws-fl__hora-ico', src: ico, alt: '' }), h('span', { class: 'nws-fl__hora-t' }, e(horaCorta(m.hora))))
            + h('span', { class: 'nws-fl__fila-cuerpo' },
              h('span', { class: 'nws-fl__ronda-fila' }, h('span', { class: 'nws-fl__fila-t' }, e(m.ronda)), vivo ? h('span', { class: 'nws-fl__en-curso' }, h('span', { class: 'nws-fl__en-curso-pt' }), 'En curso') : '')
              + (x.tipo === 'equipo'
                ? h('span', { class: 'nws-fl__fila-m' }, e(m.a.nombre)) + h('span', { class: 'nws-fl__fila-m' }, '<span class="nws-fl__flecha-vs">↳</span> <strong class="nws-fl__vs-b">VS</strong> ' + e(m.b.nombre))
                : h('span', { class: 'nws-fl__fila-m' }, e(m.sub || x.prueba)))
              + h('span', { class: 'nws-fl__chip-sede' }, PINCHIP + e(sede(x.sede).nombre))),
            'nws-fl__fila--tarjeta nws-fl__fila--partido');
        }).join(''));
      }
    } else if (id === 'posiciones') {
      x = competencia(k); t = 'Posiciones';
      /* la app decide por datos: con posiciones finales muestra «Resultados finales»; si la competencia sigue en curso,
         muestra la tabla por grupos */
      if (x.estado === 'Finalizado') {
        var ranking = F.equipos.slice().sort(function (a, c2) { return (c2.puntos - a.puntos) || ((c2.pf - c2.pc) - (a.pf - a.pc)); });
        b = h('h1', { class: 'nws-fl__h1 nws-fl__h1--grande nws-fl__centro' }, 'Posiciones')
          + h('p', { class: 'nws-fl__disciplina nws-fl__centro' }, e(x.prueba))
          + h('span', { class: 'nws-fl__chip-cat nws-fl__chip-cat--centro' }, PERSONA + e(x.categoria))
          + tarjeta('nws-fl__resultados', h('h2', { class: 'nws-fl__res-h' }, 'Resultados finales')
            + h('div', { class: 'nws-fl__res-cab' }, h('span', { class: 'nws-fl__res-n' }, '#'), h('span', { class: 'nws-fl__res-eq' }, 'Equipo'), h('span', { class: 'nws-fl__res-pts' }, 'Pts'))
            + ranking.map(function (q, i) {
              return h('div', { class: S.cls('nws-fl__res-fila', i === 0 && 'nws-fl__res-fila--lider') },
                h('span', { class: S.cls('nws-fl__pos', i === 0 && 'nws-fl__pos--lider') }, i + 1),
                h('span', { class: 'nws-fl__res-eq' }, e(q.nombre + ' - ' + q.departamento)),
                h('span', { class: 'nws-fl__pts' }, q.puntos));
            }).join(''));
      } else {
      var dg = function (q) { var d = q.pf - q.pc; return (d > 0 ? '+' : '') + d; };
      b = h('h1', { class: 'nws-fl__h1 nws-fl__h1--grande nws-fl__centro' }, 'Posiciones')
        + h('p', { class: 'nws-fl__disciplina nws-fl__centro' }, e(x.prueba + ' ' + x.categoria.replace(' · ', ' ')))
        + h('span', { class: 'nws-fl__chip-cat nws-fl__chip-cat--centro' }, PERSONA + e(x.categoria))
        + x.grupos.map(function (g) {
          return h('details', { class: 'nws-fl__grupo', open: true }, h('summary', null, e(g), FLECHA_GRUPO),
            tablaPosiciones(['#', 'Equipo', 'PJ', 'PG', 'PP', 'PF', 'PC', 'DG', 'Pts'], F.equipos.filter(function (q) { return q.grupo === g; }).map(function (q, i) {
              return [{ html: '<span class="nws-fl__pos' + (i === 0 ? ' nws-fl__pos--lider' : '') + '">' + (i + 1) + '</span>' }, q.nombre + ' - ' + q.departamento, q.pj, q.pg, q.pp, q.pf, q.pc, dg(q), { html: '<span class="nws-fl__pts">' + q.puntos + '</span>' }];
            })));
        }).join('')
        + tarjeta('nws-fl__convenciones', h('h2', null, ICONO_BARRAS + 'Convenciones')
          + h('div', { class: 'nws-fl__leyenda' },
            h('div', null, ['PJ|Partidos jugados', 'PG|Partidos ganados', 'PP|Partidos perdidos'].map(function (s) { s = s.split('|'); return h('p', null, h('strong', null, s[0]) + e(s[1])); }).join('')),
            h('div', null, ['PF|Puntos a favor', 'PC|Puntos en contra', 'DG|Diferencia de puntos', 'Pts|Puntos'].map(function (s) { s = s.split('|'); return h('p', null, h('strong', null, s[0]) + e(s[1])); }).join(''))));
      }
    } else if (id === 'salida') {
      x = competencia(k); t = 'Lista de salida';
      b = tarjeta('nws-fl__cabecera', h('h1', { class: 'nws-fl__h1' }, e(x.rondas[x.rondas.length - 1])) + texto(x.prueba + ' · ' + x.categoria) + texto(x.hora + ' · ' + sede(x.sede).nombre));
      if (x.subpruebas) { b += tabs(x.subpruebas, st); }
      b += F.deportistas.filter(function (a) { return a.deporte === x.deporte; }).map(function (a) {
        var clave = F.deportistas.indexOf(a);
        return enlace('deportista', clave, h('span', { class: 'nws-fl__num' }, a.numero)
          + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__fila-m' }, e(a.institucion + ' · ' + a.departamento)), h('span', { class: 'nws-fl__fila-t' }, e(a.nombre)),
            h('span', { class: 'nws-fl__fila-m' }, e((x.subpruebas || ['Marca'])[+st.tab || 0] + ': ' + a.marcas[+st.tab || 0] + ' · Total ' + a.total)))
          + ir(), 'nws-fl__fila--tarjeta');
      }).join('');
    } else if (id === 'deportista') {
      x = F.deportistas[+k || 0]; t = 'Perfil del deportista';
      var celda = function (label, valor) { return h('div', { class: 'nws-fl__celda' }, h('span', { class: 'nws-fl__celda-l' }, e(label)), h('span', { class: 'nws-fl__celda-v' }, e(valor))); };
      var icono = ICONO_DEPORTE[x.deporte] || ICONO_PIN;
      var comp = competencia(x.deporte === 'Atletismo' ? 'atletismo' : 'baloncesto');
      b = h('div', { class: 'nws-fl__perfil-fila' }, h('span', { class: 'nws-fl__foto-ini', 'aria-hidden': 'true' }, e(x.nombre.charAt(0))),
          h('div', { class: 'nws-fl__perfil-tx' }, h('p', { class: 'nws-fl__perfil-n' }, e(x.nombre)), h('p', { class: 'nws-fl__perfil-i' }, e(x.institucion))))
        + tarjeta('nws-fl__datos', h('div', { class: 'nws-fl__grid' }, celda('Departamento', x.departamento), celda('Municipio', x.municipio),
          h('div', { class: 'nws-fl__celda' }, h('span', { class: 'nws-fl__celda-l' }, 'Deporte'), h('span', { class: 'nws-fl__chip-dep' }, h('img', { src: icono, alt: '' }), e(x.deporte))),
          celda('Categoría', x.categoria)))
        + titulo('Competencias')
        + tarjeta('nws-fl__comp-card', h('span', { class: 'nws-fl__cuadro', 'aria-hidden': 'true' }, h('img', { class: 'nws-fl__cuadro-img', src: icono, alt: '' }))
          + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__comp-t' }, e(comp.prueba)), h('span', { class: 'nws-fl__fila-m' }, e(comp.categoria))));
    } else if (id === 'partido') {
      /* «Ver más» de un partido de conjunto: marcador, parciales por periodo y nómina de los dos equipos. */
      var cP = competencia(k), pP = pruebasEq(cP)[+st.prueba || 0], kk = String(st.serie || '').split('|'), lP = partidosEq(cP, pP.i, kk[0] || (agDe(cP, st).dias[0]), st), mP = lP[+kk[1] || 0] || lP[0];
      violeta = true;
      var per = periodosDe(cP), ets = mP.est !== 'Programado' && mP.pa ? mP.pa.map(function (_, q) { return (per.t === 'S' ? 'S' : per.t) + (q + 1); }) : [];
      var fil = function (q, ls, arr, gana) { return h('div', { class: S.cls('nws-fl__pc-r', gana && 'nws-fl__pc-r--gan'), style: '--n:' + ets.length }, h('span', { class: 'nws-fl__pc-e' }, e(sigla(q.departamento))), arr.map(function (v) { return h('span', null, v); }).join(''), h('span', { class: 'nws-fl__pc-t' }, ls)); };
      var parc = mP.est === 'Programado' || !mP.pa ? h('h2', { class: 'nws-fl__explora' }, per.t === 'S' ? 'Detalle de sets' : 'Parciales') + h('p', { class: 'nws-fl__pc-sin' }, mP.est === 'Programado' ? 'Los parciales aparecen cuando empieza el partido.' : 'Sin detalle de sets digitado.')
        : h('h2', { class: 'nws-fl__explora' }, 'Parciales') + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja' }, h('div', { class: 'nws-fl__pc-h', style: '--n:' + ets.length }, '<span>Equipo</span>' + ets.map(function (q) { return '<span>' + q + '</span>'; }).join('') + '<span>Total</span>')
          + fil(mP.a, mP.ls, mP.pa, mP.ls > mP.vs) + fil(mP.b, mP.vs, mP.pb, mP.vs > mP.ls)) + (mP.est === 'En curso' ? h('p', { class: 'nws-fl__pc-sin' }, 'Los parciales se actualizan mientras se juega.') : '');
      b = h('div', { class: 'nws-fl__cab-r' }, h('h2', { class: 'nws-fl__explora' }, 'Resultado del partido'), estadoPill(mP.est))
        + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja nws-fl__cj-det' }, marcadorHtml(mP))
        + tabs(['Detalle', 'Equipos'], st)
        + (+st.tab === 1 ? nominaHtml(cP, mP.a, pP.sexo, 0) + nominaHtml(cP, mP.b, pP.sexo, 3) : parc);
      return { titulo: 'Partido ' + mP.n, violeta: true, eyebrow: pP.titulo, html: b, sinAviso: true, hoja: true, dev: 'fl-partido' };
    } else if (id === 'podio') {
      // Flutter abre TopMedalsPodiumScreen(soloPosiciones: true) en regionales.
      x = competencia(k); t = 'Posiciones';
      b = h('h1', { class: 'nws-fl__h1' }, e(x.prueba)) + texto(x.categoria)
        + tablaPosiciones(['Pos.', 'Deportista', 'Marca', 'Pts'], F.deportistas.filter(function (a) { return a.deporte === x.deporte; }).map(function (a, i) {
          return [{ html: '<span class="nws-fl__pos' + (i === 0 ? ' nws-fl__pos--lider' : '') + '">' + (i + 1) + '</span>' }, a.nombre + ' · ' + a.departamento, a.marcas[0], { html: '<span class="nws-fl__pts">' + a.total + '</span>' }];
        }));
    } else if (id === 'resultados') {
      t = L.app.resultados.titulo;
      b = select('Deporte', 'deporte', F.deportes, st) + L.app.resultados.items.filter(function (r) { return !st.deporte || r.deporte === st.deporte; }).map(function (r) {
        return tarjeta('nws-fl__resultado', h('details', { name: 'jin-resultados' }, h('summary', null, e(r.nombre)), texto(r.categoria + ' · ' + r.ronda + ' · ' + r.fase) + tabla(['Competencia', 'Estado', 'Resultados'], [[r.prueba, r.estado, r.resultado]])));
      }).join('') + texto('Página 1 de 1');
    } else { return null; }
    return { titulo: t, sub: sub, violeta: violeta, foto: foto, naranja: naranja, barraLogo: barraLogo, pie: pie, sinTitulo: id === 'competencias' || id === 'deporte' || id === 'competencia' || id === 'sede' || id === 'posiciones' || id === 'noticias' || id === 'noticia' || id === 'login' || id === 'perfil' || id === 'inscritos' || id === 'equipo', html: b, zona: zona, zonaLista: zonaLista, resumen: resumen, dev: 'fl-' + id, dialogo: id === 'deportista' || id === 'sedes' };
  }
  /* Tabla genérica: cada celda es texto o { html } ya armado. */
  function celda(c) { return c && typeof c === 'object' ? c.html : e(String(c)); }
  function tabla(cab, filas) {
    return h('div', { class: 'nws-fl__tabla', tabindex: 0, role: 'region', 'aria-label': cab.join(', ') }, h('table', null,
      h('thead', null, h('tr', null, cab.map(function (c) { return h('th', { scope: 'col' }, e(c)); }))),
      h('tbody', null, filas.map(function (fila) { return h('tr', null, fila.map(function (c) { return h('td', null, celda(c)); })); }))));
  }
  /* Tabla de posiciones: encabezado gris suave, líder destacado y puntos en caja (group_standings). */
  function tablaPosiciones(cab, filas) {
    return h('div', { class: 'nws-fl__tabla nws-fl__tabla--pos', tabindex: 0, role: 'region', 'aria-label': cab.join(', ') }, h('table', null,
      h('thead', null, h('tr', null, cab.map(function (c) { return h('th', { scope: 'col' }, e(c)); }))),
      h('tbody', null, filas.map(function (fila, i) { return h('tr', { class: i === 0 ? 'nws-fl__tr--lider' : '' }, fila.map(function (c) { return h('td', null, celda(c)); })); }))));
  }
  /* Partidos (o series) de una competencia en un día: la cuenta del día manda; rondas, rivales y horas rotan sobre los datos de ejemplo. */
  /* Días y cuenta de la competencia en la regional abierta (el calendario los deja en el estado); sin ellos, los de la competencia. */
  function agDe(c, st) { return (st && st.ag && st.ag[c.id]) || { dias: c.dias, cuenta: c.cuenta }; }
  /* Pruebas de un deporte en un día: las de atletismo salen de `eventos` (cada una en su mitad de los días); el resto tiene una sola prueba. */
  function pruebasDelDia(c, dia, st) {
    var a = agDe(c, st), n = a.dias.indexOf(dia), corte = Math.ceil(a.dias.length / 2), out = [];
    if (n < 0) { return out; }
    if (c.eventos) { c.eventos.forEach(function (x) { if (x.mitad === 2 || (x.mitad === 0 ? n < corte : n >= corte)) { out.push({ nombre: x.nombre, n: (x.hits || 0) + 1, unidad: 'enfrentamientos' }); } }); return out; }
    out.push({ nombre: c.prueba + ' ' + c.categoria.replace(' · ', ' '), n: a.cuenta[n], unidad: c.unidad });
    return out;
  }
  function fmtMarca(m, v) {
    if (m.tipo === 'distancia') { return v.toFixed(2).replace('.', ',') + ' m'; }
    var mi = Math.floor(v / 60), sg = v - mi * 60, tx = sg.toFixed(2).replace('.', ',');
    return mi ? mi + ':' + (sg < 10 ? '0' : '') + tx : tx + ' s';
  }
  /* ---- Conjuntos: pruebas por sexo y edad, partidos con marcador, posiciones y nómina (datos de ejemplo deterministas) ---- */
  var ICO_BALON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18"/></svg>';
  var NOMBRES_EQ = ['Juan Esteban Rojas', 'Camilo Andrés Peña', 'Santiago Mora', 'Mateo Quintero', 'Samuel Ortiz', 'Daniel Vargas', 'Nicolás Pineda', 'David Salazar', 'Tomás Cárdenas', 'Julián Arango', 'Emmanuel Duarte', 'Sebastián Lozano', 'Valentina Ruiz', 'María Camila Torres', 'Sofía Herrera', 'Laura Gómez', 'Isabella Cano', 'Daniela Moreno', 'Mariana Ríos', 'Luciana Pardo', 'Gabriela Mejía', 'Paula Andrea Silva', 'Juliana Beltrán', 'Sara Córdoba'];
  var ROLES_EQ = { 'Baloncesto': ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'], 'Baloncesto 3x3': ['Base', 'Alero', 'Pívot'], 'Voleibol': ['Armadora', 'Central', 'Opuesta', 'Líbero', 'Punta'] };
  var ROLES_FUTBOL = ['Portero', 'Defensa', 'Defensa', 'Mediocampista', 'Mediocampista', 'Delantero', 'Delantero', 'Extremo'];
  function azar(sem) {   /* mulberry32 con semilla de texto: mismos partidos y marcadores en cada visita */
    var a = 0, i; for (i = 0; i < sem.length; i++) { a = (a * 31 + sem.charCodeAt(i)) | 0; }
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  /* Las dos pruebas de un deporte de conjunto: la categoría de la competencia y su pareja (el otro sexo; si es mixta, la otra edad). */
  function pruebasEq(c) {
    var p = String(c.categoria).split(' · '), ed = p[0], sx = { 'Masculino': 'Hombre', 'Femenino': 'Mujer', 'Mujer': 'Mujer', 'Hombre': 'Hombre' }[p[1]] || p[1];
    var otra = sx === 'Hombre' ? ['Mujer', ed] : sx === 'Mujer' ? ['Hombre', ed] : [sx, ed === 'Juvenil' ? 'Prejuvenil' : 'Juvenil'];
    return [{ i: 0, sexo: sx, edad: ed }, { i: 1, sexo: otra[0], edad: otra[1] }].map(function (q) { q.rotulo = q.sexo + ' · ' + q.edad; q.titulo = c.deporte + ' - ' + q.edad + ' - ' + q.sexo; return q; });
  }
  function sigla(dep) { return String(dep).replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ ]/g, '').slice(0, 3).toUpperCase(); }
  function periodosDe(c) { return /^Voleibol/.test(c.deporte) ? { t: 'S', n: 0 } : /^Baloncesto$/.test(c.deporte) ? { t: 'C', n: 4 } : { t: 'T', n: 2 }; }
  function estadoPartido(c, m) { return c.estado === 'Programado' ? 'Programado' : c.estado === 'Finalizado' ? 'Finalizado' : (c.enCursoRondas || []).indexOf(m.ronda) >= 0 ? 'En curso' : 'Finalizado'; }
  /* Partidos de una prueba en un día: se reparte la cuenta del día entre las dos pruebas y se les da marcador según el estado de la competencia. */
  /* Datos reales (si la competencia los trae para esa regional y esa prueba), en el mismo formato que los generados. */
  function realEq(c, pi, st) {
    var r = c.real && c.real[String(st.regK || '').split(':').pop()], p = r && r.pruebas && r.pruebas[pi]; return p ? { r: r, p: p } : null;
  }
  function partidosReales(c, pi, dia, st) {
    var d = realEq(c, pi, st), todos = d.p.partidos, out = [];
    todos.forEach(function (q, i) {
      if (q.dia !== dia) { return; }
      var m = { n: i + 1, dia: q.dia, idx: out.length, ronda: d.p.grupo + ' · Fecha ' + q.fecha, hora: q.hora, est: 'Finalizado', a: Object.assign({ grupo: d.p.grupo }, d.p.equipos[q.l]), b: Object.assign({ grupo: d.p.grupo }, d.p.equipos[q.v]), sede: d.p.sede, ls: q.ls, vs: q.vs, etq: 'S', per: 'S', real: true };
      if (q.sets) { m.pa = q.sets.map(function (x) { return x[0]; }); m.pb = q.sets.map(function (x) { return x[1]; }); } else { m.pa = null; m.pb = null; }
      out.push(m);
    });
    return out;
  }
  function partidosEq(c, pi, dia, st) {
    if (realEq(c, pi, st)) { return partidosReales(c, pi, dia, st); }
    var a = agDe(c, st), n = a.dias.indexOf(dia), out = [], i, tot, mio, ne = F.equipos.length;
    if (n < 0) { return out; }
    var cuota = function (q) { return pi === 0 ? Math.ceil(q / 2) : Math.floor(q / 2); }, previos = 0;
    a.cuenta.slice(0, n).forEach(function (q) { previos += cuota(q); });
    tot = a.cuenta[n]; mio = cuota(tot);
    for (i = 0; i < mio; i++) {
      var m = { n: previos + i + 1, dia: dia, idx: i, ronda: c.rondas[i % c.rondas.length], hora: horaMas(c.hora, i + pi), a: F.equipos[(2 * i + n + 2 * pi) % ne], b: F.equipos[(2 * i + n + 1 + 2 * pi) % ne] };
      m.est = estadoPartido(c, m);
      if (m.est !== 'Programado') { marcadorEq(c, m, pi); }
      out.push(m);
    }
    return out;
  }
  function marcadorEq(c, m, pi) {
    var r = azar(c.id + m.dia + m.idx + pi + m.a.nombre), per = periodosDe(c), i, pa = [], pb = [];
    if (per.t === 'S') {
      var ga = r() < .5, perd = Math.floor(r() * 2), sets = 2 + perd, ord = [], wa = 0, wb = 0;
      for (i = 0; i < sets - 1; i++) { ord.push(i < perd ? 0 : 1); }   /* al mejor de 3 sets, como en la web */   /* 1 = gana el ganador del partido; el último set siempre es suyo */
      for (i = ord.length - 1; i > 0; i--) { var jx = Math.floor(r() * (i + 1)), tx = ord[i]; ord[i] = ord[jx]; ord[jx] = tx; }
      ord.push(1);
      ord.forEach(function (w) { var lo = 15 + Math.floor(r() * 9), aGana = ga ? !!w : !w; pa.push(aGana ? 25 : lo); pb.push(aGana ? lo : 25); if (aGana) { wa++; } else { wb++; } });
      m.pa = pa; m.pb = pb; m.ls = wa; m.vs = wb; m.etq = 'Set'; m.per = 'S'; return;
    }
    if (per.t === 'T') {
      var f = /Baloncesto/.test(c.deporte) ? [18, 28, 10, 22] : [0, 3, 0, 2];
      var tA = f[0] + Math.floor(r() * f[1]), tB = f[2] + Math.floor(r() * f[3]); if (tA === tB) { tA++; }
      var h1a = Math.round(tA * .5), h1b = Math.round(tB * .5); m.pa = [h1a, tA - h1a]; m.pb = [h1b, tB - h1b]; m.ls = tA; m.vs = tB; m.etq = 'T'; m.per = 'T'; return;
    }
    var tA2 = 28 + Math.floor(r() * 30), tB2 = 18 + Math.floor(r() * 24); if (tA2 === tB2) { tA2++; }
    var fr = [.27, .23, .28], qa = [], qb = [], ra = tA2, rb = tB2;
    for (i = 0; i < 3; i++) { qa.push(Math.round(tA2 * fr[i])); qb.push(Math.round(tB2 * fr[i])); ra -= qa[i]; rb -= qb[i]; }
    qa.push(ra); qb.push(rb); m.pa = qa; m.pb = qb; m.ls = tA2; m.vs = tB2; m.etq = 'C'; m.per = 'C';
  }
  /* Posiciones de la prueba: se suman los partidos finalizados de todos los días, por grupo. */
  function tablaEq(c, pi, st) {
    var a = agDe(c, st), t = {}, out = {};
    a.dias.forEach(function (d) {
      partidosEq(c, pi, d, st).forEach(function (m) {
        [m.a, m.b].forEach(function (q) { if (!t[q.nombre]) { t[q.nombre] = { q: q, pj: 0, g: 0, p: 0, pf: 0, pc: 0, pts: 0, sets: m.per === 'S' }; } });
        if (m.est !== 'Finalizado') { return; }
        var x = t[m.a.nombre], y = t[m.b.nombre]; x.pj++; y.pj++; x.pf += m.ls; x.pc += m.vs; y.pf += m.vs; y.pc += m.ls;
        if (m.per === 'S') {   /* voleibol: 2-0 = 3 pts, 2-1 = 2 pts, 1-2 = 1 pt, 0-2 = 0 pts */
          var gan = m.ls > m.vs ? x : y, per = m.ls > m.vs ? y : x, sg = Math.max(m.ls, m.vs), sp = Math.min(m.ls, m.vs);
          gan.g++; per.p++; gan.pts += sp === 0 ? 3 : 2; per.pts += sp === 0 ? 0 : 1;
        } else if (m.ls > m.vs) { x.g++; x.pts += 3; y.p++; } else { y.g++; y.pts += 3; x.p++; }
      });
    });
    Object.keys(t).forEach(function (k) { var g = t[k].q.grupo || 'Grupo A'; (out[g] = out[g] || []).push(t[k]); });
    Object.keys(out).forEach(function (g) { out[g].sort(function (u, v) { return v.pts - u.pts || (v.pf - v.pc) - (u.pf - u.pc); }); });
    return out;
  }
  function escudoSigla(q) {
    var suma = 0, i, nom = q.departamento; for (i = 0; i < nom.length; i++) { suma += nom.charCodeAt(i); }
    return h('span', { class: 'nws-fl__cj-esc', style: 'background:' + ESCUDOS[suma % ESCUDOS.length], 'aria-hidden': 'true' }, e(sigla(nom)));
  }
  function digitosEq(n, gana) { return h('span', { class: S.cls('nws-fl__cj-num', gana && 'nws-fl__cj-num--gan'), 'aria-hidden': 'true' }, String(n).split('').map(function (c) { return '<span>' + c + '</span>'; }).join('')); }
  function marcadorHtml(m) {
    var jug = m.est !== 'Programado', gl = jug && m.ls > m.vs, gv = jug && m.vs > m.ls;
    var eq = function (q) { return h('div', { class: 'nws-fl__cj-eq' }, escudoSigla(q), h('span', { class: 'nws-fl__cj-nm' }, e(q.nombre)), h('span', { class: 'nws-fl__cj-dep' }, e(q.departamento))); };
    var mid = jug ? digitosEq(m.ls, gl) + '<span class="nws-fl__cj-guion">–</span>' + digitosEq(m.vs, gv)
      : '<span class="nws-fl__cj-num"><span>–</span></span><span class="nws-fl__cj-guion">–</span><span class="nws-fl__cj-num"><span>–</span></span>';
    var cap = m.per === 'S' ? h('span', { class: 'nws-fl__cj-cap' }, 'Sets ganados') : '';
    return h('div', { class: 'nws-fl__cj-mar', role: 'img', 'aria-label': e(m.a.nombre + (jug ? ' ' + m.ls + ', ' + m.b.nombre + ' ' + m.vs : ' contra ' + m.b.nombre)) }, eq(m.a), h('div', { class: 'nws-fl__cj-tabw' }, h('div', { class: 'nws-fl__cj-tab' }, mid), cap), eq(m.b));
  }
  /* Tarjeta de partido, como la serie de atletismo: la primera con marcador va abierta; las demás, contraídas con la hora a la izquierda; una programada no se abre y conserva «Ver más». */
  function partidoTarjeta(m, i, c, pi, ico) {
    var jug = m.est !== 'Programado', abierta = jug && i === 0, hora = horaCorta(m.hora).split(' ');
    var pie = h('div', { class: 'nws-fl__se-pie' }, h('span', { class: 'nws-fl__chip-sede' }, PINCHIP + e(m.sede || sede(c.sede).nombre)),
      h('button', { type: 'button', class: 'nws-fl__serie-mas', 'data-flujo': 'partido', 'data-clave': c.id, 'data-serie': m.dia + '|' + m.idx }, 'Ver más'));
    return h('article', { class: S.cls('nws-fl__se', !abierta && 'nws-fl__se--c') },
      h('div', { class: 'nws-fl__se-h' },
        h('div', { class: 'nws-fl__se-hb', 'aria-hidden': 'true' }, h('div', null, h('img', { src: ico, alt: '' }), h('span', null, e(hora[0]), '<br>', e(hora[1] || '')))),
        h('span', { class: 'nws-fl__se-tx' }, h('b', null, 'Partido ' + m.n), h('small', null, e(m.ronda))),
        h('span', { class: 'nws-fl__se-der' }, estadoPill(m.est), jug ? h('button', { type: 'button', class: 'nws-fl__se-chev', 'data-fl-se': true, 'aria-expanded': abierta ? 'true' : 'false', 'aria-label': 'Mostrar u ocultar el partido ' + m.n }, ICO_CHEV) : '')),
      jug ? h('div', { class: 'nws-fl__se-w' }, h('div', { class: 'nws-fl__se-in' }, h('div', { class: 'nws-fl__se-pad' }, h('div', { class: 'nws-fl__se-c' }, h('span', { class: 'nws-fl__se-hora' }, e(horaCorta(m.hora))), marcadorHtml(m), pie))))
        : h('div', { class: 'nws-fl__se-pad nws-fl__se-pad--fuera' }, pie));
  }
  /* Tarjeta sencilla para «Todos»: sin plegar, con los dos equipos, el marcador y los parciales (cuartos, tiempos o sets) a la vista. */
  function partidoCompacto(m, c) {
    var jug = m.est !== 'Programado', gl = jug && m.ls > m.vs, gv = jug && m.vs > m.ls;
    var fila = function (q, pts, gana) { return h('div', { class: S.cls('nws-fl__cp-eq', gana && 'nws-fl__cp-eq--gan') }, h('span', { class: 'nws-fl__cp-sig' }, e(sigla(q.departamento))), h('span', { class: 'nws-fl__cp-nm' }, e(q.nombre)), h('b', { class: 'nws-fl__cp-pt' }, jug ? pts : '–')); };
    var tit = m.per === 'S' ? 'Detalle de sets' : m.per === 'T' ? 'Detalle de tiempos' : 'Detalle de cuartos';
    var par = jug && m.pa ? h('div', { class: 'nws-fl__cp-caja', role: 'group', 'aria-label': tit }, h('span', { class: 'nws-fl__cp-tit' }, tit), h('div', { class: 'nws-fl__cp-par' }, m.pa.map(function (_, i) { return (i ? '<i></i>' : '') + h('span', null, h('span', { class: 'nws-fl__cp-q' }, m.etq + (i + 1)), h('b', null, m.pa[i] + '-' + m.pb[i])); }).join(''))) : '';
    return h('article', { class: 'nws-fl__cp' },
      h('div', { class: 'nws-fl__cp-h' }, h('span', null, h('b', { class: 'nws-fl__cp-n' }, 'Partido ' + m.n), h('small', null, e(m.ronda + ' · ' + horaCorta(m.hora)))), estadoPill(m.est)),
      fila(m.a, m.ls, gl) + fila(m.b, m.vs, gv) + par,
      h('div', { class: 'nws-fl__se-pie' }, h('span', { class: 'nws-fl__chip-sede' }, PINCHIP + e(m.sede || sede(c.sede).nombre)),
        h('button', { type: 'button', class: 'nws-fl__serie-mas', 'data-flujo': 'partido', 'data-clave': c.id, 'data-serie': m.dia + '|' + m.idx }, 'Ver más')));
  }
  function nominaHtml(c, q, sexo, off) {
    var base = (F.equipos.indexOf(q) >= 0 ? F.equipos.indexOf(q) : q.nombre.length) * 5, fem = sexo === 'Mujer', roles = ROLES_EQ[c.deporte] || ROLES_FUTBOL, i;
    var filas = []; for (i = 0; i < 8; i++) {
      filas.push(h('div', { class: 'nws-fl__nm-r' }, h('span', { class: 'nws-fl__nm-d' }, 4 + i + (base % 7)),
        h('span', null, h('b', null, e(NOMBRES_EQ[(fem ? 12 : 0) + ((base + off + i * 5) % 12)])), h('small', null, roles[i % roles.length])), i === 0 ? h('span', { class: 'nws-fl__nm-cap' }, 'Capitán') : '<span></span>'));
    }
    return h('h3', { class: 'nws-fl__nm-t' }, e(q.nombre)) + h('div', { class: 'nws-fl__rf-l nws-fl__rf-l--caja nws-fl__nm-l' }, filas.join(''));
  }
  /* Fila de resultado (series, podio y «Ver más»): puesto en círculo, nombre con sus líneas de apoyo, marca y, si se pide, el perfil. */
  var ICO_USR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.8 21c0-4.4 3.6-7 8.2-7s8.2 2.6 8.2 7z"/></svg>';
  var ICO_COPA = '<svg class="nws-fl__ch-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg>';
  var ICO_ZAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 16.5v-4.2l3.2-.8 2.3-3.5 2.2 2.4 5.1 1.5c2.6.8 4.2 1.6 4.2 3.6v1z"/><path d="M2.5 16.5h19M10.5 10.3l1.3 1.7M13 11l1.2 1.6"/></svg>';
  var ICO_CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
  /* Título de la prueba con categoría y sexo: «100 m planos - Juvenil - Hombre». */
  function tituloPrueba(ev, c) {
    var p = String(c.categoria || '').split(' · '), sexo = { 'Masculino': 'Hombre', 'Femenino': 'Mujer' }[p[1]] || p[1];
    return [ev.nombre, p[0], sexo].filter(Boolean).join(' - ');
  }
  function filaRes(f, pos, lineas, conMarca, perfil) {
    return h('div', { class: 'nws-fl__rf' }, h('span', { class: 'nws-fl__rf-p' }, pos),
      h('span', { class: 'nws-fl__rf-n' }, h('b', null, e(f.nombre)), lineas.filter(Boolean).map(function (l) { return h('small', null, e(l)); }).join('')),
      h('span', { class: 'nws-fl__rf-m' }, conMarca ? e(f.marca) : ''),
      perfil ? h('button', { type: 'button', class: 'nws-fl__rf-perfil', 'data-toast': 'Perfil de ' + f.nombre, 'aria-label': 'Ver perfil de ' + f.nombre }, ICO_USR) : '');
  }
  /* Tarjeta de serie: la primera con resultados va abierta; las demás, contraídas con la hora a la izquierda; una serie sin correr no se abre pero conserva «Ver más». */
  function serieTarjeta(q, i, estado, c) {
    var hecho = estado === 'Finalizado', abierta = hecho && i === 0, hora = horaCorta(q.hora).split(' ');
    var pie = h('div', { class: 'nws-fl__se-pie' }, h('span', { class: 'nws-fl__chip-sede' }, PINCHIP + e(sede(c.sede).nombre)),
      h('button', { type: 'button', class: 'nws-fl__serie-mas', 'data-flujo': 'serie', 'data-clave': c.id, 'data-serie': q.n }, 'Ver más'));
    return h('article', { class: S.cls('nws-fl__se', !abierta && 'nws-fl__se--c') },
      h('div', { class: 'nws-fl__se-h' },
        h('div', { class: 'nws-fl__se-hb', 'aria-hidden': 'true' }, h('div', null, ICO_ZAP, h('span', null, e(hora[0]), '<br>', e(hora[1] || '')))),
        h('span', { class: 'nws-fl__se-tx' }, h('b', null, q.fin ? 'Final Directa' : 'Hit ' + q.hit), h('small', null, (q.fin ? '' : 'Ronda Clasificación - ') + q.filas.length + ' competidores')),
        h('span', { class: 'nws-fl__se-der' }, estadoPill(estado), hecho ? h('button', { type: 'button', class: 'nws-fl__se-chev', 'data-fl-se': true, 'aria-expanded': abierta ? 'true' : 'false', 'aria-label': 'Mostrar u ocultar ' + (q.fin ? 'la final directa' : 'el hit ' + q.hit) }, ICO_CHEV) : '')),
      hecho ? h('div', { class: 'nws-fl__se-w' }, h('div', { class: 'nws-fl__se-in' }, h('div', { class: 'nws-fl__se-pad' }, h('div', { class: 'nws-fl__se-c' },
        h('span', { class: 'nws-fl__se-hora' }, e(horaCorta(q.hora))),
        h('div', { class: 'nws-fl__rf-l' }, q.filas.slice(0, 3).map(function (f, j) { return filaRes(f, j + 1, [f.institucion], true); }).join('')), pie))))
      : h('div', { class: 'nws-fl__se-pad nws-fl__se-pad--fuera' }, pie));
  }
  /* Enfrentamientos de una prueba de atletismo (datos de ejemplo con la estructura real): por día, `hits` hits de 5 deportistas en la
     Ronda Clasificación y una Final Directa de 8; las pruebas de campo (y las largas) van solo con Final Directa. */
  function horaMin(s, min) {
    var m = /^(\d+):(\d+) ([ap])\. m\.$/.exec(s); if (!m) { return s; }
    var t = ((+m[1] % 12) + (m[3] === 'p' ? 12 : 0)) * 60 + (+m[2]) + min, h24 = Math.floor(t / 60) % 24, mm = t % 60;
    return ((h24 % 12) || 12) + ':' + (mm < 10 ? '0' : '') + mm + (h24 >= 12 ? ' p. m.' : ' a. m.');
  }
  function datosPrueba(c, ev, dias) {
    var pool = F.atletas, porDia = {}, todas = [], dist = ev.marca.tipo === 'distancia', num = 0;
    dias.forEach(function (iso, di) {
      porDia[iso] = [];
      var hits = ev.hits || 0, total = hits + 1, s;
      for (s = 0; s < total; s++) {
        var fin = s === hits, n = fin ? 8 : 5, filas = [], i;
        for (i = 0; i < n; i++) {
          var a = pool[((di * total + s) * 6 + i) % pool.length], k2 = (i * 5 + di * 3 + s * 7) % 12, v = dist ? ev.marca.base + ev.marca.paso * 3 - ev.marca.paso * k2 : ev.marca.base + ev.marca.paso * k2;
          v += (dist ? -1 : 1) * ev.marca.paso * 0.07 * (di * total + s);   /* sin empates entre enfrentamientos */
          filas.push({ nombre: a.nombre, institucion: a.institucion, departamento: a.departamento, v: v, marca: fmtMarca(ev.marca, v) });
        }
        filas.sort(function (p, q) { return dist ? q.v - p.v : p.v - q.v; });
        var serie = { n: ++num, dia: iso, hora: fin && hits ? horaMin(c.hora, 105) : c.hora, fin: fin, hit: s + 1, filas: filas }; porDia[iso].push(serie); todas.push(serie);
      }
    });
    var general = [].concat.apply([], todas.map(function (q) { return q.filas; })).sort(function (p, q) { return dist ? q.v - p.v : p.v - q.v; });
    var vistos = {}; general = general.filter(function (f) { if (vistos[f.nombre]) { return false; } vistos[f.nombre] = 1; return true; });   /* cada deportista una vez, con su mejor marca */
    return { porDia: porDia, todas: todas, general: general, estado: ev.estado || 'Finalizado' };
  }
  function fechaCorta(iso) { var d = new Date(iso + 'T12:00:00'); return DOWL[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' de ' + MESS[d.getMonth()]; }
  function horaMas(s, n) {
    var m = /^(\d+):(\d+) ([ap])\. m\.$/.exec(s); if (!m) { return s; }
    var h24 = (+m[1] % 12) + (m[3] === 'p' ? 12 : 0) + n * 2; h24 = Math.min(h24, 20);
    return ((h24 % 12) || 12) + ':' + m[2] + (h24 >= 12 ? ' p. m.' : ' a. m.');
  }
  function partidosDelDia(c, dia, st) {
    var a = agDe(c, st), n = a.dias.indexOf(dia), out = [], i, ne = F.equipos.length;
    if (n < 0) { return out; }
    for (i = 0; i < a.cuenta[n]; i++) {
      out.push({ ronda: c.rondas[i % c.rondas.length], hora: horaMas(c.hora, i), a: F.equipos[(2 * i + n) % ne], b: F.equipos[(2 * i + n + 1) % ne], sub: c.subpruebas ? c.subpruebas[i % c.subpruebas.length] : null });
    }
    return out;
  }
  /* Franja de días en la cabecera violeta: píldoras (día de la semana arriba, número abajo); la elegida va en blanco y los días sin competencias se atenúan. */
  function diasZona(fechas, sel, c, st, flechas) {
    var ag = agDe(c, st), ini = ag.dias[0], fin = ag.dias[ag.dias.length - 1];
    var pildoras = fechas.map(function (d) {
      var f = new Date(d + 'T12:00:00'), con = agDe(c, st).dias.indexOf(d) >= 0;
      return h('button', { type: 'button', class: S.cls('nws-fl__dp-d', d === sel && 'nws-fl__dp-d--sel', !con && 'nws-fl__dp-d--sin'), 'data-fl-dia': d, 'aria-pressed': d === sel ? 'true' : 'false',
        'aria-label': capital(f.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })) + (con ? '' : ', sin competencias') },
        h('span', { class: 'nws-fl__dp-s' }, e(capital(f.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '')))),
        h('b', { class: 'nws-fl__dp-n' }, f.getDate()),
        d === ini ? h('small', { class: 'nws-fl__dp-e' }, 'Inicio') : d === fin ? h('small', { class: 'nws-fl__dp-e' }, 'Final') : h('i', { class: 'nws-fl__dp-pt', 'aria-hidden': 'true' }));
    }).join('');
    if (!flechas) { return h('div', { class: 'nws-fl__dp', 'data-fl-dias': true, role: 'group', 'aria-label': 'Día de competencias' }, pildoras); }
    /* Con flechas (prueba de atletismo): una a cada lado para pasar de un día al contiguo. */
    var pos = fechas.indexOf(sel), flecha = function (dir, d, txt) {
      return h('button', { type: 'button', class: 'nws-fl__dp-nav', 'data-fl-dia': d || '', disabled: !d, 'aria-label': dir }, txt);
    };
    return h('div', { class: 'nws-fl__dp nws-fl__dp--nav', 'data-fl-dias': true, role: 'group', 'aria-label': 'Día de competencias' },
      flecha('Día anterior', fechas[pos - 1], '‹'), h('div', { class: 'nws-fl__dp-pil' }, pildoras), flecha('Día siguiente', fechas[pos + 1], '›'));
  }
  /* Días de competencia: chip en caja (day_chip.dart): número, mes y día de la semana, con mayúscula inicial. */
  function dias(st) {
    var fechas = st.dias || F.dias;   /* la regional manda sus propios días (calendario de la regional) */
    return h('div', { class: 'nws-fl__dias', role: 'group', 'aria-label': 'Día de competencias' }, fechas.map(function (d) {
      var sel = (st.dia || fechas[0]) === d, f = new Date(d + 'T12:00:00');
      return h('button', { type: 'button', class: S.cls('nws-fl__dia', sel && 'nws-fl__dia--sel'), 'data-fl-dia': d, 'aria-pressed': sel ? 'true' : 'false' },
        h('span', { class: 'nws-fl__dia-num' }, f.getDate()),
        h('span', { class: 'nws-fl__dia-mes' }, e(capital(f.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')))),
        h('span', { class: 'nws-fl__dia-sem' }, e(capital(f.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '')))));
    }));
  }
  /* Hora como en la app: «9:00 A.M.» */
  function horaCorta(s) { return String(s).replace(' a. m.', ' A.M.').replace(' p. m.', ' P.M.'); }
  /* Fila de competencia como competition_card (titleOnly): cuadro naranja con el ícono del deporte, título
     «prueba - categoría - sexo» y chevron. Sin estado: la app no lo muestra en esta lista. */
  function filaCompetencia(c) {
    return enlace('competencia', c.id,
      h('span', { class: 'nws-fl__cuadro' }, h('img', { class: 'nws-fl__cuadro-img', src: ICONO_DEPORTE[c.deporte] || ICONO_PIN, alt: '' }))
      + h('span', { class: 'nws-fl__fila-cuerpo' }, h('span', { class: 'nws-fl__fila-t' }, e(c.prueba + ' - ' + c.categoria.replace(' · ', ' - '))))
      + ir(), 'nws-fl__fila--tarjeta');
  }
  function listaCompetencias(st, k) {
    var lista = F.competencias.filter(function (c) { return deRegional(c, k) && (!st.deporte || eje(c, k) === st.deporte) && (!st.categoria || c.categoria === st.categoria) && coincide(eje(c, k), st.busqueda) && c.dias.indexOf(st.dia || F.dias[0]) >= 0 && (+st.tab !== 1 || c.estado === 'En curso'); });
    return lista.length ? h('div', { class: 'nws-fl__filas' }, lista.map(filaCompetencia).join('')) : texto('No hay competencias para estos filtros.');
  }
  var ICONO_BAJAR = '<svg class="nws-fl__mes-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ESTRELLA = '<svg class="nws-fl__barra-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var TODAS = 'Todas las fechas';
  function celdaX(l, v) { return h('div', { class: 'nws-fl__celda' }, h('span', { class: 'nws-fl__celda-l' }, e(l)), h('span', { class: 'nws-fl__celda-v' }, e(v))); }
  var PINCHIP = '<svg class="nws-fl__chip-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var FLECHA_GRUPO = '<svg class="nws-fl__grupo-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONO_BARRAS = '<svg class="nws-fl__leyenda-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10M12 20V4M19 20v-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  var ICONO_DEPORTE = { 'Baloncesto': 'assets/landing/icons/baloncesto.svg', 'Baloncesto 3x3': 'assets/landing/icons/baloncesto.svg', 'Fútbol': 'assets/landing/icons/futbol-salon.svg', 'Fútbol sala': 'assets/landing/icons/futbol-salon.svg', 'Voleibol': 'assets/landing/icons/voleibol.svg', 'Atletismo': 'assets/landing/icons/atletismo.svg', 'Fútbol de Salón': 'assets/landing/icons/futbol-salon.svg' };
  var TINTE = { 'Atletismo': 'atl', 'Baloncesto': 'bal', 'Baloncesto 3x3': 'bal', 'Fútbol': 'fut', 'Fútbol sala': 'fut', 'Fútbol de Salón': 'fut', 'Voleibol': 'vol' };
  var ICONO_PIN = 'assets/landing/icons/pin.svg';
  var PERSONA = '<svg class="nws-fl__persona" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var IZQ = '<svg class="nws-fl__mes-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DER = '<svg class="nws-fl__mes-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FLECHA = '<svg class="nws-fl__doc-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOC = '<svg class="nws-fl__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  /* ---------- Calendario de la regional: zona de controles + matriz de días por deportes ---------- */
  var GENEROS = ['Todos', 'Hombre', 'Mujer', 'Mixto'], EDADES = ['Todas', 'Prejuvenil', 'Juvenil'];
  var CHEV = '<svg class="nws-fl__z-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var BANDERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h12l-2 4 2 4H5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var COPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v6a4 4 0 0 1-8 0V4zM8 6H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 14v4M8 20h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOW = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'], MESC = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var DOWL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function isoDe(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  /* Género y edad salen del texto de la categoría («Juvenil · Femenino»). */
  function generoOk(c, g) { if (!g || g === 'Todos') { return true; } return g === 'Hombre' ? /Masculino|Hombre/.test(c.categoria) : g === 'Mujer' ? /Femenino|Mujer/.test(c.categoria) : /Mixto/.test(c.categoria); }
  function edadOk(c, v) { return !v || v === 'Todas' || c.categoria.indexOf(v) >= 0; }
  function filtradas(st, k) { return F.competencias.filter(function (c) { return deRegional(c, k) && (unDeporte(k) || !st.sel || !st.sel.length || st.sel.indexOf(c.deporte) >= 0) && generoOk(c, st.genero) && edadOk(c, st.edad); }); }
  /* Filas del calendario: una por deporte; si la regional tiene un solo deporte (atletismo), una por prueba.
     `mitad` dice en qué mitad de los días de la regional se corre la prueba. */
  function unDeporte(k) { return deportesCal(k).length === 1; }
  function pruebasCal(k) { var v = []; F.competencias.forEach(function (c) { if (deRegional(c, k) && c.eventos) { c.eventos.forEach(function (x) { v.push(x.nombre); }); } }); return v; }
  function filasCal(st, k) {
    var out = [];
    filtradas(st, k).forEach(function (c) {
      var ag = agendaDe(c, k);
      if (!unDeporte(k) || !c.eventos) { out.push(Object.assign({}, c, { dep: c.deporte, _ag: ag })); return; }
      var corte = Math.ceil(ag.dias.length / 2);
      c.eventos.forEach(function (x) {
        if (st.sel && st.sel.length && st.sel.indexOf(x.nombre) < 0) { return; }
        var dias = ag.dias.filter(function (_, i) { return x.mitad === 2 || (x.mitad === 0 ? i < corte : i >= corte); });
        out.push(Object.assign({}, c, { deporte: x.nombre, dep: c.deporte, _ag: { dias: dias, cuenta: dias.map(function () { return (x.hits || 0) + 1; }) } }));
      });
    });
    return out;
  }
  /* Deportes de la regional, por nombre del deporte (como la web: «Atletismo»), sin repetir. */
  function deportesCal(k) { var v = []; F.competencias.forEach(function (c) { if (deRegional(c, k) && v.indexOf(c.deporte) < 0) { v.push(c.deporte); } }); return v; }
  /* Días y cantidades de una competencia en esa regional: `items[].agenda` pisa los de la competencia. */
  function agendaDe(c, k) { var it = regional(k), a = it && it.agenda && it.agenda[c.id]; return { dias: a ? a.dias : c.dias, cuenta: a ? a.cuenta : c.cuenta, pruebas: a ? a.pruebas : c.pruebas }; }
  var MESS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  /* «Del 26 al 27 de sept», como la web. */
  function rangoFechas(dias) {
    var a = new Date(dias[0] + 'T12:00:00'), b = new Date(dias[dias.length - 1] + 'T12:00:00');
    if (dias.length === 1) { return a.getDate() + ' de ' + MESS[a.getMonth()]; }
    return a.getMonth() === b.getMonth() ? 'Del ' + a.getDate() + ' al ' + b.getDate() + ' de ' + MESS[a.getMonth()] : 'Del ' + a.getDate() + ' de ' + MESS[a.getMonth()] + ' al ' + b.getDate() + ' de ' + MESS[b.getMonth()];
  }
  /* Texto de lo elegido: «Todos los deportes», uno o dos nombres, o «3 deportes». */
  function etiquetaMulti(st, k) {
    var uno = unDeporte(k), sel = st.sel || [];
    if (!sel.length) { return uno ? 'Todas las pruebas' : 'Todos los deportes'; }
    return sel.length <= 2 ? sel.join(', ') : sel.length + (uno ? ' pruebas' : ' deportes');
  }
  function hayFiltros(st) { return !!((st.sel && st.sel.length) || (st.genero && st.genero !== 'Todos') || (st.edad && st.edad !== 'Todas')); }
  function resumenFiltros(st, k) {
    var cat = [st.genero && st.genero !== 'Todos' ? st.genero : '', st.edad && st.edad !== 'Todas' ? st.edad : ''].filter(Boolean).join(' · ');
    return etiquetaMulti(st, k) + ' > ' + (cat || 'Todas las categorías');
  }
  function segmento(cls, labels, valor) {
    return S.tagGroup({ cls: 'nws-fl__seg ' + cls, size: 'medium', theme: 'primary', value: valor, items: labels.map(function (x) { return { value: x, label: x }; }) });
  }
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function multiSelect(st, k) {
    var uno = unDeporte(k), opciones = uno ? pruebasCal(k) : deportesCal(k), sel = st.sel || [], abierto = !!st.multiAbierto;
    var boton = h('div', { class: 'nws-fl__zsel' }, h('button', { type: 'button', class: 'nws-fl__zsel-b', 'data-fl-multi': true, 'aria-haspopup': 'listbox', 'aria-expanded': abierto ? 'true' : 'false', 'aria-controls': 'nws-fl-multi', 'aria-label': (uno ? 'Pruebas: ' : 'Deportes: ') + etiquetaMulti(st, k) }, h('span', null, e(etiquetaMulti(st, k))), CHEV));
    var filas = [{ valor: '', label: uno ? 'Todas las pruebas' : 'Todos los deportes', on: !sel.length }].concat(opciones.map(function (x) { return { valor: x, label: x, on: sel.indexOf(x) >= 0 }; }));
    var panel = h('div', { class: S.cls('nws-fl__zmulti', abierto && 'nws-fl__zmulti--abierto'), id: 'nws-fl-multi', role: 'listbox', 'aria-multiselectable': 'true', 'aria-label': uno ? 'Pruebas' : 'Deportes', inert: !abierto },
      filas.map(function (x) {
        return h('button', { type: 'button', class: S.cls('nws-fl__zop', x.on && 'nws-fl__zop--on'), role: 'option', 'aria-selected': x.on ? 'true' : 'false', 'data-fl-op': x.valor }, h('span', { class: 'nws-fl__zchk', 'aria-hidden': 'true' }, CHECK), h('span', null, e(x.label)));
      }).join(''));
    return { boton: boton, panel: panel };
  }
  /* Controles sobre el violeta: deporte, búsqueda, mes y segmentos de género y edad. El `change` y el clic los escucha landing-vistas.js. */
  function zonaRegional(st, k) {
    /* Selector múltiple: botón con el aspecto del select y panel de casillas (compuesto con tokens del SDK; el SDK no trae multiselect). */
    var m = multiSelect(st, k);
    var sel = m.boton;
    /* Los controles viven en un panel que se colapsa con «Filtros» (como «Cambiar» de las regionales); el resumen queda a la vista. */
    return h('div', { class: 'nws-fl__zona' },
      h('div', { class: S.cls('nws-fl__zona-cuerpo', st.filtrosCerrados !== false && 'nws-fl__zona-cuerpo--cerrado'), id: 'nws-fl-filtros', inert: st.filtrosCerrados !== false }, h('div', { class: 'nws-fl__zona-cv' }, h('div', { class: 'nws-fl__zona-cvi' },
        h('div', { class: 'nws-fl__zona-f1' }, sel,
          h('button', { type: 'button', class: 'nws-fl__zib', 'data-toast': 'Buscar institución', 'aria-label': 'Buscar institución' }, LUPA)),
        h('div', { class: 'nws-fl__zona-f2' }, segmento('nws-fl__seg--genero', GENEROS, st.genero || 'Todos'), segmento('nws-fl__seg--edad', EDADES, st.edad || 'Todas'))))),
      h('div', { class: 'nws-fl__zona-resfila' }, h('p', { class: 'nws-fl__zona-res', 'data-fl-resumen': true }, e(resumenFiltros(st, k))),
        h('button', { type: 'button', class: 'nws-fl__zlimpiar', 'data-fl-limpiar': true, hidden: !hayFiltros(st) }, 'Quitar filtros')),
      m.panel);
  }
  /* Calendario sangrado con deportes fijos (fusión de las versiones B y C): hoja de borde a borde; la columna de deportes
     queda fija a la izquierda, con una fila por deporte, y los días se desplazan. Cada tarjeta (ícono y cantidad) cae en
     la fila de su deporte; Inicio y Final van escritos bajo el número y el día elegido es una columna violeta completa.
     Tocar el día abre la hoja con sus deportes; tocar una tarjeta abre esa competencia en ese día. */
  var MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DOWC = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  function fechaLarga(d) { var s = DOWL[d.getDay()]; return s.charAt(0).toUpperCase() + s.slice(1) + ' ' + d.getDate() + ' de ' + MESL[d.getMonth()]; }
  function matrizRegional(st, k) {
    var lista = filasCal(st, k);
    /* Los días de la regional (sin filtros) viajan en el estado para que la competencia muestre los mismos. */
    var base = []; F.competencias.forEach(function (c) { if (deRegional(c, k)) { base = base.concat(agendaDe(c, k).dias); } });
    base = base.filter(function (x, n) { return base.indexOf(x) === n; }).sort(); st.dias = base;
    st.ag = {}; F.competencias.forEach(function (c) { if (deRegional(c, k)) { st.ag[c.id] = agendaDe(c, k); } });
    var primero = new Date((base[0] || F.dias[0]).slice(0, 7) + '-01T12:00:00');
    var mes = primero.toLocaleDateString('es-CO', { month: 'long' }); mes = mes.charAt(0).toUpperCase() + mes.slice(1) + ' ' + primero.getFullYear();
    var nav = h('div', { class: 'nws-fl__mx-mes' }, h('button', { type: 'button', 'data-toast': 'Mes anterior', 'aria-label': 'Mes anterior' }, IZQ), h('b', null, e(mes)), h('button', { type: 'button', 'data-toast': 'Mes siguiente', 'aria-label': 'Mes siguiente' }, DER));
    if (!lista.length) { return nav + h('p', { class: 'nws-fl__mx-vacio' }, 'No se encontraron competencias con estos filtros.'); }
    var todos = []; lista.forEach(function (c) { todos = todos.concat(c._ag.dias); }); todos.sort();
    var ini = todos[0], fin = todos[todos.length - 1], sel = null;   /* los días de la cabecera no se eligen: solo marcan el rango; se entra por la celda del deporte */
    function deportesDe(iso) { return lista.filter(function (c) { return c._ag.dias.indexOf(iso) >= 0; }); }
    /* Doce días desde la víspera del inicio: el día de inicio y el final quedan a la vista sin desplazar. */
    var d0 = new Date(ini + 'T12:00:00'), cols = [], i;
    d0.setDate(d0.getDate() - 1);
    for (i = 0; i < 12; i++) { var d = new Date(d0.getTime()); d.setDate(d0.getDate() + i); cols.push(d); }
    var cab = h('div', { class: 'nws-fl__cal-c0 nws-fl__cal-esq' }, h('span', null, unDeporte(k) ? 'Pruebas' : 'Deportes'), h('button', { type: 'button', class: 'nws-fl__cal-min', 'data-fl-min': true, 'aria-expanded': st.min ? 'false' : 'true', 'aria-label': st.min ? 'Mostrar nombres de deportes' : 'Ocultar nombres de deportes' }, IZQ)) + cols.map(function (d) {
      var iso = isoDe(d), con = deportesDe(iso).length > 0, esSel = con && iso === sel, enRango = con || (iso > ini && iso < fin);
      var clases = S.cls('nws-fl__cal-hd', !enRango && 'nws-fl__cal-hd--vacio', enRango && 'nws-fl__cal-hd--rango', iso === ini && 'nws-fl__cal-hd--ini', iso === fin && iso !== ini && 'nws-fl__cal-hd--fin', esSel && 'nws-fl__cal-col--sel nws-fl__cal-col--ini');
      var dentro = h('span', null, DOWC[d.getDay()]) + h('b', null, d.getDate()) + h('small', null, iso === ini ? 'Inicio' : iso === fin ? 'Final' : '');
      return h('div', { class: clases }, dentro);
    }).join('');
    var filas = lista.map(function (c, r) {
      var ag = c._ag, total = ag.cuenta.reduce(function (a, n) { return a + n; }, 0), ultima = r === lista.length - 1;
      return h('div', { class: S.cls('nws-fl__cal-c0 nws-fl__cal-lab', r === 0 && 'nws-fl__cal-lab--p') }, h('img', { src: ICONO_DEPORTE[c.dep] || ICONO_PIN, alt: c.deporte }), h('b', { title: rangoFechas(ag.dias) + ' · ' + (ag.pruebas ? ag.pruebas + (ag.pruebas === 1 ? ' prueba' : ' pruebas') : total + ' ' + c.unidad) }, e(c.deporte)))
        + cols.map(function (d) {
          var iso = isoDe(d), n = ag.dias.indexOf(iso), esSel = iso === sel && deportesDe(iso).length > 0;
          var clases = S.cls('nws-fl__cal-ce', esSel && 'nws-fl__cal-col--sel', esSel && ultima && 'nws-fl__cal-col--fin');
          if (n < 0) { return h('div', { class: clases }); }
          return h('div', { class: clases }, h('button', { type: 'button', class: 'nws-fl__cal-ev nws-fl__cal-ev--' + (TINTE[c.dep] || 'otro') + (ag.cuenta[n] < 2 ? ' nws-fl__cal-ev--uno' : ''), 'data-flujo': 'deporte', 'data-clave': c.id, 'data-dia': iso, 'data-prueba': c.dep !== c.deporte ? c.deporte : '',
            'aria-label': c.deporte + ', ' + DOWL[d.getDay()] + ' ' + d.getDate() + ': ' + ag.cuenta[n] + ' ' + c.unidad },
            h('img', { src: ICONO_DEPORTE[c.dep] || ICONO_PIN, alt: '' }), ag.cuenta[n] > 1 ? h('i', null, ag.cuenta[n]) : ''));
        }).join('');
    }).join('');
    /* Fila de relleno vacía: prolonga hasta el fondo la columna de deportes, la sombra y las líneas de los días cuando hay pocas filas. */
    var relleno = h('div', { class: 'nws-fl__cal-c0 nws-fl__cal-lab', 'aria-hidden': 'true' }) + cols.map(function () { return h('div', { class: 'nws-fl__cal-ce', 'aria-hidden': 'true' }); }).join('');
    /* Hoja del día: se abre al tocar el día (estado.hoja) y lista sus deportes. */
    var hoja = '';
    if (false) {
      var dd = new Date(st.dia + 'T12:00:00'), eventos = deportesDe(st.dia);
      hoja = h('div', { class: S.cls('nws-fl__hoja', st.hoja && 'nws-fl__hoja--abierta') }, h('div', { class: 'nws-fl__hoja-velo', 'data-fl-hoja': 'cerrar' }),
        h('div', { class: 'nws-fl__hoja-panel', role: 'dialog', 'aria-label': fechaLarga(dd) }, h('span', { class: 'nws-fl__hoja-asa' }),
          h('div', { class: 'nws-fl__hoja-cab' }, h('h3', null, e(fechaLarga(dd))), h('button', { type: 'button', 'data-fl-hoja': 'cerrar', 'aria-label': 'Cerrar' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>')),
          h('p', { class: 'nws-fl__hoja-sub' }, e((st.dia === ini ? 'Inicio de la regional · ' : st.dia === fin ? 'Final de la regional · ' : '') + eventos.length + (unDeporte(k) ? (eventos.length === 1 ? ' prueba' : ' pruebas') : (eventos.length === 1 ? ' deporte' : ' deportes')))),
          eventos.map(function (c) {
            return h('button', { type: 'button', class: 'nws-fl__hoja-dep', 'data-flujo': 'deporte', 'data-clave': c.id, 'data-dia': st.dia, 'data-prueba': c.dep !== c.deporte ? c.deporte : '' },
              h('img', { src: ICONO_DEPORTE[c.dep] || ICONO_PIN, alt: '' }),
              h('span', { class: 'nws-fl__hoja-dep-t' }, h('b', null, e(c.deporte)), h('span', null, e(c.categoria + ' · ' + c._ag.cuenta[c._ag.dias.indexOf(st.dia)] + ' ' + (c._ag.cuenta[c._ag.dias.indexOf(st.dia)] === 1 ? c.unidad.replace(/s$/, '') : c.unidad)))), DER);
          }).join('')));
    }
    return nav + h('div', { class: S.cls('nws-fl__cal', st.min && 'nws-fl__cal--min'), role: 'group', 'aria-label': 'Calendario de la regional por deporte y día' },
      h('div', { class: 'nws-fl__cal-tb', style: 'grid-template-columns:var(--nws-cal-c0) repeat(' + cols.length + ',62px);grid-template-rows:repeat(' + (lista.length + 1) + ',auto) 1fr' }, cab + filas + relleno)) + hoja;
  }

  /* Calendario de la regional, como MonthRangeCalendar (mock_month_calendar.dart): cabecera violeta con
     puntos, mes y flechas; semana desde domingo; los días con competencias quedan tapados por una barra beige
     continua que cruza las celdas y lleva «Todas las fechas» (tocarla abre la lista). */
  function calendarioRegional(st, k) {
    var lista = F.competencias.filter(function (c) { return deRegional(c, k) && (!st.deporte || eje(c, k) === st.deporte) && (!st.categoria || c.categoria === st.categoria) && coincide(eje(c, k), st.busqueda); });
    if (!lista.length) { return texto('No se encontraron competencias en esta regional.'); }
    var con = {}, i;
    lista.forEach(function (c) { c.dias.forEach(function (d) { con[d] = true; }); });
    var inicio = F.dias[0].slice(0, 7), primero = new Date(inicio + '-01T12:00:00'), totalDias = new Date(primero.getFullYear(), primero.getMonth() + 1, 0).getDate();
    var celdas = [];
    for (i = 0; i < primero.getDay(); i++) { celdas.push(null); }
    for (i = 1; i <= totalDias; i++) { celdas.push({ n: i, fecha: inicio + '-' + pad(i) }); }
    while (celdas.length % 7) { celdas.push(null); }
    var semanas = [];
    for (i = 0; i < celdas.length; i += 7) { semanas.push(celdas.slice(i, i + 7)); }
    function hay(f) { return !!(f && con[f]); }
    function vecino(f, paso) { var d = new Date(f + 'T12:00:00'); d.setDate(d.getDate() + paso); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    /* tramos continuos dentro de cada semana: columna inicial, largo y si cada extremo es el inicio/fin real del evento */
    var tramos = semanas.map(function (sem) {
      var out = [], c = 0;
      while (c < 7) {
        if (sem[c] && hay(sem[c].fecha)) {
          var ini = c;
          while (c + 1 < 7 && sem[c + 1] && hay(sem[c + 1].fecha)) { c++; }
          out.push({ ini: ini, len: c - ini + 1, izq: !hay(vecino(sem[ini].fecha, -1)), der: !hay(vecino(sem[c].fecha, 1)) });
        }
        c++;
      }
      return out;
    });
    /* la etiqueta va en el tramo más ancho del mes, como _widestPiece de la app */
    var mayor = null;
    tramos.forEach(function (fila, w) { fila.forEach(function (t) { if (!mayor || t.len > mayor.len) { mayor = { w: w, ini: t.ini, len: t.len }; } }); });
    var filas = semanas.map(function (sem, w) {
      var cels = sem.map(function (c) {
        if (!c) { return h('span', { class: 'nws-fl__cel nws-fl__cel--fuera', 'aria-hidden': 'true' }); }
        return h('span', { class: S.cls('nws-fl__cel', hay(c.fecha) && 'nws-fl__cel--con') }, h('span', { class: 'nws-fl__cel-num' }, c.n));
      }).join('');
      var barras = tramos[w].map(function (t) {
        var etiqueta = !!mayor && mayor.w === w && mayor.ini === t.ini;
        return h('button', { type: 'button', class: S.cls('nws-fl__barra', etiqueta && 'nws-fl__barra--txt'), 'data-flujo': 'competencias', 'data-clave': k, 'aria-label': TODAS,
          style: 'grid-column:' + (t.ini + 1) + ' / span ' + t.len + ';margin:0 ' + (t.der ? 8 : 0) + 'px 0 ' + (t.izq ? 8 : 0) + 'px;border-radius:' + (t.izq ? 10 : 0) + 'px ' + (t.der ? 10 : 0) + 'px ' + (t.der ? 10 : 0) + 'px ' + (t.izq ? 10 : 0) + 'px' },
          etiqueta ? ESTRELLA + h('span', null, TODAS) : '');
      }).join('');
      return h('div', { class: 'nws-fl__fila-cal' }, cels + h('div', { class: 'nws-fl__barras' }, barras));
    }).join('');
    var puntos = ''; for (i = 0; i < 14; i++) { puntos += '<span></span>'; }
    var nav = function (label, ico) { return h('button', { type: 'button', class: 'nws-fl__mes-nav', 'data-toast': label, 'aria-label': label }, ico === 'chevron-left' ? IZQ : DER); };
    var mes = primero.toLocaleDateString('es-CO', { month: 'long' }) + ' ' + primero.getFullYear();
    return tarjeta('nws-fl__calendario',
      h('div', { class: 'nws-fl__mes-cab' },
        h('div', { class: 'nws-fl__puntos', 'aria-hidden': 'true' }, puntos),
        h('div', { class: 'nws-fl__mes-fila' }, nav('Mes anterior', 'chevron-left'), h('button', { type: 'button', class: 'nws-fl__mes-t', 'data-toast': 'Elegir mes' }, e(mes) + ICONO_BAJAR), nav('Mes siguiente', 'chevron-right')))
      + h('div', { class: 'nws-fl__semana', 'aria-hidden': 'true' }, ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(function (d) { return h('span', null, d); }).join(''))
      + h('div', { class: 'nws-fl__grilla', role: 'group', 'aria-label': 'Calendario regional de ejemplo' }, filas));
  }
  return { vista: vista, calendarioRegional: calendarioRegional, multiSelect: multiSelect, hayFiltros: hayFiltros, etiquetaMulti: etiquetaMulti,
    destinoTab: function (id, k, tab) {
      if (id !== 'competencia') { return null; }
      var c = competencia(k);
      if (c.tipo === 'equipo') { return null; }   /* conjuntos: las fichas cambian dentro de la misma vista */
      return +tab === 2 ? { id: c.tipo === 'equipo' ? 'posiciones' : 'podio', clave: k } : +tab === 3 ? (c.sedes && c.sedes.length > 1 ? { id: 'sedes', clave: k } : { id: 'sede', clave: c.sede }) : null;
    }
  };
};
