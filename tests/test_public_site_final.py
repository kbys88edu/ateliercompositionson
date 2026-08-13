import unittest
from pathlib import Path
from urllib.parse import unquote, urlsplit

from tests.site_test_utils import ROOT, load_page, repo_path


JA_DETAILS = (
    "ja/composition-lesson.html",
    "ja/dtm-lesson.html",
    "ja/music-theory-lesson_with_pdf-link.html",
    "ja/solfege.html",
    "ja/electroacoustic-lesson.html",
    "ja/sound-technology-ai-lesson.html",
)

FR_DETAILS = (
    "fr/composition-lesson.html",
    "fr/harmony-analysis-lesson.html",
    "fr/mao-lesson.html",
    "fr/electroacoustic-lesson.html",
)


def page_html(page_path):
    return repo_path(page_path).read_text(encoding="utf-8")


def main_html(page_path):
    html = page_html(page_path)
    return html.split("<main", 1)[1].split("</main>", 1)[0]


def local_target(page_path, raw_href):
    parsed = urlsplit(raw_href)
    if parsed.scheme or raw_href.startswith(("//", "mailto:", "tel:")):
        return None, ""

    if parsed.path.startswith("/"):
        target = ROOT / unquote(parsed.path.lstrip("/"))
    elif parsed.path:
        target = (ROOT / page_path).parent / unquote(parsed.path)
    else:
        target = ROOT / page_path

    target = target.resolve()
    if target.is_dir():
        target = target / "index.html"
    return target, unquote(parsed.fragment)


class JapaneseFinalTests(unittest.TestCase):
    def test_japanese_home_uses_approved_documentary_split_hero(self):
        page = load_page("ja/index.html")
        html = page_html("ja/index.html")
        h1s = [item for item in page.headings if item["tag"] == "h1"]
        self.assertEqual(["音から考え、作品へ進む。"], [item["text"] for item in h1s])
        for text in (
            "作曲・音楽理論・DTM・電子音響を、制作中の楽譜、音源、DAWセッション、まだ形になっていない問いから個別に扱います。",
            "制作について相談する",
            "進め方と料金を見る",
            "作曲家Sachie Kobayashiがスタジオで楽譜と音響制作に取り組む様子",
        ):
            self.assertIn(text, html)
        self.assertIn("<picture", html)
        self.assertIn("hero-atelier-documentary-mobile.avif", html)
        self.assertIn("hero-atelier-documentary.webp", html)
        self.assertIn('fetchpriority="high"', html)
        self.assertNotIn("ja-kinetic-hero", html)

    def test_japanese_home_uses_production_stage_labels(self):
        html = page_html("ja/index.html")
        for text in (
            "制作の段階に応じて。",
            "制作を始める",
            "基礎と制作環境を整える",
            "作品・提出物を深める",
        ):
            self.assertIn(text, html)
        self.assertNotIn("初めて学ぶ方から、専門的に取り組む方まで", html)

    def test_japanese_home_has_two_strong_consultation_ctas_in_main(self):
        main = main_html("ja/index.html")
        self.assertEqual(2, main.count('acs-btn acs-btn--primary'))
        self.assertIn('data-track="hero_booking_click"', main)
        self.assertIn('data-track="final_consultation"', main)

    def test_japanese_testimonials_lead_with_lesson_roles(self):
        html = page_html("ja/index.html")
        for text in (
            "作曲・理論を受講",
            "DTM・制作相談を受講",
            "受験・基礎理論を受講",
        ):
            self.assertIn(text, html)
        for text in ("50代女性", "30代男性", "10代女性"):
            self.assertIn(f'<span class="ja-voice__detail">{text}</span>', html)

    def test_japanese_work_uses_verified_title(self):
        html = page_html("ja/index.html")
        self.assertIn('title="Digi Ugi"', html)
        self.assertIn("<h3>Digi Ugi</h3>", html)
        self.assertNotIn("Techno Pop / AI Workflow / TouchDesigner MV", html)


class FrenchFinalTests(unittest.TestCase):
    def test_french_home_uses_approved_documentary_split_hero(self):
        page = load_page("fr/index.html")
        html = page_html("fr/index.html")
        h1s = [item for item in page.headings if item["tag"] == "h1"]
        self.assertEqual(
            ["Faire évoluer une idée, une esquisse ou une pratique sonore."],
            [item["text"] for item in h1s],
        )
        for text in (
            "Atelier individuel de composition, MAO et pratiques sonores, à partir de vos partitions, maquettes, sessions DAW ou questions précises.",
            "Parler d’un projet",
            "Voir le format et le tarif",
            "Sachie Kobayashi travaillant sur une partition et une production sonore dans son studio",
        ):
            self.assertIn(text, html)
        self.assertIn("<picture", html)
        self.assertNotIn('class="hero-kinetic"', html)

    def test_french_home_consolidates_artist_introduction(self):
        html = page_html("fr/index.html")
        self.assertNotIn('id="atelier"', html)
        self.assertEqual(1, html.count('id="instructor"'))
        for text in (
            "Compositrice / Artiste sonore",
            "Le travail part de partitions, de maquettes, d’enregistrements ou de sessions DAW réellement en cours. Chaque séance se termine par une prochaine étape concrète.",
            "Voir le site artistique",
        ):
            self.assertIn(text, html)
        for text in (">Écoute<", ">Clarté<", ">Autonomie<"):
            self.assertNotIn(text, html)

    def test_french_offer_is_french_only(self):
        for page_path in ("fr/index.html", "fr/booking.html", *FR_DETAILS):
            html = page_html(page_path)
            for old in (
                "Français, anglais ou japonais",
                "Français ou anglais",
                "français uniquement",
            ):
                self.assertNotIn(old, html, page_path)
        self.assertIn("Langue : français", page_html("fr/index.html"))
        self.assertIn("Langue : français", page_html("fr/booking.html"))

    def test_french_home_has_two_strong_consultation_ctas(self):
        html = page_html("fr/index.html")
        booking_primary = [
            link for link in load_page("fr/index.html").links
            if link.get("href") == "booking.html"
            and "primary" in link.get("class", "").split()
        ]
        self.assertEqual(2, len(booking_primary))
        self.assertIn('data-track="hero_booking_click"', html)
        self.assertIn('data-track="booking_page_click"', html)

    def test_french_works_use_verified_titles(self):
        html = page_html("fr/index.html")
        for title in ("Digi Ugi", "i.p.s.e.i.t.y."):
            self.assertIn(f'title="{title}"', html)
            self.assertIn(f"<h3>{title}</h3>", html)
        for generic in (
            "Techno Pop / AI Workflow / TouchDesigner MV",
            "Electronic / Contemporary Practice",
        ):
            self.assertNotIn(generic, html)


class LessonDetailFinalTests(unittest.TestCase):
    def test_all_lesson_details_load_shared_refinement_css_and_have_one_h1(self):
        for page_path in (*JA_DETAILS, *FR_DETAILS):
            page = load_page(page_path)
            self.assertIn("../assets/css/lesson-detail-final.css", page.stylesheets, page_path)
            self.assertEqual(
                1,
                len([item for item in page.headings if item["tag"] == "h1"]),
                page_path,
            )

    def test_lesson_details_do_not_use_obsolete_home_anchors(self):
        obsolete = ("#modules", "#lessons", "#travail", "#tarifs", "#formats", "/ja/#contact")
        for page_path in (*JA_DETAILS, *FR_DETAILS, "fr/booking.html"):
            html = page_html(page_path)
            for fragment in obsolete:
                self.assertNotIn(fragment, html, page_path)

    def test_japanese_lesson_consultation_routes_are_direct(self):
        for page_path in JA_DETAILS:
            html = page_html(page_path)
            self.assertNotIn('href="#consultation"', html, page_path)
            self.assertNotIn('href="#contact"', html, page_path)
            self.assertRegex(html, r'href="(?:/ja/)?booking\.html"')

    def test_french_lesson_navigation_uses_current_sections(self):
        for page_path in (*FR_DETAILS, "fr/booking.html"):
            html = page_html(page_path)
            self.assertIn('index.html#entrypoints', html, page_path)
            self.assertIn('index.html#format', html, page_path)

    def test_generated_collages_are_not_primary_french_detail_media(self):
        for page_path in FR_DETAILS:
            html = page_html(page_path)
            self.assertNotIn("computer-music-synth-composition.jpeg", html, page_path)
            self.assertNotIn("music-theory-hero.jpeg", html, page_path)

    def test_generic_work_titles_are_removed_from_lesson_pages(self):
        for page_path in JA_DETAILS:
            html = page_html(page_path)
            self.assertNotIn("Techno Pop / AI Workflow / TouchDesigner MV", html, page_path)
            self.assertNotIn("Electronic / Contemporary Practice", html, page_path)


class AnalyticsAndRootTests(unittest.TestCase):
    def test_required_analytics_events_are_present(self):
        joined = "\n".join(
            page_html(path)
            for path in ("ja/index.html", "fr/index.html", "fr/booking.html")
        ) + page_html("assets/js/acs-tracking.js")
        for event in (
            "hero_booking_click",
            "booking_section_view",
            "booking_page_click",
            "pricing_section_view",
            "gumroad_product_click",
            "resource_free_pdf_click",
            "email_contact_click",
        ):
            self.assertIn(event, joined)

    def test_root_has_valid_document_ending(self):
        html = page_html("index.html")
        self.assertTrue(html.rstrip().endswith("</html>"))
        self.assertFalse(html.rstrip().endswith("```"))

    def test_scoped_internal_links_and_fragments_resolve(self):
        page_paths = (
            "index.html",
            "ja/index.html",
            "ja/booking.html",
            "fr/index.html",
            "fr/booking.html",
            *JA_DETAILS,
            *FR_DETAILS,
        )
        parsed_pages = {path: load_page(path) for path in page_paths}
        id_cache = {}
        for page_path, page in parsed_pages.items():
            id_cache[(ROOT / page_path).resolve()] = set(page.ids)

        for page_path, page in parsed_pages.items():
            for link in page.links:
                href = link.get("href", "")
                target, fragment = local_target(page_path, href)
                if target is None:
                    continue
                self.assertTrue(target.exists(), f"{page_path}: missing {href}")
                if fragment and target.suffix == ".html":
                    if target not in id_cache:
                        relative = target.relative_to(ROOT).as_posix()
                        id_cache[target] = set(load_page(relative).ids)
                    self.assertIn(fragment, id_cache[target], f"{page_path}: missing anchor {href}")
