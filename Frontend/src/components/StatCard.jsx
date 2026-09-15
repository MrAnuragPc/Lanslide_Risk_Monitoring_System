/**
 * Generic small stat tile. Used for the Risk Overview legend grid on Home,
 * and reusable anywhere a compact label + value + accent color is needed.
 */
export default function StatCard({ label, value, color, textColor, icon: Icon }) {
  return (
    <div
      className="rounded-xl px-3 py-3 flex flex-col gap-1.5 shadow-card"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: textColor }}>
          {label}
        </span>
        {Icon && <Icon size={14} color={textColor} />}
      </div>
      <span className="text-sm font-bold" style={{ color: textColor }}>
        {value}
      </span>
    </div>
  )
}
