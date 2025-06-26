
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ParkedHours = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateParkedHoursData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyParkedHours: Math.floor(Math.random() * 12) + 8,
      location: ['Depot A', 'Depot B', 'Route Terminal', 'Maintenance Bay'][Math.floor(Math.random() * 4)],
      lastParked: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    }));
  };

  const parkedHoursData = generateParkedHoursData();
  const totalParkedHours = parkedHoursData.reduce((sum, bus) => sum + bus.dailyParkedHours, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Parked Hours Report</h1>
          <p className="text-gray-600">Monitor bus parking duration and locations</p>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Parked Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{totalParkedHours}h</span>
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average per Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">
                {buses.length > 0 ? (totalParkedHours / buses.length).toFixed(1) : '0'}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Per bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Currently Parked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">{Math.floor(buses.length * 0.3)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Buses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Depot Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">75%</span>
            </div>
            <p className="text-xs text-muted-foreground">Capacity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Parked Hours by Bus
          </CardTitle>
          <CardDescription>Daily parking duration for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parkedHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="busNumber" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="dailyParkedHours" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Bus Parking Details
          </CardTitle>
          <CardDescription>Current parking status and locations</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see parking reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = parkedHoursData[index] || { dailyParkedHours: 0, location: 'Unknown', lastParked: 'N/A' };
                const isCurrentlyParked = Math.random() > 0.7;
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${isCurrentlyParked ? 'bg-green-100' : 'bg-blue-100'}`}>
                          <MapPin className={`h-4 w-4 ${isCurrentlyParked ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Location: {busData.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{busData.dailyParkedHours}h</p>
                          <p className="text-xs text-gray-500">Total Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.lastParked}</p>
                          <p className="text-xs text-gray-500">Last Parked</p>
                        </div>
                        <Badge variant={isCurrentlyParked ? 'default' : 'secondary'}>
                          {isCurrentlyParked ? 'Currently Parked' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkedHours;
