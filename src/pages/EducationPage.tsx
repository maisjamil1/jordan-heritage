import { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Microscope,
  Mail,
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { cn } from '@/lib/utils';
import educationData from '@/data/education.json';
import type { EducationResource } from '@/lib/types';

const resources = educationData as EducationResource[];

/* ─── Icon mapping ─────────────────────────────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  GraduationCap,
  Microscope,
};

/* ─── Mock items for each category dialog ──────────────────────────── */

interface MockItem {
  title: string;
  author: string;
  date: string;
}

const CATEGORY_MOCK_ITEMS: Record<string, MockItem[]> = {
  materials: [
    { title: 'دليل المعلم للتراث الأثري الأردني', author: 'دائرة الآثار العامة', date: '2024' },
    { title: 'كتاب تعليمي: آثار الأردن للأطفال', author: 'وزارة التربية والتعليم', date: '2023' },
    { title: 'أوراق عمل: مواقع الأردن الأثرية', author: 'مركز التراث الوطني', date: '2024' },
    { title: 'دليل ميداني: كيف تقرأ الآثار', author: 'د. ليلى النعيمي', date: '2023' },
    { title: 'عرض تقديمي: الأنباط والبتراء', author: 'جامعة الأردن', date: '2024' },
  ],
  theses: [
    { title: 'دراسة تحليلية لفخار العصر الحديدي في وادي الأردن', author: 'أحمد الفايز', date: '2024' },
    { title: 'التقنيات الحديثة في ترميم الآثار الحجرية', author: 'سارة القاسم', date: '2023' },
    { title: 'المعابد النبطية: دراسة معمارية مقارنة', author: 'محمد التميمي', date: '2024' },
    { title: 'أثر السياحة على المواقع الأثرية الأردنية', author: 'ريم العمري', date: '2023' },
    { title: 'الكتابات الصفوية في البادية الأردنية', author: 'خالد المعاني', date: '2024' },
  ],
  researchers: [
    { title: 'د. فواز الخريشه — آثار كلاسيكية', author: 'جامعة اليرموك', date: 'نشط' },
    { title: 'د. أيهم الجنيدي — التراث الإسلامي', author: 'الجامعة الأردنية', date: 'نشط' },
    { title: 'د. منى ياغي — الترميم والحفظ', author: 'الجامعة الهاشمية', date: 'نشط' },
    { title: 'د. عدنان الشياب — ما قبل التاريخ', author: 'جامعة مؤتة', date: 'نشط' },
    { title: 'د. نداء حمارنه — التراث المعماري', author: 'GJU', date: 'نشط' },
  ],
  labs: [
    { title: 'تحليل الكربون المشع لعينات من جرش', author: 'مختبر الترميم الوطني', date: '2024' },
    { title: 'مسح جيوفيزيائي لموقع أم الجمال', author: 'DOA + ACOR', date: '2023' },
    { title: 'تحليل طيفي للأصباغ في لوحات مادبا', author: 'مختبر المتحف الوطني', date: '2024' },
    { title: 'دراسة جيوكيميائية للفخار النبطي', author: 'IFPO عمّان', date: '2023' },
    { title: 'تقييم هيكلي للأعمدة الرومانية في جرش', author: 'الجمعية العلمية الملكية', date: '2024' },
  ],
};

/* ─── Latest Research mock data ────────────────────────────────────── */

interface LatestResearch {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  categoryLabel: string;
}

const LATEST_RESEARCH: LatestResearch[] = [
  {
    id: 1,
    title: 'اكتشافات أثرية جديدة في تل الحصن',
    author: 'د. فواز الخريشه',
    date: 'مارس 2026',
    category: 'theses',
    categoryLabel: 'بحث',
  },
  {
    id: 2,
    title: 'تقنيات الذكاء الاصطناعي في تصنيف الفخار',
    author: 'سارة القاسم',
    date: 'فبراير 2026',
    category: 'labs',
    categoryLabel: 'دراسة',
  },
  {
    id: 3,
    title: 'المسح الرقمي ثلاثي الأبعاد لقلعة عجلون',
    author: 'محمد التميمي',
    date: 'يناير 2026',
    category: 'labs',
    categoryLabel: 'دراسة',
  },
  {
    id: 4,
    title: 'دراسة إثنو-أثرية لتقاليد الرعي في البادية',
    author: 'ريم العمري',
    date: 'ديسمبر 2025',
    category: 'theses',
    categoryLabel: 'بحث',
  },
];

const CATEGORY_BADGE_COLOR: Record<string, string> = {
  theses: 'bg-orange/10 text-orange',
  labs: 'bg-blue/10 text-blue',
  materials: 'bg-success/10 text-success',
  researchers: 'bg-purple-100 text-purple-700',
};

/* ─── Page ─────────────────────────────────────────────────────────── */

export function EducationPage(): React.ReactElement {
  const [dialogCategory, setDialogCategory] = useState<string | null>(null);

  const activeResource = useMemo(
    () => resources.find((r) => r.category === dialogCategory),
    [dialogCategory]
  );

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={GraduationCap}
          title="التعليم والبحث"
          subtitle="مواد تعليمية وأطروحات بحثية ودليل الباحثين"
        />

        {/* ── Resource Category Cards Grid ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          {resources.map((resource) => (
            <EducationCard
              key={resource.id}
              resource={resource}
              onCTAClick={() => setDialogCategory(resource.category)}
            />
          ))}
        </div>

        {/* ── Latest Research Section ──────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-6 flex items-center justify-center gap-2">
            <Sparkles className="size-7 text-orange" />
            أحدث الأبحاث
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
            {LATEST_RESEARCH.map((paper) => (
              <LatestResearchCard key={paper.id} paper={paper} />
            ))}
          </div>
        </div>

        {/* ── Researcher CTA Section ──────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl gradient-blue p-8 md:p-12 text-center text-white">
          {/* Decorative circles */}
          <div className="absolute -top-10 -end-10 size-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -start-8 size-32 rounded-full bg-white/10" />

          <div className="relative z-10 max-w-lg mx-auto">
            <div className="size-16 rounded-full bg-white/20 mx-auto mb-5 flex items-center justify-center">
              <GraduationCap className="size-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">هل أنت باحث؟</h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
              ندعوك لمشاركة أبحاثك ودراساتك المتعلقة بالتراث الأثري الأردني عبر منصتنا للوصول إلى
              مجتمع أكاديمي واسع
            </p>
            <Button
              variant="outline"
              className="h-12 px-8 text-base font-bold rounded-xl border-2 border-white text-white hover:bg-white hover:text-blue cursor-pointer gap-2"
              id="contact-researcher-btn"
            >
              <Mail className="size-5" />
              تواصل معنا
            </Button>
          </div>
        </div>
      </div>

      {/* ── Category Dialog ────────────────────────────────────────── */}
      <Dialog open={dialogCategory !== null} onOpenChange={(open) => !open && setDialogCategory(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-heading flex items-center gap-2">
              {activeResource && ICON_MAP[activeResource.icon] && (() => {
                const IconComp = ICON_MAP[activeResource.icon];
                return <IconComp className="size-5 text-orange" />;
              })()}
              {activeResource?.name}
            </DialogTitle>
            <DialogDescription>{activeResource?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-2">
            {dialogCategory && CATEGORY_MOCK_ITEMS[dialogCategory]?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="size-8 rounded-lg bg-orange/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <FileText className="size-4 text-orange" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-heading truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3" />
                      {item.author}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground gap-1 cursor-pointer"
              onClick={() => setDialogCategory(null)}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ─── EducationCard ────────────────────────────────────────────────── */

interface EducationCardProps {
  resource: EducationResource;
  onCTAClick: () => void;
}

function EducationCard({ resource, onCTAClick }: EducationCardProps): React.ReactElement {
  const Icon = ICON_MAP[resource.icon] ?? BookOpen;

  const CTA_LABELS: Record<string, string> = {
    materials: 'تصفح المواد',
    theses: 'تصفح الأبحاث',
    researchers: 'عرض الدليل',
    labs: 'عرض النتائج',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl ring-1 ring-foreground/10 overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1 hover:ring-orange/30'
      )}
    >
      <div className="p-6 md:p-8 text-center">
        {/* Icon */}
        <div className="size-16 md:size-20 rounded-2xl gradient-orange mx-auto mb-4 flex items-center justify-center shadow-md">
          <Icon className="size-8 md:size-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-heading mb-2">{resource.name}</h3>

        {/* Description */}
        <p className="text-sm md:text-base text-body leading-relaxed mb-4 max-w-md mx-auto">
          {resource.description}
        </p>

        {/* Count badge */}
        <Badge className="gradient-orange text-white text-sm px-4 py-1 h-auto rounded-full mb-5">
          {resource.count} {resource.countLabel}
        </Badge>

        {/* CTA Button */}
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCTAClick();
            }}
            className="h-10 px-6 text-sm font-bold gradient-orange text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity gap-1.5 shadow-md shadow-orange/20"
          >
            {CTA_LABELS[resource.category] ?? 'عرض المزيد'}
            <ArrowLeft className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── LatestResearchCard ───────────────────────────────────────────── */

interface LatestResearchCardProps {
  paper: LatestResearch;
}

function LatestResearchCard({ paper }: LatestResearchCardProps): React.ReactElement {
  const badgeColor = CATEGORY_BADGE_COLOR[paper.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <div className="min-w-[260px] snap-start bg-white rounded-xl ring-1 ring-foreground/10 p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-blue/30 md:min-w-0">
      {/* Category Badge */}
      <Badge className={cn('w-fit text-xs rounded-full px-3 py-0.5', badgeColor)}>
        {paper.categoryLabel}
      </Badge>

      {/* Title */}
      <h4 className="text-sm font-bold text-heading leading-snug line-clamp-2">{paper.title}</h4>

      {/* Author & Date */}
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3" />
          {paper.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {paper.date}
        </span>
      </div>
    </div>
  );
}
