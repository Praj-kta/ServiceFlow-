import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Box,
  Ruler,
  Home,
  Layers,
  Grid3X3,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Zap,
  Calculator,
  Settings,
  Compass,
  Square,
  DoorOpen,
  Wind,
  Car,
  Trees,
  Lightbulb,
  Droplets,
  Flame,
  Wifi,
  Tv,
  UtensilsCrossed,
  Bath,
  Bed,
  Sofa,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Move3D,
  Maximize,
  MousePointer2,
  Palette,
  Sparkles,
  Crown,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  RefreshCw,
  Info
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function DesignGenerator() {
  const [designParams, setDesignParams] = useState({
    plotLength: 40,
    plotWidth: 30,
    bhk: '3bhk',
    numberRooms: 3,
    numberBathrooms: 2,
    floors: 2,
    direction: 'north',
    buildingType: 'residential',
    style: 'modern',
    budget: 'medium',
    vastuCompliance: true,
    includeGarden: true,
    includeParking: true,
    roofType: 'flat'
  });

  const [roomLayout, setRoomLayout] = useState({
    livingRoom: { width: 0, height: 0, area: 0 },
    masterBedroom: { width: 0, height: 0, area: 0 },
    bedroom2: { width: 0, height: 0, area: 0 },
    bedroom3: { width: 0, height: 0, area: 0 },
    kitchen: { width: 0, height: 0, area: 0 },
    bathroom1: { width: 0, height: 0, area: 0 },
    bathroom2: { width: 0, height: 0, area: 0 },
    diningRoom: { width: 0, height: 0, area: 0 },
    balcony: { width: 0, height: 0, area: 0 },
    entrance: { width: 0, height: 0, area: 0 }
  });

  const [designMode, setDesignMode] = useState('2d'); // 2d, 3d, measurements
  const [outputFormat, setOutputFormat] = useState('2d');
  const [activeFloor, setActiveFloor] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [designGenerated, setDesignGenerated] = useState(false);

  // Modern measurement standards (in feet)
  const standardMeasurements = {
    walls: {
      exterior: 9, // 9 inch thick exterior walls
      interior: 4.5, // 4.5 inch thick interior walls
      load_bearing: 12 // 12 inch thick load bearing walls
    },
    doors: {
      main_entrance: { width: 4, height: 7 },
      room_door: { width: 3, height: 6.5 },
      bathroom_door: { width: 2.5, height: 6.5 },
      balcony_door: { width: 6, height: 7 }
    },
    windows: {
      living_room: { width: 5, height: 4 },
      bedroom: { width: 4, height: 3.5 },
      kitchen: { width: 3, height: 3 },
      bathroom: { width: 2, height: 2 }
    },
    ceiling_height: {
      ground_floor: 10,
      upper_floors: 9,
      bathroom: 8.5
    },
    minimum_room_sizes: {
      living_room: { min_width: 12, min_height: 10 },
      master_bedroom: { min_width: 12, min_height: 10 },
      bedroom: { min_width: 10, min_height: 9 },
      kitchen: { min_width: 8, min_height: 6 },
      bathroom: { min_width: 5, min_height: 4 },
      dining: { min_width: 8, min_height: 8 }
    }
  };

  // Calculate room dimensions based on plot size and BHK
  const calculateRoomDimensions = () => {
    const totalArea = designParams.plotLength * designParams.plotWidth;
    const builtUpArea = totalArea * 0.75; // 75% built-up area, 25% for setbacks
    const floorArea = builtUpArea / designParams.floors;
    
    let roomAreas = {};
    
    // Calculate areas based on BHK configuration
    // Derive BHK from number of rooms if provided
    let bhk = designParams.bhk;
    if (designParams.numberRooms) {
      if (designParams.numberRooms <= 1) bhk = '1bhk';
      else if (designParams.numberRooms === 2) bhk = '2bhk';
      else if (designParams.numberRooms === 3) bhk = '3bhk';
      else bhk = '4bhk';
    }

    switch (bhk) {
      case '1bhk':
        roomAreas = {
          livingRoom: floorArea * 0.35,
          masterBedroom: floorArea * 0.30,
          kitchen: floorArea * 0.15,
          bathroom1: floorArea * 0.10,
          entrance: floorArea * 0.10
        };
        break;
      case '2bhk':
        roomAreas = {
          livingRoom: floorArea * 0.30,
          masterBedroom: floorArea * 0.25,
          bedroom2: floorArea * 0.20,
          kitchen: floorArea * 0.12,
          bathroom1: floorArea * 0.08,
          bathroom2: floorArea * 0.05
        };
        break;
      case '3bhk':
        roomAreas = {
          livingRoom: floorArea * 0.25,
          masterBedroom: floorArea * 0.20,
          bedroom2: floorArea * 0.15,
          bedroom3: floorArea * 0.15,
          kitchen: floorArea * 0.10,
          diningRoom: floorArea * 0.08,
          bathroom1: floorArea * 0.04,
          bathroom2: floorArea * 0.03
        };
        break;
      case '4bhk':
        roomAreas = {
          livingRoom: floorArea * 0.22,
          masterBedroom: floorArea * 0.18,
          bedroom2: floorArea * 0.15,
          bedroom3: floorArea * 0.15,
          bedroom4: floorArea * 0.12,
          kitchen: floorArea * 0.08,
          diningRoom: floorArea * 0.06,
          bathroom1: floorArea * 0.02,
          bathroom2: floorArea * 0.02
        };
        break;
    }

    // Convert areas to dimensions (assuming rectangular rooms)
    const newRoomLayout = {};
    if (designParams.numberBathrooms === 1) {
      if (roomAreas['bathroom2']) {
        roomAreas['bathroom1'] = (roomAreas['bathroom1'] || 0) + roomAreas['bathroom2'];
        delete roomAreas['bathroom2'];
      }
    }

    Object.entries(roomAreas).forEach(([room, area]) => {
      const width = Math.sqrt(area * 1.2); // Slightly rectangular
      const height = area / width;
      newRoomLayout[room] = {
        width: Math.round(width * 10) / 10,
        height: Math.round(height * 10) / 10,
        area: Math.round(area)
      };
    });

    setRoomLayout(newRoomLayout);
  };

  const generateDesign = () => {
    setIsGenerating(true);
    calculateRoomDimensions();
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      setDesignGenerated(true);
      if (outputFormat === '3d') setDesignMode('3d'); else setDesignMode('2d');
    }, 3000);
  };

  const vastuAnalysis = {
    compliant: designParams.vastuCompliance,
    score: 85,
    recommendations: [
      "Main entrance facing north - Excellent for prosperity",
      "Kitchen in south-east corner - Perfect for fire element",
      "Master bedroom in south-west - Ideal for stability",
      "Prayer room in north-east corner - Good for spiritual energy"
    ],
    warnings: [
      "Bathroom door should not face kitchen directly",
      "Avoid beam above the dining table"
    ]
  };

  const render2DView = () => (
    <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 min-h-[400px] relative overflow-hidden">
      <div className="absolute inset-4 border-2 border-gray-600">
        {/* Ground Floor Layout */}
        <div className="relative w-full h-full">
          {/* Living Room */}
          <div className="absolute top-4 left-4 w-32 h-24 border-2 border-blue-500 bg-blue-50 rounded flex items-center justify-center">
            <div className="text-xs text-center">
              <Sofa className="h-4 w-4 mx-auto mb-1" />
              <div>Living Room</div>
              <div className="text-xs text-gray-600">{roomLayout.livingRoom?.width}' × {roomLayout.livingRoom?.height}'</div>
            </div>
          </div>
          
          {/* Master Bedroom */}
          <div className="absolute top-4 right-4 w-28 h-20 border-2 border-purple-500 bg-purple-50 rounded flex items-center justify-center">
            <div className="text-xs text-center">
              <Bed className="h-4 w-4 mx-auto mb-1" />
              <div>Master BR</div>
              <div className="text-xs text-gray-600">{roomLayout.masterBedroom?.width}' × {roomLayout.masterBedroom?.height}'</div>
            </div>
          </div>
          
          {/* Kitchen */}
          <div className="absolute bottom-4 left-4 w-24 h-16 border-2 border-green-500 bg-green-50 rounded flex items-center justify-center">
            <div className="text-xs text-center">
              <UtensilsCrossed className="h-4 w-4 mx-auto mb-1" />
              <div>Kitchen</div>
              <div className="text-xs text-gray-600">{roomLayout.kitchen?.width}' × {roomLayout.kitchen?.height}'</div>
            </div>
          </div>
          
          {/* Bathroom */}
          <div className="absolute bottom-4 right-4 w-16 h-12 border-2 border-cyan-500 bg-cyan-50 rounded flex items-center justify-center">
            <div className="text-xs text-center">
              <Bath className="h-4 w-4 mx-auto mb-1" />
              <div>Bath</div>
              <div className="text-xs text-gray-600">{roomLayout.bathroom1?.width}' × {roomLayout.bathroom1?.height}'</div>
            </div>
          </div>

          {/* Doors */}
          <div className="absolute top-1/2 left-0 w-2 h-6 bg-yellow-500"></div>
          <div className="absolute top-1/2 right-0 w-2 h-6 bg-yellow-500"></div>
          
          {/* Windows */}
          <div className="absolute top-0 left-1/4 w-8 h-2 bg-blue-300"></div>
          <div className="absolute bottom-0 right-1/4 w-8 h-2 bg-blue-300"></div>
          
          {/* Measurements */}
          <div className="absolute -top-6 left-0 text-xs font-mono text-gray-700">{designParams.plotWidth}'</div>
          <div className="absolute -left-8 top-1/2 -rotate-90 text-xs font-mono text-gray-700">{designParams.plotLength}'</div>
        </div>
      </div>
      
      {/* North Direction Indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white px-2 py-1 rounded border">
        <Compass className="h-4 w-4 text-red-500" />
        <span className="text-xs font-medium">N</span>
      </div>
    </div>
  );

  const render3DView = () => (
    <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-6 min-h-[400px] relative overflow-hidden">
      {/* 3D House Representation */}
      <div className="relative transform perspective-1000 mx-auto w-fit">
        {/* Base/Foundation */}
        <div className="w-64 h-40 bg-gray-300 border border-gray-400 relative transform rotate-x-60 rotate-y-15">
          {/* Floor */}
          <div className="absolute inset-0 bg-gray-200"></div>
        </div>
        
        {/* Ground Floor Walls */}
        <div className="absolute top-8 left-8 w-48 h-32 border-2 border-gray-600 bg-gradient-to-b from-white to-gray-100 transform skew-y-12">
          {/* Front Wall */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white">
            {/* Windows */}
            <div className="absolute top-4 left-8 w-8 h-6 bg-blue-300 border border-blue-400"></div>
            <div className="absolute top-4 right-8 w-8 h-6 bg-blue-300 border border-blue-400"></div>
            {/* Door */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-yellow-700 border border-yellow-800"></div>
          </div>
        </div>

        {/* Side Wall */}
        <div className="absolute top-8 right-2 w-32 h-32 border-2 border-gray-700 bg-gradient-to-l from-gray-200 to-gray-300 transform skew-x-12">
          <div className="absolute top-6 left-4 w-6 h-5 bg-blue-300 border border-blue-400"></div>
        </div>

        {/* Upper Floor (if applicable) */}
        {designParams.floors > 1 && (
          <>
            <div className="absolute top-2 left-8 w-48 h-24 border-2 border-gray-600 bg-gradient-to-b from-white to-gray-100 transform skew-y-12">
              <div className="absolute top-2 left-8 w-6 h-4 bg-blue-300 border border-blue-400"></div>
              <div className="absolute top-2 right-8 w-6 h-4 bg-blue-300 border border-blue-400"></div>
            </div>
            <div className="absolute top-2 right-2 w-24 h-24 border-2 border-gray-700 bg-gradient-to-l from-gray-200 to-gray-300 transform skew-x-12">
              <div className="absolute top-4 left-3 w-4 h-3 bg-blue-300 border border-blue-400"></div>
            </div>
          </>
        )}

        {/* Roof */}
        <div className="absolute -top-4 left-6 w-52 h-36 bg-red-600 border border-red-700 transform skew-y-12 rotate-x-30">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"></div>
        </div>

        {/* Shadows */}
        <div className="absolute top-32 left-16 w-48 h-8 bg-black opacity-20 rounded-full blur-sm transform skew-x-45"></div>
      </div>

      {/* Environment */}
      <div className="absolute bottom-4 left-4">
        <Trees className="h-8 w-8 text-green-600" />
      </div>
      <div className="absolute bottom-4 right-4">
        <Car className="h-6 w-6 text-blue-600" />
      </div>

      {/* 3D Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <Button size="sm" variant="outline">
          <Move3D className="h-4 w-4 mr-2" />
          Rotate
        </Button>
        <Button size="sm" variant="outline">
          <Maximize className="h-4 w-4 mr-2" />
          Zoom
        </Button>
        <Button size="sm" variant="outline">
          <MousePointer2 className="h-4 w-4 mr-2" />
          Walk-through
        </Button>
      </div>
    </div>
  );

  const renderMeasurements = () => (
    <div className="space-y-6">
      {/* Wall Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Square className="h-5 w-5 mr-2" />
            Wall Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Exterior Walls</div>
              <div className="text-2xl font-bold text-blue-600">{standardMeasurements.walls.exterior}"</div>
              <div className="text-sm text-muted-foreground">Thickness</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Interior Walls</div>
              <div className="text-2xl font-bold text-green-600">{standardMeasurements.walls.interior}"</div>
              <div className="text-sm text-muted-foreground">Thickness</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Load Bearing</div>
              <div className="text-2xl font-bold text-purple-600">{standardMeasurements.walls.load_bearing}"</div>
              <div className="text-sm text-muted-foreground">Thickness</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Door & Window Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DoorOpen className="h-5 w-5 mr-2" />
              Door Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(standardMeasurements.doors).map(([type, dims]) => (
                <div key={type} className="flex justify-between items-center p-2 border rounded">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <Badge variant="outline">{dims.width}' × {dims.height}'</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="h-5 w-5 mr-2" />
              Window Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(standardMeasurements.windows).map(([type, dims]) => (
                <div key={type} className="flex justify-between items-center p-2 border rounded">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <Badge variant="outline">{dims.width}' × {dims.height}'</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Calculated Room Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(roomLayout).map(([room, dims]) => (
              <div key={room} className="p-3 border rounded-lg text-center">
                <div className="font-semibold capitalize mb-2">{room.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-lg font-bold">{dims.width}' × {dims.height}'</div>
                <div className="text-sm text-muted-foreground">{dims.area} sq ft</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ceiling Heights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="h-5 w-5 mr-2" />
            Ceiling Heights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Ground Floor</div>
              <div className="text-2xl font-bold text-blue-600">{standardMeasurements.ceiling_height.ground_floor}'</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Upper Floors</div>
              <div className="text-2xl font-bold text-green-600">{standardMeasurements.ceiling_height.upper_floors}'</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold">Bathrooms</div>
              <div className="text-2xl font-bold text-purple-600">{standardMeasurements.ceiling_height.bathroom}'</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
            <a href="/user-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">3D Design Generator</h1>
          <p className="text-muted-foreground">Create professional 2D/3D designs with automatic measurements and modern standards</p>
        </div>

        {/* Onboarding Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Design Generation Flow</CardTitle>
            <CardDescription>Follow these steps to generate a tailored 2D/3D design</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Enter plot dimensions, rooms, bathrooms, and style preferences.</li>
              <li>Toggle optional features like garden or parking as needed.</li>
              <li>Choose your output format: 2D Floor Plan or 3D Model.</li>
              <li>Click “Generate AI Design”. The system creates a layout matching your inputs.</li>
            </ol>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Design Parameters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Design Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="plotLength">Plot Length (ft)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Longer side of your plot in feet</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="plotLength"
                      type="number"
                      value={designParams.plotLength}
                      onChange={(e) => setDesignParams({...designParams, plotLength: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="plotWidth">Plot Width (ft)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Shorter side of your plot in feet</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="plotWidth"
                      type="number"
                      value={designParams.plotWidth}
                      onChange={(e) => setDesignParams({...designParams, plotWidth: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bhk">BHK Configuration</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Bedroom-Hall-Kitchen configuration</TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={designParams.bhk} onValueChange={(value) => setDesignParams({...designParams, bhk: value})}>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Total bedrooms required</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="rooms"
                      type="number"
                      value={designParams.numberRooms}
                      onChange={(e) => setDesignParams({...designParams, numberRooms: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Attached + common bathrooms</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={designParams.numberBathrooms}
                      onChange={(e) => setDesignParams({...designParams, numberBathrooms: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="style">Preferred Design Style</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Choose aesthetics like Modern or Traditional</TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={designParams.style} onValueChange={(value) => setDesignParams({...designParams, style: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="outputFormat">Output Format</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>Select whether to generate a 2D plan or 3D model</TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2d">2D Design</SelectItem>
                      <SelectItem value="3d">3D Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="floors">Number of Floors</Label>
                  <Select value={designParams.floors.toString()} onValueChange={(value) => setDesignParams({...designParams, floors: Number(value)})}>
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
                  <Label htmlFor="direction">Plot Direction</Label>
                  <Select value={designParams.direction} onValueChange={(value) => setDesignParams({...designParams, direction: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North Facing</SelectItem>
                      <SelectItem value="south">South Facing</SelectItem>
                      <SelectItem value="east">East Facing</SelectItem>
                      <SelectItem value="west">West Facing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vastuCompliance">Vastu Compliance</Label>
                    <Switch 
                      id="vastuCompliance"
                      checked={designParams.vastuCompliance}
                      onCheckedChange={(checked) => setDesignParams({...designParams, vastuCompliance: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeGarden">Include Garden</Label>
                    <Switch 
                      id="includeGarden"
                      checked={designParams.includeGarden}
                      onCheckedChange={(checked) => setDesignParams({...designParams, includeGarden: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeParking">Include Parking</Label>
                    <Switch 
                      id="includeParking"
                      checked={designParams.includeParking}
                      onCheckedChange={(checked) => setDesignParams({...designParams, includeParking: checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="w-full"
                    onClick={generateDesign}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Box className="h-4 w-4 mr-2" />
                        Generate AI Design
                      </>
                    )}
                  </Button>
                  {designGenerated && (
                    <Button variant="outline" onClick={generateDesign} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  )}
                </div>

                {designGenerated && (
                  <div className="mt-4">
                    <Label className="text-sm mb-2 block">Preview</Label>
                    <div className="border rounded-lg p-2 bg-white overflow-hidden">
                      <div className="scale-75 origin-top-left">
                        {designMode === '3d' || outputFormat === '3d' ? render3DView() : render2DView()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vastu Analysis */}
            {designGenerated && designParams.vastuCompliance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Compass className="h-5 w-5 mr-2" />
                    Vastu Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Vastu Score</span>
                      <Badge variant={vastuAnalysis.score >= 80 ? 'default' : 'secondary'}>
                        {vastuAnalysis.score}/100
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">Positive Points:</h4>
                      {vastuAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-700">Suggestions:</h4>
                      {vastuAnalysis.warnings.slice(0, 1).map((warn, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          {warn}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Design View */}
          <div className="lg:col-span-3 space-y-6">
            {/* View Mode Tabs */}
            <Tabs value={designMode} onValueChange={setDesignMode}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="2d" className="flex items-center">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  2D Floor Plan
                </TabsTrigger>
                <TabsTrigger value="3d" className="flex items-center">
                  <Box className="h-4 w-4 mr-2" />
                  3D View
                </TabsTrigger>
                <TabsTrigger value="measurements" className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2" />
                  Measurements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="2d">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Grid3X3 className="h-5 w-5 mr-2" />
                        2D Floor Plan
                      </CardTitle>
                      {designParams.floors > 1 && (
                        <Select value={activeFloor.toString()} onValueChange={(value) => setActiveFloor(Number(value))}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: designParams.floors}, (_, i) => (
                              <SelectItem key={i+1} value={(i+1).toString()}>Floor {i+1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {designGenerated ? render2DView() : (
                      <div className="bg-gray-50 rounded-lg p-12 text-center min-h-[400px] flex items-center justify-center">
                        <div>
                          <Grid3X3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Click "Generate Design" to create your 2D floor plan</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="3d">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Box className="h-5 w-5 mr-2" />
                      3D Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {designGenerated ? render3DView() : (
                      <div className="bg-gray-50 rounded-lg p-12 text-center min-h-[400px] flex items-center justify-center">
                        <div>
                          <Box className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Generate your design to view 3D visualization</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="measurements">
                <div>
                  {designGenerated ? renderMeasurements() : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Ruler className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Generate your design to view detailed measurements</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {designGenerated && (
              <div className="space-y-4">
                <div className="flex space-x-4 justify-center">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Design
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    VR Walkthrough
                  </Button>
                  <Button>
                    <Crown className="h-4 w-4 mr-2" />
                    Get Professional Review
                  </Button>
                </div>

                {/* Tools Navigation */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-center mb-4">Advanced Design Tools</h3>
                  <div className="flex space-x-4 justify-center">
                    <Button variant="outline" asChild>
                      <a href="/precision-tools">
                        <Target className="h-4 w-4 mr-2" />
                        Precision Tools
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/material-library">
                        <Package className="h-4 w-4 mr-2" />
                        Material Library
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/auto-calculate">
                        <Calculator className="h-4 w-4 mr-2" />
                        Auto Calculate
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
