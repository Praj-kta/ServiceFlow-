import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  Brain,
  Target,
  MapPin,
  Clock,
  Star,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  Bookmark,
  Heart,
  Share2,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Lightbulb,
  Shield,
  Crown,
  Gauge,
  FileText,
  Camera,
  Video,
  Briefcase,
  Globe,
  Truck,
  Calculator
} from "lucide-react";
import { useState } from "react";

export default function AISmartMatching() {
  const [currentStep, setCurrentStep] = useState(1);
  const [matchingCriteria, setMatchingCriteria] = useState({
    serviceType: '',
    location: '',
    budget: '',
    urgency: 'normal',
    qualityLevel: 'standard',
    previousProvider: '',
    preferences: []
  });

  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = [
    {
      id: 1,
      name: "Elite Home Services",
      rating: 4.9,
      reviews: 347,
      completedJobs: 1240,
      responseTime: "< 2 hours",
      priceRange: "₹₹₹",
      location: "Bandra, Mumbai",
      distance: "2.5 km",
      specializations: ["Premium Cleaning", "Deep Sanitization", "Post-Construction"],
      certifications: ["ISO 9001", "OSHA Certified", "Green Cleaning"],
      availability: "Available Today",
      profileImage: "/api/placeholder/80/80",
      matchScore: 96,
      strengths: ["Quality", "Reliability", "Experience"],
      weaknesses: ["Price"],
      pricing: {
        transparency: 95,
        competitiveness: 78,
        valueForMoney: 92
      },
      performance: {
        onTime: 98,
        quality: 95,
        communication: 94,
        satisfaction: 96
      },
      languages: ["English", "Hindi", "Marathi"],
      insurance: "₹10 Lakh Coverage",
      backgroundCheck: "Verified",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "QuickFix Solutions",
      rating: 4.7,
      reviews: 523,
      completedJobs: 2150,
      responseTime: "< 1 hour",
      priceRange: "₹₹",
      location: "Andheri, Mumbai",
      distance: "4.2 km",
      specializations: ["Emergency Repair", "24/7 Service", "Quick Response"],
      certifications: ["Licensed", "Insured", "Emergency Response"],
      availability: "Available Now",
      profileImage: "/api/placeholder/80/80",
      matchScore: 89,
      strengths: ["Speed", "Availability", "Price"],
      weaknesses: ["Communication"],
      pricing: {
        transparency: 88,
        competitiveness: 92,
        valueForMoney: 89
      },
      performance: {
        onTime: 92,
        quality: 88,
        communication: 82,
        satisfaction: 89
      },
      languages: ["English", "Hindi"],
      insurance: "₹5 Lakh Coverage",
      backgroundCheck: "Verified",
      lastActive: "30 minutes ago"
    },
    {
      id: 3,
      name: "Premium Care Services",
      rating: 4.8,
      reviews: 289,
      completedJobs: 890,
      responseTime: "< 3 hours",
      priceRange: "₹₹₹₹",
      location: "Powai, Mumbai",
      distance: "6.8 km",
      specializations: ["Luxury Homes", "High-End Materials", "Concierge Service"],
      certifications: ["Luxury Service", "Premium Partner", "Executive Class"],
      availability: "Available Tomorrow",
      profileImage: "/api/placeholder/80/80",
      matchScore: 85,
      strengths: ["Luxury Service", "Premium Quality", "Attention to Detail"],
      weaknesses: ["Price", "Availability"],
      pricing: {
        transparency: 92,
        competitiveness: 65,
        valueForMoney: 78
      },
      performance: {
        onTime: 96,
        quality: 98,
        communication: 96,
        satisfaction: 94
      },
      languages: ["English", "Hindi", "Gujarati"],
      insurance: "₹25 Lakh Coverage",
      backgroundCheck: "Premium Verified",
      lastActive: "1 hour ago"
    }
  ];

  const steps = [
    { id: 1, title: "Requirements", icon: Search },
    { id: 2, title: "AI Analysis", icon: Brain },
    { id: 3, title: "Provider Matching", icon: Target },
    { id: 4, title: "Selection", icon: CheckCircle }
  ];

  const startMatching = () => {
    setIsAnalyzing(true);
    setCurrentStep(2);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        locationOptimization: {
          score: 92,
          nearbyProviders: 15,
          averageDistance: "3.2 km",
          trafficFactor: "Low"
        },
        expertiseAnalysis: {
          score: 89,
          specialistProviders: 8,
          expertiseMatch: "High",
          experienceLevel: "Advanced"
        },
        availabilityMatching: {
          score: 94,
          immediateAvailable: 6,
          todayAvailable: 12,
          tomorrowAvailable: 15
        },
        qualityScoring: {
          score: 91,
          topRatedProviders: 9,
          averageRating: 4.7,
          qualityMatch: "Excellent"
        }
      });
      setIsAnalyzing(false);
      setCurrentStep(3);
    }, 3000);
  };

  const renderRequirements = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Service Requirements
          </CardTitle>
          <CardDescription>Tell us what you need for accurate matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={matchingCriteria.serviceType} onValueChange={(value) => setMatchingCriteria({...matchingCriteria, serviceType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house-cleaning">House Deep Cleaning</SelectItem>
                <SelectItem value="plumbing">Emergency Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical Repair</SelectItem>
                <SelectItem value="ac-service">AC Service</SelectItem>
                <SelectItem value="painting">Wall Painting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Your Location</Label>
              <Select value={matchingCriteria.location} onValueChange={(value) => setMatchingCriteria({...matchingCriteria, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bandra">Bandra, Mumbai</SelectItem>
                  <SelectItem value="andheri">Andheri, Mumbai</SelectItem>
                  <SelectItem value="powai">Powai, Mumbai</SelectItem>
                  <SelectItem value="worli">Worli, Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={matchingCriteria.budget} onValueChange={(value) => setMatchingCriteria({...matchingCriteria, budget: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (Under ₹1000)</SelectItem>
                  <SelectItem value="standard">Standard (₹1000-3000)</SelectItem>
                  <SelectItem value="premium">Premium (₹3000-6000)</SelectItem>
                  <SelectItem value="luxury">Luxury (Above ₹6000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={matchingCriteria.urgency} onValueChange={(value) => setMatchingCriteria({...matchingCriteria, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency (Within 2 hours)</SelectItem>
                  <SelectItem value="urgent">Urgent (Today)</SelectItem>
                  <SelectItem value="normal">Normal (Within 3 days)</SelectItem>
                  <SelectItem value="flexible">Flexible (Within a week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Quality Level</Label>
              <Select value={matchingCriteria.qualityLevel} onValueChange={(value) => setMatchingCriteria({...matchingCriteria, qualityLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={startMatching}
            disabled={!matchingCriteria.serviceType || !matchingCriteria.location}
          >
            <Brain className="h-4 w-4 mr-2" />
            Start Smart Matching
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {isAnalyzing ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <Brain className="h-16 w-16 mx-auto text-primary animate-pulse" />
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress</h3>
                <p className="text-muted-foreground">Our AI is analyzing providers based on your requirements</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Analyzing location optimization...</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Evaluating provider expertise...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Checking availability...</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Calculating quality scores...</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Optimization Score</span>
                  <Badge className="bg-green-100 text-green-800">{analysisResults?.locationOptimization.score}%</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Nearby Providers:</span>
                    <span className="font-medium">{analysisResults?.locationOptimization.nearbyProviders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Distance:</span>
                    <span className="font-medium">{analysisResults?.locationOptimization.averageDistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traffic Factor:</span>
                    <span className="font-medium text-green-600">{analysisResults?.locationOptimization.trafficFactor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Expertise Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Provider Expertise Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Expertise Match</span>
                  <Badge className="bg-blue-100 text-blue-800">{analysisResults?.expertiseAnalysis.score}%</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Specialist Providers:</span>
                    <span className="font-medium">{analysisResults?.expertiseAnalysis.specialistProviders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience Level:</span>
                    <span className="font-medium text-blue-600">{analysisResults?.expertiseAnalysis.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expertise Match:</span>
                    <span className="font-medium text-green-600">{analysisResults?.expertiseAnalysis.expertiseMatch}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Matching */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Availability Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Availability Score</span>
                  <Badge className="bg-purple-100 text-purple-800">{analysisResults?.availabilityMatching.score}%</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Available Now:</span>
                    <span className="font-medium">{analysisResults?.availabilityMatching.immediateAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Today:</span>
                    <span className="font-medium">{analysisResults?.availabilityMatching.todayAvailable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Tomorrow:</span>
                    <span className="font-medium">{analysisResults?.availabilityMatching.tomorrowAvailable}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Quality Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Quality Score</span>
                  <Badge className="bg-orange-100 text-orange-800">{analysisResults?.qualityScoring.score}%</Badge>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Top Rated Providers:</span>
                    <span className="font-medium">{analysisResults?.qualityScoring.topRatedProviders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <span className="font-medium">{analysisResults?.qualityScoring.averageRating} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Match:</span>
                    <span className="font-medium text-green-600">{analysisResults?.qualityScoring.qualityMatch}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderProviderMatching = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">AI-Matched Providers</h3>
        <p className="text-muted-foreground">Ranked by compatibility with your requirements</p>
      </div>

      <div className="space-y-4">
        {providers.map((provider, index) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProvider(provider)}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {provider.rating} ({provider.reviews} reviews)
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {provider.location} • {provider.distance}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {provider.responseTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{provider.matchScore}%</div>
                      <div className="text-sm text-muted-foreground">Match Score</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{provider.performance.onTime}%</div>
                      <div className="text-xs text-muted-foreground">On Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{provider.performance.quality}%</div>
                      <div className="text-xs text-muted-foreground">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{provider.performance.communication}%</div>
                      <div className="text-xs text-muted-foreground">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{provider.performance.satisfaction}%</div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {provider.specializations.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={provider.availability === "Available Now" ? "default" : "secondary"}>
                        {provider.availability}
                      </Badge>
                      <Badge variant="outline">{provider.priceRange}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button className="px-8">
          <CheckCircle className="h-4 w-4 mr-2" />
          Select and Book Provider
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderRequirements();
      case 2:
        return renderAnalysis();
      case 3:
        return renderProviderMatching();
      default:
        return renderRequirements();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <Button variant="outline" asChild>
            <a href="/ai-features">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI Features
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Smart Matching</h1>
          <p className="text-muted-foreground">Let AI find the perfect service provider based on your specific needs and preferences</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-muted-foreground bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-20 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
