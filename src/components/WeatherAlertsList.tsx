
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CloudRain, CloudSnow, Calendar, MapPin } from 'lucide-react';
import { WeatherAlert } from '@/types/weather';
import { format, parseISO } from 'date-fns';

interface WeatherAlertsListProps {
  alerts: WeatherAlert[];
  onToggleAlert: (alertId: string) => void;
}

const WeatherAlertsList: React.FC<WeatherAlertsListProps> = ({ alerts, onToggleAlert }) => {
  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'snowstorm':
      case 'ice storm':
        return <CloudSnow className="h-4 w-4" />;
      default:
        return <CloudRain className="h-4 w-4" />;
    }
  };

  const getWeatherEmoji = (type: string) => {
    switch (type) {
      case 'snowstorm': return '❄️';
      case 'hurricane': return '🌀';
      case 'thunderstorm': return '⛈️';
      case 'ice storm': return '🧊';
      case 'flooding': return '🌊';
      default: return '🌧️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Active Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CloudRain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active weather alerts</p>
            <p className="text-sm">Create a weather alert to track affected shipments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <CloudRain className="h-5 w-5" />
          Active Weather Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(alert.weatherType)}
                      <span className="text-lg">{getWeatherEmoji(alert.weatherType)}</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {alert.weatherType.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={alert.isActive ? 'default' : 'secondary'} className="ml-auto">
                      {alert.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-mono font-medium">{alert.metroCode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(alert.date), 'EEEE, MMMM dd, yyyy')}
                    </div>
                  </div>
                  
                  {alert.description && (
                    <p className="text-gray-700 text-sm">{alert.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {format(parseISO(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    variant={alert.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => onToggleAlert(alert.id)}
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherAlertsList;
