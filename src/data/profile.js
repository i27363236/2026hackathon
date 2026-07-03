// Current user's basic info. Single source for HomeView's point balance + redemption goal.

export function getProfile() {
  return {
    name: '小捷',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    points: 15,               // 捷運點 balance
    expiringPoints: 4,
    expiringDate: '5/15',
    coupons: 3,
    expiringCoupons: 1,
    goalProductId: 'cat-007', // 香草布丁燒 — redemption goal shown in summary
  }
}
