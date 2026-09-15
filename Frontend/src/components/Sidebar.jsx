import { NavLink } from 'react-router-dom'
import { Home, Map, Camera, Bell, User, MountainSnow } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'Risk Map', icon: Map },
  { to: '/analyze', label: 'Photo Analysis', icon: Camera },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-navy-900 text-white min-h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-brand-teal/20 flex items-center justify-center">
          <MountainSnow size={20} className="text-brand-teal" />
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-tight">TerraGuard</p>
          <p className="text-[11px] text-white/50 leading-tight">Early Warning System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-teal text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 mx-3 mb-4 rounded-xl bg-white/5">
        <p className="text-xs text-white/50 leading-relaxed">
          Predictions combine rainfall, slope and terrain data. Always follow official local
          authority warnings.
        </p>
      </div>
    </aside>
  )
}
