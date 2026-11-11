/* ============================================================
   AION 2 · GUIDEBOOK — router, rails, catalogs, search
   ============================================================ */
(function () {
  'use strict';

  var CLASSES = [
    { key: 'ranger', name: 'Лучник', en: 'Ranger', role: 'Дальний DPS', roleEn: 'Ranged DPS' },
    { key: 'assassin', name: 'Ассасин', en: 'Assassin', role: 'Ближний DPS', roleEn: 'Melee DPS' },
    { key: 'sorcerer', name: 'Чародей', en: 'Sorcerer', role: 'Магический DPS', roleEn: 'Magic DPS' },
    { key: 'spiritmaster', name: 'Душелов', en: 'Spiritmaster', role: 'DPS · пет-класс', roleEn: 'DPS · pet class' },
    { key: 'templar', name: 'Храмовник', en: 'Templar', role: 'Танк', roleEn: 'Tank' },
    { key: 'gladiator', name: 'Гладиатор', en: 'Gladiator', role: 'Ближний DPS', roleEn: 'Melee DPS' },
    { key: 'cleric', name: 'Клирик', en: 'Cleric', role: 'Хилер', roleEn: 'Healer' },
    { key: 'chanter', name: 'Чантер', en: 'Chanter', role: 'Саппорт', roleEn: 'Support' }
  ];
  var META = {};
  CLASSES.forEach(function (c) { META[c.key] = c; });

  var PREFIX = { r: 'ranger', a: 'assassin', so: 'sorcerer', sp: 'spiritmaster', te: 'templar', gl: 'gladiator', cl: 'cleric', ch: 'chanter' };

  var state = { lastGuide: 'ranger', activeSec: null, returnHash: null, lang: 'ru', restoreScroll: false };
  var I18N = {
    ru: {
      nav_guides:'Гайды', nav_pets:'Питомцы', nav_monsters:'Монстры', nav_dungeons:'Подземелья', nav_skills:'Умения', nav_classes:'Классы', nav_items:'Предметы', nav_world:'Мир', nav_glossary:'База знаний',
      classes_label:'Классы', rail_sections:'Разделы гайда', rail_other:'Нужен другой класс?', rail_all:'Все классы →',
      search_placeholder:'Поиск по гайдбуку', search_label:'Поиск', fav_title:'Избранное', menu_title:'Меню классов',
      home:'Главная', guides_section:'Гайды классов', back_guide:'← Вернуться к гайду', back_section:'← Вернуться к разделу', back_to_section:'← Назад к разделу',
      add_fav:'В избранное', in_fav:'В избранном', pvp_dev:'PvP-гайды пока в разработке — здесь только PvE.', pvp_toast:'PvP-гайды пока в разработке — доступен PvE.',
      open:'Открыть', remove:'Убрать из избранного', you_are_here:'Вы здесь',
      choose_class:'Выберите класс', guide_sections:'Разделы гайда', close:'Закрыть',
      search_start:'Начните вводить — поиск по гайдам, базе знаний, питомцам, монстрам, подземельям и умениям',
      nothing_found:'Ничего не найдено', results:'результатов',
      pets_all_types:'Все виды', pets_sort_alpha:'По алфавиту', pets_sort_type:'По виду', pets_sort_rank:'По рангу',
      monsters_all_types:'Все типы', monsters_all_ranks:'Все ранги', monsters_sort_lvl:'По уровню', monsters_sort_name:'По имени', monsters_sort_rank:'По рангу',
      dungeons_all_types:'Все типы', skills_all_classes:'Все классы', skills_all_cats:'Все категории',
      active:'Активные', passive:'Пассивные', stigmas:'Стигмы',
      total:'Всего', loaded:'загружено', out_of:'из', pets_word:'питомцев', monsters_word:'монстров', dungeons_word:'подземелий', skills_word:'умений',
      open_page:'Открыть страницу →', full_catalog:'Полный каталог →', catalog:'Каталог', guide_link:'Гайд →',
      class_guide:'Гайд по классу · PvE', mode_pve:'PvE', mode_pvp:'PvP',
      footer_unofficial:'Неофициальный фан-проект. Данные и билды: Mobalytics. Баланс меняется патчами — сверяйтесь с источником.',
      error_link:'Ошибка?', personal:'Личное', favorites_lead:'Гайды и существа, которые вы сохранили.', favorites_desc:'Список хранится в этом браузере — ничего не отправляется на сервер.',
      fav_empty_classes:'Пока пусто. Откройте гайд класса и нажмите «В избранное» в шапке гайда.', fav_catalogs:'Для питомцев, монстров, подземелий и умений используйте разделы каталога:',
      lang_toast_ru:'RU: русский язык', lang_toast_en:'EN: English language'
    },
    en: {
      nav_guides:'Guides', nav_pets:'Pets', nav_monsters:'Monsters', nav_dungeons:'Dungeons', nav_skills:'Skills', nav_classes:'Classes', nav_items:'Items', nav_world:'World', nav_glossary:'Knowledge Base',
      classes_label:'Classes', rail_sections:'Guide sections', rail_other:'Need another class?', rail_all:'All classes →',
      search_placeholder:'Search the guidebook', search_label:'Search', fav_title:'Favorites', menu_title:'Class menu',
      home:'Home', guides_section:'Class guides', back_guide:'← Back to guide', back_section:'← Back to section', back_to_section:'← Back to section',
      add_fav:'Add to favorites', in_fav:'In favorites', pvp_dev:'PvP guides are in development — PvE only here.', pvp_toast:'PvP guides are in development — PvE is available.',
      open:'Open', remove:'Remove from favorites', you_are_here:'You are here',
      choose_class:'Choose a class', guide_sections:'Guide sections', close:'Close',
      search_start:'Start typing — search guides, knowledge base, pets, monsters, dungeons and skills',
      nothing_found:'Nothing found', results:'results',
      pets_all_types:'All types', pets_sort_alpha:'Alphabetical', pets_sort_type:'By type', pets_sort_rank:'By rank',
      monsters_all_types:'All types', monsters_all_ranks:'All ranks', monsters_sort_lvl:'By level', monsters_sort_name:'By name', monsters_sort_rank:'By rank',
      dungeons_all_types:'All types', skills_all_classes:'All classes', skills_all_cats:'All categories',
      active:'Active', passive:'Passive', stigmas:'Stigmas',
      total:'Total', loaded:'loaded', out_of:'of', pets_word:'pets', monsters_word:'monsters', dungeons_word:'dungeons', skills_word:'skills',
      open_page:'Open page →', full_catalog:'Full catalog →', catalog:'Catalog', guide_link:'Guide →',
      class_guide:'Class guide · PvE', mode_pve:'PvE', mode_pvp:'PvP',
      footer_unofficial:'Unofficial fan project. Data and builds: Mobalytics. Balance changes with patches — check the source.',
      error_link:'Issue?', personal:'Personal', favorites_lead:'Guides and creatures you saved.', favorites_desc:'Stored in this browser — nothing is sent to a server.',
      fav_empty_classes:'Empty for now. Open a class guide and click “Add to favorites” in the guide header.', fav_catalogs:'For pets, monsters, dungeons and skills, use the catalog sections:',
      lang_toast_ru:'RU: русский язык', lang_toast_en:'EN: English language'
    }
  };
  function t(key){ return (I18N[state.lang] && I18N[state.lang][key]) || (I18N.ru[key]) || key; }
  var scrollMemo = {};
  try { state.returnHash = sessionStorage.getItem('aion2:return') || null; } catch (e) {}
  try { state.lang = localStorage.getItem('aion2:lang') || 'ru'; } catch (e) {}

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function norm(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function readFav(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch (e) { return new Set(); }
  }
  function writeFav(key, set) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }
  var favClasses = readFav('aion2:favorites:classes');

  /* ---------------- router ---------------- */
  var CATALOG_VIEWS = {pets:1,monsters:1,dungeons:1,skills:1,classes:1,items:1,world:1,glossary:1,favorites:1};
  function parseHash() {
    var raw = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (!raw) return { view: 'guide', key: 'ranger', sec: null };
    var parts = raw.split('/');
    var head = parts[0] || '';
    var sec = parts[1] || null;
    if (head === 'bestiary') head = 'monsters';
    if (CATALOG_VIEWS[head]) return { view: head, key: null, sec: sec };
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
    if (id && id.indexOf('-') > -1) {
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
      var rl = $('#rail-left'); if (rl) rl.innerHTML = '';
    }

    updateBackLinks();

    if (view === 'pets') renderPets();
    if (view === 'monsters') renderMonsters();
    if (view === 'dungeons') renderDungeons();
    if (view === 'skills') renderSkillsView();
    if (view === 'classes') renderClassesView();
    if (view === 'items') renderItemsView();
    if (view === 'world') renderWorldView();
    if (view === 'favorites') renderFavorites();
    if (view === 'glossary') setKbActive(sec || 'g-systems');

    var titles = {
      guide: META[key] ? META[key].name + ' · Aion 2 Гайдбук' : 'Aion 2 Гайдбук',
      pets: 'Питомцы · Aion 2 Гайдбук',
      monsters: 'Монстры · Aion 2 Гайдбук',
      dungeons: 'Подземелья · Aion 2 Гайдбук',
      skills: 'Умения · Aion 2 Гайдбук',
      classes: 'Классы · Aion 2 Гайдбук',
      items: 'Предметы · Aion 2 Гайдбук',
      world: 'Мир · Aion 2 Гайдбук',
      glossary: 'База знаний · Aion 2 Гайдбук',
      favorites: 'Избранное · Aion 2 Гайдбук'
    };
    document.title = titles[view] || titles.guide;

    requestAnimationFrame(function () {
      setTimeout(function () {
        var hash = location.hash || '#';
        if (state.restoreScroll) {
          state.restoreScroll = false;
          if (scrollMemo[hash] != null) {
            window.scrollTo(0, scrollMemo[hash]);
            if (view === 'guide') spy();
            return;
          }
        }
        if (sec) {
          scrollToId(sec);
          if (view === 'glossary') flash(sec);
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
    var lang = state.lang === 'en' ? 'en' : 'ru';
    return $$('.sec[data-sec]', view).map(function (sec) {
      var label = sec.dataset.label || (sec.querySelector('h2') || {}).textContent || '';
      if (lang === 'en' && sec.getAttribute('data-label-en')) label = sec.getAttribute('data-label-en');
      if (lang === 'ru' && sec.getAttribute('data-label-ru')) label = sec.getAttribute('data-label-ru') || sec.dataset.label || label;
      return { id: sec.dataset.sec, label: (label || '').trim(), el: sec };
    });
  }

  function renderRails(key) {
    var secs = getSections(key);
    var html = secs.map(function (s, i) {
      return '<a href="#' + key + '/' + s.id + '" data-sec-link="' + s.id + '"><span class="num">' + pad(i + 1) + '</span><span>' + esc(s.label) + '</span></a>';
    }).join('');
    var left = $('#rail-left');
    if (left) left.innerHTML = html;
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
      scrollMemo[location.hash || '#'] = window.scrollY;
    });
  }, { passive: true });

  window.addEventListener('popstate', function () { state.restoreScroll = true; });

  /* ---------------- favorites ---------------- */
  function isFavClass(key) { return favClasses.has(key); }

  function updateSideFav(key) {
    var btn = $('#view-guide-' + key + ' [data-fav-current]');
    if (!btn) return;
    var on = isFavClass(key);
    var label = btn.querySelector('span');
    if (label) label.textContent = on ? t('in_fav') : t('add_fav');
    btn.classList.toggle('is-fav', on);
    btn.setAttribute('aria-pressed', String(on));
  }

  function toggleClassFav(key, silent) {
    if (!key || !META[key]) return;
    if (favClasses.has(key)) favClasses.delete(key);
    else favClasses.add(key);
    writeFav('aion2:favorites:classes', favClasses);
    if (document.body.dataset.view === 'guide') updateSideFav(key);
    if (document.body.dataset.view === 'favorites') renderFavorites();
    if (!silent) {
      var nm = (state.lang==='en' ? META[key].en : META[key].name);
      toast(favClasses.has(key) ? (nm + (state.lang==='en' ? ' added to favorites' : ' добавлен в избранное')) : (nm + (state.lang==='en' ? ' removed from favorites' : ' убран из избранного')));
    }
  }

  function renderFavorites() {
    var wrap = $('#favorites-content');
    if (!wrap) return;
    var cls = CLASSES.filter(function (c) { return favClasses.has(c.key); });
    var en = state.lang === 'en';

    var html = '<section class="sec"><div class="sec__eyebrow"><span class="n">01</span><span>' + t('nav_classes') + '</span></div><h2>' + t('guides_section') + '</h2>';
    if (cls.length) {
      html += '<div class="fav-list">' + cls.map(function (c) {
        var name = en ? c.en : c.name;
        var sub = en ? (c.name + ' · ' + c.role) : (c.en + ' · ' + c.role);
        return '<div class="fav-row"><img src="img/class-' + c.key + '.png" alt="" width="42" height="42">' +
          '<div class="fav-row__body"><b>' + esc(name) + '</b><span>' + esc(sub) + '</span></div>' +
          '<a class="btn btn--ghost" href="#' + c.key + '">' + t('open') + '</a>' +
          '<button class="icon-btn" type="button" data-unfav-class="' + c.key + '" aria-label="' + esc(t('remove')) + '">×</button></div>';
      }).join('') + '</div>';
    } else {
      html += '<p class="fav-empty">' + t('fav_empty_classes') + '</p>';
    }
    html += '</section>';

    html += '<section class="sec"><div class="sec__eyebrow"><span class="n">02</span><span>' + (en ? 'Catalogs' : 'Каталоги') + '</span></div><h2>' + (en ? 'Reference catalogs' : 'Справочники') + '</h2>' +
      '<p class="fav-empty">' + t('fav_catalogs') + ' <a class="g-link" href="#pets">' + t('nav_pets') + '</a>, <a class="g-link" href="#monsters">' + t('nav_monsters') + '</a>, <a class="g-link" href="#dungeons">' + t('nav_dungeons') + '</a>, <a class="g-link" href="#skills">' + t('nav_skills') + '</a>.</p></section>';

    wrap.innerHTML = html;
  }

  /* ---------------- pets ---------------- */
  var petsState = { query: '', type: 'all', sort: 'alpha' };
  function getPets(){ return (window.AION2_PETS || []); }
  function filteredPets(){
    var q = norm(petsState.query);
    var list = getPets().filter(function(p){
      if (petsState.type !== 'all' && p.type !== petsState.type) return false;
      if (!q) return true;
      return norm([p.name,p.type,p.rank,p.source].join(' ')).indexOf(q) > -1;
    });
    list.sort(function(a,b){
      if (petsState.sort === 'type') { var d=(a.type||'').localeCompare(b.type||'','ru'); if(d) return d; }
      if (petsState.sort === 'rank') { var d2=(a.rank||'').localeCompare(b.rank||'','ru'); if(d2) return d2; }
      return (a.name||'').localeCompare(b.name||'','ru');
    });
    return list;
  }
  var LMAP = {
    type: { 'Дикие':'Wild', 'Мутанты':'Mutants', 'Разумные':'Sapient', 'Природные':'Natural' },
    rank: { 'Обычный':'Common', 'Общий':'Common', 'Общий/Элитный':'Common/Elite', 'Элитный':'Elite', 'Героический':'Heroic' },
    dcat: { 'Кошмары':'Nightmares', 'Артефакты Бездны':'Abyss Artifacts', 'Экспедиция':'Expedition', 'Священные земли':'Sanctum Lands', 'Неведомый разлом':'Dimensional Rift', 'Битва пробуждения':'Awakening Battle', 'Запечатанное подземелье':'Sealed Dungeon' }
  };
  function l(v,map){ if(state.lang!=='en') return v; return (map&&map[v]) || v; }

  function renderPets(){
    var grid = $('#pet-grid'); if(!grid) return;
    var sel = $('#pet-type');
    if (sel) {
      var cur = sel.value || petsState.type || 'all';
      var types = {};
      getPets().forEach(function(p){ types[p.type]=1; });
      sel.innerHTML = '<option value="all">'+t('pets_all_types')+'</option>' + Object.keys(types).sort(function(a,b){return a.localeCompare(b,'ru');}).map(function(tt){
        return '<option value="'+esc(tt)+'">'+esc(l(tt,LMAP.type))+'</option>';
      }).join('');
      sel.value = cur; if(!sel.value) { sel.value='all'; petsState.type='all'; }
    }
    var list = filteredPets();
    grid.innerHTML = list.map(function(p){
      return '<article class="catalog-card pet-card">' +
        '<a class="catalog-card__img" href="'+esc(p.url)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+esc(p.img)+'" alt=""></a>' +
        '<div class="catalog-card__body">' +
          '<div class="catalog-card__title"><a href="'+esc(p.url)+'" target="_blank" rel="noopener">'+esc(p.name)+'</a></div>' +
          '<div class="catalog-card__meta"><span class="tag">'+esc(l(p.type,LMAP.type))+'</span><span class="tag">'+esc(l(p.rank||'Обычный',LMAP.rank))+'</span></div>' +
          '<div class="catalog-card__src">'+esc(p.source||'')+'</div>' +
          '<a class="catalog-card__link" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+t('open_page')+'</a>' +
        '</div></article>';
    }).join('') || '<p class="fav-empty">'+t('nothing_found')+'</p>';
    var count = $('#pet-count'); if(count) count.textContent = list.length + ' ' + t('out_of') + ' ' + getPets().length + ' ' + t('pets_word');
    var foot = $('#pet-foot'); if(foot) foot.textContent = state.lang==='en' ? 'Full pet catalog (210). Levels, acquisition methods and details are on pet pages.' : 'Полный каталог питомцев (210). Уровни знания, способы получения и детали — в карточках.';
  }
  function initPets(){
    var s=$('#pet-search'); if(s) s.addEventListener('input', function(){ petsState.query=s.value; renderPets(); });
    var t=$('#pet-type'); if(t) t.addEventListener('change', function(){ petsState.type=t.value; renderPets(); });
    var so=$('#pet-sort'); if(so) so.addEventListener('change', function(){ petsState.sort=so.value; renderPets(); });
  }

  /* ---------------- monsters ---------------- */
  var monstersState = { query: '', type: 'all', rank: 'all', sort: 'lvl' };
  function getMonsters(){ return ((window.AION2_WIKILY||{}).monsters || []); }
  function lvlNum(s){
    var m = String(s||'').match(/(\d+)/);
    return m ? parseInt(m[1],10) : 9999;
  }
  function filteredMonsters(){
    var q = norm(monstersState.query);
    var list = getMonsters().filter(function(m){
      if (monstersState.type !== 'all' && m.type !== monstersState.type) return false;
      if (monstersState.rank !== 'all' && norm(m.rank).indexOf(norm(monstersState.rank)) === -1) return false;
      if (!q) return true;
      return norm([m.name,m.type,m.rank,m.lvl,m.loc].join(' ')).indexOf(q) > -1;
    });
    list.sort(function(a,b){
      if (monstersState.sort === 'name') return (a.name||'').localeCompare(b.name||'','ru');
      if (monstersState.sort === 'rank') { var d=(a.rank||'').localeCompare(b.rank||'','ru'); if(d) return d; }
      var la=lvlNum(a.lvl), lb=lvlNum(b.lvl); if (la!==lb) return la-lb;
      return (a.name||'').localeCompare(b.name||'','ru');
    });
    return list;
  }
  function renderMonsters(){
    var grid=$('#monsters-grid'); if(!grid) return;
    var selT=$('#monster-type');
    if (selT) {
      var curT = selT.value || monstersState.type || 'all';
      var types={}; getMonsters().forEach(function(m){ if(m.type) types[m.type]=1; });
      selT.innerHTML = '<option value="all">'+t('monsters_all_types')+'</option>' + Object.keys(types).sort(function(a,b){return a.localeCompare(b,'ru');}).map(function(tt){ return '<option value="'+esc(tt)+'">'+esc(l(tt,LMAP.type))+'</option>'; }).join('');
      selT.value=curT; if(!selT.value){selT.value='all'; monstersState.type='all';}
    }
    var selR=$('#monster-rank');
    if (selR) {
      var curR = selR.value || monstersState.rank || 'all';
      selR.innerHTML = '<option value="all">'+t('monsters_all_ranks')+'</option>' + ['Общий','Элитный','Героический'].map(function(r){ return '<option value="'+r+'">'+esc(l(r,LMAP.rank))+'</option>'; }).join('');
      selR.value=curR; if(!selR.value){selR.value='all'; monstersState.rank='all';}
    }
    var list = filteredMonsters();
    grid.innerHTML = list.map(function(m){
      var lvlLabel = state.lang==='en' ? ('Lv. '+esc(m.lvl)) : ('Ур. '+esc(m.lvl));
      return '<a class="catalog-card monster-card" href="'+esc(m.url)+'" target="_blank" rel="noopener">' +
        '<div class="catalog-card__img"><img loading="lazy" src="'+esc(m.img)+'" alt=""></div>' +
        '<div class="catalog-card__body"><div class="catalog-card__title">'+esc(m.name)+'</div>' +
        '<div class="catalog-card__meta"><span class="tag">'+lvlLabel+'</span><span class="tag">'+esc(l(m.rank,LMAP.rank))+'</span><span class="tag">'+esc(l(m.type,LMAP.type))+'</span></div>' +
        '<div class="catalog-card__src">'+esc(m.loc||'')+'</div></div></a>';
    }).join('') || '<p class="fav-empty">'+t('nothing_found')+'</p>';
    var count=$('#monsters-count'); if(count) count.textContent = list.length + ' ' + t('out_of') + ' ' + getMonsters().length + ' ' + t('loaded') + ' (' + t('total') + ' 1 814)';
    var foot=$('#monsters-foot'); if(foot) foot.textContent = state.lang==='en' ? 'Loaded sample from 1,814 monsters. Full list, locations and drops are available via links and region filters.' : 'Подборка монстров (загруженная выборка из 1 814). Полный список, локации и добыча — по ссылкам и фильтрам регионов.';
  }
  function initMonsters(){
    var s=$('#monster-search'); if(s) s.addEventListener('input', function(){ monstersState.query=s.value; renderMonsters(); });
    var t=$('#monster-type'); if(t) t.addEventListener('change', function(){ monstersState.type=t.value; renderMonsters(); });
    var r=$('#monster-rank'); if(r) r.addEventListener('change', function(){ monstersState.rank=r.value; renderMonsters(); });
    var so=$('#monster-sort'); if(so) so.addEventListener('change', function(){ monstersState.sort=so.value; renderMonsters(); });
  }

  /* ---------------- dungeons ---------------- */
  var dungeonsState = { query: '', cat: 'all' };
  function getDungeons(){ return ((window.AION2_WIKILY||{}).dungeons || []); }
  function filteredDungeons(){
    var q = norm(dungeonsState.query);
    return getDungeons().filter(function(d){
      if (dungeonsState.cat !== 'all' && d.cat !== dungeonsState.cat) return false;
      if (!q) return true;
      return norm([d.name,d.cat,d.note,d.lvl,d.group].join(' ')).indexOf(q) > -1;
    });
  }
  function renderDungeons(){
    var grid=$('#dungeons-grid'); if(!grid) return;
    var sel=$('#dungeon-cat');
    if (sel) {
      var cur=sel.value || dungeonsState.cat || 'all';
      var cats={}; getDungeons().forEach(function(d){ if(d.cat) cats[d.cat]=1; });
      sel.innerHTML = '<option value="all">'+t('dungeons_all_types')+'</option>' + Object.keys(cats).sort(function(a,b){return a.localeCompare(b,'ru');}).map(function(c){ return '<option value="'+esc(c)+'">'+esc(l(c,LMAP.dcat))+'</option>'; }).join('');
      sel.value=cur; if(!sel.value){sel.value='all'; dungeonsState.cat='all';}
    }
    var list = filteredDungeons();
    grid.innerHTML = list.map(function(d){
      var lvlTag = (d.lvl&&d.lvl!=='—') ? '<span class="tag">'+(state.lang==='en'?'Lv. ':'Ур. ')+esc(d.lvl)+'</span>' : '';
      var grpTag = (d.group&&d.group!=='—') ? '<span class="tag">'+(state.lang==='en'?'Group ':'Группа ')+esc(d.group)+'</span>' : '';
      return '<a class="catalog-card dungeon-card" href="'+esc(d.url)+'" target="_blank" rel="noopener">' +
        '<div class="catalog-card__img"><img loading="lazy" src="'+esc(d.img)+'" alt=""></div>' +
        '<div class="catalog-card__body"><div class="catalog-card__title">'+esc(d.name)+'</div>' +
        '<div class="catalog-card__meta"><span class="tag">'+esc(l(d.cat,LMAP.dcat))+'</span>'+lvlTag+grpTag+'</div>' +
        '<div class="catalog-card__src">'+esc(d.note||'')+'</div></div></a>';
    }).join('') || '<p class="fav-empty">'+t('nothing_found')+'</p>';
    var count=$('#dungeons-count'); if(count) count.textContent = list.length + ' ' + t('out_of') + ' ' + getDungeons().length + ' ' + t('loaded') + ' (' + t('total') + ' 136)';
    var foot=$('#dungeons-foot'); if(foot) foot.textContent = state.lang==='en' ? 'Loaded sample from 136 dungeons. Full catalog, modes, bosses and rewards are available via section links.' : 'Подборка подземелий (загруженная выборка из 136). Полный каталог, режимы, боссы и награды — по ссылкам раздела.';
  }
  function initDungeons(){
    var s=$('#dungeon-search'); if(s) s.addEventListener('input', function(){ dungeonsState.query=s.value; renderDungeons(); });
    var c=$('#dungeon-cat'); if(c) c.addEventListener('change', function(){ dungeonsState.cat=c.value; renderDungeons(); });
  }

  /* ---------------- skills / classes / items / world ---------------- */
  var skillsState = { query: '', cls: 'all', cat: 'all' };
  function getSkills(){ return ((window.AION2_WIKILY||{}).skills || []); }
  function renderSkillsView(){
    // Skills excluded from translation (names/content). Keep UI labels minimal/static in RU or neutral where needed.
    var cats=$('#skills-cats');
    if(cats){
      var data=(window.AION2_WIKILY||{}).skillsCats||[];
      cats.innerHTML = data.map(function(c){
        return '<a class="info-card" href="'+esc(c.url)+'" target="_blank" rel="noopener"><b>'+esc(c.name)+'</b><span>'+c.count+' — '+esc(c.desc)+'</span></a>';
      }).join('');
    }
    var grid=$('#skills-grid'); if(!grid) return;
    var selC=$('#skill-class');
    if(selC && selC.options.length <= 1){
      var classes={}; getSkills().forEach(function(s){ if(s.class) classes[s.class]=1; });
      Object.keys(classes).sort(function(a,b){return a.localeCompare(b,'ru');}).forEach(function(c){ var o=document.createElement('option'); o.value=c; o.textContent=c; selC.appendChild(o); });
    }
    var q=norm(skillsState.query);
    var list=getSkills().filter(function(s){
      if(skillsState.cls!=='all' && s.class!==skillsState.cls) return false;
      if(skillsState.cat!=='all' && s.cat!==skillsState.cat) return false;
      if(!q) return true;
      return norm([s.name,s.class,s.cat,s.cd].join(' ')).indexOf(q)>-1;
    });
    grid.innerHTML = list.map(function(s){
      return '<a class="skill-row-card" href="'+esc(s.url)+'" target="_blank" rel="noopener">' +
        '<img src="'+esc(s.icon)+'" alt="" loading="lazy"><span class="skill-row-card__body"><b>'+esc(s.name)+'</b><span>'+esc(s.class)+' · '+esc(s.cat)+(s.cd?(' · КД '+esc(s.cd)):'')+'</span></span><span class="arrow">→</span></a>';
    }).join('') || '<p class="fav-empty">Ничего не найдено.</p>';
    var count=$('#skills-count'); if(count) count.textContent = list.length + ' / ' + getSkills().length + ' (' + (state.lang==='en'?'total':'всего') + ' 288)';
  }
  function initSkills(){
    var s=$('#skill-search'); if(s) s.addEventListener('input', function(){ skillsState.query=s.value; renderSkillsView(); });
    var c=$('#skill-class'); if(c) c.addEventListener('change', function(){ skillsState.cls=c.value; renderSkillsView(); });
    var cat=$('#skill-cat'); if(cat) cat.addEventListener('change', function(){ skillsState.cat=cat.value; renderSkillsView(); });
  }

  function renderClassesView(){
    var tb=$('#classes-table'); if(!tb) return;
    var data=(window.AION2_WIKILY||{}).classesInfo||[];
    var en = state.lang==='en';
    tb.innerHTML = data.map(function(c){
      var g = '<a href="#'+c.key+'">'+t('guide_link')+'</a>';
      var name = en ? (esc(c.en)+' <span class="muted">('+esc(c.ru)+')</span>') : ('<b>'+esc(c.ru)+'</b> <span class="muted">('+esc(c.en)+')</span>');
      return '<tr><td>'+name+'</td><td>'+esc(c.weapon)+'</td><td>'+esc(c.role)+'</td><td>'+g+'</td></tr>';
    }).join('');
  }

  function renderItemsView(){
    var box=$('#items-cards'); if(!box) return;
    var en = state.lang==='en';
    var items = en ? [
      {t:'Quests',d:'713 quests: Episode (175), Region (116), Orders (113), Missions (146), Crafting (12), Exploration (151). Objectives, levels, NPCs and rewards.',u:'https://wikily.gg/ru/aion-2/quests'},
      {t:'Titles',d:'542 titles across categories with apply/own effects and sources.',u:'https://wikily.gg/ru/aion-2/titles'},
      {t:'Emotes',d:'26 character emotes — animations and how to obtain them.',u:'https://wikily.gg/ru/aion-2/emotes'},
      {t:'Daevanion',d:'Character development boards: nodes, bonuses and progression routes (Nezekan, Zikel, Vaizel, Triniel, Ariel, Azphel).',u:'https://wikily.gg/ru/aion-2/daevanion'},
      {t:'Abyss Ranks',d:'PvP progression and Abyss ranks: tiers, points and rewards.',u:'https://wikily.gg/ru/aion-2/abyss-ranks'},
      {t:'Cubes',d:'Inventory and storage expansions (cubes) — slots and acquisition.',u:'https://wikily.gg/ru/aion-2/cubes'},
      {t:'Pets',d:'210 pets: types, ranks, images and cards (full local catalog).',u:'#pets',local:true},
      {t:'Equipment & resources',d:'Overview: weapons, armor, accessories, consumables, materials and other item categories.',u:'https://wikily.gg/ru/aion-2/'}
    ] : [
      {t:'Квесты',d:'713 заданий: Эпизод (175), Регион (116), Приказы (113), Миссии (146), Создание (12), Исследование (151). Цели, уровни, NPC и награды.',u:'https://wikily.gg/ru/aion-2/quests'},
      {t:'Титулы',d:'542 титула: Испытания (106), Столкновение (52), Исследование (179), Рост (42), Задание (115) и др. Эффекты «при применении/при наличии» и источники.',u:'https://wikily.gg/ru/aion-2/titles'},
      {t:'Эмоции',d:'26 эмоций персонажа — коллекция анимаций и способов получения.',u:'https://wikily.gg/ru/aion-2/emotes'},
      {t:'Даэванион',d:'Доски развития персонажа: узлы, бонусы и маршруты прокачки (Nezekan, Zikel, Vaizel, Triniel, Ariel, Azphel).',u:'https://wikily.gg/ru/aion-2/daevanion'},
      {t:'Ранги Бездны',d:'PvP-прогрессия и ранги Бездны: ступени, очки и награды.',u:'https://wikily.gg/ru/aion-2/abyss-ranks'},
      {t:'Кубы',d:'Расширения инвентаря и хранилища (кубы) — слоты и способы получения.',u:'https://wikily.gg/ru/aion-2/cubes'},
      {t:'Питомцы',d:'210 питомцев: виды, ранги, изображения и карточки (полный локальный каталог).',u:'#pets',local:true},
      {t:'Экипировка и ресурсы',d:'Сводный раздел: оружие, броня, аксессуары, расходники, материалы и прочие категории предметов.',u:'https://wikily.gg/ru/aion-2/'}
    ];
    box.innerHTML = items.map(function(i){
      var target = i.local ? '' : ' target="_blank" rel="noopener"';
      return '<a class="info-card" href="'+esc(i.u)+'"'+target+'><b>'+esc(i.t)+'</b><span>'+esc(i.d)+'</span></a>';
    }).join('');
  }

  function renderWorldView(){
    var box=$('#world-cards'); if(!box) return;
    var en = state.lang==='en';
    var items = en ? [
      {t:'Regions',d:'Zones of Atreia: locations, levels, key points and activities by region.',u:'https://wikily.gg/ru/aion-2/regions'},
      {t:'Monsters',d:'1,814 creatures: level, rank, type, locations and drops (local sample + catalog).',u:'#monsters',local:true},
      {t:'Bosses',d:'56 bosses: locations, mechanics and rewards.',u:'https://wikily.gg/ru/aion-2/bosses'},
      {t:'Dungeons',d:'136 activities of all types: entry levels, group size, bosses and rewards (local sample + catalog).',u:'#dungeons',local:true},
      {t:'Nightmares',d:'1 challenge activity with 7 bosses (Lv. 45–65) and unique rewards.',u:'https://wikily.gg/ru/aion-2/dungeons/nightmare'},
      {t:'Expeditions',d:'8 group expeditions for coordinated runs.',u:'https://wikily.gg/ru/aion-2/dungeons/expeditions'},
      {t:'Sealed Dungeons',d:'121 dungeons (solo/group) — the main instanced category.',u:'https://wikily.gg/ru/aion-2/dungeons/sealed-dungeons'},
      {t:'Dimensional Rifts',d:'2 rifts — special instanced activities with unique conditions.',u:'https://wikily.gg/ru/aion-2/dungeons/dimensional-rifts'},
      {t:'Artifacts & Abyss',d:'Abyss activities, artifacts and related rewards/progression.',u:'https://wikily.gg/ru/aion-2/dungeons/abyss-corridor'}
    ] : [
      {t:'Регионы',d:'Зоны Атреи: локации, уровни, ключевые точки и активности по регионам.',u:'https://wikily.gg/ru/aion-2/regions'},
      {t:'Монстры',d:'1 814 существ: уровень, ранг, тип, места появления и добыча (локальная подборка + каталог).',u:'#monsters',local:true},
      {t:'Боссы',d:'56 боссов: локации, механики и награды.',u:'https://wikily.gg/ru/aion-2/bosses'},
      {t:'Подземелья',d:'136 активностей всех типов: уровни входа, группа, боссы и награды (локальная подборка + каталог).',u:'#dungeons',local:true},
      {t:'Кошмары',d:'1 активность-испытание с 7 боссами (ур. 45–65) и отдельными наградами.',u:'https://wikily.gg/ru/aion-2/dungeons/nightmare'},
      {t:'Экспедиции',d:'8 групповых экспедиций для скоординированных прохождений.',u:'https://wikily.gg/ru/aion-2/dungeons/expeditions'},
      {t:'Запечатанные подземелья',d:'121 подземелье (соло/группа) — основная массовая категория инстансов.',u:'https://wikily.gg/ru/aion-2/dungeons/sealed-dungeons'},
      {t:'Неведомые разломы',d:'2 разлома — особые инстанс-активности с отдельными условиями.',u:'https://wikily.gg/ru/aion-2/dungeons/dimensional-rifts'},
      {t:'Артефакты и Бездна',d:'Активности Бездны, артефакты и связанные награды/прогрессия.',u:'https://wikily.gg/ru/aion-2/dungeons/abyss-corridor'}
    ];
    box.innerHTML = items.map(function(i){
      var target = i.local ? '' : ' target="_blank" rel="noopener"';
      return '<a class="info-card" href="'+esc(i.u)+'"'+target+'><b>'+esc(i.t)+'</b><span>'+esc(i.d)+'</span></a>';
    }).join('');
  }

  /* ---------------- glossary ---------------- */
  function injectGlossaryExtra(){
    var extra = ((window.AION2_WIKILY||{}).glossaryExtra || []);
    if(!extra.length) return;
    var secs = {};
    extra.forEach(function(item){ secs[item.sec] = secs[item.sec] || []; secs[item.sec].push(item); });
    Object.keys(secs).forEach(function(secId){
      var sec = $('[data-sec="'+secId+'"]', $('#view-glossary'));
      if(!sec) return;
      var list = sec.querySelector('.glossary-list');
      if(!list) return;
      secs[secId].forEach(function(item){
        if(document.getElementById(item.id)) return;
        var div = document.createElement('div');
        div.className = 'glossary-term';
        div.id = item.id;
        div.innerHTML = '<h3>'+esc(item.title)+'</h3><p>'+item.body+'</p>';
        list.appendChild(div);
      });
    });
  }

  function setKbActive(id) {
    $$('#kb-nav [data-goto]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.goto === id || (!id && b.dataset.goto === 'g-systems'));
    });
  }

  function updateBackLinks() {
    var g = META[state.lastGuide] || META.ranger;
    var ret = state.returnHash || ('#' + g.key);
    var gname = state.lang==='en' ? g.en : g.name;
    var back = $('#glossary-back');
    if (back) {
      back.href = ret;
      back.textContent = state.returnHash ? t('back_section') : (t('back_guide') + ' ' + gname);
    }
    var top = $('#glossary-back-top');
    if (top) {
      top.href = ret;
      top.textContent = state.returnHash ? t('back_to_section') : ('← ' + (state.lang==='en'?'To guide ':'К гайду ') + gname);
      top.hidden = !state.returnHash;
    }
  }

  /* ---------------- language toggle ---------------- */
  function applyLang(){
    var lang = state.lang === 'en' ? 'en' : 'ru';
    state.lang = lang;
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    var btn = $('#lang-btn');
    if (btn) { btn.textContent = lang === 'en' ? 'EN' : 'RU'; btn.setAttribute('aria-pressed', String(lang==='en')); btn.title = lang === 'en' ? 'Switch to Russian' : 'Switch to English'; }
    $$('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if (k && t(k)) el.textContent = t(k);
    });
    $$('[data-i18n-html]').forEach(function(el){
      var k = el.getAttribute('data-i18n-html');
      if (k && t(k)) el.innerHTML = t(k);
    });
    $$('[data-i18n-placeholder]').forEach(function(el){
      var k = el.getAttribute('data-i18n-placeholder');
      if (k && t(k)) el.setAttribute('placeholder', t(k));
    });
    $$('[data-i18n-aria]').forEach(function(el){
      var k = el.getAttribute('data-i18n-aria');
      if (k && t(k)) el.setAttribute('aria-label', t(k));
    });
    $$('[data-i18n-title]').forEach(function(el){
      var k = el.getAttribute('data-i18n-title');
      if (k && t(k)) el.setAttribute('title', t(k));
    });
    $$('[data-ru-placeholder][data-en-placeholder]').forEach(function(el){
      var v = el.getAttribute(lang==='en'?'data-en-placeholder':'data-ru-placeholder');
      if (v!=null) el.setAttribute('placeholder', v);
    });
    $$('[data-ru-aria][data-en-aria]').forEach(function(el){
      if (el.closest('.skill') || el.closest('#view-skills')) return;
      var v = el.getAttribute(lang==='en'?'data-en-aria':'data-ru-aria');
      if (v!=null) el.setAttribute('aria-label', v);
    });
    $$('[data-ru-title][data-en-title]').forEach(function(el){
      if (el.closest('.skill') || el.closest('#view-skills')) return;
      var v = el.getAttribute(lang==='en'?'data-en-title':'data-ru-title');
      if (v!=null) el.setAttribute('title', v);
    });
    // guide heroes: emphasize EN name in EN mode, swap role/focus facts and some labels where mapped
    $$('.guide-hero h1 .en').forEach(function(el){ el.classList.toggle('is-emph', lang==='en'); });
    $$('[data-ru][data-en]').forEach(function(el){
      if (el.closest('.skill') || el.closest('#view-skills') || el.closest('.skill-ref')) return; // skills excluded
      var v = el.getAttribute(lang==='en'?'data-en':'data-ru');
      if (v != null) el.textContent = v;
    });
    // re-render dynamic views so counts/labels/cards update
    if (typeof renderPets === 'function') renderPets();
    if (typeof renderMonsters === 'function') renderMonsters();
    if (typeof renderDungeons === 'function') renderDungeons();
    if (typeof renderSkillsView === 'function') renderSkillsView();
    if (typeof renderClassesView === 'function') renderClassesView();
    if (typeof renderItemsView === 'function') renderItemsView();
    if (typeof renderWorldView === 'function') renderWorldView();
    if (typeof renderFavorites === 'function') renderFavorites();
    if (typeof renderClassesSheet === 'function') renderClassesSheet();
    if (typeof updateBackLinks === 'function') updateBackLinks();
    if (document.body.dataset.view === 'guide' && typeof renderRails === 'function') renderRails(state.lastGuide);
    if (typeof renderSectionsSheet === 'function') renderSectionsSheet(state.lastGuide);
  }
  function initLang(){
    var btn = $('#lang-btn');
    if (btn) btn.addEventListener('click', function(){
      state.lang = state.lang === 'en' ? 'ru' : 'en';
      try { localStorage.setItem('aion2:lang', state.lang); } catch(e){}
      applyLang();
      toast(state.lang === 'en' ? t('lang_toast_en') : t('lang_toast_ru'));
    });
    applyLang();
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
    if (sheetId === 'sections-sheet') renderSectionsSheet(state.lastGuide);
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
    if (sub) sub.textContent = secs.length + ' ' + (state.lang==='en' ? plural(secs.length,'section','sections','sections') : plural(secs.length, 'раздел', 'раздела', 'разделов'));
    list.innerHTML = secs.map(function (s, i) {
      var here = s.id === active;
      return '<button type="button" data-section-sheet="' + s.id + '"' + (here ? ' class="is-active"' : '') + '>' +
        '<span class="num">' + pad(i + 1) + '</span><span>' + esc(s.label) + '</span>' +
        (here ? '<span class="here">'+t('you_are_here')+'</span>' : '<span class="arrow">→</span>') + '</button>';
    }).join('');
  }

  function renderClassesSheet(){
    var classesList = $('#classes-sheet-list');
    if (classesList) {
      var en = state.lang==='en';
      classesList.innerHTML = CLASSES.map(function (c) {
        var nm = en ? c.en : c.name;
        return '<button type="button" data-class-sheet="' + c.key + '">' +
          '<span class="sheet-class"><img src="img/class-' + c.key + '.png" alt="" width="28" height="28"><span>' + esc(nm) + '</span></span>' +
          '<span class="arrow">→</span></button>';
      }).join('');
    }
  }
  function initSheets() {
    renderClassesSheet();

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-sheet]');
      if (opener) { e.preventDefault(); openSheet(opener.dataset.openSheet); return; }
      var closer = e.target.closest('[data-sheet-close]');
      if (closer) { closeSheets(true); return; }
      var cls = e.target.closest('[data-class-sheet]');
      if (cls) { closeSheets(false); go('#' + cls.dataset.classSheet); return; }
      var sec = e.target.closest('[data-section-sheet]');
      if (sec) { closeSheets(false); go('#' + state.lastGuide + '/' + sec.dataset.sectionSheet); }
    });

    var mb = $('#menu-btn'); if (mb) mb.addEventListener('click', function () { openSheet('classes-sheet'); });
  }

  /* ---------------- actions ---------------- */
  function initActions() {
    document.addEventListener('click', function (e) {
      var gl = e.target.closest('a.g-link');
      if (gl) {
        var href = gl.getAttribute('href') || '';
        // only remember return point when jumping from a guide/other page into glossary
        if (href.indexOf('#glossary') === 0 || href.indexOf('#gt-') === 0 || href.indexOf('#g-') === 0) {
          var here = location.hash || ('#' + state.lastGuide);
          if (parseHash().view !== 'glossary') {
            state.returnHash = here;
            try { sessionStorage.setItem('aion2:return', here); } catch (err) {}
          }
        }
      }
      var fc = e.target.closest('[data-fav-class]');
      if (fc) { toggleClassFav(fc.dataset.favClass); return; }
      var fcur = e.target.closest('[data-fav-current]');
      if (fcur) { toggleClassFav(state.lastGuide); return; }
      var uf = e.target.closest('[data-unfav-class]');
      if (uf) { toggleClassFav(uf.dataset.unfavClass); return; }
      var mode = e.target.closest('[data-mode]');
      if (mode) {
        if (mode.dataset.mode === 'pvp') toast(t('pvp_toast'));
        return;
      }
      var goto = e.target.closest('[data-goto]');
      if (goto) { setKbActive(goto.dataset.goto); go('#glossary/' + goto.dataset.goto); return; }
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

    var favBtn = $('#favorites-btn'); if (favBtn) favBtn.addEventListener('click', function () { go('#favorites'); });
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
    getPets().forEach(function (p) {
      var body = [p.type, p.rank, p.source, 'питомец'].join(' ');
      INDEX.push({ kind: 'Питомцы', label: p.type, title: p.name, text: norm(p.name+' '+body), raw: body, hash: '#pets' });
    });
    getMonsters().forEach(function (m) {
      var body = ['монстр', m.rank, m.lvl, m.type, m.loc].join(' ');
      INDEX.push({ kind: 'Монстры', label: m.rank, title: m.name, text: norm(m.name+' '+body), raw: body, hash: '#monsters' });
    });
    getDungeons().forEach(function (d) {
      var body = ['подземелье', d.cat, d.note, d.lvl].join(' ');
      INDEX.push({ kind: 'Подземелья', label: d.cat, title: d.name, text: norm(d.name+' '+body), raw: body, hash: '#dungeons' });
    });
    getSkills().forEach(function (s) {
      var body = ['умение', s.class, s.cat, s.cd].join(' ');
      INDEX.push({ kind: 'Умения', label: s.class, title: s.name, text: norm(s.name+' '+body), raw: body, hash: '#skills' });
    });
    [{t:'Питомцы',h:'#pets',k:'Каталог',b:'210 питомцев Aion 2 поиск фильтры виды'},
     {t:'Монстры',h:'#monsters',k:'Каталог',b:'1814 монстров боссы локации добыча подборка'},
     {t:'Подземелья',h:'#dungeons',k:'Каталог',b:'136 подземелий кошмары запечатанные экспедиции боссы награды'},
     {t:'Умения',h:'#skills',k:'Справочник',b:'288 умений активные пассивные стигмы классы'},
     {t:'Классы',h:'#classes',k:'Справочник',b:'8 классов оружие роль ресурсы гайды'},
     {t:'Предметы и сводки',h:'#items',k:'Сводки',b:'квесты титулы эмоции даэванион кубы ранги бездны'},
     {t:'Мир и активности',h:'#world',k:'Сводки',b:'регионы боссы активности мир'}
    ].forEach(function(x){ INDEX.push({kind:x.k,label:'Раздел',title:x.t,text:norm(x.t+' '+x.b),raw:x.b,hash:x.h}); });
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

  var KIND_EN = { 'Гайд':'Guide','База знаний':'Knowledge Base','Термин':'Term','Питомцы':'Pets','Монстры':'Monsters','Подземелья':'Dungeons','Умения':'Skills','Каталог':'Catalog','Справочник':'Reference','Сводки':'Summaries','Раздел':'Section' };
  function renderSearch(q) {
    var query = norm(q);
    var en = state.lang==='en';
    if (!query) {
      if(searchMeta) searchMeta.textContent = t('search_start');
      if(searchResults) searchResults.innerHTML = '';
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
    res = res.slice(0, 50);
    if(searchMeta) searchMeta.textContent = res.length ? (res.length + ' ' + (en ? plural(res.length,'result','results','results') : plural(res.length, 'результат', 'результата', 'результатов'))) : t('nothing_found');
    if(searchResults) searchResults.innerHTML = res.map(function (it) {
      var kind = en ? (KIND_EN[it.kind]||it.kind) : it.kind;
      var label = en ? (KIND_EN[it.label]||it.label) : it.label;
      return '<button class="search-item" type="button" data-hash="' + it.hash + '">' +
        '<span class="search-row"><span class="search-kind">' + esc(kind) + '</span><span class="search-sec">' + esc(label) + '</span></span>' +
        '<span class="search-title">' + mark(it.title, words) + '</span>' +
        '<span class="search-snip">' + mark(snippet(it, words), words) + '</span></button>';
    }).join('');
  }

  function openSearch() {
    closeSheets(false);
    if (!searchModal) return;
    searchModal.classList.add('is-open');
    searchModal.setAttribute('aria-hidden', 'false');
    var st = $('#search-trigger'); if (st) st.setAttribute('aria-expanded', 'true');
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
    if (!searchModal) return;

    var st = $('#search-trigger'); if (st) st.addEventListener('click', openSearch);
    $$('[data-search-close]').forEach(function (b) { b.addEventListener('click', function () { closeSearch(true); }); });
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
    if (!lightbox) return;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.querySelector('img').src = src;
    lightbox.querySelector('img').alt = alt || '';
    bodyLock();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    bodyLock();
  }
  function initLightbox() {
    lightbox = $('#lightbox');
    document.addEventListener('click', function (e) {
      var img = e.target.closest('.gallery img, .shot img');
      if (img) { e.preventDefault(); openLightbox(img.src, img.alt); return; }
      if (e.target.closest('.lightbox__close') || e.target === lightbox) closeLightbox();
    });
  }

  /* ---------------- inline skill icons in text ---------------- */
  function initInlineSkillIcons() {
    var map = {};
    $$('.skill').forEach(function (el) {
      var img = el.querySelector('img');
      var h = el.querySelector('h3');
      if (!img || !h) return;
      var name = (h.childNodes[0] && h.childNodes[0].textContent || h.textContent || '').trim();
      if (name) map[name] = img.getAttribute('src');
    });
    $$('.ranks li').forEach(function (li) {
      var img = li.querySelector('img');
      var span = li.querySelector('span');
      if (img && span) map[span.textContent.trim()] = img.getAttribute('src');
    });
    var aliases = { 'Rage': 'img/s-fury.webp', 'Rage Burst': 'img/s-rage-burst.webp' };
    Object.keys(aliases).forEach(function (k) { if (!map[k]) map[k] = aliases[k]; });
    var names = Object.keys(map).filter(function (n) { return n && n.length > 2; });
    names.sort(function (a, b) { return b.length - a.length; });
    if (!names.length) return;
    var re = new RegExp('(^|[^\\wА-Яа-яЁё])(' + names.map(function (n) { return escRe(n); }).join('|') + ')(?=$|[^\\wА-Яа-яЁё])', 'g');
    var skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, IMG: 1, SVG: 1 };
    $$('.view--guide').forEach(function (view) {
      var walker = document.createTreeWalker(view, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (skip[p.tagName]) return NodeFilter.FILTER_REJECT;
          if (p.closest('.skill, .ranks, .skill-ref, .sheet, .guide-mobile-controls, .focus-grid, .class-strip, .rail, .crumbs, .kb-nav, .search-modal')) return NodeFilter.FILTER_REJECT;
          re.lastIndex = 0;
          return re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (textNode) {
        var text = textNode.nodeValue;
        re.lastIndex = 0;
        var frag = document.createDocumentFragment();
        var last = 0, m;
        while ((m = re.exec(text))) {
          var pre = m[1] || '';
          var name = m[2];
          var start = m.index + pre.length;
          if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
          var span = document.createElement('span');
          span.className = 'skill-ref';
          var img = document.createElement('img');
          img.src = map[name];
          img.alt = '';
          span.appendChild(img);
          span.appendChild(document.createTextNode(name));
          frag.appendChild(span);
          last = start + name.length;
          re.lastIndex = last;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        if (frag.childNodes.length && textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
      });
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    injectGlossaryExtra();
    initLang();
    initPets();
    initMonsters();
    initDungeons();
    initSkills();
    initSheets();
    initActions();
    initSearch();
    initLightbox();
    buildIndex();
    initInlineSkillIcons();
    render();

    window.addEventListener('hashchange', render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();