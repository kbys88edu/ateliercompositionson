# Atelier Composition Son - French Site Restructure Report

**Date:** 2026-08-17

**Branch:** `codex/fr-site-restructure`

**Baseline:** `4c393d0`

## 1. French Routes Audited

| Route | Final purpose |
| --- | --- |
| `/fr/` | Position the atelier around composition and sound creation, compare outcomes and the 19/29/70 offers, explain the method, show real practice, and provide a restrained first contact |
| `/fr/composition-lesson.html` | Develop, structure, revise, and finalize a composition project |
| `/fr/harmony-analysis-lesson.html` | Apply harmony, counterpoint, analysis, and orchestration to a real score or study need |
| `/fr/electroacoustic-lesson.html` | Work on timbre, recording, transformation, space, Max/MSP, and electroacoustic projects |
| `/fr/mao-lesson.html` | Preserve the MAO search entry while centering compositional decisions in the DAW |
| `/fr/booking.html` | Reserve the 70€ individual session or send a short pre-booking question |
| `/fr/confidentialite/` | Explain French-form data processing and flag points requiring legal confirmation |

## 2. Files and Purpose

- `fr/index.html`: six-section landing hierarchy, verified 19/29/70 offer ladder, real work evidence, and restrained first-contact route.
- `fr/booking.html`: click-to-load Calendly and compact Formspree contact form.
- `fr/composition-lesson.html`, `fr/harmony-analysis-lesson.html`, `fr/electroacoustic-lesson.html`, `fr/mao-lesson.html`: unified French lesson positioning, metadata, structured data, and 70€ session path.
- `fr/confidentialite/index.html`: French privacy notice.
- `assets/css/fr-site.css`: French-only editorial layout and responsive rules.
- `assets/js/fr-site.js`: media, Calendly, and form behavior.
- `assets/js/fr-tracking.js`: French GA4 event contract and deduplication.
- `assets/js/acs-header.js`: language-conditional French navigation and optimized French logo; Japanese configuration remains visually unchanged.
- `images/fr/*`: actual kit pages and a resized existing logo. No generated imagery.
- `sitemap.xml`: all French routes, including privacy.
- `tests/test_fr_restructure.py` and existing test updates: route, offer, SEO, analytics, link, and Japanese-regression contracts.

## 3. Screenshots

### French homepage

| Width | Before | After |
| --- | --- | --- |
| 390px | [before](../../screenshots/fr-restructure/before/fr-home-before-390.png) | [after](../../screenshots/fr-restructure/after/fr-home-after-390.png) |
| 768px | [before](../../screenshots/fr-restructure/before/fr-home-before-768.png) | [after](../../screenshots/fr-restructure/after/fr-home-after-768.png) |
| 1440px | [before](../../screenshots/fr-restructure/before/fr-home-before-1440.png) | [after](../../screenshots/fr-restructure/after/fr-home-after-1440.png) |

### Japanese regression

The first viewport was captured from baseline and final code at 390, 768, and
1440px. Each before/after PNG pair has an identical SHA-256 checksum. The
automated suite also checks every `ja/*.html` file against its baseline hash.

## 4. Offer and CTA Verification

| Offer | Display | Primary destination | Result |
| --- | --- | --- | --- |
| Kit autonome | 19€ | `https://sonata14.gumroad.com/l/gvbzop` | HTTP 200; actual cover and two actual internal pages shown; free PDF and purchase actions separated |
| Mini retour | 29€ | `/fr/booking.html?offer=mini-feedback#contact-form` | Local HTTP 200; keyboard and mobile target verified |
| Séance individuelle | 70€ / 60 min | `/fr/booking.html?offer=individual-session#reservation` then Calendly | Local and Calendly HTTP 200; iframe loads only after activation |
| Premier contact | Auxiliary, no paid-work promise | `/fr/booking.html?offer=free-contact#contact-form` | Local HTTP 200; visually secondary to paid formats |

Additional CTAs:

- Hero primary -> project contact form.
- Hero secondary -> `#formats`.
- Free sample -> the existing French PDF, HTTP 200.
- Work players -> SoundCloud/YouTube iframe created only after click or Enter.

The internal route and fragment checker found no broken French links. Formspree
responds to its endpoint; a HEAD request returns its expected HTTP 400 because
the endpoint accepts form POSTs. No real enquiry was sent during QA.

## 5. Test Results

| Check | Result |
| --- | --- |
| Build | Not applicable: static HTML/CSS/JavaScript repository, no build command |
| Lint | No repository lint command |
| Typecheck | No typed source or repository typecheck command |
| Test | `python3 -m unittest discover -s tests`: 123 passed |
| Diff whitespace | `git diff --check`: passed |
| Responsive browser QA | 7 routes × 360, 390, 768, 1024, 1440px: 35 checks with no horizontal overflow, broken images, undersized tracked CTAs, or console errors |
| H1 | One H1 on every principal French page |
| Lazy embeds | Zero homepage/booking iframes before user action; one after keyboard activation |
| Form | French missing-field error, focused invalid field, mocked success response, and one analytics success event |

## 6. Lighthouse Before and After

Local mobile profile, same server and environment:

| Metric | Before | After |
| --- | ---: | ---: |
| Performance | 88 | 99 |
| Accessibility | 98 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| FCP | 1.2 s | 1.2 s |
| LCP | 3.9 s | 2.1 s |
| TBT | 0 ms | 20 ms |
| CLS | 0 | 0 |
| Transfer | 3,443 KiB | 381 KiB |

The reduction comes mainly from using a real optimized hero asset and loading
YouTube, SoundCloud, and Calendly only after an explicit action.

## 7. GA4 Verification

The existing measurement ID `G-Y1792EBWTT` is retained. Browser-level tests
confirmed one event per interaction with `locale`, `page_type`, `offer`,
`cta_position`, and `traffic_source` parameters:

- `click_primary_cta`
- `click_secondary_cta`
- `view_offer` (one each for `kit_19`, `mini_feedback_29`, and `individual_session_70`, with no repeat after rescrolling)
- `begin_booking`
- `submit_booking` (Calendly and mocked successful form route)
- `request_feedback`
- `click_gumroad`
- `download_sample`
- `play_work`

Live GA4 DebugView was not available locally, so verification covered the real
page JavaScript and `dataLayer` payload rather than the remote GA interface.

## 8. Japanese Impact

- No file under `/ja/` was edited.
- All Japanese HTML baseline hashes pass.
- First-viewport screenshots at 390, 768, and 1440px are pixel-identical before and after.
- Shared-header changes are selected by `document.documentElement.lang`; the Japanese logo, links, CTA, and labels keep their previous values.

## 9. Legal Confirmation Required

The privacy page deliberately does not invent legal facts. Before definitive
publication, a qualified reviewer should confirm:

- the exact retention period for enquiries and booking records;
- the respective roles and applicable safeguards for Formspree, Calendly, and GA4;
- the legal basis and safeguards for possible transfers outside the European Union;
- whether any additional postal or registration detail is required for the controller notice.

## 10. Remaining Boundaries

- The repository contains no checkout URL for the 29€ mini return, so the CTA
  collects the request through the existing contact workflow and does not invent
  a payment link.
- A public turnaround time for the 29€ return is not documented; the page says
  the deadline is confirmed before payment.
- Form submission was validated with a mocked successful Formspree response to
  avoid sending a false enquiry. The existing production endpoint was retained.
- No new AI-generated image, framework, dependency, URL, paid offer, or price was added.

## 11. Rollback

Revert the French implementation and QA commits after `a1df60b`. There are no
database changes or migrations; new assets are isolated under `images/fr/`, and
the new privacy route is additive.
