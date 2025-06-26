
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Search, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const OverspeedReport = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateOverspeedData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      overspeedEvents: Math.floor(Math.random() * 5),
      maxSpeed: Math.floor(Math.random() * 30) + 80,
      avgSpeed: Math.floor(Math.random() * 20) + 50,
      lastOverspeed: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      location: ['Highway Route 1', 'City Center', 'Ring Road', 'Airport Route'][Math.floor(Math.random() * 4)],
    }));
  };

  const overspeedData = generateOverspeedData();
  const totalOverspeedEvents = overspeedData.reduce((sum, bus) => sum + bus.overspeedEvents, 0);
  const highRiskBuses = overspeedData.filter(bus => bus.overspeedEvents > 2).length;

  const weeklyOverspeedTrend = [
    { day: 'Mon', events: 12 },
    { day: 'Tue', events: 8 },
    { day: 'Wed', events: 15 },
    { day: 'Thu', events: 6 },
    { day: 'Fri', events: 18 },
    { day: 'Sat', events: 4 },
    { day: 'Sun', events: 3 },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Overspeed Report</h1>
          <p className="text-gray-600">Monitor speed violations and driver behavior</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">{totalOverspeedEvents}</span>
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Risk Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">{highRiskBuses}</span>
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Max Speed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {overspeedData.length > 0 ? Math.max(...overspeedData.map(b => b.maxSpeed)) : 0}
              </span>
              <span className="text-sm text-gray-600">km/h</span>
            </div>
            <p className="text-xs text-muted-foreground">Highest recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fleet Avg Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">
                {overspeedData.length > 0 ? 
                  Math.round(overspeedData.reduce((sum, bus) => sum + bus.avgSpeed, 0) / overspeedData.length) : 0}
              </span>
              <span className="text-sm text-gray-600">km/h</span>
            </div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Weekly Overspeed Trend
          </CardTitle>
          <CardDescription>Speed violation events over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyOverspeedTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-600" />
            Bus-wise Overspeed Analysis
          </CardTitle>
          <CardDescription>Speed violations and performance by bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see overspeed reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = overspeedData[index] || { overspeedEvents: 0, maxSpeed: 0, avgSpeed: 0, lastOverspeed: 'N/A', location: 'Unknown' };
                const riskLevel = busData.overspeedEvents > 2 ? 'high' : busData.overspeedEvents > 0 ? 'medium' : 'low';
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          riskLevel === 'high' ? 'bg-red-100' : 
                          riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <AlertTriangle className={`h-4 w-4 ${
                            riskLevel === 'high' ? 'text-red-600' : 
                            riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                          {busData.overspeedEvents > 0 && (
                            <p className="text-xs text-gray-500">Last: {busData.lastOverspeed} at {busData.location}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-600">{busData.overspeedEvents}</p>
                          <p className="text-xs text-gray-500">Violations</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">{busData.maxSpeed} km/h</p>
                          <p className="text-xs text-gray-500">Max Speed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.avgSpeed} km/h</p>
                          <p className="text-xs text-gray-500">Avg Speed</p>
                        </div>
                        <Badge variant={
                          riskLevel === 'high' ? 'destructive' : 
                          riskLevel === 'medium' ? 'secondary' : 'default'
                        }>
                          {riskLevel === 'high' ? 'High Risk' : 
                           riskLevel === 'medium' ? 'Medium Risk' : 'Safe Driver'}
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

export default OverspeedReport;
