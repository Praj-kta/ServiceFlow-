import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Construction, 
  ArrowLeft, 
  MessageCircle, 
  Zap,
  Home as HomeIcon,
  Calendar,
  User,
  Lightbulb
} from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  suggestedActions?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction,
  suggestedActions = []
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
            <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">My Bookings</a>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-border bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="mx-auto p-4 bg-brand-100 rounded-full w-fit mb-4">
                <Icon className="h-12 w-12 text-brand-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-brand-50 rounded-lg p-6 border border-brand-200">
                <div className="flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-brand-600 animate-pulse" />
                </div>
                <p className="text-brand-700 font-medium mb-2">This page is under development!</p>
                <p className="text-brand-600 text-sm">
                  Continue chatting with our AI assistant to help build and customize this section of your ServiceFlow platform.
                </p>
              </div>

              {suggestedActions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">What you can do:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedActions.map((action, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="outline" asChild>
                  <a href="/user-dashboard?tab=services">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Services
                  </a>
                </Button>
                <Button asChild>
                  <a href="/dashboard">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Dashboard
                  </a>
                </Button>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Have specific requirements for this page? 
                  <Button variant="link" className="p-0 h-auto text-primary">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Continue the conversation to customize it!
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
