const u = (id) =>
  `url('https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80') center/cover no-repeat`

export function getCoupons() {
  return [
    {
      id: 'cpn-1',
      title: '誠品生活｜100元優惠券',
      point: 50,
      sub: '全台誠品生活櫃位皆可使用',
      img: u('1481627834876-b7833e8f5570'),
      colorKey: 'variant-1'
    },
    {
      id: 'cpn-2',
      title: '台北捷運｜單程票 9 折',
      point: 20,
      sub: '限台北捷運各站使用',
      img: u('1517400508447-f8dd518b86db'),
      colorKey: 'variant-2'
    },
    {
      id: 'cpn-3',
      title: '星巴克｜大杯咖啡折 30 元',
      point: 40,
      sub: '全台星巴克門市適用',
      img: u('1509042239860-f550ce710b93'),
      colorKey: 'variant-3'
    },
    {
      id: 'cpn-4',
      title: '7-11｜拿鐵咖啡第二杯半價',
      point: 30,
      sub: '全台門市皆可兌換',
      img: u('1495474472287-4d71bcdd2085'),
      colorKey: 'variant-4'
    }
  ]
}
