import { useNavigate } from 'react-router-dom';
import { Users, HardHat, FolderKanban, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardStats, activityLog } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const stats = [
    {
      label: 'Total Clients',
      value: dashboardStats.totalClients,
      icon: Users,
      change: '+2 this month',
      trend: 'up',
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/admin/clients',
    },
    {
      label: 'Total Labours',
      value: dashboardStats.totalLabours,
      icon: HardHat,
      change: '+1 this month',
      trend: 'up',
      color: 'text-success',
      bg: 'bg-success/10',
      path: '/admin/labours',
    },
    {
      label: 'Active Projects',
      value: dashboardStats.activeProjects,
      icon: FolderKanban,
      change: '2 ongoing',
      trend: 'up',
      color: 'text-warning',
      bg: 'bg-warning/10',
      path: '/admin/clients',
    },
    {
      label: 'Total Transactions',
      value: `₹${(dashboardStats.totalTransactions / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      change: '+₹3.5L this month',
      trend: 'up',
      color: 'text-info',
      bg: 'bg-info/10',
      path: '/admin/resources',
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(stat.path)}
          >
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div className={`hidden sm:flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 hidden sm:block">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
