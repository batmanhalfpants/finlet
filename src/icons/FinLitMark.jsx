import { useId } from 'react'

/** FinLit app mark: rounded square with a recovering trend line. */
export default function FinLitMark({ size = 28, className }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${id})`} />
      <path
        d="M16 42l10-10 7 7 13-17"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
