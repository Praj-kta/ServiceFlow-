import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Brain,
  Target,
  Compass,
  Search,
  MessageCircle,
  TrendingUp,
  Eye,
  Lightbulb,
  Zap,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Star,
  Home
} from "lucide-react";

export default function AIFeatures() {
  const aiFeatures = [
    {
      id: 'smart-matching',
      title: 'AI Smart Matching',
      description: 'Find the perfect service provider using AI analysis of expertise, location, availability, and quality scores',
      icon: Target,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      link: '/ai-smart-matching',
      features: ['Provider expertise analysis', 'Location optimization', 'Availability matching', 'Quality scoring'],
      status: 'Available'
    },
    {
      id: 'vastu-detection',
      title: 'AI Vastu Detection',
      description: 'Upload floor plans for instant vastu analysis with AI-powered recommendations and corrections',
      icon: Compass,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      link: '/vastu-detection',
      features: ['Floor plan upload', 'AI analysis', 'Detailed reports', 'Instant corrections'],
      status: 'Available'
    },
    {
      id: 'predictive-maintenance',
      title: 'Predictive Maintenance',
      description: 'AI predicts when your appliances and home systems need maintenance before issues occur',
      icon: TrendingUp,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      link: '/predictive-maintenance',
      features: ['Usage pattern analysis', 'Maintenance schedules', 'Issue prediction', 'Cost optimization'],
      status: 'Available'
    },
    {
      id: 'smart-chat',
      title: 'AI Service Assistant',
      description: '24/7 intelligent chatbot for service queries, vastu questions, and instant support',
      icon: MessageCircle,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      link: '/ai-service-assistant',
      features: ['24/7 availability', 'Service recommendations', 'Instant answers', 'Multi-language support'],
      status: 'Beta'
    },
    {
      id: 'visual-diagnosis',
      title: 'Visual Diagnosis',
      description: 'AI analyzes photos of problems to provide instant diagnosis and solution recommendations',
      icon: Eye,
      color: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-700',
      iconColor: 'text-teal-600',
      link: '/visual-diagnosis',
      features: ['Photo analysis', 'Problem identification', 'Solution suggestions', 'Cost estimation'],
      status: 'Available'
    },
    {
      id: 'smart-recommendations',
      title: 'Personalized Recommendations',
      description: 'AI learns your preferences to suggest services, providers, and maintenance schedules',
      icon: Lightbulb,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      link: '/recommendations',
      features: ['Learning preferences', 'Service suggestions', 'Provider matching', 'Schedule optimization'],
      status: 'Available'
    }
  ];

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
          <Button variant="outline" asChild>
            <a href="/user-dashboard?tab=services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Services
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of home services with our intelligent AI tools that learn, predict, and optimize your service experience
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className={`group hover:shadow-xl transition-all duration-300 border-2 ${feature.color} hover:scale-105 cursor-pointer`}>
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-4 rounded-2xl bg-white/80 backdrop-blur-sm w-fit mb-4 group-hover:bg-white transition-colors`}>
                    <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                    <Badge variant={feature.status === 'Available' ? 'default' : feature.status === 'Beta' ? 'secondary' : 'outline'}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription className={feature.textColor}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {feature.features.map((feat, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    asChild
                    disabled={feature.status === 'Coming Soon'}
                  >
                    <a href={feature.link}>
                      {feature.status === 'Coming Soon' ? 'Coming Soon' : `Try ${feature.title}`}
                      {feature.status !== 'Coming Soon' && <ArrowRight className="h-4 w-4 ml-2" />}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Statistics */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Performance Stats
            </h2>
            <p className="text-lg text-white/90">
              See how our AI is transforming service experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">98.7%</div>
              <div className="text-white/80">Match Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">2.3s</div>
              <div className="text-white/80">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">AI Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">94%</div>
              <div className="text-white/80">User Satisfaction</div>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Machine Learning Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Pattern Recognition</div>
                    <div className="text-sm text-muted-foreground">Identifies service patterns and user preferences</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Predictive Analytics</div>
                    <div className="text-sm text-muted-foreground">Forecasts maintenance needs and optimal schedules</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Natural Language Processing</div>
                    <div className="text-sm text-muted-foreground">Understands and responds to natural language queries</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Computer Vision</div>
                    <div className="text-sm text-muted-foreground">Analyzes images for problem diagnosis and vastu detection</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Data Encryption</div>
                    <div className="text-sm text-muted-foreground">All data is encrypted using industry-standard protocols</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Privacy First</div>
                    <div className="text-sm text-muted-foreground">Your personal information is never shared with third parties</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Local Processing</div>
                    <div className="text-sm text-muted-foreground">Sensitive data is processed locally on your device</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">GDPR Compliant</div>
                    <div className="text-sm text-muted-foreground">Fully compliant with global privacy regulations</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-card border border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Experience AI-Powered Services?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with our AI Smart Matching to find the perfect service provider, or explore vastu detection for your home design.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="px-8" asChild>
                  <a href="/ai-smart-matching">
                    <Target className="mr-2 h-5 w-5" />
                    Start Smart Matching
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="px-8" asChild>
                  <a href="/vastu-detection">
                    <Compass className="mr-2 h-5 w-5" />
                    Try Vastu Detection
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
