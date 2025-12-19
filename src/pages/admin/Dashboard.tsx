import { useNavigate } from 'react-router-dom';
import { Users, HardHat, FolderKanban, IndianRupee, TrendingUp, TrendingDown, FileText, Settings } from 'lucide-react';
import { dashboardStats, activityLog } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const stats = [
    {
      label: 'Clients',
      value: 'Manage Clients',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/admin/clients',
    },
    {
      label: 'Labours',
      value: 'Manage Labours',
      icon: HardHat,
      color: 'text-primary',
      bg: 'bg-success/10',
      path: '/admin/labours',
    },
    {
      label: 'Resources',
      value: 'Manage Resources',
      icon: FolderKanban,
      color: 'text-primary',
      bg: 'bg-success/10',
      path: '/admin/resources',
    },
    // {
    //   label: 'Notes',
    //   value: 'Manage Notes',
    //   icon: FileText,
    //   change: 'New ideas',
    //   trend: 'up',
    //   color: 'text-info',
    //   bg: 'bg-info/10',
    //   path: '/admin/notes',
    // },
    {
      label: 'Settings',
      value: 'Manage Settings',
      icon: Settings,
      color: 'text-info',
      bg: 'bg-info/10',
      path: '/admin/settings',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client':
        return Users;
      case 'labour':
        return HardHat;
      case 'resource':
        return FolderKanban;
      case 'payment':
        return IndianRupee;
      default:
        return FolderKanban;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-primary/10 text-primary';
      case 'labour':
        return 'bg-success/10 text-success';
      case 'resource':
        return 'bg-warning/10 text-warning';
      case 'payment':
        return 'bg-info/10 text-info';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's an overview.
        </p>
      </div>

      {/* Stats Grid - Fixed for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(stat.path)}
          >
            <CardContent className="p-4 sm:p-6">
              {/* Top Row: Icon on left, label on right for better mobile layout */}
              <div className="flex items-start justify-between w-full mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
              
              {/* Bottom Row: Value and change */}
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alternative Layout Option (if you prefer a simpler design) */}
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(stat.path)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                  <div className={`flex items-center justify-center sm:justify-start gap-1 text-xs mt-1 ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      */}
    </div>
  );
}