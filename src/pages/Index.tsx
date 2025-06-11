import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WeatherAlertForm from '@/components/WeatherAlertForm';
import ShipmentTable from '@/components/ShipmentTable';
import WeatherAlertsList from '@/components/WeatherAlertsList';
import DashboardStats from '@/components/DashboardStats';
import { CloudRain, Package, Truck, Calendar } from 'lucide-react';
import { mockShipments, mockWeatherAlerts, mockWeatherEvents } from '@/data/mockData';
import { WeatherAlert, BTSShipment, WeatherEvent } from '@/types/weather';
import { toast } from '@/hooks/use-toast';
const Index = () => {
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>(mockWeatherAlerts);
  const [shipments, setShipments] = useState<BTSShipment[]>(mockShipments);
  const [weatherEvents, setWeatherEvents] = useState<WeatherEvent[]>(mockWeatherEvents);
  const handleCreateWeatherAlert = (alertData: Omit<WeatherAlert, 'id' | 'createdAt'>) => {
    console.log('Creating weather alert:', alertData);
    const newAlert: WeatherAlert = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWeatherAlerts(prev => [...prev, newAlert]);

    // Find affected shipments
    const affectedShipments = shipments.filter(shipment => shipment.destinationMetroCode === alertData.metroCode && shipment.status !== 'delivered');
    console.log('Found affected shipments:', affectedShipments);

    // Create weather events for affected shipments
    const newWeatherEvents: WeatherEvent[] = affectedShipments.map(shipment => {
      // Calculate delay based on severity
      let delayHours = 0;
      switch (alertData.severity) {
        case 'low':
          delayHours = 12;
          break;
        case 'medium':
          delayHours = 24;
          break;
        case 'high':
          delayHours = 48;
          break;
        case 'critical':
          delayHours = 72;
          break;
      }
      return {
        id: `${newAlert.id}-${shipment.id}`,
        weatherAlertId: newAlert.id,
        shipmentId: shipment.id,
        impactLevel: alertData.severity === 'low' ? 'minor' : alertData.severity === 'medium' ? 'moderate' : alertData.severity === 'high' ? 'major' : 'severe',
        delayHours,
        createdAt: new Date().toISOString(),
        notificationSent: false
      };
    });
    setWeatherEvents(prev => [...prev, ...newWeatherEvents]);

    // Update shipment statuses to delayed for affected shipments
    setShipments(prev => prev.map(shipment => {
      if (affectedShipments.find(affected => affected.id === shipment.id)) {
        return {
          ...shipment,
          status: 'delayed' as const
        };
      }
      return shipment;
    }));
    toast({
      title: "Weather Processing Complete",
      description: `${affectedShipments.length} shipments affected by weather event in ${alertData.metroCode}`
    });
  };
  const handleToggleAlert = (alertId: string) => {
    setWeatherAlerts(prev => prev.map(alert => alert.id === alertId ? {
      ...alert,
      isActive: !alert.isActive
    } : alert));
    const alert = weatherAlerts.find(a => a.id === alertId);
    toast({
      title: alert?.isActive ? "Alert Deactivated" : "Alert Activated",
      description: `Weather alert for ${alert?.metroCode} has been ${alert?.isActive ? 'deactivated' : 'activated'}`
    });
  };
  const handleUpdateETA = (shipmentId: string, newETA: string) => {
    setShipments(prev => prev.map(shipment => shipment.id === shipmentId ? {
      ...shipment,
      adjustedETA: newETA
    } : shipment));
    const shipment = shipments.find(s => s.id === shipmentId);
    toast({
      title: "ETA Updated",
      description: `${shipment?.trackingNumber} delivery time has been adjusted due to weather conditions`
    });
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <CloudRain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-primary">BT Weather Watch</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamlined workflow to log weather events and adjust package ETAs for better customer communication
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats shipments={shipments} weatherAlerts={weatherAlerts} weatherEvents={weatherEvents} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card shadow-sm border-border">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <CloudRain className="h-4 w-4" />
              Weather Alerts
            </TabsTrigger>
            <TabsTrigger value="shipments" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Shipments
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Create Alert
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <WeatherAlertsList alerts={weatherAlerts} onToggleAlert={handleToggleAlert} />
          </TabsContent>

          <TabsContent value="shipments" className="space-y-4">
            <ShipmentTable shipments={shipments} weatherEvents={weatherEvents} onUpdateETA={handleUpdateETA} />
          </TabsContent>

          <TabsContent value="create" className="flex justify-center">
            <WeatherAlertForm onSubmit={handleCreateWeatherAlert} />
          </TabsContent>
        </Tabs>

        {/* Customer Alert Preview */}
        {weatherEvents.length > 0 && <Card className="border-l-4 border-l-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Truck className="h-5 w-5" />
                Customer Alert Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <CloudRain className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Weather Delay Notification</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Due to severe weather conditions in the delivery area, your package may experience delays.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">Tracking: BTS001234567</Badge>
                      <span className="text-muted-foreground">Expected delay: 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default Index;