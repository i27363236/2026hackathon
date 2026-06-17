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
  {
    key: 'morning',
    title: '捷客，早安！',
    products: [
      { id: 'cat-031', name: '古早味鮪魚飯糰', desc: '古早味手工飯糰，鹹香鮪魚佐炒蘿蔔乾', price: 45, sizeLabel: 'S', img: '', colorKey: 'variant-1' },
      { id: 'cat-032', name: '路易莎莊園拿鐵', desc: '中美洲莊園精品豆，香醇回甘不苦澀', price: 95, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-033', name: '摩斯珍珠堡', desc: '在地稻米製成米漢堡，搭配日式醬汁珍珠堡', price: 129, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-034', name: '早安美芝城起司蛋餅', desc: '現做起司蛋餅，外皮金黃酥脆、內層嫩滑', price: 65, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-035', name: '福來招牌蛋餅加蛋', desc: '福來現桿麵皮蛋餅，加蛋加起司更滿足', price: 55, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-036', name: '哈肯鋪北海道生吐司', desc: '職人手作北海道生吐司，綿密柔軟如雲朵', price: 210, sizeLabel: 'L', img: '', colorKey: 'variant-6' },
      { id: 'cat-037', name: '樂田全麥核桃歐包', desc: '樂田職人歐式麵包，紮實中帶天然麥香與堅果', price: 180, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-038', name: '春日日曬手沖咖啡', desc: '衣索比亞日曬豆，果香明亮層次豐富', price: 130, sizeLabel: 'S', img: '', colorKey: 'variant-2' },
      { id: 'cat-039', name: '路易莎燕麥草莓拿鐵', desc: '期間限定燕麥奶草莓拿鐵，清甜不膩', price: 120, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-040', name: '摩斯唐揚雞腿堡', desc: '日式唐揚炸雞腿夾入軟糯米漢堡，鮮嫩多汁', price: 109, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
    ],
  },
  {
    key: 'style',
    title: '捷客，我的style',
    products: [
      { id: 'cat-041', name: 'Metro Team 路線托特帆布袋', desc: '捷運路線圖印花帆布袋，寬底好裝日常必備', price: 290, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-042', name: 'Metro Team 捷運限定馬克杯', desc: '捷運站名彩繪馬克杯，400ml 大容量陪你晨間時光', price: 390, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-043', name: 'Metro Team 捷運隨行保溫瓶', desc: '不鏽鋼輕量保溫瓶，印製捷運路線彩條，保溫12小時', price: 590, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-044', name: 'Metro Team 悠遊卡夾零錢包', desc: '附悠遊卡夾層的 PU 皮革零錢包，出站掃卡不用挖包包', price: 350, sizeLabel: 'S', img: '', colorKey: 'variant-2' },
      { id: 'cat-045', name: 'Metro Team 捷運地圖絲巾', desc: '台北捷運路線圖輕薄印花絲巾，造型又實用', price: 490, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-046', name: 'Metro Team 防潑水後背包', desc: '防潑水材質，捷運路線刺繡背帶，通勤首選', price: 790, sizeLabel: 'L', img: '', colorKey: 'variant-4' },
      { id: 'cat-047', name: 'Metro Team 吉祥物壓克力鑰匙圈', desc: '捷運吉祥物造型透明壓克力鑰匙圈，隨身小確幸', price: 120, sizeLabel: 'S', img: '', colorKey: 'variant-5' },
      { id: 'cat-048', name: 'Metro Team 捷運文具禮盒組', desc: '含原子筆、便利貼、書夾的捷運文具組，辦公室最潮', price: 290, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-049', name: 'Metro Team 刺繡棒球帽', desc: '台北捷運 LOGO 刺繡可調式棒球帽，遮陽又有型', price: 690, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-050', name: 'Metro Team 限定口袋筆記本', desc: 'A6 掌中筆記本，封面印台北捷運路線圖，隨時記錄靈感', price: 220, sizeLabel: 'S', img: '', colorKey: 'variant-2' },
    ],
  },
  {
    key: 'breakfast-merchants',
    title: '捷客早餐地圖',
    products: [
      { id: 'cat-051', name: '古早味飯糰', desc: '台灣傳統早餐鋪，現捏飯糰口味多樣，一顆飽足整個早晨', price: 40, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-052', name: '路易莎咖啡', desc: '台灣本土精品咖啡連鎖，莊園豆直送現磨，輕食早餐一條龍', price: 80, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-053', name: '摩斯漢堡', desc: '日系速食始祖，以在地米漢堡聞名，早餐套餐豐盛不將就', price: 89, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-054', name: '早安美芝城', desc: '台灣人氣早餐連鎖，現做蛋餅、三明治、吐司百搭自由配', price: 60, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-055', name: '福來早餐', desc: '在地口碑好評的早午餐店，現桿麵皮現做，吃得出職人心意', price: 50, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-056', name: '哈肯鋪', desc: '日式精品烘焙坊，招牌北海道生吐司綿密如雲，預購才搶得到', price: 150, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-057', name: '樂田麵包屋', desc: '堅持天然食材的職人烘焙，歐式麵包健康無添加', price: 120, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-058', name: '春日咖啡', desc: '精品單品咖啡專門店，手沖、義式並陳，每一杯都有風土溯源', price: 120, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-059', name: '美而美早餐', desc: '台灣街頭最親切的國民早餐店，銅板價吃飽，天天開心出門', price: 45, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-060', name: '丹堤咖啡', desc: '台灣本土咖啡老品牌，早餐組合超值，捷運站旁隨手來一杯', price: 75, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
    ],
  },
  {
    key: 'shopping-spots',
    title: '捷客逛街地圖',
    products: [
      { id: 'cat-061', name: '光華數位新天地', desc: '台北3C電子聖地，鍵盤滑鼠、漫畫扭蛋、電玩周邊應有盡有（光華商場）', price: 299, sizeLabel: 'L', img: '', colorKey: 'variant-1' },
      { id: 'cat-062', name: '誠品生活南西', desc: '中山站旁的文化生活地標，書籍、選品、展覽三合一（中山站商圈）', price: 350, sizeLabel: 'L', img: '', colorKey: 'variant-2' },
      { id: 'cat-063', name: '台北101', desc: '信義商圈最高地標，國際精品、景觀餐廳、觀景台一次滿足（信義商圈）', price: 600, sizeLabel: 'L', img: '', colorKey: 'variant-3' },
      { id: 'cat-064', name: '萬年商業大樓', desc: '西門町文化老靈魂，古著、扭蛋、格鬥電玩，挖寶不設限（西門町）', price: 100, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-065', name: '舊香居二手書店', desc: '公館文青必訪，絕版台灣文學、日文古書，淘書如尋寶（公館商圈）', price: 80, sizeLabel: 'S', img: '', colorKey: 'variant-5' },
      { id: 'cat-066', name: 'SOGO忠孝館', desc: '東區商圈百貨龍頭，日系品牌與國際精品匯聚，週年慶必衝（東區商圈）', price: 990, sizeLabel: 'L', img: '', colorKey: 'variant-6' },
      { id: 'cat-067', name: '建國假日花市', desc: '週末限定的露天市集，花卉、盆栽、玉石精品，慢活最佳解方（建國花市）', price: 150, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-068', name: '五分埔流行廣場', desc: '批發平價服飾集散地，最新穿搭全在這，捷運後山站步行即達（五分埔商圈）', price: 199, sizeLabel: 'L', img: '', colorKey: 'variant-2' },
      { id: 'cat-069', name: '鼎泰豐永康街', desc: '米其林推薦的小籠包創始店，湯汁飽滿排隊也值得（永康街商圈）', price: 280, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-070', name: 'LaLaport 蔦屋書店', desc: '台灣首座蔦屋書店，精選書籍與生活美學選品，逛一圈就上癮（南港LaLaport）', price: 450, sizeLabel: 'L', img: '', colorKey: 'variant-4' },
    ],
  },
  {
    key: 'districts',
    title: '台北必逛商圈',
    products: [
      { id: 'cat-071', name: '光華商場', desc: '台北最大3C電子賣場，電競周邊、二手漫畫、模型公仔全在這', price: 199, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-072', name: '中山站商圈', desc: '時尚精品、獨立咖啡廳、質感選品店密集，週末散步首選', price: 350, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-073', name: '信義商圈', desc: '台北最繁華的精華商業區，百貨、精品、夜景一次到位', price: 500, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-074', name: '西門町', desc: '台北最熱鬧的青年潮流聖地，電影、古著、街頭文化齊聚', price: 100, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-075', name: '公館商圈', desc: '台大周邊的文青學生商圈，二手書、素食、創意小店雲集', price: 80, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-076', name: '東區商圈、東區地下街', desc: '精品百貨林立，地下街延伸購物體驗，潮牌旗艦店必朝聖', price: 500, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-077', name: '天母商圈、天母創意市集', desc: '台北最具異國風情的高檔生活商圈，市集、選物店、餐廳水準高', price: 300, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-078', name: '五分埔商圈', desc: '批發服飾平價時尚天堂，新品週週到，穿搭控必逛', price: 150, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
      { id: 'cat-079', name: '士林夜市', desc: '台灣最知名夜市，大餅包小餅、豪大雞排、芋頭大福一條街', price: 100, sizeLabel: 'M', img: '', colorKey: 'variant-1' },
      { id: 'cat-080', name: '後站商圈（華陰街）', desc: '3C零件、電腦維修、二手機的行家聖地，台北版秋葉原', price: 200, sizeLabel: 'M', img: '', colorKey: 'variant-2' },
      { id: 'cat-081', name: '建國花市、玉市', desc: '週末限定露天市集，鮮花、玉石、文玩，慢活台北的最佳解方', price: 100, sizeLabel: 'M', img: '', colorKey: 'variant-3' },
      { id: 'cat-082', name: '大稻埕商圈', desc: '迪化街百年老街，南北乾貨、傳統布料與新興文創店並肩而立', price: 150, sizeLabel: 'M', img: '', colorKey: 'variant-4' },
      { id: 'cat-083', name: '永康街商圈', desc: '巷弄美食、知名甜點、文創選品匯聚的精緻生活圈，慢走才夠', price: 200, sizeLabel: 'M', img: '', colorKey: 'variant-5' },
      { id: 'cat-084', name: '南港LaLaport', desc: '台灣首座LaLaport，日系品牌、蔦屋書店、多元餐廳一站搞定', price: 400, sizeLabel: 'M', img: '', colorKey: 'variant-6' },
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
