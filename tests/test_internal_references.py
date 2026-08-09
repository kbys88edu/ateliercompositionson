import unittest
from pathlib import Path
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
