
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />
      )}
    </div>
  );
};

export default Index;
