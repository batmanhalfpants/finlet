import { Area, ComposedChart, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatLakh } from '../utils/format'

const GREEN = '#10B981' // emerald-500
const RED = '#F43F5E' // rose-500

/** XAI visual: keep-buying vs pause, five years out. */
export default function ProjectionChart({ projection }) {
  const { data, keepEnd, pauseEnd } = projection
  const last = data[data.length - 1]

  return (
    <div>
      <ul className="space-y-1.5 text-[13px]">
        <LegendRow color={GREEN} label="Keep buying the dip" value={`Projected ${formatLakh(keepEnd, { decimals: 0 })}`} />
        <LegendRow color={RED} label="Pause SIP" value={`Projected ${formatLakh(pauseEnd, { decimals: 0 })}`} dashed />
      </ul>

      <div className="-ml-1 mt-3 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart accessibilityLayer data={data} margin={{ top: 14, right: 48, bottom: 0, left: 18 }}>
            <defs>
              <linearGradient id="keepFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.22} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              type="number"
              domain={[0, 60]}
              ticks={[0, 12, 24, 36, 48, 60]}
              interval={0}
              tickFormatter={(m) => (m === 0 ? 'Now' : `${m / 12}Y`)}
              tick={{ fill: '#8E8E93', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[200000, 'dataMax + 60000']} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(60,60,67,0.25)', strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey="keep"
              stroke="none"
              fill="url(#keepFill)"
              isAnimationActive
              animationDuration={1400}
              animationBegin={250}
            />
            <Line
              type="monotone"
              dataKey="pause"
              stroke={RED}
              strokeWidth={2.5}
              strokeDasharray="6 5"
              dot={false}
              activeDot={{ r: 4, fill: RED, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1400}
              animationBegin={250}
            />
            <Line
              type="monotone"
              dataKey="keep"
              stroke={GREEN}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4.5, fill: GREEN, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1400}
              animationBegin={250}
            />
            <ReferenceDot x={60} y={last.keep} r={4.5} fill={GREEN} stroke="#fff" strokeWidth={2} label={endLabel(formatLakh(keepEnd, { decimals: 0 }), GREEN)} />
            <ReferenceDot x={60} y={last.pause} r={4.5} fill={RED} stroke="#fff" strokeWidth={2} label={endLabel(formatLakh(pauseEnd, { decimals: 0 }), RED)} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function endLabel(text, fill) {
  return { value: text, position: 'right', offset: 8, fill, fontSize: 13, fontWeight: 700 }
}

function LegendRow({ color, label, value, dashed }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg width="18" height="6" aria-hidden="true">
        <line x1="1" y1="3" x2="17" y2="3" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={dashed ? '4 4' : undefined} />
      </svg>
      <span className="font-semibold text-ios-label">{label}</span>
      <span className="ml-auto whitespace-nowrap font-medium tabular" style={{ color }}>
        {value}
      </span>
    </li>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  const when = label === 0 ? 'Today' : `Year ${Math.floor(label / 12)}${label % 12 ? `, month ${label % 12}` : ''}`
  return (
    <div className="rounded-xl border border-black/5 bg-white/90 px-3 py-2 text-[12px] shadow-card backdrop-blur-md">
      <div className="mb-1 font-semibold text-ios-secondary">{when}</div>
      <div className="flex justify-between gap-4 tabular">
        <span className="text-emerald-600">Keep</span>
        <span className="font-semibold">{formatLakh(row.keep)}</span>
      </div>
      <div className="flex justify-between gap-4 tabular">
        <span className="text-rose-500">Pause</span>
        <span className="font-semibold">{formatLakh(row.pause)}</span>
      </div>
    </div>
  )
}
