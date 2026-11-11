/* In The Mow Lawncare: progressive enhancement. No dependencies. */
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

  /* ---------- Hero video: poster first (LCP), video after load, skipped on reduced motion / data saver ---------- */
  var hv = document.querySelector('[data-hero-video]');
  if (hv && !reduce) {
    var conn = navigator.connection || {};
    var slow = conn.saveData || /(^|[^0-9])2g/.test(conn.effectiveType || '');
    if (!slow) {
      var loadVideo = function () {
        var v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
        v.preload = 'auto'; v.poster = hv.getAttribute('data-poster') || '';
        (hv.getAttribute('data-sources') || '').split(',').forEach(function (src) { if (!src) return; var s = document.createElement('source'); s.src = src.trim(); s.type = /\.webm/.test(src) ? 'video/webm' : 'video/mp4'; v.appendChild(s); });
        v.addEventListener('canplay', function () { v.classList.add('ready'); var p = v.play(); if (p && p.catch) p.catch(function () {}); });
        hv.appendChild(v);
      };
      if (document.readyState === 'complete') setTimeout(loadVideo, 300); else window.addEventListener('load', function () { setTimeout(loadVideo, 300); });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  // Staggered text columns: each child (and each checklist item) reveals on its own as it scrolls in
  document.querySelectorAll('.stagger').forEach(function (col) {
    var kids = []; Array.prototype.forEach.call(col.children, function (k) { if (k.classList.contains('checks')) Array.prototype.push.apply(kids, k.children); else kids.push(k); });
    kids.forEach(function (k, i) { k.classList.add('reveal-item'); k.style.transitionDelay = (Math.min(i, 8) * 70) + 'ms'; });
  });
  var reveals = document.querySelectorAll('.reveal, .reveal-item');
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

  /* ---------- Quote form: phone or email, suburb, photos; posts to /api/quote, then the thank-you page ---------- */
  var MAX_PHOTOS = 5;
  // Phone photos are 3 to 6 MB each. Shrink them to 1600px JPEGs in the browser so five fit in one request.
  var shrink = function (file) {
    return new Promise(function (resolve) {
      if (!/^image\//.test(file.type) || !window.createImageBitmap) { resolve(file); return; }
      createImageBitmap(file).then(function (bmp) {
        var sc = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
        var c = document.createElement('canvas'); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
        c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
        c.toBlob(function (b) { resolve(b ? new File([b], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : file); }, 'image/jpeg', 0.8);
      }).catch(function () { resolve(file); });
    });
  };
  var setNote = function (form) {
    var sel = form.querySelector('select[name=service_needed]'), note = form.querySelector('.field-note');
    if (!sel || !note) return;
    var opt = sel.options[sel.selectedIndex], txt = opt ? opt.getAttribute('data-note') : '';
    note.textContent = txt || ''; note.hidden = !txt;
  };
  var validate = function (form) {
    var el = form.elements, errs = [];
    var phone = el.phone.value.trim(), email = el.email.value.trim();
    if (!el.full_name.value.trim()) errs.push([el.full_name, 'Please enter your name.']);
    if (!phone && !email) errs.push([el.phone, 'Please give us a phone number or an email address.']);
    if (phone && phone.replace(/\D/g, '').length < 8) errs.push([el.phone, 'Please check the phone number.']);
    if (email && !el.email.checkValidity()) errs.push([el.email, 'Please check the email address.']);
    if (!el.suburb.value.trim()) errs.push([el.suburb, 'Please enter your suburb.']);
    if (!el.service_needed.value) errs.push([el.service_needed, 'Please choose a service.']);
    return errs;
  };
  document.querySelectorAll('form[data-quote-form]').forEach(function (form) {
    var box = form.querySelector('.form-error');
    var btn = form.querySelector('button[type=submit]');
    var photos = form.querySelector('[data-photos]');
    var list = form.querySelector('.photo-list');
    setNote(form);
    form.addEventListener('change', function (e) { if (e.target.name === 'service_needed') setNote(form); });
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); if (e.target.hasAttribute('data-contact')) form.querySelectorAll('[data-contact]').forEach(function (i) { i.closest('.field').classList.remove('invalid'); }); });
    if (photos && list) photos.addEventListener('change', function () {
      var n = photos.files.length;
      list.textContent = n ? (n > MAX_PHOTOS ? n + ' photos chosen. The first ' + MAX_PHOTOS + ' will be sent.' : n + (n === 1 ? ' photo' : ' photos') + ' ready to send.') : '';
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('.field.invalid').forEach(function (f) { f.classList.remove('invalid'); });
      var errs = validate(form);
      if (errs.length) {
        errs.forEach(function (x) { var f = x[0].closest('.field'); if (f) f.classList.add('invalid'); });
        box.textContent = errs.map(function (x) { return x[1]; }).join(' '); box.hidden = false; errs[0][0].focus(); return;
      }
      box.hidden = true;
      var label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…';
      var fd = new FormData(form); fd.set('page_url', location.href); fd.delete('photos');
      var files = photos ? Array.prototype.slice.call(photos.files).filter(function (f) { return /^image\//.test(f.type); }).slice(0, MAX_PHOTOS) : [];
      if (files.length) btn.textContent = 'Preparing photos…';
      Promise.all(files.map(shrink)).then(function (small) {
        small.forEach(function (f) { fd.append('photos', f, f.name); });
        btn.textContent = 'Sending…';
        return fetch(form.getAttribute('data-endpoint') || '/api/quote', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.ok === false) throw new Error(j.error || 'HTTP ' + r.status); return j; });
      }).then(function () {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'quote_form_submit', form_id: form.id || 'quote', service_needed: fd.get('service_needed') || '' });
          sessionStorage.setItem('itm_quote', JSON.stringify({ name: fd.get('full_name') || '', service: fd.get('service_needed') || '' }));
        } catch (err) { /* non-fatal */ }
        window.location.href = form.getAttribute('data-redirect') || '/thank-you';
      }).catch(function () {
        btn.disabled = false; btn.textContent = label;
        var tel = form.querySelector('.phone-line a');
        box.innerHTML = 'Sorry, your request did not send. Please call <a href="' + (tel ? tel.getAttribute('href') : 'tel:+61424058261') + '">' + (tel ? tel.textContent : '0424 058 261') + '</a> or email <a href="mailto:enquiries@inthemowlawncare.com.au">enquiries@inthemowlawncare.com.au</a>.';
        box.hidden = false;
      });
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

/* ---------- Quote modal: any [data-quote-open] opens the compact form; href stays as the no-JS fallback ----------
   The button (or the page's <main data-page-service>) decides which service is preselected and how the form is titled. */
(function () {
  var modal = document.getElementById('quote-modal'); if (!modal) return;
  var form = modal.querySelector('form'), title = form.querySelector('h2'), submit = form.querySelector('button[type=submit]'), sel = form.querySelector('select[name=service_needed]');
  var page = document.querySelector('main[data-page-service]');
  var lastFocus = null;
  var open = function (e) {
    e.preventDefault(); lastFocus = document.activeElement;
    var t = e.currentTarget;
    var svc = t.getAttribute('data-service') || (page && page.getAttribute('data-page-service')) || '';
    title.textContent = t.getAttribute('data-quote-title') || (page && page.getAttribute('data-page-title')) || title.getAttribute('data-default');
    submit.textContent = t.getAttribute('data-quote-submit') || (page && page.getAttribute('data-page-submit')) || submit.getAttribute('data-default');
    if (svc && Array.prototype.some.call(sel.options, function (o) { return o.value === svc; })) { sel.value = svc; }
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    var err = form.querySelector('.form-error'); if (err) err.hidden = true;
    modal.hidden = false; document.body.classList.add('modal-open');
    document.querySelectorAll('.mobile-menu[data-open]').forEach(function (m) { m.removeAttribute('data-open'); });
    var first = modal.querySelector('input'); if (first) setTimeout(function () { first.focus(); }, 50);
    if (window.dataLayer) window.dataLayer.push({ event: 'quote_modal_open', service_needed: svc });
  };
  var close = function () { modal.hidden = true; document.body.classList.remove('modal-open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); };
  document.querySelectorAll('[data-quote-open]').forEach(function (a) { a.addEventListener('click', open); });
  modal.querySelectorAll('[data-quote-close]').forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
})();
