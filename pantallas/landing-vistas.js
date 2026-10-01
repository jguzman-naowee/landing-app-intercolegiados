/**
 * Vistas inmersivas de la App JIN (Calendario y Resultados). Cada una se
 * monta una sola vez sobre el teléfono y entra en push; la home no se toca
 * (queda inerte debajo), así conserva scroll y estado al volver.
 * Estilos: bloque nws-lpvw al final de app.css.
 */
window.LANDING_VISTAS = (function () {

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DUR = 300;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(a, m, d) { return a + '-' + pad(m) + '-' + pad(d); }
  function partes(f) { var p = f.split('-'); return { a: +p[0], m: +p[1], d: +p[2] }; }
  function diaSemana(a, m, d) { return new Date(a, m - 1, d).getDay(); }
  function larga(f) { var p = partes(f); return DIAS[diaSemana(p.a, p.m, p.d)] + ' ' + p.d + ' de ' + MESES[p.m - 1]; }
  function corta(f) { var p = partes(f); return p.d + ' ' + MESES[p.m - 1].slice(0, 3); }

  function montar(S, L, mob, o) {
    var C = L.app.calendario, R = L.app.resultados, e = S.esc;
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var capas = [mob.querySelector('#lp-scroll'), mob.querySelector('#lpi-top'), mob.querySelector('.nws-lpi__bottom')];
    var vistas = {}, actual = null, timer = null, hoja = null, origenHoja = null, foco = null;
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
      el.setAttribute('aria-label', id === 'calendario' ? C.titulo : R.titulo);
      var volver = S.iconButton({ icon: 'chevron-left', size: 'medium', variant: 'mute', theme: 'neutral', label: 'Volver a Inicio', cls: 'nws-lpvw__volver', attrs: { 'data-vw-cerrar': true } });
      el.innerHTML = S.h('div', { class: 'nws-lpvw__bloque' },
        S.h('div', { class: 'nws-lpvw__estado' }, o.barraEstado(S, L.hora)),
        S.h('header', { class: 'nws-lpvw__top' }, volver, id === 'calendario' ? S.h('h1', { class: 'nws-lpvw__titulo' }, e(C.titulo)) : ''),
        id === 'calendario'
          ? S.h('div', { class: 'nws-lpvw__scroll' }, calendario())
          : S.h('div', { class: 'nws-lpvw__centro' }, S.h('p', null, e(R.texto))));
      mob.appendChild(el);
      el.addEventListener('click', function (ev) {
        var t = ev.target;
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
      if (actual === id || !(id === 'calendario' || id === 'resultados')) { return; }
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
      if (hoja) { cerrarHoja(); } else { cerrar(); }
    }

    return {
      abrir: abrir, cerrar: cerrar,
      destruir: function () {
        clearTimeout(timer); document.removeEventListener('keydown', onEsc);
        Object.keys(vistas).forEach(function (k) { vistas[k].el.remove(); });
        inerte(false);
      }
    };
  }

  return { montar: montar };
})();
