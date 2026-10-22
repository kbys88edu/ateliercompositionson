# Instagram reel (15 s, 1080×1920) — Atelier Composition Son

Sound and picture are built from one score (`score.py`), so every visual event is a musical event:

| time | sound | picture (Chladni sand on a plate) |
|---|---|---|
| 0–3 s | pure tone A3 (220 Hz) | the sand gathers on a single nodal line |
| 3–7 s | partials 2…6 of the harmonic series enter | each partial *k* turns the figure into Chladni mode (k−1, k): the ratio n:m is the figure (n, m) — octave 1:2, fifth 2:3, fourth 3:4 … |
| 7–10 s | a second voice beats 3 Hz sharp, then glides up to E4 (3:2) | the nodal lines drift at the beat rate; Plomp–Levelt roughness shakes the sand; at the pure fifth the figure locks on mode (2,3) |
| 10–11.5 s | tam-tam + frozen slices of the piece's own material (musique concrète) | inversion to black, stroboscopic stop-motion (multiple exposure), thin-film colour |
| 11.5–15 s | resolution on A3 + E4 + C♯5, bell on A5 | back to paper; the fifth stays; call to action |

The effects are ports of ideas from `empreintes-gen` (Chladni sand, soap/thin film, photodynamism stroboscope, musique-concrète slices) to WebGL2, because Max/Jitter can't run in the cloud.

## Rebuild
```
python3 score.py          # out/audio.wav + features.js (numpy only)
node render.mjs           # out/reel.mp4 (headless Chromium + ffmpeg, ~5 min, software GL)
STILLS=300,330 node render.mjs   # just the stills
```
Needs `playwright` (Chromium) and `ffmpeg`. Frames must render in order (the sand has memory).
Audio is normalised to about −14 LUFS at encode. Text lives in `reel.html` (`#brand`, `#sub`, `#pillT`, `#url`).
