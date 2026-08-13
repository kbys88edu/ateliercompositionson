(function () {
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var STORAGE_KEY = "acs_utm_params";
  var NAVIGATION_DELAY_MS = 220;

  function getCurrentUtmParams() {
    var params = new URLSearchParams(window.location.search);
    var utm = new URLSearchParams();
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) utm.set(key, value);
    });
    return utm;
  }

  function storeCurrentUtmParams() {
    var current = getCurrentUtmParams();
    if (Array.from(current.keys()).length === 0) return;
    try { sessionStorage.setItem(STORAGE_KEY, current.toString()); } catch (error) {}
  }

  function getStoredUtmParams() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? new URLSearchParams(stored) : new URLSearchParams();
    } catch (error) {
      return new URLSearchParams();
    }
  }

  function getAvailableUtmParams() {
    var current = getCurrentUtmParams();
    return Array.from(current.keys()).length ? current : getStoredUtmParams();
  }

  function appendUtmToUrl(rawHref) {
    if (!rawHref || rawHref.charAt(0) === "#" || rawHref.indexOf("mailto:") === 0 || rawHref.indexOf("tel:") === 0) return rawHref;
    var utm = getAvailableUtmParams();
    if (Array.from(utm.keys()).length === 0) return rawHref;
    try {
      var url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin) return rawHref;
      UTM_KEYS.forEach(function (key) {
        if (utm.get(key) && !url.searchParams.get(key)) url.searchParams.set(key, utm.get(key));
      });
      return url.pathname + url.search + url.hash;
    } catch (error) {
      return rawHref;
    }
  }

  function preserveUtmOnInternalLinks() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href");
      var nextHref = appendUtmToUrl(href);
      if (nextHref && nextHref !== href) link.setAttribute("href", nextHref);
    });
  }

  function isOutbound(link) {
    var href = link.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return false;
    try { return new URL(href, window.location.href).origin !== window.location.origin; } catch (error) { return false; }
  }

  function isEmailLink(link, explicitEvent) {
    var href = link.getAttribute("href") || "";
    var track = explicitEvent || link.getAttribute("data-track") || "";
    return href.indexOf("mailto:") === 0 || track.indexOf("email") >= 0;
  }

  function isContact(link, explicitEvent) {
    if (isEmailLink(link, explicitEvent)) return false;
    var href = link.getAttribute("href") || "";
    var track = explicitEvent || link.getAttribute("data-track") || "";
    return href.indexOf("#contact") >= 0 || track.indexOf("contact") >= 0;
  }

  function isFreeConsultation(link, explicitEvent) {
    var href = link.getAttribute("href") || "";
    var track = explicitEvent || link.getAttribute("data-track") || "";
    return href.indexOf("booking.html") >= 0 || track.indexOf("consultation") >= 0 || track.indexOf("booking") >= 0;
  }

  function eventParams(link) {
    return {
      page_location: window.location.href,
      link_url: link.href || link.getAttribute("href") || "",
      link_text: (link.textContent || "").trim(),
      cta_location: link.getAttribute("data-cta-location") || "unspecified",
      transport_type: "beacon"
    };
  }

  function sendGaEvent(name, params, callback) {
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (typeof callback === "function") callback();
    }
    if (typeof gtag !== "function") { finish(); return; }
    var payload = {};
    Object.keys(params || {}).forEach(function (key) { payload[key] = params[key]; });
    payload.event_callback = finish;
    payload.event_timeout = 800;
    gtag("event", name, payload);
    window.setTimeout(finish, NAVIGATION_DELAY_MS);
  }

  function shouldDelayNavigation(link, event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    var target = (link.getAttribute("target") || "").toLowerCase();
    var href = link.getAttribute("href") || "";
    if (target && target !== "_self") return false;
    if (!href || href.charAt(0) === "#") return false;
    return isFreeConsultation(link) || isEmailLink(link) || isContact(link) || isOutbound(link);
  }

  function uniqueEventNames(names) {
    return names.filter(function (name, index) {
      return name && names.indexOf(name) === index;
    });
  }

  function bindTracking() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (!link) return;
      if (link.hasAttribute("data-resource-track")) return;
      var explicitEvent = link.getAttribute("data-track") || "";
      var canonicalEvents = [];
      if (isFreeConsultation(link)) canonicalEvents.push("free_consultation_click");
      if (isEmailLink(link, explicitEvent)) canonicalEvents.push("email_contact_click");
      if (isContact(link)) canonicalEvents.push("contact_click");
      if (isOutbound(link)) canonicalEvents.push("outbound_link_click");
      var eventNames = uniqueEventNames((explicitEvent ? [explicitEvent] : []).concat(canonicalEvents));
      if (!eventNames.length) return;
      preserveUtmOnInternalLinks();
      var params = eventParams(link);
      if (!shouldDelayNavigation(link, event)) {
        if (explicitEvent) sendGaEvent(explicitEvent, params);
        eventNames.forEach(function (name) {
          if (name !== explicitEvent) sendGaEvent(name, params);
        });
        return;
      }
      event.preventDefault();
      var href = link.href;
      var sent = 0;
      function next() {
        sent += 1;
        if (sent >= eventNames.length) window.location.href = href;
      }
      if (explicitEvent) sendGaEvent(explicitEvent, params, next);
      eventNames.forEach(function (name) {
        if (name !== explicitEvent) sendGaEvent(name, params, next);
      });
    }, true);

    document.querySelectorAll("form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        if (event.defaultPrevented) return;
        var submitter = event.submitter;
        var submitterTrack = submitter && submitter.getAttribute ? submitter.getAttribute("data-track") || "" : "";
        var explicitEvent = submitterTrack || form.getAttribute("data-track") || "";
        var fallbackEvent = form.getAttribute("data-track-submit") || (form.classList.contains("contact-form") ? "contact_click" : "form_submit");
        var eventName = explicitEvent || fallbackEvent;
        var canonicalEvents = [];
        if (isFreeConsultation(form, eventName)) canonicalEvents.push("free_consultation_click");
        if (isContact(form, eventName)) canonicalEvents.push("contact_click");
        uniqueEventNames([eventName].concat(canonicalEvents)).forEach(function (name) {
          sendGaEvent(name, {
          page_location: window.location.href,
          form_id: form.id || "",
          form_name: form.getAttribute("name") || "",
          transport_type: "beacon"
          });
        });
      });
    });
  }

  storeCurrentUtmParams();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { preserveUtmOnInternalLinks(); bindTracking(); });
  } else {
    preserveUtmOnInternalLinks();
    bindTracking();
  }
})();
