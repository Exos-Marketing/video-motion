/* Motor do video.
 *
 * Nada aqui anima sozinho: window.__setTime(t) posiciona TUDO em funcao de t,
 * e o render avanca o relogio quadro a quadro. Por isso nao ha
 * requestAnimationFrame, Date.now() nem Math.random() — so funcoes de t.
 *
 * A orientacao vem da URL (?o=L paisagem 1920x1080, ?o=P retrato 1080x1920).
 * As cenas sao as mesmas; so as posicoes mudam (js/layout_L.js / layout_P.js).
 */
const QS = new URLSearchParams(location.search);
const OR = (QS.get('o') || 'L').toUpperCase();
const W = OR === 'L' ? 1920 : 1080, H = OR === 'L' ? 1080 : 1920;
let FPS = 30;                                       // vem do timeline.json

const COR = [48, 220, 104];                             // cor principal em RGB (scripts/paleta.py troca)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const K = (l, a, d) => clamp((l - a) / d);            // progresso linear 0..1 a partir de a, durando d
const eo = t => 1 - Math.pow(1 - t, 3);               // desacelera
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
const pad = (n, k = 3) => String(n).padStart(k, '0');
const $ = id => document.getElementById(id);
function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function cssv(el, name, def = 0) { const v = parseFloat(getComputedStyle(el).getPropertyValue(name)); return isNaN(v) ? def : v; }

/* entrada padrao de um elemento: sobe, foca e aparece */
function show(el, p, o = {}) {
  const e = eo(p);
  el.style.opacity = p;
  el.style.transform = `translate(${(o.x || 0) * (1 - e)}px,${(o.y ?? 26) * (1 - e)}px) scale(${lerp(o.s ?? .94, 1, e)})`;
  el.style.filter = p < 1 && o.b !== 0 ? `blur(${(1 - p) * (o.b ?? 8)}px)` : 'none';
}
/* palavra gigante batendo na tela */
function slam(el, p, from = 1.5) {
  el.style.opacity = clamp(p * 2.2);
  el.style.transform = `scale(${lerp(from, 1, eo(p))})`;
  el.style.filter = p < 1 ? `blur(${(1 - p) * 16}px)` : 'none';
}

const SC = {};
function def(id, o) { SC[id] = o; }

/* layout do retrato: P(seletor, regra) junta propriedade por propriedade com a regra do paisagem */
function _parse(r) {
  const bang = r[0] === '!', m = new Map();
  (bang ? r.slice(1) : r).split(';').forEach(d => { const i = d.indexOf(':'); if (i > 0) m.set(d.slice(0, i).trim(), d.slice(i + 1).trim()); });
  return { bang, m };
}
function P(sel, rule) {
  const base = LAYOUT[sel] ? _parse(LAYOUT[sel]) : { bang: rule[0] === '!', m: new Map() };
  _parse(rule).m.forEach((v, k) => base.m.set(k, v));
  LAYOUT[sel] = (base.bang ? '!' : '') + [...base.m].map(([k, v]) => `${k}:${v}`).join(';');
}
let TL = null, SCN = [];

/* texto digitado em sincronia com a fala: cada palavra e digitada enquanto e dita */
function typedHTML(sc, a, b, l, lower = false) {
  let out = '';
  for (let i = a; i <= b; i++) {
    const tk = sc.tokens[i];
    const p = K(l, tk.lt, Math.max(.07, (tk.le - tk.lt) * .8));
    if (p <= 0) break;
    let w = lower ? tk.w.toLowerCase() : tk.w;
    const cut = w.slice(0, Math.max(1, Math.round(w.length * p)));
    out += (tk.hl ? `<span class="g">${cut}</span>` : cut) + ' ';
    if (p < 1) break;
  }
  return out;
}

function build() {
  const wrap = $('wrap');
  wrap.style.width = W + 'px'; wrap.style.height = H + 'px'; wrap.classList.add(OR);
  // posicoes da orientacao escolhida viram folha de estilo
  // regra comecando com "!" nao recebe position:absolute (filhos de flex, texto em linha)
  const css = Object.entries(LAYOUT).map(([sel, rule]) => `#wrap ${sel}{${rule[0] === '!' ? rule.slice(1) : 'position:absolute;' + rule}}`).join('\n');
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // grao de filme, com semente fixa
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const cx = cv.getContext('2d'), im = cx.createImageData(256, 256), r = rnd(7);
  for (let i = 0; i < 256 * 256; i++) { const v = r() * 255 | 0; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
  cx.putImageData(im, 0, 0); $('grain').style.backgroundImage = `url(${cv.toDataURL()})`;

  const stage = $('stage');
  SCN = TL.scenes.map(s => {
    const d = SC[s.id] || { html: '', upd() {} };
    const el = document.createElement('div'); el.className = 'sc'; el.id = 'sc' + s.id; el.innerHTML = d.html; stage.appendChild(el);
    s.tokens.forEach(t => { t.lt = t.t - s.t0; t.le = t.e - s.t0; });
    const spans = [];
    el.querySelectorAll('.cap[data-r]').forEach(c => {
      const [a, b] = c.dataset.r.split('-').map(Number);
      for (let i = a; i <= b; i++) {
        const sp = document.createElement('span'); sp.textContent = s.tokens[i].w; if (s.tokens[i].hl) sp.className = 'g';
        c.appendChild(sp); c.appendChild(document.createTextNode(' ')); spans.push({ el: sp, lt: s.tokens[i].lt });
      }
    });
    const cues = {}; s.tokens.forEach(t => { if (t.k) cues[t.k] = t.lt; });
    const sc = { ...s, el, def: d, spans, cues, d: s.t1 - s.t0 };
    if (d.init) d.init(sc);
    return sc;
  });
}

function setTime(t) {
  t = clamp(t, 0, TL.duration - 1e-4);
  const frame = Math.round(t * FPS);
  $('grain').style.backgroundPosition = `${(frame * 37) % 256}px ${(frame * 91) % 256}px`;
  let cur = null;
  $('black').style.opacity = 0;
  for (const sc of SCN) {
    const on = t >= sc.t0 && t < sc.t1;
    if (!on) { sc.el.style.opacity = 0; sc.el.style.visibility = 'hidden'; continue; }
    cur = sc; sc.el.style.visibility = 'visible';
    const l = t - sc.t0, d = sc.d;
    const pin = sc.def.noIn ? 1 : K(l, 0, .15);
    sc.el.style.opacity = sc.def.noIn ? 1 : K(l, 0, .07);
    sc.el.style.transform = `scale(${(1 + .022 * l / d) * lerp(1.045, 1, eo(pin))})`;
    sc.el.style.filter = pin < 1 ? `blur(${(1 - pin) * 9}px)` : 'none';
    for (const sp of sc.spans) {
      const p = K(l, sp.lt - .03, .13);
      sp.el.style.opacity = p;
      sp.el.style.transform = `translateY(${(1 - eo(p)) * 18}px)`;
      sp.el.style.filter = p < 1 ? `blur(${(1 - p) * 7}px)` : 'none';
    }
    const c = { l, d, t, frame, sc, T: k => (k in sc.cues ? sc.cues[k] : 1e9), tok: i => sc.tokens[i].lt };
    sc.def.upd(c);
    const hl = sc.def.hudL, hr = sc.def.hudR;
    $('hudL').textContent = typeof hl === 'function' ? hl(c) : hl || '';
    $('hudR').textContent = typeof hr === 'function' ? hr(c) : hr || '';
    $('hudN').textContent = pad(typeof sc.def.num === 'function' ? sc.def.num(c) : sc.id);
    // corte: clarao e risco de luz
    const amt = sc.def.flash ?? .16, f = sc.def.noIn ? 0 : Math.pow(1 - K(l, 0, .24), 2);
    $('flash').style.opacity = Math.max(f * amt, c.fx || 0);   // c.fx: clarao pedido pela propria cena
    const sk = $('streak'); sk.style.opacity = (sc.def.noIn || amt === 0) ? 0 : (1 - K(l, 0, .32)) * .9;   // flash: 0 = corte seco
    sk.style.top = (20 + ((sc.id * 37) % 60)) + '%'; sk.style.transform = `scaleX(${lerp(.15, 1.3, eo(K(l, 0, .32)))})`;
    $('floor').style.opacity = (sc.def.floor ?? .35);
  }
  const ff = frame % FPS, ss = Math.floor(frame / FPS);
  $('hudRec').textContent = `REC  ${pad(Math.floor(ss / 60), 2)}:${pad(ss % 60, 2)}:${pad(ff, 2)}`;
}

async function boot() {
  TL = await (await fetch('./timeline.json')).json();
  FPS = TL.fps || 30;
  try { window.MAPA = await (await fetch('./assets/mapa.json')).json(); } catch (e) { window.MAPA = { land: [], pts: [] }; }   // so a cena do mapa usa
  build();
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })));
  window.__duration = TL.duration;
  window.__scenes = TL.scenes.map(c => ({ id: c.id, t0: c.t0, t1: c.t1, fim: c.tokens[c.tokens.length - 1].e }));   // o render usa para tirar um quadro por cena
  window.__setTime = setTime;
  setTime(0);
  window.__ready = true;
}
