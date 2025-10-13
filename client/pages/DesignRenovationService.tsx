import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Upload,
  Camera,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Palette,
  Home,
  Ruler,
  Compass,
  Grid3X3,
  Layers,
  Eye,
  Box,
  Lightbulb,
  Paintbrush,
  Hammer,
  Wrench,
  Package,
  Target,
  Calculator,
  AlertTriangle,
  CheckSquare,
  UserCheck,
  LifeBuoy,
  Sparkles,
  Crown
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import BackButton from "../components/BackButton";

export default function DesignRenovationService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    propertyType: "",
    propertySize: "",
    currentStatus: "",
    budget: ""
  });

  const serviceTypes = [
    {
      id: "interior",
      name: "Interior Design",
      icon: Paintbrush,
      description: "Complete interior design solutions",
      color: "bg-purple-50 border-purple-200",
      services: ["Living Room Design", "Bedroom Design", "Kitchen Design", "Bathroom Design", "Office Design"]
    },
    {
      id: "renovation",
      name: "Home Renovation",
      icon: Hammer,
      description: "Structural changes and renovation",
      color: "bg-blue-50 border-blue-200",
      services: ["Complete Renovation", "Kitchen Renovation", "Bathroom Renovation", "Room Addition", "Structural Changes"]
    },
    {
      id: "architecture",
      name: "Architecture & Planning",
      icon: Grid3X3,
      description: "Architectural design and planning",
      color: "bg-green-50 border-green-200",
      services: ["House Design", "Building Plans", "Structural Design", "Site Planning", "3D Visualization"]
    },
    {
      id: "vastu",
      name: "Vastu Consulting",
      icon: Compass,
      description: "Vastu compliance and consultation",
      color: "bg-orange-50 border-orange-200",
      services: ["Vastu Analysis", "Vastu Correction", "Floor Plan Review", "Direction Consulting", "Energy Optimization"]
    },
    {
      id: "landscape",
      name: "Landscape Design",
      icon: Lightbulb,
      description: "Garden and outdoor space design",
      color: "bg-emerald-50 border-emerald-200",
      services: ["Garden Design", "Terrace Garden", "Outdoor Lighting", "Water Features", "Plant Consulting"]
    }
  ];

  const services = {
    interior: [
      { id: "living", name: "Living Room Design", price: "₹15,000 - ₹50,000", duration: "2-4 weeks", description: "Complete living room interior design" },
      { id: "bedroom", name: "Bedroom Design", price: "₹12,000 - ₹40,000", duration: "1-3 weeks", description: "Master and guest bedroom design" },
      { id: "kitchen", name: "Kitchen Design", price: "₹25,000 - ₹80,000", duration: "3-5 weeks", description: "Modular kitchen design and execution" },
      { id: "bathroom", name: "Bathroom Design", price: "₹8,000 - ₹30,000", duration: "1-2 weeks", description: "Modern bathroom design solutions" },
      { id: "office", name: "Office Design", price: "₹20,000 - ₹60,000", duration: "2-4 weeks", description: "Home office and workspace design" }
    ],
    renovation: [
      { id: "complete", name: "Complete Renovation", price: "₹5,00,000 - ₹20,00,000", duration: "3-6 months", description: "Full house renovation project" },
      { id: "kitchen-reno", name: "Kitchen Renovation", price: "₹80,000 - ₹3,00,000", duration: "3-6 weeks", description: "Complete kitchen makeover" },
      { id: "bathroom-reno", name: "Bathroom Renovation", price: "₹50,000 - ₹2,00,000", duration: "2-4 weeks", description: "Bathroom renovation and upgrade" },
      { id: "room-addition", name: "Room Addition", price: "₹2,00,000 - ₹8,00,000", duration: "2-4 months", description: "Adding new rooms or extensions" },
      { id: "structural", name: "Structural Changes", price: "₹1,00,000 - ₹5,00,000", duration: "1-3 months", description: "Wall modifications and structural work" }
    ],
    architecture: [
      { id: "house-design", name: "House Design", price: "₹50,000 - ₹2,00,000", duration: "4-8 weeks", description: "Complete house architectural design" },
      { id: "building-plans", name: "Building Plans", price: "₹30,000 - ₹1,00,000", duration: "2-4 weeks", description: "Detailed building plans and drawings" },
      { id: "structural-design", name: "Structural Design", price: "₹40,000 - ₹1,50,000", duration: "3-6 weeks", description: "Structural engineering design" },
      { id: "site-planning", name: "Site Planning", price: "₹20,000 - ₹80,000", duration: "2-3 weeks", description: "Site analysis and planning" },
      { id: "3d-viz", name: "3D Visualization", price: "₹15,000 - ₹60,000", duration: "1-2 weeks", description: "3D rendering and walkthrough" }
    ],
    vastu: [
      { id: "analysis", name: "Vastu Analysis", price: "₹5,000 - ₹15,000", duration: "2-3 days", description: "Comprehensive vastu analysis" },
      { id: "correction", name: "Vastu Correction", price: "₹10,000 - ₹30,000", duration: "1-2 weeks", description: "Vastu defects correction solutions" },
      { id: "floor-review", name: "Floor Plan Review", price: "₹3,000 - ₹10,000", duration: "1-2 days", description: "Floor plan vastu compliance check" },
      { id: "direction", name: "Direction Consulting", price: "₹2,000 - ₹8,000", duration: "1 day", description: "Directional guidance and consultation" },
      { id: "energy", name: "Energy Optimization", price: "₹8,000 - ₹25,000", duration: "3-5 days", description: "Energy flow optimization solutions" }
    ],
    landscape: [
      { id: "garden", name: "Garden Design", price: "₹20,000 - ₹1,00,000", duration: "2-4 weeks", description: "Complete garden landscape design" },
      { id: "terrace", name: "Terrace Garden", price: "₹15,000 - ₹60,000", duration: "1-3 weeks", description: "Rooftop and terrace garden design" },
      { id: "lighting", name: "Outdoor Lighting", price: "₹10,000 - ₹40,000", duration: "1-2 weeks", description: "Garden and outdoor lighting design" },
      { id: "water", name: "Water Features", price: "₹25,000 - ₹1,50,000", duration: "2-5 weeks", description: "Fountains, ponds, and water features" },
      { id: "plants", name: "Plant Consulting", price: "₹3,000 - ₹15,000", duration: "1-2 days", description: "Plant selection and care consultation" }
    ]
  };

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM", 
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM"
  ];

  const providers = [
    {
      id: 1,
      name: "DesignCraft Studios",
      rating: 4.9,
      reviews: 234,
      location: "1.2 km away",
      specialization: "Interior Design & Architecture",
      responseTime: "2 hours",
      price: "Starting ₹15,000",
      features: ["3D Visualization", "Vastu Compliant", "Warranty"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Elite Renovation Co",
      rating: 4.7,
      reviews: 186,
      location: "2.5 km away", 
      specialization: "Complete Renovation Specialist",
      responseTime: "4 hours",
      price: "Starting ₹25,000",
      features: ["Complete Solutions", "Licensed Contractors", "Insurance"],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Vastu Design Masters",
      rating: 4.8,
      reviews: 156,
      location: "1.8 km away",
      specialization: "Vastu & Traditional Design",
      responseTime: "1 hour",
      price: "Starting ₹8,000",
      features: ["Vastu Expert", "Traditional Designs", "Consultation"],
      image: "/placeholder.svg"
    }
  ];

  const steps = [
    { id: 1, title: "Service Type", icon: Palette },
    { id: 2, title: "Service Details", icon: FileText },
    { id: 3, title: "Schedule", icon: CalendarIcon },
    { id: 4, title: "Property Info", icon: Home },
    { id: 5, title: "Designer Selection", icon: UserCheck },
    { id: 6, title: "Confirmation", icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSelectedServices = () => {
    if (!selectedServiceType) return [];
    return services[selectedServiceType] || [];
  };

  const getSelectedServiceDetails = () => {
    const serviceList = getSelectedServices();
    return serviceList.find(service => service.id === selectedService);
  };

  const isStepComplete = (step) => {
    switch(step) {
      case 1: return selectedServiceType !== "";
      case 2: return selectedService !== "";
      case 3: return selectedDate !== null;
      case 4: return customerInfo.name && customerInfo.phone && customerInfo.propertyType && customerInfo.address;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const renderServiceTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Service Type</h2>
        <p className="text-muted-foreground">Choose the type of design or renovation service you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                selectedServiceType === type.id 
                  ? 'border-primary bg-primary/5' 
                  : type.color
              }`}
              onClick={() => setSelectedServiceType(type.id)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-sm w-fit mb-2">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Popular Services:</p>
                  {type.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedServiceType && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              {serviceTypes.find(t => t.id === selectedServiceType)?.name} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Specific Service</h2>
        <p className="text-muted-foreground">Select the exact service you need</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {getSelectedServices().map((service) => (
          <Card 
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
              selectedService === service.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {service.price}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedService === service.id 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {selectedService === service.id && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <Switch
          checked={isUrgent}
          onCheckedChange={setIsUrgent}
          id="urgent-service"
        />
        <Label htmlFor="urgent-service" className="flex items-center cursor-pointer">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
          <span className="text-amber-800">Rush service (+30% priority fee)</span>
        </Label>
      </div>
    </div>
  );

  const renderScheduleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Schedule Consultation</h2>
        <p className="text-muted-foreground">Select your preferred date and time for initial consultation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  disabled={index < 2}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{slot}</span>
                    {index < 2 ? (
                      <Badge variant="secondary">Unavailable</Badge>
                    ) : (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPropertyInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Property Information</h2>
        <p className="text-muted-foreground">Tell us about your property and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="property-type">Property Type *</Label>
            <Select 
              value={customerInfo.propertyType}
              onValueChange={(value) => setCustomerInfo({...customerInfo, propertyType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">Independent House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="office">Office Space</SelectItem>
                <SelectItem value="shop">Shop/Showroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="property-size">Property Size</Label>
            <Input
              id="property-size"
              value={customerInfo.propertySize}
              onChange={(e) => setCustomerInfo({...customerInfo, propertySize: e.target.value})}
              placeholder="e.g., 1200 sq ft, 3 BHK"
            />
          </div>
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select 
              value={customerInfo.budget}
              onValueChange={(value) => setCustomerInfo({...customerInfo, budget: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (Under ₹50,000)</SelectItem>
                <SelectItem value="moderate">Moderate (₹50,000 - ₹2,00,000)</SelectItem>
                <SelectItem value="premium">Premium (₹2,00,000 - ₹5,00,000)</SelectItem>
                <SelectItem value="luxury">Luxury (Above ₹5,00,000)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Property Address *</Label>
        <Textarea
          id="address"
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          placeholder="Enter complete property address"
          rows={3}
        />
      </div>
    </div>
  );

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Designer/Contractor</h2>
        <p className="text-muted-foreground">Select from our verified professionals</p>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={provider.image} alt={provider.name} />
                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                    <Badge variant="outline">{provider.price}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">({provider.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Response: {provider.responseTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{provider.specialization}</p>
                      <div className="flex space-x-2">
                        {provider.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button>Select Designer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmation</h2>
        <p className="text-muted-foreground">Review your booking details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{getSelectedServiceDetails()?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property:</span>
              <span className="font-medium">{customerInfo.propertyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{selectedDate ? format(selectedDate, "PP") : "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consultation Fee:</span>
              <span className="font-medium">₹2,000</span>
            </div>
            {isUrgent && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rush Fee:</span>
                <span className="font-medium text-amber-600">₹600</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>₹{isUrgent ? '2,600' : '2,000'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Payment After Completion</h3>
                  <p className="text-sm text-blue-700">
                    No upfront payment required. Pay only after you're satisfied with the consultation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Free cancellation up to 2 hours before appointment
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                100% satisfaction guarantee
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Professional consultation included
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
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Design & Renovation</h1>
          </div>
          <BackButton href="/" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id || isStepComplete(step.id);
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-muted bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-8 ${
                      isCompleted ? 'bg-green-500' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {currentStep === 1 && renderServiceTypeSelection()}
            {currentStep === 2 && renderServiceSelection()}
            {currentStep === 3 && renderScheduleSelection()}
            {currentStep === 4 && renderPropertyInfo()}
            {currentStep === 5 && renderProviderSelection()}
            {currentStep === 6 && renderConfirmation()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="space-x-4">
            {currentStep < 6 ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  const bookingId = 'DR' + Date.now().toString().slice(-6);
                  const serviceDetails = getSelectedServiceDetails();
                  window.location.href = `/booking-confirmation?booking=${bookingId}&service=${encodeURIComponent(serviceDetails?.name || 'Design & Renovation')}&type=design`;
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
