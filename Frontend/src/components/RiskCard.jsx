import { CloudRain } from 'lucide-react'
import { getRiskLevelFromScore, getRiskMeta } from '../data/mockData'

export default function RiskCard({ location }) {
  const level = getRiskLevelFromScore(location.riskScore)
  const meta = getRiskMeta(level)
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const sweep = circumference * 0.3 // short decorative arc, not a literal progress ring

  return (
    <div className="rounded-xl2 bg-navy-800 text-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70 font-medium">Landslide Risk</p>
          <p className="font-display font-extrabold leading-tight mt-1" style={{ fontSize: 44, color: meta.color }}>
            {location.riskScore}%
          </p>
          <p className="font-display font-semibold text-lg mt-0.5" style={{ color: meta.color }}>
            {level} Risk
          </p>
        </div>

        <div className="relative w-16 h-16 shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={meta.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${sweep} ${circumference}`}
              transform="rotate(-45 32 32)"
            />
          </svg>
          <div className="absolute top-0 right-0">
            <CloudRain size={20} className="text-white" />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-white/60">Last Updated: {location.lastUpdated}</p>
      </div>
    </div>
  )
}
