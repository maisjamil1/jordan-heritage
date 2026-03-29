import { cn } from '@/lib/utils';
import labelsData from '@/data/labels.json';
import type { Labels } from '@/lib/types';

const labels = labelsData as Labels;

const STATUS_STYLES = {
  preserved: 'bg-green-100 text-green-800 border-green-200',
  endangered: 'bg-red-100 text-red-800 border-red-200',
  'under-restoration': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  digitized: 'bg-blue-100 text-blue-800 border-blue-200',
} as const;

interface StatusBadgeProps {
  status: keyof typeof STATUS_STYLES;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
        className
      )}
    >
      {labels.statuses[status] ?? status}
    </span>
  );
}
