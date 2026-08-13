# Public Site Final Audit

Date: 2026-08-13  
Scope: `/`, `/ja/`, `/fr/`, and Japanese/French lesson-detail pages

## Method

- Captured full-page desktop and mobile screenshots from the local public build.
- Reviewed HTML, CSS, image assets, internal anchors, CTA placement, language labels, and GA4 hooks.
- Counted a "strong CTA" as a visually prominent filled or outlined action button in the main page content. Header and mobile-menu duplicates are discussed separately.
- Used the composition lesson as the representative detail page for before/after screenshots, then inspected the remaining lesson-detail files for shared inconsistencies.

## Before Screenshots

- `screenshots/before/root-desktop.png`
- `screenshots/before/root-mobile.png`
- `screenshots/before/ja-desktop.png`
- `screenshots/before/ja-mobile.png`
- `screenshots/before/fr-desktop.png`
- `screenshots/before/fr-mobile.png`
- `screenshots/before/ja-composition-desktop.png`
- `screenshots/before/ja-composition-mobile.png`
- `screenshots/before/fr-composition-desktop.png`
- `screenshots/before/fr-composition-mobile.png`

## Page Inventory

| Page | Desktop height | Mobile height | Sections | Strong CTAs | Main finding |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 1,018 px | 1,010 px | 0 | 0 | Language chooser is visually self-contained, but the document ends with an accidental Markdown code fence. |
| `/ja/` | 8,583 px | 12,036 px | 13 | 5 | The animated typographic hero dominates the first impression; consultation buttons repeat through the page. |
| `/fr/` | 8,527 px | 11,623 px | 11 | 7 | The animated hero, product CTA, and repeated booking CTAs compete with the individual atelier offer. |
| `/ja/composition-lesson.html` | 9,007 px | 12,918 px | 10 | Multiple | Detail pages use different navigation, CTA destinations, spacing, and media treatments. |
| `/fr/composition-lesson.html` | 4,276 px | 5,717 px | 6 | 3 | Structure is concise, but navigation points to removed section IDs and header media is not localized. |

## Findings

### Hero and first impression

- Japanese and French home pages currently lead with oversized animated typography and generated/graphic imagery. The presentation is visually assertive but does not immediately show the real atelier, working process, or artist.
- Core descriptions and CTAs sit below the visual, producing a long first viewport and a disconnect between identity and offer.
- The Japanese hero includes price and broad audience language. This pushes the page toward a general online-school tone.
- The French hero promotes both the first exchange and the 19-euro kit at the same level, weakening the priority of individual work.

### Text and section density

- Both home pages exceed 11,000 px on a 375 px mobile viewport.
- Japanese content is useful but uses several consecutive three-column/card patterns.
- French content repeats the artist/atelier introduction in `#atelier` and `#instructor`, followed by another three-part values grid.
- Hidden French `#conditions` and `#contact` sections retain outdated or duplicate language and CTA copy.

### CTA hierarchy

- The Japanese page has strong consultation actions in the hero, pricing, and final consultation section, in addition to header/mobile-menu actions.
- The French page has strong consultation actions in the hero, process, resource area, format, booking, and hidden contact area.
- Repeated button treatments make intermediate content feel like a conversion funnel rather than an artist's atelier.
- The intended final hierarchy is one strong hero action and one strong final action per home page; intermediate references become text links.

### Image consistency

- The current home-page heroes are generated or motion-graphic compositions, while instructor content uses actual photography. This makes the most prominent imagery less credible than the secondary imagery.
- `images/sachie_studio.jpg` is a suitable temporary documentary hero source: it shows Sachie Kobayashi in a working studio context.
- `images/documentation-1.jpg` is a historical architecture/exhibition image and does not represent the 19-euro workbook. It must not be presented as a product preview once real product material is available.
- `images/computer-music-synth-composition.jpeg` and `images/music-theory-hero.jpeg` read as generated collages. They should not remain primary lesson-page images.
- `images/ja-composition-header.png` and `images/ja-dtm-header.png` can remain on relevant Japanese detail pages because they function as typographic subject headers.

### Offer priority and pricing

- Japanese pricing is easy to locate and currently presents Foundation, Individual Session, Monthly Atelier, and Text Feedback clearly.
- French pricing is findable, but the 19-euro resource appears before the artist introduction and individual-session format. This can make the resource appear to be the primary offer.
- The redesign will keep the resource section and its existing product link but visually prioritize individual atelier work. The requested real product preview is deferred because source material is not yet available.

### Consultation visibility

- A 30-minute consultation is visible on both home pages, but repeated wording varies.
- Japanese consultation links generally reach `booking.html`, while several detail pages still point to the old `/#contact` flow.
- French booking is handled with Calendly. The booking page is functional but links to obsolete `#travail` and `#formats` anchors.

### Lesson-detail consistency

- Japanese detail pages were produced at different times and use several independent inline design systems.
- Common differences include English navigation labels, inconsistent CTA wording, old `#modules`/`#lessons` anchors, and mixed booking destinations.
- French detail pages share a compact structure, but all four reference obsolete `#travail` and `#tarifs` anchors.
- French detail-page hero images use Japanese/English typographic art or generated collages. These need subject-appropriate and language-neutral media treatment.

### Link and language audit

- Confirmed broken internal anchors:
  - French lesson details: `index.html#travail` and `index.html#tarifs`.
  - French booking: `index.html#travail` and `index.html#formats`.
  - Several Japanese detail pages: `/#modules`, `/#lessons`, and obsolete consultation anchors.
- `Demander un mini retour` is a real `mailto:` link, not `href="#"`; it can remain active.
- French language declarations conflict:
  - `Français, anglais ou japonais`
  - `Français ou anglais`
  - `français uniquement`
- Confirmed operational wording for this revision: `Langue : français`.

### Work titles

- The embedded YouTube item `SgYGcZS1Mp4` is titled `Digi Ugi`.
- The embedded YouTube item `XfBIiXmU4Rc` is titled `i.p.s.e.i.t.y.`.
- Generic labels such as `Techno Pop / AI Workflow / TouchDesigner MV` and `Electronic / Contemporary Practice` are not work titles and must be replaced.
- Year, medium, and duration will not be added without verified source information.

### Accessibility, performance, and analytics

- The main pages generally use one `h1`, but page-level heading sequences and detail-page navigation need normalization.
- Some mobile body text and labels fall below the requested 16 px minimum.
- Focus treatment is inconsistent across inline page styles.
- Hero imagery is not currently delivered through `picture`, AVIF/WebP sources, explicit responsive candidates, and desktop/mobile crops.
- Below-the-fold images are not consistently lazy-loaded.
- GA4 includes the required French section-view and resource events, but global tracking also adds canonical consultation/contact events. Email naming is inconsistent (`email_click`, `email_contact`, and `contact_click`).
- Resource links are excluded from global click binding and handled by a dedicated listener, which should be preserved to avoid double sends.

## Approved Direction

Use a restrained editorial split hero, real studio photography, fewer strong CTA buttons, concrete language, and shared detail-page conventions while preserving current URLs, page sections, SEO metadata, and existing GA4 event names. French public lesson communication is French only. The 19-euro product preview remains a material-dependent follow-up.
