
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bus, MapPin, Fuel, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface BusFleetData {
  id: string;
  busNumber: string;
  route: string;
  driver: string;
  status: 'active' | 'maintenance' | 'breakdown' | 'idle';
  location: string;
  fuelLevel: number;
  lastService: string;
  nextService: string;
  mileage: number;
  isMoving: boolean;
}

const FleetManagement = () => {
  const [buses, setBuses] = useState<BusFleetData[]>([]);

  useEffect(() => {
    // Load buses from localStorage
    const storedBuses = localStorage.getItem('buses');
    if (storedBuses) {
      const parsedBuses = JSON.parse(storedBuses);
      setBuses(parsedBuses.map((bus: any) => ({
        ...bus,
        location: `Route ${bus.route}`,
        mileage: Math.floor(Math.random() * 50000) + 10000,
      })));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'breakdown': return 'bg-red-500';
      case 'idle': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'secondary';
      case 'breakdown': return 'destructive';
      case 'idle': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <p className="text-gray-600">Monitor and manage your bus fleet status and performance</p>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{buses.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">
                {buses.filter(bus => bus.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold">
                {buses.filter(bus => bus.status === 'maintenance').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Breakdowns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">
                {buses.filter(bus => bus.status === 'breakdown').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Bus Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <Card key={bus.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Bus className="h-5 w-5 mr-2 text-blue-600" />
                    Bus {bus.busNumber}
                  </CardTitle>
                  <CardDescription>{bus.route}</CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusBadge(bus.status)}>
                    {bus.status}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div className={`h-2 w-2 rounded-full ${bus.isMoving ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-600">
                      {bus.isMoving ? 'Moving' : 'Stationary'}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Current Location</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{bus.location}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Fuel className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Fuel Level</span>
                </div>
                <div className="flex items-center space-x-2 ml-6">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        bus.fuelLevel > 50 ? 'bg-green-500' : 
                        bus.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${bus.fuelLevel}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round(bus.fuelLevel)}%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Service Schedule</span>
                </div>
                <div className="ml-6 space-y-1">
                  <p className="text-xs text-gray-600">Last: {bus.lastService}</p>
                  <p className="text-xs text-gray-600">Next: {bus.nextService}</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Driver:</span>
                  <span className="text-sm text-gray-600">{bus.driver}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Mileage:</span>
                  <span className="text-sm text-gray-600">{bus.mileage.toLocaleString()} km</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Track Live
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Service History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {buses.length === 0 && (
        <div className="text-center py-12">
          <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses in Fleet</h3>
          <p className="text-gray-600">Add buses to your fleet to monitor their status here.</p>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
