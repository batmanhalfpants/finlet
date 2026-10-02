import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import PortfolioHeroCard from './components/PortfolioHeroCard'
import GoalCard from './components/GoalCard'
import SipCard from './components/SipCard'
import TabBar from './components/TabBar'
import AnalyzingOverlay from './components/AnalyzingOverlay'
import InterventionSheet from './components/InterventionSheet'
import Toast from './components/Toast'
import CoPilotOrb from './icons/CoPilotOrb'
import { SIP } from './utils/portfolio'
import { addDays, addMonths, formatShortDate } from './utils/format'
import { KEEP_TARGET, PAUSE_TARGET } from './utils/projection'

/**
 * Prototype flow:
 *   'dashboard'  → user taps "Pause SIP"
 *   'analyzing'  → 1.5s frosted-glass AI analysis
 *   'intervention' → explainable bottom sheet with smart alternatives
 * Any choice (or dismiss) returns to 'dashboard' with the SIP updated.
 */
const ANALYZE_MS = 1500

const OUTCOMES = {
  stepdown: (now) => ({
    patch: { status: 'stepdown', currentAmount: 1000, until: addMonths(now, 3) },
    toast: {
      title: 'SIP stepped down to ₹1,000',
      body: `You're still buying the dip. Back to ₹5,000 on ${formatShortDate(addMonths(now, 3))}.`,
      tone: 'bg-emerald-100 text-emerald-600',
    },
  }),
  smartpause: (now) => ({
    patch: { status: 'smartpause', currentAmount: SIP.amount, until: addDays(now, 60) },
    toast: {
      title: 'Smart Pause set for 60 days',
      body: `Your SIP auto-resumes on ${formatShortDate(addDays(now, 60))}. We'll remind you a week before.`,
      tone: 'bg-indigo-100 text-indigo-600',
    },
  }),
  paused: () => ({
    patch: { status: 'paused', currentAmount: SIP.amount, until: null },
    toast: {
      title: 'SIP paused',
      body: 'Your choice, always. Resume anytime from this screen.',
      tone: 'bg-gray-100 text-gray-600',
    },
  }),
}

export default function App() {
  const [phase, setPhase] = useState('dashboard')
  const [sip, setSip] = useState(() => ({ ...SIP, status: 'active', currentAmount: SIP.amount, until: null }))
  const [toast, setToast] = useState(null)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const handlePause = () => {
    setPhase('analyzing')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPhase('intervention'), ANALYZE_MS)
  }

  const handleDismiss = () => {
    setPhase('dashboard')
    setToast({
      id: Date.now(),
      title: 'Great call — SIP stays at ₹5,000',
      body: 'Disciplined investors win the long game.',
      tone: 'bg-emerald-100 text-emerald-600',
    })
  }

  const handleChoose = (choice) => {
    const { patch, toast: t } = OUTCOMES[choice](new Date())
    setSip((s) => ({ ...s, ...patch }))
    setPhase('dashboard')
    // Let the sheet slide away before the banner drops in.
    setTimeout(() => setToast({ id: Date.now(), ...t }), 350)
  }

  const handleResume = () => {
    setSip((s) => ({ ...s, status: 'active', currentAmount: SIP.amount, until: null }))
    setToast({
      id: Date.now(),
      title: 'SIP back to ₹5,000 / month',
      body: 'Next debit on the 5th.',
      tone: 'bg-emerald-100 text-emerald-600',
    })
  }

  const clearToast = useCallback(() => setToast(null), [])

  // Goal progress reacts to the user's SIP decision.
  const goal = useMemo(() => {
    const projected = {
      active: KEEP_TARGET,
      stepdown: KEEP_TARGET * 0.97,
      smartpause: KEEP_TARGET * 0.95,
      paused: PAUSE_TARGET,
    }[sip.status]
    return { pct: (projected / KEEP_TARGET) * 100, status: sip.status === 'paused' ? 'risk' : 'ok' }
  }, [sip.status])

  const overlayActive = phase !== 'dashboard'

  return (
    <div className="flex min-h-[100dvh] items-center justify-center md:py-8">
      <div className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-ios-bg md:h-[880px] md:rounded-[48px] md:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.45),0_0_0_10px_#111,0_0_0_11px_#333]">
        <motion.main
          animate={{ scale: overlayActive ? 0.965 : 1, borderRadius: overlayActive ? 24 : 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="no-scrollbar h-full origin-top overflow-y-auto pb-28"
          aria-hidden={overlayActive}
        >
          <div className="sticky top-0 z-10 bg-ios-bg/80 backdrop-blur-xl">
            <StatusBar />
          </div>
          <Header />
          <PortfolioHeroCard />

          <CoPilotTip />

          <SectionTitle title="Active SIPs" action="Manage" />
          <SipCard sip={sip} onPause={handlePause} onResume={handleResume} />

          <SectionTitle title="Your goal" />
          <GoalCard onTrackPct={goal.pct} status={goal.status} />

          <p className="mx-6 mt-6 text-center text-[11px] leading-snug text-ios-secondary">
            Mutual fund investments are subject to market risks. Prototype for FinLit Ventures case competition.
          </p>
        </motion.main>

        <TabBar />
        <AnalyzingOverlay open={phase === 'analyzing'} />
        <InterventionSheet open={phase === 'intervention'} onClose={handleDismiss} onChoose={handleChoose} />
        <Toast toast={toast} onDone={clearToast} />
      </div>
    </div>
  )
}

function SectionTitle({ title, action }) {
  return (
    <div className="mx-5 mb-2.5 mt-6 flex items-baseline justify-between">
      <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
      {action && (
        <button className="flex items-center text-[15px] font-medium text-indigo-600">
          {action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

function CoPilotTip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-inset ring-indigo-500/10 backdrop-blur"
    >
      <CoPilotOrb size={28} />
      <p className="flex-1 text-[13px] leading-snug text-ios-secondary">
        <span className="font-semibold text-ios-label">Co-Pilot is watching.</span> Volatility is high this week — stay the
        course.
      </p>
      <Sparkles size={16} className="text-indigo-500" />
    </motion.div>
  )
}
