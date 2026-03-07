"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Star,
  Zap,
  Home,
  Wrench,
  Droplet,
  Lightbulb,
  DollarSign,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "../lib/api";

const steps = [
  { id: 1, title: "Location Access", icon: MapPin },
  { id: 2, title: "Select Category", icon: Home },
  { id: 3, title: "Select Service", icon: Wrench },
  { id: 4, title: "Schedule", icon: CalendarIcon },
  { id: 5, title: "Your Details", icon: User },
  { id: 6, title: "Provider Selection", icon: UserCheck },
  { id: 7, title: "Payment", icon: CreditCard }
];

const homeServiceCategories = [
  {
    id: "plumbing",
    name: "Plumbing",
    icon: Droplet,
    description: "Water pipes, taps, and fixtures",
    color: "bg-blue-50 border-blue-200",
    services: [
      { id: "pipe-repair", name: "Pipe Repair", price: "₹500 - ₹2,000", duration: "1-2 hours", description: "Leak detection and pipe repair" },
      { id: "tap-installation", name: "Tap Installation", price: "₹300 - ₹800", duration: "30-45 mins", description: "Install new taps and faucets" },
      { id: "drainage-cleaning", name: "Drainage Cleaning", price: "₹600 - ₹1,500", duration: "1 hour", description: "Clear blocked drains" },
      { id: "water-heater", name: "Water Heater Service", price: "₹800 - ₹2,500", duration: "1-2 hours", description: "Water heater installation and repair" },
      { id: "bathroom-fitting", name: "Bathroom Fitting", price: "₹1,000 - ₹3,000", duration: "2-3 hours", description: "Tub, shower, and fixture installation" },
      { id: "toilet-repair", name: "Toilet Repair", price: "₹400 - ₹1,200", duration: "45 mins", description: "Fix leaking and damaged toilets" }
    ]
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: Lightbulb,
    description: "Wiring, switches, and installations",
    color: "bg-yellow-50 border-yellow-200",
    services: [
      { id: "light-installation", name: "Light Installation", price: "₹300 - ₹1,000", duration: "30-60 mins", description: "Ceiling and wall light fitting" },
      { id: "switch-repair", name: "Switch & Socket Repair", price: "₹200 - ₹600", duration: "30 mins", description: "Fix faulty switches and outlets" },
      { id: "fan-installation", name: "Fan Installation", price: "₹500 - ₹1,500", duration: "45-60 mins", description: "Install ceiling and table fans" },
      { id: "wiring-extension", name: "Wiring Extension", price: "₹800 - ₹2,500", duration: "1-2 hours", description: "New wiring and circuit extension" },
      { id: "electrical-maintenance", name: "Electrical Maintenance", price: "₹600 - ₹1,500", duration: "1 hour", description: "Check wiring and electrical safety" },
      { id: "appliance-connection", name: "Appliance Connection", price: "₹400 - ₹1,200", duration: "45 mins", description: "Connect electrical appliances" }
    ]
  },
  {
    id: "carpentry",
    name: "Carpentry",
    icon: Wrench,
    description: "Furniture and wooden items",
    color: "bg-amber-50 border-amber-200",
    services: [
      { id: "shelf-installation", name: "Shelf Installation", price: "₹400 - ₹1,200", duration: "1 hour", description: "Install wooden and metal shelves" },
      { id: "door-repair", name: "Door Repair", price: "₹500 - ₹1,500", duration: "1-2 hours", description: "Fix doors and hinges" },
      { id: "furniture-assembly", name: "Furniture Assembly", price: "₹600 - ₹2,000", duration: "1-2 hours", description: "Assemble flat-pack furniture" },
      { id: "cabinet-installation", name: "Cabinet Installation", price: "₹1,000 - ₹3,000", duration: "2-3 hours", description: "Install kitchen and bedroom cabinets" },
      { id: "wardrobe-repair", name: "Wardrobe Repair", price: "₹800 - ₹2,500", duration: "1-2 hours", description: "Repair closets and wardrobes" },
      { id: "table-repair", name: "Table/Bed Repair", price: "₹600 - ₹2,000", duration: "1-3 hours", description: "Repair furniture and fixtures" }
    ]
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    icon: Zap,
    description: "Home and deep cleaning",
    color: "bg-green-50 border-green-200",
    services: [
      { id: "regular-cleaning", name: "Regular Cleaning", price: "₹500 - ₹1,500", duration: "2-3 hours", description: "Daily/weekly home cleaning" },
      { id: "deep-cleaning", name: "Deep Cleaning", price: "₹2,000 - ₹5,000", duration: "4-6 hours", description: "Comprehensive deep cleaning service" },
      { id: "carpet-cleaning", name: "Carpet Cleaning", price: "₹1,000 - ₹3,000", duration: "2-4 hours", description: "Professional carpet and rug cleaning" },
      { id: "window-cleaning", name: "Window Cleaning", price: "₹400 - ₹1,200", duration: "1-2 hours", description: "Clean windows and glass surfaces" },
      { id: "bathroom-cleaning", name: "Bathroom Cleaning", price: "₹600 - ₹1,500", duration: "1-2 hours", description: "Specialized bathroom sanitation" },
      { id: "kitchen-cleaning", name: "Kitchen Cleaning", price: "₹800 - ₹2,000", duration: "1-3 hours", description: "Deep kitchen cleaning service" }
    ]
  }
];

const timeSlots = [
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

interface Provider {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  responseTime: string;
  price: string;
  features: string[];
  image: string;
}

export default function HomeServices() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [providerConfirmed, setProviderConfirmed] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Fetch services from backend - for now using static data but ready for real API
  const [categoryServices, setCategoryServices] = useState<any[]>([]);

  // Mock providers - in production these would be filtered by location and service
  const providers: Provider[] = [
    {
      id: 1,
      name: "QuickFix Home Services",
      rating: 4.8,
      reviews: 287,
      location: "2.1 km away",
      responseTime: "15 mins",
      price: "Starting ₹500",
      features: ["24/7 Service", "Free Inspection", "Warranty"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "HomePro Services",
      rating: 4.7,
      reviews: 412,
      location: "1.5 km away",
      responseTime: "20 mins",
      price: "Starting ₹400",
      features: ["Trained Staff", "Transparent Pricing", "24/7 Available"],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Expert Home Care",
      rating: 4.9,
      reviews: 589,
      location: "0.9 km away",
      responseTime: "10 mins",
      price: "Starting ₹600",
      features: ["Expert Technicians", "Same-day Service", "Verified Professionals"],
      image: "/placeholder.svg"
    }
  ];

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords);
          // In production, you would convert coordinates to address
          setUserLocation("Brooklyn, NY"); // Mock location
          setLocationPermissionGranted(true);
          setCurrentStep(2);
        },
        (error) => {
          console.error("Location error:", error);
          alert("Could not access your location. Please enter it manually.");
          setLocationPermissionGranted(true);
          setCurrentStep(2);
        }
      );
    } else {
      alert("Geolocation not supported in your browser");
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = homeServiceCategories.find(c => c.id === categoryId);
    if (category) {
      setCategoryServices(category.services);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSelectedServiceDetails = () => {
    return categoryServices.find(service => service.id === selectedService);
  };

  const calculateEstimatedCost = () => {
    const serviceDetails = getSelectedServiceDetails();
    if (!serviceDetails) return 0;
    const basePrice = parseInt(serviceDetails.price.split(" - ")[0].replace("₹", "").replace(",", ""));
    return isUrgent ? basePrice + 500 : basePrice;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const serviceDetails = getSelectedServiceDetails();

      const bookingData = {
        serviceId: selectedService,
        serviceTitle: serviceDetails?.name,
        category: selectedCategory,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        timeSlot: selectedTimeSlot,
        isUrgent: isUrgent,
        location: userLocation,
        fullAddress: customerInfo.address,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        providerId: selectedProviderId,
        estimatedCost: calculateEstimatedCost(),
        notes: ""
      };

      const saved = await api.post<any>('/bookings', bookingData);
      alert("Home Service Booking Confirmed!");
      navigate('/user-dashboard?tab=bookings');
    } catch (error) {
      console.error('Error creating booking', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                    ? "border-green-500 bg-green-100"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>
              <p className="text-xs mt-2 text-center font-medium hidden sm:block">{step.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLocationAccess = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
          <MapPin className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Enable Location Access</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We use your location to show available services in your area and connect you with nearby professionals.
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                ✓ Find nearby service providers<br />
                ✓ Get faster response times<br />
                ✓ See location-specific pricing
              </p>
            </div>

            <Button
              onClick={handleLocationPermission}
              className="w-full h-12 text-base"
              size="lg"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Enable Location Access
            </Button>

            {locationPermissionGranted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">
                  ✓ Location: {userLocation}
                </p>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-4">Or enter your location manually</p>
              <Input
                placeholder="Enter city or area name"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="mb-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          if (userLocation.trim()) {
            setLocationPermissionGranted(true);
            handleNext();
          } else {
            alert("Please enter a location or enable location access");
          }
        }}
        className="w-full"
        size="lg"
      >
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Select Service Category</h2>
        <p className="text-muted-foreground">Choose what service you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeServiceCategories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <Card
              key={category.id}
              className={`transition-all border-2 cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={!selectedCategory}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Select Specific Service</h2>
        <p className="text-muted-foreground">Choose from available services in {selectedCategory}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {categoryServices.map((service) => {
          const isSelected = selectedService === service.id;

          return (
            <Card
              key={service.id}
              className={`transition-all border-2 cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={!selectedService}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderScheduling = () => {
    const serviceDetails = getSelectedServiceDetails();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Schedule Your Service</h2>
          <p className="text-muted-foreground">Choose a date and time that works for you</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selected Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold">{serviceDetails?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{serviceDetails?.description}</p>
              <p className="text-sm font-medium text-blue-600 mt-2">{serviceDetails?.price}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-3 block font-semibold">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="mb-3 block font-semibold">Select Time Slot</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <Checkbox
            checked={isUrgent}
            onCheckedChange={() => setIsUrgent(!isUrgent)}
            id="urgent"
          />
          <Label htmlFor="urgent" className="cursor-pointer flex-1">
            <div className="font-semibold">Add Urgent Service (+₹500)</div>
            <div className="text-xs text-muted-foreground">Get priority booking and faster response</div>
          </Label>
        </div>

        <div className="flex space-x-3">
          <Button onClick={handlePrevious} variant="outline" className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomerInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Details</h2>
        <p className="text-muted-foreground">Help us contact you about your booking</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="address">Service Address *</Label>
            <Input
              id="address"
              placeholder="Enter full service address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.email || !customerInfo.address}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderProviderSelection = () => {
    const serviceDetails = getSelectedServiceDetails();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Select Service Provider</h2>
          <p className="text-muted-foreground">Choose a professional to complete your service</p>
        </div>

        <div className="space-y-4">
          {providers.map((provider) => {
            const isSelected = selectedProviderId === provider.id;

            return (
              <Card
                key={provider.id}
                className={`transition-all border-2 cursor-pointer ${
                  isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedProviderId(provider.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={provider.image} />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{provider.rating}</span>
                              <span className="text-xs text-muted-foreground ml-1">({provider.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              {provider.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {provider.responseTime}
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm font-medium text-primary mt-3">{provider.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm">
              <strong>Estimated total:</strong> ₹{calculateEstimatedCost().toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button onClick={handlePrevious} variant="outline" className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => {
              setProviderConfirmed(true);
              handleNext();
            }}
            className="flex-1"
            disabled={!selectedProviderId}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderPayment = () => {
    const serviceDetails = getSelectedServiceDetails();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Review & Pay</h2>
          <p className="text-muted-foreground">Confirm details and proceed with payment</p>
        </div>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{serviceDetails?.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium capitalize">{selectedCategory}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-medium">
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "N/A"} at {selectedTimeSlot}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{userLocation}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{customerInfo.name}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Service Cost:</span>
                <span className="font-medium">₹{Math.floor(calculateEstimatedCost() * 0.8)}</span>
              </div>
              {isUrgent && (
                <div className="flex justify-between text-orange-600">
                  <span>Urgent Fee:</span>
                  <span className="font-medium">+₹500</span>
                </div>
              )}
              <div className="border-t border-green-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>₹{calculateEstimatedCost().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">Before you confirm:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The service provider will contact you for final confirmation</li>
                <li>You can reschedule up to 2 hours before appointment</li>
                <li>Full refund available if cancelled 4 hours prior</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={handlePrevious} variant="outline" className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            size="lg"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
            <CreditCard className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/user-dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Home Services Booking</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Content */}
        <Card className="border-2">
          <CardContent className="p-8">
            {currentStep === 1 && renderLocationAccess()}
            {currentStep === 2 && renderCategorySelection()}
            {currentStep === 3 && renderServiceSelection()}
            {currentStep === 4 && renderScheduling()}
            {currentStep === 5 && renderCustomerInfo()}
            {currentStep === 6 && renderProviderSelection()}
            {currentStep === 7 && renderPayment()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
