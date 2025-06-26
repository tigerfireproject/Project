
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Search, Activity, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const IdleHours = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate mock idle hours data
  const generateIdleHoursData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyIdleHours: Math.floor(Math.random() * 6) + 1,
      longestIdle: Math.floor(Math.random() * 3) + 0.5,
      idleCount: Math.floor(Math.random() * 15) + 5,
      fuelWasted: Math.floor(Math.random() * 10) + 2,
    }));
  };

  const idleHoursData = generateIdleHoursData();
  const totalIdleHours = idleHoursData.reduce((sum, bus) => sum + bus.dailyIdleHours, 0);
  const totalFuelWasted = idleHoursData.reduce((sum, bus) => sum + bus.fuelWasted, 0);

  // Weekly idle trend data
  const weeklyIdleData = [
    { day: 'Mon', idle: 4.2 },
    { day: 'Tue', idle: 3.8 },
    { day: 'Wed', idle: 5.1 },
    { day: 'Thu', idle: 3.5 },
    { day: 'Fri', idle: 4.7 },
    { day: 'Sat', idle: 2.9 },
    { day: 'Sun', idle: 2.1 },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Idle Hours Report</h1>
          <p className="text-gray-600">Monitor engine idle time and fuel consumption</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Idle Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Pause className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold">{totalIdleHours.toFixed(1)}h</span>
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
                {buses.length > 0 ? (totalIdleHours / buses.length).toFixed(1) : '0'}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Per bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fuel Wasted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">{totalFuelWasted}L</span>
            </div>
            <p className="text-xs text-muted-foreground">Due to idling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">₹{(totalFuelWasted * 95).toFixed(0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Wasted today</p>
          </CardContent>
        </Card>
      </div>

      {/* Idle Hours Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pause className="h-5 w-5 mr-2 text-yellow-600" />
            Weekly Idle Hours Trend
          </CardTitle>
          <CardDescription>Daily idle hours pattern over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyIdleData}>
              <defs>
                <linearGradient id="idleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="idle" stroke="#eab308" fillOpacity={1} fill="url(#idleGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus Idle Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Bus-wise Idle Hours
          </CardTitle>
          <CardDescription>Detailed idle time analysis for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Pause className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see idle hours reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = idleHoursData[index] || { dailyIdleHours: 0, longestIdle: 0, idleCount: 0, fuelWasted: 0 };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${busData.dailyIdleHours > 4 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          <Pause className={`h-4 w-4 ${busData.dailyIdleHours > 4 ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-yellow-600">{busData.dailyIdleHours.toFixed(1)}h</p>
                          <p className="text-xs text-gray-500">Total Idle</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">{busData.longestIdle.toFixed(1)}h</p>
                          <p className="text-xs text-gray-500">Longest</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.idleCount}</p>
                          <p className="text-xs text-gray-500">Idle Events</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-600">{busData.fuelWasted}L</p>
                          <p className="text-xs text-gray-500">Fuel Wasted</p>
                        </div>
                        <Badge variant={busData.dailyIdleHours > 4 ? 'destructive' : busData.dailyIdleHours > 2 ? 'secondary' : 'default'}>
                          {busData.dailyIdleHours > 4 ? 'High Idle' : busData.dailyIdleHours > 2 ? 'Moderate' : 'Good'}
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

export default IdleHours;
