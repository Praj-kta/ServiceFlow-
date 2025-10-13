import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Smartphone,
  Tv,
  Car,
  Home,
  Brain,
  BarChart3,
  Bell,
  Target,
  Wrench,
  Activity,
  Battery,
  Wifi,
  Eye,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Search,
  Plus,
  Minus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Award,
  Lightbulb,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Gauge
} from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";

export default function PredictiveMaintenance() {
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample appliances data
  const appliances = [
    {
      id: "ac",
      name: "Air Conditioner",
      icon: Wind,
      status: "good",
      health: 85,
      nextMaintenance: "45 days",
      lastService: "2 months ago",
      usage: "6 hours/day",
      efficiency: 78,
      issues: [],
      location: "Living Room",
      model: "LG 1.5 Ton Split AC",
      warranty: "Active (2 years left)"
    },
    {
      id: "washing-machine",
      name: "Washing Machine",
      icon: RefreshCw,
      status: "warning",
      health: 65,
      nextMaintenance: "15 days",
      lastService: "4 months ago",
      usage: "2 hours/day",
      efficiency: 60,
      issues: ["Vibration noise", "Water drainage slow"],
      location: "Utility Room",
      model: "Samsung 7kg Front Load",
      warranty: "Expired"
    },
    {
      id: "refrigerator",
      name: "Refrigerator",
      icon: Thermometer,
      status: "critical",
      health: 45,
      nextMaintenance: "5 days",
      lastService: "6 months ago",
      usage: "24 hours/day",
      efficiency: 40,
      issues: ["Temperature fluctuation", "High power consumption", "Compressor noise"],
      location: "Kitchen",
      model: "Whirlpool 245L Double Door",
      warranty: "Active (1 year left)"
    },
    {
      id: "water-heater",
      name: "Water Heater",
      icon: Droplets,
      status: "good",
      health: 90,
      nextMaintenance: "60 days",
      lastService: "1 month ago",
      usage: "2 hours/day",
      efficiency: 85,
      issues: [],
      location: "Bathroom",
      model: "Bajaj 15L Instant Geyser",
      warranty: "Active (3 years left)"
    },
    {
      id: "microwave",
      name: "Microwave Oven",
      icon: Zap,
      status: "good",
      health: 80,
      nextMaintenance: "30 days",
      lastService: "1 month ago",
      usage: "1 hour/day",
      efficiency: 75,
      issues: [],
      location: "Kitchen",
      model: "IFB 20L Convection",
      warranty: "Active (1.5 years left)"
    }
  ];

  const [applianceList, setApplianceList] = useState(appliances);

  // Simulate AI scanning
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    // Simulate updating appliance data after scan
    setTimeout(() => {
      const updatedAppliances = applianceList.map(appliance => ({
        ...appliance,
        health: Math.max(appliance.health + Math.floor(Math.random() * 10 - 5), 0),
        efficiency: Math.max(appliance.efficiency + Math.floor(Math.random() * 10 - 5), 0)
      }));
      setApplianceList(updatedAppliances);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* AI Scan Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                AI Predictive Analysis
              </CardTitle>
              <CardDescription>
                Smart monitoring of all your home appliances and systems
              </CardDescription>
            </div>
            <Button 
              onClick={startAIScan} 
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isScanning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isScanning ? 'Scanning...' : 'Start AI Scan'}
            </Button>
          </div>
        </CardHeader>
        {isScanning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning appliances...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {applianceList.filter(a => a.status === 'good').length}
            </div>
            <div className="text-sm text-muted-foreground">Healthy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-yellow-600">
              {applianceList.filter(a => a.status === 'warning').length}
            </div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold text-red-600">
              {applianceList.filter(a => a.status === 'critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(applianceList.reduce((acc, a) => acc + a.health, 0) / applianceList.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Health</div>
          </CardContent>
        </Card>
      </div>

      {/* Appliances List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Appliances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applianceList.map((appliance) => {
            const IconComponent = appliance.icon;
            return (
              <Card 
                key={appliance.id} 
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${getStatusBg(appliance.status)}`}
                onClick={() => setSelectedAppliance(appliance.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{appliance.name}</h4>
                        <p className="text-sm text-muted-foreground">{appliance.location}</p>
                      </div>
                    </div>
                    <Badge variant={appliance.status === 'good' ? 'default' : 
                                   appliance.status === 'warning' ? 'secondary' : 'destructive'}>
                      {appliance.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Score</span>
                      <span className={`font-medium ${getHealthColor(appliance.health)}`}>
                        {appliance.health}%
                      </span>
                    </div>
                    <Progress value={appliance.health} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Next Service: {appliance.nextMaintenance}</span>
                      <span>Efficiency: {appliance.efficiency}%</span>
                    </div>
                  </div>

                  {appliance.issues.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-red-600 font-medium">Issues Detected:</p>
                      <p className="text-xs text-red-500">{appliance.issues[0]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Maintenance Schedule</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Schedule
        </Button>
      </div>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applianceList
              .sort((a, b) => parseInt(a.nextMaintenance) - parseInt(b.nextMaintenance))
              .map((appliance) => {
                const IconComponent = appliance.icon;
                const isUrgent = parseInt(appliance.nextMaintenance) <= 7;
                return (
                  <div key={appliance.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                    isUrgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${isUrgent ? 'text-red-600' : 'text-gray-600'}`} />
                      <div>
                        <p className="font-medium">{appliance.name}</p>
                        <p className="text-sm text-muted-foreground">{appliance.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                        In {appliance.nextMaintenance}
                      </p>
                      <Button size="sm" variant={isUrgent ? 'destructive' : 'outline'} className="mt-1">
                        Schedule Now
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-800">Refrigerator requires immediate attention</p>
                <p className="text-xs text-blue-700">Temperature issues detected. Schedule service within 5 days to prevent food spoilage.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-800">Washing Machine maintenance due</p>
                <p className="text-xs text-blue-700">Preventive maintenance can reduce noise and improve efficiency.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-800">Potential savings identified</p>
                <p className="text-xs text-blue-700">Regular AC maintenance can save up to ₹3,000 annually on electricity bills.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Performance Analytics</h3>
      
      {/* Energy Efficiency Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Energy Efficiency Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applianceList.map((appliance) => (
              <div key={appliance.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{appliance.name}</span>
                  <span className={getHealthColor(appliance.efficiency)}>{appliance.efficiency}%</span>
                </div>
                <Progress value={appliance.efficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Monthly Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Electricity</span>
                <span className="font-medium">₹2,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maintenance</span>
                <span className="font-medium">₹800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Repairs</span>
                <span className="font-medium">₹300</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹3,550</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Savings Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Preventive Maintenance</span>
                <span className="font-medium text-green-600">+₹1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Energy Optimization</span>
                <span className="font-medium text-green-600">+₹800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Smart Scheduling</span>
                <span className="font-medium text-green-600">+₹400</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-green-600">
                <span>Monthly Savings</span>
                <span>₹2,400</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Predictive Maintenance</h1>
          </div>
          <BackButton href="/ai-features" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Predictive Maintenance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prevent problems before they happen. Our AI monitors your appliances 24/7 and predicts when maintenance is needed.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            {renderSchedule()}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {renderAnalytics()}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Get Started with AI Maintenance
              </h2>
              <p className="text-muted-foreground mb-6">
                Connect your appliances and let our AI start monitoring their health and performance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your Appliances
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
