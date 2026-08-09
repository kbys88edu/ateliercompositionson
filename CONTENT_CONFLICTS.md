# Atelier Composition Son - Content Conflicts

## Purpose

These items require an explicit content, policy, or technical decision. They should not be silently “cleaned up” during visual implementation because doing so could change the offer, legal disclosure, language availability, pricing meaning, or analytics behavior.

## A. Manual content and policy decisions

| ID | Priority | Page(s) | Current text A | Current text B | Recommended manual resolution |
| --- | --- | --- | --- | --- | --- |
| C-01 | High | `ja/index.html`, `ja/terms.html`, Japanese lesson detail pages | Foundation / Individual Session / Monthly Atelier / Text Feedback | Beginner / Advanced 単発 / Advanced 月謝 | Confirm the four current plan names as authoritative, then update customer-facing detail pages and FAQ. Do not change difficulty labels inside learning tools. |
| C-02 | High | `ja/index.html`, `ja/terms.html`, bilingual terms PDF | `4800円`, `7500円`, `28000円`, `1800円〜` with current plan names | `4,800`, `7,500`, `28,000`, `1,800` with old plan names | Regenerate the PDF from the verified current plan table before payment-provider review or checkout linking. |
| C-03 | High | `ja/booking.html`, bilingual terms PDF | `30分無料相談` | `初回無料相談`, `Initial consultation`, “pre-lesson consultation” | Confirm `無料相談（30分）` / `Free 30-minute consultation` as the legal and customer-facing term, then update the PDF and structured copy. |
| C-04 | High | `ja/index.html` price and FAQ/process copy | `28000円 / 月4回` | Monthly scheduling described as 1, 2, or 4 lessons | Decide whether Monthly Atelier is only four lessons or whether 1/2-session plans exist. Publish every offered frequency or remove unsupported options. |
| C-05 | High | `ja/index.html`, bilingual terms PDF | Monthly Atelier card says it is for continued learning/production | PDF says up to two brief email feedback items per month are included | Confirm whether this benefit is current, then state it consistently in price, terms, and FAQ. |
| C-06 | High | `ja/index.html`, `ja/mail-correction.html`, bilingual terms PDF | `Text Feedback 1800円〜` | PDF limits scope to roughly 3-4 score pages or four minutes of audio and states a typical three-day response | Confirm scope, turnaround, and what `〜` means; show a concise service summary and full contractual limits. |
| C-07 | Medium | `fr/index.html`, `fr/booking.html` | `Français, anglais ou japonais` | Booking path states French or English | Confirm the languages actually bookable through the French path and use one statement everywhere, including Calendly. |
| C-08 | Medium | `/index.html`, Japanese footer, French header | Root offers only `日本語` and `Français` | `English` / `EN` controls imply an English destination | Until a real English route exists, label this as language selection or show only Japanese/French. |
| C-09 | Medium | `fr/index.html`, French detail/booking pages | Main positioning emphasizes composition, harmony, and MAO | Detail/booking scope also includes electroacoustic practice | Decide whether electroacoustic is a primary acquisition category; if yes, include it in a concise offer line without overloading the `h1`. |
| C-10 | Medium | `fr/index.html` resources | 19€ kit described with launch-price positioning | 29€ mini written feedback presented as another paid entry | Confirm current prices, tax/payment destinations, availability, and whether “launch price” remains accurate. |
| C-11 | Medium | Japanese homepage/detail pages | Booking-focused CTA labels | Consultation-focused labels and intermediate homepage-anchor links | Choose one hero label and one submit label. Recommended: benefit-led hero CTA plus precise booking submit copy. |
| C-12 | Medium | `ja/terms.html`, bilingual terms PDF | HTML contains current plan names | PDF contains more detailed policy language but old commercial labels | Declare a canonical policy source and generate all public summaries/PDFs from it. |
| C-13 | Low | Japanese and French lesson paths | French page explicitly states teaching languages | Japanese path does not state whether Japanese-only or multilingual support is offered | Add a verified language line to the Japanese format/FAQ only if multilingual support is part of the offer. |

## B. Technical and reference conflicts

| ID | Priority | Conflict | Evidence | Required fix during implementation |
| --- | --- | --- | --- | --- |
| T-01 | High | Japanese homepage has three `h1` elements | `ja/index.html` has `h1` elements around lines 2654, 2712, and 2835. | Replace hero variants with one semantic heading and one responsive component. |
| T-02 | High | Analytics text matching contains mojibake | `assets/js/acs-tracking.js` contains `?????`, `????`, `?change gratuit`, and `30???`. | Replace text heuristics with stable `data-track` values; keep one event dispatch path. |
| T-03 | High | Analytics may double-fire | Pages include inline `data-track` listeners in addition to `assets/js/acs-tracking.js`. | Audit event firing in GA debug mode and centralize without renaming required events. |
| T-04 | High | Music-theory canonical URL does not match the file | File is `music-theory-lesson_with_pdf-link.html`; canonical, Open Graph URL, and JSON-LD point to `/ja/music-theory-lesson.html`, which is absent. | Choose the public slug, rename/redirect safely, and update canonical/OG/JSON-LD/sitemap/internal links together. |
| T-05 | High | Music-theory consultation image path is broken | Page requests `images/contact-background-modular-synth.jpg`; repository contains `contact-background-modular-synth-index.jpg`. | Select the intended asset and use the actual optimized path. |
| T-06 | High | French detail and booking anchors are obsolete | Links use `#travail`, `#tarifs`, and `#formats`; current homepage uses `#entrypoints` and `#format`. | Update links as part of the shared navigation rebuild. |
| T-07 | Medium | Counterpoint checkers request a missing script | Japanese and French checker pages load `auth.js`, which is not present in the repository. | Decide whether access control is still required; restore the real mechanism or remove the dead dependency. |
| T-08 | Medium | Sitemap omits most indexable pages | `sitemap.xml` includes only a small subset of lesson, booking, terms, and resource routes. | Rebuild the sitemap after final URLs are approved. |
| T-09 | Medium | Zoom is disabled on key Japanese pages | `user-scalable=no` appears on `ja/index.html` and the music-theory page. | Remove the restriction and verify responsive layout at 200% zoom. |
| T-10 | Medium | Major hero assets are heavy | Collage is about 6.3 MB; French hero video about 5.2 MB. | Create responsive optimized formats, poster/fallback behavior, and reduced-motion rules. |
| T-11 | Medium | Root page contains invalid trailing text | A literal Markdown fence appears after `</html>` in `/index.html`. | Remove it during root cleanup. |
| T-12 | Medium | Root language metadata is misleading | Root uses `<html lang="en">` despite being a JA/FR chooser. | Use a neutral language-selection strategy and correct alternate links after English-route decision. |
| T-13 | Medium | Hidden French conditions/contact content can become stale | Important policy/contact sections are present with `hidden`. | Keep one visible source of each important disclosure or move it to the footer/terms page. |
| T-14 | Low | Asset ownership is unclear | Several images are unreferenced, while some pages reference missing variants. | Build an asset manifest and only delete files after visual and reference verification. |
| T-15 | Low | Global CSS is fragmented | Large page-local styles and repeated media-query overrides create inconsistent behavior. | Introduce shared tokens/components incrementally while preserving page-specific art direction. |

## C. Verified current facts

The following points were consistent in the inspected current HTML and can be treated as working assumptions, subject to owner approval of this audit:

| Fact | Current value |
| --- | --- |
| GA4 property | `G-Y1792EBWTT` |
| Japanese consultation duration | 30 minutes |
| Japanese consultation price | Free |
| Japanese consultation form | Formspree `https://formspree.io/f/mbdbpqrj` |
| French consultation scheduler | Calendly `https://calendly.com/acs_trial/trial_acs` |
| Japanese Foundation | 4800円 / 60分 |
| Japanese Individual Session | 7500円 / 60分 |
| Japanese Monthly Atelier | 28000円 / 月4回 |
| Japanese Text Feedback | 1800円〜 |
| French individual lesson | 70€ / 60 minutes |

## D. Search results that need interpretation

- No customer-facing `1,000円` or `1000円` price was found in the current non-PDF source files.
- The words `Beginner` and `Advanced` are legitimate difficulty labels inside counterpoint learning tools. They should not be globally replaced. Only customer-facing lesson-plan labels need standardization.
- The PDF contains the older pricing labels even though its numeric prices match the current amounts. Visual redesign alone will not resolve this; the PDF must be regenerated or formally superseded.

## E. Approval checklist before implementation

- Confirm the four Japanese plan names and exactly what each includes.
- Confirm whether Monthly Atelier is only four sessions per month.
- Confirm included email feedback and standalone feedback limits/turnaround.
- Confirm final Japanese hero CTA label.
- Confirm French teaching languages.
- Confirm whether electroacoustic should appear in the French primary offer line.
- Confirm current French resource prices and “launch price” status.
- Decide whether to create an English page or remove EN/English labels.
- Confirm which terms document is authoritative and approve a regenerated PDF.
