import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Home,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { loginSchema, registerSchema } from "@/lib/validation/authValidation";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  // const
  // handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setValidationError('');

  //   // Validate required fields
  //   if (!formData.email || !formData.email.trim()) {
  //     setValidationError('Email is required');
  //     return;
  //   }

  //   if (!formData.password || !formData.password.trim()) {
  //     setValidationError('Password is required');
  //     return;
  //   }

  //   // Email format validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(formData.email)) {
  //     setValidationError('Please enter a valid email address');
  //     return;
  //   }

  //   // Password length validation
  //   if (formData.password.length < 6) {
  //     setValidationError('Password must be at least 6 characters');
  //     return;
  //   }

  //   // Additional validation for sign up
  //   if (isSignUp) {
  //     if (!formData.name || !formData.name.trim()) {
  //       setValidationError('Name is required');
  //       return;
  //     }
  //   }

  //   setLoading(true);

  //   try {
  //     if (isSignUp) {
  //       // Registration
  //       const res = await api.post('/auth/register', {
  //         ...formData,
  //         role: 'user'
  //       });
  //       console.log("Registration response:", res);
  //       localStorage.setItem('authToken', res.token);
  //       localStorage.setItem('userId', res.user.id);
  //       localStorage.setItem('userRole', res.user.role);
  //       window.location.href = '/user-dashboard';
  //     } else {
  //       // Login
  //       const res = await api.post('/auth/login', {
  //         email: formData.email,
  //         password: formData.password
  //       });
  //       console.log("Login response:", res);
  //       localStorage.setItem('authToken', res.token);
  //       localStorage.setItem('userId', res.user.id);
  //       localStorage.setItem('userRole', res.user.role);
  //       localStorage.setItem('user', JSON.stringify(res.user));
  //       window.location.href = '/user-dashboard';
  //     }
  //   } catch (err: any) {
  //     setValidationError(err.message || 'Authentication failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const schema = isSignUp ? registerSchema : loginSchema;

    // validate correct fields
    const dataToValidate = isSignUp
      ? formData
      : {
          email: formData.email,
          password: formData.password,
        };

    const { error } = schema.validate(dataToValidate, {
      abortEarly: true,
    });

    if (error) {
      setValidationError(error.details[0].message);
      return;
    }
    
    // Additional validation for sign up
    if (isSignUp) {
      if (!formData.name || !formData.name.trim()) {
        setError('Name is required');
        return;
      }
    }
    
    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();

      if (isSignUp) {
        // Registration
        const res = await api.post('/auth/register', {
          ...formData,
          role: 'user'
        });

        localStorage.setItem("authToken", res.token);
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userRole", res.user.role);
        localStorage.setItem("user", JSON.stringify(res.user));

        window.location.href = "/user-dashboard";

      } else {
        // Login
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("authToken", res.token);
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userRole", res.user.role);
        localStorage.setItem("user", JSON.stringify(res.user));

        window.location.href = "/user-dashboard";
      }

    } catch (err: any) {
      setValidationError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <Button variant="outline" asChild >
            <a href="/user-dashboard?tab=services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Services
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* User Badge */}
          <div className="text-center mb-8">
            <div className="mx-auto p-4 rounded-full bg-blue-100 w-fit mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? "Create User Account" : "Welcome Back, User"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Start booking services for your home"
                : "Sign in to access your dashboard"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Create your account to get started"
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {validationError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter your address"
                        className="pl-10"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
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
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
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
                  <Checkbox id="remember" checked={formData.isAcceptedTerms} onCheckedChange={() => handleInputChange("isAcceptedTerms", !formData.isAcceptedTerms)} />
                  <Label htmlFor="remember" className="text-sm">
                    {isSignUp
                      ? "I agree to the Terms & Conditions"
                      : "Remember me"}
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading || ( !formData.isAcceptedTerms && isSignUp)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading
                    ? "Please wait..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              {/* forgot password link */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary underline"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail(formData.email || '');
                      setForgotError('');
                      setForgotMessage('');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:underline ml-1"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
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
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-foreground mb-4">
              What you can do as a User:
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Book Home Services
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Track Service Progress
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                AI Design Services
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Manage Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
