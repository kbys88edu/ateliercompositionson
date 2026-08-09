# Japanese Homepage Kinetic Hero Design

## Goal

Give the Japanese homepage the same kinetic-typography and video-led opening structure as the French homepage. The visual introduction should feel like one bilingual brand while the Japanese copy remains concise, practical, and conversion-focused.

## Hero Structure

1. Keep the existing Japanese site header.
2. Place a full-width kinetic visual directly below the header.
3. Reuse `assets/video/fr-hero-micro-movement.mp4` as a muted, autoplaying, looping, inline background video.
4. Overlay the large lowercase words `atelier`, `composition`, and `son` using the same letter-level motion system as the French homepage.
5. Add a small Japanese subject note: `作曲 / DTM / 音楽理論 / 電子音響`.
6. Place the Japanese title, explanation, lesson metadata, CTAs, and consultation note in a separate white content band below the kinetic visual.
7. Keep the current four-item instructor background strip immediately after the hero.

## Japanese Copy

- Label: `ATELIER COMPOSITION SON`
- Heading: `作曲・DTM・音楽理論を、自分の作品につなげる。`
- Lead: `作曲・理論・音の実践を、個々の制作や学習に合わせて扱う小さなオンラインアトリエです。`
- Metadata: `オンライン個人レッスン · 60分 · 4800円から`
- Primary CTA: `30分無料相談`
- Secondary CTA: `レッスンを見る`
- Consultation note: `無料相談では、現在の課題、最初に取り組む内容、無理のない学習ペースを一緒に整理します。`

## Responsive Behaviour

- Desktop kinetic height: `clamp(390px, 42.85vw, 720px)`.
- Mobile kinetic height: approximately `230px`.
- Desktop copy uses a wide, unframed white band with a maximum readable line length.
- Mobile CTAs remain side by side with the shortened Japanese labels and 44px or larger touch targets.
- The kinetic words remain oversized and intentionally cropped at the viewport edges.
- The Japanese subject note stays legible without overlapping the brand words.

## Motion And Accessibility

- Video uses `autoplay muted loop playsinline preload="metadata"`.
- The visual wrapper is decorative and hidden from assistive technology.
- The semantic page heading remains in the copy band below the video.
- Under `prefers-reduced-motion: reduce`, hide the video, disable all hero animation, and display the kinetic words and note in their final positions.
- Preserve zoomable viewport behaviour and existing CTA `data-track` attributes.

## Scope

- Modify `ja/index.html`, `assets/css/ja-home.css`, and focused Japanese homepage/design-system tests.
- Reuse the existing French video asset; do not duplicate it.
- Remove the current hero image element from the Japanese hero but keep generated image files available in the workspace.
- Leave all sections after the instructor background strip unchanged.
