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
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CreditCard,
  Wallet,
  Smartphone,
  DollarSign,
  Star,
  RotateCcw,
  Package,
  Bell,
  CheckCircle,
  AlertCircle,
  Zap,
  Car,
  Navigation,
  Gift,
  Percent,
  Shield,
  Info,
  Wrench,
  Fuel,
  Battery,
  Settings,
  Gauge,
  TrendingUp,
  Calendar as CalIcon,
  MessageCircle,
  HelpCircle,
  Truck,
  Bike,
  Bus,
  Banknote,
  PlayCircle,
  StopCircle,
  RefreshCw,
  AlertTriangle,
  CheckSquare,
  Timer,
  UserCheck,
  Target,
  ThumbsUp,
  Video,
  LifeBuoy
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

export default function VehicleServices() {
  const [searchParams] = useSearchParams();
  const preset = searchParams.get('preset');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
  });
  // Provider selection state
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [providerConfirmed, setProviderConfirmed] = useState(false);

  const vehicleTypes = [
    {
      id: "car",
      name: "Car",
      icon: Car,
      description: "Sedan, SUV, Hatchback, etc.",
      color: "bg-blue-50 border-blue-200",
      services: ["Engine Repair", "Brake Service", "Oil Change", "AC Repair", "Battery Replacement"]
    },
    {
      id: "bike",
      name: "Motorcycle/Bike",
      icon: Bike,
      description: "Motorcycles, Scooters, Bikes",
      color: "bg-green-50 border-green-200",
      services: ["Engine Tune-up", "Chain & Sprocket", "Brake Pads", "Tire Replacement", "Service & Maintenance"]
    },
    {
      id: "truck",
      name: "Truck/Commercial",
      icon: Truck,
      description: "Trucks, Vans, Commercial vehicles",
      color: "bg-orange-50 border-orange-200",
      services: ["Engine Overhaul", "Transmission Repair", "Hydraulic Systems", "Fleet Maintenance", "Heavy Repairs"]
    },
    {
      id: "emergency",
      name: "Roadside Assistance",
      icon: LifeBuoy,
      description: "Emergency towing, breakdown support",
      color: "bg-red-50 border-red-200",
      services: ["Towing Service", "Jump Start", "Flat Tire", "Fuel Delivery", "Lockout Service"]
    }
  ];

  let services = {
    car: [
      { id: "engine", name: "Engine Repair", price: "₹2,500 - ₹15,000", duration: "2-6 hours", description: "Complete engine diagnostics and repair" },
      { id: "brake", name: "Brake Service", price: "₹800 - ₹3,500", duration: "1-2 hours", description: "Brake pads, rotors, and system check" },
      { id: "oil", name: "Oil Change", price: "₹500 - ₹2,000", duration: "30 mins", description: "Engine oil and filter replacement" },
      { id: "ac", name: "AC Repair", price: "₹1,200 - ₹5,000", duration: "1-3 hours", description: "AC system diagnosis and repair" },
      { id: "battery", name: "Battery Replacement", price: "₹3,000 - ₹8,000", duration: "30 mins", description: "Battery testing and replacement" },
      { id: "transmission", name: "Transmission Service", price: "₹2,000 - ₹12,000", duration: "2-4 hours", description: "Gear box and transmission repair" }
    ],
    bike: [
      { id: "tune", name: "Engine Tune-up", price: "₹800 - ₹2,500", duration: "1-2 hours", description: "Complete engine tuning and adjustment" },
      { id: "chain", name: "Chain & Sprocket", price: "₹600 - ₹2,000", duration: "1 hour", description: "Chain lubrication and sprocket check" },
      { id: "brakes", name: "Brake Pads", price: "₹400 - ₹1,500", duration: "45 mins", description: "Brake pad replacement and adjustment" },
      { id: "tire", name: "Tire Replacement", price: "₹1,500 - ₹6,000", duration: "30 mins", description: "Tire replacement and balancing" },
      { id: "service", name: "General Service", price: "₹500 - ₹1,500", duration: "1-2 hours", description: "Complete bike maintenance service" }
    ],
    truck: [
      { id: "overhaul", name: "Engine Overhaul", price: "₹25,000 - ₹80,000", duration: "1-3 days", description: "Complete engine rebuilding" },
      { id: "transmission", name: "Transmission Repair", price: "₹15,000 - ₹50,000", duration: "4-8 hours", description: "Gearbox and transmission work" },
      { id: "hydraulic", name: "Hydraulic Systems", price: "₹5,000 - ₹20,000", duration: "2-4 hours", description: "Hydraulic pump and system repair" },
      { id: "fleet", name: "Fleet Maintenance", price: "₹3,000 - ₹15,000", duration: "1-2 hours", description: "Regular fleet vehicle maintenance" },
      { id: "heavy", name: "Heavy Repairs", price: "₹10,000 - ₹60,000", duration: "4-12 hours", description: "Major mechanical repairs" }
    ],
    emergency: [
      { id: "towing", name: "Towing Service", price: "₹800 - ₹3,000", duration: "30-60 mins", description: "Vehicle towing to service center" },
      { id: "jump", name: "Jump Start", price: "₹300 - ₹800", duration: "15 mins", description: "Battery jump start service" },
      { id: "flat", name: "Flat Tire", price: "₹400 - ₹1,200", duration: "20 mins", description: "Tire change and repair service" },
      { id: "fuel", name: "Fuel Delivery", price: "₹200 - ₹600", duration: "20 mins", description: "Emergency fuel delivery" },
      { id: "lockout", name: "Lockout Service", price: "₹500 - ₹1,500", duration: "15-30 mins", description: "Vehicle unlock service" }
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
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM"
  ];

  const providers = [
    {
      id: 1,
      name: "AutoCare Experts",
      rating: 4.8,
      reviews: 152,
      location: "2.3 km away",
      specialization: "All Vehicle Types",
      responseTime: "15 mins",
      price: "Starting ₹500",
      features: ["24/7 Service", "Free Pickup", "Warranty"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "SpeedFix Garage",
      rating: 4.6,
      reviews: 98,
      location: "1.8 km away", 
      specialization: "Car & Bike Specialist",
      responseTime: "20 mins",
      price: "Starting ₹600",
      features: ["Express Service", "Digital Reports", "Insurance Claims"],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "RoadRescue Services",
      rating: 4.9,
      reviews: 203,
      location: "0.8 km away",
      specialization: "Emergency & Roadside",
      responseTime: "10 mins",
      price: "Starting ₹300",
      features: ["24/7 Emergency", "GPS Tracking", "Quick Response"],
      image: "/placeholder.svg"
    }
  ];

  const steps = [
    { id: 1, title: "Vehicle Type", icon: Car },
    { id: 2, title: "Service Details", icon: Settings },
    { id: 3, title: "Schedule", icon: CalendarIcon },
    { id: 4, title: "Customer Info", icon: User },
    { id: 5, title: "Provider Selection", icon: UserCheck },
    { id: 6, title: "Payment", icon: CreditCard }
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

  useEffect(()=>{
    if (preset === 'car-repair') setSelectedVehicleType('car');
    if (preset === 'bike-service') setSelectedVehicleType('bike');
    if (preset === 'roadside-assistance') setSelectedVehicleType('emergency');
    if (preset === 'towing-service') setSelectedVehicleType('emergency');
    if (preset === 'car-wash-detailing') setSelectedVehicleType('car');
  },[preset]);

  if (preset === 'car-repair') {
    services = {
      ...services,
      car: [
        { id: "engine-diagnostics", name: "Engine diagnostics", price: "₹1,000 - ₹3,000", duration: "1-2 hours", description: "Computerized diagnostic scan" },
        { id: "oil-change", name: "Oil change", price: "₹500 - ₹2,000", duration: "30 mins", description: "Engine oil and filter replacement" },
        { id: "brake-service", name: "Brake service", price: "₹800 - ₹3,500", duration: "1-2 hours", description: "Pads, rotors, brake fluid" },
        { id: "battery-check", name: "Battery check & replacement", price: "₹1,500 - ₹6,000", duration: "30-60 mins", description: "Battery testing and replacement" },
        { id: "transmission-check", name: "Transmission check", price: "₹2,000 - ₹10,000", duration: "1-3 hours", description: "Gearbox inspection" },
        { id: "tire-alignment", name: "Tire rotation & alignment", price: "₹700 - ₹2,000", duration: "45-90 mins", description: "Rotation and wheel alignment" },
        { id: "suspension", name: "Suspension & steering check", price: "₹1,000 - ₹4,000", duration: "1-2 hours", description: "Shocks, struts, tie-rods" },
        { id: "periodic-maintenance", name: "Periodic maintenance / service packages", price: "₹2,000 - ₹8,000", duration: "2-4 hours", description: "OEM recommended service" },
        { id: "cooling", name: "Cooling system inspection", price: "₹800 - ₹2,500", duration: "1-2 hours", description: "Radiator, coolant, hoses" },
        { id: "electrical", name: "Electrical system diagnostics", price: "₹1,000 - ₹4,000", duration: "1-3 hours", description: "Alternator, wiring, fuses" },
      ]
    }
  }

  const getSelectedServices = () => {
    if (!selectedVehicleType) return [];
    return services[selectedVehicleType] || [];
  };

  const getSelectedServiceDetails = () => {
    const serviceList = getSelectedServices();
    return serviceList.find(service => service.id === selectedService);
  };

  const renderVehicleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Vehicle Type</h2>
        <p className="text-muted-foreground">Choose the type of vehicle that needs service</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preset ? (
          (() => {
            const type = vehicleTypes.find(t => {
              if (preset === 'car-repair') return t.id === 'car';
              if (preset === 'bike-service') return t.id === 'bike';
              if (preset === 'roadside-assistance') return t.id === 'emergency';
              if (preset === 'towing-service') return t.id === 'emergency';
              if (preset === 'car-wash-detailing') return t.id === 'car';
              return false;
            });
            if (!type) return null;
            const IconComponent = type.icon;
            // Ensure selectedVehicleType matches preset
            if (selectedVehicleType !== type.id) setSelectedVehicleType(type.id);
            return (
              <Card key={type.id} className={`transition-all border-2 border-primary bg-primary/5`}>
                <CardHeader className="text-center">
                  <div className="mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-sm w-fit mb-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Common Services:</p>
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
          })()
        ) : (
          vehicleTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedVehicleType === type.id
                    ? 'border-primary bg-primary/5'
                    : type.color
                }`}
                onClick={() => setSelectedVehicleType(type.id)}
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
                    <p className="text-sm font-medium text-muted-foreground">Common Services:</p>
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
          })
        )}
      </div>

      {selectedVehicleType && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              {vehicleTypes.find(t => t.id === selectedVehicleType)?.name} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Service Type</h2>
        <p className="text-muted-foreground">Choose the specific service you need</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {preset === 'car-repair' && (
          <div className="p-3 border rounded bg-muted/50 text-sm">
            <div><span className="text-muted-foreground">Brand Type:</span> Multi-brand / All major car brands</div>
          </div>
        )}
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
          <span className="text-amber-800">Mark as urgent service (+₹200 priority fee)</span>
        </Label>
      </div>
    </div>
  );

  const renderScheduleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Schedule Your Service</h2>
        <p className="text-muted-foreground">Select your preferred date and time</p>
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
                  disabled={index < 3} // Simulate some slots being unavailable
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{slot}</span>
                    {index < 3 ? (
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

      {selectedDate && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              Selected: {format(selectedDate, "PPPP")}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Customer Information</h2>
        <p className="text-muted-foreground">Please provide your contact and vehicle details</p>
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
            <Label htmlFor="vehicle-model">Vehicle Model *</Label>
            <Input
              id="vehicle-model"
              value={customerInfo.vehicleModel}
              onChange={(e) => setCustomerInfo({...customerInfo, vehicleModel: e.target.value})}
              placeholder="e.g., Honda City, Royal Enfield Classic"
            />
          </div>
          <div>
            <Label htmlFor="vehicle-year">Manufacturing Year</Label>
            <Select 
              value={customerInfo.vehicleYear}
              onValueChange={(value) => setCustomerInfo({...customerInfo, vehicleYear: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 20}, (_, i) => 2024 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="license-plate">License Plate Number</Label>
            <Input
              id="license-plate"
              value={customerInfo.licensePlate}
              onChange={(e) => setCustomerInfo({...customerInfo, licensePlate: e.target.value})}
              placeholder="e.g., MH 01 AB 1234"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Service Location *</Label>
        <Textarea
          id="address"
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          placeholder="Enter the address where service is needed"
          rows={3}
        />
      </div>
    </div>
  );

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Service Provider</h2>
        <p className="text-muted-foreground">Select from our verified professionals</p>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => {
          const isSelectedProvider = selectedProviderId === provider.id;
          return (
            <Card
              key={provider.id}
              className={`cursor-pointer hover:shadow-lg transition-all border-2 ${isSelectedProvider ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}
              onClick={() => { setSelectedProviderId(provider.id); setProviderConfirmed(false); }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.image} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                      <Badge variant="outline" className="ml-2">{provider.price}</Badge>
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
                        {provider.responseTime}
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
                      <Button onClick={(e) => { e.stopPropagation(); setSelectedProviderId(provider.id); setProviderConfirmed(false); }}>
                        Select Provider
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Selected provider details and confirmation actions */}
        {selectedProviderId && (
          <Card className="border-primary mt-4">
            <CardHeader>
              <CardTitle>Selected Provider</CardTitle>
              <CardDescription>Review provider details and confirm selection</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const provider = providers.find(p => p.id === selectedProviderId);
                if (!provider) return null;
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={provider.image} alt={provider.name} />
                          <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-muted-foreground">{provider.specialization}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="font-semibold">{provider.rating} • {provider.reviews} reviews</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="font-medium">{provider.location}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Availability</div>
                        <div className="font-medium">{(provider as any).availability || "Available today"}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button variant={providerConfirmed ? undefined : "outline"} onClick={() => setProviderConfirmed(!providerConfirmed)}>
                        {providerConfirmed ? 'Marked Selected' : 'Mark as Selected'}
                      </Button>

                      <Button className="bg-primary text-primary-foreground" onClick={() => { setProviderConfirmed(true); setCurrentStep(6); }}>
                        Confirm Provider & Continue
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment & Confirmation</h2>
        <p className="text-muted-foreground">Review your booking and make payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{getSelectedServiceDetails()?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle:</span>
              <span className="font-medium">{customerInfo.vehicleModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{selectedDate ? format(selectedDate, "PP") : "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price:</span>
              <span className="font-medium">₹1,500</span>
            </div>
            {isUrgent && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority Fee:</span>
                <span className="font-medium text-amber-600">₹200</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>₹{isUrgent ? '1,700' : '1,500'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="upi">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center cursor-pointer">
                  <Smartphone className="h-4 w-4 mr-2" />
                  UPI Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet className="h-4 w-4 mr-2" />
                  Digital Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <Banknote className="h-4 w-4 mr-2" />
                  Cash on Service
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">100% Safe & Secure</h3>
              <p className="text-sm text-green-700">Your payment is protected with industry-standard encryption</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const isStepComplete = (step) => {
    switch(step) {
      case 1: return selectedVehicleType !== "";
      case 2: return selectedService !== "";
      case 3: return selectedDate !== null;
      case 4: return customerInfo.name && customerInfo.phone && customerInfo.vehicleModel && customerInfo.address;
      case 5: return providerConfirmed; // Provider selection must be confirmed
      case 6: return true; // Payment
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Vehicle Services</h1>
          </div>
          <Button variant="outline" asChild>
              <a href="/user-dashboard?tab=services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Services
              </a>
            </Button>
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
            {currentStep === 1 && renderVehicleSelection()}
            {currentStep === 2 && renderServiceSelection()}
            {currentStep === 3 && renderScheduleSelection()}
            {currentStep === 4 && renderCustomerInfo()}
            {currentStep === 5 && renderProviderSelection()}
            {currentStep === 6 && renderPayment()}
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
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                const bookingId = 'BK' + Date.now().toString().slice(-6);
                const serviceName = getSelectedServiceDetails()?.name || 'Vehicle Service';
                window.location.href = `/booking-confirmation?booking=${bookingId}&service=${encodeURIComponent(serviceName)}`;
              }}>
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
