
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Clock, Route as RouteIcon } from 'lucide-react';
import { toast } from 'sonner';

const AddRoutePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedTime: '',
    assignedDriver: '',
    status: 'active' as const,
    stops: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing routes from localStorage
    const existingRoutes = JSON.parse(localStorage.getItem('routes') || '[]');
    
    // Create new route
    const newRoute = {
      ...formData,
      id: Date.now().toString(),
      stops: formData.stops.split('\n').filter(stop => stop.trim())
    };
    
    // Save to localStorage
    const updatedRoutes = [...existingRoutes, newRoute];
    localStorage.setItem('routes', JSON.stringify(updatedRoutes));
    
    toast.success(`Route ${formData.routeName} added successfully`);
    navigate('/routes');
  };

  const handleCancel = () => {
    navigate('/routes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routes
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Route</h1>
          <p className="text-gray-600">Create a new route for your fleet</p>
        </div>
      </div>

      {/* Main Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RouteIcon className="h-5 w-5 mr-2 text-green-600" />
            Route Details
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new route
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="routeName">Route Name *</Label>
                  <Input 
                    id="routeName"
                    value={formData.routeName}
                    onChange={(e) => setFormData({...formData, routeName: e.target.value})}
                    placeholder="e.g., College Campus - Downtown"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="startPoint">Start Point *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="startPoint"
                      value={formData.startPoint}
                      onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
                      placeholder="Starting location"
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endPoint">End Point *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="endPoint"
                      value={formData.endPoint}
                      onChange={(e) => setFormData({...formData, endPoint: e.target.value})}
                      placeholder="Destination location"
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="distance">Distance (km) *</Label>
                  <Input 
                    id="distance"
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    placeholder="0.0"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="estimatedTime"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                      placeholder="e.g., 45 mins"
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Driver Assignment */}
            <div>
              <Label htmlFor="assignedDriver">Assigned Driver</Label>
              <Textarea
                id="assignedDriver"
                value={formData.assignedDriver}
                onChange={(e) => setFormData({...formData, assignedDriver: e.target.value})}
                placeholder="Driver name (optional)"
                rows={2}
              />
              <p className="text-sm text-gray-500 mt-1">
                You can assign a driver now or leave empty to assign later
              </p>
            </div>
            
            {/* Stops */}
            <div>
              <Label htmlFor="stops">Route Stops</Label>
              <Textarea 
                id="stops"
                value={formData.stops}
                onChange={(e) => setFormData({...formData, stops: e.target.value})}
                placeholder="Enter each stop on a new line..."
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add intermediate stops between start and end points (one per line)
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Create Route
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoutePage;
