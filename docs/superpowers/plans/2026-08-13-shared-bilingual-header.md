# Shared Bilingual Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render one consistent header across every Japanese and French HTML page and remove the Japanese home hero image's top and bottom blank space.

**Architecture:** A new dependency-free `assets/js/acs-header.js` owns Japanese and French header configuration and renders into one mount per page before the existing menu script initializes. Static contract tests verify every language page uses the mount and script order, while CSS geometry tests protect the full-height hero media behavior.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Python `unittest`, Node.js behavior harness.

## Global Constraints

- Keep deployment compatible with plain GitHub Pages.
- Add no framework, package manager, or build step.
- Keep Japanese and French navigation labels and destinations independent.
- Preserve the existing logo, responsive menu hooks, consultation tracking, and hero column ratio.
- Do not change page content, section order, forms, prices, or booking flows.

---

### Task 1: Shared Header Contract

**Files:**
- Modify: `tests/test_design_system.py`

**Interfaces:**
- Consumes: all `ja/*.html` and `fr/*.html` files.
- Produces: a contract requiring one `[data-shared-header]` mount, `acs-header.js` before `acs-ui.js`, and language-specific configuration.

- [ ] **Step 1: Replace duplicated-markup assertions with mount and script-order assertions**
- [ ] **Step 2: Add a Node harness that renders Japanese and French configurations and checks labels, destinations, ARIA hooks, and tracking attributes**
- [ ] **Step 3: Run `python3 -m unittest tests.test_design_system -v` and confirm failure because the shared renderer does not exist**

### Task 2: Shared Header Renderer And Page Migration

**Files:**
- Create: `assets/js/acs-header.js`
- Modify: `assets/js/acs-ui.js`
- Modify: every `ja/*.html` and `fr/*.html`

**Interfaces:**
- Consumes: `<header class="acs-site-header" data-shared-header></header>` and `document.documentElement.lang`.
- Produces: generated markup using `data-menu`, `data-menu-toggle`, `data-menu-panel`, and `data-menu-close` for `acs-ui.js`.

- [ ] **Step 1: Implement Japanese and French navigation maps and accessible generated markup**
- [ ] **Step 2: Replace duplicated public header markup with one mount in all language pages**
- [ ] **Step 3: Load `acs-header.js` immediately before `acs-ui.js` on all language pages**
- [ ] **Step 4: Remove or suppress legacy public navigation without removing page-specific tool headers**
- [ ] **Step 5: Run `python3 -m unittest tests.test_design_system -v` and confirm the shared-header tests pass**

### Task 3: Full-Height Hero Media

**Files:**
- Modify: `tests/test_design_system.py`
- Modify: `assets/css/public-site-final.css`

**Interfaces:**
- Consumes: `.atelier-split-hero__media` and `.atelier-split-hero__image`.
- Produces: a stretched, clipped media column with a cover-fitted image at desktop and mobile sizes.

- [ ] **Step 1: Add failing CSS contract assertions for `height: 100%`, `align-self: stretch`, `min-height: 0`, and `overflow: hidden`**
- [ ] **Step 2: Run the focused test and confirm it fails on the missing geometry declarations**
- [ ] **Step 3: Add the minimal media and image geometry rules while retaining the 64/36 and 60/40 grids**
- [ ] **Step 4: Run the focused test and confirm it passes**

### Task 4: Regression And Browser Verification

**Files:**
- Verify: all changed HTML, CSS, JavaScript, and tests.

**Interfaces:**
- Consumes: the complete migrated static site.
- Produces: verified desktop and mobile behavior with no duplicate visible header or hero blank bands.

- [ ] **Step 1: Run `python3 -m unittest discover -s tests -v`**
- [ ] **Step 2: Run `git diff --check` and static searches for missing mounts, missing scripts, and duplicate public headers**
- [ ] **Step 3: Open Japanese and French home and secondary pages at desktop and mobile viewport sizes**
- [ ] **Step 4: Verify hamburger interaction, destinations, overflow, and Japanese hero image coverage**
- [ ] **Step 5: Review the final diff and commit only files belonging to this feature**
