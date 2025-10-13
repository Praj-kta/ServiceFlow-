import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingDashboard from "./pages/BookingDashboard";
import BookService from "./pages/BookService";
import BookMachineService from "./pages/BookMachineService";
import UserLogin from "./pages/UserLogin";
import ProviderLogin from "./pages/ProviderLogin";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import MachineServices from "./pages/MachineServices";
import Providers from "./pages/Providers";
import AIFeatures from "./pages/AIFeatures";
import PaymentRequest from "./pages/PaymentRequest";
import DesignGenerator from "./pages/DesignGenerator";
import PrecisionTools from "./pages/PrecisionTools";
import MaterialLibrary from "./pages/MaterialLibrary";
import AutoCalculate from "./pages/AutoCalculate";
import AISmartMatching from "./pages/AISmartMatching";
import VastuDetection from "./pages/VastuDetection";
import VehicleServices from "./pages/VehicleServices";
import DesignRenovationService from "./pages/DesignRenovationService";
import ContractBooking from "./pages/ContractBooking";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import VisualDiagnosis from "./pages/VisualDiagnosis";
import PersonalizedRecommendations from "./pages/PersonalizedRecommendations";
import BookingConfirmation from "./pages/BookingConfirmation";
import AIServiceAssistant from "./pages/AIServiceAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<BookingDashboard />} />
          <Route path="/login-user" element={<UserLogin />} />
          <Route path="/signup-user" element={<UserLogin />} />
          <Route path="/login-provider" element={<ProviderLogin />} />
          <Route path="/signup-provider" element={<ProviderLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/ProviderDashboard" element={<ProviderDashboard />} />
          <Route path="/book-service" element={<BookService />} />
          <Route path="/book-machine-service" element={<BookMachineService />} />
          <Route path="/machine-services" element={<MachineServices />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/ai-features" element={<AIFeatures />} />
          <Route path="/payment-request" element={<PaymentRequest />} />
          <Route path="/design-generator" element={<DesignGenerator />} />
          <Route path="/precision-tools" element={<PrecisionTools />} />
          <Route path="/material-library" element={<MaterialLibrary />} />
          <Route path="/auto-calculate" element={<AutoCalculate />} />
          <Route path="/ai-smart-matching" element={<AISmartMatching />} />
          <Route path="/vastu-detection" element={<VastuDetection />} />
          <Route path="/vehicle-services" element={<VehicleServices />} />
          <Route path="/design-renovation-service" element={<DesignRenovationService />} />
          <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
          <Route path="/visual-diagnosis" element={<VisualDiagnosis />} />
          <Route path="/recommendations" element={<PersonalizedRecommendations />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                    <Route path="/contract-booking" element={<ContractBooking />} />
          <Route path="/ai-chat" element={<AIServiceAssistant />} />
          <Route path="/ai-service-assistant" element={<AIServiceAssistant />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
