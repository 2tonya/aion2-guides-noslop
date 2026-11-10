(function () {
  "use strict";

  var SECTIONS = {
    glossary: [
      ["g-systems", "Системы"], ["g-combat", "Бой"], ["g-stats", "Характеристики"], ["g-compare", "Сравнение"], ["g-faq", "FAQ"]
    ],
    ranger: [
      ["r-quick", "Старт"], ["r-tldr", "Главное"], ["r-road", "Путь"], ["r-order", "Прокачка"], ["r-skills", "Скиллы"],
      ["r-passive", "Пассивки"], ["r-stigma", "Стигмы"], ["r-macro", "Макрос"],
      ["r-rotation", "Ротация"], ["r-gear", "Экипировка"], ["r-misc", "Прочее"], ["r-mistakes", "Ошибки"], ["r-board", "Дэванион"]
    ],
    assassin: [
      ["a-quick", "Старт"], ["a-tldr", "Главное"], ["a-road", "Путь"], ["a-order", "Прокачка"], ["a-skills", "Скиллы"],
      ["a-passive", "Пассивки"], ["a-stigma", "Стигмы"], ["a-macro", "Макрос"],
      ["a-rotation", "Ротация"], ["a-setup", "Настройки"], ["a-gear", "Экипировка"], ["a-mistakes", "Ошибки"], ["a-board", "Дэванион"]
    ],
    sorcerer: [
      ["so-quick", "Старт"], ["so-tldr", "Главное"], ["so-road", "Путь"], ["so-order", "Прокачка"], ["so-skills", "Скиллы"],
      ["so-passive", "Пассивки"], ["so-stigma", "Стигмы"], ["so-macro", "Макрос"],
      ["so-rotation", "Ротация"], ["so-gear", "Экипировка"], ["so-mistakes", "Ошибки"], ["so-board", "Дэванион"]
    ],
    spiritmaster: [
      ["sp-quick", "Старт"], ["sp-tldr", "Главное"], ["sp-road", "Путь"], ["sp-order", "Прокачка"], ["sp-skills", "Скиллы"],
      ["sp-passive", "Пассивки"], ["sp-stigma", "Стигмы"], ["sp-macro", "Макрос"],
      ["sp-rotation", "Ротация"], ["sp-gear", "Экипировка"], ["sp-mistakes", "Ошибки"], ["sp-board", "Дэванион"]
    ],
    templar: [
      ["te-quick", "Старт"], ["te-tldr", "Главное"], ["te-road", "Путь"], ["te-order", "Прокачка"], ["te-skills", "Скиллы"],
      ["te-passive", "Пассивки"], ["te-stigma", "Стигмы"], ["te-macro", "Макрос"],
      ["te-rotation", "Ротация"], ["te-gear", "Экипировка"], ["te-mistakes", "Ошибки"], ["te-board", "Дэванион"]
    ],
    gladiator: [
      ["gl-quick", "Старт"], ["gl-tldr", "Главное"], ["gl-road", "Путь"], ["gl-order", "Прокачка"], ["gl-skills", "Скиллы"],
      ["gl-passive", "Пассивки"], ["gl-stigma", "Стигмы"], ["gl-macro", "Макрос"],
      ["gl-rotation", "Ротация"], ["gl-gear", "Экипировка"], ["gl-arcana", "Arcana"], ["gl-mistakes", "Ошибки"], ["gl-board", "Дэванион"]
    ],
    cleric: [
      ["cl-quick", "Старт"], ["cl-tldr", "Главное"], ["cl-road", "Путь"], ["cl-order", "Прокачка"], ["cl-skills", "Скиллы"],
      ["cl-passive", "Пассивки"], ["cl-stigma", "Стигмы"], ["cl-macro", "Макрос"],
      ["cl-rotation", "Ротация"], ["cl-gear", "Экипировка"], ["cl-mistakes", "Ошибки"], ["cl-board", "Дэванион"]
    ],
    chanter: [
      ["ch-quick", "Старт"], ["ch-tldr", "Главное"], ["ch-road", "Путь"], ["ch-order", "Прокачка"], ["ch-skills", "Скиллы"],
      ["ch-passive", "Пассивки"], ["ch-stigma", "Стигмы"], ["ch-macro", "Макрос"],
      ["ch-rotation", "Ротация"], ["ch-gear", "Экипировка"], ["ch-mistakes", "Ошибки"], ["ch-board", "Дэванион"]
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
    chanter: "#63c9da",
    glossary: "#9fd9c0"
  };

  var THEME_ACCENTS = {
    dark: "#6fd3a7",
    light: "#1f9d6a",
    pumpkin: "#ff8c1a",
    blue: "#4fc3ff"
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".switch__btn"));
  var guides = Array.prototype.slice.call(document.querySelectorAll(".guide"));
  var chipsBox = document.getElementById("chips");
  var glossaryView = document.getElementById("glossary-view");
  var glossaryBack = document.getElementById("glossary-back");
  var glossaryReturn = null;

  function updateGlossaryBack() {
    if (!glossaryBack) return;
    var show = !!(glossaryReturn && glossaryView && !glossaryView.classList.contains("is-hidden"));
    glossaryBack.classList.toggle("is-hidden", !show);
  }

  if (glossaryBack) {
    glossaryBack.addEventListener("click", function () {
      if (!glossaryReturn) return;
      var ret = glossaryReturn;
      glossaryReturn = null;
      if (SECTIONS[ret.view]) {
        select(ret.view, false);
        history.replaceState(null, "", "#" + ret.view);
        window.scrollTo(0, ret.y || 0);
      } else {
        select("ranger", false);
        history.replaceState(null, "", "#ranger");
        window.scrollTo(0, ret.y || 0);
      }
      updateGlossaryBack();
    });
  }

  var chipMap = {};
  var sectionEls = [];
  var activeSection = "";
  var scrollTick = false;
  var currentView = "ranger"; // class key or "glossary"

  chipsBox.addEventListener("wheel", function (e) {
    if (chipsBox.scrollWidth <= chipsBox.clientWidth) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      chipsBox.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // ---- боковое меню классов ----
  var menuBtn = document.getElementById("menu-btn");
  var drawer = document.getElementById("drawer");
  var drawerList = document.getElementById("drawer-list");
  var currentClass = document.getElementById("current-class");
  var drawerItems = {};

  var CLASS_ROLES = {
    ranger: "DPS",
    assassin: "DPS",
    sorcerer: "DPS",
    spiritmaster: "DPS",
    templar: "Танк",
    gladiator: "DPS",
    cleric: "Хил",
    chanter: "Саппорт"
  };

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

    var role = CLASS_ROLES[tab.dataset.class];
    if (role) {
      var roleEl = document.createElement("span");
      roleEl.className = "drawer__role";
      roleEl.textContent = role;
      item.appendChild(roleEl);
    }

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

  // ---- темы ----
  var themeButtons = Array.prototype.slice.call(document.querySelectorAll(".theme-opt"));

  var THEME_QUERY = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function resolveTheme(name) {
    if (name === "system") {
      return (THEME_QUERY && THEME_QUERY.matches) ? "light" : "dark";
    }
    return name;
  }

  function applyTheme(name) {
    var allowed = { dark: 1, light: 1, pumpkin: 1, blue: 1, system: 1 };
    if (!allowed[name]) name = "dark";
    var effective = resolveTheme(name);
    document.documentElement.setAttribute("data-theme", effective);
    themeButtons.forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.theme === name);
    });
    try { localStorage.setItem("aion2theme", name); } catch (e) {}
    if (currentView === "glossary") {
      document.documentElement.style.setProperty("--accent", THEME_ACCENTS[effective] || "#9fd9c0");
    }
  }

  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      applyTheme(b.dataset.theme);
    });
  });

  if (THEME_QUERY) {
    var onThemeChange = function () {
      var cur = "dark";
      try { cur = localStorage.getItem("aion2theme") || "dark"; } catch (e) {}
      if (cur === "system") applyTheme("system");
    };
    if (THEME_QUERY.addEventListener) THEME_QUERY.addEventListener("change", onThemeChange);
    else if (THEME_QUERY.addListener) THEME_QUERY.addListener(onThemeChange);
  }

  var savedTheme = "dark";
  try { savedTheme = localStorage.getItem("aion2theme") || "dark"; } catch (e) {}
  applyTheme(savedTheme);

  // ---- глоссарий ----
  var openGlossaryBtn = document.getElementById("open-glossary");

  function showGlossary(scrollTop) {
    currentView = "glossary";
    guides.forEach(function (g) { g.classList.add("is-hidden"); });
    if (glossaryView) glossaryView.classList.remove("is-hidden");
    tabs.forEach(function (btn) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });
    Object.keys(drawerItems).forEach(function (k) {
      drawerItems[k].item.classList.remove("is-active");
    });
    currentClass.textContent = "Глоссарий";
    var t = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.style.setProperty("--accent", THEME_ACCENTS[t] || "#9fd9c0");
    buildChips("glossary");
    updateActiveSection();
    updateGlossaryBack();
    if (scrollTop) window.scrollTo(0, 0);
  }

  if (openGlossaryBtn) {
    openGlossaryBtn.addEventListener("click", function () {
      closeDrawer();
      glossaryReturn = null;
      showGlossary(true);
      history.replaceState(null, "", "#glossary");
    });
  }

  function setActiveChip(id) {
    if (!id || id === activeSection) return;
    activeSection = id;
    Object.keys(chipMap).forEach(function (k) {
      chipMap[k].classList.toggle("is-active", k === id);
    });
    var chip = chipMap[id];
    if (chip) {
      chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }

  function updateActiveSection() {
    if (!sectionEls.length) return;
    var offset = document.querySelector(".topbar").offsetHeight + 24;
    var current = sectionEls[0].id;
    var atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 40);

    if (atBottom) {
      current = sectionEls[sectionEls.length - 1].id;
    } else {
      for (var i = 0; i < sectionEls.length; i++) {
        var rect = sectionEls[i].getBoundingClientRect();
        if (rect.top - offset <= 0) current = sectionEls[i].id;
      }
    }

    setActiveChip(current);
  }

  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      scrollTick = false;
      updateActiveSection();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  function bindSections(key) {
    var el = (key === "glossary") ? glossaryView : document.getElementById(key);
    sectionEls = el ? Array.prototype.slice.call(el.querySelectorAll("h2[id]")) : [];
    updateActiveSection();
  }

  function buildChips(key) {
    chipsBox.innerHTML = "";
    chipMap = {};
    activeSection = "";
    SECTIONS[key].forEach(function (pair) {
      var a = document.createElement("a");
      a.href = "#" + pair[0];
      a.textContent = pair[1];
      a.dataset.target = pair[0];
      chipMap[pair[0]] = a;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(pair[0]);
        if (!el) return;
        var offset = document.querySelector(".topbar").offsetHeight + 14;
        var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
        history.replaceState(null, "", "#" + pair[0]);
        setActiveChip(pair[0]);
      });
      chipsBox.appendChild(a);
    });
    bindSections(key);
  }

  function select(key, scrollTop) {
    if (!SECTIONS[key] || key === "glossary") key = "ranger";
    currentView = key;
    glossaryReturn = null;
    if (glossaryBack) glossaryBack.classList.add("is-hidden");

    if (glossaryView) glossaryView.classList.add("is-hidden");

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
    updateActiveSection();

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

  function findClassForSection(id) {
    if (id && id.indexOf("gt-") === 0) return "glossary";
    for (var k in SECTIONS) {
      if (!SECTIONS.hasOwnProperty(k)) continue;
      if (SECTIONS[k].some(function (p) { return p[0] === id; })) return k;
    }
    return null;
  }

  var termFlashTimer = null;
  function flashGlossaryTerm(id) {
    if (!id || id.indexOf("gt-") !== 0) return;
    var el = document.getElementById(id);
    if (!el) return;
    if (termFlashTimer) clearTimeout(termFlashTimer);
    document.querySelectorAll(".glossary-term.is-target-flash").forEach(function (n) { n.classList.remove("is-target-flash"); });
    el.classList.add("is-target-flash");
    termFlashTimer = setTimeout(function () { el.classList.remove("is-target-flash"); }, 1800);
  }

  function scrollToSection(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return;
    var offset = document.querySelector(".topbar").offsetHeight + 14;
    var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: smooth ? "smooth" : "auto" });
    setActiveChip(id);
    flashGlossaryTerm(id);
  }

  function activateView(key, scrollTop) {
    if (key === "glossary") { showGlossary(scrollTop); return; }
    if (SECTIONS[key]) { select(key, scrollTop); return; }
    select("ranger", scrollTop);
  }

  var hash = decodeURIComponent((location.hash || "").replace("#", ""));
  var saved = null;
  try { saved = localStorage.getItem("aion2class"); } catch (e) {}

  if (hash === "glossary" || hash.indexOf("gt-") === 0 || findClassForSection(hash) === "glossary") {
    showGlossary(false);
    if (hash && hash !== "glossary" && document.getElementById(hash)) {
      setTimeout(function () { scrollToSection(hash, false); }, 40);
    }
  } else if (SECTIONS[hash]) {
    select(hash, false);
  } else {
    var c2 = findClassForSection(hash);
    if (c2 && SECTIONS[c2]) {
      select(c2, false);
      if (document.getElementById(hash)) {
        setTimeout(function () { scrollToSection(hash, false); }, 40);
      }
    } else {
      select(SECTIONS[saved] ? saved : "ranger", false);
    }
  }

  window.addEventListener("hashchange", function () {
    var h = decodeURIComponent((location.hash || "").replace("#", ""));
    if (h === "glossary") { showGlossary(true); return; }
    if (SECTIONS[h] && h !== "glossary") { select(h, true); return; }
    var el = document.getElementById(h);
    if (el) {
      var key = findClassForSection(h);
      if (key === "glossary" || h.indexOf("gt-") === 0) {
        if (glossaryView && glossaryView.classList.contains("is-hidden")) showGlossary(false);
      } else if (key && SECTIONS[key]) {
        if (key !== currentView) select(key, false);
      }
      scrollToSection(h, true);
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

  // ---- ссылки на глоссарий в гайдах ----
  var GLOSSARY_TERMS = [
    { id: "gt-pve-damage-boost", re: /\bPvE Damage Boost\b|\bTolerance\b/gi },
    { id: "gt-double-chance", re: /\bDouble Chance\b|\bPerfect\b/gi },
    { id: "gt-crit-damage", re: /\bCrit(?:ical)?\s+Damage\b|Крит\.?\s*урон\w*/gi },
    { id: "gt-combat-speed", re: /\bCombat Speed\b|Скорост[ьи]\s+боя/gi },
    { id: "gt-skill-level", re: /\bSkill Level\b|Брейкпоинт\w*|брейк[ -]?поинт\w*/gi },
    { id: "gt-multi-hit", re: /\bMulti[- ]?Hit\b|Мультиудар\w*/gi },
    { id: "gt-penetration", re: /\bPenetration\b|Пробивани[еяю]\w*/gi },
    { id: "gt-accuracy", re: /\bAccuracy\b|Точност[ьи]\w*/gi },
    { id: "gt-enmity", re: /\bEnmity\b|\b[Аа]гро\b|Угроз[аыуе]\w*/gi },
    { id: "gt-transcendence", re: /\bTranscendence\b|Трансценденци[ияю]\w*/gi },
    { id: "gt-specialty", re: /\bSpecialt(?:y|ies)\b|Специализаци[ияю]\w*/gi },
    { id: "gt-daevanion", re: /\bDaevanion\b|Дэванион\w*/gi },
    { id: "gt-pantheon", re: /\bPantheon\b|Пантеон\w*/gi },
    { id: "gt-nightmare", re: /\bNightmare\b/gi },
    { id: "gt-stigma", re: /\bStigma\b|Стигм[аыуеой]\w*/gi },
    { id: "gt-arcana", re: /\bArcana\b|Аркан[аыуеой]\w*/gi },
    { id: "gt-ротация", re: /Ротаци[ияю]\w*/gi },
    { id: "gt-триггер", re: /Триггер\w*/gi },
    { id: "gt-филлер", re: /Филлер\w*/gi },
    { id: "gt-макрос", re: /Макрос\w*/gi },
    { id: "gt-стаки", re: /Стаки\b|Стаков\b|Стака\b|Стеки\b|Стеков\b|Стека\b/gi },
    { id: "gt-стаггер", re: /Стаггер\w*|\bСтан\b|\bКонтрол[ья]\b/gi },
    { id: "gt-бурст", re: /Бурст\w*|[Оо]кн[оа]\s+урона/gi },
    { id: "gt-прок", re: /\bProc\b|Прок\w*/gi },
    { id: "gt-crit", re: /\bCritical Hit\b|\bCrit\b|Крит\w*/gi },
    { id: "gt-кд", re: /\bCooldown\b|\bКД\b/gi },
    { id: "gt-дот", re: /\bDoT\b|Дот(?:а|у|ы|ом)?\b/gi },
    { id: "gt-aoe", re: /\bAoE\b/gi }
  ];

  function linkifyGlossary(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest("a, script, style, mark, h1, h2, h3, .glossary-view, code, pre, button")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var rest = node.nodeValue;
      var frag = document.createDocumentFragment();
      var changed = false;
      var guard = 0;
      while (rest && guard++ < 300) {
        var best = null;
        for (var i = 0; i < GLOSSARY_TERMS.length; i++) {
          var t = GLOSSARY_TERMS[i];
          t.re.lastIndex = 0;
          var m = t.re.exec(rest);
          if (m && (!best || m.index < best.index || (m.index === best.index && m[0].length > best.len))) {
            best = { index: m.index, len: m[0].length, match: m[0], id: t.id };
          }
        }
        if (!best) { frag.appendChild(document.createTextNode(rest)); break; }
        changed = true;
        if (best.index > 0) frag.appendChild(document.createTextNode(rest.slice(0, best.index)));
        var a = document.createElement("a");
        a.className = "g-link";
        a.href = "#" + best.id;
        a.textContent = best.match;
        frag.appendChild(a);
        rest = rest.slice(best.index + best.len);
      }
      if (changed && node.parentNode) node.parentNode.replaceChild(frag, node);
    });
  }

  // linkify all guides once
  guides.forEach(function (g) { linkifyGlossary(g); });

  // glossary term link click: remember return point
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.g-link");
    if (!a) return;
    // only remember when coming from a guide (not from glossary itself)
    if (a.closest(".guide")) {
      glossaryReturn = { view: currentView, y: window.pageYOffset || window.scrollY || 0 };
    }
  }, true);

  // ---- поиск по гайдам ----
  var searchBtn = document.getElementById("search-btn");
  var searchPanel = document.getElementById("search-panel");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var searchMeta = document.getElementById("search-meta");
  var searchIndex = [];
  var lastSearchWords = [];

  function clearSearchHits() {
    document.querySelectorAll("mark.search-hit").forEach(function (m) {
      var parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });
  }

  function highlightInSection(secId, words) {
    clearSearchHits();
    var sec = document.getElementById(secId);
    if (!sec) return;
    var card = sec.closest(".card") || sec.parentElement;
    if (!card) return;

    var escaped = words.filter(function (w) { return w.length >= 2; }).map(escRe);
    if (!escaped.length) return;
    var re = new RegExp("(" + escaped.join("|") + ")", "ig");

    var walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest("script,style,mark")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) return;
      re.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = re.exec(text))) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = m[0];
        frag.appendChild(mark);
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });

    setTimeout(clearSearchHits, 3500);
  }

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
          key: key, kind: "guide", clsLabel: clsLabel, clsIcon: clsIcon,
          secId: h2.id, secTitle: secTitle,
          text: text, lower: searchable, titleLower: secTitle.toLowerCase()
        });
      });
    });

    if (glossaryView) {
      glossaryView.querySelectorAll(".glossary-term[id]").forEach(function (term) {
        var h3 = term.querySelector("h3");
        if (!h3) return;
        var secId = term.id;
        var secTitle = h3.textContent.trim();
        var text = term.textContent.replace(/\s+/g, " ").trim();
        var searchable = ("глоссарий " + secTitle + " " + text).toLowerCase();
        searchIndex.push({
          key: "glossary", kind: "glossary", clsLabel: "Глоссарий", clsIcon: "",
          secId: secId, secTitle: secTitle,
          text: text, lower: searchable, titleLower: secTitle.toLowerCase()
        });
      });
    }
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
      var iconHtml = e.clsIcon ? '<img src="' + escHtml(e.clsIcon) + '" alt="">' : '<span class="search__badge">термин</span>';
      btn.innerHTML =
        '<div class="search__row">' +
          '<span class="search__class">' + iconHtml + escHtml(e.clsLabel) + '</span>' +
          '<span class="search__sec">' + escHtml(e.secTitle) + '</span>' +
        '</div>' +
        '<div class="search__snip">' + makeSnippet(e.text, e.lower, words) + '</div>';
      btn.addEventListener("click", function () {
        var qwords = words.slice();
        closeSearch();
        if (e.kind === "glossary" || e.key === "glossary") {
          glossaryReturn = null; // search jump, no guide return point
          showGlossary(false);
          history.replaceState(null, "", "#" + e.secId);
          setTimeout(function () { scrollToSection(e.secId, true); }, 80);
        } else {
          select(e.key, false);
          history.replaceState(null, "", "#" + e.secId);
          var el = document.getElementById(e.secId);
          if (el) {
            var offset = document.querySelector(".topbar").offsetHeight + 14;
            var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: "smooth" });
            setTimeout(function () { highlightInSection(e.secId, qwords); }, 450);
          } else {
            setTimeout(function () { highlightInSection(e.secId, qwords); }, 450);
          }
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
