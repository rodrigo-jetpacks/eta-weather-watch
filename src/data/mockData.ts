
import { BTSShipment, WeatherAlert, WeatherEvent, MetroCode } from '@/types/weather';

export const metroCodes: MetroCode[] = [
  { code: 'CHI', name: 'Chicago', state: 'IL' },
  { code: 'NYC', name: 'New York City', state: 'NY' },
  { code: 'MSP', name: 'Minneapolis-St. Paul', state: 'MN' },
  { code: 'DFW', name: 'Dallas-Fort Worth', state: 'TX' }
];

export const mockShipments: BTSShipment[] = [
  {
    id: '1',
    trackingNumber: 'BTS001234567',
    destinationMetroCode: 'CHI',
    originalETA: '2024-07-15T14:00:00Z',
    status: 'in_transit',
    scanTimestamp: '2024-07-12T08:30:00Z',
    customerName: 'Johnson Manufacturing',
    origin: 'Los Angeles, CA',
    destination: 'Chicago, IL'
  },
  {
    id: '2',
    trackingNumber: 'BTS001234568',
    destinationMetroCode: 'NYC',
    originalETA: '2024-07-16T10:00:00Z',
    status: 'in_transit',
    scanTimestamp: '2024-07-13T12:15:00Z',
    customerName: 'TechCorp Solutions',
    origin: 'Seattle, WA',
    destination: 'New York, NY'
  },
  {
    id: '3',
    trackingNumber: 'BTS001234569',
    destinationMetroCode: 'MSP',
    originalETA: '2024-07-17T16:30:00Z',
    status: 'in_transit',
    scanTimestamp: '2024-07-11T14:20:00Z',
    customerName: 'Northern Supply Co',
    origin: 'Phoenix, AZ',
    destination: 'Minneapolis, MN'
  },
  {
    id: '4',
    trackingNumber: 'BTS001234570',
    destinationMetroCode: 'DFW',
    originalETA: '2024-07-17T11:45:00Z',
    status: 'delivered',
    scanTimestamp: '2024-07-10T09:00:00Z',
    customerName: 'Southwest Industries',
    origin: 'Miami, FL',
    destination: 'Dallas, TX'
  },
   {
    id: '5',
    trackingNumber: 'BTS001234580',
    destinationMetroCode: 'NYC',
    originalETA: '2024-07-15T14:00:00Z',
    status: 'in_transit',
    scanTimestamp: '2024-07-12T08:30:00Z',
    customerName: 'Johnson Manufacturing',
    origin: 'Los Angeles, CA',
    destination: 'New York, NY'
  },
    {
    id: '6',
    trackingNumber: 'BTS001234582',
    destinationMetroCode: 'DFW',
    originalETA: '2024-07-12T11:45:00Z',
    status: 'in_transit',
    scanTimestamp: '2024-07-10T09:00:00Z',
    customerName: 'Southwest Industries',
    origin: 'Miami, FL',
    destination: 'Dallas, TX'
  }
];

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    metroCode: 'CHI',
    date: '2024-07-15',
    weatherType: 'snowstorm',
    severity: 'high',
    description: 'Heavy snowfall expected with 6-12 inches accumulation',
    createdAt: '2024-07-13T10:00:00Z',
    isActive: true
  }
];

export const mockWeatherEvents: WeatherEvent[] = [
  {
    id: '1',
    weatherAlertId: '1',
    shipmentId: '1',
    impactLevel: 'moderate',
    delayHours: 24,
    createdAt: '2024-07-13T10:05:00Z',
    notificationSent: true
  }
];
