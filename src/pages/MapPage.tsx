import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JordanMap } from '@/components/map/JordanMap';
import sitesData from '@/data/sites.json';
import governoratesData from '@/data/governorates.json';
import labelsData from '@/data/labels.json';
import type { Site, GovernorateMarker, Labels } from '@/lib/types';

const sites: Site[] = sitesData as Site[];
const governorates: GovernorateMarker[] = governoratesData;
const labels: Labels = labelsData;

const STATUS_COLORS = {
  preserved: 'bg-success text-white',
  endangered: 'bg-danger text-white',
  'under-restoration': 'bg-warning text-white',
  digitized: 'bg-blue text-white',
} as const;

const LEGEND_ITEMS = [
  { status: 'preserved' as const, label: 'محفوظ', color: '#16A34A' },
  { status: 'endangered' as const, label: 'مهدد', color: '#DC2626' },
  { status: 'under-restoration' as const, label: 'تحت الترميم', color: '#EAB308' },
  { status: 'digitized' as const, label: 'مرقمن', color: '#0074ae' },
];

export function MapPage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state from URL params
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(
    searchParams.get('governorate') ?? 'all'
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    searchParams.get('period') ?? 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get('status') ?? 'all'
  );

  // Mobile filter panel state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fly-to state
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);
  const [flyToZoom, setFlyToZoom] = useState<number | null>(null);

  // Handle URL param ?site=X to zoom to specific site
  useEffect(() => {
    const siteId = searchParams.get('site');
    if (siteId) {
      const site = sites.find((s) => s.id === Number(siteId));
      if (site) {
        setFlyToCenter([site.coordinates.lat, site.coordinates.lng]);
        setFlyToZoom(13);
      }
    }
  }, [searchParams]);

  // Handle initial governorate param
  useEffect(() => {
    const govParam = searchParams.get('governorate');
    if (govParam && govParam !== 'all') {
      const gov = governorates.find((g) => g.id === govParam);
      if (gov) {
        setFlyToCenter([gov.lat, gov.lng]);
        setFlyToZoom(10);
      }
    }
  }, []); // Only on mount

  // Filtered sites
  const filteredSites = useMemo((): Site[] => {
    return sites.filter((site) => {
      if (selectedGovernorate !== 'all' && site.governorate !== selectedGovernorate) return false;
      if (selectedPeriod !== 'all' && site.period !== selectedPeriod) return false;
      if (selectedStatus !== 'all' && site.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedGovernorate, selectedPeriod, selectedStatus]);

  // Get unique periods and statuses from data
  const uniquePeriods = useMemo((): string[] => {
    const periods = new Set(sites.map((s) => s.period));
    return Array.from(periods).sort();
  }, []);

  const uniqueStatuses = useMemo((): string[] => {
    const statuses = new Set(sites.map((s) => s.status));
    return Array.from(statuses).sort();
  }, []);

  // Update URL when filters change
  const updateFilters = useCallback(
    (gov: string, period: string, status: string): void => {
      const params = new URLSearchParams();
      if (gov !== 'all') params.set('governorate', gov);
      if (period !== 'all') params.set('period', period);
      if (status !== 'all') params.set('status', status);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  function handleGovernorateChange(value: string): void {
    setSelectedGovernorate(value);
    updateFilters(value, selectedPeriod, selectedStatus);
    if (value !== 'all') {
      const gov = governorates.find((g) => g.id === value);
      if (gov) {
        setFlyToCenter([gov.lat, gov.lng]);
        setFlyToZoom(10);
      }
    } else {
      setFlyToCenter([31.5, 36.0]);
      setFlyToZoom(8);
    }
  }

  function handlePeriodChange(value: string): void {
    setSelectedPeriod(value);
    updateFilters(selectedGovernorate, value, selectedStatus);
  }

  function handleStatusChange(value: string): void {
    setSelectedStatus(value);
    updateFilters(selectedGovernorate, selectedPeriod, value);
  }

  function handleReset(): void {
    setSelectedGovernorate('all');
    setSelectedPeriod('all');
    setSelectedStatus('all');
    setSearchParams({}, { replace: true });
    setFlyToCenter([31.5, 36.0]);
    setFlyToZoom(8);
  }

  function handleGovernorateClick(id: string): void {
    handleGovernorateChange(id);
  }

  const hasActiveFilters = selectedGovernorate !== 'all' || selectedPeriod !== 'all' || selectedStatus !== 'all';

  // Filter panel content (shared between desktop sidebar and mobile bottom sheet)
  const filterContent = (
    <div className="space-y-5">
      {/* Governorate Filter */}
      <div>
        <label className="block text-sm font-bold text-[#1E293B] mb-2">
          المحافظة
        </label>
        <Select value={selectedGovernorate} onValueChange={handleGovernorateChange}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="جميع المحافظات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المحافظات</SelectItem>
            {Object.entries(labels.governorates).map(([key, name]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Period Filter */}
      <div>
        <label className="block text-sm font-bold text-[#1E293B] mb-2">
          الفترة الزمنية
        </label>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="جميع الفترات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفترات</SelectItem>
            {uniquePeriods.map((period) => (
              <SelectItem key={period} value={period}>
                {labels.periods[period] ?? period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-bold text-[#1E293B] mb-2">
          الحالة
        </label>
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {labels.statuses[status] ?? status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full rounded-lg text-sm cursor-pointer"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 ms-2" />
          عرض الكل
        </Button>
      )}

      <Separator />

      {/* Legend */}
      <div>
        <h4 className="text-sm font-bold text-[#1E293B] mb-3">دليل الخريطة</h4>
        <div className="space-y-2">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                style={{ background: item.color }}
              />
              <span className="text-sm text-[#475569]">{item.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0074ae 0%, #0090d9 100%)' }}
            />
            <span className="text-sm text-[#475569]">محافظة</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Site count */}
      <div className="flex items-center gap-2 text-sm text-[#475569]">
        <MapPin className="w-4 h-4 text-orange" />
        <span>
          عرض <strong className="text-[#1E293B]">{filteredSites.length}</strong> من{' '}
          <strong className="text-[#1E293B]">{sites.length}</strong> موقع
        </span>
      </div>

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGovernorate !== 'all' && (
            <Badge variant="secondary" className={`${STATUS_COLORS.digitized} text-xs`}>
              {labels.governorates[selectedGovernorate]}
            </Badge>
          )}
          {selectedPeriod !== 'all' && (
            <Badge variant="secondary" className="bg-orange text-white text-xs">
              {labels.periods[selectedPeriod]}
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className={`${STATUS_COLORS[selectedStatus as keyof typeof STATUS_COLORS]} text-xs`}>
              {labels.statuses[selectedStatus]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block absolute top-4 right-4 z-[1000] w-72">
        <div className="glass rounded-2xl shadow-xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-orange" />
            <h3 className="text-base font-bold text-[#1E293B]">تصفية المواقع</h3>
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile Bottom Sheet Toggle */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000]">
        <button
          className="w-full glass border-t border-border/50 px-4 py-3 flex items-center justify-between cursor-pointer"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange" />
            <span className="text-sm font-bold text-[#1E293B]">تصفية المواقع</span>
            <Badge variant="secondary" className="text-xs bg-orange/10 text-orange">
              {filteredSites.length} موقع
            </Badge>
          </div>
          {mobileFiltersOpen ? (
            <ChevronDown className="w-5 h-5 text-[#94A3B8]" />
          ) : (
            <ChevronUp className="w-5 h-5 text-[#94A3B8]" />
          )}
        </button>

        {mobileFiltersOpen && (
          <div className="glass border-t border-border/50 px-4 py-5 max-h-[60vh] overflow-y-auto">
            {filterContent}
          </div>
        )}
      </div>

      {/* Map */}
      <JordanMap
        sites={filteredSites}
        governorates={governorates}
        flyToCenter={flyToCenter}
        flyToZoom={flyToZoom}
        onGovernorateClick={handleGovernorateClick}
      />
    </div>
  );
}
