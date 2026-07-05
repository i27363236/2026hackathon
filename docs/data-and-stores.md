# 資料模組與 Store

## 資料模組(`src/data/`)

純資料 + getter 函式,無狀態、無副作用。

| 模組                  | 匯出 / 內容                                                        |
| --------------------- | ----------------------------------------------------------------- |
| `catalog.js`          | `getShelves()` / `getProductById(id)`;商品含 `purchaseType?`      |
| `coupons.js`          | `getCoupons()`;優惠券兌換品                                       |
| `events.js`           | `getEvents()`;累點活動卡                                          |
| `recommendations.js`  | `getRecommendations()`;首頁智慧推薦                              |
| `profile.js`          | `getProfile()` / `getAchievements()` / `getSentGifts()`           |
| `stationPhotos.js`    | `stationPhotos`;捷運回憶照片                                     |
| `giftEditorPresets.js`| `STICKERS` / `BG_PRESETS` / `TOOLS`;編輯器預設                    |
| `stampIcons.js`       | 印章可選圖示登錄表                                                |

### `img` 欄位契約

- `catalog` / `events` / `coupons` 的 `img` 是 **CSS background 簡寫**,直接餵給
  `:style="{ background: x.img }"`,必須是 `center/cover url(...)` 形式(**不是**裸 URL)。
- `stationPhotos` 的 `src` 是**裸圖片 URL**(給 `<img :src>` 與 Konva Image 載入器,不加 `url(...)`)。

### `colorKey` 語意

資料項用 `colorKey: 'variant-1'…'variant-6'` 指定 MRT 卡片配色;`ContentCard` 映射成
副標(row/large)或價格(gift)的 `.card-subtitle--N` 類別。見 design-tokens.md。

---

## 兩個同名但不同用途的 gifts

- **`src/data/gifts.js`** — mock store(Pinia id `'gifts-mock'`),展示 / 假資料用。
- **`src/stores/gifts.js`** — 購買 / 送禮流程的**真** store(Pinia id `'gifts'`)。

兩者不可再撞名,務必看清匯入路徑。

---

## Gifts store 契約(`src/stores/gifts.js`)

`useGiftsStore` 是可變、持久化禮物狀態的單一來源。ProductView 與 PurchaseCheckoutView
透過下列 action 驅動它 — 無需讀內部實作,呼叫 action 即可。

```js
import { useGiftsStore } from '@/stores/gifts.js'
const gifts = useGiftsStore()
```

### State

| 欄位        | 型別           | 說明                                                |
| ----------- | -------------- | --------------------------------------------------- |
| `gifts`     | `Gift[]`       | 已送出禮物,持久化到 `localStorage`(鍵 `metro:gifts`)|
| `draftGift` | `Gift \| null` | 進行中的草稿(商品 → 結帳 → 編輯器 → 送出)          |

### Gift 形狀

```js
{
  id, productId,          // productId 連回 catalog(src/data/catalog.js)
  name, price, img,       // 所選商品快照
  purchaseDate,           // ISO,purchaseDraft() 設定
  expiredDate,            // ISO,purchaseDate + 60 天
  message, signature,     // 選填個人化
  cardImage,              // 編輯器輸出的 PNG dataURL
  background, bgColor,    // 序列化的背景選擇 + 快取主色
  recipient, sentAt,      // sendGift() 設定
  status,                 // 'draft' | 'purchased' | 'sent'
}
```

### 生命週期

```
ProductView            gifts.startDraft(productId)          // status: draft
PurchaseCheckoutView   gifts.purchaseDraft()                // status: purchased,蓋章日期
GiftSetupView(編輯器)  gifts.ensureDraft()
                       gifts.attachCardImage(png)
                       gifts.updateDraft({ background })
GiftPreviewView        const id = gifts.sendGift(recipient) // status: sent → received?id=…
GiftReceivedView       gifts.getGiftById(id)
```

### 主要 action / getter

| 名稱                       | 效果                                                     |
| -------------------------- | -------------------------------------------------------- |
| `startDraft(productId)`    | 查 catalog、設 `draftGift`(status `draft`)             |
| `ensureDraft()`            | 若無草稿則建一個(編輯器可能未經商品頁直接進入)         |
| `updateDraft(patch)`       | 淺合併 `patch` 進 `draftGift`                            |
| `purchaseDraft()`          | 蓋 `purchaseDate` + `expiredDate`,status → `purchased`  |
| `attachCardImage(dataUrl)` | 設 `draftGift.cardImage`                                 |
| `sendGift(recipient)`      | 推入 `gifts[]`,status → `sent`,回傳 gift id            |
| `getGiftById(id)`          | 依 id 查已送出禮物                                       |
| `expireDuration`(getter)   | 草稿到期倒數的人性化字串(如「還剩 2 個月」)            |

### localStorage 影像護欄

持久化前會略過大於 `MAX_IMAGE_BYTES`(1.5MB)的 `cardImage`,避免撐爆 localStorage 配額。
