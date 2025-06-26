
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Fuel, Plus, Calendar, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FuelFillRecord {
  id: string;
  busNumber: string;
  quantity: number;
  pricePerLiter: number;
  totalCost: number;
  date: string;
  location: string;
  odometer: number;
  attendant: string;
}

const FuelFill = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelFillRecord[]>([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    busNumber: '',
    quantity: '',
    pricePerLiter: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    odometer: '',
    attendant: '',
  });

  useEffect(() => {
    // Load buses from localStorage
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));

    // Load fuel records from localStorage
    const savedRecords = localStorage.getItem('fuelFillRecords');
    if (savedRecords) setFuelRecords(JSON.parse(savedRecords));
  }, []);

  const handleAddRecord = () => {
    if (!newRecord.busNumber || !newRecord.quantity || !newRecord.pricePerLiter) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseFloat(newRecord.quantity);
    const pricePerLiter = parseFloat(newRecord.pricePerLiter);
    const totalCost = quantity * pricePerLiter;

    const record: FuelFillRecord = {
      id: Date.now().toString(),
      busNumber: newRecord.busNumber,
      quantity,
      pricePerLiter,
      totalCost,
      date: newRecord.date,
      location: newRecord.location || 'Not specified',
      odometer: parseInt(newRecord.odometer) || 0,
      attendant: newRecord.attendant || 'Not specified',
    };

    const updatedRecords = [...fuelRecords, record];
    setFuelRecords(updatedRecords);
    localStorage.setItem('fuelFillRecords', JSON.stringify(updatedRecords));

    // Update bus fuel level (assuming tank capacity of 200L)
    const updatedBuses = buses.map(bus => {
      if (bus.busNumber === newRecord.busNumber) {
        const newFuelLevel = Math.min(100, bus.fuelLevel + (quantity / 200) * 100);
        return { ...bus, fuelLevel: newFuelLevel };
      }
      return bus;
    });
    setBuses(updatedBuses);
    localStorage.setItem('buses', JSON.stringify(updatedBuses));

    toast.success('Fuel fill record added successfully');
    setNewRecord({
      busNumber: '',
      quantity: '',
      pricePerLiter: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      odometer: '',
      attendant: '',
    });
    setShowAddRecord(false);
  };

  const totalFuelFilled = fuelRecords.reduce((sum, record) => sum + record.quantity, 0);
  const totalCostThisMonth = fuelRecords
    .filter(record => new Date(record.date).getMonth() === new Date().getMonth())
    .reduce((sum, record) => sum + record.totalCost, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuel Fill Records</h1>
          <p className="text-gray-600">Track fuel filling records for all buses</p>
        </div>
        <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Fuel Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fuel Fill Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="busNumber">Bus Number *</Label>
                <Select value={newRecord.busNumber} onValueChange={(value) => setNewRecord({...newRecord, busNumber: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.busNumber}>
                        {bus.busNumber} - {bus.route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity (Liters) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    value={newRecord.quantity}
                    onChange={(e) => setNewRecord({...newRecord, quantity: e.target.value})}
                    placeholder="Enter liters"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerLiter">Price per Liter *</Label>
                  <Input
                    id="pricePerLiter"
                    type="number"
                    step="0.01"
                    value={newRecord.pricePerLiter}
                    onChange={(e) => setNewRecord({...newRecord, pricePerLiter: e.target.value})}
                    placeholder="₹/Liter"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Fill Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="location">Fuel Station Location</Label>
                <Input
                  id="location"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="odometer">Odometer Reading</Label>
                  <Input
                    id="odometer"
                    type="number"
                    value={newRecord.odometer}
                    onChange={(e) => setNewRecord({...newRecord, odometer: e.target.value})}
                    placeholder="KM"
                  />
                </div>
                <div>
                  <Label htmlFor="attendant">Attendant Name</Label>
                  <Input
                    id="attendant"
                    value={newRecord.attendant}
                    onChange={(e) => setNewRecord({...newRecord, attendant: e.target.value})}
                    placeholder="Attendant name"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddRecord} className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Record
                </Button>
                <Button variant="outline" onClick={() => setShowAddRecord(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Fuel Filled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalFuelFilled.toFixed(1)}L</span>
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">₹{totalCostThisMonth.toFixed(0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">{fuelRecords.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Fill records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">
                {fuelRecords.length > 0 ? (totalFuelFilled / fuelRecords.length).toFixed(1) : '0'}L
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Per fill</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Fill Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fuel className="h-5 w-5 mr-2 text-blue-600" />
            Recent Fuel Fill Records
          </CardTitle>
          <CardDescription>Latest fuel filling transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {fuelRecords.length === 0 ? (
            <div className="text-center py-8">
              <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fuel Records</h3>
              <p className="text-gray-600">Start by adding your first fuel fill record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fuelRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Fuel className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Bus {record.busNumber}</h4>
                        <p className="text-sm text-gray-600">{record.quantity}L @ ₹{record.pricePerLiter}/L</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(record.date), 'PPP')}
                          </span>
                          {record.location !== 'Not specified' && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {record.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{record.totalCost.toFixed(2)}</p>
                      {record.odometer > 0 && (
                        <p className="text-xs text-gray-500">{record.odometer.toLocaleString()} KM</p>
                      )}
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

export default FuelFill;
