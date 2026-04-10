"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Home,
  AlertTriangle,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "../lib/api";

const steps = [
  { id: 1, title: "Location Access", icon: MapPin },
  { id: 2, title: "Select Category", icon: Home },
  { id: 3, title: "Select Service", icon: Clock },
  { id: 4, title: "Schedule", icon: CalendarIcon },
  { id: 5, title: "Your Details", icon: User },
  { id: 6, title: "Provider Selection", icon: UserCheck },
  { id: 7, title: "Payment", icon: CreditCard }
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
  providerId: string;
  serviceId: string;
  name: string;
  companyName: string;
  rating: number;
  reviews: number;
  location: string;
  pincode: string;
  responseTime: string;
  price: string | number;
  features: string[];
  experience: string;
  phone: string;
  image: string;
}

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const toPriceNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

export default function BookService() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login-user';
    }
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);

  const [allServices, setAllServices] = useState<any[]>([]);
  const [categoryServices, setCategoryServices] = useState<ServiceOption[]>([]);
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [providerLoading, setProviderLoading] = useState(false);

  // Error messages for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fieldValidation, setFieldValidation] = useState<Record<string, { isValid: boolean; message: string }>>({});

  // Fetch all services from backend
  useEffect(() => {
    api.get<any[]>('/services')
      .then(data => {
        setAllServices(data);
      })
      .catch(err => console.error('Failed to fetch services', err));
  }, []);

  const buildServiceOptions = (category: string) => {
    const uniqueServices = new Map<string, ServiceOption>();

    allServices.forEach((service) => {
      const serviceCategory = String(service.category || "");
      if (normalizeText(serviceCategory) !== normalizeText(category)) {
        return;
      }

      const serviceAreas = Array.isArray(service.areasCovered) ? service.areasCovered : [];
      const matchesLocation =
        !userLocation ||
        serviceAreas.length === 0 ||
        serviceAreas.some((area: string) => {
          const normalizedArea = normalizeText(area);
          const normalizedLocation = normalizeText(userLocation);
          return (
            normalizedArea.includes(normalizedLocation) ||
            normalizedLocation.includes(normalizedArea)
          );
        });

      if (!matchesLocation) {
        return;
      }

      const key = `${normalizeText(serviceCategory)}::${normalizeText(String(service.title || ""))}`;
      const nextOption: ServiceOption = {
        id: key,
        title: String(service.title || "Untitled service"),
        description: String(service.description || ""),
        category: serviceCategory,
        price: toPriceNumber(service.price),
        rating: Number(service.rating || 0),
      };

      const existingOption = uniqueServices.get(key);
      if (!existingOption || nextOption.rating >= existingOption.rating) {
        uniqueServices.set(key, nextOption);
      }
    });

    return Array.from(uniqueServices.values()).sort((a, b) => a.title.localeCompare(b.title));
  };

  const fetchMatchingProviders = async (serviceOption?: ServiceOption) => {
    const activeService = serviceOption || categoryServices.find((service) => service.id === selectedService);

    if (!activeService || !selectedCategory || !userLocation.trim() || !userPincode.trim()) {
      setAvailableProviders([]);
      return;
    }

    try {
      setProviderLoading(true);
      const params = new URLSearchParams({
        category: selectedCategory,
        serviceTitle: activeService.title,
        location: userLocation.trim(),
        pincode: userPincode.trim(),
      });

      const providers = await api.get<Provider[]>(`/provider/search?${params.toString()}`);
      setAvailableProviders(Array.isArray(providers) ? providers : []);
    } catch (error) {
      console.error("Failed to fetch matching providers", error);
      setAvailableProviders([]);
    } finally {
      setProviderLoading(false);
    }
  };

  // Validation functions
  const validateLocationAccess = () => {
    const newErrors: Record<string, string> = {};
    
    if (!locationPermissionGranted && !userLocation.trim()) {
      newErrors.location = "Enable location access or enter your location manually.";
    }
    
    if (!userLocation.trim()) {
      newErrors.userLocation = "Please enter or enable your location.";
    }

    if (!/^\d{6}$/.test(userPincode.trim())) {
      newErrors.userPincode = "Please enter a valid 6-digit pincode.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCategorySelection = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedCategory) {
      newErrors.category = "Please select a service category.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateServiceSelection = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedService) {
      newErrors.service = "Please select a specific service.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateScheduling = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedDate) {
      newErrors.date = "Please select a date.";
    }
    
    if (!selectedTimeSlot) {
      newErrors.timeSlot = "Please select a time slot.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCustomerInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = "Full name is required.";
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = "Service address is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProviderSelection = () => {
    const newErrors: Record<string, string> = {};
    
    if (!availableProviders.length) {
      newErrors.provider = "No nearby providers are available for this location and pincode.";
    } else if (!selectedProviderId) {
      newErrors.provider = "Please select a service provider.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions to proceed.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time field validation functions
  const validateNameField = (name: string) => {
    if (!name.trim()) {
      return { isValid: false, message: "❌ Name is required. Please enter your full name." };
    } else if (name.trim().length < 3) {
      return { isValid: false, message: "❌ Name must be at least 3 characters. Example: John Doe" };
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, message: "❌ Name should only contain letters and spaces. No numbers or special characters." };
    }
    return { isValid: true, message: "✅ Valid name format" };
  };

  const validatePhoneField = (phone: string) => {
    if (!phone.trim()) {
      return { isValid: false, message: "❌ Phone number is required. Enter 10 digits." };
    } else if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ''))) {
      return { isValid: false, message: "❌ Please enter exactly 10 digits. Example: 9876543210" };
    }
    return { isValid: true, message: "✅ Valid 10-digit phone number" };
  };

  const validateEmailField = (email: string) => {
    if (!email.trim()) {
      return { isValid: false, message: "❌ Email is required. Example: john@example.com" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, message: "❌ Invalid email format. Use: name@domain.com" };
    }
    return { isValid: true, message: "✅ Valid email address" };
  };

  const validateAddressField = (address: string) => {
    if (!address.trim()) {
      return { isValid: false, message: "❌ Address is required. Example: 123 Main St, New York, NY" };
    } else if (address.trim().length < 5) {
      return { isValid: false, message: "❌ Please provide a complete address (at least 5 characters)." };
    }
    return { isValid: true, message: "✅ Valid address format" };
  };

  const handleNameChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, name: value });
    const validation = validateNameField(value);
    setFieldValidation({ ...fieldValidation, name: validation });
    if (errors.name) setErrors({ ...errors, name: '' });
  };

  const handlePhoneChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, phone: value });
    const validation = validatePhoneField(value);
    setFieldValidation({ ...fieldValidation, phone: validation });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const handleEmailChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, email: value });
    const validation = validateEmailField(value);
    setFieldValidation({ ...fieldValidation, email: validation });
    if (errors.email) setErrors({ ...errors, email: '' });
  };

  const handleAddressChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, address: value });
    const validation = validateAddressField(value);
    setFieldValidation({ ...fieldValidation, address: validation });
    if (errors.address) setErrors({ ...errors, address: '' });
  };

  // Mock providers filtered by location and service
  const _legacyProviders = [
    {
      id: 1,
      name: "ServicePro Experts",
      rating: 4.8,
      reviews: 287,
      location: "2.1 km away",
      responseTime: "15 mins",
      price: "Starting ₹400",
      features: ["24/7 Service", "Free Inspection", "Warranty"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Reliable Services",
      rating: 4.7,
      reviews: 412,
      location: "1.5 km away",
      responseTime: "20 mins",
      price: "Starting ₹350",
      features: ["Trained Staff", "Transparent Pricing", "Verified"],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Elite Service Team",
      rating: 4.9,
      reviews: 589,
      location: "0.9 km away",
      responseTime: "10 mins",
      price: "Starting ₹500",
      features: ["Expert Technicians", "Same-day Service", "Premium"],
      image: "/placeholder.svg"
    }
  ];

  const uniqueCategories = Array.from(
    new Set(allServices.map((service) => String(service.category || "").trim()).filter(Boolean)),
  );

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords);
          const { latitude, longitude } = position.coords;
          setLocationCoords({ lat: latitude, lng: longitude });
          setShowLocationDialog(true);
          setErrors({});
        },
        (error) => {
          console.error("Location error:", error);
          setShowLocationDialog(true);
          setErrors({ location: "Could not access your location. Please enter it manually." });
        }
      );
    } else {
      setErrors({ location: "Geolocation is not supported in your browser." });
    }
  };

  const getLocationDetailsFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      const address = data.address || {};
      const locationName = 
        address.city || 
        address.town || 
        address.village || 
        address.county || 
        address.suburb ||
        data.display_name?.split(',')[0] ||
        'Current Location';

      const pincode = address.postcode?.replace(/\D/g, "").slice(0, 6) || "";

      return { locationName, pincode };
    } catch (error) {
      console.error("Geocoding error:", error);
      return { locationName: 'Current Location', pincode: '' };
    }
  };

  const handleConfirmLocation = async () => {
    if (locationCoords) {
      const { locationName, pincode } = await getLocationDetailsFromCoords(locationCoords.lat, locationCoords.lng);
      setUserLocation(locationName);
      if (pincode) {
        setUserPincode(pincode);
      }
      setLocationPermissionGranted(true);
      setShowLocationDialog(false);
      setErrors({});
    }
  };

  const handleCategorySelect = (category: string) => {
    const nextServices = buildServiceOptions(category);
    setSelectedCategory(category);
    setCategoryServices(nextServices);
    setSelectedService("");
    setSelectedProviderId(null);
    setAvailableProviders([]);
    setErrors({});
  };

  const handleNext = () => {
    let isValid = false;
    
    switch(currentStep) {
      case 1:
        isValid = validateLocationAccess();
        break;
      case 2:
        isValid = validateCategorySelection();
        break;
      case 3:
        isValid = validateServiceSelection();
        break;
      case 4:
        isValid = validateScheduling();
        break;
      case 5:
        isValid = validateCustomerInfo();
        break;
      case 6:
        isValid = validateProviderSelection();
        break;
      case 7:
        isValid = validatePayment();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 7) {
      setCurrentStep(currentStep + 1);
      setErrors({});
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

  const selectedProvider = availableProviders.find(
    (provider) => provider.providerId === selectedProviderId,
  );

  useEffect(() => {
    if (currentStep === 6) {
      fetchMatchingProviders();
    }
  }, [currentStep, selectedService, selectedCategory, userLocation, userPincode]);

  const calculateEstimatedCost = () => {
    const basePrice = selectedProvider
      ? toPriceNumber(selectedProvider.price)
      : getSelectedServiceDetails()?.price || 500;
    return isUrgent ? basePrice + 500 : basePrice;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const serviceDetails = getSelectedServiceDetails();
      const activeProvider = selectedProvider;

      if (!serviceDetails || !activeProvider) {
        setErrors({ provider: "Please select a provider before confirming your booking." });
        return;
      }

      const bookingData = {
        serviceId: activeProvider.serviceId,
        serviceTitle: serviceDetails.title,
        category: selectedCategory,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        timeSlot: selectedTimeSlot,
        isUrgent: isUrgent,
        location: userLocation,
        fullAddress: customerInfo.address,
        pincode: userPincode,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        providerId: activeProvider.providerId,
        estimatedCost: calculateEstimatedCost(),
        notes: ""
      };

      const saved = await api.post<any>('/bookings', bookingData);
      navigate(`/booking-confirmation?booking=${saved._id || saved.id}`);
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
          We use your location to show available services nearby and connect you with the closest professionals.
        </p>
      </div>

      {/* Location Permission Dialog */}
      <AlertDialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Allow Location Access?</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locationCoords ? (
                <div className="space-y-3 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">📍 Detected Location:</p>
                    <p className="text-sm text-blue-700 font-semibold">{locationCoords ? 'Loading location name...' : 'Detecting location...'}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    We will use this location to find services and professionals near you. This information helps us provide better and faster service.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-600">
                    ServiceFlow needs your location to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ Find services in your area</li>
                    <li>✓ Show nearby professionals</li>
                    <li>✓ Provide faster response times</li>
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex space-x-3 mt-6">
            <AlertDialogCancel 
              onClick={() => {
                setShowLocationDialog(false);
                setLocationCoords(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLocation}
              disabled={!locationCoords}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Location
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-2">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                ✓ Find services near you<br />
                ✓ Faster response times<br />
                ✓ Better service quality<br />
                ✓ Location-specific pricing
              </p>
            </div>

            <Button
              onClick={handleLocationPermission}
              className="w-full h-12 text-base"
              size="lg"
              disabled={locationPermissionGranted}
            >
              <MapPin className="h-5 w-5 mr-2" />
              {locationPermissionGranted ? 'Location Access Enabled' : 'Enable Location Access'}
            </Button>

            {locationPermissionGranted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-green-700">
                  ✓ Location Permission Granted
                </p>
                <div className="bg-white border border-green-200 rounded p-3">
                  <p className="text-sm font-semibold text-green-800">
                    📍 {userLocation}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-3">Or enter your location manually</p>
              <Input
                placeholder="Enter your city or area"
                value={userLocation}
                onChange={(e) => {
                  setUserLocation(e.target.value);
                  if (e.target.value.trim()) {
                    setLocationPermissionGranted(true);
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.userLocation;
                      return newErrors;
                    });
                  }
                }}
                className={`transition-all ${
                  errors.userLocation ? "bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400" : ""
                }`}
              />
              {errors.userLocation && (
                <p className="text-xs text-red-600 mt-1">{errors.userLocation}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Enter your pincode to find nearby providers
              </p>
              <Input
                placeholder="Enter 6-digit pincode"
                value={userPincode}
                onChange={(e) => {
                  const nextPincode = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setUserPincode(nextPincode);
                  setErrors((prev) => {
                    const nextErrors = { ...prev };
                    delete nextErrors.userPincode;
                    return nextErrors;
                  });
                }}
                inputMode="numeric"
                maxLength={6}
                className={`transition-all ${
                  errors.userPincode ? "bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400" : ""
                }`}
              />
              {errors.userPincode && (
                <p className="text-xs text-red-600 mt-1">{errors.userPincode}</p>
              )}
            </div>

            {errors.location && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">⚠️ {errors.location}</p>
              </div>
            )}

            {userLocation && !locationPermissionGranted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">
                  📍 Location: {userLocation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!locationPermissionGranted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            You must grant location permission or enter your location to continue.
          </p>
        </div>
      )}

      <Button
        onClick={handleNext}
        className="w-full"
        size="lg"
        disabled={!userLocation.trim() || userPincode.trim().length !== 6}
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
        <p className="text-muted-foreground">Choose what service you need in <strong>{userLocation}</strong></p>
      </div>

      {errors.category && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-700">
            ⚠️ {errors.category}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniqueCategories.length > 0 ? (
          uniqueCategories.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryCount = buildServiceOptions(category).length;

            return (
              <Card
                key={category}
                className={`transition-all border-2 cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  handleCategorySelect(category);
                  setErrors({});
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg capitalize">{category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {categoryCount} services available
                      </p>
                    </div>
                    {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-muted-foreground">No categories available. Please check back later.</p>
          </div>
        )}
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

      {errors.service && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-700">
            ⚠️ {errors.service}
          </p>
        </div>
      )}

      {categoryServices.length > 0 ? (
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
                onClick={() => {
                  setSelectedService(service.id);
                  setSelectedProviderId(null);
                  setAvailableProviders([]);
                  setErrors({});
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ₹{service.price}
                        </Badge>
                        {service.rating && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {service.rating}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm text-yellow-700">
            No services available in your location for {selectedCategory}. Please try another category or location.
          </p>
        </div>
      )}

      <div className="flex space-x-3">
        <Button onClick={handlePrevious} variant="outline" className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={!selectedService || categoryServices.length === 0}
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
          <p className="text-muted-foreground">Choose a date and time</p>
        </div>

        {(errors.date || errors.timeSlot) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            {errors.date && <p className="text-sm font-medium text-red-700">⚠️ {errors.date}</p>}
            {errors.timeSlot && <p className="text-sm font-medium text-red-700">⚠️ {errors.timeSlot}</p>}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Selected Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold">{serviceDetails?.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{serviceDetails?.description}</p>
              <p className="text-sm font-medium text-blue-600 mt-2">₹{serviceDetails?.price}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-3 block font-semibold">Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start transition-all ${
                    errors.date ? 'bg-red-50 border-red-300 hover:bg-red-50' : ''
                  }`}
                >
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
            <Label className="mb-3 block font-semibold">Select Time Slot *</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger className={`transition-all ${
                errors.timeSlot ? 'bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400' : ''
              }`}>
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

      {(errors.name || errors.phone || errors.email || errors.address) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          {errors.name && <p className="text-sm font-medium text-red-700">{errors.name}</p>}
          {errors.phone && <p className="text-sm font-medium text-red-700">{errors.phone}</p>}
          {errors.email && <p className="text-sm font-medium text-red-700">{errors.email}</p>}
          {errors.address && <p className="text-sm font-medium text-red-700">{errors.address}</p>}
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Full Name Field */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Full Name *</Label>
              {customerInfo.name && (
                <span className={`text-xs font-medium ${
                  fieldValidation.name?.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {fieldValidation.name?.isValid ? '✓ Valid' : '⚠ Invalid'}
                </span>
              )}
            </div>
            <Input
              id="name"
              placeholder="Enter your full name (e.g., John Doe)"
              value={customerInfo.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`mt-2 transition-all ${
                customerInfo.name && !fieldValidation.name?.isValid
                  ? 'bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400'
                  : customerInfo.name && fieldValidation.name?.isValid
                  ? 'bg-green-50 border-green-300 focus:bg-green-50 focus:border-green-400'
                  : ''
              }`}
            />
            {customerInfo.name && (
              <p className={`text-xs mt-2 font-medium ${
                fieldValidation.name?.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {fieldValidation.name?.message}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="phone">Phone Number *</Label>
              {customerInfo.phone && (
                <span className={`text-xs font-medium ${
                  fieldValidation.phone?.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {fieldValidation.phone?.isValid ? '✓ Valid' : '⚠ Invalid'}
                </span>
              )}
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="10-digit phone number"
              value={customerInfo.phone}
              onChange={(e) => handlePhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`mt-2 transition-all ${
                customerInfo.phone && !fieldValidation.phone?.isValid
                  ? 'bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400'
                  : customerInfo.phone && fieldValidation.phone?.isValid
                  ? 'bg-green-50 border-green-300 focus:bg-green-50 focus:border-green-400'
                  : ''
              }`}
            />
            {customerInfo.phone && (
              <p className={`text-xs mt-2 font-medium ${
                fieldValidation.phone?.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {fieldValidation.phone?.message}
              </p>
            )}
            {!fieldValidation.phone?.isValid && customerInfo.phone && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-700">💡 Enter only 10 digits (no spaces, dashes, or +)</p>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email Address *</Label>
              {customerInfo.email && (
                <span className={`text-xs font-medium ${
                  fieldValidation.email?.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {fieldValidation.email?.isValid ? '✓ Valid' : '⚠ Invalid'}
                </span>
              )}
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={customerInfo.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`mt-2 transition-all ${
                customerInfo.email && !fieldValidation.email?.isValid
                  ? 'bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400'
                  : customerInfo.email && fieldValidation.email?.isValid
                  ? 'bg-green-50 border-green-300 focus:bg-green-50 focus:border-green-400'
                  : ''
              }`}
            />
            {customerInfo.email && (
              <p className={`text-xs mt-2 font-medium ${
                fieldValidation.email?.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {fieldValidation.email?.message}
              </p>
            )}
            {!fieldValidation.email?.isValid && customerInfo.email && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-700">💡 Format: name@domain.com (e.g., john@gmail.com)</p>
              </div>
            )}
          </div>

          {/* Address Field */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Service Address *</Label>
              {customerInfo.address && (
                <span className={`text-xs font-medium ${
                  fieldValidation.address?.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {fieldValidation.address?.isValid ? '✓ Valid' : '⚠ Invalid'}
                </span>
              )}
            </div>
            <Input
              id="address"
              placeholder="Street, City, State, Postal Code"
              value={customerInfo.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              className={`mt-2 transition-all ${
                customerInfo.address && !fieldValidation.address?.isValid
                  ? 'bg-red-50 border-red-300 focus:bg-red-50 focus:border-red-400'
                  : customerInfo.address && fieldValidation.address?.isValid
                  ? 'bg-green-50 border-green-300 focus:bg-green-50 focus:border-green-400'
                  : ''
              }`}
            />
            {customerInfo.address && (
              <p className={`text-xs mt-2 font-medium ${
                fieldValidation.address?.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {fieldValidation.address?.message}
              </p>
            )}
            {!fieldValidation.address?.isValid && customerInfo.address && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-700">💡 Include street name, city, and state for better service</p>
              </div>
            )}
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
          disabled={!fieldValidation.name?.isValid || !fieldValidation.phone?.isValid || !fieldValidation.email?.isValid || !fieldValidation.address?.isValid}
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

        {errors.provider && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-700">⚠️ {errors.provider}</p>
          </div>
        )}

        {providerLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Finding nearby providers for {serviceDetails?.title} in {userLocation} - {userPincode}
            </CardContent>
          </Card>
        ) : availableProviders.length > 0 ? (
          <div className="space-y-4">
            {availableProviders.map((provider) => {
              const isSelected = selectedProviderId === provider.providerId;

              return (
                <Card
                  key={`${provider.providerId}-${provider.serviceId}`}
                  className={`transition-all border-2 cursor-pointer ${
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedProviderId(provider.providerId);
                    if (errors.provider) setErrors({ ...errors, provider: '' });
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={provider.image} />
                        <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.companyName}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="font-medium">{provider.rating.toFixed(1)}</span>
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
                          {provider.experience && (
                            <Badge variant="outline" className="text-xs">
                              {provider.experience} experience
                            </Badge>
                          )}
                          {provider.pincode && (
                            <Badge variant="outline" className="text-xs">
                              Pincode {provider.pincode}
                            </Badge>
                          )}
                          {provider.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm font-medium text-primary mt-3">
                          Starting at Rs {toPriceNumber(provider.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No nearby providers are available for this service in {userLocation} ({userPincode}) right now.
            </CardContent>
          </Card>
        )}

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
            onClick={handleNext}
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

        {errors.terms && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-700">⚠️ {errors.terms}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{serviceDetails?.title}</span>
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
              <span className="font-medium">{userLocation} - {userPincode}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{customerInfo.name}</span>
            </div>
            <div className="flex justify-between py-3 border-t">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium">
                {selectedProvider ? `${selectedProvider.name} (${selectedProvider.companyName})` : "Not selected"}
              </span>
            </div>
          </CardContent>
        </Card>

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

        <div className="flex items-start space-x-3 p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <Checkbox
            id="terms-payment"
            checked={agreeToTerms}
            onCheckedChange={() => {
              setAgreeToTerms(!agreeToTerms);
              if (errors.terms) setErrors({ ...errors, terms: '' });
            }}
          />
          <Label htmlFor="terms-payment" className="cursor-pointer text-sm">
            <div className="font-medium">I confirm this booking and agree to the Terms & Conditions *</div>
            <div className="text-xs text-muted-foreground mt-1">Payment will be processed after service completion. Cancellations are free within 4 hours of booking.</div>
          </Label>
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
            disabled={loading || !agreeToTerms}
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
          <h1 className="text-2xl font-bold text-foreground">Book Services</h1>
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
