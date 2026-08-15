import json
import re
import shutil
import subprocess
import unittest
from tests.site_test_utils import load_page, repo_path


class DesignSystemTests(unittest.TestCase):
    def test_homepage_h1_uses_h1_token_and_tablet_geometry_contract(self):
        css = repo_path("assets/css/public-site-final.css").read_text(encoding="utf-8")
        h1_rule = re.search(r"\.atelier-split-hero h1\s*\{([^}]*)\}", css)
        self.assertIsNotNone(h1_rule)
        self.assertIn("font-size: clamp(3rem, 5.6vw, 6.5rem)", h1_rule.group(1))

    def test_profile_portrait_uses_intrinsic_ratio_without_fixed_height(self):
        profile = load_page("ja/profile.html")
        portrait = next(
            image for image in profile.images
            if "teacher-photo" in image.get("class", "").split()
        )
        self.assertEqual(("2080", "1170"), (portrait.get("width"), portrait.get("height")))

        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        portrait_rules = re.findall(r"main \.teacher-photo\s*\{([^}]*)\}", css)
        self.assertTrue(portrait_rules)
        self.assertTrue(all("aspect-ratio" not in rule for rule in portrait_rules))
        self.assertTrue(any("height: auto" in rule for rule in portrait_rules))

    def test_japanese_mobile_headers_and_reviewed_links_have_44px_targets(self):
        for page_path in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            html = repo_path(page_path).read_text(encoding="utf-8")
            self.assertEqual(
                1,
                html.count('class="acs-site-header" data-shared-header'),
                page_path,
            )

        core_css = repo_path("assets/css/acs-core.css").read_text(encoding="utf-8")
        home_css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        for css, selector in (
            (core_css, ".acs-site-header__brand"),
            (core_css, ".acs-site-nav > a:not(.acs-btn)"),
            (core_css, ".acs-mobile-consultation"),
            (home_css, ".ja-who__paths .acs-text-link"),
            (home_css, ".ja-tools__item a"),
            (home_css, "body > footer a"),
        ):
            rule = re.search(re.escape(selector) + r"\s*\{([^}]*)\}", css)
            self.assertIsNotNone(rule, selector)
            self.assertIn("min-width: 44px", rule.group(1), selector)
            self.assertIn("min-height: 44px", rule.group(1), selector)

        mobile_css = core_css.split("@media (max-width: 767px)", 1)[1]
        mobile_cta = re.search(r"\.acs-mobile-consultation\s*\{([^}]*)\}", mobile_css)
        self.assertIsNotNone(mobile_cta)
        self.assertIn("display: none", mobile_cta.group(1))
        mobile_header = re.search(r"\.acs-site-header__inner\s*\{([^}]*)\}", mobile_css)
        self.assertIn("gap: var(--acs-space-1)", mobile_header.group(1))

        menu_toggle = re.search(r"\.acs-menu-toggle\s*\{([^}]*)\}", core_css)
        self.assertIn("white-space: nowrap", menu_toggle.group(1))
        self.assertIn("width: auto", menu_toggle.group(1))
        self.assertIn("letter-spacing: 0", menu_toggle.group(1))
        menu_arrow = re.search(r"\.acs-menu-toggle::after\s*\{([^}]*)\}", core_css)
        self.assertIsNotNone(menu_arrow)
        self.assertIn("content: none", menu_arrow.group(1))

        desktop_links = re.search(r"\.acs-site-nav > a:not\(\.acs-btn\)\s*\{([^}]*)\}", core_css)
        self.assertIsNotNone(desktop_links)
        self.assertIn("text-decoration: underline", desktop_links.group(1))
        self.assertIn("text-underline-offset: 5px", desktop_links.group(1))

        mobile_links = re.search(r"\.acs-menu-panel nav > a:not\(\.acs-btn\)\s*\{([^}]*)\}", core_css)
        self.assertIsNotNone(mobile_links)
        self.assertIn("text-decoration: underline", mobile_links.group(1))
        self.assertIn("text-underline-offset: 5px", mobile_links.group(1))

    def test_all_content_pages_use_the_shared_responsive_header(self):
        pages = sorted(
            path.relative_to(repo_path(".")).as_posix()
            for language in ("ja", "fr")
            for path in repo_path(language).glob("*.html")
        )
        self.assertEqual(19, len(pages))
        for page_path in pages:
            html = repo_path(page_path).read_text(encoding="utf-8-sig")
            self.assertEqual(1, html.count('class="acs-site-header" data-shared-header'), page_path)
            self.assertNotRegex(
                html,
                r'class="acs-site-header" data-shared-header></header>\s*<header',
                page_path,
            )
            self.assertEqual(1, html.count("../assets/js/acs-header.js"), page_path)
            self.assertIn("assets/css/acs-core.css", html, page_path)
            self.assertIn("assets/js/acs-ui.js", html, page_path)
            self.assertLess(
                html.index("../assets/js/acs-header.js"),
                html.index("../assets/js/acs-ui.js"),
                page_path,
            )

    def test_japanese_header_uses_accessible_compact_brand_below_360px(self):
        header_script = repo_path("assets/js/acs-header.js").read_text(encoding="utf-8")
        self.assertIn('class="acs-site-header__brand" aria-label="Atelier Composition Son"', header_script)
        self.assertIn('<span class="acs-site-header__brand-full" aria-hidden="true">Atelier Composition Son</span>', header_script)
        self.assertIn('<span class="acs-site-header__brand-short" aria-hidden="true">ACS</span>', header_script)

        core_css = repo_path("assets/css/acs-core.css").read_text(encoding="utf-8")
        compact_query = "@media (max-width: 359px)"
        self.assertIn(compact_query, core_css)
        default_short = re.search(r"\.acs-site-header__brand-short\s*\{([^}]*)\}", core_css)
        self.assertIsNotNone(default_short)
        self.assertIn("display: none", default_short.group(1))

        compact_css = core_css.split(compact_query, 1)[1]
        compact_full = re.search(r"\.acs-site-header__brand-full\s*\{([^}]*)\}", compact_css)
        compact_short = re.search(r"\.acs-site-header__brand-short\s*\{([^}]*)\}", compact_css)
        self.assertIsNotNone(compact_full)
        self.assertIsNotNone(compact_short)
        self.assertIn("display: none", compact_full.group(1))
        self.assertIn("display: inline", compact_short.group(1))

    def test_shared_header_renderer_uses_language_specific_navigation(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the header renderer contract")
        script_path = repo_path("assets/js/acs-header.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");
const language = process.argv[2];
const mount = {
  innerHTML: "", dataset: {}, attributes: {},
  setAttribute(name, value) { this.attributes[name] = String(value); },
};
const document = {
  documentElement: { lang: language },
  querySelectorAll(selector) {
    return selector === "[data-shared-header]" ? [mount] : [];
  },
};
vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), { document });
console.log(JSON.stringify({ attributes: mount.attributes, html: mount.innerHTML }));
'''
        rendered = {}
        for language in ("ja", "fr"):
            result = subprocess.run(
                [node, "-e", harness, str(script_path), language],
                check=True,
                capture_output=True,
                text=True,
            )
            rendered[language] = json.loads(result.stdout)

        for hook in ("data-menu", "data-menu-toggle", "data-menu-panel", "data-menu-close"):
            japanese_output = json.dumps(rendered["ja"], ensure_ascii=False)
            french_output = json.dumps(rendered["fr"], ensure_ascii=False)
            self.assertIn(hook, japanese_output)
            self.assertIn(hook, french_output)
        for label, href in (
            ("レッスン", "index.html#study"),
            ("講師", "index.html#instructor"),
            ("料金", "index.html#price"),
            ("受講者の声", "index.html#voices"),
            ("無料相談", "booking.html"),
        ):
            self.assertIn(label, rendered["ja"]["html"])
            self.assertIn('href="{}"'.format(href), rendered["ja"]["html"])
        for label, href in (
            ("Cours", "index.html#entrypoints"),
            ("À propos", "index.html#instructor"),
            ("Tarifs", "index.html#format"),
            ("Œuvres", "index.html#works"),
            ("FAQ", "index.html#questions"),
            ("Rendez-vous", "booking.html"),
        ):
            self.assertIn(label, rendered["fr"]["html"])
            self.assertIn('href="{}"'.format(href), rendered["fr"]["html"])
        self.assertIn('data-track="click_free_consultation"', rendered["ja"]["html"])
        self.assertIn('data-track="click_free_consultation_fr"', rendered["fr"]["html"])

    def test_task_3_opening_markup_uses_composed_styles(self):
        css = repo_path("assets/css/public-site-final.css").read_text(encoding="utf-8")
        html = repo_path("ja/index.html").read_text(encoding="utf-8")
        for class_name in (
            "acs-kicker", "atelier-split-hero", "atelier-split-hero__media", "ja-trust",
            "ja-trust__grid", "ja-who", "ja-who__paths", "ja-index",
        ):
            self.assertIn(class_name, html)
        for selector in (
            ".atelier-split-hero", ".atelier-split-hero h1", ".atelier-split-hero__media",
            ".atelier-split-hero__copy", ".atelier-split-hero__actions",
        ):
            self.assertIn(selector, css)

    def test_split_hero_respects_desktop_and_mobile_contract(self):
        css = repo_path("assets/css/public-site-final.css").read_text(encoding="utf-8")
        hero = re.search(r"\.atelier-split-hero\s*\{([^}]*)\}", css)
        media = re.search(r"\.atelier-split-hero__media\s*\{([^}]*)\}", css)
        image = re.search(r"\.atelier-split-hero__image\s*\{([^}]*)\}", css)
        collage = re.search(r"\.atelier-split-hero__image--collage\s*\{([^}]*)\}", css)
        self.assertIsNotNone(hero)
        self.assertIsNotNone(media)
        self.assertIsNotNone(image)
        self.assertIsNotNone(collage)
        self.assertIn("grid-template-columns: minmax(0, 64fr) minmax(0, 36fr)", hero.group(1))
        for declaration in (
            "height: 100%",
            "min-height: 0",
            "align-self: stretch",
            "overflow: hidden",
        ):
            self.assertIn(declaration, media.group(1))
        self.assertIn("height: 100%", image.group(1))
        self.assertIn("object-fit: cover", image.group(1))
        self.assertIn("object-fit: contain", collage.group(1))

        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        mobile_hero = re.search(r"\.atelier-split-hero--ja,\s*\.atelier-split-hero--fr\s*\{([^}]*)\}", mobile_css)
        mobile_collage_media = re.search(r"\.atelier-split-hero__media:has\(\.atelier-split-hero__image--collage\)\s*\{([^}]*)\}", mobile_css)
        mobile_button = re.search(r"\.atelier-split-hero__actions a\s*\{([^}]*)\}", mobile_css)
        self.assertIn("grid-template-columns: 1fr", mobile_hero.group(1))
        self.assertIsNotNone(mobile_collage_media)
        self.assertIn("aspect-ratio: 1114 / 1594", mobile_collage_media.group(1))
        self.assertIn("min-height: 44px", mobile_button.group(1))
        self.assertIn("font-size: 16px", mobile_css)

    def test_trust_strip_uses_caption_grid_geometry(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        desktop_grid = re.search(r"\.ja-trust__grid\s*\{([^}]*)\}", css)
        item = re.search(r"\.ja-trust__item\s*\{([^}]*)\}", css)
        index = re.search(r"\.ja-trust__index\s*\{([^}]*)\}", css)
        self.assertIsNotNone(desktop_grid)
        self.assertIn("grid-template-columns: repeat(4, minmax(0, 1fr))", desktop_grid.group(1))
        self.assertIn("gap: 16px", desktop_grid.group(1))
        self.assertNotIn("border-left", desktop_grid.group(1))
        self.assertIsNotNone(item)
        self.assertIn("border: var(--acs-rule)", item.group(1))
        self.assertNotIn("border-right", item.group(1))

        trust_copy = re.search(r"\.ja-trust__copy\s*\{([^}]*)\}", css)
        self.assertIsNotNone(trust_copy)
        self.assertIn("color: var(--acs-ink)", trust_copy.group(1))
        self.assertNotIn(".ja-trust__copy span", css)
        self.assertIsNotNone(index)
        self.assertIn("color: var(--acs-muted)", index.group(1))

        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        mobile_grid = re.search(r"\.ja-trust__grid\s*\{([^}]*)\}", mobile_css)
        self.assertIsNotNone(mobile_grid)
        self.assertIn("grid-template-columns: repeat(2, minmax(0, 1fr))", mobile_grid.group(1))
        self.assertIn("gap: 8px", mobile_grid.group(1))

    def test_concept_approaches_use_editorial_rule_rows(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        grid = re.search(r"\.ja-concept__approaches\s*\{([^}]*)\}", css)
        item = re.search(r"\.ja-concept__approaches article\s*\{([^}]*)\}", css)
        self.assertIsNotNone(grid)
        self.assertIn("grid-template-columns: 1fr", grid.group(1))
        self.assertIn("border-top: var(--acs-rule)", grid.group(1))
        self.assertIsNotNone(item)
        self.assertIn("border-bottom: var(--acs-rule-soft)", item.group(1))
        self.assertIn("padding-block: var(--acs-space-5)", item.group(1))
        self.assertNotIn("border-radius", item.group(1))
        self.assertNotIn("box-shadow", item.group(1))

        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        self.assertIn(".ja-concept__approaches", mobile_css)

    def test_study_cards_keep_padding_and_closed_sides_on_mobile(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        grid = re.search(r"\.ja-study__families\s*\{([^}]*)\}", css)
        card = re.search(r"\.ja-study-family\s*\{([^}]*)\}", css)
        self.assertIsNotNone(grid)
        self.assertIsNotNone(card)
        self.assertIn("border-left: var(--acs-rule)", grid.group(1))
        self.assertIn("padding: var(--acs-space-5)", card.group(1))
        self.assertIn("border-right: var(--acs-rule)", card.group(1))

        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        mobile_card = re.search(r"\.ja-study-family\s*\{([^}]*)\}", mobile_css)
        if mobile_card:
            self.assertNotIn("padding-inline: 0", mobile_card.group(1))
            self.assertNotIn("border-inline: 0", mobile_card.group(1))

    def test_study_cards_use_independent_high_transparency_backgrounds(self):
        css = repo_path("assets/css/ja-home.css").read_text(encoding="utf-8")
        background = re.search(r"\.ja-study-family::before\s*\{([^}]*)\}", css)
        self.assertIsNotNone(background)
        self.assertIn("opacity: 0.2", background.group(1))
        self.assertIn("filter: grayscale(1)", background.group(1))
        self.assertIn("background-size: cover", background.group(1))
        for index in (1, 2, 3):
            asset = f"lesson-field-{index:02d}.jpg"
            rule = re.search(
                rf"\.ja-study-family:nth-child\({index}\)::before\s*\{{([^}}]*)\}}",
                css,
            )
            self.assertIsNotNone(rule)
            self.assertIn(f"url(../../images/{asset})", rule.group(1))
            self.assertTrue(repo_path(f"images/{asset}").is_file())

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
        css = css_path.read_text(encoding="utf-8") + repo_path("assets/css/public-site-final.css").read_text(encoding="utf-8")
        for selector in (
            ".atelier-split-hero", ".atelier-split-hero__copy",
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

    def test_reduced_motion_contract_disables_smooth_scroll_and_animation(self):
        css = repo_path("assets/css/acs-core.css").read_text(encoding="utf-8")
        reduced_motion = css.split("@media (prefers-reduced-motion: reduce)", 1)[1]
        for declaration in (
            "scroll-behavior: auto",
            "animation-duration: 0.01ms !important",
            "animation-iteration-count: 1 !important",
            "transition-duration: 0.01ms !important",
        ):
            self.assertIn(declaration, reduced_motion)

    def test_japanese_menu_and_faq_use_native_keyboard_controls(self):
        header_script = repo_path("assets/js/acs-header.js").read_text(encoding="utf-8")
        self.assertEqual(1, header_script.count('class="acs-menu-toggle"'))
        self.assertIn('type="button"', header_script)
        self.assertIn('aria-expanded="false"', header_script)
        for page_path in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            html = repo_path(page_path).read_text(encoding="utf-8")
            self.assertEqual(1, html.count('class="acs-site-header" data-shared-header'), page_path)

        for page_path in ("ja/index.html", "ja/faq.html"):
            html = repo_path(page_path).read_text(encoding="utf-8")
            self.assertRegex(html, r"<details>\s*<summary>")

    def test_site_header_uses_required_mobile_and_desktop_heights(self):
        css = repo_path("assets/css/acs-core.css").read_text(encoding="utf-8")
        self.assertIn(".acs-site-header { position: sticky; top: 0; z-index: 10; height: 76px;", css)
        self.assertIn(".acs-site-header__inner { height: 100%;", css)
        mobile_css = css.split("@media (max-width: 767px)", 1)[1]
        self.assertIn(".acs-site-header { height: 64px; }", mobile_css)

    def test_shared_ui_script_contains_accessible_menu_contract(self):
        script_path = repo_path("assets/js/acs-ui.js")
        self.assertTrue(script_path.exists())
        script = script_path.read_text(encoding="utf-8")
        self.assertIn("aria-expanded", script)
        self.assertIn('event.key === "Escape"', script)
        self.assertIn("data-menu-close", script)
