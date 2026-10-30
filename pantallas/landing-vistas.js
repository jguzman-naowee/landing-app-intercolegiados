/* Vistas inmersivas de la App JIN: entran en push y la home queda inerte debajo.
   La pila conserva cada pantalla, su scroll y el foco de entrada.
   Estilos: bloque nws-lpvw de app.css. */
window.LANDING_VISTAS = (function () {

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DUR = 300;
  var elegida = null;   /* regional elegida: en memoria, sobrevive a un nuevo montar(); sin localStorage */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(a, m, d) { return a + '-' + pad(m) + '-' + pad(d); }
  function partes(f) { var p = f.split('-'); return { a: +p[0], m: +p[1], d: +p[2] }; }
  function diaSemana(a, m, d) { return new Date(a, m - 1, d).getDay(); }
  function larga(f) { var p = partes(f); return DIAS[diaSemana(p.a, p.m, p.d)] + ' ' + p.d + ' de ' + MESES[p.m - 1]; }
  function corta(f) { var p = partes(f); return p.d + ' ' + MESES[p.m - 1].slice(0, 3); }

  function montar(S, L, mob, o) {
    var C = L.app.calendario, G = L.app.regionales, e = S.esc;
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var capas = [mob.querySelector('#lp-scroll'), mob.querySelector('#lpi-top'), mob.querySelector('.nws-lpi__bottom')];
    var vistas = {}, pila = [], actual = null, hoja = null, origenHoja = null, tReg = null, tEntra = null;
    var flujos = window.LANDING_FLUJOS(S, L), pendientes = [], destruido = false;
    function despues(fn, ms) { var t = setTimeout(function () { if (!destruido) { fn(); } }, ms); pendientes.push(t); return t; }
    var est = { mes: C.hoy.slice(0, 7), dia: C.hoy };

    function eventosDe(f) { return C.eventos.filter(function (x) { return x.fecha === f; }); }

    /* ---------- Calendario ---------- */
    function mesHtml() {
      var p = partes(est.mes + '-01'), dim = new Date(p.a, p.m, 0).getDate();
      var vacias = (diaSemana(p.a, p.m, 1) + 6) % 7;            /* la semana arranca en lunes */
      var celdas = '', i;
      for (i = 0; i < vacias; i++) { celdas += '<span class="nws-lpvw__vacia" aria-hidden="true"></span>'; }
      for (i = 1; i <= dim; i++) {
        var f = iso(p.a, p.m, i), n = eventosDe(f).length;
        var lab = i + ' de ' + MESES[p.m - 1] + (f === C.hoy ? ', hoy' : '') + (n ? ', ' + n + (n === 1 ? ' evento' : ' eventos') : ', sin eventos');
        celdas += S.h('button', { type: 'button', class: S.cls('nws-lpvw__dia', f === C.hoy && 'nws-lpvw__dia--hoy', f === est.dia && 'nws-lpvw__dia--sel'), 'data-dia': f, 'aria-pressed': f === est.dia ? 'true' : 'false', 'aria-label': lab },
          S.h('span', { class: 'nws-lpvw__num' }, i),
          S.h('span', { class: 'nws-lpvw__puntos', 'aria-hidden': 'true' }, n ? '<i></i>'.repeat(Math.min(n, 3)) : ''));
      }
      return celdas;
    }
    function agendaHtml() {
      var ev = eventosDe(est.dia);
      var cab = S.h('h3', { class: 'nws-lpvw__agenda-t' }, e(larga(est.dia)));
      if (!ev.length) { return cab + S.h('p', { class: 'nws-lpvw__vacio' }, e(C.vacio)); }
      return cab + S.h('ul', { class: 'nws-lpvw__lista' }, ev.map(function (x) {
        return S.h('li', null,
          S.h('button', { type: 'button', class: 'nws-lpvw__ev nws-ios-press', 'data-ev': x.id },
            S.h('span', { class: 'nws-lpvw__ev-f' }, S.h('span', null, e(corta(x.fecha))), S.h('strong', null, e(x.hora))),
            S.h('span', { class: 'nws-lpvw__ev-c' },
              S.h('span', { class: 'nws-lpvw__ev-tipo' }, e(x.tipo)),
              S.h('span', { class: 'nws-lpvw__ev-t' }, e(x.titulo)),
              S.iconLabel({ icon: 'gps-pin', label: x.lugar, cls: 'nws-lpvw__ev-l' })),
            S.icon('chevron-right', 'nws-lpvw__ev-ir')));
      }));
    }
    function pintarMes(v) {
      var p = partes(est.mes + '-01'), k = C.meses.indexOf(est.mes);
      v.querySelector('.nws-lpvw__mes-t').textContent = MESES[p.m - 1] + ' ' + p.a;
      v.querySelector('.nws-lpvw__grilla').innerHTML = mesHtml();
      v.querySelector('[data-mes="-1"] button').disabled = k <= 0;
      v.querySelector('[data-mes="1"] button').disabled = k >= C.meses.length - 1;
      pintarAgenda(v);
    }
    function pintarAgenda(v) { v.querySelector('.nws-lpvw__agenda').innerHTML = agendaHtml(); }
    function calendario() {
      var nav = function (d, lab, ic) { return S.iconButton({ icon: ic, size: 'medium', variant: 'mute', theme: 'neutral', label: lab, cls: 'nws-lpvw__nav', attrs: { 'data-mes': d } }); };
      return S.h('div', { class: 'nws-lpvw__cuerpo' },
        S.h('div', { class: 'nws-lpvw__mes' }, nav('-1', 'Mes anterior', 'chevron-left'),
          S.h('h2', { class: 'nws-lpvw__mes-t', 'aria-live': 'polite' }), nav('1', 'Mes siguiente', 'chevron-right')),
        S.h('div', { class: 'nws-lpvw__semana', 'aria-hidden': 'true' }, C.diasSemana.map(function (d) { return S.h('span', null, e(d)); })),
        S.h('div', { class: 'nws-lpvw__grilla', role: 'group', 'aria-label': 'Días del mes' }),
        S.h('div', { class: 'nws-lpvw__agenda' }));
    }

    /* ---------- Regional de conjuntos: cuadrícula de 2 columnas (una sola tarjeta: a pantalla llena) ---------- */
    function opcionDe(id) { return G.opciones.filter(function (x) { return x.id === id; })[0]; }
    function regActual() { return opcionDe(elegida) || opcionDe(G.actual) || G.opciones[0]; }
    function regionalesHtml(entra) {
      var op = regActual();
      return S.h('ul', { class: S.cls('nws-lpvw__reg-lista', op.tarjetas.length === 1 && 'nws-lpvw__reg-lista--una', entra && 'nws-lpvw__reg-lista--entra'), role: 'list' }, op.tarjetas.map(function (k, i) {
        var x = G.items[k];
        return S.h('li', { style: '--nws-i:' + i },
          S.h('button', { type: 'button', class: 'nws-lpvw__reg nws-ios-press', 'aria-label': x.nombre + ', ' + x.ciudad, 'data-flujo': regActual().id !== 'final' ? 'regional' : null, 'data-clave': regActual().id + ':' + k, 'data-toast': regActual().id === 'final' ? x.nombre : null },
            S.h('span', { class: 'nws-lpvw__reg-foto' }, S.h('img', { src: x.img, alt: '', draggable: 'false', style: x.pos ? 'object-position:' + x.pos : null })),
            S.h('span', { class: 'nws-lpvw__reg-ciudad' }, e(x.ciudad)),
            S.h('span', { class: 'nws-lpvw__reg-fila' },
              S.h('span', { class: 'nws-lpvw__reg-nombre' }, e(x.nombre)),
              S.icon('arrow-right', 'nws-lpvw__reg-ir'))));
      }));
    }
    /* Panel de «Cambiar»: cerrado va `inert` (sin foco ni lectura) y sin alto; ver .nws-lpvw__reg-cambio. */
    function cambioHtml() {
      return S.h('div', { class: 'nws-lpvw__reg-cambio', id: 'nws-reg-cambio', inert: true },
        S.h('div', { class: 'nws-lpvw__reg-cambio-v' },
          S.h('div', { class: 'nws-lpvw__reg-ops', role: 'listbox', 'aria-label': 'Regionales disponibles' }, G.opciones.map(function (x) {
            var sel = x.id === regActual().id;
            return S.h('button', { type: 'button', class: 'nws-lpvw__reg-op', role: 'option', 'aria-selected': sel ? 'true' : 'false', tabindex: sel ? '0' : '-1', 'data-reg-op': x.id },
              S.h('span', { class: 'nws-lpvw__reg-op-t' }, e(x.nombre)),
              sel ? S.icon('positive', 'nws-lpvw__reg-op-ok') : '');
          }))));
    }
    /* Cuatro filas: volver; título y «Cambiar»; panel de regionales (colapsado); subtítulo. */
    function cabeceraRegionales(volver) {
      return S.h('header', { class: 'nws-lpvw__top nws-lpvw__top--reg' },
        S.h('div', { class: 'nws-lpvw__cab-nav' }, volver),
        S.h('div', { class: 'nws-lpvw__cab-tit' },
          S.h('h1', { class: 'nws-lpvw__reg-t' }, e(regActual().nombre)),
          S.button({ label: G.cambiar, size: 'medium', theme: 'neutral', cls: 'nws-lpvw__cambiar', attrs: { 'data-reg-cambiar': true, 'aria-label': 'Cambiar regional', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-controls': 'nws-reg-cambio' } })),
        cambioHtml(),
        S.h('p', { class: 'nws-lpvw__reg-sub' }, e(G.subtitulo)));
    }

    /* ---------- «Cambiar»: abre/cierra el panel de regionales ---------- */
    function cambioEls() {
      var v = vistas.regionales; if (!v) { return null; }
      return { p: v.el.querySelector('.nws-lpvw__reg-cambio'), b: v.el.querySelector('.nws-lpvw__cambiar') };
    }
    function cambioAbierto() { var c = cambioEls(); return !!c && c.p.classList.contains('nws-lpvw__reg-cambio--abierto'); }
    function ponerCambio(abierto, devolverFoco) {
      var c = cambioEls(); if (!c || cambioAbierto() === abierto) { return; }
      if (!abierto && devolverFoco) { c.b.focus({ preventScroll: true }); }  /* antes del inert: si no, el foco cae al body */
      c.p.classList.toggle('nws-lpvw__reg-cambio--abierto', abierto);
      c.p.inert = !abierto;
      c.b.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      var s = c.p.querySelector('[aria-selected="true"]');
      c.p.querySelectorAll('[data-reg-op]').forEach(function (x) { x.tabIndex = x === s ? 0 : -1; });
      if (abierto && s) { s.focus({ preventScroll: true }); }
    }
    function moverOpcion(ev) {
      var op = ev.target.closest('[data-reg-op]'), k = ev.key;
      if (!op || (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End')) { return; }
      var ops = [].slice.call(op.parentNode.querySelectorAll('[data-reg-op]')), i = ops.indexOf(op);
      var n = k === 'Home' ? 0 : k === 'End' ? ops.length - 1 : (i + (k === 'ArrowDown' ? 1 : -1) + ops.length) % ops.length;
      ev.preventDefault();
      ops.forEach(function (x, j) { x.tabIndex = j === n ? 0 : -1; });
      ops[n].focus({ preventScroll: true });
    }

    /* El toque responde al instante (título, check); cierre y repintado esperan 150 ms para que se vea la selección. */
    function elegirRegional(id) {
      var v = vistas.regionales, op = opcionDe(id); if (!v || !op) { return; }
      elegida = id;
      v.el.setAttribute('aria-label', op.nombre);
      v.el.querySelector('.nws-lpvw__reg-t').textContent = op.nombre;
      v.el.querySelectorAll('[data-reg-op]').forEach(function (b) {
        var s = b.getAttribute('data-reg-op') === id, ok = b.querySelector('.nws-lpvw__reg-op-ok');
        b.setAttribute('aria-selected', s ? 'true' : 'false');
        if (ok && !s) { ok.remove(); }
        if (s && !ok) { b.insertAdjacentHTML('beforeend', S.icon('positive', 'nws-lpvw__reg-op-ok')); }
      });
      clearTimeout(tReg);
      tReg = setTimeout(function () { pintarRegionales(v.el, op); }, 150);
    }
    function pintarRegionales(el, op) {
      ponerCambio(false, true);
      var sc = el.querySelector('.nws-lpvw__scroll');
      sc.innerHTML = regionalesHtml(!reducido);
      sc.scrollTop = 0;
      el.querySelector('[data-reg-aviso]').textContent = 'Mostrando ' + op.nombre;
      clearTimeout(tEntra);   /* la animación se retira: al reabrir la vista (display:none) se repetiría */
      if (!reducido) { tEntra = setTimeout(function () { var u = sc.firstElementChild; if (u) { u.classList.remove('nws-lpvw__reg-lista--entra'); } }, 460); }
    }

    /* ---------- detalle del evento: bottom sheet dentro del teléfono ---------- */
    function abrirHoja(id, origen) {
      var x = C.eventos.filter(function (k) { return k.id === id; })[0]; if (!x || hoja) { return; }
      var v = vistas.calendario.el; origenHoja = origen;
      hoja = document.createElement('div');
      hoja.className = 'nws-lpvw__hoja';
      hoja.innerHTML = S.h('div', { class: 'nws-lpvw__velo', 'data-hoja-cerrar': true }) +
        S.h('div', { class: 'nws-lpvw__panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': x.titulo },
          S.h('span', { class: 'nws-lpvw__asa', 'aria-hidden': 'true' }),
          S.iconButton({ icon: 'close', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Cerrar detalle', cls: 'nws-lpvw__x', attrs: { 'data-hoja-cerrar': true } }),
          S.h('span', { class: 'nws-lpvw__ev-tipo' }, e(x.tipo)),
          S.h('h2', { class: 'nws-lpvw__hoja-t' }, e(x.titulo)),
          S.h('div', { class: 'nws-lpvw__datos' },
            S.iconLabel({ icon: 'calendar', label: larga(x.fecha) }),
            S.iconLabel({ icon: 'dispatch-time', label: x.hora }),
            S.iconLabel({ icon: 'gps-pin', label: x.lugar })),
          S.h('p', { class: 'nws-lpvw__hoja-d' }, e(x.detalle)),
          S.button({ label: C.agregar, size: 'large', theme: 'primary', cls: 'nws-lpvw__agregar', attrs: { 'data-toast': C.agregar } }));
      v.appendChild(hoja);
      v.querySelector('.nws-lpvw__bloque').inert = true;
      void hoja.offsetWidth;
      hoja.classList.add('nws-lpvw__hoja--abierta');
      hoja.querySelector('.nws-lpvw__x button').focus({ preventScroll: true });
    }
    function cerrarHoja() {
      if (!hoja) { return; }
      var h = hoja, v = vistas.calendario.el, o2 = origenHoja; hoja = null;
      h.classList.remove('nws-lpvw__hoja--abierta');
      v.querySelector('.nws-lpvw__bloque').inert = false;
      setTimeout(function () { h.remove(); }, reducido ? 0 : 260);
      if (o2 && o2.isConnected) { o2.focus({ preventScroll: true }); }
    }

    /* Indicador de las pestañas de los flujos: mide el texto de la pestaña activa, como NwtTabs de la app.
       Las medidas van en variables y el CSS las aplica con !important, porque app.js le pone el ancho de la pestaña en línea. */
    function medirIndicadores(root) {
      root.querySelectorAll('.nws-fl__tabs').forEach(function (tabs) {
        var act = tabs.querySelector('.nwt-tabs__tab--active'), txt = act && act.querySelector('.nwt-tabs__label-text');
        if (!act || !txt || !txt.offsetWidth) { return; }
        tabs.style.setProperty('--fl-ind-x', (act.offsetLeft + (act.offsetWidth - txt.offsetWidth) / 2) + 'px');
        tabs.style.setProperty('--fl-ind-w', txt.offsetWidth + 'px');
      });
    }

    /* ---------- cascarón común ---------- */
    function crear(id, clave, estado) {
      var contenido = flujos.vista(id, clave, estado);
      var el = document.createElement('section');
      el.className = 'nws-lpvw nws-lpvw--' + id;
      el.hidden = true;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', contenido ? contenido.titulo : id === 'regionales' ? regActual().nombre : C.titulo);
      var volver = S.iconButton({ icon: 'chevron-left', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Volver', cls: 'nws-lpvw__volver', attrs: { 'data-vw-cerrar': true } });
      var cabecera, cuerpo;
      if (contenido) {
        el.classList.add('nws-fl');
        if (contenido.dialogo) { el.classList.add('nws-fl--dialogo'); }
        if (contenido.violeta) { el.classList.add('nws-fl--violeta'); }
        el.setAttribute('data-dev', contenido.dev);
        if (contenido.naranja) { el.classList.add('nws-fl--naranja'); }
        cabecera = contenido.barraLogo
          ? S.h('header', { class: 'nws-fl__top-logo' }, S.h('img', { class: 'nws-fl__top-logo-img', src: window.JIC.logos.intercolegiados, alt: 'Juegos Intercolegiados' }), S.h('button', { type: 'button', class: 'nws-fl__hamb', 'data-toast': 'Menú', 'aria-label': 'Menú' }, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'))
          : contenido.naranja
          ? S.h('header', { class: 'nws-fl__top-naranja' }, S.iconButton({ icon: 'close', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Cerrar', cls: 'nws-fl__login-x', attrs: { 'data-vw-cerrar': true } }), S.h('h1', { class: 'nws-fl__top-naranja-t' }, e(contenido.titulo)))
          : contenido.dialogo
          ? S.h('header', { class: 'nws-fl__modal-cab' }, S.h('h1', { class: 'nws-fl__modal-t' }, e(contenido.titulo)), S.iconButton({ icon: 'close', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Cerrar', cls: 'nws-fl__modal-x', attrs: { 'data-vw-cerrar': true } }))
          : contenido.foto
          ? S.h('header', { class: 'nws-lpvw__top nws-fl__top--foto', style: 'background-image:url(' + contenido.foto + ')' }, volver, S.h('h1', { class: 'nws-fl__sr' }, e(contenido.titulo)))
          : contenido.violeta
          ? S.h('header', { class: 'nws-fl__top nws-fl__top--violeta' }, S.h('div', { class: 'nws-fl__top-fila' }, volver), S.h('h1', { class: 'nws-fl__top-t' }, e(contenido.titulo)), contenido.sub ? S.h('p', { class: 'nws-fl__top-sub' }, e(contenido.sub)) : '')
          : S.h('header', { class: 'nws-lpvw__top' }, volver, S.h('h1', { class: contenido.sinTitulo ? 'nws-fl__sr' : 'nws-lpvw__titulo' }, e(contenido.titulo)));
        cuerpo = S.h('div', { class: 'nws-lpvw__scroll' }, S.h('div', { class: 'nws-fl__contenido' }, S.h('div', { 'data-fl-contenido': true }, contenido.html), S.h('p', { class: 'nws-fl__aviso' }, e(L.app.flujos.aviso))));
      } else if (id === 'regionales') {
        el.setAttribute('data-dev', 'fl-regionales');
        cabecera = cabeceraRegionales(volver);
        cuerpo = S.h('div', { class: 'nws-lpvw__scroll' }, regionalesHtml());
      } else {
        cabecera = S.h('header', { class: 'nws-lpvw__top' }, volver, S.h('h1', { class: 'nws-lpvw__titulo' }, e(C.titulo)));
        cuerpo = S.h('div', { class: 'nws-lpvw__scroll' }, calendario());
      }
      el.innerHTML = S.h('div', { class: 'nws-lpvw__bloque' },
        S.h('div', { class: 'nws-lpvw__estado' }, o.barraEstado(S, L.hora)), cabecera, cuerpo + (contenido && contenido.pie ? S.h('nav', { class: 'nws-fl__pie', 'aria-label': 'Navegación' }, contenido.pie) : ''),
        id === 'regionales' ? S.h('p', { class: 'nws-lpvw__sr', 'aria-live': 'polite', 'data-reg-aviso': true }) : '');
      mob.appendChild(el);
      if (id === 'regionales' && o.proximamente) {
        /* El rótulo del aviso es el data-toast tal cual: el global de app.js prefiere el aria-label. */
        el.addEventListener('click', function (ev) {
          var t = ev.target.closest('[data-toast]'); if (!t) { return; }
          ev.stopPropagation();
          o.proximamente(t.getAttribute('data-toast'), t);
        });
      }
      el.addEventListener('keydown', moverOpcion);
      el.addEventListener('keydown', function (ev) {
        var tab = ev.target.closest('.nws-fl__tabs [data-tab]');
        if (!tab || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(ev.key) < 0) { return; }
        var botones = Array.from(tab.closest('.nws-fl__tabs').querySelectorAll('[data-tab]'));
        var i = botones.indexOf(tab), n = ev.key === 'Home' ? 0 : ev.key === 'End' ? botones.length - 1 : (i + (ev.key === 'ArrowLeft' ? -1 : 1) + botones.length) % botones.length;
        ev.preventDefault(); botones[n].click();
      });
      el.addEventListener('change', function (ev) {
        var f = ev.target.closest('[data-filtro]'); if (!f || f.type === 'search') { return; }
        var key = f.getAttribute('data-filtro'); estado[key] = f.value;
        if (key === 'departamento') { estado.municipio = ''; }
        if (key === 'deporte') { estado.categoria = ''; }
        repintar(el, id, clave, estado);
        var nuevo = el.querySelector('[data-filtro="' + key + '"]'); if (nuevo) { nuevo.focus({ preventScroll: true }); }
      });
      el.addEventListener('input', function (ev) {
        if (!ev.target.matches('input[data-filtro="busqueda"]')) { return; }
        estado.busqueda = ev.target.value;
        var region = el.querySelector('[data-fl-calendario]');
        if (region) { region.innerHTML = flujos.calendarioRegional(estado, clave); }
      });
      el.addEventListener('click', function (ev) {
        var t = ev.target;
        /* hoja inferior «Elige una opción» de las listas de inscritos */
        var hj = t.closest('[data-fl-hoja]');
        if (hj) { ev.stopPropagation(); var hoja_ = el.querySelector('.nws-fl__hoja'); if (hoja_) { hoja_.classList.toggle('nws-fl__hoja--abierta', hj.getAttribute('data-fl-hoja') === 'abrir'); } return; }
        var opc = t.closest('[data-fl-opcion]');
        if (opc) { ev.stopPropagation(); estado.lista = opc.getAttribute('data-fl-opcion'); repintar(el, id, clave, estado); return; }
        var ir = t.closest('[data-flujo]');
        if (ir) { ev.stopPropagation(); abrir(ir.getAttribute('data-flujo'), ir, ir.getAttribute('data-clave')); return; }
        var dia = t.closest('[data-fl-dia]');
        if (dia) { ev.stopPropagation(); estado.dia = dia.getAttribute('data-fl-dia'); repintar(el, id, clave, estado); el.querySelector('[data-fl-dia="' + estado.dia + '"]').focus({ preventScroll: true }); return; }
        var tab = t.closest('.nws-fl__tabs [data-tab]');
        if (tab) { ev.stopPropagation(); var destino = flujos.destinoTab(id, clave, tab.getAttribute('data-tab')); if (destino) { abrir(destino.id, tab, destino.clave); return; } estado.tab = tab.getAttribute('data-tab'); repintar(el, id, clave, estado); el.querySelector('[data-tab="' + estado.tab + '"]').focus({ preventScroll: true }); return; }
        var cb = t.closest('[data-reg-cambiar]');
        if (cb) { ev.stopPropagation(); ponerCambio(!cambioAbierto(), true); return; }
        var op = t.closest('[data-reg-op]');
        if (op) {
          ev.stopPropagation();
          if (op.getAttribute('data-reg-op') === regActual().id) { ponerCambio(false, true); } else { elegirRegional(op.getAttribute('data-reg-op')); }
          return;
        }
        if (cambioAbierto() && !t.closest('.nws-lpvw__reg-cambio')) { ponerCambio(false, false); }
        if (t.closest('[data-hoja-cerrar]')) { cerrarHoja(); return; }
        if (t.closest('[data-vw-cerrar]')) { cerrar(); return; }
        var m = t.closest('[data-mes]');
        if (m) {
          if (m.querySelector('button').disabled) { return; }
          est.mes = C.meses[C.meses.indexOf(est.mes) + (+m.getAttribute('data-mes'))];
          est.dia = est.mes === C.hoy.slice(0, 7) ? C.hoy : (C.eventos.filter(function (x) { return x.fecha.slice(0, 7) === est.mes; })[0] || { fecha: est.mes + '-01' }).fecha;
          pintarMes(el); return;
        }
        var d = t.closest('[data-dia]');
        if (d) {
          est.dia = d.getAttribute('data-dia');
          el.querySelectorAll('.nws-lpvw__dia').forEach(function (b) { var s = b === d; b.classList.toggle('nws-lpvw__dia--sel', s); b.setAttribute('aria-pressed', s ? 'true' : 'false'); });
          pintarAgenda(el); return;
        }
        var v = t.closest('[data-ev]'); if (v) { abrirHoja(v.getAttribute('data-ev'), v); }
      });
      if (id === 'calendario') { pintarMes(el); }
      return el;
    }

    function inerte(v) { capas.forEach(function (c) { if (c) { c.inert = v; } }); }

    function repintar(el, id, clave, estado) {
      var v = flujos.vista(id, clave, estado);
      el.querySelector('[data-fl-contenido]').innerHTML = v.html;
      medirIndicadores(el);
      if (o.posicionarIndicadores) { o.posicionarIndicadores(el); }
      mob.dispatchEvent(new CustomEvent('jin:vista'));
    }
    function abrir(id, origen, clave, alCerrar) {
      var estado = {}, contenido;
      if (id === 'competencias' && actual) { Object.assign(estado, actual.estado); estado.tab = '0'; }
      if ((id === 'competencia' || id === 'partido' || id === 'salida') && actual && actual.estado.dia) { estado.dia = actual.estado.dia; }
      contenido = flujos.vista(id, clave, estado);
      if (!contenido && id !== 'regionales' && id !== 'calendario') {
        if (o.proximamente) { o.proximamente(id, origen); } return;
      }
      if (actual && actual.id === id && actual.clave === clave) { return; }
      if (actual) { ponerCambio(false, false); actual.el.inert = true; actual.el.setAttribute('aria-modal', 'false'); }
      var v = { id: id, clave: clave, estado: estado, origen: origen || document.activeElement, alCerrar: alCerrar };
      v.el = crear(id, clave, estado); vistas[id] = v;
      pila.push(v); actual = v;
      v.el.hidden = false;
      void v.el.offsetWidth;
      medirIndicadores(v.el);
      v.el.classList.add('nws-lpvw--abierta');
      inerte(true); mob.classList.add('nws-lp--vista');
      document.addEventListener('keydown', onEsc);
      if (o.posicionarIndicadores) { o.posicionarIndicadores(v.el); }
      var enfoque = v.el.querySelector('.nws-lpvw__volver button') || v.el.querySelector('.nws-fl__modal-x button') || v.el.querySelector('.nws-fl__login-x button');
      if (enfoque) { enfoque.focus({ preventScroll: true }); }
      mob.dispatchEvent(new CustomEvent('jin:vista'));
    }
    function cerrar() {
      if (!actual) { return; }
      cerrarHoja(); ponerCambio(false, false);
      var v = pila.pop(); actual = pila[pila.length - 1] || null;
      v.el.inert = true; v.el.setAttribute('aria-modal', 'false');
      v.el.classList.remove('nws-lpvw--abierta');
      despues(function () { v.el.remove(); }, reducido ? 0 : DUR);
      if (actual) { actual.el.inert = false; actual.el.setAttribute('aria-modal', 'true'); vistas[actual.id] = actual; }
      else { inerte(false); mob.classList.remove('nws-lp--vista'); document.removeEventListener('keydown', onEsc); }
      if (v.origen && v.origen.isConnected) { v.origen.focus({ preventScroll: true }); }
      if (v.alCerrar) { v.alCerrar(); }
      mob.dispatchEvent(new CustomEvent('jin:vista'));
    }
    function onEsc(ev) {
      if (ev.key === 'Tab' && actual) {
        var controles = Array.from((hoja || actual.el).querySelectorAll('button:not([disabled]), input, select, summary, a[href], [tabindex="0"]')).filter(function (x) { return !x.closest('[inert]') && x.getClientRects().length; });
        var primero = controles[0], ultimo = controles[controles.length - 1];
        if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
        else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
      }
      if (ev.key !== 'Escape') { return; }
      ev.preventDefault(); ev.stopImmediatePropagation();
      if (hoja) { cerrarHoja(); } else if (cambioAbierto()) { ponerCambio(false, true); } else { cerrar(); }
    }

    return {
      abrir: abrir, cerrar: cerrar,
      destruir: function () {
        destruido = true; pendientes.forEach(clearTimeout); clearTimeout(tReg); clearTimeout(tEntra); document.removeEventListener('keydown', onEsc);
        mob.querySelectorAll('.nws-lpvw').forEach(function (el) { el.remove(); }); pila = []; actual = null;
        inerte(false);
      }
    };
  }

  return { montar: montar };
})();
