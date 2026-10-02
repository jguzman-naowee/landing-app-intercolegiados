/* Vistas inmersivas de la App JIN: entran en push y la home queda inerte debajo.
   Hoy solo `regionales` tiene acceso; calendario y resultados esperan sus salidas.
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
    var C = L.app.calendario, R = L.app.resultados, G = L.app.regionales, e = S.esc;
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var capas = [mob.querySelector('#lp-scroll'), mob.querySelector('#lpi-top'), mob.querySelector('.nws-lpi__bottom')];
    var vistas = {}, actual = null, timer = null, hoja = null, origenHoja = null, foco = null, tReg = null, tEntra = null;
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
          S.h('button', { type: 'button', class: 'nws-lpvw__reg nws-ios-press', 'aria-label': x.nombre + ', ' + x.ciudad, 'data-toast': x.nombre },
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

    /* ---------- cascarón común ---------- */
    function crear(id) {
      var el = document.createElement('section');
      el.className = 'nws-lpvw nws-lpvw--' + id;
      el.hidden = true;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', id === 'regionales' ? regActual().nombre : id === 'calendario' ? C.titulo : R.titulo);
      var volver = S.iconButton({ icon: 'chevron-left', size: 'medium', variant: 'mute', theme: 'neutral', label: id === 'regionales' ? 'Volver' : 'Volver a Inicio', cls: 'nws-lpvw__volver', attrs: { 'data-vw-cerrar': true } });
      var cabecera, cuerpo;
      if (id === 'regionales') {
        cabecera = cabeceraRegionales(volver);
        cuerpo = S.h('div', { class: 'nws-lpvw__scroll' }, regionalesHtml());
      } else {
        cabecera = S.h('header', { class: 'nws-lpvw__top' }, volver, id === 'calendario' ? S.h('h1', { class: 'nws-lpvw__titulo' }, e(C.titulo)) : '');
        cuerpo = id === 'calendario'
          ? S.h('div', { class: 'nws-lpvw__scroll' }, calendario())
          : S.h('div', { class: 'nws-lpvw__centro' }, S.h('p', null, e(R.texto)));
      }
      el.innerHTML = S.h('div', { class: 'nws-lpvw__bloque' },
        S.h('div', { class: 'nws-lpvw__estado' }, o.barraEstado(S, L.hora)), cabecera, cuerpo,
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
      el.addEventListener('click', function (ev) {
        var t = ev.target;
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

    function abrir(id, origen) {
      if (actual === id || !(id === 'regionales' || id === 'calendario' || id === 'resultados')) { return; }
      if (actual) { return; }
      var v = vistas[id] || (vistas[id] = { el: crear(id) });
      clearTimeout(timer);
      actual = id; foco = origen || null;
      v.el.hidden = false;
      void v.el.offsetWidth;
      v.el.classList.add('nws-lpvw--abierta');
      inerte(true);
      mob.classList.add('nws-lp--vista');
      document.addEventListener('keydown', onEsc);
      setTimeout(function () { var b = v.el.querySelector('.nws-lpvw__volver button'); if (b) { b.focus({ preventScroll: true }); } }, reducido ? 0 : 60);
    }
    function cerrar() {
      if (!actual) { return; }
      cerrarHoja();
      ponerCambio(false, false);   /* la vista queda en caché: al reabrir, el panel arranca cerrado */
      var v = vistas[actual]; actual = null;
      v.el.classList.remove('nws-lpvw--abierta');
      inerte(false);
      mob.classList.remove('nws-lp--vista');
      document.removeEventListener('keydown', onEsc);
      timer = setTimeout(function () { v.el.hidden = true; }, reducido ? 0 : DUR);
      var t = foco || mob.querySelector('.nws-lpx__tabbar [data-tab="inicio"]'); foco = null;
      if (t) { t.focus({ preventScroll: true }); }
    }
    function onEsc(ev) {
      if (ev.key !== 'Escape') { return; }
      ev.preventDefault();
      if (hoja) { cerrarHoja(); } else if (cambioAbierto()) { ponerCambio(false, true); } else { cerrar(); }
    }

    return {
      abrir: abrir, cerrar: cerrar,
      destruir: function () {
        clearTimeout(timer); clearTimeout(tReg); clearTimeout(tEntra); document.removeEventListener('keydown', onEsc);
        Object.keys(vistas).forEach(function (k) { vistas[k].el.remove(); });
        inerte(false);
      }
    };
  }

  return { montar: montar };
})();
