import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Compass,
  Upload,
  Camera,
  FileImage,
  Brain,
  FileText,
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Eye,
  ArrowRight,
  Download,
  Share2,
  Save,
  RotateCcw,
  Info,
  Lightbulb,
  Target,
  Home,
  MapPin,
  Clock,
  Calendar,
  User,
  Settings,
  Layers,
  Grid3X3,
  Square,
  Triangle,
  Circle,
  Star,
  Award,
  Crown,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";
import { useState } from "react";

export default function VastuDetection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const steps = [
    { id: 1, title: "Upload Floor Plan", icon: Upload },
    { id: 2, title: "AI Analysis", icon: Brain },
    { id: 3, title: "Detailed Report", icon: FileText },
    { id: 4, title: "Instant Corrections", icon: Wrench }
  ];

  const directions = [
    { name: "North", angle: 0, element: "धन (Wealth)", color: "text-red-600", good: ["Main entrance", "Office", "Treasury"] },
    { name: "North-East", angle: 45, element: "ईशान (Ishaan)", color: "text-purple-600", good: ["Prayer room", "Water tank", "Study"] },
    { name: "East", angle: 90, element: "सूर्य (Surya)", color: "text-orange-600", good: ["Windows", "Balcony", "Meditation"] },
    { name: "South-East", angle: 135, element: "अग्नि (Agni)", color: "text-red-500", good: ["Kitchen", "Electrical room", "Boiler"] },
    { name: "South", angle: 180, element: "यम (Yama)", color: "text-gray-600", good: ["Bedroom", "Storage", "Heavy furniture"] },
    { name: "South-West", angle: 225, element: "निऋति (Nirriti)", color: "text-brown-600", good: ["Master bedroom", "Safe", "Storeroom"] },
    { name: "West", angle: 270, element: "वरुण (Varuna)", color: "text-blue-600", good: ["Dining room", "Living room", "Guest room"] },
    { name: "North-West", angle: 315, element: "वायु (Vayu)", color: "text-gray-500", good: ["Guest room", "Garage", "Bathroom"] }
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStep(2);
    
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisResults({
            overallScore: 78,
            compliance: {
              excellent: 4,
              good: 3,
              needsImprovement: 2,
              critical: 1
            },
            directions: {
              north: { score: 90, status: "excellent", room: "Main Entrance", feedback: "Perfect placement for main entrance" },
              northeast: { score: 85, status: "excellent", room: "Prayer Room", feedback: "Ideal location for spiritual activities" },
              east: { score: 70, status: "good", room: "Living Room", feedback: "Good natural light, consider more windows" },
              southeast: { score: 95, status: "excellent", room: "Kitchen", feedback: "Perfect for kitchen as per Agni element" },
              south: { score: 60, status: "needs_improvement", room: "Bedroom", feedback: "Consider moving heavy furniture here" },
              southwest: { score: 88, status: "excellent", room: "Master Bedroom", feedback: "Excellent for stability and rest" },
              west: { score: 55, status: "needs_improvement", room: "Storage", feedback: "Good for storage, add dining area" },
              northwest: { score: 40, status: "critical", room: "Bathroom", feedback: "Bathroom in Vayu corner needs correction" }
            },
            elements: {
              fire: { score: 88, locations: ["Kitchen", "Electrical panel"], compliance: "good" },
              water: { score: 45, locations: ["Bathroom", "Kitchen sink"], compliance: "needs_improvement" },
              earth: { score: 75, locations: ["Center", "South rooms"], compliance: "good" },
              air: { score: 52, locations: ["Windows", "Ventilation"], compliance: "needs_improvement" },
              space: { score: 82, locations: ["Center courtyard", "Open areas"], compliance: "good" }
            },
            recommendations: [
              {
                priority: "high",
                issue: "Bathroom in North-West corner",
                solution: "Install a small mirror on the north wall and keep the area well-lit",
                impact: "Improves health and relationships"
              },
              {
                priority: "medium", 
                issue: "Missing water element in North-East",
                solution: "Place a small water fountain or aquarium in the North-East corner",
                impact: "Enhances prosperity and peace"
              },
              {
                priority: "medium",
                issue: "South wall needs strengthening",
                solution: "Place heavy furniture like wardrobe or bookshelf along the south wall",
                impact: "Provides stability and support"
              },
              {
                priority: "low",
                issue: "Inadequate natural light in East",
                solution: "Install additional windows or skylights on the eastern side",
                impact: "Improves health and positive energy"
              }
            ]
          });
          setCurrentStep(3);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const renderUpload = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Floor Plan
          </CardTitle>
          <CardDescription>Upload your floor plan image for AI-powered vastu analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <FileImage className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Upload Your Floor Plan</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your floor plan image, or click to browse files
                    </p>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Button onClick={() => setUploadedImage(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button variant="outline" onClick={() => setUploadedImage(true)}>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, PDF • Max size: 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">Floor Plan Uploaded</h4>
                    <p className="text-sm text-green-700">floor_plan_2bhk.jpg (2.3 MB)</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <FileImage className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium">High Quality Images</h4>
                <p className="text-sm text-muted-foreground">Upload clear, high-resolution floor plans</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Grid3X3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium">Accurate Measurements</h4>
                <p className="text-sm text-muted-foreground">Include dimensions and room labels</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Compass className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium">North Direction</h4>
                <p className="text-sm text-muted-foreground">Mark the north direction clearly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Help our AI provide more accurate analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Independent Villa</SelectItem>
                    <SelectItem value="row-house">Row House</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="direction">Main Entrance Direction</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {directions.map((dir) => (
                      <SelectItem key={dir.name} value={dir.name.toLowerCase()}>
                        {dir.name} - {dir.element}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="w-full" onClick={startAnalysis}>
              <Brain className="h-4 w-4 mr-2" />
              Start AI Vastu Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto border-4 border-primary/20 rounded-full flex items-center justify-center">
                <Brain className="h-16 w-16 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">AI Analysis in Progress</h3>
              <p className="text-muted-foreground">Our advanced AI is analyzing your floor plan for vastu compliance</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span>Processing floor plan...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${analysisProgress > 20 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <Compass className="h-5 w-5 mx-auto mb-1" />
                <div>Direction Analysis</div>
              </div>
              <div className={`p-3 rounded-lg ${analysisProgress > 40 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                <Square className="h-5 w-5 mx-auto mb-1" />
                <div>Room Mapping</div>
              </div>
              <div className={`p-3 rounded-lg ${analysisProgress > 60 ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>
                <Triangle className="h-5 w-5 mx-auto mb-1" />
                <div>Element Analysis</div>
              </div>
              <div className={`p-3 rounded-lg ${analysisProgress > 80 ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                <Target className="h-5 w-5 mx-auto mb-1" />
                <div>Recommendations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Vastu Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary mb-2">{analysisResults?.overallScore}%</div>
            <div className="text-lg text-muted-foreground">Overall Vastu Score</div>
            <Badge className="mt-2" variant={analysisResults?.overallScore >= 80 ? 'default' : analysisResults?.overallScore >= 60 ? 'secondary' : 'destructive'}>
              {analysisResults?.overallScore >= 80 ? 'Excellent' : analysisResults?.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analysisResults?.compliance.excellent}</div>
              <div className="text-sm text-green-700">Excellent</div>
            </div>
            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analysisResults?.compliance.good}</div>
              <div className="text-sm text-blue-700">Good</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analysisResults?.compliance.needsImprovement}</div>
              <div className="text-sm text-yellow-700">Needs Work</div>
            </div>
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analysisResults?.compliance.critical}</div>
              <div className="text-sm text-red-700">Critical</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direction Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compass className="h-5 w-5 mr-2" />
            Direction-wise Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysisResults?.directions || {}).map(([direction, data]) => {
              const directionData = data as any;
              const dirInfo = directions.find(d => d.name.toLowerCase().replace('-', '').includes(direction));
              return (
                <div key={direction} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        directionData.status === 'excellent' ? 'bg-green-500' :
                        directionData.status === 'good' ? 'bg-blue-500' :
                        directionData.status === 'needs_improvement' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <h4 className="font-medium capitalize">{direction}</h4>
                    </div>
                    <Badge variant="outline">{directionData.score}%</Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Room:</span> {directionData.room}</div>
                    <div className="text-muted-foreground">{directionData.feedback}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Element Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Circle className="h-5 w-5 mr-2" />
            Five Elements Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analysisResults?.elements || {}).map(([element, data]) => {
              const elementData = data as any;
              return (
              <div key={element} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="capitalize font-medium">{element}</div>
                    <Badge variant={elementData.compliance === 'good' ? 'default' : 'secondary'}>
                      {elementData.compliance}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Locations: {elementData.locations.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{elementData.score}%</div>
                </div>
              </div>
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCorrections = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Instant Corrections & Recommendations
          </CardTitle>
          <CardDescription>AI-generated solutions to improve your vastu compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisResults?.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg ${
                rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                        {rec.priority} priority
                      </Badge>
                      <h4 className="font-medium">{rec.issue}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-600" />
                        <div>
                          <div className="font-medium text-sm">Solution:</div>
                          <div className="text-sm text-muted-foreground">{rec.solution}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Impact:</div>
                          <div className="text-sm text-muted-foreground">{rec.impact}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Full Report
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Analysis
        </Button>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Book Vastu Consultant
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderUpload();
      case 2:
        return renderAnalysis();
      case 3:
        return renderReport();
      case 4:
        return renderCorrections();
      default:
        return renderUpload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-background">
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
            <a href="/ai-features">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI Features
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Vastu Detection</h1>
          <p className="text-muted-foreground">Upload your floor plan for instant AI-powered vastu analysis with detailed recommendations</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-muted-foreground bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-20 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 4 && analysisResults && (
          <div className="max-w-4xl mx-auto mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
