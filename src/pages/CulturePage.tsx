import { useState } from 'react';
import {
  Palette,
  Hammer,
  Music,
  UtensilsCrossed,
  CalendarDays,
  ChevronDown,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { cn } from '@/lib/utils';
import cultureData from '@/data/culture.json';
import type { CultureItem } from '@/lib/types';

const items = cultureData as CultureItem[];

/* ─── Icon mapping ─────────────────────────────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  Hammer,
  Music,
  UtensilsCrossed,
  CalendarDays,
};

/* ─── Expandable detail content per category ───────────────────────── */

const CATEGORY_DETAILS: Record<string, { items: string[]; note: string }> = {
  crafts: {
    items: [
      'صناعة الفخار والخزف',
      'النسيج والتطريز الفلسطيني-الأردني',
      'صناعة النحاسيات والمعادن',
      'أعمال الصدف والخشب',
      'صناعة السيوف والخناجر',
      'صناعة البسط والسجاد البدوي',
    ],
    note: 'تُعد الحرف اليدوية الأردنية جزءاً أصيلاً من الهوية الثقافية، وتوارثتها الأجيال عبر مئات السنين.',
  },
  music: {
    items: [
      'الدبكة الأردنية',
      'السحجة والهجيني',
      'الربابة (آلة وترية)',
      'المجوز والشبابة (آلات نفخ)',
      'الطبل والدف',
      'أغاني السامر والعرضة',
    ],
    note: 'يتميز التراث الموسيقي الأردني بتنوعه بين البادية والريف والمدينة، ولكل منطقة ألحانها المميزة.',
  },
  food: {
    items: [
      'المنسف — الطبق الوطني',
      'المقلوبة بالدجاج أو اللحم',
      'الزرب البدوي (الطهي تحت الأرض)',
      'الجميد والكشك',
      'المكمورة والمسخن',
      'الكنافة النابلسية والقطايف',
    ],
    note: 'يُعتبر المنسف الطبق الوطني الأردني ويُقدّم في المناسبات الرسمية والأعراس كرمز للكرم والضيافة.',
  },
  events: {
    items: [
      'الأعراس التقليدية وحفلات الحناء',
      'عيد الاستقلال والأعياد الوطنية',
      'موسم الحصاد وتقاليد الزراعة',
      'عادات الضيافة وتقديم القهوة العربية',
      'الأعياد الدينية (رمضان، الأضحى)',
      'مهرجان جرش للثقافة والفنون',
    ],
    note: 'تمتاز المناسبات الأردنية بروح الجماعة والكرم، حيث تجتمع العائلات والأصدقاء في احتفالات غنية بالتراث.',
  },
};

/* ─── Fun facts ────────────────────────────────────────────────────── */

const FUN_FACTS = [
  {
    icon: Sparkles,
    text: 'يُعد المنسف الأردني أكثر من مجرد طبق — إنه طقس اجتماعي متكامل يُحضّر ويُؤكل بطريقة تقليدية خاصة باليد اليمنى فقط.',
    color: 'bg-orange/10 border-orange/20',
    iconColor: 'text-orange',
  },
  {
    icon: Lightbulb,
    text: 'الربابة الأردنية آلة وترية تُصنع من جلد الماعز وشعر الخيل، ويُعتقد أنها من أقدم الآلات الموسيقية في المنطقة.',
    color: 'bg-blue/10 border-blue/20',
    iconColor: 'text-blue',
  },
  {
    icon: Sparkles,
    text: 'التطريز الأردني يروي قصصاً كاملة — فكل لون ونقش يحمل دلالة على المنطقة الجغرافية والحالة الاجتماعية لصاحبته.',
    color: 'bg-orange/10 border-orange/20',
    iconColor: 'text-orange',
  },
  {
    icon: Lightbulb,
    text: 'مهرجان جرش للثقافة والفنون يُقام منذ عام 1981 ويُعد من أعرق المهرجانات الثقافية في العالم العربي.',
    color: 'bg-blue/10 border-blue/20',
    iconColor: 'text-blue',
  },
] as const;

/* ─── Page ─────────────────────────────────────────────────────────── */

export function CulturePage(): React.ReactElement {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={Palette}
          title="التراث الثقافي"
          subtitle="التراث الشعبي والحرف اليدوية والعادات والتقاليد الأردنية"
        />

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          {items.map((item) => (
            <CultureCard key={item.id} item={item} />
          ))}
        </div>

        {/* Did You Know section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-6 flex items-center justify-center gap-2">
            <Lightbulb className="size-7 text-orange" />
            هل تعلم؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FUN_FACTS.map((fact, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-xl border p-5 flex gap-4 items-start transition-all hover:shadow-md',
                  fact.color
                )}
              >
                <div
                  className={cn(
                    'size-10 rounded-full flex-shrink-0 flex items-center justify-center bg-white shadow-sm',
                    fact.iconColor
                  )}
                >
                  <fact.icon className="size-5" />
                </div>
                <p className="text-sm md:text-base text-heading leading-relaxed">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CultureCard ──────────────────────────────────────────────────── */

interface CultureCardProps {
  item: CultureItem;
}

function CultureCard({ item }: CultureCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[item.icon] ?? Palette;
  const details = CATEGORY_DETAILS[item.category];

  return (
    <div
      className={cn(
        'bg-white rounded-xl ring-1 ring-foreground/10 overflow-hidden transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:-translate-y-1 hover:ring-orange/30',
        expanded && 'ring-orange/40 shadow-lg'
      )}
      onClick={() => setExpanded((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded((prev) => !prev);
        }
      }}
    >
      {/* Main card content */}
      <div className="p-6 md:p-8 text-center">
        {/* Icon */}
        <div className="size-16 md:size-20 rounded-2xl gradient-orange mx-auto mb-4 flex items-center justify-center shadow-md">
          <Icon className="size-8 md:size-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-heading mb-2">{item.name}</h3>

        {/* Description */}
        <p className="text-sm md:text-base text-body leading-relaxed mb-4 max-w-md mx-auto">
          {item.description}
        </p>

        {/* Count badge */}
        <Badge className="gradient-orange text-white text-sm px-4 py-1 h-auto rounded-full">
          {item.count} {item.countLabel}
        </Badge>

        {/* Expand indicator */}
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>{expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
          <ChevronDown
            className={cn(
              'size-4 transition-transform duration-300',
              expanded && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* Expandable content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-border/50 bg-muted/30 p-5 md:p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {details?.items.map((detailItem, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-body">
                <span className="size-1.5 rounded-full bg-orange flex-shrink-0" />
                {detailItem}
              </li>
            ))}
          </ul>
          {details?.note && (
            <p className="text-xs text-muted-foreground bg-white/60 rounded-lg p-3 leading-relaxed border border-border/30">
              💡 {details.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
