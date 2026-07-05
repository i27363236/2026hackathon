// Selectable gift-card backgrounds for the canvas editor (the 背景 panel).
// Imported as module assets so Vite fingerprints them. Shape: { id, name, src }.
import postcardBg1 from '@/img/postcard-bg-1.png'
import postcardBg2 from '@/img/postcard-bg-2.png'

export const giftBackgrounds = [
  { id: 'postcard-1', name: '明信片一', src: postcardBg1 },
  { id: 'postcard-2', name: '明信片二', src: postcardBg2 },
]
