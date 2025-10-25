import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </p>
            <p className="text-3xl font-bold mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
