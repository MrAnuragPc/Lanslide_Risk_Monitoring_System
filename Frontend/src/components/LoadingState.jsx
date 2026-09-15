/**
 * Consistent loading indicator for any page/section waiting on an API call.
 * `dark` switches the palette for use on the app's dark-navy surfaces
 * (Home hero, Risk Map) vs. the default light ones.
 */
export default function LoadingState({ label = 'Loading…', dark = false, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 px-6 text-center ${className}`}>
      <div
        className={`w-10 h-10 rounded-full border-4 animate-spin ${
          dark ? 'border-white/15 border-t-brand-teal' : 'border-slate-200 border-t-brand-teal'
        }`}
      />
      <p className={`text-sm font-medium ${dark ? 'text-white/60' : 'text-slate-500'}`}>{label}</p>
    </div>
  )
}
