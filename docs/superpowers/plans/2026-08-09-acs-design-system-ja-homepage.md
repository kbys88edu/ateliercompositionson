# ACS Design System and Japanese Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved central design system and a substantially shorter, clearer Japanese homepage that preserves existing material and makes the free 30-minute consultation the dominant action.

**Architecture:** Keep the current static HTML architecture. Add one shared CSS foundation and one small vanilla JavaScript UI module, then rebuild `ja/index.html` as a single semantic page instead of layered hero/mobile variants. Preserve detailed biography and FAQ content on new static detail pages so homepage reduction means move/collapse/link, not deletion.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, Python 3 standard-library `unittest`, GA4/gtag, Formspree, browser-based responsive QA.

## Global Constraints

- Work from repository `kbys88edu/ateliercompositionson` at approved baseline `d235f18133e745e1f3ff121faa2939fec3bb0949`.
- Do not add a frontend framework, CSS framework, CMS, new analytics vendor, or stock/generated imagery.
- Preserve existing URLs, title/description/canonical/hreflang/Open Graph/JSON-LD, GA4 ID `G-Y1792EBWTT`, UTM propagation, forms, and booking destinations.
- Primary conversion is the free 30-minute consultation; use `30分無料相談を予約する` as the primary Japanese CTA.
- Use only existing verified copy and assets identified in `CONTENT_MAP.md` and `docs/superpowers/specs/2026-08-09-acs-design-system.md`.
- Do not publish unverified monthly-plan benefits, French-language claims, English routes, or resource-price claims.
- Keep Foundation 4800円 / 60分, Individual Session 7500円 / 60分, Monthly Atelier 28000円 / 月4回, and Text Feedback 1800円〜.
- Keep the Japanese page fully usable at 375, 390, 430, 768, 1024, and 1440 px.
- Keep one `h1`, visible keyboard focus, semantic labels, reduced-motion support, and no `user-scalable=no`.
- Preserve existing unique content by moving full biography to `ja/profile.html`, full FAQ to `ja/faq.html`, and specialist content to existing lesson/resource pages.
- Use test-first changes: add a failing contract test, confirm the expected failure, implement the smallest page/system change, then rerun all tests.

---

## File map

### Create

- `assets/css/acs-core.css`: shared tokens, reset, layout, typography, buttons, rules, header, media, FAQ, focus, and responsive foundations.
- `assets/css/ja-home.css`: Japanese homepage-specific composition and section layouts.
- `assets/js/acs-ui.js`: accessible mobile-menu behavior and anchor-menu closing.
- `ja/profile.html`: complete existing teacher biography in the shared system.
- `ja/faq.html`: complete existing FAQ in the shared system after plan terminology reconciliation.
- `tests/site_test_utils.py`: reusable HTML parser and repository path helpers.
- `tests/__init__.py`: marks the contract suite as an importable test package.
- `tests/test_design_system.py`: design-token and shared-asset contracts.
- `tests/test_ja_homepage.py`: semantic structure, content preservation, CTA, pricing, and media contracts.
- `tests/test_internal_references.py`: local link, image, script, and stylesheet existence checks for the changed pages.

### Modify

- `ja/index.html`: replace layered inline design/duplicate heroes with one approved semantic homepage; preserve metadata and unique content paths.
- `assets/js/acs-tracking.js`: use stable data attributes, repair mojibake, and avoid duplicate explicit events.
- `sitemap.xml`: add the new Japanese profile and FAQ routes.

### Preserve untouched in this plan

- `ja/booking.html` submission logic and fields.
- `ja/mail-correction.html` submission logic and fields.
- Japanese lesson-detail page content and URLs.
- French pages and root routing.
- Original image and media files.
- Bilingual terms PDF.

---

### Task 1: Add the failing redesign contract suite

**Files:**
- Create: `tests/site_test_utils.py`
- Create: `tests/__init__.py`
- Create: `tests/test_design_system.py`
- Create: `tests/test_ja_homepage.py`
- Create: `tests/test_internal_references.py`

**Interfaces:**
- Produces: `load_page(relative_path) -> ParsedPage`, `repo_path(relative_path) -> Path`, and `ParsedPage` collections for headings, IDs, links, images, scripts, and stylesheets.
- Consumes: only Python 3 standard library and repository files.

- [ ] **Step 1: Create the parser utility**

```python
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ParsedPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.headings = []
        self.links = []
        self.images = []
        self.iframes = []
        self.scripts = []
        self.stylesheets = []
        self._heading = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag in {"h1", "h2", "h3"}:
            self._heading = {"tag": tag, "text": "", "attrs": values}
            self.headings.append(self._heading)
        if tag == "a":
            self.links.append(values)
        if tag == "img":
            self.images.append(values)
        if tag == "iframe":
            self.iframes.append(values)
        if tag == "script" and values.get("src"):
            self.scripts.append(values["src"])
        if tag == "link" and values.get("rel") == "stylesheet":
            self.stylesheets.append(values.get("href", ""))

    def handle_endtag(self, tag):
        if self._heading and tag == self._heading["tag"]:
            self._heading["text"] = self._heading["text"].strip()
            self._heading = None

    def handle_data(self, data):
        if self._heading:
            self._heading["text"] += data


def repo_path(relative_path):
    return ROOT / relative_path


def load_page(relative_path):
    parser = ParsedPage()
    parser.feed(repo_path(relative_path).read_text(encoding="utf-8"))
    return parser
```

- [ ] **Step 2: Write failing design-system tests**

```python
import unittest
from tests.site_test_utils import repo_path


class DesignSystemTests(unittest.TestCase):
    def test_shared_stylesheet_defines_approved_tokens(self):
        css_path = repo_path("assets/css/acs-core.css")
        self.assertTrue(css_path.exists())
        css = css_path.read_text(encoding="utf-8")
        for token in (
            "--acs-paper", "--acs-surface", "--acs-ink", "--acs-muted",
            "--acs-line", "--acs-focus", "--acs-container", "--acs-reading",
            "--acs-space-1", "--acs-space-10",
        ):
            self.assertIn(token, css)
        self.assertIn("prefers-reduced-motion: reduce", css)
        self.assertIn(":focus-visible", css)

    def test_shared_ui_script_contains_accessible_menu_contract(self):
        script_path = repo_path("assets/js/acs-ui.js")
        self.assertTrue(script_path.exists())
        script = script_path.read_text(encoding="utf-8")
        self.assertIn("aria-expanded", script)
        self.assertIn('event.key === "Escape"', script)
        self.assertIn("data-menu-close", script)
```

- [ ] **Step 3: Write failing Japanese-homepage contracts**

```python
import unittest
from tests.site_test_utils import load_page, repo_path


class JapaneseHomepageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = load_page("ja/index.html")
        cls.html = repo_path("ja/index.html").read_text(encoding="utf-8")

    def test_has_one_h1(self):
        h1s = [heading for heading in self.page.headings if heading["tag"] == "h1"]
        self.assertEqual(1, len(h1s))
        self.assertEqual("作曲・DTM・音楽理論を、自分の作品につなげる。", h1s[0]["text"])

    def test_primary_sections_are_present_once_and_ordered(self):
        expected = [
            "top", "trust", "who", "study", "process", "instructor",
            "works", "voices", "price", "faq", "contact",
        ]
        self.assertEqual(len(self.page.ids), len(set(self.page.ids)))
        positions = [self.page.ids.index(section_id) for section_id in expected]
        self.assertEqual(positions, sorted(positions))

    def test_primary_consultation_links_are_direct_and_stable(self):
        tracked = {
            link.get("data-track"): link.get("href")
            for link in self.page.links if link.get("data-track")
        }
        self.assertEqual("booking.html", tracked["hero_consultation"])
        self.assertEqual("booking.html", tracked["pricing_consultation"])
        self.assertEqual("booking.html", tracked["final_consultation"])
        self.assertEqual("#study", tracked["hero_lessons"])

    def test_current_prices_are_present_without_commas(self):
        for text in ("4800円", "7500円", "28000円", "1800円〜"):
            self.assertIn(text, self.html)
        for old_text in ("4,800円", "7,500円", "28,000円", "1,800円"):
            self.assertNotIn(old_text, self.html)

    def test_viewport_allows_zoom(self):
        self.assertNotIn("user-scalable=no", self.html)

    def test_old_duplicate_hero_variants_are_absent(self):
        for class_name in (
            "hero-kinetic", "ja-hero-copy", "ja-hero-kinetic",
            "mobile-hero-landing", "hero-mail-correction-cta", "hero-copy",
        ):
            self.assertNotIn(class_name, self.html)
```

- [ ] **Step 4: Write failing local-reference tests for changed pages**

```python
import unittest
from pathlib import Path
from tests.site_test_utils import ROOT, load_page


def local_target(page_path, raw_target):
    clean = raw_target.split("#", 1)[0].split("?", 1)[0]
    if not clean or clean.startswith(("http://", "https://", "mailto:", "tel:")):
        return None
    return (ROOT / page_path).parent.joinpath(clean).resolve()


class InternalReferenceTests(unittest.TestCase):
    def test_changed_pages_have_existing_local_assets_and_routes(self):
        for page_path in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            page_file = ROOT / page_path
            self.assertTrue(page_file.exists(), page_path)
            page = load_page(page_path)
            targets = [link.get("href", "") for link in page.links]
            targets += [image.get("src", "") for image in page.images]
            targets += page.scripts + page.stylesheets
            for raw_target in targets:
                target = local_target(page_path, raw_target)
                if target is not None:
                    self.assertTrue(target.exists(), f"{page_path}: {raw_target}")
```

- [ ] **Step 5: Run the suite and verify the expected RED state**

Run:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Expected: failures because `assets/css/acs-core.css`, `assets/js/acs-ui.js`, `ja/profile.html`, and `ja/faq.html` do not exist; homepage structure and H1 count also fail.

- [ ] **Step 6: Commit only the failing contracts**

```bash
git add tests/__init__.py tests/site_test_utils.py tests/test_design_system.py tests/test_ja_homepage.py tests/test_internal_references.py
git commit -m "test: define redesign contracts"
```

---

### Task 2: Create the central design foundation

**Files:**
- Create: `assets/css/acs-core.css`
- Create: `assets/css/ja-home.css`
- Create: `assets/js/acs-ui.js`
- Test: `tests/test_design_system.py`

**Interfaces:**
- Produces: approved `--acs-*` CSS tokens, `.acs-*` shared component classes, and menu hooks `[data-menu-toggle]`, `[data-menu-panel]`, `[data-menu-close]`.
- Consumes: no external libraries.

- [ ] **Step 1: Add CSS selector contracts before implementation**

Extend `tests/test_design_system.py`:

```python
    def test_shared_stylesheet_exposes_required_components(self):
        css_path = repo_path("assets/css/acs-core.css")
        self.assertTrue(css_path.exists())
        css = css_path.read_text(encoding="utf-8")
        for selector in (
            ".acs-container", ".acs-section", ".acs-btn", ".acs-btn--primary",
            ".acs-text-link", ".acs-site-header", ".acs-menu-toggle",
            ".acs-rule-list", ".acs-media", ".acs-faq",
        ):
            self.assertIn(selector, css)
```

- [ ] **Step 2: Run the selector test and confirm it fails**

Run:

```bash
python3 -m unittest tests.test_design_system.DesignSystemTests.test_shared_stylesheet_exposes_required_components -v
```

Expected: FAIL because the stylesheet is absent.

- [ ] **Step 3: Create the shared stylesheet foundation**

Start `assets/css/acs-core.css` with the approved exact tokens and base behavior:

```css
:root {
  --acs-paper: #f7f7f4;
  --acs-surface: #ffffff;
  --acs-ink: #111111;
  --acs-muted: #66635e;
  --acs-line: #1a1a1a;
  --acs-line-soft: rgba(17, 17, 17, 0.18);
  --acs-error: #9a261f;
  --acs-focus: #0b57d0;
  --acs-font-sans: "Helvetica Neue", Arial, "Hiragino Sans", "Yu Gothic", sans-serif;
  --acs-text-xs: 12px;
  --acs-text-sm: 14px;
  --acs-text-base: 17px;
  --acs-text-lg: 20px;
  --acs-h3: 24px;
  --acs-h2: 44px;
  --acs-h1: 64px;
  --acs-display: 88px;
  --acs-space-1: 4px;
  --acs-space-2: 8px;
  --acs-space-3: 12px;
  --acs-space-4: 16px;
  --acs-space-5: 24px;
  --acs-space-6: 32px;
  --acs-space-7: 48px;
  --acs-space-8: 64px;
  --acs-space-9: 96px;
  --acs-space-10: 128px;
  --acs-container-wide: 1280px;
  --acs-container: 1120px;
  --acs-reading: 760px;
  --acs-gutter: 24px;
  --acs-rule: 1px solid var(--acs-line);
  --acs-rule-soft: 1px solid var(--acs-line-soft);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--acs-surface);
  color: var(--acs-ink);
  font-family: var(--acs-font-sans);
  font-size: var(--acs-text-base);
  line-height: 1.8;
  letter-spacing: 0;
}
img, iframe { display: block; max-width: 100%; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--acs-focus); outline-offset: 3px; }
.acs-container { width: min(100% - (2 * var(--acs-gutter)), var(--acs-container)); margin-inline: auto; }
.acs-container--wide { width: min(100% - (2 * var(--acs-gutter)), var(--acs-container-wide)); margin-inline: auto; }
.acs-section { padding-block: var(--acs-space-9); border-top: var(--acs-rule-soft); }
.acs-btn { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; padding: 12px 22px; border: var(--acs-rule); border-radius: 0; text-decoration: none; font-size: var(--acs-text-sm); }
.acs-btn--primary { background: var(--acs-ink); color: var(--acs-surface); }
.acs-text-link { text-underline-offset: 5px; text-decoration-thickness: 1px; }
.acs-media { overflow: hidden; background: var(--acs-paper); }
.acs-media img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 767px) {
  :root {
    --acs-gutter: 18px;
    --acs-text-base: 16px;
    --acs-text-lg: 18px;
    --acs-h3: 20px;
    --acs-h2: 30px;
    --acs-h1: 34px;
    --acs-display: 42px;
  }
  .acs-section { padding-block: var(--acs-space-8); }
  .acs-btn { min-height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

Complete the required shared selectors named by the test, using only the approved tokens. Put hero, trust, audience, study-family, process, instructor, works, voices, pricing, FAQ, and final-CTA composition in `assets/css/ja-home.css`.

- [ ] **Step 4: Create accessible menu behavior**

Create `assets/js/acs-ui.js`:

```javascript
(function () {
  function initMenu(root) {
    var toggle = root.querySelector("[data-menu-toggle]");
    var panel = root.querySelector("[data-menu-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.documentElement.classList.toggle("acs-menu-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-menu-close]")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    });

    setOpen(false);
  }

  document.querySelectorAll("[data-menu]").forEach(initMenu);
})();
```

- [ ] **Step 5: Run design-system tests**

Run:

```bash
python3 -m unittest tests.test_design_system -v
```

Expected: PASS.

- [ ] **Step 6: Commit the shared foundation**

```bash
git add assets/css/acs-core.css assets/css/ja-home.css assets/js/acs-ui.js tests/test_design_system.py
git commit -m "feat: add ACS design foundation"
```

---

### Task 3: Rebuild the Japanese header, hero, trust, and audience entry

**Files:**
- Modify: `ja/index.html`
- Modify: `tests/test_ja_homepage.py`
- Test: `tests/test_internal_references.py`

**Interfaces:**
- Consumes: `.acs-site-header`, `.acs-btn`, `.acs-btn--primary`, menu data hooks, and Japanese homepage classes from Task 2.
- Produces: one semantic `h1`; section IDs `top`, `trust`, and `who`; stable hero CTA events.

- [ ] **Step 1: Add header, hero, trust, and audience assertions**

Extend `tests/test_ja_homepage.py`:

```python
    def test_header_has_restrained_navigation(self):
        for label in ("レッスン", "講師", "料金", "受講者の声", "無料相談"):
            self.assertIn(label, self.html)
        for old_primary_label in ("AI添削", "学習ツール", "規約", "お問い合わせ"):
            self.assertNotIn(f">{old_primary_label}</a>", self.html)

    def test_trust_and_audience_are_concise(self):
        for text in (
            "ジュネーブ高等音楽院", "IRCAM作曲研究課程",
            "スイスの音楽院での指導経験", "日本・スイス・フランスでの制作実践",
            "これから始める / 基礎から", "独学・制作中", "専門・受験・ポートフォリオ",
        ):
            self.assertIn(text, self.html)
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
python3 -m unittest tests.test_ja_homepage -v
```

Expected: failures for the duplicate H1, old navigation, missing stable event names, and new section IDs.

- [ ] **Step 3: Preserve the existing document head and replace the page-level visual implementation**

Keep the current title, meta description, canonical, hreflang, Open Graph, JSON-LD, GA4 bootstrap, and `assets/js/acs-tracking.js`. Replace the inline CSS with:

```html
<link rel="stylesheet" href="../assets/css/acs-core.css">
<link rel="stylesheet" href="../assets/css/ja-home.css">
```

Use a zoomable viewport:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- [ ] **Step 4: Replace the header and opening sections with the approved structure**

The opening `<main>` structure must be:

```html
<main id="top">
  <section class="ja-home-hero" aria-labelledby="home-title">
    <div class="acs-container--wide ja-home-hero__grid">
      <div class="ja-home-hero__copy">
        <p class="acs-kicker">ATELIER COMPOSITION SON</p>
        <h1 id="home-title">作曲・DTM・音楽理論を、自分の作品につなげる。</h1>
        <p class="ja-home-hero__lead">Atelier Composition Son は、作曲・理論・音の実践を、個々の制作や学習に合わせて扱う小さなオンラインアトリエです。</p>
        <div class="ja-home-hero__actions">
          <a class="acs-btn acs-btn--primary" href="booking.html" data-track="hero_consultation">30分無料相談を予約する</a>
          <a class="acs-text-link" href="#study" data-track="hero_lessons">レッスンを見る</a>
        </div>
        <dl class="ja-home-hero__facts" aria-label="レッスン概要">
          <div><dt>FORMAT</dt><dd>ONLINE</dd></div>
          <div><dt>STYLE</dt><dd>個人レッスン</dd></div>
          <div><dt>TIME</dt><dd>60 MIN</dd></div>
          <div><dt>PRICE</dt><dd>4800円から</dd></div>
        </dl>
      </div>
      <figure class="acs-media ja-home-hero__media">
        <img src="../images/sachie_studio.jpg" width="1200" height="900" alt="スタジオで制作する講師 Sachie Kobayashi" fetchpriority="high" decoding="async">
      </figure>
    </div>
  </section>
  <section id="trust" class="ja-trust" aria-label="講師の背景">
    <div class="acs-container--wide ja-trust__grid">
      <p>ジュネーブ高等音楽院<br>音楽教育修士</p>
      <p>IRCAM作曲研究課程<br>2021-2022</p>
      <p>スイスの音楽院での<br>指導経験</p>
      <p>日本・スイス・フランスでの<br>制作実践</p>
    </div>
  </section>
  <section id="who" class="acs-section ja-who" aria-labelledby="who-title">
    <div class="acs-container">
      <p class="acs-kicker">WHO THIS IS FOR</p>
      <h2 id="who-title">それぞれの現在地から。</h2>
      <div class="ja-who__paths">
        <article><p class="ja-index">01</p><h3>これから始める / 基礎から</h3><p>作曲やDTMを始めたい方、楽譜や音楽理論の土台を作品につなげたい方へ。</p><a class="acs-text-link" href="composition-lesson.html">作曲レッスンを見る</a></article>
        <article><p class="ja-index">02</p><h3>独学・制作中</h3><p>制作中の曲、音源、楽譜、DAWプロジェクトをもとに、構成や技術を整理したい方へ。</p><a class="acs-text-link" href="dtm-lesson.html">DTMレッスンを見る</a></article>
        <article><p class="ja-index">03</p><h3>専門・受験・ポートフォリオ</h3><p>音大・芸大受験、海外音楽院、公募、現代音楽、電子音響の作品を準備したい方へ。</p><a class="acs-text-link" href="music-theory-lesson_with_pdf-link.html">理論・受験内容を見る</a></article>
      </div>
    </div>
  </section>
```

Add the restrained site header before `<main>` using the approved navigation and `[data-menu]` hooks. Add `../assets/js/acs-ui.js` with `defer` before the closing body tag.

- [ ] **Step 5: Run focused and reference tests**

Run:

```bash
python3 -m unittest tests.test_ja_homepage tests.test_internal_references -v
```

Expected: design-system and opening-section tests pass; later-section contracts still fail until Tasks 4-5.

- [ ] **Step 6: Commit the opening journey**

```bash
git add ja/index.html tests/test_ja_homepage.py
git commit -m "feat: clarify Japanese homepage entry"
```

---

### Task 4: Build study families, lesson process, and teacher profile

**Files:**
- Modify: `ja/index.html`
- Create: `ja/profile.html`
- Modify: `tests/test_ja_homepage.py`
- Test: `tests/test_internal_references.py`

**Interfaces:**
- Produces: `#study`, `#process`, `#instructor`; six preserved lesson routes; `ja/profile.html` containing the complete biography.
- Consumes: approved shared styles and existing source copy from baseline `ja/index.html:2941-3210`.

- [ ] **Step 1: Add failing study/process/profile tests**

```python
    def test_study_groups_preserve_six_lesson_routes(self):
        expected = {
            "composition-lesson.html", "dtm-lesson.html",
            "music-theory-lesson_with_pdf-link.html", "solfege.html",
            "electroacoustic-lesson.html", "sound-technology-ai-lesson.html",
        }
        hrefs = {link.get("href") for link in self.page.links}
        self.assertTrue(expected.issubset(hrefs))
        self.assertEqual(3, self.html.count('class="ja-study-family"'))

    def test_process_has_exactly_three_steps(self):
        self.assertEqual(3, self.html.count('class="ja-process__step"'))
        for label in ("相談", "個別レッスン", "次の制作・学習へ"):
            self.assertIn(label, self.html)

    def test_teacher_summary_links_to_full_profile(self):
        self.assertIn('src="../images/profile.png"', self.html)
        self.assertIn('href="profile.html"', self.html)
        profile = repo_path("ja/profile.html").read_text(encoding="utf-8")
        for credential in ("Master of Arts HES-SO", "2021–2022年", "Klangforum Wien", "impuls International Composition Competition 2023"):
            self.assertIn(credential, profile)
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
python3 -m unittest tests.test_ja_homepage.JapaneseHomepageTests.test_study_groups_preserve_six_lesson_routes tests.test_ja_homepage.JapaneseHomepageTests.test_process_has_exactly_three_steps tests.test_ja_homepage.JapaneseHomepageTests.test_teacher_summary_links_to_full_profile -v
```

Expected: FAIL because the grouped sections and profile page are absent.

- [ ] **Step 3: Add three study families and three process steps**

Use these section IDs and links:

```html
<section id="study" class="acs-section ja-study" aria-labelledby="study-title">
  <div class="acs-container">
    <p class="acs-kicker">WHAT YOU CAN STUDY</p>
    <h2 id="study-title">扱う領域</h2>
    <div class="ja-study__families">
      <article class="ja-study-family" data-track-group="composition-theory">
        <p class="ja-index">01</p><h3>COMPOSITION / THEORY</h3>
        <a href="composition-lesson.html" data-track="lesson_family_click">作曲</a>
        <a href="music-theory-lesson_with_pdf-link.html" data-track="lesson_family_click">音楽理論・和声・分析</a>
        <a href="solfege.html" data-track="lesson_family_click">ソルフェージュ</a>
      </article>
      <article class="ja-study-family" data-track-group="dtm-sound">
        <p class="ja-index">02</p><h3>DTM / SOUND / ELECTROACOUSTIC</h3>
        <a href="dtm-lesson.html" data-track="lesson_family_click">DTM・サウンドデザイン</a>
        <a href="electroacoustic-lesson.html" data-track="lesson_family_click">電子音響・シンセサイザー</a>
      </article>
      <article class="ja-study-family" data-track-group="technology-advanced">
        <p class="ja-index">03</p><h3>TECHNOLOGY / ADVANCED PRACTICE</h3>
        <a href="sound-technology-ai-lesson.html" data-track="lesson_family_click">サウンドテクノロジー・AI音楽</a>
        <p>受験、ポートフォリオ、公募、継続プロジェクトも個別に扱います。</p>
      </article>
    </div>
  </div>
</section>

<section id="process" class="acs-section ja-process" aria-labelledby="process-title">
  <div class="acs-container">
    <p class="acs-kicker">HOW IT WORKS</p><h2 id="process-title">相談から、次の制作へ。</h2>
    <ol class="ja-process__list">
      <li class="ja-process__step"><span>01</span><h3>相談</h3><p>現在の経験、作りたい音、使っている道具、困っている点を整理します。</p></li>
      <li class="ja-process__step"><span>02</span><h3>個別レッスン</h3><p>楽譜、音源、DAWプロジェクト、課題を使い、必要な理論と技術を扱います。</p></li>
      <li class="ja-process__step"><span>03</span><h3>次の制作・学習へ</h3><p>具体的な改善点と、レッスン後に取り組む次の課題を明確にします。</p></li>
    </ol>
  </div>
</section>
```

- [ ] **Step 4: Add the concise homepage teacher section**

Use `images/profile.png`, the name/role, the current short introduction, and four verified facts. Link `詳しいプロフィール` to `profile.html`. Do not copy the complete chronology into the homepage.

- [ ] **Step 5: Create the full profile page from existing material**

Build `ja/profile.html` with the shared header/footer, title `講師について | Atelier Composition Son`, one `h1` (`Sachie Kobayashi`), `images/sachie_studio.jpg`, and the complete biography and message currently present in baseline `ja/index.html:2985-3082`. Preserve the external artist link `https://www.sachiekobayashi.com/` with `target="_blank"` and `rel="noopener noreferrer"`. End with a direct `booking.html` consultation CTA using `data-track="profile_consultation"`.

- [ ] **Step 6: Run study/profile/reference tests**

Run:

```bash
python3 -m unittest tests.test_ja_homepage tests.test_internal_references -v
```

Expected: study, process, teacher, and local-reference tests pass; final homepage contracts remain until Task 5.

- [ ] **Step 7: Commit the lesson and teacher path**

```bash
git add ja/index.html ja/profile.html tests/test_ja_homepage.py
git commit -m "feat: organize lessons and teacher proof"
```

---

### Task 5: Add selected work, testimonials, pricing, FAQ, and final CTA

**Files:**
- Modify: `ja/index.html`
- Create: `ja/faq.html`
- Modify: `tests/test_ja_homepage.py`
- Test: `tests/test_internal_references.py`

**Interfaces:**
- Produces: `#works`, `#voices`, `#price`, `#faq`, `#contact`, `ja/faq.html`, and stable pricing/final CTA events.
- Consumes: exact existing work sources from `ja/composition-lesson.html:934-974`, testimonials from baseline `ja/index.html:3337-3378`, prices from `ja/terms.html:335-338`, and FAQ source from baseline `ja/index.html:3484-3564`.

- [ ] **Step 1: Add failing lower-funnel contracts**

```python
    def test_homepage_has_three_selected_works(self):
        self.assertEqual(3, self.html.count('class="ja-work"'))
        for title in (
            "Émergences Résurgences pour orchestre",
            "Techno Pop / AI Workflow / TouchDesigner MV",
            "The Cosmic Microwaves Background / Le Fresnoy",
        ):
            self.assertIn(title, self.html)
        self.assertEqual(3, len(self.page.iframes))
        self.assertTrue(all(frame.get("loading") == "lazy" for frame in self.page.iframes))

    def test_homepage_preserves_three_testimonials(self):
        for profile in ("50代女性", "30代男性", "10代女性"):
            self.assertIn(profile, self.html)

    def test_pricing_uses_current_plan_names(self):
        for plan in ("Foundation", "Individual Session", "Monthly Atelier", "Text Feedback"):
            self.assertIn(plan, self.html)
        for old_plan in (">Beginner<", ">Advanced 単発<", ">Advanced 月謝<"):
            self.assertNotIn(old_plan, self.html)

    def test_homepage_faq_has_four_questions_and_full_faq_link(self):
        self.assertEqual(4, self.html.count("<details"))
        self.assertIn('href="faq.html"', self.html)

    def test_mail_feedback_is_secondary(self):
        tracked = {link.get("data-track"): link.get("href") for link in self.page.links if link.get("data-track")}
        self.assertEqual("mail-correction.html?request=mail-correction#form", tracked["mail_feedback"])
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run:

```bash
python3 -m unittest tests.test_ja_homepage -v
```

Expected: FAIL for missing new work, pricing, FAQ, and final CTA contracts.

- [ ] **Step 3: Add exactly three selected works**

Use the current embed sources without changing media ownership or titles:

```html
<section id="works" class="acs-section ja-works" aria-labelledby="works-title">
  <div class="acs-container--wide">
    <p class="acs-kicker">SELECTED WORK</p><h2 id="works-title">制作実践から。</h2>
    <div class="ja-works__grid">
      <article class="ja-work"><div class="ja-work__embed ja-work__embed--audio"><iframe title="Émergences Résurgences pour orchestre" loading="lazy" height="166" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fsachiekbys%2Femergences-resurgences-pour-orchestre&amp;color=%23111111&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=false"></iframe></div><h3>Émergences Résurgences pour orchestre</h3></article>
      <article class="ja-work"><div class="ja-work__embed"><iframe title="Techno Pop / AI Workflow / TouchDesigner MV" loading="lazy" src="https://www.youtube.com/embed/SgYGcZS1Mp4" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><h3>Techno Pop / AI Workflow / TouchDesigner MV</h3></article>
      <article class="ja-work"><div class="ja-work__embed"><iframe title="The Cosmic Microwaves Background / Le Fresnoy" loading="lazy" src="https://player.vimeo.com/video/1038238939" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><h3>The Cosmic Microwaves Background / Le Fresnoy</h3></article>
    </div>
    <a class="acs-text-link" href="composition-lesson.html#works" data-track="work_open">作品例をさらに見る</a>
  </div>
</section>
```

- [ ] **Step 4: Add testimonials verbatim and current pricing**

Move the three current testimonial texts from baseline `ja/index.html:3344-3374` without rewriting them. Build pricing as a ruled list: Foundation (`4800円 / 60分`), Individual Session (`7500円 / 60分`), Monthly Atelier (`28000円 / 月4回`), Text Feedback (`1800円〜`). Use `data-track="pricing_consultation"` on the direct booking link and `data-track="mail_feedback"` on the written-feedback link.

- [ ] **Step 5: Add four homepage FAQs and create the full FAQ page**

Homepage keeps the four questions specified in the approved design spec. `ja/faq.html` preserves all current unique FAQ topics using current plan terms. Reconcile the frequency answer to the explicit published offer: Monthly Atelier is four sessions per month; one-off consultation/lesson needs use Individual Session. Preserve software, AI, checker, external-school, exam, beginner, and single-session answers.

- [ ] **Step 6: Add the final CTA and secondary links**

Use:

```html
<section id="contact" class="acs-section ja-final-cta" aria-labelledby="contact-title">
  <div class="acs-container ja-final-cta__grid">
    <div><p class="acs-kicker">FREE CONSULTATION</p><h2 id="contact-title">まずは30分の無料相談から。</h2></div>
    <div>
      <p>現在の経験、作りたい音、使用しているDAWや道具、いま困っていることを確認し、どの内容から始めるとよいかを一緒に整理します。</p>
      <a class="acs-btn acs-btn--primary" href="booking.html" data-track="final_consultation">30分無料相談を予約する</a>
      <p class="ja-final-cta__links"><a class="acs-text-link" href="mail-correction.html?request=mail-correction#form" data-track="mail_feedback">メール添削</a> / <a class="acs-text-link" href="mailto:info@sachiekobayashi.com" data-track="email_contact">メールで問い合わせる</a> / <a class="acs-text-link" href="terms.html" data-track="terms_open">規約を見る</a></p>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Run all static contracts**

Run:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Expected: all tests pass.

- [ ] **Step 8: Commit the lower-funnel content**

```bash
git add ja/index.html ja/faq.html tests/test_ja_homepage.py
git commit -m "feat: complete Japanese homepage journey"
```

---

### Task 6: Stabilize analytics and remove duplicate page listeners

**Files:**
- Modify: `assets/js/acs-tracking.js`
- Modify: `ja/index.html`
- Modify: `ja/profile.html`
- Modify: `ja/faq.html`
- Create: `tests/test_tracking.py`

**Interfaces:**
- Consumes: explicit `data-track` values on links/forms.
- Produces: one explicit custom event per tracked control, canonical consultation/contact/outbound events, and preserved UTM propagation.

- [ ] **Step 1: Write failing tracking contracts**

```python
import unittest
from tests.site_test_utils import repo_path


class TrackingTests(unittest.TestCase):
    def test_tracker_has_no_mojibake_heuristics(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        for bad in ("?????", "????", "?change gratuit", "30???"):
            self.assertNotIn(bad, script)

    def test_tracker_sends_explicit_data_track_event(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        self.assertIn('link.getAttribute("data-track")', script)
        self.assertIn("sendGaEvent(explicitEvent", script)

    def test_changed_pages_do_not_bind_inline_data_track_handlers(self):
        for page in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            html = repo_path(page).read_text(encoding="utf-8")
            self.assertNotIn("querySelectorAll('[data-track]')", html)
            self.assertNotIn('querySelectorAll("[data-track]")', html)
```

- [ ] **Step 2: Run tracking tests and confirm they fail**

Run:

```bash
python3 -m unittest tests.test_tracking -v
```

Expected: FAIL because mojibake remains and explicit events are not centrally sent.

- [ ] **Step 3: Update the shared tracker**

In the delegated click handler, read:

```javascript
var explicitEvent = link.getAttribute("data-track") || "";
if (explicitEvent) sendGaEvent(explicitEvent, params);
```

Classify free consultation using the stable attribute and destination only:

```javascript
function isFreeConsultation(link) {
  var href = link.getAttribute("href") || "";
  var track = link.getAttribute("data-track") || "";
  return href.indexOf("booking.html") >= 0 || track.indexOf("consultation") >= 0 || track.indexOf("booking") >= 0;
}
```

Remove mojibake text heuristics. Deduplicate event names before dispatch. Keep UTM storage/propagation, delayed navigation, form tracking, outbound tracking, and canonical `free_consultation_click`/`contact_click` events.

- [ ] **Step 4: Remove page-local data-track listeners from changed pages**

Keep only menu/UI behavior in `assets/js/acs-ui.js` and analytics in `assets/js/acs-tracking.js`.

- [ ] **Step 5: Run tracking and full tests**

Run:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit analytics stabilization**

```bash
git add assets/js/acs-tracking.js ja/index.html ja/profile.html ja/faq.html tests/test_tracking.py
git commit -m "fix: stabilize consultation tracking"
```

---

### Task 7: Add asset, SEO, accessibility, and sitemap contracts

**Files:**
- Modify: `ja/index.html`
- Modify: `ja/profile.html`
- Modify: `ja/faq.html`
- Modify: `sitemap.xml`
- Modify: `tests/test_ja_homepage.py`
- Modify: `tests/test_internal_references.py`

**Interfaces:**
- Produces: stable media dimensions, lazy loading, zoom support, canonical page metadata, valid new routes in sitemap, and keyboard/reduced-motion compatibility.
- Consumes: shared CSS media components and existing SEO metadata.

- [ ] **Step 1: Add failing metadata and accessibility contracts**

```python
    def test_images_have_alt_and_dimensions(self):
        for image in self.page.images:
            self.assertIn("alt", image)
            self.assertTrue(image.get("width") and image.get("height"), image.get("src"))

    def test_shared_assets_are_loaded_once(self):
        self.assertEqual(1, self.page.stylesheets.count("../assets/css/acs-core.css"))
        self.assertEqual(1, self.page.stylesheets.count("../assets/css/ja-home.css"))
        self.assertEqual(1, self.page.scripts.count("../assets/js/acs-ui.js"))
        self.assertEqual(1, self.page.scripts.count("../assets/js/acs-tracking.js"))
```

Add tests that `ja/profile.html` and `ja/faq.html` each have one H1, unique canonical URLs, a Japanese language attribute, and a direct booking CTA. Add a sitemap assertion for `/ja/profile.html` and `/ja/faq.html`.

- [ ] **Step 2: Run the focused contracts and confirm failures**

Run:

```bash
python3 -m unittest tests.test_ja_homepage tests.test_internal_references -v
```

Expected: any missing dimensions, metadata, or sitemap routes fail explicitly.

- [ ] **Step 3: Complete semantic media and metadata**

Add intrinsic dimensions to every changed-page image. Use `loading="lazy" decoding="async"` except the hero image, which uses `fetchpriority="high"`. Give all three work iframes specific titles. Add canonical/description/Open Graph data to profile and FAQ using their real URLs.

- [ ] **Step 4: Update the sitemap**

Add:

```xml
<url><loc>https://ateliercompositionson.com/ja/profile.html</loc></url>
<url><loc>https://ateliercompositionson.com/ja/faq.html</loc></url>
```

Do not remove existing URLs in this task.

- [ ] **Step 5: Run all tests and HTML sanity checks**

Run:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
git diff --check
```

Expected: all tests pass; `git diff --check` prints no errors.

- [ ] **Step 6: Commit accessibility and SEO completion**

```bash
git add ja/index.html ja/profile.html ja/faq.html sitemap.xml tests/test_ja_homepage.py tests/test_internal_references.py
git commit -m "fix: complete homepage accessibility and SEO"
```

---

### Task 8: Browser QA at required viewports

**Files:**
- Modify only files that fail a verified QA check.
- Test: all Python contracts plus in-app browser screenshots/interactions.

**Interfaces:**
- Produces: visually verified Japanese homepage, profile, and FAQ at all required widths.
- Consumes: local static server and the Browser plugin.

- [ ] **Step 1: Start the static preview server**

Run:

```bash
python3 -m http.server 8004
```

Expected: server remains available at `http://127.0.0.1:8004/`.

- [ ] **Step 2: Verify responsive layouts**

Open `/ja/`, `/ja/profile.html`, and `/ja/faq.html` at 375 x 812, 390 x 844, 430 x 932, 768 x 1024, 1024 x 900, and 1440 x 900.

At each width verify:

- No horizontal overflow.
- Header height is 64 px mobile and 76 px desktop.
- Hero image and copy are separate on mobile; H1 and consultation CTA appear within the first two screens.
- H1 wraps without isolated punctuation or clipped words.
- Buttons remain at least 44 px high and do not overlap.
- Three audience paths and three study families remain scannable.
- Work embeds retain their aspect ratio and do not load before their section approaches the viewport.
- Pricing labels and amounts fit without layout shift.
- FAQ summary text fits and focus is visible.

- [ ] **Step 3: Verify interactions and keyboard use**

Using Tab, Shift+Tab, Enter, Space, and Escape:

- Open and close the mobile menu.
- Close the menu with Escape and confirm focus returns to the menu button.
- Activate the hero lesson link and each FAQ disclosure.
- Confirm primary CTAs resolve to `/ja/booking.html` with UTM query parameters preserved when present.
- Confirm written feedback resolves to `/ja/mail-correction.html?request=mail-correction#form`.

- [ ] **Step 4: Verify reduced motion and console state**

Emulate `prefers-reduced-motion: reduce`. Confirm no nonessential animation remains. Reload each changed page and confirm the browser console contains no JavaScript errors, missing assets, or 404 responses.

- [ ] **Step 5: Run the full regression suite after any QA fixes**

Run:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
git diff --check
git status --short
```

Expected: all tests pass, no whitespace errors, and only intentional redesign files are modified.

- [ ] **Step 6: Commit verified QA fixes**

```bash
git add assets/css/acs-core.css assets/css/ja-home.css assets/js/acs-ui.js assets/js/acs-tracking.js ja/index.html ja/profile.html ja/faq.html sitemap.xml tests
git commit -m "test: verify Japanese redesign across viewports"
```

---

## Completion gate

Before this plan is complete, verify all of the following:

- `python3 -m unittest discover -s tests -p 'test_*.py' -v` passes.
- There is one Japanese homepage H1 and no duplicate IDs.
- All primary consultation CTAs link directly to `ja/booking.html`.
- The old duplicate hero classes and mobile-only duplicate content are absent.
- Unique biography, FAQ, work, testimonial, price, policy, and contact material remains reachable.
- Existing Formspree, Calendly, French, lesson-detail, tool, and terms files are not unintentionally changed.
- GA4 and UTM behavior is preserved without duplicate page listeners.
- Responsive and keyboard QA passes at all six required widths.
- Browser console and network checks show no errors or 404s.
- `git diff --check` is clean.
