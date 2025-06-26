import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Users, Bell, Route, Smartphone, Shield, ArrowDown } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: MapPin,
      title: 'GPS-Based Bus Tracking',
      description: 'Real-time location updates of buses on interactive maps using onboard GPS technology.'
    },
    {
      icon: Clock,
      title: 'ETA Calculation',
      description: 'Accurate estimated time of arrival based on current traffic conditions and bus speed.'
    },
    {
      icon: Route,
      title: 'Route Visualization',
      description: 'Interactive maps displaying entire routes, bus stops, and current bus positions.'
    },
    {
      icon: Users,
      title: 'Bus Capacity Updates',
      description: 'Live data on seat availability and passenger count via IoT sensors and user feedback.'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Real-time alerts for delays, route diversions, and bus arrivals to keep you informed.'
    },
    {
      icon: Smartphone,
      title: 'Smart Search & Filter',
      description: 'Find buses based on route number, destination, or nearby stops with ease.'
    }
  ];

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-700 to-teal-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
                  <img 
                    src="/lovable-uploads/1cd3d30b-614f-4053-a2f9-0f3f3716010d.png" 
                    alt="BustraX Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold">BustraX</h1>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Advanced Real-Time Bus Tracking System
              </h2>
              <p className="text-lg lg:text-xl mb-8 text-teal-100">
                Revolutionizing urban commuting with intelligent bus tracking, 
                real-time updates, and enhanced passenger experience for schools and colleges.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-3"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleLearnMore}
                  className="border-white text-orange-500 hover:bg-white hover:text-teal-700 px-8 py-3 flex items-center space-x-2 font-semibold"
                >
                  <span>Learn More</span>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <MapPin className="h-6 w-6" />
                      <span>Live Bus Tracking</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <Clock className="h-6 w-6" />
                      <span>Real-time ETA</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <Users className="h-6 w-6" />
                      <span>Capacity Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the comprehensive features that make BustraX the ultimate 
              solution for modern transportation management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-teal-700" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                About BustraX
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                BustraX addresses the critical challenges faced by public transport users, 
                including unpredictable bus arrival times, lack of real-time updates, and route confusion. 
                Our advanced tracking system significantly enhances commuter convenience, trust, and operational efficiency.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-teal-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Reliable & Secure</h4>
                    <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-teal-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                    <p className="text-gray-600">Live tracking with accurate ETA calculations and traffic updates.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-teal-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">User-Centric Design</h4>
                    <p className="text-gray-600">Intuitive interface designed for students, faculty, and administrators.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-first">
              <div className="bg-gradient-to-br from-teal-100 to-orange-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">50+</div>
                    <div className="text-gray-600">Active Buses</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">98%</div>
                    <div className="text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">24/7</div>
                    <div className="text-gray-600">Monitoring</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-teal-700 mb-2">10K+</div>
                    <div className="text-gray-600">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Transportation System?
          </h3>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of institutions already using BustraX to improve their transportation efficiency.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-3"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
