import { Home, PieChart, Sparkles, User } from 'lucide-react'
import { cn } from '../utils/cn'

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'invest', label: 'Invest', Icon: PieChart },
  { id: 'copilot', label: 'Co-Pilot', Icon: Sparkles },
  { id: 'me', label: 'Profile', Icon: User },
]

/** Translucent iOS tab bar pinned to the bottom of the device frame. */
export default function TabBar({ active = 'home' }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/75 pb-safe backdrop-blur-xl backdrop-saturate-150">
      <ul className="flex justify-around px-2 pt-2">
        {TABS.map(({ id, label, Icon }) => (
          <li key={id}>
            <button
              className={cn(
                'flex w-16 flex-col items-center gap-0.5 text-[10px] font-medium transition active:scale-95',
                id === active ? 'text-indigo-600' : 'text-ios-secondary',
              )}
            >
              <Icon size={24} strokeWidth={id === active ? 2.4 : 2} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
