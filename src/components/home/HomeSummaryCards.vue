<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import metroPointImg from '@/img/metro-point.png'

const props = defineProps({
  profile: { type: Object, required: true },
  goal: { type: Object, required: true }, // 集點目標商品
})

const goalPct = computed(() => Math.min(100, Math.round((props.profile.points / props.goal.price) * 100)))
</script>

<template>
  <section class="summary-col px-default py-5">
    <div class="summary-row row g-3">
      <div class="col-6 col-md-4">
        <div class="card border-0 rounded-4 text-decoration-none text-body h-100">
          <div class="card-body px-5 py-4 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-center">
              <img :src="metroPointImg" class="w-8 h-8 mt-1" style="width:32px;height:32px;object-fit:contain" alt="捷運點" />
              <div class="display-3">{{ profile.points }}</div>
            </div>
            <h4 class="mt-2 mb-0">捷運點</h4>
            <div class="caption-2 mt-1 text-body-secondary">{{ profile.expiringPoints }}點將於{{ profile.expiringDate }}到期</div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <!-- 摘要卡導向 /coupons(兌換總覽:優惠券+禮物);功能磚的優惠券則導向交換中心 -->
        <RouterLink :to="{ name: 'coupons' }" class="card border-0 rounded-4 text-decoration-none text-body h-100">
          <div class="card-body px-5 py-4 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-center">
              <Icon icon="ph:ticket-light" width="32" height="32" class="text-body-secondary"/>
              <span class="display-3">{{ profile.coupons }}</span>
            </div>
            <h4 class="mt-2 mb-0">優惠券</h4>
            <div class="caption-2 mt-1 text-body-secondary">{{ profile.expiringCoupons }}張將於{{ profile.expiringDate }}到期</div>
          </div>
        </RouterLink>
      </div>
      <div class="col-12 col-md-4">
        <div class="card border-0 rounded-4 h-100 overflow-hidden">
          <div class="card-body p-0 d-flex">
            <div class="flex-grow-1 px-5 py-4 gap-3 d-flex flex-column justify-content-between">
              <div class="d-flex justify-content-between align-items-center">
                <Icon icon="ph:target-light" width="32" height="32" class="text-body-secondary"/>
                <span class="display-4 ms-auto">{{ profile.points }}/{{ goal.price }}
                </span>
              </div>
              <div class="progress rounded-pill bg-warning-subtle" style="height: 4px;">
                <div class="progress-bar rounded-pill bg-warning" :style="{ width: goalPct + '%' }" />
              </div>
              <div class="flex-shrink-1">
                <h4 class="mb-0 lh-1">集點目標</h4>
                <div class="caption-2 mt-1 text-body-secondary">{{ goal.name }}</div>
              </div>
            </div>
            <div class="summary-reward-img flex-shrink-0" :style="{ background: goal.img }" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.summary-reward-img {
  width: 72px;
  background-size: cover;
  background-position: center;
}
.summary-col {
  min-width: 0;
}
// tablet: summary cards shrink to a fixed width and scroll horizontally if they overflow
@media (min-width: 768px) {
  .summary-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .summary-row::-webkit-scrollbar {
    display: none;
  }
  .summary-row > [class*='col-'] {
    flex: 0 0 auto;
    width: 200px;
  }
  .summary-row > [class*='col-']:last-child {
    width: 280px; // goal card (with reward image) a touch wider
  }
}
</style>
