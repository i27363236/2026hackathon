<script setup>
// 「最近的可使用地點」提示卡 — 收禮頁打開就看得到,不需要使用者先想到去搜尋。
// 一眼給出:出口編號(黃色錨點,對應月台指標)、路線 + 站名 + 出口、同站其他出口,
// 以及現場照片(到現場認得出來)。要看別站則按「其他地點」,由父層開 BottomSheet。
import { computed } from 'vue'
import MetroLineBadge from '@/components/common/MetroLineBadge.vue'

const props = defineProps({
  location: { type: Object, required: true },
})

defineEmits(['show-all'])

// '5號出口' → '5'、'K1出口' → 'K1';黃色錨點只放編號本身。
const exitNumber = computed(() => props.location.exit.replace(/號?出口$/, ''))
</script>

<template>
  <section class="location-hint bg-body rounded-2 p-5">
    <div class="d-flex align-items-start gap-4">
      <span class="exit-anchor d-flex align-items-center justify-content-center flex-shrink-0">
        <span class="exit-anchor__num fw-bold position-relative">{{ exitNumber }}</span>
      </span>

      <div class="min-w-0">
        <div class="d-flex align-items-center gap-2 mb-1">
          <MetroLineBadge v-for="line in location.lines" :key="line" :code="line" />
          <h3 class="h6 fw-bold mb-0 ms-1">{{ location.station }} {{ location.exit }}</h3>
        </div>
        <p class="caption-1 text-body-secondary mb-0">
          位於這些出口：{{ location.exits.join('、') }}出口。
          <button
            type="button"
            class="other-locations btn btn-link p-0 align-baseline text-decoration-none"
            @click="$emit('show-all')"
          >
            其他地點
          </button>
        </p>
      </div>
    </div>

    <img :src="location.photo" class="location-photo rounded-1 w-100 mt-5" :alt="location.store" />
  </section>
</template>

<style scoped>
/* 出口編號 — 黃色直角三角形楔子(左上實心,斜邊由右上拉到左下),編號壓在斜邊上
   並刻意溢出到白底,呼應站內出口指標的造型。三角形走 ::before,編號本身不被裁切。 */
.exit-anchor {
  position: relative;
  width: 44px;
  height: 44px;
}
.exit-anchor::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--bs-secondary);
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
.exit-anchor__num {
  font-size: 28px;
  line-height: 1;
}

/* Bootstrap 的 .btn 會蓋掉 .caption-1 的字級(兩者同權重,Bootstrap 後載入),
   這裡讓文字鈕直接繼承所在段落的 caption 字級與行高。 */
.other-locations {
  font-size: inherit;
  line-height: inherit;
}

.location-photo {
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.min-w-0 {
  min-width: 0;
}
</style>
