import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Zap } from "lucide-react";
import { useState } from "react";

const SERVICE_NAMES: Record<string, string> = {
  "new-home-construction": "New Home Construction",
  "apartment-project": "Apartment Project",
  "cafe-interior": "Café Interior Design",
  "hotel-bar-resort": "Hotel / Bar / Resort Fitout or Construction",
  "office-interior": "Office Interior Design",
  "civil-structural": "Civil & Structural Work",
  "tiles-flooring": "Tiles & Flooring",
};

const TASKS: Record<string,string[]> = {
  "new-home-construction": [
    'Full structure construction','Foundation and civil work','Electrical & plumbing installation','Roofing and flooring','Finishing and painting'
  ],
  "apartment-project": [
    'Complete apartment construction','Structural and civil work','Interior layout and finishing','Electrical and plumbing setup','Flooring, tiling, and painting'
  ],
  "cafe-interior": [
    'Space planning and layout design','Furniture & fixture selection','Lighting design','Decorative elements installation','Wall finishes and painting'
  ],
  "hotel-bar-resort": [
    'Complete fitout & construction planning','Structural modifications','Interior and exterior design','MEP (Mechanical, Electrical, Plumbing) works','Flooring, painting, and finishing'
  ],
  "office-interior": [
    'Workspace planning & layout','Furniture & storage design','Lighting & electrical work','Wall finishes and partitions','Flooring and painting'
  ],
  "civil-structural": [
    'Foundation and structural framework','Concrete works','Masonry and brickwork','Structural repairs and reinforcement','Roof and slab construction'
  ],
  "tiles-flooring": [
    'Tile selection & material sourcing','Floor preparation','Tile laying and alignment','Grouting and finishing','Polishing and maintenance'
  ],
};

export default function ContractService() {
  const [sp] = useSearchParams();
  const serviceKey = sp.get("service") || "new-home-construction";
  const serviceName = SERVICE_NAMES[serviceKey] ?? "Contract Service";

  const [bhk, setBhk] = useState("2 BHK");
  const [floors, setFloors] = useState("1");
  const [area, setArea] = useState("1000");

  const goBack = () => (window.location.href = "/user-dashboard?tab=services");
  const proceed = () => {
    const params = new URLSearchParams({ service: serviceKey, bhk, floors, area });
    window.location.href = `/contract-booking?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50 to-background">
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceFlow</h1>
          </div>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Services
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Home className="h-5 w-5 mr-2" />{serviceName}</CardTitle>
            <CardDescription>Provide project details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Specific Tasks Included</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {(TASKS[serviceKey] || []).map((t)=> (
                  <div key={t} className="p-2 border rounded bg-muted/50">{t}</div>
                ))}
              </div>
            </div>
            {(serviceKey === "new-home-construction" || serviceKey === "apartment-project") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Type of BHK</Label>
                  <Select value={bhk} onValueChange={setBhk}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4 BHK">4 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Number of Floors</Label>
                  <Input value={floors} onChange={(e)=>setFloors(e.target.value)} placeholder="e.g. 1" />
                </div>
                <div>
                  <Label>Plot/Carpet Area (sq.ft)</Label>
                  <Input value={area} onChange={(e)=>setArea(e.target.value)} placeholder="e.g. 1000" />
                </div>
              </div>
            )}
            {!(serviceKey === "new-home-construction" || serviceKey === "apartment-project") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Approx. Area (sq.ft)</Label>
                  <Input value={area} onChange={(e)=>setArea(e.target.value)} placeholder="e.g. 800" />
                </div>
                <div>
                  <Label>Floors/Levels (if any)</Label>
                  <Input value={floors} onChange={(e)=>setFloors(e.target.value)} placeholder="e.g. 1" />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={goBack}>Cancel</Button>
              <Button onClick={proceed}>Book Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
