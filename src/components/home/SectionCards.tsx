import { useNavigate } from 'react-router-dom';
import {
  Landmark,
  Palette,
  BookOpen,
  GraduationCap,
  Plane,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface SectionCard {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  stats: string;
}

const SECTION_CARDS: SectionCard[] = [
  {
    title: 'المواقع الأثرية',
    description: 'استكشف أكثر من 500 موقع أثري موثق عبر محافظات الأردن',
    path: '/sites',
    icon: <Landmark className="w-8 h-8" />,
    iconBg: 'bg-orange/10',
    iconColor: 'text-orange',
    stats: '548 موقع',
  },
  {
    title: 'التراث الثقافي',
    description: 'تعرف على الحرف التقليدية والموسيقى والمأكولات والتقاليد',
    path: '/culture',
    icon: <Palette className="w-8 h-8" />,
    iconBg: 'bg-blue/10',
    iconColor: 'text-blue',
    stats: '4 أقسام',
  },
  {
    title: 'الرقمنة والأرشيف',
    description: 'تصفح الوثائق والصور والخرائط والمخطوطات المرقمنة',
    path: '/archive',
    icon: <BookOpen className="w-8 h-8" />,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    stats: '1,247 وثيقة',
  },
  {
    title: 'التعليم والبحث',
    description: 'مواد تعليمية ورسائل علمية وباحثون متخصصون',
    path: '/education',
    icon: <GraduationCap className="w-8 h-8" />,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    stats: '85 مادة',
  },
  {
    title: 'الزيارة والسياحة',
    description: 'خطط لزيارتك واحجز جولاتك واكتشف التطبيقات المساعدة',
    path: '/visit',
    icon: <Plane className="w-8 h-8" />,
    iconBg: 'bg-blue/10',
    iconColor: 'text-blue',
    stats: '12 محافظة',
  },
  {
    title: 'المشاركة المجتمعية',
    description: 'انضم لمبادرات التطوع وشارك في المنتدى المجتمعي',
    path: '/community',
    icon: <Users className="w-8 h-8" />,
    iconBg: 'bg-orange/10',
    iconColor: 'text-orange',
    stats: '6 مبادرات',
  },
];

export function SectionCards(): React.ReactElement {
  const navigate = useNavigate();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="py-16 bg-section-alt" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className="text-center mb-12 opacity-0"
          style={{
            animation: isVisible ? 'fade-in-up 0.6s ease-out forwards' : 'none',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-3">
            استكشف أقسام البوابة
          </h2>
          <p className="text-[#475569] max-w-xl mx-auto">
            بوابتك الشاملة لاستكشاف التراث الأثري والثقافي في الأردن
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTION_CARDS.map((card, index) => (
            <div
              key={card.path}
              onClick={() => navigate(card.path)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(card.path); }}
              role="button"
              tabIndex={0}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-orange/30 cursor-pointer group transition-all duration-300 card-hover opacity-0"
              style={{
                animation: isVisible
                  ? `fade-in-up 0.6s ease-out ${0.1 + index * 0.08}s forwards`
                  : 'none',
              }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1E293B] mb-2 group-hover:text-orange transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                {card.description}
              </p>

              {/* Stats Badge */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-[#F8FAFC] text-[#475569] text-xs font-medium border border-border/50 px-3 py-1">
                  {card.stats}
                </Badge>
                <span className="text-orange text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  استكشف ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
