import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bus, 
  Fuel, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Plus, 
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BusData {
  id: string;
  busNumber: string;
  route: string;
  driver: string;
  fuelLevel: number;
  lastService: Date;
  nextService: Date;
  status: 'active' | 'maintenance' | 'breakdown';
  isMoving: boolean;
  lastMovement: Date;
}

interface ServiceRequest {
  id: string;
  busId: string;
  busNumber: string;
  driver: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
}

const Buses = () => {
  // Load data from localStorage and sync changes
  const [buses, setBuses] = useState<BusData[]>(() => {
    const saved = localStorage.getItem('buses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('serviceRequests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showAddBus, setShowAddBus] = useState(false);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    busNumber: '',
    serviceType: '',
    scheduledDate: '',
    description: '',
    technician: '',
    estimatedCost: '',
    priority: 'Medium'
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  // Simulate bus tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          const timeSinceLastMovement = Date.now() - new Date(bus.lastMovement).getTime();
          const isStatic = timeSinceLastMovement > 10 * 60 * 1000; // 10 minutes
          
          if (isStatic && bus.isMoving) {
            toast.error(`Bus ${bus.busNumber} has been stationary for 10+ minutes`, {
              description: `Driver: ${bus.driver}`,
            });
          }
          
          return {
            ...bus,
            isMoving: !isStatic,
            fuelLevel: Math.max(0, bus.fuelLevel - Math.random() * 2)
          };
        })
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addBus = (busData: Omit<BusData, 'id' | 'lastMovement' | 'isMoving'>) => {
    const newBus: BusData = {
      ...busData,
      id: Date.now().toString(),
      isMoving: true,
      lastMovement: new Date()
    };
    setBuses([...buses, newBus]);
    toast.success(`Bus ${busData.busNumber} added successfully`);
  };

  const removeBus = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    setBuses(buses.filter(b => b.id !== busId));
    toast.success(`Bus ${bus?.busNumber} removed successfully`);
  };

  const handleServiceRequest = (request: Omit<ServiceRequest, 'id' | 'requestDate'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date()
    };
    setServiceRequests([...serviceRequests, newRequest]);
    toast.info(`Service request submitted for Bus ${request.busNumber}`);
  };

  const approveServiceRequest = (requestId: string) => {
    setServiceRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    toast.success('Service request approved');
  };

  const rejectServiceRequest = (requestId: string) => {
    setServiceRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
    toast.error('Service request rejected');
  };

  const scheduleService = (busId: string, date: Date) => {
    setBuses(prev => 
      prev.map(bus => 
        bus.id === busId ? { ...bus, nextService: date } : bus
      )
    );
    toast.success('Service scheduled successfully');
  };

  const handleScheduleService = () => {
    if (!newService.busNumber || !newService.serviceType || !newService.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    const serviceId = `SRV${String(Date.now()).slice(-6)}`;
    const service = {
      ...newService,
      id: serviceId,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    // Get existing services from localStorage
    const existingServices = JSON.parse(localStorage.getItem('busServices') || '[]');
    const updatedServices = [...existingServices, service];
    localStorage.setItem('busServices', JSON.stringify(updatedServices));

    setNewService({
      busNumber: '',
      serviceType: '',
      scheduledDate: '',
      description: '',
      technician: '',
      estimatedCost: '',
      priority: 'Medium'
    });
    setIsServiceModalOpen(false);
    
    // Update the bus status if it's a major service
    if (newService.serviceType.toLowerCase().includes('maintenance') || 
        newService.serviceType.toLowerCase().includes('repair')) {
      const updatedBuses = buses.map(bus => 
        bus.busNumber === newService.busNumber 
          ? { ...bus, status: 'maintenance' as const }
          : bus
      );
      setBuses(updatedBuses);
      localStorage.setItem('buses', JSON.stringify(updatedBuses));
    }

    toast.success('Service scheduled successfully');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bus Fleet Management</h1>
          <p className="text-gray-600">Manage your bus fleet, fuel, and maintenance</p>
        </div>
        <Dialog open={showAddBus} onOpenChange={setShowAddBus}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Bus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bus</DialogTitle>
              <DialogDescription>Add a new bus to your fleet</DialogDescription>
            </DialogHeader>
            <AddBusForm onSubmit={addBus} onClose={() => setShowAddBus(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bus Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Buses in Fleet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first bus to the fleet.</p>
            <Button onClick={() => setShowAddBus(true)} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Bus
            </Button>
          </div>
        ) : (
          buses.map((bus) => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bus className="h-5 w-5 mr-2 text-teal-600" />
                      Bus {bus.busNumber}
                    </CardTitle>
                    <CardDescription>Route: {bus.route}</CardDescription>
                  </div>
                  <Badge variant={
                    bus.status === 'active' ? 'default' : 
                    bus.status === 'maintenance' ? 'secondary' : 'destructive'
                  }>
                    {bus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-600">Driver</Label>
                  <p className="font-medium">{bus.driver}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600">Fuel Level</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          bus.fuelLevel > 50 ? 'bg-green-500' : 
                          bus.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${bus.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(bus.fuelLevel)}%</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Next Service</Label>
                  <p className="text-sm">{format(new Date(bus.nextService), 'PPP')}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${bus.isMoving ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs">{bus.isMoving ? 'Moving' : 'Stationary'}</span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedBus(bus.id);
                      setShowServiceRequest(true);
                    }}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Service
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeBus(bus.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Service Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Service Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {serviceRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No service requests</p>
          ) : (
            <div className="space-y-3">
              {serviceRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Bus {request.busNumber} - {request.driver}</p>
                    <p className="text-sm text-gray-600">{request.issue}</p>
                    <p className="text-xs text-gray-500">{format(new Date(request.requestDate), 'PPp')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      request.priority === 'high' ? 'destructive' : 
                      request.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {request.priority}
                    </Badge>
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => approveServiceRequest(request.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => rejectServiceRequest(request.id)}>
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                        {request.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Service Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            {selectedDate && (
              <div className="space-y-4">
                <h3 className="font-medium">Schedule Service for {format(selectedDate, 'PPP')}</h3>
                {buses.length === 0 ? (
                  <p className="text-gray-500">No buses available to schedule</p>
                ) : (
                  <Select onValueChange={(busId) => scheduleService(busId, selectedDate)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bus to schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          Bus {bus.busNumber} - {bus.route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Request Dialog */}
      <Dialog open={showServiceRequest} onOpenChange={setShowServiceRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Service Request</DialogTitle>
            <DialogDescription>Report an issue with the bus that needs attention</DialogDescription>
          </DialogHeader>
          <ServiceRequestForm 
            buses={buses}
            selectedBusId={selectedBus}
            onSubmit={handleServiceRequest} 
            onClose={() => setShowServiceRequest(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Service Schedule Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Bus Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceBusNumber">Bus Number *</Label>
                <select
                  id="serviceBusNumber"
                  value={newService.busNumber}
                  onChange={(e) => setNewService({...newService, busNumber: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Bus</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.busNumber}>
                      {bus.busNumber} - {bus.route}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="serviceType">Service Type *</Label>
                <select
                  id="serviceType"
                  value={newService.serviceType}
                  onChange={(e) => setNewService({...newService, serviceType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Service Type</option>
                  <option value="Regular Maintenance">Regular Maintenance</option>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Tire Replacement">Tire Replacement</option>
                  <option value="Brake Service">Brake Service</option>
                  <option value="Engine Repair">Engine Repair</option>
                  <option value="AC Service">AC Service</option>
                  <option value="General Inspection">General Inspection</option>
                </select>
              </div>
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newService.scheduledDate}
                  onChange={(e) => setNewService({...newService, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="technician">Technician</Label>
                <Input
                  id="technician"
                  value={newService.technician}
                  onChange={(e) => setNewService({...newService, technician: e.target.value})}
                  placeholder="Enter technician name"
                />
              </div>
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input
                  id="estimatedCost"
                  value={newService.estimatedCost}
                  onChange={(e) => setNewService({...newService, estimatedCost: e.target.value})}
                  placeholder="Enter estimated cost"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={newService.priority}
                  onChange={(e) => setNewService({...newService, priority: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea
                id="serviceDescription"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Enter service description..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleScheduleService} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Schedule Service
              </Button>
              <Button variant="outline" onClick={() => setIsServiceModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Service Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsServiceModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full px-6 py-3"
        >
          <Settings className="h-5 w-5 mr-2" />
          Schedule Service
        </Button>
      </div>
    </div>
  );
};

// Add Bus Form Component
const AddBusForm = ({ onSubmit, onClose }: { 
  onSubmit: (data: Omit<BusData, 'id' | 'lastMovement' | 'isMoving'>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    busNumber: '',
    route: '',
    driver: '',
    fuelLevel: 100,
    status: 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      nextService: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="busNumber">Bus Number</Label>
        <Input 
          id="busNumber"
          value={formData.busNumber}
          onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
          required 
        />
      </div>
      <div>
        <Label htmlFor="route">Route</Label>
        <Input 
          id="route"
          value={formData.route}
          onChange={(e) => setFormData({...formData, route: e.target.value})}
          required 
        />
      </div>
      <div>
        <Label htmlFor="driver">Driver Name</Label>
        <Input 
          id="driver"
          value={formData.driver}
          onChange={(e) => setFormData({...formData, driver: e.target.value})}
          required 
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Bus</Button>
      </div>
    </form>
  );
};

// Service Request Form Component
const ServiceRequestForm = ({ 
  buses, 
  selectedBusId, 
  onSubmit, 
  onClose 
}: { 
  buses: BusData[];
  selectedBusId: string;
  onSubmit: (data: Omit<ServiceRequest, 'id' | 'requestDate'>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    busId: selectedBusId,
    issue: '',
    priority: 'medium' as const
  });

  const selectedBus = buses.find(b => b.id === formData.busId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBus) {
      onSubmit({
        ...formData,
        busNumber: selectedBus.busNumber,
        driver: selectedBus.driver,
        status: 'pending'
      });
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bus">Select Bus</Label>
        <Select value={formData.busId} onValueChange={(value) => setFormData({...formData, busId: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select bus" />
          </SelectTrigger>
          <SelectContent>
            {buses.map((bus) => (
              <SelectItem key={bus.id} value={bus.id}>
                Bus {bus.busNumber} - {bus.driver}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="issue">Issue Description</Label>
        <Textarea 
          id="issue"
          value={formData.issue}
          onChange={(e) => setFormData({...formData, issue: e.target.value})}
          placeholder="Describe the issue..."
          required 
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit Request</Button>
      </div>
    </form>
  );
};

export default Buses;
