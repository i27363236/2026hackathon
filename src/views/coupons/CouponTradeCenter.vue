<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const categories = ['全部', '美食', '購物', '生活', '交通']
const activeCategory = ref('全部')

const coupons = ref([
  { id: 1, category: '美食', store: '路易莎咖啡', title: '50元現金折價券', points: 500, image: 'https://placehold.co/400x400?text=Louisa', tag: '熱門' },
  { id: 2, category: '美食', store: '全家便利商店', title: '中杯美式咖啡', points: 350, image: 'https://placehold.co/400x400?text=FamilyMart', tag: '限量' },
  { id: 3, category: '交通', store: '台北捷運', title: '24小時旅遊票', points: 1500, image: 'https://placehold.co/400x400?text=Metro', tag: '推薦' },
  { id: 4, category: '生活', store: '屈臣氏', title: '滿500現折100', points: 800, image: 'https://placehold.co/400x400?text=Watsons', tag: null },
  { id: 5, category: '購物', store: '誠品書店', title: '圖書商品9折券', points: 200, image: 'https://placehold.co/400x400?text=Eslite', tag: null },
  { id: 6, category: '美食', store: 'Mister Donut', title: '甜甜圈買一送一', points: 300, image: 'https://placehold.co/400x400?text=MisterDonut', tag: null },
])

const filteredCoupons = computed(() => {
  if (activeCategory.value === '全部') return coupons.value
  return coupons.value.filter(c => c.category === activeCategory.value)
})
</script>

<template>
  <section class="coupon-trade-center py-6">
    <div class="d-flex justify-content-between align-items-center mb-5 px-2">
      <h2 class="h5 fw-bold mb-0">優惠券媒合中心</h2>
      <button class="btn btn-link text-primary p-0 text-decoration-none small fw-bold">
        我的兌換
      </button>
    </div>

    <!-- Category Filter -->
    <div class="category-scroll d-flex gap-2 overflow-auto pb-4 mb-4">
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

    <!-- Coupon Grid -->
    <div class="row g-4">
      <div v-for="coupon in filteredCoupons" :key="coupon.id" class="col-6">
        <div class="card h-100 border-0 shadow-sm rounded-5 overflow-hidden coupon-card">
          <div class="position-relative">
            <img :src="coupon.image" class="card-img-top aspect-ratio-1-1 object-fit-cover" :alt="coupon.title">
            <span v-if="coupon.tag" class="position-absolute top-0 start-0 m-3 badge rounded-pill bg-danger shadow-sm">
              {{ coupon.tag }}
            </span>
          </div>
          <div class="card-body p-4">
            <div class="text-muted smaller mb-1">{{ coupon.store }}</div>
            <h3 class="h6 fw-bold text-dark mb-3 text-truncate-2">{{ coupon.title }}</h3>
            <div class="d-flex align-items-center justify-content-between mt-auto">
              <div class="d-flex align-items-baseline">
                <span class="h6 fw-bold text-primary mb-0">{{ coupon.points }}</span>
                <span class="smaller text-secondary ms-1">P</span>
              </div>
              <button class="btn btn-sm btn-outline-primary rounded-pill px-3">
                兌換
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.coupon-trade-center {
  .category-scroll {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .rounded-5 { border-radius: 16px !important; }

  .coupon-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:active {
      transform: scale(0.98);
    }
  }

  .aspect-ratio-1-1 {
    aspect-ratio: 1 / 1;
  }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.5em;
  }

  .smaller {
    font-size: 0.75rem;
  }

  .transition-all {
    transition: all 0.2s ease;
  }

  .badge {
    font-size: 0.7rem;
    padding: 0.4em 0.8em;
  }
}
</style>