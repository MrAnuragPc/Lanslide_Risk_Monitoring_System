import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Share2, CloudRain, Info, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RiskGauge from '../components/RiskGauge'
import RiskBadge from '../components/RiskBadge'
import EnvironmentalFactors from '../components/EnvironmentalFactors'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { fetchLocationDetails, getRiskLevelFromScore, getRiskMeta } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'

export default function LocationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const {
    data: location,
    loading,
    error,
    refetch,
  } = useAsyncData((signal) => fetchLocationDetails(id, signal), [id])

  if (loading) {
    return (
      <div className="pb-6">
        <PageHeader title="Location Details" back />
        <LoadingState label="Loading location details…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="pb-6">
        <PageHeader title="Location Details" back />
        <ErrorState message="Couldn't load this location. Check your connection and try again." onRetry={refetch} />
      </div>
    )
  }

  const level = getRiskLevelFromScore(location.riskScore)
  const meta = getRiskMeta(level)

  async function handleShare() {
    const shareData = {
      title: `${location.name} — Landslide Risk`,
      text: `${location.name}: ${location.riskScore}% (${level} Risk) landslide risk right now.`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="pb-6">
      <PageHeader
        title="Location Details"
        back
        right={
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10"
            aria-label="Share"
            title="Share"
          >
            {copied ? <Check size={18} className="text-brand-teal" /> : <Share2 size={18} />}
          </button>
        }
      />

      {/* Hero */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 overflow-hidden">
        <svg className="absolute inset-x-0 bottom-0 w-full opacity-40" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0 100 L0 60 L60 20 L120 55 L180 15 L230 50 L280 25 L340 58 L400 30 L400 100 Z" fill="#0D9488" />
          <path d="M0 100 L0 75 L80 45 L150 70 L210 40 L270 68 L330 42 L400 65 L400 100 Z" fill="#0F1A2E" opacity="0.6" />
        </svg>
        {level === 'High' || level === 'Very High' ? (
          <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            {level} Risk Area
          </span>
        ) : (
          <span className="absolute top-4 right-4 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur">
            {level} Risk Area
          </span>
        )}
      </div>

      <div className="px-4 -mt-10 relative">
        <div className="bg-white rounded-xl2 shadow-cardHover p-4">
          <h2 className="font-display font-bold text-lg text-navy-900">{location.name}</h2>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Risk Score</p>
              <p className="font-display font-extrabold text-4xl text-navy-900 mt-0.5">{location.riskScore}%</p>
              <div className="mt-1.5">
                <RiskBadge level={level} size="sm" />
              </div>
            </div>
            <RiskGauge
              score={location.riskScore}
              size={96}
              strokeWidth={9}
              showValue={false}
              centerContent={
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <CloudRain size={17} className="text-slate-500" />
                </div>
              }
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
            Updated: {location.lastUpdated}
          </p>
        </div>

        <div className="mt-5">
          <EnvironmentalFactors location={location} />
        </div>

        <div className="mt-5 bg-white rounded-xl2 shadow-card p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-navy-900">Risk Probability (Next 24h)</h3>
            <span className="font-display font-bold text-sm" style={{ color: meta.color }}>
              {location.riskScore}%
            </span>
          </div>
          <div className="relative mt-5 mb-2">
            <div
              className="h-2.5 rounded-full"
              style={{ background: 'linear-gradient(to right, #16A34A, #EAB308, #F97316, #DC2626)' }}
            />
            <div
              className="absolute -top-2 w-0.5 h-6 bg-navy-900"
              style={{ left: `${location.riskScore}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl2 p-4 flex gap-3">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This assessment is based on AI prediction and environmental data. It should not
            replace official warnings from local authorities.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="w-full mt-5 bg-navy-900 text-white font-semibold text-sm rounded-xl2 py-3.5 hover:bg-navy-800 transition-colors"
        >
          Analyze This Area with a Photo
        </button>
      </div>
    </div>
  )
}
