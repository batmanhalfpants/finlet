import { Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { GOAL } from '../utils/portfolio'
import { formatLakh } from '../utils/format'

/** Goal progress — gives the Co-Pilot something concrete to protect. */
export default function GoalCard({ onTrackPct, status }) {
  const tone =
    status === 'risk'
      ? { bar: 'bg-rose-500', chip: 'bg-rose-50 text-rose-600', label: 'At risk' }
      : { bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700', label: 'On track' }

  return (
    <div className="mx-4 rounded-3xl bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-amber-100 text-amber-600">
          <Home size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold">{GOAL.name}</div>
          <div className="text-[13px] text-ios-secondary">
            {formatLakh(GOAL.target)} by {GOAL.year}
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${tone.chip}`}>{tone.label}</span>
      </div>
      <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-ios-fill">
        <motion.div
          className={`h-full rounded-full ${tone.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(onTrackPct, 100)}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-ios-secondary tabular">
        <span>Projected {Math.round(onTrackPct)}% of goal</span>
        <span>{GOAL.year - new Date().getFullYear()} yrs left</span>
      </div>
    </div>
  )
}
