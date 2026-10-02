import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ArrowDownRight, CalendarClock, ChevronDown, Clock3, Percent, Tag, Target, X } from 'lucide-react'
import CoPilotOrb from '../icons/CoPilotOrb'
import ProjectionChart from './ProjectionChart'
import { buildProjection } from '../utils/projection'
import { addDays, formatLakh, formatShortDate } from '../utils/format'
import { GOAL, PORTFOLIO } from '../utils/portfolio'
import { cn } from '../utils/cn'

const SPRING = { type: 'spring', damping: 32, stiffness: 320, mass: 0.9 }

/**
 * The core case solution: an explainable AI intervention that interrupts the
 * "Pause SIP" tap, shows the cost of pausing, and offers softer alternatives —
 * while always leaving the full pause available.
 */
export default function InterventionSheet({ open, onClose, onChoose }) {
  const projection = useMemo(() => buildProjection(), [])
  const dragControls = useDragControls()
  const [whyOpen, setWhyOpen] = useState(false)
  const resumeDate = formatShortDate(addDays(new Date(), 60))
  const extraUnits = Math.round(projection.extraUnitsPct * 100)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="absolute inset-0 z-30 bg-slate-900/25 backdrop-blur-xl backdrop-saturate-150"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.section
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="copilot-title"
            className="absolute inset-x-0 bottom-0 z-40 flex max-h-[94%] flex-col rounded-t-[32px] bg-white/95 shadow-sheet backdrop-blur-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
          >
            {/* Drag handle + header (drag zone) */}
            <div
              className="shrink-0 cursor-grab touch-none px-5 pt-2.5 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="mx-auto h-[5px] w-9 rounded-full bg-black/15" />
              <div className="mt-3 flex items-center gap-2.5">
                <CoPilotOrb size={30} />
                <div className="leading-tight">
                  <div className="text-[14px] font-semibold">AI Co-Pilot</div>
                  <div className="text-[12px] text-ios-secondary">Explainable insight · just now</div>
                </div>
                <button
                  onClick={onClose}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-ios-fill text-ios-secondary transition active:scale-90"
                  aria-label="Close and keep SIP running"
                >
                  <X size={16} strokeWidth={2.6} />
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-safe">
              {/* The hook */}
              <Stagger i={0}>
                <h2 id="copilot-title" className="mt-4 text-[26px] font-bold leading-[1.15] tracking-tight">
                  Wait! The market is down {Math.abs(Math.round(PORTFOLIO.drawdownPct))}%.{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Units are currently on sale.
                  </span>
                </h2>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-500/20">
                  <Tag size={14} strokeWidth={2.4} />
                  Your ₹5,000 buys ~{extraUnits}% more units today
                </div>
              </Stagger>

              {/* XAI chart */}
              <Stagger i={1}>
                <div className="mt-5 rounded-3xl border border-black/[0.06] bg-ios-bg/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-ios-secondary">
                      Your money in 5 years
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-600 shadow-sm">
                      XAI
                    </span>
                  </div>
                  <ProjectionChart projection={projection} />

                  <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                      <ArrowDownRight size={18} strokeWidth={2.6} />
                    </div>
                    <p className="text-[13px] leading-snug text-ios-secondary">
                      Pausing could cost you{' '}
                      <span className="font-bold text-rose-500">{formatLakh(projection.gap, { decimals: 0 })}</span> and push
                      your <span className="font-semibold text-ios-label">{GOAL.name.toLowerCase()}</span> past {GOAL.year}.
                    </p>
                  </div>
                </div>
              </Stagger>

              {/* Why am I seeing this? */}
              <Stagger i={2}>
                <button
                  onClick={() => setWhyOpen((o) => !o)}
                  className="mt-3 flex w-full items-center justify-between rounded-2xl px-1 py-2 text-[14px] font-semibold text-indigo-600"
                  aria-expanded={whyOpen}
                >
                  Why is Co-Pilot suggesting this?
                  <ChevronDown size={18} className={cn('transition-transform duration-300', whyOpen && 'rotate-180')} />
                </button>
                <AnimatePresence initial={false}>
                  {whyOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <Reason Icon={Percent} tone="rose" title="Market is 12.4% below its peak" body="Same SIP, lower NAV — every instalment now buys more units." />
                      <Reason Icon={Target} tone="indigo" title={`${GOAL.year - new Date().getFullYear()} years to your goal`} body="Long horizons historically absorb short-term corrections." />
                      <Reason Icon={Clock3} tone="emerald" title="No missed debits in 14 months" body="Your cash flow looks healthy, so this looks like a market reaction, not a budget problem." />
                      <p className="px-1 pb-1 pt-2 text-[11px] leading-snug text-ios-secondary">
                        Illustrative projection using historical Nifty 50 recovery patterns. Returns are not guaranteed. You stay in control.
                      </p>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </Stagger>

              {/* Choice architecture */}
              <Stagger i={3}>
                <div className="mt-3 space-y-2.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onChoose('stepdown')}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-left text-white shadow-glow"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.25)_45%,transparent_65%)] bg-[length:200%_100%] animate-shimmer" />
                    <span className="relative flex items-center justify-between">
                      <span>
                        <span className="block text-[16px] font-semibold">Reduce SIP to ₹1,000 temporarily</span>
                        <span className="mt-0.5 block text-[12px] text-white/75">
                          Smart Step-Down · keep buying cheap units, auto-restores in 3 months
                        </span>
                      </span>
                      <span className="ml-3 shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        Best
                      </span>
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onChoose('smartpause')}
                    className="flex w-full items-center gap-3 rounded-2xl border-[1.5px] border-indigo-600/25 bg-white px-5 py-3.5 text-left transition hover:border-indigo-600/50"
                  >
                    <CalendarClock size={20} className="shrink-0 text-indigo-600" strokeWidth={2.2} />
                    <span>
                      <span className="block text-[16px] font-semibold text-indigo-600">Pause for 60 Days only</span>
                      <span className="block text-[12px] text-ios-secondary">Smart Pause · auto-resumes on {resumeDate}</span>
                    </span>
                  </motion.button>

                  <button
                    onClick={() => onChoose('paused')}
                    className="w-full py-3 text-center text-[14px] font-medium text-ios-secondary transition hover:text-ios-label"
                  >
                    Proceed with full pause
                  </button>
                </div>
              </Stagger>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}

function Stagger({ i, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const TONES = {
  rose: 'bg-rose-50 text-rose-500',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
}

function Reason({ Icon, tone, title, body }) {
  return (
    <li className="flex gap-3 border-b border-ios-separator px-1 py-2.5 last-of-type:border-0">
      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', TONES[tone])}>
        <Icon size={16} strokeWidth={2.4} />
      </span>
      <span className="leading-snug">
        <span className="block text-[14px] font-semibold">{title}</span>
        <span className="block text-[13px] text-ios-secondary">{body}</span>
      </span>
    </li>
  )
}

