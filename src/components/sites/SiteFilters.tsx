import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import labelsData from '@/data/labels.json';
import type { Labels } from '@/lib/types';

const labels = labelsData as Labels;

interface SiteFiltersProps {
  governorate: string;
  period: string;
  type: string;
  search: string;
  onGovernorateChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function SiteFilters({
  governorate,
  period,
  type,
  search,
  onGovernorateChange,
  onPeriodChange,
  onTypeChange,
  onSearchChange,
}: SiteFiltersProps): React.ReactElement {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-4 md:p-6 mb-6 md:mb-8 sticky top-[68px] z-30 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Governorate filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-heading">المحافظة</label>
          <Select value={governorate} onValueChange={onGovernorateChange}>
            <SelectTrigger className="w-full h-10 bg-white">
              <SelectValue placeholder="جميع المحافظات" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">جميع المحافظات</SelectItem>
              {Object.entries(labels.governorates).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Period filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-heading">العصر التاريخي</label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full h-10 bg-white">
              <SelectValue placeholder="جميع العصور" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">جميع العصور</SelectItem>
              {Object.entries(labels.periods).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-heading">نوع الموقع</label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full h-10 bg-white">
              <SelectValue placeholder="جميع الأنواع" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">جميع الأنواع</SelectItem>
              {Object.entries(labels.types).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-heading">البحث</label>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن موقع..."
              className="ps-9 h-10 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
