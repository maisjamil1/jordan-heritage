interface SiteGalleryProps {
  gallery: string[];
  siteName: string;
}

export function SiteGallery({ gallery, siteName }: SiteGalleryProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {gallery.map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-xl bg-gradient-to-br from-orange/10 via-blue/5 to-orange/20 flex items-center justify-center ring-1 ring-foreground/5 hover:ring-orange/30 transition-all cursor-pointer group overflow-hidden"
        >
          <span className="text-4xl opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-300">
            🏛️
          </span>
          <span className="sr-only">{siteName} - صورة {index + 1}</span>
        </div>
      ))}
    </div>
  );
}
