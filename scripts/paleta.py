#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Troca a cor principal do video (o verde #30DC68) pela cor da marca.

    python3 paleta.py <pasta-do-projeto> "#FF6A00"

Reescreve scene.html e js/*.js DO PROJETO (uma copia do motor), nunca o motor original da skill.
Trocas feitas: a cor principal em hex e em rgb, os tons escuros do relevo das palavras gigantes e os
tons claros usados em brilhos e textos de interface e o fundo quase-preto dos paineis. Fundo preto,
branco do texto e o vermelho do laser nao mudam. Rode uma vez, num projeto recem-copiado: a troca parte dos valores originais.
"""
import glob, os, re, sys

BASE = (48, 220, 104)                                    # #30DC68
ESCUROS = {"#1fae4e": .72, "#18923f": .60, "#117331": .47, "#0b5524": .35}   # relevo: fracao da cor principal
CLAROS_HEX = ["#9dffc0", "#d9ffe6", "#eafff1", "#dfffe9", "#bff5d0", "#8dffb4", "#cfe9d8", "#e8fff0"]
CLAROS_RGB = [(120, 255, 170), (200, 255, 220), (160, 255, 195)]
FUNDOS_RGB = [(8, 20, 13), (8, 18, 12), (6, 18, 11), (5, 14, 9)]       # quase-pretos puxados para a cor principal


def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def to_hex(c):
    return "#" + "".join(f"{max(0, min(255, round(v))):02X}" for v in c)


def claro(c, nova):
    """Um tom claro e (mais ou menos) branco misturado com o verde: mantem a mesma dose com a cor nova."""
    doses = [(255 - c[i]) / (255 - BASE[i]) for i in range(3) if BASE[i] < 250]
    a = max(0.0, min(1.0, sum(doses) / len(doses)))
    return tuple(255 * (1 - a) + nova[i] * a for i in range(3))


def fundo(c, nova):
    """Quase-preto com um fio da cor principal: mantem o mesmo escuro e troca so a direcao da tinta."""
    lo, hi, top = min(c), max(c), max(nova) or 1
    return tuple(lo + (hi - lo) * v / top for v in nova)


def main():
    if len(sys.argv) < 3 or not re.fullmatch(r"#?[0-9a-fA-F]{6}", sys.argv[2]):
        sys.exit(__doc__)
    proj, nova = os.path.abspath(sys.argv[1]), hx(sys.argv[2])
    arquivos = [os.path.join(proj, "scene.html")] + sorted(glob.glob(os.path.join(proj, "js", "*.js")))
    total = 0
    for p in arquivos:
        s = o = open(p, encoding="utf-8").read()
        s = re.sub(r"#30dc68", to_hex(nova), s, flags=re.I)
        s = re.sub(r"48\s*,\s*220\s*,\s*104", ",".join(str(v) for v in nova), s)
        for h, f in ESCUROS.items():
            s = re.sub(h, to_hex(tuple(v * f for v in nova)), s, flags=re.I)
        for h in CLAROS_HEX:
            s = re.sub(h, to_hex(claro(hx(h), nova)), s, flags=re.I)
        for c in CLAROS_RGB:
            s = re.sub(r"%d\s*,\s*%d\s*,\s*%d" % c, ",".join(str(round(v)) for v in claro(c, nova)), s)
        for c in FUNDOS_RGB:
            s = re.sub(r"\(%d\s*,\s*%d\s*,\s*%d\s*," % c, "(" + ",".join(str(round(v)) for v in fundo(c, nova)) + ",", s)
        if s != o:
            open(p, "w", encoding="utf-8").write(s)
            total += 1
    print(f"cor principal trocada para {to_hex(nova)} em {total} arquivo(s). Rode o preview para conferir o contraste.")


if __name__ == "__main__":
    main()
