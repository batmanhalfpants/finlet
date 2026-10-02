import { useId } from 'react'

/** Gradient "AI orb" mark used everywhere the Co-Pilot speaks. */
export default function CoPilotOrb({ size = 28, className }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="0.55" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id={`${id}-hl`} cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill={`url(#${id}-bg)`} />
      <circle cx="16" cy="16" r="16" fill={`url(#${id}-hl)`} />
      <path
        d="M16 7.5c.6 3.9 2.1 6 5.2 7.2.5.2.5.9 0 1.1-3.1 1.2-4.6 3.3-5.2 7.2-.1.6-.9.6-1 0-.6-3.9-2.1-6-5.2-7.2-.5-.2-.5-.9 0-1.1 3.1-1.2 4.6-3.3 5.2-7.2.1-.6.9-.6 1 0Z"
        fill="#fff"
      />
      <circle cx="23" cy="9.5" r="1.4" fill="#fff" opacity="0.85" />
    </svg>
  )
}
