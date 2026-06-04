// Read-only gift catalog. Three fixed shelves, exactly 10 products each.
// Product shape: { id, name, desc, price, sizeLabel, img, colorKey }.
// colorKey is one of variant-1 … variant-6 (see _card-colors.scss); img is empty for now.

const shelves = [
  {
    key: 'featured',
    title: '最新主打',
    products: [
      { id: 'cat-001', name: '法式經典可麗露', desc: '外脆內軟，散發焦糖與蘭姆香氣', price: 180, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-002', name: '艾蜜莉草莓塔', desc: '當季草莓鋪滿酥脆塔皮，酸甜清爽', price: 320, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-003', name: '焦糖瑪奇朵', desc: '濃縮咖啡與焦糖奶香交織的層次', price: 160, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-004', name: '抹茶千層', desc: '薄如紙的可麗餅層疊濃郁抹茶醬', price: 280, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-005', name: '開心果可頌', desc: '酥層裹著開心果醬，堅果香氣飽滿', price: 150, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-006', name: '伯爵茶拿鐵', desc: '佛手柑香氣的伯爵茶與綿密奶泡', price: 170, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-007', name: '香草布丁燒', desc: '現烤布丁淋上手煮焦糖，入口即化', price: 120, sizeLabel: 'S', img: '', colorKey: 'variant-1' },
      { id: 'cat-008', name: '莓果優格杯', desc: '綜合莓果搭配希臘優格，清爽無負擔', price: 140, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-009', name: '海鹽奶蓋茶', desc: '微鹹奶蓋平衡茶香，層次分明', price: 130, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-010', name: '榛果布朗尼', desc: '濃郁巧克力裹著酥脆榛果顆粒', price: 160, sizeLabel: 'S', img: '', colorKey: 'variant-4' },
    ],
  },
  {
    key: 'rare',
    title: '最稀有的禮物',
    products: [
      { id: 'cat-011', name: '巧克力慕斯', desc: '濃郁的巧克力風味，滑順口感', price: 300, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-012', name: '拿鐵咖啡', desc: '香濃咖啡與奶泡的完美融合', price: 200, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-013', name: '熱帶水果沙拉', desc: '清新自然，搭配酸甜醬汁', price: 40, sizeLabel: 'S', img: '', colorKey: 'variant-1' },
      { id: 'cat-014', name: '金箔栗子蒙布朗', desc: '頂級和栗泥擠絲，綴以食用金箔', price: 480, sizeLabel: 'L', img: '', colorKey: 'variant-2' },
      { id: 'cat-015', name: '松露生巧克力', desc: '黑松露入味的入口即化生巧克力', price: 520, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-016', name: '香檳玫瑰馬卡龍', desc: '香檳甘納許夾心，玫瑰花瓣點綴', price: 360, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-017', name: '日本宇治金時', desc: '京都宇治抹茶與紅豆的經典組合', price: 280, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-018', name: '藍鑽藍莓乳酪', desc: '濃醇乳酪與野生藍莓的奢華滋味', price: 340, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-019', name: '伯爵焦糖布蕾', desc: '伯爵茶香布蕾，敲開脆糖層', price: 220, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-020', name: '稀世藏紅花奶酪', desc: '伊朗藏紅花入味的金黃奶酪', price: 560, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
    ],
  },
  {
    key: 'popular',
    title: '大家都在送',
    products: [
      { id: 'cat-021', name: '檸檬塔', desc: '清新酸甜的檸檬味，搭配酥脆的外皮，完美的午後甜點。', price: 400, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-022', name: '摩卡咖啡', desc: '細膩的咖啡融合濃郁的巧克力，為你帶來無與倫比的享受。', price: 250, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-023', name: '巧克力熔岩蛋糕', desc: '配搭香草冰淇淋，深受喜愛的甜品，適合各種場合。', price: 300, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-024', name: '美式咖啡', desc: '純粹的咖啡香氣，提神醒腦的日常選擇', price: 120, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-025', name: '原味貝果', desc: '外Q內軟的手工貝果，百搭好滋味', price: 90, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-026', name: '提拉米蘇', desc: '咖啡酒香浸潤手指餅，撒上可可粉', price: 260, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-027', name: '肉桂捲', desc: '溫熱肉桂香氣，淋上奶油糖霜', price: 130, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-028', name: '珍珠奶茶', desc: '香醇奶茶搭配Q彈黑糖珍珠', price: 70, sizeLabel: 'L', img: '', colorKey: 'variant-4' },
      { id: 'cat-029', name: '草莓奶昔', desc: '新鮮草莓打成綿密冰沙奶昔', price: 110, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-030', name: '鹽可頌', desc: '酥脆海鹽外層，奶香十足的人氣麵包', price: 60, sizeLabel: 'S', img: '', colorKey: 'variant-6' },
    ],
  },
]

export function getShelves() {
  return shelves
}

export function getProductById(id) {
  for (const shelf of shelves) {
    const found = shelf.products.find((p) => p.id === id)
    if (found) return found
  }
  return undefined
}
