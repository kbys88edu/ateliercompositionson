# Performance Hero Photo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace both home-page hero photographs with readable responsive crops of the supplied performance photo.

**Architecture:** Keep the existing shared split-hero component. Generate optimized immutable image files, update both `picture` elements and preload links, then tune only the shared image positioning.

**Tech Stack:** Static HTML/CSS, ffmpeg, WebP, AVIF, Python unittest, in-app browser.

## Global Constraints

- Preserve the Japanese and French copy, CTA hierarchy, URLs, and GA4 attributes.
- Do not alter the supplied photograph beyond cropping, resizing, and format compression.
- Keep mobile order as copy, CTAs, photo.

### Task 1: Responsive hero asset contract

**Files:**
- Modify: `tests/test_public_site_final.py`
- Create: `images/hero-atelier-performance.png`
- Create: `images/hero-atelier-performance.webp`
- Create: `images/hero-atelier-performance.avif`
- Create: `images/hero-atelier-performance-mobile.webp`
- Create: `images/hero-atelier-performance-mobile.avif`

- [ ] Add a failing test for the new asset paths and accurate alt text.
- [ ] Run the focused test and confirm it fails on the old documentary paths.
- [ ] Generate the square desktop crop and 4:5 mobile crop in AVIF/WebP/PNG.

### Task 2: Home-page integration

**Files:**
- Modify: `ja/index.html`
- Modify: `fr/index.html`
- Modify: `assets/css/public-site-final.css`

- [ ] Update preload links, responsive sources, fallback dimensions, and localized alt text.
- [ ] Tune shared object positioning without changing the split layout.
- [ ] Run focused and full tests.
- [ ] Capture Japanese/French desktop and mobile previews and check overflow.
