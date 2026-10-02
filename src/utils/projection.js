import { PORTFOLIO, SIP, GOAL } from './portfolio'

/**
 * Explainable wealth projection used by the Co-Pilot chart.
 *
 * Two scenarios over a 5-year horizon, month by month:
 *  - "keep":  current corpus + ₹5,000/month SIP, with the units bought during
 *             the correction priced 12.4% cheaper (the "dip bonus").
 *  - "pause": corpus stays invested, but no fresh units are bought. Behavioural
 *             data on panic-pausers shows most resume late at higher prices, so
 *             the curve flattens as the gap to the "keep" line widens.
 *
 * Both curves are calibrated to the case-dossier targets (₹10L vs ₹6L) so the
 * prototype tells a consistent story. Illustrative only — not investment advice.
 */
const MONTHS = 60
export const KEEP_TARGET = GOAL.target // ₹10L
export const PAUSE_TARGET = 600000 // ₹6L

function sipFutureValue(rateMonthly, startCorpus, monthly, months, dipMonths, dipDiscount) {
  let corpus = startCorpus
  const path = [corpus]
  for (let m = 1; m <= months; m++) {
    corpus *= 1 + rateMonthly
    // Units bought during the correction are cheaper, so each rupee buys more.
    const boost = m <= dipMonths ? 1 / (1 - dipDiscount) : 1
    corpus += monthly * boost
    path.push(corpus)
  }
  return path
}

/** Solve for the monthly return that lands the keep-buying path on target. */
function solveRate(target) {
  let lo = 0
  let hi = 0.05
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const end = sipFutureValue(mid, PORTFOLIO.value, SIP.amount, MONTHS, 6, SIP.unitsDiscountPct / 100)
    if (end[MONTHS] > target) hi = mid
    else lo = mid
  }
  return (lo + hi) / 2
}

export function buildProjection() {
  const r = solveRate(KEEP_TARGET)
  const keep = sipFutureValue(r, PORTFOLIO.value, SIP.amount, MONTHS, 6, SIP.unitsDiscountPct / 100)

  // Pause path: same starting point, but its share of the keep-buying gains
  // shrinks over time (no fresh units, late re-entry), so it always sits below
  // the green line and flattens out towards the pause target.
  const endShare = (PAUSE_TARGET - PORTFOLIO.value) / (keep[MONTHS] - PORTFOLIO.value)
  const pause = keep.map((v, m) => {
    const share = 1 - (1 - endShare) * Math.pow(m / MONTHS, 0.55)
    return PORTFOLIO.value + (v - PORTFOLIO.value) * share
  })

  const data = keep.map((v, m) => ({
    month: m,
    keep: Math.round(v),
    pause: Math.round(pause[m]),
  }))

  return {
    data,
    keepEnd: keep[MONTHS],
    pauseEnd: pause[MONTHS],
    gap: keep[MONTHS] - pause[MONTHS],
    annualisedReturn: Math.pow(1 + r, 12) - 1,
    extraUnitsPct: SIP.unitsDiscountPct / (100 - SIP.unitsDiscountPct),
  }
}
