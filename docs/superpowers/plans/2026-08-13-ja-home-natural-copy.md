# Japanese Homepage Natural Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Japanese homepage in concise, natural Japanese while preserving its information, structure, links, analytics, testimonials, and brand copy.

**Architecture:** Keep the existing static HTML and CSS architecture. Update only user-facing copy in `ja/index.html`, then update the static HTML contracts in `tests/test_ja_homepage.py` so the intended wording and preserved content remain testable.

**Tech Stack:** Semantic HTML, Python `unittest`, existing local preview server and in-app browser.

## Global Constraints

- H1 must be exactly `作曲・DTM・音楽理論の、基礎から実践まで`.
- Preserve page structure, images, video, embeds, prices, instructor credentials, links, IDs, class names, and all `data-track` attributes.
- Preserve the three testimonials verbatim.
- Preserve `音楽を学ぶことは、音をもう一度聴き直すことから始まる。` and `inspired by Pierre Schaeffer` verbatim.
- Do not edit Japanese pages other than `ja/index.html`.
- Do not add dependencies.

---

### Task 1: Lock the revised Japanese copy contract

**Files:**
- Modify: `tests/test_ja_homepage.py`
- Test: `tests/test_ja_homepage.py`

**Interfaces:**
- Consumes: Parsed HTML from `load_page("ja/index.html")` and raw homepage HTML.
- Produces: Static contracts for the new H1, natural section copy, preserved brand copy, unchanged routes, and unchanged testimonials.

- [ ] **Step 1: Update the H1 expectation**

Change the literal expectation to:

```python
self.assertEqual("作曲・DTM・音楽理論の、基礎から実践まで", h1s[0]["text"])
```

- [ ] **Step 2: Add the natural-copy expectations**

Add a test that requires these phrases:

```python
for text in (
    "作曲を始めたい方から、作品を制作している方まで。",
    "初めて学ぶ方から、専門的に取り組む方まで",
    "無料相談からレッスンまで",
    "学びたいこと、作りたい音に合わせて",
    "講師の作品",
    "まずは30分、無料でご相談ください",
):
    self.assertIn(text, self.html)
```

Require these former phrases to be absent:

```python
for text in (
    "自分の作品につなげる",
    "相談から、次の制作へ。",
    "レッスンを、創作の場として。",
    "制作実践から。",
    "音楽以前の感覚を作品へ接続します",
):
    self.assertNotIn(text, self.html)
```

- [ ] **Step 3: Run the focused tests and verify failure**

Run:

```bash
python3 -m unittest tests.test_ja_homepage.JapaneseHomepageTests
```

Expected: FAIL because `ja/index.html` still contains the old H1 and old section copy.

- [ ] **Step 4: Commit the failing copy contract together with Task 2 implementation**

Do not commit a deliberately failing state. Stage this test file with the HTML implementation after Task 2 passes.

---

### Task 2: Rewrite the Japanese homepage copy

**Files:**
- Modify: `ja/index.html`
- Test: `tests/test_ja_homepage.py`

**Interfaces:**
- Consumes: Existing semantic sections, routes, anchors, analytics attributes, prices, and embeds.
- Produces: The same homepage behavior with the approved natural Japanese copy.

- [ ] **Step 1: Replace title, description, and hero copy**

Use:

```html
<title>作曲・DTM・音楽理論の基礎から実践まで｜Atelier Composition Son</title>
<meta name="description" content="作曲・DTM・音楽理論・電子音響のオンライン個人レッスン。初心者の基礎学習から、音大受験、作品制作、ポートフォリオまで、一人ひとりの目的に合わせて指導します。30分無料相談受付中。">
<h1 id="home-title">作曲・DTM・音楽理論の、基礎から実践まで</h1>
<p class="ja-kinetic-hero__lead">作曲を始めたい方から、作品を制作している方まで。経験や目的に合わせて、一対一でレッスンします。</p>
<p class="ja-kinetic-hero__note">無料相談では、学びたいことや現在のお悩みを伺い、レッスン内容をご提案します。</p>
```

Change the secondary CTA to `レッスン内容を見る` without changing its href or `data-track`.

- [ ] **Step 2: Rewrite audience and process copy**

Use the exact copy from `docs/superpowers/specs/2026-08-13-ja-home-natural-copy-design.md` for the audience heading, three audience descriptions, process heading, and three process descriptions. Keep their HTML structure and links unchanged.

- [ ] **Step 3: Rewrite instructor and concept copy**

Use this instructor paragraph:

```html
<p class="ja-home-instructor__copy">神奈川県生まれの作曲家・アーティストです。クラシック音楽の基礎から、現代音楽、電子音響、サウンドデザイン、Max/MSP、AIを用いた制作まで、一人ひとりの関心や作品に合わせて指導します。</p>
```

Use `学びたいこと、作りたい音に合わせて` for the concept heading. Replace the two introduction paragraphs and three card descriptions with direct explanations of how content is chosen, how listening is used, and which production technologies are covered. Keep both brand-copy lines verbatim.

- [ ] **Step 4: Rewrite work, pricing, FAQ, consultation, and tools copy**

- Work heading: `講師の作品`.
- Pricing introduction: `目的や経験に合わせて、単発または継続のレッスンを選べます。`
- Individual Session description: `作品、楽譜、音源、和声・対位法、分析、AI音源について相談できます。`
- Final CTA heading: `まずは30分、無料でご相談ください`.
- Final CTA body: `学びたいこと、制作中の作品、使っているDAW、困っていることなどを伺います。相談後に受講を決めていただけます。`
- Tools introduction: `和声、対位法、音づくりをブラウザで試せる無料ツールです。使い方や結果については、レッスンやメール添削でもご相談いただけます。`
- Rewrite FAQ answers in shorter natural sentences while preserving every supported scope and product name.

- [ ] **Step 5: Run focused tests**

Run:

```bash
python3 -m unittest tests.test_ja_homepage.JapaneseHomepageTests
```

Expected: PASS.

- [ ] **Step 6: Run the full test suite and diff check**

Run:

```bash
python3 -m unittest discover -s tests
git diff --check
```

Expected: all tests PASS and `git diff --check` exits 0.

- [ ] **Step 7: Commit the copy revision**

```bash
git add ja/index.html tests/test_ja_homepage.py
git commit -m "copy: naturalize Japanese homepage"
```

---

### Task 3: Verify the revised copy in responsive layouts

**Files:**
- Verify: `ja/index.html`
- Verify: `assets/css/ja-home.css`

**Interfaces:**
- Consumes: The running static preview at port 8006.
- Produces: Browser evidence that copy changes do not create overflow, overlap, or broken CTA layout.

- [ ] **Step 1: Open a cache-busted preview**

Open:

```text
http://127.0.0.1:8006/ja/?natural-copy=1
```

- [ ] **Step 2: Verify mobile at 390 x 844**

Check the hero, audience, lesson cards, process, concept, pricing, FAQ, and final CTA. Confirm no horizontal overflow and that the two hero buttons remain usable.

- [ ] **Step 3: Verify desktop at 1440 x 1000**

Confirm headings fit their sections, the hero remains balanced, and no text overlaps media or rules.

- [ ] **Step 4: Inspect browser logs**

Confirm there are no console errors or warnings caused by the revision.

- [ ] **Step 5: Run final verification**

Run:

```bash
python3 -m unittest discover -s tests
git diff --check
git status --short
```

Expected: all tests PASS, no whitespace errors, and only intentional untracked design drafts remain outside this task.
