import unittest
from tests.site_test_utils import repo_path


class DesignSystemTests(unittest.TestCase):
    def test_shared_stylesheet_exposes_required_components(self):
        css_path = repo_path("assets/css/acs-core.css")
        self.assertTrue(css_path.exists())
        css = css_path.read_text(encoding="utf-8")
        for selector in (
            ".acs-container", ".acs-section", ".acs-btn", ".acs-btn--primary",
            ".acs-text-link", ".acs-site-header", ".acs-menu-toggle",
            ".acs-rule-list", ".acs-media", ".acs-faq",
        ):
            self.assertIn(selector, css)

    def test_shared_stylesheet_defines_approved_tokens(self):
        css_path = repo_path("assets/css/acs-core.css")
        self.assertTrue(css_path.exists())
        css = css_path.read_text(encoding="utf-8")
        for token in (
            "--acs-paper", "--acs-surface", "--acs-ink", "--acs-muted",
            "--acs-line", "--acs-focus", "--acs-container", "--acs-reading",
            "--acs-space-1", "--acs-space-10",
        ):
            self.assertIn(token, css)
        self.assertIn("prefers-reduced-motion: reduce", css)
        self.assertIn(":focus-visible", css)

    def test_shared_ui_script_contains_accessible_menu_contract(self):
        script_path = repo_path("assets/js/acs-ui.js")
        self.assertTrue(script_path.exists())
        script = script_path.read_text(encoding="utf-8")
        self.assertIn("aria-expanded", script)
        self.assertIn('event.key === "Escape"', script)
        self.assertIn("data-menu-close", script)
