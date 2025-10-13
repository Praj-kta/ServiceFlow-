import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  Wrench,
  Home,
  Car,
  Palette,
  Brain,
  Calendar,
  CheckCircle,
  User,
  ArrowRight,
  Play,
  Zap,
  Heart,
  ThumbsUp,
  Sparkles,
  Camera,
  Upload,
  Navigation,
  Settings
} from "lucide-react";
import { useState } from "react";

export default function BookingDashboard() {
  const [selectedService, setSelectedService] = useState(null);
  const [activeBooking, setActiveBooking] = useState("plumbing-repair");

  const liveBookings = [
    {
      id: "plumbing-repair",
      service: "Plumbing Repair",
      category: "Home Services",
      provider: "Rajesh Kumar",
      avatar: "/placeholder.svg",
      rating: 4.8,
      status: "in-progress",
      stage: "diagnosing",
      progress: 40,
      eta: "25 min",
      location: "On the way",
      price: "₹850",
      stages: [
        { id: "assigned", name: "Assigned", status: "completed", time: "2 min ago" },
        { id: "traveling", name: "Traveling", status: "completed", time: "Now" },
        { id: "diagnosing", name: "Diagnosing", status: "active", time: "In progress" },
        { id: "repairing", name: "Repairing", status: "pending", time: "Next" },
        { id: "testing", name: "Testing", status: "pending", time: "After repair" },
        { id: "cleanup", name: "Cleanup", status: "pending", time: "Final step" }
      ]
    },
    {
      id: "car-service", 
      service: "Car AC Repair",
      category: "Vehicle Services",
      provider: "AutoCare Pro",
      avatar: "/placeholder.svg",
      rating: 4.9,
      status: "scheduled",
      stage: "scheduled",
      progress: 0,
      eta: "2 hours",
      location: "Scheduled for 3:00 PM",
      price: "₹1,200",
      stages: [
        { id: "scheduled", name: "Scheduled", status: "active", time: "Today 3:00 PM" },
        { id: "inspection", name: "Inspection", status: "pending", time: "15 min" },
        { id: "diagnosis", name: "Diagnosis", status: "pending", time: "30 min" },
        { id: "repair", name: "Repair", status: "pending", time: "1-2 hours" },
        { id: "testing", name: "Testing", status: "pending", time: "15 min" },
        { id: "completion", name: "Completion", status: "pending", time: "Final" }
      ]
    }
  ];

  const serviceCategories = [
    {
      id: "home",
      title: "Home Services",
      icon: Home,
      color: "bg-green-500",
      services: [
        { name: "House Cleaning", price: "₹500-800", duration: "2-3 hours", rating: 4.7 },
        { name: "Plumbing", price: "₹300-1000", duration: "1-2 hours", rating: 4.8 },
        { name: "Electrical Work", price: "₹400-1200", duration: "1-3 hours", rating: 4.6 },
        { name: "Pest Control", price: "₹800-1500", duration: "2-4 hours", rating: 4.5 },
      ]
    },
    {
      id: "machine",
      title: "Machine Services",
      icon: Settings,
      color: "bg-cyan-500",
      services: [
        { name: "AC Repair", price: "₹800-2500", duration: "2-4 hours", rating: 4.8 },
        { name: "Washing Machine", price: "₹400-1500", duration: "1-2 hours", rating: 4.7 },
        { name: "Refrigerator", price: "₹600-2000", duration: "2-3 hours", rating: 4.6 },
        { name: "Microwave Repair", price: "₹300-800", duration: "1 hour", rating: 4.5 },
      ]
    },
    {
      id: "vehicle",
      title: "Vehicle Services",
      icon: Car,
      color: "bg-purple-500",
      services: [
        { name: "Car Wash", price: "₹200-400", duration: "30-60 min", rating: 4.6 },
        { name: "Car AC Repair", price: "₹800-2000", duration: "2-3 hours", rating: 4.7 },
        { name: "Oil Change", price: "₹500-1000", duration: "30-45 min", rating: 4.8 },
        { name: "Roadside Assistance", price: "₹300-800", duration: "15-30 min", rating: 4.9 },
      ]
    },
    {
      id: "design",
      title: "Design & Renovation",
      icon: Palette,
      color: "bg-orange-500", 
      services: [
        { name: "Interior Consultation", price: "₹2000-5000", duration: "1-2 hours", rating: 4.9 },
        { name: "2D Floor Planning", price: "₹1500-3000", duration: "2-3 days", rating: 4.8 },
        { name: "3D Visualization", price: "₹3000-8000", duration: "3-5 days", rating: 4.9 },
        { name: "Vastu Consultation", price: "₹1000-2500", duration: "1-2 hours", rating: 4.7 },
      ]
    },
    {
      id: "ai",
      title: "AI Services",
      icon: Brain,
      color: "bg-indigo-500",
      services: [
        { name: "Vastu Analysis", price: "₹500-1000", duration: "Instant", rating: 4.8 },
        { name: "Design Suggestions", price: "₹300-800", duration: "5-10 min", rating: 4.7 },
        { name: "Smart Predictions", price: "₹200-500", duration: "Instant", rating: 4.6 },
        { name: "Personalized Recs", price: "Free", duration: "Instant", rating: 4.9 },
      ]
    }
  ];

  const currentBooking = liveBookings.find(booking => booking.id === activeBooking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-primary font-medium">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">My Bookings</a>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {(() => { const back = new URLSearchParams(window.location.search).get('back'); if (!back) return null; return (
          <div className="mb-4">
            <Button variant="outline" asChild>
              <a href={`/${back}`}>
                ← Back to {back === 'user-dashboard' ? 'User Dashboard' : 'Provider Dashboard'}
              </a>
            </Button>
          </div>
        ); })()}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Live Tracking Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-primary" />
                Live Service Tracking
              </h2>
              
              {currentBooking && (
                <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={currentBooking.avatar} />
                          <AvatarFallback>{currentBooking.provider[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{currentBooking.service}</CardTitle>
                          <CardDescription className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {currentBooking.provider}
                            <Star className="h-4 w-4 ml-2 mr-1 text-yellow-500" />
                            {currentBooking.rating}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{currentBooking.price}</div>
                        <Badge variant={currentBooking.status === 'in-progress' ? 'default' : 'secondary'}>
                          {currentBooking.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {currentBooking.location}
                        </span>
                        <span className="flex items-center text-primary font-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          ETA: {currentBooking.eta}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{currentBooking.progress}%</span>
                        </div>
                        <Progress value={currentBooking.progress} className="h-2" />
                      </div>

                      {/* LiveFlow Animation Stages */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {currentBooking.stages.map((stage, index) => (
                          <div 
                            key={stage.id} 
                            className={`p-3 rounded-lg border text-center transition-all ${
                              stage.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                              stage.status === 'active' ? 'bg-primary/10 border-primary/30 text-primary animate-pulse' :
                              'bg-muted border-border text-muted-foreground'
                            }`}
                          >
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              stage.status === 'completed' ? 'bg-green-500 text-white' :
                              stage.status === 'active' ? 'bg-primary text-primary-foreground' :
                              'bg-muted-foreground text-white'
                            }`}>
                              {stage.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </div>
                            <div className="text-xs font-medium">{stage.name}</div>
                            <div className="text-xs opacity-70">{stage.time}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { window.location.href = 'tel:+911234567890'; }}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Provider
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { window.location.href = '/ai-service-assistant'; }}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { window.open('https://www.google.com/maps?q=Current+Location', '_blank'); }}>
                          <Navigation className="h-4 w-4 mr-2" />
                          Track Live
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Service Categories with LiveFlow Previews */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-primary" />
                Book New Service
              </h2>
              
              <Tabs defaultValue="home" className="space-y-6">
                <TabsList className="grid grid-cols-5 w-full">
                  {serviceCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden sm:inline">{category.title}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {serviceCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Play className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Service Preview: {service.name}</DialogTitle>
                                    <DialogDescription>
                                      See how this service works with our LiveFlow animation
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg p-6 text-center">
                                    <div className="animate-bounce mb-4">
                                      <Wrench className="h-12 w-12 mx-auto text-primary" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      Interactive service animation would show step-by-step process here
                                    </p>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex justify-between">
                                        <span>Step 1: Assessment</span>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Step 2: Service Execution</span>
                                        <Clock className="h-4 w-4 text-primary animate-spin" />
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Step 3: Quality Check</span>
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {service.duration}
                              </span>
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {service.rating}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-xl font-bold text-primary">{service.price}</div>
                              <Button size="sm" asChild>
                                <a href={
                                  category.id === 'home' ? '/book-service' :
                                  category.id === 'machine' ? '/book-machine-service' :
                                  category.id === 'vehicle' ? '/vehicle-services' :
                                  category.id === 'design' ? '/design-renovation-service' :
                                  '/ai-features'
                                }>
                                  Book Now
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* AI Assistant */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get instant help and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/80 rounded-lg p-3 text-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">Assistant Online</span>
                  </div>
                  <p className="text-muted-foreground">"I can help you with vastu analysis, design suggestions, and service recommendations!"</p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/vastu-detection">
                      <Camera className="h-4 w-4 mr-2" />
                      Vastu Analysis
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/design-generator">
                      <Palette className="h-4 w-4 mr-2" />
                      Design Ideas
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/recommendations">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Smart Recommendations
                    </a>
                  </Button>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                  <a href="/ai-service-assistant">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      activeBooking === booking.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setActiveBooking(booking.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{booking.service}</div>
                      <Badge variant={booking.status === 'in-progress' ? 'default' : 'secondary'} className="text-xs">
                        {booking.status === 'in-progress' ? 'Live' : 'Scheduled'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{booking.provider}</div>
                    <div className="text-xs text-primary font-medium">{booking.price}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gamified Feedback */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Heart className="h-5 w-5 mr-2" />
                  Rate Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="flex justify-center space-x-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-yellow-500 cursor-pointer hover:scale-110 transition-transform" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Help us improve by rating your recent service</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
