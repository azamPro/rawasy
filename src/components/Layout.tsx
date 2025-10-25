import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  AlertTriangle,
  MapPin,
  FileText,
  Settings,
  Menu,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Workers', href: '/workers', icon: Users },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Zones', href: '/zones', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, themeMode, setThemeMode } = useAppStore();

  const cycleTheme = () => {
    const modes: Array<typeof themeMode> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block">Rawasy</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={cycleTheme}>
              <ThemeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-card transition-transform duration-300 top-16',
            'lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden top-16"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
