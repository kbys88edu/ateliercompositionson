# Performance Hero Photo Design

## Purpose

Replace the Japanese and French home-page documentary studio hero with the supplied real performance photograph while keeping the approved split layout and CTA hierarchy.

## Composition

- Desktop uses a square crop that removes part of the empty black area above the subject while retaining Sachie Kobayashi, the extended hand, the Yamaha equipment, and the connected audio hardware.
- Mobile uses a narrower 4:5 crop anchored to the left so the subject and working equipment appear immediately after the copy and CTAs.
- The photo is not recolored, retouched, or overlaid with text.

## Delivery

- Desktop: AVIF, WebP, and PNG fallback.
- Mobile: AVIF and WebP.
- Both language pages preload the viewport-appropriate AVIF and use the same responsive `picture` contract.
- Alt text describes the actual performance and audio-equipment scene in each language.

## Verification

- Automated tests lock the new asset paths and alt text.
- Browser checks cover desktop and mobile layout, image visibility, intrinsic loading, and horizontal overflow.
