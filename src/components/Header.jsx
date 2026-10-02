import { Bell } from 'lucide-react'
import { greeting } from '../utils/format'
import { USER } from '../utils/portfolio'

export default function Header() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <header className="flex items-end justify-between px-5 pb-4 pt-2">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-wide text-ios-secondary">{today}</p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight">
          {greeting()}, {USER.firstName}
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card active:scale-95 transition"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2.2} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[14px] font-semibold text-white shadow-card active:scale-95 transition"
          aria-label="Profile"
        >
          {USER.initials}
        </button>
      </div>
    </header>
  )
}
