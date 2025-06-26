
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Search, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MovingHours = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate mock moving hours data
  const generateMovingHoursData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyHours: Math.floor(Math.random() * 12) + 4,
      weeklyHours: Math.floor(Math.random() * 60) + 30,
      efficiency: Math.floor(Math.random() * 30) + 70,
    }));
  };

  const movingHoursData = generateMovingHoursData();
  const totalHours = movingHoursData.reduce((sum, bus) => sum + bus.dailyHours, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Moving Hours Report</h1>
          <p className="text-gray-600">Track active moving hours for each bus</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Moving Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalHours}h</span>
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
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">
                {buses.length > 0 ? (totalHours / buses.length).toFixed(1) : '0'}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Per bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Most Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {movingHoursData.length > 0 ? Math.max(...movingHoursData.map(b => b.dailyHours)) : 0}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Single bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fleet Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">
                {movingHoursData.length > 0 ? 
                  Math.round(movingHoursData.reduce((sum, bus) => sum + bus.efficiency, 0) / movingHoursData.length) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Moving Hours Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Daily Moving Hours Trend
          </CardTitle>
          <CardDescription>Moving hours pattern over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { day: 'Mon', hours: 8.5 },
              { day: 'Tue', hours: 9.2 },
              { day: 'Wed', hours: 7.8 },
              { day: 'Thu', hours: 8.9 },
              { day: 'Fri', hours: 9.5 },
              { day: 'Sat', hours: 6.2 },
              { day: 'Sun', hours: 5.8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus Moving Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Bus-wise Moving Hours
          </CardTitle>
          <CardDescription>Active hours tracking for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see moving hours reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = movingHoursData[index] || { dailyHours: 0, weeklyHours: 0, efficiency: 0 };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.dailyHours}h</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{busData.weeklyHours}h</p>
                          <p className="text-xs text-gray-500">This Week</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{busData.efficiency}%</p>
                          <p className="text-xs text-gray-500">Efficiency</p>
                        </div>
                        <Badge variant={busData.efficiency > 80 ? 'default' : 'secondary'}>
                          {busData.efficiency > 80 ? 'Excellent' : 'Good'}
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

export default MovingHours;
