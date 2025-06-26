
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bus, Upload, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddBusPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busNumber: '',
    model: '',
    year: '',
    capacity: '',
    fuelType: 'diesel',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    fitnessExpiry: '',
    permitExpiry: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.busNumber || !formData.model || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get existing buses from localStorage
    const existingBuses = JSON.parse(localStorage.getItem('buses') || '[]');
    
    const newBus = {
      id: Date.now().toString(),
      ...formData,
      capacity: parseInt(formData.capacity),
      status: 'active',
      fuelLevel: 100,
      driver: 'Unassigned',
      route: 'Not Assigned',
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextService: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isMoving: false,
      lastMovement: new Date(),
    };

    const updatedBuses = [...existingBuses, newBus];
    localStorage.setItem('buses', JSON.stringify(updatedBuses));

    toast.success(`Bus ${formData.busNumber} added successfully`);
    navigate('/buses');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/buses')}
          className="hover:bg-gray-100"
        >
          ← Back to Buses
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Bus</h1>
          <p className="text-gray-600">Register a new bus to your fleet</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bus className="h-6 w-6 mr-2 text-blue-600" />
            Bus Registration Form
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new bus to your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                
                <div>
                  <Label htmlFor="busNumber">Bus Number *</Label>
                  <Input
                    id="busNumber"
                    value={formData.busNumber}
                    onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                    placeholder="e.g., B001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="model">Bus Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="e.g., Tata Starbus"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Manufacturing Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    placeholder="e.g., 2020"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Seating Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="e.g., 45"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Registration & Legal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Registration & Legal</h3>
                
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    placeholder="e.g., TN 01 AB 1234"
                  />
                </div>

                <div>
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input
                    id="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({...formData, chassisNumber: e.target.value})}
                    placeholder="Enter chassis number"
                  />
                </div>

                <div>
                  <Label htmlFor="engineNumber">Engine Number</Label>
                  <Input
                    id="engineNumber"
                    value={formData.engineNumber}
                    onChange={(e) => setFormData({...formData, engineNumber: e.target.value})}
                    placeholder="Enter engine number"
                  />
                </div>

                <div>
                  <Label htmlFor="insuranceNumber">Insurance Policy Number</Label>
                  <Input
                    id="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})}
                    placeholder="Enter insurance policy number"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                    <Input
                      id="insuranceExpiry"
                      type="date"
                      value={formData.insuranceExpiry}
                      onChange={(e) => setFormData({...formData, insuranceExpiry: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fitnessExpiry">Fitness Certificate Expiry</Label>
                    <Input
                      id="fitnessExpiry"
                      type="date"
                      value={formData.fitnessExpiry}
                      onChange={(e) => setFormData({...formData, fitnessExpiry: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="permitExpiry">Permit Expiry</Label>
                    <Input
                      id="permitExpiry"
                      type="date"
                      value={formData.permitExpiry}
                      onChange={(e) => setFormData({...formData, permitExpiry: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Additional Notes</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Any additional information about the bus..."
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Bus className="h-4 w-4 mr-2" />
                Add Bus to Fleet
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/buses')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBusPage;
