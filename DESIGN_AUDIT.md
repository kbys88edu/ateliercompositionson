# Atelier Composition Son - Design Audit

## Audit scope

- Repository: `kbys88edu/ateliercompositionson`
- Revision inspected: `d235f18133e745e1f3ff121faa2939fec3bb0949`
- Audit date: 2026-08-09
- Primary conversion goal: reservation of a free 30-minute consultation
- Phase constraint: this audit does not change HTML, CSS, JavaScript, assets, tracking, or published copy

The repository, the live Japanese and French pages, the booking flows, the lesson detail pages, the learning tools, the media assets, and the bilingual terms PDF were inspected. The current brand is not the problem. The main issue is that several good ideas have accumulated without a single hierarchy, so visitors must work too hard to understand the offer and choose a next step.

## Executive summary

The strongest direction is a hierarchy-first redesign that keeps the monochrome editorial identity, uses the existing authentic studio and work imagery, and consolidates repeated content into one clear homepage path:

1. Understand the offer.
2. Recognize that the lessons can fit the visitor's level and goal.
3. See the teacher's credibility without being overwhelmed.
4. Review lesson areas, examples, testimonials, and price.
5. Book a free 30-minute consultation.

The Japanese homepage currently has three `h1` elements in the DOM, several competing hero variants, repeated audience/teacher/price content, a 12-item desktop navigation, and a long delay before core proof appears. At a 375 x 812 mobile viewport, the hero occupies roughly 1,100 px; at 1440 x 900, the About section begins around 3,000 px from the top. The page is visually distinctive, but the conversion path is diluted.

The French homepage is more focused than the Japanese page, but mixes lesson conversion with paid resources in the first screen and has content/link inconsistencies across its detail and booking pages.

## 1. Current page architecture

| Area | Current role | Main observation |
| --- | --- | --- |
| `/index.html` | Japanese/French language chooser | Elegant and minimal, but declares `lang="en"`, exposes no actual English site, includes a cursor animation, and contains a trailing Markdown fence after `</html>`. |
| `/ja/index.html` | Japanese homepage and primary sales page | Contains most site content in one 3,689-line file, including multiple hero implementations and repeated mobile/desktop content. |
| `/ja/booking.html` | 30-minute consultation form | Clear, focused Formspree flow. This should remain the primary destination for Japanese consultation CTAs. |
| `/ja/mail-correction.html` | Written feedback application | Separate conversion path with relevant hero and form. It should stay distinct from consultation CTAs. |
| Japanese lesson pages | Composition, DTM, theory, solfège, electroacoustic, sound technology/AI | Valuable detail exists, but page structures, pricing labels, CTA destinations, and visual systems are inconsistent. |
| `/ja/terms.html` and bilingual PDF | Policies and commercial disclosure | HTML uses current plan names; the PDF still uses older plan names and formatting. |
| `/fr/index.html` | French homepage and sales page | More concise than Japanese, but the hero gives equal prominence to a consultation and a 19€ resource. |
| `/fr/booking.html` | Calendly booking | Correctly separates scheduling from the homepage. Navigation targets do not all exist on the current French homepage. |
| French lesson pages | Composition, harmony/analysis, electroacoustic, MAO | Concise and usable, but old anchors and a different visual language reduce continuity. |
| `/harmony-checker.html`, `/counterpoint/`, `/ja/simple-synth.html` | Free learning tools | Strong trust and discovery assets. They should be presented as resources, not compete with the primary lesson CTA. |

## 2. Japanese homepage content flow

The current order is:

1. Large header and 12-item navigation.
2. Multiple overlapping hero implementations.
3. Trust strip.
4. Background & Scope.
5. Audience strip.
6. Image sequence.
7. Concept/About.
8. Full instructor biography.
9. Instructor message.
10. Visual break.
11. Modules.
12. A second audience section.
13. AI review.
14. Free learning tools.
15. Testimonials.
16. Pricing.
17. Policies.
18. FAQ.
19. Contact/final CTA.

This order asks visitors to read substantial institutional and conceptual material before they see the complete lesson menu, testimonials, pricing, or the final decision path.

## 3. Duplicated and competing content

### Hero duplication

`/ja/index.html` contains three `h1` elements and several hero systems (`hero-kinetic`, `ja-hero-copy`, `ja-hero-kinetic`, `mobile-hero-landing`, and `hero-copy`). CSS overrides hide or reposition variants, but the duplicate content remains in the DOM. This makes maintenance fragile and weakens heading semantics.

### Audience duplication

Visitor types are described in the mobile entry cards, the hero trust/audience area, the `audience-strip`, and `#lessons`. The same reassurance is spread across several formats instead of becoming one decisive section.

### Teacher duplication

Credentials and teaching philosophy appear in the hero-related panels, Background & Scope, the full Instructor section, and Message. The material is strong, but repeated exposure delays other decision information.

### Pricing duplication

Mobile-only price links repeat the main pricing section. The plan names also differ from Japanese lesson detail pages, which still use `Beginner` and `Advanced` labels.

### Consultation duplication

Consultation explanations and CTAs appear in the hero, detail-page endings, contact section, and booking page with several labels and intermediate destinations. A primary CTA should go directly to the relevant booking page everywhere.

## 4. Conversion obstacles

| Priority | Obstacle | Why it matters |
| --- | --- | --- |
| High | The hero is visually and structurally overbuilt | A first-time mobile visitor sees a long composition before reaching a concise answer to “what is this, is it for me, and what should I do next?” |
| High | Several primary actions compete | Consultation, modules, email feedback, free tools, and paid resources are presented with similar visual weight. |
| High | Trust is long rather than scannable | Credentials are credible, but the user needs a short proof block first and the full biography later. |
| High | Plan names differ between homepage, detail pages, and PDF | Visitors cannot confidently compare price or understand which lesson applies to them. |
| Medium | Testimonials and selected works appear late | These are high-value proof elements and should appear before or near pricing. |
| Medium | Navigation is too dense | Twelve Japanese items create scanning cost and are difficult to translate into a clean mobile menu. |
| Medium | Detail-page CTAs add an extra step | Many links return to homepage anchors instead of going directly to booking. |
| Medium | French hero promotes a paid kit beside booking | The secondary offer distracts from the stated primary goal. |
| Low | Root chooser suggests an English destination that does not exist | This creates a small but avoidable expectation mismatch. |

## 5. Design elements worth keeping

The redesign should preserve the following distinctive qualities:

- Monochrome, Swiss/editorial composition.
- Fine black rules and strong typographic contrast.
- Generous white space without decorative cards around every section.
- Existing ACS wordmark/logo language.
- The black-and-white collage and large-format typographic headers.
- Authentic images of the instructor, scores, DAW sessions, concerts, installations, and performances.
- Direct, calm copy that treats visitors as artists and learners rather than leads in a generic funnel.
- Separate Japanese Formspree and French Calendly booking experiences.
- Existing GA4 `data-track` attributes and the established measurement intent.
- Lazy-loaded work embeds and existing detailed educational content.

## 6. Strongest existing assets

| Asset | Recommended role | Assessment |
| --- | --- | --- |
| `images/acs-header-collage.png` | Japanese campaign/home hero image | Strongest brand image. It needs responsive sizing and compression; the current file is about 6.3 MB. |
| `assets/video/fr-hero-micro-movement.mp4` | Optional desktop motion accent | Distinctive, but about 5.2 MB and too expensive as a universal mobile dependency. Use a still/poster or reduced-motion fallback. |
| `images/sachie_studio.jpg` | Primary teacher proof image | Most natural and credible instructor image for the homepage. |
| `images/profile.png` | Editorial teacher/lesson image | Strong monochrome alternative with a teaching context. |
| `images/sachie_re.jpeg` | Compact portrait | Useful for biography or quote placement, not as the only proof image. |
| `images/home.jpg` | Composition/orchestral work proof | Clear professional context. |
| `images/home-2.jpg` | DTM/live electronics proof | Strong for DTM, performance, and production sections. |
| `images/home-3.jpg` | Score and DAW process | Strong bridge between composition and technology. |
| `images/documentation-1.jpg` | Installation/sound art proof | Useful for selected works and international practice. |
| `images/module5-vr-performance-documentation.jpeg` | Technology/AI/performance proof | Specific and credible specialist imagery. |
| `images/emailfeedback_hero.png` | Written feedback service | Already aligned with the service and should remain on its own page. |
| `images/contact_hero.png` | Consultation/booking | Useful on the booking page, but should not displace the form from the first mobile screens. |

Several images are present but not referenced by current HTML, including `profile.png`, `sachie_re.jpeg`, `max-screen.png`, `module5-vr-performance-composite.png`, and `contact-background-modular-synth-index.jpg`. These are candidates for deliberate reuse after visual review, not automatic deletion.

## 7. Current and recommended CTA hierarchy

### Current state

The current Japanese journey does not have one stable CTA hierarchy. The hero presents consultation and lesson content, alternate hero/mobile blocks introduce written feedback, mobile entry cards promote modules and pricing, and the tools section introduces more button-styled actions. Several of these controls have similar visual weight. French similarly places the free exchange beside the 19€ kit in the hero.

As a result, the consultation is present but not consistently dominant. Labels and destinations also vary between direct booking links and homepage-anchor intermediates.

### Primary

One action across the Japanese lesson journey: book the free 30-minute consultation. Recommended destination: `/ja/booking.html`.

The final label must be chosen once and reused. Two viable formulations are:

- `30分無料相談を予約する`: precise and transactional.
- `自分に合うレッスンを相談する`: benefit-led and less formal.

Recommendation: use the benefit-led label in the hero with `30分無料・勧誘なし` as supporting microcopy, then use the precise label on the booking page submit action.

### Secondary

`レッスン内容を見る`, linking to the lesson/module overview.

### Tertiary

Text links for pricing, terms, free tools, selected works, and written feedback. Written feedback remains its own service and should not look like an alternative version of the consultation button.

## 8. Navigation audit

The current Japanese desktop navigation contains 12 items. Recommended top-level navigation:

- レッスン
- 講師
- 作品・受講者の声
- 料金
- よくある質問
- `無料相談` button
- Language switch

Concept, AI review, tools, policy, and contact remain available within the page/footer or under the relevant grouped section. This reduces navigation complexity without deleting content.

The French navigation should use the same information logic but natural French labels rather than a literal Japanese structure.

## 9. Mobile risks

- The Japanese hero is roughly 1,100 px high at a 375 x 812 viewport.
- Multiple hero blocks and extensive media increase layout and maintenance risk.
- `user-scalable=no` is present on the Japanese homepage and music-theory page, preventing expected zoom behavior.
- Large media files have no responsive `srcset` strategy and often no intrinsic width/height.
- The 5.2 MB hero video and 6.3 MB collage can delay first content on mobile advertising traffic.
- Repeated mobile-only navigation, audience, teacher, and pricing panels duplicate main-page content.
- The long one-page layout reaches roughly 18,000 px on a typical phone before all content is consumed.
- Buttons and module cards need stable dimensions so labels and “詳細を見る” controls do not shift or wrap unpredictably.

## 10. Multilingual risks

- The root chooser declares English but only offers Japanese and French.
- `English`/`EN` links lead to the language chooser, not an English page.
- French lesson scope, language availability, and resource pricing need policy confirmation before copy is standardized.
- French detail and booking pages link to obsolete homepage anchors.
- Japanese and French can share a design system and information hierarchy, but the copy and booking behavior should remain culturally and operationally distinct.

## 11. Accessibility, performance, SEO, and analytics

### Accessibility

- Keep one visible and semantic `h1` per page.
- Remove `user-scalable=no`.
- Establish visible keyboard focus for links, buttons, menus, accordions, and form controls.
- Preserve meaningful `alt` text and add accessible labels where visual controls are icon-only.
- Respect `prefers-reduced-motion` for the kinetic hero and root animation.

### Performance

- Export responsive WebP/AVIF or optimized JPEG/PNG variants for major images.
- Add width/height or aspect-ratio constraints to prevent layout shift.
- Use a still mobile hero and load motion only where it improves the experience.
- Keep work embeds lazy-loaded and avoid loading all media before interaction.

### SEO

- Align canonical URLs with actual filenames/routes.
- Expand `sitemap.xml` to include indexable lesson, booking, terms, and resource pages.
- Correct the root language semantics and remove misleading English alternatives until an English page exists.
- Keep one stable page title, meta description, and structured-data service definition per route.

### Analytics

- Preserve the GA4 property `G-Y1792EBWTT` and current `data-track` hooks.
- Repair mojibake in `assets/js/acs-tracking.js` before relying on text-based CTA classification.
- Prevent inline listeners and the shared tracker from firing duplicate events.
- Standardize a small event vocabulary for consultation, lesson detail, price, written feedback, resources, and external work links.

## 12. Proposed Japanese homepage information architecture

1. Compact header with one primary booking action.
2. Hero with one image/visual, one `h1`, short offer copy, primary consultation CTA, and secondary lesson CTA.
3. Four-item trust strip: beginner support, entrance exam/portfolio, work production, DTM/electroacoustic/AI.
4. “こんな方へ” section, consolidated from all existing audience content.
5. Lesson areas presented as three scannable families: Composition/Theory, DTM/Sound/Electroacoustic, and Technology/Advanced Practice, while preserving the six existing module/detail routes.
6. How lessons work and what happens in the 30-minute consultation.
7. Instructor proof: short credentials, approachable teaching promise, authentic image, optional expanded biography.
8. Selected works and teaching/process imagery.
9. Testimonials.
10. Pricing with one naming system.
11. Free tools and written feedback as secondary resources.
12. FAQ and policy summary.
13. Final consultation CTA, email feedback link, and contact/terms links.

This sequence preserves the current information while reducing repetition and placing decision-relevant proof before the final conversion section.

## 13. Recommended implementation direction

### Option A - Hierarchy-first consolidation (recommended)

Keep the static-site architecture, introduce a shared design system, rebuild each page from the current verified content map, and consolidate duplicate homepage blocks into one semantic structure. This gives the best balance of conversion improvement, SEO continuity, implementation risk, and maintainability.

### Option B - Visual-only homepage refinement

Restyle the current Japanese hero, navigation, modules, and CTA blocks without removing duplicate DOM structures or reconciling page templates. This is faster, but the content, analytics, and maintenance problems remain.

### Option C - Full architectural rebuild

Move all pages to a component framework and content model immediately. This offers the cleanest long-term system, but increases migration, deployment, URL, and analytics risk beyond what the current static site requires.

Recommendation: approve Option A, then resolve the items in `CONTENT_CONFLICTS.md` before final copy and pricing components are implemented.
