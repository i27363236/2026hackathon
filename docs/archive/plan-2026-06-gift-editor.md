# Implementation Plan — Gift cards, data layer & canvas editor

> Single source of truth for this work. Execute phases **in order**. Do not start a phase
> until the previous phase's **Definition of Done (DoD)** passes in the browser.

---

## Rules for the executor (read first)

1. **Stick to this plan.** If reality diverges (a file differs from what's described, a Figma
   value is missing, an API behaves differently), **stop and report** — do not silently improvise
   a different architecture.
2. **No automated tests exist.** "Done" means you ran `npm run dev` and observed correct behavior
   in the browser (per `AGENTS.md`). Compiling is not done.
3. **Pull Figma values live — never invent them.** Where the plan says `[FIGMA: node-id]`, call the
   Figma MCP (`get_variable_defs` / `get_screenshot` / `get_design_context`) on that node and use
   the real values. If the MCP is unavailable, stop and ask.
4. **Respect the design-token pipeline.** Do **not** modify `main.scss` import order, and do **not**
   restructure `_primitives.scss` / `_variables.scss`. New tokens go in new partials imported
   **before** Bootstrap.
5. **Do NOT build `ProductView` or `PurchaseCheckoutView`** — a teammate owns them. You only build
   the store actions they will call, plus a temporary entry button (Phase 4).
6. **Data modules are read-only** (`export function getX()`). The **Pinia store is the only mutable,
   persisted state.** Never copy the catalog into the store — reference products by `productId`.
7. **Carry state by id, not query strings.** The gift flow passes a gift/draft **id**; it must not
   stuff objects or dataURLs into the URL.
8. Commit messages in **Traditional Chinese**, imperative tone (`新增`, `修正`, `更新`).

### Dependencies to install
- Phase 0: `npm i pinia`
- Phase 2: `npm i node-vibrant`
- Phase 3: `npm i konva vue-konva`

### New directories
`src/data/`, `src/stores/`, `src/utils/`, `src/components/home/`, `src/components/editor/`, `docs/`

---

## Shared contracts (used across phases)

### The 6 card colors
Stable keys, fixed for the whole project: `'variant-1' … 'variant-6'`.
Every data item that drives a card carries `colorKey: 'variant-N'`. The hex values are **pulled from
Figma `2433-5925`** and live only in `_card-colors.scss`. Data never holds raw hex.

### Product (read-only, from catalog)
```js
{ id: 'cat-001', name: '檸檬塔', desc: '清新酸甜的檸檬味，搭配酥脆外皮',
  price: 400, sizeLabel: 'M', img: '', colorKey: 'variant-1' }
```

### Gift (mutable, in the Pinia store)
```js
{ id: 'gift-1718000000000', productId: 'cat-001',
  name: '檸檬塔', price: 400, img: '',          // snapshot of the product
  purchaseDate: '2026-06-04T10:00:00.000Z',     // set at purchaseDraft()
  expiredDate: '2026-08-03T10:00:00.000Z',      // purchaseDate + DEFAULT_VALID_DAYS
  message: '', signature: '',
  cardImage: '',                                 // PNG dataURL from the editor
  background: '',                                // chosen bg id
  bgColor: '',                                   // cached dominant color (Phase 2)
  recipient: '', sentAt: '',
  status: 'draft' }                              // 'draft' | 'sent' | 'received'
```
`expireDuration` is a **getter**, never a stored field.

---

## Phase 0 — Foundations & data layer

**1. `src/main.js`** — register Pinia.
- Where: the import block + the `createApp` chain (line 7).
- Add: `import { createApp } from 'vue'` stays; add `import { createPinia } from 'pinia'`; change the
  last line to `createApp(App).use(createPinia()).use(router).mount('#app')`.

**2. `src/data/events.js`** `(new)`
- Add: `export function getEvents()` returning the array currently inline at `HomeView.vue:39-44`,
  with `id` and `colorKey` added to each item.
- Item shape: `{ id: 'evt-1', title, tag, img, colorKey: 'variant-1' }`.

**3. `src/data/coupons.js`** `(new)` — rename `deals` → `coupons`.
- Add: `export function getCoupons()` returning the `deals` array from `HomeView.vue:46-51`, each
  item given `id` + `colorKey`.
- Item shape: `{ id: 'cpn-1', title, point: 50, sub, colorKey: 'variant-1' }`.

**4. `src/data/catalog.js`** `(new)`
- Add: `export function getShelves()` and `export function getProductById(id)`.
- `getShelves()` returns **exactly 3 shelves in this order**:
  `[{ key:'featured', title:'最新主打', products:[…] }, { key:'rare', title:'最稀有的禮物', products:[…] }, { key:'popular', title:'大家都在送', products:[…] }]`
- **Each shelf has exactly 10 products** (Product shape above). Seed real copy where given
  (`巧克力慕斯`/300, `拿鐵咖啡`/200, `熱帶水果沙拉`/40, `檸檬塔`/M$400, `摩卡咖啡`/M250,
  `巧克力熔岩蛋糕`/300, …); invent plausible items to reach 10 per shelf. `img: ''` for now.
- `getProductById(id)` searches all shelves, returns the product or `undefined`.

**5. `src/data/giftBackgrounds.js`** + **`src/data/stationPhotos.js`** `(new)`
- Add to each: `export const giftBackgrounds = []` / `export const stationPhotos = []` (empty
  placeholders; populated later). These exist so Phase 3 imports are stable.

**6. `src/assets/styles/_card-colors.scss`** `(new)` — the 6 colors. `[FIGMA: 2433-5925]`
- Pull the 6 subtitle hex from Figma, then add: 6 SCSS vars + a `$card-colors` map keyed
  `variant-1 … variant-6`, and a loop emitting `.card-subtitle--variant-N { color: <hex>; }`.

**7. `src/assets/styles/main.scss`** — wire the partial.
- Where: after `@import "typography";` (line 6), **before** `@import "bootstrap/scss/bootstrap";`.
- Add: `@import "card-colors";`. (Do not reorder anything else.)

**8. `src/stores/gifts.js`** `(new)` — store skeleton.
- Add: `export const useGiftsStore = defineStore('gifts', …)` with
  `state: () => ({ gifts: [], draftGift: null })`.
- Add a module constant `const DEFAULT_VALID_DAYS = 60`.

**9. `src/stores/gifts.js`** — gift factory.
- Add: a `createGift(product)` helper returning the Gift shape (above) with `status:'draft'`,
  `id: 'gift-' + Date.now()`, fields snapshotted from `product`, dates empty until purchase.

**10. `src/stores/gifts.js`** — getters.
- Add getter `expireDuration` (and any humanized expiry text) derived from `draftGift.expiredDate`
  vs `Date.now()`. Returns e.g. `'還剩 60 天'` / `'已過期'`. Must not write state.

**11. `src/stores/gifts.js`** — actions + persistence.
- Add action **stubs** (full bodies land in Phase 4, but signatures fixed now):
  - `startDraft(productId)` — look up via `getProductById`, set `draftGift = createGift(product)`.
  - `updateDraft(patch)` — `Object.assign(draftGift, patch)`.
  - `purchaseDraft()` — set `purchaseDate`, `expiredDate` (+`DEFAULT_VALID_DAYS`).
  - `attachCardImage(dataUrl)` — `draftGift.cardImage = dataUrl`.
  - `sendGift(recipient)` — push draft to `gifts[]`, set `status:'sent'`, `sentAt`, clear draft.
- Persistence: on store init, hydrate `gifts` from `localStorage` key `'metro:gifts'`; `$subscribe`
  to persist on change. Guard: skip persisting if a `cardImage` exceeds a size cap (~1.5MB).

**Definition of Done (Phase 0):**
- `npm i pinia` done; app boots with no console errors.
- `getShelves().length === 3`, order is `最新主打 → 最稀有的禮物 → 大家都在送`, each
  `shelf.products.length === 10`; `getProductById('<known id>')` returns the right object.
- `getEvents()` / `getCoupons()` return the migrated arrays with `id` + `colorKey`.
- `_card-colors.scss` is imported before Bootstrap; the 6 `.card-subtitle--variant-N` classes exist
  with real Figma hex.
- The store hydrates from empty localStorage without error; `useGiftsStore()` works in a component.
- HomeView still renders (it is rewired in Phase 1; here just confirm no regression from imports).

---

## Phase 1 — HomeView card rows

**1. Figma spec pull.** `[FIGMA: 2433-6128, 2433-5925, 2303-4987]`
- Record card dimensions, radius, the 6 subtitle colors, and the gift-row card layout. Use these
  exact values below; do not invent.

**2. `src/components/home/RowCard.vue`** `(new)` — events/coupons row item.
- `<script setup>`, props contract:
  `{ title: String, subtitle: String, tag: String, img: String, colorKey: String }`.
- **Fixed size** (from Figma) — the card size must NOT vary between items.
- Applies `:class="'card-subtitle--' + colorKey"` to the subtitle element.
- Fallback: if `colorKey` is falsy or unknown, render without the variant class (default color).

**3. `src/views/HomeView.vue`** — events row. Where: the `大家都參加` section (`:204-215`).
- Replace inner markup with a horizontal scrollable row of `RowCard`, fed by `getEvents()`.

**4. `src/views/HomeView.vue`** — coupons row. Where: the `這樣換最划算` section (`:217-231`).
- Replace the **Bootstrap grid** with a **single horizontal scrollable row** of `RowCard` fed by
  `getCoupons()`. (Removes the ragged-grid risk; size stays fixed.)

**5. `src/views/HomeView.vue`** — script. Where: `<script setup>` (`:1-52`).
- Delete the inline `joinedEvents` and `deals` arrays.
- Add: `import { getEvents } from '../data/events.js'`, `getCoupons` from `../data/coupons.js`,
  `getShelves` from `../data/catalog.js`.

**6. `src/components/home/GiftRowCard.vue`** `(new)` — gift row item. `[FIGMA: 2303-4987]`
- Props from a catalog product: `{ id, name, price, img, colorKey }`. Match the Figma node layout.
- Root is a `RouterLink` to `{ name: 'use-product', query: { id } }`.

**7. `src/views/HomeView.vue`** — new gift row.
- Where: add a `<section>` after the coupons row.
- A horizontal scrollable row of `GiftRowCard`, fed by one shelf from `getShelves()` (use the
  `最新主打` / `featured` shelf).

**8. `src/views/HomeView.vue`** — shared row style. Where: `<style scoped>`.
- Add a `.card-row` rule (flex, `overflow-x:auto`, scroll-snap, edge padding) reused by all three
  rows; hide the scrollbar matching the existing `.tiles-row` pattern (`:317-320`).

**9. `src/components/home/*`** — items use `flex-shrink:0`; confirm touch scrolling works.

**10. Routing.** `GiftRowCard` links into `use-product` (stub route already at
`router/index.js:53`, owned by teammate). Events/coupons items need no link unless Figma shows one.

**11. Responsive check** — headless Chrome at mobile + tablet widths (mind the 500px min-viewport
gotcha). All three rows scroll; all 6 `variant-N` colors render.

**Definition of Done (Phase 1):**
- HomeView shows three horizontal scrollable rows: events, coupons, gift cards.
- All cards are equal-sized within a row (no size variance); no grid gaps.
- The 6 subtitle colors render correctly and come from `_card-colors.scss`.
- A `GiftRowCard` click navigates to `use-product?id=<id>` (lands on the stub view).
- Rows match their Figma nodes in a screenshot comparison at mobile and tablet widths.
- No console errors; no inline `joinedEvents`/`deals` left in HomeView.

---

## Phase 2 — Gift back faces + image-driven color

**1. Figma spec pull.** `[FIGMA: 2415-2043, 2415-2352]` — record both back-face layouts.

**2. `src/utils/imageColor.js`** `(new)` — color extraction.
- Add: `export async function dominantColor(src) → Promise<string /* hex */>` wrapping
  `node-vibrant`. On failure, resolve to a neutral fallback (e.g. `'#888888'`).

**3. `src/utils/imageColor.js`** — derived styling.
- Add: `export function toGradient(hex) → string` (a CSS gradient mixing `hex` toward white for a
  lighter card background).
- Add: `export function readableText(hex) → '#000' | '#fff'` via WCAG contrast.

**4. `src/components/gift/ProductFace.vue`** `(new)` — product-info back face. `[FIGMA: 2415-2043]`
- Props: `{ name, price, img, expiredDate }` (or a single `gift` object — pick one and keep it
  consistent). Background uses `toGradient(dominantColor(img))`; text uses `readableText(...)`.

**5. `src/components/gift/QrFace.vue`** `(new)` — QR back face. `[FIGMA: 2415-2352]`
- White QR area; QR is a **static placeholder `<img>`** for now.

**6. `src/components/gift/ProductFace.vue`** — async color.
- On mount / when `img` changes: call `dominantColor`, hold the fallback while loading, then apply
  gradient + text color. Cache the result back to the store (entry 7).

**7. `src/stores/gifts.js`** — cache color.
- In `createGift` / `updateDraft`: store the extracted color as `bgColor` so it isn't recomputed.

**8. `src/components/gift/CouponCard.vue`** (existing `:1-53`) — reconcile.
- Decide: keep `CouponCard` as the coupon **front**, and use `ProductFace`/`QrFace` as the gift
  **back** states. Ensure exactly one coherent front component; do not duplicate.

**9. `src/components/gift/FlipCard.vue`** (existing) — flip integrity.
- Ensure front and back render at **identical dimensions** when the new faces are slotted, or the
  flip animation breaks/clips.

**10. `src/views/use/GiftPreviewView.vue`** (`:24-31`) — data wiring.
- Replace the hard-coded `CouponCard` props (`誠品生活｜100元優惠券`, `:value="100"`, etc.) with data
  from the store's `draftGift`.

**11. `ProductFace.vue`** — edge cases: missing image, near-white / near-black image, extraction
failure → always falls back to a legible color pairing.

**Definition of Done (Phase 2):**
- Both back faces match their Figma nodes.
- Background gradient is derived from the product image; text auto-picks black/white and stays
  legible across several test images (including a very light and a very dark one).
- `FlipCard` flips cleanly with the new faces (front/back same size).
- `GiftPreviewView` reads from `draftGift`, not hard-coded strings.
- No console errors; extraction failures degrade gracefully.

---

## Phase 3 — Canvas editor (highest risk)

**1. Install + register.** `npm i konva vue-konva`; in `src/main.js` add `import VueKonva from
'vue-konva'` and `.use(VueKonva)` in the chain.

**2. `src/views/use/GiftSetupView.vue`** (existing textarea editor `:1-57`) — replace the body.
- Mount a Konva `Stage` + `Layer` sized to the card aspect (match GiftCard `3/4`). This becomes the
  editing surface. Keep the existing footer pattern (上一步 / 完成).

**3. Handwrite tool** — in `GiftSetupView.vue`: freehand pen via Konva `Line` on pointer move, with
color + width controls.

**4. Sticker tool** — tap-to-place `Konva.Image` from a sticker set; selectable via a `Transformer`
(drag / scale / rotate); delete support.

**5. Photo-from-set** — insert images from `src/data/stationPhotos.js` (empty now; populated later).

**6. `src/components/editor/StampBuilder.vue`** `(new)` — custom stamp.
- Inputs: station name (text) + icon pick (`@iconify/vue`) + shape pick. Composes a `Konva.Group`
  (shape + icon + label) and returns/places it on the stage.

**7. Background selector** — swap the stage background from `src/data/giftBackgrounds.js` (empty now).

**8. Editing basics** — selection Transformer, delete-selected, deselect-on-empty-tap, simple undo.

**9. Mobile touch** — drag + pinch work on touch; verify at the 500px min-viewport.

**10. Export** — the 完成 button calls `stage.toDataURL()` → `giftsStore.attachCardImage(dataUrl)` →
route to `use-gift-preview`.

**11. `src/router/index.js`** (`:54`) — lazy-load the editor route:
`component: () => import('../views/use/GiftSetupView.vue')` so Konva does not bloat Home.

**Definition of Done (Phase 3):**
- On the editor page you can: handwrite, place a sticker, add a photo from the set, build a custom
  stamp, and switch the background.
- Elements are selectable, movable, and deletable on both mouse and touch (checked at 500px).
- 完成 exports a correct PNG (fonts/colors intact) and stores it via `attachCardImage`.
- The editor route is lazy-loaded; Home bundle is not inflated by Konva.
- No console errors.

---

## Phase 4 — Store contract + send flow (no Product/Checkout views)

> Reminder: **do not build `ProductView` / `PurchaseCheckoutView`** — teammate's work. You build the
> store actions they call + a temporary entry button so you can test editor → send now.

**1. `src/stores/gifts.js`** — `startDraft(productId)` full body.
- `const p = getProductById(productId); this.draftGift = createGift(p)`. (Called by ProductView.)
- Signature: `startDraft(productId: string) → void`.

**2. `src/stores/gifts.js`** — `purchaseDraft()` full body.
- Set `draftGift.purchaseDate = new Date().toISOString()`; `expiredDate = purchaseDate +
  DEFAULT_VALID_DAYS`. (Called by Checkout.) Signature: `purchaseDraft() → void`.

**3. `docs/gift-store-contract.md`** `(new)` — teammate handoff.
- Document: store id, state shape, every action signature, and the `draftGift` lifecycle
  (`startDraft → purchaseDraft → [editor] → sendGift`). One page, no implementation detail.

**4. `src/App.vue`** — temporary entry button. Where: the empty `<template>` (`:5`).
- Add a fixed-position floating button wrapped in `<!-- TEMP: remove before ship -->`. On click:
  `startDraft('<a real catalog id>')`, `purchaseDraft()`, then
  `router.push({ name: 'use-gift-setup' })`.

**5. `src/App.vue`** — `<script setup>` (`:1-2`): import `useGiftsStore` and `useRouter` for the
temp button only.

**6. `src/views/use/GiftSetupView.vue`** — on mount read `draftGift`; on finish write `cardImage`
(already via `attachCardImage`) and `background` via `updateDraft({ background })`.

**7. `src/views/use/GiftPreviewView.vue`** (`:9-17`) — replace the `route.query` reads (`msg`,
`sign`) with `draftGift` from the store: live coupon front + saved `cardImage` back.

**8. `src/stores/gifts.js`** — `sendGift(recipient)` full body.
- Push `draftGift` into `gifts[]`, set `status:'sent'`, `sentAt`, then `draftGift = null`; persist.
- Signature: `sendGift(recipient: string) → string /* gift id */`.

**9. `src/views/use/GiftReceivedView.vue`** (existing) — load the gift **by id** from the store and
render the saved `cardImage`.

**10. `src/router/index.js`** (`:54-56`) + the use views — remove old query-string passing
(`msg`/`sign`); carry **id only**; update titles/meta; verify back-nav.

**11. `src/views/use/GiftSetupView.vue`** — delete the leftover `message`/`signature`/textarea
logic replaced by the canvas editor + store.

**Definition of Done (Phase 4):**
- The temp button seeds a purchased draft and opens the editor.
- Full sub-flow works: editor → preview → send.
- After send, **refresh the Received page** → the gift still renders from localStorage.
- `draftGift` carries by id only; no `msg`/`sign` query strings remain.
- `docs/gift-store-contract.md` exists and matches the actual action signatures.
- No console errors. (Home → Product → Checkout path is validated later, once teammate's views land.)

---

## Phase 5 — Polish & build (cleanup checklist)

- **`src/data/*.js`** image fields: no hard-coded `/src/...` paths — use
  `new URL('./path.png', import.meta.url).href` or `import`.
- **`src/stores/gifts.js`**: enforce the `cardImage` localStorage size cap; confirm undefined
  `colorKey` falls back cleanly in `RowCard` / `GiftRowCard`.
- **`src/App.vue`**: remove the temporary floating button once the teammate's flow is connected.
- **Final eval:** `npm run build` succeeds, and the built app (`npm run preview`) still completes a
  full send → received → refresh cycle.
