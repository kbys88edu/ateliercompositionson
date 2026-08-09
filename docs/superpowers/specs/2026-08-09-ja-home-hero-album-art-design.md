# Japanese Homepage Hero: Electroacoustic Album Artwork

## Goal

Replace the current portrait-led homepage hero with an anonymous, contemporary collage that could plausibly serve as the cover of an international electroacoustic music release. The result must remain welcoming enough for a lesson website while avoiding stock-photo and AI-portrait cues.

## Focal Subject

- Show one adult woman performing with a modular synthesizer.
- Frame her in side profile or from a three-quarter rear angle.
- Obscure or fragment part of the face with waveform slices, scan lines, spectral light, or controlled digital displacement.
- Keep the hands, patch cables, knobs, and modular synthesizer legible so the image still communicates sound creation.
- Treat the performer as one layer of the collage rather than as a centered portrait.

## Visual Language

- Use a seamless pure-white background that blends into the website.
- Build the image primarily from neutral black, white, and cool gray.
- Introduce rainbow color through optical interference, spectral refraction, translucent light bands, and subtle chromatic aberration.
- Keep the color luminous and restrained within the monochrome composition.
- Use fine grids, waveform fragments, spectrogram traces, score fragments, patch cables, and precise digital glitch structures.
- Prefer asymmetry, layered depth, negative space, and cropped forms associated with contemporary experimental-music packaging.

## Avoid

- A clearly visible front-facing face or conventional lifestyle portrait.
- Literal gemstone imagery as the main color device.
- Beige, cream, sepia, paper grain, distressed ink, retro halftone aging, VHS nostalgia, vaporwave, or 1970s/1980s styling.
- Cyberpunk neon overload, generic DJ imagery, stage lighting, text, logos, watermarks, and extra people.

## Responsive Composition

- Keep the performer and the main modular instrument within the centered 4:3 safe area used on mobile.
- Allow peripheral cables, grids, and spectral fragments to crop on mobile without losing the subject.
- Preserve a wide 16:9 desktop composition with enough white space to feel integrated into the page.

## Integration And Verification

- Generate a new non-destructive asset derived from the current hero and save it as `images/acs-home-hero-v3.png`.
- Update `ja/index.html` and the homepage image-contract test to reference the new asset and accurate intrinsic dimensions.
- Preserve the current desktop vertical alignment and tablet/mobile ordering.
- Verify the asset path, responsive image contract, and internal references with the existing automated tests.
