<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('全部')
const categories = ['全部', '美食', '文創', '票券']

const gifts = ref([
  { id: 'cat-021', category: '美食', title: '法式手作檸檬塔', price: 450, image: 'https://placehold.co/400x400?text=Lemon+Tart', description: '酸甜適中的清爽口感，下午茶首選' },
  { id: 'mug-001', category: '文創', title: '捷運聯名馬克杯', price: 350, image: 'https://placehold.co/400x400?text=Metro+Mug', description: '簡約設計，陪你度過每個辦公時刻' },
  { id: 'ticket-001', category: '票券', title: '雙層巴士乘車券', price: 600, image: 'https://placehold.co/400x400?text=Bus+Ticket', description: '暢遊台北熱門景點，專屬觀光體驗' },
  { id: 'box-001', category: '美食', title: '精緻手工餅乾盒', price: 520, image: 'https://placehold.co/400x400?text=Cookies', description: '多種口味一次滿足，送禮自用兩相宜' },
  { id: 'stationery-001', category: '文創', title: '捷運路網紙膠帶', price: 120, image: 'https://placehold.co/400x400?text=Washi+Tape', description: '獨家設計路網圖，文具控必收單品' },
  { id: 'toy-001', category: '文創', title: '捷運迴力小車', price: 280, image: 'https://placehold.co/400x400?text=Metro+Toy', description: '擬真車型設計，小朋友的最愛' },
])

const filteredGifts = computed(() => {
  return gifts.value.filter(gift => {
    const matchesSearch = gift.title.includes(searchQuery.value)
    const matchesCategory = activeCategory.value === '全部' || gift.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const goBack = () => router.back()
const handleGiftClick = (id) => {
  // Navigation logic to detail or draft setup
  router.push({ name: 'gift-detail', params: { id } })
}
</script>

<template>
  <div class="gift-home pb-5">
    <!-- Header -->
    <header class="d-flex align-items-center justify-content-between p-3 sticky-top bg-white border-bottom shadow-sm">
      <div class="d-flex align-items-center">
        <button class="btn btn-link text-dark p-0 me-3" @click="goBack">
          <Icon icon="f7:arrow-left" width="24" height="24" />
        </button>
        <h1 class="h5 fw-bold mb-0">送禮中心</h1>
      </div>
      <button class="btn btn-link text-primary p-0 text-decoration-none small fw-bold">
        送禮紀錄
      </button>
    </header>

    <!-- Hero Banner -->
    <div class="px-3 pt-4 mb-2">
      <div class="banner-card rounded-4 p-4 text-white d-flex flex-column justify-content-center">
        <h2 class="h4 fw-bold mb-1">捷運伴手禮</h2>
        <p class="small opacity-75 mb-0">送出最真摯的祝福，共享美好生活</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="px-3 py-3">
      <div class="search-bar bg-light rounded-pill d-flex align-items-center px-3 mb-4 border">
        <Icon icon="f7:search" width="18" height="18" class="text-secondary me-2" />
        <input 
          v-model="searchQuery"
          type="text" 
          class="form-control border-0 bg-transparent py-2 shadow-none" 
          placeholder="搜尋想送的禮物..."
        >
      </div>

      <!-- Categories -->
      <div class="category-scroll d-flex gap-2 overflow-auto pb-2">
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="btn rounded-pill px-4 py-1 text-nowrap transition-all"
          :class="activeCategory === cat ? 'btn-primary shadow-sm' : 'btn-light text-secondary border'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Gift Grid -->
    <div class="px-3">
      <div class="row g-3">
        <div v-for="gift in filteredGifts" :key="gift.id" class="col-6">
          <div class="gift-card card border-0 shadow-sm rounded-4 overflow-hidden h-100" @click="handleGiftClick(gift.id)">
            <div class="position-relative">
              <img :src="gift.image" class="card-img-top aspect-ratio-1-1 object-fit-cover" :alt="gift.title">
              <div class="badge-category position-absolute top-0 start-0 m-2 px-2 py-1 bg-white bg-opacity-75 rounded-pill smaller text-dark fw-bold">
                {{ gift.category }}
              </div>
            </div>
            <div class="card-body p-3">
              <h3 class="h6 fw-bold text-dark mb-1 text-truncate">{{ gift.title }}</h3>
              <p class="text-secondary smaller mb-3 text-truncate-2">{{ gift.description }}</p>
              <div class="d-flex align-items-center justify-content-between mt-auto">
                <div class="d-flex align-items-baseline">
                  <span class="h6 fw-bold text-primary mb-0">{{ gift.price }}</span>
                  <span class="smaller text-secondary ms-1">P</span>
                </div>
                <button class="btn btn-sm btn-primary rounded-circle p-1 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;">
                  <Icon icon="f7:plus" width="18" height="18" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gift-home {
  background-color: #f8f9fa;
  min-height: 100vh;

  .banner-card {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    min-height: 120px;
  }

  .category-scroll {
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  .gift-card {
    transition: transform 0.2s ease;
    cursor: pointer;
    &:active { transform: scale(0.97); }
  }

  .aspect-ratio-1-1 { aspect-ratio: 1 / 1; }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.5em;
  }

  .smaller { font-size: 0.75rem; }
  .transition-all { transition: all 0.2s ease; }

  .badge-category {
    backdrop-filter: blur(4px);
    font-size: 0.65rem;
  }
}
</style>