/**
 * Mock portfolio for the prototype. Numbers are internally consistent:
 * invested ₹2.8L, current value ₹2.45L → -12.4% drawdown.
 */
export const USER = {
  firstName: 'Kabir',
  initials: 'KM',
}

export const PORTFOLIO = {
  value: 245000,
  invested: 279700,
  drawdownPct: -12.4,
  todayChange: -3820,
  // 30-day value trail for the hero sparkline (shows the correction)
  trail: [
    279.7, 281.2, 283.0, 282.1, 284.6, 286.9, 285.3, 283.4, 279.8, 276.1, 272.9, 274.0, 269.5,
    265.2, 262.8, 266.1, 261.0, 257.4, 255.9, 258.2, 253.1, 250.6, 252.4, 248.9, 247.2, 249.8,
    246.1, 244.0, 248.8, 245.0,
  ].map((v, i) => ({ d: i, v: v * 1000 })),
}

export const GOAL = {
  name: 'Home down payment',
  target: 1000000,
  year: 2031,
}

export const SIP = {
  id: 'nifty50',
  fund: 'Nifty 50 Index Fund',
  house: 'UTI Mutual Fund · Direct Growth',
  amount: 5000,
  dayOfMonth: 5,
  navChangePct: -12.4,
  unitsDiscountPct: 12.4,
}
