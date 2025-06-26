
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, CheckCircle, X, Eye } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Bus RT-001 Delayed',
      message: 'Bus RT-001 is running 15 minutes behind schedule due to traffic',
      type: 'delay',
      timestamp: '2024-06-26 10:30 AM',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Route Update Required',
      message: 'Route RT-003 needs to be updated due to road construction',
      type: 'route',
      timestamp: '2024-06-26 09:15 AM',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Maintenance Scheduled',
      message: 'Bus BX-105 is scheduled for maintenance tomorrow at 9:00 AM',
      type: 'maintenance',
      timestamp: '2024-06-25 16:45 PM',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      title: 'Driver Check-in',
      message: 'Driver John Smith has checked in for Route RT-002',
      type: 'driver',
      timestamp: '2024-06-25 07:30 AM',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      title: 'Fuel Alert',
      message: 'Bus BX-203 fuel level is below 20%',
      type: 'fuel',
      timestamp: '2024-06-24 14:20 PM',
      read: false,
      priority: 'high'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'route': return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      case 'maintenance': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'driver': return <Bell className="h-5 w-5 text-purple-600" />;
      case 'fuel': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All notifications are read'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Recent Notifications
          </CardTitle>
          <CardDescription>
            Stay updated with the latest alerts and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notifications at the moment</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${
                          notification.read ? 'text-gray-600' : 'text-gray-700'
                        } mb-2`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
