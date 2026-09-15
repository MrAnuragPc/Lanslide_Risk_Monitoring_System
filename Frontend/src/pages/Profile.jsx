import { useNavigate } from 'react-router-dom'
import {
  Bookmark,
  BellRing,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { fetchUserProfile } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'
import { logout } from '../api/auth'

export default function Profile() {
  const navigate = useNavigate()
  const { data: userProfile, loading, error, refetch } = useAsyncData(fetchUserProfile, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (loading) return <PageShell><LoadingState label="Loading profile…" /></PageShell>
  if (error) {
    return (
      <PageShell>
        <ErrorState message="Couldn't load your profile. Check your connection and try again." onRetry={refetch} />
      </PageShell>
    )
  }

  const savedLocationNames = userProfile.savedLocations.map((l) => l.name).join(', ')

  const menuItems = [
    {
      icon: Bookmark,
      label: 'Saved Locations',
      hint: savedLocationNames,
      onClick: () => navigate('/map'),
    },
    {
      icon: BellRing,
      label: 'Alert Settings',
      hint: userProfile.notifyHighRisk ? 'High & moderate risk on' : 'Notifications off',
      onClick: () => navigate('/alerts'),
    },
    { icon: HelpCircle, label: 'Help & Support', hint: 'FAQs, contact us' },
    { icon: Info, label: 'About App', hint: 'Version 1.0.0' },
  ]

  return (
    <PageShell>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl2 shadow-card p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-navy-900/10 flex items-center justify-center shrink-0">
            <User size={26} className="text-navy-900" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy-900 truncate">{userProfile.name}</p>
            <p className="text-sm text-slate-400 truncate">{userProfile.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 lg:mt-0 lg:col-span-2">
        <div className="bg-white rounded-xl2 shadow-card divide-y divide-slate-100 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, hint, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={!onClick}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors disabled:hover:bg-transparent"
            >
              <div className="w-9 h-9 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0">
                <Icon size={17} className="text-brand-teal" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-navy-900">{label}</p>
                {hint && <p className="text-xs text-slate-400 truncate mt-0.5">{hint}</p>}
              </div>
              {onClick && <ChevronRight size={18} className="text-slate-300 shrink-0" />}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-semibold text-sm rounded-xl2 py-3.5 hover:bg-red-50 transition-colors shadow-card"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </PageShell>
  )
}

function PageShell({ children }) {
  return (
    <div className="pb-6">
      <PageHeader title="Profile" back />
      <div className="px-4 pt-5 lg:grid lg:grid-cols-3 lg:gap-8">{children}</div>
    </div>
  )
}
