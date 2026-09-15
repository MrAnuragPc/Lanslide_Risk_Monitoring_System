import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, Camera, X, ChevronRight, Mountain, ImageOff } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RiskBadge from '../components/RiskBadge'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { fetchRecentAnalyses, uploadPhotoForAnalysis } from '../data/mockData'
import { useAsyncData } from '../hooks/useAsyncData'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export default function PhotoAnalysis() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const uploadControllerRef = useRef(null)

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')

  const {
    data: recentAnalyses,
    loading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useAsyncData(fetchRecentAnalyses, [])

  function handleFile(selected) {
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Please upload a JPG or PNG image.')
      return
    }
    if (selected.size > MAX_SIZE) {
      setError('Image must be smaller than 10 MB.')
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setError('')
    setUploadError('')
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function clearFile() {
    // Removing the image also cancels any upload already in flight for it.
    uploadControllerRef.current?.abort()
    setUploading(false)
    setUploadProgress(0)
    setUploadError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  async function handleAnalyze() {
    if (!file || !previewUrl) return
    setUploadError('')
    setUploading(true)
    setUploadProgress(0)

    const controller = new AbortController()
    uploadControllerRef.current = controller

    try {
      const result = await uploadPhotoForAnalysis(file, {
        onProgress: setUploadProgress,
        signal: controller.signal,
      })
      // The result is already computed — AnalysisResult just displays it,
      // it doesn't need to fetch or re-analyze anything itself.
      navigate('/result', { state: { imageUrl: previewUrl, fileName: file.name, result } })
    } catch (err) {
      if (err?.name === 'AbortError') return // user cancelled — stay on this page quietly
      setUploadError(err?.message || 'Upload failed. Please check your connection and try again.')
      setUploading(false)
    }
  }

  function handleCancelUpload() {
    uploadControllerRef.current?.abort()
    setUploading(false)
    setUploadProgress(0)
  }

  return (
    <div className="pb-6">
      <PageHeader title="Photo Analysis" back />

      <div className="px-4 pt-5 lg:grid lg:grid-cols-2 lg:gap-8">
        <div>
          {!previewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl2 py-12 px-6 cursor-pointer transition-colors ${
                dragActive ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-navy-900/5 flex items-center justify-center mb-4">
                <UploadCloud size={26} className="text-slate-400" />
              </div>
              <p className="font-semibold text-navy-900">Upload or Capture an Image</p>
              <p className="text-xs text-slate-400 mt-1">Drag &amp; drop, or click to browse</p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG (Max. 10MB)</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  cameraInputRef.current?.click()
                }}
                className="mt-5 inline-flex items-center gap-2 bg-brand-teal text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal-700 transition-colors"
              >
                <Camera size={16} />
                Capture Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="relative rounded-xl2 overflow-hidden shadow-card">
              <img src={previewUrl} alt="Selected slope preview" className="w-full h-64 object-cover" />
              <button
                onClick={clearFile}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/65"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                <p className="text-white text-xs font-medium truncate">{file?.name}</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          {uploadError && <p className="text-sm text-red-600 mt-3">{uploadError}</p>}

          {uploading ? (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>{uploadProgress < 100 ? 'Uploading…' : 'Analyzing…'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-brand-teal transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <button
                onClick={handleCancelUpload}
                className="w-full mt-3 text-sm font-semibold text-slate-500 hover:text-slate-700 py-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={!file}
              className="w-full mt-4 bg-navy-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl2 py-3.5 hover:bg-navy-800 transition-colors"
            >
              Analyze Image
            </button>
          )}
        </div>

        <div className="mt-8 lg:mt-0">
          <h3 className="font-display font-semibold text-navy-900 mb-3">Recent Analysis</h3>

          {recentLoading && <LoadingState label="Loading history…" />}
          {!recentLoading && recentError && (
            <ErrorState message="Couldn't load recent analyses." onRetry={refetchRecent} />
          )}
          {!recentLoading && !recentError && (
            <div className="space-y-3">
              {recentAnalyses.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate('/result', { state: { recentItem: item } })}
                  className="w-full flex items-center gap-3 bg-white rounded-xl2 shadow-card p-3 text-left hover:shadow-cardHover transition-shadow"
                >
                  <div className="w-14 h-14 rounded-lg bg-navy-900/5 flex items-center justify-center shrink-0">
                    <Mountain size={20} className="text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.timestamp}</p>
                    <div className="mt-1">
                      <RiskBadge level={item.riskLevel} size="sm" suffix="" />
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 shrink-0" />
                </button>
              ))}
              {recentAnalyses.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <ImageOff size={28} className="mx-auto mb-2" />
                  <p className="text-sm">No analyses yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
