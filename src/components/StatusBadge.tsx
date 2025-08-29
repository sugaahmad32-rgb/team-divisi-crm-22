import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types/crm";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

const statusConfig = {
  new: {
    label: 'New',
    className: 'bg-status-new text-status-new-foreground border-status-new'
  },
  cold: {
    label: 'Cold',
    className: 'bg-status-cold text-status-cold-foreground border-status-cold'
  },
  warm: {
    label: 'Warm',
    className: 'bg-status-warm text-status-warm-foreground border-status-warm'
  },
  hot: {
    label: 'Hot',
    className: 'bg-status-hot text-status-hot-foreground border-status-hot'
  },
  deal: {
    label: 'Deal',
    className: 'bg-status-deal text-status-deal-foreground border-status-deal'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}