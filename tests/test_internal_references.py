import unittest
from pathlib import Path
from xml.etree import ElementTree
from tests.site_test_utils import ROOT, load_page


def local_target(page_path, raw_target):
    clean = raw_target.split("#", 1)[0].split("?", 1)[0]
    if not clean or clean.startswith(("http://", "https://", "mailto:", "tel:")):
        return None
    return (ROOT / page_path).parent.joinpath(clean).resolve()


class InternalReferenceTests(unittest.TestCase):
    def test_changed_pages_have_existing_local_assets_and_routes(self):
        for page_path in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            page_file = ROOT / page_path
            self.assertTrue(page_file.exists(), page_path)
            page = load_page(page_path)
            targets = [link.get("href", "") for link in page.links]
            targets += [image.get("src", "") for image in page.images]
            targets += page.scripts + page.stylesheets
            for raw_target in targets:
                target = local_target(page_path, raw_target)
                if target is not None:
                    self.assertTrue(target.exists(), f"{page_path}: {raw_target}")

    def test_qa_and_cta_pages_declare_the_shared_favicon(self):
        for page_path in (
            "ja/index.html", "ja/profile.html", "ja/faq.html",
            "ja/booking.html", "ja/mail-correction.html",
        ):
            page = load_page(page_path)
            icons = [
                element["attrs"].get("href")
                for element in page.elements
                if element["tag"] == "link" and element["attrs"].get("rel") == "icon"
            ]
            self.assertEqual(["../images/acs-logo.png"], icons)

    def test_profile_and_faq_have_unique_japanese_metadata_and_booking_ctas(self):
        expected = {
            "ja/profile.html": {
                "canonical": "https://ateliercompositionson.com/ja/profile.html",
                "description": "Atelier Composition Son 講師 Sachie Kobayashi の略歴とメッセージ。",
                "title": "講師について | Atelier Composition Son",
                "type": "profile",
                "tracking": "profile_consultation",
            },
            "ja/faq.html": {
                "canonical": "https://ateliercompositionson.com/ja/faq.html",
                "description": "Atelier Composition Son の作曲・DTM・音楽理論レッスンについて、受講方法、ソフトウェア、AI音源、受験、添削に関するよくある質問です。",
                "title": "よくある質問 | Atelier Composition Son",
                "type": "website",
                "tracking": "faq_consultation",
            },
        }

        for page_path, contract in expected.items():
            page = load_page(page_path)
            html = next(element["attrs"] for element in page.elements if element["tag"] == "html")
            self.assertEqual("ja", html.get("lang"))
            self.assertEqual(1, len([heading for heading in page.headings if heading["tag"] == "h1"]))

            canonical = [
                element["attrs"].get("href") for element in page.elements
                if element["tag"] == "link" and element["attrs"].get("rel") == "canonical"
            ]
            self.assertEqual([contract["canonical"]], canonical)

            metadata = {
                (element["attrs"].get("name") or element["attrs"].get("property")): element["attrs"].get("content")
                for element in page.elements if element["tag"] == "meta"
            }
            self.assertEqual(contract["description"], metadata.get("description"))
            self.assertEqual(contract["title"], metadata.get("og:title"))
            self.assertEqual(contract["description"], metadata.get("og:description"))
            self.assertEqual(contract["type"], metadata.get("og:type"))
            self.assertEqual(contract["canonical"], metadata.get("og:url"))
            self.assertEqual("https://ateliercompositionson.com/images/sachie_studio.jpg", metadata.get("og:image"))

            booking_ctas = [
                link for link in page.links
                if link.get("href") == "booking.html" and link.get("data-track") == contract["tracking"]
            ]
            self.assertEqual(1, len(booking_ctas))

    def test_sitemap_lists_profile_and_faq_routes(self):
        sitemap = ElementTree.parse(ROOT / "sitemap.xml")
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locations = [node.text for node in sitemap.findall("sm:url/sm:loc", namespace)]
        self.assertIn("https://ateliercompositionson.com/ja/profile.html", locations)
        self.assertIn("https://ateliercompositionson.com/ja/faq.html", locations)
