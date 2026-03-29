import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import governoratesData from '@/data/governorates.json';
import type { GovernorateMarker } from '@/lib/types';

const governorates: GovernorateMarker[] = governoratesData;

// Jordan center coordinates and bounds
const JORDAN_CENTER: [number, number] = [31.5, 36.0];
const JORDAN_ZOOM = 7;

// Custom orange marker icon
const orangeMarkerIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #f96b09 0%, #ff8c3a 100%);
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(249, 107, 9, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
  ">
    <div style="
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    "></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

export function JordanMapPreview(): React.ReactElement {
  const navigate = useNavigate();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  function handleGovernorateClick(governorateId: string): void {
    navigate(`/sites?governorate=${governorateId}`);
  }

  return (
    <section className="py-16" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-10 opacity-0"
          style={{
            animation: isVisible ? 'fade-in-up 0.6s ease-out forwards' : 'none',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/10 text-blue text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>خريطة المواقع الأثرية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-3">
            استكشف المحافظات
          </h2>
          <p className="text-[#475569] max-w-xl mx-auto">
            انقر على أي محافظة لاستكشاف مواقعها الأثرية
          </p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg border border-border/50 overflow-hidden opacity-0"
          style={{
            animation: isVisible ? 'fade-in-up 0.6s ease-out 0.2s forwards' : 'none',
          }}
        >
          <MapContainer
            center={JORDAN_CENTER}
            zoom={JORDAN_ZOOM}
            className="h-[400px] sm:h-[500px] w-full z-0"
            scrollWheelZoom={false}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {governorates.map((gov) => (
              <Marker
                key={gov.id}
                position={[gov.lat, gov.lng]}
                icon={orangeMarkerIcon}
                eventHandlers={{
                  click: () => handleGovernorateClick(gov.id),
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-center p-1" dir="rtl">
                    <h3 className="font-bold text-base text-[#1E293B] mb-1">
                      {gov.name}
                    </h3>
                    <p className="text-sm text-[#475569]">
                      {gov.sitesCount} موقع أثري
                    </p>
                    <button
                      onClick={() => handleGovernorateClick(gov.id)}
                      className="mt-2 text-xs text-orange font-medium hover:underline cursor-pointer"
                    >
                      استكشف المواقع ←
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend bar */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-[#475569]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full gradient-orange" />
                <span>محافظة</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span>{governorates.length} محافظة</span>
              <span className="text-muted-foreground">|</span>
              <span>{governorates.reduce((sum, g) => sum + g.sitesCount, 0)} موقع أثري</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-sm text-blue font-medium hover:underline cursor-pointer"
            >
              عرض الخريطة الكاملة ←
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
