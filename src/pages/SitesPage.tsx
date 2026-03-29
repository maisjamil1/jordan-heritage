import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, SearchX } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { SiteFilters } from '@/components/sites/SiteFilters';
import { SiteCard } from '@/components/sites/SiteCard';
import sitesData from '@/data/sites.json';
import type { Site } from '@/lib/types';

const sites = sitesData as Site[];

export function SitesPage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const governorate = searchParams.get('governorate') ?? 'all';
  const period = searchParams.get('period') ?? 'all';
  const type = searchParams.get('type') ?? 'all';
  const search = searchParams.get('search') ?? '';

  const updateParam = useCallback(
    (key: string, value: string): void => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'all' || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const filteredSites = useMemo((): Site[] => {
    return sites.filter((site) => {
      if (governorate !== 'all' && site.governorate !== governorate) return false;
      if (period !== 'all' && site.period !== period) return false;
      if (type !== 'all' && site.type !== type) return false;
      if (search && !site.name.includes(search) && !site.description.includes(search)) return false;
      return true;
    });
  }, [governorate, period, type, search]);

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={Landmark}
          title="المواقع الأثرية"
          subtitle="استكشف المواقع الأثرية في جميع محافظات المملكة الأردنية الهاشمية"
        />

        <SiteFilters
          governorate={governorate}
          period={period}
          type={type}
          search={search}
          onGovernorateChange={(v) => updateParam('governorate', v)}
          onPeriodChange={(v) => updateParam('period', v)}
          onTypeChange={(v) => updateParam('type', v)}
          onSearchChange={(v) => updateParam('search', v)}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <p className="text-sm text-muted-foreground">
            يتم عرض <span className="font-bold text-heading">{filteredSites.length}</span> من أصل{' '}
            <span className="font-bold text-heading">{sites.length}</span> موقع
          </p>
        </div>

        {/* Sites grid or empty state */}
        {filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <SearchX className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">لا توجد نتائج</h3>
            <p className="text-body max-w-md">
              لم يتم العثور على مواقع أثرية تطابق معايير البحث المحددة. حاول تغيير الفلاتر أو
              مصطلح البحث.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
