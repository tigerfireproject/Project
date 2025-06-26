
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Zap, Search, Activity, AlertTriangle } from 'lucide-react';

const SecondaryEngine = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSecondaryEngineData = () => {
    return buses.map(bus => ({
      busNumber: bus.busNumber,
      hasSecondaryEngine: Math.random() > 0.4,
      dailyRunHours: Math.floor(Math.random() * 6) + 2,
      status: ['Good', 'Maintenance Required', 'Not Working'][Math.floor(Math.random() * 3)],
      lastService: `${Math.floor(Math.random() * 30) + 1} days ago`,
    }));
  };

  const secondaryEngineData = generateSecondaryEngineData();
  const busesWithSecondaryEngine = secondaryEngineData.filter(bus => bus.hasSecondaryEngine).length;
  const workingEngines = secondaryEngineData.filter(bus => bus.hasSecondaryEngine && bus.status === 'Good').length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Secondary Engine Report</h1>
          <p className="text-gray-600">Monitor auxiliary engine performance and status</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Sec. Engines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{busesWithSecondaryEngine}</span>
            </div>
            <p className="text-xs text-muted-foreground">Equipped buses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Working Engines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{workingEngines}</span>
            </div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Maintenance Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold">
                {secondaryEngineData.filter(bus => bus.hasSecondaryEngine && bus.status === 'Maintenance Required').length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Need service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {busesWithSecondaryEngine > 0 ? Math.round((workingEngines / busesWithSecondaryEngine) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Working rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Secondary Engine Status
          </CardTitle>
          <CardDescription>Auxiliary engine status for each bus</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses Available</h3>
              <p className="text-gray-600">Add buses to see secondary engine reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus, index) => {
                const busData = secondaryEngineData[index] || { hasSecondaryEngine: false, dailyRunHours: 0, status: 'N/A', lastService: 'N/A' };
                return (
                  <div key={bus.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          !busData.hasSecondaryEngine ? 'bg-gray-100' :
                          busData.status === 'Good' ? 'bg-green-100' : 
                          busData.status === 'Maintenance Required' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Zap className={`h-4 w-4 ${
                            !busData.hasSecondaryEngine ? 'text-gray-600' :
                            busData.status === 'Good' ? 'text-green-600' : 
                            busData.status === 'Maintenance Required' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Bus {bus.busNumber}</h4>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                          <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        {busData.hasSecondaryEngine ? (
                          <>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">{busData.dailyRunHours}h</p>
                              <p className="text-xs text-gray-500">Run Hours</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">{busData.lastService}</p>
                              <p className="text-xs text-gray-500">Last Service</p>
                            </div>
                            <Badge variant={
                              busData.status === 'Good' ? 'default' : 
                              busData.status === 'Maintenance Required' ? 'secondary' : 'destructive'
                            }>
                              {busData.status}
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="outline">
                            No Secondary Engine
                          </Badge>
                        )}
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

export default SecondaryEngine;
