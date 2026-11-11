/* ============================================================
   AION 2 · GUIDEBOOK — router, rails, bestiary, search
   ============================================================ */
(function () {
  'use strict';

  var CLASSES = [
    { key: 'ranger', name: 'Лучник', en: 'Ranger', role: 'Дальний DPS' },
    { key: 'assassin', name: 'Ассасин', en: 'Assassin', role: 'Ближний DPS' },
    { key: 'sorcerer', name: 'Чародей', en: 'Sorcerer', role: 'Магический DPS' },
    { key: 'spiritmaster', name: 'Душелов', en: 'Spiritmaster', role: 'DPS · пет-класс' },
    { key: 'templar', name: 'Храмовник', en: 'Templar', role: 'Танк' },
    { key: 'gladiator', name: 'Гладиатор', en: 'Gladiator', role: 'Ближний DPS' },
    { key: 'cleric', name: 'Клирик', en: 'Cleric', role: 'Хилер' },
    { key: 'chanter', name: 'Чантер', en: 'Chanter', role: 'Саппорт' }
  ];
  var META = {};
  CLASSES.forEach(function (c) { META[c.key] = c; });

  var PREFIX = { r: 'ranger', a: 'assassin', so: 'sorcerer', sp: 'spiritmaster', te: 'templar', gl: 'gladiator', cl: 'cleric', ch: 'chanter' };

  var BEASTS = [
    {
      id: 'balaur', name: 'Балауры', latin: 'Balaur', type: 'Дракониды',
      desc: 'Древние дракониды и потомки драконьих лордов. Держатся группами, бьют по площади и не любят, когда их окружают.',
      habitat: 'Крепости и руины Атреи, подземелья с драконьими алтарями.',
      weakness: 'Огонь и контроль: сбивайте каст и не стойте в куче.', related: 'krall'
    },
    {
      id: 'krall', name: 'Кралы', latin: 'Krall', type: 'Гуманоиды',
      desc: 'Воинственные племена, которые держат позиции и зовут подкрепление. Опасны в ближнем бою и не отступают по одному.',
      habitat: 'Пустоши и лагеря на границе Атреи.',
      weakness: 'Дальний бой и AoE: разрывайте строй до подхода подкрепления.', related: 'mau'
    },
    {
      id: 'mau', name: 'Мау', latin: 'Mau', type: 'Гуманоиды',
      desc: 'Кошачьи племена, быстрые и ловкие. Атакуют из засады и отступают, когда теряют преимущество.',
      habitat: 'Джунгли, каньоны и заброшенные караванные тропы.',
      weakness: 'Замедление и контроль: не давайте уйти на перебежку.', related: 'kerubim'
    },
    {
      id: 'kerubim', name: 'Керубимы', latin: 'Kerubim', type: 'Духи',
      desc: 'Крылатые стражи святынь. Поддерживают союзников барьерами и лечат раненых, пока те держат строй.',
      habitat: 'Храмы, святилища и места силы.',
      weakness: 'Пробивание и фокус: снимайте барьер и добивайте по одному.', related: 'mau'
    },
    {
      id: 'undead', name: 'Нежить', latin: 'Undead', type: 'Нежить',
      desc: 'Безымянные тела, поднятые тёмной магией. Медлительны, но не отступают и не знают страха.',
      habitat: 'Склепы, поля старых битв и проклятые руины.',
      weakness: 'Свет и крит: урон по площади быстро чистит группы.', related: 'elemental'
    },
    {
      id: 'elemental', name: 'Элементали', latin: 'Elementals', type: 'Духи',
      desc: 'Сгустки стихий, которые появляются там, где нарушен баланс. Уязвимы к противоположной стихии.',
      habitat: 'Разломы, аномалии и зоны магических бурь.',
      weakness: 'Противоположная стихия: меняйте школу урона под цель.', related: 'undead'
    }
  ];
  var BEAST_BY_ID = {};
  BEASTS.forEach(function (b) { BEAST_BY_ID[b.id] = b; });

  var TYPE_ORDER = { 'Гуманоиды': 1, 'Дракониды': 2, 'Духи': 3, 'Нежить': 4 };
  var state = { lastGuide: 'ranger', activeSec: null, selectedBeast: 'balaur', openBeast: null };
  var beast = { query: '', type: 'all', sort: 'alpha', favOnly: false };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function norm(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function isMobile() { return window.matchMedia('(max-width: 979px)').matches; }

  function readFav(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch (e) { return new Set(); }
  }
  function writeFav(key, set) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }
  var favClasses = readFav('aion2:favorites:classes');
  var favBeasts = readFav('aion2:favorites:beasts');

  /* ---------------- router ---------------- */
  function parseHash() {
    var raw = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (!raw) return { view: 'guide', key: 'ranger', sec: null };
    var parts = raw.split('/');
    var head = parts[0] || '';
    var sec = parts[1] || null;
    if (head === 'bestiary' || head === 'glossary' || head === 'favorites') return { view: head, key: null, sec: sec };
    if (META[head]) return { view: 'guide', key: head, sec: sec };
    if (head.indexOf('gt-') === 0 || head.indexOf('g-') === 0) return { view: 'glossary', key: null, sec: head };
    var pre = head.split('-')[0];
    if (PREFIX[pre]) return { view: 'guide', key: PREFIX[pre], sec: head };
    return { view: 'guide', key: 'ranger', sec: null };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function headerOffset() {
    var h = $('.site-header');
    return (h ? h.offsetHeight : 88) + 26;
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (id.indexOf('-') > -1) {
      var sec = $('[data-sec="' + id + '"]');
      if (sec) el = sec;
    }
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo(0, Math.max(0, top));
  }

  function flash(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var target = el.closest('.glossary-term') || el.closest('.sec') || el;
    target.classList.add('is-target-flash');
    setTimeout(function () { target.classList.remove('is-target-flash'); }, 2400);
  }

  function render() {
    var r = parseHash();
    var view = r.view;
    var key = r.key || state.lastGuide;
    var sec = r.sec;

    if (view === 'guide') {
      state.lastGuide = key;
      if (sec) state.activeSec = sec;
    }
    if (view === 'bestiary' && sec && BEAST_BY_ID[sec]) {
      state.selectedBeast = sec;
      state.openBeast = sec;
    }

    var targetId = view === 'guide' ? 'view-guide-' + key : 'view-' + view;
    $$('.view').forEach(function (v) { v.classList.toggle('is-active', v.id === targetId); });

    document.body.dataset.view = view;
    document.body.dataset.class = key;

    $$('.main-nav__item').forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.nav === view);
    });
    $$('.tabbar [data-tab]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.tab === view);
    });
    $$('#class-strip [data-class]').forEach(function (b) {
      b.classList.toggle('is-active', view === 'guide' && b.dataset.class === key);
    });
    $$('#classes-sheet-list [data-class-sheet]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.classSheet === state.lastGuide);
    });

    if (view === 'guide') {
      renderRails(key);
      updateSideFav(key);
      renderSectionsSheet(key);
    } else {
      $('#rail-left').innerHTML = '';
      $('#rail-right').innerHTML = '';
    }

    updateBackLinks();

    if (view === 'bestiary') renderBestiary();
    if (view === 'favorites') renderFavorites();
    if (view === 'glossary') setKbActive(sec || 'g-systems');

    var titles = {
      guide: META[key] ? META[key].name + ' · Aion 2 Гайдбук' : 'Aion 2 Гайдбук',
      bestiary: 'Бестиарий · Aion 2 Гайдбук',
      glossary: 'База знаний · Aion 2 Гайдбук',
      favorites: 'Избранное · Aion 2 Гайдбук'
    };
    document.title = titles[view] || titles.guide;

    requestAnimationFrame(function () {
      setTimeout(function () {
        if (sec) {
          scrollToId(sec);
          if (view === 'glossary') flash(sec);
        } else if (view === 'bestiary') {
          scrollToId('view-bestiary');
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
        if (view === 'guide') spy();
      }, 40);
    });

    closeSearch(false);
    closeSheets(false);
  }

  /* ---------------- rails ---------------- */
  function getSections(key) {
    var view = document.getElementById('view-guide-' + key);
    if (!view) return [];
    return $$('.sec[data-sec]', view).map(function (sec) {
      return { id: sec.dataset.sec, label: sec.dataset.label || '', el: sec };
    });
  }

  function renderRails(key) {
    var secs = getSections(key);
    var html = secs.map(function (s, i) {
      return '<a href="#' + key + '/' + s.id + '" data-sec-link="' + s.id + '"><span class="num">' + pad(i + 1) + '</span><span>' + esc(s.label) + '</span></a>';
    }).join('');
    $('#rail-left').innerHTML = html;
    $('#rail-right').innerHTML = html;
    setActiveSec(state.activeSec);
  }

  function setActiveSec(id) {
    $$('[data-sec-link]').forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.secLink === id);
    });
  }

  var spyTick = false;
  function spy() {
    if (document.body.dataset.view !== 'guide') return;
    var view = $('.view.is-active');
    if (!view) return;
    var secs = $$('.sec[data-sec]', view);
    if (!secs.length) return;
    var line = window.scrollY + headerOffset() + 40;
    var current = secs[0].dataset.sec;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].offsetTop <= line) current = secs[i].dataset.sec;
      else break;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = secs[secs.length - 1].dataset.sec;
    }
    if (current !== state.activeSec) {
      state.activeSec = current;
      setActiveSec(current);
      renderSectionsSheet(view.dataset.classKey);
    }
  }

  window.addEventListener('scroll', function () {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(function () {
      spyTick = false;
      spy();
    });
  }, { passive: true });

  /* ---------------- favorites ---------------- */
  function isFavClass(key) { return favClasses.has(key); }

  function updateSideFav(key) {
    var btn = $('#side-fav');
    if (!btn) return;
    btn.dataset.favClass = key;
    var on = isFavClass(key);
    var label = btn.querySelector('span');
    if (label) label.textContent = on ? 'В избранном' : 'В избранное';
    btn.classList.toggle('is-fav', on);
    btn.setAttribute('aria-pressed', String(on));
  }

  function toggleClassFav(key, silent) {
    if (!key) return;
    if (favClasses.has(key)) favClasses.delete(key);
    else favClasses.add(key);
    writeFav('aion2:favorites:classes', favClasses);
    if (document.body.dataset.view === 'guide') updateSideFav(key);
    if (document.body.dataset.view === 'favorites') renderFavorites();
    if (!silent) toast(favClasses.has(key) ? META[key].name + ' добавлен в избранное' : META[key].name + ' убран из избранного');
  }

  function toggleBeastFav(id, silent) {
    if (!id) return;
    if (favBeasts.has(id)) favBeasts.delete(id);
    else favBeasts.add(id);
    writeFav('aion2:favorites:beasts', favBeasts);
    if (document.body.dataset.view === 'bestiary') renderBestiary();
    if (document.body.dataset.view === 'favorites') renderFavorites();
    if (!silent) toast(favBeasts.has(id) ? BEAST_BY_ID[id].name + ' в избранном' : BEAST_BY_ID[id].name + ' убран из избранного');
  }

  var HEART = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.4A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.6C19 15.6 12 20 12 20z"/></svg>';

  function renderFavorites() {
    var wrap = $('#favorites-content');
    if (!wrap) return;
    var cls = CLASSES.filter(function (c) { return favClasses.has(c.key); });
    var beasts = BEASTS.filter(function (b) { return favBeasts.has(b.id); });

    var html = '<section class="sec"><div class="sec__eyebrow"><span class="n">01</span><span>Классы</span></div><h2>Гайды классов</h2>';
    if (cls.length) {
      html += '<div class="fav-list">' + cls.map(function (c) {
        return '<div class="fav-row"><img src="img/class-' + c.key + '.png" alt="" width="42" height="42">' +
          '<div class="fav-row__body"><b>' + c.name + '</b><span>' + c.en + ' · ' + c.role + '</span></div>' +
          '<a class="btn btn--ghost" href="#' + c.key + '">Открыть</a>' +
          '<button class="icon-btn" type="button" data-unfav-class="' + c.key + '" aria-label="Убрать из избранного">×</button></div>';
      }).join('') + '</div>';
    } else {
      html += '<p class="fav-empty">Пока пусто. Откройте гайд класса и нажмите «В избранное» в правой колонке.</p>';
    }
    html += '</section>';

    html += '<section class="sec"><div class="sec__eyebrow"><span class="n">02</span><span>Существа</span></div><h2>Бестиарий</h2>';
    if (beasts.length) {
      html += '<div class="fav-list">' + beasts.map(function (b) {
        return '<div class="fav-row"><div class="fav-row__body"><b>' + b.name + '</b><span>' + b.latin + ' · ' + b.type + '</span></div>' +
          '<a class="btn btn--ghost" href="#bestiary/' + b.id + '">Открыть</a>' +
          '<button class="icon-btn" type="button" data-unfav-beast="' + b.id + '" aria-label="Убрать из избранного">×</button></div>';
      }).join('') + '</div>';
    } else {
      html += '<p class="fav-empty">Пока пусто. В бестиарии откройте существо и нажмите «В избранное».</p>';
    }
    html += '</section>';

    wrap.innerHTML = html;
  }

  /* ---------------- bestiary ---------------- */
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function beastDetail(b, mobile) {
    var fav = favBeasts.has(b.id);
    var rel = BEAST_BY_ID[b.related];
    return (mobile ? '' : '<div class="beast-detail__label">Карточка существа</div><h2>' + b.name + '</h2><div class="beast-detail__latin">' + b.latin + ' · ' + b.type + '</div>') +
      '<h3>Описание</h3><p>' + b.desc + '</p>' +
      '<h3>Где встречается</h3><p>' + b.habitat + '</p>' +
      '<h3>Слабость</h3><p>' + b.weakness + '</p>' +
      '<button class="btn' + (fav ? ' is-fav' : '') + (mobile ? ' btn--ghost' : '') + '" type="button" data-fav-beast="' + b.id + '" aria-pressed="' + fav + '">' + HEART + '<span>' + (fav ? 'В избранном' : 'В избранное') + '</span></button>' +
      (rel ? '<button class="beast-related" type="button" data-beast-link="' + rel.id + '"><span><b>' + rel.name + '</b><span>' + rel.type + ' · ' + rel.latin + '</span></span><span class="arrow">→</span></button>' : '') +
      (mobile ? '' : '<p class="beast-detail__note">Демонстрационная запись каталога. Типы и описания — заготовка для будущего справочника.</p>');
  }

  function filteredBeasts() {
    var q = norm(beast.query);
    var list = BEASTS.filter(function (b) {
      if (beast.type !== 'all' && b.type !== beast.type) return false;
      if (beast.favOnly && !favBeasts.has(b.id)) return false;
      if (!q) return true;
      return norm([b.name, b.latin, b.type, b.desc, b.habitat, b.weakness].join(' ')).indexOf(q) > -1;
    });
    list.sort(function (a, b) {
      if (beast.sort === 'type') {
        var d = (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9);
        if (d) return d;
      }
      if (beast.sort === 'fav' || beast.sort === 'type') {
        var f = (favBeasts.has(b.id) ? 1 : 0) - (favBeasts.has(a.id) ? 1 : 0);
        if (beast.sort === 'fav' && f) return f;
      }
      return a.name.localeCompare(b.name, 'ru');
    });
    return list;
  }

  function renderBestiary() {
    var listEl = $('#beast-list');
    if (!listEl) return;
    var list = filteredBeasts();
    if (list.length && !list.some(function (b) { return b.id === state.selectedBeast; })) {
      state.selectedBeast = list[0].id;
    }
    var selected = list.filter(function (b) { return b.id === state.selectedBeast; })[0] || null;

    listEl.innerHTML = list.map(function (b, i) {
      var active = selected && b.id === selected.id;
      var open = isMobile() && state.openBeast === b.id;
      return '<div class="beast-row' + (active ? ' is-active' : '') + (open ? ' is-open' : '') + '" data-beast="' + b.id + '">' +
        '<button class="beast-row__btn" type="button" aria-expanded="' + (open ? 'true' : 'false') + '">' +
        '<span class="beast-row__num">' + pad(i + 1) + '</span>' +
        '<span class="beast-row__body"><span class="beast-row__name">' + b.name + '</span><span class="beast-row__desc">' + b.latin + ' · ' + b.type + '</span></span>' +
        '<span class="beast-row__type">' + b.type + '</span>' +
        '<span class="beast-row__arrow">→</span></button>' +
        '<div class="beast-row__detail">' + beastDetail(b, true) + '</div></div>';
    }).join('');

    if (!list.length) {
      listEl.innerHTML = '<p class="fav-empty">Ничего не найдено. Сбросьте фильтры или измените запрос.</p>';
    }

    var detail = $('#beast-detail');
    detail.innerHTML = selected ? beastDetail(selected, false) : '<div class="beast-detail__label">Карточка существа</div><p class="fav-empty">Выберите существо из каталога.</p>';

    var count = $('#beast-count');
    if (count) count.textContent = list.length + ' ' + plural(list.length, 'запись', 'записи', 'записей');

    $$('#beast-types .filter-chip').forEach(function (c) {
      c.classList.toggle('is-active', c.dataset.type === beast.type);
    });
    var favBtn = $('#beast-fav-filter');
    if (favBtn) {
      favBtn.classList.toggle('is-active', beast.favOnly);
      favBtn.setAttribute('aria-pressed', String(beast.favOnly));
    }
  }

  function initBestiary() {
    var chips = $('#beast-types');
    if (chips) {
      chips.innerHTML = ['all', 'Гуманоиды', 'Дракониды', 'Духи', 'Нежить'].map(function (t) {
        return '<button class="filter-chip' + (t === 'all' ? ' is-active' : '') + '" type="button" data-type="' + t + '">' + (t === 'all' ? 'Все существа' : t) + '</button>';
      }).join('');
    }
    var search = $('#beast-search');
    if (search) search.addEventListener('input', function () { beast.query = search.value; renderBestiary(); });
    var sort = $('#beast-sort');
    if (sort) sort.addEventListener('change', function () { beast.sort = sort.value; renderBestiary(); });
    var favFilter = $('#beast-fav-filter');
    if (favFilter) favFilter.addEventListener('click', function () { beast.favOnly = !beast.favOnly; renderBestiary(); });

    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-type]');
      if (!b) return;
      beast.type = b.dataset.type;
      renderBestiary();
    });

    var list = $('#beast-list');
    if (list) list.addEventListener('click', function (e) {
      var link = e.target.closest('[data-beast-link]');
      if (link) {
        state.selectedBeast = link.dataset.beastLink;
        state.openBeast = link.dataset.beastLink;
        renderBestiary();
        return;
      }
      var btn = e.target.closest('.beast-row__btn');
      if (!btn) return;
      var row = btn.closest('.beast-row');
      var id = row.dataset.beast;
      if (isMobile()) {
        var open = row.classList.contains('is-open');
        $$('.beast-row', list).forEach(function (r) {
          r.classList.remove('is-open');
          r.classList.toggle('is-active', r === row);
        });
        row.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
        state.openBeast = open ? null : id;
        state.selectedBeast = id;
      } else {
        state.selectedBeast = id;
        renderBestiary();
      }
    });
  }

  /* ---------------- glossary ---------------- */
  function setKbActive(id) {
    $$('#kb-nav [data-goto]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.goto === id || (!id && b.dataset.goto === 'g-systems'));
    });
  }

  function updateBackLinks() {
    var g = META[state.lastGuide] || META.ranger;
    var back = $('#glossary-back');
    if (back) {
      back.href = '#' + g.key;
      back.textContent = '← Вернуться к гайду ' + g.name;
    }
    var bb = $('#bestiary-back');
    if (bb) {
      bb.href = '#' + g.key;
      bb.textContent = '← Вернуться к гайду ' + g.name;
    }
  }

  /* ---------------- sheets ---------------- */
  function bodyLock() {
    var any = $('.sheet.is-open') || $('.search-modal.is-open') || $('.lightbox.is-open');
    document.body.classList.toggle('is-locked', !!any);
  }

  function openSheet(id) {
    closeSheets(false);
    var aliases = { classes: 'classes-sheet', sections: 'sections-sheet' };
    var sheetId = aliases[id] || id;
    var s = document.getElementById(sheetId);
    if (!s) return;
    if (id === 'sections-sheet') renderSectionsSheet(state.lastGuide);
    s.classList.add('is-open');
    s.setAttribute('aria-hidden', 'false');
    bodyLock();
    var first = s.querySelector('button');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closeSheets(restore) {
    $$('.sheet.is-open').forEach(function (s) {
      s.classList.remove('is-open');
      s.setAttribute('aria-hidden', 'true');
    });
    bodyLock();
    if (restore) {
      var b = $('#menu-btn');
      if (b) b.focus();
    }
  }

  function renderSectionsSheet(key) {
    var list = $('#sections-sheet-list');
    if (!list) return;
    var secs = getSections(key);
    var active = state.activeSec;
    var sub = $('#sections-sheet-sub');
    if (sub) sub.textContent = secs.length + ' ' + plural(secs.length, 'раздел', 'раздела', 'разделов') + ' · читайте в своём темпе';
    list.innerHTML = secs.map(function (s, i) {
      var here = s.id === active;
      return '<button type="button" data-section-sheet="' + s.id + '"' + (here ? ' class="is-active"' : '') + '>' +
        '<span class="num">' + pad(i + 1) + '</span><span>' + esc(s.label) + '</span>' +
        (here ? '<span class="here">Вы здесь</span>' : '<span class="arrow">→</span>') + '</button>';
    }).join('');
  }

  function initSheets() {
    var classesList = $('#classes-sheet-list');
    if (classesList) {
      classesList.innerHTML = CLASSES.map(function (c) {
        return '<button type="button" data-class-sheet="' + c.key + '">' +
          '<span class="sheet-class"><img src="img/class-' + c.key + '.png" alt="" width="28" height="28"><span>' + c.name + '</span></span>' +
          '<span class="arrow">→</span></button>';
      }).join('');
    }

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-sheet]');
      if (opener) {
        e.preventDefault();
        openSheet(opener.dataset.openSheet);
        return;
      }
      var closer = e.target.closest('[data-sheet-close]');
      if (closer) {
        closeSheets(true);
        return;
      }
      var cls = e.target.closest('[data-class-sheet]');
      if (cls) {
        closeSheets(false);
        go('#' + cls.dataset.classSheet);
        return;
      }
      var sec = e.target.closest('[data-section-sheet]');
      if (sec) {
        closeSheets(false);
        go('#' + state.lastGuide + '/' + sec.dataset.sectionSheet);
      }
    });

    $('#menu-btn').addEventListener('click', function () { openSheet('classes-sheet'); });
  }

  /* ---------------- fav + mode delegation ---------------- */
  function initActions() {
    document.addEventListener('click', function (e) {
      var fc = e.target.closest('[data-fav-class]');
      if (fc) { toggleClassFav(fc.dataset.favClass); return; }
      var fb = e.target.closest('[data-fav-beast]');
      if (fb) { toggleBeastFav(fb.dataset.favBeast); return; }
      var uf = e.target.closest('[data-unfav-class]');
      if (uf) { toggleClassFav(uf.dataset.unfavClass); return; }
      var ub = e.target.closest('[data-unfav-beast]');
      if (ub) { toggleBeastFav(ub.dataset.unfavBeast); return; }
      var mode = e.target.closest('[data-mode]');
      if (mode) {
        if (mode.dataset.mode === 'pvp') {
          toast('PvP-гайды пока в разработке — доступен PvE.');
        }
        return;
      }
      var goto = e.target.closest('[data-goto]');
      if (goto) {
        setKbActive(goto.dataset.goto);
        go('#glossary/' + goto.dataset.goto);
        return;
      }
      var cls = e.target.closest('#class-strip [data-class]');
      if (cls) { go('#' + cls.dataset.class); }
    });

    $$('.tabbar [data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        var tab = b.dataset.tab;
        if (tab === 'search') return openSearch();
        if (tab === 'guide') return go('#' + state.lastGuide);
        go('#' + tab);
      });
    });

    $('#favorites-btn').addEventListener('click', function () { go('#favorites'); });
  }

  /* ---------------- search ---------------- */
  var INDEX = [];
  function buildIndex() {
    INDEX = [];
    $$('.view--guide').forEach(function (view) {
      var key = view.dataset.classKey;
      var meta = META[key];
      $$('.sec[data-sec]', view).forEach(function (sec) {
        var h2 = sec.querySelector('h2');
        if (!h2) return;
        var body = $$('p, li', sec).map(function (el) { return el.textContent; }).join(' ');
        INDEX.push({
          kind: 'Гайд', label: meta.name, title: h2.textContent.trim(),
          text: norm(body), raw: body, hash: '#' + key + '/' + sec.dataset.sec
        });
      });
    });
    $$('#view-glossary .glossary-term').forEach(function (term) {
      var h3 = term.querySelector('h3');
      if (!h3) return;
      INDEX.push({
        kind: 'База знаний', label: 'Термин', title: h3.textContent.trim(),
        text: norm(term.textContent), raw: term.textContent.trim(), hash: '#glossary/' + term.id
      });
    });
    BEASTS.forEach(function (b) {
      var body = [b.latin, b.type, b.desc, b.habitat, b.weakness].join(' ');
      INDEX.push({
        kind: 'Бестиарий', label: b.type, title: b.name,
        text: norm(body), raw: body, hash: '#bestiary/' + b.id
      });
    });
  }

  var searchModal, searchInput, searchResults, searchMeta;

  function mark(text, words) {
    var out = esc(text);
    if (!words.length) return out;
    try {
      out = out.replace(new RegExp('(' + words.map(escRe).join('|') + ')', 'gi'), '<mark>$1</mark>');
    } catch (e) {}
    return out;
  }

  function snippet(item, words) {
    var text = item.text;
    var raw = item.raw || item.text;
    var idx = -1;
    for (var i = 0; i < words.length; i++) {
      var p = text.indexOf(words[i]);
      if (p > -1 && (idx === -1 || p < idx)) idx = p;
    }
    if (idx === -1) idx = 0;
    var start = Math.max(0, idx - 55);
    var end = Math.min(raw.length, idx + 135);
    return (start > 0 ? '…' : '') + raw.slice(start, end) + (end < raw.length ? '…' : '');
  }

  function renderSearch(q) {
    var query = norm(q);
    if (!query) {
      searchMeta.textContent = 'Начните вводить слово — поиск идёт по гайдам, базе знаний и бестиарию';
      searchResults.innerHTML = '';
      return;
    }
    var words = query.split(' ').filter(Boolean);
    var res = INDEX.filter(function (it) {
      var hay = norm(it.title + ' ' + it.label + ' ' + it.text);
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
    res.sort(function (a, b) {
      var at = words.every(function (w) { return norm(a.title).indexOf(w) > -1; }) ? 1 : 0;
      var bt = words.every(function (w) { return norm(b.title).indexOf(w) > -1; }) ? 1 : 0;
      return bt - at;
    });
    res = res.slice(0, 40);
    searchMeta.textContent = res.length ? res.length + ' ' + plural(res.length, 'результат', 'результата', 'результатов') : 'Ничего не найдено';
    searchResults.innerHTML = res.map(function (it) {
      return '<button class="search-item" type="button" data-hash="' + it.hash + '">' +
        '<span class="search-row"><span class="search-kind">' + it.kind + '</span><span class="search-sec">' + esc(it.label) + '</span></span>' +
        '<span class="search-title">' + mark(it.title, words) + '</span>' +
        '<span class="search-snip">' + mark(snippet(it, words), words) + '</span></button>';
    }).join('');
  }

  function openSearch() {
    closeSheets(false);
    searchModal.classList.add('is-open');
    searchModal.setAttribute('aria-hidden', 'false');
    $('#search-trigger').setAttribute('aria-expanded', 'true');
    bodyLock();
    setTimeout(function () { searchInput.focus(); searchInput.select(); }, 30);
  }

  function closeSearch(restore) {
    if (!searchModal) return;
    searchModal.classList.remove('is-open');
    searchModal.setAttribute('aria-hidden', 'true');
    var t = $('#search-trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
    bodyLock();
    if (restore && t) t.focus();
  }

  function initSearch() {
    searchModal = $('#search-modal');
    searchInput = $('#search-input');
    searchResults = $('#search-results');
    searchMeta = $('#search-meta');

    $('#search-trigger').addEventListener('click', openSearch);
    $$('[data-search-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeSearch(true); });
    });
    searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });

    searchResults.addEventListener('click', function (e) {
      var item = e.target.closest('[data-hash]');
      if (!item) return;
      closeSearch(false);
      go(item.dataset.hash);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        if (searchModal.classList.contains('is-open')) closeSearch(true);
        else if ($('.sheet.is-open')) closeSheets(true);
        else if ($('.lightbox.is-open')) closeLightbox();
      }
    });
  }

  /* ---------------- toast ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 2600);
  }

  /* ---------------- lightbox ---------------- */
  var lightbox;
  function openLightbox(src, alt) {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.querySelector('img').src = src;
    lightbox.querySelector('img').alt = alt || '';
    bodyLock();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    bodyLock();
  }
  function initLightbox() {
    lightbox = $('#lightbox');
    document.addEventListener('click', function (e) {
      var img = e.target.closest('.gallery img, .shot img');
      if (img) {
        e.preventDefault();
        openLightbox(img.src, img.alt);
        return;
      }
      if (e.target.closest('.lightbox__close') || e.target === lightbox) closeLightbox();
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initBestiary();
    initSheets();
    initActions();
    initSearch();
    initLightbox();
    buildIndex();
    render();

    window.addEventListener('hashchange', render);
    window.addEventListener('resize', function () {
      if (document.body.dataset.view === 'bestiary') renderBestiary();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
