
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Clock, Shield, Edit, Save, X, Camera } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@bustrax.com',
    phone: '+91 98765-43210',
    role: 'Fleet Administrator',
    department: 'Transportation Management',
    employeeId: 'BXT-2024-001',
    joinDate: '2024-01-15',
    lastLogin: '2024-06-18 09:30 AM',
    bio: 'Experienced transportation manager with 8+ years in fleet operations and student safety.',
    address: '123 Transport Hub, Tech City, State - 12345'
  });

  const [originalData, setOriginalData] = useState(profileData);

  const systemStats = [
    { label: 'Total Buses Managed', value: '24', trend: '+2 this month' },
    { label: 'Routes Supervised', value: '12', trend: 'Active' },
    { label: 'Students Transported', value: '486', trend: 'Daily average' },
    { label: 'Alerts Handled', value: '147', trend: 'This week' },
  ];

  const recentActivity = [
    { action: 'Updated Route RT-002', time: '2 hours ago', type: 'route' },
    { action: 'Resolved Bus Delay Alert', time: '4 hours ago', type: 'alert' },
    { action: 'Added New Bus BX-425', time: '1 day ago', type: 'bus' },
    { action: 'Modified Driver Schedule', time: '2 days ago', type: 'schedule' },
    { action: 'System Backup Completed', time: '3 days ago', type: 'system' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        toast.success('Profile image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalData(profileData);
    toast.success('Profile updated successfully!');
    console.log('Profile updated:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(originalData);
    setProfileImage(null);
    toast.info('Changes cancelled');
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div></div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your account details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="text-lg bg-teal-100 text-teal-700">
                          {profileData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-teal-600 hover:bg-teal-700"
                          onClick={triggerImageUpload}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{profileData.name}</h3>
                      <p className="text-sm text-gray-600">{profileData.role}</p>
                      <Badge variant="secondary" className="mt-1 bg-teal-100 text-teal-700">
                        {profileData.department}
                      </Badge>
                      {profileImage && (
                        <p className="text-xs text-green-600 mt-1">Profile image updated</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={isEditing ? 'border-teal-300 focus:border-teal-500' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={isEditing ? 'border-teal-300 focus:border-teal-500' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={isEditing ? 'border-teal-300 focus:border-teal-500' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={profileData.employeeId}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Additional editable fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className={isEditing ? 'border-teal-300 focus:border-teal-500' : ''}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={isEditing ? 'border-teal-300 focus:border-teal-500' : ''}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics & Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Account Status:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Member Since:</span>
                    <span className="text-sm font-medium">{profileData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Last Login:</span>
                    <span className="text-sm font-medium">{profileData.lastLogin}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemStats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{stat.label}</span>
                        <span className="font-bold text-teal-600">{stat.value}</span>
                      </div>
                      <p className="text-xs text-gray-500">{stat.trend}</p>
                      {index < systemStats.length - 1 && <Separator className="mt-2" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and system interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'route' ? 'bg-blue-600' :
                      activity.type === 'alert' ? 'bg-orange-600' :
                      activity.type === 'bus' ? 'bg-green-600' :
                      activity.type === 'schedule' ? 'bg-purple-600' :
                      'bg-gray-600'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
