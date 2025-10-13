import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Lightbulb,
  Brain,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  MapPin,
  DollarSign,
  Settings,
  User,
  Home,
  Car,
  Wrench,
  Palette,
  Zap,
  CheckCircle,
  ArrowRight,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Eye,
  Target,
  Award,
  Shield,
  Phone,
  MessageCircle,
  Bell,
  Mail,
  Smartphone,
  CreditCard,
  Gift,
  Percent,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  Building,
  Package,
  Truck,
  Timer,
  AlertCircle,
  Info,
  HelpCircle,
  Search,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  BookOpen,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import BackButton from "../components/BackButton";

export default function PersonalizedRecommendations() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [preferences, setPreferences] = useState({
    budget: "moderate",
    timePreference: "flexible",
    qualityPriority: "high",
    ecoFriendly: true,
    notifications: true,
    autoSchedule: false
  });

  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    location: "Mumbai, Maharashtra",
    propertyType: "3BHK Apartment",
    familySize: 4,
    lifestyle: "Modern Urban",
    priorities: ["Quality", "Reliability", "Eco-Friendly"]
  });

  const recommendations = [
    {
      id: 1,
      type: "service",
      category: "Home Maintenance",
      title: "AC Service & Cleaning",
      description: "Your AC usage increased 40% this month. Preventive maintenance recommended.",
      priority: "high",
      estimatedCost: "₹2,500",
      timeframe: "Within 1 week",
      reason: "Based on usage patterns and seasonal trends",
      provider: "CoolCare Services",
      rating: 4.8,
      discount: "20% off",
      aiConfidence: 92,
      icon: Zap
    },
    {
      id: 2,
      type: "provider",
      category: "Plumbing",
      title: "Premium Plumber Match",
      description: "Highly rated plumber specializing in modern apartments near your location.",
      priority: "medium",
      estimatedCost: "₹1,800",
      timeframe: "Same day available",
      reason: "Matches your quality preferences and location",
      provider: "AquaFix Experts",
      rating: 4.9,
      discount: "Free consultation",
      aiConfidence: 87,
      icon: Wrench
    },
    {
      id: 3,
      type: "schedule",
      category: "Vehicle",
      title: "Car Service Reminder",
      description: "Your car is due for service based on mileage and time since last service.",
      priority: "medium",
      estimatedCost: "₹3,200",
      timeframe: "Next 2 weeks",
      reason: "Predictive maintenance algorithm",
      provider: "AutoCare Plus",
      rating: 4.7,
      discount: "₹500 off",
      aiConfidence: 89,
      icon: Car
    },
    {
      id: 4,
      type: "upgrade",
      category: "Design",
      title: "Smart Home Integration",
      description: "Upgrade to smart lighting and climate control based on your tech preferences.",
      priority: "low",
      estimatedCost: "₹15,000",
      timeframe: "Flexible",
      reason: "Lifestyle analysis and energy savings potential",
      provider: "SmartHome Solutions",
      rating: 4.6,
      discount: "₹2,000 off",
      aiConfidence: 78,
      icon: Home
    }
  ];

  const learningInsights = [
    {
      category: "Service Frequency",
      insight: "You prefer monthly home cleaning services",
      accuracy: 95,
      dataPoints: 12
    },
    {
      category: "Budget Range",
      insight: "₹2,000-₹5,000 per service is your comfort zone",
      accuracy: 88,
      dataPoints: 18
    },
    {
      category: "Provider Type",
      insight: "You prefer certified professionals with 4+ star ratings",
      accuracy: 91,
      dataPoints: 15
    },
    {
      category: "Timing",
      insight: "Weekend morning appointments work best for you",
      accuracy: 82,
      dataPoints: 8
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* AI Learning Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                AI Learning Progress
              </CardTitle>
              <CardDescription>
                How well our AI understands your preferences
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-blue-700">Accuracy</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={87} className="h-2" />
          <div className="flex justify-between text-sm text-blue-700 mt-2">
            <span>Learning from your choices</span>
            <span>53 data points collected</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Today's Recommendations</h3>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((rec) => {
            const IconComponent = rec.icon;
            return (
              <Card key={rec.id} className={`border-2 ${getPriorityColor(rec.priority)} hover:shadow-lg transition-all cursor-pointer`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                        <CardDescription className="text-xs">{rec.category}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 
                                  rec.priority === 'medium' ? 'secondary' : 'default'}>
                      {rec.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-medium">{rec.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-medium">{rec.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="font-medium">{rec.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="outline" className="text-xs">
                      {rec.aiConfidence}% AI Match
                    </Badge>
                    {rec.discount && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        {rec.discount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      Book Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Services Booked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">₹8,450</div>
            <div className="text-sm text-muted-foreground">Money Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Hours Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Personalization Settings</h2>
        <p className="text-muted-foreground">Help AI learn your preferences for better recommendations</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Basic information to personalize recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input value={userProfile.location} />
            </div>
            <div>
              <Label htmlFor="property">Property Type</Label>
              <Select value={userProfile.propertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK Apartment</SelectItem>
                  <SelectItem value="2bhk">2 BHK Apartment</SelectItem>
                  <SelectItem value="3bhk">3 BHK Apartment</SelectItem>
                  <SelectItem value="house">Independent House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preference Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Service Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Budget Range</Label>
            <Select value={preferences.budget} onValueChange={(value) => setPreferences({...preferences, budget: value})}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (Under ₹2,000)</SelectItem>
                <SelectItem value="moderate">Moderate (₹2,000 - ₹5,000)</SelectItem>
                <SelectItem value="premium">Premium (₹5,000 - ₹10,000)</SelectItem>
                <SelectItem value="luxury">Luxury (Above ₹10,000)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Time Flexibility</Label>
            <Select value={preferences.timePreference} onValueChange={(value) => setPreferences({...preferences, timePreference: value})}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Same Day Service</SelectItem>
                <SelectItem value="flexible">Flexible Timing</SelectItem>
                <SelectItem value="planned">Advance Planning</SelectItem>
                <SelectItem value="weekend">Weekend Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="eco-friendly">Eco-Friendly Services</Label>
                <p className="text-sm text-muted-foreground">Prefer environmentally conscious providers</p>
              </div>
              <Switch
                id="eco-friendly"
                checked={preferences.ecoFriendly}
                onCheckedChange={(checked) => setPreferences({...preferences, ecoFriendly: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Smart Notifications</Label>
                <p className="text-sm text-muted-foreground">Get proactive service reminders</p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-schedule">Auto-Schedule</Label>
                <p className="text-sm text-muted-foreground">Automatically book recurring services</p>
              </div>
              <Switch
                id="auto-schedule"
                checked={preferences.autoSchedule}
                onCheckedChange={(checked) => setPreferences({...preferences, autoSchedule: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle>What AI Learned About You</CardTitle>
          <CardDescription>Insights based on your service history and choices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningInsights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{insight.category}</p>
                  <p className="text-sm text-muted-foreground">{insight.insight}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">{insight.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">{insight.dataPoints} data points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Recommendation History</h2>
        <p className="text-muted-foreground">Track how our suggestions have helped you</p>
      </div>

      {/* Success Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "AC Service Recommendation",
            date: "2024-01-10",
            action: "Booked",
            outcome: "Saved ₹800 with early maintenance",
            satisfaction: 5,
            category: "Home"
          },
          {
            title: "Plumber Suggestion",
            date: "2024-01-05",
            action: "Booked",
            outcome: "Fixed leak same day, excellent service",
            satisfaction: 5,
            category: "Emergency"
          },
          {
            title: "Car Service Reminder",
            date: "2023-12-28",
            action: "Booked",
            outcome: "Prevented major engine issue",
            satisfaction: 4,
            category: "Vehicle"
          },
          {
            title: "Interior Design Match",
            date: "2023-12-20",
            action: "Consulted",
            outcome: "Perfect style match, hired for full project",
            satisfaction: 5,
            category: "Design"
          }
        ].map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.outcome}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < item.satisfaction ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
              <Lightbulb className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Personalized Recommendations</h1>
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
            AI-Powered Recommendations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI learns from your preferences and service history to suggest the perfect services, providers, and schedules just for you.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            {renderPreferences()}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {renderHistory()}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Get Better Recommendations
              </h2>
              <p className="text-muted-foreground mb-6">
                The more you use ServiceFlow, the smarter our recommendations become. Book services to help AI learn your preferences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Browse Services
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <Settings className="mr-2 h-5 w-5" />
                  Customize Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
