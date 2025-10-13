import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Package,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Palette,
  Ruler,
  DollarSign,
  Truck,
  Clock,
  Zap,
  Grid3X3,
  List,
  Heart,
  Share2,
  Download,
  GitCompare,
  Tag,
  CheckCircle,
  AlertTriangle,
  Info,
  Flame,
  Droplets,
  Shield,
  Recycle,
  Leaf,
  Award,
  MapPin,
  Phone,
  Globe,
  Calculator,
  Bookmark
} from "lucide-react";
import { useState } from "react";

export default function MaterialLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'all', name: 'All Materials', count: 1247 },
    { id: 'flooring', name: 'Flooring', count: 156 },
    { id: 'wall', name: 'Wall Materials', count: 203 },
    { id: 'roofing', name: 'Roofing', count: 87 },
    { id: 'doors-windows', name: 'Doors & Windows', count: 134 },
    { id: 'electrical', name: 'Electrical', count: 289 },
    { id: 'plumbing', name: 'Plumbing', count: 178 },
    { id: 'kitchen', name: 'Kitchen', count: 98 },
    { id: 'bathroom', name: 'Bathroom', count: 102 }
  ];

  const materials = [
    {
      id: 1,
      name: "Premium Vitrified Tiles",
      category: "flooring",
      brand: "Kajaria",
      image: "/api/placeholder/300/200",
      price: 45,
      unit: "sq ft",
      rating: 4.8,
      reviews: 234,
      inStock: true,
      delivery: "3-5 days",
      specifications: {
        size: "24x24 inches",
        thickness: "8-10mm", 
        finish: "Glossy",
        waterResistant: true,
        slipResistant: false
      },
      features: ["Stain resistant", "Easy maintenance", "Uniform thickness"],
      application: "Living room, bedroom, kitchen",
      sustainability: "A+",
      fireRating: "Class A1"
    },
    {
      id: 2,
      name: "Teak Wood Flooring",
      category: "flooring",
      brand: "Asian Granito",
      image: "/api/placeholder/300/200",
      price: 120,
      unit: "sq ft",
      rating: 4.9,
      reviews: 189,
      inStock: true,
      delivery: "5-7 days",
      specifications: {
        size: "6x48 inches",
        thickness: "12mm",
        finish: "Natural Oil",
        waterResistant: false,
        slipResistant: true
      },
      features: ["Natural wood grain", "Durable", "Eco-friendly"],
      application: "Living room, bedroom",
      sustainability: "A++",
      fireRating: "Class B"
    },
    {
      id: 3,
      name: "Exterior Wall Paint",
      category: "wall",
      brand: "Asian Paints",
      image: "/api/placeholder/300/200",
      price: 8,
      unit: "sq ft",
      rating: 4.6,
      reviews: 445,
      inStock: true,
      delivery: "1-2 days",
      specifications: {
        coverage: "140-160 sq ft/liter",
        finish: "Matt",
        washability: "High",
        durability: "7-10 years",
        weatherResistant: true
      },
      features: ["Weather resistant", "Fade proof", "Anti-fungal"],
      application: "Exterior walls",
      sustainability: "B+",
      fireRating: "N/A"
    },
    {
      id: 4,
      name: "Clay Roof Tiles",
      category: "roofing",
      brand: "Mangalore Tiles",
      image: "/api/placeholder/300/200",
      price: 25,
      unit: "sq ft",
      rating: 4.7,
      reviews: 167,
      inStock: true,
      delivery: "7-10 days",
      specifications: {
        size: "12x8 inches",
        weight: "2.5 kg/tile",
        lifespan: "50+ years",
        heatResistant: true,
        waterResistant: true
      },
      features: ["Natural insulation", "Eco-friendly", "Long lasting"],
      application: "Sloped roofs",
      sustainability: "A++",
      fireRating: "Class A"
    },
    {
      id: 5,
      name: "UPVC Windows",
      category: "doors-windows", 
      brand: "Fenesta",
      image: "/api/placeholder/300/200",
      price: 85,
      unit: "sq ft",
      rating: 4.5,
      reviews: 298,
      inStock: true,
      delivery: "10-14 days",
      specifications: {
        profile: "Multi-chamber",
        glasss: "Double glazed",
        frame: "Lead-free UPVC",
        energyRating: "5-star",
        soundProofing: "32 dB"
      },
      features: ["Energy efficient", "Sound proof", "Low maintenance"],
      application: "All rooms",
      sustainability: "A",
      fireRating: "Class B"
    },
    {
      id: 6,
      name: "LED Panel Lights",
      category: "electrical",
      brand: "Philips",
      image: "/api/placeholder/300/200",
      price: 12,
      unit: "piece",
      rating: 4.8,
      reviews: 523,
      inStock: true,
      delivery: "2-3 days",
      specifications: {
        wattage: "18W",
        lumens: "1800 lm",
        colorTemp: "4000K",
        lifespan: "25,000 hours",
        dimming: "Yes"
      },
      features: ["Energy saving", "Uniform light", "Flicker-free"],
      application: "Office, home, commercial",
      sustainability: "A++",
      fireRating: "N/A"
    }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && material.price < 50) ||
                        (priceRange === 'medium' && material.price >= 50 && material.price <= 100) ||
                        (priceRange === 'high' && material.price > 100);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleFavorite = (materialId) => {
    setFavorites(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const addToCart = (material) => {
    setCart(prev => [...prev, material]);
  };

  const renderMaterialCard = (material) => (
    <Card key={material.id} className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/90"
            onClick={() => toggleFavorite(material.id)}
          >
            <Heart className={`h-4 w-4 ${favorites.includes(material.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {!material.inStock && (
          <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2">{material.name}</h3>
            <p className="text-xs text-muted-foreground">{material.brand}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {categories.find(c => c.id === material.category)?.name}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs ml-1">{material.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({material.reviews})</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Truck className="h-3 w-3 mr-1" />
            {material.delivery}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-primary">
            ₹{material.price}
            <span className="text-xs font-normal text-muted-foreground">/{material.unit}</span>
          </div>
          <div className="flex items-center space-x-1">
            {material.specifications.waterResistant && (
              <Badge variant="outline" className="text-xs">
                <Droplets className="h-3 w-3 mr-1" />
                Water Resistant
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1" onClick={() => addToCart(material)}>
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
            <Button size="sm" variant="outline">
              <Calculator className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMaterialList = (material) => (
    <Card key={material.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{material.name}</h3>
                <p className="text-sm text-muted-foreground">{material.brand}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm ml-1">{material.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">({material.reviews})</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 mr-1" />
                    {material.delivery}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  ₹{material.price}
                  <span className="text-sm font-normal text-muted-foreground">/{material.unit}</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={() => addToCart(material)}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {categories.find(c => c.id === material.category)?.name}
              </Badge>
              {material.specifications.waterResistant && (
                <Badge variant="outline" className="text-xs">
                  <Droplets className="h-3 w-3 mr-1" />
                  Water Resistant
                </Badge>
              )}
              {material.sustainability === 'A++' && (
                <Badge variant="outline" className="text-xs text-green-600">
                  <Leaf className="h-3 w-3 mr-1" />
                  Eco-Friendly
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {cart.length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" asChild>
              <a href="/design-generator">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Design Generator
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Material Library</h1>
          <p className="text-muted-foreground">Browse and select from thousands of building materials with specifications and pricing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${
                        selectedCategory === category.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline" className="text-xs">{category.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Price Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">Under ₹50</SelectItem>
                    <SelectItem value="medium">₹50 - ₹100</SelectItem>
                    <SelectItem value="high">Above ₹100</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Features Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="waterResistant" />
                    <Label htmlFor="waterResistant" className="text-sm">Water Resistant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ecoFriendly" />
                    <Label htmlFor="ecoFriendly" className="text-sm">Eco-Friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fireResistant" />
                    <Label htmlFor="fireResistant" className="text-sm">Fire Resistant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inStock" />
                    <Label htmlFor="inStock" className="text-sm">In Stock</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Materials Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredMaterials.length} materials found
                </span>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Materials Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map(renderMaterialCard)}
              </div>
            ) : (
              <div>
                {filteredMaterials.map(renderMaterialList)}
              </div>
            )}

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex justify-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Material List
          </Button>
          <Button variant="outline">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Materials
          </Button>
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Quantities
          </Button>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            Request Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
