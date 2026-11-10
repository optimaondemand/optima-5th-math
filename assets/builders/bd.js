/* OAO Grade 5 Math · Master Builders layer engine (bd-) · draft v0.1 (Nov 2026)
   - hero dust, museum lightbox
   - builder's window: camera moves across real public-domain art, hotspots, close-up cards, measure tags,
     a saved prediction, written "Your job" + go button
   - surveyor's zoom: a number line from one meter down to thousandths, ten equal parts at every level
   - thousandths block: one hundredth opens into ten thousandths
   - build site: the unit's building, stage by stage (shared drawing for the reel)
   Saving: localStorage (this device). */
(function () {
  'use strict';
  var CFG = window.BD_CFG || {}, KEY = CFG.key || 'g5bd-5-09-01';
  var ST = {}; try { ST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function NS(t, a, p) { var e = document.createElementNS('http://www.w3.org/2000/svg', t); for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } if (p) p.appendChild(e); return e; }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function tween(ms, fn, done) { if (reduced) { fn(1); done && done(); return; } var t0 = performance.now(); (function f(now) { var t = Math.min(1, (now - t0) / ms); fn(ease(t)); if (t < 1) requestAnimationFrame(f); else done && done(); })(t0); }

  /* ── Hemiunu (an illustration; no public-domain portrait of him exists) ── */
  var HEMI = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of Hemiunu">' +
    '<rect width="100" height="100" fill="#e9cf96"/><circle cx="50" cy="50" r="46" fill="#f3dfae"/>' +
    '<path d="M18 100c2-20 14-30 32-31s30 11 32 31z" fill="#f7f2e6"/>' +          // linen
    '<path d="M24 92c4-12 14-18 26-18s22 6 26 18" fill="none" stroke="#1f3f8f" stroke-width="5"/>' +   // collar bands
    '<path d="M27 97c4-10 12-15 23-15s19 5 23 15" fill="none" stroke="#c9a35a" stroke-width="4"/>' +
    '<path d="M30 101c3-7 10-11 20-11s17 4 20 11" fill="none" stroke="#2e7d6b" stroke-width="4"/>' +
    '<path d="M42 60h17v14H42z" fill="#a8562f"/>' +                                 // neck
    '<path d="M36 40c0-14 8-22 19-22 9 0 15 6 16 15l4 6-4 2c1 9-3 18-11 21-6 2-12 0-16-4-5-4-8-11-8-18z" fill="#b5653a"/>' + // face (profile right)
    '<path d="M33 46c-3-19 7-31 22-31 11 0 18 6 20 14-8-4-17-4-26 0l-6 22c-4-1-8-2-10-5z" fill="#1d1a16"/>' + // short wig
    '<ellipse cx="63" cy="37" rx="3.4" ry="2" fill="#fff"/><circle cx="64" cy="37" r="1.5" fill="#1d1a16"/>' +
    '<path d="M58 33q5-3 10 0" stroke="#1d1a16" stroke-width="1.6" fill="none"/><path d="M66 37h7" stroke="#1d1a16" stroke-width="1.3"/>' +
    '<path d="M64 52q4 2 7 0" stroke="#6d2f17" stroke-width="1.6" fill="none"/>' +
    '<circle cx="46" cy="44" r="4" fill="#a8562f"/>' +
    '<rect x="76" y="46" width="5" height="54" rx="2" fill="#7a5a2a"/><rect x="74.5" y="52" width="8" height="3" fill="#c9a35a"/><rect x="74.5" y="62" width="8" height="3" fill="#c9a35a"/><rect x="74.5" y="72" width="8" height="3" fill="#c9a35a"/>' + // cubit rod
    '</svg>';

  function IMGS() { return window.BD_IMG || {}; }
  function face(alt) { var I = IMGS(); return I.face ? '<img src="' + I.face + '" alt="' + (alt || '') + '" style="width:100%;height:100%;object-fit:cover;object-position:50% 12%">' : HEMI; }
  /* ── hero dust + stones ─────────────────────────── */
  function heroDust() {
    var c = $('.bd-hero .dust'); if (!c || reduced) return;
    var cv = el('canvas'); cv.style.width = '100%'; cv.style.height = '100%'; c.appendChild(cv);
    var g = cv.getContext('2d'), P = [], W, H;
    function rs() { W = cv.width = c.clientWidth; H = cv.height = c.clientHeight; } rs(); addEventListener('resize', rs);
    for (var i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, v: Math.random() * .00035 + .0001, a: Math.random() * .5 + .2 });
    var on = true; document.addEventListener('visibilitychange', function () { on = !document.hidden; if (on) requestAnimationFrame(f); });
    function f() { if (!on) return; g.clearRect(0, 0, W, H); P.forEach(function (p) { p.x += p.v; p.y += Math.sin(p.x * 30) * .0004; if (p.x > 1) p.x = 0; g.fillStyle = 'rgba(255,226,170,' + p.a + ')'; g.beginPath(); g.arc(p.x * W, p.y * H, p.r, 0, 6.3); g.fill(); }); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }

  /* ── lightbox for museum art ─────────────────────── */
  function lightbox() {
    var lb = el('div', 'bd-lightbox', '<div><img alt=""><p></p></div>'); document.body.appendChild(lb);
    lb.addEventListener('click', function () { lb.classList.remove('on'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
    $$('[data-zoom]').forEach(function (im) {
      im.tabIndex = 0;
      function open() { $('img', lb).src = im.src; $('img', lb).alt = im.alt; $('p', lb).textContent = im.getAttribute('data-zoom'); lb.classList.add('on'); }
      im.addEventListener('click', open); im.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
  }

  /* ═══ the build site: shared drawing ═════════════════════
     stage 0 empty · 1 staked · 2–9 rising · 10 finished.  Pyramid in two-face view. */
  var STAGES = [
    ['Day 0', 'Empty plateau'], ['5.09.01', 'Base staked'], ['5.09.02', 'First layer'], ['5.09.03', 'Lower layers'], ['5.09.04', 'Passages framed'],
    ['Check', 'Halfway up'], ['5.09.05', 'Upper layers'], ['5.09.06', 'White casing'], ['5.09.07', 'Casing polished'], ['5.09.08', 'Capstone'], ['Finale', 'Finished']];
  var HGT = [0, 0, .08, .2, .33, .5, .7, .84, .93, 1, 1], CAS = [0, 0, 0, 0, 0, 0, 0, .3, .8, .97, 1];
  var Lp = [300, 372], Rp = [640, 392], Bp = [770, 334], Kp = [430, 318], Ap = [535, 96];
  function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }
  function pts(a) { return a.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function drawSite(svg, stage, o) {
    o = o || {}; svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 1000 440');
    var defs = NS('defs', {}, svg);
    var sky = NS('linearGradient', { id: o.id + 'sky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    var dawn = stage >= 10;
    [[0, dawn ? '#3b4f9c' : '#5b79c4'], [.55, dawn ? '#f2a35e' : '#cfe0f5'], [1, dawn ? '#ffd9a0' : '#f4ead2']].forEach(function (s) { NS('stop', { offset: s[0], 'stop-color': s[1] }, sky); });
    var sand = NS('linearGradient', { id: o.id + 'sand', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    NS('stop', { offset: 0, 'stop-color': '#e6c88e' }, sand); NS('stop', { offset: 1, 'stop-color': '#c9a066' }, sand);
    NS('rect', { width: 1000, height: 440, fill: 'url(#' + o.id + 'sky)' }, svg);
    NS('circle', { cx: dawn ? 150 : 820, cy: dawn ? 250 : 80, r: dawn ? 46 : 30, fill: dawn ? '#ffe7a8' : '#fff6d8', opacity: .95 }, svg);
    // Nile strip + palms far away
    NS('path', { d: 'M0 262 C200 252 420 270 1000 256 L1000 272 L0 278Z', fill: '#7fa7a0', opacity: .8 }, svg);
    for (var i = 0; i < 14; i++) { var x = 30 + i * 72 + (i % 3) * 9; NS('path', { d: 'M' + x + ' 262 v-16 m0 0 l-8 4 m8 -4 l8 4 m-8 -4 l-5 -5 m5 5 l5 -5', stroke: '#3f6b4b', 'stroke-width': 2, fill: 'none', opacity: .8 }, svg); }
    NS('path', { d: 'M0 276 C250 262 600 290 1000 268 L1000 440 L0 440Z', fill: 'url(#' + o.id + 'sand)' }, svg);
    var g = NS('g', { class: 'pyr' }, svg);
    var h = HGT[stage], cas = CAS[stage];
    if (stage >= 1) {
      // leveled base pad
      NS('polygon', { points: pts([lerp(Lp, Kp, -.06).map(function (v, i) { return v + (i ? 8 : -14); }), [Rp[0] + 6, Rp[1] + 12], [Bp[0] + 18, Bp[1] + 2], [Kp[0], Kp[1] - 6]]), fill: '#ead6a8', opacity: .9 }, g);
    }
    function face(a, b, t0, t1, col) { return NS('polygon', { points: pts([lerp(a, Ap, t0), lerp(b, Ap, t0), lerp(b, Ap, t1), lerp(a, Ap, t1)]), fill: col }, g); }
    if (h > 0) {
      var top = Math.min(h, .965);
      face(Lp, Rp, 0, top, '#d8b06d'); face(Rp, Bp, 0, top, '#b48a4f');
      // casing from the bottom up
      if (cas > 0) { var c1 = Math.min(cas, top); face(Lp, Rp, 0, c1, '#f2ecdc'); face(Rp, Bp, 0, c1, '#d6cdb6'); }
      // course lines
      var n = Math.round(top * 34);
      for (var k = 1; k <= n; k++) { var t = k / 34; if (t > top) break; var lc = t <= cas ? 'rgba(160,150,120,.25)' : 'rgba(110,75,30,.45)';
        NS('polyline', { points: pts([lerp(Lp, Ap, t), lerp(Rp, Ap, t), lerp(Bp, Ap, t)]), fill: 'none', stroke: lc, 'stroke-width': 1.2 }, g); }
      if (top < .96) NS('polygon', { points: pts([lerp(Lp, Ap, top), lerp(Rp, Ap, top), lerp(Bp, Ap, top), lerp(Kp, Ap, top)]), fill: '#ecd29c', stroke: 'rgba(110,75,30,.5)' }, g);
      if (stage >= 4 && cas < .8) NS('rect', { x: 476, y: 300, width: 14, height: 18, fill: '#3a2a12', transform: 'skewY(3)' }, g);
      if (stage >= 9) { NS('polygon', { points: pts([lerp(Lp, Ap, .965), lerp(Rp, Ap, .965), Ap]), fill: '#e8b923' }, g); NS('polygon', { points: pts([lerp(Rp, Ap, .965), lerp(Bp, Ap, .965), Ap]), fill: '#b8860b' }, g); }
      if (stage >= 10) { var rg = NS('radialGradient', { id: o.id + 'gl' }, defs); NS('stop', { offset: 0, 'stop-color': '#fff6c8', 'stop-opacity': .95 }, rg); NS('stop', { offset: 1, 'stop-color': '#fff6c8', 'stop-opacity': 0 }, rg); NS('circle', { cx: Ap[0], cy: Ap[1] + 6, r: 40, fill: 'url(#' + o.id + 'gl)', class: 'glint' }, g); }
      if (stage >= 10) NS('polygon', { points: pts([Rp, Bp, [Bp[0] + 120, Bp[1] + 70], [Rp[0] + 60, Rp[1] + 30]]), fill: 'rgba(90,60,30,.16)' }, g);
    }
    if (stage === 1 || o.stakes) {
      var cords = NS('polygon', { points: pts([Lp, Rp, Bp, Kp]), fill: 'none', stroke: '#6b3d12', 'stroke-width': 2.4, class: 'cord' }, g);
      if (!o.static) { var L = 1500; cords.setAttribute('stroke-dasharray', L); cords.setAttribute('stroke-dashoffset', o.drawCords ? 0 : L); }
      NS('polygon', { points: pts([Lp, Rp, Ap]), fill: 'none', stroke: '#fff', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: .55, class: 'ghost' }, g);
      NS('polyline', { points: pts([Rp, Bp, Ap]), fill: 'none', stroke: '#fff', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: .45, class: 'ghost' }, g);
      [Lp, Rp, Bp, Kp].forEach(function (p, i) {
        var s = NS('g', { class: 'stake', 'data-i': i, transform: 'translate(' + p[0] + ',' + p[1] + ')' }, g);
        NS('circle', { cx: 6, cy: -14, r: 24, fill: 'transparent' }, s); NS('rect', { x: -3, y: -30, width: 6, height: 32, fill: '#7a4b1b' }, s); NS('path', { d: 'M3 -30 l16 6 -16 6z', fill: '#c0392b' }, s);
      });
    }
    // little workers for a human scale (not on thumbnails)
    if (!o.thumb && stage >= 2 && stage < 10) for (var w = 0; w < 6; w++) { var q = lerp(Lp, Rp, .15 + w * .14); NS('g', { transform: 'translate(' + (q[0] + 4) + ',' + (q[1] + 22) + ')' }, svg).innerHTML = '<circle r="3" cy="-14" fill="#5a3418"/><path d="M0 -11 v8 m0 0 l-3 7 m3 -7 l3 7 m-6 -12 h6" stroke="#5a3418" stroke-width="2"/>'; }
    return svg;
  }

  function site() {
    var host = $('#bd-site'); if (!host) return;
    var DAY = CFG.day || 1;
    if (DAY > 1) return siteDay(host, DAY);
    var svg = NS('svg', { role: 'img', 'aria-label': 'The building site of the Great Pyramid' }, $('.svgbox', host));
    var done = ST.stakes || [];
    drawSite(svg, 1, { id: 'main', drawCords: done.length === 4 });
    var lab = $('.lab', host), btn = $('#bd-reveal'), msg = $('#bd-site-msg');
    function mark() {
      $$('.stake', svg).forEach(function (s) { var i = +s.getAttribute('data-i'); s.style.cursor = 'pointer'; s.setAttribute('tabindex', 0); s.setAttribute('role', 'button'); s.setAttribute('aria-label', 'Drive corner stake ' + (i + 1));
        s.style.opacity = done.indexOf(i) >= 0 ? 1 : .35; });
      msg.textContent = done.length < 4 ? 'Tap each corner flag to drive its stake (' + done.length + ' of 4).' : 'All four corners are set. The cords pull the square tight.';
    }
    function drive(i) {
      if (done.indexOf(i) >= 0) return; done.push(i); ST.stakes = done; save();
      var s = $('.stake[data-i="' + i + '"]', svg), tr = s.getAttribute('transform');
      tween(380, function (t) { s.setAttribute('transform', tr + ' translate(0,' + (-24 * (1 - t)) + ')'); });
      mark();
      if (done.length === 4) { var c = $('.cord', svg); tween(1600, function (t) { c.setAttribute('stroke-dashoffset', 1500 * (1 - t)); }, function () { lab.classList.add('done'); $('#bd-day').textContent = 'Day 1 done: the base is staked.'; }); }
    }
    svg.addEventListener('click', function (e) { var s = e.target.closest('.stake'); if (s) drive(+s.getAttribute('data-i')); });
    svg.addEventListener('keydown', function (e) { var s = e.target.closest('.stake'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); drive(+s.getAttribute('data-i')); } });
    mark();
    // the unit reel
    var reel = $('.bd-reel', host);
    for (var k = 1; k <= 10; k++) {
      var f = el('figure', k === 1 ? 'now' : (k > 1 ? 'lock' : '')); var sv = NS('svg', { 'aria-hidden': 'true' }, f);
      drawSite(sv, k, { id: 'r' + k, thumb: true, static: true, drawCords: true });
      f.appendChild(el('figcaption', '', STAGES[k][0] + '<br>' + STAGES[k][1])); reel.appendChild(f);
    }
    btn && btn.addEventListener('click', function () { var on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', on); btn.textContent = on ? 'Back to today' : 'Peek at the finished pyramid'; drawSite(svg, on ? 10 : 1, { id: 'main', drawCords: done.length === 4 }); lab.querySelector('b').textContent = on ? 'The last day of Unit 9' : 'Day 1 of 10'; mark(); });
  }

  /* day 2+: tap the ghost blocks to finish today's stage */
  function siteDay(host, DAY) {
    var svg = NS('svg', { role: 'img', 'aria-label': 'The building site of the Great Pyramid, day ' + DAY }, $('.svgbox', host));
    var N = 4, done = ST.blocks || [], lab = $('.lab', host), btn = $('#bd-reveal'), msg = $('#bd-site-msg'), D = CFG.site || {};
    function ghosts() {
      $$('.gblk', svg).forEach(function (n) { n.remove(); });
      if (done.length >= N) return;
      for (var i = 0; i < N; i++) { var q = lerp(Lp, Rp, .14 + i * .22), on = done.indexOf(i) >= 0;
        var gb = NS('g', { class: 'gblk', 'data-i': i, transform: 'translate(' + q[0] + ',' + (q[1] - 6) + ')', tabindex: 0, role: 'button', 'aria-label': 'Set block ' + (i + 1), style: 'cursor:pointer' }, svg);
        NS('rect', { x: -26, y: -26, width: 52, height: 26, rx: 2, fill: on ? '#d8b06d' : 'rgba(255,255,255,.55)', stroke: on ? '#8a6417' : '#fff', 'stroke-width': 2, 'stroke-dasharray': on ? '' : '5 4' }, gb);
        if (!on) NS('text', { x: 0, y: -8, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#6b4700', text: 'tap' }, gb); }
    }
    function draw() {
      drawSite(svg, done.length >= N ? DAY : DAY - 1, { id: 'main', drawCords: true, static: true }); ghosts();
      msg.textContent = done.length < N ? (D.todo || 'Tap each block to set it') + ' (' + done.length + ' of ' + N + ').' : (D.doneMsg || 'Done for today.');
      if (done.length >= N) { lab.classList.add('done'); $('#bd-day').textContent = D.doneLab || ('Day ' + DAY + ' done.'); }
    }
    function set(i) { if (done.indexOf(i) >= 0) return; done.push(i); ST.blocks = done; save(); draw(); if (done.length >= N) document.dispatchEvent(new CustomEvent('bd-done')); }
    svg.addEventListener('click', function (e) { var g = e.target.closest('.gblk'); if (g) set(+g.getAttribute('data-i')); });
    svg.addEventListener('keydown', function (e) { var g = e.target.closest('.gblk'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set(+g.getAttribute('data-i')); } });
    draw();
    var reel = $('.bd-reel', host);
    for (var k = 1; k <= 10; k++) { var f = el('figure', k === DAY ? 'now' : (k > DAY ? 'lock' : '')); var sv = NS('svg', { 'aria-hidden': 'true' }, f);
      drawSite(sv, k, { id: 'r' + k, thumb: true, static: true, drawCords: true }); f.appendChild(el('figcaption', '', STAGES[k][0] + '<br>' + STAGES[k][1])); reel.appendChild(f); }
    btn && btn.addEventListener('click', function () { var on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', on); btn.textContent = on ? 'Back to today' : 'Peek at the finished pyramid';
      if (on) { drawSite(svg, 10, { id: 'main', static: true }); } else draw(); lab.querySelector('b').textContent = on ? 'The last day of Unit 9' : 'Day ' + DAY + ' of 10'; });
  }

  /* ═══ the builder's window ═══════════════════════════════ */
  function Win(host, cfg) {
    var i = -1, typing = null, lines = cfg.lines, picked = ST[cfg.id + '-predict'];
    host.innerHTML =
      '<div class="top"><span class="ttl">' + cfg.title + '</span><span class="tr"><button type="button" class="snd" aria-pressed="true">🔊 Voice on</button> ' + cfg.tag + '</span></div>' +
      '<div class="bd-cam">' + cfg.scenes.map(function (s, k) { return '<div class="layer' + (k ? ' off' : '') + '" data-scene="' + s.id + '"><div class="pic" style="background-image:url(' + s.img + ')"></div>' + (s.svg || '') + '<div class="vignette"></div>' + (s.cap ? '<div class="cap">' + s.cap + '</div>' : '') + '</div>'; }).join('') +
      (IMGS().walk || IMGS().full ? '<img class="bd-walk" src="' + (IMGS().walk || IMGS().full) + '" alt="">' : '') +
      '<div class="bd-close" role="dialog" aria-modal="false"><div class="im"></div><div class="tx"></div><button class="x" type="button">Close ✕</button></div>' +
      '<div class="bd-play"><button type="button">▶ Step into the window</button></div></div>' +
      '<div class="bd-talk"><div class="bd-face">' + face('Hemiunu') + '</div><div class="bd-say" aria-live="polite"><div class="who">Hemiunu · master builder</div><div class="line"></div><div class="extra"></div>' +
      '<div class="bd-ctrls"><button class="bd-btn ghost back" type="button">◀ Back</button><button class="bd-btn next" type="button">Next ▶</button><span class="bd-count"></span></div></div></div>';
    var snd = new Audio(), sndOn = ST.voice !== false;
    var cam = $('.bd-cam', host), close = $('.bd-close', host), line = $('.line', host), extra = $('.extra', host), next = $('.next', host), back = $('.back', host), count = $('.bd-count', host);
    function scene(id) { $$('.layer', cam).forEach(function (l) { l.classList.toggle('off', l.getAttribute('data-scene') !== id); }); return $('.layer[data-scene="' + id + '"]', cam); }
    function place(layer, v, u, w) {
      var sc = cfg.scenes.filter(function (s) { return s.id === layer.getAttribute('data-scene'); })[0], C = cam.clientWidth / cam.clientHeight, ar = sc.ar || C;
      var x = u, y = w; if (ar < C) { var hI = C / ar; y = w * hI - (hI - 1) / 2; } else { var wI = ar / C; x = u * wI - (wI - 1) / 2; }
      v = v || [0, 0, 1]; return [(x - v[0]) * v[2] * 100, (y - v[1]) * v[2] * 100];
    }
    function camTo(layer, v) { var p = $('.pic', layer); v = v || [0, 0, 1]; p.style.transform = 'scale(' + v[2] + ') translate(' + (-v[0] * 100) + '%,' + (-v[1] * 100) + '%)'; }
    function clear() { $$('.bd-hot,.bd-mtag', cam).forEach(function (n) { n.remove(); }); close.classList.remove('on'); }
    function type(txt, cb, ms) {
      clearInterval(typing); line.innerHTML = ''; var k = 0, step = ms ? Math.max(12, ms * .85 / (txt.length / 2)) : 18;
      if (reduced) { line.textContent = txt; cb && cb(); return; }
      typing = setInterval(function () { k += 2; line.innerHTML = txt.slice(0, k) + '<span class="caret"></span>'; if (k >= txt.length) { clearInterval(typing); line.textContent = txt; cb && cb(); } }, step);
    }
    function speak(L, cb) {
      snd.pause(); var src = L.audio && (window.BD_AUDIO && BD_AUDIO[L.audio] || L.audio);
      if (!src || !sndOn) { type(L.say, cb); return; }
      snd.src = src; var started = false;
      snd.onloadedmetadata = function () { if (started) return; started = true; type(L.say, cb, snd.duration * 1000); };
      snd.play().catch(function () { if (!started) { started = true; type(L.say, cb); } });
      setTimeout(function () { if (!started) { started = true; type(L.say, cb); } }, 900);
    }
    var sb = $('.snd', host); function sndUI() { sb.setAttribute('aria-pressed', sndOn); sb.textContent = sndOn ? '🔊 Voice on' : '🔇 Voice off'; }
    sb.addEventListener('click', function () { sndOn = !sndOn; ST.voice = sndOn; save(); sndUI(); if (!sndOn) snd.pause(); }); sndUI();
    function showClose(c) {
      $('.im', close).style.backgroundImage = 'url(' + c.img + ')'; $('.im', close).style.backgroundSize = c.fit || 'contain'; $('.im', close).style.backgroundPosition = c.pos || 'center';
      $('.tx', close).innerHTML = '<h4>' + c.title + '</h4><p>' + c.text + '</p>' + (c.credit ? '<small>' + c.credit + '</small>' : '');
      close.classList.add('on'); $('.x', close).focus();
    }
    $('.x', close).addEventListener('click', function () { close.classList.remove('on'); var h = $('.bd-hot:not(.done)', cam) || $('.bd-hot', cam); gate(); });
    function gate() { var L = lines[i]; if (!L) return; var need = (L.hot || []).filter(function (h) { return !h.done; }).length; var needPick = L.choice && !picked; next.disabled = !!(need || needPick); count.textContent = need ? 'Tap the glowing ring' + (need > 1 ? 's' : '') + ' (' + need + ' left)' : (i + 1) + ' of ' + lines.length; }
    function go(n) {
      if (n < 0 || n >= lines.length) return; i = n; var L = lines[i]; clear(); extra.innerHTML = '';
      var layer = scene(L.scene); camTo(layer, L.cam);
      back.disabled = i === 0;
      next.textContent = i === lines.length - 1 ? 'Close window ✓' : 'Next ▶';
      (L.tags || []).forEach(function (t) { var m = el('div', 'bd-mtag', t.text); var pp = place(layer, L.cam, t.x, t.y); m.style.left = pp[0] + '%'; m.style.top = pp[1] + '%'; layer.appendChild(m); setTimeout(function () { m.classList.add('on'); }, 900); });
      (L.hot || []).forEach(function (h) {
        var b = el('button', 'bd-hot' + (h.done ? ' done' : ''), '<span class="lbl">' + h.label + '</span>'); b.type = 'button'; b.setAttribute('aria-label', h.label);
        var pp = place(layer, L.cam, h.x, h.y); b.style.left = pp[0] + '%'; b.style.top = pp[1] + '%'; layer.appendChild(b);
        b.addEventListener('click', function () { h.done = true; b.classList.add('done'); showClose(h.close); gate(); });
      });
      speak(L, function () {
        if (L.choice) {
          var box = el('div', 'bd-choices'); box.setAttribute('role', 'group'); box.setAttribute('aria-label', L.choice.prompt);
          L.choice.opts.forEach(function (o) { var b = el('button', 'bd-choice' + (picked === o.id ? ' picked' : ''), o.text); b.type = 'button';
            b.addEventListener('click', function () { picked = o.id; ST[cfg.id + '-predict'] = o.id; save(); $$('.bd-choice', box).forEach(function (x) { x.classList.remove('picked'); }); b.classList.add('picked'); gate(); document.dispatchEvent(new CustomEvent('bd-predict')); });
            box.appendChild(b); });
          extra.appendChild(box);
        }
        if (L.task) { extra.appendChild(el('div', 'bd-your', '<b class="k">Your job</b>' + L.task.text + '<div style="margin-top:8px"><a class="bd-btn gold" href="' + L.task.go + '" style="text-decoration:none;display:inline-block">' + L.task.label + ' ↓</a></div>')); }
      });
      gate();
    }
    next.addEventListener('click', function () { if (i === lines.length - 1) { host.classList.add('finished'); document.body.classList.remove('bd-inwin'); var w = $('.bd-walk', host); if (w) w.classList.remove('in'); count.textContent = 'Window finished. You can replay it any time.'; return; } go(i + 1); });
    back.addEventListener('click', function () { go(i - 1); });
    $('.bd-play button', host).addEventListener('click', function () { $('.bd-play', host).remove(); host.classList.add('live'); document.body.classList.add('bd-inwin'); var w = $('.bd-walk', host); if (w) w.classList.add('in'); go(0); next.focus(); });
    // the guide is in the window only while it plays and is on screen; otherwise he goes back to his scaffold
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (!host.classList.contains('live')) return; document.body.classList.toggle('bd-inwin', es[0].isIntersecting && !host.classList.contains('finished')); var w = $('.bd-walk', host); if (w) w.classList.toggle('in', es[0].isIntersecting && !host.classList.contains('finished')); }, { threshold: .35 }).observe(host);
    // thumbnail before play: first scene, wide
    camTo($('.layer', cam), cfg.lines[0].cam);
    line.textContent = cfg.teaser; back.disabled = true; next.disabled = true;
  }

  /* ═══ the surveyor's zoom (number line, ten equal parts at every level) ═══
     All math in whole thousandths of a meter (millimeters) so nothing rounds.  */
  var PLACE = [{ k: 't', name: 'tenth', each: '0.1', col: '#8a5a00', fill: ['#f7ebc9', '#efdca8'], unit: 'decimeter' }, { k: 'h', name: 'hundredth', each: '0.01', col: '#1e7a4c', fill: ['#d7efe2', '#bfe4cf'], unit: 'centimeter' }, { k: 'th', name: 'thousandth', each: '0.001', col: '#b0336a', fill: ['#fbe3ec', '#f5cddd'], unit: 'millimeter' }];
  function fmt(mm, places) { var w = Math.floor(mm / 1000), f = String(mm % 1000).padStart(3, '0'); return places ? w + '.' + f.slice(0, places) : String(w); }
  function Zoom(host, cfg) {
    if (!host) return;
    var T = cfg.target, lvl = 0, a = Math.floor(T / 1000) * 1000, kf = -1, hintN = 0, busy = false;
    var saved = ST[cfg.id]; if (saved && saved.done) { lvl = 3; }
    host.innerHTML =
      '<div class="bd-zhead"><div class="bd-crumbs" aria-hidden="true"><span data-l="0">1 meter</span><i>→</i><span data-l="1">1 tenth</span><i>→</i><span data-l="2">1 hundredth</span><i>→</i><span data-l="3">found it</span></div>' +
      '<div><button class="bd-btn ghost out" type="button">🔍− Zoom out</button> <button class="bd-btn ghost reset" type="button">Start over</button></div></div>' +
      '<svg class="bd-zsvg" viewBox="0 0 1000 330" tabindex="0" role="application" aria-label="' + cfg.aria + '"></svg>' +
      '<div class="bd-readout"><div class="bd-num" aria-live="polite"></div><div class="bd-pv"><div>whole meters<div class="v o"></div></div><div>tenths<div class="v t"></div></div><div>hundredths<div class="v h"></div></div><div>thousandths<div class="v th"></div></div></div></div>' +
      '<div class="bd-fb" role="status"></div>' +
      '<div class="bd-help"><button type="button" class="hint">💡 Hint</button></div><div class="bd-hint"></div>' +
      '<div class="bd-size"></div>';
    var svg = $('svg', host), fb = $('.bd-fb', host), num = $('.bd-num', host), hint = $('.bd-hint', host), size = $('.bd-size', host);
    var X0 = 60, X1 = 940, W = X1 - X0, VW = 1000, FS = 1, nar = false;
    function layout() { nar = host.clientWidth < 560; VW = nar ? 560 : 1000; FS = nar ? 1.25 : 1; X0 = nar ? 46 : 60; X1 = VW - X0; W = X1 - X0; svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + (nar ? 360 : 330)); }
    addEventListener('resize', function () { var o = nar; layout(); if (o !== nar) draw(); });
    function span() { return [1000, 100, 10][Math.min(lvl, 2)]; }
    function xOf(mm) { return X0 + (mm - a) / span() * W; }
    function readout() {
      var w = fmt(T, 0), f = String(T % 1000).padStart(3, '0'), cls = ['t', 'h', 'th'];
      num.innerHTML = '<span class="d o">' + w + '</span>.' + [0, 1, 2].map(function (k) { return k < lvl ? '<span class="d ' + cls[k] + '">' + f[k] + '</span>' : '<span class="d blank">_</span>'; }).join('') + '<span class="u">m</span>';
      var last = $$('.d', num)[lvl]; if (last && lvl > 0) { last.classList.add('pop'); }
      $('.v.o', host).textContent = w; ['t', 'h', 'th'].forEach(function (c, k) { $('.v.' + c, host).textContent = k < lvl ? f[k] : ''; });
      $$('.bd-crumbs span', host).forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-l') === lvl); });
    }
    function draw(fadeIn) {
      layout(); svg.innerHTML = ''; var MID = VW / 2; var sp = span(), P = PLACE[Math.min(lvl, 2)], g = NS('g', { class: 'z' }, svg);
      var unit = ['1 meter', '1 tenth of a meter', '1 hundredth of a meter'][Math.min(lvl, 2)];
      NS('text', { x: MID, y: 34, 'text-anchor': 'middle', 'font-size': 22 * FS, 'font-weight': 800, fill: '#3a2700', text: 'This whole rod is ' + unit + '.' }, g);
      if (nar) { NS('text', { x: MID, y: 62, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 700, fill: P.col, text: '10 equal parts. Each part is' }, g); NS('text', { x: MID, y: 84, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: P.col, text: '1 ' + P.name + ' (' + P.each + ' m) = 1 ' + P.unit + '.' }, g); }
      else NS('text', { x: MID, y: 62, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 700, fill: P.col, text: '10 equal parts. Each part is 1 ' + P.name + ' (' + P.each + ' m), 1 ' + P.unit + '.' }, g);
      var oy = nar ? 22 : 0; g = NS('g', { transform: 'translate(0,' + oy + ')' }, g);
      // brace
      NS('path', { d: 'M' + X0 + ' 92 q0 -10 10 -10 H' + (MID - 10) + ' q10 0 10 -10 q0 10 10 10 H' + (X1 - 10) + ' q10 0 10 10', fill: 'none', stroke: '#8a6417', 'stroke-width': 2 }, g);
      for (var s = 0; s < 10; s++) {
        var r = NS('rect', { x: X0 + s * W / 10, y: 110, width: W / 10, height: 56, fill: P.fill[s % 2], stroke: '#8a6417', 'stroke-width': 1.5, class: 'seg' + (s === kf ? ' kfoc' : ''), 'data-s': s }, g);
        if (lvl === 2) r.setAttribute('class', 'seg2');
      }
      for (var t = 0; t <= 10; t++) {
        var x = X0 + t * W / 10, big = t === 0 || t === 10;
        NS('line', { x1: x, y1: 104, x2: x, y2: 180, stroke: '#3a2700', 'stroke-width': big ? 4 : 2.2 }, g);
        var mm = a + t * sp / 10, places = lvl + 1;
        var txt = big && lvl === 0 ? fmt(mm, 0) : fmt(mm, places).replace(/0+$/, function (z) { return lvl === 0 ? '' : z; });
        if (lvl === 0) txt = t === 0 ? fmt(mm, 0) : t === 10 ? fmt(mm, 0) : fmt(mm, 1);
        if (lvl === 1) txt = fmt(mm, 2); if (lvl === 2) txt = fmt(mm, 3);
        if (!nar || big || t % 2 === 0) NS('text', { x: x, y: 210, 'text-anchor': 'middle', 'font-size': (big ? 21 : 17) * (nar ? 1.05 : 1), 'font-weight': big ? 900 : 700, fill: '#3a2700', class: big ? 'endl' : 'midl', text: txt }, g);
        if (lvl === 2) { var hit = NS('rect', { x: x - 24, y: 96, width: 48, height: 92, fill: 'transparent', class: 'tick-hit', 'data-t': t, style: 'cursor:pointer' }, g); if (t === kf) NS('rect', { x: x - 20, y: 98, width: 40, height: 88, fill: 'none', stroke: '#1f3f8f', 'stroke-width': 4, rx: 6 }, g); }
      }
      // the corner stake at the true end of the side
      var sx = xOf(T);
      var stake = NS('g', { transform: 'translate(' + sx + ',0)', 'pointer-events': 'none' }, g);
      NS('rect', { x: -4, y: 74, width: 8, height: 118, fill: '#7a4b1b' }, stake); NS('path', { d: 'M4 74 l30 11 -30 11z', fill: '#c0392b' }, stake);
      NS('text', { x: 40, y: 92, 'font-size': 16, 'font-weight': 800, fill: '#c0392b', text: cfg.stakeLabel }, stake);
      // a lens line under the rod showing what you are about to open
      NS('text', { x: MID, y: 258, 'text-anchor': 'middle', 'font-size': 19 * (nar ? 1.05 : 1), 'font-weight': 700, fill: '#4a4237', text: lvl < 2 ? (nar ? 'Tap the part with the flag.' : 'Which part holds the flag? Tap it to zoom in.') : lvl === 2 ? (nar ? 'Tap the mark under the flag.' : 'Now the flag sits right on a mark. Tap that mark.') : '' }, g);
      if (lvl === 3) drawDone($('g.z', svg));
      if (fadeIn && !reduced) { g.style.opacity = 0; tween(500, function (k) { g.style.opacity = k; }); }
      readout();
    }
    function drawDone(g) {
      g.innerHTML = '';
      NS('text', { x: VW / 2, y: 60, 'text-anchor': 'middle', 'font-size': nar ? 24 : 26, 'font-weight': 900, fill: '#3a2700', text: cfg.doneText }, g);
      // three nested bars: 1 m → 0.1 m → 0.01 m with the picks lit
      var f = String(T % 1000).padStart(3, '0');
      [0, 1, 2].forEach(function (L) {
        var y = 92 + L * 70, P = PLACE[L], pick = +f[L];
        for (var s = 0; s < 10; s++) NS('rect', { x: X0 + s * W / 10, y: y, width: W / 10, height: 34, fill: (L < 2 ? s < pick : s < pick) ? P.col : P.fill[s % 2], opacity: (L < 2 ? s < pick : s < pick) ? .85 : 1, stroke: '#8a6417' }, g);
        NS('text', { x: X0, y: y - 6, 'font-size': 16, 'font-weight': 800, fill: P.col, text: pick + ' ' + P.name + (pick === 1 ? '' : 's') + (L === 0 ? ' of the last meter' : L === 1 ? ' of that tenth' : ' of that hundredth') }, g);
      });
    }
    function pickSeg(s) {
      if (busy || lvl > 1) return; var sp = span(), lo = a + s * sp / 10, hi = lo + sp / 10;
      if (T >= lo && T < hi) { zoomInto(s, lo); }
      else { hintN = Math.max(hintN, 1); fb.className = 'bd-fb bad'; fb.textContent = 'Look at the red flag. Is it in that part? ' + (T < lo ? 'The flag is to the left.' : 'The flag is to the right.'); }
    }
    function pickTick(t) {
      if (busy || lvl !== 2) return; var mm = a + t;
      if (mm === T) { lvl = 3; ST[cfg.id] = { done: true }; save(); fb.className = 'bd-fb ok'; fb.textContent = cfg.okText; draw(true); finish(); }
      else { fb.className = 'bd-fb bad'; fb.textContent = 'That mark is ' + fmt(mm, 3) + '. The flag is ' + (T < mm ? 'to the left of it.' : 'to the right of it.'); }
    }
    function zoomInto(s, lo) {
      busy = true; fb.className = 'bd-fb ok'; fb.textContent = 'Zooming in ×10 …'; var g = $('g.z', svg), cx = X0 + (s + .5) * W / 10;
      tween(900, function (k) { var sc = 1 + 9 * k, tx = (500 - cx * sc) * k + (1 - k) * 0; g.setAttribute('transform', 'translate(' + (cx * (1 - sc) + (VW / 2 - cx) * k) + ',' + 0 + ') scale(' + sc + ',1)'); g.style.opacity = 1 - k * .85; },
        function () { a = lo; lvl++; kf = -1; busy = false; fb.textContent = lvl === 1 ? 'You zoomed into one tenth. It holds 10 hundredths.' : 'You zoomed into one hundredth. It holds 10 thousandths.'; draw(true); hint.classList.remove('on'); hintN = 0; svg.focus({ preventScroll: true }); });
    }
    function finish() {
      size.classList.add('on'); size.innerHTML = cfg.sizeHTML;
      host.classList.add('done'); host.dispatchEvent(new CustomEvent('bd-done', { bubbles: true }));
    }
    svg.addEventListener('click', function (e) { var r = e.target.closest('.seg'); if (r) return pickSeg(+r.getAttribute('data-s')); var h = e.target.closest('.tick-hit'); if (h) pickTick(+h.getAttribute('data-t')); });
    svg.addEventListener('keydown', function (e) {
      if (lvl === 3) return; var max = lvl === 2 ? 10 : 9;
      if (e.key === 'ArrowRight') { kf = Math.min(max, kf + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { kf = Math.max(0, kf - 1); draw(); e.preventDefault(); }
      else if ((e.key === 'Enter' || e.key === ' ') && kf >= 0) { e.preventDefault(); lvl === 2 ? pickTick(kf) : pickSeg(kf); }
    });
    $('.out', host).addEventListener('click', function () { if (busy || lvl === 0) return; if (lvl === 3) lvl = 2; else { lvl--; } a = lvl === 0 ? Math.floor(T / 1000) * 1000 : lvl === 1 ? Math.floor(T / 100) * 100 : Math.floor(T / 10) * 10; if (lvl === 0) a = Math.floor(T / 1000) * 1000; size.classList.remove('on'); fb.textContent = ''; draw(true); });
    $('.reset', host).addEventListener('click', function () { host.classList.remove('done'); lvl = 0; a = Math.floor(T / 1000) * 1000; kf = -1; delete ST[cfg.id]; save(); fb.textContent = ''; size.classList.remove('on'); draw(true); });
    $('.hint', host).addEventListener('click', function () { hintN = Math.min(3, hintN + 1); hint.classList.add('on'); hint.innerHTML = cfg.hints[Math.min(lvl, 2)][hintN - 1] || cfg.hints[Math.min(lvl, 2)].slice(-1)[0]; });
    if (lvl === 3) { a = Math.floor(T / 10) * 10; draw(); finish(); } else draw();
  }

  /* ═══ thousandths block: one hundredth opens into ten thousandths ═══ */
  function Block(host) {
    var openSq = ST.blockSq == null ? null : ST.blockSq, shade = ST.blockShade || 0;
    host.innerHTML = '<div class="bd-grid-wrap"><div><svg class="bd-gsvg big" viewBox="0 0 420 420" role="img" aria-label="A whole cut into 100 equal squares"></svg><p class="bd-mini">The whole square is 1. Each small square is 1 hundredth.</p></div>' +
      '<div><svg class="bd-gsvg zoomed" viewBox="0 0 420 420" role="application" aria-label="One hundredth, zoomed in"></svg><div class="bd-num" style="margin-top:10px;font-size:40px" aria-live="polite"></div><p class="bd-fb blk" role="status"></p></div></div>';
    var big = $('.big', host), zm = $('.zoomed', host), num = $('.bd-num', host), fb = $('.blk', host);
    function drawBig() {
      big.innerHTML = '';
      for (var r = 0; r < 10; r++) for (var c = 0; c < 10; c++) { var k = r * 10 + c, full = k === openSq && shade === 10;
        NS('rect', { x: 10 + c * 40, y: 10 + r * 40, width: 40, height: 40, fill: full ? '#1e8c5a' : k === openSq ? '#efe2ff' : '#fff', stroke: k === openSq ? '#8a3fc1' : '#9db8a8', 'stroke-width': k === openSq ? 4 : 1, class: 'c', 'data-k': k, tabindex: openSq == null ? 0 : -1 }, big); }
      if (openSq != null && !reduced) { var r0 = Math.floor(openSq / 10), c0 = openSq % 10; NS('path', { d: 'M' + (50 + c0 * 40) + ' ' + (10 + r0 * 40) + ' L420 0 M' + (50 + c0 * 40) + ' ' + (50 + r0 * 40) + ' L420 420', stroke: '#8a3fc1', 'stroke-dasharray': '5 5', 'stroke-width': 2 }, big); }
    }
    function drawZoom() {
      zm.innerHTML = '';
      if (openSq == null) { NS('text', { x: 210, y: 200, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#7a6a4c', text: 'Tap any small square' }, zm); NS('text', { x: 210, y: 228, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#7a6a4c', text: 'to open it up.' }, zm); num.innerHTML = '<span class="blank">0.000</span>'; return; }
      for (var s = 0; s < 10; s++) NS('rect', { x: 10 + s * 40, y: 10, width: 40, height: 400, fill: s < shade ? '#8a3fc1' : '#f6efff', stroke: '#8a3fc1', 'stroke-width': 2, class: 'c', 'data-s': s, style: 'cursor:pointer' }, zm);
      var f = shade === 10 ? '010' : '00' + shade;
      num.innerHTML = '0.<span class="t">' + f[0] + '</span><span class="h">' + f[1] + '</span><span class="th">' + f[2] + '</span>';
      fb.className = 'bd-fb blk ' + (shade === 10 ? 'ok' : '');
      fb.textContent = shade === 0 ? 'This one hundredth is cut into 10 equal slices. Tap slices to shade them.' : shade < 10 ? shade + ' thousandth' + (shade > 1 ? 's' : '') + ' shaded.' : '10 thousandths fill the whole hundredth. 0.010 and 0.01 name the same amount.';
    }
    big.addEventListener('click', function (e) { var r = e.target.closest('.c'); if (!r || openSq != null) return; openSq = +r.getAttribute('data-k'); ST.blockSq = openSq; save(); drawBig(); drawZoom(); });
    zm.addEventListener('click', function (e) { var r = e.target.closest('.c'); if (!r) return; var s = +r.getAttribute('data-s'); shade = s + 1 === shade ? s : s + 1; ST.blockShade = shade; save(); drawZoom(); drawBig(); });
    drawBig(); drawZoom();
  }

  /* ── answer boxes ─────────────────────────────── */
  function norm(v) { v = String(v).trim().replace(/[\s,]/g, ''); if (/^-?\d*\.?\d+$/.test(v)) { var n = parseFloat(v); return String(Math.round(n * 1e6) / 1e6); } return v.toLowerCase(); }
  /* specific hints for common wrong answers; then the author's hint */
  function diagnose(inp, ans, v) {
    var a = parseFloat(String(ans).replace(/,/g, '')), x = parseFloat(String(v).replace(/[\s,]/g, '')), h = inp.getAttribute('data-hint'), lab = inp.getAttribute('aria-label') || '';
    inp._tries = (inp._tries || 0) + 1;
    if (isNaN(x)) return 'Type a number.';
    var isDec = /\./.test(String(ans)), near = function (p, q) { return Math.abs(p - q) < 1e-9; };
    if (isDec) {
      var pl = (String(ans).split('.')[1] || '').length, unit = ['tenths', 'hundredths', 'thousandths'][pl - 1] || 'thousandths', ord = ['1st', '2nd', '3rd'][pl - 1] || '3rd', P10 = Math.pow(10, pl);
      if (String(x).replace(/0/g, '') === String(a).replace(/0/g, '') && !near(x, a)) return 'Check for an empty place. It needs a 0 to hold it.' + (h ? ' ' + h : '');
      if (near(x, a * P10)) return 'That counts the ' + unit + '. Now write it as a decimal: ' + Math.round(a * P10) + ' ' + unit + ' = 0.___ . The last digit goes in the ' + ord + ' place after the point.';
      if (near(x, a * 10)) return a < 0.1 ? 'Too big by 10 times. Is there a 0 in the tenths place?' : 'Too big by 10 times. Check where the point goes: ' + unit + ' are the ' + ord + ' place after the point.';
      if (near(x, a / 10)) return 'Too small by 10 times. You have one zero too many.';
      if (near(x, a * 100) || near(x, a * 1000)) return 'Check the places. ' + unit.charAt(0).toUpperCase() + unit.slice(1) + ' are the ' + ord + ' place after the point.';
    }
    if (/denominator/.test(lab)) {
      if (x === 100 && a === 1000) return 'Thousandths: how many make 1 whole? 1,000, not 100.';
      if (x === 10 && a === 1000) return 'Thousandths: how many make 1 whole? 1,000.';
      var fr = inp.closest('.bd-fr'), top = fr && fr.querySelector('.bd-ans');
      if (top) { var tv = parseFloat(top.value), ta = parseFloat(top.getAttribute('data-a')); if (tv && near(tv / x, ta / a) && x < a) return 'Same amount! Here, use a denominator of ' + a.toLocaleString('en-US') + ' to show the place.'; if (tv && near(tv / x, ta / a) && x !== a) return 'Same amount, but not in simplest form. Divide the numerator and denominator again by the same number.'; }
    }
    if (/numerator/.test(lab)) {
      var fr2 = inp.closest('.bd-fr'), bot = fr2 && fr2.querySelectorAll('.bd-ans')[1];
      if (bot) { var bv = parseFloat(bot.value), ba = parseFloat(bot.getAttribute('data-a')); if (bv && near(x / bv, a / ba) && bv < ba) return 'Same amount! Here, use a denominator of ' + ba.toLocaleString('en-US') + ' to show the place.'; if (bv && near(x / bv, a / ba) && bv !== ba) return 'Same amount, but not in simplest form. Divide the numerator and denominator again by the same number.'; }
    }
    if (!isDec && Math.abs(x - a) <= 2 && a > 5) return 'Close! Count again carefully.' + (h ? ' ' + h : '');
    return h || (inp._tries > 1 ? 'Not yet. Look back at the example above.' : 'Not yet. Look again.');
  }
  function answers() {
    $$('.bd-ans').forEach(function (inp) {
      var k = 'ans-' + inp.id; if (ST[k]) inp.value = ST[k];
      var fb = el('span', 'bd-afb'); fb.setAttribute('role', 'status'); (inp.closest('.bd-fr') || inp).insertAdjacentElement('afterend', fb);
      function chk(quiet) {
        var v = inp.value; if (!v.trim()) { inp.className = 'bd-ans'; fb.textContent = ''; return; }
        var exact = (inp.getAttribute('data-a') || '').split('|'), ok = exact.indexOf(v.trim().replace(/[\s,]/g, '')) >= 0;
        // decimal answers must keep the digits the place needs (0.06 ≠ .06 is fine; 0.6 ≠ 0.06)
        if (!ok && exact.some(function (a) { return /\./.test(a); })) ok = exact.some(function (a) { return norm(a) === norm(v); });
        var lead = ok && /^\s*\./.test(v);
        if (lead) ok = false;
        inp.className = 'bd-ans ' + (ok ? 'ok' : 'bad');
        fb.textContent = ok ? '' : lead ? 'Write a 0 in the ones place, like 0' + v.trim() + '.' : diagnose(inp, exact[0], v);
        fb.className = 'bd-afb' + (ok ? '' : ' bad');
        if (!quiet) document.dispatchEvent(new CustomEvent('bd-check'));
      }
      inp.addEventListener('input', function () { ST[k] = inp.value; save(); if (inp.classList.contains('bad')) { inp.className = 'bd-ans'; fb.textContent = ''; } });
      inp.addEventListener('change', function () { chk(); });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') chk(); });
      if (inp.value) chk(true);
    });
  }
  /* ── one step at a time: only the current step shows, instruction on top, done steps fold away ── */
  function steps() {
    $$('.bd-steps').forEach(function (g) {
      var id = g.getAttribute('data-id'), list = $$('.bd-step', g), n = list.length;
      list.forEach(function (st, k) {
        var hd = el('div', 'bd-stephd', '<span class="k">👉 Do this now · Step ' + (k + 1) + ' of ' + n + '</span><span class="tx">' + st.getAttribute('data-t') + '</span>');
        st.insertBefore(hd, st.firstChild);
        st.appendChild(el('div', 'bd-stepdone', '✓ ' + st.getAttribute('data-t')));
      });
      function isDone(st) {
        var need = st.getAttribute('data-need'); if (need) { var e = $(need); if (!e || (need.indexOf('.') < 0 && !e.classList.contains('done'))) return false; }
        return $$('.bd-ans', st).every(function (x) { return x.classList.contains('ok'); }) && $$('.bd-sel', st).every(function (x) { return x.classList.contains('ok'); });
      }
      function update() {
        var cur = -1; for (var k = 0; k < n; k++) { if (!isDone(list[k])) { cur = k; break; } }
        list.forEach(function (st, k) { st.classList.toggle('now', k === cur); st.classList.toggle('past', cur === -1 || k < cur); st.classList.toggle('later', cur !== -1 && k > cur); });
        g.classList.toggle('all', cur === -1);
        var w = g.getAttribute('data-wait'); if (w) { var wg = $('.bd-steps[data-id="' + w + '"]'); g.hidden = !(wg && wg.classList.contains('all')); }
        if (cur !== ST['st-' + id] && ST['st-' + id] != null && cur > ST['st-' + id]) { var now = list[cur]; if (now) setTimeout(function () { var r = now.getBoundingClientRect(); if (r.top > innerHeight * .8 || r.top < 60) now.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }, 150); }
        ST['st-' + id] = cur; save();
      }
      document.addEventListener('bd-check', update); document.addEventListener('bd-groups', update); document.addEventListener('bd-done', function () { setTimeout(update, 30); });
      update();
    });
  }
  /* ── the meter stick (Think): tap a mark; the mark you need is the one at data-find mm ── */
  function rulers() {
    $$('.bd-ruler').forEach(function (h, idx) {
      var from = +h.getAttribute('data-from'), to = +h.getAttribute('data-to'), find = +h.getAttribute('data-find'), key = 'rul-' + idx;
      var mm0 = from * 10, mm1 = to * 10, W = innerWidth < 600 ? 520 : 1000, X0 = 20, X1 = W - 20, px = (X1 - X0) / (mm1 - mm0);
      var svg = NS('svg', { viewBox: '0 0 ' + W + ' 130', class: 'bd-rsvg', role: 'application', 'aria-label': 'Meter stick. Tap a mark.' , tabindex: 0 }, h);
      NS('rect', { x: 6, y: 20, width: W - 12, height: 76, rx: 6, fill: '#e9cf96', stroke: '#a07c3c' }, svg);
      for (var m = mm0; m <= mm1; m++) { var x = X0 + (m - mm0) * px, big = m % 10 === 0, mid = m % 5 === 0;
        NS('line', { x1: x, y1: 20, x2: x, y2: 20 + (big ? 34 : mid ? 24 : 15), stroke: '#3a2700', 'stroke-width': big ? 2.4 : 1.2 }, svg);
        if (big && (mm1 - mm0 <= 20 || true)) NS('text', { x: x, y: 76, 'text-anchor': 'middle', 'font-size': mm1 - mm0 <= 10 ? 24 : 18, 'font-weight': 800, fill: '#3a2700', text: m / 10 }, svg); }
      NS('text', { x: 18, y: 90, 'font-size': 13, 'font-weight': 700, fill: '#5b4219', text: 'cm' }, svg);
      if (mm1 - mm0 <= 10) for (var q = mm0 + 1; q < mm1; q++) NS('text', { x: X0 + (q - mm0) * px, y: 76, 'text-anchor': 'middle', 'font-size': 14, fill: '#7a5a2a', text: q + ' mm' }, svg);
      var mark = NS('g', {}, svg), fb = el('p', 'bd-fb'); fb.setAttribute('role', 'status'); h.appendChild(fb);
      function show(mmv, ok) { mark.innerHTML = ''; var x = X0 + (mmv - mm0) * px; NS('path', { d: 'M' + x + ' 18 l-9 -14 h18 z', fill: ok ? '#1e7a4c' : '#b03a2e' }, mark); if (ok) NS('rect', { x: X0, y: 100, width: (find - mm0) * px, height: 10, rx: 5, fill: '#1e7a4c', opacity: .8 }, mark); }
      function pick(mmv) {
        if (mmv === find) { show(mmv, true); h.classList.add('done'); ST[key] = 1; save(); fb.className = 'bd-fb ok'; fb.textContent = find === 100 ? 'Yes! 10 cm = 1 dm. 10 of these make 1 m.' : find === 10 ? 'Yes! 1 cm. 100 of these make 1 m.' : 'Yes! 1 mm. 1,000 of these make 1 m.'; document.dispatchEvent(new CustomEvent('bd-done')); }
        else { show(mmv, false); fb.className = 'bd-fb bad'; fb.textContent = 'That mark is ' + (mmv % 10 === 0 ? mmv / 10 + ' cm' : mmv + ' mm') + '. Try again.'; }
      }
      var hit = NS('g', {}, svg); for (var hm = mm0; hm <= mm1; hm++) NS('rect', { x: X0 + (hm - mm0 - 0.5) * px, y: 0, width: px, height: 130, fill: '#000', 'fill-opacity': 0, 'data-mm': hm }, hit);
      svg.addEventListener('click', function (e) { var t = e.target && e.target.closest ? e.target.closest('[data-mm]') : null, mmv;
        if (t) mmv = +t.getAttribute('data-mm');
        else { var x; try { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; x = pt.matrixTransform(svg.getScreenCTM().inverse()).x; } catch (er) { var r = svg.getBoundingClientRect(); x = (e.clientX - r.left) / r.width * W; } mmv = Math.round((x - X0) / px + mm0); }
        mmv = Math.max(mm0, Math.min(mm1, mmv)); if (find % 10 === 0 && Math.abs(mmv - Math.round(mmv / 10) * 10) <= 2) mmv = Math.round(mmv / 10) * 10; pick(mmv); });
      var kv = mm0; svg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { kv = Math.min(mm1, kv + 1); show(kv, false); mark.firstChild.setAttribute('fill', '#1f3f8f'); e.preventDefault(); } if (e.key === 'ArrowLeft') { kv = Math.max(mm0, kv - 1); show(kv, false); mark.firstChild.setAttribute('fill', '#1f3f8f'); e.preventDefault(); } if (e.key === 'Enter') pick(kv); });
      if (ST[key]) { show(find, true); h.classList.add('done'); }
    });
    $$('.bd-chisel').forEach(function (h) {
      h.innerHTML = '<svg viewBox="0 0 1000 120" class="bd-rsvg" role="img" aria-label="A copper chisel lying on a meter stick, 168 mm long"><rect x="10" y="62" width="980" height="50" rx="6" fill="#e9cf96" stroke="#a07c3c"/>' +
        Array.apply(null, Array(21)).map(function (_, c) { var x = 30 + c * 44; return '<line x1="' + x + '" y1="62" x2="' + x + '" y2="86" stroke="#3a2700" stroke-width="2"/><text x="' + x + '" y="106" text-anchor="middle" font-size="15" font-weight="800" fill="#3a2700">' + c + '</text>'; }).join('') +
        '<path d="M30 30 H700 L769 40 L700 50 H30 Z" fill="#c97b3a" stroke="#7a3f12" stroke-width="2"/><path d="M30 30 H120 V50 H30Z" fill="#8a5a2a"/>' +
        '<line x1="30" y1="18" x2="769" y2="18" stroke="#1f3f8f" stroke-width="2"/><path d="M30 12 v12 M769 12 v12" stroke="#1f3f8f" stroke-width="2"/><rect x="345" y="4" width="110" height="26" rx="4" fill="#fff"/><text x="400" y="23" text-anchor="middle" font-size="18" font-weight="900" fill="#1f3f8f">168 mm</text></svg>';
    });
  }
  /* ── same amount: shade hundredths, then cut each into 10 thousandths ── */
  function Hund(host) {
    if (!host) return;
    var sh = ST.hund || [], cut = !!ST.hundCut;
    host.innerHTML = '<div class="bd-grid-wrap"><svg class="bd-gsvg" viewBox="0 0 420 420" role="application" aria-label="A whole cut into 100 equal squares. Tap to shade."></svg>' +
      '<div><div class="bd-num" aria-live="polite" style="font-size:40px"></div><p class="bd-fb blk" role="status"></p><button type="button" class="bd-btn cut">✂ Divide each shaded hundredth into 10 equal parts</button></div></div>';
    var svg = $('svg', host), num = $('.bd-num', host), fb = $('.blk', host), btn = $('.cut', host);
    function draw() {
      svg.innerHTML = '';
      for (var r = 0; r < 10; r++) for (var c = 0; c < 10; c++) { var k = r * 10 + c, on = sh.indexOf(k) >= 0, x = 10 + c * 40, y = 10 + r * 40;
        NS('rect', { x: x, y: y, width: 40, height: 40, fill: on ? '#7ec9a2' : '#fff', stroke: '#9db8a8', class: 'c', 'data-k': k, style: 'cursor:pointer' }, svg);
        if (on && cut) for (var q = 1; q < 10; q++) NS('line', { x1: x + q * 4, y1: y, x2: x + q * 4, y2: y + 40, stroke: '#b0336a', 'stroke-width': 1 }, svg); }
      var n = sh.length;
      num.innerHTML = cut ? '0.0<span class="h">' + Math.floor(n / 10 * 10) / 10 * 0 + '</span>' : '';
      num.innerHTML = '0.0<span class="h">' + n + '</span> <small style="font-size:16px">= ' + n + ' hundredth' + (n === 1 ? '' : 's') + '</small>';
      btn.hidden = cut || n !== 6;
      fb.className = 'bd-fb blk'; fb.textContent = cut ? 'Each hundredth is divided into 10 thousandths. Count the slices.' : n < 6 ? 'Shade ' + (6 - n) + ' more.' : n > 6 ? 'Too many. Tap to unshade.' : 'Now press Divide.';
      host.classList.toggle('done', cut && n === 6);
    }
    svg.addEventListener('click', function (e) { if (cut) return; var r = e.target.closest('.c'); if (!r) return; var k = +r.getAttribute('data-k'), i = sh.indexOf(k); i >= 0 ? sh.splice(i, 1) : sh.push(k); ST.hund = sh; save(); draw(); });
    btn.addEventListener('click', function () { cut = true; ST.hundCut = 1; save(); draw(); document.dispatchEvent(new CustomEvent('bd-done')); });
    draw();
  }
  /* ── lesson stations: one at a time, remembered ── */
  function stations() {
    var path = $('.bd-path'); if (!path) return;
    function go(n) { $$('.bd-station').forEach(function (s) { s.hidden = s.getAttribute('data-st') !== String(n); }); $$('button', path).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-st') === String(n)); b.setAttribute('aria-current', b.getAttribute('data-st') === String(n) ? 'step' : 'false'); }); ST.station = n; save(); dispatchEvent(new Event('resize')); }
    $$('button', path).forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-st')); }); });
    $$('.bd-nextst').forEach(function (b) { b.addEventListener('click', function () { var t = b.getAttribute('data-go'); if (t === 'swyk') { $('.bd-tab[data-tab=swyk]').click(); } else { go(t); } $('.bd-tabs').scrollIntoView({ block: 'start' }); }); });
    go(ST.station || 1);
  }
  /* ── gather work for Canvas ── */
  function gather() {
    var g = $('#gather'); if (!g) return; var out = $('#gathered');
    var pr = $('#prove'); if (pr) { if (ST.prove) pr.value = ST.prove; pr.addEventListener('input', function () { ST.prove = pr.value; save(); }); }
    g.addEventListener('click', function () {
      var t = [((($('.bd-chip.lead') || {}).textContent || '').split('·')[0].trim() + ' ' + (($('.bd-title') || {}).textContent || '')).trim(), ''];
      $$('.bd-job').forEach(function (j) { var sec = j.closest('.bd-sec'), h = $('h2', sec); var vals = $$('.bd-eq', j).map(function (p) { var c = p.cloneNode(true); $$('.bd-afb,.bd-stephd', c).forEach(function (x) { x.remove(); }); var cs = $$('select', c); $$('select', p).forEach(function (sl, i) { cs[i].replaceWith(document.createTextNode('[' + (sl.value || ' ') + ']')); }); var ci = $$('input', c); $$('input', p).forEach(function (inp, i) { ci[i].replaceWith(document.createTextNode('[' + (inp.value || ' ') + ']')); }); $$('.bd-fr', c).forEach(function (f) { f.replaceWith(document.createTextNode(f.textContent.replace('][', ']/['))); }); return c.textContent.replace(/\s+/g, ' ').trim(); }); if (vals.length) { t.push(h.textContent.trim()); vals.forEach(function (v) { t.push('  ' + v); }); } });
      var cwv = $('#crew-w'); if (cwv && cwv.value) t.push('', 'Math Crew: ' + cwv.value);
      var opv = $('#onepic'); if (opv && opv.value) t.push('', 'Big idea: ' + opv.value);
      if (pr) t.push('', 'Prove it: ' + pr.value);
      out.value = t.join('\n');
    });
    $('#copy').addEventListener('click', function () { if (!out.value) g.click(); out.select(); try { document.execCommand('copy'); } catch (e) {} });
    $('#print').addEventListener('click', function () { print(); });
  }
  function predictionBack() {
    var box = $('#bd-predict-back'); if (!box) return;
    if (CFG.predict) { var P = CFG.predict, sh = function () { box.style.display = 'grid'; box.innerHTML = '<div class="bd-face" style="width:64px;height:64px">' + face('') + '</div><div><b>Hemiunu:</b> ' + P.html(ST[P.key || 'w1-predict']) + '</div>'; };
      document.addEventListener('bd-done', function (e) { if (e.target.id === P.on || (e.target.closest && e.target.closest('#' + P.on))) sh(); }); document.addEventListener('bd-check', function () { setTimeout(function () { if (P.onSteps && stepsDone(P.onSteps)) sh(); }, 80); });
      if ((ST['disc-' + P.on] && ST['disc-' + P.on].done) || (P.onSteps && ST['st-' + P.onSteps] === -1)) sh(); return; }
    function show() { var p = ST['w1-predict']; var map = { one: 'one digit', two: 'two digits', three: 'three digits', ns: 'you weren’t sure yet' };
      box.innerHTML = '<div class="bd-face" style="width:64px;height:64px">' + face('') + '</div><div><b>Hemiunu:</b> ' + (p ? (p === 'ns' ? 'Before you zoomed, you weren’t sure. ' : 'Before you zoomed, you thought we would need ' + map[p] + ' after the point. ') : '') + 'You needed <b>three</b>: 2 tenths, 5 hundredths and 3 thousandths. What do you think now: why did it take three zooms?</div>'; }
    document.addEventListener('bd-done', function (e) { if (e.target.id === 'zoom-north') { box.style.display = 'grid'; show(); } });
    if (ST['zoom-north'] && ST['zoom-north'].done) { box.style.display = 'grid'; show(); }
  }


  /* ── shared shell: tabs, chips, progress (jobs finished, never tabs visited) ── */
  function shell() {
    function show(t, el) {
      $$('.bd-tab').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-tab') === t); });
      $$('.bd-panel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== t; });
      ST.tab = t; save(); dispatchEvent(new Event('resize'));
      var tabs = $('.bd-tabs'); if (el) setTimeout(function () { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 30);
      else if (tabs.getBoundingClientRect().top < 0) tabs.scrollIntoView({ block: 'start' });
    }
    $$('.bd-tab').forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-tab')); }); });
    document.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#"]'); if (!a) return; var tgt = $(a.getAttribute('href')); var p = tgt && tgt.closest('.bd-panel'); if (p && p.hidden) { e.preventDefault(); show(p.getAttribute('data-panel'), tgt); } });
    if (ST.tab) show(ST.tab);
    $$('[data-pop]').forEach(function (b) { b.addEventListener('click', function () { var p = $(b.getAttribute('data-pop')); var o = p.classList.toggle('open'); b.setAttribute('aria-expanded', o); }); });
    var mo = $('#bd-motion'); mo && mo.addEventListener('click', function () { var on = mo.getAttribute('aria-pressed') !== 'true'; mo.setAttribute('aria-pressed', on); $('b', mo).textContent = on ? 'on' : 'off'; document.body.classList.toggle('bd-still', !on); });
    var wi = $('#bd-wins'); wi && wi.addEventListener('click', function () { var on = wi.getAttribute('aria-pressed') !== 'true'; wi.setAttribute('aria-pressed', on); $('b', wi).textContent = on ? 'ON' : 'OFF'; $$('.bd-win').forEach(function (w) { w.closest('.bd-sec').hidden = !on; }); });
    var g = $('#bd-guide'); if (g) { if (IMGS().full) { g.classList.remove('ph'); g.classList.add('full'); g.innerHTML = '<img src="' + IMGS().full + '" alt="Hemiunu, the master builder, holding his measuring rod">'; } else g.innerHTML = HEMI; }
  }
  function stepsDone(id) { var g = $('.bd-steps[data-id="' + id + '"]'); return g && g.classList.contains('all'); }
  var JOBS = (CFG.jobs || ['s1', 's2b', 's3', 's4', 's5', 's6', 's7', 'j8']).map(function (id) { return id === 'j8' ? function () { return $$('#j8 .bd-ans').every(function (e) { return e.classList.contains('ok'); }) && $$('#j8 .bd-sel').every(function (e) { return e.classList.contains('ok'); }) && ($('#prove') || {}).value && $('#prove').value.trim().length > 15; } : function () { return stepsDone(id); }; });
  function progress() {
    var n = JOBS.filter(function (f) { return f(); }).length, p = $('.bd-prog');
    if (p) { $('.bar i', p).style.width = (n / JOBS.length * 100) + '%'; $('.n', p).textContent = n + ' of ' + JOBS.length + ' jobs'; }
    var L = JOBS.length, t = { warmup: JOBS[0](), learn: JOBS.slice(1, L - 1).every(function (f) { return f(); }), swyk: JOBS[L - 1]() };
    $$('.bd-tab').forEach(function (b) { b.classList.toggle('done', !!t[b.getAttribute('data-tab')]); });
  }


  /* ── the book opens: cover swings, pages flip to today ── */
  function book() {
    var b = $('.bd-board'), cov = b && $('.bd-cover', b); if (!cov) return;
    var still = function () { return reduced || document.body.classList.contains('bd-still'); };
    if (still()) { b.classList.add('done'); return; }
    b.classList.add('closed'); var opened = false;
    function open() {
      if (opened) return; opened = true;
      b.classList.add('opening'); b.classList.remove('closed');
      var leaves = $$('.bd-leaf', b), t0 = 1250;
      setTimeout(function () { b.classList.add('flip'); }, t0);
      leaves.forEach(function (lf, k) { lf.style.zIndex = 7 - k;
        setTimeout(function () { lf.classList.add('go'); }, t0 + k * 170);
        setTimeout(function () { lf.classList.add('gone'); }, t0 + k * 170 + 620); });
      setTimeout(function () { b.classList.remove('opening', 'flip'); b.classList.add('done'); }, t0 + leaves.length * 170 + 700);
    }
    cov.addEventListener('click', open);
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setTimeout(open, 1100); io.disconnect(); } }, { threshold: .6 }) : null;
    io ? io.observe(b) : setTimeout(open, 1200);
  }


  /* ── Hemiunu helper: when scrolling stops he appears beside the work in view (never in two places at once) ── */
  function helper(spots) {
    var I = IMGS(); if (!I.full) return;
    var h = el('div', 'bd-helper'); h.innerHTML = '<button type="button" class="who" aria-label="Ask Hemiunu for help"><img class="stand" src="' + I.full + '" alt=""><img class="facei" src="' + (I.face || I.full) + '" alt=""><span class="ask">Ask me</span></button>';
    var card = el('div', 'bd-hcard'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Hemiunu\u2019s help'); card.hidden = true;
    document.body.appendChild(h); document.body.appendChild(card);
    var who = $('.who', h), cur = null, t = null, wrap = $('.wrap');
    function lane() { var room = (innerWidth - wrap.getBoundingClientRect().width) / 2; h.classList.toggle('lane', room >= 150); }
    function spot() { var y = innerHeight * .45, best = spots[0], el0 = null; spots.forEach(function (s) { var e = $(s.sel); if (!e || e.closest('[hidden]')) return; var r = e.getBoundingClientRect(); if (r.top < y) { best = s; el0 = e; } }); return { s: best, e: el0 }; }
    function settle() {
      var sp = spot(); if (sp.s !== cur) { cur = sp.s; if (!card.hidden) open(); }
      if (h.classList.contains('lane')) {
        var r = wrap.getBoundingClientRect(), top = innerHeight * .42;
        if (sp.e) { var er = sp.e.getBoundingClientRect(); top = Math.min(Math.max(er.top + 20, 80), Math.min(er.bottom - 120, innerHeight - 240)); top = Math.max(80, top); }
        h.style.left = (r.right + 14) + 'px'; h.style.top = top + 'px';
        card.style.left = ''; card.style.top = (top + 10) + 'px'; card.style.right = (innerWidth - r.right + 6) + 'px';
      } else { h.style.left = h.style.top = ''; card.style.top = card.style.right = ''; }
      h.classList.add('show');
    }
    function onScroll() { if (h.classList.contains('lane')) h.classList.remove('show'); clearTimeout(t); t = setTimeout(settle, 450); }
    function open() {
      var s = cur || spot().s;
      card.innerHTML = '<div class="hd"><span class="f">' + face('') + '</span><div><b>Hemiunu</b><small>Master builder</small></div><button type="button" class="x" aria-label="Close">✕</button></div><p class="tip">' + s.say + '</p>' +
        ((s.ask || []).length ? '<div class="askme">Ask me</div>' + s.ask.map(function (a) { return '<details><summary>' + a.q + '</summary><p>' + a.a + '</p></details>'; }).join('') : '');
      card.hidden = false; $('.x', card).addEventListener('click', close); $('.x', card).focus({ preventScroll: true });
    }
    function close() { card.hidden = true; who.focus({ preventScroll: true }); }
    who.addEventListener('click', function () { card.hidden ? open() : close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !card.hidden) close(); });
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', function () { lane(); onScroll(); });
    document.addEventListener('click', function (e) { if (e.target.closest('.bd-tab')) onScroll(); });
    var bk = $('.bd-board'); if (bk && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { document.body.classList.toggle('bd-onbook', es[0].isIntersecting); }, { threshold: .25 }).observe(bk);
    lane(); settle();
  }


  /* ── From the museum: gallery wall, gilded frame, magnifier hunt, brass placard ── */
  function Museum(host, c) {
    var got = ST[c.id] || {}, Z = 2.6;
    host.innerHTML = '<div class="bd-wall"><span class="bd-kick2">From the museum</span><div class="bd-gframe"><div class="in"><div class="stage" tabindex="0" role="application" aria-label="' + c.alt + '. Move the magnifier with the mouse, a finger, or the arrow keys.">' +
      '<img src="' + c.img + '" alt="' + c.alt + '"><div class="lens" aria-hidden="true"></div></div></div></div>' +
      '<div class="bd-plaque"><b>' + c.title + '</b><small>' + c.meta + '</small><p class="intro">' + c.intro + '</p><ul class="finds"></ul><p class="msg" role="status"></p></div></div>';
    var st = $('.stage', host), lens = $('.lens', host), img = $('img', st), ul = $('.finds', host), msg = $('.msg', host), kx = .5, ky = .5;
    lens.style.backgroundImage = 'url(' + c.img + ')';
    c.finds.forEach(function (f, k) {
      var li = el('li', got[k] ? 'on' : '', '<span>' + f.name + (got[k] ? ': ' + f.say : '') + '</span>'); ul.appendChild(li);
      var m = el('div', 'found' + (got[k] ? ' on' : '')); m.style.left = f.x * 100 + '%'; m.style.top = f.y * 100 + '%'; st.appendChild(m); f.li = li; f.m = m;
    });
    function check() { if (Object.keys(got).length === c.finds.length) msg.textContent = c.done; }
    function at(x, y) {
      var r = st.getBoundingClientRect(), L = lens.offsetWidth / 2;
      lens.style.display = 'block'; lens.style.left = x * r.width + 'px'; lens.style.top = y * r.height + 'px';
      lens.style.backgroundSize = r.width * Z + 'px ' + r.height * Z + 'px';
      lens.style.backgroundPosition = (-x * r.width * Z + L) + 'px ' + (-y * r.height * Z + L) + 'px';
      c.finds.forEach(function (f, k) { if (got[k]) return; if (Math.hypot(x - f.x, (y - f.y) * r.height / r.width) < .055) {
        got[k] = 1; ST[c.id] = got; save(); f.li.classList.add('on'); f.li.firstChild.textContent = f.name + ': ' + f.say; f.m.classList.add('on'); check(); } });
    }
    function ev(e) { var r = st.getBoundingClientRect(); at((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }
    st.addEventListener('pointermove', ev); st.addEventListener('pointerdown', ev);
    st.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') lens.style.display = 'none'; });
    st.addEventListener('keydown', function (e) { var d = { ArrowLeft: [-.03, 0], ArrowRight: [.03, 0], ArrowUp: [0, -.03], ArrowDown: [0, .03] }[e.key]; if (!d) return; e.preventDefault(); kx = Math.min(1, Math.max(0, kx + d[0])); ky = Math.min(1, Math.max(0, ky + d[1])); at(kx, ky); });
    st.addEventListener('focus', function () { at(kx, ky); });
    check();
  }


  /* ── direct instruction: worked examples revealed one step at a time; Hemiunu lines; Math Crew ── */
  var CREW = {"atlas": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABZklEQVR4AaSSIUhDURiF/71kE0SwWAxicsUkCAa70SCaRINFEIUZBJE5DSsGkRVBMA0nK0axiKaBiIoYtLwiuGEwDja+C//lv3uPx2CD8/7zzjn/udzxIhnwlyjIj490stB7XlDAYrWyJlkgY0uCAoyHxrdkgYxFRCP4uN3tcPLczIRkgQxZdkD0ErdyNB4e1aRfbGxfsiLsBleIm//O4NEPJ+cLWKhVinJaKjhkcRYVvoAFxNmlHRmdX4cGsLpmCfgCXhSTY8NKg5mmuwL+jIWVggvXz/flqVp23D7Q8NDIsgN3BRAEjOWtY4k/35ACoOGRIaumL1Bh6vpdSvk92RxaDICGpzmdvoCP4u7qRJqvDfUSE48MWTV9gQq/B6tKEzPN8wXci/uxxUlMC9XIkFXPFyCo0a7fy0+xHADNZuAgKECw+Hu+EGC1Xp5aMN26EaBhONB3OxMFXOPs8SsH4AAO4HYZ3gUAAP//gnUhqAAAAAZJREFUAwCT7fUpk9TrQwAAAABJRU5ErkJggg==", "felix": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABj0lEQVR4AXyRO0gDYRCEN2lFfIAP0CSVID4CipX2IhYqYpHeJoUIdlbaWoiiaCGIhZWFiEGwErTRUkPSpBIxaiESrrKwMPIt7M9/uZwHczs3Mzt3P5eUhivb31k3KY6bz4wUBMluscU4zqLBFbAE2n8/hcV0elC/xOcskWEatACRoMHMxmk+efO0oPRWS/DmVCota/dPCrgPX7dlphbQ2JqZkKWzApqc5+Z1xt3IsoOvBZBq9VU2hzOyOzUm8HK5qNM4OkAH7ABXEAQ12ckNycZMr+I/zqLBFbCAuHX5KMtHt9AQfN2yBFwBD4aBnjajodlM1wL+wv51ScP56RFZXxhX7t/Q8NDIsgPXAggCxuldRV4+vpBCQMMjQ9ZMV2BC/TgvhZU52VucDAENz3I2XQH/dXU2K9+Vd/MiE48MWTNdgQkt21dGI7OZ5wo4F+djizcxfZhGhqx5rgDBjL6bLuk4+AkBzc/AQagAwUdQPBHga428acFo7UKAheHAnv0ZKeAYhw/PCQAHcAD3l+F/AAAA//904nhhAAAABklEQVQDALqp1imH1FmKAAAAAElFTkSuQmCC", "hazel": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABd0lEQVR4AYySTyjDYRjHn+2glCgOu6xdJBd2ILW708rFmfxJIg5yVtRKrkoTiTgoLg4ucnBlUdJqJ3HQLqK1loscps9bz9vzbmNbffZ+3+/zfb+/91e/qDT5JePdVfgrVldA2HKQSAlYz5b5Ag0QtmjYeppl5gvYzHX2Sq780RRy5CEoGO7/llY4rLxIvliK+AKutDsSZ98Si4kO4Qzh4Ab59zKeoxVNMEoTT+fAzH5WhjKbjv80B/UW/gYcYJAcnZD2gTFkgPU1S8AXsFH6Yl0qg7WR7wse19dc+PpsR/I3p07bPzxmeMcLyywOX8AulZ6W8alV+XwusA3AY0bGDoICBnfnbdIT25ZqZT4AjxkZS1CQuzqR+8KPnQeaGRlrRvmilh6KAgxWMlWWhuhs7+1LgLPuBgjQ9+NJtQ3qkSELZFwBAtTcuJyV9NZkAJ7NoCEowLCUn44ErFerGxYMli4ENIwG3du1roDXyN6+RgANaEDbw+hfAAAA//9vAI8zAAAABklEQVQDAIZd6ynlDI0hAAAAAElFTkSuQmCC", "cora": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABgElEQVR4AYyRMS9DYRSGz71DY0FY2sFgERMJC4nFQgyYzFisEv4Av4BEYpJgMBvKaJaYKKPEhHSoixp0EO19TnK+nNveNG369L7fe97z9t42lvQ1OTLchFT29CYLhGPEX1QQQGNyzcNmZIGM3kHtuy7QHiDkYYEMWUDHj69JVBroE7AwgzxsThbY1TtA5C1082xHC7g12rst+Fm13hB28LQAAfZcvWpyoYDlhdGCTA01FPTZzqIA2vssGqHgan9Nvbvqv1xUPlUfnZcFOHjfsvihgIMxVhxUub25KqCH9MP8VIa3FvCLbh1ca3imFAuQ4NsBjQcUkmUHXwsQGAyeklhW5qe1jLCBx4wMWXYgFHCA8sa4zPb/SvHjOQMeMzKeUMD/erK7LPdvP36e0czIkLVBKDBj7+bdZMc1bxYKeC6ejy2+iavHPDJkbRYKMGxwWFuS9cpcBjyfQUOmAMPz9XAq4L12nVswkVwKWBgNdvbXjgIe4/j2JQI0oAHtl9EtAAAA///gp/9wAAAABklEQVQDAK3R5Snkk2p0AAAAAElFTkSuQmCC"}, CREWC = { atlas: '#1F8FB4', felix: '#1E8C5A', hazel: '#9A7A00', cora: '#C2601F' };
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function teach() {
    $$('[data-face]').forEach(function (f) { f.innerHTML = face(''); });
    $$('.bd-ex').forEach(function (ex, idx) {
      var key = 'ex-' + idx, list = $$('.bd-exs', ex), n = list.length, shown = Math.min(n, ST[key] || 1);
      ex.insertBefore(el('div', 'bd-exhd', '<span class="k">' + (ex.classList.contains('bd-mini-ex') ? '👀 Watch how' : '📖 Learn it') + '</span><b>' + ex.getAttribute('data-title').replace(/^Watch how: /, '') + '</b>'), ex.firstChild);
      list.forEach(function (s, k) { s.insertBefore(el('span', 'bd-exn', String(k + 1)), s.firstChild); });
      var btn = el('button', 'bd-btn bd-exbtn'); btn.type = 'button'; ex.appendChild(btn);
      function show() { list.forEach(function (s, k) { s.hidden = k >= shown; s.classList.toggle('new', k === shown - 1); }); btn.textContent = shown < n ? 'Next step ▸ (' + shown + ' of ' + n + ')' : '✓ Got it'; btn.disabled = shown >= n; ex.classList.toggle('all', shown >= n); }
      btn.addEventListener('click', function () { if (shown < n) { shown++; ST[key] = shown; save(); show(); } });
      show();
    });
    $$('.bd-mate[data-who]').forEach(function (t) { var w = t.getAttribute('data-who'); t.style.setProperty('--c', CREWC[w]); t.innerHTML = '<img alt="" src="' + CREW[w] + '"><div><b>' + cap(w) + '</b><span>' + t.innerHTML + '</span></div>'; });
    $$('.bd-tipbtn[data-who]').forEach(function (b) {
      var w = b.getAttribute('data-who'); b.style.setProperty('--c', CREWC[w]); b.setAttribute('aria-expanded', 'false');
      b.innerHTML = '<img alt="" src="' + CREW[w] + '"><span>💬 ' + cap(w) + ' has a tip</span>';
      var tip = el('div', 'bd-tiptx', '<img alt="" src="' + CREW[w] + '"><div><b>' + cap(w) + ':</b> ' + b.getAttribute('data-tip') + '</div>'); tip.style.setProperty('--c', CREWC[w]); tip.hidden = true; b.insertAdjacentElement('afterend', tip);
      b.addEventListener('click', function () { tip.hidden = !tip.hidden; b.setAttribute('aria-expanded', !tip.hidden); });
    });
    var op = $('#onepic'); if (op) { if (ST.onepic) op.value = ST.onepic; op.addEventListener('input', function () { ST.onepic = op.value; save(); }); }
    var cw = $('#crew-w'); if (cw) { if (ST.crew) cw.value = ST.crew; cw.addEventListener('input', function () { ST.crew = cw.value; save(); }); }
    $$('.bd-mdet').forEach(function (d) { var op = $('.op', d); d.addEventListener('toggle', function () { op.textContent = d.open ? 'Close' : 'Open'; }); });
  }


  /* ── selects (word answers) ── */
  function selects() {
    $$('.bd-sel').forEach(function (sel, k) {
      var key = 'sel-' + k, fb = el('span', 'bd-afb'); sel.insertAdjacentElement('afterend', fb);
      function chk() { if (!sel.value) { sel.className = 'bd-sel'; fb.textContent = ''; return; } var ok = sel.value === sel.getAttribute('data-a'); sel.className = 'bd-sel ' + (ok ? 'ok' : 'bad'); fb.className = 'bd-afb' + (ok ? '' : ' bad'); fb.textContent = ok ? '' : (sel.getAttribute('data-hint') || 'Look at the place of the last digit.'); document.dispatchEvent(new CustomEvent('bd-check')); }
      if (ST[key]) sel.value = ST[key];
      sel.addEventListener('change', function () { ST[key] = sel.value; save(); chk(); }); if (sel.value) chk();
    });
  }
  /* ── guided build: shade a length one place at a time (tenths → hundredths → thousandths) ── */
  function Build(host) {
    if (!host) return;
    var T = String(host.getAttribute('data-target')).padStart(3, '0'), D = T.split('').map(Number), st = ST.build || { lvl: 0, sh: 0 }, busy = false;
    host.innerHTML = '<div class="bd-bwrap"><svg class="bd-zsvg" viewBox="0 0 1000 300" role="application" aria-label="A bar to shade. Tap a part."></svg>' +
      '<div class="bd-readout"><div class="bd-num" aria-live="polite"></div><button type="button" class="bd-btn gold zin" hidden>🔍 Zoom in ▸</button></div><p class="bd-fb" role="status"></p></div>';
    var svg = $('svg', host), num = $('.bd-num', host), zin = $('.zin', host), fb = $('.bd-fb', host);
    var X0 = 60, X1 = 940, W = X1 - X0;
    function digits() { var d = D.map(function (v, k) { return k < st.lvl ? v : (k === st.lvl ? st.sh : null); }); return d; }
    function draw(fade) {
      svg.innerHTML = ''; var L = Math.min(st.lvl, 2), P = PLACE[L], g = NS('g', {}, svg);
      var whole = ['1 meter', '1 tenth of a meter', '1 hundredth of a meter'][L];
      NS('text', { x: 500, y: 32, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: '#3a2700', text: st.lvl >= 3 ? 'Your rope: tenths, hundredths and thousandths together.' : whole.charAt(0).toUpperCase() + whole.slice(1) + ' divided into 10 equal parts. Each part is 1 ' + P.name + ' (' + P.each + ' m).' }, g);
      // what's already built, as a small strip
      var hist = D.slice(0, Math.min(st.lvl, 3)).map(function (v, k) { return v + ' ' + PLACE[k].name + (v === 1 ? '' : 's'); }).join(' + ');
      NS('text', { x: 500, y: 62, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#5B6478', text: st.lvl ? 'Built so far: ' + hist : 'Nothing built yet.' }, g);
      if (st.lvl < 3) for (var s = 0; s < 10; s++) {
        var on = s < st.sh, r = NS('rect', { x: X0 + s * W / 10, y: 90, width: W / 10, height: 70, fill: on ? P.col : P.fill[s % 2], 'fill-opacity': on ? .85 : 1, stroke: '#8a6417', 'stroke-width': 1.5, class: 'seg', 'data-s': s, style: 'cursor:pointer' }, g);
        NS('text', { x: X0 + (s + .5) * W / 10, y: 190, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#5B6478', text: s + 1 }, g);
      }
      if (st.lvl < 3 && st.sh === D[st.lvl] && st.lvl < 2) NS('rect', { x: X0 + D[st.lvl] * W / 10, y: 86, width: W / 10, height: 78, fill: 'none', stroke: '#1f3f8f', 'stroke-width': 4, 'stroke-dasharray': '8 5', rx: 4 }, g);
      if (st.lvl >= 3) { [0, 1, 2].forEach(function (k) { var y = 90 + k * 60; for (var q = 0; q < 10; q++) NS('rect', { x: X0 + q * W / 10, y: y, width: W / 10, height: 36, fill: q < D[k] ? PLACE[k].col : PLACE[k].fill[q % 2], 'fill-opacity': q < D[k] ? .85 : 1, stroke: '#8a6417' }, g); NS('text', { x: X0, y: y - 6, 'font-size': 15, 'font-weight': 800, fill: PLACE[k].col, text: D[k] + ' ' + PLACE[k].name + (D[k] === 1 ? '' : 's') }, g); }); }
      if (fade && !reduced) { g.style.opacity = 0; tween(450, function (k) { g.style.opacity = k; }); }
      var d = digits(), cls = ['t', 'h', 'th'];
      num.innerHTML = '<span class="d o">0</span>.' + d.map(function (v, k) { return v == null ? '<span class="d blank">_</span>' : '<span class="d ' + cls[k] + '">' + v + '</span>'; }).join('') + '<span class="u">m</span>';
      zin.hidden = !(st.lvl < 2 && st.sh === D[st.lvl]);
      var nm = st.lvl < 3 ? PLACE[st.lvl].name : '';
      fb.className = 'bd-fb'; fb.textContent = st.lvl >= 3 ? 'You built 0.' + T + ' m: ' + D[0] + ' tenths, ' + D[1] + ' hundredths, ' + D[2] + ' thousandths.' : st.sh === D[st.lvl] ? (st.lvl < 2 ? D[st.lvl] + ' ' + nm + 's. The rest of the rope is inside the next part (dashed). Press Zoom in.' : '') : st.sh > D[st.lvl] ? 'Too many. Tap the ' + D[st.lvl] + (D[st.lvl] === 1 ? 'st' : D[st.lvl] === 2 ? 'nd' : D[st.lvl] === 3 ? 'rd' : 'th') + ' part.' : '';
      ['l1', 'l2', 'l3'].forEach(function (c, k) { host.classList.toggle(c, st.lvl > k || (st.lvl === k && st.sh === D[k])); });
      if (st.lvl === 2 && st.sh === D[2]) { st.lvl = 3; ST.build = st; save(); setTimeout(function () { draw(true); document.dispatchEvent(new CustomEvent('bd-done')); }, 600); return; }
      host.classList.toggle('done', st.lvl >= 3);
    }
    svg.addEventListener('click', function (e) { if (busy || st.lvl >= 3) return; var r = e.target.closest('.seg'); if (!r) return; var s = +r.getAttribute('data-s'); st.sh = st.sh === s + 1 ? s : s + 1; ST.build = st; save(); draw(); document.dispatchEvent(new CustomEvent('bd-done')); });
    zin.addEventListener('click', function () {
      if (busy) return; busy = true; var g = $('g', svg), cx = X0 + (D[st.lvl] + .5) * W / 10;
      tween(800, function (k) { var sc = 1 + 9 * k; g.setAttribute('transform', 'translate(' + (cx * (1 - sc) + (500 - cx) * k) + ',0) scale(' + sc + ',1)'); g.style.opacity = 1 - k * .85; },
        function () { st.lvl++; st.sh = 0; ST.build = st; save(); busy = false; draw(true); document.dispatchEvent(new CustomEvent('bd-done')); });
    });
    draw();
  }

  /* ── place-value discs: a chart Ones | Tenths | Hundredths | Thousandths; add, take away, break 1 into 10, trade 10 for 1 ── */
  var DCOL = [{ n: 'ones', N: 'Ones', c: 'o', lab: '1', v: 1000 }, { n: 'tenths', N: 'Tenths', c: 't', lab: '0.1', v: 100 }, { n: 'hundredths', N: 'Hundredths', c: 'h', lab: '0.01', v: 10 }, { n: 'thousandths', N: 'Thousandths', c: 'th', lab: '0.001', v: 1 }];
  function dval(c) { var t = c[0] * 1000 + c[1] * 100 + c[2] * 10 + c[3], w = Math.floor(t / 1000), f = String(t % 1000).padStart(3, '0'); return w + '.' + f; }
  function Discs(host) {
    var id = host.id, T = (host.getAttribute('data-target') || '').split(',').filter(Boolean).map(Number), S0 = (host.getAttribute('data-start') || '0,0,0,0').split(',').map(Number);
    var show = host.getAttribute('data-mode') === 'show', trade = host.hasAttribute('data-trade'), tonly = host.hasAttribute('data-tradeonly'), unit = host.getAttribute('data-unit') || '';
    var st = show ? { c: S0.slice() } : (ST['disc-' + id] || { c: S0.slice() }), c = st.c;
    host.innerHTML = '<div class="bd-dmat" role="group" aria-label="Place-value chart with discs">' + DCOL.map(function (d, k) {
      return '<div class="col ' + d.c + '" data-k="' + k + '"><div class="hd">' + d.N + (k === 0 ? '<b class="pt" aria-hidden="true">•</b>' : '') + '</div><div class="pile" aria-live="polite"></div>' +
        (show ? '' : '<div class="ctl">' + (tonly ? '' : '<button type="button" class="mn" aria-label="Take away one ' + d.lab + ' disc">−</button><button type="button" class="pl" aria-label="Add one ' + d.lab + ' disc">+</button>') + '</div>' +
          (trade ? '<div class="tr">' + (k < 3 ? '<button type="button" class="brk">Break 1 into 10 ▸</button>' : '') + (k > 0 ? '<button type="button" class="bun">◂ Trade 10 for 1</button>' : '') + '</div>' : '')) + '</div>';
    }).join('') + '</div>' + (show ? '' : '<div class="bd-dout"><div class="bd-num" aria-live="polite"></div><p class="bd-fb" role="status"></p></div>');
    var num = $('.bd-num', host), fb = $('.bd-fb', host);
    function draw(pop) {
      $$('.col', host).forEach(function (col, k) {
        var d = DCOL[k], p = $('.pile', col);
        p.innerHTML = Array.apply(null, Array(Math.min(c[k], 20))).map(function (_, i) { return '<i class="dk ' + d.c + (pop === k && i === c[k] - 1 ? ' pop' : '') + '">' + d.lab + '</i>'; }).join('') + (c[k] > 20 ? '<small>+' + (c[k] - 20) + '</small>' : '');
        p.setAttribute('aria-label', c[k] + ' ' + d.lab + ' discs');
        if (!show) { var mn = $('.mn', col), br = $('.brk', col), bu = $('.bun', col); if (mn) mn.disabled = c[k] === 0; if (br) br.disabled = c[k] === 0; if (bu) bu.disabled = c[k] < 10; }
      });
      if (show) return;
      var small = c.every(function (v, k) { return k === 0 ? v < 10 : v < 10; });
      num.innerHTML = small ? '<span class="d o">' + c[0] + '</span>.' + [1, 2, 3].map(function (k) { return '<span class="d ' + DCOL[k].c + '">' + c[k] + '</span>'; }).join('') + (unit ? '<span class="u">' + unit + '</span>' : '')
        : '<span class="d">' + dval(c) + '</span>' + (unit ? '<span class="u">' + unit + '</span>' : '');
      var ok = T.length === 4 && T.every(function (v, k) { return c[k] === v; }), pre = 0;
      for (var k = 0; k < 4 && T.length === 4; k++) { if (c[k] === T[k]) pre = k + 1; else break; }
      DCOL.forEach(function (_, k) { host.classList.toggle('c' + k, pre > k); });
      var over = -1; if (T.length === 4) for (var j = 0; j < 4; j++) if (c[j] > T[j] && !trade) { over = j; break; }
      fb.className = 'bd-fb' + (ok ? ' ok' : ''); fb.textContent = ok ? (host.getAttribute('data-ok') || 'That matches.') : over >= 0 ? 'Too many ' + DCOL[over].n + '. Take one away.' : '';
      if (ok !== !!st.done) { st.done = ok; }
      host.classList.toggle('done', ok);
      ST['disc-' + id] = st; save();
    }
    if (!show) host.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return; var k = +b.closest('.col').getAttribute('data-k'), pop = k;
      if (b.classList.contains('pl')) { if (c[k] >= 19) return; c[k]++; }
      else if (b.classList.contains('mn')) c[k]--;
      else if (b.classList.contains('brk')) { c[k]--; c[k + 1] += 10; pop = k + 1; }
      else if (b.classList.contains('bun')) { c[k] -= 10; c[k - 1]++; pop = k - 1; }
      else return;
      draw(pop); host.dispatchEvent(new CustomEvent('bd-done', { bubbles: true }));
    });
    draw();
  }

  /* ── compare chart: numbers lined up by place; tap places left to right until the digits differ ── */
  var PN = ['ones', 'tenths', 'hundredths', 'thousandths'];
  function Cmp(host) {
    var id = host.id, nums = host.getAttribute('data-nums').split(','), labs = (host.getAttribute('data-labels') || '').split(',');
    var fill = host.hasAttribute('data-fill'), unit = host.getAttribute('data-unit') || '';
    var rows = nums.map(function (n) { var p = n.split('.'); var f = (p[1] || ''); return [p[0]].concat([0, 1, 2].map(function (k) { return f[k] != null ? f[k] : null; })); });
    var blanks = rows.some(function (r) { return r.some(function (d) { return d == null; }); });
    var st = ST['cmp-' + id] || { filled: false, chk: 0 }; if (!fill || !blanks) st.filled = true;
    function dig(r, k) { var d = r[k]; return d == null ? (st.filled ? '0' : null) : d; }
    function need() { var dmax = 0; for (var i = 0; i < rows.length; i++) for (var j = i + 1; j < rows.length; j++) { var d = 4; for (var k = 0; k < 4; k++) { if (+(rows[i][k] || 0) !== +(rows[j][k] || 0)) { d = k; break; } } dmax = Math.max(dmax, d === 4 ? 3 : d); } return dmax + 1; }
    var N = need(), EQ = rows.length === 2 && [0, 1, 2, 3].every(function (k) { return +(rows[0][k] || 0) === +(rows[1][k] || 0); });
    host.innerHTML = '<div class="bd-cgrid" style="grid-template-columns:auto repeat(4,minmax(0,1fr))"><div class="cl"></div>' + PN.map(function (p, k) { return '<button type="button" class="ch ' + ['o', 't', 'h', 'th'][k] + '" data-k="' + k + '">' + p.charAt(0).toUpperCase() + p.slice(1) + (k === 0 ? '<b class="pt">•</b>' : '') + '</button>'; }).join('') +
      rows.map(function (r, i) { return '<div class="cl">' + (labs[i] || '') + '</div>' + [0, 1, 2, 3].map(function (k) { return '<div class="cc ' + ['o', 't', 'h', 'th'][k] + '" data-k="' + k + '" data-r="' + i + '"></div>'; }).join(''); }).join('') + '</div>' +
      '<div class="bd-crow">' + (fill && blanks ? '<button type="button" class="bd-btn ghost zf">✏️ Write a 0 in each empty place</button>' : '') + '<p class="bd-fb" role="status"></p></div>';
    var fb = $('.bd-fb', host), zf = $('.zf', host);
    function draw(msg, bad) {
      $$('.cc', host).forEach(function (c) { var r = rows[+c.getAttribute('data-r')], k = +c.getAttribute('data-k'), d = dig(r, k); c.textContent = d == null ? '' : d; c.classList.toggle('blank', d == null); c.classList.toggle('ghost', r[k] == null && st.filled); });
      $$('.ch', host).forEach(function (b) { var k = +b.getAttribute('data-k'); b.classList.toggle('same', k < st.chk && (k < N - 1 || EQ)); b.classList.toggle('diff', !EQ && k === N - 1 && st.chk >= N); });
      $$('.cc', host).forEach(function (c) { var k = +c.getAttribute('data-k'); c.classList.toggle('same', k < st.chk && (k < N - 1 || EQ)); c.classList.toggle('diff', !EQ && k === N - 1 && st.chk >= N); });
      if (zf) zf.hidden = st.filled;
      host.classList.toggle('filled', !!st.filled); host.classList.toggle('done', st.chk >= N);
      if (msg != null) { fb.className = 'bd-fb' + (bad ? ' bad' : st.chk >= N ? ' ok' : ''); fb.innerHTML = msg; }
      ST['cmp-' + id] = st; save();
    }
    if (zf) zf.addEventListener('click', function () { st.filled = true; draw('Zeros fill the empty places. The values do not change.'); document.dispatchEvent(new CustomEvent('bd-done')); });
    host.addEventListener('click', function (e) {
      var c = e.target.closest('.ch,.cc'); if (!c) return; var k = +c.getAttribute('data-k');
      if (!st.filled) return draw('First write a 0 in each empty place, so every number has the same places.', true);
      if (st.chk >= N) return;
      if (k > st.chk) return draw('Start at the left. Check the ' + PN[st.chk] + ' place first.', true);
      if (k < st.chk) return;
      st.chk++; var ds = rows.map(function (r) { return dig(r, k); });
      var msg = st.chk >= N ? (N === 4 && ds.every(function (d) { return d === ds[0]; }) ? 'Every place is the same. The numbers are equal.' : PN[k].charAt(0).toUpperCase() + PN[k].slice(1) + ': ' + ds.join(', ') + (rows.length > 2 ? '. Now you have checked enough places to put them all in order.' : '. Different! This place decides.'))
        : PN[k].charAt(0).toUpperCase() + PN[k].slice(1) + ': ' + ds.join(', ') + (ds.every(function (d) { return d === ds[0]; }) ? '. Same. Move one place right.' : '. Some are different. Keep going to sort the rest.');
      draw(msg); document.dispatchEvent(new CustomEvent('bd-done'));
    });
    draw(st.chk ? '' : 'Tap a place to compare it.');
  }
  /* ── number line to thousandths: tap where each number goes ── */
  function NLine(host) {
    var id = host.id, lo = Math.round(parseFloat(host.getAttribute('data-lo')) * 1000), hi = Math.round(parseFloat(host.getAttribute('data-hi')) * 1000), unit = host.getAttribute('data-unit') || '';
    var pts = host.getAttribute('data-pts').split(',').map(function (p) { var q = p.split(':'); return { v: Math.round(parseFloat(q[0]) * 1000), s: q[0], lab: q[1] || q[0] }; });
    var st = ST['nl-' + id] || { n: 0 }, span = hi - lo, nar, VW, X0, X1, W, FS, pend = null, COL = ['#1f3f8f', '#b0336a', '#1e8c5a', '#9a6a00'];
    host.innerHTML = '<p class="bd-nlq"></p><svg class="bd-nlsvg" role="application" aria-label="Number line from ' + (lo / 1000) + ' to ' + (hi / 1000) + '. Tap a tick mark."></svg>' +
      '<div class="bd-nlpick" hidden><button type="button" class="bd-btn ghost lt" aria-label="One tick left">◀</button><b class="rd"></b><button type="button" class="bd-btn ghost rt" aria-label="One tick right">▶</button><button type="button" class="bd-btn gold go">Place it ✓</button></div><p class="bd-fb" role="status"></p>';
    var svg = $('svg', host), q = $('.bd-nlq', host), fb = $('.bd-fb', host), pick = $('.bd-nlpick', host);
    function layout() { nar = host.clientWidth > 0 && host.clientWidth < 560; VW = nar ? 520 : 1000; FS = nar ? 1.5 : 1; X0 = nar ? 34 : 40; X1 = VW - X0; W = X1 - X0; svg.setAttribute('viewBox', '0 0 ' + VW + ' 190'); }
    function x(v) { return X0 + (v - lo) / span * W; }
    function fmt(v) { return (v / 1000).toFixed(3); }
    function draw() {
      svg.innerHTML = ''; NS('line', { x1: X0, y1: 110, x2: X1, y2: 110, stroke: '#3a2700', 'stroke-width': 3 }, svg);
      for (var v = lo; v <= hi; v++) { var big = v % 10 === 0, mid = v % 5 === 0; NS('line', { x1: x(v), y1: 110 - (big ? 24 : mid ? 15 : 9), x2: x(v), y2: 110 + (big ? 24 : mid ? 15 : 9), stroke: big ? '#3a2700' : '#8a6417', 'stroke-width': big ? 3 : 1.6 }, svg);
        if (big) NS('text', { x: x(v), y: 162, 'text-anchor': 'middle', 'font-size': 22 * (nar ? 1.15 : 1), 'font-weight': 900, fill: '#3a2700', text: (v / 1000).toFixed(2) }, svg);
        NS('rect', { x: x(v) - W / span / 2, y: 60, width: W / span, height: 100, fill: 'transparent', class: 'tk', 'data-v': v, style: 'cursor:pointer' }, svg); }
      if (pend != null) NS('path', { d: 'M' + x(pend) + ' 104 l-10 -18 h20 z', fill: '#8a8f9c' }, svg);
      pts.slice(0, st.n).forEach(function (p, i) { var c = COL[i % 4], y = i % 2 ? 54 : 30; NS('path', { d: 'M' + x(p.v) + ' 104 l-9 -16 h18 z', fill: c }, svg);
        var tx = Math.min(VW - 70, Math.max(70, x(p.v)));
        NS('text', { x: tx, y: y, 'text-anchor': 'middle', 'font-size': 18 * (nar ? 1.2 : 1), 'font-weight': 900, fill: c, text: p.lab + (p.lab !== p.s ? ' (' + p.s + ')' : '') }, svg);
        NS('line', { x1: x(p.v), y1: y + 6, x2: x(p.v), y2: 86, stroke: c, 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, svg); });
      var cur = pts[st.n]; q.innerHTML = cur ? 'Tap where <b>' + cur.lab + (cur.lab !== cur.s ? ' (' + cur.s + (unit ? ' ' + unit : '') + ')' : '') + '</b> goes.' : 'All placed. The greater number is farther right.';
      pick.hidden = pend == null || st.n >= pts.length; if (pend != null) $('.rd', pick).textContent = fmt(pend);
      host.classList.toggle('done', st.n >= pts.length); ST['nl-' + id] = st; save();
    }
    function place(v) {
      var p = pts[st.n]; if (!p) return;
      if (v === p.v) { st.n++; pend = null; fb.className = 'bd-fb ok'; fb.textContent = p.s + ' is ' + Math.round(v - lo) + ' small ticks past ' + (lo / 1000).toFixed(2) + '.'; draw(); document.dispatchEvent(new CustomEvent('bd-done')); }
      else { fb.className = 'bd-fb bad'; fb.textContent = 'That tick is ' + fmt(v) + '. Each small tick is 0.001. ' + ((p.s.split('.')[1] || '').length < 3 ? 'Write ' + p.s + ' with three places first: ' + fmt(p.v) + '.' : 'Count the small ticks from ' + (Math.floor(p.v / 10) / 100).toFixed(2) + '.'); }
    }
    svg.addEventListener('click', function (e) { var t = e.target.closest('.tk'); if (!t || st.n >= pts.length) return; var v = +t.getAttribute('data-v'); if (nar) { pend = v; fb.textContent = ''; draw(); } else place(v); });
    $('.lt', pick).addEventListener('click', function () { pend = Math.max(lo, pend - 1); draw(); });
    $('.rt', pick).addEventListener('click', function () { pend = Math.min(hi, pend + 1); draw(); });
    $('.go', pick).addEventListener('click', function () { place(pend); });
    layout(); draw(); function sync() { if (!host.clientWidth) return; var o = nar; layout(); if (o !== nar) { pend = null; draw(); } } if ('ResizeObserver' in window) new ResizeObserver(sync).observe(host); addEventListener('resize', sync);
  }

  /* ── rounding line: the two benchmarks at the rounding place, the halfway mark; place the number, pick the nearer benchmark ── */
  function Rnd(host) {
    var id = host.id, P = +host.getAttribute('data-place'), num = host.getAttribute('data-num'), unit = host.getAttribute('data-unit') || '';
    var N = Math.round(parseFloat(num) * 1000), S = Math.pow(10, 3 - P), lo = Math.floor(N / S) * S, hi = lo + S, mid = lo + S / 2, sub = S / 10, tap = N % sub === 0;
    var PNm = ['whole number', 'tenth', 'hundredth'][P];
    var st = ST['rnd-' + id] || { ph: tap ? 0 : 1 }, X0 = 60, X1 = 940, W = X1 - X0;
    function f(v) { return (v / 1000).toFixed(P); }
    function x(v) { return X0 + (v - lo) / S * W; }
    host.innerHTML = '<p class="bd-nlq"></p><svg class="bd-nlsvg" viewBox="0 0 1000 200" role="application" aria-label="Number line from ' + f(lo) + ' to ' + f(hi) + '"></svg>' +
      '<div class="bd-rbtn"><button type="button" class="bd-btn ghost dn"></button><button type="button" class="bd-btn ghost up"></button></div><p class="bd-fb" role="status"></p>';
    var svg = $('svg', host), q = $('.bd-nlq', host), fb = $('.bd-fb', host), dn = $('.dn', host), up = $('.up', host);
    dn.textContent = '◀ Round to ' + f(lo); up.textContent = 'Round to ' + f(hi) + ' ▶';
    function draw() {
      var k = host.clientWidth && host.clientWidth < 560 ? 1.9 : 1; svg.setAttribute('viewBox', '0 0 1000 ' + (k > 1 ? 240 : 200));
      svg.innerHTML = ''; NS('line', { x1: X0, y1: 120, x2: X1, y2: 120, stroke: '#3a2700', 'stroke-width': 4 }, svg);
      for (var i = 0; i <= 10; i++) { var v = lo + i * sub, end = i === 0 || i === 10, half = i === 5;
        NS('line', { x1: x(v), y1: 120 - (end ? 30 : half ? 22 : 12), x2: x(v), y2: 120 + (end ? 30 : half ? 22 : 12), stroke: half ? '#c0392b' : '#3a2700', 'stroke-width': end ? 4 : half ? 3 : 2, 'stroke-dasharray': half ? '6 4' : '' }, svg);
        if (tap && st.ph === 0) NS('rect', { x: x(v) - W / 20, y: 70, width: W / 10, height: 100, fill: 'transparent', class: 'tk', 'data-v': v, style: 'cursor:pointer' }, svg); }
      [lo, hi].forEach(function (v) { NS('text', { x: x(v), y: k > 1 ? 222 : 182, 'text-anchor': 'middle', 'font-size': 30 * k, 'font-weight': 900, fill: '#1F2A44', text: f(v) }, svg); });
      NS('text', { x: x(mid), y: k > 1 ? 222 : 182, 'text-anchor': 'middle', 'font-size': 18 * k, 'font-weight': 800, fill: '#c0392b', text: 'halfway ' + (mid / 1000).toFixed(P + 1) }, svg);
      if (st.ph >= 1) { NS('path', { d: 'M' + x(N) + ' 112 l-12 -22 h24 z', fill: '#1f3f8f' }, svg); NS('text', { x: Math.min(900, Math.max(100, x(N))), y: 60, 'text-anchor': 'middle', 'font-size': 28 * k, 'font-weight': 900, fill: '#1f3f8f', text: num + (unit ? ' ' + unit : '') }, svg); }
      if (st.ph >= 2) { var tgt = N >= mid ? hi : lo; NS('path', { d: 'M' + x(N) + ' 135 Q ' + (x(N) + x(tgt)) / 2 + ' 175 ' + x(tgt) + ' 140', fill: 'none', stroke: '#1e8c5a', 'stroke-width': 4, 'marker-end': '' }, svg); NS('circle', { cx: x(tgt), cy: 120, r: 12, fill: '#1e8c5a' }, svg); }
      q.innerHTML = st.ph === 0 ? 'Tap where <b>' + num + '</b> goes.' : st.ph === 1 ? 'Is ' + num + ' closer to ' + f(lo) + ' or ' + f(hi) + '? Round to the nearest ' + PNm + '.' : num + ' ≈ <b>' + f(N >= mid ? hi : lo) + '</b> (nearest ' + PNm + ')';
      $('.bd-rbtn', host).hidden = st.ph !== 1; host.classList.toggle('done', st.ph >= 2); ST['rnd-' + id] = st; save();
    }
    svg.addEventListener('click', function (e) { var t = e.target.closest('.tk'); if (!t || st.ph !== 0) return; var v = +t.getAttribute('data-v');
      if (v === N) { st.ph = 1; fb.className = 'bd-fb ok'; fb.textContent = num + ' is ' + ((N - lo) / sub) + ' small ticks past ' + f(lo) + '.'; draw(); document.dispatchEvent(new CustomEvent('bd-done')); }
      else { fb.className = 'bd-fb bad'; fb.textContent = 'That tick is ' + (v / 1000).toFixed(P + 1) + '. Count the small ticks from ' + f(lo) + '.'; } });
    function pick(v) { var right = N >= mid ? hi : lo;
      if (v === right) { st.ph = 2; fb.className = 'bd-fb ok'; fb.textContent = N === mid ? num + ' is exactly halfway. We round up to ' + f(hi) + '.' : N > mid ? num + ' is past halfway, so it is closer to ' + f(hi) + '.' : num + ' is before halfway, so it is closer to ' + f(lo) + '.'; draw(); document.dispatchEvent(new CustomEvent('bd-done')); }
      else { fb.className = 'bd-fb bad'; fb.textContent = N === mid ? 'It sits exactly on halfway. When a number is halfway, we round up.' : 'Look at the red halfway mark. Which side of it is ' + num + ' on?'; } }
    dn.addEventListener('click', function () { pick(lo); }); up.addEventListener('click', function () { pick(hi); });
    draw(); if ('ResizeObserver' in window) { var lw = 0; new ResizeObserver(function () { var w = host.clientWidth; if (w && (w < 560) !== (lw < 560 && lw > 0) ) draw(); lw = w; }).observe(host); }
  }

  window.BD = { Hund: Hund, Museum: Museum, helper: helper, Win: Win, Zoom: Zoom, Block: Block, drawSite: drawSite, HEMI: HEMI, Discs: Discs };
  document.addEventListener('DOMContentLoaded', function () {
    shell(); book(); lightbox(); site(); teach(); Build($('#build')); $$('.bd-discs').forEach(Discs); $$('.bd-cmp').forEach(Cmp); $$('.bd-nl').forEach(NLine); $$('.bd-rnd').forEach(Rnd); answers(); selects(); rulers(); stations(); gather(); predictionBack();
    (window.BD_INIT || []).forEach(function (f) { f(); });
    steps(); progress(); ['bd-check'].forEach(function (ev) { document.addEventListener(ev, function () { setTimeout(progress, 50); }); }); ['click', 'change', 'input', 'bd-done'].forEach(function (ev) { document.addEventListener(ev, function () { setTimeout(progress, 50); }, true); });
  });
})();

/* ── click cues + "Start here" (pilot-week feedback, 10 Nov 2026; the same cues as G3 and G4 math) ──────────
   A 5th grader working alone should never wonder what to click, what to read or what comes next:
   1. a key line under the header: hand = you can click it · 🔊 listen · 👉 do this now · 🔒 opens next;
   2. a small hand inside every button; buttons press down; "JOB 1" / "Do" labels are plain text, not pills;
   3. a bouncing hand on the tool the current step uses (gone on the first touch);
   4. "▶ Start here": a drawer at the very top with Hemiunu's how-to video (Opti) and a Show-me-around tour;
   5. a Continue button at the end of the Warm-Up; tabs, Next station and Continue go to the top of the lesson
      inside Canvas too (the lesson sits in a tall iframe, so the Canvas page is what scrolls).
   Nothing new uses position:fixed (in Canvas's tall iframe it would land at the bottom of the lesson). */
(function () {
  'use strict';
  var HAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2.6a1.5 1.5 0 0 1 3 0V10h.6V8.2a1.5 1.5 0 0 1 3 0V10h.6V9.2a1.5 1.5 0 0 1 3 0v1.5h.3a1.4 1.4 0 0 1 2.8 0V16c0 3.6-2.6 6-6 6h-1.6c-2.2 0-3.8-.9-5-2.7l-4.1-5.5a1.6 1.6 0 0 1 2.5-2L9 14.6V2.6z"/></svg>';
  var VID = 'assets/video/g5math-howto.mp4', SEEN = 'g5bd-howto-seen';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function shown(n) { var r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !n.closest('[hidden]'); }
  function seen() { try { return !!localStorage.getItem(SEEN); } catch (e) { return false; } }
  function markSeen() { try { localStorage.setItem(SEEN, '1'); } catch (e) {} }

  function toTop() {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
    try { if (window.top !== window.self) (document.body.firstElementChild || document.body).scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) {}
    try { if (window.parent !== window) window.parent.postMessage(JSON.stringify({ subject: 'lti.scrollToTop' }), '*'); } catch (e) {}
  }
  window.BD_TOTOP = toTop;

  function key() {
    var hd = $('.bd-head'); if (!hd || $('.bd-key')) return;
    var k = el('div', 'bd-key', '<span><i class="bd-key-hand"></i> You can click it.</span><span><b>🔊</b> You can listen.</span>' +
      '<span><b>👉</b> The gold box says what to do now.</span><span><b>🔒</b> The next step opens when you finish this one.</span>');
    hd.parentNode.insertBefore(k, hd.nextSibling);
  }

  /* ▶ Start here: a drawer at the very top, before the book and the Essential Question */
  function start() {
    var k = $('.bd-key'); if (!k || $('.bd-start')) return;
    var d = el('details', 'bd-start');
    d.innerHTML = '<summary><span class="t"><b>▶ Start here:</b> how this works</span><span class="s">New to these lessons? Watch Opti for 1 minute.</span></summary>' +
      '<div class="b"><div class="hv" hidden><video controls playsinline preload="metadata"></video></div>' +
      '<p class="ht">Watch Opti show how a lesson works. Or take the tour and click along.</p>' +
      '<div class="bd-row2"><button type="button" class="bd-btn gold tour-go">🧭 Show me around</button><button type="button" class="bd-btn ghost how-x">Close</button></div></div>';
    k.parentNode.insertBefore(d, k.nextSibling);
    d.open = !seen();
    var v = $('video', d), hv = $('.hv', d);
    v.addEventListener('loadedmetadata', function () { hv.hidden = false; });
    v.addEventListener('play', markSeen);
    v.src = VID; v.poster = VID.replace(/\.mp4$/, '.jpg');
    d.addEventListener('toggle', function () { if (!d.open) { if (!v.paused) v.pause(); markSeen(); } });
    $('.how-x', d).addEventListener('click', function () { d.open = false; });
    $('.tour-go', d).addEventListener('click', function () { d.open = false; tour(); });
  }

  /* the bouncing hand on the tool the current step uses */
  var DRAG = /\b(drag|slide|move)\b/i;
  function target(step) {
    var need = step.getAttribute('data-need'), host = need ? $(need.split('.')[0]) : null;
    var box = host || step;
    var list = ['.bd-rsvg', '.bd-zsvg', 'svg[tabindex]', '[role=application]', '[role=slider]', '[role=button]', '[tabindex="0"]', 'button:not(.hint):not(.bd-tipbtn)'];
    for (var i = 0; i < list.length; i++) { var t = $$(list[i], box).filter(shown)[0]; if (t) return t; }
    return null;
  }
  function place(h) {
    var m = h.parentNode, t = h._t; if (!m || !t || !t.isConnected || !shown(t)) { h.hidden = true; return; }
    var mr = m.getBoundingClientRect(), r = t.getBoundingClientRect(), wide = r.width > 160;
    h.hidden = false; h.style.left = (r.left - mr.left + (wide ? Math.min(60, r.width * .1) : r.width / 2) - 6) + 'px'; h.style.top = (r.top - mr.top + r.height * .45) + 'px';
  }
  function cue() {
    $$('.bd-steps').forEach(function (g) {
      var st = $('.bd-step.now', g), old = $('.bd-hand', g);
      if (!st || !shown(st)) { if (old) old.remove(); return; }
      if (old && old._st === st) { place(old); return; }
      if (old) old.remove();
      if (st._bdTouched) return;
      var t = target(st); if (!t) return;
      if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
      var h = el('span', 'bd-hand' + (DRAG.test(st.getAttribute('data-t') || '') ? ' drag' : ''), HAND); h.setAttribute('aria-hidden', 'true');
      h._t = t; h._st = st; g.appendChild(h); place(h);
      function gone() { st._bdTouched = true; h.remove(); st.removeEventListener('pointerdown', gone, true); st.removeEventListener('keydown', gone, true); }
      st.addEventListener('pointerdown', gone, true); st.addEventListener('keydown', gone, true);
    });
  }

  /* Continue at the end of the Warm-Up (it had none: students had to find the Lesson tab themselves) */
  function cont() {
    var w = $('.bd-panel[data-panel=warmup]'); if (!w || $('.bd-cont', w)) return;
    var b = el('div', 'bd-contw', '<p>Done with the Warm-Up?</p><button type="button" class="bd-btn gold bd-cont">Continue to 📐 Lesson →</button>');
    var credits = $$('details', w).filter(function (d) { return /credit/i.test(d.textContent.slice(0, 40)); })[0];
    w.insertBefore(b, credits || null);
    $('.bd-cont', b).addEventListener('click', function () { var t = $('.bd-tab[data-tab=learn]'); if (t) t.click(); toTop(); });
  }

  function tour() {
    var t0 = $('.bd-tab[data-tab=warmup]'); if (t0) t0.click(); toTop();
    function vis(sel) { return $$(sel).filter(shown)[0]; }
    var S = [
      ['.bd-tabs', 'Your lesson has 3 tabs. Do them in order: <b>Warm-Up</b>, then <b>Lesson</b>, then <b>Show What You Know</b>.'],
      ['.bd-key', 'This key tells you what things mean. <b>See a little hand? You can click it.</b>'],
      ['.bd-chip[data-pop], .bd-chip', 'Press <b>🔊 Read aloud</b> to hear the page read to you.'],
      ['.bd-win .bd-play button', 'Press play to step into the builder\'s window. Then press <b>Next ▶</b> to go on.'],
      ['.bd-step.now .bd-stephd', 'The <b>gold box</b> tells you what to do now. Do one step at a time. The next step opens when you finish.'],
      ['.bd-hand', 'The <b>bouncing hand</b> shows you where to click first.'],
      ['.bd-step.now .hint, button.hint', 'Stuck? Press <b>💡 Hint</b>.'],
      ['.bd-helper .who', 'You can ask Hemiunu, too. Click him for a tip about the part you are on.'],
      ['.bd-cont', 'Done with the Warm-Up? Press <b>Continue</b>. The page goes back to the top for you.'],
      ['.bd-prog', 'This bar fills up as you finish your jobs. You are ready. Let\'s build!']
    ].map(function (s) { return { n: vis(s[0]), t: s[1] }; }).filter(function (s) { return s.n; });
    if (!S.length) return;
    var ring = el('div', 'bd-ring'), tip = el('div', 'bd-tourtip'); ring.setAttribute('aria-hidden', 'true');
    tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-label', 'Lesson tour');
    document.body.appendChild(ring); document.body.appendChild(tip);
    var i = 0;
    function go(k) {
      i = k; var s = S[i], n = s.n, pad = 8, stuck = /sticky|fixed/.test(getComputedStyle(n).position);
      if (stuck) { var ps = n.style.position; n.style.position = 'relative'; n.scrollIntoView({ block: 'center', behavior: 'instant' }); n.style.position = ps; }
      else n.scrollIntoView({ block: 'center', behavior: 'instant' });
      var r = n.getBoundingClientRect(), y = r.top + window.scrollY, x = r.left + window.scrollX;
      ring.style.cssText = 'left:' + (x - pad) + 'px;top:' + (y - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + (r.height + pad * 2) + 'px';
      tip.innerHTML = '<div class="tx"><div class="nn">Tour · ' + (i + 1) + ' of ' + S.length + '</div><p>' + s.t + '</p>' +
        '<div class="bd-row2">' + (i ? '<button type="button" class="bd-btn ghost bk">← Back</button>' : '') +
        '<button type="button" class="bd-btn gold nx">' + (i < S.length - 1 ? 'Next →' : '✓ Done') + '</button>' +
        (i < S.length - 1 ? '<button type="button" class="bd-btn ghost sk">Skip tour</button>' : '') + '</div></div>';
      var below = y + r.height + pad + 14, w = Math.min(420, document.documentElement.clientWidth - 24);
      tip.style.width = w + 'px'; tip.style.left = Math.max(12, Math.min(x, document.documentElement.clientWidth - w - 12)) + 'px'; tip.style.top = below + 'px';
      var th = tip.offsetHeight, docH = document.documentElement.scrollHeight;
      if (below + th > Math.min(docH, window.scrollY + innerHeight) && y - pad - 14 - th > 0) tip.style.top = (y - pad - 14 - th) + 'px';
      try { tip.scrollIntoView({ block: 'nearest', behavior: 'instant' }); } catch (e) {}
      $('.nx', tip).onclick = function () { if (i < S.length - 1) go(i + 1); else end(); };
      if ($('.bk', tip)) $('.bk', tip).onclick = function () { go(i - 1); };
      if ($('.sk', tip)) $('.sk', tip).onclick = end;
      try { $('.nx', tip).focus({ preventScroll: true }); } catch (e) {}
    }
    function esc(e) { if (e.key === 'Escape') end(); }
    function end() { ring.remove(); tip.remove(); document.removeEventListener('keydown', esc); markSeen(); toTop(); }
    document.addEventListener('keydown', esc);
    go(0);
  }
  window.BD_TOUR = tour;

  function init() {
    if (!$('.bd-tabs')) return;
    key(); start(); cont();
    /* tabs, Next station and Continue: the very top of the lesson, in Canvas too */
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.bd-tab, .bd-nextst'); if (!b) return;
      setTimeout(function () { toTop(); cue(); }, 60);
    });
    document.addEventListener('bd-check', function () { setTimeout(cue, 60); });
    document.addEventListener('bd-done', function () { setTimeout(cue, 90); });
    addEventListener('resize', function () { requestAnimationFrame(function () { $$('.bd-hand').forEach(place); }); });
    setTimeout(cue, 300); setTimeout(cue, 1500);
  }
  if (document.readyState === 'complete') setTimeout(init, 150); else window.addEventListener('load', function () { setTimeout(init, 150); });
})();
