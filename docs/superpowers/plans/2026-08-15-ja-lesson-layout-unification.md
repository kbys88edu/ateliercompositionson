# Japanese Lesson Layout Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify six Japanese lesson detail pages with the Japanese homepage's restrained split layout, typography, spacing, rules, buttons, and responsive behavior while preserving every existing content section.

**Architecture:** Each page will use one shared `lesson-detail-page` body scope and one shared `lesson-detail-hero` component. Existing page-specific inline CSS remains responsible for unique content, while `assets/css/lesson-detail-final.css` becomes the authoritative final layer for hero, section rhythm, cards, and mobile layout.

**Tech Stack:** Static HTML5, CSS custom properties, shared vanilla JavaScript header, Python `unittest`, local HTTP server, in-app browser visual QA.

## Global Constraints

- Preserve all existing Japanese lesson content, prices, works, PDFs, embeds, links, and ordering.
- Preserve CTA destinations and all existing `data-track` attributes.
- Use a two-column text/image hero on desktop and a one-column hero at or below 760px.
- Use square corners, no decorative shadows, white surfaces, black text, and thin rules.
- Keep H1 between approximately 48-64px on desktop and 32-40px on mobile.
- Allow page-specific `object-position` values, but use a shared cropped media frame.
- Do not modify French lesson pages, URLs, JavaScript behavior, forms, analytics, prices, or service copy.

---

### Task 1: Define the Shared Lesson Layout Contract

**Files:**
- Modify: `tests/test_public_site_final.py`

**Interfaces:**
- Consumes: `JA_DETAILS`, `page_html()`, and `load_page()` in `tests/test_public_site_final.py`.
- Produces: Regression tests for the shared body scope, hero component, media frame, summary region, stylesheet, and one H1.

- [ ] **Step 1: Write the failing structural tests**

Add these methods to `LessonDetailFinalTests`:

```python
def test_japanese_lessons_share_homepage_aligned_layout_hooks(self):
    for page_path in JA_DETAILS:
        page = load_page(page_path)
        html = page_html(page_path)
        self.assertIn('class="lesson-detail-page"', html, page_path)
        self.assertIn('class="lesson-detail-hero"', html, page_path)
        self.assertIn('class="lesson-detail-hero__copy"', html, page_path)
        self.assertIn('class="lesson-detail-hero__media', html, page_path)
        self.assertIn('class="lesson-detail-hero__summary', html, page_path)
        self.assertLess(
            page.stylesheets.index("../assets/css/acs-core.css"),
            page.stylesheets.index("../assets/css/lesson-detail-final.css"),
            page_path,
        )

def test_shared_lesson_css_uses_compact_split_hero(self):
    css = page_html("assets/css/lesson-detail-final.css")
    for rule in (
        ".lesson-detail-hero {",
        "grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);",
        ".lesson-detail-hero__media img {",
        "object-fit: cover;",
        ".lesson-detail-hero h1 {",
        "font-size: clamp(3rem, 5vw, 4rem);",
        "@media (max-width: 760px)",
        "grid-template-columns: 1fr;",
    ):
        self.assertIn(rule, css)
```

- [ ] **Step 2: Run the tests and verify they fail for the intended reason**

```bash
python3 -m unittest \
  tests.test_public_site_final.LessonDetailFinalTests.test_japanese_lessons_share_homepage_aligned_layout_hooks \
  tests.test_public_site_final.LessonDetailFinalTests.test_shared_lesson_css_uses_compact_split_hero
```

Expected: FAIL because the class hooks and compact split CSS do not exist yet.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/test_public_site_final.py
git commit -m "test: define shared Japanese lesson layout"
```

---

### Task 2: Normalize the Six Hero Structures

**Files:**
- Modify: `ja/composition-lesson.html`
- Modify: `ja/dtm-lesson.html`
- Modify: `ja/music-theory-lesson_with_pdf-link.html`
- Modify: `ja/solfege.html`
- Modify: `ja/electroacoustic-lesson.html`
- Modify: `ja/sound-technology-ai-lesson.html`
- Test: `tests/test_public_site_final.py`

**Interfaces:**
- Consumes: Existing `lesson-header-image`, hero text, CTA, `hero-card`/`hero-panel`/`hero-meta`, and image assets.
- Produces: `.lesson-detail-page`, `.lesson-detail-hero`, `.lesson-detail-hero__copy`, `.lesson-detail-hero__media`, and `.lesson-detail-hero__summary` on every page.

- [ ] **Step 1: Add the common body scope**

Change each body opening tag to:

```html
<body class="lesson-detail-page">
```

Also place the shared stylesheets in this order on every target page so the detail layer is authoritative:

```html
<link rel="stylesheet" href="../assets/css/acs-core.css">
<link rel="stylesheet" href="../assets/css/lesson-detail-final.css">
```

- [ ] **Step 2: Place the existing image inside the shared hero**

Replace the separate image and hero siblings with this structure. This is the exact composition-page version; apply the same element roles to each page while retaining that page's current text and image attributes verbatim:

```html
<section class="lesson-detail-hero" aria-labelledby="lesson-title">
  <div class="lesson-detail-hero__copy">
    <div class="eyebrow">Online Composition Lesson</div>
    <h1 id="lesson-title">作曲を、感覚だけで終わらせない。</h1>
    <p class="lead">メロディ、コード、形式、音色、構成。作曲に必要な要素を整理しながら、あなた自身の音楽を作品として完成させるためのオンライン個人レッスンです。</p>
    <p class="muted">初心者の方には、音楽理論と小さな作曲課題から。経験者・受験生には、和声、対位法、楽曲分析、現代音楽、DTM、電子音響を組み合わせて、作品制作やポートフォリオ制作まで対応します。</p>
    <div class="hero-actions">
      <a class="button primary" href="/ja/booking.html">無料相談を予約する</a>
      <a class="button secondary" href="#content">レッスン内容を見る</a>
    </div>
  </div>
  <figure class="lesson-detail-hero__media lesson-detail-hero__media--composition">
    <img src="../images/ja-composition-header.png" alt="Composition / music theory / electroacoustic / AI and music">
  </figure>
  <aside class="lesson-detail-hero__summary">
    <h2>このレッスンで扱うこと</h2>
    <ul>
      <li>メロディ、コード、モチーフ、形式の基礎</li>
      <li>三部形式、ロンド形式、ソナタ形式などの構成</li>
      <li>和声・対位法を使った作曲力の強化</li>
      <li>DTM、音色設計、電子音響、AIと音楽制作を含む作品制作</li>
      <li>受験・ポートフォリオ・公募作品の相談</li>
    </ul>
  </aside>
</section>
```

Use these media modifiers:

```text
composition-lesson.html                lesson-detail-hero__media--composition
dtm-lesson.html                        lesson-detail-hero__media--dtm
music-theory-lesson_with_pdf-link.html lesson-detail-hero__media--theory
solfege.html                           lesson-detail-hero__media--solfege
electroacoustic-lesson.html            lesson-detail-hero__media--electroacoustic
sound-technology-ai-lesson.html        lesson-detail-hero__media--technology
```

For `solfege.html`, move the existing `.hero-meta` labels into `.lesson-detail-hero__summary`. On the other pages, move the existing summary heading and list without changing their text.

- [ ] **Step 3: Give every H1 a shared label target**

Set the section to `aria-labelledby="lesson-title"` and the existing H1 to:

```html
<h1 id="lesson-title">...</h1>
```

Retain all current text and intentional `<br>` elements.

- [ ] **Step 4: Run the structural tests**

```bash
python3 -m unittest \
  tests.test_public_site_final.LessonDetailFinalTests.test_japanese_lessons_share_homepage_aligned_layout_hooks \
  tests.test_public_site_final.LessonDetailFinalTests.test_all_lesson_details_load_shared_refinement_css_and_have_one_h1 \
  tests.test_public_site_final.LessonDetailFinalTests.test_japanese_lesson_consultation_routes_are_direct
```

Expected: PASS for structure, H1 count, and consultation routes. The CSS contract remains red until Task 3.

- [ ] **Step 5: Commit the normalized HTML**

```bash
git add ja/composition-lesson.html ja/dtm-lesson.html \
  ja/music-theory-lesson_with_pdf-link.html ja/solfege.html \
  ja/electroacoustic-lesson.html ja/sound-technology-ai-lesson.html
git commit -m "refactor: unify Japanese lesson hero structure"
```

---

### Task 3: Implement the Shared Top-Aligned Visual System

**Files:**
- Modify: `assets/css/lesson-detail-final.css`
- Test: `tests/test_public_site_final.py`

**Interfaces:**
- Consumes: Task 2 class hooks and tokens from `assets/css/acs-core.css`.
- Produces: Shared desktop/mobile layout, media cropping, typography, CTA, section rhythm, cards, and rule styling.

- [ ] **Step 1: Add the desktop hero component**

Append this Japanese-only scoped layer after the existing generic rules:

```css
.lesson-detail-page .lesson-detail-hero {
  width: min(100% - (2 * var(--acs-gutter)), var(--acs-container-wide));
  margin-inline: auto;
  padding-block: clamp(48px, 7vw, 88px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
  grid-template-areas: "copy media" "summary media";
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  border-bottom: var(--acs-rule);
}
.lesson-detail-page .lesson-detail-hero__copy { grid-area: copy; min-width: 0; }
.lesson-detail-page .lesson-detail-hero__media {
  grid-area: media;
  align-self: stretch;
  min-height: 0;
  margin: 0;
  overflow: hidden;
  background: #f3f3f3;
}
.lesson-detail-page .lesson-detail-hero__media img {
  width: 100%;
  height: 100%;
  min-height: 520px;
  max-height: 680px;
  display: block;
  object-fit: cover;
  object-position: center;
}
.lesson-detail-page .lesson-detail-hero__summary {
  grid-area: summary;
  padding-top: 24px;
  border-top: var(--acs-rule);
}
.lesson-detail-page .lesson-detail-hero h1 {
  max-width: 12em;
  margin: 16px 0 24px;
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: 0;
}
```

- [ ] **Step 2: Normalize labels, copy, buttons, summaries, and sections**

```css
.lesson-detail-page :is(.eyebrow, .kicker, .section-label, .section-kicker) {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.lesson-detail-page .lesson-detail-hero :is(.lead, .muted) {
  max-width: 42rem;
  color: var(--detail-ink);
  font-size: clamp(1rem, 1.35vw, 1.125rem);
  line-height: 1.85;
}
.lesson-detail-page :is(.hero-actions, .button-row) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}
.lesson-detail-page :is(.btn, .button) {
  min-height: 48px;
  padding: 12px 20px;
  border: var(--acs-rule);
  background: #fff;
  color: #111;
  border-radius: 0;
  box-shadow: none;
}
.lesson-detail-page :is(.btn.primary, .button.primary) {
  background: #111;
  color: #fff;
}
.lesson-detail-page main > section:not(.lesson-detail-hero) {
  width: min(100% - (2 * var(--acs-gutter)), var(--acs-container));
  margin-inline: auto;
  padding-block: var(--acs-space-9);
  border-bottom: var(--acs-rule-soft);
}
.lesson-detail-page :is(.card, .price-card, .sample-card, .wide-card, .video-card, .soundcloud-card) {
  border: var(--acs-rule-soft);
  border-radius: 0;
  box-shadow: none;
}
```

- [ ] **Step 3: Add page-specific image positioning**

```css
.lesson-detail-hero__media--composition img { object-position: center; }
.lesson-detail-hero__media--dtm img { object-position: center; }
.lesson-detail-hero__media--theory img { object-position: center; }
.lesson-detail-hero__media--solfege img { object-position: center 42%; }
.lesson-detail-hero__media--electroacoustic img { object-position: center; }
.lesson-detail-hero__media--technology img { object-position: center; }
```

- [ ] **Step 4: Add the 760px mobile layout**

```css
@media (max-width: 760px) {
  .lesson-detail-page .lesson-detail-hero {
    width: 100%;
    padding: 0;
    grid-template-columns: 1fr;
    grid-template-areas: "media" "copy" "summary";
    gap: 0;
  }
  .lesson-detail-page .lesson-detail-hero__media { aspect-ratio: 4 / 3; }
  .lesson-detail-page .lesson-detail-hero__media img {
    min-height: 0;
    max-height: none;
  }
  .lesson-detail-page .lesson-detail-hero__copy,
  .lesson-detail-page .lesson-detail-hero__summary {
    padding: 28px var(--acs-gutter);
  }
  .lesson-detail-page .lesson-detail-hero h1 {
    margin-block: 12px 20px;
    font-size: clamp(2rem, 9.5vw, 2.5rem);
    line-height: 1.12;
  }
  .lesson-detail-page :is(.hero-actions, .button-row) {
    display: grid;
    grid-template-columns: 1fr;
  }
  .lesson-detail-page :is(.btn, .button) { width: 100%; }
  .lesson-detail-page main > section:not(.lesson-detail-hero) {
    width: 100%;
    padding: var(--acs-space-8) var(--acs-gutter);
  }
}
```

- [ ] **Step 5: Run CSS and full regression tests**

```bash
python3 -m unittest \
  tests.test_public_site_final.LessonDetailFinalTests.test_shared_lesson_css_uses_compact_split_hero
python3 -m unittest discover -s tests -q
git diff --check
```

Expected: all tests PASS and `git diff --check` exits without output.

- [ ] **Step 6: Commit the shared CSS**

```bash
git add assets/css/lesson-detail-final.css tests/test_public_site_final.py
git commit -m "style: unify Japanese lesson detail layouts"
```

---

### Task 4: Visual QA and Framing Corrections

**Files:**
- Modify if evidence requires it: `assets/css/lesson-detail-final.css`
- Modify if evidence requires it: the six Japanese lesson HTML files
- Test: `tests/test_public_site_final.py`

**Interfaces:**
- Consumes: Completed shared hero and section system from Tasks 2-3.
- Produces: Verified desktop and mobile pages without clipped critical subjects, overlap, overflow, missing content, or broken CTA links.

- [ ] **Step 1: Start the local server**

```bash
python3 -m http.server 8010 --bind 127.0.0.1
```

Expected: server remains active at `http://127.0.0.1:8010/`.

- [ ] **Step 2: Inspect all six pages at 1440x1000**

Open these paths and compare the shared header, split hero, image crop, H1, CTA, summary, first content section, and thin rules:

```text
/ja/composition-lesson.html
/ja/dtm-lesson.html
/ja/music-theory-lesson_with_pdf-link.html
/ja/solfege.html
/ja/electroacoustic-lesson.html
/ja/sound-technology-ai-lesson.html
```

- [ ] **Step 3: Inspect all six pages at 390x844**

Verify that the image appears first, the H1 stays between 32-40px, buttons fit, summary text has side padding, cards close on all sides, and no horizontal scrolling occurs.

- [ ] **Step 4: Apply only evidence-based framing fixes**

If a subject is clipped, adjust only the matching media modifier, for example:

```css
.lesson-detail-hero__media--solfege img { object-position: 58% 42%; }
```

Do not change image assets or content.

- [ ] **Step 5: Run final verification**

```bash
python3 -m unittest discover -s tests -q
git diff --check
git status --short
```

Expected: all tests PASS, no whitespace errors, and only intentional files are modified.

- [ ] **Step 6: Commit visual corrections if any were needed**

```bash
git add assets/css/lesson-detail-final.css tests/test_public_site_final.py \
  ja/composition-lesson.html ja/dtm-lesson.html \
  ja/music-theory-lesson_with_pdf-link.html ja/solfege.html \
  ja/electroacoustic-lesson.html ja/sound-technology-ai-lesson.html
git commit -m "fix: refine lesson hero framing across viewports"
```
