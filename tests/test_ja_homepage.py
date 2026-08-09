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

    def test_mobile_menu_uses_stable_accessible_label(self):
        self.assertIn('aria-label="メニュー"', self.html)
        self.assertNotIn('aria-label="メニューを開く"', self.html)

    def test_trust_and_audience_are_concise(self):
        for text in (
            "ジュネーブ高等音楽院", "IRCAM作曲研究課程",
            "スイスの音楽院での指導経験", "日本・スイス・フランスでの制作実践",
            "これから始める / 基礎から", "独学・制作中", "専門・受験・ポートフォリオ",
        ):
            self.assertIn(text, self.html)

    def test_study_groups_preserve_six_lesson_routes(self):
        expected = {
            "composition-lesson.html", "dtm-lesson.html",
            "music-theory-lesson_with_pdf-link.html", "solfege.html",
            "electroacoustic-lesson.html", "sound-technology-ai-lesson.html",
        }
        hrefs = {link.get("href") for link in self.page.links}
        self.assertTrue(expected.issubset(hrefs))
        families = [
            element for element in self.page.elements
            if "ja-study-family" in element["attrs"].get("class", "").split()
        ]
        self.assertEqual(3, len(families))

    def test_process_has_exactly_three_steps(self):
        steps = [
            element for element in self.page.elements
            if "ja-process__step" in element["attrs"].get("class", "").split()
        ]
        self.assertEqual(3, len(steps))
        for label in ("相談", "個別レッスン", "次の制作・学習へ"):
            self.assertIn(label, self.html)

    def test_teacher_summary_links_to_full_profile(self):
        self.assertIn('src="../images/profile.png"', self.html)
        self.assertIn('href="profile.html"', self.html)
        profile = repo_path("ja/profile.html").read_text(encoding="utf-8")
        for credential in ("Master of Arts HES-SO", "2021–2022年", "Klangforum Wien", "impuls International Composition Competition 2023"):
            self.assertIn(credential, profile)

    def test_teacher_profile_link_has_a_44px_touch_target(self):
        profile_link = next(
            link for link in self.page.links
            if link.get("href") == "profile.html"
        )
        self.assertIn("acs-text-link", profile_link.get("class", "").split())
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        self.assertIn(".ja-home-instructor__actions .acs-text-link", css)
        selector_start = css.index(".ja-home-instructor__actions .acs-text-link")
        selector_block = css[selector_start:css.index("}", selector_start)]
        self.assertIn("min-height: 44px", selector_block)

    def test_task_four_sections_use_connected_design_system_selectors(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        for selector in (
            ".ja-study__families", ".ja-study-family", ".ja-study-family > a",
            ".ja-process__list", ".ja-process__step",
        ):
            self.assertIn(selector, css)
        self.assertIn("min-height: 44px", css)

    def test_instructor_uses_one_constrained_grid(self):
        instructor = next(
            element for element in self.page.elements
            if element["attrs"].get("id") == "instructor"
        )
        self.assertNotIn("ja-home-instructor", instructor["attrs"].get("class", "").split())
        grids = [
            element for element in self.page.elements
            if "ja-home-instructor" in element["attrs"].get("class", "").split()
        ]
        self.assertEqual(1, len(grids))

    def test_concept_and_tools_keep_unique_homepage_paths(self):
        self.assertIn("concept", self.page.ids)
        self.assertIn("tools", self.page.ids)
        for text in (
            "レッスンを、創作の場として。",
            "受講者自身の感覚・関心・音の記憶から出発します。",
            "そのすべてを、作品をつくるための手段として扱います。",
            "一般的な作曲・DTMレッスンよりも、個人の創作プロセスに深く関わります。",
            "音楽的な判断や作曲上の意図までは完全には扱えません。",
            "メール添削レッスンまたは通常レッスンで、考え方から個別に扱います。",
        ):
            self.assertIn(text, self.html)
        hrefs = {link.get("href") for link in self.page.links}
        self.assertTrue({
            "../harmony-checker.html", "../counterpoint/", "simple-synth.html",
        }.issubset(hrefs))
