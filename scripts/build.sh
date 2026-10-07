#!/usr/bin/env bash
# Confere, pre-visualiza e renderiza um projeto de video motion.
#
#   bash build.sh <projeto> check   [L|P]                  procura erro de script ao longo do video
#   bash build.sh <projeto> preview [L|P] [segundos...]    o fim de cada cena + folha de contato
#   bash build.sh <projeto> full    [L|P] [saida.mp4]      renderiza tudo e junta com a narracao
#
# L = paisagem 1920x1080 (padrao) · P = retrato 1080x1920 (Reels, Shorts, TikTok)
# Para renderizar so um trecho no full:  DE=10 ATE=18 bash build.sh <projeto> full L trecho.mp4
#
# O script cuida do resto: instala as dependencias na primeira vez, sobe um servidor local numa
# porta livre (a pagina carrega arquivos, entao file:// nao serve), roda e derruba o servidor.
#
# Por que sempre "check" e "preview" antes do "full": o full leva varios minutos, e quase todo
# erro (texto estourando, elemento fora de quadro, cena vazia) aparece na folha de contato.
set -euo pipefail

PROJ="${1:?uso: build.sh <projeto> <check|preview|full> [L|P] [saida.mp4 | segundos...]}"
MODE="${2:?uso: build.sh <projeto> <check|preview|full> [L|P] [saida.mp4 | segundos...]}"
ORI="$(echo "${3:-L}" | tr '[:lower:]' '[:upper:]')"
shift $(( $# < 3 ? $# : 3 ))

for bin in node npm python3 ffmpeg ffprobe curl; do
  command -v "$bin" >/dev/null 2>&1 || { echo "erro: '$bin' nao encontrado. Instale antes (Node 18+, Python 3 e ffmpeg)."; exit 1; }
done
case "$ORI" in L|P) ;; *) echo "erro: orientacao deve ser L (paisagem) ou P (retrato)"; exit 1;; esac

cd "$PROJ"
[ -f scene.html ] || { echo "erro: scene.html nao encontrado em $PROJ (copie assets/engine para a pasta do projeto)"; exit 1; }
[ -f timeline.json ] || { echo "erro: timeline.json nao encontrado. Rode antes: python3 scripts/timeline.py $PROJ"; exit 1; }

if [ ! -d node_modules/playwright ]; then
  echo "==> instalando dependencias (so na primeira vez; baixa um navegador de ~150 MB)"
  npm install --silent
  npx playwright install chromium
fi

PORT=$(python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1]);s.close()')
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
until curl -sf -o /dev/null "http://127.0.0.1:$PORT/scene.html"; do sleep 0.3; done

case "$MODE" in
  check)
    O="$ORI" PORT="$PORT" node render.mjs check
    ;;
  preview)
    O="$ORI" PORT="$PORT" node render.mjs check
    O="$ORI" PORT="$PORT" node render.mjs preview "$@"
    if [ $# -eq 0 ]; then
      N=$(ls "preview/$ORI"/c[0-9]*.png | wc -l | tr -d ' ')
      # no retrato a folha leva uma moldura amarela no limite da zona segura (230 topo, 470 base, 70 lados)
      if [ "$ORI" = "P" ]; then MAXC=6; FILTRO="drawbox=x=70:y=230:w=940:h=1220:color=yellow@0.9:t=5,scale=360:640"
      else MAXC=4; FILTRO="scale=480:270"; fi
      COLS=$(( N < MAXC ? N : MAXC ))
      ROWS=$(( (N + COLS - 1) / COLS ))
      ffmpeg -y -v error -framerate 1 -start_number 1 -i "preview/$ORI/c%02d.png" \
        -vf "$FILTRO,tile=${COLS}x${ROWS}" -frames:v 1 "preview/folha_$ORI.png"
      echo "==> folha de contato: $PROJ/preview/folha_$ORI.png  (o fim de cada cena, na ordem)"
      echo "    quadros em tamanho cheio: $PROJ/preview/$ORI/cNN.png"
    fi
    ;;
  full)
    OUT="${1:-video-$( [ "$ORI" = "P" ] && echo retrato || echo paisagem ).mp4}"
    FPS=$(python3 -c 'import json;print(json.load(open("timeline.json")).get("fps",30))')
    O="$ORI" PORT="$PORT" node render.mjs check
    O="$ORI" PORT="$PORT" node render.mjs full
    echo "==> codificando $OUT"
    if [ -f audio/narracao.wav ]; then
      ffmpeg -y -v error -framerate "$FPS" -i "frames_$ORI/f%05d.jpg" -ss "${DE:-0}" -i audio/narracao.wav \
        -c:v libx264 -preset slow -crf 21 -maxrate 14M -bufsize 28M -pix_fmt yuv420p \
        -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
    else
      ffmpeg -y -v error -framerate "$FPS" -i "frames_$ORI/f%05d.jpg" \
        -c:v libx264 -preset slow -crf 21 -maxrate 14M -bufsize 28M -pix_fmt yuv420p -movflags +faststart "$OUT"
      echo "    (sem audio/narracao.wav: o video saiu mudo)"
    fi
    # valida que o arquivo fechou de verdade antes de apagar os quadros
    ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT" >/dev/null
    rm -rf "./frames_$ORI"
    echo "==> pronto: $PROJ/$OUT"
    ffprobe -v error -show_entries stream=codec_type,width,height -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT"
    ;;
  *) echo "erro: modo deve ser check, preview ou full"; exit 1;;
esac
