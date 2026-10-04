"""Verify that every chord's written notes belong to its chord symbol."""
import re
from engrave import parse_events, midi_num

ROOT = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
QUAL = [  # longest first
    ('m7(♭5)', [0,3,6,10]), ('m△7', [0,3,7,11]), ('dim7', [0,3,6,9]), ('dim', [0,3,6]),
    ('m6', [0,3,7,9]), ('m7', [0,3,7,10]), ('△7(♯5)', [0,4,8,11]), ('△7', [0,4,7,11]),
    ('7sus4', [0,5,7,10]), ('sus4', [0,5,7]), ('aug', [0,4,8]), ('7', [0,4,7,10]), ('6', [0,4,7,9]),
    ('m', [0,3,7]), ('', [0,4,7])]
TENS = {'9':2,'♭9':1,'♯9':3,'11':5,'♯11':6,'13':9,'♭13':8,'♭5':6,'♯5':8}

def pcs(sym):
    m = re.fullmatch(r'([A-G])([♭♯]?)(.*?)(?:/([A-G])([♭♯]?))?', sym)
    r, acc, rest, b, bacc = m.groups()
    root = (ROOT[r] + {'':0,'♭':-1,'♯':1}[acc]) % 12
    tens = re.findall(r'\(([^)]*)\)', rest)
    base = re.sub(r'\([^)]*\)', '', rest)
    if rest.startswith('m7(♭5)'):
        base, tens = 'm7(♭5)', tens[1:]
    if rest.startswith('△7(♯5)'):
        base, tens = '△7(♯5)', tens[1:]
    iv = dict(QUAL)[base]
    s = {(root + i) % 12 for i in iv}
    for grp in tens:
        for t in grp.split('/'):
            if t == '♯5': s.discard((root+7) % 12)
            if t == '♭5': s.discard((root+7) % 12)
            s.add((root + TENS[t]) % 12)
    if b:
        s.add((ROOT[b] + {'':0,'♭':-1,'♯':1}[bacc]) % 12)
    return s

def beats(d):
    v = 4 / int(d.rstrip('.'))
    return v * 1.5 if d.endswith('.') else v

def check_fig(fid, spec):
    """returns list of problems"""
    probs = []
    meter = spec.get("meter", (4, 4))
    cap = meter[0] * 4 / meter[1]
    for i, m in enumerate(spec["measures"]):
        for key in ("rh", "lh"):
            if key == "lh" and not spec.get("lh", True):
                continue
            evs = parse_events(m.get(key, "r/1"))
            tot = sum(beats(e[2]) for e in evs)
            if abs(tot - cap) > 1e-6:
                probs.append(f"{fid} m{i+1} {key}: {tot} beats")
        ch = m.get("chord")
        if not ch or spec.get("check") == "none":
            continue
        chords = ch if isinstance(ch, list) else [(1, ch)]
        for idx, (beat, sym) in enumerate(chords):
            end = chords[idx+1][0] if idx+1 < len(chords) else cap + 1
            allowed = pcs(sym)
            for key in ("rh", "lh"):
                if key == "rh" and spec.get("check") == "lh":
                    continue
                if key == "lh" and not spec.get("lh", True):
                    continue
                pos = 1.0
                for kind, p, d, col, tie in parse_events(m.get(key, "r/1")):
                    if beat <= pos < end and kind != "rest":
                        notes = p if kind == "chord" else [p]
                        for n in notes:
                            if midi_num(n) % 12 not in allowed:
                                probs.append(f"{fid} m{i+1} {sym}: {n} not in chord")
                    pos += beats(d)
    return probs
