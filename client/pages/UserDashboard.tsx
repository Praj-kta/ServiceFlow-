import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Home,
  User,
  Calendar,
  Receipt,
  Heart,
  Settings,
  LogOut,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Palette,
  Home as HomeIcon,
  CheckCircle,
  Eye,
  Car
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function UserDashboard() {
  function ContractServicesGrid() {
    const [selected, setSelected] = useState<string | null>(null);
    const items = [
      { key: 'new-home-construction', name: 'New Home Construction', price: 'Base from ₹1,800/sq.ft' },
      { key: 'apartment-project', name: 'Apartment Project', price: 'Base from ₹1,200/sq.ft' },
      { key: 'cafe-interior', name: 'Café Interior Design', price: 'Base from ₹1,200/sq.ft' },
      { key: 'hotel-bar-resort', name: 'Hotel / Bar / Resort Fitout or Construction', price: 'Base from ₹2,000/sq.ft' },
      { key: 'office-interior', name: 'Office Interior Design', price: 'Base from ₹1,200/sq.ft' },
      { key: 'civil-structural', name: 'Civil & Structural Work', price: 'Base from ₹1,500/sq.ft' },
      { key: 'tiles-flooring', name: 'Tiles & Flooring', price: 'Base from ₹70/sq.ft' },
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
            <Card key={s.key} className={`hover:shadow-lg transition-shadow cursor-pointer ${selected===s.key?'ring-2 ring-primary':''}`} onClick={() => setSelected(s.key)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.price}</div>
                  </div>
                  <Badge variant="outline">Select</Badge>
                </div>
                <div className="mt-3">
                  <Button size="sm" className="w-full" onClick={(e)=>{e.stopPropagation(); window.location.href=`/contract-booking?service=${encodeURIComponent(s.key)}&bhk=${encodeURIComponent('2 BHK')}&floors=1&area=1000`}}>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {selected && (
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="font-medium mb-2">Active Selected Service Details</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-muted-foreground">Service Name:</span> <span className="font-medium">{items.find(i=>i.key===selected)?.name}</span></div>
              <div><span className="text-muted-foreground">Sample Provider:</span> <span className="font-medium">Elite Build Co.</span></div>
              <div><span className="text-muted-foreground">Estimated Price:</span> <span className="font-medium">{items.find(i=>i.key===selected)?.price}</span></div>
              <div>
                <Button size="sm" onClick={()=>window.location.href=`/contract-booking?service=${encodeURIComponent(selected)}&bhk=${encodeURIComponent('2 BHK')}&floors=1&area=1000`}>Book Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'overview');

  const recentBookings = [
    { id: 1, service: "House Deep Cleaning", provider: "CleanPro Services", date: "Today 2:00 PM", status: "In Progress", price: "₹1200" },
    { id: 2, service: "AC Repair", provider: "CoolTech Solutions", date: "Yesterday", status: "Completed", price: "₹800" },
    { id: 3, service: "Plumbing Fix", provider: "RapidFix Plumbers", date: "Dec 20, 2024", status: "Completed", price: "₹600" }
  ];

  const favoriteServices = [
    { id: 1, name: "House Deep Cleaning", category: "Cleaning", frequency: "Monthly" },
    { id: 2, name: "AC Maintenance", category: "Appliances", frequency: "Quarterly" },
    { id: 3, name: "Electrical Safety Check", category: "Electrical", frequency: "Biannually" }
  ];

  type Booking = { id: number; service: string; provider: string; date: string; status: string; price: string };

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });

  // Payments & preferences state
  type Transaction = { id: string; amount: number; method: string; date: string; status: string };
  const userTransactions: Transaction[] = [
    { id: 'INV-2401', amount: 950, method: 'UPI (PhonePe)', date: '2024-12-22', status: 'Paid' },
    { id: 'INV-2402', amount: 1800, method: 'Card (Mastercard)', date: '2024-12-24', status: 'Paid' },
    { id: 'INV-2403', amount: 600, method: 'Wallet (Amazon Pay)', date: '2024-12-25', status: 'Pending' },
  ];

  const [addPayOpen, setAddPayOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const [defaultMethod, setDefaultMethod] = useState('upi');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  const [notifSMS, setNotifSMS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const handleFavoriteRebook = (serviceName: string) => {
    navigateTo(`/book-service?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <User className="h-3 w-3 mr-1" />
              User Account
            </Badge>
            <Button variant="outline" size="sm" onClick={() => { window.location.href = '/'; }}>
              Home
            </Button>
            <Button variant="outline" size="sm" onClick={() => { window.location.href = '/'; }}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Manage your bookings and stay on top of every service request</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              All Services
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <Receipt className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount Spent</p>
                      <p className="text-2xl font-bold">₹18,400</p>
                    </div>
                    <Receipt className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Services</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo('/book-service')}>
                <CardContent className="p-6 text-center">
                  <HomeIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Book Home Service</h3>
                  <p className="text-sm text-muted-foreground mb-4">Cleaning, plumbing, electrical & more</p>
                  <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateTo('/book-service'); }}>
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo('/book-machine-service')}>
                <CardContent className="p-6 text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Machine Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">AC, washing machine, refrigerator</p>
                  <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateTo('/book-machine-service'); }}>
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo('/vehicle-services')}>
                <CardContent className="p-6 text-center">
                  <Car className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                  <h3 className="font-semibold mb-2">Vehicle Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">Repair, roadside assistance, towing</p>
                  <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateTo('/vehicle-services'); }}>
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions (Schedule / Analytics) */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your schedule, bookings, and payments instantly</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="outline" onClick={() => setScheduleOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Schedule
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('bookings')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Button>
                <Button variant="outline" onClick={() => navigateTo(`/booking-dashboard?booking=${recentBookings[0]?.id ?? ''}`)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Booking
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('payments')}>
                  <Receipt className="h-4 w-4 mr-2" />
                  View Payments
                </Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.service}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.provider}
                          <Clock className="h-3 w-3 ml-3 mr-1" />
                          {booking.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">{booking.price}</div>
                          <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Services Tab */}
          <TabsContent value="services">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">All Services</h2>
                  <p className="text-muted-foreground">Explore all available services with detailed information</p>
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Search services..." className="w-64" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="home">Home Services</SelectItem>
                      <SelectItem value="machine">Machine Services</SelectItem>
                      <SelectItem value="vehicle">Vehicle Services</SelectItem>
                      <SelectItem value="design">Design & Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Home Services Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HomeIcon className="h-5 w-5 mr-2 text-green-600" />
                    Home Services
                  </CardTitle>
                  <CardDescription>Professional home maintenance and cleaning services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "House Deep Cleaning",
                        description: "Complete home cleaning including kitchen, bathrooms, and all rooms",
                        price: "₹800-1200",
                        duration: "3-4 hours",
                        rating: 4.8,
                        reviews: 247,
                        features: ["Professional cleaning supplies", "Sanitization", "Kitchen deep clean", "Bathroom scrubbing"]
                      },
                      {
                        name: "Emergency Plumbing",
                        description: "24/7 plumbing services for leaks, blockages, and repairs",
                        price: "₹300-800",
                        duration: "1-2 hours",
                        rating: 4.9,
                        reviews: 189,
                        features: ["24/7 availability", "Quick response", "All tools included", "Warranty on work"]
                      },
                      {
                        name: "Electrical Repair",
                        description: "Electrical installations, repairs, and maintenance services",
                        price: "₹250-600",
                        duration: "1-3 hours",
                        rating: 4.7,
                        reviews: 156,
                        features: ["Licensed electricians", "Safety assured", "Quality materials", "Emergency repairs"]
                      },
                      {
                        name: "Pest Control",
                        description: "Complete pest elimination and prevention services",
                        price: "₹500-1000",
                        duration: "2-3 hours",
                        rating: 4.6,
                        reviews: 134,
                        features: ["Eco-friendly chemicals", "Long-lasting treatment", "Multiple visits", "Guarantee included"]
                      },
                      {
                        name: "HVAC Services",
                        description: "Heating, ventilation, and air conditioning services",
                        price: "₹400-1200",
                        duration: "2-4 hours",
                        rating: 4.8,
                        reviews: 98,
                        features: ["Expert technicians", "All brands supported", "Preventive maintenance", "Energy efficiency tips"]
                      },
                      {
                        name: "Gardening & Landscaping",
                        description: "Garden maintenance, plant care, and landscaping services",
                        price: "₹300-800",
                        duration: "2-5 hours",
                        rating: 4.5,
                        reviews: 76,
                        features: ["Plant health care", "Seasonal maintenance", "Design consultation", "Organic methods"]
                      },
                      {
                        name: "Plumbing / Fabrication Work",
                        description: "Pipelines, fittings, and metal fabrication for home and commercial needs",
                        price: "₹500-2000",
                        duration: "1-5 hours",
                        rating: 4.6,
                        reviews: 82,
                        features: ["Emergency support", "Quality materials", "On-site fabrication", "Warranty on work"]
                      },
                      {
                        name: "POP / PVC Ceiling",
                        description: "False ceiling design and installation with POP/PVC materials",
                        price: "₹120-300 per sq.ft",
                        duration: "1-3 days",
                        rating: 4.7,
                        reviews: 91,
                        features: ["Design options", "Quality finish", "Material guidance", "On-time delivery"]
                      }
                    ].map((service, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <Badge variant="outline" className="text-xs">{service.price}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {service.rating} ({service.reviews})
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1" asChild>
                              <a href={`/book-service?name=${encodeURIComponent(service.name)}`}>Book Now</a>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              alert(`Viewing details for ${service.name}\n\nFeatures:\n${service.features.join('\n')}\n\nDuration: ${service.duration}\nPrice: ${service.price}\nRating: ${service.rating}/5 (${service.reviews} reviews)`);
                            }}>
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Machine Services Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                    Machine Services
                  </CardTitle>
                  <CardDescription>Appliance repair and maintenance services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "AC Repair & Service",
                        description: "Complete AC maintenance, repair, and gas charging services",
                        price: "₹400-1500",
                        duration: "1-3 hours",
                        rating: 4.9,
                        reviews: 312,
                        features: ["All brands supported", "Gas charging", "Filter cleaning", "Performance optimization"]
                      },
                      {
                        name: "Washing Machine Repair",
                        description: "Washing machine diagnosis, repair, and maintenance",
                        price: "₹300-1000",
                        duration: "1-2 hours",
                        rating: 4.7,
                        reviews: 198,
                        features: ["Top & front load", "Genuine parts", "Quick diagnosis", "Warranty on repairs"]
                      },
                      {
                        name: "Refrigerator Service",
                        description: "Refrigerator repair, gas filling, and maintenance services",
                        price: "₹350-1200",
                        duration: "1-2 hours",
                        rating: 4.8,
                        reviews: 176,
                        features: ["Cooling issues", "Gas refilling", "Temperature control", "Energy efficiency check"]
                      },
                      {
                        name: "Microwave Repair",
                        description: "Microwave oven repair and maintenance services",
                        price: "₹250-800",
                        duration: "30min-1 hour",
                        rating: 4.6,
                        reviews: 89,
                        features: ["Heating issues", "Door problems", "Timer repair", "Safety checks"]
                      }
                    ].map((service, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <Badge variant="outline" className="text-xs">{service.price}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {service.rating} ({service.reviews})
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1" asChild>
                              <a href={
                                service.name === 'AC Repair & Service' ? '/book-machine-service?appliance=ac' :
                                service.name === 'Washing Machine Repair' ? '/book-machine-service?appliance=washing-machine' :
                                service.name === 'Refrigerator Service' ? '/book-machine-service?appliance=refrigerator' :
                                service.name === 'Microwave Repair' ? '/book-machine-service?appliance=microwave' :
                                '/book-machine-service'
                              }>Book Now</a>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              alert(`Viewing details for ${service.name}\n\nFeatures:\n${service.features.join('\n')}\n\nDuration: ${service.duration}\nPrice: ${service.price}\nRating: ${service.rating}/5 (${service.reviews} reviews)`);
                            }}>
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Services Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2 text-indigo-600" />
                    Vehicle Services
                  </CardTitle>
                  <CardDescription>Car/bike repair, roadside assistance, towing and more</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Car Repair & Service",
                        description: "Engine diagnostics, oil change, brake service, and periodic maintenance",
                        price: "₹1200-5000",
                        duration: "2-6 hours",
                        rating: 4.7,
                        reviews: 210,
                        features: ["Multi-brand service", "Genuine parts", "Warranty support", "Pickup & drop"]
                      },
                      {
                        name: "Bike Service",
                        description: "Two-wheeler full service, chain-lube, brake check, and tuning",
                        price: "₹400-1500",
                        duration: "1-3 hours",
                        rating: 4.6,
                        reviews: 175,
                        features: ["Doorstep service", "Quality spares", "Quick turnaround", "Expert mechanics"]
                      },
                      {
                        name: "Roadside Assistance",
                        description: "On-spot breakdown help: jump start, tire change, fuel delivery",
                        price: "₹300-1200",
                        duration: "30-90 mins",
                        rating: 4.8,
                        reviews: 132,
                        features: ["24/7 availability", "Pan-city coverage", "Live tracking", "Safety assured"]
                      },
                      {
                        name: "Towing Service",
                        description: "Secure flatbed and hook towing for cars and bikes",
                        price: "₹1500-4000",
                        duration: "Depends on distance",
                        rating: 4.7,
                        reviews: 88,
                        features: ["Insured towing", "Skilled handlers", "GPS tracking", "Rapid dispatch"]
                      },
                      {
                        name: "Car Wash & Detailing",
                        description: "Exterior/Interior cleaning, waxing, polishing and deep detailing",
                        price: "₹500-2500",
                        duration: "1-4 hours",
                        rating: 4.6,
                        reviews: 140,
                        features: ["Foam wash", "Interior vacuum", "Wax polish", "Seat shampoo"]
                      }
                    ].map((service, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <Badge variant="outline" className="text-xs">{service.price}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {service.rating} ({service.reviews})
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1" asChild>
                              <a href={
                                service.name === 'Car Repair & Service' ? '/vehicle-services?preset=car-repair' :
                                service.name === 'Bike Service' ? '/vehicle-services?preset=bike-service' :
                                service.name === 'Roadside Assistance' ? '/vehicle-services?preset=roadside-assistance' :
                                service.name === 'Towing Service' ? '/vehicle-services?preset=towing-service' :
                                service.name === 'Car Wash & Detailing' ? '/vehicle-services?preset=car-wash-detailing' :
                                '/vehicle-services'
                              }>Book Now</a>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              alert(`Viewing details for ${service.name}\n\nFeatures:\n${service.features.join('\n')}\n\nDuration: ${service.duration}\nPrice: ${service.price}\nRating: ${service.rating}/5 (${service.reviews} reviews)`);
                            }}>
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contract-Based Services Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HomeIcon className="h-5 w-5 mr-2 text-brand-600" />
                    Contract-Based Services
                  </CardTitle>
                  <CardDescription>End-to-end construction and interior projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContractServicesGrid />
                </CardContent>
              </Card>

              {/* Design & AI Services Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-600" />
                    Design & AI Services
                  </CardTitle>
                  <CardDescription>Interior design, 3D planning, and AI-powered solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "2D/3D Home Design",
                        description: "Complete home design with 2D floor plans and 3D visualization",
                        price: "₹2000-8000",
                        duration: "2-7 days",
                        rating: 4.9,
                        reviews: 145,
                        features: ["2D & 3D designs", "Vastu compliance", "Material suggestions", "Multiple revisions"]
                      },
                      {
                        name: "Interior Design Consultation",
                        description: "Professional interior design consultation and planning",
                        price: "₹1500-5000",
                        duration: "1-3 days",
                        rating: 4.8,
                        reviews: 98,
                        features: ["Color schemes", "Furniture planning", "Space optimization", "Budget planning"]
                      },
                      {
                        name: "Vastu Analysis",
                        description: "Complete vastu analysis and correction suggestions",
                        price: "₹800-2500",
                        duration: "1-2 days",
                        rating: 4.7,
                        reviews: 167,
                        features: ["Detailed analysis", "Correction suggestions", "Digital report", "Follow-up consultation"]
                      },
                      {
                        name: "AI Smart Matching",
                        description: "AI-powered service provider matching based on your needs",
                        price: "Free",
                        duration: "Instant",
                        rating: 4.6,
                        reviews: 234,
                        features: ["Smart algorithms", "Best price matching", "Quality assurance", "Instant results"]
                      }
                    ].map((service, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <Badge variant="outline" className="text-xs">{service.price}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {service.rating} ({service.reviews})
                            </div>
                          </div>
                          <div className="space-y-1 mb-3">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1" onClick={() => {
                              const route =
                                `/book-service?name=${encodeURIComponent(service.name)}`;
                              navigateTo(route);
                            }}>
                              Book Now
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              alert(`Viewing details for ${service.name}\n\nFeatures:\n${service.features.join('\n')}\n\nDuration: ${service.duration}\nPrice: ${service.price}\nRating: ${service.rating}/5 (${service.reviews} reviews)`);
                            }}>
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Complete history of your service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.service}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.provider}
                          <Clock className="h-3 w-3 ml-3 mr-1" />
                          {booking.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">{booking.price}</div>
                          <Badge variant={booking.status === 'Completed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setBookingDialogOpen(true); }}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View, download invoices, or dispute</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {userTransactions.map(tx => (
                      <div key={tx.id} className="p-3 border rounded">
                        <div className="flex justify-between"><span>{tx.id}</span><span>₹{tx.amount}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>{tx.method}</span><span>{tx.date}</span></div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => setInvoiceOpen(true)}>Download Invoice</Button>
                          <Button size="sm" variant="outline">Refund/Dispute</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security & Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>OTP Verification</span><Button size="sm" variant="outline" onClick={() => setOtpOpen(true)}>Test OTP</Button></div>
                    <div className="flex items-center justify-between"><span>Two-Factor Auth</span><Badge variant="secondary">Enabled</Badge></div>
                    <div className="flex items-center justify-between"><span>Biometric Auth</span><Badge variant="secondary">Device Supported</Badge></div>
                    <div className="flex items-center justify-between"><span>SSL Encryption</span><Badge variant="secondary">Active</Badge></div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>UPI, Cards, Net Banking, Wallets, BNPL, QR</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge>UPI</Badge><Badge>Visa</Badge><Badge>Mastercard</Badge><Badge>RuPay</Badge><Badge>Net Banking</Badge><Badge>PayPal</Badge><Badge>Amazon Pay</Badge><Badge>Mobikwik</Badge><Badge>BNPL</Badge>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm font-medium mb-2">Scan & Pay (QR)</div>
                      <div className="h-32 bg-muted flex items-center justify-center rounded">QR Code</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setAddPayOpen(true)}>Add Payment Method</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences & Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <Label>Default Payment Method</Label>
                      <Select value={defaultMethod} onValueChange={setDefaultMethod}>
                        <SelectTrigger className="w-full mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="netbanking">Net Banking</SelectItem>
                          <SelectItem value="wallet">Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={(v) => setCurrency(v as 'INR' | 'USD' | 'EUR')}>
                        <SelectTrigger className="w-full mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between"><span>SMS Notifications</span><Switch checked={notifSMS} onCheckedChange={setNotifSMS} /></div>
                      <div className="flex items-center justify-between"><span>Email Notifications</span><Switch checked={notifEmail} onCheckedChange={setNotifEmail} /></div>
                      <div className="flex items-center justify-between"><span>In-app Notifications</span><Switch checked={notifApp} onCheckedChange={setNotifApp} /></div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input id="user-terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                      <label htmlFor="user-terms">I accept Terms & Conditions and Privacy Policy</label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">J</div>
                        <div>
                          <div className="text-lg font-semibold">John Doe</div>
                          <div className="text-sm text-muted-foreground">john.doe@email.com • +91-98765-43210</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Address</div>
                          <div className="font-medium">Bandra West, Mumbai</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Member Since</div>
                          <div className="font-medium">2023</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Bookings</div>
                          <div className="font-medium">24</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Completed Services</div>
                          <div className="font-medium">18</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Preferences</div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 rounded bg-muted">Fast Service</span>
                          <span className="px-2 py-1 rounded bg-muted">Verified Providers</span>
                          <span className="px-2 py-1 rounded bg-muted">Recurring Maintenance</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Personal Info</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <Input placeholder="Name" defaultValue="John Doe" />
                          <Input placeholder="Email" defaultValue="john.doe@email.com" />
                          <Input placeholder="Phone" defaultValue="+91-98765-43210" />
                          <Input placeholder="Location" defaultValue="Bandra West, Mumbai" />
                        </div>
                        <div className="flex justify-end gap-2 mt-3"><Button variant="outline">Save</Button></div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Account Actions</div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline">Edit Profile</Button>
                          <Button variant="outline">Change Password</Button>
                          <Button variant="outline" onClick={() => { window.location.href = '/'; }}>Logout</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Services</CardTitle>
                    <CardDescription>Rebook your most used services instantly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {favoriteServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.category} • {service.frequency}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleFavoriteRebook(service.name)}>
                          Rebook
                        </Button>
                      </div>
                    ))}
                    {favoriteServices.length === 0 && (
                      <div className="text-xs text-muted-foreground">Mark services as favorite to see them here.</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods & Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setAddPayOpen(true)}>Add/Manage Methods</Button><Button size="sm" variant="outline" onClick={() => setInvoiceOpen(true)}>Invoices</Button></div>
                    <div className="space-y-1">
                      {userTransactions.map(tx => (<div key={tx.id} className="flex justify-between text-xs"><span>{tx.id}</span><span>₹{tx.amount}</span></div>))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requests & Favorites</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Current Requests</span><Button size="sm" variant="outline" asChild><a href="/dashboard">Track</a></Button></div>
                    <div className="flex items-center justify-between"><span>Favorites</span><Button size="sm" variant="outline" asChild><a href="/providers">Browse</a></Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Manage Notifications</span><Button size="sm" variant="outline" asChild><a href="/ai-service-assistant">Open</a></Button></div>
                    <div className="flex items-center justify-between"><span>Support & Help</span><Button size="sm" variant="outline">Live Chat</Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={currency} onValueChange={(v)=>setCurrency(v as 'INR'|'USD'|'EUR')}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Currency" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={defaultMethod} onValueChange={setDefaultMethod}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Default Method" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="netbanking">Net Banking</SelectItem>
                          <SelectItem value="wallet">Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between"><span>Theme</span><Badge variant="secondary">System</Badge></div>
                    <div className="flex items-center justify-between"><span>Privacy</span><Badge variant="secondary">Standard</Badge></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Complete information about your booking</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{selectedBooking.service}</div>
                  <Badge variant={selectedBooking.status === 'Completed' ? 'default' : 'secondary'}>
                    {selectedBooking.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Provider: {selectedBooking.provider}</div>
                <div className="text-sm text-muted-foreground">When: {selectedBooking.date}</div>
                <div className="text-sm">Price: {selectedBooking.price}</div>
                <div className="pt-2">
                  <Button className="w-full" asChild>
                    <a href={`/booking-confirmation?booking=BK${selectedBooking.id.toString().padStart(4,'0')}&service=${encodeURIComponent(selectedBooking.service)}`}>Go to Booking Page</a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Schedule Dialog */}
        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Schedule</DialogTitle>
              <DialogDescription>Set your availability</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="user-sch-date">Date</Label>
                <Input id="user-sch-date" type="date" value={schedule.date} onChange={(e) => setSchedule({ ...schedule, date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="user-sch-time">Time</Label>
                <Input id="user-sch-time" type="time" value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                <Button onClick={() => { setScheduleOpen(false); alert('Schedule updated'); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payments dialogs */}
        <Dialog open={addPayOpen} onOpenChange={setAddPayOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Save UPI, card, or wallet</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="user-vpa">UPI ID</Label>
                <Input id="user-vpa" placeholder="name@bank" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="user-card">Card Number</Label>
                  <Input id="user-card" placeholder="4111 1111 1111 1111" />
                </div>
                <div>
                  <Label htmlFor="user-cvv">CVV</Label>
                  <Input id="user-cvv" placeholder="123" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="user-exp">Expiry</Label>
                  <Input id="user-exp" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="user-name">Name on Card</Label>
                  <Input id="user-name" placeholder="John Doe" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAddPayOpen(false)}>Cancel</Button>
                <Button onClick={() => { setAddPayOpen(false); alert('Payment method saved'); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>Enter the 6-digit OTP sent to your device</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="______" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOtpOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOtpOpen(false); alert('Verified'); }}>Verify</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={kycOpen} onOpenChange={setKycOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>KYC Verification</DialogTitle>
              <DialogDescription>Provide PAN/Aadhaar details</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="PAN" />
              <Input placeholder="Aadhaar" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setKycOpen(false)}>Cancel</Button>
                <Button onClick={() => { setKycOpen(false); alert('KYC submitted'); }}>Submit</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invoice</DialogTitle>
              <DialogDescription>Download your invoice/receipt</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="p-3 border rounded">Sample invoice details will appear here.</div>
              <Button onClick={() => { const blob = new Blob([JSON.stringify({ sample: true, date: new Date().toISOString() }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'invoice.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }}>Download</Button>
            </div>
          </DialogContent>
        </Dialog>
        </Tabs>
      </div>
    </div>
  );
}
