import { ref, watch, unref } from 'vue'
import { Vibrant } from 'node-vibrant/browser'

// Neutral fallback used while an image loads or when extraction is impossible.
const FALLBACK = '#6b7b8c'

function isHex(s) {
  return typeof s === 'string' && /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(s.trim())
}
function normHex(s) {
  let h = s.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  return '#' + h.slice(0, 6).toLowerCase()
}
function rgb(hex) {
  const h = normHex(hex).slice(1)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
function toHex(arr) {
  return '#' + arr.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')
}
function mix(hex, target, t) {
  const a = rgb(hex)
  const b = rgb(target)
  return toHex(a.map((v, i) => v + (b[i] - v) * t))
}

// Resolve the main color of a gift image. Accepts an image URL/dataURL, or a bare
// hex color (the catalog currently stores colors instead of images) used directly.
export async function dominantColor(src) {
  if (!src) return FALLBACK
  if (isHex(src)) return normHex(src)
  try {
    const palette = await Vibrant.from(src).getPalette()
    const sw =
      palette.Vibrant || palette.Muted || palette.DarkVibrant || palette.LightVibrant
    return sw ? sw.hex : FALLBACK
  } catch {
    return FALLBACK
  }
}

// Lighter gradient built from the main color (mixes toward white), per spec.
export function toGradient(hex) {
  const base = isHex(hex) ? normHex(hex) : FALLBACK
  const light = mix(base, '#ffffff', 0.5)
  return `linear-gradient(160deg, ${base} 0%, ${light} 100%)`
}

// Black or white text, whichever reads better against the gradient (sampled slightly
// lightened, so text stays legible across the lighter portion of the card).
export function readableText(hex) {
  const base = isHex(hex) ? normHex(hex) : FALLBACK
  const [r, g, b] = rgb(mix(base, '#ffffff', 0.3))
  const luma = 0.299 * r + 0.587 * g + 0.114 * b
  return luma > 150 ? '#000000' : '#ffffff'
}

// Reactive helper: given a ref/getter for the image src, exposes a derived gradient +
// readable text color that update (async) whenever the src changes. Memoizes by src.
export function useCardColors(srcRef) {
  const gradient = ref(toGradient(FALLBACK))
  const textColor = ref(readableText(FALLBACK))
  const cache = new Map()

  watch(
    () => unref(srcRef),
    async (src) => {
      const key = src || ''
      let color = cache.get(key)
      if (!color) {
        color = await dominantColor(src)
        cache.set(key, color)
      }
      gradient.value = toGradient(color)
      textColor.value = readableText(color)
    },
    { immediate: true },
  )

  return { gradient, textColor }
}
