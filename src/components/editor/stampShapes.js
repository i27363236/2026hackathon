// Frame geometry for the stamp builder. Each shape is an SVG path `d` drawn in a
// 100×100 viewBox (centre 50,50), so the SAME data renders in the builder's inline
// <svg> previews AND on the Konva canvas (Konva `Path` accepts SVG `data`).
// Stamps draw the path as an OUTLINE: stroke = stamp colour, fill = transparent.

const C = 50 // centre
const R = 44 // outer radius

const round = (n) => Math.round(n * 100) / 100

// Regular polygon with one vertex pointing up.
function polygonPath(sides) {
  const pts = []
  for (let i = 0; i < sides; i++) {
    const a = ((-90 + (360 / sides) * i) * Math.PI) / 180
    pts.push(`${round(C + R * Math.cos(a))} ${round(C + R * Math.sin(a))}`)
  }
  return 'M' + pts.join(' L') + ' Z'
}

// N-pointed star (outer R, inner radius = R * ratio).
function starPath(points = 5, ratio = 0.5) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? R : R * ratio
    const a = ((-90 + (180 / points) * i) * Math.PI) / 180
    pts.push(`${round(C + r * Math.cos(a))} ${round(C + r * Math.sin(a))}`)
  }
  return 'M' + pts.join(' L') + ' Z'
}

// Scalloped "seal" badge — smooth lobes via quadratic bumps between valley points.
function sealPath(lobes = 12, valleyRatio = 0.86) {
  const inner = R * valleyRatio
  const valley = (i) => {
    const a = ((-90 + (360 / lobes) * i) * Math.PI) / 180
    return [C + inner * Math.cos(a), C + inner * Math.sin(a)]
  }
  const [sx, sy] = valley(0)
  let d = `M${round(sx)} ${round(sy)}`
  for (let i = 0; i < lobes; i++) {
    const midA = ((-90 + (360 / lobes) * (i + 0.5)) * Math.PI) / 180
    const cx = C + R * Math.cos(midA)
    const cy = C + R * Math.sin(midA)
    const [nx, ny] = valley((i + 1) % lobes)
    d += ` Q${round(cx)} ${round(cy)} ${round(nx)} ${round(ny)}`
  }
  return d + ' Z'
}

export const STAMP_SHAPES = [
  { key: 'circle', label: '圓形', d: `M${100 - C + R} ${C} A${R} ${R} 0 1 1 ${C - R} ${C} A${R} ${R} 0 1 1 ${C + R} ${C} Z` },
  { key: 'rounded', label: '圓角', d: 'M20 6 H80 A14 14 0 0 1 94 20 V80 A14 14 0 0 1 80 94 H20 A14 14 0 0 1 6 80 V20 A14 14 0 0 1 20 6 Z' },
  { key: 'square', label: '方形', d: 'M8 8 H92 V92 H8 Z' },
  { key: 'triangle', label: '三角', d: polygonPath(3) },
  { key: 'pentagon', label: '五角', d: polygonPath(5) },
  { key: 'hexagon', label: '六角', d: polygonPath(6) },
  { key: 'star', label: '星形', d: starPath(5) },
  { key: 'heart', label: '愛心', d: 'M50 84 C20 62 8 42 8 27 C8 15 18 7 30 7 C40 7 47 13 50 21 C53 13 60 7 70 7 C82 7 92 15 92 27 C92 42 80 62 50 84 Z' },
  { key: 'seal', label: '徽章', d: sealPath(12) },
]

export const SHAPE_BY_KEY = Object.fromEntries(STAMP_SHAPES.map((s) => [s.key, s]))
