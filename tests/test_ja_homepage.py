import unittest
from tests.site_test_utils import load_page, repo_path


class JapaneseHomepageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = load_page("ja/index.html")
        cls.html = repo_path("ja/index.html").read_text(encoding="utf-8")

    def test_has_one_h1(self):
        h1s = [heading for heading in self.page.headings if heading["tag"] == "h1"]
        self.assertEqual(1, len(h1s))
        self.assertEqual("作曲・DTM・音楽理論を、自分の作品につなげる。", h1s[0]["text"])

    def test_primary_sections_are_present_once_and_ordered(self):
        expected = [
            "top", "trust", "who", "study", "process", "instructor",
            "works", "voices", "price", "faq", "contact",
        ]
        self.assertEqual(len(self.page.ids), len(set(self.page.ids)))
        positions = [self.page.ids.index(section_id) for section_id in expected]
        self.assertEqual(positions, sorted(positions))

    def test_primary_consultation_links_are_direct_and_stable(self):
        tracked = {
            link.get("data-track"): link.get("href")
            for link in self.page.links if link.get("data-track")
        }
        self.assertEqual("booking.html", tracked["hero_consultation"])
        self.assertEqual("booking.html", tracked["pricing_consultation"])
        self.assertEqual("booking.html", tracked["final_consultation"])
        self.assertEqual("#study", tracked["hero_lessons"])

    def test_current_prices_are_present_without_commas(self):
        for text in ("4800円", "7500円", "28000円", "1800円〜"):
            self.assertIn(text, self.html)
        for old_text in ("4,800円", "7,500円", "28,000円", "1,800円"):
            self.assertNotIn(old_text, self.html)

    def test_viewport_allows_zoom(self):
        self.assertNotIn("user-scalable=no", self.html)

    def test_old_duplicate_hero_variants_are_absent(self):
        for class_name in (
            "hero-kinetic", "ja-hero-copy", "ja-hero-kinetic",
            "mobile-hero-landing", "hero-mail-correction-cta", "hero-copy",
        ):
            self.assertNotIn(class_name, self.html)

    def test_header_has_restrained_navigation(self):
        for label in ("レッスン", "講師", "料金", "受講者の声", "無料相談"):
            self.assertIn(label, self.html)
        for old_primary_label in ("AI添削", "学習ツール", "規約", "お問い合わせ"):
            self.assertNotIn(f">{old_primary_label}</a>", self.html)

    def test_trust_and_audience_are_concise(self):
        for text in (
            "ジュネーブ高等音楽院", "IRCAM作曲研究課程",
            "スイスの音楽院での指導経験", "日本・スイス・フランスでの制作実践",
            "これから始める / 基礎から", "独学・制作中", "専門・受験・ポートフォリオ",
        ):
            self.assertIn(text, self.html)
