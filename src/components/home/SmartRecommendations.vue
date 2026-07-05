<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  recommendations: { type: Array, required: true },
})

const currentIndex = ref(0)
const wrap = n => ((n % props.recommendations.length) + props.recommendations.length) % props.recommendations.length
const rec = computed(() => props.recommendations[wrap(currentIndex.value)])
const recTriple = computed(() => [0, 1, 2].map(offset => props.recommendations[wrap(currentIndex.value + offset)]))
let timer
// decrement so each tick a new card enters on the left and the rightmost leaves
onMounted(() => { timer = setInterval(() => { currentIndex.value-- }, 4_500) })
onUnmounted(() => { clearInterval(timer) })
</script>

<template>
  <!-- Smart recommendation: mobile only -->
  <section class="rec-col d-md-none px-default pt-3">
    <h3 class="mb-md-7">智慧推薦</h3>
    <div class="rec-fade-wrap">
      <Transition name="rec-fade">
        <RouterLink :to="rec.to" :key="currentIndex" class="card p-3 border-0 shadow-lg rounded-5 text-decoration-none text-body">
          <div class="card-body d-flex align-items-center gap-5 p-5">
            <div class="flex-grow-1">
              <p class="fw-bold mb-1">{{ rec.title }}</p>
              <p class="text-body-secondary small mb-0" style="text-wrap: pretty;">{{ rec.sub }}</p>
            </div>
            <img :src="rec.img" class="rec-card-img rounded-3 border border-4 border-light shadow-lg flex-shrink-0" alt="" />
          </div>
        </RouterLink>
      </Transition>
    </div>
  </section>

  <!-- Smart recommendations row: tablet+ only -->
  <section class="d-none d-md-block pt-5 pb-9">
    <h3 class="ms-7 mb-4">智慧推薦</h3>
    <TransitionGroup name="rec-slide" tag="div" class="rec-row d-flex gap-4">
      <RouterLink v-for="r in recTriple" :to="r.to" :key="r.id" class="rec-card-fixed card p-3 border-0 shadow-lg rounded-5 text-decoration-none text-body">
        <div class="card-body d-flex align-items-center gap-5 p-5">
          <div class="flex-grow-1 min-w-0">
            <p class="fw-bold mb-1 text-nowrap text-truncate">{{ r.title }}</p>
            <p class="rec-card-sub text-body-secondary small mb-0">{{ r.sub }}</p>
          </div>
          <img :src="r.img" class="rec-card-img rounded-3 flex-shrink-0 border border-4 border-light shadow-lg" alt="" />
        </div>
      </RouterLink>
    </TransitionGroup>
  </section>
</template>

<style lang="scss" scoped>
.rec-col {
  min-width: 0;
}
.rec-card-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  rotate: 3deg;
}
.rec-fade-wrap {
  position: relative;
}
.rec-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.rec-fade-leave-active {
  transition: opacity 0.35s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.rec-fade-enter-from { opacity: 0; transform: translateY(16px); } // float up
.rec-fade-leave-to   { opacity: 0; }
// tablet+ recommendation row: fixed-size cards, one swaps at a time, row scrolls if it overflows
.min-w-0 {
  min-width: 0;
}
.rec-row {
  position: relative;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-block: 32px;
  margin-block: -32px;
}
.rec-row::-webkit-scrollbar {
  display: none;
}
.rec-card-fixed {
  flex: 0 0 auto;
  width: 320px;

  &:first-child{
    margin-inline-start: var(--px-tablet-content);
  }
}
.rec-slide-move {
  transition: transform 0.8s ease;
}
.rec-slide-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.rec-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  position: absolute;
  top: 0;
  right: 0;
  width: 320px; // matches .rec-card-fixed
}
.rec-slide-enter-from { opacity: 0; transform: translateY(16px); } // float up
.rec-slide-leave-to   { opacity: 0; }
</style>
