import { motion } from 'framer-motion'
import { TrendingDown, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { PORTFOLIO } from '../utils/portfolio'
import { formatINR } from '../utils/format'

export default function PortfolioHeroCard() {
  const [hidden, setHidden] = useState(false)
  const pnl = PORTFOLIO.value - PORTFOLIO.invested

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-4 overflow-hidden rounded-[28px] bg-[#0B0B12] p-5 text-white shadow-[0_20px_40px_-16px_rgba(15,15,30,0.55)]"
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-rose-500/25 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <span className="text-[13px] font-medium text-white/60">Total portfolio value</span>
        <button
          onClick={() => setHidden((h) => !h)}
          className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 active:scale-90"
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative mt-1 text-[40px] font-bold leading-none tracking-tight tabular">
        {hidden ? '₹ ••••••' : formatINR(PORTFOLIO.value).replace('₹', '₹ ')}
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-1 text-[13px] font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/30">
          <TrendingDown size={14} strokeWidth={2.6} />
          {PORTFOLIO.drawdownPct}% (Market Correction)
        </span>
        <span className="text-[13px] text-white/50 tabular">{formatINR(pnl).replace('₹-', '-₹')} overall</span>
      </div>

      <div className="relative -mx-5 mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PORTFOLIO.trail} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 4000', 'dataMax + 2000']} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#FB7185"
              strokeWidth={2}
              fill="url(#heroFill)"
              isAnimationActive
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-1 grid grid-cols-3 gap-2 border-t border-white/10 pt-3.5 text-[12px]">
        <Stat label="Invested" value={formatINR(PORTFOLIO.invested)} />
        <Stat label="Today" value={formatINR(PORTFOLIO.todayChange).replace('₹-', '-₹')} tone="neg" />
        <Stat label="XIRR" value="-9.8%" tone="neg" />
      </div>
    </motion.section>
  )
}

function Stat({ label, value, tone }) {
  return (
    <div>
      <div className="text-white/45">{label}</div>
      <div className={`mt-0.5 text-[14px] font-semibold tabular ${tone === 'neg' ? 'text-rose-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}
