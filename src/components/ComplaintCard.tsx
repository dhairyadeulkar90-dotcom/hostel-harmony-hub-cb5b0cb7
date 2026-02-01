import { Complaint } from '@/types/complaint';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Droplet, 
  Zap, 
  Sparkles, 
  Wifi, 
  Home,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
  showActions?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  plumbing: <Droplet className="h-4 w-4" />,
  electricity: <Zap className="h-4 w-4" />,
  cleanliness: <Sparkles className="h-4 w-4" />,
  internet: <Wifi className="h-4 w-4" />,
  room: <Home className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  plumbing: 'Plumbing',
  electricity: 'Electricity',
  cleanliness: 'Cleanliness',
  internet: 'Internet',
  room: 'Room',
  other: 'Other',
};

export function ComplaintCard({ complaint, onClick, showActions = true }: ComplaintCardProps) {
  return (
    <Card 
      className="glass-card hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {categoryIcons[complaint.category]}
            <span className="text-sm font-medium">{categoryLabels[complaint.category]}</span>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-foreground mb-2">{complaint.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {complaint.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{complaint.hostelBlock}, Room {complaint.roomNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(complaint.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
          {showActions && (
            <Button variant="ghost" size="sm" className="h-6 px-2">
              View <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
