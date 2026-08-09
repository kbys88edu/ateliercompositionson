import json
import shutil
import subprocess
import unittest
from tests.site_test_utils import repo_path


class DesignSystemTests(unittest.TestCase):
    def test_task_3_opening_markup_uses_composed_styles(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        html = repo_path("ja/index.html").read_text(encoding="utf-8")
        for class_name in (
            "acs-kicker", "ja-home-hero__facts", "ja-trust",
            "ja-trust__grid", "ja-who", "ja-who__paths", "ja-index",
        ):
            self.assertIn(class_name, html)
        for selector in (
            ".acs-kicker", ".ja-home-hero h1", ".ja-home-hero__facts",
            ".ja-home-hero__facts > div", ".ja-trust", ".ja-trust__grid",
            ".ja-who", ".ja-who__paths", ".ja-who__paths article", ".ja-index",
        ):
            self.assertIn(selector, css)

    def test_mobile_hero_explicitly_orders_media_before_copy(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        self.assertIn(".ja-home-hero__media { order: -1;", mobile_css)
        self.assertIn(".ja-home-hero__copy { order: 0;", mobile_css)

    def test_lower_page_compatibility_layer_covers_retained_markup(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        for selector in (
            "main .section-grid", "main .section-grid h2", "main .section-kicker",
            "main .text-block", "main .cards", "main .card", "main .modules",
            "main .module", "main .voices-grid", "main .voice-card",
            "main .price-grid", "main .price-card", "main .btn", "main .faq",
            "main .teacher-photo",
        ):
            self.assertIn(selector, css)
        for selector in (
            "main .section-grid", "main .cards", "main .modules",
            "main .voices-grid", "main .price-grid",
        ):
            self.assertIn(selector, mobile_css)

    def test_ja_home_stylesheet_composes_all_homepage_sections(self):
        css_path = repo_path("assets/css/ja-home.css")
        self.assertTrue(css_path.exists())
        css = css_path.read_text(encoding="utf-8")
        for selector in (
            ".ja-home-hero__eyebrow", ".ja-home-hero__copy",
            ".ja-home-trust__title", ".ja-home-trust__copy",
            ".ja-home-audience__item", ".ja-home-audience__title",
            ".ja-home-audience__copy", ".ja-home-audience__link",
            ".ja-home-study-family__number", ".ja-home-study-family__title",
            ".ja-home-study-family__copy", ".ja-home-study-family__link",
            ".ja-home-process__title", ".ja-home-process__copy",
            ".ja-home-process__link", ".ja-home-instructor__copy",
            ".ja-home-instructor__meta", ".ja-home-instructor__actions",
            ".ja-home-works__item", ".ja-home-works__title",
            ".ja-home-works__meta", ".ja-home-works__link",
            ".ja-home-voices__item", ".ja-home-voices__quote",
            ".ja-home-voices__meta", ".ja-home-pricing__intro",
            ".ja-home-pricing__title", ".ja-home-pricing__price",
            ".ja-home-pricing__details", ".ja-home-pricing__actions",
            ".ja-home-faq__intro", ".ja-home-faq__title",
            ".ja-home-faq__answer", ".ja-home-final-cta__copy",
            ".ja-home-final-cta__actions",
        ):
            self.assertIn(selector, css)
        self.assertIn("@media (max-width: 767px)", css)
        for selector in (
            ".ja-home-audience__item", ".ja-home-study-family__item",
            ".ja-home-process > li", ".ja-home-instructor",
            ".ja-home-works", ".ja-home-voices", ".ja-home-pricing",
            ".ja-home-faq", ".ja-home-final-cta__inner",
        ):
            self.assertGreaterEqual(css.count(selector), 2, selector)

    def test_menu_script_coordinates_instances_and_restores_focus_only_when_open(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the menu behavior contract")
        script_path = repo_path("assets/js/acs-ui.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

function makeElement() {
  return {
    attributes: {}, hidden: false, handlers: {}, focusCount: 0,
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] || null; },
    addEventListener(type, handler) { (this.handlers[type] ||= []).push(handler); },
    dispatch(type, event = {}) { (this.handlers[type] || []).forEach((handler) => handler(event)); },
    focus() { this.focusCount += 1; },
  };
}

function makeMenu() {
  const toggle = makeElement();
  const panel = makeElement();
  const close = makeElement();
  close.closest = (selector) => selector === "[data-menu-close]" ? close : null;
  return {
    toggle, panel, close,
    querySelector(selector) {
      if (selector === "[data-menu-toggle]") return toggle;
      if (selector === "[data-menu-panel]") return panel;
      return null;
    },
  };
}

const menus = [makeMenu(), makeMenu()];
const documentHandlers = {};
const classes = new Set();
const document = {
  documentElement: { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } },
  querySelectorAll(selector) { return selector === "[data-menu]" ? menus : []; },
  addEventListener(type, handler) { (documentHandlers[type] ||= []).push(handler); },
  dispatch(type, event) { (documentHandlers[type] || []).forEach((handler) => handler(event)); },
};

vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), { document });
const [first, second] = menus;
const initial = first.panel.hidden && second.panel.hidden
  && first.toggle.getAttribute("aria-expanded") === "false"
  && second.toggle.getAttribute("aria-expanded") === "false";
document.dispatch("keydown", { key: "Escape" });
const closedEscapeDoesNotFocus = first.toggle.focusCount === 0 && second.toggle.focusCount === 0;
first.toggle.dispatch("click");
second.toggle.dispatch("click");
const bothOpen = !first.panel.hidden && !second.panel.hidden && classes.has("acs-menu-open");
first.panel.dispatch("click", { target: first.close });
const closeKeepsLockForSecond = first.panel.hidden && !second.panel.hidden && classes.has("acs-menu-open");
document.dispatch("keydown", { key: "Escape" });
const escapeClosesSecond = second.panel.hidden && !classes.has("acs-menu-open")
  && first.toggle.focusCount === 0 && second.toggle.focusCount === 1;
document.dispatch("keydown", { key: "Escape" });
const finalClosedEscapeDoesNotFocus = second.toggle.focusCount === 1;
console.log(JSON.stringify({ initial, closedEscapeDoesNotFocus, bothOpen, closeKeepsLockForSecond, escapeClosesSecond, finalClosedEscapeDoesNotFocus }));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            {
                "initial": True,
                "closedEscapeDoesNotFocus": True,
                "bothOpen": True,
                "closeKeepsLockForSecond": True,
                "escapeClosesSecond": True,
                "finalClosedEscapeDoesNotFocus": True,
            },
            json.loads(result.stdout),
        )

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
