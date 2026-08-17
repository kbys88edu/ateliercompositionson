import re
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
    def test_japanese_home_uses_supplied_collage_hero(self):
        html = page_html("ja/index.html")
        self.assertIn("hero-collage2.png", html)
        self.assertIn(
            "講師の電子音響制作、舞台制作、弦楽器とデジタル制作環境のコラージュ",
            html,
        )
        self.assertNotIn("hero-atelier-performance-supplied.png", html)

    def test_japanese_home_uses_approved_documentary_split_hero(self):
        page = load_page("ja/index.html")
        html = page_html("ja/index.html")
        h1s = [item for item in page.headings if item["tag"] == "h1"]
        self.assertEqual(["AtelierCompositionSon"], [item["text"] for item in h1s])
        for text in (
            "オンライン作曲・ソルフェージュ・DTM・電子音楽レッスン",
            "Atelier Composition Son",
            "作曲・音楽理論・DTM・電子音響を、制作中の楽譜、音源、DAWセッション、まだ形になっていない問いから個別に扱います。",
            "30分無料相談",
            "進め方と料金を見る",
            "講師の電子音響制作、舞台制作、弦楽器とデジタル制作環境のコラージュ",
        ):
            self.assertIn(text, html)
        self.assertIn("hero-collage2.png", html)
        self.assertIn('fetchpriority="high"', html)
        self.assertNotIn("ja-kinetic-hero", html)

    def test_japanese_home_uses_production_stage_labels(self):
        html = page_html("ja/index.html")
        for text in (
            "制作の段階に応じて。",
            "制作を始める",
            "制作環境を整えながら、応用へ",
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
    def test_french_home_uses_real_documentary_hero(self):
        html = page_html("fr/index.html")
        self.assertIn("hero-atelier-performance", html)
        self.assertNotIn("hero-collage2.png", html)
        self.assertNotIn('class="top-nav"', html)
        self.assertIn(
            "Sachie Kobayashi pendant une création électroacoustique",
            html,
        )
        self.assertIn('fetchpriority="high"', html)

    def test_french_home_uses_project_support_split_hero(self):
        page = load_page("fr/index.html")
        html = page_html("fr/index.html")
        h1s = [item for item in page.headings if item["tag"] == "h1"]
        self.assertEqual(
            ["Accompagnement individuel en composition et création sonore"],
            [item["text"] for item in h1s],
        )
        for text in (
            "À partir d’une partition, d’une maquette, d’un enregistrement ou d’une session DAW",
            "Faire le point sur mon projet",
            "Voir les formats d’accompagnement",
            "Composition, électroacoustique, Max/MSP, analyse, écriture et MAO créative.",
        ):
            self.assertIn(text, html)
        self.assertIn('class="fr-hero__media"', html)
        self.assertIn('src="../images/hero-atelier-performance.webp"', html)
        self.assertIn('width="1200" height="1200"', html)
        self.assertNotIn('class="hero-kinetic"', html)

    def test_french_home_consolidates_artist_introduction(self):
        html = page_html("fr/index.html")
        self.assertNotIn('id="atelier"', html)
        self.assertEqual(1, html.count('id="experience"'))
        for text in (
            "Compositrice et artiste sonore",
            "Haute école de musique de Genève",
            "Cursus de composition et d’informatique musicale de l’IRCAM",
            "Les séances relient les outils d’écriture aux conditions réelles de fabrication d’une œuvre.",
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

    def test_french_home_has_two_scoped_first_contact_ctas(self):
        page = load_page("fr/index.html")
        first_contact = [
            link for link in load_page("fr/index.html").links
            if link.get("href") == "booking.html?offer=free-contact#contact-form"
        ]
        self.assertEqual(2, len(first_contact))
        self.assertTrue(all(link.get("data-track") == "click_primary_cta" for link in first_contact))
        self.assertEqual(
            1,
            sum(link.get("data-cta-position") == "hero" for link in first_contact),
        )

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
    def test_japanese_lessons_share_homepage_aligned_layout_hooks(self):
        for page_path in JA_DETAILS:
            page = load_page(page_path)
            html = page_html(page_path)
            self.assertIn('class="lesson-detail-page"', html, page_path)
            self.assertIn('class="lesson-detail-hero"', html, page_path)
            self.assertIn('class="lesson-detail-hero__copy"', html, page_path)
            self.assertIn('class="lesson-detail-hero__media', html, page_path)
            self.assertIn('class="lesson-detail-hero__summary', html, page_path)
            self.assertLess(
                page.stylesheets.index("../assets/css/acs-core.css"),
                page.stylesheets.index("../assets/css/lesson-detail-final.css"),
                page_path,
            )

    def test_shared_lesson_css_uses_compact_split_hero(self):
        css = page_html("assets/css/lesson-detail-final.css")
        for rule in (
            ".lesson-detail-hero {",
            "grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);",
            ".lesson-detail-hero__media img {",
            "object-fit: cover;",
            ".lesson-detail-hero h1 {",
            "font-size: clamp(3rem, 5vw, 4rem);",
            "@media (max-width: 760px)",
            "grid-template-columns: 1fr;",
        ):
            self.assertIn(rule, css)

    def test_shared_lesson_css_resets_legacy_page_conflicts(self):
        css = page_html("assets/css/lesson-detail-final.css")
        for rule in (
            ".lesson-detail-page :is(.band, .dark, .cta, .price, .price.recommended, .price-card.emphasis) {",
            ".lesson-detail-page :is(.band, .dark, .cta, .price, .price.recommended, .price-card.emphasis) :is(p, li, .muted, .small, .section-kicker) {",
            ".lesson-detail-page .price.recommended .badge {\n  border-color: var(--acs-line);\n}",
            ".lesson-detail-page .price.recommended .button.primary {\n  background: #111;\n  color: #fff;\n  border-color: #111;\n}",
            "align-self: start;",
            "height: clamp(520px, 50vw, 680px);",
            ".lesson-detail-page :is(.hero-actions, .button-row) {",
            "width: auto;",
            "border: 0;",
            ".lesson-detail-page .lesson-detail-hero__media--composition img {",
            ".lesson-detail-page .lesson-detail-hero__media--dtm img {",
            ".lesson-detail-page .lesson-detail-hero__media--theory img {",
            ".lesson-detail-page .lesson-detail-hero__media--solfege img {",
            ".lesson-detail-page .lesson-detail-hero__media--electroacoustic img {",
            ".lesson-detail-page .lesson-detail-hero__media--technology img {",
            "display: grid;\n    width: 100%;\n    grid-template-columns: 1fr;",
        ):
            self.assertIn(rule, css)

    def test_shared_lesson_css_resets_common_inline_spacing(self):
        css = page_html("assets/css/lesson-detail-final.css")
        self.assertNotIn(".lesson-detail-page main > section:not(.hero)", css)
        for selector in (
            r"\.lesson-detail-page \.lesson-detail-hero",
            r"\.lesson-detail-page main > section:not\(\.lesson-detail-hero\)",
            r"\.lesson-detail-page main > section\.dark",
        ):
            self.assertRegex(
                css,
                rf"(?s){selector}\s*\{{[^}}]*padding-inline:\s*0;",
            )

    def test_shared_lesson_css_defines_section_and_card_typography(self):
        css = page_html("assets/css/lesson-detail-final.css")
        for selector, declarations in (
            (
                r"\.lesson-detail-page main > section:not\(\.lesson-detail-hero\) h2",
                ("font-size: var(--acs-h2);", "line-height: 1.2;"),
            ),
            (
                r"\.lesson-detail-page main > section:not\(\.lesson-detail-hero\) h3",
                ("font-size: var(--acs-h3);", "line-height: 1.35;"),
            ),
            (
                r"\.lesson-detail-page :is\(\.card, \.wide-card, \.sample-card, \.video-card, \.soundcloud-card\) :is\(p, li\)",
                ("font-size: var(--acs-text-base);", "line-height: 1.8;"),
            ),
            (
                r"\.lesson-detail-page main > section:not\(\.lesson-detail-hero\) li",
                ("line-height: 1.8;",),
            ),
        ):
            for declaration in declarations:
                self.assertRegex(
                    css,
                    rf"(?s){selector}\s*\{{[^}}]*{re.escape(declaration)}",
                )
        self.assertRegex(
            css,
            r"(?s)\.lesson-detail-page :is\(\.card, \.price-card, \.sample-card, \.wide-card, \.video-card, \.soundcloud-card\)\s*\{[^}]*padding:\s*var\(--acs-space-5\);",
        )

    def test_shared_lesson_css_collapses_content_grids_at_760px_only(self):
        css = page_html("assets/css/lesson-detail-final.css")
        self.assertRegex(
            css,
            r"(?s)@media \(max-width: 760px\).*?\.lesson-detail-page :is\(\.grid-2, \.grid-3, \.cards, \.card-grid, \.step-grid, \.mini-grid, \.video-grid, \.sample-grid, \.price-grid\)\s*\{[^}]*grid-template-columns:\s*1fr;",
        )
        self.assertNotIn("@media (max-width: 761px)", css)

    def test_shared_lesson_css_preserves_legacy_french_refinements(self):
        css = page_html("assets/css/lesson-detail-final.css")
        for selector in (
            ":root {",
            "\nbody {",
            "\n.site-header {",
            "\n.hero {",
            "\n.hero > * {",
            "\n.lesson-image {",
            "\nmain > section:not(.hero) {",
            "\n  *::before,",
        ):
            self.assertIn(selector, css)

        self.assertIn(".lesson-detail-page .lesson-detail-hero {", css)

    def test_all_lesson_details_load_shared_refinement_css_and_have_one_h1(self):
        for page_path in JA_DETAILS:
            page = load_page(page_path)
            self.assertIn("../assets/css/lesson-detail-final.css", page.stylesheets, page_path)
            self.assertEqual(
                1,
                len([item for item in page.headings if item["tag"] == "h1"]),
                page_path,
            )
        for page_path in FR_DETAILS:
            page = load_page(page_path)
            self.assertTrue(
                any(
                    stylesheet.split("?", 1)[0] == "../assets/css/fr-site.css"
                    for stylesheet in page.stylesheets
                ),
                page_path,
            )
            self.assertNotIn("../assets/css/lesson-detail-final.css", page.stylesheets, page_path)
            self.assertEqual(
                1,
                len([item for item in page.headings if item["tag"] == "h1"]),
                page_path,
            )

    def test_lesson_details_do_not_use_obsolete_home_anchors(self):
        japanese_obsolete = ("#modules", "#lessons", "#travail", "#tarifs", "#formats", "/ja/#contact")
        for page_path in JA_DETAILS:
            html = page_html(page_path)
            for fragment in japanese_obsolete:
                self.assertNotIn(fragment, html, page_path)
        french_obsolete = ("#entrypoints", "#format", "#works", "#questions", "#instructor")
        for page_path in (*FR_DETAILS, "fr/booking.html"):
            html = page_html(page_path)
            for fragment in french_obsolete:
                self.assertNotIn(f'index.html{fragment}"', html, page_path)

    def test_japanese_lesson_consultation_routes_are_direct(self):
        for page_path in JA_DETAILS:
            html = page_html(page_path)
            self.assertNotIn('href="#consultation"', html, page_path)
            self.assertNotIn('href="#contact"', html, page_path)
            self.assertRegex(html, r'href="(?:/ja/)?booking\.html"')

    def test_french_lesson_navigation_uses_current_sections(self):
        header_script = page_html("assets/js/acs-header.js")
        self.assertIn('index.html#resultats', header_script)
        self.assertIn('index.html#formats', header_script)
        self.assertIn('index.html#methode', header_script)
        self.assertIn('index.html#experience', header_script)
        self.assertIn('index.html#contact', header_script)
        for page_path in (*FR_DETAILS, "fr/booking.html"):
            html = page_html(page_path)
            self.assertIn('../assets/js/acs-header.js', html, page_path)

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
            page_html(path) for path in ("fr/index.html", "fr/booking.html")
        ) + page_html("assets/js/fr-tracking.js")
        for event in (
            "click_primary_cta",
            "click_secondary_cta",
            "view_offer",
            "begin_booking",
            "submit_booking",
            "request_feedback",
            "click_gumroad",
            "download_sample",
            "play_work",
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
