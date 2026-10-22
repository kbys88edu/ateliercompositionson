# -*- coding: utf-8 -*-
"""Atelier Composition Son — Instagram reel (15 s): the score.

One score drives both the sound and the picture. This script synthesises the audio (numpy only)
and writes `features.js`, the per-frame parameters the WebGL page reads, so every visual event
is locked to a real musical event:

  - partial k enters      -> the Chladni figure (k-1, k) appears (octave 1:2, fifth 2:3, fourth 3:4 ...)
  - 2nd voice beats       -> the nodal lines drift at the beat frequency (a pure tone is one nodal line)
  - Plomp-Levelt roughness-> how violently the sand is shaken; consonance lets it settle
  - 3:2 lock (E4 over A3) -> the figure freezes on Chladni mode (2, 3)
  - tam-tam + frozen slices (musique concrete) -> inversion to dark, stroboscopic stop-motion

python3 score.py   ->  out/audio.wav, features.js
"""
import json, os, wave
import numpy as np

SR, FPS, DUR = 48000, 30, 15.0
N = int(SR * DUR)
F0 = 220.0                                    # A3
HERE = os.path.dirname(os.path.abspath(__file__))

# ---- timeline (seconds) ----------------------------------------------------------------
PARTIAL_T = [0.0, 3.0, 3.9, 4.8, 5.7, 6.4]    # when partial 1..6 of A3 enters
B_IN, B_GLIDE0, B_GLIDE1 = 7.0, 8.3, 9.6      # 2nd voice: enters 3 Hz sharp, glides up to a pure fifth
B_START, B_END = 223.0, 330.0                 # Hz  (223 = 3 Hz beating against 220;  330 = 3:2)
STRIKE, DARK_OUT0, DARK_OUT1 = 10.0, 11.5, 11.5    # hard cut back to paper
CTA_T = 11.9                                  # the downbeat: '30分' lands with the chord
CTA_HITS = [11.9, 12.18]                      # '30分', '無料相談'
EVENTS = [10.0, 10.22, 10.40, 10.52, 10.74, 10.86, 10.98, 11.10, 11.20, 11.30, 11.38]   # stop-motion fires
RNG = np.random.default_rng(1108)

t = np.arange(N) / SR

def ramp(x, t0, dur):                          # smoothstep 0 -> 1
    u = np.clip((x - t0) / dur, 0, 1); return u * u * (3 - 2 * u)

def duck_env(x):                               # the tonal bed gives way to the strike, comes back after
    d = 1 - 0.9 * ramp(x, STRIKE - 0.02, 0.06)
    d = d * (1 - ramp(x, DARK_OUT0 - 0.03, 0.03))                 # a breath of silence after the cut ...
    return d + ramp(x, CTA_T - 0.004, 0.008)                      # ... then the full chord on the downbeat

# ---- tonal bed ---------------------------------------------------------------------------
def fB_of(x):                                  # 2nd voice frequency (log glide after the beating hold)
    g = ramp(x, B_GLIDE0, B_GLIDE1 - B_GLIDE0)
    return B_START * (B_END / B_START) ** g

def gains_A(x):
    return [ramp(x, PARTIAL_T[k], 0.35 if k else 0.9) / (k + 1) ** 0.9 for k in range(6)]

def gain_B(x):
    return 0.8 * ramp(x, B_IN, 0.6)

def stereo(sig, pan):                          # pan -1..1, equal power
    a = (pan + 1) * np.pi / 4; return np.stack([sig * np.cos(a), sig * np.sin(a)], 1)

def tonal_bed():
    out = np.zeros((N, 2))
    gA = gains_A(t)
    for k in range(6):
        out += stereo(np.sin(2 * np.pi * F0 * (k + 1) * t) * gA[k], -0.3 if k % 2 == 0 else 0.3)
    fB = fB_of(t); phB = 2 * np.pi * np.cumsum(fB) / SR; gB = gain_B(t)
    for k in range(4):
        out += stereo(np.sin((k + 1) * phB) * gB / (k + 1) ** 1.1, 0.2)
    # the tonic is settled by a major third (5:2 over A3 = C#5) and a bell on A5 when the call to action opens
    g3 = ramp(t, CTA_T - 0.004, 0.008) * (0.55 + 0.45 * np.exp(-np.maximum(t - CTA_T, 0) / 0.5))
    out += stereo(np.sin(2 * np.pi * 550 * t) * 0.28 * g3, -0.15)
    out += stereo(np.sin(2 * np.pi * 1100 * t) * 0.06 * g3, 0.15)
    return out

# ---- musique concrete: tam-tam, riser, frozen slices ------------------------------------
def stft_filter(x, mask_fn, nfft=2048, hop=512):
    w = np.hanning(nfft); y = np.zeros(len(x) + nfft); norm = np.zeros(len(x) + nfft)
    fr = np.fft.rfftfreq(nfft, 1 / SR)
    for s in range(0, len(x), hop):
        seg = np.zeros(nfft); chunk = x[s:s + nfft]; seg[:len(chunk)] = chunk
        spec = np.fft.rfft(seg * w) * mask_fn(fr, (s + nfft / 2) / SR)
        y[s:s + nfft] += np.fft.irfft(spec) * w; norm[s:s + nfft] += w * w
    return (y / np.maximum(norm, 1e-9))[:len(x)]

def riser():
    x = RNG.standard_normal(N)
    cut = lambda tt: 250 * (9000 / 250) ** np.clip((tt - 8.6) / 1.4, 0, 1)
    y = stft_filter(x, lambda fr, tt: 1 / (1 + (fr / cut(tt)) ** 4) * (fr > 180))
    env = ramp(t, 8.6, 1.4) ** 2.2 * (t < STRIKE + 0.01)
    return stereo(y, 0) * (env[:, None] * 0.0) + np.stack([y * env, np.roll(y, 977) * env], 1)

def tamtam(t0, gain):
    out = np.zeros((N, 2)); i0 = int(t0 * SR); tt = t[:N - i0]
    ratios = [1, 1.593, 2.136, 2.296, 2.653, 3.156, 3.601, 4.23, 5.4, 6.7]
    for i, r in enumerate(ratios):
        f = 98.0 * r * (1 + 0.003 * RNG.standard_normal())
        env = np.exp(-tt / (4.0 / (1 + 0.45 * i))) * (1 - np.exp(-tt / 0.012))
        sig = np.sin(2 * np.pi * f * tt + RNG.uniform(0, 6.28)) * env * gain / (1 + 0.5 * i)
        out[i0:] += stereo(sig, RNG.uniform(-0.6, 0.6))
    thump = np.sin(2 * np.pi * (40 + 45 * np.exp(-tt / 0.08)) * tt) * np.exp(-tt / 0.5) * gain * 1.6
    out[i0:] += stereo(thump, 0)
    nz = RNG.standard_normal(len(tt)) * np.exp(-tt / 0.07) * gain * 0.9
    nz = stft_filter(nz, lambda fr, _: 1 / (1 + (fr / 5500) ** 2))
    out[i0:, 0] += nz; out[i0:, 1] += np.roll(nz, 211)
    return out

def frozen_slices(bed):
    """Short slices of the piece's own tonal material, re-pitched and cut off hard (the repo's 'frozen source slices')."""
    out = np.zeros((N, 2)); ratios = [0.5, 1, 1.5, 2, 3, 4, 0.75, 2.5, 1, 3, 6]
    for j, te in enumerate(EVENTS[1:]):
        L = int(RNG.uniform(0.05, 0.11) * SR); src_t = RNG.uniform(5.0, 9.4)
        r = ratios[j % len(ratios)]; m = int(L * r) + 2; s0 = int(src_t * SR)
        seg = bed[s0:s0 + m]; idx = np.linspace(0, len(seg) - 1, L)
        res = np.stack([np.interp(idx, np.arange(len(seg)), seg[:, c]) for c in (0, 1)], 1)
        win = np.hanning(2 * L)[:L] ** 0.4 * np.linspace(1, 0.15, L) ** 1.2          # hard front, cut tail
        click = RNG.standard_normal(L) * np.exp(-np.arange(L) / (0.004 * SR)) * 0.5
        click = stft_filter(click, lambda fr, _: (fr > 2500) * 1.0)
        g = (1.3 - 0.6 * j / len(EVENTS)) * (0.7 + 0.3 * RNG.random())
        i0 = int(te * SR); pan = RNG.uniform(-0.8, 0.8)
        out[i0:i0 + L] += (res * win[:, None] * 1.4 + stereo(click, pan)) * g
    return out

def reverb(x, rt_long=3.0, rt_short=0.9, wet=0.3):
    n = int(SR * 3.2); tt = np.arange(n) / SR; ir = np.zeros((n, 2))
    for c in range(2):
        a = RNG.standard_normal(n) * np.exp(-6.9 * tt / rt_long); a = np.convolve(a, np.ones(7) / 7, 'same')
        b = RNG.standard_normal(n) * np.exp(-6.9 * tt / rt_short) * 0.5
        ir[:, c] = a + b
    ir /= np.sqrt((ir ** 2).sum(0).max()); L = 1 << (int(np.ceil(np.log2(N + n))))
    y = np.zeros_like(x)
    for c in range(2):
        y[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], L) * np.fft.rfft(ir[:, c], L), L)[:N]
    return x * (1 - wet * 0.5) + y * wet * 2.2

def build_audio():
    bed = tonal_bed()
    strike = tamtam(STRIKE, 0.32)
    cta = np.zeros((N, 2))
    for j, th in enumerate(CTA_HITS):                                           # each word lands on a hit
        i0 = int(th * SR); tt = t[:N - i0]; att = 1 - np.exp(-tt / 0.003)
        if j == 0:
            boom = np.sin(2 * np.pi * (48 + 60 * np.exp(-tt / 0.05)) * tt) * np.exp(-tt / 0.45) * 0.9
            cta[i0:] += stereo(boom * att, 0)
            cta[i0:] += stereo(np.sin(2 * np.pi * 440 * tt) * np.exp(-tt / 1.6) * att * 0.16, -0.1)
        else:
            cta[i0:] += stereo(np.sin(2 * np.pi * 880 * tt) * np.exp(-tt / 1.4) * att * 0.2, 0.15)
            cta[i0:] += stereo(np.sin(2 * np.pi * 1320 * tt) * np.exp(-tt / 0.9) * att * 0.07, -0.2)
    gate = (1 - ramp(t, DARK_OUT0 - 0.02, 0.02))[:, None]                        # the concrete material is cut dead with the picture
    concrete = reverb(riser() * 0.22 + strike + frozen_slices(bed * 0.2) * 0.8) * gate
    mix = reverb(bed * duck_env(t)[:, None] * 0.2 + cta) + concrete
    mix *= ramp(t, 0, 0.08)[:, None] * (1 - ramp(t, DUR - 0.55, 0.55))[:, None]       # clean in/out (loops quietly)
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    mix *= 0.7 / np.abs(mix).max()
    return mix

# ---- features for the picture ------------------------------------------------------------
def roughness(fa, aa, fb, ab):                 # Plomp-Levelt, Sethares' parametrisation: A-partials vs B-partials
    r = 0.0
    for f1, a1 in zip(fa, aa):
        for f2, a2 in zip(fb, ab):
            lo, d = min(f1, f2), abs(f1 - f2); s = 0.24 / (0.0207 * lo + 18.96)
            r += a1 * a2 * (np.exp(-3.5 * s * d) - np.exp(-5.75 * s * d))
    return r

def features(mix):
    n = int(DUR * FPS); win = int(0.06 * SR); mono = mix.mean(1); frames = []
    lvl = []
    for i in range(n):
        c = int((i / FPS) * SR); seg = mono[max(0, c - win):c + win]
        lvl.append(20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9))
    lvl = np.clip((np.array(lvl) + 52) / 36, 0, 1)
    sm = lvl.copy()
    for i in range(1, n): sm[i] = max(lvl[i], sm[i - 1] * 0.8)                     # quick attack, short release
    rough = []
    for i in range(n):
        x = i / FPS; fB = float(fB_of(x)); gA = gains_A(x); gB = float(gain_B(x))
        fa = [F0 * (k + 1) for k in range(6)]; aa = [float(g) for g in gA]
        fb = [fB * (k + 1) for k in range(4)]; ab = [gB / (k + 1) ** 1.1 for k in range(4)]
        rough.append(roughness(fa, aa, fb, ab))
    rough = np.array(rough); rough = rough / rough.max()
    phi, ph = [], 0.0
    for i in range(n):                                                          # visual beat phase (aliasing-safe)
        x = i / FPS; df = float(fB_of(x)) - F0; ratio = float(fB_of(x)) / F0
        lock = float(ramp(x, B_GLIDE1 - 0.55, 0.5)) if x >= B_GLIDE0 else 0.0
        rate = 1.0 * np.tanh(df / 3.0) * (1 - lock) * float(ramp(x, B_IN, 0.6))
        ph += 2 * np.pi * rate / FPS; phi.append(ph)
    phi = np.array(phi)
    for i in range(n):                                                          # land on a multiple of 2pi when locked
        x = i / FPS
        if x >= B_GLIDE1 - 0.5:
            k = np.round(phi[i] / (2 * np.pi)); w = float(ramp(x, B_GLIDE1 - 0.55, 0.5))
            phi[i] = phi[i] + w * (k * 2 * np.pi - phi[i])
    for i in range(n):
        x = i / FPS; fB = float(fB_of(x))
        frames.append({
            "t": round(x, 4), "lv": round(float(sm[i]), 4),
            "pk": [round(float(g) * (k + 1) ** 0.9, 4) for k, g in enumerate(gains_A(x))],
            "b": round(float(gain_B(x)) / 0.8, 4), "fB": round(fB, 2),
            "df": round(fB - F0, 2), "R": round(float(rough[i]), 4), "ph": round(float(phi[i]), 4),
        })
    return frames

def write_wav(path, mix):
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    mix = build_audio(); write_wav(os.path.join(HERE, 'out', 'audio.wav'), mix)
    fr = features(mix)
    tl = {"fps": FPS, "dur": DUR, "f0": F0, "partialT": PARTIAL_T, "bIn": B_IN, "bGlide0": B_GLIDE0, "bGlide1": B_GLIDE1,
          "strike": STRIKE, "darkOut0": DARK_OUT0, "darkOut1": DARK_OUT1, "cta": CTA_T, "ctaHits": CTA_HITS, "events": EVENTS}
    with open(os.path.join(HERE, 'features.js'), 'w') as f:
        f.write('window.TL=' + json.dumps(tl) + ';\nwindow.FEAT=' + json.dumps(fr, separators=(',', ':')) + ';\n')
    print('audio + features written;', len(fr), 'frames; peak', float(np.abs(mix).max()))
