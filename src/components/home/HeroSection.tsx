import { useNavigate } from 'react-router-dom';
import { Compass, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/banner.jpeg')` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

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
              background: 'linear-gradient(135deg, #f96b09 60%, #0074ae 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            اكتشف تراثنا الرقمي
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up"
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce"
          style={{ animationDelay: '1s' }}
        >
          <span className="text-xs">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
