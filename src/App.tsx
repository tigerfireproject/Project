import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import LiveMap from './pages/LiveMap';
import RoutesPage from './pages/RoutesPage';
import AddRoutePage from './pages/AddRoutePage';
import AddDriverPage from './pages/AddDriverPage';
import Buses from './pages/Buses';
import FleetManagement from './pages/FleetManagement';
import ServiceRequest from './pages/ServiceRequest';
import Expenses from './pages/Expenses';
import Breakdown from './pages/Breakdown';
import FuelReport from './pages/FuelReport';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PerformanceDetails from './pages/PerformanceDetails';
import NotFound from './pages/NotFound';
import Dashboard from './components/Dashboard';
import AddBusPage from './pages/AddBusPage';
import FuelConsumption from './pages/FuelConsumption';
import FuelFill from './pages/FuelFill';
import FuelTheft from './pages/FuelTheft';
import KMReport from './pages/KMReport';
import MovingHours from './pages/MovingHours';
import EngineHours from './pages/EngineHours';
import StoppedHours from './pages/StoppedHours';
import IdleHours from './pages/IdleHours';
import ParkedHours from './pages/ParkedHours';
import OverspeedReport from './pages/OverspeedReport';
import SecondaryEngine from './pages/SecondaryEngine';
import ACReport from './pages/ACReport';
import GeofenceReport from './pages/GeofenceReport';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-map" element={<Dashboard><LiveMap /></Dashboard>} />
          <Route path="/buses" element={<Dashboard><Buses /></Dashboard>} />
          <Route path="/buses/add" element={<Dashboard><AddBusPage /></Dashboard>} />
          <Route path="/buses/add-routes" element={<Dashboard><AddRoutePage /></Dashboard>} />
          <Route path="/buses/add-driver" element={<Dashboard><AddDriverPage /></Dashboard>} />
          <Route path="/buses/fleet" element={<Dashboard><FleetManagement /></Dashboard>} />
          <Route path="/buses/expenses" element={<Dashboard><Expenses /></Dashboard>} />
          <Route path="/buses/km-report" element={<Dashboard><KMReport /></Dashboard>} />
          <Route path="/buses/moving-hours" element={<Dashboard><MovingHours /></Dashboard>} />
          <Route path="/buses/engine-hours" element={<Dashboard><EngineHours /></Dashboard>} />
          <Route path="/buses/stopped-hours" element={<Dashboard><StoppedHours /></Dashboard>} />
          <Route path="/buses/idle-hours" element={<Dashboard><IdleHours /></Dashboard>} />
          <Route path="/buses/parked-hours" element={<Dashboard><ParkedHours /></Dashboard>} />
          <Route path="/buses/overspeed" element={<Dashboard><OverspeedReport /></Dashboard>} />
          <Route path="/buses/secondary-engine" element={<Dashboard><SecondaryEngine /></Dashboard>} />
          <Route path="/buses/ac-report" element={<Dashboard><ACReport /></Dashboard>} />
          <Route path="/buses/geofence" element={<Dashboard><GeofenceReport /></Dashboard>} />
          <Route path="/service/driver-request" element={<Dashboard><ServiceRequest /></Dashboard>} />
          <Route path="/service/scheduled" element={<Dashboard><ServiceRequest /></Dashboard>} />
          <Route path="/fuel/report" element={<Dashboard><FuelReport /></Dashboard>} />
          <Route path="/fuel/consumption" element={<Dashboard><FuelConsumption /></Dashboard>} />
          <Route path="/fuel/fill" element={<Dashboard><FuelFill /></Dashboard>} />
          <Route path="/fuel/theft" element={<Dashboard><FuelTheft /></Dashboard>} />
          <Route path="/breakdown" element={<Dashboard><Breakdown /></Dashboard>} />
          <Route path="/notifications" element={<Dashboard><Notifications /></Dashboard>} />
          <Route path="/profile" element={<Dashboard><Profile /></Dashboard>} />
          <Route path="/settings" element={<Dashboard><Settings /></Dashboard>} />
          <Route path="/performance-details" element={<Dashboard><PerformanceDetails /></Dashboard>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
