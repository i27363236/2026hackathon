<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { getEvents } from '@/data/events.js'
import EventLargeCard from '@/components/home/EventLargeCard.vue'
import RowCard from '@/components/home/RowCard.vue'

const events = getEvents()

const participationEvents = computed(() => events.filter(e => e.category === 'participation'))
const onlineEvents = computed(() => events.filter(e => e.category === 'online'))
const offlineEvents = computed(() => events.filter(e => e.category === 'offline'))
</script>

<template>
  <div class="get-point-events pb-8">
    <!-- 大家都參加 (toolbar with back/title/map lives in AppLayout via route meta) -->
    <section class="px-default py-7">
      <div class="card-row d-flex gap-4">
        <EventLargeCard
          v-for="e in participationEvents"
          :key="e.id"
          :subtitle="e.tag"
          :title="e.title"
          :detail="e.detail"
          :img="e.img"
          :color-key="e.colorKey"
        />
      </div>
    </section>

    <!-- 線上活動 -->
    <section class="px-default py-5">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h3 class="mb-0">線上活動</h3>
        <button class="section-arrow d-flex align-items-center justify-content-center rounded-pill border-0">
          <Icon icon="ph:arrow-right-light" width="24" height="24" />
        </button>
      </div>
      <div class="card-row d-flex gap-4">
        <RowCard
          v-for="e in onlineEvents"
          :key="e.id"
          :title="e.title"
          :detail="e.detail"
          :img="e.img"
          :color-key="e.colorKey"
        />
      </div>
    </section>

    <!-- 線下活動 -->
    <section class="px-default py-5">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h3 class="mb-0">線下活動</h3>
        <button class="section-arrow d-flex align-items-center justify-content-center rounded-pill border-0">
          <Icon icon="ph:arrow-right-light" width="24" height="24" />
        </button>
      </div>
      <div class="card-row d-flex gap-4">
        <RowCard
          v-for="e in offlineEvents"
          :key="e.id"
          :subtitle="e.tag"
          :title="e.title"
          :detail="e.detail"
          :img="e.img"
          :color-key="e.colorKey"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.get-point-events {
  background-color: var(--bs-body-bg);
  min-height: 100dvh;
}

.section-arrow {
  width: 32px;
  height: 32px;
  background-color: rgba(249, 247, 243, 0.8);
}

.card-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-inline-end: calc(-1 * var(--px-phone));
  padding-inline-end: var(--px-phone);
  @media (min-width: 768px) {
    margin-inline-end: calc(-1 * var(--px-tablet-content));
    padding-inline-end: var(--px-tablet-content);
  }
}
.card-row::-webkit-scrollbar {
  display: none;
}
.card-row > * {
  scroll-snap-align: start;
}
</style>
