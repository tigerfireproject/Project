
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Zap, Search, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EngineHours = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate mock engine hours data
  const generateEngineHoursData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyEngineHours: Math.floor(Math.random() * 16) + 6,
      totalEngineHours: Math.floor(Math.random() * 5000) + 1000,
      maintenanceDue: Math.random() > 0.7,
    }));
  };

  const engineHoursData = generateEngineHoursData();
  const totalDailyHours = engineHoursData.reduce((sum, bus) => sum + bus.dailyEngineHours, 0);
  const maintenanceDueBuses = engineHoursData.filter(bus => bus.maintenanceDue).length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Engine Hours Report</h1>
          <p className="text-gray-600">Monitor engine running hours and maintenance schedules</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Engine Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalDailyHours}h</span>
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
                {buses.length > 0 ? (totalDailyHours / buses.length).toFixed(1) : '0'}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Per bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Maintenance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">{maintenanceDueBuses}</span>
            </div>
            <p className="text-xs text-muted-foreground">Buses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fleet Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {engineHoursData.reduce((sum, bus) => sum + bus.totalEngineHours, 0).toLocaleString()}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Engine Hours Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Daily Engine Hours by Bus
          </CardTitle>
          <CardDescription>Engine running hours for each bus today</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engineHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="busNumber" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="dailyEngineHours" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus Engine Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-green-600" />
            Bus-wise Engine Hours
          </CardTitle>
          <CardDescription>Engine hours tracking and maintenance alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see engine hours reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = engineHoursData[index] || { dailyEngineHours: 0, totalEngineHours: 0, maintenanceDue: false };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${busData.maintenanceDue ? 'bg-red-100' : 'bg-blue-100'}`}>
                          <Zap className={`h-4 w-4 ${busData.maintenanceDue ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.dailyEngineHours}h</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{busData.totalEngineHours.toLocaleString()}h</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{Math.round(busData.totalEngineHours / 24)}d</p>
                          <p className="text-xs text-gray-500">Days</p>
                        </div>
                        <Badge variant={busData.maintenanceDue ? 'destructive' : 'default'}>
                          {busData.maintenanceDue ? 'Maintenance Due' : 'Good'}
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

export default EngineHours;
