import { ComplaintStatus } from '@/types/complaint';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'status-submitted' },
  assigned: { label: 'Assigned', className: 'status-assigned' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  resolved: { label: 'Resolved', className: 'status-resolved' },
  closed: { label: 'Closed', className: 'status-closed' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
