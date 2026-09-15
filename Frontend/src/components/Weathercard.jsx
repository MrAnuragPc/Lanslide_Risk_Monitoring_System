import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react'

export default function WeatherCard({ location }) {
  const items = [
    { icon: Thermometer, label: 'Temperature', value: `${location.temperature}°C` },
    { icon: Droplets, label: 'Humidity', value: `${location.humidity}%` },
    { icon: CloudRain, label: 'Rainfall (24h)', value: `${location.rainfall24h} mm` },
    { icon: Wind, label: 'Condition', value: location.weather },
  ]

  return (
    <div className="rounded-xl2 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-navy-900">Weather Info</h3>
        <span className="text-xs text-slate-400">{location.shortName}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-navy-900/5 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-brand-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 leading-none mb-1">{label}</p>
              <p className="text-sm font-semibold text-navy-900 leading-none truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
