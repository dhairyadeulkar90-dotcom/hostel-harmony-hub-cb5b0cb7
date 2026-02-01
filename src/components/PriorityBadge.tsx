import { ComplaintPriority } from '@/types/complaint';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  className?: string;
}

const priorityConfig: Record<ComplaintPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low: { label: 'Low', className: 'priority-low' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
