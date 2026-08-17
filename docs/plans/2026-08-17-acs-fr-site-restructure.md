# Atelier Composition Son - French Site Restructure Plan

> **Implementation note:** Follow red-green-refactor for behavior and contract
> changes. Keep all production changes French-scoped.

**Date:** 2026-08-17  
**Repository:** `kbys88edu/ateliercompositionson`  
**Branch:** `codex/fr-site-restructure`  
**Baseline commit:** `4c393d0`

## 1. Repository Audit

### Framework and build

- Static HTML, CSS, and vanilla JavaScript.
- No `package.json`, bundler, framework runtime, or production build command.
- GitHub Pages-style deployment (`.nojekyll`, `CNAME`, root
  `sitemap.xml`, root `robots.txt`).
- No dependency should be added to the repository.

### French routing and content storage

| Route | Current purpose | Current primary CTA |
| --- | --- | --- |
| `/fr/` | French landing page, resources, works, rate, FAQ | Free 30-minute exchange |
| `/fr/composition-lesson.html` | Composition lesson detail | Free 30-minute exchange |
| `/fr/harmony-analysis-lesson.html` | Harmony and analysis detail | Free 30-minute exchange |
| `/fr/electroacoustic-lesson.html` | Electroacoustic practice detail | Free 30-minute exchange |
| `/fr/mao-lesson.html` | MAO lesson detail | Free 30-minute exchange |
| `/fr/booking.html` | Calendly free 30-minute exchange | Calendly inline booking |
| `/fr/confidentialite/` | Missing; required by the brief | To be added |

French copy is stored directly in the six HTML files. There is no localization
data layer.

### Shared assets and components

- Shared header: `assets/js/acs-header.js`
- Shared menu behavior: `assets/js/acs-ui.js`
- Shared tracking: `assets/js/acs-tracking.js`
- Shared design tokens/header: `assets/css/acs-core.css`
- Shared public compatibility styles: `assets/css/public-site-final.css`
- Shared lesson compatibility styles: `assets/css/lesson-detail-final.css`

The shared header already branches by document language. Only its `fr`
configuration will change. New French-only CSS and JavaScript avoid changing
Japanese layouts.

### Current offers, prices, and destinations

| Offer | Current display | Destination | Verified facts |
| --- | --- | --- | --- |
| Kit autonome | 19€ | `https://sonata14.gumroad.com/l/gvbzop` | Published French digital product, current public price 19€ |
| Mini retour | 29€ | `mailto:info@sachiekobayashi.com` | One short sound sketch, concise written response, one response, no live session |
| Séance individuelle | 70€ / 60 min | `fr/booking.html` | Online individual session; current displayed rate on all detail pages |
| Premier contact | Free / 30 min | Calendly `acs_trial/trial_acs` | Existing auxiliary pre-booking exchange |

No new price or paid offer will be introduced.

### Verified 19€ product content

Verified from the current Gumroad product page:

- French downloadable kit, `Commencer une pièce à partir d'un son`
- guide d'introduction et d'utilisation
- main workbook
- appendix on analysis, orchestration, and contrapuntal extensions
- introduction video plus five accompaniment videos, about 13 minutes total
- five WAV examples
- three WAV practice sounds
- final task: a 60-second sound sketch
- intended for composers, musicians, students, and sound artists

The existing homepage image (`images/documentation-1.jpg`) is unrelated to the
product. Actual product cover and interior page images are available from the
published product and will be stored locally as optimized WebP assets.

### Forms and external services

- Calendly: `https://calendly.com/acs_trial/trial_acs`
- Existing contact processor already used by the site:
  `https://formspree.io/f/mbdbpqrj`
- Current French booking page has no HTML contact form and loads Calendly
  immediately.
- Compact French project/contact form will use only the approved fields:
  name, email, preferred language, main area, timezone/availability, and short
  message. A project link remains optional.

### Analytics

- Existing GA4 ID: `G-Y1792EBWTT`
- Current French tracking is split between `acs-tracking.js` and an inline
  homepage resource handler.
- Current event names differ from the requested vocabulary.
- The French implementation will use one French-only delegated tracker and
  remove French inline click handlers. The existing GA4 ID remains unchanged.

### SEO

- Homepage has canonical and `fr`, `ja`, and `x-default` hreflang.
- Detail and booking pages have self-canonicals but incomplete hreflang and
  structured data.
- Sitemap currently includes only `/fr/`, not the French detail or privacy
  routes.
- Robots allows all and points to the sitemap.
- Structured data is currently absent from the French pages.

### Images and media

- Verified real hero candidates:
  `hero-atelier-performance.webp` and `hero-atelier-documentary.webp`.
- Current homepage hero is the composite `hero-collage2.png`.
- Three work embeds are created as iframes during initial page load.
- Below-fold images already have dimensions but not all use modern formats.

### Tests and performance baseline

- Test command: `python3 -m unittest discover -s tests -v`
- Baseline: 96 tests passed.
- No build, lint, or typecheck commands exist.
- Baseline viewport checks at 390, 768, and 1440 px:
  one H1, no horizontal overflow, three eager iframe elements.
- Baseline Lighthouse (local mobile):
  - Performance: 88
  - Accessibility: 98
  - Best Practices: 96
  - SEO: 100
  - LCP: 3.9 s
  - CLS: 0
  - transfer: about 3,443 KiB
- Baseline files:
  `screenshots/fr-restructure/before/`

## 2. Target Page Purposes

| Route | Target purpose |
| --- | --- |
| `/fr/` | Establish the composition/sound-creation positioning, explain concrete outcomes, compare 19/29/70 offers, show method and evidence, then offer first contact |
| `composition-lesson.html` | Support development, revision, form, writing, orchestration, portfolios, and composition projects |
| `harmony-analysis-lesson.html` | Connect harmony, analysis, voice leading, and writing to a real piece or study need |
| `electroacoustic-lesson.html` | Support timbre, recording, transformation, montage, space, Max/MSP, and electroacoustic projects |
| `mao-lesson.html` | SEO entry for MAO while centering compositional decisions in the DAW |
| `booking.html` | Explain the 70€ session path, load Calendly on demand, and provide a short optional pre-booking question form |
| `confidentialite/` | Provide the French data-processing notice and identify legal points needing confirmation |

## 3. Homepage Implementation

### Hero

- H1: `Accompagnement individuel en composition et création sonore`
- Lead: work from a score, mock-up, recording, or DAW session.
- Primary CTA: `Faire le point sur mon projet` -> booking page.
- Secondary CTA: `Voir les formats d'accompagnement` -> `#formats`.
- Small scope line keeps MAO as a supporting term.
- Replace the collage with the verified performance photograph, eager loaded
  with WebP/AVIF responsive sources and intrinsic dimensions.

### Trois résultats concrets

Present outcomes before disciplines:

- Développer un matériau en forme
- Résoudre un blocage précis
- Finaliser un projet

### Formats d'accompagnement

- Kit autonome - 19€
- Mini retour - 29€
- Séance individuelle - 70€ / 60 min

Use a comparison hierarchy rather than three identical marketing cards. Include
verified scope, delivery, language, and boundaries. The 19€ preview uses actual
product pages. Separate sample and purchase actions.

### Méthode de travail

Explain a concrete sequence:

1. écouter et situer le matériau
2. identifier the compositional question
3. test a small number of precise changes
4. leave with a documented next step

For AI and technologies, include:
`Analyse -> contraintes -> génération -> sélection -> réécriture`.
Possible tools live in a native `details` disclosure.

### Experience, works, and practice

Keep education, IRCAM, teaching, works, and project evidence. Add only factual
one-line connections between verified practice and lesson areas. Replace eager
third-party iframes with keyboard-accessible click-to-load media placeholders.

### Resources and first contact

Keep the free PDF and paid kit distinct. Show the free consultation only once as
an auxiliary entry:
`Une question avant de réserver ?`

## 4. Detail Pages

- Retain all existing URLs.
- Add French-only page classes and styles.
- Keep one H1 per page and compact split heroes.
- Use specific, natural French tied to concrete submitted material.
- Add unique metadata, self-canonical, relevant hreflang, breadcrumb JSON-LD,
  and Course/Service JSON-LD.
- Use one primary action per section.
- Ensure every 70€ mention is `70€ / 60 min`.

### MAO

- H1: `MAO créative au service de la composition`
- Lead: use the DAW to organize, transform, and develop musical ideas.
- Center session organization, material choice, arrangement, form, timbre,
  transformation, montage, automation, and critical listening.
- Put Ableton, Logic, Reaper, and Max/MSP in a supporting environment list.

### Technologies and AI

No dedicated French AI route exists, so no new URL will be invented.
The requested methodology will be integrated into the homepage method and the
electroacoustic/MAO pages where it is relevant.

## 5. Booking, Contact, and Privacy

- Keep Calendly but load it after an explicit click.
- Track the first booking interaction and scheduled event once.
- Add a compact Formspree form with labels, required markers, French validation,
  success message, and specific error summary.
- Form fields: Nom, Adresse e-mail, Langue souhaitée, Domaine principal,
  Fuseau horaire ou disponibilités, Message court, optional project link.
- Link the short privacy notice to `/fr/confidentialite/`.
- Privacy page includes controller, purpose, collected data, required/optional
  status, recipients, rights, contact, and possible non-EU transfer.
- Exact retention duration and provider transfer safeguards are marked for legal
  confirmation.

## 6. French SEO

- Unique title and description for every French page.
- Homepage title:
  `Cours de composition en ligne et création sonore | Atelier Composition Son`
- Homepage description:
  `Accompagnement individuel en composition, création sonore, électroacoustique, Max/MSP et MAO créative, à partir de vos partitions, sons et sessions DAW.`
- One H1 per page.
- Self-canonical on every page.
- Relevant `fr`, `ja`, and `x-default` hreflang pairs without inventing
  non-existent counterparts.
- Organization, Person, Service/Course, and BreadcrumbList JSON-LD using only
  verified facts.
- Add all French routes to the sitemap.
- Keep robots unchanged unless validation shows a problem.

## 7. French GA4 Contract

Create `assets/js/fr-tracking.js`, loaded only under `/fr/`.

Every requested event contains:

- `locale: fr`
- `page_type`
- `offer`
- `cta_position`
- `traffic_source`

Use one capture-phase click handler, a per-element click guard, and one
IntersectionObserver impression per offer. External Gumroad navigation waits for
the callback or a short timeout. Calendly messages and contact-form success
events have independent once-only guards.

## 8. Test-first Tasks

1. Add `tests/test_fr_restructure.py` contracts for routes, hierarchy, exact
   prices, offer destinations, product preview assets, one H1, canonical,
   hreflang, JSON-LD, sitemap, form fields, privacy link, lazy media, and Japanese
   hash regression.
2. Add Node harness tests for French GA4 event parameters and deduplication.
3. Run the new tests and confirm they fail for the missing implementation.
4. Implement the minimum French-only assets and markup to pass.
5. Run the full 96-test baseline plus new tests after each group.

## 9. Validation

- Static internal link and fragment checker across all French pages.
- HTTP checks for Gumroad and Calendly.
- Keyboard checks for all CTAs, native details, menu, media loaders, and form.
- Viewports: 360, 390, 768, 1024, 1440 px.
- No horizontal overflow.
- Images have width/height; hero is not lazy; below-fold images are lazy.
- Initial French homepage contains no YouTube/SoundCloud iframe.
- Screenshots before/after at 390, 768, and 1440 px.
- Lighthouse before/after, same local server and mobile profile.
- Fresh full test run before commit.
- Compare Japanese homepage and a Japanese detail page screenshots and hashes
  against the baseline branch.

## 10. Japanese Impact Prevention

- Do not edit files under `/ja/`.
- Do not change shared CSS.
- New CSS and behavior are French-only.
- Any required shared-header change modifies only `configurations.fr`.
- Record baseline SHA-256 hashes of all `ja/**/*.html`.
- Assert hashes are unchanged after implementation.
- Capture Japanese comparison screenshots from baseline and final state.

## 11. Rollback

- All work remains on `codex/fr-site-restructure` until verification.
- Roll back by reverting the feature commits; no database or migration exists.
- New assets are isolated under `images/fr/`, new scripts/styles are
  French-only, and the privacy route is additive.
- Restoring the six original French HTML files plus `sitemap.xml` and the
  `fr` header configuration returns the previous behavior.

## 12. Known Legal and Product Boundaries

- The exact personal-data retention period is not documented and requires
  confirmation.
- The exact legal mechanism for Formspree, Calendly, and GA4 transfers outside
  the EU requires qualified review.
- The 29€ mini return has no external checkout URL in the repository. The
  existing contact workflow will be made explicit; no payment URL will be
  invented.
- A live GA4 DebugView session is not available locally. Event dispatch and
  deduplication will be tested through the real JavaScript contract.

