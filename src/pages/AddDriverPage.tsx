
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, Phone, Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AddDriverPage = () => {
  const navigate = useNavigate();
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    status: 'available' as const // Auto-set to available, will change based on bus movement
  });

  const handleLicensePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLicensePhoto(result);
        toast.success('License photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLicenseUpload = () => {
    const fileInput = document.getElementById('license-photo-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licensePhoto) {
      toast.error('Please upload driver license photo');
      return;
    }
    
    // Get existing drivers from localStorage
    const existingDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    
    // Create new driver
    const newDriver = {
      ...formData,
      id: Date.now().toString(),
      licensePhoto,
    };
    
    // Save to localStorage
    const updatedDrivers = [...existingDrivers, newDriver];
    localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
    
    toast.success(`Driver ${formData.name} added successfully`);
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Driver</h1>
          <p className="text-gray-600">Add a new driver to your team</p>
        </div>
      </div>

      {/* Main Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-purple-600" />
            Driver Information
          </CardTitle>
          <CardDescription>
            Fill in the driver's details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter driver's full name"
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="driver@example.com"
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Input 
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="e.g., 5 years"
                  required 
                />
              </div>
            </div>

            {/* License Photo Upload */}
            <div className="space-y-2">
              <Label>Driver License Photo *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {licensePhoto ? (
                  <div className="space-y-4">
                    <img 
                      src={licensePhoto} 
                      alt="Driver License" 
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="outline" onClick={triggerLicenseUpload}>
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 mb-2">Upload driver license photo</p>
                      <Button type="button" variant="outline" onClick={triggerLicenseUpload}>
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Photo
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  id="license-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLicensePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Driver Status</h4>
              <p className="text-sm text-blue-700">
                Driver status will be automatically managed based on bus assignments and movement. 
                New drivers start as "Available" and status changes to "Assigned" when allocated to a route.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Add Driver
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDriverPage;
