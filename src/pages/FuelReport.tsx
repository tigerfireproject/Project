
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Fuel, Bus, TrendingDown, TrendingUp, AlertTriangle, Search, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const FuelReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [buses, setBuses] = useState<any[]>([]);

  // Load buses from localStorage
  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) {
      setBuses(JSON.parse(savedBuses));
    }
  }, []);

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedBuses = localStorage.getItem('buses');
      if (savedBuses) setBuses(JSON.parse(savedBuses));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate fuel statistics
  const averageFuel = buses.length > 0 ? Math.round(buses.reduce((sum, bus) => sum + bus.fuelLevel, 0) / buses.length) : 0;
  const lowFuelBuses = buses.filter(bus => bus.fuelLevel < 25).length;
  const criticalFuelBuses = buses.filter(bus => bus.fuelLevel < 10).length;

  // Sample fuel consumption data for chart
  const fuelConsumptionData = [
    { day: 'Mon', consumption: 450 },
    { day: 'Tue', consumption: 380 },
    { day: 'Wed', consumption: 420 },
    { day: 'Thu', consumption: 390 },
    { day: 'Fri', consumption: 460 },
    { day: 'Sat', consumption: 320 },
    { day: 'Sun', consumption: 280 },
  ];

  const getFuelStatus = (fuelLevel: number) => {
    if (fuelLevel >= 50) return { status: 'Good', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (fuelLevel >= 25) return { status: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Low', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fuel Report</h1>
          <p className="text-gray-600">Monitor fuel levels and consumption across your fleet</p>
        </div>
        
        {/* Search */}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel Level</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageFuel}%</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Fuel Buses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowFuelBuses}</div>
            <p className="text-xs text-muted-foreground">Below 25%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Level</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalFuelBuses}</div>
            <p className="text-xs text-muted-foreground">Below 10%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.length}</div>
            <p className="text-xs text-muted-foreground">Fleet size</p>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Consumption Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Weekly Fuel Consumption
          </CardTitle>
          <CardDescription>Fuel consumption trends over the past week (liters)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fuelConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus Fuel Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fuel className="h-5 w-5 mr-2 text-green-600" />
            Bus Fuel Levels
          </CardTitle>
          <CardDescription>Current fuel status of all buses</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see fuel reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus) => {
                const fuelStatus = getFuelStatus(bus.fuelLevel);
                return (
                  <div key={bus.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${fuelStatus.bgColor}`}>
                        <Fuel className={`h-4 w-4 ${fuelStatus.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{bus.busNumber}</h4>
                        <p className="text-sm text-gray-600">{bus.route}</p>
                        <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 sm:w-32">
                          <Progress value={bus.fuelLevel} className="h-2" />
                        </div>
                        <span className="text-sm font-medium min-w-[3rem]">{Math.round(bus.fuelLevel)}%</span>
                      </div>
                      <Badge variant={bus.fuelLevel >= 50 ? 'secondary' : bus.fuelLevel >= 25 ? 'outline' : 'destructive'}>
                        {fuelStatus.status}
                      </Badge>
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

export default FuelReport;
