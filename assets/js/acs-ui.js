(function () {
  function initMenu(root) {
    var toggle = root.querySelector("[data-menu-toggle]");
    var panel = root.querySelector("[data-menu-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.documentElement.classList.toggle("acs-menu-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-menu-close]")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    });

    setOpen(false);
  }

  document.querySelectorAll("[data-menu]").forEach(initMenu);
})();
