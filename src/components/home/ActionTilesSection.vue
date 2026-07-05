<script setup>
import ActionTile from '@/components/ActionTile.vue'
import { earnPointNav, usePointNav } from '@/nav.js'

// Links to the in-development stub are rendered as disabled (muted, unclickable).
const isStub = to => to?.name === 'in-development'
</script>

<template>
  <section>
    <!-- md+: single horizontal wrapping row(磚塊資料來自 nav.js,tileIcon 為磚塊專用圖示) -->
    <div class="tiles-row d-none d-md-flex px-default py-5 gap-3">
      <ActionTile
        v-for="a in [...earnPointNav, ...usePointNav]"
        :key="a.label"
        :label="a.label"
        :icon="a.tileIcon ?? a.icon"
        :to="a.to"
        :disabled="isStub(a.to)"
        variant="gray"
      />
    </div>

    <!-- mobile: two separate grid groups -->
    <div class="d-md-none d-flex flex-column gap-8 px-default py-5">
      <div>
        <h3 class="mb-4">累積捷運點</h3>
        <div class="tile-grid row g-3">
          <div v-for="a in earnPointNav" :key="a.label" class="col-6">
            <ActionTile :label="a.label" :icon="a.tileIcon ?? a.icon" :to="a.to" :disabled="isStub(a.to)" variant="gray" />
          </div>
        </div>
      </div>
      <div>
        <h3 class="mb-4">使用捷運點</h3>
        <div class="tile-grid row g-3">
          <div v-for="a in usePointNav" :key="a.label" class="col-6">
            <ActionTile :label="a.label" :icon="a.tileIcon ?? a.icon" :to="a.to" :disabled="isStub(a.to)" variant="gray" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.tiles-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline-start: var(--px-tablet-content);
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-inline-end: var(--px-tablet-content);
}
.tiles-row::-webkit-scrollbar {
  display: none;
}
.tiles-row :deep(.action-tile) {
  width: 185px;
  flex-shrink: 0;
  scroll-snap-align: start;
}
// 400–700px: action tiles go from 2 columns to 3
@media (min-width: 400px) and (max-width: 767.98px) {
  .tile-grid > .col-6 {
    width: 33.3333%;
  }
}
</style>
