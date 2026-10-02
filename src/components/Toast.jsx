import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'

/** iOS-style notification banner that drops in from the top. */
export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDone, 3600)
    return () => clearTimeout(t)
  }, [toast, onDone])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ y: -90, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => info.offset.y < -30 && onDone()}
          onClick={onDone}
          className="absolute inset-x-3 top-12 z-50 flex cursor-pointer items-start gap-3 rounded-[22px] border border-white/60 bg-white/80 p-3.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.3)] backdrop-blur-xl backdrop-saturate-150"
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toast.tone}`}>
            <CheckCircle2 size={20} strokeWidth={2.4} />
          </span>
          <div className="min-w-0 leading-snug">
            <div className="text-[14px] font-semibold">{toast.title}</div>
            <div className="text-[13px] text-ios-secondary">{toast.body}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
