# Aion 2 — PvE-гайды по классам

Компактные мобильные PvE-гайды по **Aion 2** для всех 8 классов в одном месте. На русском языке, названия скиллов сохранены на английском.

**Сайт:** https://2tonya.github.io/aion2-guides/

## Классы

- **Лучник (Ranger)** — DPS
- **Ассасин (Assassin)** — DPS
- **Чародей (Sorcerer)** — DPS
- **Заклинатель (Spiritmaster)** — DPS
- **Страж (Templar)** — Танк
- **Гладиатор (Gladiator)** — DPS
- **Клирик (Cleric)** — Хил
- **Чантер (Chanter)** — Саппорт

## Что внутри гайдов

- **Путь: от новичка до топа** — приоритеты по этапам (P1–P4): что качать и собирать в первую очередь.
- **Порядок прокачки скиллов и пассивок** (приоритеты) + **Specialty/стигмы**.
- **Макросы и ротации**, экипировка/Arcana (по слотам, с опорой на доступные данные источников).
- **Доски Дэваниона**, частые ошибки и прочие заметки по классу.
- Скриншоты, иконки скиллов и авторство/источники в каждом гайде.

## Возможности сайта

- **Одностраничный интерфейс** с переключением классов и разделов (чипы), подсветка активного раздела при прокрутке.
- **Меню A2**: выбор класса (с меткой роли), выбор темы, переход в глоссарий.
- **Темы**: Системная, Тёмная, Светлая, Тыквенная, Голубая.
- **Поиск** по гайдам и глоссарию (по словам) с переходом к нужному разделу/термину и подсветкой совпадений.
- **Глоссарий** (Системы, Бой, Характеристики) — доступен через меню A2; термины в гайдах кликабельны и ведут в глоссарий, с кнопкой возврата в место перехода и подсветкой термина.
- **PWA**: установка и базовая офлайн-работа (кэширование ядра и ассетов).
- Удобно на мобильных устройствах.

## Локальный запуск

Сайт статический — можно открыть `index.html` напрямую, но для корректной работы рекомендуется локальный сервер:

```bash
git clone https://github.com/2tonya/aion2-guides.git
cd aion2-guides
python -m http.server 8080
# или
npx serve .
```

После запуска открыть http://localhost:8080

## Структура репозитория

```text
.
├─ index.html            # страница, контент гайдов и глоссария
├─ assets/
│  ├─ style.css          # стили и темы
│  └─ app.js             # логика UI, навигация, поиск, глоссарий, темы, PWA-регистрация
├─ img/                  # иконки классов/скиллов, скриншоты, доски, PWA-иконки
├─ manifest.webmanifest  # PWA-манифест
├─ sw.js                 # service worker
└─ README.md
```

## Источники

Материалы основаны на гайдах [Mobalytics](https://mobalytics.gg/) для Aion 2:

- [Лучник — Ranger PvE](https://mobalytics.gg/gamebase/guides/aion-2-ranger-pve-build)
- [Ассасин — Burst PvE](https://mobalytics.gg/gamebase/guides/aion-2-assassin-burst-pve-build)
- [Чародей — Hellfire PvE](https://mobalytics.gg/gamebase/guides/aion-2-sorcerer-hellfire-pve-build)
- [Заклинатель — Elemental Fusion PvE](https://mobalytics.gg/gamebase/guides/aion-2-spiritmaster-elemental-fusion-pve-build)
- [Страж — Templar PvE](https://mobalytics.gg/gamebase/guides/aion-2-templar-pve-build)
- [Гладиатор — Endgame PvE](https://mobalytics.gg/gamebase/guides/aion-2-gladiator-endgame-build)
- [Клирик — Condemnation PvE](https://mobalytics.gg/gamebase/guides/aion-2-cleric-condemnation-pve-build)
- [Чантер — Dark Crush PvE](https://mobalytics.gg/gamebase/guides/aion-2-chanter-dark-crush-pve-build)

Гайды адаптированы и структурированы для удобного чтения на сайте. Конкретные числа, билды и рекомендации сверяйте с актуальными источниками (обновления игры могут менять баланс).

## Примечание

Неофициальный фан-проект. Все названия, изображения и материалы Aion 2 принадлежат их правообладателям; материалы Mobalytics — их авторам.
