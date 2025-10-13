import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Camera,
  Upload,
  Search,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Star,
  Wrench,
  Lightbulb,
  Target,
  Zap,
  Settings,
  Home,
  Car,
  Smartphone,
  Tv,
  Wind,
  Droplets,
  Thermometer,
  RefreshCw,
  Battery,
  Wifi,
  Play,
  Download,
  Share2,
  FileText,
  MapPin,
  Phone,
  User,
  Calendar,
  ArrowRight,
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  ImageIcon,
  VideoIcon,
  MicIcon,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Shield,
  Award,
  TrendingUp
} from "lucide-react";
import { useState, useRef } from "react";
import BackButton from "../components/BackButton";

export default function VisualDiagnosis() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef(null);

  const problemCategories = [
    { id: "electrical", name: "Electrical Issues", icon: Zap, color: "bg-yellow-50 border-yellow-200" },
    { id: "plumbing", name: "Plumbing Problems", icon: Droplets, color: "bg-blue-50 border-blue-200" },
    { id: "appliance", name: "Appliance Malfunction", icon: Settings, color: "bg-purple-50 border-purple-200" },
    { id: "structural", name: "Structural Damage", icon: Home, color: "bg-red-50 border-red-200" },
    { id: "hvac", name: "HVAC Issues", icon: Wind, color: "bg-green-50 border-green-200" },
    { id: "automotive", name: "Vehicle Problems", icon: Car, color: "bg-orange-50 border-orange-200" }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          
          // Generate mock analysis results
          const mockResults = generateMockResults();
          setAnalysisResults(mockResults);
          setActiveTab("results");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const generateMockResults = () => {
    const problems = {
      electrical: {
        issues: ["Loose wire connection", "Overloaded circuit", "Faulty switch"],
        severity: "Medium",
        confidence: 92,
        solutions: [
          "Tighten wire connections",
          "Install additional circuit breaker",
          "Replace faulty switch"
        ],
        estimatedCost: "₹2,500 - ₹5,000",
        urgency: "Schedule within 1 week"
      },
      plumbing: {
        issues: ["Pipe leak", "Water pressure drop", "Blockage detected"],
        severity: "High",
        confidence: 88,
        solutions: [
          "Seal pipe joint",
          "Check water pump",
          "Clear blockage with drain cleaning"
        ],
        estimatedCost: "₹1,500 - ₹3,500",
        urgency: "Immediate attention required"
      },
      appliance: {
        issues: ["Motor malfunction", "Belt wear", "Filter clogging"],
        severity: "Medium",
        confidence: 95,
        solutions: [
          "Replace motor brushes",
          "Install new drive belt",
          "Clean and replace filter"
        ],
        estimatedCost: "₹3,000 - ₹7,000",
        urgency: "Schedule within 2 weeks"
      }
    };

    const categories = Object.keys(problems);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return {
      category: randomCategory,
      ...problems[randomCategory],
      detectedObjects: ["Component A", "Component B", "Component C"],
      recommendations: [
        "Regular maintenance can prevent this issue",
        "Consider upgrading to a newer model",
        "Professional inspection recommended"
      ]
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const renderUploadSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Problem Photo</h2>
        <p className="text-muted-foreground">Take a clear photo of the issue and let our AI diagnose the problem</p>
      </div>

      {/* Problem Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Problem Category (Optional)</CardTitle>
          <CardDescription>Help us provide more accurate analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {problemCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedCategory === category.id 
                      ? 'border-primary bg-primary/5' 
                      : category.color
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          {!uploadedImage ? (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your photo here, or click to browse
              </p>
              <div className="flex justify-center space-x-4">
                <Button>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Supports JPG, PNG, HEIC up to 10MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={uploadedImage.url} 
                  alt="Uploaded problem" 
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setUploadedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{uploadedImage.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Describe the Problem (Optional)</CardTitle>
          <CardDescription>Additional details help improve diagnosis accuracy</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're experiencing, when it started, any sounds, smells, or other symptoms..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Analysis Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={startAnalysis}
          disabled={!uploadedImage || isAnalyzing}
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <Brain className="h-5 w-5 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Eye className="h-5 w-5 mr-2" />
              Start AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600 animate-pulse" />
              <h3 className="font-semibold text-blue-800">AI Analysis in Progress</h3>
              <p className="text-sm text-blue-700">Examining image and identifying issues...</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-50 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h2>
        <p className="text-muted-foreground">AI has identified the problem and suggested solutions</p>
      </div>

      {analysisResults && (
        <>
          {/* Confidence Score */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analysisResults.confidence}%
              </div>
              <p className="text-green-800 font-medium">Analysis Confidence</p>
              <p className="text-sm text-green-700 mt-1">High accuracy diagnosis</p>
            </CardContent>
          </Card>

          {/* Problem Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Problem Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getSeverityBg(analysisResults.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Severity Level</h3>
                    <Badge variant={analysisResults.severity?.toLowerCase() === 'high' ? 'destructive' : 
                                  analysisResults.severity?.toLowerCase() === 'medium' ? 'secondary' : 'default'}>
                      {analysisResults.severity}
                    </Badge>
                  </div>
                  <p className={`text-sm ${getSeverityColor(analysisResults.severity)}`}>
                    {analysisResults.urgency}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detected Issues:</h4>
                  <ul className="space-y-1">
                    {analysisResults.issues?.map((issue, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detected Components:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.detectedObjects?.map((object, index) => (
                      <Badge key={index} variant="outline">{object}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Recommended Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.solutions?.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Cost Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {analysisResults.estimatedCost}
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated repair cost including parts and labor
                </p>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium">Parts</p>
                  <p className="text-sm text-muted-foreground">60-70%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Labor</p>
                  <p className="text-sm text-muted-foreground">30-40%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              <Calendar className="mr-2 h-5 w-5" />
              Book Service Now
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with Expert
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis History</h2>
        <p className="text-muted-foreground">Your previous diagnoses and solved problems</p>
      </div>

      <div className="space-y-4">
        {[
          {
            id: 1,
            date: "2024-01-15",
            problem: "AC not cooling properly",
            category: "HVAC",
            severity: "Medium",
            status: "Resolved",
            cost: "₹3,500"
          },
          {
            id: 2,
            date: "2024-01-10",
            problem: "Water leakage in bathroom",
            category: "Plumbing",
            severity: "High",
            status: "In Progress",
            cost: "₹2,200"
          },
          {
            id: 3,
            date: "2024-01-05",
            problem: "Washing machine noise",
            category: "Appliance",
            severity: "Low",
            status: "Resolved",
            cost: "₹1,800"
          }
        ].map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{item.problem}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant={item.status === 'Resolved' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{item.date}</span>
                    <span>Severity: {item.severity}</span>
                    <span>Cost: {item.cost}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Eye className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Visual Diagnosis</h1>
          </div>
          <BackButton href="/ai-features" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Visual Diagnosis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a photo of your problem and get instant AI-powered diagnosis with detailed solutions and cost estimates.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload & Analyze
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center" disabled={!analysisResults}>
              <Eye className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            {renderUploadSection()}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {renderResults()}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {renderHistory()}
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <Brain className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">Advanced computer vision analyzes your photos with 95+ % accuracy</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">Get diagnosis and solutions in under 30 seconds</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Expert Verified</h3>
              <p className="text-sm text-muted-foreground">All recommendations verified by certified technicians</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
