import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  Map,
  Calendar,
  Building2,
  Shield,
  Image,
  FileText,
  Box,
  Landmark,
  Home,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SiteGallery } from '@/components/sites/SiteGallery';
import { SiteCard } from '@/components/sites/SiteCard';
import sitesData from '@/data/sites.json';
import labelsData from '@/data/labels.json';
import type { Site, Labels } from '@/lib/types';

const sites = sitesData as Site[];
const labels = labelsData as Labels;

export function SiteDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();

  const site = useMemo((): Site | undefined => {
    return sites.find((s) => s.id === Number(id));
  }, [id]);

  const relatedSites = useMemo((): Site[] => {
    if (!site) return [];
    return sites
      .filter(
        (s) =>
          s.id !== site.id &&
          (s.governorate === site.governorate || s.period === site.period)
      )
      .slice(0, 3);
  }, [site]);

  if (!site) {
    return (
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <div className="size-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Landmark className="size-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">الموقع غير موجود</h1>
          <p className="text-body mb-6">لم يتم العثور على الموقع المطلوب.</p>
          <Button asChild className="gradient-orange text-white">
            <Link to="/sites">
              <ArrowRight className="size-4" />
              العودة إلى المواقع الأثرية
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 md:mb-8">
          <Link to="/" className="flex items-center gap-1 hover:text-orange transition-colors">
            <Home className="size-3.5" />
            الرئيسية
          </Link>
          <ChevronLeft className="size-3.5" />
          <Link to="/sites" className="hover:text-orange transition-colors">
            المواقع الأثرية
          </Link>
          <ChevronLeft className="size-3.5" />
          <span className="text-heading font-medium">{site.name}</span>
        </nav>

        {/* Hero area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Image */}
          <div className="lg:col-span-3 h-64 md:h-80 lg:h-[420px] rounded-2xl bg-gradient-to-br from-orange/15 via-blue/10 to-orange/20 flex items-center justify-center ring-1 ring-foreground/5 overflow-hidden">
            <span className="text-8xl md:text-9xl opacity-40">🏛️</span>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-heading">{site.name}</h1>
                <Badge className="bg-blue/10 text-blue border-blue/20" variant="outline">
                  {labels.governorates[site.governorate] ?? site.governorate}
                </Badge>
              </div>
              <StatusBadge status={site.status} className="text-sm" />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoItem
                icon={Calendar}
                label="العصر التاريخي"
                value={labels.periods[site.period] ?? site.period}
              />
              <InfoItem
                icon={Building2}
                label="نوع الموقع"
                value={labels.types[site.type] ?? site.type}
              />
              <InfoItem
                icon={Shield}
                label="الحالة"
                value={labels.statuses[site.status] ?? site.status}
              />
              <InfoItem
                icon={Image}
                label="عدد الصور"
                value={`${site.images} صورة`}
              />
              <InfoItem
                icon={FileText}
                label="عدد الوثائق"
                value={`${site.documents} وثيقة`}
              />
              {site.has3DModel && (
                <InfoItem icon={Box} label="نموذج 3D" value="متاح" highlight />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-4">
              <Button asChild className="flex-1 gradient-orange text-white gap-2" size="lg">
                <Link to={`/map?site=${site.id}`}>
                  <Map className="size-4" />
                  عرض على الخريطة
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 gap-2" size="lg">
                <Link to="/sites">
                  <ArrowRight className="size-4" />
                  العودة للمواقع
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Full description */}
        <div className="bg-section-alt rounded-2xl p-6 md:p-8 mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-heading mb-4 flex items-center gap-2">
            <Landmark className="size-6 text-orange" />
            عن الموقع
          </h2>
          <p className="text-body leading-loose text-base md:text-lg">{site.longDescription}</p>
        </div>

        {/* Gallery */}
        {site.gallery.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-heading mb-4 flex items-center gap-2">
              <Image className="size-6 text-orange" />
              معرض الصور
            </h2>
            <SiteGallery gallery={site.gallery} siteName={site.name} />
          </div>
        )}

        {/* Related sites */}
        {relatedSites.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-heading mb-6 flex items-center gap-2">
              <Landmark className="size-6 text-orange" />
              مواقع ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {relatedSites.map((relSite) => (
                <SiteCard key={relSite.id} site={relSite} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Helper component ─────────────────────────────────────────────── */

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoItem({ icon: Icon, label, value, highlight }: InfoItemProps): React.ReactElement {
  return (
    <div className="bg-white rounded-xl p-3 ring-1 ring-foreground/5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`size-4 ${highlight ? 'text-orange' : 'text-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${highlight ? 'text-orange' : 'text-heading'}`}>
        {value}
      </span>
    </div>
  );
}
