import { getRiskMeta } from '../data/mockData'

/**
 * Small colored pill that labels a risk level, e.g. "High Risk".
 * `level` accepts any of: Low | Moderate | High | Very High
 */
export default function RiskBadge({ level, size = 'md', suffix = ' Risk' }) {
  const meta = getRiskMeta(level)
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size]}`}
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {level}
      {suffix}
    </span>
  )
}
