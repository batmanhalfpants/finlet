const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ₹2,45,000 — Indian digit grouping. */
export function formatINR(value) {
  return `₹${inr.format(Math.round(value))}`
}

/** ₹10L / ₹6.2L / ₹45K — compact Indian notation used on charts and badges. */
export function formatLakh(value, { decimals = 1 } = {}) {
  const abs = Math.abs(value)
  if (abs >= 1e7) return `₹${trim((value / 1e7).toFixed(decimals))}Cr`
  if (abs >= 1e5) return `₹${trim((value / 1e5).toFixed(decimals))}L`
  if (abs >= 1e3) return `₹${trim((value / 1e3).toFixed(0))}K`
  return `₹${Math.round(value)}`
}

function trim(str) {
  return str.replace(/\.0+$/, '')
}

/** "1 Dec" — short day-month for resume dates. */
export function formatShortDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
