
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bus, AlertTriangle, CheckCircle, Users, MapPin, Fuel, Clock, TrendingUp, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const DashboardContent = () => {
  const navigate = useNavigate();
  
  // Sample data for the weekly performance chart
  const weeklyPerformanceData = [
    { day: 'Mon', onTime: 12, delayed: 3, total: 15 },
    { day: 'Tue', onTime: 14, delayed: 1, total: 15 },
    { day: 'Wed', onTime: 11, delayed: 4, total: 15 },
    { day: 'Thu', onTime: 13, delayed: 2, total: 15 },
    { day: 'Fri', onTime: 10, delayed: 5, total: 15 },
    { day: 'Sat', onTime: 15, delayed: 0, total: 15 },
    { day: 'Sun', onTime: 14, delayed: 1, total: 15 },
  ];

  const handleBarClick = (data: any) => {
    const dateMap: { [key: string]: string } = {
      'Mon': '2024-01-15',
      'Tue': '2024-01-16', 
      'Wed': '2024-01-17',
      'Thu': '2024-01-18',
      'Fri': '2024-01-19',
      'Sat': '2024-01-20',
      'Sun': '2024-01-21'
    };
    
    navigate(`/performance-details?date=${dateMap[data.day]}`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-green-600">{`On Time: ${payload[0].payload.onTime} buses`}</p>
          <p className="text-red-600">{`Delayed: ${payload[0].payload.delayed} buses`}</p>
          <p className="text-xs text-gray-500 mt-1">Click to see details</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (onTime: number, total: number) => {
    const percentage = (onTime / total) * 100;
    if (percentage >= 90) return '#10b981'; // green
    if (percentage >= 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your bus fleet operations</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <MapPin className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12.5</div>
            <p className="text-xs text-muted-foreground">km/liter avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Weekly Performance Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                Weekly Performance Overview
              </CardTitle>
              <CardDescription className="mt-2">
                Bus punctuality performance for the current week
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                On Time
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Delayed
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyPerformanceData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="total" 
                  radius={[6, 6, 0, 0]}
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                  fill="url(#barGradient)"
                >
                  {weeklyPerformanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.onTime, entry.total)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Tip:</strong> Hover over bars to see detailed bus counts, click to view specific day performance
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/buses/add')}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Plus className="h-5 w-5 mr-2 text-green-600" />
              Add New Bus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Register a new bus to your fleet</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/live-map')}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Live Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Monitor real-time bus locations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/fuel/report')}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Fuel className="h-5 w-5 mr-2 text-purple-600" />
              Fuel Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">View detailed fuel consumption data</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
