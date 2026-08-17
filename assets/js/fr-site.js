(function () {
  "use strict";

  function loadMedia(trigger) {
    var container = trigger.closest("[data-embed-src]");
    if (!container || container.getAttribute("data-loaded") === "true") return;

    var iframe = document.createElement("iframe");
    iframe.src = container.getAttribute("data-embed-src");
    iframe.title = container.getAttribute("data-embed-title") || "Lecteur multimédia";
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.height = container.getAttribute("data-embed-height") || "220";

    container.setAttribute("data-loaded", "true");
    container.replaceChildren(iframe);
  }

  function loadCalendly(trigger) {
    var slot = document.querySelector("[data-calendly-slot]");
    if (!slot || slot.getAttribute("data-loaded") === "true") return;

    var baseUrl = trigger.getAttribute("data-calendly-url");
    if (!baseUrl) return;

    var iframe = document.createElement("iframe");
    var separator = baseUrl.indexOf("?") === -1 ? "?" : "&";
    iframe.src = baseUrl + separator +
      "embed_domain=" + encodeURIComponent(window.location.hostname) +
      "&embed_type=Inline&hide_gdpr_banner=1";
    iframe.title = "Calendrier de réservation Atelier Composition Son";
    iframe.loading = "lazy";

    slot.setAttribute("data-loaded", "true");
    slot.replaceChildren(iframe);
    slot.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showStatus(element, message) {
    if (!element) return;
    element.textContent = message;
    element.setAttribute("data-visible", "true");
  }

  function clearStatus(element) {
    if (!element) return;
    element.textContent = "";
    element.setAttribute("data-visible", "false");
  }

  function fieldLabel(field) {
    var label = document.querySelector('[for="' + field.id + '"]');
    return label ? label.textContent.replace("*", "").trim() : "Ce champ";
  }

  function validateForm(form, errorElement) {
    var invalidFields = Array.from(form.querySelectorAll("[required]")).filter(function (field) {
      field.removeAttribute("aria-invalid");
      return !field.value.trim();
    });

    var email = form.querySelector('input[type="email"]');
    if (email && email.value && !email.validity.valid && invalidFields.indexOf(email) === -1) {
      invalidFields.push(email);
    }

    if (!invalidFields.length) return true;

    invalidFields.forEach(function (field) {
      field.setAttribute("aria-invalid", "true");
    });

    var first = invalidFields[0];
    var message = first.type === "email" && first.value
      ? "Vérifiez le format de l’adresse e-mail."
      : "Renseignez le champ « " + fieldLabel(first) + " » avant l’envoi.";
    showStatus(errorElement, message);
    first.focus();
    return false;
  }

  function initForm(form) {
    var successElement = document.querySelector("[data-form-success]");
    var errorElement = document.querySelector("[data-form-error]");
    var submitButton = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus(successElement);
      clearStatus(errorElement);

      if (!validateForm(form, errorElement)) return;

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      }).then(function (response) {
        if (!response.ok) throw new Error("form_submission_failed");

        showStatus(
          successElement,
          "Votre message a bien été envoyé. Vous recevrez une réponse par e-mail."
        );
        form.dispatchEvent(new CustomEvent("acs:form-success", {
          bubbles: true,
          detail: {
            offer: form.querySelector('[name="offer"]')
              ? form.querySelector('[name="offer"]').value
              : "free_contact",
          },
        }));
        form.reset();
      }).catch(function () {
        showStatus(
          errorElement,
          "L’envoi n’a pas abouti. Vérifiez votre connexion, puis réessayez. Vous pouvez aussi écrire à info@sachiekobayashi.com."
        );
      }).finally(function () {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      });
    });
  }

  function applyOfferFromQuery() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

    var offer = new URLSearchParams(window.location.search).get("offer");
    var analyticsOffers = {
      "free-contact": "free_contact",
      "mini-feedback": "mini_feedback_29",
      "individual-session": "individual_session_70",
    };
    var domain = form.querySelector('[name="domain"]');
    var offerField = form.querySelector('[name="offer"]');

    if (offerField && analyticsOffers[offer]) offerField.value = analyticsOffers[offer];
    if (domain && offer === "mini-feedback") domain.value = "mini-feedback";
    if (domain && offer === "individual-session") domain.value = "composition";
  }

  document.addEventListener("click", function (event) {
    var mediaTrigger = event.target.closest("[data-load-embed]");
    if (mediaTrigger) loadMedia(mediaTrigger);

    var calendlyTrigger = event.target.closest("[data-calendly-url]");
    if (calendlyTrigger) loadCalendly(calendlyTrigger);
  });

  function init() {
    var form = document.querySelector("#contact-form");
    if (form) initForm(form);
    applyOfferFromQuery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
