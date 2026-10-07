# Sistema visual

Sumário: 1. A ideia · 2. Cor · 3. Tipografia · 4. Camadas fixas · 5. Movimento ·
6. Enquadramento por formato · 7. Capa · 8. Checklist antes de renderizar

## 1. A ideia

Tela escura, uma cor só, tipografia enorme e uma moldura de "instrumento" (HUD, cruzes nos
cantos, grade, grão de filme). O que dá a cara de produção cara não é a quantidade de efeito: é
a **disciplina**. Uma cor de destaque. Um acontecimento por vez. Tudo no tempo da voz.

Quando estiver em dúvida entre acrescentar um efeito e tirar um elemento, tire o elemento.

## 2. Cor

| Papel | Valor | Onde |
|---|---|---|
| Fundo | `#050505` | sempre |
| Texto | `#fff` | legendas, palavras gigantes |
| Destaque | `#30DC68` (variável `--g`) | palavras marcadas com `*`, bordas, brilhos, ícones |
| Negação | `#ff3b3b` | laser, cartão recusado. Só para "não", "sem", "antes". |
| Interface | branco a 46–55% | HUD, rótulos |

Troque o destaque pela cor da marca com `scripts/paleta.py` logo depois de copiar o motor (ele
parte dos valores originais; rodar duas vezes no mesmo projeto não funciona). Cores que
funcionam: saturadas e claras o bastante para brilhar no preto (laranja, azul elétrico, ciano,
amarelo, rosa). Cor escura (azul-marinho, vinho, verde-garrafa) some; nesse caso use uma versão
mais clara da cor da marca e avise o usuário.

Não acrescente uma segunda cor de destaque. O vermelho já é a segunda cor, e tem um sentido só.

## 3. Tipografia

Duas famílias, ambas incluídas em `assets/`:

- **Inter** (variável, 100–900): tudo o que é mensagem.
- **JetBrains Mono** (classe `mono`, `lbl`, `hdr`): tudo o que é interface e código.

| Elemento | Paisagem | Retrato | Peso |
|---|---|---|---|
| Legenda (`cap`) | 60–84 px | 52–76 px | 800, espaçamento −0,045em |
| Palavra gigante (`big`) | 160–340 px | 130–290 px | 900, maiúsculas, espaçamento −0,055em |
| Rótulo (`lbl`) | 18–24 px | 18–22 px | 500, maiúsculas espaçadas |

- A palavra gigante é **uma ou duas palavras**. Três linhas de texto gigante não é ênfase, é
  parede.
- No retrato a legenda quebra linha sozinha; dê `left` e `right` para ela ter largura.
- Legenda nunca passa de duas linhas. Passou, divida em duas legendas ou em duas cenas.
- Texto branco sobre o preto, sempre. Texto colorido só nas palavras de destaque.

## 4. Camadas fixas

Já estão no `scene.html` e aparecem em todas as cenas. Não recrie.

- **Grade e luz de topo** (`#bg`), **chão em perspectiva** (`#floor`, opacidade por cena).
- **HUD**: número da cena (canto superior esquerdo), relógio `REC` (superior direito), dois
  textos por cena (`hudL`, `hudR`).
- **Cruzes** nos quatro cantos, **vinheta**, **grão de filme**.

O HUD é onde a cena ganha textura sem ganhar ruído. Escreva `hudL`/`hudR` curtos, em maiúsculas,
no formato `RÓTULO · VALOR`, e de preferência com um valor que **muda** durante a cena
(`PROGRAMAS · 3` virando `0` conforme os cartões são riscados). Um contador que reage à fala
vale mais que qualquer partícula.

## 5. Movimento

- **Entrada**: 0,15 a 0,25 s. Sobe 20–50 px, sai do desfoque, cresce de 94% a 100% (`show`).
- **Palavra gigante**: 0,18 a 0,26 s. Vem de 130–170% e desfocada, encaixa (`slam`). Sempre na
  sílaba forte da palavra falada.
- **Corte entre cenas**: automático (clarão + risco de luz + leve aproximação). Ajuste a força
  com `flash`. Revelações pedem `.3` a `.45`; cenas calmas, `0` a `.16`.
- **Vida depois da entrada**: toda cena tem uma aproximação lenta automática (2,2%). Elementos
  parados por mais de 2 s pedem um movimento contínuo discreto: anel girando, cursor piscando,
  barra enchendo, contador subindo.
- **Saída**: quase nunca. O corte limpa a tela. Só anime saída quando um elemento dá lugar a
  outro dentro da mesma cena.
- **Antecipe a voz** em 0,03 a 0,12 s. Elemento que entra depois da palavra parece atrasado.
- **Escalone**: itens de uma lista entram com 0,06 a 0,09 s de diferença, ou cada um na sua deixa.

O que evitar: rotação de texto, quique exagerado, mais de um clarão por cena, elementos entrando
de quatro direções diferentes. A direção padrão é de baixo para cima.

## 6. Enquadramento por formato

### Paisagem (1920×1080)

- Margem lateral de 140 px para texto alinhado à esquerda.
- Legenda no topo (y 90–190) ou centralizada; acontecimento principal entre y 300 e 800.
- Faixa de baixo (y > 900) livre para uma segunda legenda ou vazia. O HUD mora em y 1040.
- Se o vídeo vai para o Explorar do Instagram na horizontal, o terço inferior e o canto
  superior direito são cobertos pela interface: mensagem principal no topo e no centro.

### Retrato (1080×1920)

A rede desenha a própria interface por cima do vídeo. O que cai nessas faixas some:

| Faixa | Tamanho | O que a rede põe ali |
|---|---|---|
| Topo | 230 px | barra de status, nome do perfil |
| Base | 470 px | @, legenda, áudio |
| Laterais | 70 px | botões (à direita) |

**Todo conteúdo fica entre x 96–984 e y 300–1400.** A folga lateral existe porque cada cena
tem uma aproximação lenta de 2,2%: o que começa em x 80 termina a cena em x 70, em cima do
limite. Na folha de contato do retrato, a moldura amarela é esse limite (70 / 230 / 470): nada
de texto encosta nela.

O HUD é a exceção: fica na borda interna das margens (y 248 e y 1430), fora da faixa de
conteúdo. É textura, não mensagem, e no celular quase não se lê. O bloco "camadas fixas" no
topo do `layout_P.js` cuida disso e abre a vinheta, que no retrato escureceria o texto dos
cantos.

O retrato não é o paisagem encolhido. O que muda:

- O que estava **lado a lado** fica **empilhado** (três cartões em linha viram coluna ou 2+1).
- Legenda sobe para y 310–600 e ganha `left`/`right` para quebrar linha.
- Palavras gigantes diminuem até caberem na largura de 920 px; se não couber numa linha, uma
  palavra por linha.
- Feixes e lasers mudam de direção: use variável no layout (`--v:1`, `--a:90deg`) e leia com
  `cssv`, como a cena 13.

## 7. Capa

A capa do Reels aparece em três recortes: 9:16 no perfil de Reels, 3:4 na grade do feed e 1:1
em alguns lugares. Gere a capa em 1080×1920, mas com **todo o conteúdo dentro do quadrado
central** (y 420–1500). Assim nenhum recorte corta o texto.

A capa mais simples é um quadro do próprio vídeo: escolha a cena com a palavra gigante mais
forte e tire com `preview P <segundo>`. O arquivo sai em `preview/P/t_<segundo>.png` (o segundo
com duas casas: `t_2.90.png`), já no tamanho certo. Confira se o conteúdo está dentro do quadrado central; se não estiver, a capa pede um
layout próprio (uma cena extra fora da linha do tempo não existe: ajuste as posições só para
tirar a foto e desfaça).

## 8. Checklist antes de renderizar

- [ ] Nenhum texto do exemplo sobrou (nomes, números, @, palavra da chamada, `<title>`).
- [ ] A primeira cena tem `flash: 0` e a palavra forte chega cedo.
- [ ] Folha de contato limpa nos formatos que serão entregues.
- [ ] Retrato: tudo dentro de x 96–984, y 300–1400 (nada encosta na moldura amarela da folha).
- [ ] Cada cena tem um acontecimento principal, e ele coincide com a palavra forte.
- [ ] No máximo duas palavras destacadas por frase.
- [ ] A última cena apaga para o preto.
- [ ] Números e afirmações conferidos com o usuário.
