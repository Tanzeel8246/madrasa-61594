import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("shadow-elevated hover:shadow-elevated transition-all duration-300 hover:-translate-y-1", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 md:space-y-2">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn("text-xs md:text-sm font-medium", trend.isPositive ? "text-primary" : "text-destructive")}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
