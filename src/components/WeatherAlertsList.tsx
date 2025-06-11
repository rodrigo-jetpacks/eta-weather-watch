
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
      case 'low': return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'medium': return 'bg-secondary text-secondary-foreground border-border';
      case 'high': return 'bg-primary/20 text-primary border-primary/30';
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
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
          <div className="text-center py-8 text-muted-foreground">
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
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <CloudRain className="h-5 w-5" />
          Active Weather Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(alert.weatherType)}
                      <span className="text-lg">{getWeatherEmoji(alert.weatherType)}</span>
                      <span className="font-semibold text-foreground capitalize">
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
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                    <p className="text-foreground text-sm">{alert.description}</p>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
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
