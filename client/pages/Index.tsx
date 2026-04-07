import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Home,
  Car,
  Palette,
  Brain,
  MapPin,
  Star,
  Clock,
  Shield,
  Zap,
  Wrench,
  Lightbulb,
  Phone,
  Calendar,
  ArrowRight,
  Play,
  MessageCircle,
  Sparkles,
  Search,
  Users,
  Settings,
  Bell,
  Send,
  Bot,
  Menu,
} from "lucide-react";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

export default function Index() {
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("signin");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [aiChatModalOpen, setAiChatModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUser, setIsUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message:
        "Hello! I'm your AI assistant. How can I help you with ServiceFlow today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const isLoggedIn = () => !!localStorage.getItem("sf_user");
  const requireLogin = (onSuccess: () => void) => {
    if (!isLoggedIn()) {
      setAuthType("signin");
      setAuthModalOpen(true);
      return;
    }
    onSuccess();
  };

  // AI Chat Functions
  const generateAIResponse = (userMessage) => {
    const responses = {
      home: "I can help you with home services! We offer cleaning, plumbing, electrical work, pest control, and HVAC services. What specific service do you need?",
      vehicle:
        "For vehicle services, we provide car repair, bike service, roadside assistance, towing, and emergency help. What type of vehicle issue are you facing?",
      design:
        "Our design services include interior design, 2D/3D planning, renovation, Vastu consulting, and architecture. Are you looking to redesign your space?",
      ai: "Our AI features include Vastu detection, design suggestions, smart predictions, personalization, and automation. Which AI feature interests you?",
      booking:
        "To book a service, simply select your service category, choose a provider, pick a time slot, and we'll handle the rest! Would you like me to guide you through the process?",
      pricing:
        "Our pricing varies by service type. Home services start from ₹200, vehicle services from ₹300, and design consultations from ₹500. All prices include service guarantee!",
      help: "I'm here to help! You can ask me about our services, pricing, booking process, AI features, or anything else about ServiceFlow.",
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return "Thanks for your question! I can help you with home services, vehicle services, design & renovation, AI features, booking process, and pricing. What would you like to know more about?";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), type: "user", message: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        message: generateAIResponse(chatInput),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setChatInput("");
  };

  const serviceCategories = [
    {
      id: "home",
      title: "Home Services",
      description: "Cleaning, plumbing, electrical, pest control & more",
      icon: Home,
      color: "services-home",
      bgGradient: "from-green-50 to-emerald-50",
      services: [
        "House Cleaning",
        "Plumbing",
        "Electrical Work",
        "Pest Control",
        "HVAC Services",
      ],
    },
    {
      id: "machine",
      title: "Machine Services",
      description: "AC, washing machine, refrigerator & appliance repair",
      icon: Settings,
      color: "services-machine",
      bgGradient: "from-blue-50 to-cyan-50",
      services: [
        "AC Repair",
        "Washing Machine",
        "Refrigerator",
        "Microwave",
        "Water Heater",
      ],
    },
    {
      id: "vehicle",
      title: "Vehicle Services",
      description: "Car/bike repair, towing, roadside assistance",
      icon: Car,
      color: "services-vehicle",
      bgGradient: "from-purple-50 to-violet-50",
      services: [
        "Car Repair",
        "Bike Service",
        "Roadside Assistance",
        "Towing",
        "Emergency Help",
      ],
    },
    {
      id: "design",
      title: "Design & Renovation",
      description: "Interior design, structural changes, vastu compliance",
      icon: Palette,
      color: "services-design",
      bgGradient: "from-amber-50 to-orange-50",
      services: [
        "Interior Design",
        "2D/3D Planning",
        "Renovation",
        "Vastu Consulting",
        "Architecture",
      ],
    },
    {
      id: "contract",
      title: "Contract-Based Services",
      description: "Construction, interiors, and structural projects",
      icon: Wrench,
      color: "brand-600",
      bgGradient: "from-brand-50 to-brand-100",
      services: [
        "New Home Construction",
        "Apartment Project",
        "Café Interior Design",
        "Hotel / Bar / Resort Fitout",
        "Office Interior Design",
        "Civil & Structural Work",
        "Tiles & Flooring",
      ],
    },
    {
      id: "ai",
      title: "AI Features",
      description: "Smart predictions, vastu detection, design suggestions",
      icon: Brain,
      color: "services-ai",
      bgGradient: "from-indigo-50 to-purple-50",
      services: [
        "Vastu Detection",
        "Design AI",
        "Smart Predictions",
        "Personalization",
        "Automation",
      ],
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Location-Based Services",
      description:
        "Find services available in your area with real-time tracking",
    },
    {
      icon: Star,
      title: "Verified Professionals",
      description: "All service providers are background-checked and rated",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Track your service progress with live updates and ETA",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "UPI, cards, wallets - all payments are encrypted and secure",
    },
  ];

  const siteBackgroundImage =
    "https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=1600&q=80";

  const serviceBackgrounds: Record<string, string> = {
    home: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    machine:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    vehicle:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
    design:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    ai: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  };

  console.log("User from localStorage:", isUser);
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${siteBackgroundImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-white/85 backdrop-blur-sm" />
      <div className="relative min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
        {/* Header */}
        {/* <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Home
            </a>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell onClick={() => setNotificationsOpen(true)} className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAuthType('signin');
                setAuthModalOpen(true);
              }}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setAuthType('getstarted');
                setAuthModalOpen(true);
              }}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header> */}
        <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                ServiceFlow
              </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="flex items-center text-muted-foreground hover:text-primary"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </a>

              <Bell
                onClick={() => setNotificationsOpen(true)}
                className="h-5 w-5 cursor-pointer"
              />

              {!isUser ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthType("signin");
                    setAuthModalOpen(true);
                }}
              >
                Sign In
              </Button>) :
                (
                  <Button
                    size="sm"
                    onClick={() => {isUser.role === 'user' ? window.location.href = '/user-dashboard' : window.location.href = '/provider-dashboard';}}
                  >
                    Dashboard
                  </Button>

                )
              }

              <Button
                size="sm"
                onClick={() => {
                  setAuthType("getstarted");
                  setAuthModalOpen(true);
                }}
              >
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white p-4 space-y-3">
              <Button className="w-full" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>

              <Button
                className="w-full"
                onClick={() => {
                  setAuthType("getstarted");
                  setAuthModalOpen(true);
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setAiChatModalOpen(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Service Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Complete
              <span className="text-primary block">Service Solution</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              From home services to vehicle repair, design consultation to
              AI-powered recommendations. Everything you need, delivered with
              LiveFlow animations and smart technology.
            </p>

            {/* Location Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option>Select Location</option>
                  <option>Mumbai, Maharashtra</option>
                  <option>Delhi, NCR</option>
                  <option>Bangalore, Karnataka</option>
                  <option>Hyderabad, Telangana</option>
                  <option>Chennai, Tamil Nadu</option>
                </select>
              </div>
              <Button
                size="lg"
                className="px-8"
                onClick={() =>
                  requireLogin(() => {
                    window.location.href = "/book-service";
                  })
                }
              >
                <Search className="h-5 w-5 mr-2" />
                Find Services
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={() => setDemoModalOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Service Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From everyday maintenance to specialized design work, we've got
              you covered with professional services and AI-powered solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${category.bgGradient} hover:scale-105 cursor-pointer`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-sm w-fit mb-4 group-hover:bg-white transition-colors">
                      <IconComponent
                        className={`h-8 w-8 text-${category.color}`}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <Button
                        className="w-full"
                        onClick={() =>
                          requireLogin(() => {
                            const url =
                              category.id === "machine"
                                ? "/book-machine-service"
                                : category.id === "ai"
                                  ? "/ai-features"
                                  : category.id === "home"
                                    ? "/book-service"
                                    : category.id === "vehicle"
                                      ? "/vehicle-services"
                                      : category.id === "design"
                                        ? "/design-renovation-service"
                                        : category.id === "contract"
                                          ? "/contract-service?service=new-home-construction"
                                          : "/book-service";
                            window.location.href = url;
                          })
                        }
                      >
                        Book {category.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* AI Assistant Preview */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 px-3 py-1 bg-white/20 text-white border-white/30">
                  <Brain className="h-4 w-4 mr-2" />
                  AI-Powered
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Meet Your Smart Assistant
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Get instant vastu analysis, design suggestions, and
                  personalized service recommendations. Our AI learns your
                  preferences to provide better solutions every time.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-3 text-yellow-300" />
                    <span>Instant Vastu Detection & Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-3 text-purple-300" />
                    <span>AI-Generated Design Suggestions</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-3 text-green-300" />
                    <span>24/7 Smart Chat Support</span>
                  </div>
                </div>
                <Button
                  className="bg-white text-brand-600 hover:bg-white/90"
                  size="lg"
                  onClick={() => {
                    setAiChatModalOpen(true);
                    setChatMessages([
                      {
                        id: Date.now(),
                        type: "ai",
                        message:
                          "Welcome! I’m your AI assistant. I’ll guide you through using ServiceFlow.",
                      },
                      {
                        id: Date.now() + 1,
                        type: "ai",
                        message:
                          "You can: 1) Book home, machine, or vehicle services, 2) Launch the Design Studio for 2D/3D plans, 3) Get Vastu analysis and smart recommendations.",
                      },
                      {
                        id: Date.now() + 2,
                        type: "ai",
                        message:
                          "Ask me: ‘How do I book a service?’, ‘Open Design Studio’, or ‘Check Vastu’.",
                      },
                    ]);
                  }}
                >
                  Try AI Assistant
                </Button>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm">
                        🏠 "Help me check vastu for my new apartment"
                      </p>
                    </div>
                    <div className="bg-white/30 rounded-lg p-3 ml-4">
                      <p className="text-sm">
                        ✨ I can analyze your floor plan! Upload an image and
                        I'll check vastu compliance and suggest improvements.
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm">
                        🎨 "Also suggest interior design ideas"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ServiceFlow?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with cutting-edge technology for seamless service
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-0 bg-white/60 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="mx-auto p-3 bg-primary/10 rounded-xl w-fit mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    ServiceFlow
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your complete service solution powered by AI and delivered
                  with care.
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Services</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Home Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Vehicle Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Design & Renovation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      AI Features
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Partners
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>
                &copy; 2024 ServiceFlow. All rights reserved. Built with ���️
                for better service experiences.
              </p>
            </div>
          </div>
        </footer>

        {/* AI Chat Modal */}
        <Dialog open={aiChatModalOpen} onOpenChange={setAiChatModalOpen}>
          <DialogContent className="max-w-2xl max-h-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Assistant Chat
              </DialogTitle>
              <DialogDescription>
                Ask me anything about ServiceFlow's features and services
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col h-96">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white border border-border"
                      }`}
                    >
                      {msg.type === "ai" && (
                        <div className="flex items-center mb-1">
                          <Bot className="h-3 w-3 mr-1 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            AI Assistant
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2 mt-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me about ServiceFlow..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Questions */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "How to book a service?",
                    "What services do you offer?",
                    "AI features available?",
                    "Pricing information?",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setChatInput(question);
                        handleSendMessage();
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications / Bills Modal */}
        <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications & Bills</DialogTitle>
              <DialogDescription>
                Important updates and recent invoices
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="p-3 border rounded">
                Invoice #INV-1024 • ₹1,200 • House Cleaning • Paid
              </div>
              <div className="p-3 border rounded">
                Invoice #INV-1025 • ₹800 • AC Service • Pending
              </div>
              <div className="p-3 border rounded">
                Design Consultation scheduled • Tomorrow 11:00 AM
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Demo Modal */}
        <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                ServiceFlow Demo
              </DialogTitle>
              <DialogDescription>
                Watch how ServiceFlow revolutionizes home services with
                AI-powered solutions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Video Section */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Demo Video</h3>
                    <p className="text-gray-300 mb-4">
                      Experience ServiceFlow's complete ecosystem
                    </p>
                    <Button className="bg-white text-black hover:bg-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      Play Demo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Demo Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Home Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete home maintenance solutions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Vehicle Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Professional automotive care
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">AI-Powered</h4>
                    <p className="text-sm text-muted-foreground">
                      Smart recommendations & automation
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Demo Stats */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                <h4 className="font-semibold mb-4 text-center">
                  What makes ServiceFlow special?
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">
                      Happy Customers
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">
                      Service Providers
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">
                      Customer Satisfaction
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">
                      AI Support
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <a href="/dashboard">
                    Get Started Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDemoModalOpen(false)}
                >
                  Close Demo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          authType={authType}
        />
        {/* Floating Chat and WhatsApp Assistants */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <Button
            className="rounded-full h-12 w-12 p-0 shadow-lg"
            onClick={() => requireLogin(() => setAiChatModalOpen(true))}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <a
            href="https://wa.me/15551234567?text=Hello%20ServiceFlow%20Assistant"
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button
              variant="outline"
              className="rounded-full h-12 w-12 p-0 shadow-lg bg-green-500 text-white hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
