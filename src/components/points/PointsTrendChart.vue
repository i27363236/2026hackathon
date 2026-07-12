<script setup>
// 累/銷點週趨勢 — 純 SVG 分組長條圖(不引入圖表庫;一張圖不值得多一個依賴)。
// 資料來自 stores/points.js 的 weeklyTotals(近 6 週)。
import { computed } from 'vue'
import { usePointsStore } from '@/stores/points.js'

const points = usePointsStore()

const CHART_W = 320
const CHART_H = 120
const LABEL_H = 18
const BAR_W = 14
const GAP = 3

const maxValue = computed(() =>
  Math.max(1, ...points.weeklyTotals.flatMap((w) => [w.earn, w.burn])),
)

const groups = computed(() => {
  const n = points.weeklyTotals.length
  const slot = CHART_W / n
  return points.weeklyTotals.map((w, i) => {
    const cx = i * slot + slot / 2
    const earnH = Math.round((w.earn / maxValue.value) * (CHART_H - 8))
    const burnH = Math.round((w.burn / maxValue.value) * (CHART_H - 8))
    return { ...w, cx, earnH, burnH }
  })
})

const totalEarn = computed(() => points.weeklyTotals.reduce((s, w) => s + w.earn, 0))
const totalBurn = computed(() => points.weeklyTotals.reduce((s, w) => s + w.burn, 0))
</script>

<template>
  <div class="card border-0 rounded-4 shadow-sm">
    <div class="card-body p-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="h6 fw-bold mb-0">近 6 週累/銷點</h3>
        <div class="d-flex gap-4 caption-2 text-body-secondary">
          <span class="d-flex align-items-center gap-1">
            <span class="legend-dot bg-primary rounded-circle" /> 累點
          </span>
          <span class="d-flex align-items-center gap-1">
            <span class="legend-dot bg-warning rounded-circle" /> 銷點
          </span>
        </div>
      </div>

      <svg
        :viewBox="`0 0 ${CHART_W} ${CHART_H + LABEL_H}`"
        class="w-100 h-auto"
        role="img"
        aria-label="近六週每週累點與銷點長條圖"
      >
        <line :x1="0" :y1="CHART_H" :x2="CHART_W" :y2="CHART_H" stroke="var(--bs-border-color)" stroke-width="1" />
        <g v-for="g in groups" :key="g.label">
          <rect
            :x="g.cx - BAR_W - GAP / 2"
            :y="CHART_H - g.earnH"
            :width="BAR_W"
            :height="g.earnH"
            rx="3"
            fill="var(--bs-primary)"
          />
          <rect
            :x="g.cx + GAP / 2"
            :y="CHART_H - g.burnH"
            :width="BAR_W"
            :height="g.burnH"
            rx="3"
            fill="var(--bs-warning)"
          />
          <text
            :x="g.cx"
            :y="CHART_H + LABEL_H - 4"
            text-anchor="middle"
            class="chart-label"
          >{{ g.label }}</text>
        </g>
      </svg>

      <p class="caption-2 text-body-secondary mt-3 mb-0">
        近 6 週共累積 {{ totalEarn }} 點、使用 {{ totalBurn }} 點
      </p>
    </div>
  </div>
</template>

<style scoped>
.legend-dot {
  width: 8px;
  height: 8px;
  display: inline-block;
}
.chart-label {
  font-size: 10px;
  fill: var(--bs-secondary-color);
}
</style>
