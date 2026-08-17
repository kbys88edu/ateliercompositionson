# Atelier Composition Son - French Site Restructure Design

**Date:** 2026-08-17  
**Scope:** French pages only (`/fr/`)  
**Status:** Approved through the user's implementation brief

## Positioning

The French site presents Atelier Composition Son as a professional online atelier
for composition and sound creation. The visitor's own score, sound, recording,
sketch, or DAW session is the starting point. MAO remains visible for search and
technical context, but it is not the brand's main category.

Primary language:

- composition
- création sonore
- pratiques électroacoustiques
- accompagnement de projet
- écriture, analyse, timbre, forme
- Max/MSP and technologies musicales

## Information Architecture

The French homepage has six primary sections:

1. Hero
2. Trois résultats concrets
3. Formats d'accompagnement
4. Méthode de travail
5. Expérience, œuvres et domaines de pratique
6. Ressources et premier contact

The 19€, 29€, and 70€ offers form a clear progression from autonomous material,
to one focused written response, to a live individual session. The free contact
route remains available as a secondary reassurance path.

## Visual Direction

Retain the existing monochrome, editorial, restrained language. Use one verified
real photograph in the hero and actual product pages in the kit preview. Use
rules, spacing, typographic contrast, and asymmetric editorial layouts instead of
decorative gradients, glass panels, oversized rounded cards, or motion effects.

## French-only Isolation

New styling and behavior live in `assets/css/fr-site.css`,
`assets/js/fr-site.js`, and `assets/js/fr-tracking.js`, loaded only by French
pages. The shared header renderer keeps an explicit `fr` configuration. Japanese
content and Japanese page styles are not edited.

## Measurement

French links use a single explicit event vocabulary:

- `click_primary_cta`
- `click_secondary_cta`
- `view_offer`
- `begin_booking`
- `submit_booking`
- `request_feedback`
- `click_gumroad`
- `download_sample`
- `play_work`

Every event includes `locale=fr`, `page_type`, `offer`, `cta_position`, and
`traffic_source`. One French-only delegated handler owns click tracking to avoid
duplicate events.

## Privacy Boundary

The privacy page states only facts supported by the existing terms and the actual
providers in use. Exact retention duration and transfer safeguards remain marked
for legal confirmation instead of being guessed.

