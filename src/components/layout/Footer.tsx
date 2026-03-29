import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, MessageCircle, Camera, Play } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const FOOTER_LINKS = [
  {
    title: 'روابط سريعة',
    links: [
      { label: 'المواقع الأثرية', path: '/sites' },
      { label: 'التراث الثقافي', path: '/culture' },
      { label: 'الأرشيف الرقمي', path: '/archive' },
      { label: 'المشاريع الرقمية', path: '/projects' },
    ],
  },
  {
    title: 'خدمات',
    links: [
      { label: 'التعليم والبحث', path: '/education' },
      { label: 'الزيارة والسياحة', path: '/visit' },
      { label: 'المجتمع', path: '/community' },
      { label: 'الإبلاغ عن ضرر', path: '/report-damage' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <Globe className="w-5 h-5" />, label: 'فيسبوك', href: '#' },
  { icon: <MessageCircle className="w-5 h-5" />, label: 'تويتر', href: '#' },
  { icon: <Camera className="w-5 h-5" />, label: 'انستغرام', href: '#' },
  { icon: <Play className="w-5 h-5" />, label: 'يوتيوب', href: '#' },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#1E293B] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg !text-white">بوابة الأردن الأثرية</h3>
                <p className="text-white/60 text-xs !text-white/60">دائرة الآثار العامة</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4 !text-white/70">
              بوابة إلكترونية شاملة تهدف إلى توثيق وحماية التراث الأثري والثقافي في المملكة الأردنية الهاشمية.
            </p>
            <div className="space-y-2">
              <a href="tel:+96264612311" className="flex items-center gap-2 text-white/70 hover:text-orange text-sm transition-colors">
                <Phone className="w-4 h-4" />
                <span dir="ltr">+962 6 461 2311</span>
              </a>
              <a href="mailto:info@doa.gov.jo" className="flex items-center gap-2 text-white/70 hover:text-orange text-sm transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@doa.gov.jo</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-bold text-base mb-4 !text-white">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-orange text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-base mb-4 !text-white">تابعنا</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange transition-colors text-white/70 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="font-bold text-base mb-2 !text-white">الموقع</h4>
              <p className="text-white/70 text-sm !text-white/70">
                عمّان - جبل القلعة
                <br />
                المملكة الأردنية الهاشمية
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <p className="!text-white/50">© {new Date().getFullYear()} دائرة الآثار العامة الأردنية. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link to="/" className="hover:text-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
