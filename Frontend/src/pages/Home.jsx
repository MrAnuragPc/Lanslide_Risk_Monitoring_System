import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MapPin, ChevronDown, Map as MapIcon, Camera, CloudSun, BellRing } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RiskCard from '../components/RiskCard'
import WeatherCard from '../components/WeatherCard'
import AlertCard from '../components/AlertCard'
import StatCard from '../components/StatCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { fetchLocations, fetchCurrentRisk, fetchAlerts, DEFAULT_LOCATION_ID } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'

const OVERVIEW = [
  { label: 'Low', range: '0-20%', color: '#0D9488' },
  { label: 'Moderate', range: '21-40%', color: '#22C55E' },
  { label: 'High', range: '41-60%', color: '#F97316' },
  { label: 'Very High', range: '61-100%', color: '#DC2626' },
]

export default function Home() {
  const navigate = useNavigate()
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID)

  const {
    data: locationsList,
    loading: locationsLoading,
    error: locationsError,
    refetch: refetchLocations,
  } = useAsyncData(fetchLocations, [])

  const {
    data: location,
    loading: riskLoading,
    error: riskError,
    refetch: refetchRisk,
  } = useAsyncData((signal) => fetchCurrentRisk(locationId, signal), [locationId])

  const {
    data: alertsData,
    loading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts,
  } = useAsyncData(fetchAlerts, [])

  const quickActions = [
    { label: 'Check on Map', icon: MapIcon, onClick: () => navigate('/map') },
    { label: 'Send Photo', icon: Camera, onClick: () => navigate('/analyze') },
    { label: 'Weather Info', icon: CloudSun, onClick: () => navigate(`/location/${locationId}`) },
    { label: 'Alerts', icon: BellRing, onClick: () => navigate('/alerts') },
  ]

  return (
    <div>
      <PageHeader
        title=""
        right={
          <button
            onClick={() => navigate('/alerts')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-navy-900" />
          </button>
        }
      />

      <div className="px-4 pb-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
          {/* One continuous dark hero section: header -> title -> pill -> risk card -> overview -> quick actions */}
          <div className="lg:col-span-2 -mx-4 lg:mx-0 bg-navy-900 lg:rounded-2xl px-4 lg:px-6 pt-5 pb-6">
            <h1 className="font-display font-extrabold text-[28px] leading-[1.15] sm:text-3xl text-white text-center">
              Landslide Prediction &amp; Early Warning System
            </h1>
            <p className="text-white/60 mt-1.5 text-center">Stay Aware, Stay Safe</p>

            <div className="relative mt-4">
              {locationsError ? (
                <div className="flex items-center justify-between bg-white/10 rounded-full px-4 py-3 text-sm text-white/70">
                  <span>Couldn't load locations</span>
                  <button onClick={refetchLocations} className="text-xs font-semibold text-white underline shrink-0 ml-2">
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    disabled={locationsLoading}
                    className="w-full appearance-none bg-white rounded-full shadow-card pl-11 pr-9 py-3 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                    aria-label="Select location"
                  >
                    {locationsLoading && <option>Loading locations…</option>}
                    {!locationsLoading && (locationsList || []).map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal pointer-events-none" />
                  <ChevronDown size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </>
              )}
            </div>

            <div className="mt-4">
              {riskLoading && <LoadingState dark label="Loading risk data…" />}
              {!riskLoading && riskError && (
                <ErrorState
                  dark
                  message="Couldn't load risk data for this location."
                  onRetry={refetchRisk}
                />
              )}
              {!riskLoading && !riskError && location && <RiskCard location={location} />}
            </div>

            <section className="mt-6">
              <h2 className="font-display font-semibold text-white mb-3">Risk Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {OVERVIEW.map((item) => (
                  <StatCard key={item.label} label={item.label} value={item.range} color={item.color} textColor="#FFFFFF" />
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="font-display font-semibold text-white mb-3">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {quickActions.map(({ label, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl2 py-4 px-1 hover:bg-white/10 active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon size={19} className="text-white" />
                    </div>
                    <span className="text-[11px] font-medium text-white/80 text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="hidden lg:block space-y-6 mt-8">
            {location && <WeatherCard location={location} />}

            <div className="rounded-xl2 bg-white shadow-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-navy-900">Latest Alerts</h3>
                <button
                  onClick={() => navigate('/alerts')}
                  className="text-xs font-semibold text-brand-teal hover:underline"
                >
                  View all
                </button>
              </div>
              {alertsLoading && <LoadingState label="Loading alerts…" />}
              {!alertsLoading && alertsError && (
                <ErrorState message="Couldn't load alerts." onRetry={refetchAlerts} />
              )}
              {!alertsLoading && !alertsError && (
                <div className="space-y-3">
                  {alertsData.slice(0, 2).map((a) => (
                    <AlertCard key={a.id} alert={a} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
