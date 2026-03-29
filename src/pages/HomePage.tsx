import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { JordanMapPreview } from '@/components/home/JordanMapPreview';
import { SectionCards } from '@/components/home/SectionCards';

export function HomePage(): React.ReactElement {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <JordanMapPreview />
      <SectionCards />
    </div>
  );
}
