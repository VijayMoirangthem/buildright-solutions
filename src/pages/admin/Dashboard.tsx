import { Users, HardHat, FolderKanban, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardStats, activityLog } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Clients',
      value: dashboardStats.totalClients,
      icon: Users,
      change: '+2 this month',
      trend: 'up',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Labours',
      value: dashboardStats.totalLabours,
      icon: HardHat,
      change: '+1 this month',
      trend: 'up',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Active Projects',
      value: dashboardStats.activeProjects,
      icon: FolderKanban,
      change: '2 ongoing',
      trend: 'up',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Total Transactions',
      value: `₹${(dashboardStats.totalTransactions / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      change: '+₹3.5L this month',
      trend: 'up',
      color: 'text-info',
      bg: 'bg-info/10',
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
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
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

        {/* Chart Placeholder */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-t from-primary/5 to-transparent rounded-lg flex items-end justify-center p-4">
              <div className="flex items-end gap-4 w-full justify-around">
                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, index) => {
                  const incomeHeight = [60, 80, 70, 90, 75][index];
                  const expenseHeight = [40, 50, 45, 60, 50][index];
                  return (
                    <div key={month} className="flex flex-col items-center gap-2">
                      <div className="flex gap-1 items-end h-40">
                        <div
                          className="w-6 bg-primary rounded-t transition-all hover:opacity-80"
                          style={{ height: `${incomeHeight}%` }}
                        />
                        <div
                          className="w-6 bg-danger/60 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${expenseHeight}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-danger/60" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
