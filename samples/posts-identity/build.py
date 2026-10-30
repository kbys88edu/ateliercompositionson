#!/usr/bin/env python3
"""投稿と同じアイデンティティのサイト見本を組み立てる。

  python3 samples/posts-identity/build.py

- ja/index.html, fr/index.html : src/ の雛形に共通のヘッダー・フッターを付ける
- そのほかの ja/*.html, fr/*.html : 公開中のページから本文を取り出し、左に見出し・右に本文のレイアウトに組み直す
  （スクリプト、旧スタイル、ヒーロー画像は外す。YouTube / Vimeo / SoundCloud の埋め込み、フォーム、表は残す）
- ja/simple-synth.html : アプリ部分は元のまま、周りだけ新しいスタイルにする
出力先はこのフォルダ。画像は ../../images、PDF は ../../assets、ページ同士は相対リンク。
"""
import os, re, html, sys
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC_REV = "b306ed5"          # 再設計前の公開ページ（この版から本文を取り出す）
MODE = "sample"              # "sample" = 見本フォルダへ / "prod" = 公開ページ（ja/, fr/）へ


def read_src(relpath):
    import subprocess
    return subprocess.run(["git", "-C", ROOT, "show", f"{SRC_REV}:{relpath}"], capture_output=True, check=True).stdout.decode("utf-8")


def list_src(lang):
    import subprocess
    out = subprocess.run(["git", "-C", ROOT, "ls-tree", "--name-only", f"{SRC_REV}", f"{lang}/"], capture_output=True, check=True).stdout.decode()
    return [os.path.basename(x) for x in out.split() if x.endswith(".html")]

NAV = {
    "ja": [("index.html", "トップ"), ("composition-lesson.html", "作曲"), ("dtm-lesson.html", "DTM"),
           ("music-theory-lesson_with_pdf-link.html", "音楽理論"), ("solfege.html", "ソルフェージュ"),
           ("electroacoustic-lesson.html", "電子音響"), ("sound-technology-ai-lesson.html", "AI音楽"),
           ("profile.html", "講師"), ("faq.html", "質問"), ("booking.html", "無料相談")],
    "fr": [("index.html", "Accueil"), ("composition-lesson.html", "Composition"), ("harmony-analysis-lesson.html", "Analyse et écriture"),
           ("electroacoustic-lesson.html", "Électroacoustique"), ("mao-lesson.html", "MAO"), ("booking.html", "Réserver")],
}
COLS3 = {
    "ja": '<div class="cols3"><p>Atelier<span>Composition Son</span></p><p>オンラインレッスン<span>作曲・理論・電子音楽</span></p><p>ateliercompositionson<span>.com/ja</span></p></div>',
    "fr": '<div class="cols3"><p>Atelier<span>Composition Son</span></p><p>Cours en ligne<span>Composition · MAO</span></p><p>ateliercompositionson<span>.com/fr</span></p></div>',
}
SMALL = {
    "ja": '<span>© Atelier Composition Son</span><span><a href="terms.html" data-track="click_terms_page">レッスン規約</a><a href="mail-correction.html">メール添削</a><a href="mailto:info@sachiekobayashi.com" data-track="email_contact_click">お問い合わせ</a><a href="../fr/index.html">Français</a></span>',
    "fr": '<span>© Atelier Composition Son</span><span><a href="../../../docs/atelier-composition-son-lesson-terms-policies-bilingual.pdf">Conditions</a><a href="https://ateliercompositionson.com/fr/confidentialite/">Confidentialité</a><a href="../ja/index.html">日本語</a></span>',
}
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' \
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,700&family=Noto+Sans+JP:wght@400;500;700&display=swap">'


def chrome(lang, title, current, body, extra_head="", depth=1):
    pre = "../" * depth
    nav = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == current else ""}>{t}</a>' for h, t in NAV[lang])
    other = ("fr", "FR", "JA") if lang == "ja" else ("ja", "JA", "FR")
    lang_sw = f'<span class="lang"><strong>{other[2]}</strong> / <a href="{pre}{other[0]}/index.html">{other[1]}</a></span>'
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
{FONTS}
<link rel="stylesheet" href="{pre}assets/posts.css">
{extra_head}
</head>
<body>
<div class="wrap">
  <header class="top">
    <a href="index.html">Atelier Composition Son</a>
    <nav aria-label="{'目次' if lang == 'ja' else 'Navigation'}">{nav}{lang_sw}</nav>
  </header>
{body}
  <footer class="site">
    {COLS3[lang].replace('class="cols3"', 'class="cols3" style="margin-top:0"')}
    <div class="small">{SMALL[lang]}</div>
  </footer>
</div>
<script src="{pre}assets/acs-embeds.js"></script>
<script src="{pre}assets/posts.js"></script>
</body>
</html>
"""


# ───────────────────────── 小さな DOM ─────────────────────────
VOID = {"img", "input", "br", "hr", "meta", "link", "source", "wbr", "track", "col"}


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)

    def find(self, tag):
        for c in self.children:
            if isinstance(c, Node):
                if c.tag == tag: return c
                r = c.find(tag)
                if r: return r
        return None

    def findall(self, pred, out=None):
        out = [] if out is None else out
        for c in self.children:
            if isinstance(c, Node):
                if pred(c): out.append(c)
                c.findall(pred, out)
        return out


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", []); self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in VOID: self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]; return

    def handle_data(self, data):
        if data: self.stack[-1].children.append(data)


def parse(src):
    p = Parser(); p.feed(src); return p.root


# ───────────────────────── 変換 ─────────────────────────
DROP = {"script", "style", "nav", "noscript", "svg", "template", "footer", "header", "canvas", "video", "picture", "source"}
INLINE = {"a", "strong", "em", "b", "i", "span", "br", "code", "small", "sup", "sub", "mark", "abbr", "time", "wbr", "u", "s"}
BLOCK = {"p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "details", "summary", "table", "thead", "tbody", "tfoot",
         "tr", "th", "td", "figure", "figcaption", "img", "iframe", "audio", "form", "fieldset", "legend", "label", "input", "select",
         "option", "optgroup", "textarea", "button", "hr", "pre", "dl", "dt", "dd", "caption"}
KEEP_ATTRS = {"href", "src", "alt", "title", "allow", "allowfullscreen", "loading", "type", "name", "id", "for", "required", "placeholder",
              "value", "rows", "cols", "action", "method", "target", "rel", "open", "colspan", "rowspan", "scope", "autocomplete", "selected",
              "checked", "min", "max", "step", "controls", "preload", "download", "referrerpolicy", "enctype", "accept", "multiple", "disabled",
              "aria-label", "start"}
LABEL_CLASSES = ("section-label", "eyebrow", "kicker", "section-kicker", "fr-eyebrow", "acs-consultation__meta")
GRID_CLASSES = ("grid-2", "grid-3", "grid-4", "price-grid", "flow", "video-grid", "cards", "fr-grid", "steps-grid", "info-grid")
TAGS_CLASSES = ("plugin-grid", "tools-list", "tags", "chips")
ITEM_CLASSES = ("card", "flow-item", "price", "price-card", "video-card", "plugin", "step", "info-panel", "voice", "testimonial")
LINKS_CLASSES = ("hero-actions", "fr-actions", "acs-consultation__links", "actions", "lesson-actions", "cta-row", "buttons", "button-row")


def fix_url(u, lang):
    if MODE == "prod":
        if u and u.endswith("sachie_studio.jpg"): return "../images/site/teacher.jpg"
        if u and u.startswith("../assets/img/"): return "../images/site/" + u[len("../assets/img/"):]
        return u
    if u and u.endswith("sachie_studio.jpg"): return "../assets/img/teacher.jpg"
    if not u or u.startswith(("#", "http", "mailto:", "tel:", "data:")): return u
    for pfx in ("/images/", "/assets/", "/docs/", "/sounds/", "/pdf/", "/scores/"):
        if u.startswith(pfx): return "../../.." + u
    if u.startswith("/ja/"): return "../ja/" + u[4:]
    if u.startswith("/fr/"): return "../fr/" + u[4:]
    if u == "/": return "../index.html"
    for pfx in ("../images/", "../assets/", "../docs/", "../sounds/", "../pdf/", "../scores/"):
        if u.startswith(pfx): return "../../" + u
    if u == "../": return "../index.html"
    if u.startswith("../ja/") and u.endswith("/"): return u + "index.html"
    if u.startswith("../fr/") and u.endswith("/"): return u + "index.html"
    if u.startswith("confidentialite"): return "https://ateliercompositionson.com/fr/confidentialite/"
    if u.startswith("./"): u = u[2:]
    return u


def esc(s):
    return html.escape(s, quote=False)


KEEP_CLASSES = {"correction-form", "error"}


def attrs_html(n, lang, extra_class=None):
    out = []
    keep = [c for c in n.cls() if c in KEEP_CLASSES and c != extra_class]
    if keep: extra_class = " ".join(([extra_class] if extra_class else []) + keep)
    for k, v in n.attrs.items():
        if k in KEEP_ATTRS or k.startswith("data-") or k.startswith("aria-") or k == "hidden":
            if k in ("href", "src"): v = fix_url(v, lang)
            if v is None: out.append(f" {k}")
            else: out.append(f' {k}="{html.escape(v, quote=True)}"')
    if extra_class: out.append(f' class="{extra_class}"')
    return "".join(out)


def has_cls(n, names):
    return any(c in names for c in n.cls())


def render(nodes, lang, ctx):
    out = []
    for n in nodes:
        if isinstance(n, str):
            out.append(esc(n)); continue
        t = n.tag
        if t in DROP or t == "h1": continue
        if t == "img" and any(k in (n.attrs.get("src") or "") for k in ("hero", "header")): continue
        if has_cls(n, LABEL_CLASSES): continue          # 見出しの小さな文字は外で使う
        if t in ("figure",) and ("hero" in " ".join(n.cls()) or ctx.get("in_hero")): continue
        if t == "iframe":
            sc = "soundcloud" in (n.attrs.get("src") or "")
            out.append(f'<div class="embed{" sc" if sc else ""}"><iframe{attrs_html(n, lang)}></iframe></div>'); continue
        if t == "a":
            cls = "arrow" if (has_cls(n, ("button", "acs-btn", "acs-consultation__booking", "primary", "secondary", "cta")) or n.attrs.get("data-track")) else None
            out.append(f"<a{attrs_html(n, lang, cls)}>{render(n.children, lang, ctx)}</a>"); continue
        if t == "span" and has_cls(n, ("price-unit", "unit")):
            out.append(f"<small>{render(n.children, lang, ctx)}</small>"); continue
        if t == "span" and has_cls(n, ("tag", "chip", "pill", "tool")):
            out.append(f'<span class="tag">{render(n.children, lang, ctx)}</span>'); continue
        if t in INLINE:
            out.append(f"<{t}{attrs_html(n, lang)}>{render(n.children, lang, ctx)}</{t}>" if t not in VOID else f"<{t}>"); continue
        if t in BLOCK:
            if t == "h2" and ctx.get("skip_h2") is n: continue
            cls = None
            if t == "ul" and has_cls(n, ("list",)): cls = "list"
            if t == "p" and has_cls(n, ("price", "price-amount", "amount")): cls = "price"
            if t == "p" and has_cls(n, ("error",)): cls = "error"
            if t == "p" and has_cls(n, ("lead",)): cls = "lead"
            inner = render(n.children, lang, ctx)
            if t in VOID: out.append(f"<{t}{attrs_html(n, lang, cls)}>")
            else: out.append(f"<{t}{attrs_html(n, lang, cls)}>{inner}</{t}>")
            continue
        # 入れ物：意味のあるものだけ残し、ほかは中身に置き換える
        if t in ("div", "section", "article", "aside", "main", "span"):
            inner = render(n.children, lang, ctx)
            if any(k.startswith("data-") or k == "id" for k in n.attrs):     # スクリプトが使う入れ物は残す
                if has_cls(n, ("field", "submit-row", "form-row")):
                    out.append(f'<div class="frow"{attrs_html(n, lang)}>{inner}</div>'); continue
                out.append(f'<{t}{attrs_html(n, lang)}>{inner}</{t}>'); continue
            if not inner.strip(): continue
            if has_cls(n, TAGS_CLASSES):
                tags = "".join(f'<span class="tag">{esc(re.sub(r"\s+", " ", c.text()).strip())}</span>' for c in n.children if isinstance(c, Node) and c.text().strip())
                out.append(f'<p class="tags">{tags}</p>'); continue
            if has_cls(n, GRID_CLASSES): out.append(f'<div class="grid{" flow" if "flow" in n.cls() else ""}">{inner}</div>')
            elif has_cls(n, ITEM_CLASSES): out.append(f'<div class="item">{inner}</div>')
            elif has_cls(n, LINKS_CLASSES): out.append(f'<p class="links">{inner}</p>')
            elif has_cls(n, ("field", "submit-row", "form-row")): out.append(f'<div class="frow">{inner}</div>')
            elif has_cls(n, ("choice-grid", "choices")): out.append(f'<div class="choices">{inner}</div>')
            elif has_cls(n, ("price-main", "price-amount", "amount", "price-value")): out.append(f'<p class="price">{inner}</p>')
            elif has_cls(n, ("recommended-outline", "badge")): out.append(f'<p class="note">{inner}</p>')
            elif has_cls(n, ("included-box", "price-subtitle")): out.append(f'<p>{inner}</p>')
            else: out.append(inner)
            continue
        out.append(render(n.children, lang, ctx))
    return "".join(out)


def label_text(sec):
    for n in sec.findall(lambda x: has_cls(x, LABEL_CLASSES)):
        s = re.sub(r"\s+", " ", n.text()).strip()
        if s: return s
    return ""


def section_html(sec, lang):
    """1 つのセクション → 左に見出し（h2）、右に本文。"""
    h2 = sec.find("h2")
    small = label_text(sec)
    is_call = has_cls(sec, ("acs-consultation", "cta", "consultation")) or (sec.attrs.get("id") == "consultation")
    body = render(sec.children, lang, {"skip_h2": None if is_call else h2})
    if is_call:
        label = f'<p class="label">{esc(small)}</p>' if small else '<p class="label"></p>'
        return f'<section class="call"{" id=\"" + sec.attrs["id"] + "\"" if sec.attrs.get("id") else ""}>{label}<div class="body">{body}</div></section>'
    lab = re.sub(r"\s+", " ", h2.text()).strip() if h2 else ""
    label = f'<p class="label h">{esc(lab)}{f"<small>{esc(small)}</small>" if small else ""}</p>' if lab else (f'<p class="label">{esc(small)}</p>' if small else "<p></p>")
    idattr = f' id="{sec.attrs["id"]}"' if sec.attrs.get("id") else ""
    return f'<section class="block"{idattr}>{label}<div class="body">{body}</div></section>'


def hero_html(sec, lang, extra=""):
    h1 = sec.find("h1")
    eyebrow = label_text(sec)
    aside = sec.find("aside")
    body = render([c for c in sec.children if c is not aside], lang, {"in_hero": True})
    title = re.sub(r"\s+", " ", h1.text()).strip()
    out = f'<section class="page-head"><p class="label">{esc(eyebrow)}</p><div><h1>{esc(title)}</h1>{body}</div></section>'
    if aside is not None:
        out += section_html(aside, lang)
    return out


def band(lang, extra=""):
    cls = "field band greet" if extra else "field band"
    img = "../images/site/ecouter.jpg" if MODE == "prod" else "../assets/img/ecouter.jpg"
    return f'<div class="{cls}" id="field"><img class="still" src="{img}" alt="" aria-hidden="true"><canvas id="lake" aria-hidden="true"></canvas>{extra}</div>'


WAVE = {"ja": '<figure class="wave"><img src="../assets/img/wave.png" alt="手を振る Sachie Kobayashi"></figure>',
        "fr": '<figure class="wave"><img src="../assets/img/wave.png" alt="Sachie Kobayashi fait un signe de la main"></figure>'}


def port(src_path, lang, out_name):
    extra = ""
    src = read_src(f"{lang}/{out_name}")
    root = parse(src)
    title = (root.find("title").text().strip() if root.find("title") else "Atelier Composition Son")
    main = root.find("main") or root.find("body")
    parts, loose = [], []

    def flush():
        nonlocal loose
        if any(isinstance(x, Node) for x in loose):
            wrapper = Node("section", []); wrapper.children = loose
            parts.append(hero_html(wrapper, lang) if wrapper.find("h1") else section_html(wrapper, lang))
        loose = []

    for c in main.children:
        if isinstance(c, Node) and c.tag in ("section", "article") or (isinstance(c, Node) and c.tag == "div" and c.find("h2")):
            flush()
            parts.append(hero_html(c, lang) if c.find("h1") else section_html(c, lang))
        else:
            loose.append(c)
    flush()
    body = band(lang, extra) + "".join(parts)
    if MODE == "prod":
        write_prod(lang, out_name, src, body)
    else:
        open(os.path.join(HERE, lang, out_name), "w", encoding="utf-8").write(chrome(lang, title, out_name, body))


def port_synth():
    src = read_src("ja/simple-synth.html")
    main = re.search(r"<main.*?</main>", src, flags=re.S).group(0)
    main = main.replace("../assets/", "../../../assets/")
    title = re.search(r"<title>(.*?)</title>", src, flags=re.S).group(1).strip()
    head = '<link rel="stylesheet" href="../../../ja/simple-synth.css">'
    body = band("ja") + '<section class="page-head"><p class="label">学習ツール</p><div><h1>簡易シンセサイザー</h1><p>波形、フィルター、エンベロープ、LFO を触りながら、音作りの基本を確かめるための小さなシンセサイザーです。</p></div></section>' \
           + '<div class="synth-wrap">' + main + '</div>' \
           + '<script src="../../../ja/simple-synth-app.js"></script>'
    open(os.path.join(HERE, "ja", "simple-synth.html"), "w", encoding="utf-8").write(chrome("ja", title, "simple-synth.html", body, head))


def build_index(lang):
    import base64
    PORTRAIT_URI = "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(HERE, "assets", "img", "portrait.jpg"), "rb").read()).decode()
    tpl = open(os.path.join(HERE, "src", f"{lang}-index.html"), encoding="utf-8").read().replace("{{COLS3}}", COLS3[lang])
    tpl = tpl.replace('id="portrait" src="../assets/img/portrait.jpg"', f'id="portrait" src="{PORTRAIT_URI}"')
    title = "Atelier Composition Son — 作曲・音楽理論・DTM・電子音響のオンラインレッスン" if lang == "ja" else "Atelier Composition Son — Composition et création sonore en ligne"
    open(os.path.join(HERE, lang, "index.html"), "w", encoding="utf-8").write(chrome(lang, title, "index.html", tpl))


def build_root():
    page = f"""<!doctype html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Atelier Composition Son</title>{FONTS}<link rel="stylesheet" href="assets/posts.css"></head>
<body><div class="wrap">
  <header class="top"><a href="index.html">Atelier Composition Son</a><nav aria-label="Langue"><span class="lang">JA / FR</span></nav></header>
  <div class="field band" id="field"><img class="still" src="assets/img/ecouter.jpg" alt="" aria-hidden="true"><canvas id="lake" aria-hidden="true"></canvas></div>
  <div class="choose">
    <a href="ja/index.html">日本語<span>作曲・音楽理論・DTM・電子音響のオンラインレッスン</span></a>
    <a href="fr/index.html">Français<span>Accompagnement individuel en composition et création sonore</span></a>
  </div>
  <footer class="site"><div class="cols3" style="margin-top:0"><p>Atelier<span>Composition Son</span></p><p>オンラインレッスン<span>Cours en ligne</span></p><p>ateliercompositionson<span>.com</span></p></div></footer>
</div><script src="assets/posts.js"></script></body></html>
"""
    open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page)


def main():
    for lang in ("ja", "fr"):
        os.makedirs(os.path.join(HERE, lang), exist_ok=True)
        build_index(lang)
        for f in sorted(list_src(lang)):
            if not f.endswith(".html") or f == "index.html": continue
            if lang == "ja" and f == "simple-synth.html": continue
            port(os.path.join(ROOT, lang, f), lang, f)
            print("ported", lang, f)
    port_synth()
    build_root()
    print("done")


if __name__ == "__main__" and not (len(sys.argv) > 1 and sys.argv[1] == "--prod"):
    main()


# ───────────────────────── 公開ページへの書き出し ─────────────────────────
OLD_ASSETS = ("acs-core.css", "ja-home.css", "public-site-final.css", "lesson-detail-final.css", "acs-editorial.css", "acs-quiet",
              "fr-site.css", "acs-header.js", "acs-ui.js", "acs-quiet-lake.js")


def prod_head(src):
    """元の <head> から、SEO・計測・構造化データは残し、旧スタイルとページ内の <style> は外す。"""
    head = re.search(r"<head[^>]*>(.*?)</head>", src, flags=re.S | re.I).group(1)
    head = re.sub(r"<style.*?</style>", "", head, flags=re.S | re.I)
    head = re.sub(r'<link[^>]*rel="stylesheet"[^>]*>', lambda m: "" if any(a in m.group(0) for a in OLD_ASSETS) else m.group(0), head)
    head = re.sub(r'<link[^>]*rel="preload"[^>]*>', "", head)
    head = re.sub(r'<script[^>]*src="[^"]*"[^>]*>\s*</script>', lambda m: "" if any(a in m.group(0) for a in OLD_ASSETS) else m.group(0), head)
    head = re.sub(r"\n\s*\n+", "\n", head)
    return head.strip()


def prod_scripts(src):
    """本文末の、ページの機能に必要なスクリプトだけを残す（旧ヘッダー・旧背景は外す）。"""
    body = re.search(r"<body[^>]*>(.*)</body>", src, flags=re.S | re.I).group(1)
    keep = []
    for m in re.finditer(r"<script\b[^>]*>.*?</script>", body, flags=re.S | re.I):
        tag = m.group(0)
        if any(a in tag for a in OLD_ASSETS): continue
        keep.append(tag)
    return "\n".join(keep)


def write_prod(lang, out_name, src, body, scripts=None):
    head = prod_head(src)
    pre = "../"
    nav = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == out_name else ""}>{t}</a>' for h, t in NAV[lang])
    lang_sw = ('<span class="lang"><strong>JA</strong> / <a href="../fr/">FR</a></span>' if lang == "ja"
               else '<span class="lang"><strong>FR</strong> / <a href="../ja/">JA</a></span>')
    small = SMALL[lang].replace("../fr/index.html", "../fr/").replace("../ja/index.html", "../ja/") \
        .replace("../../../docs/", "../docs/")
    scripts = prod_scripts(src) if scripts is None else scripts
    page = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
{head}
{FONTS}
<link rel="stylesheet" href="{pre}assets/css/acs-posts.css?v=site-20261030">
</head>
<body>
<div class="wrap">
  <header class="top">
    <a href="./">Atelier Composition Son</a>
    <nav aria-label="{'メインメニュー' if lang == 'ja' else 'Navigation principale'}">{nav}{lang_sw}</nav>
  </header>
<main>
{body}
</main>
  <footer class="site">
    {COLS3[lang].replace('class="cols3"', 'class="cols3" style="margin-top:0"')}
    <div class="small">{small}</div>
  </footer>
</div>
{scripts}
<script src="{pre}assets/js/acs-embeds.js?v=site-20261030"></script>
<script defer src="{pre}assets/js/acs-field.js?v=site-20261030"></script>
</body>
</html>
"""
    page = page.replace('href="index.html"', 'href="./"')
    open(os.path.join(ROOT, lang, out_name), "w", encoding="utf-8").write(page)


def prod_main():
    global MODE
    MODE = "prod"
    import shutil
    os.makedirs(os.path.join(ROOT, "images", "site"), exist_ok=True)
    for f in os.listdir(os.path.join(HERE, "assets", "img")):
        shutil.copy(os.path.join(HERE, "assets", "img", f), os.path.join(ROOT, "images", "site", f))
    shutil.copy(os.path.join(HERE, "assets", "posts.css"), os.path.join(ROOT, "assets", "css", "acs-posts.css"))
    for lang in ("ja", "fr"):
        for f in sorted(list_src(lang)):
            if f == "index.html" or (lang == "ja" and f == "simple-synth.html"): continue
            port(None, lang, f)
            print("prod", lang, f)
    # フランス語トップ：見本の構成を、元の <head> とスクリプトで
    src = read_src("fr/index.html")
    tpl = open(os.path.join(HERE, "src", "fr-index.html"), encoding="utf-8").read().replace("{{COLS3}}", COLS3["fr"])
    tpl = tpl.replace("../assets/img/", "../images/site/").replace("../../../assets/", "../assets/").replace("../../../docs/", "../docs/")
    write_prod("fr", "index.html", src, tpl)
    print("prod fr index.html")
    # 簡易シンセ：アプリはそのまま
    s = read_src("ja/simple-synth.html")
    main_html = re.search(r"<main.*?</main>", s, flags=re.S).group(0)
    body = band("ja") + '<section class="page-head"><p class="label">学習ツール</p><div><h1>簡易シンセサイザー</h1><p>波形、フィルター、エンベロープ、LFO を触りながら、音作りの基本を確かめるための小さなシンセサイザーです。</p></div></section><div class="synth-wrap">' + main_html + "</div>"
    s2 = s.replace("</head>", "</head>")
    write_prod("ja", "simple-synth.html", s, body)
    # simple-synth.css は残す
    p = os.path.join(ROOT, "ja", "simple-synth.html"); t = open(p, encoding="utf-8").read()
    if "simple-synth.css" not in t:
        t = t.replace('<link rel="stylesheet" href="../assets/css/acs-posts.css', '<link rel="stylesheet" href="simple-synth.css?v=1">\n<link rel="stylesheet" href="../assets/css/acs-posts.css')
        open(p, "w", encoding="utf-8").write(t)
    print("prod ja simple-synth.html")


if __name__ == "__main__" and len(sys.argv) > 1 and sys.argv[1] == "--prod":
    prod_main()
