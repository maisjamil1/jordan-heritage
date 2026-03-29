import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps): React.ReactElement {
  return (
    <div className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <Icon className="size-8 md:size-10 text-orange" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-base md:text-lg text-body max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
