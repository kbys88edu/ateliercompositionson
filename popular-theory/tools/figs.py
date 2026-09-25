# All examples are original, written for this page.
R, B, G = "!red", "!blue", "!gold"

def prog(bars, top="rh"):
    """bars: list of lists of (sym, rh_notes, lh_notes, rn, colors dict opt)."""
    out = []
    for bar in bars:
        n = len(bar)
        d = {1: "1", 2: "2", 4: "4"}[n]
        m = {"chord": [], "rn": [], "rh": "", "lh": ""}
        for k, item in enumerate(bar):
            sym, rh, lh, rn = item[:4]
            opt = item[4] if len(item) > 4 else {}
            beat = 1 + k * (4 // n)
            m["chord"].append((beat, sym))
            if rn: m["rn"].append((beat, rn))
            rc = opt.get("rc", "")
            m["rh"] += f"<{rh}>/{d}{rc} " if " " in rh else f"{rh}/{d}{rc} "
            lc = opt.get("lc", "")
            m["lh"] += f"<{lh}>/{d}{lc} " if " " in lh else f"{lh}/{d}{lc} "
        out.append(m)
    return out

FIGS = {}
def fig(fid, caption, measures, **kw):
    FIGS[fid] = dict(caption=caption, measures=measures, **kw)

# ---------- 1 譜面 ----------
names = "C D E F G A B C".split()
fig("staff", "<b>大譜表</b> — 上がト音記号（右手）、下がヘ音記号（左手）。<b style=\"color:var(--red)\">赤</b>が中央のド（C4）。",
    [{"rh": f"c4/4{R} d4/4 e4/4 f4/4", "lh": "c3/4 d3/4 e3/4 f3/4", "invis": 1,
      "txt": [(1, "C4"), (2, "D"), (3, "E"), (4, "F")]},
     {"rh": "g4/4 a4/4 b4/4 c5/4", "lh": "g3/4 a3/4 b3/4 c4/4" + R,
      "txt": [(1, "G"), (2, "A"), (3, "B"), (4, "C5")]}],
    showmeter=False, tempo=100)

fig("beat_bad", "<b>読みにくい書き方</b> — 3拍目の頭が音符の中に隠れている（<b style=\"color:#8A6A12\">茶色</b>）。",
    [{"rh": f"g4/4 e5/8 d5/4.{G} c5/4"}, {"rh": f"a4/4. g4/4.{G} r/4"}], lh=False, tempo=96)
fig("beat_good", "<b>読みやすい書き方</b> — 同じリズムを、3拍目の頭が見えるようにタイで書き直したもの。",
    [{"rh": f"g4/4 e5/8 d5/8~ d5/4 c5/4"}, {"rh": f"a4/4. g4/8~ g4/4 r/4"}], lh=False, tempo=96)

# ---------- 2 音程・コード ----------
ints = [("完全1", "c4"), ("短2", "df4"), ("長2", "d4"), ("短3", "ef4"), ("長3", "e4"), ("完全4", "f4"),
        ("増4", "fs4"), ("完全5", "g4"), ("短6", "af4"), ("長6", "a4"), ("短7", "bf4"), ("長7", "b4"), ("完全8", "c5")]
ms = []
for k, (lab, p) in enumerate(ints):
    col = R if lab in ("短3", "長3") else ""
    ms.append({"rh": f"<c4 {p}>/1{col}", "txt": [(1, lab)], "invis": 1})
fig("intervals", "<b>C4 から数えた音程</b> — <b style=\"color:var(--red)\">赤</b>の短3度・長3度が、コードの明るさ・暗さを決める音程。",
    ms, lh=False, showmeter=False, tempo=150, width=1500, check="none")

fig("triads", "<b>3和音の4種類</b> — 違いは3rd と 5th だけ。変わった音を<b style=\"color:var(--red)\">赤</b>で示す。",
    [{"chord": "C", "rh": "<c4 e4 g4>/1", "invis": 1},
     {"chord": "Cm", "rh": f"<c4 ef4{R} g4>/1", "invis": 1},
     {"chord": "Caug", "rh": f"<c4 e4 gs4{R}>/1", "invis": 1},
     {"chord": "Cdim", "rh": f"<c4 ef4{R} gf4{R}>/1"}],
    lh=False, showmeter=False, tempo=80)

sev = [("C△7", "c4 e4 g4 b4"), ("C7", "c4 e4 g4 bf4"), ("C6", "c4 e4 g4 a4"), ("Cm7", "c4 ef4 g4 bf4"),
       ("Cm△7", "c4 ef4 g4 b4"), ("Cm6", "c4 ef4 g4 a4"), ("Cm7(♭5)", "c4 ef4 gf4 bf4"),
       ("Cdim7", "c4 ef4 gf4 a4"), ("C7sus4", "c4 f4 g4 bf4"), ("C△7(♯5)", "c4 e4 gs4 b4")]
fig("sevenths", "<b>よく使う4和音10種</b> — すべてルート C。上の6つは「3和音＋1音」、下の4つは形が特殊なもの。",
    [{"chord": s, "rh": f"<{n}>/1", "invis": 1} for s, n in sev],
    lh=False, showmeter=False, tempo=110, width=1500)

fig("inversions", "<b>転回形</b> — 同じ C でも、一番下の音が変わると響きが変わる。スラッシュの右が一番下の音。",
    [{"chord": "C", "rh": "<c4 e4 g4>/1", "invis": 1},
     {"chord": "C/E", "rh": "<e4 g4 c5>/1", "invis": 1},
     {"chord": "C/G", "rh": "<g4 c5 e5>/1"}],
    lh=False, showmeter=False, tempo=80)

# ---------- 3 スケール ----------
fig("major_scale", "<b>C メジャー・スケール</b> — 全・全・<b style=\"color:var(--red)\">半</b>・全・全・全・<b style=\"color:var(--red)\">半</b>。半音の2か所（E–F と B–C）を赤で示す。",
    [{"rh": f"c4/4 d4/4 e4/4{R} f4/4{R} g4/4 a4/4 b4/4{R} c5/4{R}",
      "txt": [(1.5, "全"), (2.5, "全"), (3.5, "半"), (4.5, "全"), (5.5, "全"), (6.5, "全"), (7.5, "半")]}],
    lh=False, showmeter=False, tempo=100, meter=(8, 4))

fig("minor_scales", "<b>A マイナーの3種類</b> — 左からナチュラル、ハーモニック、メロディック（上行）。<b style=\"color:var(--red)\">赤</b>がナチュラルから半音上げた音。",
    [{"rh": "a3/8 b3/8 c4/8 d4/8 e4/8 f4/8 g4/8 a4/8", "txt": [(1, "ナチュラル")]},
     {"rh": f"a3/8 b3/8 c4/8 d4/8 e4/8 f4/8 gs4/8{R} a4/8", "txt": [(1, "ハーモニック")]},
     {"rh": f"a3/8 b3/8 c4/8 d4/8 e4/8 fs4/8{R} gs4/8{R} a4/8", "txt": [(1, "メロディック")]}],
    lh=False, showmeter=False, tempo=110, check="none")

# ---------- 4 長調のダイアトニック ----------
dia = [("C△7", "c4 e4 g4 b4", "I△7"), ("Dm7", "d4 f4 a4 c5", "IIm7"), ("Em7", "e4 g4 b4 d5", "IIIm7"),
       ("F△7", "f4 a4 c5 e5", "IV△7"), ("G7", "g4 b4 d5 f5", "V7"), ("Am7", "a4 c5 e5 g5", "VIm7"),
       ("Bm7(♭5)", "b4 d5 f5 a5", "VIIm7(♭5)")]
fig("diatonic", "<b>C メジャーのダイアトニック・コード</b> — スケールの音だけを3度で積んだ7つ。下はローマ数字の呼び方。",
    [{"chord": s, "rh": f"<{n}>/1", "rn": [(1, r)], "invis": 1} for s, n, r in dia],
    lh=False, showmeter=False, tempo=110, width=1500)

C_ = ("C", "e4 g4 c5", "c3", "I")
G7_ = ("G7", "f4 g4 b4", "g2", "V7", {"rc": ""})
F_ = ("F", "f4 a4 c5", "f2", "IV")
fig("cad_d", "<b>① ドミナント終止</b>（T → D → T）— G7 の <b style=\"color:var(--red)\">B と F</b> が、C の C と E へ半音で落ち着く。",
    [{"chord": [(1, "C"), (3, "G7")], "rn": [(1, "I"), (3, "V7")], "rh": f"<e4 g4 c5>/2 <f4{R} g4 b4{R}>/2", "lh": "c3/2 g2/2"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1"}], tempo=72, spacing=(0.9, 0.55))
fig("cad_sd", "<b>② サブドミナント終止</b>（T → SD → T）— 教会の「アーメン」の響き。ドミナントより穏やか。",
    prog([[C_, F_], [C_]]), tempo=72, spacing=(0.9, 0.55))
fig("cad_sdd", "<b>③ サブドミナント → ドミナント</b>（T → SD → D → T）— 静→展開→緊張→解決。いちばん基本の流れ。",
    prog([[C_, F_], [G7_, C_]]), tempo=72, spacing=(0.9, 0.55))
fig("cad_dsd", "<b>④ ドミナント → サブドミナント</b>（T → D → SD → T）— クラシックでは避けられるが、ロックやポップスでは定番。",
    prog([[C_, G7_], [F_, C_]]), tempo=72, spacing=(0.9, 0.55))

fig("circle", "<b>I–VI–II–V（循環コード）</b> — ルートが4度上（5度下）へ進む「強進行」の連続。何度でも繰り返せる。",
    prog([[("C△7", "e4 g4 b4", "c3", "I△7"), ("Am7", "e4 g4 c5", "a2", "VIm7")],
          [("Dm7", "f4 a4 c5", "d3", "IIm7"), ("G7", "f4 g4 b4", "g2", "V7")],
          [("C△7", "e4 g4 b4", "c3", "I△7")]]), tempo=76, spacing=(0.9, 0.55))

# ---------- 5 短調 ----------
mdia = [("Am7", "a3 c4 e4 g4", "Im7"), ("Bm7(♭5)", "b3 d4 f4 a4", "IIm7(♭5)"), ("C△7", "c4 e4 g4 b4", "♭III△7"),
        ("Dm7", "d4 f4 a4 c5", "IVm7"), ("Em7", "e4 g4 b4 d5", "Vm7"), ("F△7", "f4 a4 c5 e5", "♭VI△7"),
        ("G7", "g4 b4 d5 f5", "♭VII7")]
fig("minor_dia", "<b>A ナチュラル・マイナーのダイアトニック・コード</b> — 音は C メジャーと同じ7つ。並びの出発点が A になっただけ。",
    [{"chord": s, "rh": f"<{n}>/1", "rn": [(1, r)], "invis": 1} for s, n, r in mdia],
    lh=False, showmeter=False, tempo=110, width=1500)

Am_ = ("Am", "c4 e4 a4", "a2", "Im")
fig("minor_v", "<b>Em7 と E7 の聴き比べ</b> — 左はナチュラル・マイナーの Vm7（<b style=\"color:#8A6A12\">G</b>）、右はハーモニック・マイナーの V7（<b style=\"color:var(--red)\">G♯</b>）。解決感の差を聴く。",
    [{"chord": [(1, "Em7"), (3, "Am")], "rn": [(1, "Vm7"), (3, "Im")], "rh": f"<d4 g4{G} b4>/2 <c4 e4 a4>/2", "lh": "e3/2 a2/2", "dbl": 1},
     {"chord": [(1, "E7"), (3, "Am")], "rn": [(1, "V7"), (3, "Im")], "rh": f"<d4 gs4{R} b4>/2 <c4 e4 a4>/2", "lh": "e3/2 a2/2"}],
    tempo=72, spacing=(0.9, 0.55))

fig("minor_cad", "<b>短調の基本の流れ</b>（Im → IVm → V7 → Im）— V7 だけハーモニック・マイナーから借りる。",
    prog([[Am_, ("Dm", "d4 f4 a4", "d3", "IVm")], [("E7", "d4 gs4 b4", "e3", "V7"), Am_]]), tempo=72, spacing=(0.9, 0.55))

# ---------- 6 テンション・ヴォイシング ----------
fig("tension_stack", "<b>コード・トーンの上に積むテンション</b> — C△7（R・3・5・7）の上に、さらに3度ずつ積むと 9・11・13（<b style=\"color:var(--red)\">赤</b>）。",
    [{"rh": f"c4/8 e4/8 g4/8 b4/8 d5/8{R} f5/8{R} a5/4{R}",
      "txt": [(1, "R"), (1.5, "3"), (2, "5"), (2.5, "7"), (3, "9"), (3.5, "11"), (4, "13")]}],
    lh=False, showmeter=False, tempo=90, check="none")

fig("tension_swap", "<b>テンションは構成音と入れ替える</b> — 9th はルートの代わり、11th と 13th は 5th の代わりに置く。ルートは左手が弾いている。",
    [{"chord": [(1, "C△7"), (3, "C△7(9)")], "rh": f"<c4 e4 g4 b4>/2 <d4{R} e4 g4 b4>/2", "lh": "c3/1"},
     {"chord": [(1, "Cm7"), (3, "Cm7(11)")], "rh": f"<c4 ef4 g4 bf4>/2 <c4 ef4 f4{R} bf4>/2", "lh": "c3/1"},
     {"chord": [(1, "C7"), (3, "C7(13)")], "rh": f"<c4 e4 g4 bf4>/2 <c4 e4 a4{R} bf4>/2", "lh": "c3/1"}],
    tempo=70, spacing=(0.9, 0.55))

fig("voicing_bad", "<b>跳びはねるヴォイシング</b> — 毎回基本形で弾くと、右手が上下に大きく跳ぶ。",
    prog([[("C", "c4 e4 g4", "c3", ""), ("Am", "a4 c5 e5", "a2", "")],
          [("Dm", "d4 f4 a4", "d3", ""), ("G", "g4 b4 d5", "g2", "")]]), tempo=76, spacing=(0.9, 0.55))
fig("voicing_good", "<b>なめらかなヴォイシング</b> — 共通音はそのまま残し、ほかの音は近くへ動かす。",
    prog([[("C", "e4 g4 c5", "c3", ""), ("Am", "e4 a4 c5", "a2", "")],
          [("Dm", "f4 a4 d5", "d3", ""), ("G", "d4 g4 b4", "g2", "")]]), tempo=76, spacing=(0.9, 0.55))

fig("iiv_voicing", "<b>II–V–I の定番ヴォイシング</b> — Dm7(9) から G7(13/9) へは、<b style=\"color:var(--red)\">一番下の音を半音下げるだけ</b>。",
    [{"chord": [(1, "Dm7(9)"), (3, "G7(13/9)")], "rn": [(1, "IIm7"), (3, "V7")],
      "rh": f"<c4{R} e4 f4 a4>/2 <b3{R} e4 f4 a4>/2", "lh": "d3/2 g2/2"},
     {"chord": "C△7(9)", "rn": [(1, "I△7")], "rh": "<b3 d4 e4 g4>/1", "lh": "c3/1"}], tempo=66, spacing=(0.9, 0.55))

# ---------- 7 ノン・ダイアトニック ----------
fig("secdom", "<b>セカンダリー・ドミナント</b> — Dm7 の前に「Dm7 にとっての V7」＝A7 を置く。<b style=\"color:#1F5FA8\">青</b>の C♯ がスケールの外の音。",
    [{"chord": [(1, "C△7"), (3, "A7")], "rn": [(1, "I△7"), (3, "VI7")], "rh": f"<e4 g4 b4>/2 <e4 g4 cs5{B}>/2", "lh": "c3/2 a2/2"},
     {"chord": [(1, "Dm7"), (3, "G7")], "rn": [(1, "IIm7"), (3, "V7")], "rh": "<f4 a4 c5>/2 <f4 g4 b4>/2", "lh": "d3/2 g2/2"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1"}], tempo=76, spacing=(0.9, 0.55))

fig("subv", "<b>裏コード（Sub V7）</b> — 前半が G7、後半が D♭7。<b style=\"color:var(--red)\">赤</b>の2音（F と B＝C♭）はどちらも同じなので、同じように C へ解決する。ベースは半音で下りる。",
    [{"chord": [(1, "Dm7"), (3, "G7")], "rn": [(1, "IIm7"), (3, "V7")], "rh": f"<f4 a4 c5>/2 <f4{R} g4 b4{R}>/2", "lh": "d3/2 g2/2"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1", "dbl": 1},
     {"sb": 1, "chord": [(1, "Dm7"), (3, "D♭7")], "rn": [(1, "IIm7"), (3, "♭II7")], "rh": f"<f4 a4 c5>/2 <f4{R} af4 cf5{R}>/2", "lh": f"d3/2 df3/2{B}"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1"}], tempo=76, spacing=(0.9, 0.55))

fig("sdm", "<b>サブドミナント・マイナー</b> — F のあとに Fm（<b style=\"color:#1F5FA8\">青</b>の A♭）をはさむ。明るい曲に一瞬だけ切なさが入る。",
    [{"chord": [(1, "C"), (3, "F")], "rn": [(1, "I"), (3, "IV")], "rh": "<e4 g4 c5>/2 <f4 a4 c5>/2", "lh": "c3/2 f2/2"},
     {"chord": [(1, "Fm"), (3, "C")], "rn": [(1, "IVm"), (3, "I")], "rh": f"<f4 af4{B} c5>/2 <e4 g4 c5>/2", "lh": "f2/2 c3/2"}], tempo=70, spacing=(0.9, 0.55))

# ---------- 8 定番進行 ----------
fig("cliche_up", "<b>クリシェ（5th が上がる型）</b> — C のまま、5th だけが G → G♯ → A → B♭ と半音ずつ上がる（<b style=\"color:var(--red)\">赤</b>）。",
    [{"chord": [(1, "C"), (3, "Caug")], "rh": f"<c4 e4 g4{R}>/2 <c4 e4 gs4{R}>/2", "lh": "c3/1"},
     {"chord": [(1, "C6"), (3, "C7")], "rh": f"<c4 e4 a4{R}>/2 <c4 e4 bf4{R}>/2", "lh": "c3/2 c3/2"},
     {"chord": "F", "rn": [], "rh": "<c4 f4 a4>/1", "lh": "f2/1"}], tempo=72, spacing=(0.9, 0.55))

fig("cliche_bass", "<b>ベース・クリシェ（ルートが下がる型）</b> — 右手は Am のまま、ベースだけが A → G♯ → G → F♯ と下りる。",
    [{"chord": [(1, "Am"), (3, "Am△7/G♯")], "rh": "<c4 e4 a4>/2 <c4 e4 a4>/2", "lh": f"a2/2{R} gs2/2{R}"},
     {"chord": [(1, "Am7/G"), (3, "Am6/F♯")], "rh": "<c4 e4 a4>/2 <c4 e4 a4>/2", "lh": f"g2/2{R} fs2/2{R}"},
     {"chord": "F△7", "rh": "<c4 e4 a4>/1", "lh": "f2/1"}], tempo=72, spacing=(0.9, 0.55))

fig("pedal", "<b>トニック・ペダル</b> — ベースの C を伸ばしたまま、上のコードだけを動かす。",
    [{"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1~"},
     {"chord": "F/C", "rn": [(1, "IV/I")], "rh": "<f4 a4 c5>/1", "lh": "c3/1~"},
     {"chord": "G/C", "rn": [(1, "V/I")], "rh": "<d4 g4 b4>/1", "lh": "c3/1~"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1"}], tempo=76)

fig("passing_dim", "<b>パッシング・ディミニッシュ</b> — C△7 と Dm7 のあいだに C♯dim7 をはさむと、ベースが C → C♯ → D と半音でつながる。",
    [{"chord": [(1, "C△7"), (3, "C♯dim7")], "rn": [(1, "I△7"), (3, "♯Idim7")], "rh": "<e4 g4 b4>/2 <e4 g4 bf4>/2", "lh": f"c3/2 cs3/2{B}"},
     {"chord": [(1, "Dm7"), (3, "G7")], "rn": [(1, "IIm7"), (3, "V7")], "rh": "<f4 a4 c5>/2 <f4 g4 b4>/2", "lh": "d3/2 g2/2"},
     {"chord": "C", "rn": [(1, "I")], "rh": "<e4 g4 c5>/1", "lh": "c3/1"}], tempo=76, spacing=(0.9, 0.55))

# ---------- 9 転調 ----------
fig("pivot", "<b>ピヴォット・コードで転調</b>（C → G）— Am7 は C では VIm7、G では IIm7。両方のキーに属する和音を「橋」にする。",
    [{"chord": [(1, "C△7"), (3, "Am7")], "rn": [(1, "C: I△7"), (3, "VIm7＝G: IIm7")], "rh": "<e4 g4 b4>/2 <e4 g4 c5>/2", "lh": "c3/2 a2/2"},
     {"chord": [(1, "D7"), (3, "G△7")], "rn": [(1, "V7"), (3, "I△7")], "rh": f"<fs4{B} a4 c5>/2 <fs4 b4 d5>/2", "lh": "d3/2 g2/2"}], tempo=72, spacing=(0.9, 0.55))

fig("direct", "<b>II–V をつけて転調</b>（C → E）— 新しいキー E の II–V（F♯m7–B7）を前に置くだけで、遠いキーへも自然に移れる。",
    [{"chord": [(1, "Dm7"), (3, "G7")], "rn": [(1, "C: IIm7"), (3, "V7")], "rh": "<f4 a4 c5>/2 <f4 g4 b4>/2", "lh": "d3/2 g2/2"},
     {"chord": "C△7", "rn": [(1, "I△7")], "rh": "<e4 g4 b4>/1", "lh": "c3/1", "dbl": 1},
     {"sb": 1, "chord": [(1, "F♯m7"), (3, "B7")], "rn": [(1, "E: IIm7"), (3, "V7")], "rh": "<e4 a4 cs5>/2 <ds4 a4 b4>/2", "lh": "fs2/2 b2/2"},
     {"chord": "E△7", "rn": [(1, "I△7")], "rh": "<ds4 gs4 b4>/1", "lh": "e3/1"}], tempo=76, spacing=(0.9, 0.55))

fig("connect_dim", "<b>コネクティング・ディミニッシュ</b>（C → D♭）— C♯dim7 と Edim7 は同じ4音。C のつもりで弾いた dim7 から、半音上の D♭ の II–V へ抜ける。",
    [{"chord": [(1, "C△7"), (3, "C♯dim7")], "rn": [(1, "C: I△7"), (3, "♯Idim7")], "rh": "<e4 g4 b4>/2 <e4 g4 bf4>/2", "lh": f"c3/2 cs3/2{B}"},
     {"chord": [(1, "E♭m7"), (3, "A♭7")], "rn": [(1, "D♭: IIm7"), (3, "V7")], "rh": "<df4 gf4 bf4>/2 <c4 gf4 af4>/2", "lh": "ef3/2 af2/2"},
     {"chord": "D♭△7", "rn": [(1, "I△7")], "rh": "<c4 f4 af4>/1", "lh": "df3/1"}], tempo=72, spacing=(0.7, 0.55))

# ---------- 10 スケール ----------
modes = [("リディア", "c4 d4 e4 fs4" + R + " g4 a4 b4 c5"),
         ("イオニア", "c4 d4 e4 f4 g4 a4 b4 c5"),
         ("ミクソリディア", "c4 d4 e4 f4 g4 a4 bf4" + R + " c5"),
         ("ドリア", "c4 d4 ef4 f4 g4 a4" + R + " bf4 c5"),
         ("エオリア", "c4 d4 ef4 f4 g4 af4" + R + " bf4 c5"),
         ("フリジア", "c4 df4" + R + " ef4 f4 g4 af4 bf4 c5"),
         ("ロクリア", "c4 df4 ef4 f4 gf4" + R + " af4 bf4 c5")]
fig("modes", "<b>7つの旋法を主音 C で並べる</b> — 明るい順。<b style=\"color:var(--red)\">赤</b>がその旋法の「特性音」（となりの旋法と違う1音）。",
    [{"rh": " ".join(t.replace(R, "") .split()[i] + "/8" + (R if (t.split()[i].endswith(R)) else "") for i in range(8)),
      "txt": [(1, lab)]} for lab, t in modes],
    lh=False, showmeter=False, tempo=120, width=1500, check="none")

fig("penta_blues", "<b>ペンタトニックとブルー・ノート</b> — 左から C メジャー・ペンタ、A マイナー・ペンタ、C ブルー・ノート・スケール（<b style=\"color:var(--red)\">赤</b>がブルー・ノート）。",
    [{"rh": "c4/8 d4/8 e4/8 g4/8 a4/8 c5/8 r/4", "txt": [(1, "C ペンタ")]},
     {"rh": "a3/8 c4/8 d4/8 e4/8 g4/8 a4/8 r/4", "txt": [(1, "Am ペンタ")]},
     {"rh": f"c4/8 ef4/8{R} f4/8 gf4/8{R} g4/8 bf4/8{R} b4/8 c5/8", "txt": [(1, "C ブルー・ノート")]}],
    lh=False, showmeter=False, tempo=110, check="none")

C7L, F7L, G7L = "<c3 e3 bf3>/1", "<f2 ef3 a3>/1", "<g2 f3 b3>/1"
blues = [("C7", f"c5/8 ef5/8{R} e5/4 g4/4 r/4", C7L),
         ("F7", f"a4/8 c5/8 ef5/4 c5/4 r/4", F7L),
         ("C7", f"g4/8 bf4/8{R} c5/4 e5/4 c5/4", C7L),
         ("C7", f"bf4/2 r/2", C7L),
         ("F7", f"c5/8 ef5/8 f5/4 ef5/4 c5/4", F7L),
         ("F7", f"a4/2 r/2", F7L),
         ("C7", f"c5/8 ef5/8{R} e5/4 g5/4 e5/4", C7L),
         ("C7", f"c5/2 r/2", C7L),
         ("G7", f"d5/8 f5/8 g5/4 f5/4 d5/4", G7L),
         ("F7", f"c5/8 ef5/8 f5/4 ef5/4 c5/4", F7L),
         ("C7", f"g4/8 bf4/8 c5/4 ef5/8{R} e5/8 c5/4", C7L),
         ("G7", f"b4/2 r/2", G7L)]
fig("blues", "<b>12小節のブルース（C）</b> — コードは I7・IV7・V7 の3つだけ。メロディーは C ブルー・ノート・スケールで作っている（<b style=\"color:var(--red)\">赤</b>がブルー・ノート）。",
    [{"chord": s, "rh": rh, "lh": lh, "rn": [(1, {"C7": "I7", "F7": "IV7", "G7": "V7"}[s])], "sb": k in (4, 8)} for k, (s, rh, lh) in enumerate(blues)],
    tempo=100, width=2200, check="lh")
