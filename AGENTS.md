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


## Project Context

Vue 3 + Vite + Bootstrap 5 + SCSS hackathon project. No TypeScript, no test suite.
Design tokens flow from Figma → SCSS primitives → Bootstrap overrides → components.
Commit messages are in Traditional Chinese (繁體中文).
Icons: Phosphor via `@iconify/vue` — use `<Icon icon="ph:..." />`, import `{ Icon } from '@iconify/vue'` per SFC. Icon set package: `@iconify-json/ph`.

### Icon Conventions
- UI icons: always use `-light` weight variant — `ph:icon-name-light` (e.g. `ph:house-light`)
- Default size: `width="24" height="24"` on every `<Icon>` for UI icons
- Navigation icons (nav.js / AppSidebar): use `-duotone` suffix — separate convention, do not change
- Exemptions: ActionTile.vue (64px decorative bg), GiftCard.vue (fill doodles), hero background icons (≥100px), QR display icons

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

### Read Before You Write
Before touching SCSS: check `_variables.scss` and `_primitives.scss` first. A token likely already exists.
Before adding a Vue component: check if an existing component or Bootstrap class solves it.

### Design Token Pipeline
Token hierarchy: `_primitives.scss` → `_variables.scss` / `_variables-dark.scss` → Bootstrap → `_style-overrides.scss`.
Hard-code colors or spacing only as a last resort; prefer SCSS variables.
`_style-overrides.scss` is the last layer — use it only to patch Bootstrap specifics.
Spacers are custom (not Bootstrap defaults): 1=2px, 2=4px, 3=8px, 4=12px, 5=16px, 6=20px, 7=24px, 8=32px. Don't assume Bootstrap's `rem`-based scale.

### No Test Suite
There are no automated tests. Verify features by running `npm run dev` and checking in-browser.
"Completed" means you observed the correct behavior in the browser, not that the code compiles.

### Fail Loud
"Done" is wrong if you skipped a browser check.
Surface broken states; don't hide them behind fallback styling.
If something unexpectedly doesn't work, name it rather than silently working around it.

### Match Codebase Conventions
Vue: `<script setup>` Composition API, single-file components.
SCSS: underscore-prefixed partials, `@import` (not `@use`) to match existing style.
JS: plain ES modules, no TypeScript.
Commits: 繁體中文, imperative tone (e.g., `新增`, `修正`, `更新`).
