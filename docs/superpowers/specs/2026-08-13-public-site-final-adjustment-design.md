# Atelier Composition Son Public Site Final Adjustment Design

Date: 2026-08-13  
Status: Approved direction

## Objective

Refine the existing public site so it reads as the individual atelier of a working composer and sound artist. Preserve the monochrome palette, strong typography, generous whitespace, URLs, SEO, useful information, and analytics. Reduce generic school and marketing signals without rebuilding the site.

## Scope

- Root language chooser: `/`
- Japanese home: `/ja/`
- French home: `/fr/`
- Japanese lesson-detail pages
- French lesson-detail pages
- French booking page and language labels connected to it
- Shared tracking, responsive styling, and audit artifacts required for release

The 19-euro product remains published with its existing link and copy. Replacing its current historical image with a real product montage is deferred until the source PDF pages, waveform, and video-frame materials are supplied.

## Architecture

The revision will use targeted HTML changes and a small shared presentation layer rather than converting pages to a new template system.

- Keep existing document routes and section IDs that are externally useful.
- Add shared final-refinement CSS where it removes repeated responsive and accessibility rules.
- Keep page-specific inline styles where they are already structurally tied to a page.
- Use the existing `assets/js/acs-tracking.js` as the single global click-tracking layer.
- Preserve the dedicated French resource tracker for `data-resource-track` links.

This approach limits regressions and leaves the current static-site deployment model intact.

## Home Heroes

### Desktop

Both Japanese and French home pages use a two-column hero:

- Copy: approximately 54%
- Documentary image: approximately 46%
- Copy and image never overlap.
- Hero width aligns with the existing wide site container.
- A quiet trust/detail strip sits directly below the hero.

### Mobile

The sequence is copy, CTA group, then image. The main message and action remain visible before the image without shrinking body text below 16 px.

### Image delivery

The initial implementation uses `images/sachie_studio.jpg` as the fallback and current source. Markup will be ready for:

- `images/hero-atelier-documentary.avif`
- `images/hero-atelier-documentary.webp`
- `images/hero-atelier-documentary-mobile.avif`
- `images/hero-atelier-documentary-mobile.webp`

Use `picture`, responsive sources, explicit `width` and `height`, `object-fit: cover`, and viewport-specific `object-position`. The hero is eagerly loaded and preloaded; later images are lazy-loaded. The image contains no embedded title text.

### Japanese copy

- H1: `音から考え、作品へ進む。`
- Body: `作曲・音楽理論・DTM・電子音響を、制作中の楽譜、音源、DAWセッション、まだ形になっていない問いから個別に扱います。`
- Primary: `制作について相談する`
- Secondary: `進め方と料金を見る`

Price and broad beginner/professional labels are removed from the hero.

### French copy

- H1: `Faire évoluer une idée, une esquisse ou une pratique sonore.`
- Body: `Atelier individuel de composition, MAO et pratiques sonores, à partir de vos partitions, maquettes, sessions DAW ou questions précises.`
- Primary: `Parler d’un projet`
- Secondary: `Voir le format et le tarif`

The 19-euro resource is not a hero-level action.

## Japanese Home Content

- Change the audience heading to `制作の段階に応じて。`.
- Use three production-stage labels:
  - `制作を始める`
  - `基礎と制作環境を整える`
  - `作品・提出物を深める`
- Retain existing lesson, background, process, instructor, concept, works, voices, pricing, FAQ, consultation, and free-tool information.
- Avoid more than two three-column card sections. Other groups use rule lists, asymmetrical two-column layouts, or editorial rows.
- Change testimonial primary labels to roles:
  - `作曲・理論を受講`
  - `DTM・制作相談を受講`
  - `受験・基礎理論を受講`
- Keep existing age/gender facts only as small secondary information.
- Replace the generic work label for `SgYGcZS1Mp4` with `Digi Ugi`.

## French Home Content

- Consolidate `#atelier` and `#instructor` into one artist/atelier section while retaining a stable `#instructor` target.
- Present:
  - Actual studio photograph
  - `Sachie Kobayashi`
  - `Compositrice / Artiste sonore`
  - A factual 80–120 word biography
  - The concrete working statement: `Le travail part de partitions, de maquettes, d’enregistrements ou de sessions DAW réellement en cours. Chaque séance se termine par une prochaine étape concrète.`
  - Artist-site link
- Remove the abstract `Écoute / Clarté / Autonomie` cards.
- Keep the resource section. Its product-preview image is explicitly provisional and must not be presented as a verified product montage.
- Replace generic work labels with `Digi Ugi` and `i.p.s.e.i.t.y.`.
- Use `Langue : français` consistently in format, booking, conditions, and related copy.

## CTA System

Strong buttons on each home page are limited to:

- Japanese hero: `制作について相談する`
- Japanese final section: `30分相談を予約する`
- French hero: `Parler d’un projet`
- French final section: `Réserver un premier échange`

Header navigation remains compact and is not styled as a competing oversized section CTA. Intermediate consultation references become text links. Product purchase remains a product action inside the resource card and does not visually compete with the atelier offer.

All lesson-detail primary consultation actions go directly to the relevant booking page. Secondary actions link back to valid home-page sections.

## Lesson-Detail Consistency

- Preserve lesson-specific content and existing URLs.
- Normalize header spacing, typography scale, CTA wording, button hierarchy, focus states, and final consultation treatment.
- Replace obsolete Japanese `#modules`/`#lessons` destinations with `#study`; use direct `booking.html` destinations for consultation.
- Replace obsolete French `#travail`, `#tarifs`, and `#formats` destinations with `#entrypoints` and `#format`.
- Keep `images/ja-composition-header.png` and `images/ja-dtm-header.png` only where their content matches the Japanese subject page.
- Demote generated collage heroes. Prefer existing real score, DAW, Max/MSP, studio, or working-material imagery.
- Do not invent works, dates, media, credentials, or supported languages.

## Root Page

Keep the root as a compact language chooser. Correct document semantics and remove the accidental trailing Markdown fence without expanding it into another landing page.

## Analytics

Preserve these required events:

- `hero_booking_click`
- `booking_section_view`
- `booking_page_click`
- `pricing_section_view`
- `gumroad_product_click`
- `resource_free_pdf_click`
- `email_contact_click`

Rules:

- One click must not emit the same event twice.
- Resource links remain handled only by the French resource listener.
- Email actions use `email_contact_click` with `cta_location` to distinguish locations.
- Existing page-specific event names may remain where historical continuity is useful, provided they do not duplicate the same canonical event name.
- Internal UTM propagation remains intact.

## Accessibility and Performance

- Exactly one `h1` per page.
- Logical heading order.
- Visible `:focus-visible` treatment for links, buttons, summaries, and form controls.
- Mobile body copy at least 16 px.
- Minimum interactive target of 44 px where controls are presented as buttons.
- Meaningful alt text for content images; empty alt for decorative images.
- Hero image is not lazy-loaded; below-fold images are lazy-loaded.
- Explicit image dimensions prevent layout shift.
- Responsive media never causes horizontal overflow.
- Respect `prefers-reduced-motion` and remove the current hero animation from primary presentation.

## Verification

- Run existing automated tests.
- Add or update static tests for hero copy, picture markup, CTA counts, French-only language copy, valid internal anchors, verified work titles, and event names.
- Check local internal links and fragments across all scoped HTML.
- Inspect desktop and 375–390 px mobile layouts in the browser.
- Run Lighthouse for Performance, Accessibility, and SEO where the local environment supports it.
- Capture the required final screenshots in `screenshots/final/`.
- Produce:
  - `docs/final-brand-review.md`
  - `docs/final-link-audit.md`
  - `docs/final-analytics-audit.md`

## Release Boundaries

The implementation does not:

- Rebuild the site with a new framework.
- Remove useful lesson information.
- Change public routes.
- Invent biographical or work metadata.
- Create a synthetic product preview.
- Claim that temporary hero derivatives are real alternative crops when only the fallback photo exists.

The documented follow-up is replacement of the temporary hero source and the 19-euro product preview when final documentary and product assets are available.
