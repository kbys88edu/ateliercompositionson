import json
import shutil
import subprocess
import unittest

from tests.site_test_utils import repo_path


class TrackingTests(unittest.TestCase):
    def test_tracker_has_no_mojibake_heuristics(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        for bad in ("?????", "????", "?change gratuit", "30???"):
            self.assertNotIn(bad, script)

    def test_tracker_sends_explicit_data_track_event(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        self.assertIn('link.getAttribute("data-track")', script)
        self.assertIn("sendGaEvent(explicitEvent", script)

    def test_changed_pages_do_not_bind_inline_data_track_handlers(self):
        for page in ("ja/index.html", "ja/profile.html", "ja/faq.html"):
            html = repo_path(page).read_text(encoding="utf-8")
            self.assertNotIn("querySelectorAll('[data-track]')", html)
            self.assertNotIn('querySelectorAll("[data-track]")', html)

    def test_tracker_sends_explicit_and_canonical_events_once_with_utm(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the tracking behavior contract")
        script_path = repo_path("assets/js/acs-tracking.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

const documentHandlers = {};
const events = [];
const attributes = { href: "booking.html", "data-track": "hero_consultation" };
const link = {
  getAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name) ? attributes[name] : null; },
  setAttribute(name, value) { attributes[name] = String(value); },
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name); },
  get href() { return new URL(attributes.href, window.location.href).href; },
  textContent: "Free consultation",
};
const window = {
  location: { href: "https://atelier.example/ja/?utm_source=newsletter", search: "?utm_source=newsletter", origin: "https://atelier.example" },
  setTimeout() {},
};
const document = {
  readyState: "complete",
  querySelectorAll(selector) {
    if (selector === "a[href]") return [link];
    if (selector === "form") return [];
    return [];
  },
  addEventListener(type, handler) { documentHandlers[type] = handler; },
};
const sessionStorage = { setItem() {}, getItem() { return null; } };
function gtag(kind, name, payload) {
  events.push(name);
  payload.event_callback();
}

vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), {
  URL, URLSearchParams, document, gtag, sessionStorage, window,
});
let prevented = false;
documentHandlers.click({
  target: { closest(selector) { return selector === "a[href]" ? link : null; } },
  preventDefault() { prevented = true; },
});
console.log(JSON.stringify({ events, href: attributes.href, prevented }));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            {
                "events": ["hero_consultation", "free_consultation_click"],
                "href": "/ja/booking.html?utm_source=newsletter",
                "prevented": True,
            },
            json.loads(result.stdout),
        )

    def test_tracker_keeps_outbound_and_form_events(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the tracking behavior contract")
        script_path = repo_path("assets/js/acs-tracking.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

const documentHandlers = {};
const events = [];
const attributes = { href: "https://example.org/resource", "data-track": "resource_open" };
const link = {
  getAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name) ? attributes[name] : null; },
  setAttribute(name, value) { attributes[name] = String(value); },
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name); },
  get href() { return new URL(attributes.href, window.location.href).href; },
  textContent: "Resource",
};
const formHandlers = {};
const form = {
  id: "contact-form", classList: { contains(name) { return name === "contact-form"; } },
  getAttribute() { return null; },
  addEventListener(type, handler) { formHandlers[type] = handler; },
};
const window = {
  location: { href: "https://atelier.example/ja/", search: "", origin: "https://atelier.example" },
  setTimeout() {},
};
const document = {
  readyState: "complete",
  querySelectorAll(selector) {
    if (selector === "a[href]") return [link];
    if (selector === "form") return [form];
    return [];
  },
  addEventListener(type, handler) { documentHandlers[type] = handler; },
};
const sessionStorage = { setItem() {}, getItem() { return null; } };
function gtag(kind, name, payload) {
  events.push(name);
  payload.event_callback();
}

vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), {
  URL, URLSearchParams, document, gtag, sessionStorage, window,
});
let prevented = false;
documentHandlers.click({
  target: { closest(selector) { return selector === "a[href]" ? link : null; } },
  preventDefault() { prevented = true; },
});
formHandlers.submit({ defaultPrevented: false, submitter: null });
console.log(JSON.stringify({ events, prevented }));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            {"events": ["resource_open", "outbound_link_click", "contact_click"], "prevented": True},
            json.loads(result.stdout),
        )

    def test_delayed_navigation_waits_for_each_deduplicated_event(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the tracking behavior contract")
        script_path = repo_path("assets/js/acs-tracking.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

const callbacks = [];
const attributes = { href: "booking.html", "data-track": "hero_consultation" };
let currentHref = "https://atelier.example/ja/";
const link = {
  getAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name) ? attributes[name] : null; },
  setAttribute(name, value) { attributes[name] = String(value); },
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name); },
  get href() { return new URL(attributes.href, currentHref).href; },
  textContent: "Free consultation",
};
const window = {
  location: {
    get href() { return currentHref; },
    set href(value) { currentHref = value; },
    search: "", origin: "https://atelier.example",
  },
  setTimeout() {},
};
const document = {
  readyState: "complete",
  querySelectorAll(selector) { return selector === "a[href]" ? [link] : []; },
  addEventListener(type, handler) { this.clickHandler = handler; },
};
const sessionStorage = { setItem() {}, getItem() { return null; } };
function gtag(kind, name, payload) { callbacks.push(payload.event_callback); }

vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), {
  URL, URLSearchParams, document, gtag, sessionStorage, window,
});
document.clickHandler({
  target: { closest(selector) { return selector === "a[href]" ? link : null; } },
  preventDefault() {},
});
callbacks[0]();
const afterFirstCallback = currentHref;
callbacks[1]();
console.log(JSON.stringify({ callbackCount: callbacks.length, afterFirstCallback, finalHref: currentHref }));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            {
                "callbackCount": 2,
                "afterFirstCallback": "https://atelier.example/ja/",
                "finalHref": "https://atelier.example/ja/booking.html",
            },
            json.loads(result.stdout),
        )

    def test_form_tracking_skips_cancelled_submits_and_uses_explicit_events(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the tracking behavior contract")
        script_path = repo_path("assets/js/acs-tracking.js")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

const events = [];
function makeElement(attributes = {}) {
  return {
    attributes,
    id: attributes.id || "",
    classList: { contains(name) { return name === "contact-form" && attributes.contactForm; } },
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; },
    addEventListener(type, handler) { this.submitHandler = handler; },
  };
}
const cancelledForm = makeElement({ id: "cancelled" });
const consultationForm = makeElement({ id: "consultation" });
const contactForm = makeElement({ id: "contact", "data-track": "contact_form_submit" });
const consultationSubmitter = makeElement({ "data-track": "free_consultation_submit_click" });
const cancelledSubmitter = makeElement({ "data-track": "free_consultation_submit_click" });
const window = {
  location: { href: "https://atelier.example/ja/booking.html", search: "", origin: "https://atelier.example" },
  setTimeout() {},
};
const document = {
  readyState: "complete",
  querySelectorAll(selector) {
    if (selector === "a[href]") return [];
    if (selector === "form") return [cancelledForm, consultationForm, contactForm];
    return [];
  },
  addEventListener() {},
};
const sessionStorage = { setItem() {}, getItem() { return null; } };
function gtag(kind, name, payload) {
  events.push(name);
  payload.event_callback();
}

vm.runInNewContext(fs.readFileSync(process.argv[1], "utf8"), {
  URL, URLSearchParams, document, gtag, sessionStorage, window,
});
cancelledForm.submitHandler({ defaultPrevented: true, submitter: cancelledSubmitter });
consultationForm.submitHandler({ defaultPrevented: false, submitter: consultationSubmitter });
contactForm.submitHandler({ defaultPrevented: false, submitter: null });
console.log(JSON.stringify({ events }));
'''
        result = subprocess.run(
            [node, "-e", harness, str(script_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            {
                "events": [
                    "free_consultation_submit_click",
                    "free_consultation_click",
                    "contact_form_submit",
                    "contact_click",
                ],
            },
            json.loads(result.stdout),
        )
