"""Tiny DSL -> MEI -> (SVG, MP3) via verovio + fluidsynth + lame.

Measure dict keys:
  rh / lh : event strings. tokens: pitch like c4, fs4 (sharp), bf3 (flat), en4 (natural)
            '/dur' ('1','2','4','8','4.' ...), '<p p>/dur' chords, 'r/dur' rests,
            suffix '!red' '!blue' '!gold' colors, suffix '~' starts a tie.
  chord   : "C" or [(beat,"C"),(3,"G7")]  chord symbols above
  rn      : [(beat,"I")]                  roman numerals below
  txt     : [(beat,"label")]              small text above
  invis / dbl : barline style on the right
"""
import verovio, subprocess, base64, os, re, tempfile

COL = {"red": "#CC2E1A", "blue": "#1F5FA8", "gold": "#8A6A12"}
_id = [0]
def nid():
    _id[0] += 1
    return f"e{_id[0]}"

TOK = re.compile(r'<[^>]+>\S*|\S+')
PIT = re.compile(r'([a-g])(ss|ff|s|f|n)?(\d)$')

def parse_events(src):
    out = []
    for t in TOK.findall(src):
        col = None
        tie = t.endswith('~')
        t = t.rstrip('~')
        if t.startswith('<'):
            body, rest = t[1:].split('>')
            if '!' in rest:
                rest, col = rest.split('!')
            d = rest.lstrip('/')
            out.append(("chord", body.split(), d, col, tie))
            continue
        if '!' in t:
            t, col = t.split('!')
        if False:
            pass
        else:
            p, d = t.split('/')
            out.append(("rest" if p == 'r' else "note", p, d, col, tie))
    return out

ACC_SEMI = {'': 0, 's': 1, 'f': -1, 'ss': 2, 'ff': -2, 'n': 0}
PC = {'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11}

def midi_num(tok):
    tok = tok.split('!')[0]
    pn, acc, o = PIT.fullmatch(tok).groups()
    return 12 * (int(o) + 1) + PC[pn] + ACC_SEMI[acc or '']

class Layer:
    """Writes one staff/layer of one measure, tracking accidental state."""
    def __init__(self, tie_in):
        self.state = {}
        self.tie_in = tie_in      # set of midi numbers tied from previous measure
        self.tie_out = set()
    def note(self, tok, dur, dots, col, inchord, tie):
        if '!' in tok:
            tok, col = tok.split('!')
        pn, acc, o = PIT.fullmatch(tok).groups()
        eff = '' if acc in (None, 'n') else acc
        key = (pn, o)
        m = midi_num(tok)
        attrs = f'pname="{pn}" oct="{o}"'
        tie_end = m in self.tie_in
        if tie_end:
            self.tie_in.discard(m)
            self.state[key] = eff
            if eff: attrs += f' accid.ges="{eff}"'
        elif eff != self.state.get(key, ''):
            attrs += f' accid="{eff or "n"}"'
            self.state[key] = eff
        elif eff:
            attrs += f' accid.ges="{eff}"'
        t = None
        if tie and tie_end: t = 'm'
        elif tie: t = 'i'
        elif tie_end: t = 't'
        if t: attrs += f' tie="{t}"'
        if tie: self.tie_in.add(m)
        d = '' if inchord else f' dur="{dur}"{dots}'
        c = f' color="{COL[col]}"' if col else ''
        return f'<note xml:id="{nid()}" {attrs}{d}{c}/>'
    def event(self, e):
        kind, p, d, col, tie = e
        dots = ' dots="1"' if d.endswith('.') else ''
        dur = d.rstrip('.')
        c = f' color="{COL[col]}"' if col else ''
        if kind == "rest":
            return f'<rest xml:id="{nid()}" dur="{dur}"{dots}/>'
        if kind == "note":
            return self.note(p, dur, dots, col, False, tie)
        inner = ''.join(self.note(x, dur, dots, None, True, tie) for x in p)
        return f'<chord xml:id="{nid()}" dur="{dur}"{dots}{c}>{inner}</chord>'

def _beats(d):
    v = 4 / int(d.rstrip('.'))
    return v * 1.5 if d.endswith('.') else v

def beamed(L, evs, meter):
    """Render events, wrapping runs of 8ths/16ths inside each half-bar (4/4) in <beam>."""
    group = 2.0 if meter == (4, 4) else 1.0 * meter[0] * 4 / meter[1]
    out, run, pos = [], [], 0.0
    def flush():
        if len(run) >= 2: out.append('<beam>' + ''.join(run) + '</beam>')
        else: out.extend(run)
        run.clear()
    for e in evs:
        b = _beats(e[2])
        short = e[0] != "rest" and e[2].rstrip('.') in ('8', '16')
        if run and int(pos // group) != int(run_start // group):
            flush()
        if short:
            if not run: run_start = pos
            run.append(L.event(e))
        else:
            flush()
            out.append(L.event(e))
        pos += b
    flush()
    return ''.join(out)

def build_mei(measures, meter=(4, 4), lh=True, tempo=92, showmeter=True):
    staffdefs = '<staffDef n="1" lines="5" clef.shape="G" clef.line="2"/>'
    if lh:
        staffdefs += '<staffDef n="2" lines="5" clef.shape="F" clef.line="4"/>'
    grp = (f'<staffGrp symbol="brace" bar.thru="true">{staffdefs}</staffGrp>' if lh
           else f'<staffGrp>{staffdefs}</staffGrp>')
    ms = []
    ties = {1: set(), 2: set()}
    for i, m in enumerate(measures):
        body = ''
        for n, key in ((1, "rh"), (2, "lh")):
            if n == 2 and not lh:
                continue
            L = Layer(ties[n])
            xml = beamed(L, parse_events(m.get(key, "r/1")), meter)
            ties[n] = set(L.tie_in)
            body += f'<staff n="{n}"><layer n="1">{xml}</layer></staff>'
        ctl = ''
        ch = m.get("chord")
        if ch:
            for beat, sym in (ch if isinstance(ch, list) else [(1, ch)]):
                ctl += f'<harm staff="1" tstamp="{beat}" place="above">{sym}</harm>'
        for beat, txt in (m.get("rn") or []):
            ctl += (f'<harm staff="{2 if lh else 1}" tstamp="{beat}" place="below">'
                    f'<rend fontstyle="normal">{txt}</rend></harm>')
        for beat, txt in (m.get("txt") or []):
            ctl += (f'<dir staff="1" tstamp="{beat}" place="above">'
                    f'<rend fontsize="small" fontstyle="normal">{txt}</rend></dir>')
        if i == len(measures) - 1: right = ' right="end"'
        elif m.get("invis"): right = ' right="invis"'
        elif m.get("dbl"): right = ' right="dbl"'
        else: right = ''
        sb = '<sb/>' if m.get("sb") else ''
        ms.append(f'{sb}<measure n="{i+1}"{right}>{body}{ctl}</measure>')
    mv = '' if showmeter else ' meter.visible="false"'
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0"><meiHead><fileDesc><titleStmt><title/></titleStmt><pubStmt/></fileDesc></meiHead>
<music><body><mdiv><score><scoreDef meter.count="{meter[0]}" meter.unit="{meter[1]}"{mv} keysig="0" mnum.visible="false" midi.bpm="{tempo}">{grp}</scoreDef>
<section>{''.join(ms)}</section></score></mdiv></body></music></mei>'''

def render(mei, width=2200, scale=45, breaks="auto", spacing=(0.3, 0.55)):
    tk = verovio.toolkit()
    tk.setOptions({"pageWidth": width, "scale": scale, "adjustPageHeight": True,
                   "adjustPageWidth": True, "breaks": breaks,
                   "svgViewBox": True, "svgRemoveXlink": True, "header": "none", "footer": "none",
                   "pageMarginLeft": 30, "pageMarginRight": 30, "pageMarginTop": 30, "pageMarginBottom": 30,
                   "spacingLinear": spacing[0], "spacingNonLinear": spacing[1]})
    if not tk.loadData(mei):
        raise RuntimeError("verovio load failed")
    if tk.getPageCount() != 1:
        raise RuntimeError("more than one page")
    svg = tk.renderToSVG(1)
    midi = base64.b64decode(tk.renderToMIDI())
    return svg, midi

def to_mp3(midi_bytes):
    d = tempfile.mkdtemp()
    mid, wav, mp3 = (os.path.join(d, x) for x in ("a.mid", "a.wav", "a.mp3"))
    open(mid, "wb").write(midi_bytes)
    subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "44100", "-F", wav,
                    "/usr/share/sounds/sf2/FluidR3_GM.sf2", mid], check=True, capture_output=True)
    subprocess.run(["lame", "--quiet", "-m", "m", "-b", "56", wav, mp3], check=True)
    return open(mp3, "rb").read()
