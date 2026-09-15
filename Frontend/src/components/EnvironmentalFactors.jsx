import { CloudRain, Droplets, Thermometer, TrendingUp, Mountain } from 'lucide-react'

export default function EnvironmentalFactors({ location }) {
  const rows = [
    { icon: CloudRain, label: 'Rainfall (24h)', value: `${location.rainfall24h} mm` },
    { icon: CloudRain, label: 'Rainfall (7d)', value: `${location.rainfall7d} mm` },
    { icon: Droplets, label: 'Humidity', value: `${location.humidity}%` },
    { icon: Thermometer, label: 'Temperature', value: `${location.temperature}°C` },
    { icon: TrendingUp, label: 'Slope', value: `${location.slope}°` },
    { icon: Mountain, label: 'Elevation', value: `${location.elevation} m` },
  ]

  return (
    <div className="rounded-xl2 bg-white shadow-card p-4">
      <h3 className="font-display font-semibold text-navy-900 mb-3">Environmental Factors</h3>
      <div className="divide-y divide-slate-100">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Icon size={16} />
              <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-semibold text-navy-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
