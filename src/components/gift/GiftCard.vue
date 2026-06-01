<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  message: { type: String, default: '' },
  signature: { type: String, default: '' },
})
</script>

<template>
  <div class="gift-card rounded-4 overflow-hidden position-relative w-100 h-100">
    <!-- decorative doodles -->
    <Icon icon="ph:sparkle-fill" class="doodle text-white opacity-50" style="top: 8%; left: 10%" width="22" height="22" />
    <Icon icon="ph:star-fill" class="doodle text-warning" style="top: 12%; right: 14%" width="20" height="20" />
    <Icon icon="ph:gift-fill" class="doodle text-white opacity-50" style="top: 6%; right: 8%" width="22" height="22" />

    <!-- note paper -->
    <div class="note bg-white rounded-3 m-5 p-5 shadow-sm">
      <p class="message mb-4">{{ message }}</p>
      <p class="signature text-end mb-0">{{ signature }}</p>
    </div>

    <!-- stickers + mascot -->
    <div class="d-flex align-items-end justify-content-between px-5 pb-5">
      <div class="d-flex flex-column align-items-start gap-2">
        <Icon icon="ph:coffee-fill" class="text-warning" width="48" height="48" />
        <div class="hundred fw-bold text-danger">100!</div>
        <div class="d-flex gap-1">
          <Icon icon="ph:heart-fill" class="text-danger" width="18" height="18" />
          <Icon icon="ph:heart-fill" class="text-danger" width="18" height="18" />
        </div>
      </div>
      <div class="mascot rounded-circle bg-primary d-flex align-items-center justify-content-center text-white">
        <Icon icon="ph:smiley-wink-fill" width="44" height="44" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-card {
  background: linear-gradient(160deg, #cdeefe 0%, #e7f7ff 100%);
  aspect-ratio: 3 / 4;
}
.doodle {
  position: absolute;
}
.note {
  border: 1px dashed var(--bs-gray-300);
}
.message {
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.signature {
  font-size: 14px;
  color: var(--bs-body-secondary-color);
}
.hundred {
  font-size: 34px;
  transform: rotate(-8deg);
}
.mascot {
  width: 72px;
  height: 72px;
}
</style>
