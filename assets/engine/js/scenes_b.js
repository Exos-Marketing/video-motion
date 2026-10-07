/* Cenas 8 a 13. */

/* ---------- 8 · So que tem um detalhe que quase ninguem percebe. ---------- */
def(8, { hudL: 'SINAL · 1 PONTO', hudR: c => `BATIDAS · ${Math.floor(c.l * 2.5) + 1}`, floor: .15,
  html: `<div class="cap c" id="s8cap1" data-r="0-4"></div><div class="cap c" id="s8cap2" data-r="5-8"></div>
<div id="s8r"><svg viewBox="-260 -260 520 520" style="width:100%;height:100%;overflow:visible">
<circle r="240" class="st dash" id="s8d" opacity=".5"/><circle r="170" class="st" id="s8c2" opacity=".55"/><circle r="100" class="st" id="s8c1" opacity=".8"/>
<g id="s8br" stroke="#fff" stroke-width="5" fill="none"><path d="M-70 -42v-28h28"/><path d="M70 -42v-28h-28"/><path d="M-70 42v28h28"/><path d="M70 42v28h-28"/></g>
<circle r="9" fill="#30DC68" id="s8dot"/></svg></div>
<div class="lbl" id="s8l1">1 PX</div><div class="lbl" id="s8l2">X 0960&nbsp;&nbsp;Y 0540</div><div id="s8p"></div>`,
  init(sc) { const r = rnd(81), p = sc.el.querySelector('#s8p'); let h = '';
    for (let i = 0; i < 46; i++) h += `<i style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;width:3px;height:3px;border-radius:50%;background:#9dffc0" data-f="${(r() * 6).toFixed(2)}"></i>`;
    p.innerHTML = h; sc.parts = [...p.children]; },
  upd({ l, T, sc }) {
    const td = T('det');
    $('s8c1').setAttribute('r', lerp(10, 100, eo(K(l, .0, .4)))); $('s8c2').setAttribute('r', lerp(10, 170, eo(K(l, .1, .5))));
    $('s8d').setAttribute('transform', `rotate(${l * 34})`); $('s8d').setAttribute('opacity', .5 * K(l, .2, .3));
    const close = eo(K(l, td - .25, .3)); $('s8br').setAttribute('transform', `scale(${lerp(2.1, 1, close)})`); $('s8br').setAttribute('opacity', K(l, .15, .2));
    const pulse = 1 + .5 * Math.max(0, Math.sin((l - td) * 9)) * (l > td ? 1 : 0); $('s8dot').setAttribute('r', 9 * pulse);
    $('s8dot').style.filter = `drop-shadow(0 0 ${14 * pulse}px #30DC68)`;
    $('s8l1').style.opacity = K(l, td - .1, .15); $('s8l2').style.opacity = K(l, td, .15);
    sc.parts.forEach(e => { e.style.opacity = .15 + .55 * Math.abs(Math.sin(l * 2.2 + +e.dataset.f)); });
  } });

/* ---------- 9 · O Claude nao gera o video direto. ---------- */
def(9, { hudL: 'SAÍDA · VÍDEO?', hudR: 'RENDER · —',
  html: `<div class="cap" id="s9cap1" data-r="0-5"></div><div class="cap" id="s9cap2" data-r="6-6"></div>
<div class="chip" id="s9chip"><span style="color:#E2714F">✳</span>&nbsp;claude</div><div class="big g" id="s9arrow">›</div>
<div class="card" id="s9pl"><div id="s9dash"></div><div id="s9play">${ICO.play}</div><div class="lbl" id="s9lab">vídeo.mp4 · 0 bytes</div></div>`,
  init(sc) { const r = rnd(9), d = sc.el.querySelector('#s9dash'); let h = '';
    for (let i = 0; i < 60; i++) h += `<i style="position:absolute;left:${(r() * 92).toFixed(1)}%;top:${(4 + r() * 88).toFixed(1)}%;width:${(18 + r() * 90).toFixed(0)}px;height:3px;background:rgba(160,255,195,.5)" data-f="${(r() * 30 | 0)}"></i>`;
    d.innerHTML = h; sc.ds = [...d.children]; },
  upd({ l, T, sc, frame }) {
    show($('s9chip'), K(l, .05, .2), { x: -40, y: 0 }); show($('s9arrow'), K(l, .2, .2), { x: -30, y: 0 });
    show($('s9pl'), K(l, .1, .25), { y: 30 });
    sc.ds.forEach((e, i) => { e.style.opacity = ((frame * 7 + +e.dataset.f * 13 + i * 5) % 11 < 4) ? .75 : .08; });
    const no = K(l, T('nao'), .2); $('s9pl').style.borderColor = `rgba(${lerp(COR[0], 255, no)},${lerp(COR[1], 80, no)},${lerp(COR[2], 80, no)},.6)`;
    $('s9play').style.opacity = lerp(.9, .25, no);
    $('s9lab').style.opacity = K(l, T('dir') - .3, .2);
  } });

/* ---------- 10 · Ele escreve o video como codigo. Texto, cor, movimento, tempo: tudo vira uma linha. ---------- */
const S10L = ['const cena = {', '  <span class="k">texto</span>: <span class="s">"VÍDEO DESSE NÍVEL"</span>,', '  <span class="k">cor</span>: <span class="s">"#30DC68"</span>,',
  '  <span class="k">movimento</span>: spring({ frame, fps }),', '  <span class="k">tempo</span>: <span class="s">"2.8s"</span>,', '  <span class="k">idioma</span>: <span class="s">"pt"</span>,', '};'];
def(10, { hudL: 'SAÍDA · CÓDIGO', hudR: c => `LINHAS · ${pad(Math.min(7, Math.max(0, Math.floor((c.l - c.T('esc')) / .09))))}`,
  html: `<div class="cap" id="s10cap" data-r="0-5"></div><div class="cap c" id="s10cap2" data-r="10-13"></div>
<div class="card" id="s10ed"><div class="hdr" id="s10h1">cena-01.tsx</div><div class="hdr" id="s10h2">LN 07</div>
<div id="s10code">${S10L.map((x, i) => `<div class="cl" id="s10c${i}"><b>${i + 1}</b>  ${x}</div>`).join('')}</div></div>
<div class="card" id="s10st"><div class="hdr" id="s10sh">resultado · quadro 0042</div><div id="s10box"><div class="big" id="s10w">VÍDEO</div></div>
<div class="tag s10t" id="s10t0">texto</div><div class="tag s10t" id="s10t1">cor</div><div class="tag s10t" id="s10t2">movimento</div><div class="tag s10t" id="s10t3">tempo</div>
<div id="s10bar"><i id="s10fill"></i></div></div>`,
  upd({ l, T }) {
    const te = T('esc');
    show($('s10ed'), K(l, .03, .22), { y: 30 }); show($('s10st'), K(l, .1, .22), { y: 30 });
    S10L.forEach((_, i) => { const e = $('s10c' + i), p = K(l, te + i * .09, .12); e.style.opacity = p; e.style.transform = `translateX(${(1 - eo(p)) * -18}px)`; });
    const cu = ['l1', 'l2', 'l3', 'l4'].map(k => T(k));
    [1, 2, 3, 4].forEach((ln, j) => {
      const act = l >= cu[j] && (j === 3 ? true : l < cu[j + 1]);
      $('s10c' + ln).style.background = act ? 'rgba(48,220,104,.22)' : 'transparent';
      $('s10c' + ln).style.boxShadow = act ? 'inset 4px 0 0 #30DC68' : 'none';
      show($('s10t' + j), K(l, cu[j] - .03, .16), { y: 16 });
    });
    const w = $('s10w'), box = $('s10box');
    box.style.opacity = K(l, cu[0] - .05, .18); box.style.borderColor = `rgba(255,255,255,${.5 * K(l, cu[0], .2)})`;
    const g = K(l, cu[1], .2); w.style.color = `rgb(${lerp(255, COR[0], g)},${lerp(255, COR[1], g)},${lerp(255, COR[2], g)})`; w.style.textShadow = `0 0 ${50 * g}px rgba(48,220,104,${.8 * g})`;
    const dt = l - cu[2]; w.style.transform = dt > 0 ? `translateX(${-150 * Math.exp(-5 * dt) * Math.cos(15 * dt)}px)` : 'none';
    $('s10bar').style.opacity = K(l, cu[3] - .05, .15); $('s10fill').style.width = (K(l, cu[3], 1.2) * 100) + '%';
  } });

/* ---------- 11 · E ai esse codigo e renderizado quadro a quadro. ---------- */
def(11, { hudL: '30 QUADROS / SEGUNDO', hudR: c => `FILA · ${328 - Math.floor(c.l * 30)}`, floor: .15,
  html: `<div class="cap c" id="s11cap1" data-r="0-5"></div><div class="cap c" id="s11cap2" data-r="6-8"></div>
<div id="s11strip"><div id="s11track">${Array.from({ length: 14 }, (_, i) => `<div class="s11f"><b class="lbl">Q${pad(120 + i, 4)}</b>${i < 4
    ? '<div class="sk" style="position:absolute;left:14%;top:34%;width:60%;height:10px"></div><div class="sk" style="position:absolute;left:14%;top:48%;width:44%;height:10px;background:rgba(48,220,104,.5)"></div><div class="sk" style="position:absolute;left:14%;top:62%;width:66%;height:10px"></div><div class="sk" style="position:absolute;left:14%;top:76%;width:30%;height:10px"></div>'
    : `<span class="big s11w" style="opacity:${Math.min(1, .35 + (i - 4) * .13)}">VÍDEO</span><i class="s11b"></i>`}</div>`).join('')}</div></div>
<div class="ln" id="s11head"></div><div class="chip" id="s11hl">RENDER&nbsp;&nbsp;Q0120</div>`,
  upd({ l, d }) {
    const tr = $('s11track'), st = cssv(tr, '--step', 370);
    tr.style.transform = `translateX(${-(l / d) * st * 7.2}px)`;
    $('s11strip').style.opacity = K(l, .02, .15);
    $('s11head').style.opacity = K(l, .15, .15); const hl = $('s11hl'); hl.style.opacity = K(l, .2, .15);
    hl.innerHTML = 'RENDER&nbsp;&nbsp;Q' + pad(120 + Math.floor(l * 2.6), 4);
  } });

/* ---------- 12 · Em vez de roteiro, gravacao, edicao, legenda e exportacao, ---------- */
const S12 = [['a1', 'roteiro', ICO.doc], ['a2', 'gravação', ICO.mic], ['a3', 'edição', ICO.edit], ['a4', 'legenda', ICO.cc], ['a5', 'exportação', ICO.exp]];
def(12, { hudL: 'FLUXO ANTIGO · 5 ETAPAS', hudR: c => { const m = Math.floor(lerp(25, 352, c.l / c.d)); return `TEMPO GASTO · ${pad(Math.floor(m / 60), 2)}h${pad(m % 60, 2)}`; }, floor: .5,
  html: `<div class="cap" id="s12cap" data-r="0-2"></div>
${S12.map((s, i) => `<div class="card s12c" id="s12c${i}">${s[2]}<div class="s12n">${s[1]}</div><div class="lbl s12k">ETAPA 0${i + 1}</div></div>`).join('')}
<div class="laser" id="s12laser"></div>`,
  upd({ l, T }) {
    const p = K(l, T('a5') + .2, .4), lz = $('s12laser');
    lz.style.opacity = p > 0 ? 1 : 0; lz.style.transform = `rotate(var(--a,0deg)) scaleX(${eo(p)})`;
    S12.forEach((s, i) => {
      const c = $('s12c' + i); show(c, K(l, T(s[0]) - .08, .18), { y: 46, s: .9 });
      const hit = K(eo(p), (i + .5) / 5 - .08, .14);
      if (hit > 0) { c.style.opacity = lerp(1, .55, hit); c.style.filter = `grayscale(${hit * .85})`; c.style.borderColor = `rgba(255,70,70,${.75 * hit})`; }
      else c.style.borderColor = '';
    });
  } });

/* ---------- 13 · e pedido, codigo, render, video. ---------- */
const S13 = [['n1', 'pedido', '<div class="pill s13pill mono">› faz um vídeo</div>'],
  ['n2', 'código', '<div class="s13code"><div class="sk" style="width:74%"></div><div class="sk" style="width:52%;background:rgba(48,220,104,.6)"></div><div class="sk" style="width:66%"></div><div class="sk" style="width:38%"></div></div>'],
  ['n3', 'render', '<div class="s13bar"><i id="s13fill"></i></div><div class="lbl s13pct" id="s13pct">0%</div>'],
  ['n4', 'vídeo', ICO.play]];
def(13, { hudL: 'FLUXO NOVO · 1 CONVERSA', hudR: c => `PASSOS · ${S13.filter(s => c.l > c.T(s[0])).length}/4`, floor: .6,
  html: `<div class="cap" id="s13cap" data-r="0-0"></div><div class="ln" id="s13beam"></div><div id="s13dot"></div>
${S13.map((s, i) => `<div class="card s13c" id="s13c${i}"><div class="s13in">${s[2]}</div></div><div class="big n s13w" id="s13w${i}">${s[1]}</div>`).join('')}`,
  upd({ l, T }) {
    const cu = S13.map(s => T(s[0]));
    S13.forEach((s, i) => {
      const c = $('s13c' + i), on = K(l, cu[i] - .04, .18), cur = l >= cu[i] && (i === 3 || l < cu[i + 1]);
      show(c, K(l, .04 + i * .06, .2), { y: 30 });
      c.classList.toggle('on', on > 0); c.style.opacity = on > 0 ? 1 : .42 * K(l, .04 + i * .06, .2);
      const w = $('s13w' + i); show(w, on, { y: 24, s: 1 }); w.style.color = cur ? '#30DC68' : '#fff'; w.style.textShadow = cur ? '0 0 40px rgba(48,220,104,.8)' : 'none';
    });
    // feixe que liga os quatro passos: avanca ate o passo falado
    let prog = 0; for (let i = 0; i < 4; i++) prog = Math.max(prog, eo(K(l, cu[i] - .15, .22)) * (i + .5) / 4);
    const beam = $('s13beam'), vert = cssv(beam, '--v', 0) > 0, len = cssv(beam, '--len', 1640);
    beam.style.transform = vert ? `scaleY(${prog})` : `scaleX(${prog})`; beam.style.opacity = K(l, cu[0] - .15, .1) * .9;
    const dot = $('s13dot'); dot.style.opacity = K(l, cu[0] - .15, .1); dot.style.transform = vert ? `translateY(${len * prog}px)` : `translateX(${len * prog}px)`;
    const r = K(l, cu[2], .5); $('s13fill').style.width = (r * 100) + '%'; $('s13pct').textContent = Math.round(r * 100) + '%';
  } });
