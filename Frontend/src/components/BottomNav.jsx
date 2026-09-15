import { NavLink, useLocation } from 'react-router-dom'
import { Home, Map, Camera, Bell, User } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/analyze', label: 'Analyze', icon: Camera, isCenter: true },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  // The Home screen uses one continuous dark background all the way to the
  // nav bar (matching the reference design); every other page keeps the
  // original light nav bar sitting on their white/light content.
  const { pathname } = useLocation()
  const isDark = pathname === '/'

  return (
    <nav
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t safe-bottom ${
        isDark ? 'bg-navy-900 border-white/10' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, isCenter }) =>
          isCenter ? (
            <NavLink key={to} to={to} className="relative -top-4 flex-1 flex justify-center">
              {({ isActive }) => (
                <span
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isDark ? 'ring-4 ring-navy-900' : 'ring-4 ring-white'
                  } ${isActive ? 'scale-105' : ''}`}
                  style={{ background: 'linear-gradient(145deg, #F97316, #DC2626)' }}
                >
                  <Icon size={24} color="white" strokeWidth={2.2} />
                </span>
              )}
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
            >
              {({ isActive }) => {
                const activeColor = 'text-brand-teal'
                const inactiveColor = isDark ? 'text-white/50' : 'text-slate-400'
                const color = isActive ? activeColor : inactiveColor
                return (
                  <>
                    <Icon size={21} className={color} />
                    <span className={`text-[11px] font-medium ${color}`}>{label}</span>
                  </>
                )
              }}
            </NavLink>
          )
        )}
      </div>
    </nav>
  )
}
