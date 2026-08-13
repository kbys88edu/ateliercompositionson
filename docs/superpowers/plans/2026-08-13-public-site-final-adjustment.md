# Public Site Final Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing Japanese and French public site into a restrained, credible composer-led atelier with documentary split heroes, clear CTA hierarchy, consistent lesson details, valid links, and reliable analytics.

**Architecture:** Keep the static HTML routes and existing section content. Add focused shared refinement CSS and static contract tests, then make targeted markup/copy changes to the two home pages, booking page, and lesson details. Preserve the dedicated French resource tracker while correcting the global canonical event layer.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, Python `unittest`, local HTTP server, Playwright browser inspection, `cwebp`, macOS `sips` AVIF conversion.

## Global Constraints

- Preserve existing public URLs, useful content, SEO metadata, and GA4 history.
- Keep the white/black editorial visual language and avoid a generic online-school presentation.
- Use `images/sachie_studio.jpg` as the temporary documentary hero source.
- Japanese hero copy and CTA labels must exactly match the approved design spec.
- French hero copy and CTA labels must exactly match the approved design spec.
- French lesson communication uses `Langue : français` only.
- Strong consultation buttons on each home page are limited to hero and final consultation sections.
- Do not invent work years, media, credentials, or languages.
- Keep the 19-euro product active, but do not fabricate a product-preview image before real source materials are supplied.
- Maintain the existing French `data-resource-track` listener boundary to prevent duplicate resource events.
- Mobile body copy is at least 16 px and interactive controls have visible keyboard focus.

---

### Task 1: Add Final Public-Site Contract Tests

**Files:**
- Create: `tests/test_public_site_final.py`
- Modify: `tests/test_ja_homepage.py`
- Modify: `tests/test_design_system.py`

**Interfaces:**
- Consumes: `tests.site_test_utils.load_page()` and `repo_path()`.
- Produces: static contracts for hero markup, copy, CTA count, language labels, work titles, valid anchors, tracking events, and detail-page booking routes.

- [ ] **Step 1: Write failing hero and content tests**

Add assertions for one `h1`, approved Japanese/French copy, `picture` hero markup, `fetchpriority="high"`, meaningful localized alt text, and the three Japanese production-stage labels.

- [ ] **Step 2: Write failing consistency tests**

Assert `Digi Ugi` and `i.p.s.e.i.t.y.` replace generic labels, French pages contain no English/Japanese language-offer claims, home-page strong CTAs follow the two-location hierarchy, and detail-page consultation links point to `booking.html`.

- [ ] **Step 3: Write failing anchor and analytics tests**

Resolve root-relative and document-relative HTML targets against the repository root, validate fragments, and assert the required GA4 event strings plus canonical `email_contact_click` behavior.

- [ ] **Step 4: Run the focused tests and confirm failure**

Run: `python3 -m unittest tests.test_public_site_final tests.test_ja_homepage tests.test_design_system -v`

Expected: failures reference the current kinetic heroes, old copy, obsolete anchors, generic work titles, and old event names.

- [ ] **Step 5: Commit the failing contracts**

```bash
git add tests/test_public_site_final.py tests/test_ja_homepage.py tests/test_design_system.py
git commit -m "test: define final public site contracts"
```

### Task 2: Prepare Documentary Hero Delivery

**Files:**
- Create: `images/hero-atelier-documentary.webp`
- Create: `images/hero-atelier-documentary-mobile.webp`
- Create: `images/hero-atelier-documentary.avif`
- Create: `images/hero-atelier-documentary-mobile.avif`
- Create: `assets/css/public-site-final.css`

**Interfaces:**
- Consumes: `images/sachie_studio.jpg` at 2080×1170.
- Produces: desktop/mobile optimized hero sources and shared `.atelier-split-hero` responsive/focus rules used by both home pages.

- [ ] **Step 1: Create desktop WebP and AVIF derivatives**

Use lossless-or-high-quality conversion from the authentic source while keeping the 16:9 composition and full studio context.

- [ ] **Step 2: Create mobile WebP and AVIF crops**

Create a 4:5 crop that retains Sachie Kobayashi, hands, score/work surface, and primary studio equipment.

- [ ] **Step 3: Add shared split-hero CSS**

Define the 54/46 desktop grid, mobile copy/action/image sequence, typography, two-action hierarchy, documentary figure, trust strip, `:focus-visible`, reduced-motion behavior, and no-overflow constraints.

- [ ] **Step 4: Verify image formats and dimensions**

Run: `file images/hero-atelier-documentary*`

Expected: two valid WebP and two valid AVIF files with explicit desktop/mobile dimensions.

- [ ] **Step 5: Commit hero delivery assets**

```bash
git add images/hero-atelier-documentary* assets/css/public-site-final.css
git commit -m "feat: add documentary hero delivery"
```

### Task 3: Refine the Japanese Home Page

**Files:**
- Modify: `ja/index.html`
- Modify: `assets/css/ja-home.css`

**Interfaces:**
- Consumes: `.atelier-split-hero` shared CSS and documentary hero sources from Task 2.
- Produces: approved Japanese hero, production-stage audience section, role-led testimonials, reduced CTA hierarchy, and verified work title.

- [ ] **Step 1: Link shared CSS and preload the hero source**

Add `public-site-final.css`, a responsive image preload, and a `picture` with AVIF/WebP/JPEG fallback, intrinsic dimensions, `fetchpriority="high"`, and the approved Japanese alt text.

- [ ] **Step 2: Replace the kinetic hero markup**

Use H1 `音から考え、作品へ進む。`, the approved body, primary `制作について相談する`, and secondary `進め方と料金を見る`. Remove price and beginner/professional wording from the hero.

- [ ] **Step 3: Rework the audience and trust flow**

Change the heading to `制作の段階に応じて。`, apply the three approved production-stage labels, retain the four concise trust facts, and keep existing lesson links.

- [ ] **Step 4: Reduce card and CTA repetition**

Convert intermediate pricing consultation action to a text link, keep only hero/final strong consultation buttons, and vary retained groups between rule lists, editorial rows, and at most two three-column grids.

- [ ] **Step 5: Correct testimonial and work labels**

Use role-led testimonial labels with age/gender as secondary text and replace the generic YouTube title with `Digi Ugi` in heading and iframe title.

- [ ] **Step 6: Run Japanese home tests**

Run: `python3 -m unittest tests.test_ja_homepage tests.test_design_system tests.test_public_site_final.JapaneseFinalTests -v`

Expected: PASS.

- [ ] **Step 7: Commit Japanese home refinement**

```bash
git add ja/index.html assets/css/ja-home.css
git commit -m "feat: refine Japanese atelier homepage"
```

### Task 4: Refine the French Home and Booking Pages

**Files:**
- Modify: `fr/index.html`
- Modify: `fr/booking.html`

**Interfaces:**
- Consumes: shared split-hero CSS and documentary hero sources.
- Produces: approved French hero, consolidated artist section, French-only language declarations, valid booking navigation, and two-location consultation hierarchy.

- [ ] **Step 1: Replace the French kinetic hero**

Add the shared CSS and responsive preload, then use the approved H1/body/CTAs and localized documentary-image alt text. Move the 19-euro resource link out of the hero.

- [ ] **Step 2: Consolidate atelier and artist sections**

Merge the factual material into one `#instructor` section with `Compositrice / Artiste sonore`, an 80–120 word biography, the concrete working-material statement, and artist-site link. Remove `Écoute / Clarté / Autonomie` cards.

- [ ] **Step 3: Reduce strong consultation repetition**

Keep strong consultation buttons in hero and the final `#booking` section only. Convert process, resource-follow-up, and format consultation actions to text links. Keep the Gumroad purchase action as a distinct product action.

- [ ] **Step 4: Normalize language and work labels**

Use `Langue : français` in visible and hidden policy content and booking copy. Replace generic work titles with `Digi Ugi` and `i.p.s.e.i.t.y.`.

- [ ] **Step 5: Fix booking navigation**

Replace `#travail` and `#formats` with `#entrypoints` and `#format`, use `email_contact_click`, and retain Calendly behavior.

- [ ] **Step 6: Run French page tests**

Run: `python3 -m unittest tests.test_public_site_final.FrenchFinalTests -v`

Expected: PASS.

- [ ] **Step 7: Commit French home refinement**

```bash
git add fr/index.html fr/booking.html
git commit -m "feat: refine French atelier homepage"
```

### Task 5: Normalize Lesson-Detail Pages

**Files:**
- Create: `assets/css/lesson-detail-final.css`
- Modify: `ja/composition-lesson.html`
- Modify: `ja/dtm-lesson.html`
- Modify: `ja/music-theory-lesson_with_pdf-link.html`
- Modify: `ja/solfege.html`
- Modify: `ja/electroacoustic-lesson.html`
- Modify: `ja/sound-technology-ai-lesson.html`
- Modify: `fr/composition-lesson.html`
- Modify: `fr/harmony-analysis-lesson.html`
- Modify: `fr/mao-lesson.html`
- Modify: `fr/electroacoustic-lesson.html`

**Interfaces:**
- Consumes: existing lesson content and stable home anchors `#study`, `#entrypoints`, and `#format`.
- Produces: consistent detail navigation, direct booking routes, visible focus states, 16 px mobile text, and language/subject-appropriate hero treatment.

- [ ] **Step 1: Add shared detail refinements**

Create restrained header, button, focus, responsive type, media, and final CTA rules that can safely override existing page-local styles.

- [ ] **Step 2: Normalize Japanese lesson routes and CTA wording**

Point consultation actions to `/ja/booking.html` or `booking.html`, replace old `#modules`/`#lessons` links with `/ja/#study`, preserve subject content, and link the shared stylesheet.

- [ ] **Step 3: Correct Japanese work titles**

Replace generic SgYG and XfBI labels with `Digi Ugi` and `i.p.s.e.i.t.y.` wherever embedded. Do not add unverified metadata.

- [ ] **Step 4: Normalize French lesson navigation**

Use `index.html#entrypoints` for courses and `index.html#format` for format/tarif links, link the shared stylesheet, and keep the booking destination direct.

- [ ] **Step 5: Demote generated lesson heroes**

Retain relevant Japanese typography headers. Replace primary use of `music-theory-hero.jpeg` and `computer-music-synth-composition.jpeg` with existing real score, DAW, Max/MSP, or studio material and meaningful alt text.

- [ ] **Step 6: Run lesson-detail tests**

Run: `python3 -m unittest tests.test_public_site_final.LessonDetailFinalTests -v`

Expected: PASS.

- [ ] **Step 7: Commit detail-page consistency**

```bash
git add assets/css/lesson-detail-final.css ja/*lesson*.html ja/solfege.html fr/*lesson.html
git commit -m "feat: align lesson detail pages"
```

### Task 6: Correct Global Tracking and Root Semantics

**Files:**
- Modify: `assets/js/acs-tracking.js`
- Modify: `index.html`
- Modify: `tests/test_tracking.py`

**Interfaces:**
- Consumes: existing `data-track` and `data-resource-track` attributes.
- Produces: one canonical `email_contact_click` event per email click, preserved consultation/outbound behavior, and valid root HTML.

- [ ] **Step 1: Add failing canonical email-event tests**

Assert that a mailto click emits `email_contact_click` once with a `cta_location` parameter and does not emit legacy `contact_click` or `click_email_contact` for the same click.

- [ ] **Step 2: Implement canonical email tracking**

Separate mailto detection from generic contact detection, add location extraction from `data-cta-location`, preserve historical explicit non-email events, and ensure unique event names.

- [ ] **Step 3: Remove root document artifact**

Delete the trailing Markdown fence and set valid language/semantic metadata without changing the language-choice experience.

- [ ] **Step 4: Run tracking and root tests**

Run: `python3 -m unittest tests.test_tracking tests.test_public_site_final.AnalyticsAndRootTests -v`

Expected: PASS.

- [ ] **Step 5: Commit analytics and root corrections**

```bash
git add assets/js/acs-tracking.js index.html tests/test_tracking.py
git commit -m "fix: normalize public site tracking and root markup"
```

### Task 7: Validate the Complete Static Site

**Files:**
- Modify: `tests/test_internal_references.py`
- Modify: any scoped HTML/CSS/JS file that fails validation

**Interfaces:**
- Consumes: all changes from Tasks 1–6.
- Produces: passing repository tests and a clean scoped internal-link audit.

- [ ] **Step 1: Extend internal reference validation**

Validate all scoped Japanese/French top, booking, and lesson pages, including root-relative routes and fragments.

- [ ] **Step 2: Run the complete test suite**

Run: `python3 -m unittest discover -s tests -v`

Expected: all tests PASS.

- [ ] **Step 3: Run local link and content scans**

Confirm no scoped `href="#"`, obsolete French anchors, generic work labels, old language claims, or duplicate IDs remain.

- [ ] **Step 4: Check repository diff and unrelated files**

Run: `git status --short` and `git diff --check`.

Expected: only intended tracked changes plus pre-existing unrelated untracked files.

- [ ] **Step 5: Commit validation fixes**

```bash
git add tests/test_internal_references.py
git commit -m "test: validate final public site links"
```

### Task 8: Browser QA, Lighthouse, and Final Reports

**Files:**
- Create: `screenshots/final/root-desktop.png`
- Create: `screenshots/final/root-mobile.png`
- Create: `screenshots/final/ja-desktop.png`
- Create: `screenshots/final/ja-mobile.png`
- Create: `screenshots/final/fr-desktop.png`
- Create: `screenshots/final/fr-mobile.png`
- Create: `screenshots/final/ja-composition-desktop.png`
- Create: `screenshots/final/ja-composition-mobile.png`
- Create: `screenshots/final/fr-composition-desktop.png`
- Create: `screenshots/final/fr-composition-mobile.png`
- Create: `docs/final-brand-review.md`
- Create: `docs/final-link-audit.md`
- Create: `docs/final-analytics-audit.md`

**Interfaces:**
- Consumes: completed local static site.
- Produces: visual release evidence, before/after metrics, link report, analytics report, and documented asset follow-ups.

- [ ] **Step 1: Start or reuse the local preview server**

Serve the worktree and confirm `/`, `/ja/`, `/fr/`, and representative lesson details return HTTP 200.

- [ ] **Step 2: Inspect desktop and mobile layouts**

Check 1425 px desktop and 375/390 px mobile viewports for first-view hierarchy, hero crop, 16 px text, CTA visibility, focus states, image loading, and horizontal overflow.

- [ ] **Step 3: Capture final screenshots**

Save the ten required full-page screenshots under `screenshots/final/`.

- [ ] **Step 4: Run Lighthouse**

Record Performance, Accessibility, and SEO results for Japanese and French home pages. If Lighthouse cannot run locally, record the exact environmental limitation and complete manual checks.

- [ ] **Step 5: Write final reports**

Document before/after page height, section/CTA counts, image inventory and real/generated ratio, mobile first viewport, French language consistency, link status, event status, changed files, change reasons, unresolved material-dependent work, and hero replacement paths.

- [ ] **Step 6: Run final verification**

Run: `python3 -m unittest discover -s tests -v && git diff --check && git status --short`

Expected: tests pass, no whitespace errors, and no accidental files are staged.

- [ ] **Step 7: Commit release evidence**

```bash
git add screenshots/final docs/final-brand-review.md docs/final-link-audit.md docs/final-analytics-audit.md
git commit -m "docs: add final public site release audit"
```
