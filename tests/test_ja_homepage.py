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
        self.assertEqual("AtelierCompositionSon", h1s[0]["text"])

    def test_primary_sections_are_present_once_and_ordered(self):
        expected = [
            "top", "trust", "who", "study", "process", "instructor",
            "concept", "works", "voices", "price", "faq", "tools", "contact",
        ]
        self.assertEqual(len(self.page.ids), len(set(self.page.ids)))
        positions = [self.page.ids.index(section_id) for section_id in expected]
        self.assertEqual(positions, sorted(positions))

    def test_primary_consultation_links_are_direct_and_stable(self):
        tracked = {
            link.get("data-track"): link.get("href")
            for link in self.page.links if link.get("data-track")
        }
        self.assertEqual("booking.html", tracked["hero_booking_click"])
        self.assertEqual("booking.html", tracked["pricing_consultation"])
        self.assertEqual("booking.html", tracked["final_consultation"])
        self.assertEqual("#price", tracked["hero_format_price"])

    def test_current_prices_are_present_without_commas(self):
        for text in ("4800円", "7500円", "料金応相談", "1800円〜"):
            self.assertIn(text, self.html)
        self.assertIn("月2回から、ご希望に合わせて", self.html)
        for old_text in ("4,800円", "7,500円", "28,000円", "28000円", "1,800円", "月4回プラン"):
            self.assertNotIn(old_text, self.html)

    def test_viewport_allows_zoom(self):
        self.assertNotIn("user-scalable=no", self.html)

    def test_hero_collage_uses_supplied_intrinsic_dimensions(self):
        hero = next(image for image in self.page.images if "atelier-split-hero__image--collage" in image.get("class", ""))
        self.assertEqual(("1114", "1594"), (hero.get("width"), hero.get("height")))

    def test_old_duplicate_hero_variants_are_absent(self):
        for class_name in (
            "hero-kinetic", "ja-hero-copy", "ja-hero-kinetic",
            "mobile-hero-landing", "hero-mail-correction-cta", "hero-copy",
        ):
            self.assertNotIn(class_name, self.html)

    def test_documentary_hero_uses_responsive_picture(self):
        hero_image = next(
            image for image in self.page.images
            if "atelier-split-hero__image" in image.get("class", "").split()
        )
        self.assertEqual("eager", hero_image.get("loading"))
        self.assertEqual("high", hero_image.get("fetchpriority"))
        self.assertEqual("async", hero_image.get("decoding"))
        self.assertEqual(("1114", "1594"), (hero_image.get("width"), hero_image.get("height")))
        for text in (
            "オンライン作曲・ソルフェージュ・DTM・電子音楽レッスン",
            "Atelier Composition Son",
            "作曲・音楽理論・DTM・電子音響を、制作中の楽譜、音源、DAWセッション、まだ形になっていない問いから個別に扱います。",
            "制作について相談する",
            "進め方と料金を見る",
        ):
            self.assertIn(text, self.html)

    def test_homepage_copy_is_natural_and_specific(self):
        for text in (
            "オンライン作曲・ソルフェージュ・DTM・電子音楽レッスン",
            "Atelier Composition Son",
            "制作の段階に応じて。",
            "無料相談からレッスンまで",
            "学びたいこと、作りたい音に合わせて",
            "講師の作品",
            "まずは30分、制作についてお聞かせください",
        ):
            self.assertIn(text, self.html)

        for text in (
            "自分の作品につなげる",
            "相談から、次の制作へ。",
            "レッスンを、創作の場として。",
            "制作実践から。",
            "音楽以前の感覚を作品へ接続します",
        ):
            self.assertNotIn(text, self.html)

    def test_header_has_restrained_navigation(self):
        header_script = repo_path("assets/js/acs-header.js").read_text(encoding="utf-8")
        for label in ("レッスン", "講師", "料金", "受講者の声", "無料相談"):
            self.assertIn(label, header_script)
        for old_primary_label in ("AI添削", "学習ツール", "規約", "お問い合わせ"):
            self.assertNotIn(f">{old_primary_label}</a>", header_script)

    def test_mobile_menu_uses_stable_accessible_label(self):
        header_script = repo_path("assets/js/acs-header.js").read_text(encoding="utf-8")
        self.assertIn('menuLabel: "メニュー"', header_script)
        self.assertNotIn('menuLabel: "メニューを開く"', header_script)

    def test_trust_and_audience_are_concise(self):
        for text in (
            "ジュネーブ高等音楽院", "IRCAM作曲研究課程",
            "スイスの音楽院での指導経験", "世界各国での作品発表経験",
            "制作を始める", "基礎と制作環境を整える", "作品・提出物を深める",
        ):
            self.assertIn(text, self.html)

    def test_trust_strip_uses_numbered_caption_items(self):
        self.assertEqual(4, self.html.count('class="ja-trust__item"'))
        for index in ("01", "02", "03", "04"):
            self.assertIn(f'<span class="ja-trust__index" aria-hidden="true">{index}</span>', self.html)
        for text in (
            "ジュネーブ高等音楽院", "音楽教育修士",
            "IRCAM作曲研究課程", "2021-2022",
            "スイスの音楽院での指導経験",
            "世界各国での作品発表経験",
        ):
            self.assertIn(text, self.html)
        self.assertNotIn("BACKGROUND / PRACTICE", self.html)

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
        for label in ("無料相談", "個別レッスン", "次の課題"):
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
            "学びたいこと、作りたい音に合わせて",
            "レッスン内容は、受講者の作品や興味、学びたいことに合わせて決めます。",
            "楽譜やDAWの操作だけでなく、実際に音を聴きながら、作品に必要な知識と技術を学びます。",
            "SATB 4声体のMusicXMLファイルを使って、連続5度・連続8度などを確認する学習補助ツールです。",
            "2声対位法の基礎的な進行、音程、禁則を確認するための学習補助ツールです。",
            "波形、フィルター、エンベロープ、LFOなどをブラウザ上で試しながら、音の合成について学べる学習用シンセサイザーです。",
        ):
            self.assertIn(text, self.html)
        hrefs = {link.get("href") for link in self.page.links}
        self.assertTrue({
            "../harmony-checker.html", "../counterpoint/", "simple-synth.html",
        }.issubset(hrefs))
        self.assertEqual(3, self.html.count('class="ja-tools__item"'))

    def test_brand_background_and_scope_remain_visible(self):
        for text in (
            "音楽を学ぶことは、音をもう一度聴き直すことから始まる。",
            "inspired by Pierre Schaeffer",
        ):
            self.assertIn(text, self.html.split("<body>", 1)[1])

        profile_body = repo_path("ja/profile.html").read_text(encoding="utf-8").split("<body>", 1)[1]
        for text in (
            "東京、スイス、フランス",
            "アーティストビザを取得してパリを中心に活動",
            "places / traditions / technologies",
            "listening / sound practices",
        ):
            self.assertIn(text, profile_body)

    def test_tools_are_compact_resources_before_the_final_consultation(self):
        positions = {section_id: self.page.ids.index(section_id) for section_id in (
            "works", "voices", "price", "faq", "contact", "tools",
        )}
        for section_id in ("works", "voices", "price", "faq"):
            self.assertLess(positions[section_id], positions["tools"])
        self.assertLess(positions["tools"], positions["contact"])

        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        self.assertIn(".ja-tools { padding-block: var(--acs-space-7);", css)
        self.assertIn(".ja-tools__list { display: grid; grid-template-columns: 1fr;", css)

    def test_footer_language_route_is_labeled_as_language_selection(self):
        for page_path in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            html = repo_path(page_path).read_text(encoding="utf-8")
            self.assertIn('<a href="../">言語選択</a>', html, page_path)
            self.assertNotIn('>English</a>', html, page_path)

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
                    "Digi Ugi",
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
        for image in self.page.images:
            self.assertIn("alt", image)
            self.assertTrue(image.get("width") and image.get("height"), image.get("src"))
            if "atelier-split-hero__image" in image.get("class", "").split():
                self.assertEqual("eager", image.get("loading"), image.get("src"))
            else:
                self.assertEqual("lazy", image.get("loading"), image.get("src"))
            self.assertEqual("async", image.get("decoding"), image.get("src"))

    def test_shared_assets_are_loaded_once(self):
        self.assertEqual(1, self.page.stylesheets.count("../assets/css/acs-core.css"))
        self.assertEqual(1, self.page.stylesheets.count("../assets/css/ja-home.css"))
        self.assertEqual(1, self.page.stylesheets.count("../assets/css/public-site-final.css"))
        self.assertEqual(1, self.page.scripts.count("../assets/js/acs-ui.js"))
        self.assertEqual(1, self.page.scripts.count("../assets/js/acs-tracking.js"))

    def test_mail_feedback_is_secondary(self):
        tracked = {link.get("data-track"): link.get("href") for link in self.page.links if link.get("data-track")}
        self.assertEqual("mail-correction.html?request=mail-correction#form", tracked["mail_feedback"])
