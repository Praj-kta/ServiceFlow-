import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, ArrowRight, Home, Briefcase } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authType: 'signin' | 'getstarted';
}

export default function AuthModal({ isOpen, onClose, authType }: AuthModalProps) {
  const title = authType === 'signin' ? 'Sign In' : 'Get Started';
  const description = authType === 'signin' 
    ? 'Choose your account type to sign in' 
    : 'Choose how you want to get started with ServiceFlow';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* For Users */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 rounded-full bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">For Users</CardTitle>
              <CardDescription>
                Book services, track orders, and manage your home needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Book home services
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Track service progress
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Manage payments
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  AI design services
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href={authType === 'signin' ? '/login-user' : '/signup-user'}>
                  <Home className="h-4 w-4 mr-2" />
                  Continue as User
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* For Providers */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500/50 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 rounded-full bg-green-50 w-fit mb-4 group-hover:bg-green-100 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">For Providers</CardTitle>
              <CardDescription>
                Offer services, manage jobs, and grow your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  Manage service requests
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  Track earnings
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  Business analytics
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  AI tools & insights
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <a href={authType === 'signin' ? '/login-provider' : '/signup-provider'}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Continue as Provider
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
