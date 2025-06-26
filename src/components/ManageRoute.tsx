
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Users, Phone, User, X, Edit, Trash2, Plus } from 'lucide-react';

interface ManageRouteProps {
  route: any;
  onClose: () => void;
}

const ManageRoute = ({ route, onClose }: ManageRouteProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Manage Route - {route.id}</CardTitle>
            <CardDescription>{route.name}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="stops">Bus Stops</TabsTrigger>
              <TabsTrigger value="driver">Driver</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Working Hours</label>
                  <Input defaultValue={route.workingHours} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bus ID</label>
                  <Input defaultValue={route.busId} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time</label>
                  <Input defaultValue={route.estimatedTime} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select className="w-full p-2 border rounded-md" defaultValue={route.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stops" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Bus Stops ({route.stops})</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stop
                </Button>
              </div>
              <div className="space-y-2">
                {route.stops_list.map((stop: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                        {index + 1}
                      </div>
                      <Input defaultValue={stop} className="mr-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="driver" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Driver Name</label>
                  <Input defaultValue={route.driver.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input defaultValue={route.driver.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <Input defaultValue={route.driver.experience} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">License Number</label>
                  <Input placeholder="Enter license number" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-6 border-t">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageRoute;
