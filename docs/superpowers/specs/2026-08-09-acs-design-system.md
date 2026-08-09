# Atelier Composition Son - Approved Redesign Specification

## Status

- Direction approved: 2026-08-09
- Approved approach: hierarchy-first consolidation in the existing static-site architecture
- Source revision: `d235f18133e745e1f3ff121faa2939fec3bb0949`
- Primary conversion: free 30-minute consultation

This specification translates `DESIGN_AUDIT.md`, `CONTENT_MAP.md`, and `CONTENT_CONFLICTS.md` into the first implementation unit: a central design system plus the Japanese homepage. Detail pages and French pages follow in separate implementation plans.

## 1. Architecture decision

- Keep semantic static HTML, CSS, and small vanilla JavaScript utilities.
- Do not add React, Vue, a CMS, a CSS framework, or a new analytics vendor.
- Create shared foundations in `assets/css/acs-core.css` and `assets/js/acs-ui.js`.
- Keep page-specific art direction in small page stylesheets rather than returning to multi-thousand-line inline CSS.
- Preserve URLs, metadata, JSON-LD, GA4 ID `G-Y1792EBWTT`, UTM propagation, working forms, and current booking destinations.
- Use automated static contracts plus browser-based responsive and interaction verification.

## 2. Visual principle

Atelier Composition Son should read as a small contemporary arts institution and independent composer atelier. The design remains monochrome, editorial, quiet, and precise.

The interface uses:

- White and subtle warm-white surfaces.
- Black text and fine black rules.
- Muted gray for explanatory copy.
- Existing Helvetica-based typography with Japanese system fallbacks.
- Square controls and a maximum 4 px radius where a boundary needs slight softening.
- No decorative shadows, gradient decoration, rounded card grids, emoji icons, or generic music imagery.
- One visual idea per section.
- Authentic existing photographs and work documentation.

## 3. Design tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--acs-paper` | `#f7f7f4` | Quiet page bands and form background |
| `--acs-surface` | `#ffffff` | Primary page surface |
| `--acs-ink` | `#111111` | Text, primary buttons, strong rules |
| `--acs-muted` | `#66635e` | Supporting copy and metadata |
| `--acs-line` | `#1a1a1a` | Structural rules and control borders |
| `--acs-line-soft` | `rgba(17, 17, 17, 0.18)` | Secondary dividers |
| `--acs-error` | `#9a261f` | Form validation only |
| `--acs-focus` | `#0b57d0` | Keyboard focus indication only |

The palette remains monochrome in normal reading. Error and focus colors are functional, not decorative accents.

### Typography

| Token | Desktop | Mobile | Role |
| --- | --- | --- | --- |
| `--acs-font-sans` | `"Helvetica Neue", Arial, "Hiragino Sans", "Yu Gothic", sans-serif` | same | All interface and reading text |
| `--acs-text-xs` | `12px` | `12px` | Labels and metadata |
| `--acs-text-sm` | `14px` | `14px` | Navigation and supporting copy |
| `--acs-text-base` | `17px` | `16px` | Japanese body copy |
| `--acs-text-lg` | `20px` | `18px` | Lead copy |
| `--acs-h3` | `24px` | `20px` | Compact section/item heading |
| `--acs-h2` | `44px` | `30px` | Section heading |
| `--acs-h1` | `64px` | `34px` | Homepage offer heading |
| `--acs-display` | `88px` | `42px` | Rare brand display use only |

- Letter spacing remains `0`.
- Japanese body line height is `1.8`; French/Latin body line height is `1.6`.
- Japanese reading width is capped at `42em`.
- Heading sizes change at breakpoints; they do not scale continuously with viewport width.

### Spacing

| Token | Value |
| --- | --- |
| `--acs-space-1` | `4px` |
| `--acs-space-2` | `8px` |
| `--acs-space-3` | `12px` |
| `--acs-space-4` | `16px` |
| `--acs-space-5` | `24px` |
| `--acs-space-6` | `32px` |
| `--acs-space-7` | `48px` |
| `--acs-space-8` | `64px` |
| `--acs-space-9` | `96px` |
| `--acs-space-10` | `128px` |

Section padding uses 96-128 px on desktop, 64-96 px on tablet, and 48-64 px on mobile. Components use only the scale above.

### Layout

| Token | Value | Role |
| --- | --- | --- |
| `--acs-container-wide` | `1280px` | Hero and media layouts |
| `--acs-container` | `1120px` | Normal sections |
| `--acs-reading` | `760px` | Long-form copy |
| `--acs-gutter` | `24px` desktop, `20px` tablet, `18px` mobile | Viewport padding |
| `--acs-rule` | `1px solid var(--acs-line)` | Strong divider |
| `--acs-rule-soft` | `1px solid var(--acs-line-soft)` | Quiet divider |

Breakpoints are 768 px, 1024 px, and 1280 px. Required verification widths are 375, 390, 430, 768, 1024, and 1440 px.

## 4. Shared components

### Header

- Height: 76 px desktop, 64 px mobile.
- Desktop navigation: レッスン, 講師, 料金, 受講者の声, JA / FR, and one black 無料相談 button.
- Mobile: logo/wordmark, consultation text link, and a 44 x 44 menu control.
- Menu exposes `aria-expanded`, keyboard focus, Escape-to-close, and closes after a same-page navigation link is selected.
- No sticky oversized banner. A restrained sticky header is acceptable if it does not cover anchors.

### Buttons and links

- Primary: black fill, white text, minimum height 48 px desktop and 44 px mobile.
- Secondary: 1 px black border, transparent surface.
- Tertiary: text link with a persistent underline or directional arrow.
- Maximum two button-styled actions in one group.
- Primary style is reserved for free consultation.
- Every interactive target is at least 44 x 44 px.

### Sections

- Use full-width bands with constrained inner containers.
- Do not wrap entire sections in decorative cards.
- Section labels are short and optional; hierarchy comes from type and rules.
- A two-column section becomes one column below 768 px.

### Media

- Hero media uses a stable aspect ratio and explicit width/height.
- Other images use `loading="lazy"` and `decoding="async"`.
- Work embeds use `loading="lazy"` and a titled responsive wrapper.
- Mobile must not load the 5.2 MB motion hero as a required first-screen asset.
- `prefers-reduced-motion: reduce` disables nonessential movement.

### FAQ

- Use native `<details>` and `<summary>`.
- Focus style must remain visible.
- Homepage shows four high-friction questions.
- The complete existing FAQ remains available on `ja/faq.html`.

## 5. Japanese homepage composition

### Header

Use the restrained navigation defined above. AI, tools, policy, mail feedback, and detailed FAQ move to secondary/footer navigation.

### Hero

- Eyebrow: `ATELIER COMPOSITION SON`
- H1: `作曲・DTM・音楽理論を、自分の作品につなげる。`
- Lead: `Atelier Composition Son は、作曲・理論・音の実践を、個々の制作や学習に合わせて扱う小さなオンラインアトリエです。`
- Primary CTA: `30分無料相談を予約する`, linking directly to `booking.html`, `data-track="hero_consultation"`.
- Secondary action: `レッスンを見る`, linking to `#study`, `data-track="hero_lessons"`.
- Fact row: `ONLINE`, `個人レッスン`, `60 MIN`, `4800円から`.
- Visual: `images/sachie_studio.jpg` in the hero; use `images/profile.png` in the later teacher section.
- Desktop: text and image in a 56/44 grid.
- Mobile: image first, then text and actions; key offer and primary CTA appear in the first 1-2 screens.

### Trust strip

Four concise factual items:

- ジュネーブ高等音楽院 音楽教育修士
- IRCAM作曲研究課程 2021-2022
- スイスの音楽院での指導経験
- 日本・スイス・フランスでの制作実践

Use a ruled editorial strip, not badge cards.

### Who this is for

Exactly three paths:

1. `これから始める / 基礎から`
2. `独学・制作中`
3. `専門・受験・ポートフォリオ`

Each includes one concise existing description and relevant lesson links. Preserve beginner, project, exam, overseas conservatory, and portfolio meaning.

### What you can study

Three visual families, preserving six actual routes:

1. `COMPOSITION / THEORY`: composition, music theory, solfège.
2. `DTM / SOUND / ELECTROACOUSTIC`: DTM, electroacoustic/synthesizer.
3. `TECHNOLOGY / ADVANCED PRACTICE`: sound technology and AI; reference advanced project work without creating a new product.

Use ruled lists and numbered rows rather than six equal cards.

### Process

Three steps:

1. `相談`: current level, goal, tools, and work are clarified.
2. `個別レッスン`: the lesson uses the student's score, audio, DAW project, or exercise.
3. `次の制作・学習へ`: concrete revisions and the next task are agreed.

### Teacher

- Image: `images/profile.png`.
- Name: Sachie Kobayashi.
- Role: Composer / Artist / Educator.
- Homepage uses a concise introduction, four selected credentials, and `詳しいプロフィール` linking to `profile.html`.
- `ja/profile.html` preserves the full current biography, teaching philosophy, and external artist-site link.

### Selected work

Show three existing works only:

1. `Émergences Résurgences pour orchestre` from the existing SoundCloud embed.
2. `Techno Pop / AI Workflow / TouchDesigner MV` from YouTube.
3. `The Cosmic Microwaves Background / Le Fresnoy` from Vimeo.

Use lazy-loaded responsive embeds and titles only. All other existing works remain on lesson detail pages.

### Testimonials

Keep the three current testimonials verbatim with the published broad profiles: 50代女性, 30代男性, 10代女性. Use a quiet ruled editorial layout.

### Pricing

Use the latest explicitly supplied table:

- Foundation: 4800円 / 60分.
- Individual Session: 7500円 / 60分.
- Monthly Atelier: 28000円 / 月4回.
- Text Feedback: 1800円〜.

Monthly Atelier receives restrained emphasis through position and rule weight, not a bright badge or shadow. Text Feedback links to `mail-correction.html?request=mail-correction#form`.

No unverified monthly email-feedback inclusion is added. The old 1/2/4-session FAQ wording is not repeated on the redesigned homepage because it conflicts with the explicit current price table; the full FAQ page must be reconciled before publication.

### FAQ

Homepage questions:

1. これから制作を始める段階でも相談できますか？
2. 受験やポートフォリオにも対応していますか？
3. 単発相談はできますか？
4. どのソフトに対応していますか？

Link to `faq.html` for the complete current FAQ after terminology reconciliation.

### Final CTA

- Heading: `まずは30分の無料相談から。`
- Explain that current level, desired work, DAW/tools, and current difficulty can be discussed.
- Primary CTA: `30分無料相談を予約する`, `data-track="final_consultation"`.
- Tertiary links: written feedback, email contact, terms.

## 6. Analytics contract

- Keep GA4 ID `G-Y1792EBWTT`.
- Stable homepage events: `hero_consultation`, `hero_lessons`, `lesson_family_click`, `work_open`, `pricing_consultation`, `mail_feedback`, `final_consultation`.
- The shared tracker sends the explicit `data-track` value once, plus canonical `free_consultation_click`, `contact_click`, or `outbound_link_click` only when applicable.
- Remove text-guessing mojibake and page-local duplicate tracking listeners.
- Preserve same-origin UTM parameters through booking and detail-page links.

## 7. SEO and accessibility contract

- Exactly one `h1` on the Japanese homepage.
- Preserve current title, description, canonical, hreflang, Open Graph, GA4, and structured-data facts unless a contradiction is documented.
- Remove `user-scalable=no`.
- Keep all visible text as semantic HTML, not embedded into images.
- All images have useful alt text; decorative images use empty alt.
- All iframes have specific titles.
- No duplicate IDs.
- Keyboard focus is visible everywhere.
- Mobile menu and accordions work by keyboard.
- Internal links and image sources resolve from their page location.

## 8. Follow-on implementation units

1. Shared design system plus Japanese homepage, profile, and full FAQ.
2. Japanese lesson detail pages, booking, mail correction, terms, and resources.
3. French homepage, lesson pages, Calendly booking, and language routing.
4. Root chooser, final multilingual SEO, asset cleanup, terms PDF regeneration, and full QA.

