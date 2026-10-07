/* Cenas 1 a 7. Posicoes ficam no layout; aqui so o que cada elemento FAZ no tempo. */

const ICO = {
  cam: '<svg viewBox="0 0 120 120" class="ico"><rect x="10" y="36" width="68" height="50" rx="9"/><path d="M78 54l32-16v46l-32-16z"/><circle cx="44" cy="61" r="12"/></svg>',
  edit: '<svg viewBox="0 0 120 120" class="ico"><path d="M10 34h58M30 60h80M10 86h44"/><path d="M64 16v88" stroke="#fff"/></svg>',
  des: '<svg viewBox="0 0 120 120" class="ico"><path d="M14 100C28 28 92 28 106 100"/><circle cx="14" cy="100" r="7"/><circle cx="106" cy="100" r="7"/><rect x="52" y="38" width="16" height="16" stroke="#fff"/></svg>',
  doc: '<svg viewBox="0 0 120 120" class="ico"><path d="M28 12h46l22 22v74H28z"/><path d="M44 52h34M44 70h34M44 88h20"/></svg>',
  mic: '<svg viewBox="0 0 120 120" class="ico"><rect x="44" y="12" width="32" height="56" rx="16"/><path d="M26 56c0 22 16 34 34 34s34-12 34-34M60 90v20"/></svg>',
  cc: '<svg viewBox="0 0 120 120" class="ico"><rect x="10" y="26" width="100" height="68" rx="10"/><path d="M30 60h26M66 60h24M30 78h44"/></svg>',
  exp: '<svg viewBox="0 0 120 120" class="ico"><path d="M60 14v62M36 40l24-26 24 26M18 78v26h84V78"/></svg>',
  play: '<svg viewBox="0 0 120 120" class="ico"><circle cx="60" cy="60" r="46"/><path d="M50 40l30 20-30 20z" fill="#30DC68"/></svg>',
  globe: '<svg viewBox="0 0 120 120" class="ico" style="stroke-width:3.5"><circle cx="60" cy="60" r="46"/><ellipse cx="60" cy="60" rx="20" ry="46"/><path d="M14 60h92M22 36h76M22 84h76"/></svg>',
};

/* ---------- 1 · E se eu te dissesse que da pra criar um VIDEO DESSE NIVEL ---------- */
def(1, { hudL: 'ESCRITO EM CÓDIGO', hudR: () => `30 FPS · ${W}×${H}`, flash: 0, floor: .2,
  html: `<div class="cap thin" id="s1a" data-r="0-4"></div><div id="s1spark"></div>
<div class="ln" id="s1vl"></div><div class="ln" id="s1hl"></div>
<div id="s1ret"><svg viewBox="-120 -120 240 240"><circle r="46" class="st"/><circle r="104" class="st dash" id="s1ring"/><circle r="6" fill="#30DC68"/></svg></div>
<div class="lbl" id="s1xy">X 0778&nbsp;&nbsp;Y 0663</div>
<div class="cap" id="s1b" data-r="5-9"></div>
<div class="big glow g" id="s1v">VÍDEO</div><div class="big" id="s1d">DESSE</div><div class="big" id="s1n">NÍVEL</div>`,
  upd({ l, T, tok }) {
    const tq = tok(5), tb = T('big1');
    const a = $('s1a'); a.style.opacity = 1 - K(l, tq - .06, .16); a.style.transform = `translateY(${-34 * eo(K(l, tq - .06, .2))}px)`;
    const sp = $('s1spark'); sp.style.opacity = (l < tq ? 1 : 0) * K(l, .05, .1);
    sp.style.transform = `translateX(${cssv(sp, '--w', 700) * K(l, tok(0), tok(4) - tok(0) + .3)}px)`;
    const pv = eo(K(l, tq - .05, .5)), dim = 1 - .75 * K(l, tb, .2), on = K(l, tq - .05, .1);
    const vl = $('s1vl'), hl = $('s1hl');
    vl.style.transform = `translateX(${lerp(cssv(vl, '--d', -600), 0, pv)}px)`; vl.style.opacity = .6 * on * dim;
    hl.style.transform = `translateY(${lerp(cssv(hl, '--d', -400), 0, pv)}px)`; hl.style.opacity = .6 * on * dim;
    const r = $('s1ret'); r.style.opacity = K(l, tq + .12, .15) * dim; r.style.transform = `scale(${lerp(.3, 1, eo(K(l, tq + .12, .35)))})`;
    $('s1ring').setAttribute('transform', `rotate(${l * 50})`);
    $('s1xy').style.opacity = K(l, tq + .25, .15) * dim;
    $('s1b').style.opacity = 1;
    slam($('s1v'), K(l, tb - .02, .22), 1.45);
    show($('s1d'), K(l, T('big2') - .02, .16), { y: 50, s: 1 });
    show($('s1n'), K(l, T('big3') - .02, .16), { y: 50, s: 1 });
  } });

/* ---------- 2 · sem camera, sem editor e sem designer? ---------- */
def(2, { hudL: c => `PROGRAMAS · ${3 - ['cam', 'edit', 'des'].filter(k => c.l > c.T(k) + .3).length}`, hudR: 'CÂMERAS · 0',
  html: `<div class="cap" id="s2cap" data-r="0-6"></div>
${['cam', 'edit', 'des'].map((k, i) => `<div class="card s2c" id="s2c${i}">${ICO[k]}<div class="lbl">${['CÂMERA', 'EDITOR', 'DESIGNER'][i]}</div></div><div class="laser" id="s2l${i}"></div><div class="laser" id="s2m${i}"></div>`).join('')}`,
  upd({ l, T }) {
    ['cam', 'edit', 'des'].forEach((k, i) => {
      const c = T(k), card = $('s2c' + i);
      show(card, K(l, c - .12, .18), { y: 40, s: .9 });
      const cut = K(l, c + .16, .15);
      $('s2l' + i).style.transform = `rotate(var(--a)) scaleX(${eo(cut)})`; $('s2l' + i).style.opacity = cut > 0 ? 1 : 0;
      const cut2 = K(l, c + .24, .15);
      $('s2m' + i).style.transform = `rotate(var(--a)) scaleX(${eo(cut2)})`; $('s2m' + i).style.opacity = cut2 > 0 ? 1 : 0;
      if (cut > 0) { card.style.opacity = lerp(1, .62, cut); card.style.filter = `grayscale(${cut * .8})`; }
    });
  } });

/* ---------- 3 · E nao, nao e template. ---------- */
def(3, { hudL: 'GRAVIDADE · 9,8', hudR: 'TEMPLATES · 0',
  html: `<div class="cap c" id="s3cap" data-r="0-3"></div>
<div id="s3box"><i class="cn" style="left:-3px;top:-3px;border-width:4px 0 0 4px"></i><i class="cn" style="right:-3px;top:-3px;border-width:4px 4px 0 0"></i>
<i class="cn" style="left:-3px;bottom:-3px;border-width:0 0 4px 4px"></i><i class="cn" style="right:-3px;bottom:-3px;border-width:0 4px 4px 0"></i>
<div id="s3in"><div id="s3plus">+</div><div class="lbl" style="color:#bff5d0">SOLTE O TEMPLATE AQUI&nbsp;&nbsp;·&nbsp;&nbsp;.PSD</div></div>
<div class="big n" id="s3t">template</div></div>`,
  upd({ l, T }) {
    const t = T('tpl'), box = $('s3box');
    show(box, K(l, .02, .2), { y: 30, s: .96 });
    $('s3in').style.opacity = 1 - K(l, t - .08, .1);
    slam($('s3t'), K(l, t - .03, .18), 1.7);
    const q = K(l, t + .12, .35);
    if (l > t + .12 && q < 1) box.style.transform = `translate(${Math.sin(l * 90) * 9 * (1 - q)}px,${Math.cos(l * 70) * 6 * (1 - q)}px)`;
  } });

/* ---------- 4 · Isso aqui e o CLAUDE OPUS 5.5 ---------- */
const BURST = (() => { const L = [92, 70, 88, 64, 95, 72, 86, 66, 93, 70, 84, 68]; return L.map((r, i) => { const a = i * 30 - 90, c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<line x1="${(c * 20).toFixed(1)}" y1="${(s * 20).toFixed(1)}" x2="${(c * r).toFixed(1)}" y2="${(s * r).toFixed(1)}"/>`; }).join(''); })();
def(4, { hudL: 'MODELO · OPUS 5.5', hudR: 'FIG. 1', flash: .42,
  html: `<div class="cap" id="s4cap" data-r="0-3"></div>
<div id="s4b"><svg viewBox="-100 -100 200 200" style="width:100%;height:100%;overflow:visible"><g stroke="#E2714F" stroke-width="17" stroke-linecap="round" id="s4g">${BURST}</g></svg></div>
<div class="big" id="s4c">CLAUDE</div>
<div class="big" id="s4o"><span id="s4o1">OPUS</span> <span id="s4o2" class="g glow">5.5</span></div>
<div class="lbl" id="s4t1">MODELO&nbsp;&nbsp;&nbsp;claude-opus-5.5<br>ENTRADA&nbsp;&nbsp;palavras<br>SAÍDA&nbsp;&nbsp;&nbsp;&nbsp;código → vídeo</div>
<div class="lbl" id="s4t2">fig. 1 — o modelo<br>palavras entram, vídeo sai</div>`,
  upd({ l, T }) {
    const tc = T('claude'), b = $('s4b');
    const mv = eio(K(l, tc - .22, .34));
    const dx = cssv(b, '--dx', -500), dy = cssv(b, '--dy', 120), s0 = cssv(b, '--s0', 1.8);
    b.style.opacity = K(l, .0, .1);
    b.style.transform = `translate(${dx * (1 - mv)}px,${dy * (1 - mv)}px) scale(${lerp(s0, 1, mv) * lerp(.2, 1, back(K(l, 0, .32)))}) rotate(${l * 22}deg)`;
    b.style.filter = `drop-shadow(0 0 ${lerp(60, 26, mv)}px rgba(226,113,79,.75))`;
    slam($('s4c'), K(l, tc - .03, .2), 1.35);
    const o1 = $('s4o1'), o2 = $('s4o2');
    o1.style.display = o2.style.display = 'inline-block';
    slam(o1, K(l, T('opus') - .03, .2), 1.35); slam(o2, K(l, T('ver') - .03, .2), 1.6);
    $('s4t1').style.opacity = K(l, T('opus'), .25) * .9; $('s4t2').style.opacity = K(l, T('ver'), .25) * .9;
  } });

/* ---------- 5 · Voce nao abre programa nenhum. So descreve como quer que fique. ---------- */
const S5TAGS = ['TIMELINE', 'CAMADAS', 'KEYFRAMES', 'GRAPH EDITOR', 'RENDER', 'LEGENDAS'];
def(5, { hudL: 'PROMPT · 1 LINHA', hudR: c => `PROGRAMAS ABERTOS · ${c.l > c.T('nenhum') ? 0 : 6}`,
  html: `<div class="cap c" id="s5cap" data-r="0-4"></div>
${S5TAGS.map((t, i) => `<div class="tag" id="s5g${i}">${t}</div>`).join('')}
<div class="pill" id="s5p"><span class="g" id="s5pre">›</span><span class="mono" id="s5t"></span><i id="s5cur"></i><span id="s5send">↑</span></div>`,
  upd({ l, T, sc, frame }) {
    const tn = T('nenhum'), ts = T('so'), out = eo(K(l, tn - .05, .32));
    S5TAGS.forEach((_, i) => {
      const g = $('s5g' + i), p = K(l, .06 + i * .07, .16);
      const fx = cssv(g, '--fx', 0), fy = cssv(g, '--fy', 0);
      g.style.opacity = p * (1 - out); g.style.transform = `translate(${fx * out}px,${(1 - eo(p)) * 20 + fy * out}px) scale(${lerp(.9, 1, eo(p))})`;
      g.style.filter = out > 0 ? `blur(${out * 6}px)` : 'none';
    });
    show($('s5p'), K(l, .05, .22), { y: 30 });
    const t = $('s5t');
    if (l < ts - .04) { t.innerHTML = 'descreva o que você quer'; t.style.opacity = .35; }
    else { t.innerHTML = typedHTML(sc, 5, 10, l, true); t.style.opacity = 1; }
    $('s5cur').style.opacity = (frame % 16 < 9) ? 1 : 0;
    const done = K(l, T('fique') + .25, .15); $('s5send').style.boxShadow = `0 0 ${30 * done}px ${10 * done}px rgba(48,220,104,.6)`;
  } });

/* ---------- 6 · Tipo: cria um video de um minuto, com texto animado, sobre vender curso para fora do Brasil. ---------- */
const S6C = [['min', 'DURAÇÃO', '<svg viewBox="0 0 120 120" class="ico"><circle cx="60" cy="60" r="44" opacity=".3"/><circle cx="60" cy="60" r="44" id="s6ring" stroke-dasharray="276" transform="rotate(-90 60 60)"/></svg><b class="s6big">60s</b>'],
  ['txt', 'TEXTO ANIMADO', '<b class="s6big s6aa"><i id="s6a1">T</i><i id="s6a2">i</i><i id="s6a3">p</i><i id="s6a4">o</i></b>'],
  ['curso', 'CURSO', ICO.play],
  ['br', 'FORA DO BRASIL', ICO.globe]];
def(6, { hudL: 'PEDIDO · 1 FRASE', hudR: c => `PARÂMETROS · ${S6C.filter(x => c.l > c.T(x[0])).length}`,
  html: `<div class="cap" id="s6cap" data-r="0-0"></div>
<div class="card" id="s6p"><div class="hdr dots" id="s6h1"><i></i><i></i><i></i>&nbsp;NOVO PEDIDO · claude-opus-5.5</div><div class="hdr" id="s6h2">TOKENS 000</div>
<div class="mono" id="s6t"></div><span id="s6send">↑</span></div>
${S6C.map((c, i) => `<div class="card s6c" id="s6c${i}"><div class="s6sk"><div class="sk" style="width:70%;height:16px"></div><div class="sk" style="width:46%;height:16px;margin-top:14px"></div><div class="sk" style="width:60%;height:16px;margin-top:14px"></div></div>
<div class="s6in" id="s6i${i}">${c[2]}</div><div class="lbl s6l" id="s6l${i}">PRÉVIA 0${i + 1}</div></div>`).join('')}`,
  upd({ l, T, sc, frame }) {
    show($('s6p'), K(l, .02, .22), { y: 34 });
    const html = typedHTML(sc, 1, 16, l, false);
    $('s6t').innerHTML = html + (frame % 16 < 9 ? '<i class="s6cur"></i>' : '');
    $('s6h2').textContent = 'TOKENS ' + pad(Math.round(html.replace(/<[^>]+>/g, '').length * 1.4));
    S6C.forEach((c, i) => {
      const card = $('s6c' + i), on = K(l, T(c[0]) - .02, .22);
      show(card, K(l, .12 + i * .07, .2), { y: 30 });
      card.classList.toggle('on', on > 0);
      card.querySelector('.s6sk').style.opacity = 1 - on;
      const inn = $('s6i' + i); inn.style.opacity = on; inn.style.transform = `scale(${lerp(.7, 1, back(on))})`;
      const lb = $('s6l' + i); lb.textContent = on > 0 ? c[1] : 'PRÉVIA 0' + (i + 1); lb.style.color = on > 0 ? '#d9ffe6' : '';
    });
    const ring = document.getElementById('s6ring'); if (ring) ring.setAttribute('stroke-dashoffset', 276 * (1 - K(l, T('min'), 1.6)));
    ['s6a1', 's6a2', 's6a3', 's6a4'].forEach((id, j) => { const e = $(id); e.style.transform = `translateY(${Math.sin(l * 7 - j * .9) * 12}px)`; });
    const done = K(l, T('br') + .25, .15); $('s6send').style.boxShadow = `0 0 ${30 * done}px ${10 * done}px rgba(48,220,104,.6)`;
  } });

/* ---------- 7 · Ranking em 3D, mapa, comparacao. Esses aqui sairam assim. ----------
   Tres exemplos lado a lado. Cada cartao tem uma miniatura desenhada (barras, pontos, A x B) e,
   por cima, uma imagem opcional: se existir assets/exemplos/1.jpg, 2.jpg ou 3.jpg ela cobre a
   miniatura; se nao existir, o <img> se remove sozinho e a miniatura aparece. */
const S7V = [['r1', 'RANKING'], ['r2', 'MAPA'], ['r3', 'COMPARAÇÃO']];
const S7MINI = (() => {
  const r = rnd(71); let dots = '';
  for (let i = 0; i < 30; i++) dots += `<i class="s7dot" style="left:${(8 + r() * 84).toFixed(1)}%;top:${(14 + r() * 70).toFixed(1)}%"></i>`;
  return [
    [38, 56, 47, 72, 92].map((h, i) => `<i class="s7bar" data-h="${h}" style="left:${11 + i * 16.5}%"></i>`).join(''),
    dots,
    '<i class="s7ab" data-w="24" style="top:32%"></i><i class="s7ab s7abg" data-w="80" style="top:56%"></i>',
  ];
})();
def(7, { hudL: c => `VÍDEOS · ${S7V.filter(v => c.l > c.T(v[0])).length}`, hudR: c => `FEITOS ASSIM · ${S7V.filter(v => c.l > c.T(v[0])).length}/3`,
  html: `<div class="cap c" id="s7cap1" data-r="0-4"></div><div class="cap c" id="s7cap2" data-r="5-8"></div>
${S7V.map((v, i) => `<div class="card s7c" id="s7c${i}"><div class="s7v">${S7MINI[i]}</div><img class="s7img" src="assets/exemplos/${i + 1}.jpg" onerror="this.remove()"></div><div class="chip" id="s7l${i}">${v[1]}</div>`).join('')}`,
  init(sc) { sc.bars = [...sc.el.querySelectorAll('.s7bar')]; sc.dots = [...sc.el.querySelectorAll('.s7dot')]; sc.ab = [...sc.el.querySelectorAll('.s7ab')]; },
  upd({ l, T, sc }) {
    S7V.forEach((v, i) => {
      const p = K(l, T(v[0]) - .1, .24), card = $('s7c' + i);
      card.style.opacity = clamp(p * 2); card.style.transform = `translateY(${(1 - eo(p)) * 60}px) scale(${lerp(.86, 1, back(p))})`;
      card.classList.toggle('on', p > 0 && p < 1 || l > T('assim'));
      show($('s7l' + i), K(l, T(v[0]) + .08, .18), { y: 14 });
    });
    sc.bars.forEach((b, j) => { b.style.height = (+b.dataset.h * .66 * eo(K(l, T('r1') + j * .08, .6))) + '%'; });
    sc.dots.forEach((d, j) => { const q = K(l, T('r2') + j * .05, .2); d.style.opacity = q; d.style.transform = `scale(${1 + Math.sin(Math.PI * q)})`; });
    sc.ab.forEach(b => { b.style.width = (+b.dataset.w * eo(K(l, T('r3') + .05, .7))) + '%'; });
  } });
