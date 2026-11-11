# Aion 2 Guidebook — Spec (in-app detail views & data)

Living spec for the post–data-wave site rework: local detail pages/routes, data schema, UI blocks, and i18n rules. Source prototype reference: Figma Make export `Aion 2 Guidebook Details.zip` (React/Tailwind, routes `#catalog` / `#monster|dungeon|item/<id>`, scroll restore, skeleton/empty states, RU/EN, secondary external source).

**Status:** data collection in waves first; implement after sufficient local detail data exists.

## Goals
- Clicking a catalog entry opens a **local** detail view (no mandatory external redirect). External source (e.g. wikily) remains an optional secondary action.
- Reuse existing SPA, design system, and data stores (`assets/wikily-data.js`, `assets/pets-data.js`, `assets/app.js`).
- Preserve current functionality: section/catalog nav, search, favorites, glossary jump/return, dark editorial theme.

## Routing & navigation
- Detail routes (hash): `#monster/<id>`, `#dungeon/<id>`, `#pet/<id>` (and later `#item/<id>`, `#quest/<id>`, `#title/<id>`, `#skill/<id>` or `#class/<id>` as needed). Aliases allowed (e.g. `#bestiary` → `#monsters` already exists).
- Catalog routes unchanged: `#monsters`, `#dungeons`, `#pets`, `#skills`, `#classes`, `#items`, `#world`, `#glossary`, favorites/guides as today.
- Behavior:
  - Open detail from catalog card/list; **Back** returns to originating catalog.
  - **Restore scroll position and active filters/sort/search** on return to catalog.
  - Mobile: detail as full-screen view or sheet with explicit Back/Close; keep existing tabbar/sheets behavior consistent.
  - Optional secondary button/link: “Open source” (external, `target="_blank" rel="noopener"`), not the primary path.
- States: loading/skeleton (if async later), missing entity/not-found, per-field empty state (“no data” / hidden block when absent).

## Data model (local)
Entities keyed by stable `id` (slug). Extend incrementally during collection waves; unknown/missing fields omitted or empty. Keep existing list fields; add detail fields as available.

### Common (all entities)
| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | yes | stable slug, unique per type |
| `name` | string | yes | display name (original) |
| `nameEn` | string | no | optional EN display name (fallback to `name`) |
| `img` | string | no | image URL/path |
| `url` | string | no | external source URL (for optional “Open source”) |
| `desc` / `descEn` | string | no | short/long description |

### Monster (`#monster/<id>`, `AION2_WIKILY.monsters`)
Current list fields: `id, name, lvl, rank, type, img, url, loc`.
Detail additions (as collected): `type` (creature type), `loc`/`region` (spawn region/zone), `behavior`, `spawns[]` (locations/points), `drops[]` ({item/id, name, qty?, chance?}), `relations[]` (links to quests/dungeons/items/regions).

### Dungeon (`#dungeon/<id>`, `AION2_WIKILY.dungeons`)
Current: `id, name, cat, lvl, players, img, url`.
Detail additions: `category`, `entryLevel`, `partySize`, `modes[]`, `bosses[]`, `rewards[]`, `desc`.

### Pet (`#pet/<id>`, `AION2_PETS`)
Current: rich catalog (name, вид/type, rank, image, source, etc.). Add detail-only fields if needed: `desc`, `skills/abilities`, `obtain`.

### Item / universal template (`#item/<id>` etc.)
For items/quests/titles/emotes/world objects: `kind`, `name`, `img`, `facts[]` (key/value chips), `description`, `objectives[]` (quests), `sources[]`/`rewards[]`, `drops[]`, `relations[]`.

### Skills & Classes
- `AION2_WIKILY.skills` / `skillsCats` / `classesInfo`: keep IDs and skill names/content as-is. Detail views (if added) must **not** translate skill names/IDs/content.

## UI blocks (per detail view)
- **Header/Hero:** image/portrait, name, primary tags/chips (level, rank/type/category, kind-specific facts like region/party size).
- **Main:** description/behavior (if any), locations/spawns/modes/objectives.
- **Side/secondary:** drops/rewards/loot table or list (item, qty, chance when known), related links/entities.
- **Actions:** Back to catalog (primary nav), optional “Open source”.
- **Empty/missing data:** hide empty sections or show neutral “no data” label; never fabricate.
- Responsive: 2-column on desktop where fits, stacked on mobile; follow existing left-rail/catalog patterns.

## i18n rules
- **Translate:** UI chrome, navigation, labels, buttons/aria, section headings, guide prose, glossary, catalog labels/text and data labels where applicable.
- **Do not translate:** skill names, skill IDs, skill descriptions/content, and other game-identifier strings marked as skill content (e.g. within `.skill`, `#view-skills`, `.skill-ref`, or explicit no-swap markers).
- **Mechanism:** current `I18N`/`t()`, `data-i18n*`, `data-ru`/`data-en`, `data-*-attr` markers, `localStorage aion2:lang`, `applyLang()` re-renders dynamic views (skipping skill areas). Extend with `nameEn`/`descEn`/label maps (`LMAP`/`l()` style) and fallback to original when EN missing.
- `documentElement.lang` / `body.dataset.lang` reflect active language.

## Design constraints (must keep)
- Dark editorial: near-black (`#0a0a0a`/`#0f0f0f`), hairline 1px borders, gold accent (`#c8a45d`), squared corners, no gradients/rounded “generic” cards, high contrast, ample spacing.
- Functional external URLs/images preserved; no non-guide source-attribution text in UI (character-guide credits Mobalytics/Ulvier remain).

## Implementation notes (when building)
- Render details from local data stores; resolve entity by `id` from route.
- Keep filters/search/sort in state and restore on back (hash + in-memory/session state).
- Add `?v=` bumps and SW cache version on deploys; `node --check` assets after JS data merges.
- Dedup by `id` on every data merge wave.
