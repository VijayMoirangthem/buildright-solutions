import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  HardHat,
  Package,
  Settings,
  Building2,
  LogOut,
  FolderKanban,
  HardDrive,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useStorage } from '@/contexts/StorageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: HardHat, label: 'Labours', path: '/admin/labours' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: Package, label: 'Resources', path: '/admin/resources' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: HardDrive, label: 'Storage', path: '/admin/storage' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const { usagePercentage, isWarning, isCritical, formatBytes, usedStorage, totalStorage } = useStorage();
  const collapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Hidden title for accessibility */}
      <VisuallyHidden>
        <h2>Navigation Menu</h2>
      </VisuallyHidden>
      
      <SidebarHeader className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="font-semibold text-foreground text-sm truncate">Ningthoujam Constructions</h2>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={collapsed ? item.label : undefined}>
                      <Link
                        to={item.path}
                        onClick={() => isMobile && setOpenMobile(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && (
                          <span className="flex items-center justify-between flex-1">
                            {item.label}
                            {item.path === '/admin/storage' && (isCritical || isWarning) && (
                              <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-danger' : 'bg-warning'}`} />
                            )}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Storage Indicator */}
        {!collapsed && (
          <div className="px-4 mt-4">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Storage</span>
                <span className={`font-medium ${isCritical ? 'text-danger' : isWarning ? 'text-warning' : 'text-foreground'}`}>
                  {usagePercentage.toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={usagePercentage} 
                className={`h-1.5 ${isCritical ? '[&>div]:bg-danger' : isWarning ? '[&>div]:bg-warning' : ''}`}
              />
              <p className="text-xs text-muted-foreground">
                {formatBytes(usedStorage)} / {formatBytes(totalStorage)}
              </p>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate capitalize">{user?.username || 'Admin'}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={handleLogout}
          className={`w-full text-danger hover:text-danger hover:bg-danger/10 ${collapsed ? '' : 'justify-start'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}