import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Home,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Settings,
  LogOut,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  BarChart3,
  Target,
  Award,
  Bell,
  Wallet
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { requireAuth, requireRole, getUserId, logout } from "../lib/auth";
import { api } from "@/lib/api";
import { log } from "console";

export default function ProviderDashboard() {
  // Authentication check
  useEffect(() => {
    requireAuth('/provider-login');
    requireRole('provider', '/user-login');
  }, []);

  const [activeTab, setActiveTab] = useState("overview");
  const providerId = getUserId() || "test-provider-1";

  const [providerStats, setProviderStats] = useState({
    totalJobs: 0,
    earnings: 0,
    rating: 0,
    activeServices: 0
  });
  const [selectedService, setSelectedService] = useState(false);
  // setAddServiceOpen
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [jobViewOpen, setJobViewOpen] = useState(false);
  const [editServiceOpen, setEditServiceOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobActionLoading, setJobActionLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    date: new Date(),
    time: new Date(),
    location: "",
    notes: ""    
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [defaultMethod, setDefaultMethod] = useState("bank");
  const [currency, setCurrency] = useState("INR");
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [addPayOpen, setAddPayOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);

  useEffect(() => {
    // Fetch stats
    api.get(`/provider/dashboard/${providerId}`).then(data => {
      setProviderStats(data);
    }).catch(err => console.error(err));

    // Fetch jobs
    api.get(`/provider/jobs/${providerId}`).then(data => {
      const mapped = data.map((j: any) => ({
        id: j._id,
        service: j.serviceId?.title || j.serviceType || 'Service',
        customer: j.userId?.name || 'Customer',
        location: j.userId?.address || 'Location',
        time: new Date(j.createdAt).toLocaleTimeString(),
        status: j.status,
        price: '₹' + (j.estimatedCost || '0'),
        urgency: 'normal',
        distance: 'Local'
      }));
      setJobs(mapped);
    }).catch(err => console.error(err));
  }, [providerId]);

  const stats = [
    { label: "Total Jobs", value: providerStats.totalJobs.toString(), trend: "+12%", icon: Briefcase, color: "text-blue-600" },
    { label: "This Month Earnings", value: `₹${providerStats.earnings}`, trend: "+18%", icon: DollarSign, color: "text-green-600" },
    { label: "Average Rating", value: providerStats.rating.toString(), trend: "+0.2", icon: Star, color: "text-yellow-600" },
    { label: "Active Services", value: providerStats.activeServices.toString(), trend: "0", icon: Settings, color: "text-purple-600" }
  ];

  /*
  const jobRequests = [
    // ... kept as reference if needed, but replaced by state
  ];
  */

  const upcomingJobs = [
    { id: 1, service: "Deep Cleaning", customer: "Rohit Kumar", time: "Today 3:00 PM", status: "confirmed", notes: "Bring vacuum cleaner" },
    { id: 2, service: "AC Service", customer: "Meera Singh", time: "Tomorrow 10:00 AM", status: "confirmed", notes: "Call before arrival" },
    { id: 3, service: "Plumbing Fix", customer: "Dev Patel", time: "Tomorrow 2:00 PM", status: "rescheduled", notes: "Kitchen sink issue" }
  ];

  const myServices = [
    { id: 1, name: "House Deep Cleaning", category: "Cleaning", price: "₹800-1200", status: "active", bookings: 89 },
    { id: 2, name: "AC Repair & Service", category: "Appliances", price: "₹600-1500", status: "active", bookings: 67 },
    { id: 3, name: "Electrical Installation", category: "Electrical", price: "₹400-1000", status: "active", bookings: 45 },
    { id: 4, name: "Pest Control", category: "Home Care", price: "₹1200-2500", status: "paused", bookings: 23 }
  ];

  // const [jobs, setJobs] = useState(jobRequests); // ALREADY DEFINED ABOVE
  const [servicesState, setServicesState] = useState(myServices);
  const [upcoming, setUpcoming] = useState(upcomingJobs);
  const [serviceForm, setServiceForm] = useState<{ name: string; category: string; price: string; status?: string }>({
    name: "",
    category: "",
    price: "₹0-0",
    status: "active",
  });
  
  const handleAccept = (id: string) => {
    api.put(`/bookings/${id}/status`, { status: "accepted" }).then(() => {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "accepted" } : j));
    });
  };
  
  const handleDecline = (id: string) => {
    api.put(`/bookings/${id}/status`, { status: "cancelled" }).then(() => {
        setJobs(prev => prev.filter(j => j.id !== id));
    });
  };
  const handleCall = (name: string) => { window.location.href = "tel:+911234567890"; };
  const handleChat = (name: string) => { window.location.href = `/ai-service-assistant?with=${encodeURIComponent(name)}`; };
  const handleAddServiceSubmit = () => {
    if (!serviceForm.name || !serviceForm.category) return;
    const newService = { id: Date.now(), name: serviceForm.name, category: serviceForm.category, price: serviceForm.price, status: "active", bookings: 0 };
    setServicesState(prev => [newService, ...prev]);
    setServiceForm({ name: "", category: "", price: "₹0-0", status: "active" });
    setAddServiceOpen(false);
  };
  const handleEditServiceSubmit = () => {
    if (!selectedService) return;
    setServicesState(prev => prev.map(s => s.id === selectedService.id ? selectedService : s));
    setEditServiceOpen(false);
  };
  const handleWithdraw = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || amt > balance) { alert("Enter a valid amount inside available balance"); return; }
    setBalance(b => b - amt);
    setWithdrawOpen(false);
    setWithdrawAmount("");
    alert("Withdrawal request submitted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
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
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Users className="h-3 w-3 mr-1" />
              Provider Account
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setNotificationsOpen(true)}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { window.location.href = '/'; }}>
              Home
            </Button>
            <Button variant="outline" size="sm" onClick={() => { logout(); }}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your services, track earnings, and grow your business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend === '0' ? 'text-muted-foreground' : 'text-red-600'}`}>
                        {stat.trend !== '0' && (stat.trend.startsWith('+') ? '↗' : '↘')} {stat.trend} vs last month
                      </p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              My Services
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Requests */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      New Job Requests
                    </CardTitle>
                    <Badge variant="secondary">{jobs.filter(job => job.status === 'pending').length} pending</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className={`p-4 border rounded-lg ${job.urgency === 'urgent' ? 'border-red-200 bg-red-50' : 'border-border'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{job.customer[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{job.service}</h4>
                              <p className="text-sm text-muted-foreground">{job.customer} • {job.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{job.price}</p>
                            <p className="text-xs text-muted-foreground">{job.distance} away</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {job.urgency === 'urgent' && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{job.time}</span>
                          </div>
                          {job.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleDecline(job.id)}>
                                Decline
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAccept(job.id)}>
                                Accept
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="default">Accepted</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Performance */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" onClick={() => setAddServiceOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => setScheduleOpen(true)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Update Schedule
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => { window.location.href = '/dashboard?back=provider-dashboard'; }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => setWithdrawOpen(true)}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw Earnings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Job Completion Rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Customer Satisfaction</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                      <Progress value={96} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="font-medium">Good</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Jobs */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcoming.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{job.service}</h4>
                        <Badge variant={job.status === 'confirmed' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{job.customer}</p>
                      <p className="text-sm font-medium text-primary mb-2">{job.time}</p>
                      <p className="text-xs text-muted-foreground">{job.notes}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleCall(job.customer)}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleChat(job.customer)}>
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <p className="text-sm text-muted-foreground">Completed This Month</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Job Requests</CardTitle>
                  <CardDescription>Manage all your job requests and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{job.customer[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{job.service}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.location}
                              <Clock className="h-3 w-3 ml-3 mr-1" />
                              {job.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium">{job.price}</div>
                            <Badge variant={job.status === 'accepted' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedJob(job); setJobViewOpen(true); }}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Services</CardTitle>
                  <CardDescription>Manage the services you offer</CardDescription>
                </div>
                <Button onClick={() => setAddServiceOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicesState.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{service.category}</span>
                          <span>{service.price}</span>
                          <span>{service.bookings} bookings</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedService(service); setEditServiceOpen(true); }}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">₹45,200</div>
                        <p className="text-sm text-green-700">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">₹12,340</div>
                        <p className="text-sm text-blue-700">This Week</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">₹2,100</div>
                        <p className="text-sm text-purple-700">Today</p>
                      </div>
                    </div>
                    <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Earnings Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Available Balance</span>
                      <span className="font-semibold text-green-600">₹{balance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending Payments</span>
                      <span className="font-semibold">₹2,340</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Next Payout</span>
                      <span className="font-semibold">Dec 28, 2024</span>
                    </div>
                    <Button className="w-full" onClick={() => setWithdrawOpen(true)}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </CardContent>
                </Card>

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
                    <CardTitle>Security & Verification</CardTitle>
                    <CardDescription>OTP, 2FA, Biometric, SSL, Fraud alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>OTP Verification</span><Button size="sm" variant="outline" onClick={() => setOtpOpen(true)}>Test OTP</Button></div>
                    <div className="flex items-center justify-between"><span>Two-Factor Auth</span><Badge variant="secondary">Enabled</Badge></div>
                    <div className="flex items-center justify-between"><span>Biometric Authentication</span><Badge variant="secondary">Device Supported</Badge></div>
                    <div className="flex items-center justify-between"><span>SSL Encryption</span><Badge variant="secondary">Active</Badge></div>
                    <div className="flex items-center justify-between"><span>Fraud Detection</span><Badge variant="secondary">On</Badge></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Details & Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {transactions.map(tx => (
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
                      <Select value={currency} onValueChange={setCurrency}>
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Transparency</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>GST/Tax Breakdown: <span className="font-medium">Included as per invoice</span></div>
                    <div>KYC Verification: <Button size="sm" variant="outline" onClick={() => setKycOpen(true)}>Start/Update KYC</Button></div>
                    <div className="flex items-center gap-2">
                      <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                      <label htmlFor="terms">I accept Terms & Conditions and Privacy Policy</label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "House Cleaning", revenue: "₹18,500", percentage: 65 },
                      { name: "AC Repair", revenue: "₹12,200", percentage: 25 },
                      { name: "Plumbing", revenue: "₹5,750", percentage: 10 }
                    ].map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span className="font-medium">{service.revenue}</span>
                        </div>
                        <Progress value={service.percentage} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Provider Profile</CardTitle>
                  <CardDescription>Manage your business profile and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>PD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-lg font-semibold">ServiceFlow Provider</div>
                          <div className="text-sm text-muted-foreground">provider@serviceflow.com • +91-98765-43210</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Company</div>
                          <div className="font-medium">GreenClean Services</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Category</div>
                          <div className="font-medium">Home Services</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Experience</div>
                          <div className="font-medium">5+ years</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">City</div>
                          <div className="font-medium">Mumbai</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Rating</div>
                          <div className="font-medium">4.8/5</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Verified</div>
                          <div className="font-medium">KYC Completed</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Professional Info</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <Input placeholder="Name" defaultValue="ServiceFlow Provider" />
                          <Input placeholder="Company" defaultValue="GreenClean Services" />
                          <Input placeholder="Skills" defaultValue="Cleaning, AC Repair, Plumbing" />
                          <Input placeholder="Certifications" defaultValue="ISO, Safety" />
                        </div>
                        <div className="flex justify-end gap-2 mt-3"><Button variant="outline" onClick={() => alert('Professional info saved')}>Save</Button></div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Design Uploads</div>
                        <div className="space-y-2 text-sm">
                          <Input type="file" accept=".dwg,.dxf,.obj,.fbx,.png,.jpg" />
                          <div className="text-xs text-muted-foreground">Upload AutoCAD files, 3D renders, or sample layouts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Listings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Add/Edit Services</span><Button size="sm" variant="outline" onClick={() => setAddServiceOpen(true)}>Manage</Button></div>
                    <div className="flex items-center justify-between"><span>Client Requests</span><Button size="sm" variant="outline" onClick={() => setActiveTab('jobs')}>View Requests</Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Payouts & Balances</span><Button size="sm" variant="outline" onClick={() => setActiveTab('earnings')}>Open</Button></div>
                    <div className="flex items-center justify-between"><span>Transactions</span><Button size="sm" variant="outline" onClick={() => setInvoiceOpen(true)}>Invoices</Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ratings & Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>View Feedback</span><Badge variant="secondary">4.8/5</Badge></div>
                    <div className="flex items-center justify-between"><span>Respond to Comments</span><Button size="sm" variant="outline">Open</Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Availability Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Working Hours</span><Button size="sm" variant="outline" onClick={() => setScheduleOpen(true)}>Edit</Button></div>
                    <div className="flex items-center justify-between"><span>Appointments</span><Button size="sm" variant="outline" onClick={() => setActiveTab('jobs')}>Manage</Button></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Support & Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Notification Preferences</span><Button size="sm" variant="outline" onClick={() => setNotificationsOpen(true)}>Open</Button></div>
                    <div className="flex items-center justify-between"><span>Account Security</span><Badge variant="secondary">2FA Enabled</Badge></div>
                    <div className="flex items-center justify-between"><span>Profile Visibility</span><Badge variant="secondary">Public</Badge></div>
                    <div className="flex items-center justify-between"><span>Help & Policies</span><Button size="sm" variant="outline">Contact Admin</Button></div>
                    <div className="flex items-center justify-between"><span>Logout</span><Button size="sm" variant="outline" onClick={() => { logout(); }}>Sign Out</Button></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service offering</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="svc-name">Service Name</Label>
                <Input id="svc-name" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="svc-cat">Category</Label>
                <Input id="svc-cat" value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="svc-price">Price Range</Label>
                <Input id="svc-price" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAddServiceOpen(false)}>Cancel</Button>
                <Button onClick={handleAddServiceSubmit}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editServiceOpen} onOpenChange={setEditServiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update your service details</DialogDescription>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-name">Service Name</Label>
                  <Input id="edit-name" value={selectedService.name} onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="edit-cat">Category</Label>
                  <Input id="edit-cat" value={selectedService.category} onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price Range</Label>
                  <Input id="edit-price" value={selectedService.price} onChange={(e) => setSelectedService({ ...selectedService, price: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditServiceOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditServiceSubmit}>Update</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Schedule</DialogTitle>
              <DialogDescription>Set your availability</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sch-date">Date</Label>
                <Input id="sch-date" type="date" value={schedule.date} onChange={(e) => setSchedule({ ...schedule, date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="sch-time">Time</Label>
                <Input id="sch-time" type="time" value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                <Button onClick={() => { setScheduleOpen(false); alert('Schedule updated'); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>Available balance: ₹{balance.toLocaleString('en-IN')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="wd-amt">Amount</Label>
                <Input id="wd-amt" type="number" value={withdrawAmount as any} onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
                <Button onClick={handleWithdraw}>Request Payout</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Recent updates</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="p-3 border rounded">New job request: Emergency Plumbing • 30 min ago</div>
              <div className="p-3 border rounded">Payout processed: ₹2,100 • Today</div>
              <div className="p-3 border rounded">Review received: 5★ from Meera Singh</div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={jobViewOpen} onOpenChange={setJobViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
              <DialogDescription>Review and take action</DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{selectedJob.service}</div>
                  <Badge variant={selectedJob.status === 'accepted' ? 'default' : 'secondary'}>{selectedJob.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Customer: {selectedJob.customer}</div>
                <div className="text-sm text-muted-foreground">Location: {selectedJob.location}</div>
                <div className="text-sm">Price: {selectedJob.price}</div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="text-red-600 border-red-200" onClick={() => { handleDecline(selectedJob.id); setJobViewOpen(false); }}>Decline</Button>
                  <Button onClick={() => { handleAccept(selectedJob.id); setJobViewOpen(false); }}>Accept</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payments: Add Method */}
        <Dialog open={addPayOpen} onOpenChange={setAddPayOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Save UPI, card, or wallet</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="vpa">UPI ID</Label>
                <Input id="vpa" placeholder="name@bank" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" placeholder="4111 1111 1111 1111" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="exp">Expiry</Label>
                  <Input id="exp" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="Provider Name" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAddPayOpen(false)}>Cancel</Button>
                <Button onClick={() => { setAddPayOpen(false); alert('Payment method saved'); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payments: OTP */}
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

        {/* Payments: KYC */}
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

        {/* Payments: Invoice */}
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
      </div>
    </div>
  );
}
