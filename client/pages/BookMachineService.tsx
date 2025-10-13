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
  Settings,
  Navigation,
  Gift,
  Percent,
  Shield,
  Info,
  QrCode,
  Video,
  Brain,
  RefreshCcw,
  Home,
  Snowflake,
  Wrench,
  Droplets,
  Flame,
  Sparkles,
  Waves,
  Utensils,
  Filter,
  Thermometer,
  Power,
  CircuitBoard,
  Gauge,
  Eye,
  ChevronDown,
  Plus,
  Minus,
  X,
  Copy,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

export default function BookMachineService() {
  const [searchParams] = useSearchParams();
  const presetAppliance = searchParams.get('appliance');
  const serviceId = searchParams.get('service') || '1';
  const serviceName = searchParams.get('name') || 'AC Repair';
  const servicePrice = searchParams.get('price') || '₹600-1500';
  const provider = searchParams.get('provider') || 'TechFix Solutions';

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    // Appliance & Service Selection
    applianceType: presetAppliance || '',
    serviceType: '',
    brandModel: '',
    // Location Details
    fullAddress: '',
    landmark: '',
    pincode: '',
    useGPS: false,
    useSavedAddress: false,
    // Date & Time
    preferredDate: null,
    timeSlot: '',
    isUrgent: false,
    technician_eta: '',
    // Contact Information
    name: '',
    mobile: '',
    email: '',
    alternateContact: '',
    otpVerified: false,
    // Additional Instructions
    notes: '',
    uploadedPhotos: [],
    uploadedVideos: [],
    // Pricing & Payment
    estimatedCost: 0,
    promoCode: '',
    promoApplied: false,
    discountAmount: 0,
    paymentMethod: '',
    paymentType: 'full', // full or advance
    advancePercentage: 30,
    // Optional Add-ons
    preferredTechnician: '',
    repeatBooking: false,
    repeatFrequency: '',
    bundleOffers: [],
    reminderNotification: true,
    warrantyExtension: false,
    smartDiagnosis: false,
    // Terms
    acceptTerms: false,
    bookingId: ''
  });

  const steps = [
    { id: 1, title: "Appliance & Service", icon: Settings },
    { id: 2, title: "Location & Time", icon: MapPin },
    { id: 3, title: "Contact Info", icon: User },
    { id: 4, title: "Additional Details", icon: FileText },
    { id: 5, title: "Pricing & Add-ons", icon: CreditCard },
    { id: 6, title: "Confirmation", icon: CheckCircle }
  ];

  const applianceTypes = [
    { id: 'ac', name: 'Air Conditioner', icon: Snowflake, basePrice: 600 },
    { id: 'washing-machine', name: 'Washing Machine', icon: Waves, basePrice: 400 },
    { id: 'refrigerator', name: 'Refrigerator', icon: Utensils, basePrice: 500 },
    { id: 'water-purifier', name: 'Water Purifier', icon: Filter, basePrice: 300 },
    { id: 'microwave', name: 'Microwave Oven', icon: Utensils, basePrice: 350 }
  ];

  const baseServiceTypes = [
    { id: 'installation', name: 'Installation', price: 0, icon: Wrench },
    { id: 'uninstallation', name: 'Uninstallation', price: -100, icon: Power },
    { id: 'repair', name: 'Repair', price: 200, icon: CircuitBoard },
    { id: 'maintenance', name: 'Annual Maintenance', price: 150, icon: Gauge },
    { id: 'gas-refill', name: 'Gas Refill (AC/Refrigerator)', price: 300, icon: Droplets },
    { id: 'deep-cleaning', name: 'Deep Cleaning', price: 100, icon: Sparkles }
  ];

  useEffect(()=>{ if (presetAppliance) setFormData(prev=>({...prev, applianceType: presetAppliance})); },[presetAppliance]);

  const getServiceTypes = () => {
    if (!presetAppliance) return baseServiceTypes;

    // Custom service options per appliance. For washing-machine we show detailed, user-requested options.
    if (presetAppliance === 'washing-machine') {
      return [
        { id: 'general-maintenance', name: 'General Service & Maintenance', price: 0, icon: Wrench },
        { id: 'electrical-issues', name: 'Electrical & Power Issues', price: 0, icon: CircuitBoard },
        { id: 'water-drainage', name: 'Water Supply & Drainage Problems', price: 0, icon: Droplets },
        { id: 'spin-drum', name: 'Spin & Drum Issues', price: 0, icon: Gauge },
        { id: 'door-lock', name: 'Door & Lock Problems', price: 0, icon: Power },
        { id: 'error-diagnosis', name: 'Error Code Diagnosis', price: 0, icon: Brain },
      ];
    }

    const map: Record<string,string[]> = {
      'ac': ['maintenance','repair','gas-refill'],
      'refrigerator': ['repair','gas-refill','maintenance'],
      'microwave': ['repair','maintenance'],
    };
    const allowed = map[presetAppliance] || [];
    return baseServiceTypes.filter(s => allowed.includes(s.id));
  };

  const timeSlots = [
    { id: 'morning', label: 'Morning (8 AM - 12 PM)', price: 0 },
    { id: 'afternoon', label: 'Afternoon (12 PM - 5 PM)', price: 0 },
    { id: 'evening', label: 'Evening (5 PM - 8 PM)', price: 100 }
  ];

  const topTechnicians = [
    { 
      id: 'tech1', 
      name: 'Rajesh Kumar', 
      rating: 4.9, 
      reviews: 347, 
      experience: '8 years', 
      specialization: 'AC & Refrigeration',
      price: '+₹0',
      availability: 'Available today',
      languages: ['Hindi', 'English']
    },
    { 
      id: 'tech2', 
      name: 'Amit Sharma', 
      rating: 4.8, 
      reviews: 289, 
      experience: '6 years', 
      specialization: 'All Appliances',
      price: '+₹200',
      availability: 'Available tomorrow',
      languages: ['Hindi', 'English', 'Marathi']
    },
    { 
      id: 'tech3', 
      name: 'Suresh Patel', 
      rating: 4.7, 
      reviews: 156, 
      experience: '10 years', 
      specialization: 'Premium Brand Expert',
      price: '+₹300',
      availability: 'Available this week',
      languages: ['English', 'Gujarati']
    }
  ];

  const bundleOffers = [
    { 
      id: 'ac-washing', 
      name: 'AC + Washing Machine Combo', 
      services: ['AC Service', 'Washing Machine Clean'],
      discount: 20, 
      originalPrice: 1400, 
      discountedPrice: 1120,
      savings: 280
    },
    { 
      id: 'fridge-purifier', 
      name: 'Refrigerator + Water Purifier Bundle', 
      services: ['Fridge Deep Clean', 'Water Purifier Service'],
      discount: 15, 
      originalPrice: 1200, 
      discountedPrice: 1020,
      savings: 180
    },
    { 
      id: 'complete-appliance', 
      name: 'Complete Home Appliance Check', 
      services: ['AC', 'Washing Machine', 'Refrigerator', 'Microwave'],
      discount: 25, 
      originalPrice: 2500, 
      discountedPrice: 1875,
      savings: 625
    }
  ];

  const brands = {
    'ac': ['LG', 'Samsung', 'Voltas', 'Godrej', 'Haier', 'Daikin', 'Blue Star', 'Carrier', 'Hitachi', 'Whirlpool'],
    'washing-machine': ['LG', 'Samsung', 'Whirlpool', 'IFB', 'Bosch', 'Godrej', 'Haier', 'Panasonic', 'Onida'],
    'refrigerator': ['LG', 'Samsung', 'Whirlpool', 'Godrej', 'Haier', 'Bosch', 'Panasonic', 'Hitachi', 'Sharp'],
    'water-purifier': ['Aquaguard', 'Kent', 'Pureit', 'Livpure', 'Blue Star', 'Havells', 'LG', 'Tata Swach'],
    'microwave': ['LG', 'Samsung', 'IFB', 'Godrej', 'Whirlpool', 'Panasonic', 'Morphy Richards', 'Bajaj']
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEstimatedCost = () => {
    const selectedAppliance = applianceTypes.find(a => a.id === formData.applianceType);
    const selectedService = getServiceTypes().find(s => s.id === formData.serviceType);
    const selectedTimeSlot = timeSlots.find(t => t.id === formData.timeSlot);
    const selectedTechnician = topTechnicians.find(t => t.id === formData.preferredTechnician);
    
    let baseCost = selectedAppliance?.basePrice || 600;
    baseCost += selectedService?.price || 0;
    baseCost += selectedTimeSlot?.price || 0;
    
    if (formData.isUrgent) baseCost += 300;
    if (selectedTechnician?.price === '+₹200') baseCost += 200;
    if (selectedTechnician?.price === '+₹300') baseCost += 300;
    if (formData.warrantyExtension) baseCost += 500;
    if (formData.smartDiagnosis) baseCost += 200;
    
    // Apply promo discount
    if (formData.promoApplied) {
      baseCost -= formData.discountAmount;
    }
    
    return Math.max(baseCost, 200); // Minimum charge
  };

  const applyPromoCode = () => {
    const promoCodes = {
      'FIRST20': { discount: 20, type: 'percentage', maxDiscount: 500 },
      'SAVE200': { discount: 200, type: 'fixed' },
      'APPLIANCE15': { discount: 15, type: 'percentage', maxDiscount: 300 }
    };
    
    const promo = promoCodes[formData.promoCode as keyof typeof promoCodes];
    if (promo) {
      let discount = 0;
      const currentCost = calculateEstimatedCost();
      
      if (promo.type === 'percentage') {
        discount = Math.min((currentCost * promo.discount) / 100, promo.maxDiscount || currentCost);
      } else {
        discount = Math.min(promo.discount, currentCost - 200);
      }
      
      handleInputChange('promoApplied', true);
      handleInputChange('discountAmount', discount);
    }
  };

  const generateBookingId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MACH${timestamp}${random}`;
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Appliance & Service Selection
                </CardTitle>
                <CardDescription>Choose your appliance type and service needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appliance Type Selection */}
                <div>
                  <Label className="text-base font-medium">Appliance Type</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {/* If an appliance preset exists, show only the selected appliance as a single highlighted tile */}
                    {presetAppliance ? (
                      (() => {
                        const appliance = applianceTypes.find(a => a.id === presetAppliance);
                        if (!appliance) return null;
                        const IconComponent = appliance.icon;
                        return (
                          <div key={appliance.id} className={`p-4 border-2 rounded-xl transition-all ${'border-primary bg-primary/5'}`}>
                            <div className="text-center">
                              <IconComponent className={`h-8 w-8 mx-auto mb-2 text-primary`} />
                              <h4 className="font-medium text-sm">{appliance.name}</h4>
                              <p className="text-xs text-muted-foreground">From ₹{appliance.basePrice}</p>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      applianceTypes.map((appliance) => {
                        const IconComponent = appliance.icon;
                        return (
                          <div
                            key={appliance.id}
                            onClick={() => handleInputChange('applianceType', appliance.id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                              formData.applianceType === appliance.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="text-center">
                              <IconComponent className={`h-8 w-8 mx-auto mb-2 ${
                                formData.applianceType === appliance.id ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                              <h4 className="font-medium text-sm">{appliance.name}</h4>
                              <p className="text-xs text-muted-foreground">From ₹{appliance.basePrice}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Service Type Selection */}
                {formData.applianceType && (
                  <div>
                    <Label className="text-base font-medium">Service Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {getServiceTypes().map((service) => {
                        const IconComponent = service.icon;
                        return (
                          <div
                            key={service.id}
                            onClick={() => handleInputChange('serviceType', service.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                              formData.serviceType === service.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <IconComponent className={`h-5 w-5 ${
                                  formData.serviceType === service.id ? 'text-primary' : 'text-muted-foreground'
                                }`} />
                                <span className="font-medium">{service.name}</span>
                              </div>
                              {service.price !== 0 && (
                                <Badge variant="outline" className={service.price > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {service.price > 0 ? '+' : ''}₹{service.price}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Brand & Model Selection */}
                {formData.applianceType && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand (Optional)</Label>
                      <Select onValueChange={(value) => handleInputChange('brandModel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands[formData.applianceType as keyof typeof brands]?.map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="model">Model Number (Optional)</Label>
                      <Input 
                        id="model"
                        placeholder="e.g., LG123ABC or Samsung456XYZ"
                        onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Selected Service Summary */}
                {formData.applianceType && formData.serviceType && (
                  <div className="bg-brand-50 p-4 rounded-lg border border-brand-200">
                    <h4 className="font-medium text-brand-700 mb-3">Selected Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Appliance:</span>
                        <span className="font-medium">{applianceTypes.find(a => a.id === formData.applianceType)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{getServiceTypes().find(s => s.id === formData.serviceType)?.name}</span>
                      </div>
                      {formData.brandModel && (
                        <div className="flex justify-between">
                          <span>Brand:</span>
                          <span className="font-medium">{formData.brandModel}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-brand-300 pt-2 mt-2">
                        <span className="font-medium">Estimated Price:</span>
                        <span className="font-bold text-primary">₹{calculateEstimatedCost()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Details
                </CardTitle>
                <CardDescription>Provide your address for service location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullAddress">Full Address with Landmark</Label>
                  <Textarea 
                    id="fullAddress"
                    placeholder="Enter your complete address with nearby landmark for easy navigation"
                    value={formData.fullAddress}
                    onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input 
                      id="landmark"
                      placeholder="Nearby landmark"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                      id="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                    {formData.pincode && (
                      <p className="text-xs text-green-600 mt-1">✓ Service available in this area</p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useGPS"
                      checked={formData.useGPS}
                      onCheckedChange={(checked) => handleInputChange('useGPS', checked)}
                    />
                    <Label htmlFor="useGPS" className="flex items-center">
                      <Navigation className="h-4 w-4 mr-2" />
                      Use current GPS location
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useSavedAddress"
                      checked={formData.useSavedAddress}
                      onCheckedChange={(checked) => handleInputChange('useSavedAddress', checked)}
                    />
                    <Label htmlFor="useSavedAddress" className="flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Use saved address
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Date & Time Preference
                </CardTitle>
                <CardDescription>Choose your preferred appointment date and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          handleInputChange('preferredDate', date);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Time Slot</Label>
                  <RadioGroup value={formData.timeSlot} onValueChange={(value) => handleInputChange('timeSlot', value)}>
                    {timeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={slot.id} id={slot.id} />
                          <Label htmlFor={slot.id}>{slot.label}</Label>
                        </div>
                        {slot.price > 0 && (
                          <Badge variant="outline">+₹{slot.price}</Badge>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Switch 
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => handleInputChange('isUrgent', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="isUrgent" className="flex items-center font-medium text-red-800">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                      Need service within 2 hours (Emergency)
                    </Label>
                    <p className="text-xs text-red-600 mt-1">Emergency charges apply (+₹300)</p>
                  </div>
                </div>
                {(selectedDate || formData.isUrgent) && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">Technician ETA</h4>
                        <p className="text-sm text-green-700">
                          {formData.isUrgent ? 'Within 1-2 hours' : 'Estimated arrival: 10:00 AM - 10:30 AM'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
              <CardDescription>Provide your contact details for service coordination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="mobile"
                    placeholder="+91 9876543210"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="px-6"
                    onClick={() => handleInputChange('otpVerified', !formData.otpVerified)}
                  >
                    {formData.otpVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send appointment updates via SMS
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For digital invoice and service updates
                </p>
              </div>
              <div>
                <Label htmlFor="alternateContact">Alternate Contact (Optional)</Label>
                <Input 
                  id="alternateContact"
                  placeholder="+91 9876543210"
                  value={formData.alternateContact}
                  onChange={(e) => handleInputChange('alternateContact', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  In case primary number is unreachable
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Instructions
                </CardTitle>
                <CardDescription>Help technicians prepare better for your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes for Technician</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Describe the issue or special instructions:
• AC installed on balcony - bring ladder
• Washing machine is top-load model
• Fridge not cooling, making unusual noise
• Building has parking restrictions"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label>Upload Photos/Videos (Optional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {/* Photo Upload */}
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="space-y-3">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Upload Photos</h4>
                          <p className="text-sm text-muted-foreground">
                            Take photos of the appliance or issue
                          </p>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="space-y-3">
                        <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Upload Video</h4>
                          <p className="text-sm text-muted-foreground">
                            Record video for complex problems
                          </p>
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Record Video
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Images and videos help technicians bring the right tools and parts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Preferred Technician */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Preferred Technician (Optional)
                </CardTitle>
                <CardDescription>Choose from top-rated experts with appliance-specific experience</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.preferredTechnician} onValueChange={(value) => handleInputChange('preferredTechnician', value)}>
                  {topTechnicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={tech.id} id={tech.id} />
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Label htmlFor={tech.id} className="font-medium">{tech.name}</Label>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {tech.rating} ({tech.reviews} reviews)
                            </div>
                            <span>{tech.experience}</span>
                            <span className="text-green-600">{tech.availability}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{tech.specialization}</Badge>
                            <div className="flex space-x-1">
                              {tech.languages.map((lang) => (
                                <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{tech.price}</Badge>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Bundle Offers */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Bundle Offers
                </CardTitle>
                <CardDescription>Add multiple services at a discount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bundleOffers.map((bundle) => (
                  <div key={bundle.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={bundle.id}
                          checked={formData.bundleOffers.includes(bundle.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked 
                              ? [...formData.bundleOffers, bundle.id]
                              : formData.bundleOffers.filter(id => id !== bundle.id);
                            handleInputChange('bundleOffers', updated);
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={bundle.id} className="font-medium text-green-800">{bundle.name}</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {bundle.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-green-700">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-1">
                          Save ₹{bundle.savings}
                        </Badge>
                        <div className="text-sm">
                          <span className="line-through text-muted-foreground">₹{bundle.originalPrice}</span>
                          <span className="font-bold text-green-700 ml-2">₹{bundle.discountedPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Add-ons */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Additional Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Repeat Booking */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="repeatBooking"
                      checked={formData.repeatBooking}
                      onCheckedChange={(checked) => handleInputChange('repeatBooking', checked)}
                    />
                    <div>
                      <Label htmlFor="repeatBooking" className="font-medium">Repeat Booking</Label>
                      <p className="text-sm text-muted-foreground">Set monthly AC cleaning or quarterly maintenance</p>
                    </div>
                  </div>
                  <Badge variant="outline">Save 15%</Badge>
                </div>
                {formData.repeatBooking && (
                  <div className="ml-8">
                    <Select value={formData.repeatFrequency} onValueChange={(value) => handleInputChange('repeatFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Warranty Extension */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="warrantyExtension"
                      checked={formData.warrantyExtension}
                      onCheckedChange={(checked) => handleInputChange('warrantyExtension', checked)}
                    />
                    <div>
                      <Label htmlFor="warrantyExtension" className="font-medium">Warranty Extension</Label>
                      <p className="text-sm text-muted-foreground">6-month post-service coverage</p>
                    </div>
                  </div>
                  <Badge variant="outline">+₹500</Badge>
                </div>

                {/* Smart Diagnosis */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="smartDiagnosis"
                      checked={formData.smartDiagnosis}
                      onCheckedChange={(checked) => handleInputChange('smartDiagnosis', checked)}
                    />
                    <div>
                      <Label htmlFor="smartDiagnosis" className="font-medium">Smart Diagnosis</Label>
                      <p className="text-sm text-muted-foreground">AI-powered pre-checklist based on photos</p>
                    </div>
                  </div>
                  <Badge variant="outline">+₹200</Badge>
                </div>

                {/* Reminder Notifications */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="reminderNotification"
                      checked={formData.reminderNotification}
                      onCheckedChange={(checked) => handleInputChange('reminderNotification', checked)}
                    />
                    <div>
                      <Label htmlFor="reminderNotification" className="font-medium">Reminder Notifications</Label>
                      <p className="text-sm text-muted-foreground">SMS/app alerts + annual service reminders</p>
                    </div>
                  </div>
                  <Badge variant="outline">Free</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Payment */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pricing & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Breakdown */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Service Cost</span>
                      <span>₹{applianceTypes.find(a => a.id === formData.applianceType)?.basePrice || 600}</span>
                    </div>
                    {formData.serviceType && getServiceTypes().find(s => s.id === formData.serviceType)?.price !== 0 && (
                      <div className="flex justify-between">
                        <span>Service Type</span>
                        <span>₹{getServiceTypes().find(s => s.id === formData.serviceType)?.price}</span>
                      </div>
                    )}
                    {formData.timeSlot === 'evening' && (
                      <div className="flex justify-between">
                        <span>Evening Slot</span>
                        <span>+₹100</span>
                      </div>
                    )}
                    {formData.isUrgent && (
                      <div className="flex justify-between">
                        <span>Emergency Service</span>
                        <span>+₹300</span>
                      </div>
                    )}
                    {formData.warrantyExtension && (
                      <div className="flex justify-between">
                        <span>Warranty Extension</span>
                        <span>+₹500</span>
                      </div>
                    )}
                    {formData.smartDiagnosis && (
                      <div className="flex justify-between">
                        <span>Smart Diagnosis</span>
                        <span>+₹200</span>
                      </div>
                    )}
                    {formData.promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount ({formData.promoCode})</span>
                        <span>-₹{formData.discountAmount}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-xl text-primary">₹{calculateEstimatedCost()}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="promoCode"
                      placeholder="Enter promo code (try: FIRST20, SAVE200)"
                      value={formData.promoCode}
                      onChange={(e) => handleInputChange('promoCode', e.target.value)}
                      className="flex-1"
                      disabled={formData.promoApplied}
                    />
                    <Button 
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={formData.promoApplied || !formData.promoCode}
                    >
                      {formData.promoApplied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <>
                          <Percent className="h-4 w-4 mr-2" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center flex-1">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Cash on Service
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center flex-1">
                          <Smartphone className="h-4 w-4 mr-2" />
                          UPI/Digital Wallet
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="qr" id="qr" />
                        <Label htmlFor="qr" className="flex items-center flex-1">
                          <QrCode className="h-4 w-4 mr-2" />
                          QR Code Payment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center flex-1">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Debit/Credit Card
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* QR Code Display */}
                  {formData.paymentMethod === 'qr' && (
                    <div className="mt-4 p-6 bg-white border-2 border-dashed border-primary/30 rounded-lg text-center">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/20 w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-4">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-sm ${
                                Math.random() > 0.6 ? 'bg-primary' : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium text-primary mb-2">Scan QR Code to Pay</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Scan with GPay, PhonePe, Paytm, or any UPI app
                      </p>
                      <div className="bg-primary/10 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-primary">
                          Amount: ₹{calculateEstimatedCost()}
                        </p>
                        <p className="text-xs text-primary/70">
                          UPI ID: techfix@upi
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          <Smartphone className="h-3 w-3 mr-1" />
                          GPay
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Smartphone className="h-3 w-3 mr-1" />
                          PhonePe
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Smartphone className="h-3 w-3 mr-1" />
                          Paytm
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Type */}
                <div>
                  <Label>Payment Type</Label>
                  <RadioGroup value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full">Full Payment</Label>
                      <Badge variant="outline" className="ml-auto">₹{calculateEstimatedCost()}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="advance" id="advance" />
                      <Label htmlFor="advance">Advance Payment (30%)</Label>
                      <Badge variant="outline" className="ml-auto">₹{Math.round(calculateEstimatedCost() * 0.3)}</Badge>
                    </div>
                  </RadioGroup>
                </div>

                {/* Invoice Preview */}
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Booking Summary & Confirmation
                </CardTitle>
                <CardDescription>Review all details before confirming your booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-primary">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Appliance:</span>
                        <span className="font-medium">{applianceTypes.find(a => a.id === formData.applianceType)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Type:</span>
                        <span className="font-medium">{getServiceTypes().find(s => s.id === formData.serviceType)?.name}</span>
                      </div>
                      {formData.brandModel && (
                        <div className="flex justify-between">
                          <span>Brand:</span>
                          <span className="font-medium">{formData.brandModel}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{selectedDate ? format(selectedDate, "PPP") : 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{timeSlots.find(t => t.id === formData.timeSlot)?.label || 'Not selected'}</span>
                      </div>
                      {formData.isUrgent && (
                        <div className="flex justify-between text-red-600">
                          <span>Priority:</span>
                          <span className="font-medium">Emergency Service</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-primary">Contact & Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{formData.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile:</span>
                        <span className="font-medium flex items-center">
                          {formData.mobile || 'Not provided'}
                          {formData.otpVerified && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{formData.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Address:</span>
                        <span className="font-medium text-right">{formData.fullAddress || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pincode:</span>
                        <span className="font-medium">{formData.pincode || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add-ons Summary */}
                {(formData.preferredTechnician || formData.repeatBooking || formData.bundleOffers.length > 0 || formData.warrantyExtension || formData.smartDiagnosis) && (
                  <div>
                    <h4 className="font-medium mb-3 text-primary">Selected Add-ons</h4>
                    <div className="space-y-2">
                      {formData.preferredTechnician && (
                        <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                          <span className="text-sm">Preferred Technician: {topTechnicians.find(t => t.id === formData.preferredTechnician)?.name}</span>
                          <Badge variant="outline">{topTechnicians.find(t => t.id === formData.preferredTechnician)?.price}</Badge>
                        </div>
                      )}
                      {formData.repeatBooking && (
                        <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                          <span className="text-sm">Repeat Booking: {formData.repeatFrequency}</span>
                          <Badge variant="outline">Save 15%</Badge>
                        </div>
                      )}
                      {formData.bundleOffers.length > 0 && (
                        <div className="p-2 bg-accent/50 rounded">
                          <span className="text-sm font-medium">Bundle Offers:</span>
                          {formData.bundleOffers.map((bundleId) => {
                            const bundle = bundleOffers.find(b => b.id === bundleId);
                            return (
                              <div key={bundleId} className="text-sm ml-2">• {bundle?.name}</div>
                            );
                          })}
                        </div>
                      )}
                      {formData.warrantyExtension && (
                        <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                          <span className="text-sm">Warranty Extension (6 months)</span>
                          <Badge variant="outline">+₹500</Badge>
                        </div>
                      )}
                      {formData.smartDiagnosis && (
                        <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                          <span className="text-sm">Smart AI Diagnosis</span>
                          <Badge variant="outline">+₹200</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 text-primary">Payment Summary</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">₹{calculateEstimatedCost()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Payment method: {formData.paymentMethod || 'Not selected'} • 
                      {formData.paymentType === 'advance' ? ` Advance: ₹${Math.round(calculateEstimatedCost() * 0.3)}` : ' Full payment'}
                    </div>
                    {formData.paymentType === 'advance' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Remaining ₹{calculateEstimatedCost() - Math.round(calculateEstimatedCost() * 0.3)} to be paid after service completion
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                {formData.notes && (
                  <div>
                    <h4 className="font-medium mb-2 text-primary">Special Instructions</h4>
                    <div className="bg-accent/50 p-3 rounded-lg text-sm">
                      {formData.notes}
                    </div>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                    I agree to the <a href="#" className="text-primary underline">Terms & Conditions</a>, 
                    <a href="#" className="text-primary underline"> Privacy Policy</a>, and 
                    <a href="#" className="text-primary underline"> Cancellation Policy</a>. 
                    I understand the warranty terms and safety policies for this service.
                  </Label>
                </div>

                {/* Service Guarantee */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Service Guarantee</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• 100% satisfaction guaranteed with money-back policy</li>
                        <li>• Insurance coverage for any accidental damage</li>
                        <li>• Verified and background-checked technicians</li>
                        <li>• 30-day service warranty on all repairs</li>
                        <li>• 24/7 customer support for any issues</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Booking ID Preview */}
                {formData.acceptTerms && (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-center">
                    <h4 className="font-medium text-primary mb-2">Your Booking ID</h4>
                    <div className="text-2xl font-bold text-primary font-mono">
                      {generateBookingId()}
                    </div>
                    <p className="text-sm text-primary/70 mt-2">
                      Save this ID for tracking and support
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/user-dashboard?tab=services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Services
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
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
        <div className="max-w-5xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="max-w-5xl mx-auto mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.applianceType || !formData.serviceType)) ||
                (currentStep === 2 && (!formData.fullAddress || !formData.pincode || !selectedDate || !formData.timeSlot)) ||
                (currentStep === 3 && (!formData.name || !formData.mobile || !formData.otpVerified)) ||
                (currentStep === 5 && !formData.paymentMethod)
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.acceptTerms}
              onClick={() => {
                const bookingId = generateBookingId();
                handleInputChange('bookingId', bookingId);
                const applianceLabel = applianceTypes.find(a => a.id === formData.applianceType)?.name || 'Appliance';
                const serviceLabel = getServiceTypes().find(s => s.id === formData.serviceType)?.name || 'Service';
                const service = `${applianceLabel} ${serviceLabel}`.trim();
                window.location.href = `/booking-confirmation?booking=${bookingId}&service=${encodeURIComponent(service)}`;
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
