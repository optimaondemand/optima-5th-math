#!/usr/bin/env python3
"""G5 Math VR kit (On Site with the master builder): weeks/<WW>/week.json -> one page.

  python3 build_vr.py weeks/17/week.json out/G5-Math-Week-17-VR-mockup.html      (mockup: everything inline)
  python3 build_vr.py weeks/17/week.json ../../vr-17.html --repo                  (repo: assets referenced)

Ported 9 Nov 2026 from the G3 math VR kit (optima-3rd-math/tools/vr); that kit is untouched. Repo mode expects:
  assets/vr/base.css (= shared/wf-lesson.css), assets/vr/vr.css, assets/vr/vr.js, assets/vr/optima-logo.png
  <guide.img> (the builder's portrait, already in images/builders/)
  assets/vr-<W>/img/<key>.jpg, assets/vr-<W>/audio/<guide>-<clip>.mp3
  images/vr-canvas-help-*.jpg                           (help drawer, same as G3/G4)
The engine holds no week words. All words live in week.json. Math models are drawn here (draw: b10/digit/point/sign).
"""
import base64, html, json, os, sys

KIT = os.path.dirname(os.path.abspath(__file__))
E = html.escape
PCOL = {1: '#8a5a00', 2: '#1e7a4c', 3: '#b0336a'}  # tenths gold, hundredths green, thousandths pink (as in the G5 lessons)


def kitfile(*cands):
    for c in cands:
        p = os.path.join(KIT, c)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(cands[0])


def b64(path, mime):
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())


def b10svg(kind, w=160, h=120, bg=True, aria=''):
    """Flat = 10 x 10, Rod = 1 x 10, Unit = 1 small cube. Colors match the place colors."""
    c = {'flat': PCOL[1], 'rod': PCOL[2], 'unit': PCOL[3]}[kind]
    s = 7
    out = []
    if kind == 'flat':
        x0, y0 = (w - 10 * s) / 2, (h - 10 * s) / 2
        for r in range(10):
            for q in range(10):
                out.append('<rect x="%.1f" y="%.1f" width="%d" height="%d" fill="%s" stroke="#fff" stroke-width="1"/>' % (x0 + q * s, y0 + r * s, s, s, c))
    elif kind == 'rod':
        x0, y0 = (w - s) / 2, (h - 10 * s) / 2
        for r in range(10):
            out.append('<rect x="%.1f" y="%.1f" width="%d" height="%d" fill="%s" stroke="#fff" stroke-width="1"/>' % (x0, y0 + r * s, s, s, c))
    else:
        out.append('<rect x="%.1f" y="%.1f" width="%d" height="%d" fill="%s" stroke="#fff" stroke-width="1"/>' % ((w - 2 * s) / 2, (h - 2 * s) / 2, 2 * s, 2 * s, c))
    back = '<rect width="%d" height="%d" fill="#FBF6EA"/>' % (w, h) if bg else ''
    return '<svg viewBox="0 0 %d %d" role="img" aria-label="%s">%s%s</svg>' % (w, h, E(aria), back, ''.join(out))


def draw(spec, alt):
    """A clean drawn model for a model card (labeled 'A model' in its alt)."""
    if 'b10' in spec:
        return b10svg(spec['b10'], aria=alt)
    head = '<svg viewBox="0 0 160 120" role="img" aria-label="%s"><rect width="160" height="120" fill="#FBF6EA"/>' % E(alt)
    if 'digit' in spec:
        return head + '<text x="80" y="92" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="88" fill="#0E1C42">%s</text></svg>' % E(spec['digit'])
    if 'point' in spec:
        return head + ('<text x="38" y="92" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="70" fill="#c8c0ad">0</text>'
                       '<rect x="70" y="74" width="18" height="18" fill="#5B6478" stroke="#2b3240" stroke-width="2"/>'
                       '<text x="122" y="92" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="70" fill="#c8c0ad">3</text></svg>')
    s = spec['sign']
    pts = '60,30 104,60 60,90' if s == '>' else '100,30 56,60 100,90'
    return head + '<polyline points="%s" fill="none" stroke="#A8432A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>' % pts


def mini_b10():
    """Small Base 10 pictures for the Drafting Table mat and tray (sized by the engine)."""
    def cells(cols, rows, c):
        return ''.join('<rect x="%d" y="%d" width="7" height="7" fill="%s" stroke="#fff" stroke-width=".8"/>' % (q * 7, r * 7, c) for r in range(rows) for q in range(cols))
    return {'flat': '<svg viewBox="0 0 70 70" aria-hidden="true">%s</svg>' % cells(10, 10, PCOL[1]),
            'rod': '<svg viewBox="0 0 7 70" aria-hidden="true">%s</svg>' % cells(1, 10, PCOL[2]),
            'unit': '<svg viewBox="0 0 7 7" aria-hidden="true">%s</svg>' % cells(1, 1, PCOL[3])}


MARK_SVG = ('<svg viewBox="0 0 60 60" aria-hidden="true"><g transform="rotate(-45 30 30)" fill="#A8432A" stroke="#7a2e1c" stroke-width="1.5" stroke-linejoin="round">'
            '<rect x="25" y="4" width="10" height="22" rx="3"/><path d="M26 27 H34 V46 L30 56 L26 46 Z" fill="#c9653f"/></g></svg>')


def build(week_path, out_path, repo=False):
    wdir = os.path.dirname(os.path.abspath(week_path))
    W = json.load(open(week_path, encoding='utf-8'))
    wk = W['week']
    gd = W['guide']
    gkey = gd['name'].lower()
    credits = json.load(open(os.path.join(wdir, 'credits.json'), encoding='utf-8'))
    used = []

    def img(key):
        if key not in used:
            used.append(key)
        if repo:
            return 'assets/vr-%s/img/%s.jpg' % (wk, key)
        return b64(os.path.join(wdir, 'img', key + '.jpg'), 'image/jpeg')

    def help_img(name):
        if repo:
            return 'images/' + name
        return b64(kitfile('images/' + name, '../../images/' + name), 'image/jpeg')

    clips = {}
    for c in W['voice']:
        p = os.path.join(wdir, 'audio', '%s-%s.mp3' % (gkey, c))
        if os.path.exists(p):
            clips[c] = ('assets/vr-%s/audio/%s-%s.mp3' % (wk, gkey, c)) if repo else b64(p, 'audio/mpeg')

    def play(c):
        if c in clips:
            return '<button class="vr-play" type="button" data-clip="%s" aria-label="Listen to %s">🔊 %s</button>' % (c, E(gd['name']), E(gd['name']))
        return ''

    canvas = E(W['canvasName'])

    # ---------- models ----------
    mb = []
    for g in W['vr']['groups']:
        mb.append('<div class="vr-group"><h4>%s</h4><div class="vr-models">' % E(g['title']))
        for m in g['models']:
            pic = draw(m['draw'], m['alt']) if m.get('draw') else '<img src="%s" alt="%s" loading="lazy">' % (img(m['img']), E(m['alt']))
            cnt = 'pick 1' if m.get('oneOf') else '× %d' % m['count']
            mb.append('<div class="vr-model"><div class="vr-pic">%s<span class="vr-cnt">%s</span></div><div><b>%s</b><small>%s</small>'
                      '<span class="vr-word">%s</span></div></div>' % (pic, cnt, E(m['say']), E(m.get('note', '')), E(m['word'])))
        mb.append('</div></div>')
    models_html = ''.join(mb)
    key_html = '<div class="vr-key">%s</div>' % W['vr']['key'] if W['vr'].get('key') else ''

    # ---------- steps (7; the optional one is not required) ----------
    steps = []
    n = len(W['vr']['steps'])
    for i, s in enumerate(W['vr']['steps']):
        if s.get('where'):
            steps.append('<div class="vr-where">%s</div>' % E(s['where']))
        body = s['html'].replace('@MODELS@', models_html).replace('@KEY@', key_html).replace('@CANVAS@', canvas)
        opt = bool(s.get('optional'))
        steps.append('<div class="vr-step%s" data-step="%d"%s><button class="vr-chk" type="button" aria-label="Mark step %d done" aria-pressed="false"></button>'
                     '<div><div class="sn">Step %d of %d · %s %s</div><div class="st">%s</div></div></div>'
                     % (' opt' if opt else '', i, ' data-optional="1"' if opt else '', i + 1, i + 1, n, E(s['title']), play(s.get('clip', '')), body))

    # ---------- hook: work order ----------
    h = W['hook']
    rows = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in h['rows'])
    hook = ('<div class="wl-card"><div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
            '<div class="vr-order"><div class="hd"><b>%s</b><span>%s</span></div><div class="bd">'
            '<figure><img src="%s" alt="%s"><figcaption>%s</figcaption></figure>'
            '<div><table>%s</table><div class="vr-q"><small>The question</small>%s</div><p style="font-size:15px;margin:10px 0 0">%s</p></div></div></div></div>'
            % (h['look'], E(h['head']), E(h['sub']), img(h['img']), E(h['alt']), E(h['cap']), rows, E(h['q']), E(h['history'])))

    g_img = gd['img'] if repo else b64(kitfile(gd['local']), 'image/webp' if gd['local'].endswith('.webp') else 'image/png')

    def guide(text, clip):
        return ('<div class="wl-opti"><img src="%s" alt="%s"><div class="bub"><b class="who">%s · %s</b>%s %s</div></div>'
                % (g_img, E(gd['alt']), E(gd['name']), E(gd['role']), E(text), play(clip)))

    # ---------- On Site pane ----------
    M = W['mark']
    req = [i for i, s in enumerate(W['vr']['steps']) if not s.get('optional')]
    vr = ('<section class="vr-pane on" id="vr-site" aria-label="On Site">'
          '<div class="wl-card"><div class="vr-kick">On Site · about 15 minutes</div><h3 class="vr-h3">%s</h3>'
          '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
          '<div class="vr-job"><span><span class="n">1</span>Build it in VR</span><i>→</i><span><span class="n">2</span>Take a photo or a 30 second video</span><i>→</i><span><span class="n">3</span>Submit it to Canvas</span></div>'
          '<div class="vr-prog" aria-live="polite"><span id="vr-prog-t">0 of %d steps done</span> · click the box when you finish a step<div class="bar"><i id="vr-prog-b"></i></div></div>'
          '%s'
          '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
          '<label class="vr-done"><input type="checkbox" id="vr-sent"> Submitted!</label>'
          '<div class="vr-badge" id="vr-badge" role="status"><span class="em">%s</span><div><b>%s mason’s mark earned!</b>%s</div></div>'
          '%s</div></section>'
          % (E(W['title']), W['vr']['look'], len(req), ''.join(steps), E(W['vr']['full']), MARK_SVG, E(M['name']), E(M['line']), help_drawer(W, help_img)))

    # ---------- Drafting Table pane ----------
    D = W['drafting']
    P = D['para']
    parts = ''.join('<li>%s</li>' % E(p) for p in P['parts'])
    chips = ''.join('<button type="button">%s</button>' % E(c) for c in P['starters'] + P['words'])
    checks = ('<span data-k="ans">Answer</span><span data-k="nums">Step with numbers</span><span data-k="chk">How you know</span>'
              '<span data-k="mix">Mix-up</span><span data-k="words">2 math words</span><span data-k="sent">5 sentences</span><span data-k="wc">60 words</span>')
    draft = ('<section class="vr-pane" id="vr-draft" aria-label="Drafting Table">'
             '<div class="wl-card"><div class="vr-kick">%s</div><h3 class="vr-h3">%s</h3>%s'
             '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div><div class="wl-do"><b>What to do:</b> %s</div>'
             '<div id="vr-game"></div>'
             '<div id="vr-write" hidden><div class="vr-gstep">✍️ Your math paragraph</div>'
             '<div class="vr-prompt">%s<ol>%s</ol></div>'
             '<div class="vr-chips">%s</div>'
             '<div class="vr-para"><textarea id="vr-para" aria-label="Your math paragraph" placeholder="First I built Chisel A with…"></textarea></div>'
             '<div class="vr-checks" id="vr-checks" aria-live="polite">%s</div>'
             '<div class="vr-count" id="vr-count">0 of %d words</div>'
             '<div class="vr-stamp" id="vr-stamp">✔ %s</div></div>'
             '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
             '<div class="vr-gather"><b>📋 Gathered Answers</b><label style="margin:6px 0;display:block">First name: <input type="text" id="vr-name" maxlength="20" autocomplete="given-name"></label>'
             '<div class="ok-name" id="vr-name-msg"></div>'
             '<pre id="vr-gathered" aria-label="Your gathered answers"></pre>'
             '<div class="vr-lock" id="vr-lock"></div>'
             '<button class="vr-copy" type="button" id="vr-copy" disabled>📋 Copy my answers</button>'
             '<div class="vr-copied" id="vr-copied" aria-live="polite"></div>'
             '<div style="font-size:15.5px">Then open the Canvas assignment, paste into the <b>Text Entry</b> box, and click <b>Submit</b>.</div></div>'
             '</div></section>'
             % (E(D['kicker']), E(D['title']), guide(W['say']['drafting'], 'drafting'), D['look'], E(D['do']),
                P['prompt'], parts, chips, checks, P['minWords'], E(W['seal']), E(D['full'])))

    game = {'type': 'b10', 'places': D['places'], 'pieces': D['pieces'], 'builds': D['builds'], 'eq': D['eq'], 'eqDo': D['eqDo'],
            'signWords': D['signWords'], 'colors': PCOL, 'para': P,
            'svg': mini_b10()}
    cfg = {'pre': W['id'], 'clips': clips, 'game': game, 'canvas': W['canvasName'], 'title': W['title'], 'week': wk, 'req': req,
           'lesson': W['lesson'], 'seal': W['seal'], 'video': 'assets/video/teacher/g5math-vr-%s.mp4' % wk if repo else ''}

    paths = ('<p class="vr-pick"><b>👉 Pick your path:</b> click the one that fits today.</p><div class="vr-paths" role="group" aria-label="Pick your path">'
             '<button class="vr-path" type="button" data-path="vr-site" aria-pressed="true"><span class="ic">🥽</span><span><b>On Site (VR)</b><small>Earn the %s mason’s mark</small></span></button>'
             '<button class="vr-path" type="button" data-path="vr-draft" aria-pressed="false"><span class="ic">📐</span><span><b>No headset today? Drafting Table</b><small>Do it on your computer</small></span></button></div>'
             % E(M['name']))

    video = '<div class="vr-video" id="vr-video" hidden><div class="wl-card"><div class="vr-kick">From your teacher</div><video controls preload="none"></video></div></div>'

    cred = []
    for k in used:
        c = credits[k]
        cred.append('%s: <a href="%s" target="_blank" rel="noopener">%s</a>, %s (%s)'
                    % (E(k), E(c['url']), E(c['title'].replace('File:', '')), E(c['artist'] or 'unknown'), E(c['license'])))
    credits_html = ('<footer class="vr-credits"><b>Picture credits</b> (Wikimedia Commons): ' + '; '.join(cred)
                    + '. Base 10, number and sign pictures are drawn models. %s is an illustration.</footer>' % E(gd['name']))

    logo = 'assets/vr/optima-logo.png' if repo else b64(kitfile('shared/optima-logo.png'), 'image/png')
    header = ('<div class="header"><div class="header-brand"><div class="header-logo"><img src="%s" alt="Optima Academy"></div>'
              '<div><div class="header-org">Optima Academy Online</div><div class="header-sub">An Education Experience Company</div></div></div>'
              '<div class="header-title">%s VR: %s</div><div class="header-badge"><span>%s</span><span>Week %s · On Site with %s</span></div></div>'
              % (logo, E(W['lesson']), E(W['title']), W['emoji'], wk, E(gd['name'])))
    details = ''.join('<span>%s</span>' % E(d) for d in W['details'])
    top = ('<div class="wl-top"><div class="wl-hdr"><button class="wl-pill" id="wl-details-btn" aria-expanded="false">Activity details ▾</button></div>'
           '<div class="wl-details" id="wl-details">%s</div></div>' % details)

    if repo:
        css = '<link rel="stylesheet" href="assets/vr/base.css"><link rel="stylesheet" href="assets/vr/vr.css">'
        js = '<script src="assets/vr/vr.js"></script>'
    else:
        base = open(kitfile('shared/wf-lesson.css'), encoding='utf-8').read()
        css = '<style>%s</style><style>%s</style>' % (base, open(os.path.join(KIT, 'engine', 'vr.css'), encoding='utf-8').read())
        js = '<script>%s</script>' % open(os.path.join(KIT, 'engine', 'vr.js'), encoding='utf-8').read()

    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            '<!-- G5 Math VR · Week %s · built by tools/vr/build_vr.py from weeks/%s/week.json. Edit the JSON, not this file. -->'
            '<title>%s VR · %s</title>%s</head><body class="g5m-vr"><div class="page-wrap">%s%s<main class="vr">%s%s%s%s%s</main>%s</div>'
            '<script>window.VR=%s;</script>%s</body></html>'
            % (wk, wk, E(W['lesson']), E(W['title']), css, header, top, hook, guide(W['say']['brief'], 'brief'), video, paths,
               vr + draft, credits_html, json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/'), js))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(page)
    missing = [k for k in used if k not in credits]
    print('built', out_path, '%.1f MB' % (len(page) / 1e6), 'clips:', len(clips), 'of', len(W['voice']), 'missing credits:', missing)


def help_drawer(W, help_img):
    m = E(W['map'])
    def s(n, img, title, text):
        return '<div class="vr-hs"><img src="%s" alt="%s" loading="lazy"><div class="t"><b class="k">%s</b><b>%s</b><br>%s</div></div>' % (help_img(img), E(title), n, E(title), text)
    return ('<details class="vr-help" id="vr-help"><summary><span>🛟 Having trouble in VR?<small>Steps with pictures, and a how-to video</small></span></summary><div class="in">'
            '<div class="vid"><iframe data-src="https://www.youtube-nocookie.com/embed/slDH-WN4scY?rel=0" title="How-to video: Optima On-Demand and Canvas" allowfullscreen></iframe></div>'
            '<p style="font-size:15px">These pictures come from other maps. Your map will be <b>' + m + '</b>, but the buttons are the same.</p>'
            '<h5>🖥️ First time only: connect Canvas (on your computer)</h5>'
            + s(1, 'vr-canvas-help-01-login.jpg', 'Log in', 'Go to <b>xr.optimaed.com</b>. Log in with your VR login.')
            + s(2, 'vr-canvas-help-02-authorize.jpg', 'Connect to Canvas', 'Click <b>Connect to Canvas</b>. Log in to Canvas, then click <b>Authorize</b>. You will see <b>Canvas connection completed</b>.')
            + s(3, 'vr-canvas-help-03-connected.jpg', 'Find our class', 'Click <b>Canvas</b> on the left and pick our class. You only do this one time.')
            + '<h5>📄 Only if the assignment has a file</h5>'
            + s(4, 'vr-canvas-help-04-upload.jpg', 'Get the file ready', 'Open the assignment. Click <b>Open in Canvas</b> to download the file. Then click <b>My Files</b> and <b>Upload File</b>.')
            + '<h5>🥽 In the headset</h5>'
            + s(5, 'vr-canvas-help-05-explore.jpg', 'Explore tab', 'Click <b>Explore</b>. Type the map name in <b>Filter environments</b>.')
            + s(6, 'vr-canvas-help-06-begin-solo.jpg', 'Begin Solo', 'Click the map, then click <b>Begin Solo</b>.')
            + s(7, 'vr-canvas-help-07-canvas.jpg', 'Read the assignment', 'Press the <b>top button on your right controller</b>. Click the <b>Canvas</b> tab and pick our assignment. Tip: point at a mint side grip and squeeze to pull the tablet to your hand.')
            + s(8, 'vr-canvas-help-08-models.jpg', 'Bring out the models', 'Click <b>Models</b>. Type the gray word in the search box. Click a model to bring it out.')
            + s(9, 'vr-canvas-help-08b-move.jpg', 'Move and resize', 'Grab a model with the <b>palm trigger</b>. Use <b>both</b> palm triggers to make it bigger or smaller.')
            + s(10, 'vr-canvas-help-09-placed.jpg', 'Need a file?', 'Click <b>Library</b>, then <b>Files</b>. Pick your file to place it.')
            + s(11, 'vr-canvas-help-10-camera.jpg', 'Take a photo or record a video', 'Click <b>Library</b>, then <b>Camera</b>. Move the tablet until your build fits. Click <b>Take photo</b>, or switch to <b>Video</b> and record up to 30 seconds.')
            + s(12, 'vr-canvas-help-11-choose.jpg', 'Pick your photo or video', 'Click the <b>Canvas</b> tab and pick our assignment. Click <b>Choose from My Files</b>, pick your newest photo or video, then <b>Use this file</b>.')
            + s(13, 'vr-canvas-help-12-submitted.jpg', 'Submit to Canvas', 'Click <b>Submit to Canvas</b>. Look for the green <b>Submitted</b> tag. To leave, press the <b>Meta button</b>, then click <b>Quit</b>.')
            + '<h5>🔁 Didn’t work in VR? Two other ways</h5>'
            + s(14, 'vr-canvas-help-13-portal-submit.jpg', 'Use the website', 'Go to <b>xr.optimaed.com</b> and click <b>Canvas</b>. Pick our assignment, click <b>Choose from My Files</b>, pick your photo or video and submit it.')
            + '<p style="font-size:15px">Your photos and videos save to <b>My Files</b> at xr.optimaed.com. You can also download yours there and upload it to the Canvas assignment yourself.</p>'
            '</div></details>')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0], a[1], repo='--repo' in sys.argv)
