import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Filter, RefreshCw, Radio } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import MapView from '../components/MapView'
import RiskBadge from '../components/RiskBadge'
import ErrorState from '../components/ErrorState'
import { fetchRiskZones, DEFAULT_LOCATION_ID, getLocationById, getRiskMeta } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'

const FILTERS = ['All Risk', 'Low', 'Moderate', 'High', 'Very High']
const LEGEND = [
  { label: 'Low', color: '#16A34A' },
  { label: 'Moderate', color: '#EAB308' },
  { label: 'High', color: '#F97316' },
  { label: 'Very High', color: '#DC2626' },
]

export default function RiskMap() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All Risk')
  const [selectedZone, setSelectedZone] = useState(null)
  const [syncedLabel, setSyncedLabel] = useState('Just now')

  const { data: zones, loading, error, refetch } = useAsyncData(fetchRiskZones, [])
  const center = getLocationById(DEFAULT_LOCATION_ID)

  // useAsyncData keeps the previous `zones` around while a refetch is in
  // flight, so a manual refresh doesn't have to blank the whole map — only
  // the very first load (no data yet at all) shows the full-screen state.
  const hasData = Boolean(zones)
  const showFullSpinner = loading && !hasData
  const showFullError = !loading && error && !hasData

  useEffect(() => {
    if (zones) setSyncedLabel('Just now')
  }, [zones])

  const filteredZones = useMemo(() => {
    if (!zones) return []
    if (filter === 'All Risk') return zones
    return zones.filter((z) => z.level === filter)
  }, [filter, zones])

  const stats = useMemo(() => {
    if (!zones || zones.length === 0) return null
    const highRiskCount = zones.filter((z) => z.level === 'High' || z.level === 'Very High').length
    const highest = zones.reduce((max, z) => (z.score > max.score ? z : max), zones[0])
    return { total: zones.length, highRiskCount, highest }
  }, [zones])

  return (
    <div>
      <PageHeader
        title="Risk Map"
        back
        right={
          <button
            onClick={() => {
              setFilter('All Risk')
              setSelectedZone(null)
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10"
            aria-label="Reset filters"
            title="Reset filters"
          >
            <Filter size={18} />
          </button>
        }
      />

      {/* Continuous dark header -> filters -> live-status band, matching the
          reference's monitoring-console look rather than a plain toolbar. */}
      <div className="bg-navy-900">
        <div className="px-4 pt-3 pb-2.5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f)
                  if (selectedZone && f !== 'All Risk' && selectedZone.level !== f) {
                    setSelectedZone(null)
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-brand-teal text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/70 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            </span>
            <span className="text-emerald-400 font-semibold shrink-0">Live</span>
            <span className="text-white/30 shrink-0">·</span>
            <span className="truncate">
              {showFullSpinner
                ? 'Syncing zones…'
                : stats
                  ? `${stats.total} zones monitored, ${stats.highRiskCount} at elevated risk`
                  : 'No zone data'}
            </span>
          </div>
          <button
            onClick={refetch}
            disabled={showFullSpinner}
            className="flex items-center gap-1.5 text-[11px] font-medium text-white/60 shrink-0 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading && hasData ? 'animate-spin' : ''} />
            {error && hasData ? 'Retry sync' : syncedLabel}
          </button>
        </div>
      </div>

      <div className="relative h-[60vh] min-h-[420px] lg:h-[65vh] bg-navy-950">
        {showFullSpinner && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/50">
            <Radio size={26} className="animate-pulse" />
            <p className="text-xs font-medium">Loading live risk data…</p>
          </div>
        )}

        {showFullError && (
          <ErrorState
            dark
            className="h-full"
            message="Couldn't load risk zones. Check your connection and try again."
            onRetry={refetch}
          />
        )}

        {hasData && (
          <MapView
            zones={filteredZones}
            center={[center.lat, center.lng]}
            selectedId={selectedZone?.id}
            onSelectZone={setSelectedZone}
            selectedLocation={null}
          />
        )}

        {hasData && (
          <div className="absolute left-3 bottom-3 z-[1000] bg-navy-900/85 backdrop-blur rounded-lg px-3 py-2 shadow-card flex items-center gap-3 text-[11px] font-medium text-white/90">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {selectedZone && (
        <button
          onClick={() => navigate(`/location/${selectedZone.id}`)}
          className="w-full text-left bg-navy-900 shadow-[0_-4px_16px_rgba(0,0,0,0.25)] px-4 py-4 flex gap-3 border-t-4"
          style={{ borderTopColor: getRiskMeta(selectedZone.level).color }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-white">{selectedZone.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xl font-display font-extrabold text-white">{selectedZone.score}%</span>
                  <RiskBadge level={selectedZone.level} size="sm" />
                </div>
              </div>
              <ChevronRight size={20} className="text-white/40 shrink-0" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
              <div>
                <p className="text-[11px] text-white/40">Rainfall (24h)</p>
                <p className="text-sm font-semibold text-white">{selectedZone.rainfall24h} mm</p>
              </div>
              <div>
                <p className="text-[11px] text-white/40">Humidity</p>
                <p className="text-sm font-semibold text-white">{selectedZone.humidity}%</p>
              </div>
              <div>
                <p className="text-[11px] text-white/40">Slope</p>
                <p className="text-sm font-semibold text-white">{selectedZone.slope}°</p>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
