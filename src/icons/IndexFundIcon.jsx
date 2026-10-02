/** Squircle fund avatar, like the merchant logos in iOS finance apps. */
export default function IndexFundIcon({ size = 44 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 18V11M9.33 18V6M14.67 18v-9M20 18V4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}
