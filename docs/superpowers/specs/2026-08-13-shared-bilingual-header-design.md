# Shared Bilingual Header Design

## Goal

Unify the site header across every page while keeping Japanese and French navigation separate. Remove the unnecessary blank space above and below the Japanese home-page hero image without changing the current overall hero composition.

## Constraints

- Keep the site deployable as plain static files on GitHub Pages.
- Do not introduce a framework, package manager, or build step.
- Preserve the existing monochrome visual language, logo, desktop navigation, mobile hamburger interaction, and consultation CTA.
- Keep Japanese and French labels and destinations independent.
- Preserve the current hero image and the current desktop text/image column balance.

## Shared Header Architecture

Create `assets/js/acs-header.js` as the single source of truth for header markup and navigation configuration.

Each HTML page will contain one lightweight mount element at the top of `body`. The script will read `document.documentElement.lang`, select the Japanese or French configuration, and render the complete header before initializing its menu behavior.

This approach is preferred over duplicated HTML because future changes to labels, links, logo, or mobile controls will require editing one file per language configuration rather than every page. A build-time template system was rejected because it would add deployment complexity to the current static site.

## Navigation Configuration

### Japanese

- レッスン: `index.html#study`
- 講師: `index.html#instructor`
- 料金: `index.html#price`
- 受講者の声: `index.html#voices`
- JA / FR: `../fr/`
- 無料相談: `booking.html`

### French

- Cours: `index.html#entrypoints`
- À propos: `index.html#instructor`
- Tarifs: `index.html#format`
- Œuvres: `index.html#works`
- FAQ: `index.html#questions`
- FR / JA: `../ja/`
- Rendez-vous: `booking.html`

Links remain relative so the same component works on all files inside `/ja/` and `/fr/`, both locally and on GitHub Pages.

## Header Markup And Behavior

The shared renderer will output:

- the existing ACS logo and Atelier Composition Son wordmark;
- desktop navigation and the primary booking CTA;
- a mobile menu button with `aria-expanded` and `aria-controls`;
- a language-appropriate mobile navigation panel;
- a close button and booking CTA inside the mobile panel.

`assets/js/acs-ui.js` will continue to own menu interactions. The generated markup will retain its existing `data-menu`, `data-menu-toggle`, `data-menu-panel`, and `data-menu-close` hooks, so behavior remains consistent without a second event system.

The active language will be determined only from the page `lang` attribute. Japanese and French pages will therefore share the implementation but never share their visible labels or link map.

## Page Migration

All HTML files under `/ja/` and `/fr/` will be migrated to the shared mount and script. Legacy duplicate header blocks and page-specific mobile menu markup will be removed rather than hidden, preventing overlapping navigation, duplicate IDs, and inconsistent hamburger behavior.

Pages outside these two language directories will remain unchanged unless they directly reuse one of the migrated language headers.

## Hero Whitespace Fix

The Japanese home-page hero will retain its current split layout and image-column width. The media column will explicitly stretch to the full hero height, and the image will fill that media box using `width: 100%`, `height: 100%`, and `object-fit: cover`.

The media wrapper will use `align-self: stretch`, `min-height: 0`, and `overflow: hidden`. This removes the visible top and bottom blank bands while keeping the image aligned with the complete text side of the hero. The mobile hero will use the same full-height media rule within its responsive layout.

No additional decorative padding will be added around the image. Cropping is allowed only where required to fill the media frame.

## Verification

Verification will cover:

- every `/ja/*.html` and `/fr/*.html` file includes the shared header script and a single header mount;
- no legacy duplicate `.acs-site-header` or competing mobile menu remains;
- Japanese and French labels and destinations are correct;
- desktop navigation works from both home pages and secondary pages;
- mobile hamburger opens, closes, returns focus, and exposes the correct language links;
- the Japanese hero image touches the top and bottom of its media column at desktop and mobile viewports;
- no horizontal overflow or header/text overlap occurs;
- existing GA4 tracking attributes on consultation links are preserved where present.

## Non-Goals

- Rewriting page content or changing section order.
- Redesigning the French or Japanese hero typography.
- Changing booking flows, prices, forms, or analytics configuration.
- Introducing a site generator or framework.
