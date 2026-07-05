// Icon choices for the stamp builder's 圖示 grid — an extensible registry.
//
// Entry kinds:
//   { type: 'ph',  name }  Phosphor icon; the weight suffix (-light/-bold/…) is applied
//                          at render time, and it tints to the stamp colour.
//   { type: 'svg', src }   Local SVG markup (imported with `?raw`). Author it with
//                          `stroke/fill="currentColor"` so it tints like a Phosphor icon.
//   { type: 'img', src }   Raster image URL (png/jpg). Placed as-is — NOT tinted.
//
// To add a custom icon: drop the file in `src/assets/stamp-icons/`, import it below
// (`?raw` for tintable SVG, or a normal import for a raster `img`), and push an entry.
import finn from '@/assets/stamp-icons/finn.svg?raw'

const ph = (name, label) => ({ id: name, type: 'ph', name, label: label || name })

export const stampIcons = [
  // MRT / travel
  ph('train', '火車'),
  ph('subway', '捷運'),
  ph('tram', '輕軌'),
  ph('airplane-tilt', '飛機'),
  ph('map-pin', '地點'),
  ph('compass', '指南針'),
  ph('suitcase-rolling', '行李'),
  ph('ticket', '車票'),
  // gift
  ph('gift', '禮物'),
  // love
  ph('heart', '愛心'),
  ph('hand-heart', '關愛'),
  // friendship
  ph('users-three', '朋友'),
  ph('handshake', '握手'),
  ph('smiley', '微笑'),
  // surprise
  ph('confetti', '慶祝'),
  ph('balloon', '氣球'),
  // star / shine
  ph('star', '星星'),
  ph('shooting-star', '流星'),
  ph('sun', '陽光'),
  ph('sparkle', '閃耀'),
  // custom SVG example
  { id: 'finn', type: 'svg', src: finn, label: 'Finn' },
]
