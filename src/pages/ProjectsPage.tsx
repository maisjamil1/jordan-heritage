import { useState } from 'react';
import {
  FolderKanban,
  Camera,
  Map,
  FileText,
  Box,
  Video,
  BookOpen,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { cn } from '@/lib/utils';
import projectsData from '@/data/projects.json';
import type { Project } from '@/lib/types';

const projects = projectsData as Project[];

/* ─── Featured project resources ───────────────────────────────────── */

interface ProjectResource {
  icon: LucideIcon;
  label: string;
}

const UNAIZAH_RESOURCES: ProjectResource[] = [
  { icon: Camera, label: 'المكتبة الصورية' },
  { icon: Map, label: 'الخرائط المعمارية' },
  { icon: FileText, label: 'الوثائق التاريخية' },
  { icon: Box, label: 'نموذج ثلاثي الابعاد' },
  { icon: Video, label: 'التسجيلات المرئية' },
  { icon: BookOpen, label: 'اللوحة التفسيرية' },
];

const FEATURED_IMAGES = ['/a1.jpeg', '/a2.jpeg'];

/* ─── Status config ────────────────────────────────────────────────── */

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  completed: {
    label: 'مكتمل',
    color: 'text-success',
    bgColor: 'bg-success/10',
    icon: CheckCircle2,
  },
  ongoing: {
    label: 'قيد التنفيذ',
    color: 'text-blue',
    bgColor: 'bg-blue/10',
    icon: Clock,
  },
  planned: {
    label: 'مخطط',
    color: 'text-orange',
    bgColor: 'bg-orange/10',
    icon: CalendarClock,
  },
};

/* ─── Page ─────────────────────────────────────────────────────────── */

export function ProjectsPage(): React.ReactElement {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <SectionHeader
          icon={FolderKanban}
          title="المشاريع الرقمية"
          subtitle="تتبع مشاريع المسح والتوثيق الرقمي للمواقع الأثرية الأردنية"
        />

        {/* ── Featured Project: قلعة عنيزة ──────────────────────── */}
        <FeaturedProject />

        {/* ── All Projects Grid ────────────────────────────────────── */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-8 text-center">
            جميع المشاريع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FeaturedProject ──────────────────────────────────────────────── */

function FeaturedProject(): React.ReactElement {
  const [activeImage, setActiveImage] = useState(0);

  function handlePrev(): void {
    setActiveImage((prev) => (prev === 0 ? FEATURED_IMAGES.length - 1 : prev - 1));
  }

  function handleNext(): void {
    setActiveImage((prev) => (prev === FEATURED_IMAGES.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      className="bg-white rounded-2xl ring-1 ring-foreground/10 overflow-hidden shadow-lg"
      id="featured-project-unaizah"
    >
      {/* Header band */}
      <div className="gradient-orange px-6 py-4 md:px-8 md:py-5">
        <h2 className="text-xl md:text-2xl font-extrabold text-white text-center">
          مشروع قلعة عنيزة الاثرية
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* ── Image Gallery ──────────────────────────────────────── */}
        <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-muted">
          {FEATURED_IMAGES.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`قلعة عنيزة - ${idx + 1}`}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                idx === activeImage ? 'opacity-100' : 'opacity-0'
              )}
            />
          ))}

          {/* Nav arrows */}
          <button
            onClick={handlePrev}
            className="absolute start-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="الصورة السابقة"
          >
            <ChevronRight className="size-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute end-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {FEATURED_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  'size-2.5 rounded-full transition-all cursor-pointer',
                  idx === activeImage ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                )}
                aria-label={`عرض الصورة ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Resources List ─────────────────────────────────────── */}
        <div className="p-6 md:p-8 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-heading mb-1">
            محتويات المشروع
          </h3>
          <p className="text-sm text-body mb-5 leading-relaxed">
            المصادر والمواد المتوفرة في مشروع توثيق قلعة عنيزة الأثرية
          </p>

          <ul className="space-y-3 flex-1">
            {UNAIZAH_RESOURCES.map((resource) => {
              const Icon = resource.icon;
              return (
                <li
                  key={resource.label}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="size-10 rounded-lg gradient-orange flex-shrink-0 flex items-center justify-center shadow-sm">
                    <Icon className="size-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-heading">
                    {resource.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── ProjectCard ──────────────────────────────────────────────────── */

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  const status = STATUS_MAP[project.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        'bg-white rounded-xl ring-1 ring-foreground/10 overflow-hidden transition-all duration-300 flex flex-col',
        'hover:shadow-lg hover:-translate-y-1 hover:ring-orange/30'
      )}
      id={`project-card-${project.id}`}
    >
      <div className="p-5 md:p-6 flex flex-col flex-1">
        {/* Status badge */}
        <Badge
          className={cn(
            'w-fit text-xs rounded-full px-3 py-0.5 mb-3 gap-1',
            status.bgColor,
            status.color
          )}
        >
          <StatusIcon className="size-3" />
          {status.label}
        </Badge>

        {/* Title */}
        <h3 className="text-lg font-bold text-heading mb-2 leading-snug">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-body leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>التقدم</span>
            <span className="font-semibold text-heading">{project.progress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                project.status === 'completed' ? 'bg-success' : 'gradient-orange'
              )}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {project.startDate} — {project.endDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {project.team}
          </span>
          <span className="flex items-center gap-1 col-span-2">
            <DollarSign className="size-3" />
            {project.budget}
          </span>
        </div>
      </div>
    </div>
  );
}
