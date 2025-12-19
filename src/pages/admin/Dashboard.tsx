import { useNavigate } from 'react-router-dom';
import { Users, HardHat, FolderKanban, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

export default function Dashboard() {
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const { clients, labours, projects } = useData();
  
  const stats = [
    {
      label: 'Projects',
      value: `${projects.filter(p => p.status === 'Ongoing').length} Active`,
      total: `${projects.length} total`,
      icon: FolderKanban,
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/admin/projects',
    },
    {
      label: 'Clients',
      value: `${clients.length}`,
      total: 'Manage clients',
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10',
      path: '/admin/clients',
    },
    {
      label: 'Labours',
      value: `${labours.filter(l => l.status === 'Active').length} Active`,
      total: `${labours.length} total`,
      icon: HardHat,
      color: 'text-warning',
      bg: 'bg-warning/10',
      path: '/admin/labours',
    },
    {
      label: 'Resources',
      value: 'Resources',
      icon: Package,
      color: 'text-primary',
      bg: 'bg-success/10',
      path: '/admin/resources',
    },
    {
      label: 'Settings',
      value: 'Configure',
      total: 'App settings',
      icon: Settings,
      color: 'text-info',
      bg: 'bg-info/10',
      path: '/admin/settings',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's an overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(stat.path)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between w-full mb-3 sm:mb-4">
                 <div className="space-y-1 sm:space-y-2">
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                {/* <div className="text-right ml-2">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div> */}
               
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.total}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
