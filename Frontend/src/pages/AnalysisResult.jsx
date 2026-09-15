import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Info, Mountain, RefreshCcw, ImageOff } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RiskGauge from '../components/RiskGauge'
import { mockDetectionResult } from '../data/mockData'

function getInstabilityMeta(score) {
  if (score <= 30) return { label: 'Low', color: '#16A34A' }
  if (score <= 55) return { label: 'Moderate', color: '#EAB308' }
  if (score <= 80) return { label: 'High', color: '#F97316' }
  return { label: 'Very High', color: '#DC2626' }
}

// recentAnalyses history entries only store a score/level, not full
// indicator/box detail (a real backend would persist the original analysis
// output; the mock history list doesn't model that). This rebuilds a
// display-ready result from the indicator template so a past entry's own
// score is still what's shown, rather than always the same generic result.
function buildHistoricalResult(recentItem) {
  const score = recentItem.instabilityScore
  const detectedCount = score <= 30 ? 0 : score <= 55 ? 1 : score <= 80 ? 3 : 4
  return {
    ...mockDetectionResult,
    instabilityScore: score,
    indicators: mockDetectionResult.indicators.map((ind, i) => ({
      ...ind,
      detected: i < detectedCount,
    })),
  }
}

export default function AnalysisResult() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const imageUrl = state?.imageUrl || null
  const recentItem = state?.recentItem || null
  // A fresh upload already arrives with its finished result (PhotoAnalysis
  // awaits uploadPhotoForAnalysis before navigating here) — this page never
  // needs to fetch or simulate anything itself, only display what it was
  // handed.
  const result = state?.result || (recentItem ? buildHistoricalResult(recentItem) : null)
  const title = recentItem?.title || state?.fileName || 'Uploaded Photo'

  if (!result) {
    return (
      <div className="pb-6">
        <PageHeader title="Analysis Result" back />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <ImageOff size={32} className="text-slate-300 mb-4" />
          <p className="font-semibold text-navy-900">No analysis to show</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Upload or capture a photo to run a new analysis, or pick a past one from your history.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="mt-5 bg-navy-900 text-white font-semibold text-sm rounded-xl2 px-5 py-3 hover:bg-navy-800 transition-colors"
          >
            Go to Photo Analysis
          </button>
        </div>
      </div>
    )
  }

  const meta = getInstabilityMeta(result.instabilityScore)

  return (
    <div className="pb-6">
      <PageHeader title="Analysis Result" back />

      <div className="px-4 pt-5 lg:grid lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="relative rounded-xl2 overflow-hidden shadow-card bg-navy-900">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-950">
                <Mountain size={40} className="text-white/30" />
              </div>
            )}

            {imageUrl &&
              result.boxes.map((box, i) => (
                <div
                  key={i}
                  className="absolute border-2 border-dashed border-red-500 rounded-sm"
                  style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.w * 100}%`,
                    height: `${box.h * 100}%`,
                  }}
                >
                  <span className="absolute -top-5 left-0 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap">
                    {box.label}
                  </span>
                </div>
              ))}

            <span
              className="absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            >
              {meta.label} Instability Detected
            </span>
          </div>

          <div className="mt-5 bg-white rounded-xl2 shadow-card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Instability Score</p>
              <p className="font-display font-extrabold text-4xl mt-0.5" style={{ color: meta.color }}>
                {result.instabilityScore}%
              </p>
              <p className="font-display font-semibold mt-0.5" style={{ color: meta.color }}>
                {meta.label} Instability
              </p>
            </div>
            <RiskGauge score={result.instabilityScore} size={90} strokeWidth={9} color={meta.color} />
          </div>
        </div>

        <div className="mt-5 lg:mt-0">
          <div className="bg-white rounded-xl2 shadow-card p-4">
            <h3 className="font-display font-semibold text-navy-900 mb-3">Detected Indicators</h3>
            <div className="space-y-2.5">
              {result.indicators.map((ind) => (
                <div key={ind.id} className="flex items-center gap-2.5">
                  {ind.detected ? (
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  )}
                  <span className="text-sm text-navy-900">{ind.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-teal-50 border border-teal-200 rounded-xl2 p-4 flex gap-3">
            <Info size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-800 leading-relaxed">
              Image analysis provides visual indicators of potential instability. It does not
              independently confirm that a landslide will occur.
            </p>
          </div>

          <button
            onClick={() => navigate('/analyze')}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-navy-900 text-white font-semibold text-sm rounded-xl2 py-3.5 hover:bg-navy-800 transition-colors"
          >
            <RefreshCcw size={15} />
            Analyze Another Photo
          </button>
        </div>
      </div>
    </div>
  )
}
