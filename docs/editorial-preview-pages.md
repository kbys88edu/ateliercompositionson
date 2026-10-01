# 全ページのプレビュー

ブランド名の比較案：TeX Gyre Heros Regularで「ATELIER COMPOSITION SON」と大文字表記。採用済みの見出し（IBM Plex Sans JP Medium 500）、本文のフォントと入口ページは維持。

mainは未更新。21ページ。

- [index.html](https://p.superdesign.dev/draft/9dc5d6f1-0311-48a5-96ff-98323ce97558)

- [ja/booking.html](https://p.superdesign.dev/draft/e5fac3f6-6463-4b34-8264-58a2df353fba)

- [ja/composition-lesson.html](https://p.superdesign.dev/draft/ac041971-508a-4c5a-b291-ea8e6bc26dfb)

- [ja/dtm-lesson.html](https://p.superdesign.dev/draft/84705c3a-3085-4cc9-9703-62311380a41e)

- [ja/electroacoustic-lesson.html](https://p.superdesign.dev/draft/701f8d6e-c2af-4e8f-84f6-66b742a7700c)

- [ja/faq.html](https://p.superdesign.dev/draft/d47b753c-b369-4770-85ef-07822031ef05)

- [ja/index.html](https://p.superdesign.dev/draft/3b8d92c5-5145-4fb9-b8e6-7c1ddb9d7182)

- [ja/mail-correction.html](https://p.superdesign.dev/draft/a58bc1c5-970c-481e-8c95-61ddb6977ece)

- [ja/music-theory-lesson_with_pdf-link.html](https://p.superdesign.dev/draft/0c1c1006-adc4-4a19-aa82-61edbdab0294)

- [ja/profile.html](https://p.superdesign.dev/draft/6604a56f-3d0e-4afe-b008-b9ec8f00f3a6)

- [ja/simple-synth.html](https://p.superdesign.dev/draft/2f84db12-15c4-41f5-831b-a5f120605ff5)

- [ja/solfege.html](https://p.superdesign.dev/draft/abb92ad3-843a-409f-b941-9d17df441845)

- [ja/sound-technology-ai-lesson.html](https://p.superdesign.dev/draft/ca423bba-5a0e-4bc8-919c-a79b034e6460)

- [ja/terms.html](https://p.superdesign.dev/draft/9931abf0-9475-438d-b725-e8dabba95533)

- [fr/booking.html](https://p.superdesign.dev/draft/d32091f4-c851-4975-929b-e7ad5a71e384)

- [fr/composition-lesson.html](https://p.superdesign.dev/draft/c719ff06-400e-473a-a065-f9d5769c0d7e)

- [fr/electroacoustic-lesson.html](https://p.superdesign.dev/draft/c10506b5-8861-4b7c-b131-5f663032e1ed)

- [fr/harmony-analysis-lesson.html](https://p.superdesign.dev/draft/137cd2ce-85e7-4bfe-9a6a-900423d87212)

- [fr/index.html](https://p.superdesign.dev/draft/bbc23734-9700-4985-93e4-972c643b266f)

- [fr/mao-lesson.html](https://p.superdesign.dev/draft/aea3d4cd-1b15-459f-81ca-66bc0b75a132)

- [fr/confidentialite/index.html](https://p.superdesign.dev/draft/9ea49abc-ca2d-432d-b035-662bd22dec53)
# レイアウト確認（2026-09-30）

21ページを1440px・1024px・390pxでブラウザ確認。相談欄への既存sectionグリッドの干渉、番号削除後の空き列、スマホのレッスン画像、予約画像のviewport基準幅、フランス語見出しのはみ出しを共通CSSで修正。
簡易シンセサイザーは暗い操作パネルの文字色・小さいラベルを維持し、狭い画面での列数も調整。再確認でページ横幅・見出しのはみ出しなし。詳細記録は `.superdesign/layout-audit.json`。
入口の `index.html` は差分なし。mainは `441b6b8` のまま、マージ・本番公開は未実施。

## 枠線の修正（2026-10-01）

教材・料金などの各欄を1pxの枠線で囲み、隣接する枠線を重ねて二重線を防止。共通CSSによる右・下・左の枠線の消去を修正し、全プレビューを更新。
全21ページを1440px・390pxで確認。対象欄の四辺の枠線と、ページ幅のはみ出しなしを確認。記録は `.superdesign/border-audit.json`。main未変更。

## mainへの統合（2026-10-01）

ユーザーのマージ承認に基づき、承認済みのデザインを統合。フランス語トップのパソコン・スマホ画像を日本語と同じ `hero-collage2.png` に統一。
フランス語トップを1440px・1024px・768px・390pxで確認。画像の読み込み、常時カラー表示、横へのはみ出しなしを確認。言語選択の入口ページは変更なし。
