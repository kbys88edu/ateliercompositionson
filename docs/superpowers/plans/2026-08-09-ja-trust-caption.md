# Japanese Trust Strip Caption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the four-item trust strip below the Japanese homepage hero as a refined museum-caption grid with numbered entries.

**Architecture:** Keep the existing `ja-trust` section and its four statements, but give each statement a stable numbered markup structure. Extend the existing homepage stylesheet with desktop four-column and mobile two-column caption-grid rules; no new assets, scripts, components, or dependencies are required.

**Tech Stack:** Static HTML5, CSS, Python `unittest` repository checks, local `http.server` preview.

## Global Constraints

- Preserve all four existing statements and their order.
- Do not add a section heading, kicker, card title, link, image, or new content.
- Do not add `BACKGROUND / PRACTICE` or any other section label.
- Keep the background white and retain the black, white, and neutral-gray palette.
- Do not add rounded corners, shadows, filled cards, or decorative color.
- Desktop uses four equal columns; mobile uses two columns.
- Do not alter the hero, CTA links, header, or sections below the trust strip.

---

### Task 1: Numbered Museum-Caption Trust Strip

**Files:**
- Modify: `tests/test_ja_homepage.py`
- Modify: `tests/test_design_system.py`
- Modify: `ja/index.html`
- Modify: `assets/css/ja-home.css`

**Interfaces:**
- Consumes: Existing `.ja-trust` section and `.ja-trust__grid` container in `ja/index.html`.
- Produces: Four `.ja-trust__item` entries, each containing `.ja-trust__index` and `.ja-trust__copy`; responsive rules remain scoped to `.ja-trust`.

- [ ] **Step 1: Write the failing markup test**

Add this test to `JapaneseHomepageTests` in `tests/test_ja_homepage.py`:

```python
def test_trust_strip_uses_numbered_caption_items(self):
    self.assertEqual(4, self.html.count('class="ja-trust__item"'))
    for index in ("01", "02", "03", "04"):
        self.assertIn(f'<span class="ja-trust__index" aria-hidden="true">{index}</span>', self.html)
    for text in (
        "ジュネーブ高等音楽院", "音楽教育修士",
        "IRCAM作曲研究課程", "2021-2022",
        "スイスの音楽院での", "指導経験",
        "日本・スイス・フランスでの", "制作実践",
    ):
        self.assertIn(text, self.html)
    self.assertNotIn("BACKGROUND / PRACTICE", self.html)
```

- [ ] **Step 2: Write the failing responsive CSS test**

Add this test to `DesignSystemTests` in `tests/test_design_system.py`:

```python
def test_trust_strip_uses_caption_grid_geometry(self):
    css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
    desktop_grid = re.search(r"\.ja-trust__grid\s*\{([^}]*)\}", css)
    item = re.search(r"\.ja-trust__item\s*\{([^}]*)\}", css)
    index = re.search(r"\.ja-trust__index\s*\{([^}]*)\}", css)
    self.assertIsNotNone(desktop_grid)
    self.assertIn("grid-template-columns: repeat(4, minmax(0, 1fr))", desktop_grid.group(1))
    self.assertIsNotNone(item)
    self.assertIn("border-top: var(--acs-rule)", item.group(1))
    self.assertIsNotNone(index)
    self.assertIn("color: var(--acs-muted)", index.group(1))

    mobile_css = css.split("@media (max-width: 767px)", 1)[1]
    mobile_grid = re.search(r"\.ja-trust__grid\s*\{([^}]*)\}", mobile_css)
    self.assertIsNotNone(mobile_grid)
    self.assertIn("grid-template-columns: repeat(2, minmax(0, 1fr))", mobile_grid.group(1))
```

- [ ] **Step 3: Run the focused tests and verify they fail**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_ja_homepage.JapaneseHomepageTests.test_trust_strip_uses_numbered_caption_items \
  tests.test_design_system.DesignSystemTests.test_trust_strip_uses_caption_grid_geometry -v
```

Expected: both tests fail because numbered caption markup and the new item/index rules are absent.

- [ ] **Step 4: Replace the trust strip markup**

In `ja/index.html`, replace the four plain paragraphs inside `.ja-trust__grid` with:

```html
<div class="ja-trust__item">
  <span class="ja-trust__index" aria-hidden="true">01</span>
  <p class="ja-trust__copy">ジュネーブ高等音楽院<span>音楽教育修士</span></p>
</div>
<div class="ja-trust__item">
  <span class="ja-trust__index" aria-hidden="true">02</span>
  <p class="ja-trust__copy">IRCAM作曲研究課程<span>2021-2022</span></p>
</div>
<div class="ja-trust__item">
  <span class="ja-trust__index" aria-hidden="true">03</span>
  <p class="ja-trust__copy">スイスの音楽院での<span>指導経験</span></p>
</div>
<div class="ja-trust__item">
  <span class="ja-trust__index" aria-hidden="true">04</span>
  <p class="ja-trust__copy">日本・スイス・フランスでの<span>制作実践</span></p>
</div>
```

Keep the existing `aria-label="講師の背景"` on the section.

- [ ] **Step 5: Implement the desktop caption-grid styling**

Replace the existing `.ja-trust` rules in `assets/css/ja-home.css` with:

```css
.ja-trust { border-block: var(--acs-rule); background: var(--acs-surface); }
.ja-trust__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-left: var(--acs-rule-soft); }
.ja-trust__item { min-width: 0; min-height: 168px; display: grid; align-content: space-between; gap: var(--acs-space-6); padding: var(--acs-space-4) var(--acs-space-5) var(--acs-space-5); border-top: var(--acs-rule); border-right: var(--acs-rule-soft); }
.ja-trust__index { color: var(--acs-muted); font-size: var(--acs-text-xs); font-variant-numeric: tabular-nums; }
.ja-trust__copy { margin: 0; font-size: var(--acs-text-lg); font-weight: 500; line-height: 1.45; }
.ja-trust__copy span { display: block; margin-top: var(--acs-space-2); color: var(--acs-muted); font-size: var(--acs-text-sm); font-weight: 400; line-height: 1.5; }
```

- [ ] **Step 6: Implement the mobile two-column styling**

Inside `@media (max-width: 767px)` in `assets/css/ja-home.css`, replace the old trust paragraph rules with:

```css
.ja-trust__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.ja-trust__item { min-height: 142px; gap: var(--acs-space-4); padding: var(--acs-space-3) var(--acs-space-4) var(--acs-space-4); }
.ja-trust__copy { font-size: 15px; }
.ja-trust__copy span { font-size: 12px; }
```

- [ ] **Step 7: Run the focused tests and verify they pass**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_ja_homepage.JapaneseHomepageTests.test_trust_strip_uses_numbered_caption_items \
  tests.test_design_system.DesignSystemTests.test_trust_strip_uses_caption_grid_geometry -v
```

Expected: both tests pass.

- [ ] **Step 8: Run the full test suite**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

Expected: all tests pass.

- [ ] **Step 9: Verify the local preview**

Open `http://127.0.0.1:8006/ja/?trust-caption=1` and confirm:

- Four equal columns on desktop.
- Two columns on mobile.
- The entries remain in order `01` through `04`.
- No horizontal overflow appears at `390px` width.
- No section label, rounded cards, shadows, or decorative color appears.

- [ ] **Step 10: Commit the implementation**

```bash
git add ja/index.html assets/css/ja-home.css tests/test_ja_homepage.py tests/test_design_system.py
git commit -m "style: refine Japanese trust strip"
```
