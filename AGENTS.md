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

### Directory map (short)
```
src/components/   AppLayout shell + per-page section components
  home/ checkout/ profile/ editor/ cards/ gift/   (grouped by domain)
src/views/        route targets (home / points / coupons / use / profile)
src/data/         pure data modules            src/stores/gifts.js  purchase/gift flow
src/nav.js        sidebar + home-tile source   src/router/index.js  routes + meta flags
src/assets/styles SCSS token pipeline          composables/         useUndoHistory
scripts/check.mjs route health CLI             tests/smoke.spec.js  smoke tests
docs/             architecture / tokens / data / verification / icons
```

---

## Project Context

Vue 3 + Vite + Bootstrap 5 + SCSS hackathon project. No TypeScript. Hash routing.
Design tokens flow from Figma → SCSS primitives → Bootstrap overrides → components.
Commit messages are in Traditional Chinese (繁體中文).
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
Verify with the two tools, not by eyeballing ad-hoc screenshots — see [docs/verification.md](docs/verification.md):
- `npm run check [-- /route …]` — loads each route, fails on any console error / failed request,
  writes phone+tablet screenshots to `screenshots/check/` (read them with the Read tool).
- `npm test` — Playwright smoke tests (assert visible text/roles, never class names).

Run both after any change. "Done" is wrong if you skipped them.

### Fail Loud
Surface broken states; don't hide them behind fallback styling.
If something unexpectedly doesn't work, name it rather than silently working around it.

### Match Codebase Conventions
Vue: `<script setup>` Composition API, single-file components.
SCSS: underscore-prefixed partials, `@import` (not `@use`) to match existing style.
JS: plain ES modules, no TypeScript.
Commits: 繁體中文, imperative tone (e.g., `新增`, `修正`, `更新`).
