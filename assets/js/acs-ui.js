(function () {
  var openMenuCount = 0;

  function initMenu(root) {
    var toggle = root.querySelector("[data-menu-toggle]");
    var panel = root.querySelector("[data-menu-panel]");
    if (!toggle || !panel) return;

    var isOpen = false;

    function setOpen(open) {
      if (isOpen !== open) {
        isOpen = open;
        openMenuCount += open ? 1 : -1;
      }
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.documentElement.classList.toggle("acs-menu-open", openMenuCount > 0);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-menu-close]")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
        toggle.focus();
      }
    });

    setOpen(false);
  }

  document.querySelectorAll("[data-menu]").forEach(initMenu);
})();
