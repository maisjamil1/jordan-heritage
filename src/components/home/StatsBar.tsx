import { useEffect, useState, useCallback } from 'react';
import { Landmark, Archive, Box, Camera } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

const STATS: StatItem[] = [
  {
    icon: <Landmark className="w-7 h-7" />,
    value: 548,
    label: 'موقع أثري',
    color: 'text-orange',
    bgColor: 'bg-orange/10',
  },
  {
    icon: <Archive className="w-7 h-7" />,
    value: 1247,
    label: 'وثيقة رقمية',
    color: 'text-blue',
    bgColor: 'bg-blue/10',
  },
  {
    icon: <Box className="w-7 h-7" />,
    value: 73,
    label: 'نموذج 3D',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: <Camera className="w-7 h-7" />,
    value: 2156,
    label: 'صورة أرشيفية',
    color: 'text-orange-dark',
    bgColor: 'bg-orange/10',
  },
];

function useCountAnimation(target: number, isVisible: boolean, duration: number = 2000): number {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();

    function step(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
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

function StatCard({ stat, isVisible, delay }: { stat: StatItem; isVisible: boolean; delay: number }): React.ReactElement {
  const animatedValue = useCountAnimation(stat.value, isVisible);

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 card-hover opacity-0"
      style={{
        animation: isVisible ? `fade-in-up 0.6s ease-out ${delay}s forwards` : 'none',
      }}
    >
      <div className={`w-14 h-14 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
        {stat.icon}
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

export function StatsBar(): React.ReactElement {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="py-16 bg-section-alt" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
