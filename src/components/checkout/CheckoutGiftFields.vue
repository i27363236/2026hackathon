<script setup>
// 送禮資訊 — 結帳頁在 isGift 時收「收禮人暱稱(必填)」與「想說的話(選填)」。
// 金流與點數兩種結帳版型共用,所以獨立成元件避免重複 markup。
const recipient = defineModel('recipient', { type: String, required: true })
const message = defineModel('message', { type: String, required: true })
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <div>
      <label for="gift-recipient" class="form-label fw-bold mb-2">收禮人暱稱</label>
      <input
        id="gift-recipient"
        v-model="recipient"
        type="text"
        class="form-control"
        placeholder="這份禮物要送給誰？"
        maxlength="20"
      />
    </div>
    <div>
      <label for="gift-message" class="form-label fw-bold mb-2">想說的話（選填）</label>
      <textarea
        id="gift-message"
        v-model="message"
        class="form-control"
        rows="2"
        placeholder="給對方的一句話，會顯示在收禮頁"
        maxlength="60"
      />
    </div>
  </div>
</template>
