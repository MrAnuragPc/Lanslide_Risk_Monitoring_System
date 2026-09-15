import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Consistent "couldn't load, try again" UI for any page/section whose
 * useAsyncData() call failed. The frontend previously had no error-state
 * pattern anywhere — every mock fetch always succeeded — so this is new
 * infrastructure needed once real network calls can actually fail.
 */
export default function ErrorState({
  message = "Couldn't load this. Check your connection and try again.",
  onRetry,
  dark = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 px-6 text-center ${className}`}>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          dark ? 'bg-red-500/15' : 'bg-red-50'
        }`}
      >
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <p className={`text-sm font-medium max-w-xs ${dark ? 'text-white/70' : 'text-slate-600'}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
            dark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-navy-900 hover:bg-slate-200'
          }`}
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  )
}
