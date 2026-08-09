# AGENTS.md

## References
- Project Home (Notion): https://app.notion.com/p/mpoints-assemble-34ddc169a5ba8088bff0cc4575d4f0a8
- **PRD (Notion)**: https://www.notion.so/PRD-355dc169a5ba80449eb7e126b3a40ad4
- **Figma Design**: https://www.figma.com/design/DJD9NiijtkbSig1iqiincK/2026MetroHackathon?node-id=0-1
- **Figma Slides**: https://www.figma.com/slides/yrz5u0XR5Qv8QFkpIJ58Vs

### QR Code Asset
Use `src/img/qr-code-example.png` whenever a QR code is needed in the UI. Do not generate or source a different QR image.

### When to fetch Notion docs
If requirements, scope, or design intent are unclear — fetch the PRD before guessing.
Use the `mcp__claude_ai_Notion__notion-fetch` tool or `WebFetch` on the URL above.
Do this proactively rather than asking the user to re-explain what's already documented.

---

## Project docs (read these first)

| doc | what's in it |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | directory map, AppLayout route-meta flags, nav.js contract, 兌換/送禮 flow, unrouted teammate WIP |
| [docs/design-tokens.md](docs/design-tokens.md) | token pipeline, main.scss import order, spacer scale, `:root` custom properties |
| [docs/data-and-stores.md](docs/data-and-stores.md) | data-module shapes (`img` contract, colorKey), gifts store lifecycle |
| [docs/verification.md](docs/verification.md) | `npm run check` + `npm test` workflow |
| [docs/icons.md](docs/icons.md) | Phosphor + Iconify icon tutorial |

---

## Agent skills

### Issue tracker

Issues live in the **任務** database on the project's Notion home page — via the Notion MCP tools, not GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, used verbatim (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), stored in the 任務 `標籤` multi-select. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root (neither created yet). See `docs/agents/domain.md`.

---

## Project Context

Design tokens flow from Figma → SCSS primitives → Bootstrap overrides → components.
Icons: Phosphor via `@iconify/vue` — use `<Icon icon="ph:..." />`, import `{ Icon } from '@iconify/vue'` per SFC. Icon set package: `@iconify-json/ph`.

### Icon Conventions
- UI icons: always use `-light` weight — `ph:icon-name-light` (e.g. `ph:house-light`), `width="24" height="24"`.
- Sidebar / floating-nav icons come from `nav.js` `icon` field — also `-light`.
- Home action tiles use a **separate** `nav.js` `tileIcon` field (often `-duotone` or solid) — a deliberate, distinct look from the sidebar; falls back to `icon` when omitted. Don't collapse the two.
- Exemptions: ActionTile.vue (64px decorative bg), gift/GiftCard.vue (fill doodles), hero background icons (≥100px), QR display icons.

### Fonts
Use the **system font stack** (Bootstrap default). Do **not** load web fonts (e.g. Noto Sans TC)
— the Figma design specifies Noto Sans TC, but we render with system fonts on purpose, so
expect minor glyph/metric differences from the mockups. Keep `$font-family-sans-serif`
commented out in `_typography.scss`; tune sizes/weights via the existing typography tokens.

### Layout Padding
- Phone horizontal padding: `$px-phone` (16 px)
- Tablet tools / sidebar padding: `$px-tablet-tools` (10 px)
- Tablet main content padding: `$px-tablet-content` (24 px)

### UI Consistency Canon
Repeated concepts have **one** canonical implementation. Reach for it — don't re-roll markup/styles inline. `npm run lint:css` (stylelint) mechanically blocks raw hex, off-scale px, and `!important` in component styles.

| Concept | Use this — not an inline copy |
| --- | --- |
| 捷運點 point value | `<PointsAmount>` (`src/components/points/PointsAmount.vue`). Only icon is `metro-point.png`; only label is `捷運點`. Pick `tone` (`default`/`cost`/`credit`) + `size` — never hand-pick color/size. Never use `coin.png`, `ph:coin*`, or bare `P`. |
| Page content width | `.container-content` (720 px) for normal pages; `.container-form` (630 px) for form/checkout columns. Width-only (max-width + centering) — compose with `.px-default` for the gutter. Never hand-type `max-width`. Exempt: full-bleed editor/preview screens (`GiftSetupView`/`GiftPreviewView`/`GiftReceivedView`/`PurchaseSuccessView`). |
| Page horizontal gutter | `.px-default` (16→24 px). Don't hardcode `p-5`/`px-3` for page gutters. |
| Standalone point value | `<PointsAmount>`. Inline sentence mentions ("您目前有 X 捷運點") may stay as text — but the value+unit still reads `X 捷運點`, never `X 點`/`X P`. |
| Content / list / gift card | `ContentCard` (`src/components/cards/ContentCard.vue`) — variants `row`/`large`/`gift`/`row-horizontal`. |
| White info card | Bootstrap `.card rounded-4 shadow-sm`. Don't hardcode `border-radius: 16/24px` or bespoke shadows. |
| Rotated red badge | `<StampBadge>` (`src/components/common/StampBadge.vue`). |
| Bottom sheet | `<BottomSheet>` (`src/components/common/BottomSheet.vue`) — owns the overlay, `slide-up` transition, grab handle, close button and the phone-vs-tablet container. Don't hand-roll another `position: fixed` sheet. Exempt: `ProductView`'s 選擇數量 bar, which is an expanding sticky footer, not a sheet. |
| 捷運路線識別色 | `<MetroLineBadge>` (`src/components/common/MetroLineBadge.vue`) for the R/G/Y/BL/BR chips; the colors themselves live in `$metro-lines` (`_metro-lines.scss`) and `$card-colors` is derived from them. Never re-type `#018659` / `#0070bc` etc. |
| Brand blue | `$primary` / `text-primary` = `#0079A9`. `#007bbd` / `#1e70a4` are wrong. |
| Danger red | `$danger` / `text-danger` = `#C80000`. `#dc3545` / `#e64980` are wrong. |

---

## Working Rules

Bias: speed over perfection on UI scaffolding; caution on shared utilities and design tokens.

### Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
In a hackathon, time lost to wrong assumptions > time lost to one clarifying question.
Push back when a simpler approach exists.

### Simplicity First
Minimum code that solves the problem. No speculative abstractions.
Vue SFCs with `<script setup>` — don't introduce Options API unless there's a reason.
Bootstrap utility classes over custom CSS when Bootstrap already has it.

### Surgical Changes
Touch only what you must.
SCSS partial files (`_filename.scss`) are design-token sources — don't restructure them without a reason.
Don't alter `main.scss` import order; Bootstrap must come after our variable overrides.
Don't delete unreferenced files without asking — some are teammate WIP (see architecture.md).

### Read Before You Write
Before touching SCSS: check `_variables.scss` and `_primitives.scss` first. A token likely already exists.
Before adding a Vue component: check if an existing component or Bootstrap class solves it.

### Design Token Pipeline
See [docs/design-tokens.md](docs/design-tokens.md). Hard-code colors or spacing only as a last
resort; prefer SCSS variables or the `:root` custom properties. `_style-overrides.scss` is the
last layer — use it only to patch Bootstrap specifics. Spacers are custom: 1=2px, 2=4px, 3=8px,
4=12px, 5=16px, 6=20px, 7=24px, 8=32px. Don't assume Bootstrap's `rem`-based scale.

### Verification (no unit-test framework)
Verify with these tools, not by eyeballing ad-hoc screenshots — see [docs/verification.md](docs/verification.md):
- `npm run lint:css` — stylelint guardrail; fails on raw hex / off-scale `border-radius` / `!important`
  in component styles (enforces the UI Consistency Canon). Config: `stylelint.config.js`.
- `npm run check [-- /route …]` — loads each route, fails on any console error / failed request,
  writes phone+tablet screenshots to `screenshots/check/` (read them with the Read tool).
- `npm test` — Playwright smoke tests (assert visible text/roles, never class names).

Run all three after any change. "Done" is wrong if you skipped them.

### Fail Loud
Surface broken states; don't hide them behind fallback styling.
If something unexpectedly doesn't work, name it rather than silently working around it.

### Match Codebase Conventions
Vue: `<script setup>` Composition API, single-file components.
SCSS: underscore-prefixed partials, `@import` (not `@use`) to match existing style.
JS: plain ES modules, no TypeScript.
Commits: 繁體中文, imperative tone (e.g., `新增`, `修正`, `更新`).
