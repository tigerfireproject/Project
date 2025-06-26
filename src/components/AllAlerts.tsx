
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, MapPin, Users, Bell, ArrowLeft } from 'lucide-react';

interface AllAlertsProps {
  onBack: () => void;
}

const AllAlerts = ({ onBack }: AllAlertsProps) => {
  const allAlerts = [
    {
      id: 1,
      message: 'Bus BX-101 delayed by 15 minutes due to traffic',
      time: '2 minutes ago',
      type: 'warning',
      busId: 'BX-101',
      route: 'Hostel to College',
    },
    {
      id: 2,
      message: 'Route RT002 has been updated',
      time: '5 minutes ago',
      type: 'info',
      busId: 'BX-205',
      route: 'City Center to College',
    },
    {
      id: 3,
      message: 'Bus BX-205 reached capacity',
      time: '8 minutes ago',
      type: 'info',
      busId: 'BX-205',
      route: 'City Center to College',
    },
    {
      id: 4,
      message: 'Bus BX-308 route changed due to construction',
      time: '12 minutes ago',
      type: 'warning',
      busId: 'BX-308',
      route: 'College to Hostel',
    },
    {
      id: 5,
      message: 'Bus BX-412 arrived safely at destination',
      time: '15 minutes ago',
      type: 'success',
      busId: 'BX-412',
      route: 'College to City Center',
    },
    {
      id: 6,
      message: 'Driver shift change for Bus BX-515',
      time: '20 minutes ago',
      type: 'info',
      busId: 'BX-515',
      route: 'Campus Loop',
    },
    {
      id: 7,
      message: 'Emergency stop reported on Route RT001',
      time: '25 minutes ago',
      type: 'warning',
      busId: 'BX-101',
      route: 'Hostel to College',
    },
    {
      id: 8,
      message: 'Bus BX-203 maintenance completed',
      time: '30 minutes ago',
      type: 'success',
      busId: 'BX-203',
      route: 'Library Circuit',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="destructive">Warning</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Success</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">Alert</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Alerts</h1>
          <p className="text-gray-600">Complete list of system alerts and notifications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            System Alerts ({allAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    {getAlertBadge(alert.type)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                    <div>Bus: {alert.busId}</div>
                    <div>Route: {alert.route}</div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.time}
                    </div>
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

export default AllAlerts;
