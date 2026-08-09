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

    def test_homepage_has_three_selected_works(self):
        self.assertEqual(3, self.html.count('class="ja-work"'))
        self.assertEqual(
            [
                (
                    "https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fsachiekbys%2Femergences-resurgences-pour-orchestre&color=%23111111&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
                    "Émergences Résurgences pour orchestre",
                    "lazy",
                ),
                (
                    "https://www.youtube.com/embed/SgYGcZS1Mp4",
                    "Techno Pop / AI Workflow / TouchDesigner MV",
                    "lazy",
                ),
                (
                    "https://player.vimeo.com/video/1038238939",
                    "The Cosmic Microwaves Background / Le Fresnoy",
                    "lazy",
                ),
            ],
            [
                (frame.get("src"), frame.get("title"), frame.get("loading"))
                for frame in self.page.iframes
            ],
        )

    def test_homepage_preserves_three_testimonials(self):
        for testimonial in (
            "オンラインでも通信環境が安定していて、安心して受講できました。こちらの希望や学びたい内容を丁寧に聞いていただき、レッスンに反映してもらえた点がとても良かったです。",
            "自分の現在のレベルや目的に合わせて、必要な内容を整理しながら教えていただけたのが印象的でした。短い時間の中でも、今後どのように学んでいけばよいかが明確になりました。",
            "限られた時間の中でも、とても分かりやすく丁寧に教えていただきました。初めて学ぶ内容でしたが、楽典の面白さや奥深さを感じることができました。",
        ):
            self.assertIn(testimonial, self.html)

    def test_pricing_uses_current_plan_names(self):
        for plan in ("Foundation", "Individual Session", "Monthly Atelier", "Text Feedback"):
            self.assertIn(plan, self.html)
        for old_plan in (">Beginner<", ">Advanced 単発<", ">Advanced 月謝<"):
            self.assertNotIn(old_plan, self.html)

    def test_homepage_faq_has_four_questions_and_full_faq_link(self):
        self.assertEqual(4, self.html.count("<details"))
        for question in (
            "これから制作を始める段階でも相談できますか？",
            "受験やポートフォリオにも対応していますか？",
            "単発相談はできますか？",
            "どのソフトに対応していますか？",
        ):
            self.assertIn(f"<summary>{question}</summary>", self.html)
        self.assertIn('href="faq.html"', self.html)

    def test_full_faq_preserves_all_eight_topics(self):
        faq_html = repo_path("ja/faq.html").read_text(encoding="utf-8")
        self.assertEqual(8, faq_html.count("<details"))
        for question in (
            "これから制作を始める段階でも相談できますか？",
            "受験やポートフォリオにも対応していますか？",
            "どのくらいの頻度で受けるのがよいですか？",
            "単発相談はできますか？",
            "どのソフトに対応していますか？",
            "外部スクール経由のレッスンとは何が違いますか？",
            "SunoやElevenLabsで作った音源の相談もできますか？",
            "和声チェッカーや対位法チェッカーの結果について相談できますか？",
        ):
            self.assertIn(f"<summary>{question}</summary>", faq_html)

    def test_images_have_complete_loading_contracts(self):
        hero = self.page.images[0]
        self.assertEqual("../images/sachie_studio.jpg", hero.get("src"))
        self.assertEqual("スタジオで制作する講師 Sachie Kobayashi", hero.get("alt"))
        self.assertEqual("1200", hero.get("width"))
        self.assertEqual("900", hero.get("height"))
        self.assertEqual("high", hero.get("fetchpriority"))
        self.assertEqual("async", hero.get("decoding"))
        self.assertNotIn("loading", hero)

        for image in self.page.images:
            self.assertIn("alt", image)
            self.assertTrue(image.get("width") and image.get("height"), image.get("src"))

        for image in self.page.images[1:]:
            self.assertEqual("lazy", image.get("loading"), image.get("src"))
            self.assertEqual("async", image.get("decoding"), image.get("src"))

    def test_mail_feedback_is_secondary(self):
        tracked = {link.get("data-track"): link.get("href") for link in self.page.links if link.get("data-track")}
        self.assertEqual("mail-correction.html?request=mail-correction#form", tracked["mail_feedback"])
