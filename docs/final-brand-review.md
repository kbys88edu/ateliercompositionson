# Final Brand Review

Date: 2026-08-13  
Scope: `/`, `/ja/`, `/fr/`, six Japanese lesson pages, and four French lesson pages

## Result

The public site keeps its monochrome typography, rules, generous whitespace, URLs, and existing section inventory while changing the first impression from a general online school to an individual composer's atelier.

- Japanese and French home pages now use a 54/46 editorial split hero with copy and documentary studio photography kept separate.
- Mobile order is copy, two CTAs, then the photograph. Nothing is overlaid on the image.
- The hero uses responsive AVIF/WebP sources, a mobile crop, an eager fallback, dimensions, and high fetch priority.
- Sachie Kobayashi is presented as a composer and sound artist. Concrete working materials replace coaching-style claims.
- Strong consultation buttons are limited to the hero and the final booking area. Intermediate routes are text links.
- Japanese entry points are framed by the stage of the work rather than by age or beginner status.
- French artist/background material is consolidated into one introduction, and the service language is consistently `Langue : français`.
- Ten lesson-detail pages now share focus, spacing, type, media, navigation, and mobile-header rules.

## Before / After

| Measure | Before | After |
| --- | ---: | ---: |
| Japanese home text | 5,184 characters | 5,085 characters |
| French home text | 15,557 characters | 14,548 characters |
| Japanese sections | 13 | 13 |
| French sections | 11 | 10 |
| Japanese mobile height | 12,036 px | 12,291 px |
| French mobile height | 11,623 px | 11,968 px |
| Japanese desktop height | 8,583 px | 8,549 px |
| French desktop height | 8,527 px | 8,522 px |

The French section count falls by one because the duplicated atelier/teacher introductions were merged. The slight mobile-height increase comes from the legible 16 px minimum and the copy-first split hero, rather than added content.

## CTA Hierarchy

Japanese:

1. `制作について相談する` in the hero
2. `30分相談を予約する` in the final section

French:

1. `Parler d’un projet` in the hero
2. `Réserver un premier échange` in the final section

Pricing/resource buttons keep their distinct commercial or utility purpose; repeated consultation prompts in intermediate sections are text links.

## Image Use

Primary home imagery is the supplied performance photograph of Sachie Kobayashi working in front of professional audio equipment, delivered as:

- `images/hero-atelier-performance.avif`
- `images/hero-atelier-performance.webp`
- `images/hero-atelier-performance.png`
- `images/hero-atelier-performance-mobile.avif`
- `images/hero-atelier-performance-mobile.webp`

French lesson media uses actual concert, DAW, score, and Max/MSP documentation. The generated collage files `images/computer-music-synth-composition.jpeg` and `images/music-theory-hero.jpeg` are no longer primary French lesson media. Japanese composition and DTM pages retain their subject-specific typographic headers, as requested.

The home-page hero ratio is 1 real documentary source to 0 generated hero sources. Supporting work media consists of real photography, work documentation, scores, DAW/Max captures, and embedded published works.

## Works

Verified titles are used wherever the supplied embeds appear:

- `Digi Ugi`
- `i.p.s.e.i.t.y.`
- `Émergences Résurgences pour orchestre`

No year, medium, or duration was invented. Generic technology-demo labels were removed.

## Responsive Review

Browser checks at 1280 x 720 and 390 x 844 found:

- one `h1` per audited page;
- no horizontal overflow on root, both home pages, or representative Japanese/French lesson pages;
- 16 px mobile body text on every audited page;
- compact mobile detail headers and visible focus styling;
- working mobile navigation.

Final viewport screenshots are in `screenshots/final/`. These intentionally show the first viewport rather than stitched full-page images because the in-app browser repeats fixed headers during full-page stitching. Full document heights and overflow were measured from the DOM instead.

## Deferred Material

The 19-euro product card is retained, but the requested real workbook montage is deferred. The available `images/documentation-1.jpg` is not the product and is documented as a temporary image; real cover, spread, waveform, and video-frame assets are still required.

Lighthouse could not be run because the package is not installed in the local project. Structural, responsive, link, event, and unit-test checks were completed locally.
