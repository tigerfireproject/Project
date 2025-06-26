
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Bus, Map, Bell, Fuel, ChevronRight, Plus, Wrench, CreditCard, AlertTriangle, Route, User, Clock, MapPin, Shield, Zap, Thermometer, Activity } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Bus,
  },
  {
    title: 'Live Map',
    url: '/live-map',
    icon: Map,
  },
  {
    title: 'Bus',
    url: '/buses',
    icon: Bus,
    subItems: [
      { title: 'Add Bus', url: '/buses/add', icon: Plus },
      { title: 'Add Routes', url: '/buses/add-routes', icon: Route },
      { title: 'Add Driver', url: '/buses/add-driver', icon: User },
      { title: 'Fleet Management', url: '/buses/fleet', icon: Bus },
      { title: 'Expenses', url: '/buses/expenses', icon: CreditCard },
      { title: 'KM Report', url: '/buses/km-report', icon: Activity },
      { title: 'Moving Hours', url: '/buses/moving-hours', icon: Activity },
      { title: 'Engine On Hrs', url: '/buses/engine-hours', icon: Zap },
      { title: 'Stopped Hrs', url: '/buses/stopped-hours', icon: Clock },
      { title: 'Idle Hrs', url: '/buses/idle-hours', icon: Clock },
      { title: 'Parked Hrs', url: '/buses/parked-hours', icon: MapPin },
      { title: 'Overspeed Report', url: '/buses/overspeed', icon: AlertTriangle },
      { title: 'Sec. Engine', url: '/buses/secondary-engine', icon: Zap },
      { title: 'A/C', url: '/buses/ac-report', icon: Thermometer },
      { title: 'Geofence Report', url: '/buses/geofence', icon: Shield },
    ]
  },
  {
    title: 'Service',
    url: '/service',
    icon: Wrench,
    subItems: [
      { title: 'Driver Request', url: '/service/driver-request', icon: User },
      { title: 'Scheduled Service', url: '/service/scheduled', icon: Clock },
    ]
  },
  {
    title: 'Fuel',
    url: '/fuel',
    icon: Fuel,
    subItems: [
      { title: 'Fuel Report', url: '/fuel/report', icon: Activity },
      { title: 'Fuel Cons.', url: '/fuel/consumption', icon: Activity },
      { title: 'Fuel Fill', url: '/fuel/fill', icon: Plus },
      { title: 'Fuel Theft', url: '/fuel/theft', icon: AlertTriangle },
    ]
  },
  {
    title: 'Breakdown',
    url: '/breakdown',
    icon: AlertTriangle,
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: Bell,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (url: string) => location.pathname === url;
  const hasActiveSubItem = (subItems?: typeof menuItems[0]['subItems']) => {
    return subItems?.some(subItem => location.pathname === subItem.url) || false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/1cd3d30b-614f-4053-a2f9-0f3f3716010d.png" 
              alt="BustraX Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-primary">BustraX</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible 
                      open={openItems.includes(item.title) || hasActiveSubItem(item.subItems)}
                      onOpenChange={() => toggleItem(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          isActive={isActive(item.url) || hasActiveSubItem(item.subItems)}
                          className="cursor-pointer w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <button 
                                  onClick={() => handleNavigation(subItem.url)}
                                  className="w-full flex items-center gap-2"
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      isActive={isActive(item.url)}
                      onClick={() => handleNavigation(item.url)}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          BustraX Admin Dashboard v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
