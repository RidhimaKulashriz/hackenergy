import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Users, Calendar, DollarSign, BarChart } from 'lucide-react';
import { ComponentType } from 'react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change?: number; 
  icon: ComponentType<{ className?: string }> 
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
          {change >= 0 ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {Math.abs(change)}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard stats</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Events"
        value={stats?.totalEvents.toString() || '0'}
        icon={Calendar}
      />
      <StatCard
        title="Participants"
        value={stats?.participants.toLocaleString() || '0'}
        change={12}
        icon={Users}
      />
      <StatCard
        title="Prize Pool"
        value={`$${(stats?.prizePool || 0).toLocaleString()}`}
        icon={DollarSign}
      />
      <StatCard
        title="Engagement"
        value={`${stats?.engagement || 0}%`}
        change={8}
        icon={BarChart}
      />
    </div>
  );
}
