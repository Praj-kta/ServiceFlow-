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
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
};

type FormField =
  | "name"
  | "email"
  | "password"
  | "confirmPassword"
  | "phone"
  | "address"
  | "companyName"
  | "categories"
  | "experience"
  | "isAcceptedTerms";

type FormErrors = Partial<Record<FormField, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const nameRegex = /^[A-Za-z\s.'-]+$/;

const getStrongPasswordError = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character";
  }

  return "";
};

const getPasswordChecks = (password: string) => [
  {
    label: "At least 8 characters",
    passed: password.length >= 8,
  },
  {
    label: "One uppercase letter",
    passed: /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    passed: /[a-z]/.test(password),
  },
  {
    label: "One number",
    passed: /\d/.test(password),
  },
  {
    label: "One special character",
    passed: /[^A-Za-z0-9]/.test(password),
  },
];

const sanitizeNameInput = (value: string) =>
  value.replace(/[^A-Za-z\s.'-]/g, "");

export default function ProviderLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    companyName: '',
    categories: [] as string[],
    experience: '',
    isAcceptedTerms: false,
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup-provider');
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      location.pathname === '/login-provider' &&
      params.get('registered') === '1'
    ) {
      setSuccessMessage('Registration successful. Please sign in to continue.');
      const email = params.get('email');
      if (email) {
        setFormData((prev) => ({
          ...prev,
          email,
          password: '',
          confirmPassword: '',
        }));
      }
    } else {
      setSuccessMessage('');
    }
  }, [location.pathname, location.search]);

  const validateField = (
    field: FormField,
    nextFormData = formData,
  ) => {
    switch (field) {
      case "email":
        if (!nextFormData.email.trim()) {
          return submitAttempted ? "Email is required" : "";
        }
        return emailRegex.test(nextFormData.email.trim())
          ? ""
          : "Please enter a valid email address";
      case "password":
        if (!nextFormData.password.trim()) {
          return submitAttempted ? "Password is required" : "";
        }
        if (isSignUp) {
          return getStrongPasswordError(nextFormData.password);
        }
        return "";
      case "confirmPassword":
        if (!isSignUp) return "";
        if (!nextFormData.confirmPassword.trim()) {
          return submitAttempted ? "Please confirm your password" : "";
        }
        return nextFormData.password === nextFormData.confirmPassword
          ? ""
          : "Passwords do not match";
      case "phone":
        if (!isSignUp) return "";
        if (!nextFormData.phone.trim()) {
          return submitAttempted ? "Business phone is required" : "";
        }
        return phoneRegex.test(nextFormData.phone)
          ? ""
          : "Phone number must be exactly 10 digits";
      case "name":
        if (!isSignUp) return "";
        if (!nextFormData.name.trim()) {
          return submitAttempted ? "Owner name is required" : "";
        }
        return nameRegex.test(nextFormData.name.trim())
          ? ""
          : "Only letters are allowed in owner name";
      case "companyName":
        if (!isSignUp) return "";
        return nextFormData.companyName.trim()
          ? ""
          : submitAttempted
            ? "Business name is required"
            : "";
      case "address":
        if (!isSignUp) return "";
        return nextFormData.address.trim()
          ? ""
          : submitAttempted
            ? "Service area is required"
            : "";
      case "categories":
        if (!isSignUp) return "";
        return nextFormData.categories.length
          ? ""
          : submitAttempted
            ? "Please select at least one service category"
            : "";
      case "experience":
        if (!isSignUp) return "";
        return nextFormData.experience
          ? ""
          : submitAttempted
            ? "Please select your experience level"
            : "";
      case "isAcceptedTerms":
        if (!isSignUp) return "";
        return nextFormData.isAcceptedTerms
          ? ""
          : submitAttempted
            ? "Please accept the Provider Terms & Conditions"
            : "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    field: FormField,
    value: string | string[] | boolean,
  ) => {
    const normalizedValue =
      field === "name" && typeof value === "string"
        ? sanitizeNameInput(value)
        : field === "phone" && typeof value === "string"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value;

    const nextFormData = { ...formData, [field]: normalizedValue };
    setFormData(nextFormData);
    setError('');
    setSuccessMessage('');

    const nextErrors: FormErrors = {
      ...fieldErrors,
      [field]: validateField(field, nextFormData),
    };

    if (field === "password" && isSignUp) {
      nextErrors.confirmPassword = validateField("confirmPassword", nextFormData);
    }

    setFieldErrors(nextErrors);
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!trimmedPassword) {
      errors.password = "Password is required";
    } else if (isSignUp) {
      const passwordError = getStrongPasswordError(formData.password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    if (isSignUp) {
      if (!formData.companyName.trim()) {
        errors.companyName = "Business name is required";
      }

      if (!formData.name.trim()) {
        errors.name = "Owner name is required";
      } else if (!nameRegex.test(formData.name.trim())) {
        errors.name = "Only letters are allowed in owner name";
      }

      if (!formData.categories.length) {
        errors.categories = "Please select at least one service category";
      }

      if (!formData.phone.trim()) {
        errors.phone = "Business phone is required";
      } else if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }

      if (!formData.address.trim()) {
        errors.address = "Service area is required";
      }

      if (!formData.experience) {
        errors.experience = "Please select your experience level";
      }

      if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!formData.isAcceptedTerms) {
        errors.isAcceptedTerms = "Please accept the Provider Terms & Conditions";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSubmitAttempted(true);

    if (!validateForm()) {
      setError('Please fix the highlighted fields.');
      return;
    }
    
    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();

      if (isSignUp) {
        // Provider Registration
        await api.post<AuthResponse>('/auth/register', {
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
        setFormData({
          name: '',
          email: normalizedEmail,
          password: '',
          confirmPassword: '',
          phone: '',
          address: '',
          companyName: '',
          categories: [],
          experience: '',
          isAcceptedTerms: false,
        });
        navigate(`/login-provider?registered=1&email=${encodeURIComponent(normalizedEmail)}`);
      } else {
        // Provider Login
        const res = await api.post<AuthResponse>('/auth/login', {
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

  const getFieldStyles = (field: FormField, baseClassName = "") =>
    cn(
      baseClassName,
      fieldErrors[field] && "border-red-300 bg-red-50/40 focus-visible:ring-red-200",
    );

  const getLabelStyles = (field: FormField) =>
    cn(fieldErrors[field] && "text-red-600");

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
            <a href="/">
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
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="businessName" className={getLabelStyles("companyName")}>Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="businessName"
                        type="text"
                        placeholder="Enter your business name"
                        className={getFieldStyles("companyName", "pl-10")}
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        required
                      />
                    </div>
                    {fieldErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ownerName" className={getLabelStyles("name")}>Owner Name</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ownerName"
                        type="text"
                        placeholder="Enter owner's full name"
                        className={getFieldStyles("name", "pl-10")}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className={getLabelStyles("categories")}>Service Categories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={getFieldStyles("categories", "w-full justify-between text-left")}
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
                    {fieldErrors.categories && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.categories}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className={getLabelStyles("email")}>Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your business email"
                    className={getFieldStyles("email", "pl-10")}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="phone" className={getLabelStyles("phone")}>Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="Enter 10 digit phone number"
                      className={getFieldStyles("phone", "pl-10")}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div>
                  <Label htmlFor="serviceArea" className={getLabelStyles("address")}>Service Area</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="serviceArea"
                      type="text"
                      placeholder="Enter your service area/city"
                      className={getFieldStyles("address", "pl-10")}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  {fieldErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div>
                  <Label htmlFor="experience" className={getLabelStyles("experience")}>Years of Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger className={getFieldStyles("experience")}>
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
                  {fieldErrors.experience && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.experience}</p>
                  )}
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
                <Label htmlFor="password" className={getLabelStyles("password")}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={getFieldStyles("password", "pl-10 pr-10")}
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
                {isSignUp &&
                  getPasswordChecks(formData.password).some((rule) => !rule.passed) && (
                    <div className="mt-2 space-y-1 text-sm">
                      {getPasswordChecks(formData.password)
                        .filter((rule) => !rule.passed)
                        .map((rule) => (
                          <p key={rule.label} className="text-red-600">
                            {rule.label}
                          </p>
                        ))}
                    </div>
                  )}
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword" className={getLabelStyles("confirmPassword")}>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className={getFieldStyles("confirmPassword", "pl-10")}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.isAcceptedTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange('isAcceptedTerms', checked === true)
                    }
                  />
                  <Label htmlFor="terms" className={cn("text-sm", getLabelStyles("isAcceptedTerms"))}>
                    {isSignUp ? 'I agree to the Provider Terms & Conditions' : 'Remember me'}
                  </Label>
                </div>
                {isSignUp && fieldErrors.isAcceptedTerms && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.isAcceptedTerms}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                <Briefcase className="h-4 w-4 mr-2" />
                {loading ? 'Please wait...' : (isSignUp ? 'Create Provider Account' : 'Sign In to Dashboard')}
              </Button>
              </form>

              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:underline"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail(formData.email || '');
                      setForgotError('');
                      setForgotMessage('');
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? 'Already a provider?' : "New to ServiceFlow?"}
                  <button
                    onClick={() =>
                      navigate(isSignUp ? '/login-provider' : '/signup-provider')
                    }
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
