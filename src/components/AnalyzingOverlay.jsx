import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CoPilotOrb from '../icons/CoPilotOrb'

const STEPS = ['Reading market drawdown', 'Checking your 2031 goal', 'Projecting both paths']

/** Full-screen frosted-glass "thinking" state shown before the intervention. */
export default function AnalyzingOverlay({ open }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!open) return
    setStep(0)
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 500)
    return () => clearInterval(t)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/60 px-10 backdrop-blur-xl backdrop-saturate-150"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative flex h-24 w-24 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-pulseRing" />
            <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulseRing [animation-delay:0.5s]" />
            {/* spinner ring */}
            <svg className="absolute inset-0 animate-spin [animation-duration:1.1s]" viewBox="0 0 96 96">
              <defs>
                <linearGradient id="spin" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="4" />
              <path d="M48 4a44 44 0 0 1 44 44" fill="none" stroke="url(#spin)" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <CoPilotOrb size={52} />
          </motion.div>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-7 text-center text-[19px] font-semibold leading-snug tracking-tight text-ios-label"
          >
            AI Co-Pilot analyzing your portfolio health...
          </motion.p>

          <div className="mt-3 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center text-[14px] text-ios-secondary"
              >
                {STEPS[step]}…
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
