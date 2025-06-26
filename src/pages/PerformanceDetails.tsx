
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusPerformance {
  busNumber: string;
  route: string;
  driver: string;
  status: 'on-time' | 'delayed';
  scheduledTime: string;
  actualTime: string;
  delayMinutes?: number;
}

const PerformanceDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const date = searchParams.get('date');
  const [busPerformance, setBusPerformance] = useState<BusPerformance[]>([]);

  useEffect(() => {
    // Generate mock data for the selected date
    const mockData: BusPerformance[] = [
      {
        busNumber: 'B001',
        route: 'Route A-1',
        driver: 'John Smith',
        status: 'on-time',
        scheduledTime: '07:00',
        actualTime: '07:02'
      },
      {
        busNumber: 'B002',
        route: 'Route B-2',
        driver: 'Sarah Johnson',
        status: 'delayed',
        scheduledTime: '07:15',
        actualTime: '07:28',
        delayMinutes: 13
      },
      {
        busNumber: 'B003',
        route: 'Route C-3',
        driver: 'Mike Wilson',
        status: 'on-time',
        scheduledTime: '07:30',
        actualTime: '07:32'
      },
      {
        busNumber: 'B004',
        route: 'Route D-4',
        driver: 'Emma Davis',
        status: 'delayed',
        scheduledTime: '07:45',
        actualTime: '08:05',
        delayMinutes: 20
      },
      {
        busNumber: 'B005',
        route: 'Route E-5',
        driver: 'David Brown',
        status: 'on-time',
        scheduledTime: '08:00',
        actualTime: '07:58'
      }
    ];
    setBusPerformance(mockData);
  }, [date]);

  const onTimeBuses = busPerformance.filter(bus => bus.status === 'on-time');
  const delayedBuses = busPerformance.filter(bus => bus.status === 'delayed');

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Performance Details</h1>
          <p className="text-gray-600">Performance details for {date}</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{busPerformance.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">On Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{onTimeBuses.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">{delayedBuses.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* On-Time Buses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            On-Time Buses ({onTimeBuses.length})
          </CardTitle>
          <CardDescription>Buses that arrived within the scheduled time</CardDescription>
        </CardHeader>
        <CardContent>
          {onTimeBuses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No on-time buses for this day</p>
          ) : (
            <div className="space-y-3">
              {onTimeBuses.map((bus, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div>
                    <h4 className="font-medium">Bus {bus.busNumber}</h4>
                    <p className="text-sm text-gray-600">{bus.route} - {bus.driver}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Scheduled: {bus.scheduledTime} | Actual: {bus.actualTime}
                    </p>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      On Time
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delayed Buses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delayed Buses ({delayedBuses.length})
          </CardTitle>
          <CardDescription>Buses that arrived late with delay details</CardDescription>
        </CardHeader>
        <CardContent>
          {delayedBuses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No delayed buses for this day</p>
          ) : (
            <div className="space-y-3">
              {delayedBuses.map((bus, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium">Bus {bus.busNumber}</h4>
                    <p className="text-sm text-gray-600">{bus.route} - {bus.driver}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Scheduled: {bus.scheduledTime} | Actual: {bus.actualTime}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">
                        {bus.delayMinutes} min late
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDetails;
