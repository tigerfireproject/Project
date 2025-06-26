
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Navigation, X, Zap } from 'lucide-react';

interface LiveTrackingProps {
  route: any;
  onClose: () => void;
}

const LiveTracking = ({ route, onClose }: LiveTrackingProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Live Tracking - {route.busId}</CardTitle>
            <CardDescription>{route.name}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Map */}
          <Card className="h-64">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="text-center z-10">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Live Bus Location</h3>
                  <p className="text-gray-500">Real-time GPS tracking</p>
                </div>
                
                {/* Animated Bus Marker */}
                <div className="absolute top-20 left-32 bg-green-500 rounded-full p-2 animate-pulse">
                  <Zap className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Current Stop</span>
                </div>
                <p className="font-medium">Science Block</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Next Stop</span>
                </div>
                <p className="font-medium">Library</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">ETA</span>
                </div>
                <p className="font-medium text-blue-600">3 minutes</p>
              </CardContent>
            </Card>
          </div>

          {/* Passengers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Current Passengers:</span>
                <span className="font-medium">{route.students}/40</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(route.students / 40) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Navigation className="h-4 w-4 mr-2" />
              Full Screen Map
            </Button>
            <Button variant="outline" className="flex-1">
              Send Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTracking;
