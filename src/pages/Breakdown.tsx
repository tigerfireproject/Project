
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, User, Wrench } from 'lucide-react';

const Breakdown = () => {
  const [breakdownMessages] = useState([
    {
      id: '1',
      busNumber: 'BX-001',
      driverName: 'John Smith',
      message: 'Engine overheating, need immediate assistance',
      location: 'Main Street & 5th Avenue',
      timestamp: '2024-06-26 10:30 AM',
      status: 'urgent',
      type: 'mechanical'
    },
    {
      id: '2',
      busNumber: 'BX-015',
      driverName: 'Sarah Johnson',
      message: 'Flat tire on rear wheel, passengers transferred',
      location: 'Oak Road near Central Park',
      timestamp: '2024-06-26 09:15 AM',
      status: 'resolved',
      type: 'tire'
    },
    {
      id: '3',
      busNumber: 'BX-008',
      driverName: 'Mike Davis',
      message: 'Brake system warning light, pulling over safely',
      location: 'Highway 101, Mile Marker 45',
      timestamp: '2024-06-26 08:45 AM',
      status: 'in-progress',
      type: 'brake'
    },
    {
      id: '4',
      busNumber: 'BX-022',
      driverName: 'Lisa Brown',
      message: 'Battery dead, unable to start vehicle',
      location: 'Bus Depot - Bay 3',
      timestamp: '2024-06-25 17:20 PM',
      status: 'pending',
      type: 'electrical'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mechanical': return <Wrench className="h-4 w-4" />;
      case 'tire': return <AlertTriangle className="h-4 w-4" />;
      case 'brake': return <AlertTriangle className="h-4 w-4" />;
      case 'electrical': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Breakdown</h1>
        <p className="text-gray-600">Monitor and manage emergency breakdown messages from drivers</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown Messages</CardTitle>
          <CardDescription>Emergency messages from drivers reporting breakdowns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {breakdownMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(message.type)}
                        <span className="font-semibold text-gray-900">{message.busNumber}</span>
                      </div>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{message.message}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{message.driverName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{message.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {message.status !== 'resolved' && (
                      <>
                        <Button size="sm" variant="outline">
                          Contact Driver
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Dispatch Help
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Breakdown;
