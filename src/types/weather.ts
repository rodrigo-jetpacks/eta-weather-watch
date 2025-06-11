
export interface WeatherAlert {
  id: string;
  metroCode: string;
  date: string;
  weatherType: 'snowstorm' | 'hurricane' | 'thunderstorm' | 'ice storm' | 'flooding';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
  isActive: boolean;
}

export interface BTSShipment {
  id: string;
  trackingNumber: string;
  destinationMetroCode: string;
  originalETA: string;
  adjustedETA?: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'processing';
  scanTimestamp: string;
  customerName: string;
  origin: string;
  destination: string;
}

export interface WeatherEvent {
  id: string;
  weatherAlertId: string;
  shipmentId: string;
  impactLevel: 'minor' | 'moderate' | 'major' | 'severe';
  delayHours: number;
  createdAt: string;
  notificationSent: boolean;
}

export interface MetroCode {
  code: string;
  name: string;
  state: string;
}
