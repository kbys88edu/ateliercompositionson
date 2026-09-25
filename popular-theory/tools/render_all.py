import sys, json, base64, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from engrave import build_mei, render, to_mp3
from figs import FIGS
from check import check_fig
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)
probs = []
res = {}
for fid, sp in FIGS.items():
    probs += check_fig(fid, sp)
    mei = build_mei(sp["measures"], meter=sp.get("meter", (4, 4)), lh=sp.get("lh", True),
                    tempo=sp.get("tempo", 92), showmeter=sp.get("showmeter", True))
    svg, midi = render(mei, width=sp.get("width", 2200), breaks="encoded" if any(m.get("sb") for m in sp["measures"]) else "auto", spacing=sp.get("spacing", (0.3, 0.55)))
    mp3 = to_mp3(midi)
    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    res[fid] = dict(svg=svg, mp3=base64.b64encode(mp3).decode(), w=float(vb.group(1)), h=float(vb.group(2)))
    print(fid, int(res[fid]['w']), int(res[fid]['h']), len(mp3)//1024, 'KB')
json.dump(res, open(os.path.join(OUT, 'figs.json'), 'w'))
print("PROBLEMS:", probs or "none")
