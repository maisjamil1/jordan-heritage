import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Landmark,
  Palette,
  Archive,
  FolderKanban,
  GraduationCap,
  Users,
  AlertTriangle,
  Map,
  Menu,
  X,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import logo from "../../../public/logo.jpeg"
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'المواقع الأثرية', path: '/sites', icon: <Landmark className="w-4 h-4" /> },
  { label: 'التراث الثقافي', path: '/culture', icon: <Palette className="w-4 h-4" /> },
  { label: 'الأرشيف الرقمي', path: '/archive', icon: <Archive className="w-4 h-4" /> },
  { label: 'المشاريع', path: '/projects', icon: <FolderKanban className="w-4 h-4" /> },
  { label: 'التعليم', path: '/education', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'الزيارة', path: '/visit', icon: <Plane className="w-4 h-4" /> },
  { label: 'المجتمع', path: '/community', icon: <Users className="w-4 h-4" /> },
  { label: 'الإبلاغ', path: '/report-damage', icon: <AlertTriangle className="w-4 h-4" /> },
  { label: 'الخريطة', path: '/map', icon: <Map className="w-4 h-4" /> },
];

export function Header(): React.ReactElement {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{"background":"#d45a00"}} className="sticky top-0 z-50 gradient-header  glass border-b border-white/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <img src={logo} width={"40"} height={"40"} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white text-sm font-bold leading-tight !text-white">
                عدسة - بوابة الأردن الأثرية
              </h1>
              <p className="text-white/70 text-xs !text-white/70">دائرة الآثار العامة</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white/25 text-white font-bold'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/15"
                aria-label="فتح القائمة"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <SheetTitle className="text-lg font-bold mb-6 text-heading">
                القائمة
              </SheetTitle>
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-orange text-white font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
