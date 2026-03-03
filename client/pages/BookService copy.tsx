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
  Home,
  Navigation,
  Gift,
  Percent,
  Shield,
  Info,
  QrCode,
  Settings
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { api } from "../lib/api";



  export default function BookService() {


    const handleSubmit = async () => {
        try {
            const bookingData = {
                userId: 'test-user-1', // Mock user for now
                serviceType: formData.serviceType,
                date: selectedDate,
                status: 'pending',
                notes: formData.notes,
                estimatedCost: calculateEstimatedCost(),
                address: formData.fullAddress
            };
            
            await api.post('/bookings', bookingData);
            alert('Booking confirmed successfully!');
            window.location.href = '/user-dashboard'; // Redirect
        } catch (error) {
            alert('Failed to create booking');
            console.error(error);
        }
    };

    const renderStepContent = () => {
      // ... (existing switch case, replacing step 6 button action)
      switch (currentStep) {
        // ... cases 1-5 ...
        case 6:
            return (
                <Card className="border-primary/20">
                    {/* ... Existing content ... */}
                    <CardContent className="space-y-6">
                        {/* ... Existing summary ... */}
                        
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button variant="outline" onClick={prevStep}>Back</Button>
                            <Button onClick={handleSubmit} disabled={!formData.acceptTerms} className="bg-green-600 hover:bg-green-700">
                                Confirm Booking
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
         default: return null;
      }
    };

    // ... (rest of the component)

        return (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullAddress">Full Address</Label>
                  <Textarea 
                    id="fullAddress"
                    placeholder="Enter your complete address"
                    value={formData.fullAddress}
                    onChange={(e) => handleInputChange('fullAddress', e.target.value)}
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
                  </div>
                </div>
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
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Date & Time
                </CardTitle>
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
                        onSelect={setSelectedDate}
                        initialFocus
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
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Switch 
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => handleInputChange('isUrgent', checked)}
                  />
                  <Label htmlFor="isUrgent" className="flex items-center flex-1">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                    Emergency/Urgent booking (+₹200)
                  </Label>
                </div>
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
                  <Button variant="outline" className="px-6">
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
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Additional Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea 
                  id="notes"
                  placeholder="Any special notes for the service provider (e.g., 'Bring ladder', 'Pet in house', 'Call before arriving')"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>Upload Photo (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload images to help clarify the issue or requirements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Preferred Provider */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Preferred Provider (Optional)
                </CardTitle>
                <CardDescription>Choose from top-rated professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.preferredProvider} onValueChange={(value) => handleInputChange('preferredProvider', value)}>
                  {topProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={provider.id} id={provider.id} />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{provider.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Label htmlFor={provider.id} className="font-medium">{provider.name}</Label>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {provider.rating} ({provider.reviews} reviews)
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{provider.price}</Badge>
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
              <CardContent className="space-y-3">
                {bundleOffers.map((bundle) => (
                  <div key={bundle.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
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
                      <div>
                        <Label htmlFor={bundle.id} className="font-medium">{bundle.name}</Label>
                        <div className="text-sm text-green-700">
                          Save {bundle.discount}% • ₹{bundle.originalPrice} → ₹{bundle.discountedPrice}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      -{bundle.discount}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Repeat Booking */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Repeat Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="repeatBooking"
                    checked={formData.repeatBooking}
                    onCheckedChange={(checked) => handleInputChange('repeatBooking', checked)}
                  />
                  <Label htmlFor="repeatBooking">Set up recurring service</Label>
                </div>
                {formData.repeatBooking && (
                  <Select value={formData.repeatFrequency} onValueChange={(value) => handleInputChange('repeatFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Payment Process</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Payment will be collected after service completion. The service provider will manually enter the final amount based on work done and send you a payment request.
                  </p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Service completion and quality check
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Provider enters actual amount based on work
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Payment request sent to you
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Secure payment via multiple options
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Estimated Cost Range</h4>
                  <div className="text-2xl font-bold text-primary">₹{calculateEstimatedCost()}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Final amount may vary based on actual work required
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Notification */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Reminder Notification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminderNotification"
                    checked={formData.reminderNotification}
                    onCheckedChange={(checked) => handleInputChange('reminderNotification', checked)}
                  />
                  <Label htmlFor="reminderNotification">Send SMS or app alert before appointment</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Booking Summary
              </CardTitle>
              <CardDescription>Review your booking details before confirmation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{formData.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Task:</span>
                      <span className="font-medium">{formData.specificTask || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate ? format(selectedDate, "PPP") : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{formData.timeSlot || 'Not selected'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Contact & Location</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{formData.name || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile:</span>
                      <span className="font-medium">{formData.mobile || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium">{formData.fullAddress || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pincode:</span>
                      <span className="font-medium">{formData.pincode || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Cost Summary</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Estimated Cost:</span>
                    <span className="text-2xl font-bold text-primary">₹{calculateEstimatedCost()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Payment will be processed after service completion
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I agree to the <a href="#" className="text-primary underline">Terms & Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                </Label>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Service Guarantee</h4>
                    <p className="text-sm text-green-700">100% satisfaction guaranteed with insurance coverage and quality assurance.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.acceptTerms}
              onClick={handleSubmit}
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
