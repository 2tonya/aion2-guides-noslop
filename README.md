# ⚔️ Aion 2 — PvE-гайды по классам

Компактные PvE-гайды по **Aion 2** для всех 8 классов: скиллы, стигмы, макросы, ротации, экипировка и **путь прокачки от новичка до топа** — в одном удобном сайте.

**[Открыть сайт →](https://2tonya.github.io/aion2-guides/)**

---

## Что внутри

- **8 классов** — Лучник, Ассасин, Чародей, Душелов, Храмовник, Гладиатор, Клирик, Чантер
- **«Путь: от новичка до топа»** — приоритеты P1→P4: настройки и макрос, брейкпоинты скиллов, стигмы, шмот, Дэванион/Arcana, эндгейм
- **Порядок прокачки** активных и пассивных скиллов с иконками
- **Скиллы и Specialty** — что брать, на каких уровнях и зачем
- **Макросы, стеки и ротации** — готовые схемы под каждый билд
- **Доски Дэванион**, экипировка и прогрессия там, где это есть в источнике
- Скриншоты, иконки скиллов и подсказки прямо в тексте

## Возможности сайта

| | |
|---|---|
| 📱 **Мобильная версия** | Тёмная тема, удобное чтение с телефона |
| ☰ **Меню классов** | Боковая панель выбора класса по кнопке **A2** в шапке |
| 🔍 **Поиск** | Поиск по словам сразу по всем гайдам (кнопка 🔍 или `Ctrl+K`) — с переходом к нужному разделу |
| 🧭 **Навигация по разделам** | Чипы-разделы в шапке с подсветкой текущего раздела при прокрутке |
| 🖼️ **Просмотр картинок** | Увеличение скриншотов и досок по тапу |

## Классы

| Класс | Билд / фокус | Гайд |
|---|---|---|
| Лучник (Ranger) | Deadshot, баффы и окна урона | [Открыть](https://2tonya.github.io/aion2-guides/#ranger) |
| Ассасин (Assassin) | Burst, позиция за спиной, стаки Insignia | [Открыть](https://2tonya.github.io/aion2-guides/#assassin) |
| Чародей (Sorcerer) | Заряженный Hellfire в подготовленном окне | [Открыть](https://2tonya.github.io/aion2-guides/#sorcerer) |
| Душелов (Spiritmaster) | Ротация духов и Elemental Fusion | [Открыть](https://2tonya.github.io/aion2-guides/#spiritmaster) |
| Храмовник (Templar) | Урон окнами Judgment, танкование | [Открыть](https://2tonya.github.io/aion2-guides/#templar) |
| Гладиатор (Gladiator) | Endgame: Overhead Slam, мана и криты | [Открыть](https://2tonya.github.io/aion2-guides/#gladiator) |
| Клирик (Cleric) | Condemnation-комбо и хил пати | [Открыть](https://2tonya.github.io/aion2-guides/#cleric) |
| Чантер (Chanter) | Мантры и спам Dark Crush по триггеру | [Открыть](https://2tonya.github.io/aion2-guides/#chanter) |

## Запуск локально

Сайт статический — серверная часть не нужна.

```bash
git clone https://github.com/2tonya/aion2-guides.git
cd aion2-guides
```

Откройте `index.html` в браузере или поднимите любой локальный сервер, например:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

После этого сайт будет доступен на `http://localhost:8080`.

## Структура проекта

```text
.
├── index.html        # Вся разметка и контент гайдов
├── assets/
│   ├── style.css     # Стили, тёмная тема, адаптив
│   └── app.js        # Навигация, поиск, scroll-spy, меню, лайтбокс
└── img/              # Иконки классов/скиллов, скриншоты, доски Дэванион
```

## Источники

Материалы основаны на гайдах [Mobalytics](https://mobalytics.gg/) для Aion 2:

- [Лучник — Ranger PvE](https://mobalytics.gg/gamebase/guides/aion-2-ranger-pve-build)
- [Ассасин — Burst PvE](https://mobalytics.gg/gamebase/guides/aion-2-assassin-burst-pve-build)
- [Чародей — Hellfire PvE](https://mobalytics.gg/gamebase/guides/aion-2-sorcerer-hellfire-pve-build)
- [Душелов — Elemental Fusion PvE](https://mobalytics.gg/gamebase/guides/aion-2-spiritmaster-elemental-fusion-pve-build)
- [Храмовник — Templar PvE](https://mobalytics.gg/gamebase/guides/aion-2-templar-pve-build)
- [Гладиатор — Endgame PvE](https://mobalytics.gg/gamebase/guides/aion-2-gladiator-endgame-build)
- [Клирик — Condemnation PvE](https://mobalytics.gg/gamebase/guides/aion-2-cleric-condemnation-pve-build)
- [Чантер — Dark Crush PvE](https://mobalytics.gg/gamebase/guides/aion-2-chanter-dark-crush-pve-build)

Авторы оригинальных гайдов указаны в каждом разделе на сайте.

> Сокращённый перевод и адаптация для личного использования. Права на исходные материалы и изображения принадлежат их авторам и Mobalytics.
