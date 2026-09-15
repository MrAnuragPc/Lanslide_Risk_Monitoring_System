import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

const TYPE_META = {
  high: { icon: AlertTriangle, bg: '#FEE2E2', fg: '#DC2626' },
  moderate: { icon: AlertCircle, bg: '#FEF9C3', fg: '#CA8A04' },
  info: { icon: Info, bg: '#DBEAFE', fg: '#2563EB' },
}

export default function AlertCard({ alert }) {
  const meta = TYPE_META[alert.type] || TYPE_META.info
  const Icon = meta.icon

  return (
    <div className="flex gap-3 bg-white rounded-xl2 shadow-card p-4">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: meta.bg }}
      >
        <Icon size={18} color={meta.fg} />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-navy-900 text-sm">{alert.title}</h4>
        <p className="text-sm text-slate-500 mt-0.5 leading-snug">{alert.message}</p>
        <p className="text-xs text-slate-400 mt-1.5">{alert.timestamp}</p>
      </div>
    </div>
  )
}
