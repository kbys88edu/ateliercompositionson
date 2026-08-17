(function () {
  var configurations = {
    ja: {
      navLabel: "メインメニュー",
      mobileNavLabel: "モバイルメニュー",
      menuLabel: "メニュー",
      links: [
        ["レッスン", "index.html#study"],
        ["講師", "index.html#instructor"],
        ["料金", "index.html#price"],
        ["受講者の声", "index.html#voices"],
        ["JA / FR", "../fr/", "fr"],
      ],
      consultation: "無料相談",
      consultationTrack: "click_free_consultation",
      logoSrc: "../images/acs-logo.png",
      logoWidth: "306",
      logoHeight: "509",
      brandLabel: "Atelier Composition Son",
    },
    fr: {
      navLabel: "Navigation principale",
      mobileNavLabel: "Menu mobile",
      menuLabel: "Menu",
      links: [
        ["Résultats", "index.html#resultats"],
        ["Formats", "index.html#formats"],
        ["Méthode", "index.html#methode"],
        ["Expérience", "index.html#experience"],
        ["Contact", "index.html#contact"],
        ["FR / JA", "../ja/", "ja"],
      ],
      consultation: "Faire le point",
      consultationHref: "booking.html?offer=free-contact#contact-form",
      consultationTrack: "click_primary_cta",
      logoSrc: "../images/fr/acs-logo-header.webp",
      logoWidth: "72",
      logoHeight: "120",
      brandLabel: "ACS — Atelier Composition Son",
      trackingOffer: "free_contact",
    },
  };

  function resolveHref(root, href) {
    if (/^(?:[a-z]+:|#|\/)/i.test(href)) return href;
    return root + href;
  }

  function linkMarkup(link, mobile, root) {
    var language = link[2] ? ' lang="' + link[2] + '"' : "";
    var close = mobile ? " data-menu-close" : "";
    return '<a href="' + resolveHref(root, link[1]) + '"' + language + close + ">" + link[0] + "</a>";
  }

  function renderHeader(mount, configuration, index) {
    var panelId = "acs-site-menu-" + index;
    var root = mount.getAttribute("data-header-root") || "";
    var consultationHref = resolveHref(root, configuration.consultationHref || "booking.html");
    var logoSrc = resolveHref(root, configuration.logoSrc || "../images/acs-logo.png");
    var consultationAnalytics = configuration.trackingOffer
      ? ' data-offer="' + configuration.trackingOffer + '" data-cta-position="header"'
      : "";
    var mobileConsultationAnalytics = configuration.trackingOffer
      ? ' data-offer="' + configuration.trackingOffer + '" data-cta-position="mobile_menu"'
      : "";
    var desktopLinks = configuration.links.map(function (link) {
      return linkMarkup(link, false, root);
    }).join("");
    var mobileLinks = configuration.links.map(function (link) {
      return linkMarkup(link, true, root);
    }).join("");
    var consultation = '<a class="acs-btn acs-btn--primary" href="' + consultationHref + '" data-track="' +
      configuration.consultationTrack + '"' + consultationAnalytics + '>' +
      configuration.consultation + "</a>";
    var mobileConsultation = '<a class="acs-btn acs-btn--primary" href="' + consultationHref + '" data-track="' +
      configuration.consultationTrack + '"' + mobileConsultationAnalytics + ' data-menu-close>' +
      configuration.consultation + "</a>";

    mount.setAttribute("data-menu", "");
    mount.innerHTML =
      '<div class="acs-container--wide acs-site-header__inner">' +
        '<a class="acs-site-header__brand" aria-label="' + configuration.brandLabel + '" href="' + resolveHref(root, "index.html#top") + '">' +
          '<img class="acs-site-header__logo" src="' + logoSrc + '" alt="" width="' + configuration.logoWidth + '" height="' + configuration.logoHeight + '">' +
          '<span class="acs-site-header__brand-full" aria-hidden="true">Atelier Composition Son</span>' +
          '<span class="acs-site-header__brand-short" aria-hidden="true">ACS</span>' +
        "</a>" +
        '<nav class="acs-site-nav" aria-label="' + configuration.navLabel + '">' +
          desktopLinks + consultation +
        "</nav>" +
        '<a class="acs-mobile-consultation" href="' + consultationHref + '" data-track="' +
          configuration.consultationTrack + '">' + configuration.consultation + "</a>" +
        '<button class="acs-menu-toggle" type="button" aria-label="' + configuration.menuLabel +
          '" aria-expanded="false" aria-controls="' + panelId + '" data-menu-toggle>' +
          configuration.menuLabel +
        "</button>" +
      "</div>" +
      '<div class="acs-menu-panel" id="' + panelId + '" data-menu-panel hidden>' +
        '<nav aria-label="' + configuration.mobileNavLabel + '">' +
          mobileLinks + mobileConsultation +
        "</nav>" +
      "</div>";
  }

  var language = (document.documentElement.lang || "ja").toLowerCase().slice(0, 2);
  var configuration = configurations[language] || configurations.ja;
  document.querySelectorAll("[data-shared-header]").forEach(function (mount, index) {
    renderHeader(mount, configuration, index);
  });
})();
