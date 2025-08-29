import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: "border-border",
  success: "border-success bg-success/5",
  warning: "border-warning bg-warning/5", 
  danger: "border-destructive bg-destructive/5"
};

export function MetricCard({ title, value, icon: Icon, trend, variant = 'default', className }: MetricCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && value > 1000000 
            ? `${(value / 1000000).toFixed(1)}M` 
            : value.toLocaleString()}
        </div>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            trend.value > 0 ? "text-success" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}