import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Car,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { requireAuth, getUserId, logout } from "../lib/auth";
import { DashboardStats, UserProfile, Booking } from "@/lib/type";
import {
  userApi,
  userBookingsApi,
  userDashboardStats,
  userFavoritesApi,
  userProfileApi,
  userTransactionsApi,
} from "@/lib";

// Constants
const timeSlots = [
  { id: "morning", label: "Morning (9AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 3PM)" },
  { id: "evening", label: "Evening (3PM - 6PM)" },
];

const QUICK_ACTIONS = [
  { label: "Update Schedule", icon: Calendar, action: "setScheduleOpen" },
  { label: "Manage Bookings", icon: Eye, action: "bookings" },
  { label: "Track Booking", icon: MapPin, action: "track" },
  { label: "View Payments", icon: Receipt, action: "payments" },
];

const SERVICE_CARDS = {
  home: {
    title: "Book Home Service",
    description: "Plumbing, electrical, cleaning & repairs",
    path: "/home-services",
    icon: HomeIcon,
    color: "blue",
  },
  machine: {
    title: "Machine Services",
    description: "AC, washing machine, refrigerator",
    path: "/book-machine-service",
    icon: Settings,
    color: "green",
  },
  vehicle: {
    title: "Vehicle Services",
    description: "Repair, roadside assistance, towing",
    path: "/vehicle-services",
    icon: Car,
    color: "indigo",
  },
};

export default function UserDashboard() {
  const [searchParams] = useSearchParams();

  // Auth & User State
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  // UI State
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") ?? "overview",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Data State
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    amountSpent: 0,
    completedServices: 0,
    favorites: 0,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [favoriteServices, setFavoriteServices] = useState([]);

  // Dialog State
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    notes: "",
    fullAddress: "",
    timeSlot: "",
    isUrgent: false,
  });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [addPayOpen, setAddPayOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showForgotOption, setShowForgotOption] = useState(false);

  // Preferences
  const [defaultMethod, setDefaultMethod] = useState("upi");
  const [currency, setCurrency] = useState("INR");
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Authentication
  useEffect(() => {
    requireAuth("/login-user");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id || getUserId());
      setUserName(user.name || "");
    }
  }, []);

  // Sync active tab with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) setActiveTab(tab);
  }, [searchParams]);

  // Fetch services on tab change
  useEffect(() => {
    if (activeTab === "services") {
      setSearchTerm("");
      setFilterCategory("all");
      if (services.length === 0) fetchServices();
    }
  }, [activeTab]);

  // Fetch user data when userId is available
  useEffect(() => {
    if (!userId) return;
    fetchDashboardData();
  }, [userId]);

  const fetchServices = useCallback(async () => {
    try {
      const data = await api.get("/services");
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [stats, profile, bookings, transactions, favorites] =
        await Promise.all([
          userDashboardStats(userId),
          userProfileApi(userId),
          userBookingsApi(userId),
          userTransactionsApi(userId),
          userFavoritesApi(userId),
        ]);

      setDashboardStats(stats);
      setUserProfile(profile);
      setOriginalProfile(profile);
      setProfileForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setRecentBookings(bookings);
      setUserTransactions(transactions);
      setFavoriteServices(favorites);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  }, [userId]);

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      date: booking.raw?.date
        ? new Date(booking.raw.date).toISOString().slice(0, 10)
        : "",
      notes: booking.raw?.notes || "",
      fullAddress: booking.raw?.fullAddress || "",
      timeSlot: booking.raw?.timeSlot || "",
      isUrgent: booking.raw?.isUrgent || false,
    });
    setIsEditingBooking(true);
    setBookingDialogOpen(true);
  };

  const handleDeleteBooking = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await api.delete(`/bookings/${booking.id}`);
      alert("Booking cancelled");
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete booking", err);
      alert("Cancellation failed");
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    if (!userId) return;
    try {
      setIsSavingProfile(true);
      const updated = await api.put(`/user/profile/${userId}`, profileForm);
      setUserProfile(updated);
      setOriginalProfile(updated);
      alert("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userId) return;
    setPasswordError("");
    setShowForgotOption(false);

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    if (!currentPassword || !newPassword) {
      alert("Please fill out all fields");
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.post(`/user/change-password/${userId}`, {
        currentPassword,
        newPassword,
      });
      alert("Password changed successfully");
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password", err);
      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "Current password incorrect"
      ) {
        setPasswordError("Current password is incorrect.");
        setShowForgotOption(true);
      } else {
        alert("Failed to change password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetProfileForm = () => {
    if (!originalProfile) return;
    setProfileForm({
      name: originalProfile.name || "",
      email: originalProfile.email || "",
      phone: originalProfile.phone || "",
      address: originalProfile.address || "",
    });
  };

  const hasProfileChanges = () => {
    if (!originalProfile) return false;
    return (
      profileForm.name !== (originalProfile.name || "") ||
      profileForm.email !== (originalProfile.email || "") ||
      profileForm.phone !== (originalProfile.phone || "") ||
      profileForm.address !== (originalProfile.address || "")
    );
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleFavoriteRebook = (serviceName) => {
    navigateTo(`/book-service?service=${encodeURIComponent(serviceName)}`);
  };

  const uniqueCategories = [...new Set(services.map((s) => s.category))].filter(
    Boolean,
  );
  const displayedCategories = uniqueCategories.filter(
    (c) => filterCategory === "all" || c === filterCategory,
  );

  const profileChecklist = [
    { key: "name", label: "Full name", value: userProfile?.name },
    { key: "email", label: "Email", value: userProfile?.email },
    { key: "phone", label: "Phone number", value: userProfile?.phone },
    { key: "address", label: "Address", value: userProfile?.address },
  ];
  const completedProfileFields = profileChecklist.filter((item) =>
    item.value?.trim(),
  ).length;
  const profileCompletion = Math.round(
    (completedProfileFields / profileChecklist.length) * 100,
  );
  const missingProfileFields = profileChecklist.filter(
    (item) => !item.value?.trim(),
  );

  // Tab Components
  const TabTriggerItem = ({ value, icon: Icon, label }) => (
    <TabsTrigger
      value={value}
      className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs sm:text-sm hidden sm:inline">{label}</span>
    </TabsTrigger>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, path, icon: Icon, color }) => (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => navigateTo(path)}
    >
      <CardContent className="p-6 text-center">
        <div
          className={`p-3 bg-${color}-100 rounded-lg inline-block mb-4 group-hover:bg-${color}-200 transition-colors`}
        >
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
        <h3 className="font-semibold mb-2 text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(path);
          }}
        >
          Book Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const BookingItem = ({ booking, onEdit, onDelete, onView }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
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
          <Badge
            variant={booking.status === "completed" ? "default" : "secondary"}
          >
            {booking.status === "completed" ? "Completed" : booking.status}
          </Badge>
        </div>
        {booking.status === "pending" ? (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit(booking)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(booking)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onView(booking)}>
            View Details
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              ServiceFlow
            </h1>
          </div>

          <Badge
            variant="outline"
            className="text-blue-600 border-blue-200 md:hidden"
          >
            <User className="h-3 w-3 mr-1" />
            User Account
          </Badge>

          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <User className="h-3 w-3 mr-1" />
              User Account
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigateTo("/")}>
              Home
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 pb-4 space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigateTo("/")}
            >
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and stay on top of every service request
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 gap-1">
            <TabTriggerItem value="overview" icon={HomeIcon} label="Overview" />
            <TabTriggerItem value="services" icon={Settings} label="Services" />
            <TabTriggerItem value="bookings" icon={Calendar} label="Bookings" />
            <TabTriggerItem value="payments" icon={Receipt} label="Payments" />
            <TabTriggerItem value="profile" icon={User} label="Profile" />
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Bookings"
                value={dashboardStats.totalBookings}
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Amount Spent"
                value={`₹${dashboardStats.amountSpent}`}
                icon={Receipt}
                color="green"
              />
              <StatCard
                title="Completed Services"
                value={dashboardStats.completedServices}
                icon={CheckCircle}
                color="purple"
              />
              <StatCard
                title="Favorites"
                value={favoriteServices.length}
                icon={Heart}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.values(SERVICE_CARDS).map((card, idx) => (
                <QuickActionCard key={idx} {...card} />
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your schedule, bookings, and payments instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="outline" onClick={() => setScheduleOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("bookings")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigateTo(
                      `/booking-dashboard?booking=${recentBookings[0]?.id ?? ""}`,
                    )
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("payments")}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  View Payments
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.slice(0, 3).map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      onEdit={handleEditBooking}
                      onDelete={handleDeleteBooking}
                      onView={(b) => {
                        setSelectedBooking(b);
                        setIsEditingBooking(false);
                        setBookingDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            {services.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      All Services
                    </h2>
                    <p className="text-muted-foreground">
                      Explore all available services with detailed information
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search services..."
                      className="sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                      value={filterCategory}
                      onValueChange={setFilterCategory}
                    >
                      <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {displayedCategories.map((cat) => (
                  <Card key={cat}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2 text-green-600" />
                        {cat}
                      </CardTitle>
                      <CardDescription>Services in {cat}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services
                          .filter(
                            (s) =>
                              s.category === cat &&
                              (s.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                                s.description
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())),
                          )
                          .map((s) => (
                            <Card
                              key={s._id}
                              className="hover:shadow-lg transition-shadow"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-semibold">{s.title}</div>
                                  {s.price && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      ₹{s.price}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {s.description}
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    navigateTo(
                                      `/book-service?service=${encodeURIComponent(s.title)}`,
                                    )
                                  }
                                >
                                  Book Now
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Loading services...
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>
                  Complete history of your service bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      onEdit={handleEditBooking}
                      onDelete={handleDeleteBooking}
                      onView={(b) => {
                        setSelectedBooking(b);
                        setIsEditingBooking(false);
                        setBookingDialogOpen(true);
                      }}
                    />
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
                    <CardDescription>
                      View, download invoices, or dispute
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {userTransactions.map((tx) => (
                      <div key={tx.id} className="p-3 border rounded">
                        <div className="flex justify-between">
                          <span>{tx.id}</span>
                          <span>₹{tx.amount}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>{tx.method}</span>
                          <span>{tx.date}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInvoiceOpen(true)}
                          >
                            Download Invoice
                          </Button>
                          <Button size="sm" variant="outline">
                            Refund/Dispute
                          </Button>
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
                    <div className="flex items-center justify-between">
                      <span>OTP Verification</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOtpOpen(true)}
                      >
                        Test OTP
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Auth</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Biometric Auth</span>
                      <Badge variant="secondary">Device Supported</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SSL Encryption</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      UPI, Cards, Net Banking, Wallets, BNPL, QR
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        "UPI",
                        "Visa",
                        "Mastercard",
                        "RuPay",
                        "Net Banking",
                        "PayPal",
                        "Amazon Pay",
                        "Mobikwik",
                        "BNPL",
                      ].map((m) => (
                        <Badge key={m}>{m}</Badge>
                      ))}
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm font-medium mb-2">
                        Scan & Pay (QR)
                      </div>
                      <div className="h-32 bg-muted flex items-center justify-center rounded">
                        QR Code
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setAddPayOpen(true)}
                    >
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences & Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <Label>Default Payment Method</Label>
                      <Select
                        value={defaultMethod}
                        onValueChange={setDefaultMethod}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="netbanking">
                            Net Banking
                          </SelectItem>
                          <SelectItem value="wallet">Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select
                        value={currency}
                        onValueChange={(v) => setCurrency(v)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>SMS Notifications</span>
                        <Switch
                          checked={notifSMS}
                          onCheckedChange={setNotifSMS}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Switch
                          checked={notifEmail}
                          onCheckedChange={setNotifEmail}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>In-app Notifications</span>
                        <Switch
                          checked={notifApp}
                          onCheckedChange={setNotifApp}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id="user-terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <label htmlFor="user-terms">
                        I accept Terms & Conditions and Privacy Policy
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab - Simplified for brevity, similar structure as original but cleaned */}
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {(userProfile?.name?.[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <div className="text-lg font-semibold">
                            {userProfile?.name || "Name not added"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {userProfile?.email || "Email not added"} •{" "}
                            {userProfile?.phone || "Phone not added"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Address</div>
                          <div className="font-medium">
                            {userProfile?.address || "Address not added"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Member Since
                          </div>
                          <div className="font-medium">
                            {userProfile?.createdAt
                              ? new Date(userProfile.createdAt).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Total Bookings
                          </div>
                          <div className="font-medium">
                            {dashboardStats.totalBookings}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Completed Services
                          </div>
                          <div className="font-medium">
                            {dashboardStats.completedServices}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Preferences</div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 rounded bg-muted">
                            Fast Service
                          </span>
                          <span className="px-2 py-1 rounded bg-muted">
                            Verified Providers
                          </span>
                          <span className="px-2 py-1 rounded bg-muted">
                            Recurring Maintenance
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Current Saved Data</div>
                          <Badge variant="outline">
                            {profileCompletion}% complete
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            Name:{" "}
                            <span className="text-foreground">
                              {originalProfile?.name || "Not added"}
                            </span>
                          </div>
                          <div>
                            Email:{" "}
                            <span className="text-foreground">
                              {originalProfile?.email || "Not added"}
                            </span>
                          </div>
                          <div>
                            Phone:{" "}
                            <span className="text-foreground">
                              {originalProfile?.phone || "Not added"}
                            </span>
                          </div>
                          <div>
                            Address:{" "}
                            <span className="text-foreground">
                              {originalProfile?.address || "Not added"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isEditingProfile && (
                        <div className="p-4 border rounded-lg">
                          <div className="font-medium mb-2">Personal Info</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <Input
                              placeholder="Name"
                              value={profileForm.name}
                              onChange={(e) =>
                                handleProfileInputChange("name", e.target.value)
                              }
                            />
                            <Input
                              placeholder="Email"
                              value={profileForm.email}
                              onChange={(e) =>
                                handleProfileInputChange(
                                  "email",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              placeholder="Phone"
                              value={profileForm.phone}
                              onChange={(e) =>
                                handleProfileInputChange(
                                  "phone",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              placeholder="Location"
                              value={profileForm.address}
                              onChange={(e) =>
                                handleProfileInputChange(
                                  "address",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2 mt-3">
                            <Button
                              variant="outline"
                              onClick={resetProfileForm}
                              disabled={!hasProfileChanges() || isSavingProfile}
                            >
                              Reset
                            </Button>
                            <Button
                              onClick={handleProfileSave}
                              disabled={!hasProfileChanges() || isSavingProfile}
                            >
                              {isSavingProfile ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                resetProfileForm();
                                setIsEditingProfile(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">
                          Profile Completion Suggestions
                        </div>
                        {missingProfileFields.length === 0 ? (
                          <div className="text-sm text-green-700">
                            Your profile is complete.
                          </div>
                        ) : (
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {missingProfileFields.map((field) => (
                              <div key={field.key}>
                                Add your {field.label.toLowerCase()} to improve
                                profile trust and faster booking.
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Account Actions</div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingProfile(true)}
                          >
                            Edit Profile
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setChangePasswordOpen(true)}
                          >
                            Change Password
                          </Button>
                          <Button variant="outline" onClick={() => logout()}>
                            Logout
                          </Button>
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
                    <CardDescription>
                      Rebook your most used services instantly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {favoriteServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {service.category} • {service.frequency}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFavoriteRebook(service.name)}
                        >
                          Rebook
                        </Button>
                      </div>
                    ))}
                    {favoriteServices.length === 0 && (
                      <div className="text-xs text-muted-foreground">
                        Mark services as favorite to see them here.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods & Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddPayOpen(true)}
                      >
                        Add/Manage Methods
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInvoiceOpen(true)}
                      >
                        Invoices
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {userTransactions.slice(0, 3).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex justify-between text-xs"
                        >
                          <span>{tx.id}</span>
                          <span>₹{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requests & Favorites</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Current Requests</span>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/dashboard">Track</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Favorites</span>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/providers">Browse</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Manage Notifications</span>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/ai-service-assistant">Open</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support & Help</span>
                      <Button size="sm" variant="outline">
                        Live Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={currency}
                        onValueChange={(v) => setCurrency(v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={defaultMethod}
                        onValueChange={setDefaultMethod}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Default Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="netbanking">
                            Net Banking
                          </SelectItem>
                          <SelectItem value="wallet">Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Theme</span>
                      <Badge variant="secondary">System</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Privacy</span>
                      <Badge variant="secondary">Standard</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Details Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditingBooking ? "Edit Booking" : "Booking Details"}
              </DialogTitle>
              <DialogDescription>
                {isEditingBooking
                  ? "Modify your booking"
                  : "Complete information about your booking"}
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-2">
                {isEditingBooking ? (
                  <>
                    <div>
                      <Label htmlFor="edit-date">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-time">Time Slot</Label>
                      <select
                        id="edit-time"
                        className="w-full border p-2 rounded"
                        value={editForm.timeSlot}
                        onChange={(e) =>
                          setEditForm({ ...editForm, timeSlot: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {timeSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-address">Address</Label>
                      <Input
                        id="edit-address"
                        value={editForm.fullAddress}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            fullAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editForm.isUrgent}
                        onCheckedChange={(val) =>
                          setEditForm({ ...editForm, isUrgent: val })
                        }
                      />
                      <span>Urgent</span>
                    </div>
                    <div>
                      <Label htmlFor="edit-notes">Notes</Label>
                      <Input
                        id="edit-notes"
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm({ ...editForm, notes: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBookingDialogOpen(false);
                          setIsEditingBooking(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await api.put(`/bookings/${selectedBooking.id}`, {
                              date: editForm.date,
                              notes: editForm.notes,
                              fullAddress: editForm.fullAddress,
                              timeSlot: editForm.timeSlot,
                              isUrgent: editForm.isUrgent,
                            });
                            alert("Booking updated");
                            fetchDashboardData();
                          } catch (e) {
                            console.error("Edit failed", e);
                            alert("Update failed");
                          } finally {
                            setBookingDialogOpen(false);
                            setIsEditingBooking(false);
                          }
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {selectedBooking.service}
                      </div>
                      <Badge
                        variant={
                          selectedBooking.status === "Completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedBooking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Provider: {selectedBooking.provider}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      When: {selectedBooking.date}
                    </div>
                    <div className="text-sm">
                      Price: {selectedBooking.price}
                    </div>
                    <div className="pt-2">
                      <Button className="w-full" asChild>
                        <a
                          href={`/booking-confirmation?booking=BK${selectedBooking.id.toString().padStart(4, "0")}&service=${encodeURIComponent(selectedBooking.service)}`}
                        >
                          Go to Booking Page
                        </a>
                      </Button>
                    </div>
                  </>
                )}
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
                <Input
                  id="user-sch-date"
                  type="date"
                  value={schedule.date}
                  onChange={(e) =>
                    setSchedule({ ...schedule, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="user-sch-time">Time</Label>
                <Input
                  id="user-sch-time"
                  type="time"
                  value={schedule.time}
                  onChange={(e) =>
                    setSchedule({ ...schedule, time: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setScheduleOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setScheduleOpen(false);
                    alert("Schedule updated");
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Payment Method Dialog */}
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
                  <Input
                    id="user-name"
                    placeholder={userProfile?.name || "John Doe"}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAddPayOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setAddPayOpen(false);
                    alert("Payment method saved");
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* OTP Verification Dialog */}
        <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to your device
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="______" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOtpOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOtpOpen(false);
                    alert("Verified");
                  }}
                >
                  Verify
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* KYC Verification Dialog */}
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
                <Button variant="outline" onClick={() => setKycOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setKycOpen(false);
                    alert("KYC submitted");
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invoice Dialog */}
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invoice</DialogTitle>
              <DialogDescription>
                Download your invoice/receipt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="p-3 border rounded">
                Sample invoice details will appear here.
              </div>
              <Button
                onClick={() => {
                  const blob = new Blob(
                    [
                      JSON.stringify(
                        { sample: true, date: new Date().toISOString() },
                        null,
                        2,
                      ),
                    ],
                    { type: "application/json" },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "invoice.json";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter current and new password
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <div className="text-sm text-red-600">{passwordError}</div>
              )}
              {showForgotOption && (
                <div className="text-sm mt-1">
                  <a
                    href="/forgot-password"
                    className="text-blue-600 underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setChangePasswordOpen(false)}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Changing..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
