(function () {
  "use strict";

  var SECTIONS = {
    ranger: [
      ["r-tldr", "Главное"], ["r-road", "Путь"], ["r-order", "Прокачка"], ["r-skills", "Скиллы"],
      ["r-passive", "Пассивки"], ["r-stigma", "Стигмы"], ["r-macro", "Макрос"],
      ["r-rotation", "Ротация"], ["r-gear", "Экипировка"], ["r-misc", "Прочее"], ["r-board", "Дэванион"]
    ],
    assassin: [
      ["a-tldr", "Главное"], ["a-road", "Путь"], ["a-order", "Прокачка"], ["a-skills", "Скиллы"],
      ["a-passive", "Пассивки"], ["a-stigma", "Стигмы"], ["a-macro", "Макрос"],
      ["a-rotation", "Ротация"], ["a-setup", "Настройки"], ["a-board", "Дэванион"]
    ],
    sorcerer: [
      ["so-tldr", "Главное"], ["so-road", "Путь"], ["so-order", "Прокачка"], ["so-skills", "Скиллы"],
      ["so-passive", "Пассивки"], ["so-stigma", "Стигмы"], ["so-macro", "Макрос"],
      ["so-rotation", "Ротация"], ["so-board", "Дэванион"]
    ],
    spiritmaster: [
      ["sp-tldr", "Главное"], ["sp-road", "Путь"], ["sp-order", "Прокачка"], ["sp-skills", "Скиллы"],
      ["sp-passive", "Пассивки"], ["sp-stigma", "Стигмы"], ["sp-macro", "Макрос"],
      ["sp-rotation", "Ротация"], ["sp-board", "Дэванион"]
    ],
    templar: [
      ["te-tldr", "Главное"], ["te-road", "Путь"], ["te-order", "Прокачка"], ["te-skills", "Скиллы"],
      ["te-passive", "Пассивки"], ["te-stigma", "Стигмы"], ["te-macro", "Макрос"],
      ["te-rotation", "Ротация"], ["te-board", "Дэванион"]
    ],
    gladiator: [
      ["gl-tldr", "Главное"], ["gl-road", "Путь"], ["gl-order", "Прокачка"], ["gl-skills", "Скиллы"],
      ["gl-passive", "Пассивки"], ["gl-stigma", "Стигмы"], ["gl-macro", "Макрос"],
      ["gl-rotation", "Ротация"], ["gl-gear", "Экипировка"], ["gl-arcana", "Arcana"], ["gl-board", "Дэванион"]
    ],
    cleric: [
      ["cl-tldr", "Главное"], ["cl-road", "Путь"], ["cl-order", "Прокачка"], ["cl-skills", "Скиллы"],
      ["cl-passive", "Пассивки"], ["cl-stigma", "Стигмы"], ["cl-macro", "Макрос"],
      ["cl-rotation", "Ротация"], ["cl-board", "Дэванион"]
    ],
    chanter: [
      ["ch-tldr", "Главное"], ["ch-road", "Путь"], ["ch-order", "Прокачка"], ["ch-skills", "Скиллы"],
      ["ch-passive", "Пассивки"], ["ch-stigma", "Стигмы"], ["ch-macro", "Макрос"],
      ["ch-rotation", "Ротация"], ["ch-board", "Дэванион"]
    ]
  };

  var ACCENTS = {
    ranger: "#6fd3a7",
    assassin: "#e07a8b",
    sorcerer: "#e8915a",
    spiritmaster: "#a290f5",
    templar: "#d8c15a",
    gladiator: "#7fb2e8",
    cleric: "#e9dfb4",
    chanter: "#63c9da"
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".switch__btn"));
  var guides = Array.prototype.slice.call(document.querySelectorAll(".guide"));
  var chipsBox = document.getElementById("chips");

  // ---- боковое меню классов ----
  var menuBtn = document.getElementById("menu-btn");
  var drawer = document.getElementById("drawer");
  var drawerList = document.getElementById("drawer-list");
  var currentClass = document.getElementById("current-class");
  var drawerItems = {};

  tabs.forEach(function (tab) {
    var src = tab.querySelector("img");
    var label = tab.querySelector("span").textContent;
    var item = document.createElement("button");
    item.type = "button";
    item.className = "drawer__item";
    item.dataset.class = tab.dataset.class;

    if (src) {
      var icon = document.createElement("img");
      icon.src = src.getAttribute("src");
      icon.alt = "";
      item.appendChild(icon);
    }
    var name = document.createElement("span");
    name.textContent = label;
    item.appendChild(name);

    item.addEventListener("click", function () {
      select(tab.dataset.class, true);
      history.replaceState(null, "", "#" + tab.dataset.class);
      closeDrawer();
    });

    drawerList.appendChild(item);
    drawerItems[tab.dataset.class] = { item: item, label: label };
  });

  function openDrawer() {
    drawer.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", function () {
    if (drawer.hidden) openDrawer(); else closeDrawer();
  });

  drawer.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-drawer-close")) closeDrawer();
  });

  function buildChips(key) {
    chipsBox.innerHTML = "";
    SECTIONS[key].forEach(function (pair) {
      var a = document.createElement("a");
      a.href = "#" + pair[0];
      a.textContent = pair[1];
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(pair[0]);
        if (!el) return;
        var offset = document.querySelector(".topbar").offsetHeight + 14;
        var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
        history.replaceState(null, "", "#" + pair[0]);
      });
      chipsBox.appendChild(a);
    });
  }

  function select(key, scrollTop) {
    if (!SECTIONS[key]) key = "ranger";

    tabs.forEach(function (btn) {
      var on = btn.dataset.class === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      if (on && btn.scrollIntoView) {
        btn.scrollIntoView({ block: "nearest", inline: "center" });
      }
    });

    guides.forEach(function (g) {
      g.classList.toggle("is-hidden", g.id !== key);
    });

    document.documentElement.style.setProperty("--accent", ACCENTS[key] || "#6fd3a7");
    buildChips(key);

    var meta = drawerItems[key];
    if (meta) {
      currentClass.textContent = meta.label;
      Object.keys(drawerItems).forEach(function (k) {
        drawerItems[k].item.classList.toggle("is-active", k === key);
      });
    }

    if (scrollTop) window.scrollTo(0, 0);
    try { localStorage.setItem("aion2class", key); } catch (e) {}
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      select(btn.dataset.class, true);
      history.replaceState(null, "", "#" + btn.dataset.class);
    });
  });

  var hash = (location.hash || "").replace("#", "");
  var saved = null;
  try { saved = localStorage.getItem("aion2class"); } catch (e) {}
  var start = SECTIONS[hash] ? hash : (SECTIONS[saved] ? saved : "ranger");
  select(start, false);

  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace("#", "");
    if (SECTIONS[h]) { select(h, true); return; }
    var el = document.getElementById(h);
    if (el && el.offsetParent === null) {
      var key = Object.keys(SECTIONS).find(function (k) {
        return k.charAt(0) === h.charAt(0);
      });
      if (key) select(key, false);
    }
  });

  // lightbox
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var img = e.target.closest(".shot img, .gallery img");
    if (img) { open(img.src, img.alt); return; }
    if (e.target === lb || e.target.classList.contains("lightbox__close")) close();
  });

  // ---- поиск по гайдам ----
  var searchBtn = document.getElementById("search-btn");
  var searchPanel = document.getElementById("search-panel");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var searchMeta = document.getElementById("search-meta");
  var searchIndex = [];

  function buildSearchIndex() {
    searchIndex = [];
    guides.forEach(function (g) {
      var key = g.id;
      var hero = g.querySelector(".hero h1");
      var icon = g.querySelector(".hero__icon");
      var clsLabel = hero ? hero.childNodes[0].textContent.trim() : key;
      var clsIcon = icon ? icon.getAttribute("src") : "";
      g.querySelectorAll(".card").forEach(function (card) {
        var h2 = card.querySelector("h2");
        if (!h2 || !h2.id) return;
        var secTitle = h2.textContent.trim();
        var text = card.textContent.replace(/\s+/g, " ").trim();
        var searchable = (clsLabel + " " + secTitle + " " + text).toLowerCase();
        searchIndex.push({
          key: key, clsLabel: clsLabel, clsIcon: clsIcon,
          secId: h2.id, secTitle: secTitle,
          text: text, lower: searchable, titleLower: secTitle.toLowerCase()
        });
      });
    });
  }

  function openSearch() {
    searchPanel.hidden = false;
    searchBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    searchInput.value = "";
    searchMeta.textContent = "Введите слово для поиска по всем гайдам";
    searchResults.innerHTML = "";
    setTimeout(function () { searchInput.focus(); }, 20);
  }

  function closeSearch() {
    searchPanel.hidden = true;
    searchBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  searchBtn.addEventListener("click", function () {
    if (searchPanel.hidden) openSearch(); else closeSearch();
  });

  searchPanel.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-search-close")) closeSearch();
  });

  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function escRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function makeSnippet(text, lower, words) {
    var pos = -1;
    words.forEach(function (w) { var p = lower.indexOf(w); if (p !== -1 && (pos === -1 || p < pos)) pos = p; });
    if (pos === -1) pos = 0;
    var start = Math.max(0, pos - 55);
    var end = Math.min(text.length, pos + 95);
    var snip = (start > 0 ? "… " : "") + text.slice(start, end) + (end < text.length ? " …" : "");
    var safe = escHtml(snip);
    words.forEach(function (w) {
      if (!w) return;
      var re = new RegExp("(" + escRe(escHtml(w)) + ")", "ig");
      safe = safe.replace(re, "<mark>$1</mark>");
    });
    return safe;
  }

  function runSearch() {
    var q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) {
      searchMeta.textContent = q.length ? "Введите минимум 2 символа" : "Введите слово для поиска по всем гайдам";
      searchResults.innerHTML = "";
      return;
    }
    var words = q.split(/\s+/).filter(Boolean);
    var hits = [];
    searchIndex.forEach(function (entry) {
      var ok = words.every(function (w) { return entry.lower.indexOf(w) !== -1; });
      if (!ok) return;
      var score = 0;
      words.forEach(function (w) { if (entry.titleLower.indexOf(w) !== -1) score += 5; });
      if (entry.clsLabel.toLowerCase().indexOf(q) !== -1) score += 3;
      hits.push({ entry: entry, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    var total = hits.length;
    var shown = hits.slice(0, 40);

    if (!total) {
      searchMeta.textContent = "Ничего не найдено";
      searchResults.innerHTML = '<div class="search__empty">Попробуйте другое слово или часть названия скилла</div>';
      return;
    }

    searchMeta.textContent = "Найдено: " + total + (total > shown.length ? " (показаны первые " + shown.length + ")" : "");
    searchResults.innerHTML = "";
    shown.forEach(function (hit) {
      var e = hit.entry;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "search__item";
      btn.innerHTML =
        '<div class="search__row">' +
          '<span class="search__class"><img src="' + escHtml(e.clsIcon) + '" alt="">' + escHtml(e.clsLabel) + '</span>' +
          '<span class="search__sec">' + escHtml(e.secTitle) + '</span>' +
        '</div>' +
        '<div class="search__snip">' + makeSnippet(e.text, e.lower, words) + '</div>';
      btn.addEventListener("click", function () {
        closeSearch();
        select(e.key, false);
        history.replaceState(null, "", "#" + e.secId);
        var el = document.getElementById(e.secId);
        if (el) {
          var offset = document.querySelector(".topbar").offsetHeight + 14;
          var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      });
      searchResults.appendChild(btn);
    });
  }

  searchInput.addEventListener("input", runSearch);

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (searchPanel.hidden) openSearch(); else closeSearch();
      return;
    }
    if (e.key !== "Escape") return;
    if (!searchPanel.hidden) { closeSearch(); return; }
    if (!drawer.hidden) { closeDrawer(); return; }
    if (!lb.hidden) close();
  });

  buildSearchIndex();

  // ---- иконки возле названий скиллов в тексте ----
  var SKIP = "h1,h2,h3,h4,figcaption,.ranks,.mini,.credit,.chip,.tag,summary,button,a,.si";

  function skillMap(scope) {
    var map = {};

    scope.querySelectorAll(".skill").forEach(function (s) {
      var img = s.querySelector("img");
      var h3 = s.querySelector("h3");
      if (!img || !h3 || !h3.firstChild) return;
      var name = h3.firstChild.textContent.trim();
      if (name) map[name] = img.getAttribute("src");
    });

    scope.querySelectorAll(".mini").forEach(function (m) {
      var img = m.querySelector("img");
      var b = m.querySelector("b");
      if (img && b) map[b.textContent.trim()] = img.getAttribute("src");
    });

    scope.querySelectorAll(".ranks li").forEach(function (li) {
      var img = li.querySelector("img");
      var sp = li.querySelector("span");
      if (img && sp) map[sp.textContent.trim()] = img.getAttribute("src");
    });

    return map;
  }

  function escapeRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function addInlineIcons(scope) {
    var map = skillMap(scope);
    var names = Object.keys(map).sort(function (a, b) { return b.length - a.length; });
    if (!names.length) return;

    var re = new RegExp("(^|[^\\w-])(" + names.map(escapeRe).join("|") + ")(?![\\w-])", "g");

    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    var seen = new WeakMap();

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var frag = document.createDocumentFragment();
      var last = 0;
      var hit = false;
      var m;

      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        var start = m.index + m[1].length;
        var name = m[2];
        var host = node.parentElement;
        var done = seen.get(host);
        if (!done) { done = {}; seen.set(host, done); }

        frag.appendChild(document.createTextNode(text.slice(last, start)));

        if (!done[name]) {
          done[name] = true;
          var icon = document.createElement("img");
          icon.className = "si";
          icon.src = map[name];
          icon.alt = "";
          icon.setAttribute("aria-hidden", "true");
          frag.appendChild(icon);
        }

        frag.appendChild(document.createTextNode(name));
        last = start + name.length;
        hit = true;
      }

      if (!hit) return;
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  document.querySelectorAll(".guide").forEach(addInlineIcons);
})();
