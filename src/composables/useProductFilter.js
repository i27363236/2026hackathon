// 列表頁共用的篩選狀態 — 送禮中心、送禮貨架頁、兌換中心都用這支。
//
// 三個面向:價格區間、分類(多選)、捷運站(多選)。每頁用 sections 決定要開哪幾項,
// 沒開的面向不會參與過濾,也不會寫進網址。
//
// 資料形狀各頁不同(禮物用 price + 貨架 key,優惠券用 point + category),所以透過
// accessor 取值,而不是硬綁欄位名。
//
// 條件會以 router.replace 同步到 route query(cat / price / st),掛載時再讀回來 —
// 這樣「進商品頁再返回」「重新整理」「把網址貼給別人」條件都還在。用 replace 而非 push,
// 避免每動一下滑桿就在瀏覽歷史堆一筆。
import { computed, ref, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const LIST_SEPARATOR = ','

// 陣列 ⇄ 查詢字串。空陣列回傳 undefined,vue-router 會把該參數從網址移除。
const listToQuery = (arr) => (arr.length ? arr.join(LIST_SEPARATOR) : undefined)
const queryToList = (raw, valid) => {
  if (typeof raw !== 'string' || raw === '') return []
  const allowed = new Set(valid)
  return raw.split(LIST_SEPARATOR).filter((v) => allowed.has(v))
}

export function useProductFilter(pool, options = {}) {
  const {
    sections = [],
    categories = [],
    stations = [],
    getPrice = (item) => item.price,
    getCategory = (item) => item.category,
    getStations = () => [],
    // 額外的過濾條件(送禮中心的搜尋列)。放進來而不是在外面再包一層 filter,
    // 是為了讓 resultCount 把搜尋一起算進去;而 pool 維持完整目錄,
    // 價格上下界才不會在使用者打字時跟著跳動。
    predicate = null,
  } = options

  const route = useRoute()
  const router = useRouter()

  const has = (name) => sections.includes(name)
  const items = computed(() => toValue(pool) ?? [])

  // 價格上下界由當前資料池推導,不寫死 —— 換頁、換貨架都會自動貼合。
  const bounds = computed(() => {
    const prices = items.value.map(getPrice).filter((n) => Number.isFinite(n))
    if (!prices.length) return [0, 0]
    return [Math.min(...prices), Math.max(...prices)]
  })

  // null = 使用者沒動過 → 等同全範圍。這樣資料池變動時預設值會自己跟上。
  const priceRange = ref(null)
  const selectedCategories = ref([])
  const selectedStations = ref([])

  const price = computed({
    get: () => priceRange.value ?? bounds.value,
    set: (next) => {
      priceRange.value = next
    },
  })

  const isPriceNarrowed = computed(() => {
    if (!has('price') || priceRange.value === null) return false
    const [lo, hi] = priceRange.value
    const [min, max] = bounds.value
    return lo > min || hi < max
  })

  // ---- 從網址讀回條件(初始化) ----
  if (has('price') && typeof route.query.price === 'string') {
    const [lo, hi] = route.query.price.split('-').map(Number)
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo <= hi) priceRange.value = [lo, hi]
  }
  if (has('category')) {
    selectedCategories.value = queryToList(route.query.cat, categories.map((c) => c.key))
  }
  if (has('station')) {
    selectedStations.value = queryToList(route.query.st, stations.map((s) => s.id))
  }

  // ---- 過濾 ----
  const filtered = computed(() =>
    items.value.filter((item) => {
      if (predicate && !predicate(item)) return false
      if (isPriceNarrowed.value) {
        const [lo, hi] = price.value
        const value = getPrice(item)
        if (!Number.isFinite(value) || value < lo || value > hi) return false
      }
      if (has('category') && selectedCategories.value.length) {
        if (!selectedCategories.value.includes(getCategory(item))) return false
      }
      if (has('station') && selectedStations.value.length) {
        const itemStations = getStations(item)
        if (!selectedStations.value.some((id) => itemStations.includes(id))) return false
      }
      return true
    }),
  )

  const activeCount = computed(
    () =>
      (isPriceNarrowed.value ? 1 : 0) +
      (has('category') ? selectedCategories.value.length : 0) +
      (has('station') ? selectedStations.value.length : 0),
  )

  const resultCount = computed(() => filtered.value.length)

  function reset() {
    priceRange.value = null
    selectedCategories.value = []
    selectedStations.value = []
  }

  function toggleCategory(key) {
    const list = selectedCategories.value
    selectedCategories.value = list.includes(key) ? list.filter((k) => k !== key) : [...list, key]
  }

  function toggleStation(id) {
    const list = selectedStations.value
    selectedStations.value = list.includes(id) ? list.filter((s) => s !== id) : [...list, id]
  }

  // ---- 寫回網址 ----
  watch(
    [isPriceNarrowed, price, selectedCategories, selectedStations],
    () => {
      const next = {
        ...route.query,
        price: isPriceNarrowed.value ? price.value.join('-') : undefined,
        cat: has('category') ? listToQuery(selectedCategories.value) : undefined,
        st: has('station') ? listToQuery(selectedStations.value) : undefined,
      }
      // 值沒變就不要 replace,否則 watch 會被自己觸發的路由更新反覆喚醒。
      const same = ['price', 'cat', 'st'].every((k) => (route.query[k] ?? undefined) === next[k])
      if (same) return
      router.replace({ query: next })
    },
    { deep: true },
  )

  return {
    // 狀態
    price,
    bounds,
    selectedCategories,
    selectedStations,
    // 衍生
    filtered,
    activeCount,
    resultCount,
    isPriceNarrowed,
    // 動作
    reset,
    toggleCategory,
    toggleStation,
  }
}
