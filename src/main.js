/* In The Mow Lawncare — progressive enhancement. No dependencies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: mobile menu + services dropdown ---------- */
  var burger = document.querySelector('.burger');
  var mobile = document.querySelector('.mobile-menu');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.hasAttribute('data-open');
      if (open) { mobile.removeAttribute('data-open'); } else { mobile.setAttribute('data-open', ''); }
      burger.setAttribute('aria-expanded', String(!open));
    });
  }
  document.querySelectorAll('.nav .has-sub').forEach(function (item) {
    var btn = item.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = item.hasAttribute('data-open');
      document.querySelectorAll('.nav .has-sub[data-open]').forEach(function (o) { o.removeAttribute('data-open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
      if (!open) { item.setAttribute('data-open', ''); btn.setAttribute('aria-expanded', 'true'); }
    });
    item.addEventListener('keydown', function (e) { if (e.key === 'Escape') { item.removeAttribute('data-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav .has-sub')) {
      document.querySelectorAll('.nav .has-sub[data-open]').forEach(function (o) { o.removeAttribute('data-open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Before / after sliders ---------- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var r = ba.querySelector('input[type=range]');
    if (!r) return;
    var set = function () { ba.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', set); set();
  });

  /* ---------- Quote form: tracking script captures the submit, then redirect ---------- */
  document.querySelectorAll('form[data-quote-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      try {
        var data = {};
        new FormData(form).forEach(function (v, k) { data[k] = v; });
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'quote_form_submit', form_id: form.id || 'quote', service_needed: data.service_needed || '' });
        sessionStorage.setItem('itm_quote', JSON.stringify({ name: data.full_name || '', service: data.service_needed || '' }));
      } catch (err) { /* non-fatal */ }
      setTimeout(function () { window.location.href = form.getAttribute('data-redirect') || '/thank-you'; }, 450);
    });
  });

  /* ---------- Thank-you page personalisation ---------- */
  var ty = document.getElementById('ty-name');
  if (ty) { try { var q = JSON.parse(sessionStorage.getItem('itm_quote') || '{}'); if (q.name) { ty.textContent = 'Thanks, ' + q.name.split(' ')[0] + '!'; } } catch (err) {} }

  /* ---------- Animated service-area map ---------- */
  var map = document.querySelector('.map');
  if (map) {
    var route = map.querySelector('#mow-route');
    var mower = map.querySelector('#mower');
    var labels = Array.prototype.slice.call(map.querySelectorAll('[data-x]'));
    var finish = function () { labels.forEach(function (l) { l.classList.remove('hot'); l.classList.add('lit'); }); };
    if (!route || !mower || reduce) { finish(); if (mower) mower.setAttribute('transform', 'translate(' + mower.getAttribute('data-home') + ')'); }
    else {
      var len = route.getTotalLength();
      var dist = 0, last = null, paused = 0, lastX = null;
      var speed = 0.09; // svg units per ms
      var reset = function () { labels.forEach(function (l) { l.classList.remove('hot', 'lit'); l.removeAttribute('data-seen'); }); };
      var step = function (t) {
        if (last === null) last = t;
        var dt = Math.min(t - last, 50); last = t;
        if (paused > 0) { paused -= dt; if (paused <= 0) { reset(); dist = 0; } requestAnimationFrame(step); return; }
        dist += dt * speed;
        if (dist >= len) { dist = len; paused = 2400; }
        var p = route.getPointAtLength(dist);
        var p2 = route.getPointAtLength(Math.min(dist + 4, len));
        var dir = (lastX === null) ? 1 : (p2.x - p.x >= 0 ? 1 : -1);
        lastX = p.x;
        mower.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') scale(' + dir + ' 1)');
        labels.forEach(function (l) {
          if (l.hasAttribute('data-seen')) return;
          var dx = +l.getAttribute('data-x') - p.x, dy = +l.getAttribute('data-y') - p.y;
          if (dx * dx + dy * dy < 30 * 30) {
            l.setAttribute('data-seen', '1'); l.classList.add('hot');
            setTimeout(function () { l.classList.remove('hot'); l.classList.add('lit'); }, 1100);
          }
        });
        requestAnimationFrame(step);
      };
      var started = false;
      var start = function () { if (!started) { started = true; requestAnimationFrame(step); } };
      if ('IntersectionObserver' in window) { new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.2 }).observe(map); }
      else start();
    }
  }
})();
