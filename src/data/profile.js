// Current user's basic info. Single source for HomeView's point balance + redemption goal.

export function getProfile() {
  return {
    points: 15,               // 捷運點 balance
    expiringPoints: 4,
    expiringDate: '5/15',
    coupons: 3,
    expiringCoupons: 1,
    goalProductId: 'cat-007', // 香草布丁燒 — redemption goal shown in summary
  }
}
