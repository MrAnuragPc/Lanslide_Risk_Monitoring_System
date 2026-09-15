import { useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Menu } from 'lucide-react'

/**
 * Shared dark navy top bar.
 * - `back`: shows a back arrow that navigates to history[-1] (or `backTo` if given)
 * - otherwise shows a hamburger icon that opens the mobile navigation drawer
 * - `right`: optional node rendered on the right (icon button, filter, etc.)
 */
export default function PageHeader({ title, back = false, backTo, right = null }) {
  const navigate = useNavigate()
  const { openDrawer } = useOutletContext() || {}

  function handleLeftClick() {
    if (back) {
      backTo ? navigate(backTo) : navigate(-1)
    } else if (openDrawer) {
      openDrawer()
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-navy-900 text-white px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleLeftClick}
          className={`shrink-0 w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition-colors ${
            back ? '' : 'lg:hidden'
          }`}
          aria-label={back ? 'Go back' : 'Open menu'}
        >
          {back ? <ArrowLeft size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="font-display font-semibold text-base sm:text-lg truncate">{title}</h1>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </header>
  )
}
