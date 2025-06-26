
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Search, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KMReport = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate mock KM data
  const generateKMData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      dailyKM: Math.floor(Math.random() * 200) + 100,
      weeklyKM: Math.floor(Math.random() * 1000) + 500,
      monthlyKM: Math.floor(Math.random() * 4000) + 2000,
    }));
  };

  const kmData = generateKMData();
  const totalKM = kmData.reduce((sum, bus) => sum + bus.dailyKM, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">KM Report</h1>
          <p className="text-gray-600">Track kilometer traveled by each bus</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total KM Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalKM}</span>
            </div>
            <p className="text-xs text-muted-foreground">All buses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average per Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">
                {buses.length > 0 ? Math.round(totalKM / buses.length) : 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">KM per bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Highest KM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {kmData.length > 0 ? Math.max(...kmData.map(b => b.dailyKM)) : 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Single bus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">{buses.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Reporting</p>
          </CardContent>
        </Card>
      </div>

      {/* KM Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            KM Distribution by Bus
          </CardTitle>
          <CardDescription>Daily kilometer report for all buses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kmData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="busNumber" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="dailyKM" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Bus KM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Bus-wise KM Report
          </CardTitle>
          <CardDescription>Detailed kilometer tracking for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see KM reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busKM = kmData[index] || { dailyKM: 0, weeklyKM: 0, monthlyKM: 0 };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busKM.dailyKM} KM</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{busKM.weeklyKM} KM</p>
                          <p className="text-xs text-gray-500">This Week</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{busKM.monthlyKM} KM</p>
                          <p className="text-xs text-gray-500">This Month</p>
                        </div>
                        <Badge variant={busKM.dailyKM > 150 ? 'default' : 'secondary'}>
                          {busKM.dailyKM > 150 ? 'High Usage' : 'Normal'}
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

export default KMReport;
