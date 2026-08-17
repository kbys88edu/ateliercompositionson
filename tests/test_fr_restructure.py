import hashlib
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path
from urllib.parse import unquote, urlsplit

from tests.site_test_utils import ROOT, load_page, repo_path


FR_PAGES = (
    "fr/index.html",
    "fr/booking.html",
    "fr/composition-lesson.html",
    "fr/harmony-analysis-lesson.html",
    "fr/electroacoustic-lesson.html",
    "fr/mao-lesson.html",
    "fr/confidentialite/index.html",
)

FR_DETAILS = (
    "fr/composition-lesson.html",
    "fr/harmony-analysis-lesson.html",
    "fr/electroacoustic-lesson.html",
    "fr/mao-lesson.html",
)

JA_BASELINE_SHA256 = {
    "ja/booking.html": "f208f736bba443603b5797e15f0b978ce39f88bf7eee7145999626ae801be6cb",
    "ja/composition-lesson.html": "121f4987fa8b14163161b92ed892b22da92d262698b19e64093b98867154761b",
    "ja/dtm-lesson.html": "5239e4e6f3c3b1c0965c8775324ebf01133354b961644ba46a319821533ded7f",
    "ja/electroacoustic-lesson.html": "caf6be61ebbb0b60caa38ce1fd405bb899d15f91eb16d1ee683f4818601ec48b",
    "ja/faq.html": "ba78d4ff7c56b5a09af4a26b885521cecbde162b287ff68930c1f0893d993dca",
    "ja/index.html": "9b43f3aa874523471601e61e1eef7a23b54dbf8fcc00be71c6aed0668387396d",
    "ja/mail-correction.html": "cd0a8fa8937bceb55d2ace21311d9cfef4968876c197fe11b55a49642e1aba3e",
    "ja/music-theory-lesson_with_pdf-link.html": "8c4a9b2280bf107f41507496f95f8431a42d6b457b87c853af1e8f8048603d46",
    "ja/profile.html": "75a2d0119157a0ce086251b87c07e93857fb1b752092a04e07f4e356603580cf",
    "ja/simple-synth.html": "9ecf11d5137c3488ca194199e4031208207d2c8885048972ab723f4af69f6285",
    "ja/solfege.html": "4cf6e0ed7be7f724858c46e03738c25aa24f059245e75c245512dec50843cb3b",
    "ja/sound-technology-ai-lesson.html": "f7cfd41987ad6f404c6062073454f2b38f573bc6dab25be949d09014b3e2e82e",
    "ja/terms.html": "4e2d80f328d100caad648892ffc81b6703b0775cb23b8e65d1a65db0718cad8d",
}


def html(path):
    return repo_path(path).read_text(encoding="utf-8")


def meta_content(page_html, name):
    match = re.search(
        rf'<meta\s+name="{re.escape(name)}"\s+content="([^"]+)"',
        page_html,
        re.IGNORECASE,
    )
    return match.group(1) if match else None


def canonical_href(page_html):
    match = re.search(
        r'<link\s+rel="canonical"\s+href="([^"]+)"',
        page_html,
        re.IGNORECASE,
    )
    return match.group(1) if match else None


def structured_data(page_html):
    blocks = re.findall(
        r'<script\s+type="application/ld\+json">\s*(.*?)\s*</script>',
        page_html,
        re.DOTALL,
    )
    return [json.loads(block) for block in blocks]


class FrenchHomepageContractTests(unittest.TestCase):
    def test_homepage_uses_requested_positioning_and_six_sections(self):
        page = load_page("fr/index.html")
        source = html("fr/index.html")
        h1s = [item["text"] for item in page.headings if item["tag"] == "h1"]
        self.assertEqual(
            ["Accompagnement individuel en composition et création sonore"],
            h1s,
        )
        expected_ids = (
            "top",
            "resultats",
            "formats",
            "methode",
            "experience",
            "contact",
        )
        positions = [source.index(f'id="{section_id}"') for section_id in expected_ids]
        self.assertEqual(positions, sorted(positions))
        for legacy_id in ("entrypoints", "process", "format", "questions", "conditions"):
            self.assertNotIn(f'id="{legacy_id}"', source)

    def test_hero_uses_real_photo_and_requested_ctas(self):
        source = html("fr/index.html")
        self.assertIn("hero-atelier-performance", source)
        self.assertNotIn("hero-collage2.png", source.split("</header>", 1)[0])
        self.assertIn('loading="eager"', source)
        self.assertIn('fetchpriority="high"', source)
        self.assertRegex(
            source,
            r'href="booking\.html[^"]*"[^>]*data-track="click_primary_cta"[^>]*>\s*Faire le point sur mon projet',
        )
        self.assertRegex(
            source,
            r'href="#formats"[^>]*data-track="click_secondary_cta"[^>]*>\s*Voir les formats d’accompagnement',
        )
        self.assertIn(
            "Composition, électroacoustique, Max/MSP, analyse, écriture et MAO créative.",
            source,
        )

    def test_outcomes_describe_results_before_disciplines(self):
        source = html("fr/index.html")
        for text in (
            "Développer un matériau en forme",
            "Résoudre un blocage précis",
            "Finaliser un projet",
        ):
            self.assertIn(text, source)
        self.assertLess(source.index("Développer un matériau en forme"), source.index('id="formats"'))

    def test_offers_show_exact_prices_and_distinct_destinations(self):
        page = load_page("fr/index.html")
        source = html("fr/index.html")
        for price in ("19€", "29€", "70€ / 60 min"):
            self.assertIn(price, source)
        tracked = {
            link.get("data-track"): link
            for link in page.links
            if link.get("data-track")
        }
        self.assertTrue(tracked["click_gumroad"]["href"].startswith("https://sonata14.gumroad.com/l/gvbzop"))
        self.assertEqual(
            "booking.html?offer=mini-feedback#contact-form",
            tracked["request_feedback"]["href"],
        )
        self.assertEqual(
            "booking.html?offer=individual-session#reservation",
            tracked["begin_booking"]["href"],
        )
        self.assertEqual(
            "../assets/pdf/gratuit_5-questions-pour-commencer-une-piece-sonore.pdf",
            tracked["download_sample"]["href"],
        )

    def test_kit_uses_actual_local_product_preview_assets(self):
        source = html("fr/index.html")
        expected = (
            "images/fr/kit-son-cover.webp",
            "images/fr/kit-son-inside-01.webp",
            "images/fr/kit-son-inside-02.webp",
        )
        for path in expected:
            self.assertTrue(repo_path(path).is_file(), path)
            self.assertIn(f"../{path}", source)
        self.assertNotIn("../images/documentation-1.jpg", source)
        for verified_text in (
            "esquisse sonore de 60 secondes",
            "environ 13 minutes",
            "5 exemples audio WAV",
            "3 sons de pratique WAV",
            "Téléchargement en français",
        ):
            self.assertIn(verified_text, source)

    def test_mini_feedback_states_scope_timing_and_exclusions(self):
        source = html("fr/index.html")
        for text in (
            "lien d’écoute ou fichier audio",
            "Une seule réponse écrite",
            "Le délai est confirmé avant le règlement",
            "Pas de séance en direct ni de nouvel envoi inclus",
        ):
            self.assertIn(text, source)

    def test_individual_session_is_project_support(self):
        source = html("fr/index.html")
        for text in (
            "partition, maquette ou session DAW",
            "documents peuvent être envoyés avant la séance",
            "en ligne",
            "Langue : français",
            "70€ / 60 min",
        ):
            self.assertIn(text, source)

    def test_work_embeds_are_click_to_load(self):
        page = load_page("fr/index.html")
        source = html("fr/index.html")
        self.assertEqual([], page.iframes)
        self.assertGreaterEqual(source.count("data-embed-src="), 3)
        self.assertGreaterEqual(source.count('data-track="play_work"'), 3)


class FrenchDetailPageContractTests(unittest.TestCase):
    def test_all_french_pages_have_one_h1_and_french_assets_only(self):
        for page_path in FR_PAGES:
            page = load_page(page_path)
            asset_prefix = "../../" if page_path.startswith("fr/confidentialite/") else "../"
            self.assertEqual(
                1,
                len([item for item in page.headings if item["tag"] == "h1"]),
                page_path,
            )
            self.assertIn(f"{asset_prefix}assets/css/fr-site.css", page.stylesheets, page_path)
            self.assertIn(f"{asset_prefix}assets/js/fr-tracking.js", page.scripts, page_path)
            self.assertNotIn(f"{asset_prefix}assets/js/acs-tracking.js", page.scripts, page_path)

    def test_french_page_images_use_modern_formats_and_intrinsic_dimensions(self):
        for page_path in FR_PAGES:
            source = html(page_path)
            for image_tag in re.findall(r"<img\b[^>]*>", source):
                src = re.search(r'\bsrc="([^"]+)"', image_tag)
                self.assertIsNotNone(src, (page_path, image_tag))
                self.assertRegex(src.group(1), r"\.(?:webp|avif)$", (page_path, src.group(1)))
                self.assertRegex(image_tag, r'\bwidth="\d+"', (page_path, image_tag))
                self.assertRegex(image_tag, r'\bheight="\d+"', (page_path, image_tag))

    def test_mao_page_centers_compositional_decisions(self):
        source = html("fr/mao-lesson.html")
        self.assertIn("<h1>MAO créative au service de la composition</h1>", source)
        self.assertIn(
            "Utiliser le DAW pour organiser, transformer et développer une idée musicale",
            source,
        )
        for text in (
            "organisation d’une session",
            "choix du matériau",
            "forme",
            "timbre",
            "transformation",
            "montage",
            "automation",
            "écoute critique",
            "Outils possibles",
        ):
            self.assertIn(text, source)

    def test_methodology_is_present_without_tool_name_wall(self):
        combined = html("fr/index.html") + html("fr/electroacoustic-lesson.html")
        for label in ("Analyse", "Contraintes", "Génération", "Sélection", "Réécriture"):
            self.assertIn(label, combined)
        self.assertIn("<details", combined)
        self.assertIn("Outils possibles", combined)

    def test_detail_pages_use_specific_metadata_and_structured_data(self):
        for page_path in FR_DETAILS:
            source = html(page_path)
            self.assertTrue(meta_content(source, "description"), page_path)
            canonical = canonical_href(source)
            self.assertEqual(
                f"https://ateliercompositionson.com/{page_path}",
                canonical,
                page_path,
            )
            data = structured_data(source)
            serialized = json.dumps(data, ensure_ascii=False)
            self.assertIn("BreadcrumbList", serialized, page_path)
            self.assertIn("Course", serialized, page_path)
            self.assertIn('hreflang="fr"', source, page_path)
            self.assertIn('hreflang="ja"', source, page_path)

    def test_detail_prices_remain_70_euros_for_60_minutes(self):
        for page_path in FR_DETAILS:
            source = html(page_path)
            self.assertIn("70€ / 60 min", source, page_path)
            self.assertNotRegex(source, r"\b(?:19|29)€", page_path)


class FrenchBookingAndPrivacyTests(unittest.TestCase):
    def test_booking_has_compact_labeled_form(self):
        page = load_page("fr/booking.html")
        source = html("fr/booking.html")
        form = next(
            element["attrs"]
            for element in page.elements
            if element["tag"] == "form" and element["attrs"].get("id") == "contact-form"
        )
        self.assertEqual("https://formspree.io/f/mbdbpqrj", form.get("action"))
        for name in ("name", "email", "language", "domain", "availability", "message"):
            self.assertRegex(source, rf'<(?:input|select|textarea)[^>]+name="{name}"[^>]+required')
        self.assertRegex(source, r'<input[^>]+name="project_url"')
        self.assertNotRegex(source, r'name="(?:daw|equipment|biography|learning_history)"')
        self.assertIn('aria-live="polite"', source)
        self.assertIn('aria-live="assertive"', source)

    def test_booking_loads_calendly_only_after_action(self):
        page = load_page("fr/booking.html")
        source = html("fr/booking.html")
        self.assertNotIn("https://assets.calendly.com/assets/external/widget.js", page.scripts)
        self.assertIn('data-calendly-url="https://calendly.com/acs_trial/trial_acs"', source)
        self.assertIn('data-track="begin_booking"', source)

    def test_booking_links_to_privacy_notice(self):
        source = html("fr/booking.html")
        self.assertIn('href="confidentialite/"', source)
        self.assertIn(
            "Les informations transmises sont utilisées uniquement pour répondre à votre demande",
            source,
        )

    def test_booking_offer_query_maps_to_consistent_analytics_ids(self):
        booking_source = html("fr/booking.html")
        script_source = html("assets/js/fr-site.js")
        self.assertIn('name="offer" value="free_contact"', booking_source)
        for query_value, analytics_value in (
            ("free-contact", "free_contact"),
            ("mini-feedback", "mini_feedback_29"),
            ("individual-session", "individual_session_70"),
        ):
            self.assertIn(f'"{query_value}": "{analytics_value}"', script_source)

    def test_privacy_page_has_required_sections_and_legal_flags(self):
        source = html("fr/confidentialite/index.html")
        for text in (
            "Responsable du traitement",
            "Finalité",
            "Données collectées",
            "Caractère obligatoire ou facultatif",
            "Durée de conservation",
            "Destinataires",
            "Vos droits",
            "Contact",
            "Transfert éventuel hors de l’Union européenne",
            "à confirmer",
        ):
            self.assertIn(text, source)


class FrenchSeoAndNavigationTests(unittest.TestCase):
    def test_homepage_metadata_matches_positioning(self):
        source = html("fr/index.html")
        self.assertIn(
            "<title>Cours de composition en ligne et création sonore | Atelier Composition Son</title>",
            source,
        )
        self.assertEqual(
            "Accompagnement individuel en composition, création sonore, électroacoustique, Max/MSP et MAO créative, à partir de vos partitions, sons et sessions DAW.",
            meta_content(source, "description"),
        )
        self.assertEqual(
            "https://ateliercompositionson.com/fr/",
            canonical_href(source),
        )
        for language in ("fr", "ja", "x-default"):
            self.assertIn(f'hreflang="{language}"', source)
        serialized = json.dumps(structured_data(source), ensure_ascii=False)
        for item_type in ("Organization", "Person", "Service"):
            self.assertIn(item_type, serialized)

    def test_sitemap_lists_all_french_routes(self):
        source = html("sitemap.xml")
        for page_path in FR_PAGES:
            route = page_path.removesuffix("index.html")
            self.assertIn(f"https://ateliercompositionson.com/{route}", source)

    def test_french_header_targets_new_sections(self):
        source = html("assets/js/acs-header.js")
        for href in (
            "index.html#resultats",
            "index.html#formats",
            "index.html#methode",
            "index.html#experience",
            "index.html#contact",
        ):
            self.assertIn(href, source)
        self.assertIn('consultation: "Faire le point"', source)

    def test_local_french_links_and_fragments_resolve(self):
        for page_path in FR_PAGES:
            page = load_page(page_path)
            for link in page.links:
                raw_href = link.get("href", "")
                parsed = urlsplit(raw_href)
                if (
                    not raw_href
                    or raw_href.startswith(("#", "mailto:", "tel:"))
                    or parsed.scheme
                ):
                    if raw_href.startswith("#"):
                        self.assertIn(unquote(parsed.fragment), page.ids, (page_path, raw_href))
                    continue
                target = (
                    ROOT / unquote(parsed.path.lstrip("/"))
                    if parsed.path.startswith("/")
                    else repo_path(page_path).parent / unquote(parsed.path)
                ).resolve()
                if target.is_dir():
                    target = target / "index.html"
                self.assertTrue(target.exists(), (page_path, raw_href, target))
                if parsed.fragment and target.suffix == ".html":
                    target_page = load_page(str(target.relative_to(ROOT)))
                    self.assertIn(unquote(parsed.fragment), target_page.ids, (page_path, raw_href))


class FrenchTrackingContractTests(unittest.TestCase):
    def test_requested_events_and_common_parameters_exist(self):
        source = html("assets/js/fr-tracking.js")
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
            self.assertIn(event, source)
        for parameter in ("locale", "page_type", "offer", "cta_position", "traffic_source"):
            self.assertIn(parameter, source)

    def test_one_click_emits_one_explicit_event(self):
        node = shutil.which("node")
        self.assertIsNotNone(node)
        script_path = repo_path("assets/js/fr-tracking.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");
const events = [];
const handlers = {};
const attrs = {
  href: "https://sonata14.gumroad.com/l/gvbzop",
  "data-track": "click_gumroad",
  "data-offer": "kit_19",
  "data-cta-position": "offers",
};
const link = {
  getAttribute(name) { return attrs[name] || null; },
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name); },
  get href() { return attrs.href; },
  textContent: "Accéder au kit — 19 €",
};
const body = { dataset: { pageType: "landing" } };
const document = {
  readyState: "complete",
  body,
  addEventListener(type, handler) { handlers[type] = handler; },
  querySelectorAll() { return []; },
};
const location = {
  href: "https://ateliercompositionson.com/fr/?utm_source=instagram",
  origin: "https://ateliercompositionson.com",
  search: "?utm_source=instagram",
  assign() {},
};
const window = {
  location,
  setTimeout(callback) { callback(); },
  addEventListener() {},
};
function gtag(kind, name, payload) {
  events.push({ name, payload });
  if (payload.event_callback) payload.event_callback();
}
vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), {
  document, window, location, gtag, URL, URLSearchParams,
  sessionStorage: { getItem() { return null; }, setItem() {} },
  IntersectionObserver: class { observe() {} },
});
handlers.click({
  target: { closest(selector) { return selector === "a[data-track]" ? link : null; } },
  preventDefault() {},
  metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
});
console.log(JSON.stringify(events));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        events = json.loads(result.stdout)
        self.assertEqual(["click_gumroad"], [event["name"] for event in events])
        payload = events[0]["payload"]
        self.assertEqual("fr", payload["locale"])
        self.assertEqual("landing", payload["page_type"])
        self.assertEqual("kit_19", payload["offer"])
        self.assertEqual("offers", payload["cta_position"])
        self.assertEqual("instagram", payload["traffic_source"])


class JapaneseRegressionGuardTests(unittest.TestCase):
    def test_japanese_html_is_byte_for_byte_unchanged(self):
        for page_path, expected in JA_BASELINE_SHA256.items():
            digest = hashlib.sha256(repo_path(page_path).read_bytes()).hexdigest()
            self.assertEqual(expected, digest, page_path)

    def test_french_only_assets_are_not_loaded_by_japanese_pages(self):
        for page_path in JA_BASELINE_SHA256:
            source = html(page_path)
            self.assertNotIn("fr-site.css", source, page_path)
            self.assertNotIn("fr-tracking.js", source, page_path)


if __name__ == "__main__":
    unittest.main()
