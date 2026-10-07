# Cenas

Sumário: 1. Arquivos do projeto · 2. Anatomia de uma cena · 3. Ferramentas do motor ·
4. Legendas · 5. Posições (paisagem e retrato) · 6. Catálogo das 19 cenas-modelo ·
7. Receita para uma cena nova · 8. Armadilhas

## 1. Arquivos do projeto

```
meu-video/
├── scene.html        página + estilos compartilhados (cartão, palavra gigante, laser, chip…)
├── roteiro.json      o texto, com destaques e deixas           → você escreve
├── timeline.json     o instante de cada palavra                → o timeline.py gera
├── js/core.js        o motor. Não precisa mexer.
├── js/layout_L.js    posições no paisagem (1920x1080)          → você escreve
├── js/layout_P.js    o que muda no retrato (1080x1920)         → você escreve (mantenha o
│                     bloco "camadas fixas" do topo: HUD e vinheta do retrato)
├── js/scenes_a.js    cenas 1–7 do exemplo  ┐
├── js/scenes_b.js    cenas 8–13            ├ modelos: adapte, reescreva, apague
├── js/scenes_c.js    cenas 14–19           ┘
├── assets/           fontes, bandeiras, mapa; ponha aqui logo e imagens do usuário
└── render.mjs        fotografa os quadros (o build.sh chama)
```

Pode manter os três arquivos de cenas ou juntar tudo num `js/cenas.js`. Se trocar os nomes,
ajuste as tags `<script>` no fim do `scene.html`, e leve junto o objeto `ICO` (os ícones), que
mora no topo do `scenes_a.js`. A ordem importa: `core.js`, `layout_L.js`,
`layout_P.js` (só no retrato), cenas, `boot()`.

## 2. Anatomia de uma cena

```js
def(3, {
  hudL: 'GRAVIDADE · 9,8',            // texto do canto inferior esquerdo (ou função de c)
  hudR: 'TEMPLATES · 0',              // canto inferior direito (ou função de c)
  html: `<div class="cap c" id="s3cap" data-r="0-3"></div>
         <div id="s3box"><div class="big n" id="s3t">template</div></div>`,
  init(sc) { /* opcional: roda uma vez; guarde o que precisar em sc */ },
  upd({ l, T }) {                      // roda a CADA quadro
    const t = T('tpl');                // segundo (dentro da cena) em que "template." é dito
    show($('s3box'), K(l, .02, .2), { y: 30, s: .96 });
    slam($('s3t'), K(l, t - .03, .18), 1.7);
  },
});
```

O número do `def` é o `id` da cena no `roteiro.json`. Opções:

| Opção | Efeito | Padrão |
|---|---|---|
| `html` | O conteúdo da cena. Ids únicos no vídeo inteiro: use o prefixo `sN`. | |
| `upd(c)` | Posiciona tudo em função do tempo. | |
| `init(sc)` | Preparo único (gerar partículas, medir, desenhar num canvas). | |
| `hudL`, `hudR` | Textos do HUD. Função `c => texto` para contadores que mudam; recebe o mesmo `c` do `upd`. | vazio |
| `flash` | Força do clarão no corte de entrada (0 a 1). Suba em cenas de revelação. `0` = corte seco, sem clarão nem risco de luz: use na **primeira cena**, para o vídeo não abrir com um risco no quadro zero. | .16 |
| `floor` | Opacidade do chão em perspectiva (0 a 1). | .35 |
| `noIn` | `true` = entra sem corte (continua a cena anterior, como a 15 continua a 14). | false |
| `num` | Função que troca o número mostrado no canto superior esquerdo. | o id |

O `upd` recebe um objeto `c`:

| Campo | O que é |
|---|---|
| `l` | **Tempo local**: segundos desde o começo da cena. É o que você mais usa. |
| `d` | Duração da cena. |
| `T('nome')` | Tempo local em que a palavra com a deixa `#nome` é dita. Deixa inexistente devolve um número enorme (o movimento simplesmente não acontece; se uma animação nunca dispara, confira o nome). |
| `tok(i)` | Tempo local da palavra de índice `i` da cena. |
| `sc` | A cena: `sc.el` (o elemento), `sc.tokens`, `sc.cues`, e o que o `init` guardou. |
| `frame` | Número do quadro. Serve para piscar: `frame % 16 < 9`. |
| `t` | Tempo absoluto do vídeo. |
| `c.fx = v` | Escreva aqui para pedir um clarão no meio da cena (0 a 1). |

**O padrão de quase toda linha de animação:**

```js
const p = K(l, T('deixa') - .05, .2);   // progresso 0→1, começando 0,05 s antes da palavra, durando 0,2 s
show(elemento, p);                       // aplica
```

Começar um pouco **antes** da palavra (0,03 a 0,12 s) é o que faz o elemento "chegar junto" com
a voz em vez de atrasado.

## 3. Ferramentas do motor

Definidas em `js/core.js`, disponíveis em qualquer cena:

| Função | Uso |
|---|---|
| `K(l, a, d)` | Progresso linear de 0 a 1, começando em `a` e durando `d` segundos. A base de tudo. |
| `eo(p)` | Desacelera no fim (entrada natural). `eio(p)` acelera e desacelera. `back(p)` passa um pouco do ponto e volta. |
| `lerp(a, b, p)` | Mistura `a` e `b`. `clamp(v, min, max)` limita. |
| `show(el, p, {x, y, s, b})` | Entrada padrão: aparece, sobe `y` px (padrão 26), cresce de `s` (padrão .94) e desfoca `b` px (padrão 8). |
| `slam(el, p, de)` | Palavra gigante batendo na tela: vem grande (`de`, padrão 1.5) e desfocada, encaixa. |
| `typedHTML(sc, a, b, l, minusculas)` | Texto **digitado** no ritmo da fala, das palavras `a` até `b` da cena. Para campos de prompt e chat. Devolve HTML (use em `innerHTML`), mantém o destaque das palavras com `*` e termina com um espaço (`.trim()` se for contar caracteres). |
| `$('id')` | `document.getElementById`. |
| `pad(n, casas)` | Número com zeros à esquerda (contadores do HUD). |
| `rnd(semente)` | Gerador de números "aleatórios" que se repete igual a cada render. **Nunca** `Math.random()`. |
| `cssv(el, '--nome', padrao)` | Lê um número definido no layout. É como o mesmo código serve aos dois formatos (ver seção 5). |
| `COR` | A cor principal em `[r, g, b]`, para cor calculada (`rgb(${lerp(255, COR[0], g)}, …)`). |
| `W`, `H`, `OR` | Largura, altura e orientação (`'L'` ou `'P'`). |
| `ICO.nome` | Ícones de traço prontos em `scenes_a.js`: `cam`, `edit`, `des`, `doc`, `mic`, `cc`, `exp`, `play`, `globe`. Novos ícones seguem o mesmo molde: SVG `viewBox="0 0 120 120"` com `class="ico"`. |

Classes de estilo prontas em `scene.html`:

| Classe | O que é |
|---|---|
| `cap` | Legenda. Com `c` centraliza; com `thin` fica mais leve. |
| `big` | Palavra gigante em maiúsculas. Com `n` mantém minúsculas. |
| `g` | Cor de destaque com brilho. `glow` aumenta o brilho (para palavra gigante). |
| `card` | Cartão com borda e fundo na cor. `card on` = aceso. |
| `chip`, `tag`, `pill` | Etiqueta pequena, etiqueta de código, campo arredondado. |
| `lbl`, `hdr`, `mono` | Texto pequeno de interface em fonte monoespaçada. |
| `laser` | Traço vermelho que risca (anime com `scaleX`). |
| `ln` | Linha fina luminosa. |
| `st`, `dash`, `ico` | Traços de SVG na cor principal. |
| `sk` | Barra de "esqueleto" (texto falso dentro de cartão). |
| `flag` | Bandeira (imagens em `assets/flags/`: br, pt, gb, es, fr, de, it). |
| `cl` | Linha de código (`<b>` = número da linha, `.k` = chave, `.s` = valor). |

## 4. Legendas

Uma legenda é um elemento vazio com o intervalo de palavras que ela mostra:

```html
<div class="cap c" id="s8cap1" data-r="0-4"></div>
```

O motor preenche com as palavras 0 a 4 da cena e revela cada uma quando é dita, já com o
destaque das marcadas com `*`. Você não anima legenda; só posiciona no layout.

- Os índices são **da cena**, a partir de 0, contando todas as partes.
- Uma palavra que vira elemento próprio (palavra gigante, texto digitado) fica **fora** de todo
  `data-r`, senão aparece duas vezes. No exemplo, cena 1: a legenda cobre "que dá pra criar um"
  (5–9) e as palavras 10–12 são os três elementos `.big`.
- Duas legendas na mesma posição: esconda a primeira quando a segunda começa
  (`$('a').style.opacity = 1 - K(l, tok(5) - .06, .16)`).
- Frase longa: divida em duas legendas, uma embaixo da outra, em vez de diminuir a fonte.

## 5. Posições (paisagem e retrato)

Nenhuma posição fica dentro da cena. O `html` e o `upd` são os mesmos nos dois formatos; o que
muda é a folha de posições.

**`js/layout_L.js`** — um objeto com uma entrada por elemento, em pixels sobre 1920x1080:

```js
const LAYOUT = {
  '#s3cap': 'left:0;right:0;top:140px;font-size:80px',
  '#s3box': 'left:560px;top:330px;width:800px;height:300px',
  '.s2c':   'top:330px;width:440px;height:420px',        // classe: vale para os três cartões
  '#s2c0':  'left:220px', '#s2c1': 'left:740px', '#s2c2': 'left:1260px',
  '.s2c .lbl': '!text-align:center',                      // "!" = NÃO vira position:absolute
};
```

Toda regra recebe `position:absolute` sozinha. Comece com `!` quando o elemento deve ficar no
fluxo (filho de flex, texto em linha). As regras viram CSS comum dentro de `#wrap`, então
alcançam também as camadas fixas (`#hudL`, `#vig`, `#floor`) se você precisar ajustar uma.

**`js/layout_P.js`** — carrega depois e só declara **o que muda** no retrato:

```js
P('#s3cap', 'left:60px;right:60px;top:600px;font-size:76px');
P('#s2c0', 'left:84px;top:640px'); P('#s2c1', 'left:400px;top:640px');
```

`P()` (definida no motor) junta propriedade por propriedade com a regra do paisagem: cor, borda
e gradiente continuam; posição e tamanho são trocados. Elemento sem `P()` fica onde estava no paisagem, e
quase sempre isso está errado: **todo elemento posicionado precisa de uma linha no retrato**.

**Números que mudam com o formato** (uma distância de deslocamento, um ângulo de laser) vão no
layout como variável e são lidos com `cssv`:

```js
'#s1vl': 'left:1520px;top:0;width:2px;height:100%;--d:-900',     // layout_L
P('#s1vl', 'left:860px;--d:-700');                                // layout_P
vl.style.transform = `translateX(${lerp(cssv(vl, '--d', -600), 0, p)}px)`;   // cena
```

Zona segura e tamanhos de fonte por formato estão em `design.md`.

## 6. Catálogo das 19 cenas-modelo

Cada linha: o que a cena faz, quando reaproveitar e as deixas que ela espera. Para usar uma,
copie o `def`, as entradas `#sN…`/`.sN…` dos dois layouts, renomeie o prefixo e troque o conteúdo.

| # | Padrão visual | Use quando | Deixas |
|---|---|---|---|
| 1 | **Abertura.** Legenda fina sai, mira e linhas entram, três palavras gigantes batem uma a uma. | Gancho que termina em 2–3 palavras fortes. | `big1` `big2` `big3` |
| 2 | **Cartões riscados a laser.** Três cartões com ícone entram e são cortados em X. | "sem X, sem Y, sem Z"; qualquer lista de coisas eliminadas. | uma por cartão (`cam` `edit` `des`) |
| 3 | **Caixa com palavra que cai dentro.** Moldura com cantos, a palavra bate e a caixa treme. | Negar uma ideia numa palavra ("não é template"). | `tpl` |
| 4 | **Revelação de marca.** Símbolo cresce e gira, nome entra em palavras gigantes, fichas técnicas ao lado. | Apresentar a ferramenta, o método, o produto. Troque o símbolo pelo logo do usuário (`<img>`). | `claude` `opus` `ver` |
| 5 | **Etiquetas somem, sobra um campo de texto.** Seis etiquetas voam para fora; a frase é digitada no campo. | "Você não precisa de nada disso, só de…". | `nenhum` `so` `fique` |
| 6 | **Painel de pedido + cartões que acendem.** Texto digitado em cima; embaixo, quatro cartões-esqueleto acendem conforme cada parte é dita. | Um exemplo concreto com 3–4 parâmetros. | `tipo` `p0` + uma por cartão (`min` `txt` `curso` `br`) |
| 7 | **Três exemplos lado a lado.** Cartões com miniatura desenhada (barras, pontos, A×B). | Prova de variedade; portfólio. Se existir `assets/exemplos/1.jpg`, `2.jpg`, `3.jpg`, a imagem cobre a miniatura. | `r1` `r2` `r3` `assim` |
| 8 | **Mira num ponto.** Círculos se abrem, colchetes fecham no centro, o ponto pulsa. | "Só que tem um detalhe"; virar a atenção para uma coisa só. | `det` `que` `perc` |
| 9 | **Negação.** Origem → seta → cartão que fica vermelho e apaga. | "X **não** faz Y". | `nao` `dir` |
| 10 | **Editor de código + resultado.** Linhas entram, cada linha acende quando é citada e o resultado ao lado muda junto (texto, cor, movimento, tempo). | Mostrar um mecanismo com partes; "cada coisa vira uma linha". | `esc` `cod` `l1` `l2` `l3` `l4` `tudo` `linha` |
| 11 | **Tira de filme.** Quadros correm atrás de uma linha de leitura com contador. | Processo contínuo, "quadro a quadro", "passo a passo". | `rend` `q1` `q2` |
| 12 | **Etapas riscadas.** Cinco cartões entram um a um; um laser atravessa todos. | O jeito antigo, a lista longa. Faz par com a 13. | `a1`…`a5` |
| 13 | **Fluxo novo.** Quatro passos ligados por um feixe que avança até o passo falado. | O jeito novo, a lista curta. | `e` `n1`…`n4` |
| 14 | **Prévia ao vivo.** Janela com título em laço, curva de movimento, código; um pedido digitado muda a cor e a velocidade. | "É só pedir e muda". | `cod` `falar` `m1` `m1e` `m2` `m2e` |
| 15 | **Troca de idioma** (continua a 14, `noIn`). O título troca de língua com falha de sinal. | Mesma peça em várias línguas ou versões. | `ag` `en0` `en1` `en2` `es1` `es2` |
| 16 | **Grade de seis cartões.** Entram em cascata e pulsam juntos. | Variações, planos, idiomas, módulos. | `mesmo` `qq` `idi` `sem` `nada` |
| 17 | **Barreira que abaixa + mapa com contador.** Parte A: um muro encolhe e um ponto salta de um lado ao outro. Parte B: mapa-múndi acende ponto a ponto e o número sobe. | Parte A: um obstáculo que diminuiu. Parte B: alcance, prova em número. | A: `bar` `baixa` `br` · B: `exosA` `exos` `n141` `paises` `e2` `curto` |
| 18 | **Pergunta → "Não" → frase → palavra gigante com raios.** | O momento de honestidade seguido da afirmação mais forte. | `sub` `exp` `nao` `mas` `ideia` `pronto` `tres` `editor` `eh` `bem` `abs` |
| 19 | **Chamada final.** Palavra de ordem gigante + painel de comentários com a palavra sendo digitada; apaga para o preto. | Encerramento com "comenta X". Troque o @ em `#s19hd`. | `fora` `com` `eu` `quero` `que2` `chama` |

Notas sobre as cenas com conteúdo do exemplo embutido no código (troque sempre):

- **4**: nome e versão do modelo, fichas `#s4t1`/`#s4t2`.
- **6, 10, 14–16**: textos dentro dos cartões e do código (`S6C`, `S10L`, `PVT`, `S16`).
- **17**: os pontos do mapa vêm de `assets/mapa.json` (`pts`: `{lon, lat, peso}`). São os países
  do exemplo. Para o mapa do usuário, substitua `pts` pelos lugares dele; o número mostrado é a
  quantidade de pontos acesos. Sem dado real, não use a parte B.
- **19**: a palavra digitada (`'EU QUERO'`) e a assinatura `#s19hd`.
- **Último quadro**: a cena final deve terminar com `$('black').style.opacity = eio(K(l, d - .9, .8))`.

## 7. Receita para uma cena nova

1. Escreva a frase no `roteiro.json` com as deixas nas palavras que disparam algo.
2. Rode o `timeline.py` e anote a duração da cena e o tempo de cada deixa.
3. Decida **um** acontecimento principal (a palavra gigante, o cartão que acende, o número que
   sobe) e no máximo dois secundários. Cena com cinco coisas competindo parece amadora.
4. Escreva o `html` com ids `sN…` e classes prontas.
5. Posicione no `layout_L.js`. Rode `preview L <segundo>` num instante em que tudo já entrou.
6. Escreva o `upd`: uma linha por elemento, cada uma amarrada a uma deixa ou a um tempo local.
7. Posicione no `layout_P.js` e rode `preview P`.
8. Confira três instantes: logo depois da entrada, no meio, no fim.

## 8. Armadilhas

- **Estilo que "sobra" de um quadro para outro.** O `upd` roda em qualquer ordem de tempo (o
  preview pula direto para o meio). Se você só escreve `el.style.x` dentro de um `if`, o valor
  antigo fica quando a condição é falsa. Sempre escreva o valor nos dois ramos, como a cena 12
  faz com `borderColor`.
- **Transição CSS.** `transition` e `animation` não avançam no render. Tudo é `style` calculado.
- **Medir no `init`.** Fontes já estão carregadas, mas a cena está invisível; `clientWidth`
  funciona, `getBoundingClientRect` de elemento transformado engana. Prefira tamanhos fixos do
  layout.
- **Imagem que não carrega.** O motor espera as imagens do `html` antes de renderizar. Use
  caminho relativo (`assets/…`) e confira o nome do arquivo.
- **Deixa com nome repetido na cena.** Vale a última. Dê nomes diferentes.
- **Mexeu no texto e as legendas embaralharam.** Os `data-r` são índices; refaça a conta.
