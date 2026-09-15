import { useMemo, useState } from 'react'
import { BellOff } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import AlertCard from '../components/AlertCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { fetchAlerts } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High Risk' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'info', label: 'Information' },
]

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const { data: alerts, loading, error, refetch } = useAsyncData(fetchAlerts, [])

  const filtered = useMemo(() => {
    if (!alerts) return []
    if (filter === 'all') return alerts
    return alerts.filter((a) => a.type === filter)
  }, [filter, alerts])

  return (
    <div className="pb-6">
      <PageHeader title="Alerts" back />

      <div className="px-4 py-3 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingState label="Loading alerts…" />}
      {!loading && error && (
        <ErrorState message="Couldn't load alerts. Check your connection and try again." onRetry={refetch} />
      )}

      {!loading && !error && (
        <div className="px-4 pt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-400">
              <BellOff size={28} className="mx-auto mb-2" />
              <p className="text-sm">No alerts in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
