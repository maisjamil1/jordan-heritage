import React, { useState } from 'react';
import {
  Ticket,
  Route,
  Smartphone,
  Info,
  MapPin,
  Clock,
  Coins,
  Scale,
  Droplet,
  Footprints,
  HandMetal,
  Sun,
  Camera,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import sitesData from '@/data/sites.json';
import type { Site } from '@/lib/types';

const sites = sitesData as Site[];

/* ─── Mock Data ────────────────────────────────────────────────────── */

const TOURS = [
  {
    id: 1,
    name: 'جولة الأنباط الكاملة',
    duration: '6 ساعات',
    sites: ['البترا', 'متحف البترا'],
    price: '25 دينار',
  },
  {
    id: 2,
    name: 'مسار القلاع الصحراوية',
    duration: '8 ساعات',
    sites: ['قصر عمرة', 'قصر المشتى', 'قصر الحرانه'],
    price: '30 دينار',
  },
  {
    id: 3,
    name: 'جولة إربد وجرش التاريخية',
    duration: '7 ساعات',
    sites: ['جرش', 'أم قيس'],
    price: '20 دينار',
  },
];

const TIPS = [
  { icon: Droplet, text: 'احمل ماءً كافياً' },
  { icon: Footprints, text: 'ارتدِ أحذية مريحة' },
  { icon: HandMetal, text: 'لا تلمس الآثار' },
  { icon: Sun, text: 'استخدم واقي الشمس' },
  { icon: Camera, text: 'التقط الصور بحرية' },
];

/* ─── Page Component ───────────────────────────────────────────────── */

export function VisitPage(): React.ReactElement {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'form' | 'success'>('form');

  // Booking Form State
  const [selectedSite, setSelectedSite] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitors, setVisitors] = useState(1);

  const totalPrice = visitors * 5;

  const handleBookingConfirm = () => {
    setBookingStep('success');
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setBookingStep('form');
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={MapPin}
          title="الزيارة والسياحة"
          subtitle="معلومات الزيارة والحجز الإلكتروني وتطبيقات الجوال"
        />

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* 1. Electronic Booking */}
          <ServiceCard
            icon={Ticket}
            title="الحجز الإلكتروني"
            description="احجز تذكرتك إلكترونياً لأي موقع أثري لتوفير الوقت وضمان الدخول"
            cta="احجز الآن"
            onClick={() => setActiveDialog('booking')}
          />

          {/* 2. Guided Tours */}
          <ServiceCard
            icon={Route}
            title="الجولات المرشدة"
            description="جولات مصحوفة بمرشدين متخصصين لاستكشاف القصص الخفية وراء كل حجر"
            cta="تعرف على الجولات"
            onClick={() => setActiveDialog('tours')}
          />

          {/* 3. Mobile Apps */}
          <ServiceCard
            icon={Smartphone}
            title="تطبيقات الجوال"
            description="حمل تطبيقنا للحصول على تجربة تفاعلية وتقنيات الواقع المعزز في المواقع"
            cta="حمل التطبيق"
            onClick={() => setActiveDialog('apps')}
          />

          {/* 4. Visit Information */}
          <ServiceCard
            icon={Info}
            title="معلومات الزيارة"
            description="أوقات الزيارة، الأسعار، والتعليمات العامة لضمان رحلة ممتعة وآمنة"
            cta="عرض المعلومات"
            onClick={() => setActiveDialog('info')}
          />
        </div>

        {/* Visitor Tips Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-8 flex items-center justify-center gap-2">
            <CheckCircle2 className="size-7 text-orange" />
            نصائح الزائر
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TIPS.map((tip, idx) => (
              <div
                key={idx}
                className="bg-white border border-border rounded-xl p-4 flex flex-col items-center text-center gap-3 transition-all hover:border-orange/30 hover:shadow-sm"
              >
                <div className="size-10 rounded-full bg-orange/10 flex items-center justify-center">
                  <tip.icon className="size-5 text-orange" />
                </div>
                <span className="text-sm font-medium text-heading">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Dialogs ─────────────────────────────────────────────────── */}

        {/* 1. Booking Dialog */}
        <Dialog open={activeDialog === 'booking'} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[450px]">
            {bookingStep === 'form' ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">الحجز الإلكتروني</DialogTitle>
                  <DialogDescription>
                    قم بتعبئة البيانات أدناه لحجز تذكرتك. الدفع يتم عند مدخل الموقع.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">اختر الموقع</label>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر موقعاً..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">تاريخ الزيارة</label>
                    <Input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">عدد الزوار</label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={visitors || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setVisitors(isNaN(val) ? 0 : val);
                      }}
                    />
                  </div>
                  <div className="mt-2 p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <span className="font-medium">السعر الإجمالي (تقديري):</span>
                    <span className="text-lg font-bold text-orange">{totalPrice} دينار</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleBookingConfirm}
                    disabled={!selectedSite || !visitDate}
                    className="w-full gradient-orange text-white"
                  >
                    تأكيد الحجز المبدئي
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="size-10" />
                </div>
                <DialogTitle className="text-2xl">تم الحجز بنجاح!</DialogTitle>
                <DialogDescription className="text-base">
                  رقم الحجز: <span className="font-bold text-heading">JH-{Math.floor(Math.random() * 90000) + 10000}</span>
                  <br />
                  يرجى الاحتفاظ بهذا الرقم وإبرازه عند مدخل {selectedSite}.
                </DialogDescription>
                <Button onClick={closeDialog} className="mt-4">
                  إغلاق
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. Tours Dialog */}
        <Dialog open={activeDialog === 'tours'} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">الجولات المرشدة</DialogTitle>
              <DialogDescription>
                اختر من باقات الجولات المتوفرة واستمتع برحلة معرفية فريدة.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {TOURS.map((tour) => (
                <div key={tour.id} className="border rounded-xl p-4 flex flex-col gap-3 hover:border-orange/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-heading">{tour.name}</h4>
                    <span className="text-orange font-bold">{tour.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {tour.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {tour.sites.join(' ، ')}</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">احجز جولة</Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* 3. Apps Dialog */}
        <Dialog open={activeDialog === 'apps'} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl">تطبيقات الجوال</DialogTitle>
              <DialogDescription>
                حمل تطبيق "بوابة الأردن" الرسمي المتوفر على جميع المنصات.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="size-20 bg-muted rounded-2xl flex items-center justify-center">
                <Smartphone className="size-10 text-orange" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-xl hover:opacity-90 transition-opacity">
                  <div className="text-right">
                    <div className="text-[10px] opacity-70">Download on</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-xl hover:opacity-90 transition-opacity">
                  <div className="text-right">
                    <div className="text-[10px] opacity-70">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 4. Info Dialog */}
        <Dialog open={activeDialog === 'info'} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">معلومات الزيارة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Hours */}
              <div>
                <h4 className="flex items-center gap-2 font-bold mb-3 text-orange">
                  <Clock className="size-4" /> أوقات الدوام
                </h4>
                <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span>التوقيت الصيفي</span>
                    <span className="font-semibold">8:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التوقيت الشتوي</span>
                    <span className="font-semibold">8:00 ص - 4:00 م</span>
                  </div>
                </div>
              </div>

              {/* Prices */}
              <div>
                <h4 className="flex items-center gap-2 font-bold mb-3 text-orange">
                  <Coins className="size-4" /> أسعار التذاكر
                </h4>
                <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span>الأردنيين وأبناء قطاع غزة</span>
                    <span className="font-semibold">0.25 - 1.00 دينار</span>
                  </div>
                  <div className="flex justify-between">
                    <span>السياح الأجانب</span>
                    <span className="font-semibold">1.00 - 50.00 دينار</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                  * قد تختلف الأسعار حسب الموقع (البترا لها تسعيرة خاصة).
                </p>
              </div>

              {/* Rules */}
              <div>
                <h4 className="flex items-center gap-2 font-bold mb-3 text-orange">
                  <Scale className="size-4" /> تعليمات عامة
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span className="text-orange">•</span>
                    <span>يمنع منعاً باتاً العبث بالآثار أو الكتابة عليها.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange">•</span>
                    <span>الالتزام بالمسارات المحددة داخل المواقع.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange">•</span>
                    <span>الحفاظ على نظافة الموقع ووضع النفايات في أماكنها الحصيصة.</span>
                  </li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

/* ─── ServiceCard Component ────────────────────────────────────────── */

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
}

function ServiceCard({ icon: Icon, title, description, cta, onClick }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col text-center items-center gap-4 ring-1 ring-foreground/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-b-transparent hover:border-b-orange">
      <div className="size-20 rounded-2xl bg-orange/5 text-orange flex items-center justify-center mb-2">
        <Icon className="size-10" />
      </div>
      <h3 className="text-2xl font-bold text-heading">{title}</h3>
      <p className="text-body leading-relaxed max-w-sm">{description}</p>
      <div className="flex-1" />
      <Button
        onClick={onClick}
        className="w-full mt-4 gradient-orange text-white gap-2 font-bold py-6 text-lg rounded-xl"
      >
        {cta}
        <ChevronLeft className="size-5" />
      </Button>
    </div>
  );
}
