
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Plus, Calendar, MapPin, Shield, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FuelTheftRecord {
  id: string;
  busNumber: string;
  reportedBy: string;
  incidentDate: string;
  reportDate: string;
  location: string;
  estimatedLoss: number;
  description: string;
  status: 'reported' | 'investigating' | 'confirmed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  actionTaken?: string;
}

const FuelTheft = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [theftRecords, setTheftRecords] = useState<FuelTheftRecord[]>([]);
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState({
    busNumber: '',
    reportedBy: '',
    incidentDate: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    estimatedLoss: '',
    description: '',
    priority: 'medium' as const,
  });

  useEffect(() => {
    // Load buses from localStorage
    const savedBuses = localStorage.getItem('buses');
    if (savedBuses) setBuses(JSON.parse(savedBuses));

    // Load theft records from localStorage
    const savedRecords = localStorage.getItem('fuelTheftRecords');
    if (savedRecords) setTheftRecords(JSON.parse(savedRecords));
  }, []);

  const handleAddReport = () => {
    if (!newReport.busNumber || !newReport.reportedBy || !newReport.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const report: FuelTheftRecord = {
      id: Date.now().toString(),
      ...newReport,
      estimatedLoss: parseFloat(newReport.estimatedLoss) || 0,
      reportDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'reported',
    };

    const updatedRecords = [...theftRecords, report];
    setTheftRecords(updatedRecords);
    localStorage.setItem('fuelTheftRecords', JSON.stringify(updatedRecords));

    toast.error('Fuel theft report submitted', {
      description: `Report for Bus ${newReport.busNumber} has been logged`,
    });

    setNewReport({
      busNumber: '',
      reportedBy: '',
      incidentDate: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      estimatedLoss: '',
      description: '',
      priority: 'medium',
    });
    setShowAddReport(false);
  };

  const updateStatus = (reportId: string, newStatus: FuelTheftRecord['status']) => {
    const updatedRecords = theftRecords.map(record => 
      record.id === reportId ? { ...record, status: newStatus } : record
    );
    setTheftRecords(updatedRecords);
    localStorage.setItem('fuelTheftRecords', JSON.stringify(updatedRecords));
    toast.success(`Report status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const totalLoss = theftRecords.reduce((sum, record) => sum + record.estimatedLoss, 0);
  const activeReports = theftRecords.filter(record => record.status !== 'resolved').length;
  const confirmedCases = theftRecords.filter(record => record.status === 'confirmed').length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuel Theft Reports</h1>
          <p className="text-gray-600">Monitor and manage fuel theft incidents across your fleet</p>
        </div>
        <Dialog open={showAddReport} onOpenChange={setShowAddReport}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Theft
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Fuel Theft</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="busNumber">Bus Number *</Label>
                  <Select value={newReport.busNumber} onValueChange={(value) => setNewReport({...newReport, busNumber: value})}>
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
                <div>
                  <Label htmlFor="reportedBy">Reported By *</Label>
                  <Input
                    id="reportedBy"
                    value={newReport.reportedBy}
                    onChange={(e) => setNewReport({...newReport, reportedBy: e.target.value})}
                    placeholder="Reporter name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDate">Incident Date *</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={newReport.incidentDate}
                    onChange={(e) => setNewReport({...newReport, incidentDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newReport.priority} onValueChange={(value: any) => setNewReport({...newReport, priority: value})}>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newReport.location}
                    onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                    placeholder="Incident location"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedLoss">Estimated Loss (Liters)</Label>
                  <Input
                    id="estimatedLoss"
                    type="number"
                    step="0.1"
                    value={newReport.estimatedLoss}
                    onChange={(e) => setNewReport({...newReport, estimatedLoss: e.target.value})}
                    placeholder="Fuel lost"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Incident Description *</Label>
                <Textarea
                  id="description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  placeholder="Describe the incident in detail..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddReport} className="flex-1 bg-red-600 hover:bg-red-700">
                  Submit Report
                </Button>
                <Button variant="outline" onClick={() => setShowAddReport(false)} className="flex-1">
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">{theftRecords.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{activeReports}</span>
            </div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Confirmed Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">{confirmedCases}</span>
            </div>
            <p className="text-xs text-muted-foreground">Confirmed theft</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">{totalLoss.toFixed(1)}L</span>
            </div>
            <p className="text-xs text-muted-foreground">Estimated fuel loss</p>
          </CardContent>
        </Card>
      </div>

      {/* Theft Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Fuel Theft Reports
          </CardTitle>
          <CardDescription>All reported fuel theft incidents</CardDescription>
        </CardHeader>
        <CardContent>
          {theftRecords.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Theft Reports</h3>
              <p className="text-gray-600">No fuel theft incidents have been reported.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {theftRecords
                .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
                .map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-red-100">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Bus {record.busNumber}</h4>
                            <p className="text-sm text-gray-600">Reported by: {record.reportedBy}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(record.priority)}>
                            {record.priority} priority
                          </Badge>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            Incident: {format(new Date(record.incidentDate), 'PPP')}
                          </p>
                          {record.location && (
                            <p className="text-gray-600">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              Location: {record.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {record.estimatedLoss > 0 && (
                            <p className="font-medium text-red-600">
                              Estimated Loss: {record.estimatedLoss}L
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Reported: {format(new Date(record.reportDate), 'PPp')}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm">{record.description}</p>
                      </div>

                      {record.status !== 'resolved' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStatus(record.id, 'investigating')}
                            disabled={record.status === 'investigating'}
                          >
                            Start Investigation
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStatus(record.id, 'confirmed')}
                            disabled={record.status === 'confirmed'}
                          >
                            Confirm Theft
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateStatus(record.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        </div>
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

export default FuelTheft;
