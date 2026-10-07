#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera timeline.json (o instante de cada palavra na tela) a partir de roteiro.json.

    python3 timeline.py <pasta-do-projeto>

O timeline.json comanda a animacao inteira: cada palavra aparece quando e falada e cada
"deixa" (#nome no roteiro) dispara um movimento da cena. Tres modos, escolhidos pelo roteiro:

  1. NARRACAO UNICA   "narracao": "audio/narracao.mp3"
     Um arquivo com a fala inteira. O Whisper transcreve com o tempo de cada palavra.
  2. CLIPES           "clipes": [{"audio": "audio/c00.mp3", "idioma": "pt"}, ...]
     Uma frase por arquivo (bom para trocar de idioma no meio ou regravar so um trecho).
     Os clipes sao aparados, acelerados por "tempo" e emendados em audio/narracao.wav.
  3. MUDO             sem "narracao" e sem "audio" nos clipes
     O tempo de cada palavra e estimado pelo ritmo ("ppm", palavras por minuto).
     Serve para video sem voz ou para montar tudo antes de gravar.

Modos 1 e 2 precisam do ffmpeg e de UMA destas bibliotecas no Python que rodar este script:
    pip install mlx-whisper        (Mac com chip Apple; mais rapido)
    pip install openai-whisper     (qualquer computador)
O modo mudo usa so a biblioteca padrao.

Formato do roteiro (detalhes em references/roteiro.md):
    {"fps": 30, "ppm": 185, "inicio": 0.3, "cauda": 1.6, "pausa": 0.13, "tempo": 1.0,
     "clipes": [{"idioma": "pt", "pausa_depois": 0.2}, ...],
     "cenas": [{"id": 1, "partes": [{"clipe": 0, "texto": "Uma frase com *destaque e deixa#nome"}]}]}
Em cada palavra do texto: *palavra = cor de destaque; palavra#nome = deixa para a cena.
"""
import difflib, json, os, re, subprocess, sys, unicodedata

SR = 48000
MODELO_MLX = "mlx-community/whisper-large-v3-turbo"
MODELO_OPENAI = "small"


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)


def limpa(tok):
    """'*palavra#deixa' -> ('palavra', destaque?, 'deixa' ou None)"""
    m = re.search(r"#(\w+)$", tok)
    w = re.sub(r"#\w+$", "", tok)
    return w.lstrip("*"), w.startswith("*"), (m.group(1) if m else None)


def run(*cmd):
    subprocess.run(list(cmd), check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


_transcreve = None


def transcrever(path, idioma):
    """Lista de (palavra, inicio, fim) em segundos. mlx-whisper e openai-whisper devolvem o mesmo formato."""
    global _transcreve
    if _transcreve is None:
        try:
            import mlx_whisper
            _transcreve = lambda p, lang: mlx_whisper.transcribe(
                p, path_or_hf_repo=MODELO_MLX, language=lang, word_timestamps=True, condition_on_previous_text=False)
        except ImportError:
            try:
                import whisper
                modelo = whisper.load_model(MODELO_OPENAI)
                _transcreve = lambda p, lang: modelo.transcribe(
                    p, language=lang, word_timestamps=True, condition_on_previous_text=False)
            except ImportError:
                sys.exit("Para sincronizar com audio instale uma destas bibliotecas:\n"
                         "  pip install mlx-whisper       (Mac com chip Apple)\n"
                         "  pip install openai-whisper    (qualquer computador)\n"
                         "Ou rode sem audio: tire \"narracao\" e \"audio\" do roteiro.json (modo mudo).")
    r = _transcreve(path, idioma)
    return [(w["word"].strip(), float(w["start"]), float(w["end"])) for s in r["segments"] for w in s.get("words", [])]


def falas_mudas(tokens, ppm):
    """Sem audio: estima (palavra, inicio, fim) pelo ritmo. Palavra longa dura mais; pontuacao faz pausa."""
    if not tokens:
        return []
    base = 60.0 / ppm
    medio = sum(len(norm(t)) or 1 for t in tokens) / len(tokens)
    t, out = 0.0, []
    for tok in tokens:
        d = base * (0.45 + 0.55 * (len(norm(tok)) or 1) / medio)
        out.append((tok, t, t + d * 0.92))
        t += d
        if tok[-1:] in ",;":
            t += 0.10
        elif tok[-1:] in ".?!:":
            t += 0.22
    return out


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    proj = os.path.abspath(sys.argv[1])
    os.chdir(proj)
    R = json.load(open("roteiro.json", encoding="utf-8"))
    fps = R.get("fps", 30)
    ppm = R.get("ppm", 185)
    INICIO, CAUDA = R.get("inicio", 0.3), R.get("cauda", 1.6)
    PAUSA, TEMPO = R.get("pausa", 0.13), R.get("tempo", 1.0)

    cenas = R["cenas"]
    unica = R.get("narracao")
    clipes = [{"audio": unica, "idioma": R.get("idioma", "pt")}] if unica else R.get("clipes", [])
    n_clipes = max([p.get("clipe", 0) for c in cenas for p in c["partes"]] + [len(clipes) - 1]) + 1
    while len(clipes) < n_clipes:
        clipes.append({})

    # palavras da tela, por clipe e na ordem em que sao ditas
    tela = {i: [] for i in range(n_clipes)}
    for c in cenas:
        for p in c["partes"]:
            for tok in p["texto"].split():
                tela[p.get("clipe", 0)].append(tok)

    com_audio = [bool(c.get("audio")) for c in clipes]
    if any(com_audio) and not all(com_audio):
        sys.exit("roteiro.json: ou todos os clipes tem \"audio\", ou nenhum tem (modo mudo).")
    modo = "narracao unica" if unica else ("clipes" if all(com_audio) and clipes else "mudo")

    falas, duracao_clip = {}, {}
    if modo == "mudo":
        for i in range(n_clipes):
            falas[i] = falas_mudas([limpa(t)[0] for t in tela[i]], ppm)
        # as pausas de pontuacao esticam a estimativa: reescala para o ritmo pedido valer de ponta a ponta
        bruto = sum(f[-1][2] for f in falas.values() if f)
        alvo = sum(len(f) for f in falas.values()) * 60.0 / ppm
        k = alvo / bruto if bruto else 1.0
        for i in range(n_clipes):
            falas[i] = [(w, a * k, b * k) for w, a, b in falas[i]]
            duracao_clip[i] = (falas[i][-1][2] + 0.10) if falas[i] else 0.0
    else:
        os.makedirs("audio/proc", exist_ok=True)
        for i, c in enumerate(clipes):
            if not os.path.exists(c["audio"]):
                sys.exit(f"audio nao encontrado: {c['audio']}")
            dst = f"audio/proc/p{i:02d}.wav"
            if unica:      # narracao unica entra como esta: as pausas dela sao o ritmo do video
                run("ffmpeg", "-y", "-i", c["audio"], "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", dst)
            else:          # clipe: tira o silencio das pontas, encurta pausas longas e aplica o "tempo"
                af = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,"
                      "silenceremove=stop_periods=-1:stop_duration=0.30:stop_threshold=-50dB:stop_silence=0.20,"
                      f"atempo={TEMPO}")
                run("ffmpeg", "-y", "-i", c["audio"], "-af", af, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", dst)
            falas[i] = transcrever(dst, c.get("idioma", "pt"))
            if not falas[i]:
                sys.exit(f"o Whisper nao encontrou fala em {c['audio']}")
            if unica:
                duracao_clip[i] = dur(dst)
            else:          # corta a sobra depois da ultima palavra
                fim = min(dur(dst), falas[i][-1][2] + 0.12)
                run("ffmpeg", "-y", "-i", dst, "-t", f"{fim:.3f}", "-c:a", "pcm_s16le", f"audio/proc/c{i:02d}.wav")
                duracao_clip[i] = dur(f"audio/proc/c{i:02d}.wav")

    # onde cada clipe comeca na trilha final
    off, t = {}, (0.0 if unica else INICIO)
    for i in range(n_clipes):
        off[i] = t
        t += duracao_clip[i] + (0.0 if unica else clipes[i].get("pausa_depois", PAUSA))
    DUR = t + (0.0 if unica else CAUDA)
    if unica:
        DUR = max(DUR, falas[0][-1][2] + min(CAUDA, 0.6))

    # trilha unica de narracao (modo clipes): clipes e silencios emendados pelo ffmpeg
    if modo == "clipes":
        def silencio(path, d):
            run("ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", f"{max(d, 0.001):.3f}", "-c:a", "pcm_s16le", path)
        lista = ["audio/proc/s_ini.wav"]
        silencio(lista[0], INICIO)
        for i in range(n_clipes):
            lista.append(f"audio/proc/c{i:02d}.wav")
            s = f"audio/proc/s{i:02d}.wav"
            silencio(s, clipes[i].get("pausa_depois", PAUSA) + (CAUDA if i == n_clipes - 1 else 0))
            lista.append(s)
        with open("audio/proc/lista.txt", "w") as f:
            f.write("".join(f"file '{os.path.abspath(p)}'\n" for p in lista))
        run("ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "audio/proc/lista.txt", "-c:a", "pcm_s16le", "audio/narracao.wav")
        DUR = dur("audio/narracao.wav")
    elif modo == "narracao unica":
        run("ffmpeg", "-y", "-i", "audio/proc/p00.wav", "-c:a", "pcm_s16le", "audio/narracao.wav")

    # casa as palavras DA TELA com as palavras FALADAS, clipe a clipe
    tempos, avisos = {}, []
    for i in range(n_clipes):
        A = [norm(limpa(t)[0]) for t in tela[i]]
        B = [norm(w) for w, _, _ in falas[i]]
        m = [None] * len(A)
        for blk in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
            for k in range(blk.size):
                m[blk.a + k] = blk.b + k
        for j in range(len(A)):
            if m[j] is not None:
                tempos[(i, j)] = falas[i][m[j]][1:]
        for j in range(len(A)):                 # sem par (o Whisper ouviu diferente): encaixa entre as vizinhas
            if (i, j) in tempos:
                continue
            p = next((q for q in range(j - 1, -1, -1) if m[q] is not None), None)
            n = next((q for q in range(j + 1, len(A)) if m[q] is not None), None)
            a = tempos[(i, p)][1] if p is not None else 0.0
            b = tempos[(i, n)][0] if n is not None else (falas[i][-1][2] if falas[i] else a + 0.3)
            q0, q1 = (p if p is not None else -1), (n if n is not None else len(A))
            s = a + (b - a) * (j - q0 - 1) / max(1, q1 - q0 - 1)
            tempos[(i, j)] = (s, min(b, s + 0.18) if b > s else s + 0.18)
        sem = [limpa(tela[i][j])[0] for j in range(len(A)) if m[j] is None]
        if sem:
            avisos.append(f"clipe {i}: tempo estimado para {sem}")

    out, cont = [], {i: 0 for i in range(n_clipes)}
    for c in cenas:
        toks = []
        for p in c["partes"]:
            ci = p.get("clipe", 0)
            for tok in p["texto"].split():
                j = cont[ci]; cont[ci] += 1
                w, hl, k = limpa(tok)
                s, e = tempos[(ci, j)]
                toks.append({"w": w, "hl": hl, "k": k, "t": round(off[ci] + s, 3), "e": round(off[ci] + e, 3)})
        if not toks:
            sys.exit(f"cena {c['id']} sem texto: toda cena precisa de pelo menos uma palavra para ter tempo")
        out.append({"id": c["id"], "tokens": toks})
    for i, c in enumerate(out):
        c["t0"] = 0.0 if i == 0 else round(max(out[i - 1]["tokens"][-1]["e"] + 0.02, c["tokens"][0]["t"] - 0.10), 3)
    for i, c in enumerate(out):
        c["t1"] = out[i + 1]["t0"] if i + 1 < len(out) else round(DUR, 3)
    json.dump({"duration": round(DUR, 3), "fps": fps, "scenes": out}, open("timeline.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    nw = sum(len(v) for v in tela.values())
    print(f"modo: {modo} · {len(out)} cenas · {nw} palavras · {DUR:.2f}s" + (f" · {ppm} palavras/min" if modo == "mudo" else ""))
    for c in out:
        deixas = " ".join(f"{t['k']}={t['t'] - c['t0']:.2f}" for t in c["tokens"] if t["k"])
        print(f"  cena {c['id']:>2}  {c['t0']:6.2f} -> {c['t1']:6.2f}  ({c['t1'] - c['t0']:.2f}s)  {deixas}")
    for a in avisos:
        print("  aviso:", a)
    curtas = [c["id"] for c in out if c["t1"] - c["t0"] < 1.2]
    if curtas:
        print(f"  aviso: cenas com menos de 1,2s ({curtas}): junte com a vizinha ou de mais texto a elas")


if __name__ == "__main__":
    main()
