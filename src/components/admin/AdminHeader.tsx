import { Menu } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

export function AdminHeader() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground md:hidden">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">Ningthou Constructions</span>
      </div>

      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </header>
  );
}
