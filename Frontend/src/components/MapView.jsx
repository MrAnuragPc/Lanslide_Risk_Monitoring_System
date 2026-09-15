import { useState, Fragment } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Tooltip, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Locate, Layers, Check } from 'lucide-react'
import { getRiskMeta } from '../data/mockData'

// Fix default marker icon paths, a well-known Vite + Leaflet bundling quirk.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Satellite/terrain imagery reads as an actual monitoring surface — a plain
// street map makes even a real risk model look like a generic directions app.
const BASE_LAYERS = {
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Tiles &copy; OpenTopoMap',
  },
  street: {
    name: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
}

// Reference towns, purely decorative map furniture so the overlay reads as a
// real monitored region instead of a handful of floating circles.
const CITY_LABELS = [
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, primary: true },
  { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
  { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
]

function cityDivIcon(name, primary) {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;align-items:center;gap:6px;transform:translate(-3px,-3px);pointer-events:none;">
        <span style="width:${primary ? 13 : 9}px;height:${primary ? 13 : 9}px;border-radius:9999px;
          background:${primary ? '#38BDF8' : 'transparent'};border:2px solid #fff;
          box-shadow:0 0 0 3px rgba(0,0,0,0.28);"></span>
        <span style="color:#fff;font-size:12.5px;font-weight:700;letter-spacing:.01em;
          text-shadow:0 1px 5px rgba(0,0,0,0.95),0 0 2px rgba(0,0,0,0.9);white-space:nowrap;">${name}</span>
      </div>`,
    iconSize: [0, 0],
  })
}

function pulseDivIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:18px;height:18px;">
        <span class="risk-pulse" style="position:absolute;inset:0;border-radius:9999px;background:${color};"></span>
        <span style="position:relative;width:10px;height:10px;border-radius:9999px;background:${color};border:2px solid white;"></span>
      </span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function LocateButton({ center }) {
  const map = useMap()
  return (
    <button
      onClick={() => map.flyTo(center, 10, { duration: 0.8 })}
      className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-navy-900 active:scale-95 transition-transform"
      aria-label="Center on current location"
      type="button"
    >
      <Locate size={19} />
    </button>
  )
}

function LayerToggle({ activeLayer, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      {open && (
        <button
          className="fixed inset-0 z-[999] cursor-default"
          onClick={() => setOpen(false)}
          aria-label="Close layer menu"
          tabIndex={-1}
        />
      )}
      {open && (
        <div className="absolute bottom-0 right-14 z-[1000] w-36 bg-white rounded-xl shadow-lg overflow-hidden py-1">
          {Object.entries(BASE_LAYERS).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => {
                onChange(key)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-navy-900 hover:bg-slate-50"
            >
              {layer.name}
              {activeLayer === key && <Check size={14} className="text-brand-teal" />}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-[1000] w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-navy-900 active:scale-95 transition-transform"
        aria-label="Change map layer"
        type="button"
      >
        <Layers size={18} />
      </button>
    </div>
  )
}

export default function MapView({ zones, center, selectedId, onSelectZone, selectedLocation }) {
  const [activeLayer, setActiveLayer] = useState('satellite')
  const selectedZone = zones.find((z) => z.id === selectedId)

  return (
    <MapContainer center={center} zoom={9} scrollWheelZoom zoomControl={false} className="w-full h-full">
      <TileLayer
        key={activeLayer}
        attribution={BASE_LAYERS[activeLayer].attribution}
        url={BASE_LAYERS[activeLayer].url}
      />

      {/* Layered, soft-edged circles per zone simulate a blended risk heatmap
          instead of flat, hard-edged bubbles. */}
      {zones.map((zone) => {
        const meta = getRiskMeta(zone.level)
        const isSelected = zone.id === selectedId
        const handlers = { click: () => onSelectZone(zone) }
        return (
          <Fragment key={zone.id}>
            <Circle
              center={[zone.lat, zone.lng]}
              radius={zone.radius * 2.1}
              pathOptions={{ stroke: false, fillColor: meta.color, fillOpacity: 0.08 }}
              eventHandlers={handlers}
            />
            <Circle
              center={[zone.lat, zone.lng]}
              radius={zone.radius * 1.4}
              pathOptions={{ stroke: false, fillColor: meta.color, fillOpacity: 0.18 }}
              eventHandlers={handlers}
            />
            <Circle
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                fillColor: meta.color,
                fillOpacity: isSelected ? 0.62 : 0.4,
                color: meta.color,
                weight: isSelected ? 2.5 : 0,
                opacity: 0.9,
              }}
              eventHandlers={handlers}
            >
              {(zone.level === 'Very High' || zone.level === 'High') && (
                <Tooltip permanent direction="center" className="risk-score-tooltip" opacity={1}>
                  {zone.score}%
                </Tooltip>
              )}
            </Circle>
          </Fragment>
        )
      })}

      {/* Reference town labels ground the overlay in real geography */}
      {CITY_LABELS.map((city) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={cityDivIcon(city.name, city.primary)}
          interactive={false}
        />
      ))}

      {/* Radar-style ping on the currently selected zone */}
      {selectedZone && (
        <Marker
          position={[selectedZone.lat, selectedZone.lng]}
          icon={pulseDivIcon(getRiskMeta(selectedZone.level).color)}
          interactive={false}
        />
      )}

      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>{selectedLocation.name}</Popup>
        </Marker>
      )}

      <div className="absolute z-[1000] bottom-8 right-3 pointer-events-none">
        <div className="flex flex-col gap-2.5 pointer-events-auto">
          <LayerToggle activeLayer={activeLayer} onChange={setActiveLayer} />
          <LocateButton center={center} />
        </div>
      </div>
    </MapContainer>
  )
}
