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
    },
    fr: {
      navLabel: "Navigation principale",
      mobileNavLabel: "Menu mobile",
      menuLabel: "Menu",
      links: [
        ["Cours", "index.html#entrypoints"],
        ["À propos", "index.html#instructor"],
        ["Tarifs", "index.html#format"],
        ["Œuvres", "index.html#works"],
        ["FAQ", "index.html#questions"],
        ["FR / JA", "../ja/", "ja"],
      ],
      consultation: "Rendez-vous",
      consultationTrack: "click_free_consultation_fr",
    },
  };

  function linkMarkup(link, mobile) {
    var language = link[2] ? ' lang="' + link[2] + '"' : "";
    var close = mobile ? " data-menu-close" : "";
    return '<a href="' + link[1] + '"' + language + close + ">" + link[0] + "</a>";
  }

  function renderHeader(mount, configuration, index) {
    var panelId = "acs-site-menu-" + index;
    var desktopLinks = configuration.links.map(function (link) {
      return linkMarkup(link, false);
    }).join("");
    var mobileLinks = configuration.links.map(function (link) {
      return linkMarkup(link, true);
    }).join("");
    var consultation = '<a class="acs-btn acs-btn--primary" href="booking.html" data-track="' +
      configuration.consultationTrack + '">' + configuration.consultation + "</a>";
    var mobileConsultation = '<a class="acs-btn acs-btn--primary" href="booking.html" data-track="' +
      configuration.consultationTrack + '" data-menu-close>' + configuration.consultation + "</a>";

    mount.setAttribute("data-menu", "");
    mount.innerHTML =
      '<div class="acs-container--wide acs-site-header__inner">' +
        '<a class="acs-site-header__brand" aria-label="Atelier Composition Son" href="index.html#top">' +
          '<img class="acs-site-header__logo" src="../images/acs-logo.png" alt="" width="306" height="509">' +
          '<span class="acs-site-header__brand-full" aria-hidden="true">Atelier Composition Son</span>' +
          '<span class="acs-site-header__brand-short" aria-hidden="true">ACS</span>' +
        "</a>" +
        '<nav class="acs-site-nav" aria-label="' + configuration.navLabel + '">' +
          desktopLinks + consultation +
        "</nav>" +
        '<a class="acs-mobile-consultation" href="booking.html" data-track="' +
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
