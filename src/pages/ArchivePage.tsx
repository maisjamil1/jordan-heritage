import { useState, useMemo, useCallback } from 'react';
import { Archive, Download, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArchiveFilters } from '@/components/archive/ArchiveFilters';
import { ArchiveItem } from '@/components/archive/ArchiveItem';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import archiveData from '@/data/archive.json';
import labelsData from '@/data/labels.json';
import type { ArchiveItem as ArchiveItemType, Labels } from '@/lib/types';

const items: ArchiveItemType[] = archiveData as ArchiveItemType[];
const labels: Labels = labelsData;

const CATEGORY_ICONS: Record<string, string> = {
  manuscripts: '📜',
  photos: '📸',
  maps: '🗺️',
  documents: '📄',
};

export function ArchivePage(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ArchiveItemType | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver();

  const filteredItems = useMemo((): ArchiveItemType[] => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedPeriod !== 'all' && item.period !== selectedPeriod) return false;
      if (searchQuery.trim() && !item.title.includes(searchQuery.trim())) return false;
      return true;
    });
  }, [selectedCategory, selectedPeriod, searchQuery]);

  const handleView = useCallback((item: ArchiveItemType): void => {
    setSelectedItem(item);
  }, []);

  const handleDownload = useCallback((item: ArchiveItemType): void => {
    setDownloadNotification(item.title);
    setTimeout(() => setDownloadNotification(null), 3000);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="bg-gradient-to-l from-[#0074ae]/10 via-white to-[#0074ae]/5 py-16"
        ref={headerRef}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="opacity-0"
            style={{ animation: headerVisible ? 'fade-in-up 0.6s ease-out forwards' : 'none' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/10 text-blue text-sm font-medium mb-6">
              <Archive className="w-4 h-4" />
              <span>الأرشيف الرقمي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] mb-4">
              الأرشيف الرقمي
            </h1>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              تصفح وابحث واستكشف الوثائق والصور والخرائط والمخطوطات المرقمنة
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" ref={gridRef}>
        {/* Filters */}
        <ArchiveFilters
          selectedCategory={selectedCategory}
          selectedPeriod={selectedPeriod}
          searchQuery={searchQuery}
          resultCount={filteredItems.length}
          totalCount={items.length}
          onCategoryChange={setSelectedCategory}
          onPeriodChange={setSelectedPeriod}
          onSearchChange={setSearchQuery}
        />

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0"
                style={{
                  animation: gridVisible
                    ? `fade-in-up 0.5s ease-out ${index * 0.06}s forwards`
                    : 'none',
                }}
              >
                <ArchiveItem
                  item={item}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Archive className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1E293B] mb-2">لا توجد نتائج</h3>
            <p className="text-[#475569]">جرّب تعديل معايير البحث</p>
          </div>
        )}
      </section>

      {/* Detail Dialog */}
      <Dialog open={selectedItem !== null} onOpenChange={(open) => { if (!open) setSelectedItem(null); }}>
        <DialogContent className="max-w-lg" dir="rtl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#1E293B]">
                  {selectedItem.title}
                </DialogTitle>
              </DialogHeader>

              {/* Preview area */}
              <div className="h-48 bg-gradient-to-bl from-[#F8FAFC] to-[#EEF2FF] rounded-xl flex items-center justify-center my-4">
                <span className="text-7xl">{CATEGORY_ICONS[selectedItem.category] ?? '📄'}</span>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                {selectedItem.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-[#F8FAFC] rounded-lg p-3">
                  <span className="text-muted-foreground block text-xs">التصنيف</span>
                  <span className="font-medium text-[#1E293B]">
                    {labels.categories[selectedItem.category] ?? selectedItem.category}
                  </span>
                </div>
                <div className="bg-[#F8FAFC] rounded-lg p-3">
                  <span className="text-muted-foreground block text-xs">التاريخ</span>
                  <span className="font-medium text-[#1E293B]">{selectedItem.date}</span>
                </div>
                <div className="bg-[#F8FAFC] rounded-lg p-3">
                  <span className="text-muted-foreground block text-xs">الصيغة</span>
                  <span className="font-medium text-[#1E293B]">{selectedItem.format}</span>
                </div>
                <div className="bg-[#F8FAFC] rounded-lg p-3">
                  <span className="text-muted-foreground block text-xs">الحجم</span>
                  <span className="font-medium text-[#1E293B]">{selectedItem.size}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-[#F8FAFC]">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="flex gap-3">
                <Button
                  className="flex-1 gradient-orange text-white rounded-lg cursor-pointer"
                  onClick={() => handleDownload(selectedItem)}
                >
                  <Download className="w-4 h-4 ms-2" />
                  تحميل
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg cursor-pointer"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="w-4 h-4 ms-2" />
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Download Notification Toast */}
      {downloadNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] bg-[#1E293B] text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <Download className="w-5 h-5 text-orange" />
          <span className="text-sm">جاري تحميل: {downloadNotification}</span>
        </div>
      )}
    </div>
  );
}
