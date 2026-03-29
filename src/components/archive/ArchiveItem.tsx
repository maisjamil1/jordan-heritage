import { Eye, Download, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ArchiveItem as ArchiveItemType } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  manuscripts: '📜',
  photos: '📸',
  maps: '🗺️',
  documents: '📄',
};

interface ArchiveItemProps {
  item: ArchiveItemType;
  onView: (item: ArchiveItemType) => void;
  onDownload: (item: ArchiveItemType) => void;
}

export function ArchiveItem({ item, onView, onDownload }: ArchiveItemProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden card-hover group">
      {/* Thumbnail area */}
      <div className="h-36 bg-gradient-to-bl from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center relative">
        <span className="text-5xl">{CATEGORY_ICONS[item.category] ?? '📄'}</span>
        {/* Format + Size badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="secondary" className="bg-white/90 text-xs font-medium shadow-sm">
            {item.format}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-xs font-medium shadow-sm">
            {item.size}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="text-base font-bold text-[#1E293B] mb-2 line-clamp-1 group-hover:text-orange transition-colors">
          {item.title}
        </h4>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.date}</span>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] bg-[#F8FAFC] text-[#475569] border-border/50 px-2 py-0.5"
            >
              <Tag className="w-2.5 h-2.5 ms-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 gradient-orange text-white rounded-lg text-xs cursor-pointer"
            onClick={() => onView(item)}
          >
            <Eye className="w-3.5 h-3.5 ms-1.5" />
            عرض
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-lg text-xs cursor-pointer"
            onClick={() => onDownload(item)}
          >
            <Download className="w-3.5 h-3.5 ms-1.5" />
            تحميل
          </Button>
        </div>
      </div>
    </div>
  );
}
