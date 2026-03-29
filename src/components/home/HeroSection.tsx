import { useNavigate } from 'react-router-dom';
import { Compass, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background with geometric patterns */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[#0074ae]/5 via-white to-[#f96b09]/5" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f96b09' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-blue/5 rounded-full" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 text-orange text-sm font-medium mb-8 animate-fade-in-up">
            <Compass className="w-4 h-4" />
            <span>دائرة الآثار العامة الأردنية</span>
          </div>

          {/* Main Heading with gradient text */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up"
            style={{
              animationDelay: '0.15s',
              background: 'linear-gradient(135deg, #f96b09 0%, #0074ae 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            اكتشف تراثنا الرقمي
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-[#475569] leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            رحلة عبر التاريخ الأردني من خلال التقنيات الحديثة
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.45s' }}
          >
            <Button
              size="lg"
              className="gradient-orange text-white rounded-xl px-8 py-6 text-base font-bold shadow-lg shadow-orange/25 hover:shadow-xl hover:shadow-orange/30 hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/map')}
            >
              <Compass className="w-5 h-5 ms-2" />
              ابدأ الجولة الافتراضية
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-8 py-6 text-base font-bold border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/sites')}
            >
              استكشف المواقع
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce"
          style={{ animationDelay: '1s' }}
        >
          <span className="text-xs">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
