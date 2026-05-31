(function () {
  const isLoggedIn = sessionStorage.getItem("acsCounterpointAuth") === "true";

  if (isLoggedIn) {
    return;
  }

  const path = window.location.pathname;
  const file = path.split("/").pop();

  if (file === "login.html") {
    return;
  }

  const isInSubfolder =
    path.includes("/module2/") ||
    path.includes("/module3/") ||
    path.includes("/three-voice/");

  const loginPath = isInSubfolder ? "../login.html" : "login.html";
  const currentRelative = isInSubfolder
    ? "../" + path.split("/").slice(-2).join("/")
    : file || "index.html";

  window.location.href = loginPath + "?next=" + encodeURIComponent(currentRelative);
})();
