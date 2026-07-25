import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getProductById } from '@/data/catalog.js'

const STORAGE_KEY = 'metro:gifts'
const DEFAULT_VALID_DAYS = 60
// Skip persisting a card image larger than this to avoid blowing the localStorage quota.
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

function loadGifts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Factory for a gift in 'draft' state, snapshotting the chosen catalog product.
function createGift(product) {
  return {
    id: 'gift-' + Date.now(),
    productId: product?.id ?? '',
    name: product?.name ?? '',
    merchant: product?.merchant ?? '',
    price: product?.price ?? 0,
    img: product?.img ?? '',
    purchaseType: product?.purchaseType ?? 'points',
    // 效期天數隨商品而異(catalog.js 的 validDays),購買時才換算成 expiredDate。
    validDays: product?.validDays ?? DEFAULT_VALID_DAYS,
    qty: 1,
    isGift: true,
    purchaseDate: '',
    expiredDate: '',
    message: '',
    signature: '',
    cardImage: '',
    background: '',
    bgColor: '',
    recipient: '',
    sentAt: '',
    status: 'draft', // 'draft' | 'purchased' | 'sent' | 'redeemed'
    redeemedAt: '',
    reminderEnabled: false,
  }
}

export const useGiftsStore = defineStore('gifts', () => {
  const gifts = ref(loadGifts())
  const draftGift = ref(null)

  // Derived (never stored): line total of the current draft (price × quantity).
  const draftTotal = computed(() => {
    const g = draftGift.value
    return g ? (g.price || 0) * (g.qty || 1) : 0
  })

  // Derived (never stored): humanized time-to-expiry of the current draft.
  const expireDuration = computed(() => {
    const d = draftGift.value?.expiredDate
    if (!d) return ''
    const ms = new Date(d).getTime() - Date.now()
    if (ms <= 0) return '已過期'
    const days = Math.ceil(ms / 86400000)
    if (days >= 30) return `還剩 ${Math.floor(days / 30)} 個月`
    return `還剩 ${days} 天`
  })

  // Called by ProductView (teammate): start a draft from a catalog product.
  function startDraft(productId) {
    const product = getProductById(productId)
    draftGift.value = createGift(product)
  }

  // Ensure a draft exists. Editor entry points (e.g. the 送禮 nav link) may skip
  // startDraft(); without this the card image would be silently dropped.
  function ensureDraft() {
    if (!draftGift.value) draftGift.value = createGift(null)
    return draftGift.value
  }

  function updateDraft(patch) {
    if (draftGift.value) Object.assign(draftGift.value, patch)
  }

  // Called by PurchaseCheckoutView (teammate): stamp purchase + expiry dates.
  function purchaseDraft() {
    if (!draftGift.value) return
    const now = new Date()
    draftGift.value.purchaseDate = now.toISOString()
    const days = draftGift.value.validDays || DEFAULT_VALID_DAYS
    draftGift.value.expiredDate = new Date(now.getTime() + days * 86400000).toISOString()
    draftGift.value.status = 'purchased'
  }

  // Called by the editor: attach the exported card image (PNG dataURL).
  function attachCardImage(dataUrl) {
    if (draftGift.value) draftGift.value.cardImage = dataUrl
  }

  // Finalize: move the draft into the persisted gifts list. Returns the gift id.
  function sendGift(recipient) {
    if (!draftGift.value) return null
    draftGift.value.recipient = recipient ?? ''
    draftGift.value.status = 'sent'
    draftGift.value.sentAt = new Date().toISOString()
    gifts.value.push(draftGift.value)
    const id = draftGift.value.id
    draftGift.value = null
    return id
  }

  function getGiftById(id) {
    return gifts.value.find((g) => g.id === id)
  }

  // 收禮端:兌換後不可再操作(sent → redeemed,蓋時戳)。
  function redeemGift(id) {
    const g = getGiftById(id)
    if (!g || g.status !== 'sent') return
    g.status = 'redeemed'
    g.redeemedAt = new Date().toISOString()
  }

  // 收禮端:到期提醒開關(回應「LINE 提醒被淹沒、禮物過期退回」痛點)。
  function toggleReminder(id) {
    const g = getGiftById(id)
    if (g) g.reminderEnabled = !g.reminderEnabled
  }

  watch(
    gifts,
    (val) => {
      try {
        const safe = val.map((g) =>
          g.cardImage && g.cardImage.length > MAX_IMAGE_BYTES ? { ...g, cardImage: '' } : g,
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
      } catch {
        // quota exceeded or storage unavailable — ignore
      }
    },
    { deep: true },
  )

  return {
    gifts,
    draftGift,
    draftTotal,
    expireDuration,
    startDraft,
    ensureDraft,
    updateDraft,
    purchaseDraft,
    attachCardImage,
    sendGift,
    getGiftById,
    redeemGift,
    toggleReminder,
  }
})
