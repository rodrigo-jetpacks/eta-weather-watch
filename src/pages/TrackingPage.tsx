
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Circle, 
  CloudRain,
  ArrowLeft,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { BTSShipment, WeatherAlert, WeatherEvent } from '@/types/weather';
import { mockShipments, mockWeatherAlerts, mockWeatherEvents } from '@/data/mockData';
import { format, parseISO } from 'date-fns';

const TrackingPage = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [shipment, setShipment] = useState<BTSShipment | null>(null);
  const [weatherAlert, setWeatherAlert] = useState<WeatherAlert | null>(null);
  const [weatherEvent, setWeatherEvent] = useState<WeatherEvent | null>(null);

  useEffect(() => {
    // Find shipment by tracking number
    const foundShipment = mockShipments.find(s => s.trackingNumber === trackingNumber);
    setShipment(foundShipment || null);

    if (foundShipment) {
      // Find related weather event
      const foundWeatherEvent = mockWeatherEvents.find(e => e.shipmentId === foundShipment.id);
      setWeatherEvent(foundWeatherEvent || null);

      if (foundWeatherEvent) {
        // Find related weather alert
        const foundWeatherAlert = mockWeatherAlerts.find(a => a.id === foundWeatherEvent.weatherAlertId);
        setWeatherAlert(foundWeatherAlert || null);
      }
    }
  }, [trackingNumber]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-accent/20 text-accent-foreground';
      case 'in_transit': return 'bg-primary/20 text-primary';
      case 'delayed': return 'bg-destructive/20 text-destructive';
      case 'processing': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressSteps = () => {
    if (!shipment) return [];
    
    const steps = [
      { id: 'processing', label: 'Processing', completed: true },
      { id: 'in_transit', label: 'In Transit', completed: shipment.status !== 'processing' },
      { id: 'out_for_delivery', label: 'Out for Delivery', completed: shipment.status === 'delivered' },
      { id: 'delivered', label: 'Delivered', completed: shipment.status === 'delivered' }
    ];

    return steps;
  };

  if (!shipment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Tracking Number Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {trackingNumber ? `No shipment found for tracking number: ${trackingNumber}` : 'Please provide a valid tracking number'}
            </p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressSteps = getProgressSteps();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Package Tracking</h1>
            <p className="text-muted-foreground">Track your BTS shipment in real-time</p>
          </div>
        </div>

        {/* Weather Alert Banner */}
        {weatherAlert && weatherEvent && (
          <Alert variant="destructive" className="border-l-4 border-l-destructive">
            <CloudRain className="h-4 w-4" />
            <AlertTitle>Weather Delay Alert</AlertTitle>
            <AlertDescription>
              Your package delivery may be delayed due to {weatherAlert.weatherType} in {weatherAlert.metroCode}. 
              Expected delay: {weatherEvent.delayHours} hours. We'll keep you updated on any changes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Shipment Details */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-mono font-bold text-primary">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{shipment.origin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{shipment.destination}</p>
                    <p className="text-xs text-muted-foreground">Metro Code: {shipment.destinationMetroCode}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Original ETA</p>
                    <p className="text-sm font-medium">{format(parseISO(shipment.originalETA), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>
                {shipment.adjustedETA && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">Adjusted ETA</p>
                      <p className="text-sm font-medium text-destructive">{format(parseISO(shipment.adjustedETA), 'MMM dd, HH:mm')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="font-medium">{shipment.customerName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-secondary to-muted">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-foreground" />
                Delivery Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {progressSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-accent fill-current" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                      {index < progressSteps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${step.completed ? 'bg-accent' : 'bg-muted'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.id === 'processing' && step.completed && (
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(shipment.scanTimestamp), 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {weatherEvent && (
                <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-4 w-4 text-destructive" />
                    <p className="font-medium text-destructive">Weather Impact</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Delivery delayed by {weatherEvent.delayHours} hours due to severe weather conditions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Tracking Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Real-time package location tracking</p>
                <p className="text-xs mt-2">Route: {shipment.origin} → {shipment.destination}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Customer Service</p>
                  <p className="text-sm text-muted-foreground">1-800-BTS-TRACK</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@btsweatherwatch.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
