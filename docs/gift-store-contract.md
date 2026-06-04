# Gift store contract

The Pinia store `useGiftsStore` (`src/stores/gifts.js`) is the single source of mutable,
persisted gift state. **ProductView** and **PurchaseCheckoutView** drive it through the actions
below — you do not need to read the store internals, just call these.

```js
import { useGiftsStore } from '@/stores/gifts.js'
const gifts = useGiftsStore()
```

## State

| field       | type          | notes                                            |
| ----------- | ------------- | ------------------------------------------------ |
| `gifts`     | `Gift[]`      | sent gifts, persisted to `localStorage`          |
| `draftGift` | `Gift \| null`| the in-progress gift (product → checkout → editor → send) |

## Gift shape

```js
{
  id, productId,          // productId links back to catalog (src/data/catalog.js)
  name, price, img,       // snapshot of the chosen product
  purchaseDate,           // ISO string, set by purchaseDraft()
  expiredDate,            // ISO string, purchaseDate + 60 days
  message, signature,     // optional personalization
  cardImage,              // PNG dataURL from the editor
  background,             // serialized editor background choice
  bgColor,                // cached dominant color
  recipient, sentAt,      // set by sendGift()
  status,                 // 'draft' | 'purchased' | 'sent'
}
```

## Actions

| action                     | who calls it          | effect                                                        |
| -------------------------- | --------------------- | ------------------------------------------------------------- |
| `startDraft(productId)`    | **ProductView**       | look up the catalog product, set `draftGift` (status `draft`) |
| `updateDraft(patch)`       | any                   | shallow-merge `patch` into `draftGift`                        |
| `purchaseDraft()`          | **PurchaseCheckoutView** | stamp `purchaseDate` + `expiredDate`, status → `purchased`  |
| `attachCardImage(dataUrl)` | editor                | set `draftGift.cardImage`                                     |
| `sendGift(recipient)`      | preview               | push draft into `gifts[]`, status → `sent`, returns gift id   |
| `getGiftById(id)`          | received              | look up a sent gift by id                                     |

## Getters

| getter           | returns                                              |
| ---------------- | --------------------------------------------------- |
| `expireDuration` | humanized time-to-expiry of `draftGift` (e.g. `還剩 2 個月`) |

## Typical flow

```
ProductView         gifts.startDraft(productId)
PurchaseCheckoutView gifts.purchaseDraft()
GiftSetupView (editor) gifts.attachCardImage(png); gifts.updateDraft({ background })
GiftPreviewView      const id = gifts.sendGift(recipient); router → received?id=…
GiftReceivedView     gifts.getGiftById(id)
```

> ProductView/Checkout only need `startDraft` + `purchaseDraft`. Everything downstream is wired.
