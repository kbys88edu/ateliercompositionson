from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ParsedPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.headings = []
        self.links = []
        self.images = []
        self.iframes = []
        self.scripts = []
        self.stylesheets = []
        self._heading = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag in {"h1", "h2", "h3"}:
            self._heading = {"tag": tag, "text": "", "attrs": values}
            self.headings.append(self._heading)
        if tag == "a":
            self.links.append(values)
        if tag == "img":
            self.images.append(values)
        if tag == "iframe":
            self.iframes.append(values)
        if tag == "script" and values.get("src"):
            self.scripts.append(values["src"])
        if tag == "link" and values.get("rel") == "stylesheet":
            self.stylesheets.append(values.get("href", ""))

    def handle_endtag(self, tag):
        if self._heading and tag == self._heading["tag"]:
            self._heading["text"] = self._heading["text"].strip()
            self._heading = None

    def handle_data(self, data):
        if self._heading:
            self._heading["text"] += data


def repo_path(relative_path):
    return ROOT / relative_path


def load_page(relative_path):
    parser = ParsedPage()
    parser.feed(repo_path(relative_path).read_text(encoding="utf-8"))
    return parser
