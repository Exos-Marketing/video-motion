/* Cenas 14 a 19. */

/* ---------- previa ao vivo (cenas 14 e 15 usam o mesmo painel) ---------- */
const PVT = { pt: ['SEU CURSO', 'PARA O MUNDO', 'PT'], en: ['YOUR COURSE', 'TO THE WORLD', 'EN'], es: ['TU CURSO', 'PARA EL MUNDO', 'ES'] };
const PVF = { pt: 'pt', en: 'gb', es: 'es' };   // bandeira = pais de origem da lingua
function pvHTML(p) {
  return `<div class="card pv" id="${p}pv"><div class="hdr dots pvh"><i></i><i></i><i></i>&nbsp;preview.mp4 · ${W}×${H}</div>
<div class="chip pvlang"><img class="flag" id="${p}flag" src="assets/flags/pt.png"><span id="${p}code">PT</span></div>
<div class="pvstage"><div class="big pvt1" id="${p}t1">SEU CURSO</div><div class="big pvt2" id="${p}t2">PARA O MUNDO</div></div>
<div class="pvbar"><i id="${p}fill"></i></div></div>
<div class="card pve" id="${p}ez"><div class="hdr pvh">easing · inOut(cubic)</div>
<svg viewBox="0 0 400 190" class="pvsvg"><path d="M24 168C160 168 240 24 376 24" class="st" style="stroke-width:3.5"/><circle id="${p}ed" r="10" fill="#fff"/></svg></div>
<div class="card pvc" id="${p}cd"><div class="hdr pvh">cena.tsx</div><div class="pvcode">
<div class="cl" id="${p}k0"><b>1</b>  <span class="k">cor</span>: <span class="s" id="${p}v0">"#F1F0E8"</span>,</div>
<div class="cl" id="${p}k1"><b>2</b>  <span class="k">duração</span>: <span class="s" id="${p}v1">1.6s</span>,</div>
<div class="cl" id="${p}k2"><b>3</b>  <span class="k">idioma</span>: <span class="s" id="${p}v2">"pt"</span>,</div>
<div class="cl" id="${p}k3"><b>4</b>  <span class="k">loop</span>: <span class="s">true</span>,</div></div></div>
<div class="pill pvsay" id="${p}say"><i class="pvmic"></i><span class="mono" id="${p}st"></span></div>`;
}
function pvUpd(p, o) {   // o: {ph, green, fast, lang, act, glitch}
  const ph = o.ph % 1, e = eo(clamp(ph / .5)), vis = clamp(ph / .12) * (1 - clamp((ph - .9) / .1));
  const t1 = $(p + 't1'), t2 = $(p + 't2'), L = PVT[o.lang];
  t1.textContent = L[0]; t2.textContent = L[1]; $(p + 'code').textContent = L[2]; $(p + 'flag').src = `assets/flags/${PVF[o.lang]}.png`;
  const gx = o.glitch ? Math.sin(o.glitch * 60) * 26 * o.glitch : 0;
  const sh = o.glitch ? `${-10 * o.glitch}px 0 #ff3b3b, ${10 * o.glitch}px 0 #39c6ff` : 'none';
  t1.style.opacity = t2.style.opacity = vis;
  t1.style.transform = `translateX(${-(1 - e) * 300 + gx}px)`; t2.style.transform = `translateX(${-(1 - eo(clamp((ph - .06) / .5))) * 300 - gx}px)`;
  t1.style.textShadow = sh; t2.style.color = `rgb(${lerp(241, COR[0], o.green)},${lerp(240, COR[1], o.green)},${lerp(232, COR[2], o.green)})`;
  t2.style.textShadow = o.glitch ? sh : `0 0 ${46 * o.green}px rgba(48,220,104,${.75 * o.green})`;
  $(p + 'fill').style.width = (ph * 100) + '%';
  const u = eio(clamp(ph / .5)), q = 1 - u;   // ponto na curva de easing
  const bx = q * q * q * 24 + 3 * q * q * u * 160 + 3 * q * u * u * 240 + u * u * u * 376, by = q * q * q * 168 + 3 * q * q * u * 168 + 3 * q * u * u * 24 + u * u * u * 24;
  $(p + 'ed').setAttribute('cx', bx); $(p + 'ed').setAttribute('cy', by);
  $(p + 'v0').textContent = o.green > .5 ? '"#30DC68"' : '"#F1F0E8"'; $(p + 'v1').textContent = o.fast ? '0.6s' : '1.6s'; $(p + 'v2').textContent = `"${o.lang}"`;
  [0, 1, 2, 3].forEach(i => { const on = o.act === i, k = $(p + 'k' + i); k.style.background = on ? 'rgba(48,220,104,.22)' : 'transparent'; k.style.boxShadow = on ? 'inset 4px 0 0 #30DC68' : 'none'; });
}

/* ---------- 14 · E como e codigo, voce pode falar: muda a cor. Deixa mais rapido. ---------- */
def(14, { hudL: 'PRÉVIA AO VIVO', hudR: c => `ALTERAÇÕES · ${(c.l > c.T('m1e') ? 1 : 0) + (c.l > c.T('m2e') ? 1 : 0)}`, floor: .2,
  html: `<div class="cap c pvcap" data-r="0-6"></div>${pvHTML('s14')}`,
  upd({ l, T, sc }) {
    const m1 = T('m1'), m1e = T('m1e'), m2 = T('m2'), m2e = T('m2e'), fast = l > m2e - .12;
    ['s14pv', 's14ez', 's14cd'].forEach((id, i) => show($(id), K(l, .04 + i * .07, .22), { y: 30 }));
    const ph = fast ? (m2e - .12) / 1.6 + (l - (m2e - .12)) / .6 : l / 1.6;
    pvUpd('s14', { ph, green: K(l, m1e - .1, .2), fast, lang: 'pt', act: l > m2 ? 1 : l > m1 ? 0 : -1 });
    const say = $('s14say'); show(say, K(l, m1 - .12, .16), { y: 20 });
    $('s14st').innerHTML = l >= m2 - .03 ? typedHTML(sc, 10, 12, l, true) : typedHTML(sc, 7, 9, l, true);
  } });

/* ---------- 15 · Agora em ingles. Now it speaks English. Y ahora, espanol. ---------- */
def(15, { noIn: true, floor: .2,
  hudL: c => c.l > c.T('es1') - .03 ? 'VISTA PREVIA' : c.l > c.T('en1') - .03 ? 'LIVE PREVIEW' : 'PRÉVIA AO VIVO',
  hudR: c => c.l > c.T('es1') - .03 ? 'CAMBIOS · 4' : c.l > c.T('en1') - .03 ? 'CHANGES · 3' : 'ALTERAÇÕES · 2',
  html: `<div class="cap c pvcap" id="s15c0"><span style="opacity:1">E como é</span> <span class="g" style="opacity:1">código,</span> <span style="opacity:1">você pode falar:</span></div>
<div class="cap c pvcap" id="s15cE" data-r="3-6"></div><div class="cap c pvcap" id="s15cS" data-r="7-9"></div>${pvHTML('s15')}`,
  upd(c) {
    const { l, T, sc } = c, en = T('en1') - .03, es = T('es1') - .03;
    const s14 = SCN.find(s => s.id === 14), tm = s14.cues.m2e - .12, ph0 = tm / 1.6 + (s14.d - tm) / .6;
    const lang = l > es ? 'es' : l > en ? 'en' : 'pt';
    const gl = Math.max(1 - K(l, en, .22), 0) * (l > en ? 1 : 0) + Math.max(1 - K(l, es, .22), 0) * (l > es ? 1 : 0);
    ['s15pv', 's15ez', 's15cd'].forEach(id => { $(id).style.opacity = 1; });
    // em portugues o laco rapido continua; ao trocar de idioma o titulo entra uma vez e fica parado, para dar tempo de ler
    const ph = lang === 'pt' ? ph0 + l / .6 : Math.min(.86, (l - (lang === 'en' ? en : es)) / .7);
    pvUpd('s15', { ph, green: 1, fast: true, lang, act: 2, glitch: gl });
    $('s15pv').style.transform = gl ? `translateX(${Math.sin(l * 140) * 10 * gl}px)` : 'none';
    c.fx = gl * .22;
    $('s15c0').style.opacity = 1 - K(l, en - .1, .12); $('s15cE').style.opacity = l > es - .02 ? 0 : 1;
    const st = $('s15st');
    if (lang === 'pt') st.innerHTML = typedHTML(sc, 0, 2, l, true);
    else st.innerHTML = `<img class="flag" src="assets/flags/${PVF[lang]}.png" style="height:26px;vertical-align:-4px;margin-right:12px">${lang === 'en' ? 'english' : 'español'}`;
    $('s15say').style.opacity = 1;
  } });

/* ---------- 16 · O mesmo video, em qualquer idioma, sem regravar nada. ---------- */
const S16 = [['pt', 'PT · PORTUGUÊS', 'SEU CURSO', 'PARA O MUNDO'], ['gb', 'EN · ENGLISH', 'YOUR COURSE', 'TO THE WORLD'], ['es', 'ES · ESPAÑOL', 'TU CURSO', 'PARA EL MUNDO'],
  ['fr', 'FR · FRANÇAIS', 'VOTRE COURS', 'POUR LE MONDE'], ['de', 'DE · DEUTSCH', 'DEIN KURS', 'FÜR DIE WELT'], ['it', 'IT · ITALIANO', 'IL TUO CORSO', 'PER IL MONDO']];
def(16, { hudL: c => `IDIOMAS · ${Math.min(6, Math.max(0, Math.floor((c.l - .1) / .2) + 1))}/6`, hudR: 'REGRAVAÇÕES · 0', flash: .3,
  html: `<div class="cap c" id="s16cap1" data-r="0-5"></div><div class="cap c" id="s16cap2" data-r="6-8"></div>
${S16.map((x, i) => `<div class="card s16c" id="s16c${i}"><img class="flag s16f" src="assets/flags/${x[0]}.png"><div class="lbl s16k">${x[1]}</div><div class="big s16a">${x[2]}</div><div class="big s16b g">${x[3]}</div></div>`).join('')}`,
  upd({ l, T }) {
    const q = T('qq');
    S16.forEach((_, i) => {
      const c = $('s16c' + i), p = K(l, .1 + i * .2, .22), pulse = Math.max(0, 1 - Math.abs(l - (q + i * .05)) / .22);
      c.style.opacity = clamp(p * 2); c.style.transform = `translateY(${(1 - eo(p)) * 50}px) scale(${lerp(.88, 1, back(p)) + pulse * .035})`;
      c.classList.toggle('on', pulse > 0 || (p > 0 && p < 1));
    });
  } });

/* ---------- 17 · a barreira do idioma / a Exos ja vendeu em 141 paises / esse caminho nunca foi tao curto ---------- */
def(17, { floor: .3, flash: .2,
  num: c => c.l > c.T('exosA') - .12 ? 18 : 17,   // a segunda metade conta como outra cena no HUD
  hudL: c => c.l > c.T('exosA') - .12 ? `PAÍSES · ${pad(c.sc.lit || 0)}` : 'BARREIRA · IDIOMA',
  hudR: c => c.l > c.T('exosA') - .12 ? 'DESDE · 2022' : `ALTURA · ${Math.round(lerp(100, 12, eio(K(c.l, c.T('bar'), c.T('baixa') + .25 - c.T('bar')))))}%`,
  html: `<div id="s17a"><div class="cap" id="s17cap1" data-r="0-8"></div><div class="cap" id="s17cap2" data-r="9-18"></div>
<div class="ln" id="s17ground"></div><div id="s17wall"><span class="lbl">IDIOMA</span></div><div class="chip" id="s17h">100%</div>
<img class="flag" id="s17br" src="assets/flags/br.png"><div class="lbl" id="s17brl">BRASIL</div>
<div id="s17world">${ICO.globe}</div><div class="lbl" id="s17wl">MUNDO</div><div id="s17dot"></div></div>
<div id="s17b"><div class="cap" id="s17cap3" data-r="19-24"></div><div class="cap" id="s17cap4" data-r="27-33"></div>
<div class="big g glow" id="s17n">0</div><div class="big" id="s17p">PAÍSES</div><canvas id="s17cv"></canvas></div>`,
  init(sc) {
    const cv = sc.el.querySelector('#s17cv'); cv.width = cv.clientWidth; cv.height = cv.clientHeight;
    const Wc = cv.width, Hc = cv.height, xy = (lon, lat) => [(lon + 180) / 360 * Wc, (84 - lat) / 142 * Hc];
    const land = document.createElement('canvas'); land.width = Wc; land.height = Hc; const g = land.getContext('2d');
    g.fillStyle = 'rgba(48,220,104,.34)'; for (const [lon, lat] of MAPA.land) { const [x, y] = xy(lon, lat); g.beginPath(); g.arc(x, y, Wc / 720, 0, 6.3); g.fill(); }
    sc.map = { cv, land, xy, pts: MAPA.pts.map(p => ({ xy: xy(p.lon, p.lat), peso: p.peso })) };
  },
  upd(c) {
    const { l, T, sc } = c, tb = T('bar'), tx = T('baixa'), tr = T('br'), te = T('exosA') - .12;
    const B = K(l, te, .14); $('s17a').style.opacity = 1 - B; $('s17b').style.opacity = B; c.fx = (l > te ? Math.pow(1 - K(l, te, .3), 2) : 0) * .5;
    // A: o muro do idioma abaixa e o curso passa
    const low = eio(K(l, tb, tx + .25 - tb)), wall = $('s17wall'), hmax = cssv(wall, '--h', 500), h = lerp(hmax, hmax * .12, low);
    wall.style.height = h + 'px'; $('s17h').textContent = Math.round(lerp(100, 12, low)) + '%'; $('s17h').style.transform = `translateY(${-h}px)`;
    const go = eio(K(l, tx + .2, Math.max(.5, tr - tx))), dot = $('s17dot'), dx = cssv(dot, '--dx', 1000), arc = cssv(dot, '--arc', 260);
    dot.style.transform = `translate(${dx * go}px,${-Math.sin(go * Math.PI) * arc}px)`; dot.style.opacity = K(l, .2, .2);
    const arr = K(l, tx + .2 + Math.max(.5, tr - tx) - .1, .2); $('s17world').style.filter = `drop-shadow(0 0 ${30 * arr}px rgba(48,220,104,${arr}))`; $('s17world').style.opacity = lerp(.45, 1, arr);
    // B: o mapa acende
    const t0 = T('exos') - .1, t1 = T('paises') + .25, M = sc.map, g = M.cv.getContext('2d'); let lit = 0;
    g.clearRect(0, 0, M.cv.width, M.cv.height); g.drawImage(M.land, 0, 0);
    if (l > te) {
      const u = M.cv.width / 1440;
      M.pts.forEach((p, i) => { const ti = t0 + (i / M.pts.length) * (t1 - t0), q = K(l, ti, .22); if (q <= 0) return; lit++;
        const r = (2.6 + p.peso * 1.5) * u * (1 + .9 * Math.sin(Math.PI * q) * (1 - q * .4));
        g.shadowColor = '#30DC68'; g.shadowBlur = 16 * u; g.fillStyle = '#eafff1'; g.beginPath(); g.arc(p.xy[0], p.xy[1], r, 0, 6.3); g.fill(); });
      g.shadowBlur = 0;
      const pe = eo(K(l, T('e2'), .7));            // "esse caminho nunca foi tao curto": rotas saindo do Brasil
      if (pe > 0) { const a = M.xy(-51, -12); [[10, 50], [-98, 39], [78, 21]].forEach(([lo, la]) => { const b = M.xy(lo, la), mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 150 * u;
          g.strokeStyle = '#fff'; g.lineWidth = 3 * u; g.shadowColor = '#30DC68'; g.shadowBlur = 18 * u; g.beginPath();
          for (let s = 0; s <= 40 * pe; s++) { const v = s / 40, w = 1 - v, x = w * w * a[0] + 2 * w * v * mx + v * v * b[0], y = w * w * a[1] + 2 * w * v * my + v * v * b[1]; s ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.stroke(); }); g.shadowBlur = 0; }
    }
    sc.lit = lit; $('s17n').textContent = lit;
    slam($('s17n'), K(l, T('exosA') + .05, .25), 1.3); show($('s17p'), K(l, T('n141') - .25, .2), { y: 30, s: 1 });
    $('s17cap3').style.opacity = 1 - K(l, T('e2') - .1, .12);
  } });

/* ---------- 18 · Substitui gravar com o expert? Nao. Mas sair de uma ideia pra um video pronto em tres idiomas... e bem ABSURDO ---------- */
def(18, { hudL: 'EDITOR ABERTO · 0', hudR: 'IDIOMAS · 3', floor: .25, num: () => 19,
  html: `<svg id="s18arc" viewBox="0 0 1920 1080" preserveAspectRatio="none"><circle id="s18ci" cx="960" cy="1530" r="1150" transform="rotate(180 960 1530)" class="st" style="stroke-width:5;filter:drop-shadow(0 0 16px #30DC68)" stroke-dasharray="7300" pathLength="7300"/></svg>
<div id="s18rec">${ICO.cam}</div><div class="cap c" id="s18q" data-r="0-4"></div>
<div class="big n" id="s18no">Não</div>
<div id="s18blk"><div class="cap c" id="s18l1" data-r="6-10"></div><div class="cap c" id="s18l2" data-r="11-17"></div><div class="cap c" id="s18l3" data-r="18-21"></div></div>
<div class="chip" id="s18pr">▶&nbsp;&nbsp;<span id="s18pc">0%</span></div>
<div class="cap" id="s18eb" data-r="22-23"></div><div id="s18rays"></div><div class="big g" id="s18abs">ABSURDO</div>`,
  upd(c) {
    const { l, T } = c, tn = T('nao'), tm = T('mas'), te = T('eh'), ta = T('abs');
    $('s18ci').setAttribute('stroke-dashoffset', 7300 * (1 - eo(K(l, 0, 1.2)) * .5)); $('s18arc').style.opacity = .9;
    const q = 1 - K(l, tn - .1, .12); $('s18q').style.opacity = q; $('s18rec').style.opacity = q * K(l, .05, .2);
    const no = $('s18no'); slam(no, K(l, tn - .03, .18), 1.6); if (l > tm - .12) { const o = K(l, tm - .12, .14); no.style.opacity = 1 - o; no.style.transform = `scale(${lerp(1, .7, o)})`; }
    const blk = $('s18blk'), out = K(l, te - .12, .14); blk.style.opacity = (l > tm - .05 ? 1 : 0) * (1 - out); blk.style.filter = out > 0 ? `blur(${out * 12}px)` : 'none'; blk.style.transform = `scale(${lerp(1, .92, out)})`;
    const pr = $('s18pr'), pp = K(l, tm, T('editor') + .2 - tm); show(pr, K(l, tm + .1, .2), { y: 20 }); if (out > 0) pr.style.opacity = 1 - out;
    $('s18pc').textContent = Math.round(pp * 100) + '%'; pr.classList.toggle('on', pp >= 1);
    $('s18eb').style.opacity = l > te - .05 ? 1 : 0;
    const a = K(l, ta - .04, .26), abs = $('s18abs'); slam(abs, a, 2.3);
    abs.style.textShadow = `0 2px 0 #1fae4e,0 5px 0 #18923f,0 9px 0 #117331,0 14px 0 #0b5524,0 0 ${80 * a}px rgba(48,220,104,.9),0 0 ${200 * a}px rgba(48,220,104,.5)`;
    const rays = $('s18rays'); rays.style.opacity = a * (.55 + .2 * Math.sin(l * 9)); rays.style.transform = `rotate(${l * 14}deg) scale(${lerp(.6, 1.15, eo(a))})`;
    c.fx = l > ta - .04 ? Math.pow(1 - K(l, ta - .04, .35), 2) * .45 : 0;
  } });

/* ---------- 19 · Quer levar o seu curso pra fora? Comenta EU QUERO que a gente te chama. ---------- */
def(19, { hudL: 'CAIXA DE COMENTÁRIOS', hudR: 'PALAVRA · EU QUERO', flash: .35, num: () => 20,
  html: `<div class="cap" id="s19cap" data-r="0-6"></div>
<div class="big n" id="s19c">Comenta</div><div class="big g glow" id="s19e">EU QUERO</div><div class="cap" id="s19f" data-r="10-14"></div>
<div id="s19rays"></div>
<div class="card" id="s19pn"><div id="s19tt">Comentários</div>
${[0, 1, 2, 3].map(i => `<div class="s19row" style="top:${118 + i * 112}px"><i class="s19av"></i><div class="sk" style="position:absolute;left:84px;top:8px;width:${[58, 44, 62, 36][i]}%;height:14px"></div><div class="sk" style="position:absolute;left:84px;top:36px;width:${[36, 52, 28, 48][i]}%;height:14px"></div></div>`).join('')}
<div class="pill" id="s19in"><i class="s19av" style="background:var(--g)"></i><span class="mono" id="s19tx"></span><b id="s19pb">Publicar</b></div></div>
<div class="lbl" id="s19hd">@exosmkt · @mauriciomagnavitarocha</div>`,
  upd(c) {
    const { l, d, T, sc, frame } = c, tc = T('com'), te = T('eu'), tq = T('quero'), th = T('chama');
    show($('s19pn'), K(l, .1, .28), { x: 60, y: 0 });
    slam($('s19c'), K(l, tc - .03, .2), 1.3);
    const e = $('s19e'), pe = K(l, te - .03, .24); slam(e, pe, 1.5);
    let typed = l < te ? '' : 'EU QUERO'.slice(0, Math.round(8 * K(l, te, tq + .25 - te)));
    $('s19tx').innerHTML = (typed || '<span style="opacity:.4">Comentar…</span>') + (frame % 16 < 9 && typed.length < 8 ? '<i class="s6cur" style="width:3px;height:30px;vertical-align:-5px"></i>' : '');
    const pub = K(l, th + .15, .2); $('s19pb').style.textShadow = `0 0 ${24 * pub}px rgba(48,220,104,${pub})`; $('s19in').classList.toggle('on', pub > 0);
    const rays = $('s19rays'), b = K(l, th + .2, .3); rays.style.opacity = b * (.5 + .15 * Math.sin(l * 8)) * (1 - K(l, d - 1.1, .6)); rays.style.transform = `rotate(${l * 10}deg) scale(${lerp(.4, 1.2, eo(b))})`;
    c.fx = l > th + .2 ? Math.pow(1 - K(l, th + .2, .4), 2) * .4 : 0;
    $('s19hd').style.opacity = K(l, .4, .3) * .8;
    $('black').style.opacity = eio(K(l, d - .9, .8));   // fecho: apaga para o preto
  } });
