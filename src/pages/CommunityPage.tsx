import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  HandHelping,
  Lightbulb,
  MessageSquare,
  Users,
  FileWarning,
  Sparkles,
  Newspaper,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import initiativesData from '@/data/initiatives.json';
import type { Initiative } from '@/lib/types';

const initiatives = initiativesData as Initiative[];

/* ─── Action Card Data ─────────────────────────────────────────────── */

interface ActionCard {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  action: 'navigate' | 'volunteer' | 'initiatives' | 'forum';
}

const ACTION_CARDS: ActionCard[] = [
  {
    id: 'report-violations',
    icon: AlertTriangle,
    title: 'الإبلاغ عن التعديات',
    description: 'ساهم في حماية تراثنا بالإبلاغ عن أي تعديات على المواقع الأثرية',
    cta: 'أبلغ الآن',
    action: 'navigate',
  },
  {
    id: 'volunteering',
    icon: HandHelping,
    title: 'التطوع',
    description: 'انضم إلى فريق المتطوعين في حماية التراث الأردني',
    cta: 'تطوع معنا',
    action: 'volunteer',
  },
  {
    id: 'local-initiatives',
    icon: Lightbulb,
    title: 'المبادرات المحلية',
    description: 'شارك في المبادرات المجتمعية لحماية التراث',
    cta: 'عرض المبادرات',
    action: 'initiatives',
  },
  {
    id: 'community-forum',
    icon: MessageSquare,
    title: 'المنتدى المجتمعي',
    description: 'شارك برأيك وتواصل مع المهتمين بالتراث',
    cta: 'افتح المنتدى',
    action: 'forum',
  },
];

/* ─── Mock Forum Threads ───────────────────────────────────────────── */

interface ForumThread {
  id: number;
  title: string;
  preview: string;
  participants: number;
  lastActivity: string;
}

const FORUM_THREADS: ForumThread[] = [
  {
    id: 1,
    title: 'مناقشة: أفضل الطرق للحفاظ على الآثار',
    preview: 'ما هي الأساليب الحديثة التي يمكن استخدامها في حماية المواقع الأثرية من التآكل والتخريب؟',
    participants: 24,
    lastActivity: 'منذ ساعة',
  },
  {
    id: 2,
    title: 'تجربتي في التطوع بموقع البترا',
    preview: 'أشارككم تفاصيل تجربتي الرائعة في التطوع ضمن برنامج حماية البترا خلال الصيف الماضي...',
    participants: 18,
    lastActivity: 'منذ 3 ساعات',
  },
  {
    id: 3,
    title: 'اقتراح: تطبيق الواقع المعزز للمواقع الأثرية',
    preview: 'أقترح تطوير تطبيق واقع معزز يتيح للزوار رؤية المواقع الأثرية كما كانت في الماضي...',
    participants: 31,
    lastActivity: 'منذ 5 ساعات',
  },
  {
    id: 4,
    title: 'ورشة عمل: التصوير الأثري للمبتدئين',
    preview: 'سيتم تنظيم ورشة عمل مجانية لتعليم أساسيات التصوير الأثري في جرش يوم السبت القادم...',
    participants: 42,
    lastActivity: 'أمس',
  },
];

/* ─── Volunteer form fields ────────────────────────────────────────── */

const VOLUNTEER_FIELDS = [
  'الإرشاد السياحي',
  'التوثيق والأرشيف',
  'التصوير الفوتوغرافي',
  'البحث العلمي',
] as const;

/* ─── Stats ────────────────────────────────────────────────────────── */

interface StatItem {
  icon: LucideIcon;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

const COMMUNITY_STATS: StatItem[] = [
  { icon: Users, value: 156, label: 'عدد المتطوعين', color: 'text-orange', bgColor: 'bg-orange/10' },
  { icon: FileWarning, value: 89, label: 'عدد البلاغات', color: 'text-blue', bgColor: 'bg-blue/10' },
  { icon: Sparkles, value: 12, label: 'المبادرات النشطة', color: 'text-success', bgColor: 'bg-success/10' },
  { icon: Newspaper, value: 45, label: 'المقالات المنشورة', color: 'text-orange-dark', bgColor: 'bg-orange/10' },
];

/* ─── Count Animation Hook ─────────────────────────────────────────── */

function useCountAnimation(target: number, isVisible: boolean, duration: number = 2000): number {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();

    function step(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (isVisible) {
      animate();
    }
  }, [isVisible, animate]);

  return count;
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export function CommunityPage(): React.ReactElement {
  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = useState<'volunteer' | 'initiatives' | 'forum' | null>(null);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    field: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  function handleCardAction(action: ActionCard['action']): void {
    if (action === 'navigate') {
      navigate('/report-damage');
    } else {
      setActiveDialog(action);
      setVolunteerSuccess(false);
      setFormErrors({});
    }
  }

  function validateVolunteerForm(): boolean {
    const errors: Record<string, boolean> = {};
    if (!volunteerForm.name.trim()) errors.name = true;
    if (!volunteerForm.email.trim() || !volunteerForm.email.includes('@')) errors.email = true;
    if (!volunteerForm.phone.trim()) errors.phone = true;
    if (!volunteerForm.field) errors.field = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleVolunteerSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (validateVolunteerForm()) {
      setVolunteerSuccess(true);
      setVolunteerForm({ name: '', email: '', phone: '', field: '' });
    }
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={Users}
          title="المشاركة المجتمعية"
          subtitle="الإبلاغ عن التعديات والتطوع والمبادرات المحلية"
        />

        {/* ── Action Cards Grid (2×2) ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          {ACTION_CARDS.map((card) => (
            <CommunityActionCard
              key={card.id}
              card={card}
              onAction={() => handleCardAction(card.action)}
            />
          ))}
        </div>

        {/* ── Participation Stats ──────────────────────────────────── */}
        <CommunityStatsBar />
      </div>

      {/* ── Volunteer Dialog ──────────────────────────────────────── */}
      <Dialog open={activeDialog === 'volunteer'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" id="volunteer-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-heading flex items-center gap-2">
              <HandHelping className="size-5 text-orange" />
              تطوع معنا
            </DialogTitle>
            <DialogDescription>
              انضم إلى فريق المتطوعين في حماية التراث الأردني. املأ النموذج أدناه وسنتواصل معك.
            </DialogDescription>
          </DialogHeader>

          {volunteerSuccess ? (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="size-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-heading">شكراً لتطوعك!</h3>
              <p className="text-sm text-body text-center leading-relaxed">
                تم استلام طلبك بنجاح. سيتم التواصل معك قريباً عبر البريد الإلكتروني.
              </p>
              <Button
                onClick={() => setActiveDialog(null)}
                className="h-10 px-6 text-sm font-bold gradient-orange text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                id="volunteer-close-success-btn"
              >
                إغلاق
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="volunteer-name" className="text-sm font-semibold text-heading">
                  الاسم الكامل
                </Label>
                <Input
                  id="volunteer-name"
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  className={cn(
                    'h-10 rounded-lg text-sm',
                    formErrors.name && 'border-danger ring-1 ring-danger/30'
                  )}
                />
                {formErrors.name && (
                  <p className="text-xs text-danger">يرجى إدخال الاسم الكامل</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="volunteer-email" className="text-sm font-semibold text-heading">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="volunteer-email"
                  type="email"
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  dir="ltr"
                  className={cn(
                    'h-10 rounded-lg text-sm text-left',
                    formErrors.email && 'border-danger ring-1 ring-danger/30'
                  )}
                />
                {formErrors.email && (
                  <p className="text-xs text-danger">يرجى إدخال بريد إلكتروني صحيح</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="volunteer-phone" className="text-sm font-semibold text-heading">
                  رقم الهاتف
                </Label>
                <Input
                  id="volunteer-phone"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="07x-xxx-xxxx"
                  dir="ltr"
                  className={cn(
                    'h-10 rounded-lg text-sm text-left',
                    formErrors.phone && 'border-danger ring-1 ring-danger/30'
                  )}
                />
                {formErrors.phone && (
                  <p className="text-xs text-danger">يرجى إدخال رقم الهاتف</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="volunteer-field" className="text-sm font-semibold text-heading">
                  مجال التطوع
                </Label>
                <Select
                  value={volunteerForm.field}
                  onValueChange={(value) => setVolunteerForm((prev) => ({ ...prev, field: value }))}
                >
                  <SelectTrigger
                    id="volunteer-field"
                    className={cn(
                      'w-full h-10 rounded-lg text-sm',
                      formErrors.field && 'border-danger ring-1 ring-danger/30'
                    )}
                  >
                    <SelectValue placeholder="اختر مجال التطوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOLUNTEER_FIELDS.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.field && (
                  <p className="text-xs text-danger">يرجى اختيار مجال التطوع</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 h-10 text-sm font-bold gradient-orange text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity gap-1.5"
                  id="volunteer-submit-btn"
                >
                  <UserCheck className="size-4" />
                  إرسال الطلب
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-muted-foreground cursor-pointer"
                  onClick={() => setActiveDialog(null)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Initiatives Dialog ────────────────────────────────────── */}
      <Dialog open={activeDialog === 'initiatives'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" id="initiatives-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-heading flex items-center gap-2">
              <Lightbulb className="size-5 text-orange" />
              المبادرات المحلية
            </DialogTitle>
            <DialogDescription>
              المبادرات المجتمعية لحماية التراث الأردني
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {initiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-colors"
              >
                <h4 className="text-base font-bold text-orange mb-1.5">
                  {initiative.name}
                </h4>
                <p className="text-sm text-body leading-relaxed mb-3">
                  {initiative.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {initiative.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {initiative.location}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs font-semibold gradient-orange text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    id={`initiative-register-${initiative.id}`}
                  >
                    سجل اهتمامك
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground cursor-pointer"
              onClick={() => setActiveDialog(null)}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Forum Dialog ──────────────────────────────────────────── */}
      <Dialog open={activeDialog === 'forum'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" id="forum-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-heading flex items-center gap-2">
              <MessageSquare className="size-5 text-orange" />
              المنتدى المجتمعي
            </DialogTitle>
            <DialogDescription>
              تواصل مع المهتمين بالتراث وشارك برأيك
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {FORUM_THREADS.map((thread) => (
              <div
                key={thread.id}
                className="rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <h5 className="text-sm font-bold text-orange mb-1.5 leading-snug">
                  {thread.title}
                </h5>
                <p className="text-xs text-body leading-relaxed mb-3 line-clamp-2">
                  {thread.preview}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {thread.participants} مشارك
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {thread.lastActivity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground cursor-pointer"
              onClick={() => setActiveDialog(null)}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ─── CommunityActionCard ──────────────────────────────────────────── */

interface CommunityActionCardProps {
  card: ActionCard;
  onAction: () => void;
}

function CommunityActionCard({ card, onAction }: CommunityActionCardProps): React.ReactElement {
  const Icon = card.icon;

  return (
    <div
      className={cn(
        'bg-white rounded-xl ring-1 ring-foreground/10 overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1 hover:ring-orange/30'
      )}
      id={`community-card-${card.id}`}
    >
      <div className="p-6 md:p-8 text-center">
        {/* Icon */}
        <div className="size-16 md:size-20 rounded-2xl gradient-orange mx-auto mb-4 flex items-center justify-center shadow-md">
          <Icon className="size-8 md:size-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-heading mb-2">{card.title}</h3>

        {/* Description */}
        <p className="text-sm md:text-base text-body leading-relaxed mb-5 max-w-md mx-auto">
          {card.description}
        </p>

        {/* CTA Button */}
        <Button
          onClick={onAction}
          className="h-10 px-6 text-sm font-bold gradient-orange text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity gap-1.5 shadow-md shadow-orange/20"
          id={`community-cta-${card.id}`}
        >
          {card.cta}
          <ArrowLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─── CommunityStatsBar ────────────────────────────────────────────── */

function CommunityStatsBar(): React.ReactElement {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div className="bg-section-alt rounded-2xl py-10 px-4 md:px-8" ref={ref}>
      <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-8 text-center flex items-center justify-center gap-2">
        <Sparkles className="size-7 text-orange" />
        أرقام المشاركة
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {COMMUNITY_STATS.map((stat, index) => (
          <CommunityStatCard
            key={stat.label}
            stat={stat}
            isVisible={isVisible}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── CommunityStatCard ────────────────────────────────────────────── */

interface CommunityStatCardProps {
  stat: StatItem;
  isVisible: boolean;
  delay: number;
}

function CommunityStatCard({ stat, isVisible, delay }: CommunityStatCardProps): React.ReactElement {
  const animatedValue = useCountAnimation(stat.value, isVisible);
  const Icon = stat.icon;

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 card-hover opacity-0"
      style={{
        animation: isVisible ? `fade-in-up 0.6s ease-out ${delay}s forwards` : 'none',
      }}
    >
      <div className={`size-14 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
        <Icon className="size-7" />
      </div>
      <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color} mb-2 text-center`} dir="ltr">
        {animatedValue.toLocaleString('ar-SA')}
      </div>
      <div className="text-sm text-[#475569] font-medium text-center">
        {stat.label}
      </div>
    </div>
  );
}
