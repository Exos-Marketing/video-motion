# Roteiro

Sumário: 1. Ritmo e tamanho · 2. A estrutura que funciona · 3. Marcações no texto ·
4. O `roteiro.json` · 5. Ligar a narração · 6. Erros comuns

## 1. Ritmo e tamanho

O motor mostra o texto **palavra por palavra, na hora em que é falada**. Por isso o roteiro é
escrito para ser dito, não lido: frases curtas, uma ideia por cena.

- Ritmo de referência: **185 a 195 palavras por minuto**. É uma fala animada, um pouco acima da
  conversa normal. O vídeo de exemplo tem 228 palavras em 77 segundos.
- 30 s ≈ 95 palavras · 45 s ≈ 140 · 60 s ≈ 185 · 80 s ≈ 250.
- Uma cena dura de **1,5 a 6 segundos**. Mais que isso só quando a cena tem dois momentos
  visuais (o exemplo faz isso na cena 17). Cena de menos de 1,2 s não dá tempo de ler.
- De 12 a 20 cenas por minuto de vídeo. O corte frequente é o que dá a sensação de "produzido".

**Vídeo curto (15 a 30 s).** De 5 a 8 cenas, 40 a 90 palavras. Da estrutura abaixo ficam o
gancho (1), o "como é" (5 ou 6), a ponte com a prova (11) e a chamada (12). A primeira palavra
gigante precisa bater no primeiro segundo e meio: no máximo quatro palavras antes dela.

**Vídeo mudo.** O texto será lido, não ouvido, e ler é mais lento que escutar. Use `"ppm"` entre
150 e 170 e segure a palavra forte na tela com `"pausa_depois"` de 0,3 a 0,9 s no clipe dela.

## 2. A estrutura que funciona

O exemplo segue uma estrutura de 12 movimentos. Ela serve para qualquer vídeo que apresenta uma
ferramenta, um método ou uma oferta. Use como esqueleto e corte o que não se aplica.

| # | Movimento | No exemplo | Para que serve |
|---|---|---|---|
| 1 | **Gancho com promessa visível** | "E se eu te dissesse que dá pra criar um vídeo desse nível" | O próprio vídeo é a prova. Termina na palavra mais forte. |
| 2 | **Corte das objeções óbvias** | "sem câmera, sem editor e sem designer?" | Três "sem", um por batida. Tira o esforço do caminho. |
| 3 | **Antecipa a desconfiança** | "E não, não é template." | Responde o que a pessoa ia pensar. |
| 4 | **Revela o nome** | "Isso aqui é o Claude Opus 5.5." | Dá nome à coisa. Momento de maior impacto visual. |
| 5 | **Como é usar** | "Você não abre programa nenhum. Só descreve como quer que fique." | Mostra o gesto, não a tecnologia. |
| 6 | **Exemplo concreto** | "Tipo: cria um vídeo de um minuto, com texto animado, sobre…" | Uma frase que a pessoa conseguiria dizer. |
| 7 | **Prova de variedade** | "Ranking em 3D, mapa, comparação. Esses aqui saíram assim." | Três exemplos lado a lado. |
| 8 | **O detalhe que quase ninguém percebe** | "Só que tem um detalhe…" | Reabre a curiosidade no meio do vídeo. |
| 9 | **O mecanismo** | "O Claude não gera o vídeo direto. Ele escreve o vídeo como código…" | Explica por que funciona. É o que faz a pessoa acreditar. |
| 10 | **Antes × depois** | "Em vez de roteiro, gravação, edição… é pedido, código, render, vídeo." | Lista longa riscada, lista curta acesa. |
| 11 | **Ponte para o que importa ao público** | "E é por isso que a barreira do idioma nunca foi tão baixa…" + prova | Liga a ferramenta ao desejo de quem assiste. Aqui entra a prova real do usuário. |
| 12 | **Honestidade + chamada** | "Substitui gravar com o expert? Não. Mas… é bem absurdo." → "Comenta EU QUERO" | Admitir o limite aumenta a confiança na afirmação seguinte. Uma ação só no fim. |

Regras de escrita que valem para qualquer roteiro:

- **Comece pela frase que faz parar.** Nada de "Olá", nada de apresentação.
- **Termine a cena na palavra que carrega o peso.** É ela que vira palavra gigante na tela.
- **Concreto vence abstrato.** "Um vídeo de um minuto" é melhor que "vídeos incríveis".
- **Um número só, e verdadeiro.** O número precisa ter fonte ou ser do próprio usuário.
- **Uma chamada só no fim**, com a palavra exata que a pessoa deve escrever ou o gesto exato.
- Escreva números como serão ditos quando isso mudar a leitura (ver seção 6).

## 3. Marcações no texto

Cada palavra do texto pode levar duas marcações. Elas não aparecem na tela.

| Marcação | Efeito |
|---|---|
| `*palavra` | A palavra aparece na cor de destaque. Use em **uma ou duas** por frase. |
| `palavra#deixa` | Cria uma deixa chamada `deixa` no instante em que a palavra é dita. A cena usa para disparar um movimento (`T('deixa')`). |
| `*palavra#deixa` | As duas coisas. |

Exemplo:

```
"Em vez de roteiro,#a1 gravação,#a2 edição,#a3 legenda#a4 e exportação,#a5"
```

Cinco deixas: cada cartão entra exatamente quando a palavra dele é dita. Esse é o segredo da
sensação de sincronia. Regras:

- Nome de deixa só com letras, números e `_`, sem acento. Único dentro da cena.
- A pontuação fica **antes** do `#`: `nível.#big3`, não `nível#big3.`
- Ponha deixa em toda palavra que precisa de um acontecimento na tela. Na dúvida, ponha: deixa
  sem uso não atrapalha.
- Uma "palavra" é o que fica entre espaços. `*5.5.` é uma palavra; `EU QUERO` são duas.

## 4. O `roteiro.json`

```json
{
  "fps": 30,
  "ppm": 190,
  "inicio": 0.3,
  "cauda": 1.6,
  "pausa": 0.13,
  "tempo": 1.0,
  "clipes": [
    {"idioma": "pt"},
    {"idioma": "pt", "pausa_depois": 0.22}
  ],
  "cenas": [
    {"id": 1, "partes": [{"clipe": 0, "texto": "E se eu te dissesse que dá pra criar um *vídeo#big1 desse#big2 nível#big3"}]},
    {"id": 2, "partes": [{"clipe": 0, "texto": "sem câmera,#cam sem editor#edit e sem designer?#des"}]},
    {"id": 3, "partes": [{"clipe": 1, "texto": "E não, não é *template.#tpl"}]}
  ]
}
```

| Campo | O que faz | Padrão |
|---|---|---|
| `fps` | Quadros por segundo do vídeo. | 30 |
| `ppm` | Palavras por minuto, usado só no modo mudo. | 185 |
| `inicio` | Silêncio antes da primeira palavra. | 0.3 |
| `cauda` | Tempo depois da última palavra (o vídeo apaga para o preto aí). | 1.6 |
| `pausa` | Respiro entre um clipe e o seguinte. | 0.13 |
| `tempo` | Acelera os clipes de áudio (1.1 = 10% mais rápido). Voz de IA costuma pedir 1.05 a 1.12. | 1.0 |
| `clipes` | Um item por **frase falada de uma vez**. `idioma` orienta a transcrição; `pausa_depois` troca a pausa só depois daquele clipe. | |
| `cenas` | Na ordem do vídeo. `id` é o número que o `def(id, …)` da cena usa. | |
| `partes` | Trechos de texto da cena. Cada um diz de qual `clipe` vem. | |

**Clipe e cena são coisas diferentes.** Clipe é uma unidade de fala (uma frase, um fôlego). Cena
é uma unidade de imagem. Uma frase longa pode atravessar duas cenas (no exemplo, o clipe 0 cobre
as cenas 1 e 2), e uma cena pode juntar vários clipes (a cena 15 tem três: português, inglês e
espanhol). O `timeline.py` exige só que as palavras de cada clipe apareçam nas cenas na ordem em
que são ditas.

Os índices usados nas legendas (`data-r="0-4"`) contam as palavras **da cena**, a partir de 0,
somando todas as partes. Ao mudar o texto de uma cena, confira os intervalos dela.

## 5. Ligar a narração

**Um arquivo só** (o usuário gravou a fala inteira):

```json
{ "narracao": "audio/narracao.mp3", "idioma": "pt", "cenas": [ … ] }
```

Todas as partes usam `"clipe": 0`. As pausas da gravação viram o ritmo do vídeo; `inicio`,
`pausa` e `tempo` não se aplicam.

**Um arquivo por frase** (voz gerada, ou gravação em trechos):

```json
"clipes": [
  {"audio": "audio/c00.mp3", "idioma": "pt"},
  {"audio": "audio/c01.mp3", "idioma": "en", "pausa_depois": 0.2}
]
```

Ou todos os clipes têm `audio`, ou nenhum. O script apara o silêncio das pontas, aplica o
`tempo`, emenda tudo em `audio/narracao.wav` e mede o instante de cada palavra.

Ao pedir a voz ao usuário, entregue a ele **a lista das frases, uma por clipe, sem as
marcações** (`*` e `#`), na ordem. É o que ele vai colar na ferramenta de voz ou ler em voz alta.

Rode o `timeline.py` com um Python que tenha o Whisper instalado. Se o `python3` do sistema não
tiver, use o do ambiente onde instalou (por exemplo `~/venv/bin/python3 timeline.py …`).

## 6. Erros comuns

- **Número escrito de um jeito e falado de outro.** `141` na tela e "cento e quarenta e um" no
  áudio não casam palavra a palavra; o script estima o tempo e avisa. Funciona, mas confira a
  cena. Se o número for o centro da cena, ponha a deixa na palavra **anterior** também.
- **Texto na tela diferente do que foi falado.** A tela mostra o que está no roteiro. Se o
  locutor improvisou, corrija o roteiro para o que foi dito.
- **Cena sem texto.** Toda cena precisa de pelo menos uma palavra, porque é a palavra que dá o
  tempo dela. Para um respiro só de imagem, ou para a palavra forte ficar mais tempo na tela,
  aumente `pausa_depois` do clipe.
- **Destaque demais.** Se metade das palavras está colorida, nenhuma está.
- **Frase longa numa cena só.** Passou de 12 palavras, quebre em duas cenas ou em duas legendas
  dentro da mesma cena.
