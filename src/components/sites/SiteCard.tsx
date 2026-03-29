import { Link } from 'react-router-dom';
import { Eye, Map, Image, FileText, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Site, Labels } from '@/lib/types';
import labelsData from '@/data/labels.json';

const labels = labelsData as Labels;

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps): React.ReactElement {
  return (
    <div className="group bg-white rounded-xl overflow-hidden ring-1 ring-foreground/10 card-hover flex flex-col">
      {/* Image area */}
      <div className="h-48 bg-gradient-to-br from-orange/10 via-blue/5 to-orange/20 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">
          🏛️
        </span>
        {/* Status overlay */}
        <div className="absolute top-3 start-3">
          <StatusBadge status={site.status} />
        </div>
        {site.has3DModel && (
          <div className="absolute top-3 end-3">
            <Badge className="bg-orange text-white gap-1">
              <Box className="size-3" />
              نموذج 3D
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-bold text-heading mb-2 line-clamp-1 group-hover:text-orange transition-colors">
          {site.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-body line-clamp-2 mb-3 leading-relaxed">
          {site.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="outline" className="text-xs bg-muted/50">
            {labels.periods[site.period] ?? site.period}
          </Badge>
          <Badge variant="outline" className="text-xs bg-muted/50">
            {labels.types[site.type] ?? site.type}
          </Badge>
          <Badge variant="outline" className="text-xs bg-blue/10 text-blue border-blue/20">
            {labels.governorates[site.governorate] ?? site.governorate}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Image className="size-3.5" />
            {site.images} صورة
          </span>
          <span className="flex items-center gap-1">
            <FileText className="size-3.5" />
            {site.documents} وثيقة
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Button asChild className="flex-1 gap-1.5 gradient-orange text-white hover:opacity-90" size="lg">
            <Link to={`/sites/${site.id}`}>
              <Eye className="size-4" />
              عرض التفاصيل
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-1.5">
            <Link to={`/map?site=${site.id}`}>
              <Map className="size-4" />
              الخريطة
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
