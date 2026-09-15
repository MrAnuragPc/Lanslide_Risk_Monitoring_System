import { NavLink } from 'react-router-dom'
import { Home, Map, Camera, Bell, User, MountainSnow, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'Risk Map', icon: Map },
  { to: '/analyze', label: 'Photo Analysis', icon: Camera },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function MobileDrawer({ open, onClose }) {
  return (
    <div
      className={`lg:hidden fixed inset-0 z-[1200] transition-opacity ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`absolute top-0 left-0 h-full w-72 max-w-[80%] bg-navy-900 text-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-teal/20 flex items-center justify-center">
              <MountainSnow size={20} className="text-brand-teal" />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">TerraGuard</p>
              <p className="text-[11px] text-white/50 leading-tight">Early Warning System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
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
      </div>
    </div>
  )
}
