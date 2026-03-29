import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarker } from './MapMarker';
import type { Site, GovernorateMarker } from '@/lib/types';

// Jordan bounds
const JORDAN_BOUNDS: L.LatLngBoundsExpression = [
  [29.0, 34.8],
  [33.5, 39.5],
];
const JORDAN_CENTER: [number, number] = [31.5, 36.0];
const JORDAN_ZOOM = 8;

// Governorate marker icon — larger, with label
const governorateIcon = new L.DivIcon({
  className: 'governorate-marker',
  html: `<div style="
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #0074ae 0%, #0090d9 100%);
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0, 116, 174, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 11px;
    font-family: 'Tajawal', sans-serif;
    cursor: pointer;
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

// Component to programmatically fly to a location
function FlyToHandler({ center, zoom }: { center: [number, number] | null; zoom: number | null }): null {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [map, center, zoom]);
  return null;
}

interface JordanMapProps {
  sites: Site[];
  governorates: GovernorateMarker[];
  flyToCenter: [number, number] | null;
  flyToZoom: number | null;
  onGovernorateClick: (id: string) => void;
}

export function JordanMap({
  sites,
  governorates,
  flyToCenter,
  flyToZoom,
  onGovernorateClick,
}: JordanMapProps): React.ReactElement {
  const mapRef = useRef<L.Map | null>(null);

  // Memoize map to prevent re-renders
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={JORDAN_CENTER}
        zoom={JORDAN_ZOOM}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
        zoomControl={true}
        maxBounds={JORDAN_BOUNDS}
        minZoom={7}
        maxZoom={16}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FlyToHandler center={flyToCenter} zoom={flyToZoom} />

        {/* Governorate markers */}
        {governorates.map((gov) => (
          <Marker
            key={`gov-${gov.id}`}
            position={[gov.lat, gov.lng]}
            icon={governorateIcon}
            eventHandlers={{
              click: () => onGovernorateClick(gov.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 text-center" dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                  {gov.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569' }}>
                  {gov.sitesCount} موقع أثري
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Site markers */}
        {sites.map((site) => (
          <MapMarker key={`site-${site.id}`} site={site} />
        ))}
      </MapContainer>
    ),
    [sites, governorates, flyToCenter, flyToZoom, onGovernorateClick]
  );

  return <div className="h-full w-full">{displayMap}</div>;
}
