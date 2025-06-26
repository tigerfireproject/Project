
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Thermometer, Search, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ACReport = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateACData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyACHours: Math.floor(Math.random() * 8) + 4,
      avgTemperature: Math.floor(Math.random() * 10) + 20,
      fuelConsumption: Math.floor(Math.random() * 15) + 10,
      status: ['Working', 'Needs Maintenance', 'Not Working'][Math.floor(Math.random() * 3)],
      lastService: `${Math.floor(Math.random() * 60) + 1} days ago`,
    }));
  };

  const acData = generateACData();
  const totalACHours = acData.reduce((sum, bus) => sum + bus.dailyACHours, 0);
  const workingACs = acData.filter(bus => bus.status === 'Working').length;

  const temperatureTrend = [
    { time: '06:00', temp: 28 },
    { time: '09:00', temp: 24 },
    { time: '12:00', temp: 22 },
    { time: '15:00', temp: 23 },
    { time: '18:00', temp: 24 },
    { time: '21:00', temp: 26 },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">A/C Performance Report</h1>
          <p className="text-gray-600">Monitor air conditioning systems and temperature control</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total A/C Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalACHours}h</span>
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Working A/C Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{workingACs}</span>
            </div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">
                {acData.length > 0 ? 
                  Math.round(acData.reduce((sum, bus) => sum + bus.avgTemperature, 0) / acData.length) : 0}°C
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {buses.length > 0 ? Math.round((workingACs / buses.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Working A/C</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
            Daily Temperature Trend
          </CardTitle>
          <CardDescription>Average cabin temperature throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Bus A/C Status
          </CardTitle>
          <CardDescription>Air conditioning performance for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Thermometer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see A/C reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = acData[index] || { dailyACHours: 0, avgTemperature: 0, fuelConsumption: 0, status: 'Unknown', lastService: 'N/A' };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          busData.status === 'Working' ? 'bg-green-100' : 
                          busData.status === 'Needs Maintenance' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Thermometer className={`h-4 w-4 ${
                            busData.status === 'Working' ? 'text-green-600' : 
                            busData.status === 'Needs Maintenance' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Last service: {busData.lastService}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.dailyACHours}h</p>
                          <p className="text-xs text-gray-500">A/C Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">{busData.avgTemperature}°C</p>
                          <p className="text-xs text-gray-500">Avg Temp</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{busData.fuelConsumption}L</p>
                          <p className="text-xs text-gray-500">Extra Fuel</p>
                        </div>
                        <Badge variant={
                          busData.status === 'Working' ? 'default' : 
                          busData.status === 'Needs Maintenance' ? 'secondary' : 'destructive'
                        }>
                          {busData.status}
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

export default ACReport;
