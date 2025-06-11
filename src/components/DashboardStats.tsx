
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
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Weather Affected',
      value: affectedShipments,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'In Transit',
      value: inTransitShipments,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
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
