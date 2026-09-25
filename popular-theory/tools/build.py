import json, re, html, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from figs import FIGS
figs = json.load(open(os.path.join(HERE, 'out', 'figs.json')))
ref = open(os.path.join(HERE, 'head.html')).read()
css = ref[ref.find('<style>'):ref.find('</style>') + 8]
fonts = ref[:ref.find('<style>')]
body = open(os.path.join(HERE, 'body.html')).read()

n = [0]
def figure(mo):
    fid = mo.group(1)
    f, sp = figs[fid], FIGS[fid]
    n[0] += 1
    fw = min(52, round(f["w"] * 1.5 / 16, 1))
    svg = re.sub(r'<svg ', '<svg role="img" aria-label="譜例 %d" ' % n[0], f["svg"].strip(), count=1)
    svg = re.sub(r'<\?xml[^>]*\?>', '', svg)
    svg = svg.replace('font-family="Times, serif"', 'font-family="Noto Sans,Hiragino Sans,Hiragino Kaku Gothic ProN,Yu Gothic Medium,Yu Gothic,Meiryo,Noto Sans JP,sans-serif"')
    return (f'<figure class="score" id="fig-{fid}" style="--fw:{fw}rem"><div class="stave">{svg}</div>'
            f'<figcaption><span class="fignum">譜例 {n[0]}</span>{sp["caption"]}</figcaption>'
            f'<div class="player"><audio controls preload="none"><source src="data:audio/mpeg;base64,{f["mp3"]}" type="audio/mpeg"></audio></div></figure>')
body = re.sub(r'\{\{fig:(\w+)\}\}', figure, body)
body = body.replace('{{checked}}', str(len(FIGS)))
used = set(re.findall(r'id="fig-(\w+)"', body))
missing = set(FIGS) - used
print("figures used:", n[0], "unused:", missing or "none")

# TOC from h2
toc = ''.join(f'<b><a href="#{i}"><span class="n">{html.unescape(re.sub("<.*?>","",c))}</span>{html.unescape(re.sub("<.*?>","",t))}</a></b>'
              for i, c, t in re.findall(r'<h2 id="(\w+)"><span class="ch">(.*?)</span>(.*?)</h2>', body))

extra_css = """
.cmp figure.score{margin:0}
.cmp{align-items:start}
"""
page = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ポップスの音楽理論入門</title>
<meta name="description" content="コード、スケール、コード進行、テンション、転調、アドリブ用スケールまで。ポピュラー音楽理論の基本を譜例と音源つきで初心者向けにまとめました。">
{fonts.strip()}
{css.replace('</style>', extra_css + '</style>')}
</head>
<body>
<div class="wrap"><div class="cols"><nav class="toc">{toc}</nav><main class="hasfigs">
{body}
</main></div></div>
</body>
</html>
'''
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'index.html')
open(out, 'w').write(page)
print(out, len(page) // 1024, 'KB')
