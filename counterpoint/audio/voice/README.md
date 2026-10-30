# Voice sample folders

Female (`female/`):
C4.wav, G4.wav, C5.wav, G5.wav

Male (`male/`):
C3.wav, G3.wav, C4.wav, G4.wav

The note lists in each module script (`SAMPLE_VOICE_SETS`) must match the files here.
Modules 2–4 live one folder deeper, so they load samples from `../audio/voice`.

Playback behavior:
- No global octave-down transposition for soprano/female.
- Written G4 plays female/G4.wav at playbackRate 1.0.
- Written A4/B4 use the G4 sample region instead of jumping to C5.
- Written C5 and above use the C5/G5 sample region.
- If a sample cannot be loaded, the synthesized voice is used instead.
