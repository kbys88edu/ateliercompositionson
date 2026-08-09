# Atelier Composition Son - Content Map

## Purpose

This map records where existing content should live in the redesign. It is a preservation plan, not a deletion list.

## Classification

| Status | Meaning |
| --- | --- |
| KEEP ON HOMEPAGE | Keep this material in the primary homepage narrative. |
| SHORTEN VISUALLY | Keep the content accessible while showing a more concise homepage presentation. |
| MOVE TO DETAIL PAGE | Preserve the full content on a relevant detail/resource/profile page and use only a link or short teaser on home. |
| COLLAPSE | Preserve the content in an accordion, disclosure, or secondary layer. |
| KEEP UNCHANGED | Keep the current content and role substantially as-is. |
| REMOVE ONLY IF DUPLICATE | Remove only the repeated instance after its unique content has been merged into the authoritative block. |

Technical standardization and unresolved factual decisions are documented separately in `CONTENT_CONFLICTS.md`.

## 1. Japanese homepage

| Current content | Current location | Target destination | Status | Notes |
| --- | --- | --- | --- | --- |
| Logo, wordmark, main navigation | Header | Compact global header | SHORTEN VISUALLY | Reduce 12 links to grouped navigation plus a primary consultation button. |
| Kinetic/collage hero | Multiple hero variants | Single semantic hero | REMOVE ONLY IF DUPLICATE | Keep one visual treatment and one `h1`; use responsive still/motion behavior. |
| Offer headline and lesson scope | Three hero variants | Hero | REMOVE ONLY IF DUPLICATE | Merge all unique scope language into one concise existing-positioning statement. |
| Free consultation CTA | Hero and multiple sections | Hero, mid-page process, final CTA | KEEP ON HOMEPAGE | All primary links go directly to `booking.html`; one label system. |
| Lesson content CTA | Hero | Hero secondary CTA | KEEP ON HOMEPAGE | Link to the consolidated modules/lesson overview. |
| Email feedback CTA | Hero variants and contact | Written feedback/resource block and final secondary link | MOVE TO DETAIL PAGE | Keep a small homepage path, but let `mail-correction.html` carry the full service. |
| Beginner/exam/production/technology reassurance | Hero trust, audience strip, mobile cards, `#lessons` | Trust strip plus one “こんな方へ” section | REMOVE ONLY IF DUPLICATE | Preserve all audience types without four repetitions. |
| Background & Scope | After hero | Short trust/atelier introduction | SHORTEN VISUALLY | Use selected credentials and approachable scope; full detail belongs in Instructor/profile content. |
| Image sequence | Before About | Selected works/process section | MOVE TO DETAIL PAGE | Keep only selected purposeful images on home; retain the wider set in work/detail contexts. |
| “レッスンを、創作の場として。” | `#about` | Approach section | KEEP ON HOMEPAGE | Core brand proposition. |
| Brand quotations and Pierre Schaeffer reference | About/brand copy | Approach section | COLLAPSE | Preserve as brand voice in a secondary editorial layer, not hero conversion copy. |
| Full teacher biography | `#instructor` | Profile/detail area | MOVE TO DETAIL PAGE | Homepage shows a short proof summary and link; complete biography remains reachable. |
| Instructor message | `#message` | Instructor/approach continuation | SHORTEN VISUALLY | Keep unique personal copy, remove credential repetition. |
| Visual break image | Between Message and Modules | Selected works/process section | MOVE TO DETAIL PAGE | Keep on home only if selected as one of the strongest proof images. |
| Six modules 00-05 | `#modules` | Three visual families linking to six routes | SHORTEN VISUALLY | Preserve actual module names/pages; make the overview scannable and mobile-stable. |
| Second “こんな方へ” | `#lessons` | Consolidated audience section | REMOVE ONLY IF DUPLICATE | Merge beginner, independent, exam, portfolio, and production needs into three paths. |
| AI review service explanation | `#ai-review` | Sound Technology/AI detail page | MOVE TO DETAIL PAGE | Keep only a concise technology-family reference on home. |
| Harmony, counterpoint, synth tools | `#tools` | Resources/free tools destination | MOVE TO DETAIL PAGE | Show at most one small resource teaser low on the homepage. |
| Testimonials | `#voices` | Before or near pricing | KEEP ON HOMEPAGE | Move earlier because they reduce booking anxiety. |
| Foundation price | Mobile panel and `#price` | Pricing | REMOVE ONLY IF DUPLICATE | One authoritative pricing block using current plan naming. |
| Individual Session price | Mobile panel and `#price` | Pricing | REMOVE ONLY IF DUPLICATE | Reconcile old `Advanced` labels on detail pages. |
| Monthly Atelier price | Mobile panel and `#price` | Pricing | KEEP ON HOMEPAGE | Give the recurring/core option appropriate emphasis after policy verification. |
| Text Feedback price | Mobile panel and `#price` | Pricing plus mail-correction page | KEEP ON HOMEPAGE | Show as a secondary “without Zoom” option with a detail/application link. |
| Policy summary | `#policy` | Policy summary near price/FAQ | COLLAPSE | Keep key facts visible and full terms linked after content alignment. |
| Eight FAQ items | `#faq` | Four homepage questions plus full FAQ layer | COLLAPSE | Keep all answers reachable; show roughly four high-friction items on home. |
| Consultation/contact block | `#contact` | Final CTA | KEEP ON HOMEPAGE | Consultation first; email feedback and general email remain secondary. |
| Footer legal/language links | Footer | Shared footer | KEEP UNCHANGED | Preserve legal access while correcting the misleading English destination. |

## 2. Japanese mobile-only content

| Current block | Target | Status | Notes |
| --- | --- | --- | --- |
| Mobile hero landing | Shared responsive hero | REMOVE ONLY IF DUPLICATE | Do not maintain a second copy hierarchy. |
| Mobile entry cards | Trust strip and audience section | REMOVE ONLY IF DUPLICATE | Content remains; duplicate cards do not. |
| Mobile price list | Shared pricing section | REMOVE ONLY IF DUPLICATE | Use CSS layout changes rather than repeated markup. |
| Mobile teacher card | Shared instructor section | REMOVE ONLY IF DUPLICATE | One source of truth for credentials. |
| Separate mobile CTA bands | Shared CTA hierarchy | REMOVE ONLY IF DUPLICATE | Primary consultation, secondary lesson content, tertiary feedback. |

## 3. Japanese detail pages

### Shared target structure

1. Compact global header and breadcrumb/back link.
2. Specific hero image, service title, audience, and direct consultation CTA.
3. What the student will learn or produce.
4. Who the lesson is for.
5. Method/modules/process.
6. Relevant sample, PDF, work, or tool.
7. Consistent pricing summary.
8. Focused FAQ.
9. Final direct booking CTA.

| Page | Existing strengths to keep | Main change required | Status |
| --- | --- | --- | --- |
| `ja/composition-lesson.html` | Composition-specific hero, curriculum, work embeds, orchestral example | Align price names, shared header, CTA destination, and page rhythm | KEEP UNCHANGED |
| `ja/dtm-lesson.html` | DTM hero, production topics, work/video examples | Align structure with composition page and current price names | KEEP UNCHANGED |
| `ja/music-theory-lesson_with_pdf-link.html` | Theory/ear connection, sample PDF, lesson process | Preserve content while fixing canonical route, image, plan names, and zoom | KEEP UNCHANGED |
| `ja/solfege.html` | Focused curriculum and pricing | Preserve content in the shared detail-page system | KEEP UNCHANGED |
| `ja/electroacoustic-lesson.html` | Specialist scope and relevant imagery | Preserve content in the shared detail-page system | KEEP UNCHANGED |
| `ja/sound-technology-ai-lesson.html` | AI/music-technology positioning | Preserve as the full destination for homepage AI/technology references | KEEP UNCHANGED |
| `ja/simple-synth.html` | Useful interactive learning tool | Keep as a resource; add consistent return and consultation path | KEEP UNCHANGED |
| `ja/booking.html` | Focused 30-minute Formspree form | Keep logic and fields; improve hierarchy, focus, mobile, error/success states | KEEP UNCHANGED |
| `ja/mail-correction.html` | Dedicated written-feedback journey | Keep separate from consultation; align plan naming and legal links | KEEP UNCHANGED |
| `ja/terms.html` | Current plan names and Japanese commercial disclosure | Treat as primary current HTML source after owner verification | KEEP UNCHANGED |

## 4. French homepage

| Current content | Target destination | Status | Notes |
| --- | --- | --- | --- |
| French editorial hero/video | Single responsive hero | KEEP ON HOMEPAGE | Retain the more restrained French art-school tone; provide mobile still/reduced-motion behavior. |
| “Commencer la composition…” offer | Hero | KEEP ON HOMEPAGE | Add/confirm electroacoustic scope only after final positioning decision. |
| 70€ lesson metadata | Hero and format | KEEP ON HOMEPAGE | Use one pricing statement. |
| Free 30-minute exchange CTA | Hero and final CTA | KEEP ON HOMEPAGE | Primary action to `booking.html`. |
| 19€ kit CTA | Resource section | MOVE TO DETAIL PAGE | Do not give equal hero prominence to the secondary product. |
| “Est-ce pour vous ?” entry points | Audience/lesson section | KEEP ON HOMEPAGE | Strong early self-identification. |
| 30-minute process | Consultation process | KEEP ON HOMEPAGE | Useful anxiety reduction; place before booking CTA. |
| Paid/free resources | Resource section | SHORTEN VISUALLY | Verify 19€ and 29€ prices/status. |
| Atelier philosophy | Approach | KEEP ON HOMEPAGE | Concise and culturally appropriate. |
| Instructor | Instructor | SHORTEN VISUALLY | Preserve international credentials and approachable teaching language. |
| Selected works | Proof | SHORTEN VISUALLY | Keep roughly three curated, lazy-loaded works. |
| Format and languages | Format/pricing | KEEP ON HOMEPAGE | Language statement requires manual resolution. |
| Booking section | Final CTA | REMOVE ONLY IF DUPLICATE | Current separate booking and contact blocks can share one clear ending. |
| FAQ | FAQ | COLLAPSE | Keep high-friction questions visible and all current answers reachable. |
| Hidden conditions/contact | Visible footer/policy links as needed | COLLAPSE | Important content must not depend on permanently hidden sections. |

## 5. French detail and booking pages

| Page | Keep | Change | Status |
| --- | --- | --- | --- |
| `fr/composition-lesson.html` | Concise course scope and 70€ price | Fix obsolete `#travail`/`#tarifs` links and align shared template | KEEP UNCHANGED |
| `fr/harmony-analysis-lesson.html` | Clear discipline focus | Fix obsolete anchors and align CTA/header | KEEP UNCHANGED |
| `fr/electroacoustic-lesson.html` | Specialist positioning | Fix obsolete anchors and align CTA/header | KEEP UNCHANGED |
| `fr/mao-lesson.html` | MAO-specific offer | Fix obsolete anchors and align CTA/header | KEEP UNCHANGED |
| `fr/booking.html` | Calendly flow | Fix obsolete anchors and verify offered languages | KEEP UNCHANGED |

## 6. Root and language architecture

| Content | Target | Status | Notes |
| --- | --- | --- | --- |
| ACS language chooser | Root | KEEP UNCHANGED | Keep the role; remove unnecessary motion and correct language semantics. |
| Japanese destination | `/ja/` | KEEP UNCHANGED | Primary Japanese entry. |
| French destination | `/fr/` | KEEP UNCHANGED | Primary French entry. |
| English/EN labels | No valid destination currently | REMOVE ONLY IF DUPLICATE | Remove/de-emphasize only after confirming there is no genuine English route. |

## 7. Resources, tools, and supporting documents

| Asset/content | Target role | Status |
| --- | --- | --- |
| Harmony checker | Free learning resource and lesson proof | KEEP UNCHANGED |
| Counterpoint checker and modules | Free learning resource and curriculum proof | KEEP UNCHANGED |
| Simple synth | Free learning resource and electroacoustic proof | KEEP UNCHANGED |
| Japanese curriculum PDFs | Relevant lesson detail pages | KEEP UNCHANGED |
| French free PDF and paid kit | French resource section | KEEP UNCHANGED |
| Email feedback sample PDF | Mail-correction page | KEEP UNCHANGED |
| Bilingual terms PDF | Terms, price, and checkout context | KEEP UNCHANGED |
| Work embeds | Selected works on detail pages; roughly three on home | SHORTEN VISUALLY |

## 8. Asset destination map

| Asset | Proposed destination |
| --- | --- |
| `images/acs-header-collage.png` | Japanese homepage hero and campaign landing context |
| `images/acs-header-fr.png` / French motion asset | French homepage hero |
| `images/sachie_studio.jpg` | Homepage instructor section |
| `images/profile.png` | Instructor/teaching detail or editorial breakpoint |
| `images/sachie_re.jpeg` | Biography/quote image |
| `images/home.jpg` | Composition work proof |
| `images/home-2.jpg` | DTM/live electronics proof |
| `images/home-3.jpg` | Composition/DTM process proof |
| `images/documentation-1.jpg` | Sound art/electroacoustic work proof |
| `images/module5-vr-performance-documentation.jpeg` | Sound technology/AI lesson proof |
| `images/ja-composition-header.png` | Japanese composition detail hero |
| `images/ja-dtm-header.png` | Japanese DTM detail hero |
| `images/music-theory-hero.jpeg` | Music theory detail hero |
| `images/solfege-hero.jpg` | Solfège detail hero |
| `images/emailfeedback_hero.png` | Written feedback detail hero |
| `images/contact_hero.png` | Consultation booking page |

## 9. Content that must not be silently removed

- Full teacher credentials and international practice history.
- Beginner, independent learner, entrance exam, overseas conservatory, portfolio, and professional-production audiences.
- Composition, DTM, theory, solfège, harmony/counterpoint, electroacoustic, synthesis, sound technology, and AI music scope.
- Existing testimonials.
- Existing work examples and educational PDFs.
- Free learning tools.
- Written feedback service.
- Current pricing and policy information after conflict resolution.
- FAQ, cancellation/refund information, contact details, privacy/commercial disclosure, and booking expectations.

The redesign may shorten the homepage view of these items, but the complete information must remain reachable on the appropriate page or disclosure layer.
