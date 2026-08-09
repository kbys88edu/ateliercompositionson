import json
import re
import shutil
import subprocess
import unittest
from html.parser import HTMLParser

from tests.site_test_utils import repo_path


class TrackingPageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.scripts = []
        self._script = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "a" and values.get("href") and values.get("data-track"):
            self.links.append(values)
        if tag == "script":
            self._script = {"src": values.get("src"), "code": ""}
            self.scripts.append(self._script)

    def handle_data(self, data):
        if self._script is not None:
            self._script["code"] += data

    def handle_endtag(self, tag):
        if tag == "script":
            self._script = None


class TrackingTests(unittest.TestCase):
    def test_tracker_has_no_mojibake_heuristics(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        for bad in ("?????", "????", "?change gratuit", "30???"):
            self.assertNotIn(bad, script)

    def test_tracker_sends_explicit_data_track_event(self):
        script = repo_path("assets/js/acs-tracking.js").read_text(encoding="utf-8")
        self.assertIn('link.getAttribute("data-track")', script)
        self.assertIn("sendGaEvent(explicitEvent", script)

    def test_all_pages_using_shared_tracker_have_no_local_data_track_click_listener(self):
        duplicate_listener = re.compile(
            r"querySelectorAll\(\s*(['\"])\[data-track\]\1\s*\)"
            r"[\s\S]*?addEventListener\(\s*(['\"])click\2"
        )
        tracker_pages = []
        for page_path in sorted(repo_path(".").rglob("*.html")):
            html = page_path.read_text(encoding="utf-8")
            if "acs-tracking.js" not in html:
                continue
            tracker_pages.append(page_path)
            self.assertIsNone(
                duplicate_listener.search(html),
                str(page_path.relative_to(repo_path("."))),
            )
        self.assertGreaterEqual(len(tracker_pages), 33)

    def test_french_pages_emit_explicit_event_once_in_actual_script_order(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the FR tracking contract")
        pages = (
            "fr/index.html",
            "fr/composition-lesson.html",
            "fr/harmony-analysis-lesson.html",
            "fr/electroacoustic-lesson.html",
            "fr/mao-lesson.html",
            "fr/booking.html",
        )
        harness = r'''
const fs = require("fs");
const vm = require("vm");

const config = JSON.parse(fs.readFileSync(0, "utf8"));
const attributes = config.attributes;
const events = [];
const targetHandlers = {};
const documentHandlers = {};
let currentHref = config.pageUrl;

const window = {
  location: {
    get href() { return currentHref; },
    set href(value) { currentHref = value; },
    get search() { return new URL(currentHref).search; },
    get origin() { return new URL(currentHref).origin; },
  },
  setTimeout() {},
};
const link = {
  dataset: { track: attributes["data-track"] },
  textContent: config.linkText,
  getAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name) ? attributes[name] : null; },
  setAttribute(name, value) { attributes[name] = String(value); },
  hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attributes, name); },
  get href() { return new URL(attributes.href, currentHref).href; },
  addEventListener(type, handler) { (targetHandlers[type] ||= []).push(handler); },
  closest(selector) { return selector === "a[href]" ? this : null; },
};
const document = {
  readyState: "complete",
  querySelectorAll(selector) {
    if (selector === "a[href]" || selector === "[data-track]") return [link];
    if (selector === "form") return [];
    return [];
  },
  addEventListener(type, handler, capture) {
    (documentHandlers[type] ||= []).push({ handler, capture: Boolean(capture) });
  },
};
const sessionStorage = { setItem() {}, getItem() { return null; } };
function gtag(kind, name, payload = {}) {
  if (kind === "event") events.push(name);
  if (typeof payload.event_callback === "function") payload.event_callback();
}

const context = { URL, URLSearchParams, document, gtag, sessionStorage, window };
vm.createContext(context);
config.scripts.forEach((script) => vm.runInContext(script, context));
const event = {
  target: link,
  defaultPrevented: false,
  preventDefault() { this.defaultPrevented = true; },
};
(documentHandlers.click || []).filter((entry) => entry.capture).forEach((entry) => entry.handler(event));
(targetHandlers.click || []).forEach((handler) => handler(event));
(documentHandlers.click || []).filter((entry) => !entry.capture).forEach((entry) => entry.handler(event));
console.log(JSON.stringify({ events, explicit: attributes["data-track"] }));
'''

        for page in pages:
            with self.subTest(page=page):
                page_path = repo_path(page)
                parser = TrackingPageParser()
                parser.feed(page_path.read_text(encoding="utf-8"))
                link = next(
                    item for item in parser.links
                    if "data-resource-track" not in item
                )
                scripts = []
                for script in parser.scripts:
                    if script["src"] and script["src"].split("?", 1)[0].endswith("acs-tracking.js"):
                        source_path = page_path.parent.joinpath(script["src"].split("?", 1)[0]).resolve()
                        scripts.append(source_path.read_text(encoding="utf-8"))
                    elif "[data-track]" in script["code"] and "addEventListener" in script["code"]:
                        scripts.append(script["code"])
                result = subprocess.run(
                    [node, "-e", harness],
                    input=json.dumps({
                        "attributes": link,
                        "linkText": link.get("data-track", ""),
                        "pageUrl": f"https://atelier.example/{page}",
                        "scripts": scripts,
                    }),
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(0, result.returncode, result.stderr)
                payload = json.loads(result.stdout)
                self.assertEqual(1, payload["events"].count(payload["explicit"]), payload)

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

    def test_form_pages_emit_only_shared_tracking_after_page_validation(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node.js is required for the tracking behavior contract")
        tracking_path = repo_path("assets/js/acs-tracking.js")
        booking_path = repo_path("ja/booking.html")
        correction_path = repo_path("ja/mail-correction.html")
        harness = r'''
const fs = require("fs");
const vm = require("vm");

function makeElement(attributes = {}) {
  return {
    attributes,
    handlers: {},
    checked: false,
    dataset: { track: attributes["data-track"] || "" },
    textContent: attributes.text || "",
    id: attributes.id || "",
    classList: { add() {}, contains() { return false; }, remove() {} },
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; },
    addEventListener(type, handler) { (this.handlers[type] ||= []).push(handler); },
    dispatch(type, event) { (this.handlers[type] || []).forEach((handler) => handler(event)); },
    reportValidity() {},
    setCustomValidity() {},
    scrollIntoView() {},
  };
}

function inlineScripts(path) {
  return [...fs.readFileSync(path, "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
}

function runFormPage(pagePath, type) {
  const events = [];
  const form = makeElement({ id: type === "booking" ? "booking-form" : "" });
  const submitter = makeElement({
    "data-track": type === "booking" ? "free_consultation_submit_click" : "submit_mail_correction",
    text: "Submit",
  });
  const interest = makeElement();
  const error = makeElement({ id: "interest-error" });
  const requestCheckbox = makeElement({ id: "mail-correction-request" });
  const documentHandlers = {};
  const document = {
    readyState: "complete",
    documentElement: { classList: { toggle() {} } },
    getElementById(id) {
      if (id === "booking-form") return form;
      if (id === "interest-error") return error;
      if (id === "mail-correction-request") return requestCheckbox;
      return null;
    },
    querySelector(selector) {
      return selector === ".correction-form" ? form : null;
    },
    querySelectorAll(selector) {
      if (selector === "a[href]") return [];
      if (selector === "form") return [form];
      if (selector === "[data-track]") return [submitter];
      if (selector === 'input[name="interests[]"]:checked') return interest.checked ? [interest] : [];
      if (selector === 'input[name="添削したい内容[]"]') return [interest];
      return [];
    },
    addEventListener(type, handler) { (documentHandlers[type] ||= []).push(handler); },
  };
  const window = {
    location: { href: "https://atelier.example/ja/", search: "", origin: "https://atelier.example" },
    setTimeout() {},
  };
  const sessionStorage = { setItem() {}, getItem() { return null; } };
  const dataLayer = {
    push(args) {
      if (args[0] === "event") events.push(args[1]);
    },
  };
  const context = { URL, URLSearchParams, dataLayer, document, sessionStorage, window };
  vm.createContext(context);
  inlineScripts(pagePath).forEach((script) => vm.runInContext(script, context));
  vm.runInContext(fs.readFileSync(process.argv[1], "utf8"), context);

  function submit(valid) {
    interest.checked = valid;
    submitter.dispatch("click", { target: submitter });
    const event = {
      defaultPrevented: false,
      submitter,
      preventDefault() { this.defaultPrevented = true; },
    };
    form.dispatch("submit", event);
  }

  submit(false);
  const cancelled = events.splice(0);
  submit(true);
  return { cancelled, valid: events };
}

console.log(JSON.stringify({
  booking: runFormPage(process.argv[2], "booking"),
  correction: runFormPage(process.argv[3], "correction"),
}));
'''
        result = subprocess.run(
            [node, "-e", harness, str(tracking_path), str(booking_path), str(correction_path)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(
            {
                "booking": {
                    "cancelled": [],
                    "valid": ["free_consultation_submit_click", "free_consultation_click"],
                },
                "correction": {
                    "cancelled": [],
                    "valid": ["submit_mail_correction"],
                },
            },
            json.loads(result.stdout),
        )
