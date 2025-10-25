import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': variant === 'error',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}
