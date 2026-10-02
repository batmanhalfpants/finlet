import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, PauseCircle, PlayCircle, ShieldCheck, TrendingDown } from 'lucide-react'
import IndexFundIcon from '../icons/IndexFundIcon'
import { formatINR, formatShortDate } from '../utils/format'
import { cn } from '../utils/cn'

/**
 * Active SIP row. `sip.status` is one of:
 *   active | stepdown | smartpause | paused
 */
export default function SipCard({ sip, onPause, onResume }) {
  const meta = STATUS_META[sip.status]

  return (
    <motion.div layout className="mx-4 rounded-3xl bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <IndexFundIcon />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[16px] font-semibold tracking-tight">{sip.fund}</div>
          <div className="truncate text-[13px] text-ios-secondary">{sip.house}</div>
        </div>
        <div className="text-right">
          <motion.div
            key={sip.currentAmount}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('text-[16px] font-semibold tabular', sip.status === 'paused' && 'text-ios-secondary line-through')}
          >
            {formatINR(sip.currentAmount)}
          </motion.div>
          <div className="text-[12px] text-ios-secondary">/ month</div>
        </div>
      </div>

      <div className="my-3.5 h-px bg-ios-separator" />

      <div className="flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sip.status}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="flex min-w-0 items-center gap-2"
          >
            <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', meta.iconBg)}>
              <meta.Icon size={15} strokeWidth={2.4} className={meta.iconColor} />
            </span>
            <div className="min-w-0 leading-tight">
              <div className={cn('text-[13px] font-semibold', meta.textColor)}>{meta.title}</div>
              <div className="text-[12px] text-ios-secondary">{meta.subtitle(sip)}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        {sip.status === 'active' ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onPause}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(244,63,94,0.7)] transition hover:bg-rose-600"
          >
            <PauseCircle size={17} strokeWidth={2.5} />
            Pause SIP
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onResume}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-ios-fill px-3.5 py-2.5 text-[14px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            <PlayCircle size={17} strokeWidth={2.5} />
            {RESUME_LABEL[sip.status]}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

const RESUME_LABEL = { stepdown: 'Restore', smartpause: 'Resume now', paused: 'Resume' }

const STATUS_META = {
  active: {
    Icon: TrendingDown,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    textColor: 'text-ios-label',
    title: 'Next debit on 5th',
    subtitle: (s) => `NAV ${s.navChangePct}% this month`,
  },
  stepdown: {
    Icon: ShieldCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-700',
    title: 'Smart Step-Down',
    subtitle: (s) => `Back to ${formatINR(s.amount)} on ${formatShortDate(s.until)}`,
  },
  smartpause: {
    Icon: CalendarClock,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    textColor: 'text-indigo-700',
    title: 'Smart Pause · 60 days',
    subtitle: (s) => `Resumes on ${formatShortDate(s.until)}`,
  },
  paused: {
    Icon: PauseCircle,
    iconBg: 'bg-ios-fill',
    iconColor: 'text-ios-secondary',
    textColor: 'text-ios-secondary',
    title: 'SIP paused',
    subtitle: () => 'Resume anytime',
  },
}
