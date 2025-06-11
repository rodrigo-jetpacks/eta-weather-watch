
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, CloudRain, Truck, Calendar } from 'lucide-react';
import { BTSShipment, WeatherAlert, WeatherEvent } from '@/types/weather';

interface DashboardStatsProps {
  shipments: BTSShipment[];
  weatherAlerts: WeatherAlert[];
  weatherEvents: WeatherEvent[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ shipments, weatherAlerts, weatherEvents }) => {
  const activeAlerts = weatherAlerts.filter(alert => alert.isActive).length;
  const totalShipments = shipments.length;
  const affectedShipments = weatherEvents.length;
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
  const delayedShipments = shipments.filter(s => s.status === 'delayed').length;
  
  const stats = [
    {
      title: 'Active Weather Alerts',
      value: activeAlerts,
      icon: CloudRain,
      variant: 'destructive' as const
    },
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      variant: 'primary' as const
    },
    {
      title: 'Weather Affected',
      value: affectedShipments,
      icon: Truck,
      variant: 'secondary' as const
    },
    {
      title: 'In Transit',
      value: inTransitShipments,
      icon: Calendar,
      variant: 'accent' as const
    }
  ];

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return {
          card: 'bg-destructive/5 border-destructive/20',
          text: 'text-destructive',
          icon: 'bg-destructive/10'
        };
      case 'primary':
        return {
          card: 'bg-primary/5 border-primary/20',
          text: 'text-primary',
          icon: 'bg-primary/10'
        };
      case 'secondary':
        return {
          card: 'bg-secondary border-border',
          text: 'text-secondary-foreground',
          icon: 'bg-secondary'
        };
      case 'accent':
        return {
          card: 'bg-accent/5 border-accent/20',
          text: 'text-accent',
          icon: 'bg-accent/10'
        };
      default:
        return {
          card: 'bg-card border-border',
          text: 'text-foreground',
          icon: 'bg-muted'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const styles = getVariantStyles(stat.variant);
        
        return (
          <Card key={index} className={`${styles.card} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${styles.text}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${styles.icon}`}>
                  <Icon className={`h-6 w-6 ${styles.text}`} />
                </div>
              </div>
              
              {index === 2 && affectedShipments > 0 && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {delayedShipments} delayed
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
