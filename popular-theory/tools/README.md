# ポップスの音楽理論入門 — build tools

`../index.html` is generated. Edit the text in `body.html` and the examples in `figs.py`, then:

```
pip install verovio            # plus fluidsynth, fluid-soundfont-gm, lame
python3 render_all.py          # engrave + render audio + check chord symbols
python3 build.py               # writes ../index.html
```

`check.py` verifies that every note under a chord symbol belongs to that chord and that bar lengths match the meter.
