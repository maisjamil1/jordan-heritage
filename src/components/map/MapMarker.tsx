import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Site } from '@/lib/types';

const STATUS_CONFIG = {
  preserved: { label: 'محفوظ', color: '#16A34A', bg: 'bg-success/10 text-success border-success/20' },
  endangered: { label: 'مهدد', color: '#DC2626', bg: 'bg-danger/10 text-danger border-danger/20' },
  'under-restoration': { label: 'تحت الترميم', color: '#EAB308', bg: 'bg-warning/10 text-warning border-warning/20' },
  digitized: { label: 'مرقمن', color: '#0074ae', bg: 'bg-blue/10 text-blue border-blue/20' },
} as const;

function createMarkerIcon(status: Site['status']): L.DivIcon {
  const color = STATUS_CONFIG[status].color;
  return new L.DivIcon({
    className: 'custom-site-marker',
    html: `<div style="
      width: 22px;
      height: 22px;
      background: ${color};
      border-radius: 50%;
      border: 2.5px solid white;
      box-shadow: 0 3px 8px ${color}66;
      cursor: pointer;
      position: relative;
    ">
      <div style="
        position: absolute;
        inset: 0;
        border-radius: 50%;
        animation: pulse-marker 2s ease-in-out infinite;
        background: ${color};
        opacity: 0.3;
      "></div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

interface MapMarkerProps {
  site: Site;
}

export function MapMarker({ site }: MapMarkerProps): React.ReactElement {
  const navigate = useNavigate();
  const statusInfo = STATUS_CONFIG[site.status];
  const icon = createMarkerIcon(site.status);

  return (
    <Marker
      position={[site.coordinates.lat, site.coordinates.lng]}
      icon={icon}
    >
      <Tooltip direction="top" offset={[0, -14]} className="custom-tooltip">
        {site.name}
      </Tooltip>
      <Popup className="custom-popup" maxWidth={280} minWidth={220}>
        <div className="p-1" dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
            {site.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '8px' }}>
            {site.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <Badge variant="outline" className={statusInfo.bg} style={{ fontSize: '11px', padding: '2px 8px' }}>
              {statusInfo.label}
            </Badge>
            {site.has3DModel && (
              <Badge variant="outline" className="bg-blue/10 text-blue border-blue/20" style={{ fontSize: '11px', padding: '2px 8px' }}>
                نموذج 3D
              </Badge>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8', marginBottom: '10px' }}>
            <span>{site.images} صورة</span>
            <span>•</span>
            <span>{site.documents} وثيقة</span>
          </div>
          <Button
            size="sm"
            className="w-full gradient-orange text-white text-xs rounded-lg cursor-pointer"
            onClick={() => navigate(`/sites/${site.id}`)}
          >
            عرض التفاصيل
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}
