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
    var t, sub = null, violeta = false, b, x, foto = null, naranja = false, barraLogo = false, pie = null;
    if (id === 'regional') {
      x = regional(k); t = (String(k).indexOf('individuales:') === 0 ? 'Regional de individuales' : 'Regional de conjuntos') + ' · ' + x.nombre.replace(/^Regional /, ''); sub = 'Sede ' + x.ciudad; violeta = true;
      b = tabs(F.regionalTabs, st);
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
        b += buscar(st, String(k).indexOf('individuales:') === 0 ? 'Buscar por nombre de la prueba' : 'Buscar por nombre del deporte') + select('Deporte', 'deporte', deportesRegional(k), st) + select('Categoría', 'categoria', categoriasRegional(k), st);
        b += h('div', { 'data-fl-calendario': true }, calendarioRegional(st, k));
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
    } else if (id === 'competencia') {
      x = competencia(k); t = x.prueba;
      var ico = ICONO_DEPORTE[x.deporte] || ICONO_PIN;
      b = tarjeta('nws-fl__cabecera-reg', h('div', { class: 'nws-fl__reg-fila' }, h('span', { class: 'nws-fl__reg-ico', 'aria-hidden': 'true' }, h('img', { class: 'nws-fl__reg-img', src: ico, alt: '' })),
          h('div', { class: 'nws-fl__reg-tx' }, h('p', { class: 'nws-fl__reg-t' }, e(x.prueba + ' ' + x.categoria.replace(' · ', ' ')))))
        + dias(st))
        + tabs(['Competencias', 'En vivo', 'Posiciones', 'Sedes'], st, (x.enCursoRondas || []).length > 0)
        + select('', 'llave', x.rondas, st, false, 'Buscar por llave');
      if (+st.tab === 1 && !(x.enCursoRondas || []).length) { b += texto('No hay enfrentamientos en curso este día.'); }
      else {
        b += h('div', { class: 'nws-fl__filas' }, x.rondas.filter(function (r) { return (!st.llave || st.llave === r) && (+st.tab !== 1 || (x.enCursoRondas || []).indexOf(r) >= 0); }).map(function (r) {
          var vivo = (x.enCursoRondas || []).indexOf(r) >= 0;
          return enlace(x.tipo === 'equipo' ? 'partido' : 'salida', x.id,
            h('span', { class: 'nws-fl__hora' }, h('img', { class: 'nws-fl__hora-ico', src: ico, alt: '' }), h('span', { class: 'nws-fl__hora-t' }, e(horaCorta(x.hora))))
            + h('span', { class: 'nws-fl__fila-cuerpo' },
              h('span', { class: 'nws-fl__ronda-fila' }, h('span', { class: 'nws-fl__fila-t' }, e(r)), vivo ? h('span', { class: 'nws-fl__en-curso' }, h('span', { class: 'nws-fl__en-curso-pt' }), 'En curso') : '')
              + (x.tipo === 'equipo'
                ? h('span', { class: 'nws-fl__fila-m' }, e(F.equipos[0].nombre)) + h('span', { class: 'nws-fl__fila-m' }, '<span class="nws-fl__flecha-vs">↳</span> <strong class="nws-fl__vs-b">VS</strong> ' + e(F.equipos[1].nombre))
                : h('span', { class: 'nws-fl__fila-m' }, e(x.prueba)))
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
      x = F.partido; var c = competencia(k), eq0 = F.equipos[x.equipos[0]], eq1 = F.equipos[x.equipos[1]];
      t = 'Detalle del partido';
      var vivo = c.estado === 'En curso', marc = vivo ? [0, 0] : x.marcador;
      /* como la pantalla de partido de la app: estado centrado, tarjeta de ronda centrada, escudos y marcador */
      b = h('div', { class: 'nws-fl__pill-centro' }, estadoPill(vivo ? 'En curso' : x.estado))
        + tarjeta('nws-fl__marcador-card', h('div', { class: 'nws-fl__ronda nws-fl__ronda--centro' }, h('strong', null, e((vivo ? c.rondas[0] : x.ronda) + ' · ' + sede(vivo ? c.sede : 0).nombre)), h('span', null, e(c.prueba + ' · ' + c.categoria)))
          + h('div', { class: 'nws-fl__marcador-fila' },
            h('div', { class: 'nws-fl__equipo' }, escudo(eq0.nombre), h('span', { class: 'nws-fl__equipo-n' }, e(eq0.nombre)), h('span', { class: 'nws-fl__equipo-ciudad' }, e(eq0.departamento))),
            h('div', { class: 'nws-fl__marcador' }, h('strong', null, e(marc[0])), h('span', { class: 'nws-fl__vs' }, 'vs'), h('strong', null, e(marc[1]))),
            h('div', { class: 'nws-fl__equipo' }, escudo(eq1.nombre), h('span', { class: 'nws-fl__equipo-n' }, e(eq1.nombre)), h('span', { class: 'nws-fl__equipo-ciudad' }, e(eq1.departamento)))))
        + (vivo ? h('h2', { class: 'nws-fl__explora' }, 'Equipos') : tabs(['Parciales', 'Equipos'], st));
      if (vivo || +st.tab === 1) {
        b += x.equipos.map(function (q, i) {
          var eq = F.equipos[q];
          return h('div', { class: 'nws-fl__eq-cab' }, h('span', { class: 'nws-fl__equipo-nom' }, e(eq.nombre)), h('span', { class: 'nws-fl__chip-ciudad' }, e(eq.departamento)))
            + tarjeta('nws-fl__nomina', x.nominas[i].map(function (n) {
              var a = F.deportistas[n];
              return enlace('deportista', n, h('span', { class: 'nws-fl__fila-t nws-fl__fila-t--sm' }, e(a.nombre)) + PERSONA, 'nws-fl__fila--plana');
            }).join(''));
        }).join('');
      } else {
        b += x.parciales.map(function (par, i) {
          return h('div', { class: 'nws-fl__cuarto' }, h('h3', { class: 'nws-fl__cuarto-t' }, 'Cuarto ' + (i + 1)),
            h('div', { class: 'nws-fl__cuarto-f' }, h('span', null, e(eq0.nombre)), h('strong', null, e(par[0]))),
            h('div', { class: 'nws-fl__cuarto-f' }, h('span', null, e(eq1.nombre)), h('strong', null, e(par[1]))));
        }).join('');
      }
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
    return { titulo: t, sub: sub, violeta: violeta, foto: foto, naranja: naranja, barraLogo: barraLogo, pie: pie, sinTitulo: id === 'competencias' || id === 'competencia' || id === 'sede' || id === 'posiciones' || id === 'noticias' || id === 'noticia' || id === 'login' || id === 'perfil' || id === 'inscritos' || id === 'equipo', html: b, dev: 'fl-' + id, dialogo: id === 'deportista' || id === 'sedes' };
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
  /* Días de competencia: chip en caja (day_chip.dart): número, mes y día de la semana, con mayúscula inicial. */
  function dias(st) {
    return h('div', { class: 'nws-fl__dias', role: 'group', 'aria-label': 'Día de competencias' }, F.dias.map(function (d) {
      var sel = (st.dia || F.dias[0]) === d, f = new Date(d + 'T12:00:00');
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
  var ICONO_DEPORTE = { 'Baloncesto': 'assets/landing/icons/baloncesto.svg', 'Atletismo': 'assets/landing/icons/atletismo.svg', 'Fútbol de salón': 'assets/landing/icons/futbol-salon.svg' };
  var ICONO_PIN = 'assets/landing/icons/pin.svg';
  var PERSONA = '<svg class="nws-fl__persona" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var IZQ = '<svg class="nws-fl__mes-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DER = '<svg class="nws-fl__mes-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FLECHA = '<svg class="nws-fl__doc-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOC = '<svg class="nws-fl__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
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
  return { vista: vista, calendarioRegional: calendarioRegional,
    destinoTab: function (id, k, tab) {
      if (id !== 'competencia') { return null; }
      var c = competencia(k);
      return +tab === 2 ? { id: c.tipo === 'equipo' ? 'posiciones' : 'podio', clave: k } : +tab === 3 ? (c.sedes && c.sedes.length > 1 ? { id: 'sedes', clave: k } : { id: 'sede', clave: c.sede }) : null;
    }
  };
};
