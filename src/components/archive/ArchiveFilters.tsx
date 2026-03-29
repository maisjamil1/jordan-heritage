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

const labels: Labels = labelsData;

const PERIOD_OPTIONS = [
  { value: 'all', label: 'جميع الفترات' },
  { value: 'pre-1950', label: 'ما قبل 1950' },
  { value: '1950-2000', label: '1950 - 2000' },
  { value: 'post-2000', label: 'ما بعد 2000' },
];

interface ArchiveFiltersProps {
  selectedCategory: string;
  selectedPeriod: string;
  searchQuery: string;
  resultCount: number;
  totalCount: number;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ArchiveFilters({
  selectedCategory,
  selectedPeriod,
  searchQuery,
  resultCount,
  totalCount,
  onCategoryChange,
  onPeriodChange,
  onSearchChange,
}: ArchiveFiltersProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الأرشيف..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pe-10 rounded-lg"
          />
        </div>

        {/* Category filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full md:w-48 rounded-lg">
            <SelectValue placeholder="جميع التصنيفات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {Object.entries(labels.categories).map(([key, name]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period filter */}
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-full md:w-48 rounded-lg">
            <SelectValue placeholder="جميع الفترات" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-muted-foreground">
        عرض <strong className="text-foreground">{resultCount}</strong> من{' '}
        <strong className="text-foreground">{totalCount}</strong> عنصر
      </div>
    </div>
  );
}
