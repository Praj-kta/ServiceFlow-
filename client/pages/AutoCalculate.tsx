import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Calculator,
  Home,
  Square,
  Triangle,
  Circle,
  Ruler,
  Package,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  FileText,
  Download,
  Share2,
  Save,
  RotateCcw,
  Plus,
  Minus,
  Equal,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Clock,
  Truck,
  MapPin,
  Users,
  Calendar,
  Building,
  Hammer,
  Wrench,
  Shield
} from "lucide-react";
import { useState } from "react";

type CostLine = {
  quantity?: number;
  unit?: string;
  rate: number;
  cost: number;
  days?: number;
};

type CalculationResults = {
  materials: Record<string, CostLine>;
  labor: Record<string, CostLine>;
  summary: {
    materialTotal: number;
    laborTotal: number;
    overheadCost: number;
    totalCost: number;
    costPerSqft: number;
    timeline: number;
  };
};

export default function AutoCalculate() {
  const [projectType, setProjectType] = useState('residential');
  const [calculationMode, setCalculationMode] = useState('materials');
  const [projectData, setProjectData] = useState({
    plotArea: '',
    builtupArea: '',
    floors: 1,
    bhk: '3bhk',
    quality: 'standard',
    location: 'mumbai',
    includeParking: true,
    includeGarden: false,
    roofType: 'flat'
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const materialCalculations = {
    cement: { rate: 450, unit: 'bag', factor: 0.4 },
    steel: { rate: 65, unit: 'kg', factor: 4.5 },
    bricks: { rate: 8, unit: 'piece', factor: 500 },
    sand: { rate: 35, unit: 'cft', factor: 1.2 },
    aggregate: { rate: 45, unit: 'cft', factor: 1.8 },
    tiles: { rate: 45, unit: 'sqft', factor: 1.1 }
  };

  const laborRates = {
    mason: { rate: 800, unit: 'day' },
    helper: { rate: 500, unit: 'day' },
    electrician: { rate: 1000, unit: 'day' },
    plumber: { rate: 900, unit: 'day' },
    painter: { rate: 600, unit: 'day' },
    carpenter: { rate: 1200, unit: 'day' }
  };

  const locationFactors = {
    mumbai: 1.2,
    delhi: 1.15,
    bangalore: 1.1,
    hyderabad: 1.0,
    pune: 1.05,
    chennai: 1.08,
    kolkata: 0.95,
    ahmedabad: 0.9
  };

  const calculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const builtupArea = parseFloat(projectData.builtupArea) || 1000;
      const locationFactor = locationFactors[projectData.location] || 1.0;
      const qualityFactor = projectData.quality === 'premium' ? 1.3 : projectData.quality === 'luxury' ? 1.6 : 1.0;
      
      const materials: Record<string, CostLine> = {};
      const labor: Record<string, CostLine> = {};
      
      // Calculate materials
      Object.entries(materialCalculations).forEach(([material, data]) => {
        const quantity = builtupArea * data.factor;
        const cost = quantity * data.rate * locationFactor * qualityFactor;
        materials[material] = {
          quantity: Math.round(quantity),
          unit: data.unit,
          rate: data.rate,
          cost: Math.round(cost)
        };
      });
      
      // Calculate labor
      const totalDays = Math.ceil(builtupArea / 50); // Rough estimate
      Object.entries(laborRates).forEach(([worker, data]) => {
        const days = Math.ceil(totalDays * 0.8); // Not all workers needed full time
        const cost = days * data.rate * locationFactor;
        labor[worker] = {
          days,
          rate: data.rate,
          cost: Math.round(cost)
        };
      });
      
      const materialTotal = Object.values(materials).reduce((sum, item) => sum + item.cost, 0);
      const laborTotal = Object.values(labor).reduce((sum, item) => sum + item.cost, 0);
      const overheadCost = (materialTotal + laborTotal) * 0.15; // 15% overhead
      const totalCost = materialTotal + laborTotal + overheadCost;
      
      setResults({
        materials,
        labor,
        summary: {
          materialTotal,
          laborTotal,
          overheadCost: Math.round(overheadCost),
          totalCost: Math.round(totalCost),
          costPerSqft: Math.round(totalCost / builtupArea),
          timeline: Math.ceil(builtupArea / 100) // months
        }
      });
      
      setIsCalculating(false);
    }, 2000);
  };

  const renderMaterialsCalculator = () => (
    <div className="space-y-6">
      {/* Project Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Project Details
          </CardTitle>
          <CardDescription>Enter your project specifications for accurate calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plotArea">Plot Area (sq ft)</Label>
              <Input 
                id="plotArea"
                type="number"
                placeholder="1200"
                value={projectData.plotArea}
                onChange={(e) => setProjectData({...projectData, plotArea: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="builtupArea">Built-up Area (sq ft)</Label>
              <Input 
                id="builtupArea"
                type="number"
                placeholder="1000"
                value={projectData.builtupArea}
                onChange={(e) => setProjectData({...projectData, builtupArea: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="floors">Number of Floors</Label>
              <Select value={projectData.floors.toString()} onValueChange={(value) => setProjectData({...projectData, floors: Number(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Floor</SelectItem>
                  <SelectItem value="2">2 Floors</SelectItem>
                  <SelectItem value="3">3 Floors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bhk">BHK Configuration</Label>
              <Select value={projectData.bhk} onValueChange={(value) => setProjectData({...projectData, bhk: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Construction Quality</Label>
              <Select value={projectData.quality} onValueChange={(value) => setProjectData({...projectData, quality: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={projectData.location} onValueChange={(value) => setProjectData({...projectData, location: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
                <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="includeParking">Include Parking</Label>
              <Switch 
                id="includeParking"
                checked={projectData.includeParking}
                onCheckedChange={(checked) => setProjectData({...projectData, includeParking: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="includeGarden">Include Garden</Label>
              <Switch 
                id="includeGarden"
                checked={projectData.includeGarden}
                onCheckedChange={(checked) => setProjectData({...projectData, includeGarden: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        className="w-full" 
        onClick={calculate}
        disabled={isCalculating || !projectData.builtupArea}
      >
        {isCalculating ? (
          <>
            <Calculator className="h-4 w-4 mr-2 animate-pulse" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Materials & Cost
          </>
        )}
      </Button>
      
      {isCalculating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 animate-pulse" />
                <span>Calculating material requirements...</span>
              </div>
              <Progress value={33} />
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 animate-pulse" />
                <span>Estimating costs with current market rates...</span>
              </div>
              <Progress value={66} />
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 animate-pulse" />
                <span>Finalizing timeline and recommendations...</span>
              </div>
              <Progress value={90} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Cost Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">₹{results.summary.materialTotal.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Materials</div>
              </div>
              <div className="text-center p-4 border rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">₹{results.summary.laborTotal.toLocaleString()}</div>
                <div className="text-sm text-green-700">Labor</div>
              </div>
              <div className="text-center p-4 border rounded-lg bg-orange-50">
                <div className="text-2xl font-bold text-orange-600">₹{results.summary.overheadCost.toLocaleString()}</div>
                <div className="text-sm text-orange-700">Overhead (15%)</div>
              </div>
              <div className="text-center p-4 border rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">₹{results.summary.totalCost.toLocaleString()}</div>
                <div className="text-sm text-purple-700">Total Cost</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Cost per sq ft:</span>
                <span className="font-bold">₹{results.summary.costPerSqft}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span>Estimated Timeline:</span>
                <span className="font-bold">{results.summary.timeline} months</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Materials Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Material Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(results.materials).map(([material, data]) => (
                <div key={material} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium capitalize">{material}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.quantity} {data.unit} @ ₹{data.rate}/{data.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{data.cost.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Labor Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Labor Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(results.labor).map(([worker, data]) => (
                <div key={worker} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium capitalize">{worker}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.days} days @ ₹{data.rate}/day
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{data.cost.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Cost Optimization</h4>
                    <p className="text-sm text-green-700">Consider bulk purchasing cement and steel to save 8-12% on material costs.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Quality Enhancement</h4>
                    <p className="text-sm text-blue-700">Upgrade to premium tiles in living areas for better resale value.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Timeline Alert</h4>
                    <p className="text-sm text-yellow-700">Consider weather delays during monsoon season. Add 15-20% buffer time.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
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
            <a href="/design-generator">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Design Generator
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Auto Calculate</h1>
          <p className="text-muted-foreground">AI-powered cost estimation and material calculation for construction projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Input */}
          <div className="lg:col-span-1">
            <Tabs value={calculationMode} onValueChange={setCalculationMode}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="cost">Cost</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="mt-6">
                {renderMaterialsCalculator()}
              </TabsContent>

              <TabsContent value="cost" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Estimation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Cost estimation tools coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Timeline planning tools coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {results ? renderResults() : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <Calculator className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Calculate</h3>
                  <p className="text-gray-600">Enter your project details and click calculate to get detailed estimates</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {results && (
          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Estimate
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
