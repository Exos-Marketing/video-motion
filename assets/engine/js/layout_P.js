/* Posicoes da versao RETRATO (1080x1920), para Reels.
 *
 * Carrega DEPOIS do layout_L.js e so declara o que muda: P(seletor, regra) junta
 * propriedade por propriedade com a regra do paisagem (cores, bordas e gradientes
 * continuam valendo; posicao e tamanho sao trocados aqui).
 *
 * Zona segura do Reels: 230px no topo, 470px embaixo, 70px nas laterais.
 * Conteudo entre x 96..984 e y 300..1400. O HUD fica na borda interna das margens,
 * fora da faixa de conteudo: e textura, nao mensagem.
 */

/* camadas fixas: HUD na borda da zona segura; vinheta mais aberta, para nao escurecer
   texto nos cantos da faixa de conteudo (no retrato a elipse e estreita) */
P('#hudN', 'left:80px;top:248px'); P('#hudRec', 'right:80px;top:248px');
P('#hudL', 'left:80px;bottom:478px'); P('#hudR', 'right:80px;bottom:478px');
P('#vig', 'background:radial-gradient(ellipse at center,transparent 66%,rgba(0,0,0,.6) 100%)');

/* 1 */
P('#s1a', 'left:84px;top:740px;font-size:96px');
P('#s1spark', 'left:84px;top:852px;--w:810');
P('#s1vl', 'left:860px;--d:-700'); P('#s1hl', 'top:1240px;--d:-700');
P('#s1ret', 'left:740px;top:1120px'); P('#s1xy', 'left:516px;top:1202px');
P('#s1b', 'left:84px;top:500px;font-size:58px');
P('#s1v', 'left:74px;top:590px;font-size:290px');
P('#s1d', 'left:84px;top:886px;font-size:130px'); P('#s1n', 'left:526px;top:886px;font-size:130px');

/* 2 */
P('#s2cap', 'left:84px;right:80px;top:500px;font-size:64px');
P('.s2c', 'top:780px;width:290px;height:320px');
P('#s2c0', 'left:80px'); P('#s2c1', 'left:395px'); P('#s2c2', 'left:710px');
P('.s2c svg', 'left:80px;top:54px;width:130px;height:130px'); P('.s2c .lbl', 'bottom:44px;font-size:20px');
[74, 389, 704].forEach((x, i) => {
  P('#s2l' + i, `left:${x}px;top:774px;width:449px;--a:47.7deg`);
  P('#s2m' + i, `left:${x}px;top:1106px;width:449px;--a:-47.7deg`);
});

/* 3 */
P('#s3cap', 'left:60px;right:60px;top:600px;font-size:76px');
P('#s3box', 'left:80px;top:770px;width:920px;height:300px');
P('#s3in .lbl', 'font-size:19px');
P('#s3t', 'top:56px;font-size:190px');

/* 4 */
P('#s4cap', 'left:84px;top:330px;font-size:58px');
P('#s4c', 'left:76px;top:430px;font-size:228px'); P('#s4o', 'left:76px;top:644px;font-size:205px');
P('#s4b', 'left:390px;top:900px;width:300px;height:300px;--dx:0px;--dy:-330px;--s0:1.9');
P('#s4t1', 'left:84px;top:1250px;font-size:17px'); P('#s4t2', 'right:84px;top:1284px;font-size:17px');

/* 5 */
P('#s5cap', 'left:60px;right:60px;top:430px;font-size:57px');
P('#s5g0', 'left:120px;top:640px;--fx:-200;--fy:-150'); P('#s5g1', 'left:690px;top:660px;--fx:200;--fy:-150');
P('#s5g2', 'left:100px;top:1010px;--fx:-220;--fy:170'); P('#s5g3', 'left:650px;top:1030px;--fx:220;--fy:170');
P('#s5g4', 'left:420px;top:1120px;--fx:0;--fy:240'); P('#s5g5', 'left:410px;top:580px;--fx:0;--fy:-220');
P('#s5p', 'left:80px;top:780px;width:920px;height:108px;padding:0 24px 0 34px;gap:16px');
P('#s5pre', 'font-size:42px'); P('#s5t', 'font-size:33px'); P('#s5cur', 'height:40px');

/* 6 */
P('#s6cap', 'left:84px;top:320px;font-size:60px');
P('#s6p', 'left:80px;top:410px;width:920px;height:480px');
P('#s6t', 'left:38px;right:38px;top:92px;font-size:43px;line-height:1.45');
P('.s6cur', 'width:17px;height:44px');
P('.s6c', 'top:960px;width:215px;height:260px');
P('#s6c0', 'left:80px'); P('#s6c1', 'left:315px'); P('#s6c2', 'left:550px'); P('#s6c3', 'left:785px');
P('.s6sk', 'left:24px;right:24px;top:56px'); P('.s6in', 'top:26px;height:160px'); P('.s6in svg', 'width:124px;height:124px');
P('.s6big', 'top:56px;font-size:40px'); P('.s6aa', 'top:28px;font-size:86px'); P('.s6l', 'bottom:22px;font-size:13px');

/* 7 */
P('#s7cap1', 'left:40px;right:40px;top:316px;font-size:52px'); P('#s7cap2', 'left:40px;right:40px;top:384px;font-size:52px');
P('#s7c0', 'left:240px;top:470px;width:280px;height:498px'); P('#s7c1', 'left:560px;top:470px;width:280px;height:498px');
P('#s7c2', 'left:180px;top:996px;width:720px;height:405px');
P('#s7l0', 'left:254px;top:484px'); P('#s7l1', 'left:574px;top:484px'); P('#s7l2', 'left:194px;top:1010px');

/* 8 */
P('#s8cap1', 'left:40px;right:40px;top:390px;font-size:70px'); P('#s8cap2', 'left:40px;right:40px;top:1150px;font-size:70px');
P('#s8r', 'left:280px;top:560px'); P('#s8l1', 'left:340px;top:730px'); P('#s8l2', 'left:640px;top:900px');
P('#s8p', 'left:80px;top:480px;width:920px;height:780px');

/* 9 */
P('#s9cap1', 'left:84px;top:320px;font-size:62px'); P('#s9cap2', 'left:84px;top:392px;font-size:62px');
P('#s9chip', 'left:84px;top:520px;font-size:24px'); P('#s9arrow', 'display:none');
P('#s9pl', 'left:80px;top:610px;width:920px;height:560px'); P('#s9play', 'left:380px;top:200px');

/* 10 */
P('#s10cap', 'left:84px;top:316px;font-size:56px'); P('#s10cap2', 'left:40px;right:40px;top:1316px;font-size:56px');
P('#s10ed', 'left:80px;top:410px;width:920px;height:520px'); P('#s10code', 'left:26px;right:26px;top:78px');
P('.cl', 'font-size:27px;line-height:60px');
P('#s10st', 'left:80px;top:960px;width:920px;height:330px'); P('#s10sh', 'left:30px;top:22px');
P('#s10box', 'left:50px;top:90px;width:500px;height:190px'); P('#s10w', 'font-size:120px');
P('#s10t0', 'left:600px;top:96px'); P('#s10t1', 'left:740px;top:96px'); P('#s10t2', 'left:600px;top:168px'); P('#s10t3', 'left:600px;top:240px');
P('#s10bar', 'left:716px;top:256px;width:160px');

/* 11 */
P('#s11cap1', 'left:40px;right:40px;top:410px;font-size:58px'); P('#s11cap2', 'left:40px;right:40px;top:1010px;font-size:92px');
P('#s11strip', 'top:580px'); P('#s11head', 'left:540px;top:552px'); P('#s11hl', 'left:556px;top:530px');

/* 12 · lista em pe, com o laser descendo */
P('#s12cap', 'left:84px;top:320px;font-size:76px');
P('.s12c', 'width:920px;height:132px');
[470, 622, 774, 926, 1078].forEach((y, i) => P('#s12c' + i, `left:80px;top:${y}px`));
P('.s12c svg', 'left:36px;top:26px;width:80px;height:80px');
P('.s12n', 'left:160px;right:auto;top:34px;text-align:left;font-size:48px');
P('.s12k', 'left:auto;right:36px;bottom:auto;top:54px;text-align:right;font-size:16px');
P('#s12laser', 'left:156px;top:440px;width:800px;--a:90deg');

/* 13 · passos em pe, com o feixe descendo */
P('#s13cap', 'left:84px;top:320px;font-size:76px');
P('.s13c', 'width:400px;height:190px'); P('.s13in svg', 'width:120px;height:120px'); P('.s13pill', 'font-size:26px;padding:14px 22px');
P('.s13w', 'width:auto;text-align:left;font-size:92px');
[450, 680, 910, 1140].forEach((y, i) => { P('#s13c' + i, `left:80px;top:${y}px`); P('#s13w' + i, `left:540px;top:${y + 44}px`); });
P('#s13beam', 'left:278px;top:450px;width:4px;height:880px;transform-origin:50% 0;--len:880;--v:1');
P('#s13dot', 'left:266px;top:438px');

/* 14 e 15 · painel de previa */
P('.pvcap', 'left:40px;right:40px;top:316px;font-size:54px');
P('.pv', 'left:80px;top:410px;width:920px;height:500px'); P('.pvh', 'left:26px;top:20px'); P('.pvlang', 'right:20px;top:12px');
P('.pvstage', 'left:46px;right:26px;top:130px;height:290px'); P('.pvt1', 'top:20px;font-size:100px'); P('.pvt2', 'top:132px;font-size:100px');
P('.pvbar', 'left:46px;right:46px;bottom:38px');
P('.pve', 'left:80px;top:940px;width:440px;height:262px'); P('.pvsvg', 'left:20px;top:58px;width:400px;height:190px');
P('.pvc', 'left:540px;top:940px;width:460px;height:262px'); P('.pvcode', 'left:18px;right:18px;top:60px');
P('.pvcode .cl', 'font-size:22px;line-height:46px;padding:0 12px');
P('.pvsay', 'left:140px;top:1240px;width:800px;height:88px'); P('.pvsay .mono', 'font-size:34px');

/* 16 */
P('#s16cap1', 'left:40px;right:40px;top:312px;font-size:52px'); P('#s16cap2', 'left:40px;right:40px;top:380px;font-size:52px');
P('.s16c', 'width:450px;height:226px');
[[80, 480], [550, 480], [80, 726], [550, 726], [80, 972], [550, 972]].forEach(([x, y], i) => P('#s16c' + i, `left:${x}px;top:${y}px`));
P('.s16f', 'left:26px;top:24px;height:30px'); P('.s16k', 'left:88px;top:30px;font-size:17px');
P('.s16a', 'left:26px;top:92px;font-size:47px'); P('.s16b', 'left:26px;top:148px;font-size:47px');

/* 17 */
P('#s17cap1', 'left:84px;right:60px;top:312px;font-size:52px'); P('#s17cap2', 'left:84px;right:60px;top:380px;font-size:52px');
P('#s17ground', 'left:80px;top:1290px;width:920px');
P('#s17wall', 'left:440px;bottom:630px;--h:600'); P('#s17h', 'left:660px;top:1256px');
P('#s17br', 'left:110px;top:1156px'); P('#s17brl', 'left:110px;top:1226px');
P('#s17world', 'left:830px;top:1118px;width:140px;height:140px'); P('#s17wl', 'left:864px;top:1262px');
P('#s17dot', 'left:230px;top:1258px;--dx:655;--arc:300');
P('#s17cap3', 'left:84px;right:60px;top:312px;font-size:52px'); P('#s17cap4', 'left:84px;right:60px;top:312px;font-size:52px');
P('#s17n', 'left:76px;top:392px;font-size:240px'); P('#s17p', 'left:450px;top:506px;font-size:104px');
P('#s17cv', 'left:60px;top:700px;width:960px;height:500px');

/* 18 */
P('#s18arc', 'inset:auto;left:-44px;top:329px;width:1169px;height:657px;overflow:visible');
P('#s18rec', 'left:480px;top:640px'); P('#s18q', 'left:40px;right:40px;top:790px;font-size:60px');
P('#s18no', 'top:690px;font-size:280px');
P('#s18blk', 'transform-origin:50% 43%');
P('#s18l1', 'left:30px;right:30px;top:740px;font-size:52px'); P('#s18l2', 'left:30px;right:30px;top:810px;font-size:52px'); P('#s18l3', 'left:30px;right:30px;top:880px;font-size:52px');
P('#s18pr', 'left:auto;right:120px;top:1000px');
P('#s18eb', 'left:600px;top:640px;font-size:60px'); P('#s18abs', 'top:736px;font-size:190px');
P('#s18rays', 'left:-60px;top:222px');

/* 19 */
P('#s19cap', 'left:84px;right:60px;top:316px;font-size:54px');
P('#s19c', 'left:78px;top:410px;font-size:132px'); P('#s19e', 'left:74px;top:536px;font-size:190px');
P('#s19f', 'left:84px;top:726px;font-size:60px');
P('#s19pn', 'left:80px;top:850px;width:920px;height:500px');
P('#s19pn .s19row + .s19row + .s19row', 'display:none');     // no retrato cabem duas linhas de comentario
P('#s19tx', 'font-size:30px');
P('#s19rays', 'left:-80px;top:480px');
P('#s19hd', 'bottom:516px;font-size:18px');
