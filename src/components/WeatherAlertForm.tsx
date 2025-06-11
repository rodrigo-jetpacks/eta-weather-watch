
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CloudRain, CloudSnow } from 'lucide-react';
import { metroCodes } from '@/data/mockData';
import { WeatherAlert } from '@/types/weather';
import { toast } from '@/hooks/use-toast';

interface WeatherAlertFormProps {
  onSubmit: (alert: Omit<WeatherAlert, 'id' | 'createdAt'>) => void;
}

const WeatherAlertForm: React.FC<WeatherAlertFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    metroCode: '',
    date: '',
    weatherType: '' as WeatherAlert['weatherType'] | '',
    severity: '' as WeatherAlert['severity'] | '',
    description: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.metroCode || !formData.date || !formData.weatherType || !formData.severity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      metroCode: formData.metroCode,
      date: formData.date,
      weatherType: formData.weatherType as WeatherAlert['weatherType'],
      severity: formData.severity as WeatherAlert['severity'],
      description: formData.description,
      isActive: formData.isActive
    });

    // Reset form
    setFormData({
      metroCode: '',
      date: '',
      weatherType: '',
      severity: '',
      description: '',
      isActive: true
    });

    toast({
      title: "Weather Alert Created",
      description: "The weather alert has been successfully created and shipments are being processed.",
    });
  };

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'snowstorm':
      case 'ice storm':
        return <CloudSnow className="h-4 w-4" />;
      default:
        return <CloudRain className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <CloudRain className="h-5 w-5" />
          Create Weather Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metroCode">Destination Metro Code *</Label>
              <Select value={formData.metroCode} onValueChange={(value) => setFormData({...formData, metroCode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metro code" />
                </SelectTrigger>
                <SelectContent>
                  {metroCodes.map((metro) => (
                    <SelectItem key={metro.code} value={metro.code}>
                      {metro.code} - {metro.name}, {metro.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Affected Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weatherType">Weather Type *</Label>
              <Select value={formData.weatherType} onValueChange={(value) => setFormData({...formData, weatherType: value as WeatherAlert['weatherType']})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="snowstorm">❄️ Snowstorm</SelectItem>
                  <SelectItem value="hurricane">🌀 Hurricane</SelectItem>
                  <SelectItem value="thunderstorm">⛈️ Thunderstorm</SelectItem>
                  <SelectItem value="ice storm">🧊 Ice Storm</SelectItem>
                  <SelectItem value="flooding">🌊 Flooding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value as WeatherAlert['severity']})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor('low')}>Low</Badge>
                      <span>Minor delays expected</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor('medium')}>Medium</Badge>
                      <span>Moderate delays expected</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor('high')}>High</Badge>
                      <span>Significant delays expected</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor('critical')}>Critical</Badge>
                      <span>Major disruptions expected</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about the weather event..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Create Weather Alert & Process Shipments
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeatherAlertForm;
