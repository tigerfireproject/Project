
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft } from 'lucide-react';

interface NotificationSettingsProps {
  onBack: () => void;
  preferences: {
    delayAlerts: boolean;
    arrivalNotifications: boolean;
    routeChanges: boolean;
    capacityAlerts: boolean;
    driverUpdates: boolean;
  };
  setPreferences: (preferences: any) => void;
}

const NotificationSettings = ({ onBack, preferences, setPreferences }: NotificationSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notifications
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600">Customize your notification preferences</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delay Alerts</p>
                <p className="text-sm text-gray-600">Get notified when buses are delayed</p>
              </div>
              <Switch
                checked={preferences.delayAlerts}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, delayAlerts: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Arrival Notifications</p>
                <p className="text-sm text-gray-600">Get notified when buses arrive at destinations</p>
              </div>
              <Switch
                checked={preferences.arrivalNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, arrivalNotifications: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Route Changes</p>
                <p className="text-sm text-gray-600">Get notified about route modifications</p>
              </div>
              <Switch
                checked={preferences.routeChanges}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, routeChanges: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Capacity Alerts</p>
                <p className="text-sm text-gray-600">Get notified when buses reach capacity</p>
              </div>
              <Switch
                checked={preferences.capacityAlerts}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, capacityAlerts: checked })
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Driver Updates</p>
                <p className="text-sm text-gray-600">Get notified about driver-related updates</p>
              </div>
              <Switch
                checked={preferences.driverUpdates}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, driverUpdates: checked })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
