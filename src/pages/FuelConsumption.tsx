
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fuel, TrendingUp, TrendingDown, Calendar, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FuelConsumption = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) {
      setBuses(JSON.parse(savedBuses));
    }
  }, []);

  // Generate mock fuel consumption data
  const generateConsumptionData = (busNumber: string) => {
    const data = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        consumption: Math.random() * 50 + 30, // 30-80 liters per day
        efficiency: Math.random() * 5 + 8, // 8-13 km/l
      });
    }
    return data;
  };

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageConsumption = buses.length > 0 
    ? (buses.reduce((sum, bus) => sum + (Math.random() * 50 + 30), 0) / buses.length).toFixed(1)
    : '0';

  const averageEfficiency = buses.length > 0
    ? (buses.reduce((sum, bus) => sum + (Math.random() * 5 + 8), 0) / buses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fuel Consumption Report</h1>
          <p className="text-gray-600">Monitor fuel consumption patterns and efficiency across your fleet</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search buses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fleet Average Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{averageConsumption}L</span>
            </div>
            <p className="text-xs text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{averageEfficiency}</span>
              <span className="text-sm text-gray-600">km/L</span>
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground">Buses need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">₹12,450</span>
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Consumption Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fuel className="h-5 w-5 mr-2 text-blue-600" />
            Fleet Fuel Consumption Trend
          </CardTitle>
          <CardDescription>Daily fuel consumption across all buses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateConsumptionData('fleet')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value}L`, 'Consumption']} />
              <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus Consumption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Bus-wise Fuel Consumption
          </CardTitle>
          <CardDescription>Individual bus fuel consumption and efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see fuel consumption reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus) => {
                const dailyConsumption = (Math.random() * 50 + 30).toFixed(1);
                const efficiency = (Math.random() * 5 + 8).toFixed(1);
                const status = parseFloat(efficiency) > 10 ? 'good' : parseFloat(efficiency) > 8 ? 'average' : 'poor';
                
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Fuel className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{dailyConsumption}L</p>
                          <p className="text-xs text-gray-500">Daily Avg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{efficiency} km/L</p>
                          <p className="text-xs text-gray-500">Efficiency</p>
                        </div>
                        <Badge 
                          variant={status === 'good' ? 'default' : status === 'average' ? 'secondary' : 'destructive'}
                        >
                          {status === 'good' ? 'Efficient' : status === 'average' ? 'Average' : 'Needs Attention'}
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

export default FuelConsumption;
