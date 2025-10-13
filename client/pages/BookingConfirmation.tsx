import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Star,
  MessageSquare,
  Shield,
  CreditCard,
  Bell,
  Download,
  Share2,
  Home,
  Navigation2,
  Info,
  AlertCircle,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking') || 'BK' + Date.now().toString().slice(-6);
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [progressValue, setProgressValue] = useState(25);

  // Simulate booking data (in real app, this would come from API)
  const bookingData = {
    id: bookingId,
    service: 'House Deep Cleaning',
    task: 'Deep clean kitchen & bathrooms',
    date: '2024-01-15',
    time: 'Morning (8 AM - 12 PM)',
    estimatedCost: '₹1,000',
    status: 'confirmed',
    customer: {
      name: 'John Doe',
      mobile: '+91 9876543210',
      email: 'john@example.com',
      address: '123 Main Street, Andheri West, Mumbai - 400053'
    },
    provider: {
      name: 'CleanPro Services',
      rating: 4.8,
      reviews: 247,
      mobile: '+91 9876543211',
      estimatedArrival: '8:00 AM'
    }
  };

  const statusSteps = [
    { id: 'confirmed', label: 'Booking Confirmed', progress: 25 },
    { id: 'assigned', label: 'Provider Assigned', progress: 50 },
    { id: 'inprogress', label: 'Service in Progress', progress: 75 },
    { id: 'completed', label: 'Service Completed', progress: 100 }
  ];

  const handleTrackBooking = () => {
    window.location.href = `/booking-dashboard?booking=${bookingId}`;
  };

  const handleContactProvider = () => {
    window.location.href = `tel:${bookingData.provider.mobile}`;
  };

  const handleReschedule = () => {
    window.location.href = `/book-service?reschedule=${bookingId}`;
  };

  const handleShareBooking = () => {
    const text = `My service booking details:\nBooking ID: ${bookingId}\nService: ${bookingData.service}\nDate: ${bookingData.date}\nTime: ${bookingData.time}`;
    if (navigator.share) {
      navigator.share({
        title: 'ServiceFlow Booking',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
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
              <Home className="h-4 w-4 mr-2" />
              Back to All Services
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your service has been successfully booked. We'll notify you with provider details shortly.
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Booking ID: {bookingId}
              </Badge>
            </div>
          </div>

          {/* Booking Status */}
          <Card className="mb-6 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation2 className="h-5 w-5 mr-2" />
                Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progressValue} className="w-full" />
                <div className="flex justify-between text-sm">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className={`text-center ${progressValue >= step.progress ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className="font-medium">{step.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Your booking is confirmed and we're finding the best provider for you
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Details */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{bookingData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Task:</span>
                    <span className="font-medium">{bookingData.task}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Cost:</span>
                    <span className="font-medium text-primary">{bookingData.estimatedCost}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Service Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {bookingData.customer.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Provider Information */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Provider Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStatus === 'confirmed' ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="font-medium mb-2">Finding the Best Provider</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We're matching you with qualified professionals in your area. 
                      You'll receive provider details within 10-15 minutes.
                    </p>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Get Notified
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{bookingData.provider.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{bookingData.provider.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {bookingData.provider.rating} ({bookingData.provider.reviews} reviews)
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{bookingData.provider.mobile}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Expected arrival: {bookingData.provider.estimatedArrival}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Payment After Completion</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      No advance payment required. You will receive a payment request after the service is completed and you're satisfied with the work.
                    </p>
                  </div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Payment Process:</h5>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Service provider completes the work</li>
                    <li>2. You review and approve the service quality</li>
                    <li>3. Provider sends you the final payment request</li>
                    <li>4. Pay securely through the app using multiple payment options</li>
                  </ol>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">100% secure payment with money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" onClick={handleTrackBooking} className="h-auto py-4 flex-col">
                  <Navigation2 className="h-6 w-6 mb-2" />
                  <span className="text-sm">Track Booking</span>
                </Button>
                <Button variant="outline" onClick={handleContactProvider} className="h-auto py-4 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Contact Provider</span>
                </Button>
                <Button variant="outline" onClick={handleReschedule} className="h-auto py-4 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Reschedule</span>
                </Button>
                <Button variant="outline" onClick={handleShareBooking} className="h-auto py-4 flex-col">
                  <Share2 className="h-6 w-6 mb-2" />
                  <span className="text-sm">Share Booking</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>Keep your phone handy - the provider will call you before arriving</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>Please ensure someone is available at the service location during the scheduled time</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>For any changes or cancellations, contact us at least 2 hours in advance</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p>Rate and review your service provider after completion to help others</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" asChild>
              <a href="/user-dashboard">
                <User className="h-4 w-4 mr-2" />
                Go to Dashboard
              </a>
            </Button>
            <Button asChild>
              <a href="/user-dashboard?tab=services">
                <Home className="h-4 w-4 mr-2" />
                Back to All Services
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
