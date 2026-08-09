# Japanese Concept Approach Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete thin black frames and internal padding to the three existing Japanese concept approach items without changing their layout.

**Architecture:** Keep the HTML unchanged and modify only the existing `.ja-concept__approaches article` CSS rule. Extend the design-system test to enforce the complete border while preserving the current desktop three-column and mobile one-column contracts.

**Tech Stack:** Static CSS, Python `unittest`, local `http.server` preview.

## Global Constraints

- Preserve the current desktop and mobile layout exactly.
- Preserve card gaps, numbering, headings, descriptions, typography, and order.
- Add a complete `1px` black border and internal padding to each article.
- Keep square corners, white backgrounds, and no shadows.
- Do not change surrounding concept text or the Pierre Schaeffer quote.

---

### Task 1: Frame the Concept Approach Items

**Files:**
- Modify: `tests/test_design_system.py`
- Modify: `assets/css/ja-home.css`

**Interfaces:**
- Consumes: Existing `.ja-concept__approaches` grid and its three `article` children.
- Produces: Three independently bordered items with unchanged responsive layout.

- [ ] **Step 1: Add the failing CSS contract test**

Add to `DesignSystemTests` in `tests/test_design_system.py`:

```python
def test_concept_approaches_use_complete_square_frames(self):
    css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
    grid = re.search(r"\.ja-concept__approaches\s*\{([^}]*)\}", css)
    item = re.search(r"\.ja-concept__approaches article\s*\{([^}]*)\}", css)
    self.assertIsNotNone(grid)
    self.assertIn("grid-template-columns: repeat(3, minmax(0, 1fr))", grid.group(1))
    self.assertIsNotNone(item)
    self.assertIn("border: var(--acs-rule)", item.group(1))
    self.assertIn("padding: var(--acs-space-5)", item.group(1))
    self.assertNotIn("border-radius", item.group(1))
    self.assertNotIn("box-shadow", item.group(1))

    mobile_css = css.split("@media (max-width: 767px)", 1)[1]
    self.assertIn(".ja-concept__approaches", mobile_css)
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_design_system.DesignSystemTests.test_concept_approaches_use_complete_square_frames -v
```

Expected: FAIL because the current items use only `border-top` and have no full padding.

- [ ] **Step 3: Implement the complete frames**

Replace the existing article rule in `assets/css/ja-home.css` with:

```css
.ja-concept__approaches article { min-width: 0; padding: var(--acs-space-5); border: var(--acs-rule); }
```

Do not change `.ja-concept__approaches`, its mobile rule, or the HTML.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_design_system.DesignSystemTests.test_concept_approaches_use_complete_square_frames -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

Expected: focused test and full suite pass.

- [ ] **Step 5: Verify the local preview**

Open `http://localhost:8006/ja/?concept-frames=1#concept` and confirm the three items retain their current positions while each has a complete square border, white background, and no shadow. Confirm no horizontal overflow at `390px`.

- [ ] **Step 6: Commit**

```bash
git add assets/css/ja-home.css tests/test_design_system.py docs/superpowers/plans/2026-08-09-ja-concept-frames.md
git commit -m "style: frame Japanese concept approaches"
```
