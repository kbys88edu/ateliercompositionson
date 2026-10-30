/* 埋め込みの軽量化と、ローカル表示での不具合回避。
   - YouTube：最初はサムネイルだけを表示し、クリックで再生する（読み込み前の黒い四角をなくす）
   - file:// で開いたとき：YouTube（エラー153）と SoundCloud（空白）は埋め込めないため、元のページへのリンクにする */
(function () {
  var local = location.protocol === "file:";

  function ytId(src) {
    var m = /\/embed\/([A-Za-z0-9_-]{6,})/.exec(src || "");
    return m ? m[1] : null;
  }
  function scUrl(src) {
    var m = /[?&]url=([^&]+)/.exec(src || "");
    return m ? decodeURIComponent(m[1]) : "https://soundcloud.com/";
  }

  function facade(box, href, title, thumb, onPlay) {
    var a = document.createElement("a");
    a.className = "embed-facade";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", title + "（" + (onPlay ? "再生" : "新しいタブで開く") + "）");
    if (thumb) {
      var img = document.createElement("img");
      img.src = thumb; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      img.onerror = function () { img.remove(); };
      a.appendChild(img);
    }
    var t = document.createElement("span");
    t.className = "embed-play";
    t.textContent = onPlay ? "▶ 再生" : "▶ 開く";
    a.appendChild(t);
    if (onPlay) a.addEventListener("click", function (e) { e.preventDefault(); onPlay(); });
    box.innerHTML = "";
    box.appendChild(a);
  }

  document.querySelectorAll("iframe").forEach(function (f) {
    var src = f.getAttribute("src") || "";
    var box = f.parentElement;
    var title = f.getAttribute("title") || "";
    var id = ytId(src);
    if (id && /youtube/.test(src)) {
      var watch = "https://www.youtube.com/watch?v=" + id;
      var thumb = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      facade(box, watch, title, thumb, local ? null : function () {
        var n = document.createElement("iframe");
        n.title = title;
        n.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
        n.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        n.referrerPolicy = "strict-origin-when-cross-origin";
        n.allowFullscreen = true;
        box.innerHTML = "";
        box.appendChild(n);
      });
      box.classList.add("has-facade");
    } else if (local && /soundcloud/.test(src)) {
      facade(box, scUrl(src), title, null, null);
      box.classList.add("has-facade", "is-link");
    }
  });
})();
