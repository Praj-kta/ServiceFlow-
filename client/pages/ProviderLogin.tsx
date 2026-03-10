import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Home,
  Phone,
  MapPin,
  CheckCircle,
  Briefcase,
  Building,
  FileText
} from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ProviderLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    companyName: '',
    categories: [] as string[],
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!formData.email || !formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password || !formData.password.trim()) {
      setError('Password is required');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password length validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Additional validation for provider sign up
    if (isSignUp) {
      if (!formData.name || !formData.name.trim()) {
        setError('Owner name is required');
        return;
      }
      if (!formData.companyName || !formData.companyName.trim()) {
        setError('Business name is required');
        return;
      }
      if (!formData.categories?.length) {
        setError('Please select at least one service category');
        return;
      }
    }
    
    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();

      if (isSignUp) {
        // Provider Registration
        const res: any = await api.post('/auth/register', {
          name: formData.name,
          email: normalizedEmail,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          role: 'provider',
          providerProfile: {
            companyName: formData.companyName,
            categories: formData.categories,
            experience: formData.experience
          }
        });
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('userRole', res.user.role);
        window.location.href = '/provider-dashboard';
      } else {
        // Provider Login
        const res: any = await api.post('/auth/login', {
          email: normalizedEmail,
          password: formData.password
        });
        console.log(res)
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('userRole', res.user.role);
        window.location.href = '/provider-dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Provider Badge */}
          <div className="text-center mb-8">
            <div className="mx-auto p-4 rounded-full bg-green-100 w-fit mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? 'Become a Service Provider' : 'Welcome Back, Provider'}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp ? 'Join our network of trusted professionals' : 'Sign in to manage your services'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? 'Provider Registration' : 'Provider Sign In'}</CardTitle>
              <CardDescription>
                {isSignUp ? 'Create your provider account to start offering services' : 'Access your provider dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="businessName"
                        type="text"
                        placeholder="Enter your business name"
                        className="pl-10"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ownerName"
                        type="text"
                        placeholder="Enter owner's full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Service Categories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between text-left"
                        >
                          {formData.categories.length
                            ? formData.categories.join(', ')
                            : 'Select service categories'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[
                          { value: 'home-services', label: 'Home Services' },
                          { value: 'appliances', label: 'Appliance Repair' },
                          { value: 'vehicle', label: 'Vehicle Services' },
                          { value: 'design', label: 'Design & Renovation' },
                          { value: 'contract', label: 'Contract-Based' },
                          { value: 'ai', label: 'AI Features' },
                        ].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={formData.categories.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const nextCategories = checked
                                ? [...formData.categories, option.value]
                                : formData.categories.filter((c) => c !== option.value);
                              handleInputChange('categories', nextCategories);
                            }}
                          >
                            {option.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your business email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="phone">Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="serviceArea"
                      type="text"
                      placeholder="Enter your service area/city"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isSignUp && (
                <div>
                  <Label htmlFor="license">Business License Number (Optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="license"
                      type="text"
                      placeholder="Enter license number if applicable"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  {isSignUp ? 'I agree to the Provider Terms & Conditions' : 'Remember me'}
                </Label>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                <Briefcase className="h-4 w-4 mr-2" />
                {loading ? 'Please wait...' : (isSignUp ? 'Create Provider Account' : 'Sign In to Dashboard')}
              </Button>
              </form>

              {!isSignUp && (
                <div className="text-center">
                  <a href="#" className="text-sm text-green-600 hover:underline">
                    Forgot your password?
                  </a>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? 'Already a provider?' : "New to ServiceFlow?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-green-600 hover:underline ml-1"
                  >
                    {isSignUp ? 'Sign In' : 'Register as Provider'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* forgot password dialog */}
          <AlertDialog open={showForgot} onOpenChange={setShowForgot}>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Password</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter your registered email to receive a password reset link.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                {forgotError && <p className="text-sm text-red-600">{forgotError}</p>}
                {forgotMessage && <p className="text-sm text-green-600">{forgotMessage}</p>}
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <AlertDialogCancel onClick={() => setShowForgot(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setForgotError('');
                    setForgotMessage('');
                    if (!forgotEmail.trim()) {
                      setForgotError('Email is required');
                      return;
                    }
                    try {
                      await api.post('/auth/forgot-password', { email: forgotEmail });
                      setForgotMessage('If the email exists, a reset link has been sent');
                    } catch (err: any) {
                      setForgotError(err.message || 'Error sending reset link');
                    }
                  }}
                  className="bg-primary text-white"
                >
                  Send Link
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Provider Benefits */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-foreground mb-4">Benefits of Being a Provider:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Steady Income
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Business Growth
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                AI Tools & Insights
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Verified Badge
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
