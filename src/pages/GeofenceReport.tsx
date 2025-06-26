
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Search, AlertTriangle, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GeofenceReport = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateGeofenceData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      violations: Math.floor(Math.random() * 3),
      insideGeofence: Math.random() > 0.3,
      lastViolation: Math.random() > 0.7 ? `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
      violationType: ['Route Deviation', 'Unauthorized Zone', 'Speed Zone'][Math.floor(Math.random() * 3)],
      complianceRate: Math.floor(Math.random() * 20) + 80,
    }));
  };

  const geofenceData = generateGeofenceData();
  const totalViolations = geofenceData.reduce((sum, bus) => sum + bus.violations, 0);
  const busesInside = geofenceData.filter(bus => bus.insideGeofence).length;
  const violatingBuses = geofenceData.filter(bus => bus.violations > 0).length;

  const violationTypeData = [
    { type: 'Route Deviation', count: 8 },
    { type: 'Unauthorized Zone', count: 5 },
    { type: 'Speed Zone', count: 3 },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Geofence Report</h1>
          <p className="text-gray-600">Monitor geofence compliance and boundary violations</p>
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
              <span className="text-2xl font-bold">{totalViolations}</span>
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Buses Inside Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{busesInside}</span>
            </div>
            <p className="text-xs text-muted-foreground">Currently compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Violation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">
                {buses.length > 0 ? Math.round((violatingBuses / buses.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Buses with violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">
                {geofenceData.length > 0 ? 
                  Math.round(geofenceData.reduce((sum, bus) => sum + bus.complianceRate, 0) / geofenceData.length) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Violation Types Distribution
          </CardTitle>
          <CardDescription>Common types of geofence violations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Bus Geofence Status
          </CardTitle>
          <CardDescription>Current geofence compliance for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see geofence reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = geofenceData[index] || { violations: 0, insideGeofence: true, lastViolation: null, violationType: 'N/A', complianceRate: 100 };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          busData.insideGeofence && busData.violations === 0 ? 'bg-green-100' : 
                          busData.violations > 0 ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <Shield className={`h-4 w-4 ${
                            busData.insideGeofence && busData.violations === 0 ? 'text-green-600' : 
                            busData.violations > 0 ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          {busData.lastViolation && (
                            <p className="text-xs text-gray-500">
                              Last violation: {busData.lastViolation} - {busData.violationType}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-600">{busData.violations}</p>
                          <p className="text-xs text-gray-500">Violations</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{busData.complianceRate}%</p>
                          <p className="text-xs text-gray-500">Compliance</p>
                        </div>
                        <Badge variant={
                          busData.insideGeofence && busData.violations === 0 ? 'default' : 
                          busData.violations > 0 ? 'destructive' : 'secondary'
                        }>
                          {busData.insideGeofence && busData.violations === 0 ? 'Compliant' : 
                           busData.violations > 0 ? 'Violations' : 'Monitoring'}
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

export default GeofenceReport;
