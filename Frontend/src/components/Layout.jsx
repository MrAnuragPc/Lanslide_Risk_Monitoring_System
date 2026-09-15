import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileDrawer from './MobileDrawer'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="lg:flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <main className="pb-24 lg:pb-8 max-w-6xl mx-auto">
          <Outlet context={{ openDrawer: () => setDrawerOpen(true) }} />
        </main>
      </div>
      <BottomNav />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
