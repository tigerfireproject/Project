
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Zap, Clock, Users, Search, X } from 'lucide-react';

interface Bus {
  id: string;
  route: string;
  currentStop: string;
  nextStop: string;
  eta: string;
  passengers: number;
  capacity: number;
  status: string;
}

const LiveMap = () => {
  // Sample buses data - in real app this would come from buses page
  const [activeBuses] = useState<Bus[]>([
    {
      id: 'BX-101',
      route: 'College Campus - Downtown',
      currentStop: 'Science Block',
      nextStop: 'Library',
      eta: '3 min',
      passengers: 25,
      capacity: 40,
      status: 'On Time',
    },
    {
      id: 'BX-102', 
      route: 'North Campus - South Campus',
      currentStop: 'Engineering Block',
      nextStop: 'Cafeteria',
      eta: '5 min',
      passengers: 18,
      capacity: 40,
      status: 'On Time',
    }
  ]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const filteredBuses = activeBuses.filter(bus =>
    bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.currentStop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={toggleFullScreen} variant="outline" className="bg-white">
            <X className="h-4 w-4 mr-2" />
            Exit Full Screen
          </Button>
        </div>
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="text-center z-10">
            <MapPin className="h-24 w-24 text-blue-600 mx-auto mb-6" />
            <h3 className="text-3xl font-semibold text-gray-700 mb-4">Full Screen Map View</h3>
            <p className="text-gray-500 max-w-md text-lg">Real-time bus locations displayed in full screen mode</p>
            <p className="text-gray-400 mt-3">Active Buses: {activeBuses.length}</p>
          </div>
          
          {/* Dynamic Bus Markers - Larger for full screen */}
          {activeBuses.map((bus, index) => (
            <div 
              key={bus.id}
              className={`absolute bg-green-500 rounded-full p-3 animate-pulse shadow-lg`}
              style={{
                top: `${20 + (index * 25)}%`,
                left: `${15 + (index * 30)}%`,
              }}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Map</h1>
          <p className="text-gray-600">Real-time bus tracking and monitoring</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search bus or route..." 
              className="pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={toggleFullScreen}>
            <Navigation className="h-4 w-4 mr-2" />
            Full Screen Map
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <Card className="h-96 lg:h-[500px]">
        <CardContent className="p-0 h-full">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="text-center z-10">
              <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map View</h3>
              <p className="text-gray-500 max-w-md">Real-time bus locations will be displayed here with GPS tracking integration</p>
              <p className="text-sm text-gray-400 mt-2">Active Buses: {activeBuses.length}</p>
            </div>
            
            {/* Dynamic Bus Markers */}
            {activeBuses.map((bus, index) => (
              <div 
                key={bus.id}
                className={`absolute bg-green-500 rounded-full p-2 animate-pulse`}
                style={{
                  top: `${20 + (index * 30)}%`,
                  left: `${20 + (index * 25)}%`,
                }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Bus Status */}
      {filteredBuses.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">
              {searchTerm ? 'No buses match your search.' : 'No buses currently active.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{bus.id}</CardTitle>
                  <Badge variant={bus.status === 'On Time' ? 'secondary' : 'destructive'}>
                    {bus.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {bus.route}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Stop:</span>
                  <span className="font-medium">{bus.currentStop}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Stop:</span>
                  <span className="font-medium">{bus.nextStop}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    ETA:
                  </span>
                  <span className="font-medium text-blue-600">{bus.eta}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Passengers:
                  </span>
                  <span className="font-medium">{bus.passengers}/{bus.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMap;
