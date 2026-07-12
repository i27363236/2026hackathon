import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 使用者偏好設定 — 目前只有情境推薦的隱私開關,持久化到 localStorage(鍵 metro:settings)。
const STORAGE_KEY = 'metro:settings'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const saved = loadSaved()
  const contextualRecs = ref(saved?.contextualRecs ?? true)

  function setContextualRecs(on) {
    contextualRecs.value = on
  }

  watch(contextualRecs, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ contextualRecs: val }))
    } catch {
      // storage unavailable — ignore
    }
  })

  return { contextualRecs, setContextualRecs }
})
