import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, Calendar, ArrowUp, ExternalLink } from 'lucide-react';
import { BTSShipment, WeatherEvent } from '@/types/weather';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

interface ShipmentTableProps {
  shipments: BTSShipment[];
  weatherEvents: WeatherEvent[];
  onUpdateETA: (shipmentId: string, newETA: string) => void;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, weatherEvents, onUpdateETA }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-accent/20 text-accent-foreground';
      case 'in_transit': return 'bg-primary/20 text-primary';
      case 'delayed': return 'bg-destructive/20 text-destructive';
      case 'processing': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'in_transit': return '🚛';
      case 'delayed': return '⚠️';
      case 'processing': return '📦';
      default: return '❓';
    }
  };

  const isAffectedByWeather = (shipmentId: string) => {
    return weatherEvents.some(event => event.shipmentId === shipmentId);
  };

  const getWeatherImpact = (shipmentId: string) => {
    const event = weatherEvents.find(event => event.shipmentId === shipmentId);
    return event ? event.delayHours : 0;
  };

  const handleETAUpdate = (shipmentId: string, originalETA: string, delayHours: number) => {
    const originalDate = parseISO(originalETA);
    const newDate = new Date(originalDate.getTime() + delayHours * 60 * 60 * 1000);
    onUpdateETA(shipmentId, newDate.toISOString());
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-secondary to-muted border-b">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Package className="h-5 w-5" />
          BTS Shipment Records
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">Tracking Number</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">Metro Code</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Original ETA</TableHead>
                <TableHead className="font-semibold">Adjusted ETA</TableHead>
                <TableHead className="font-semibold">Weather Impact</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => {
                const weatherAffected = isAffectedByWeather(shipment.id);
                const delayHours = getWeatherImpact(shipment.id);
                
                return (
                  <TableRow 
                    key={shipment.id} 
                    className={weatherAffected ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/50'}
                  >
                    <TableCell className="font-mono font-medium text-primary">
                      <Link 
                        to={`/track/${shipment.trackingNumber}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {shipment.trackingNumber}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{shipment.customerName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{shipment.origin}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <ArrowUp className="h-3 w-3 rotate-45" />
                          {shipment.destination}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {shipment.destinationMetroCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {getStatusIcon(shipment.status)} {shipment.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(parseISO(shipment.originalETA), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {shipment.adjustedETA ? (
                        <div className="flex items-center gap-1 text-sm text-destructive font-medium">
                          <Calendar className="h-4 w-4" />
                          {format(parseISO(shipment.adjustedETA), 'MMM dd, yyyy HH:mm')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {weatherAffected ? (
                        <Badge className="bg-primary/20 text-primary">
                          +{delayHours}h delay
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2">
                        <Link to={`/track/${shipment.trackingNumber}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-primary border-primary hover:bg-primary/10"
                          >
                            <Package className="h-3 w-3 mr-1" />
                            Track
                          </Button>
                        </Link>
                        {weatherAffected && !shipment.adjustedETA && shipment.status !== 'delivered' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleETAUpdate(shipment.id, shipment.originalETA, delayHours)}
                            className="text-primary border-primary hover:bg-primary/10"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Update ETA
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentTable;
