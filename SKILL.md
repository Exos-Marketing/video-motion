---
name: video-motion
description: Cria vídeos de motion design profissionais escritos em código (HTML/CSS/JS), sem editor de vídeo e sem modelo de vídeo por IA — texto cinético sincronizado palavra a palavra com a narração, cenas com cartões, HUD, laser, mapa e contadores, renderizados quadro a quadro em MP4 paisagem (1920x1080) e retrato (1080x1920, Reels/Shorts/TikTok). Use esta skill sempre que o usuário pedir vídeo motion, motion design, motion graphics, vídeo animado, vídeo com texto animado, tipografia cinética, vídeo explicativo, vídeo de anúncio ou de lançamento sem gravação, "vídeo feito em código", "vídeo igual ao do Maurício/da Exos", Reels animado, ou quando quiser transformar um roteiro, uma copy ou uma narração em vídeo — mesmo que não use a palavra "motion".
---

# Vídeo motion escrito em código

Você vai escrever um vídeo como se escreve um site: cada cena é HTML e CSS, e o movimento é
JavaScript que posiciona tudo em função do tempo. Um navegador sem janela fotografa quadro a
quadro e o ffmpeg junta os quadros com a narração.

O motor já vem pronto e testado em `assets/engine/`, junto com um vídeo de exemplo completo
(19 cenas, 77 segundos). Você **não** escreve motor nenhum: copia, troca o roteiro, reescreve as
cenas e renderiza.

Não use modelo de vídeo por IA para este tipo de peça. Ele erra texto, muda a tipografia a cada
corte e não deixa corrigir uma palavra sem refazer tudo. Aqui cada letra é texto de verdade e
cada correção é uma linha.

## O que vem na skill

| Caminho | O que é |
|---|---|
| `assets/engine/` | O motor + o vídeo de exemplo. É o que você copia para a pasta do projeto. |
| `scripts/timeline.py` | Transforma `roteiro.json` em `timeline.json` (o instante de cada palavra). |
| `scripts/build.sh` | Confere, pré-visualiza e renderiza. Instala o que falta na primeira vez. |
| `scripts/paleta.py` | Troca a cor principal do projeto pela cor da marca. |
| `references/roteiro.md` | Como escrever o roteiro e o `roteiro.json`. Leia antes de escrever. |
| `references/cenas.md` | Como uma cena funciona + catálogo das 19 cenas-modelo. Leia antes de codar. |
| `references/design.md` | O sistema visual e as regras de enquadramento. Leia antes de codar. |

`SKILL_DIR` abaixo é a pasta onde está este arquivo.

## Antes de começar: o exemplo não é seu

O vídeo de exemplo é uma peça real da Exos Marketing. O texto, os números ("141 países"), o
@ no fim e a chamada final são deles. Servem para você ver o motor funcionando e para copiar a
**estrutura**. Nada disso pode aparecer no vídeo de outra pessoa: seria publicar, com o nome do
usuário, uma prova que não é dele. Todo texto do vídeo novo vem do usuário ou é aprovado por ele.

Pelo mesmo motivo, não invente número, depoimento nem resultado para "preencher" uma cena de
prova. Se o usuário não tem o dado, a cena vira outra coisa.

## Fluxo

### 1. Entenda o vídeo

Você precisa saber, antes de escrever qualquer coisa:

- **Sobre o que é e para quem** (uma frase).
- **O que a pessoa deve fazer no fim** (comentar uma palavra, clicar, seguir).
- **Duração**: de 15 a 80 segundos. Vídeo curto (até 30 s) pede estrutura cortada, 5 a 8 cenas
  e a palavra forte logo no primeiro segundo; acima de 80 s o render e a retenção sofrem.
- **Formato**: retrato (Reels/Shorts/TikTok), paisagem (YouTube, apresentação) ou os dois.
- **Voz**: narração gravada pelo usuário, voz gerada por IA (ele traz os arquivos) ou vídeo mudo
  com trilha colocada depois no editor da rede social.
- **Cor da marca** (um hexadecimal) e o @ que assina.

Se o usuário já deu tudo isso, não pergunte de novo. Se faltar pouco, assuma o razoável, diga o
que assumiu e siga.

### 2. Escreva o roteiro e peça o de-acordo

Leia `references/roteiro.md`. Escreva o roteiro cena a cena, em texto corrido, e **mostre ao
usuário antes de codar**. Texto é barato de mudar; cena pronta e render não são. Só avance com o
roteiro aprovado.

### 3. Monte o projeto

```bash
SKILL_DIR="<pasta desta skill>"
PROJ="<onde o usuário quer o vídeo>/meu-video"
mkdir -p "$PROJ" && cp -R "$SKILL_DIR/assets/engine/." "$PROJ/"
python3 "$SKILL_DIR/scripts/paleta.py" "$PROJ" "#HEX"     # só se a marca não for verde
```

Trabalhe sempre na cópia. A pasta da skill fica intacta para o próximo vídeo. Troque também o
`<title>` do `scene.html` pelo nome do vídeo.

### 4. Roteiro em JSON e linha do tempo

Reescreva `$PROJ/roteiro.json` com o texto aprovado (formato em `references/roteiro.md`) e rode:

```bash
python3 "$SKILL_DIR/scripts/timeline.py" "$PROJ"
```

Sem áudio, a linha do tempo sai no **modo mudo**: o tempo de cada palavra é estimado pelo ritmo.
É assim que você monta e aprova o vídeo inteiro antes de existir narração. Quando o áudio
chegar, aponte para ele no `roteiro.json`, rode de novo e as cenas se reajustam sozinhas, porque
tudo nelas é amarrado às palavras e não a segundos fixos.

O script imprime cada cena com a duração e o instante de cada deixa. Leia essa saída: cena com
menos de 1,2 s não dá tempo de ler; junte com a vizinha.

### 5. Escreva as cenas

Leia `references/cenas.md` e `references/design.md`. Para cada cena do roteiro, escolha a
cena-modelo mais próxima, copie o `def(...)` dela e as posições (`js/layout_L.js` e
`js/layout_P.js`), troque o conteúdo e renomeie os ids. Cenas sem modelo parecido você escreve
com as mesmas peças (cartão, palavra gigante, laser, chip, linha).

Apague do projeto as cenas-modelo que não usar, e as posições delas nos dois layouts. O vídeo
final só carrega o que é dele. `assets/mapa.json` e `assets/flags/` também podem sair se
nenhuma cena usar mapa ou bandeira.

Uma regra sustenta tudo e não tem exceção: **todo estado visual é função do tempo `t`**. A
página não anima sozinha; o render avança o relógio na mão e fotografa. Por isso não use
`requestAnimationFrame`, `setTimeout`, `Date.now()`, transição ou animação CSS, nem
`Math.random()` (use `rnd(semente)`). Qualquer um deles faz o vídeo sair diferente a cada render,
ou parado.

### 6. Confira antes de renderizar

```bash
bash "$SKILL_DIR/scripts/build.sh" "$PROJ" preview L     # paisagem
bash "$SKILL_DIR/scripts/build.sh" "$PROJ" preview P     # retrato
```

O `preview` primeiro percorre o vídeo inteiro atrás de erro de script. Depois fotografa **o fim
de cada cena** (logo depois da última palavra, quando tudo já entrou) e monta uma folha de
contato. **Abra a folha e olhe de verdade.**

| Arquivo | O que é |
|---|---|
| `preview/folha_P.png`, `preview/folha_L.png` | Todas as cenas lado a lado, na ordem. No retrato, a **moldura amarela** marca o limite da zona segura. |
| `preview/P/c01.png`, `c02.png`… | Cada cena em tamanho cheio. É aqui que se julga legibilidade; a folha é pequena demais. |

A folha mostra o estado final. Cena com dois momentos (uma legenda que dá lugar a outra, um
painel que troca) pede que você veja o meio também. Para instantes específicos:

```bash
bash "$SKILL_DIR/scripts/build.sh" "$PROJ" preview P 12.5 30.2      # → preview/P/t_12.50.png, t_30.20.png
```

Os tempos de cada cena e de cada deixa estão na saída do `timeline.py`.

O que procurar:

| Sintoma | Causa mais comum |
|---|---|
| Texto saindo do quadro ou cortado | fonte grande demais para a frase; reduza no layout ou quebre a legenda em duas |
| Texto em cima de outro elemento | duas legendas na mesma posição; a de baixo precisa sumir quando a de cima entra |
| Elemento que deveria ter entrado e não está na folha | deixa com nome errado (a animação nunca dispara) ou `data-r` fora do intervalo |
| No retrato, algo encostando ou passando da moldura amarela | fora da zona segura; recolha para x 96–984 |
| `FALHOU` no check | erro de script; a mensagem traz o segundo em que acontece |
| Tudo pequeno no retrato | o retrato não é o paisagem encolhido: empilhe os blocos e aumente a fonte |

Corrija e repita até a folha estar limpa nos formatos que vai entregar. Mostre a folha ao
usuário quando houver escolha de gosto envolvida.

### 7. Renderize

```bash
bash "$SKILL_DIR/scripts/build.sh" "$PROJ" full P video-retrato.mp4
bash "$SKILL_DIR/scripts/build.sh" "$PROJ" full L video-paisagem.mp4
```

Leva alguns minutos por formato (são 30 fotos por segundo de vídeo). Rode em segundo plano se o
ambiente permitir. Para refazer só um trecho depois de um ajuste:

```bash
DE=10 ATE=18 bash "$SKILL_DIR/scripts/build.sh" "$PROJ" full P trecho.mp4
```

O MP4 sai **dentro da pasta do projeto** e pesa perto de 1,5 a 2 MB por segundo (o grão de
filme não comprime bem; é normal). Se existir `audio/narracao.wav` no projeto (o `timeline.py`
cria quando há áudio), ele entra no MP4. Sem ele o vídeo sai mudo, e isso é dito na saída. O
script valida o arquivo no fim; não anuncie o vídeo como pronto antes de ver `==> pronto`.

### 8. Entregue

Diga ao usuário onde está o MP4, a duração, se tem narração ou está mudo, e o que ele ainda
precisa fazer fora daqui (colocar trilha no editor do Instagram, escolher a capa). Se o vídeo
usa voz gerada por IA, lembre que as redes pedem o rótulo de conteúdo feito com IA.

## Narração: três caminhos

1. **O usuário grava** um arquivo só, com a fala inteira. Aponte `"narracao"` para ele. É o
   caminho mais simples e o que soa mais humano.
2. **Voz gerada por IA**, uma frase por arquivo (qualquer ferramenta de texto-para-fala serve).
   Preencha `"audio"` em cada clipe. Frase por frase permite trocar de idioma no meio e refazer
   só o trecho que ficou ruim.
3. **Mudo.** A linha do tempo vem do ritmo (`"ppm"`). Serve para vídeo com trilha e para montar
   tudo antes de gravar.

Os caminhos 1 e 2 usam o Whisper para descobrir o instante de cada palavra, e pedem uma destas
bibliotecas (o `timeline.py` avisa se faltar):

```bash
pip install mlx-whisper       # Mac com chip Apple
pip install openai-whisper    # qualquer computador
```

Você não ouve áudio. Depois de sincronizar, confira pelos números: a saída do `timeline.py`
lista as palavras cujo tempo foi **estimado** (o Whisper ouviu diferente do que está escrito).
Poucas estimadas é normal em nomes próprios e números; muitas na mesma frase quer dizer que o
áudio não bate com o roteiro, e é o texto do roteiro que deve seguir o que foi falado.

## Requisitos

Node 18 ou mais novo, Python 3 e ffmpeg. O `build.sh` confere os três e instala o resto: o
Playwright dentro da pasta de cada projeto (rápido) e um Chromium de ~150 MB no cache do
usuário, uma vez só por computador.
Feito e testado em macOS; em Linux funciona igual; no Windows, rode pelo WSL ou Git Bash.

Se faltar algum, diga ao usuário exatamente o que instalar e pare; não tente contornar.

## Limites honestos

- Isto é motion gráfico: texto, formas, cartões, ícones, mapas, números. Não cria gente,
  cenário filmado nem animação de personagem.
- Foto e logo entram como arquivo (`<img>` apontando para `assets/`), e o usuário precisa ter o
  direito de usar.
- A voz não é gerada aqui. A skill sincroniza o áudio que o usuário trouxer.
- Um vídeo novo com cenas próprias é trabalho de verdade: roteiro, cenas, dois layouts, render.
  Avise isso no começo em vez de prometer "um minuto".
