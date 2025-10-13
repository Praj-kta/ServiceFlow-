import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Ruler,
  Target,
  Calculator,
  Compass,
  Square,
  Triangle,
  Circle,
  Zap,
  Settings,
  Grid3X3,
  RotateCcw,
  MousePointer2,
  Move,
  ZoomIn,
  ZoomOut,
  CheckSquare,
  Crosshair,
  Gauge,
  Layers,
  FlipVertical,
  FlipHorizontal,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Pencil,
  Eraser,
  Camera,
  Save
} from "lucide-react";
import { useState } from "react";

export default function PrecisionTools() {
  const [activeTool, setActiveTool] = useState('measure');
  const [measurements, setMeasurements] = useState([]);
  const [units, setUnits] = useState('feet');
  const [precision, setPrecision] = useState([2]); // decimal places
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState([1]);

  const tools = [
    { id: 'measure', name: 'Measure Distance', icon: Ruler, description: 'Measure distances between points' },
    { id: 'area', name: 'Area Calculator', icon: Square, description: 'Calculate area of shapes' },
    { id: 'angle', name: 'Angle Measure', icon: Triangle, description: 'Measure angles and slopes' },
    { id: 'compass', name: 'Direction Tool', icon: Compass, description: 'Determine directions and bearings' },
    { id: 'level', name: 'Level Check', icon: Gauge, description: 'Check horizontal and vertical alignment' },
    { id: 'grid', name: 'Grid Overlay', icon: Grid3X3, description: 'Precision grid for alignment' }
  ];

  const presetMeasurements = [
    { name: 'Standard Door', value: '3 × 6.5', unit: 'ft', category: 'Doors' },
    { name: 'Main Entrance', value: '4 × 7', unit: 'ft', category: 'Doors' },
    { name: 'Window - Living Room', value: '5 × 4', unit: 'ft', category: 'Windows' },
    { name: 'Window - Bedroom', value: '4 × 3.5', unit: 'ft', category: 'Windows' },
    { name: 'Kitchen Counter', value: '24', unit: 'in', category: 'Kitchen' },
    { name: 'Bathroom Minimum', value: '5 × 4', unit: 'ft', category: 'Bathroom' }
  ];

  const conversionRates = {
    feet: 1,
    meters: 3.281,
    inches: 0.0833,
    centimeters: 30.48,
    yards: 3
  };

  const convertUnit = (value, fromUnit, toUnit) => {
    const inFeet = value / conversionRates[fromUnit];
    return inFeet * conversionRates[toUnit];
  };

  const renderMeasureTool = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="h-5 w-5 mr-2" />
            Distance Measurement
          </CardTitle>
          <CardDescription>Click two points to measure distance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-8 min-h-[300px] relative border-2 border-dashed border-gray-300">
            {/* Measurement Canvas */}
            <div className="absolute inset-0 bg-graph-paper opacity-20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Click to start measuring</p>
                <p className="text-sm text-gray-500 mt-2">Distance will appear here</p>
              </div>
            </div>
            
            {/* Measurement Display */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow border">
              <div className="text-sm font-medium">Current Measurement</div>
              <div className="text-2xl font-bold text-primary">12.5 ft</div>
              <div className="text-xs text-gray-500">3.81 meters</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Last Measurement</div>
              <div className="text-lg font-bold text-blue-600">12.5 ft</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Total Distance</div>
              <div className="text-lg font-bold text-green-600">47.3 ft</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Measurements</div>
              <div className="text-lg font-bold text-purple-600">8</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Accuracy</div>
              <div className="text-lg font-bold text-orange-600">±0.1 ft</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetMeasurements.map((preset, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <div>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-muted-foreground">{preset.category}</div>
                </div>
                <Badge variant="outline">{preset.value} {preset.unit}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAreaTool = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Square className="h-5 w-5 mr-2" />
            Area Calculator
          </CardTitle>
          <CardDescription>Calculate area of rectangles, circles, and complex shapes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rectangle" className="space-y-4">
            <TabsList>
              <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
              <TabsTrigger value="circle">Circle</TabsTrigger>
              <TabsTrigger value="triangle">Triangle</TabsTrigger>
              <TabsTrigger value="complex">Complex Shape</TabsTrigger>
            </TabsList>

            <TabsContent value="rectangle">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Length</Label>
                  <div className="flex space-x-2">
                    <Input id="length" type="number" placeholder="12" />
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <div className="flex space-x-2">
                    <Input id="width" type="number" placeholder="8" />
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Calculated Area:</span>
                  <span className="text-2xl font-bold text-blue-600">96 sq ft</span>
                </div>
                <div className="text-sm text-blue-700 mt-1">8.92 square meters</div>
              </div>
            </TabsContent>

            <TabsContent value="circle">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="radius">Radius</Label>
                  <div className="flex space-x-2">
                    <Input id="radius" type="number" placeholder="5" />
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Calculated Area:</span>
                    <span className="text-2xl font-bold text-green-600">78.54 sq ft</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">7.30 square meters</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="triangle">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base">Base</Label>
                  <div className="flex space-x-2">
                    <Input id="base" type="number" placeholder="10" />
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <div className="flex space-x-2">
                    <Input id="height" type="number" placeholder="8" />
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Calculated Area:</span>
                  <span className="text-2xl font-bold text-purple-600">40 sq ft</span>
                </div>
                <div className="text-sm text-purple-700 mt-1">3.72 square meters</div>
              </div>
            </TabsContent>

            <TabsContent value="complex">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Click points on the canvas to create a complex shape</p>
                <div className="bg-gray-100 rounded-lg p-8 min-h-[200px] relative border-2 border-dashed border-gray-300">
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-center">
                      <MousePointer2 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to add points</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const renderAngleTool = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Triangle className="h-5 w-5 mr-2" />
            Angle Measurement
          </CardTitle>
          <CardDescription>Measure angles and calculate slopes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Angle Measurement</Label>
              <div className="bg-gray-100 rounded-lg p-6 min-h-[200px] relative">
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-gray-400 rounded-full relative">
                    <div className="absolute top-0 left-1/2 w-0.5 h-12 bg-red-500 transform -translate-x-1/2 rotate-45 origin-bottom"></div>
                    <div className="absolute top-1/2 left-0 w-12 h-0.5 bg-blue-500"></div>
                    <div className="absolute top-4 right-4 text-lg font-bold text-primary">45°</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Quick Angle Calculations</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Right Angle</span>
                    <Badge>90°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Roof Slope (Standard)</span>
                    <Badge>30°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Stair Angle</span>
                    <Badge>35°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Ramp (ADA Compliant)</span>
                    <Badge>4.8°</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompassTool = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compass className="h-5 w-5 mr-2" />
            Direction & Bearing Tool
          </CardTitle>
          <CardDescription>Determine directions for vastu and site planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Compass Circle */}
                  <div className="w-full h-full border-4 border-gray-300 rounded-full relative bg-white">
                    {/* North */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-red-600 font-bold">N</div>
                    {/* South */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-blue-600 font-bold">S</div>
                    {/* East */}
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-600 font-bold">E</div>
                    {/* West */}
                    <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-orange-600 font-bold">W</div>
                    
                    {/* Compass Needle */}
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 rotate-12 origin-center"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Degree Markings */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs">0°</div>
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs">90°</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">180°</div>
                    <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs">270°</div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-2xl font-bold text-primary">12° NE</div>
                  <div className="text-sm text-muted-foreground">Current Bearing</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Vastu Directions</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                    <div>
                      <div className="font-medium">North (धन - Wealth)</div>
                      <div className="text-sm text-muted-foreground">Best for main entrance</div>
                    </div>
                    <Badge variant="outline">0°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-purple-50">
                    <div>
                      <div className="font-medium">North-East (ईशान - Ishaan)</div>
                      <div className="text-sm text-muted-foreground">Prayer room, water tank</div>
                    </div>
                    <Badge variant="outline">45°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50">
                    <div>
                      <div className="font-medium">East (सूर्य - Surya)</div>
                      <div className="text-sm text-muted-foreground">Windows, balcony</div>
                    </div>
                    <Badge variant="outline">90°</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-orange-50">
                    <div>
                      <div className="font-medium">South-East (अग्नि - Agni)</div>
                      <div className="text-sm text-muted-foreground">Kitchen, electrical</div>
                    </div>
                    <Badge variant="outline">135°</Badge>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Compass className="h-4 w-4 mr-2" />
                Calibrate Compass
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTool) {
      case 'measure':
        return renderMeasureTool();
      case 'area':
        return renderAreaTool();
      case 'angle':
        return renderAngleTool();
      case 'compass':
        return renderCompassTool();
      case 'level':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                Level & Alignment Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <Gauge className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Level tool coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'grid':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid3X3 className="h-5 w-5 mr-2" />
                Precision Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <Grid3X3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Grid overlay coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50 to-background">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Precision Tools</h1>
          <p className="text-muted-foreground">Professional measurement and calculation tools for accurate design</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Tool Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        activeTool === tool.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-xs text-muted-foreground">{tool.description}</div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="units">Measurement Units</Label>
                  <Select value={units} onValueChange={setUnits}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feet">Feet & Inches</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="centimeters">Centimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Precision (Decimal Places)</Label>
                  <Slider
                    value={precision}
                    onValueChange={setPrecision}
                    max={4}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    {precision[0]} decimal places
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="snapToGrid">Snap to Grid</Label>
                    <Switch 
                      id="snapToGrid"
                      checked={snapToGrid}
                      onCheckedChange={setSnapToGrid}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showGrid">Show Grid</Label>
                    <Switch 
                      id="showGrid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                </div>

                {showGrid && (
                  <div>
                    <Label>Grid Size ({units})</Label>
                    <Slider
                      value={gridSize}
                      onValueChange={setGridSize}
                      max={10}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {gridSize[0]} {units}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Tool Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Measurements
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Capture Screenshot
          </Button>
        </div>
      </div>
    </div>
  );
}
