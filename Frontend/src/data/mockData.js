// ============================================================================
// DATA LAYER
// ----------------------------------------------------------------------------
// Every value the UI renders is read from here instead of being hard-coded
// inside components. Each exported fetch* function is a real async data
// call: in mock mode (the default — see src/api/config.js) it resolves the
// local mock objects below after a short simulated delay; with
// VITE_USE_MOCK_DATA=false it calls the real backend through src/api/client.js
// instead. Either way every fetch* function returns the same shape and
// accepts an optional AbortSignal, so no component needs to change based on
// which mode is active.
// ============================================================================

import { apiGet, apiUpload } from '../api/client.js'
import { USE_MOCK_DATA } from '../api/config.js'

function mockDelay(value, { ms = 150, signal } = {}) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => resolve(value), ms)
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(id)
        const err = new Error('Aborted')
        err.name = 'AbortError'
        reject(err)
      })
    }
  })
} 

export const RISK_LEVELS = {
  Low: { label: 'Low', min: 0, max: 20, color: '#16A34A', bg: '#DCFCE7', text: '#166534' },
  Moderate: { label: 'Moderate', min: 21, max: 40, color: '#EAB308', bg: '#FEF9C3', text: '#854D0E' },
  High: { label: 'High', min: 41, max: 60, color: '#F97316', bg: '#FFEDD5', text: '#9A3412' },
  'Very High': { label: 'Very High', min: 61, max: 100, color: '#DC2626', bg: '#FEE2E2', text: '#991B1B' },
}

export function getRiskLevelFromScore(score) {
  if (score <= 20) return 'Low'
  if (score <= 40) return 'Moderate'
  if (score <= 60) return 'High'
  return 'Very High'
}

export function getRiskMeta(levelOrScore) {
  const level = typeof levelOrScore === 'number' ? getRiskLevelFromScore(levelOrScore) : levelOrScore
  return RISK_LEVELS[level] || RISK_LEVELS.Low
}

// ----------------------------------------------------------------------------
// Locations
// ----------------------------------------------------------------------------

export const locations = [
  {
    id: 'guwahati',
    name: 'Guwahati, Assam',
    shortName: 'Guwahati',
    lat: 26.1445,
    lng: 91.7362,
    riskScore: 82,
    rainfall24h: 180,
    rainfall7d: 430,
    humidity: 85,
    temperature: 28,
    slope: 32,
    elevation: 95,
    lastUpdated: 'Today, 10:30 AM',
    weather: 'Heavy Rain',
  },
  {
    id: 'shillong',
    name: 'Shillong, Meghalaya',
    shortName: 'Shillong',
    lat: 25.5788,
    lng: 91.8933,
    riskScore: 64,
    rainfall24h: 140,
    rainfall7d: 360,
    humidity: 88,
    temperature: 21,
    slope: 38,
    elevation: 1496,
    lastUpdated: 'Today, 10:15 AM',
    weather: 'Overcast',
  },
  {
    id: 'itanagar',
    name: 'Itanagar, Arunachal Pradesh',
    shortName: 'Itanagar',
    lat: 27.0844,
    lng: 93.6053,
    riskScore: 35,
    rainfall24h: 45,
    rainfall7d: 150,
    humidity: 70,
    temperature: 26,
    slope: 24,
    elevation: 350,
    lastUpdated: 'Today, 9:50 AM',
    weather: 'Partly Cloudy',
  },
  {
    id: 'dibrugarh',
    name: 'Dibrugarh, Assam',
    shortName: 'Dibrugarh',
    lat: 27.4728,
    lng: 94.912,
    riskScore: 18,
    rainfall24h: 12,
    rainfall7d: 60,
    humidity: 62,
    temperature: 30,
    slope: 9,
    elevation: 108,
    lastUpdated: 'Today, 9:40 AM',
    weather: 'Clear',
  },
]

export const DEFAULT_LOCATION_ID = 'guwahati'

// Sync, local-only lookups — used for small non-critical things like an
// initial map center coordinate, never for rendering "live" risk data
// (that always goes through the fetch* functions below).
export function getLocationById(id) {
  return locations.find((l) => l.id === id) || locations[0]
}

/**
 * Resolves an id to a full location-shaped object whether it refers to one
 * of the primary `locations` or to a map `riskZones` entry (clicked on the
 * Risk Map). Zones don't carry every field a real API would return, so a
 * few secondary attributes are derived for display purposes only. This is
 * the mock-mode implementation behind fetchLocationDetails() below.
 */
function getDetailsById(id) {
  const loc = locations.find((l) => l.id === id)
  if (loc) return loc

  const zone = riskZones.find((z) => z.id === id)
  if (zone) {
    return {
      id: zone.id,
      name: zone.name,
      shortName: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      riskScore: zone.score,
      rainfall24h: zone.rainfall24h,
      rainfall7d: Math.round(zone.rainfall24h * 2.4),
      humidity: zone.humidity,
      temperature: 24,
      slope: zone.slope,
      elevation: Math.round(zone.slope * 15),
      lastUpdated: 'Today, 10:30 AM',
      weather: zone.score > 60 ? 'Heavy Rain' : zone.score > 30 ? 'Overcast' : 'Clear',
    }
  }

  return locations[0]
}

/** List of monitorable locations, e.g. for the Home location picker. */
export async function fetchLocations(signal) {
  if (!USE_MOCK_DATA) return apiGet('/locations', { signal })
  return mockDelay(locations, { signal })
}

/** Live risk snapshot for one location (Home's risk card). */
export async function fetchCurrentRisk(locationId = DEFAULT_LOCATION_ID, signal) {
  if (!USE_MOCK_DATA) return apiGet(`/locations/${locationId}/risk`, { signal })
  return mockDelay(getLocationById(locationId), { signal })
}

/** Full detail record for a location OR a map risk zone (Location Details page). */
export async function fetchLocationDetails(id, signal) {
  if (!USE_MOCK_DATA) return apiGet(`/locations/${id}`, { signal })
  return mockDelay(getDetailsById(id), { signal })
}

// ----------------------------------------------------------------------------
// Risk map zones (mock heat-zone overlay data, centered around NE India)
// ----------------------------------------------------------------------------

export const riskZones = [
  { id: 'z1', name: 'Guwahati City', lat: 26.1445, lng: 91.7362, radius: 9000, score: 82, level: 'Very High', rainfall24h: 180, humidity: 85, slope: 32 },
  { id: 'z2', name: 'Narengi Hills', lat: 26.21, lng: 91.86, radius: 7000, score: 74, level: 'Very High', rainfall24h: 165, humidity: 83, slope: 35 },
  { id: 'z3', name: 'Barapani Ridge', lat: 26.05, lng: 91.95, radius: 8500, score: 68, level: 'High', rainfall24h: 150, humidity: 80, slope: 30 },
  { id: 'z4', name: 'Nongpoh Slope', lat: 25.92, lng: 91.88, radius: 9500, score: 58, level: 'High', rainfall24h: 130, humidity: 78, slope: 27 },
  { id: 'z5', name: 'Umsning Belt', lat: 25.79, lng: 91.9, radius: 8000, score: 61, level: 'Very High', rainfall24h: 158, humidity: 81, slope: 34 },
  { id: 'z6', name: 'Shillong Peak', lat: 25.5788, lng: 91.8933, radius: 7500, score: 64, level: 'High', rainfall24h: 140, humidity: 88, slope: 38 },
  { id: 'z7', name: 'Rani Hills', lat: 26.3, lng: 91.6, radius: 6500, score: 44, level: 'High', rainfall24h: 95, humidity: 74, slope: 22 },
  { id: 'z8', name: 'Baksa Foothills', lat: 26.4, lng: 91.5, radius: 6000, score: 28, level: 'Moderate', rainfall24h: 60, humidity: 68, slope: 16 },
  { id: 'z9', name: 'Nalbari Plains', lat: 26.5, lng: 91.4, radius: 5500, score: 15, level: 'Low', rainfall24h: 25, humidity: 60, slope: 8 },
  { id: 'z10', name: 'Boko Uplands', lat: 25.95, lng: 91.6, radius: 6000, score: 33, level: 'Moderate', rainfall24h: 70, humidity: 71, slope: 19 },
]

export async function fetchRiskZones(signal) {
  if (!USE_MOCK_DATA) return apiGet('/risk-zones', { signal })
  return mockDelay(riskZones, { signal })
}

// ----------------------------------------------------------------------------
// Alerts
// ----------------------------------------------------------------------------

export const alerts = [
  {
    id: 'a1',
    type: 'high',
    title: 'High Risk Alert',
    message: 'Heavy rainfall is expected in your area in the next 24 hours.',
    timestamp: 'Today, 10:30 AM',
  },
  {
    id: 'a2',
    type: 'moderate',
    title: 'Moderate Risk Alert',
    message: 'Soil moisture levels are high. Be cautious near steep slopes.',
    timestamp: 'Today, 8:15 AM',
  },
  {
    id: 'a3',
    type: 'info',
    title: 'Weather Update',
    message: 'Light to moderate rainfall expected in the next 48 hours.',
    timestamp: 'Yesterday, 6:45 PM',
  },
  {
    id: 'a4',
    type: 'high',
    title: 'Slope Instability Detected',
    message: 'AI photo analysis flagged fresh soil cracks near Hill Area - 1.',
    timestamp: 'Yesterday, 2:10 PM',
  },
  {
    id: 'a5',
    type: 'info',
    title: 'System Update',
    message: 'Risk model recalibrated using the latest satellite rainfall data.',
    timestamp: '2 days ago',
  },
]

export async function fetchAlerts(signal) {
  if (!USE_MOCK_DATA) return apiGet('/alerts', { signal })
  return mockDelay(alerts, { signal })
}

// ----------------------------------------------------------------------------
// Photo analysis
// ----------------------------------------------------------------------------

export const recentAnalyses = [
  {
    id: 'p1',
    title: 'Hill Area - 1',
    timestamp: 'Today, 9:15 AM',
    riskLevel: 'High',
    instabilityScore: 76,
  },
  {
    id: 'p2',
    title: 'Roadside Slope',
    timestamp: 'Yesterday, 4:30 PM',
    riskLevel: 'Moderate',
    instabilityScore: 48,
  },
  {
    id: 'p3',
    title: 'Mountain Area',
    timestamp: '12 May 2024, 11:20 AM',
    riskLevel: 'Low',
    instabilityScore: 14,
  },
]

export async function fetchRecentAnalyses(signal) {
  if (!USE_MOCK_DATA) return apiGet('/analyses/recent', { signal })
  return mockDelay(recentAnalyses, { signal })
}

export const mockDetectionResult = {
  instabilityScore: 76,
  indicators: [
    { id: 'i1', label: 'Soil Cracks Detected', detected: true },
    { id: 'i2', label: 'Slope Disturbance', detected: true },
    { id: 'i3', label: 'Erosion Signs', detected: true },
    { id: 'i4', label: 'Loose Rocks Detected', detected: true },
  ],
  // Normalized (0–1) bounding boxes so they can be scaled to any preview size
  boxes: [
    { x: 0.08, y: 0.42, w: 0.22, h: 0.2, label: 'Soil Cracks' },
    { x: 0.36, y: 0.55, w: 0.24, h: 0.22, label: 'Erosion' },
    { x: 0.66, y: 0.4, w: 0.22, h: 0.24, label: 'Loose Rocks' },
    { x: 0.3, y: 0.18, w: 0.28, h: 0.2, label: 'Slope Disturbance' },
  ],
}

/**
 * Uploads a photo for AI instability analysis. Real mode POSTs multipart
 * form data (see src/api/client.js's apiUpload) and reports upload progress
 * via onProgress. Mock mode simulates the same progress + processing
 * experience with no backend running, so the UI can be built/tested against
 * it directly — swap USE_MOCK_DATA off and this function's real branch is
 * already wired to call POST /analyze.
 *
 * NOTE for a real backend: image analysis rarely completes within one HTTP
 * request/response. If /analyze instead returns a job id, replace the real
 * branch with a create-job call and poll (or subscribe to) a status
 * endpoint until it's done, then resolve with the final result — everything
 * downstream (AnalysisResult.jsx) only cares that this Promise eventually
 * resolves with a { instabilityScore, indicators, boxes } shaped result.
 */
export async function uploadPhotoForAnalysis(file, { onProgress, signal } = {}) {
  if (!USE_MOCK_DATA) {
    const formData = new FormData()
    formData.append('image', file)
    return apiUpload('/analyze', formData, { onProgress, signal })
  }

  return new Promise((resolve, reject) => {
    let pct = 0
    const tick = setInterval(() => {
      pct = Math.min(100, pct + 20)
      onProgress?.(pct)
      if (pct >= 100) {
        clearInterval(tick)
        setTimeout(() => resolve(mockDetectionResult), 500)
      }
    }, 150)

    if (signal) {
      signal.addEventListener('abort', () => {
        clearInterval(tick)
        const err = new Error('Upload cancelled.')
        err.name = 'AbortError'
        reject(err)
      })
    }
  })
}

// ----------------------------------------------------------------------------
// User profile
// ----------------------------------------------------------------------------

export const userProfile = {
  name: 'Ben Tennyson',
  email: 'Ben10@hotmail.com',
  phone: '+91 98765 43210',
  // Pre-resolved {id, name} pairs, not bare ids — this is the shape a real
  // /me endpoint would naturally return (it already knows the location
  // names), so the frontend doesn't need a second request or a client-side
  // join against the full locations list just to render this.
  savedLocations: [
    { id: 'guwahati', name: 'Guwahati' },
    { id: 'shillong', name: 'Shillong' },
  ],
  notifyHighRisk: true,
  notifyModerateRisk: true,
  notifyWeather: false,
}

export async function fetchUserProfile(signal) {
  if (!USE_MOCK_DATA) return apiGet('/me', { signal })
  return mockDelay(userProfile, { signal })
}
