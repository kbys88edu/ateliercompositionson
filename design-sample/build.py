"""Build the design sample from ja/index.html (published markup) + assets/css/acs-refine.css.

  python3 design-sample/build.py

Writes:
  design-sample/ja-home.html             linked to the repo's assets (needs the repo folder)
  design-sample/ja-home-standalone.html  CSS/JS/fonts/images inlined; opens anywhere
Requires Pillow (images are re-encoded as JPEG for the standalone file).
"""
import re, base64, io, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(HERE) + os.sep
LIVE = "https://ateliercompositionson.com/"

def read(p): return open(R + p, encoding="utf-8").read()

def build(variant=None):
    global src
    suffix = f"-art-{variant}" if variant else ""
    label = {"a": "案A「楽譜」", "b": "案B「工房ノート」", "c": "案C「展覧会」"}.get(variant, "")
    src = read("ja/index.html")
    src = src.replace("<title>", f"<title>[デザインサンプル{label}] ", 1)
    src = re.sub(r'  <link rel="canonical"[^\n]*\n', '  <meta name="robots" content="noindex, nofollow">\n', src, 1)
    src = re.sub(r'  ?<link rel="alternate"[^\n]*\n', "", src)
    src = re.sub(r'  <script async src="https://www.googletagmanager.com[^\n]*\n  <script>.*?</script>\n', "", src, flags=re.S)
    m = re.search(r'<link rel="stylesheet" href="../assets/css/acs-editorial.css[^"]*">', src)
    assert m, "editorial stylesheet link not found"
    extra = f'\n<link rel="stylesheet" href="../assets/css/acs-art-{variant}.css">' if variant else ""
    src = src.replace(m.group(0), m.group(0) + '\n<link rel="stylesheet" href="../assets/css/acs-refine.css">' + extra)

    # --- linked version: keep assets relative, point page links back at ja/ ---
    def to_ja(m):
        u = m.group(2)
        if re.match(r"(#|https?:|mailto:|tel:|\.\./|/)", u): return m.group(0)
        return f'{m.group(1)}"../ja/{u}"'
    linked = re.sub(r'(href=)"([^"]*)"', to_ja, src)
    open(HERE + f"/ja-home{suffix}.html", "w", encoding="utf-8").write(linked)

    # --- standalone version ---
    def jpg(path, maxw, q):
        im = Image.open(R + path)
        if im.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", im.size, "white"); im = im.convert("RGBA"); bg.paste(im, mask=im.split()[3]); im = bg
        else: im = im.convert("RGB")
        if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
        b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
        return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
    def raw(path, mime): return f"data:{mime};base64," + base64.b64encode(open(R + path, "rb").read()).decode()

    # the images actually referenced by the page
    imgs = {}
    for rel in sorted(set(re.findall(r'src="\.\./(images/[^"]+)"', src))):
        if rel.endswith(".png") and os.path.getsize(R + rel) > 150_000: imgs[rel] = jpg(rel, 1200, 82)
        elif rel.endswith((".png",)): imgs[rel] = raw(rel, "image/png")
        elif rel.endswith((".jpg", ".jpeg")): imgs[rel] = jpg(rel, 1200, 78)
        elif rel.endswith(".webp"): imgs[rel] = raw(rel, "image/webp")
        elif rel.endswith(".avif"): imgs[rel] = raw(rel, "image/avif")
    logo = raw("images/acs-logo.png", "image/png") if os.path.getsize(R + "images/acs-logo.png") < 200_000 else jpg("images/acs-logo.png", 160, 85)

    css = ""
    for p in re.findall(r'href="\.\./(assets/css/[^"?]+)', src):
        c = read(p)
        c = re.sub(r"url\((['\"]?)\.\./fonts/([^)'\"]+)\1\)", lambda m: f"url({raw('assets/fonts/' + m.group(2), 'font/otf')})", c)
        c = re.sub(r"url\(\.\./\.\./images/([^)]+)\)", lambda m: f"url({jpg('images/' + m.group(1), 1200, 70)})", c)
        css += f"/* {p} */\n{c}\n"
    imports = re.findall(r"@import url\([^)]*\);", css)
    css = "".join(i + "\n" for i in dict.fromkeys(imports)) + re.sub(r"@import url\([^)]*\);", "", css)
    s = re.sub(r'\s*<link rel="stylesheet" href="\.\./assets/css/[^"]+">', "", src)
    s = s.replace("</head>", "<style>\n" + css + "</style>\n</head>")
    s = re.sub(r'\s*<link rel="preload"[^\n]*>', "", s)
    s = re.sub(r'<link rel="icon"[^>]*>', f'<link rel="icon" href="{logo}">', s)

    def inline_js(m):
        name = os.path.basename(m.group(1)).split("?")[0]; js = read("assets/js/" + name)
        if name == "acs-header.js":
            js = js.replace('"index.html#', '"#')
            js = re.sub(r'"\.\./images/([^"]+)"', lambda mm: '"' + (imgs.get("images/" + mm.group(1)) or logo) + '"', js)
            js = js.replace('"../fr/"', f'"{LIVE}fr/"')
        return "<script>\n" + js + "\n</script>"
    s = re.sub(r'<script defer src="(\.\./assets/js/[^"]+)"></script>', inline_js, s)
    for rel, uri in imgs.items(): s = s.replace(f'"../{rel}"', f'"{uri}"')
    s = re.sub(r'srcset="[^"]*"', "", s)
    s = re.sub(r'href="\.\./ja/([^"]*)"', lambda m: f'href="{LIVE}ja/{m.group(1)}"', s)
    s = re.sub(r'href="(?!https?:|#|mailto:|tel:|data:)([^"]*)"', lambda m: f'href="{LIVE}ja/{m.group(1)}"' if not m.group(1).startswith("../") else f'href="{LIVE}{m.group(1)[3:]}"', s)
    s = s.replace("<body class=\"acs-editorial\">", f"<body class=\"acs-editorial\">\n<div style=\"background:#111;color:#fff;font:12px/1.6 sans-serif;padding:8px 16px;letter-spacing:.08em;position:relative;z-index:50\">デザインサンプル{label}（単体版）— リンクは公開中のサイトに接続しています</div>", 1)
    left = re.findall(r'(?:src|href)="(\.\.?/[^"]*)"', s)
    assert not left, left[:5]
    open(HERE + f"/ja-home{suffix}-standalone.html", "w", encoding="utf-8").write(s)
    print("ok", len(s) // 1024, "KB")


if __name__ == "__main__":
    build()
    for v in ("a", "b", "c"):
        build(v)
