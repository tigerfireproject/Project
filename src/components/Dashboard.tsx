
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import FloatingChat from '@/components/FloatingChat';
import DashboardContent from '@/components/DashboardContent';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 flex justify-between items-center">
            <SidebarTrigger />
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/profile')}
                className="h-8 w-8"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/settings')}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div style={{ marginLeft: '5px' }}>
            {children || <DashboardContent />}
          </div>
        </main>
        <FloatingChat />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
