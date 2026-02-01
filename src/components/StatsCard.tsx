import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <Card className={cn('glass-card', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <p className={cn(
                'text-xs mt-1',
                trendUp ? 'text-green-600' : 'text-red-600'
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
