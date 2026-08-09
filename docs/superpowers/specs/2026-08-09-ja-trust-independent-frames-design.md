# Japanese Trust Strip Independent Frames Design

## Scope

Change only the visual framing of the four numbered trust-strip entries below the Japanese homepage hero. Preserve the existing `01` through `04` indexes, wording, order, typographic hierarchy, and responsive column counts.

## Visual Design

- Give each `.ja-trust__item` its own complete thin black border.
- Separate adjacent frames with white space so they read as four independent objects.
- Use a `16px` gap on desktop and an `8px` gap on mobile.
- Keep square corners, a white background, and no shadow.
- Keep all four frames at an equal height within each grid row.
- Remove the shared grid border and any adjoining divider treatment.

## Responsive Layout

- Desktop: four equal-width frames in one row.
- Mobile: two equal-width frames per row.
- Preserve the existing internal index and text spacing unless a small padding adjustment is needed to avoid clipping.
- Do not introduce horizontal overflow at `390px` viewport width.

## Constraints

- Do not alter the hero, header, CTA links, following sections, text content, or numbering.
- Do not add rounded corners, shadows, gray fills, decorative color, or a section label.
- Keep the existing monochrome Swiss/editorial direction.

## Verification

- Confirm each item has a complete independent border.
- Confirm gaps are `16px` on desktop and `8px` on mobile.
- Confirm desktop remains four columns and mobile remains two columns.
- Confirm all four frames have equal heights and no mobile overflow.
- Run the full repository test suite and inspect desktop and mobile previews.
