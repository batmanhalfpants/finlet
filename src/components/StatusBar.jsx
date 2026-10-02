import { useEffect, useState } from 'react'
import { Signal, Wifi, BatteryFull } from 'lucide-react'
import { cn } from '../utils/cn'

/** Faux iOS status bar so the prototype reads as a native app on desktop. */
export default function StatusBar({ dark = false }) {
  const [time, setTime] = useState(() => now())

  useEffect(() => {
    const t = setInterval(() => setTime(now()), 15000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className={cn(
        'flex h-11 items-center justify-between px-7 text-[15px] font-semibold tabular',
        dark ? 'text-white' : 'text-ios-label',
      )}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={16} strokeWidth={2.6} />
        <Wifi size={16} strokeWidth={2.6} />
        <BatteryFull size={22} strokeWidth={1.8} />
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
}
