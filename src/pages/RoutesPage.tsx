import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Route as RouteIcon, 
  Plus, 
  Trash2, 
  Edit, 
  MapPin, 
  Users, 
  Clock,
  Map,
  User,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface Route {
  id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  assignedDriver: string;
  status: 'active' | 'inactive' | 'maintenance';
  stops: string[];
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  experience: string;
  status: 'available' | 'assigned' | 'on-leave';
}

const RoutesPage = () => {
  const navigate = useNavigate();
  
  // Load data from localStorage and maintain persistence
  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem('routes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('drivers');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showEditDriver, setShowEditDriver] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [drivers]);

  const addRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: Date.now().toString()
    };
    setRoutes(prev => [...prev, newRoute]);
    toast.success(`Route ${routeData.routeName} added successfully`);
  };

  const deleteRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    setRoutes(prev => prev.filter(r => r.id !== routeId));
    toast.success(`Route ${route?.routeName} deleted successfully`);
  };

  const updateRoute = (updatedRoute: Route) => {
    setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
    toast.success(`Route ${updatedRoute.routeName} updated successfully`);
  };

  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString()
    };
    setDrivers(prev => [...prev, newDriver]);
    toast.success(`Driver ${driverData.name} added successfully`);
  };

  const deleteDriver = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    
    // Check if driver is assigned to any route
    const assignedRoute = routes.find(r => r.assignedDriver === driver?.name);
    if (assignedRoute) {
      toast.error(`Cannot delete ${driver?.name}. Driver is assigned to route ${assignedRoute.routeName}`);
      return;
    }
    
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    toast.success(`Driver ${driver?.name} deleted successfully`);
  };

  const updateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    
    // Update routes that have this driver assigned
    setRoutes(prev => prev.map(r => 
      r.assignedDriver === drivers.find(d => d.id === updatedDriver.id)?.name 
        ? { ...r, assignedDriver: updatedDriver.name }
        : r
    ));
    
    toast.success(`Driver ${updatedDriver.name} updated successfully`);
  };

  // Filter data based on search
  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Routes & Drivers Management</h1>
          <p className="text-gray-600">Manage your routes and drivers efficiently</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => navigate('/live-map')} className="bg-blue-600 hover:bg-blue-700">
            <Map className="h-4 w-4 mr-2" />
            Live Map
          </Button>
          <Dialog open={showAddRoute} onOpenChange={setShowAddRoute}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
                <DialogDescription>Create a new route for your fleet</DialogDescription>
              </DialogHeader>
              <RouteForm
                drivers={drivers}
                onSubmit={addRoute}
                onClose={() => setShowAddRoute(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Add a new driver to your team</DialogDescription>
              </DialogHeader>
              <DriverForm
                onSubmit={addDriver}
                onClose={() => setShowAddDriver(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search routes or drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Routes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RouteIcon className="h-5 w-5 mr-2 text-green-600" />
            Routes ({filteredRoutes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-8">
              <RouteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No routes match your search.' : 'Start by adding your first route.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddRoute(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoutes.map((route) => (
                <Card key={route.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{route.routeName}</CardTitle>
                      <Badge variant={
                        route.status === 'active' ? 'default' : 
                        route.status === 'inactive' ? 'secondary' : 'destructive'
                      }>
                        {route.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">{route.startPoint}</p>
                        <p className="text-gray-600">to {route.endPoint}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{route.distance} km</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {route.estimatedTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{route.assignedDriver || 'No driver assigned'}</span>
                    </div>
                    
                    {route.stops.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Stops:</span> {route.stops.slice(0, 2).join(', ')}
                        {route.stops.length > 2 && ` +${route.stops.length - 2} more`}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingRoute(route);
                          setShowAddRoute(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteRoute(route.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drivers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Drivers ({filteredDrivers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Drivers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No drivers match your search.' : 'Start by adding your first driver.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddDriver(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrivers.map((driver) => (
                <Card key={driver.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <Badge variant={
                        driver.status === 'available' ? 'default' : 
                        driver.status === 'assigned' ? 'secondary' : 'destructive'
                      }>
                        {driver.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><span className="font-medium">License:</span> {driver.licenseNumber}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {driver.phone}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {driver.email}</p>
                    <p className="text-sm"><span className="font-medium">Experience:</span> {driver.experience}</p>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingDriver(driver);
                          setShowEditDriver(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteDriver(driver.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Route Dialog */}
      <Dialog open={showAddRoute && !!editingRoute} onOpenChange={(open) => {
        if (!open) {
          setEditingRoute(null);
          setShowAddRoute(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>Update route information</DialogDescription>
          </DialogHeader>
          {editingRoute && (
            <RouteForm
              drivers={drivers}
              initialData={editingRoute}
              onSubmit={(data) => {
                updateRoute({ ...data, id: editingRoute.id });
                setEditingRoute(null);
                setShowAddRoute(false);
              }}
              onClose={() => {
                setEditingRoute(null);
                setShowAddRoute(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={showEditDriver} onOpenChange={setShowEditDriver}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information</DialogDescription>
          </DialogHeader>
          {editingDriver && (
            <DriverForm
              initialData={editingDriver}
              onSubmit={(data) => {
                updateDriver({ ...data, id: editingDriver.id });
                setEditingDriver(null);
                setShowEditDriver(false);
              }}
              onClose={() => {
                setEditingDriver(null);
                setShowEditDriver(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Route Form Component
const RouteForm = ({ 
  drivers, 
  initialData, 
  onSubmit, 
  onClose 
}: { 
  drivers: Driver[];
  initialData?: Route;
  onSubmit: (data: Omit<Route, 'id'>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    routeName: initialData?.routeName || '',
    startPoint: initialData?.startPoint || '',
    endPoint: initialData?.endPoint || '',
    distance: initialData?.distance || '',
    estimatedTime: initialData?.estimatedTime || '',
    assignedDriver: initialData?.assignedDriver || '',
    status: initialData?.status || 'active' as const,
    stops: initialData?.stops.join('\n') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      stops: formData.stops.split('\n').filter(stop => stop.trim())
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="routeName">Route Name</Label>
          <Input 
            id="routeName"
            value={formData.routeName}
            onChange={(e) => setFormData({...formData, routeName: e.target.value})}
            required 
          />
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
        <div>
          <Label htmlFor="startPoint">Start Point</Label>
          <Input 
            id="startPoint"
            value={formData.startPoint}
            onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="endPoint">End Point</Label>
          <Input 
            id="endPoint"
            value={formData.endPoint}
            onChange={(e) => setFormData({...formData, endPoint: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input 
            id="distance"
            value={formData.distance}
            onChange={(e) => setFormData({...formData, distance: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="estimatedTime">Estimated Time</Label>
          <Input 
            id="estimatedTime"
            value={formData.estimatedTime}
            onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
            placeholder="e.g., 45 mins"
            required 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="assignedDriver">Assigned Driver</Label>
        <Textarea
          id="assignedDriver"
          value={formData.assignedDriver}
          onChange={(e) => setFormData({...formData, assignedDriver: e.target.value})}
          placeholder="Type driver name or select from available drivers..."
          rows={2}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {drivers.filter(d => d.status === 'available').map((driver) => (
            <Button
              key={driver.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({...formData, assignedDriver: driver.name})}
            >
              {driver.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="stops">Stops (one per line)</Label>
        <Textarea 
          id="stops"
          value={formData.stops}
          onChange={(e) => setFormData({...formData, stops: e.target.value})}
          placeholder="Enter each stop on a new line..."
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Add'} Route</Button>
      </div>
    </form>
  );
};

// Driver Form Component
const DriverForm = ({ 
  initialData, 
  onSubmit, 
  onClose 
}: { 
  initialData?: Driver;
  onSubmit: (data: Omit<Driver, 'id'>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    licenseNumber: initialData?.licenseNumber || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    experience: initialData?.experience || '',
    status: initialData?.status || 'available' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input 
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
        </div>
        <div>
          <Label htmlFor="experience">Experience</Label>
          <Input 
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            placeholder="e.g., 5 years"
            required 
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Add'} Driver</Button>
      </div>
    </form>
  );
};

export default RoutesPage;
