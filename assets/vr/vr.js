/* G5 Math VR · On Site engine (ported from the G3 math VR kit). No week words: everything comes from window.VR (built from week.json). */
(function () {
  var V = window.VR || {}, G = V.game || {}, PRE = V.pre || 'g5math-vr';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function load() { try { return JSON.parse(localStorage.getItem(PRE) || '{}'); } catch (e) { return {}; } }
  var st = load();
  st.steps = st.steps || [];
  st.g = st.g || { k: 0, cnt: [], eq: '', built: [], eqDone: '' };
  st.para = st.para || '';
  function save() { try { localStorage.setItem(PRE, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function words(s) { return (String(s).match(/[A-Za-z0-9’']+(?:[.,][0-9]+)*/g) || []).length; }

  /* details pill */
  var db = $('#wl-details-btn'), dd = $('#wl-details');
  if (db && dd) db.addEventListener('click', function () { var o = dd.classList.toggle('open'); db.setAttribute('aria-expanded', o); });

  /* audio */
  var audio = null, playing = null;
  $$('.vr-play').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-clip');
      if (audio) { audio.pause(); }
      $$('.vr-play').forEach(function (x) { x.classList.remove('on'); });
      if (playing === b) { playing = null; return; }
      audio = new Audio(V.clips[c]); playing = b; b.classList.add('on');
      audio.onended = function () { b.classList.remove('on'); playing = null; };
      audio.play().catch(function () { b.classList.remove('on'); });
    });
  });

  /* teacher video: shown only when the file exists */
  if (V.video && window.fetch) {
    fetch(V.video, { method: 'HEAD' }).then(function (r) {
      if (r.ok) { var w = $('#vr-video'); $('video', w).src = V.video; w.hidden = false; }
    }).catch(function () {});
  }

  /* path toggle */
  function showPath(id) {
    $$('.vr-path').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-path') === id); });
    $$('.vr-pane').forEach(function (p) { p.classList.toggle('on', p.id === id); });
    st.path = id; save();
  }
  $$('.vr-path').forEach(function (b) {
    b.addEventListener('click', function () {
      showPath(b.getAttribute('data-path'));
      var p = $('#' + b.getAttribute('data-path')); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (st.path && $('#' + st.path)) showPath(st.path);

  /* checklist: required steps come from V.req; the optional Extra never blocks the mark */
  var steps = $$('.vr-step'), REQ = V.req || steps.map(function (s, i) { return i; });
  function paintSteps() {
    var n = 0;
    steps.forEach(function (s, i) {
      var d = !!st.steps[i]; if (d && REQ.indexOf(i) >= 0) n++;
      s.classList.toggle('done', d);
      var b = $('.vr-chk', s); b.textContent = d ? '✓' : ''; b.setAttribute('aria-pressed', d);
    });
    var t = $('#vr-prog-t'), bar = $('#vr-prog-b');
    if (t) t.textContent = n + ' of ' + REQ.length + ' steps done';
    if (bar) bar.style.width = (100 * n / REQ.length) + '%';
    var sent = $('#vr-sent'); if (sent) sent.checked = !!st.sent;
    var bd = $('#vr-badge'); if (bd) bd.classList.toggle('on', n === REQ.length && !!st.sent);
  }
  steps.forEach(function (s, i) {
    $('.vr-chk', s).addEventListener('click', function () { st.steps[i] = !st.steps[i]; save(); paintSteps(); });
  });
  var sent = $('#vr-sent');
  if (sent) sent.addEventListener('change', function () {
    st.sent = sent.checked;
    if (sent.checked) REQ.forEach(function (i) { st.steps[i] = true; });
    save(); paintSteps();
  });
  paintSteps();

  /* help drawer: load the video only when opened */
  var help = $('#vr-help');
  if (help) help.addEventListener('toggle', function () {
    if (!help.open) return;
    var f = $('iframe[data-src]', help); if (f && !f.src) f.src = f.getAttribute('data-src');
  });

  /* ---------- Drafting Table: Base 10 mat + tile equation (game type "b10") ----------
     Stage k < builds.length: build that number on the place value mat (pick a piece, tap or drag it to its column, Check).
     Stage k = builds.length: write the comparison with the keys (digits, point, signs), Check.
     One step shows at a time. Feedback names the mistake and asks a question; it never shows the answer. */
  var game = $('#vr-game'), B = G.builds || [], PL = G.places || [], PC = G.pieces || [];
  function digitsOf(num) { var p = String(num).split('.'), f = (p[1] || '') + '000'; return [+p[0] || 0, +f[0], +f[1], +f[2]]; }
  function fromCounts(c) {
    var s = (c[0] || 0) + '.' + (c[1] || 0) + (c[2] || 0) + (c[3] || 0);
    return s.replace(/0+$/, '').replace(/\.$/, '');
  }
  function pieceFor(p) { for (var i = 0; i < PC.length; i++) if (PC[i].p === p) return PC[i]; return null; }
  function placeWord(p, n) { var pc = pieceFor(p); return pc ? (n === 1 ? pc.one : pc.many) : PL[p].toLowerCase(); }
  function describe(c) {
    return PC.map(function (pc) { return (c[pc.p] || 0) + ' ' + ((c[pc.p] || 0) === 1 ? pc.one : pc.many); }).join(', ');
  }
  function gameDone() { return st.g.k > B.length; }
  var sel = PC.length ? PC[0].p : 1, history = [];

  function render() {
    var g = st.g;
    if (gameDone()) return renderDone();
    $('#vr-write').hidden = true;
    var total = B.length + 1, h = '';
    if (g.k < B.length) {
      var b = B[g.k], c = g.cnt[g.k] = g.cnt[g.k] || [0, 0, 0, 0];
      h += '<div class="vr-gstep">Step ' + (g.k + 1) + ' of ' + total + ' · ' + esc(b.label) + '</div>' +
        '<div class="pg-do">👉 Build <b>' + esc(b.label) + ', ' + esc(b.num) + ' m</b>, on the mat.</div><div class="bt-mat">';
      PL.forEach(function (name, p) {
        var pcs = '';
        if (p > 0) for (var i = 0; i < (c[p] || 0); i++) pcs += G.svg[['', 'flat', 'rod', 'unit'][p]].replace('<svg ', '<svg width="' + (p === 1 ? 40 : p === 2 ? 6 : 10) + '" height="' + (p === 3 ? 10 : 40) + '" ');
        h += '<div class="bt-col" data-p="' + p + '" role="button" tabindex="' + (p ? 0 : -1) + '" aria-label="' + esc(name) + ' column"><div class="hd">' + esc(name) + '</div><div class="pcs">' + pcs + '</div><div class="n">' + (p ? (c[p] || 0) : digitsOf(b.num)[0]) + '</div></div>';
      });
      h += '</div><div class="bt-tray">' + PC.map(function (pc) {
        var k = ['', 'flat', 'rod', 'unit'][pc.p];
        return '<button type="button" class="bt-pc" data-p="' + pc.p + '" aria-pressed="' + (sel === pc.p) + '">' + G.svg[k].replace('<svg ', '<svg width="' + (pc.p === 1 ? 34 : pc.p === 2 ? 5 : 12) + '" height="' + (pc.p === 3 ? 12 : 34) + '" ') + '<span>' + esc(pc.name) + '<br><small>1 ' + esc(pc.one) + '</small></span></button>';
      }).join('') + '</div><div class="bt-row"><button type="button" class="bt-act" id="bt-undo">Take one off</button><button type="button" class="bt-act" id="bt-clear">Clear the mat</button><button type="button" class="bt-go" id="bt-check">Check this chisel ✓</button></div>';
    } else {
      h += '<div class="vr-gstep">Step ' + total + ' of ' + total + ' · Write the comparison</div>' +
        '<div class="pg-do">👉 ' + esc(G.eqDo) + '</div>' +
        '<div class="eq-line" id="eq-line" aria-live="polite"></div>' +
        '<div class="eq-keys">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '<', '>', '='].map(function (k) {
          return '<button type="button" data-k="' + esc(k) + '" class="' + (/[<>=]/.test(k) ? 's' : '') + '" aria-label="' + esc(k === '.' ? 'decimal point' : (G.signWords[k] || k)) + '">' + esc(k) + '</button>';
        }).join('') + '</div><div class="bt-row"><button type="button" class="bt-act" id="eq-back">⌫ Back</button><button type="button" class="bt-act" id="eq-clear">Clear</button><button type="button" class="bt-go" id="eq-check">Check my comparison ✓</button></div>';
    }
    h += '<div class="vr-fb" id="vr-fb" aria-live="polite"></div>';
    game.innerHTML = h;
    if (g.k < B.length) wireMat(); else wireEq();
  }
  function say(cls, t) { var fb = $('#vr-fb'); fb.className = 'vr-fb ' + cls; fb.textContent = t; }

  function wireMat() {
    var g = st.g, b = B[g.k], c = g.cnt[g.k];
    $$('.bt-pc', game).forEach(function (btn) {
      btn.addEventListener('click', function () { if (dragMoved) return; sel = +btn.getAttribute('data-p'); $$('.bt-pc', game).forEach(function (x) { x.setAttribute('aria-pressed', x === btn); }); say('', 'Now tap the column where a ' + pieceFor(sel).name + ' goes.'); });
      dragify(btn, function (x, y) { return colAt(x, y); }, function (col) { sel = +btn.getAttribute('data-p'); put(col); });
    });
    $$('.bt-col', game).forEach(function (col) {
      var p = +col.getAttribute('data-p'); if (!p) return;
      col.addEventListener('click', function () { put(col); });
      col.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); put(col); } });
    });
    function put(col) {
      var p = +col.getAttribute('data-p'), pc = pieceFor(sel);
      if (!p) return;
      if (p !== sel) {
        col.classList.remove('bad'); void col.offsetWidth; col.classList.add('bad');
        say('no', 'A ' + pc.name + ' is 1 ' + pc.one + '. It goes in the ' + PL[sel] + ' column.'); return;
      }
      if ((c[p] || 0) >= 9) { say('no', 'That column has 9. Ten ' + pc.many + ' would make 1 ' + placeWord(p - 1, 1) + ', so 9 is the most a place can hold.'); return; }
      c[p] = (c[p] || 0) + 1; history.push(p); save(); render();
      say('', 'The mat shows ' + fromCounts(c) + ' m so far.');
    }
    $('#bt-undo').addEventListener('click', function () {
      var p = history.pop(); if (p === undefined) { for (p = 3; p > 0 && !c[p]; p--); }
      if (p > 0 && c[p] > 0) { c[p]--; save(); render(); say('', 'The mat shows ' + fromCounts(c) + ' m so far.'); }
    });
    $('#bt-clear').addEventListener('click', function () { g.cnt[g.k] = [0, 0, 0, 0]; history = []; save(); render(); });
    $('#bt-check').addEventListener('click', function () {
      var want = digitsOf(b.num), built = fromCounts(c);
      var same = true; for (var p = 1; p <= 3; p++) if ((c[p] || 0) !== want[p]) same = false;
      if (same) {
        g.built[g.k] = c.slice(); say('ok', 'Yes! The mat shows ' + b.num + ' m: ' + describe(c) + '.');
        $$('button', game).forEach(function (x) { x.disabled = true; });
        setTimeout(function () { g.k++; history = []; save(); render(); }, 1600); return;
      }
      var shifted = (c[1] || 0) === 0 && (c[2] || 0) === want[1] && (c[3] || 0) === want[2] && want[3] === 0 && want[1] > 0;
      if (!(c[1] || c[2] || c[3])) { say('no', 'The mat is empty. Start with the tenths: how many tenths does ' + b.num + ' have?'); return; }
      if (shifted) { say('no', 'Your mat shows ' + built + ' m. In ' + b.num + ', the first digit after the decimal point is the tenths digit. Which piece is 1 tenth?'); return; }
      for (p = 1; p <= 3; p++) {
        var have = c[p] || 0;
        if (have !== want[p]) {
          if (have > want[p]) say('no', 'Too many in the ' + PL[p] + ' column. Read the ' + placeWord(p, 1) + ' digit of ' + b.num + ' again.');
          else say('no', 'The ' + PL[p] + ' column needs more. Read the ' + placeWord(p, 1) + ' digit of ' + b.num + ' again.');
          var col = $('.bt-col[data-p="' + p + '"]', game); col.classList.remove('bad'); void col.offsetWidth; col.classList.add('bad');
          return;
        }
      }
    });
  }
  function colAt(x, y) {
    var cols = $$('.bt-col', game);
    for (var i = 0; i < cols.length; i++) { var r = cols[i].getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return cols[i]; }
    return null;
  }

  function spaced(s) { return String(s || '').replace(/\s*([<>=])\s*/, ' $1 '); }
  function eqHTML(s, done) {
    return s.split('').map(function (ch) { return '<span class="c' + (ch === '.' ? ' pt' : '') + '">' + esc(ch) + '</span>'; }).join('') + (done ? '' : '<span class="cur"></span>');
  }
  function num(s) { return s === '' || s === '.' ? NaN : parseFloat(s); }
  function wireEq() {
    var g = st.g, line = $('#eq-line');
    function paint() { line.innerHTML = eqHTML(g.eq || '', false); }
    function key(k) { if ((g.eq || '').length >= 14) return; g.eq = (g.eq || '') + k; save(); paint(); say('', ''); }
    $$('.eq-keys button', game).forEach(function (b) {
      b.addEventListener('click', function () { if (!dragMoved) key(b.getAttribute('data-k')); });
      dragify(b, function (x, y) { var r = line.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? line : null; }, function () { key(b.getAttribute('data-k')); });
    });
    $('#eq-back').addEventListener('click', function () { g.eq = (g.eq || '').slice(0, -1); save(); paint(); });
    $('#eq-clear').addEventListener('click', function () { g.eq = ''; save(); paint(); });
    $('#eq-check').addEventListener('click', function () {
      var s = g.eq || '', E = G.eq, A = num(E.a), Bn = num(E.b);
      line.classList.remove('bad');
      var m = s.match(/^([0-9]*\.?[0-9]*)([<>=])([0-9]*\.?[0-9]*)$/);
      function bad(t) { void line.offsetWidth; line.classList.add('bad'); say('no', t); }
      if (!m || !m[1] || !m[3]) return bad('Write both chisel lengths with one sign between them.');
      if (/^\./.test(m[1]) || /^\./.test(m[3])) return bad('A decimal less than 1 starts with a 0 in the ones place. Write the 0 before the decimal point.');
      if ((m[1].match(/\./g) || []).length > 1 || (m[3].match(/\./g) || []).length > 1) return bad('Each length has only one decimal point.');
      var x = num(m[1]), y = num(m[3]);
      var pair = (x === A && y === Bn) || (x === Bn && y === A);
      if (!pair) return bad('Use the two chisel lengths you built: ' + E.a + ' m and ' + E.b + ' m.');
      var truth = x < y ? '<' : (x > y ? '>' : '=');
      if (m[2] !== truth) return bad('Your sign says ' + m[1] + ' ' + G.signWords[m[2]] + ' ' + m[3] + '. Line up the places and compare from the left. Which place is the first one that is different?');
      g.eqDone = s; line.classList.add('ok'); line.innerHTML = eqHTML(s, true);
      say('ok', 'Yes! ' + m[1] + ' ' + G.signWords[m[2]] + ' ' + m[3] + '.');
      $$('button', game).forEach(function (b) { b.disabled = true; });
      setTimeout(function () { g.k++; save(); render(); }, 1600);
    });
    paint();
  }
  function renderDone() {
    var g = st.g;
    game.innerHTML = '<div class="bt-sum">' + B.map(function (b, i) {
      return '<div><b>' + esc(b.label) + ':</b> ' + esc(describe(g.built[i] || [])) + ' → ' + esc(b.num) + ' m</div>';
    }).join('') + '<div><b>My comparison:</b> <span style="font:900 22px Nunito,Arial">' + esc(spaced(g.eqDone)) + '</span></div></div>' +
      '<div class="vr-fb ok">Both chisels and the comparison are done. Now write your math paragraph.</div>';
    $('#vr-write').hidden = false; checkPara();
  }

  var dragMoved = false;
  function dragify(el, over, drop) {
    el.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      var sx = e.clientX, sy = e.clientY, ghost = null; dragMoved = false;
      function mv(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!ghost && Math.abs(dx) + Math.abs(dy) > 8) {
          dragMoved = true; ghost = el.cloneNode(true); ghost.className += ' pg-ghost'; ghost.removeAttribute('id');
          document.body.appendChild(ghost);
        }
        if (ghost) {
          ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; ev.preventDefault();
          $$('.bt-col', game).forEach(function (c) { c.classList.remove('hot'); }); var t = over(ev.clientX, ev.clientY); if (t && t.classList.contains('bt-col')) t.classList.add('hot');
        }
      }
      function up(ev) {
        document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (ghost) {
          ghost.remove(); $$('.bt-col', game).forEach(function (c) { c.classList.remove('hot'); });
          var t = over(ev.clientX, ev.clientY); if (t) drop(t); setTimeout(function () { dragMoved = false; }, 0);
        }
      }
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
    });
  }

  /* ---------- the math paragraph: live checks for each part ---------- */
  var P = G.para || {}, ta = $('#vr-para');
  function sentences(t) {
    return String(t).replace(/(\d)\.(\d)/g, '$1,$2').replace(/(^|\s)\.(\d)/g, '$1,$2').split(/[.!?]+/).filter(function (x) { return words(x) >= 3; });
  }
  function paraChecks() {
    var t = (ta && ta.value) || '', low = t.toLowerCase(), E = G.eq || {};
    function has(n) { var v = parseFloat(n); return (t.match(/\d*\.\d+|\d+/g) || []).some(function (x) { return parseFloat(x) === v; }); }
    var ss = sentences(t);
    var r = {
      ans: has(E.a) && has(E.b) && /(<|>|less than|greater than|longer|shorter|bigger|smaller)/i.test(t),
      nums: ss.some(function (s) { return /\d/.test(s) && /(tenth|hundredth|thousandth|flat|rod|unit)/i.test(s); }),
      chk: /(i know|know it|check|lined? up|line them up|compar|from the left)/i.test(t),
      mix: /(someone|somebody|might think|could think|mix.?up|mistake|wrong|might say|could say)/i.test(t),
      words: (P.words || []).filter(function (w) { return low.indexOf(w) >= 0; }).length >= 2,
      sent: ss.length >= (P.minSent || 5),
      wc: words(t) >= (P.minWords || 60)
    };
    r.all = r.ans && r.nums && r.chk && r.mix && r.words && r.sent && r.wc;
    return r;
  }
  function checkPara() {
    var r = paraChecks();
    $$('#vr-checks span').forEach(function (s) { s.classList.toggle('ok', !!r[s.getAttribute('data-k')]); });
    var n = words(ta ? ta.value : ''), c = $('#vr-count');
    if (c) { c.textContent = n >= P.minWords ? n + ' words ✓' : n + ' of ' + P.minWords + ' words'; c.classList.toggle('ok', n >= P.minWords); }
    var s = $('#vr-stamp'); if (s) s.classList.toggle('on', gameDone() && r.all);
    gather();
  }
  if (ta) {
    ta.value = st.para;
    ta.addEventListener('input', function () { st.para = ta.value; save(); checkPara(); });
  }
  $$('#vr-write .vr-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!ta) return;
      ta.value = (ta.value && !/\s$/.test(ta.value) ? ta.value + ' ' : ta.value) + b.textContent;
      ta.dispatchEvent(new Event('input')); ta.focus();
    });
  });

  /* first name with a kind filter */
  var BAD = /(stupid|dumb|idiot|hate|kill|poop|butt|fart|ugly|loser|sex|damn|hell|crap|shit|fuck|bitch|ass\b)/i;
  var nm = $('#vr-name'), nmMsg = $('#vr-name-msg');
  function nameOk() { return !!(st.name && st.name.trim()); }
  if (nm) {
    nm.value = st.name || '';
    nm.addEventListener('input', function () {
      var v = nm.value.trim();
      if (BAD.test(v) || /[^A-Za-zÀ-ÿ' -]/.test(v)) { nmMsg.textContent = 'Please type just your first name.'; st.name = ''; }
      else { nmMsg.textContent = ''; st.name = v; }
      save(); gather();
    });
  }

  /* Gathered Answers: plain text that pastes well into the Canvas Text Entry box. Copy stays locked until it is all done. */
  function gatherText() {
    var g = st.g, r = paraChecks(), lines = [];
    lines.push(V.canvas + ' (Drafting Table)');
    lines.push('Name: ' + (st.name || ''));
    lines.push('');
    B.forEach(function (b, i) { lines.push(b.label + ': ' + (g.built[i] ? describe(g.built[i]) + ' → ' + b.num + ' m' : 'not built yet')); });
    lines.push('My comparison: ' + (g.eqDone ? spaced(g.eqDone) : 'not done yet'));
    lines.push('');
    lines.push('My math paragraph (' + words(st.para) + ' words, ' + sentences(st.para).length + ' sentences):');
    lines.push(st.para || '(not written yet)');
    lines.push('');
    if (gameDone() && r.all) lines.push(V.seal + ' earned');
    return lines.join('\n');
  }
  function gather() {
    var pre = $('#vr-gathered'), btn = $('#vr-copy'), lock = $('#vr-lock'); if (!pre) return;
    pre.textContent = gatherText();
    var need = [];
    if (!gameDone()) need.push('finish the chisels and the comparison');
    if (!paraChecks().all) need.push('light up every paragraph check');
    if (!nameOk()) need.push('type your first name');
    btn.disabled = need.length > 0;
    lock.textContent = need.length ? '🔒 To unlock Copy: ' + need.join(', ') + '.' : '🔓 Ready to copy.';
  }
  var cp = $('#vr-copy');
  if (cp) cp.addEventListener('click', function () {
    if (cp.disabled) return;
    var txt = gatherText(), done = function () { $('#vr-copied').textContent = 'Copied! Now paste it into the Canvas text box and click Submit.'; };
    function fallback() {
      var t = document.createElement('textarea'); t.value = txt; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { $('#vr-copied').textContent = 'Select the text in the box above and copy it.'; }
      t.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
  });

  if (game) render();
  checkPara();
  window.VR_TEST = { state: st, render: render, gatherText: gatherText, paraChecks: paraChecks };
})();
