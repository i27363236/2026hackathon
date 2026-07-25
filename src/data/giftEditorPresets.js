// Static presets for the gift-card editor (GiftSetupView): stickers, backgrounds, tools.
// Background image assets are imported so Vite fingerprints them.
import postcardBg1 from '@/img/postcard-bg-1.png'
import postcardBg2 from '@/img/postcard-bg-2.png'

export const STICKERS = ['🎁', '🎀', '⭐', '❤️', '🌸', '☕', '🍰', '✨', '🎉', '🥐']

// Selectable card backgrounds shown in the 背景 panel. Colour/gradient swatches first,
// then the real postcard image assets (previously data/giftBackgrounds.js).
export const BG_PRESETS = [
  { type: 'color', value: '#ffffff' },
  { type: 'color', value: '#ffe9ec' },
  { type: 'color', value: '#e7f7ff' },
  { type: 'color', value: '#eafbe7' },
  { type: 'gradient', value: ['#cdeefe', '#e7f7ff'] },
  { type: 'gradient', value: ['#ffd9e8', '#fff0d9'] },
  { type: 'image', value: postcardBg1, name: '明信片一' },
  { type: 'image', value: postcardBg2, name: '明信片二' },
]

// Toolbar config consumed by EditToolbar. 'select'/'pen' switch the drawing
// tool; 'upload' fires the device file picker directly (no panel);
// the rest toggle a contextual options panel.
export const TOOLS = [
  { key: 'select', icon: 'ph:cursor-light', label: '選取' },
  { key: 'pen', icon: 'ph:pencil-simple-light', label: '塗鴉' },
  { key: 'photo', icon: 'ph:subway-light', label: '捷運回憶' },
  { key: 'upload', icon: 'ph:image-square-light', label: '上傳照片' },
  { key: 'sticker', icon: 'ph:sticker-light', label: '貼紙' },
  { key: 'stamp', icon: 'ph:seal-light', label: '印章' },
  { key: 'bg', icon: 'ph:paint-bucket-light', label: '背景' },
]
