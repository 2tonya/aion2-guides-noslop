(function () {
  "use strict";

  var SECTIONS = {
    ranger: [
      ["r-tldr", "Главное"],
      ["r-skills", "Скиллы"],
      ["r-passive", "Пассивки"],
      ["r-stigma", "Стигмы"],
      ["r-macro", "Макрос"],
      ["r-rotation", "Ротация"],
      ["r-gear", "Экипировка"],
      ["r-misc", "Прочее"],
      ["r-board", "Дэванион"]
    ],
    assassin: [
      ["a-tldr", "Главное"],
      ["a-order", "Прокачка"],
      ["a-skills", "Скиллы"],
      ["a-passive", "Пассивки"],
      ["a-stigma", "Стигмы"],
      ["a-macro", "Макрос"],
      ["a-rotation", "Ротация"],
      ["a-setup", "Настройки"],
      ["a-board", "Дэванион"]
    ]
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".switch__btn"));
  var guides = Array.prototype.slice.call(document.querySelectorAll(".guide"));
  var chipsBox = document.getElementById("chips");
  var current = "ranger";

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
    current = key;

    tabs.forEach(function (btn) {
      var on = btn.dataset.class === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    guides.forEach(function (g) {
      g.classList.toggle("is-hidden", g.id !== key);
    });

    document.body.style.setProperty(
      "--accent",
      key === "ranger" ? "#6fd3a7" : "#e07a8b"
    );
    buildChips(key);

    if (scrollTop) window.scrollTo(0, 0);
    try { localStorage.setItem("aion2class", key); } catch (e) {}
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      select(btn.dataset.class, true);
      history.replaceState(null, "", "#" + btn.dataset.class);
    });
  });

  // начальное состояние из hash / localStorage
  var hash = (location.hash || "").replace("#", "");
  var saved = null;
  try { saved = localStorage.getItem("aion2class"); } catch (e) {}
  var start = hash === "assassin" || hash === "ranger" ? hash : (saved || "ranger");
  select(start, false);

  // переход по прямой ссылке на секцию внутри другой вкладки
  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace("#", "");
    if (h === "ranger" || h === "assassin") { select(h, true); return; }
    var el = document.getElementById(h);
    if (el && el.offsetParent === null) select(h.charAt(0) === "a" ? "assassin" : "ranger", false);
  });

  // лайтбокс для скриншотов
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
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var img = e.target.closest(".shot img, .gallery img");
    if (img) { open(img.src, img.alt); return; }
    if (e.target === lb || e.target.classList.contains("lightbox__close")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lb.hidden) close();
  });
})();
