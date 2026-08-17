(function () {
  "use strict";

  var trackedOffers = new Set();
  var calendlyEvents = new Set();

  function readTrafficSource() {
    var source = "direct";

    try {
      var parameters = new URLSearchParams(window.location.search || "");
      var incoming = parameters.get("utm_source");
      var stored = sessionStorage.getItem("acs_fr_traffic_source");

      if (incoming) {
        source = incoming;
        sessionStorage.setItem("acs_fr_traffic_source", incoming);
      } else if (stored) {
        source = stored;
      }
    } catch (error) {
      source = "direct";
    }

    return source;
  }

  function commonParameters(element) {
    return {
      locale: "fr",
      page_type: document.body && document.body.dataset.pageType
        ? document.body.dataset.pageType
        : "content",
      offer: element && element.getAttribute("data-offer")
        ? element.getAttribute("data-offer")
        : "none",
      cta_position: element && element.getAttribute("data-cta-position")
        ? element.getAttribute("data-cta-position")
        : "unspecified",
      traffic_source: readTrafficSource(),
    };
  }

  function sendEvent(name, element, extraParameters, callback) {
    if (!name) return;

    var parameters = Object.assign(
      commonParameters(element),
      extraParameters || {}
    );

    if (callback) parameters.event_callback = callback;

    if (typeof gtag === "function") {
      gtag("event", name, parameters);
    } else if (callback) {
      callback();
    }
  }

  function isModifiedClick(event) {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  }

  document.addEventListener("click", function (event) {
    var element = event.target.closest("a[data-track]") ||
      event.target.closest("button[data-track]");
    if (!element) return;

    var eventName = element.getAttribute("data-track");
    var href = element.getAttribute("href");
    var shouldDelayNavigation = element.tagName === "A" &&
      href &&
      !element.hasAttribute("download") &&
      !element.hasAttribute("target") &&
      !isModifiedClick(event) &&
      /^https?:/i.test(element.href || href) &&
      new URL(element.href || href, window.location.href).origin !== window.location.origin;

    if (!shouldDelayNavigation) {
      sendEvent(eventName, element);
      return;
    }

    event.preventDefault();
    var navigated = false;
    var navigate = function () {
      if (navigated) return;
      navigated = true;
      window.location.assign(element.href || href);
    };

    sendEvent(eventName, element, null, navigate);
    window.setTimeout(navigate, 180);
  });

  function observeOffers() {
    if (typeof IntersectionObserver !== "function") return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var offer = entry.target.getAttribute("data-offer-view");
        if (!offer || trackedOffers.has(offer)) return;

        trackedOffers.add(offer);
        sendEvent("view_offer", entry.target, {
          offer: offer,
          cta_position: "formats",
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    document.querySelectorAll("[data-offer-view]").forEach(function (element) {
      observer.observe(element);
    });
  }

  window.addEventListener("message", function (event) {
    if (event.origin && !/^https:\/\/([a-z0-9-]+\.)*calendly\.com$/i.test(event.origin)) return;
    if (!event.data || event.data.event !== "calendly.event_scheduled") return;
    if (calendlyEvents.has("submit_booking")) return;

    calendlyEvents.add("submit_booking");
    sendEvent("submit_booking", document.querySelector("[data-calendly-url]"), {
      offer: "individual_session_70",
      cta_position: "calendly",
    });
  });

  document.addEventListener("acs:form-success", function (event) {
    sendEvent("submit_booking", event.target, {
      offer: event.detail && event.detail.offer
        ? event.detail.offer
        : "free_contact",
      cta_position: "contact_form",
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeOffers);
  } else {
    observeOffers();
  }

  // Event names kept explicit for analytics QA:
  // click_primary_cta, click_secondary_cta, view_offer, begin_booking,
  // submit_booking, request_feedback, click_gumroad, download_sample, play_work.
})();
