# Japanese Trust Strip Independent Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the four numbered Japanese homepage trust entries from a shared caption grid into four independently bordered frames.

**Architecture:** Keep the existing HTML and responsive column counts unchanged. Update only the scoped `.ja-trust__grid` and `.ja-trust__item` CSS, with repository tests enforcing desktop and mobile gaps plus complete item borders.

**Tech Stack:** Static CSS, Python `unittest`, local `http.server` preview.

## Global Constraints

- Preserve the existing `01` through `04` indexes, wording, order, typographic hierarchy, and responsive column counts.
- Give every `.ja-trust__item` a complete thin black border.
- Use a `16px` desktop gap and an `8px` mobile gap.
- Keep square corners, white backgrounds, and no shadows.
- Desktop remains four columns; mobile remains two columns.
- Do not alter the hero, header, CTA links, following sections, text content, or numbering.
- Do not introduce horizontal overflow at `390px` width.

---

### Task 1: Independent Trust Frames

**Files:**
- Modify: `tests/test_design_system.py`
- Modify: `assets/css/ja-home.css`

**Interfaces:**
- Consumes: Existing `.ja-trust__grid` and four `.ja-trust__item` elements.
- Produces: Independent bordered frames with `16px` desktop spacing and `8px` mobile spacing.

- [ ] **Step 1: Extend the failing CSS geometry test**

In `test_trust_strip_uses_caption_grid_geometry` in `tests/test_design_system.py`, add:

```python
self.assertIn("gap: 16px", desktop_grid.group(1))
self.assertIn("border: var(--acs-rule)", item.group(1))
self.assertNotIn("border-left", desktop_grid.group(1))
self.assertNotIn("border-right", item.group(1))
```

After resolving `mobile_grid`, add:

```python
self.assertIn("gap: 8px", mobile_grid.group(1))
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_design_system.DesignSystemTests.test_trust_strip_uses_caption_grid_geometry -v
```

Expected: FAIL because the current grid has no gap and items use adjoining border rules.

- [ ] **Step 3: Implement independent frames**

In `assets/css/ja-home.css`, update the desktop rules to:

```css
.ja-trust__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; padding-block: 16px; }
.ja-trust__item { min-width: 0; min-height: 168px; display: grid; align-content: space-between; gap: var(--acs-space-6); padding: var(--acs-space-4) var(--acs-space-5) var(--acs-space-5); border: var(--acs-rule); }
```

Inside `@media (max-width: 767px)`, update the mobile grid rule to:

```css
.ja-trust__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding-block: 8px; }
```

Keep the current mobile item height, padding, index styling, and copy styling unchanged.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_design_system.DesignSystemTests.test_trust_strip_uses_caption_grid_geometry -v
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

Expected: all tests pass.

- [ ] **Step 6: Verify desktop and mobile previews**

Open `http://localhost:8006/ja/?trust-frames=1#trust` and confirm:

- Desktop shows four separate equal-height frames with `16px` gaps.
- Mobile at `390px` shows a two-column grid with `8px` gaps.
- Every item has a complete border, square corners, white background, and no shadow.
- No horizontal overflow appears.

- [ ] **Step 7: Commit**

```bash
git add assets/css/ja-home.css tests/test_design_system.py docs/superpowers/plans/2026-08-09-ja-trust-independent-frames.md
git commit -m "style: separate Japanese trust frames"
```
