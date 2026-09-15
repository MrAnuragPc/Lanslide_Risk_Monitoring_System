import { getRiskLevelFromScore, getRiskMeta } from '../data/mockData'

/**
 * Circular progress gauge used to visualize a 0–100 risk / probability score.
 * Purely presentational — pass `score` and optionally override the color.
 */
export default function RiskGauge({
  score = 0,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  color,
  centerContent = null,
  trackColor = '#E5E7EB',
}) {
  const clamped = Math.max(0, Math.min(100, score))
  const level = getRiskLevelFromScore(clamped)
  const meta = getRiskMeta(level)
  const resolvedColor = color || meta.color
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (clamped / 100) * circumference

  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {centerContent ? (
          centerContent
        ) : showValue ? (
          <span className="font-display font-bold" style={{ color: resolvedColor, fontSize: size * 0.22 }}>
            {clamped}%
          </span>
        ) : null}
      </div>
    </div>
  )
}
