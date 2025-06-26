
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Phone, User, X } from 'lucide-react';

interface RouteDetailsProps {
  route: any;
  onClose: () => void;
}

const RouteDetails = ({ route, onClose }: RouteDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{route.name}</CardTitle>
            <CardDescription>{route.id} • {route.busId}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Driver Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Driver Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{route.driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone:
                </span>
                <span className="font-medium">{route.driver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{route.driver.experience}</span>
              </div>
            </div>
          </div>

          {/* Route Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-gray-600 text-sm">Working Hours</p>
              <p className="font-medium">{route.workingHours}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-gray-600 text-sm">Students</p>
              <p className="font-medium">{route.students}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <p className="text-gray-600 text-sm">Distance</p>
              <p className="font-medium">{route.distance}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-600 text-sm block">ETA Accuracy</span>
              <p className="font-medium text-blue-600">{route.accuracy}</p>
            </div>
          </div>

          {/* Bus Stops */}
          <div>
            <h4 className="font-medium mb-3">Bus Stops</h4>
            <div className="space-y-2">
              {route.stops_list.map((stop: string, index: number) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </div>
                  <span>{stop}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Start Route
            </Button>
            <Button variant="outline" className="flex-1">
              Edit Route
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteDetails;
