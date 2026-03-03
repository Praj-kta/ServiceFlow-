import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, CheckCircle, Home, MapPin, Zap } from "lucide-react";
import { format } from "date-fns";

const SERVICE_LABELS: Record<string,string> = {
  "new-home-construction":"New Home Construction",
  "apartment-project":"Apartment Project",
  "cafe-interior":"Café Interior Design",
  "hotel-bar-resort":"Hotel / Bar / Resort Fitout or Construction",
  "office-interior":"Office Interior Design",
  "civil-structural":"Civil & Structural Work",
  "tiles-flooring":"Tiles & Flooring",
};

const OPTIONS: Record<string, {id:string,label:string}[]> = {
  "new-home-construction": [
    { id:"duplex", label:"Duplex House Construction — ₹1,800 – ₹2,500 per sq.ft" },
    { id:"triplex", label:"Triplex House Construction — ₹2,000 – ₹2,800 per sq.ft" },
    { id:"villa", label:"Bungalow / Independent Villa Construction — ₹2,200 – ₹3,000 per sq.ft" },
    { id:"row", label:"Row House / Townhouse Construction — ₹1,800 – ₹2,400 per sq.ft" },
    { id:"farmhouse", label:"Farmhouse Construction — ₹1,600 – ₹2,300 per sq.ft" },
    { id:"custom", label:"Custom Design Home Construction — ₹2,000 – ₹3,200 per sq.ft" },
  ],
  "apartment-project": [
    { id:"studio", label:"Studio Apartment — ₹1,200 – ₹1,800 per sq.ft" },
    { id:"1bhk", label:"1 BHK Apartment — ₹1,500 – ₹2,200 per sq.ft" },
    { id:"2bhk", label:"2 BHK Apartment — ₹1,800 – ₹2,500 per sq.ft" },
    { id:"3bhk", label:"3 BHK Apartment — ₹2,000 – ₹2,800 per sq.ft" },
    { id:"luxury", label:"Luxury Apartment — ₹2,800 – ₹3,800 per sq.ft" },
    { id:"penthouse", label:"Penthouse / Sky Villa — ₹3,500 – ₹5,000 per sq.ft" },
  ],
  "cafe-interior": [
    { id:"small", label:"Small Café Setup (up to 500 sq.ft) — ₹1,200 – ₹1,800 per sq.ft" },
    { id:"medium", label:"Medium Café Interior (500–1,000 sq.ft) — ₹1,500 – ₹2,200 per sq.ft" },
    { id:"premium", label:"Premium Café / Theme Design — ₹2,200 – ₹3,200 per sq.ft" },
  ],
  "hotel-bar-resort": [
    { id:"budget-hotel", label:"Budget Hotel Fitout — ₹2,000 ��� ₹3,000 per sq.ft" },
    { id:"luxury-hotel", label:"Luxury Hotel / Resort Construction — ₹3,200 – ₹5,000 per sq.ft" },
    { id:"bar-lounge", label:"Bar / Lounge Interior Design — ₹2,500 – ₹4,000 per sq.ft" },
  ],
  "office-interior": [
    { id:"basic", label:"Basic Office Setup — ₹1,200 – ₹1,800 per sq.ft" },
    { id:"corporate", label:"Corporate Office Interior — ₹1,800 – ₹2,800 per sq.ft" },
    { id:"luxury", label:"Luxury / Modern Office Design — ₹2,800 – ₹3,800 per sq.ft" },
  ],
  "civil-structural": [
    { id:"residential", label:"Residential Structural Work — ₹1,500 – ₹2,200 per sq.ft" },
    { id:"commercial", label:"Commercial Structural Work — ₹1,800 – ₹2,800 per sq.ft" },
    { id:"industrial", label:"Industrial / Heavy Structure Work — ₹2,000 – ₹3,500 per sq.ft" },
  ],
  "tiles-flooring": [
    { id:"ceramic", label:"Ceramic / Vitrified Tile Flooring — ₹70 – ₹120 per sq.ft" },
    { id:"stone", label:"Granite / Marble Flooring — ₹150 – ₹300 per sq.ft" },
    { id:"wood", label:"Wooden / Vinyl Flooring — ₹200 – ₹400 per sq.ft" },
  ],
};

const SPECIFIC_TASKS: Record<string, string[]> = {
  'new-home-construction': [
    'Full structure construction',
    'Foundation and civil work',
    'Electrical & plumbing installation',
    'Roofing and flooring',
    'Finishing and painting',
  ],
  'apartment-project': [
    'Complete apartment construction','Structural and civil work','Interior layout and finishing','Electrical and plumbing setup','Flooring, tiling, and painting'
  ],
  'cafe-interior': [
    'Space planning and layout design','Furniture & fixture selection','Lighting design','Decorative elements installation','Wall finishes and painting'
  ],
  'hotel-bar-resort': [
    'Complete fitout & construction planning','Structural modifications','Interior and exterior design','MEP (Mechanical, Electrical, Plumbing) works','Flooring, painting, and finishing'
  ],
  'office-interior': [
    'Workspace planning & layout','Furniture & storage design','Lighting & electrical work','Wall finishes and partitions','Flooring and painting'
  ],
  'civil-structural': [
    'Foundation and structural framework','Concrete works','Masonry and brickwork','Structural repairs and reinforcement','Roof and slab construction'
  ],
  'tiles-flooring': [
    'Tile selection & material sourcing','Floor preparation','Tile laying and alignment','Grouting and finishing','Polishing and maintenance'
  ],
};

const SUB_OPTIONS: Record<string, string[]> = {
  'Full structure construction': ['Design + Build', 'Build Only'],
  'Foundation and civil work': ['Pile/Foundation types', 'Soil testing'],
  'Electrical & plumbing installation': ['Wiring layout', 'Piping plan'],
  'Roofing and flooring': ['Tiles / Marble / Wood', 'Waterproofing'],
};

export default function ContractBooking(){
  const [sp] = useSearchParams();
  const service = sp.get("service") || "new-home-construction";
  const bhk = sp.get("bhk") || "2 BHK";
  const floors = sp.get("floors") || "1";
  const area = sp.get("area") || "1000";

  const [step, setStep] = useState(1);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const next = ()=> setStep((s)=>Math.min(4, s+1));
  const prev = ()=> setStep((s)=>Math.max(1, s-1));



  const confirm = async () => {
    try {
      const payload = {
         userId: 'test-user-1',
         serviceType: service,
         projectDetails: {
           type: projectType,
           bhk,
           floors,
           area,
           specificTask: selectedTask
         },
         scheduling: {
           startDate: date,
           preferredTime: time
         },
         contact: {
           name,
           mobile
         },
         status: 'pending'
      };
      
      await api.post('/contracts', payload);
      const bookingId = 'BK-CONTRACT-' + Date.now(); // Or use ID from response
      window.location.href = `/booking-confirmation?booking=${bookingId}&service=${encodeURIComponent(SERVICE_LABELS[service]??'Contract Service')}`;
    } catch (error) {
      console.error(error);
      alert('Failed to submit contract inquiry');
    }
  }

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
          <Button variant="outline" onClick={()=>window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Steps */}
        <div className="flex items-center justify-between mb-6">
          {["Details","Service Options","Schedule","Confirmation"].map((t,i)=>{
            const active = step===i+1; const completed = step>i+1;
            return (
              <div key={t} className="flex items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${active? 'border-primary bg-primary text-primary-foreground' : completed? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground text-muted-foreground'}`}>{completed? <CheckCircle className="h-4 w-4"/> : i+1}</div>
                <div className={`ml-2 hidden md:block text-sm ${active? 'text-primary' : completed? 'text-green-600' : 'text-muted-foreground'}`}>{t}</div>
                {i<3 && <div className={`hidden md:block w-16 h-0.5 mx-3 ${completed? 'bg-green-500' : 'bg-muted'}`} />}
              </div>
            )
          })}
        </div>

        {step===1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Home className="h-5 w-5 mr-2" />{SERVICE_LABELS[service] || 'Contract Service'}</CardTitle>
              <CardDescription>Select specific task and enter project basics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Specific Task</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {(SPECIFIC_TASKS[service] || []).map((t)=> (
                    <button key={t} className={`p-3 border rounded text-left ${selectedTask===t? 'border-primary bg-primary/5' : ''}`} onClick={()=> setSelectedTask(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                {selectedTask && (
                  <div className="mt-3 p-3 border rounded bg-muted/50 text-sm">
                    <div className="font-medium mb-1">Options for {selectedTask}</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {(SUB_OPTIONS[selectedTask] || ['Includes planning, materials, and quality checks']).map((o)=> (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Type of BHK</Label>
                  <Input defaultValue={bhk} onChange={(e)=>{ const u = new URLSearchParams(window.location.search); u.set('bhk', e.target.value); window.history.replaceState(null, '', `${window.location.pathname}?${u.toString()}`); }} />
                </div>
                <div>
                  <Label>Floors</Label>
                  <Input defaultValue={floors} onChange={(e)=>{ const u = new URLSearchParams(window.location.search); u.set('floors', e.target.value); window.history.replaceState(null, '', `${window.location.pathname}?${u.toString()}`); }} />
                </div>
                <div>
                  <Label>Plot/Carpet Area (sq.ft)</Label>
                  <Input defaultValue={area} onChange={(e)=>{ const u = new URLSearchParams(window.location.search); u.set('area', e.target.value); window.history.replaceState(null, '', `${window.location.pathname}?${u.toString()}`); }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step===2 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Type</CardTitle>
              <CardDescription>Select a suitable option</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={projectType} onValueChange={setProjectType}>
                {OPTIONS[service]?.map((opt)=> (
                  <label key={opt.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem id={opt.id} value={opt.id} />
                      <span>{opt.label}</span>
                    </div>
                    <Badge variant="outline">Select</Badge>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {step===3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="h-5 w-5 mr-2"/>Schedule</CardTitle>
              <CardDescription>Choose date and time</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Time Slot</Label>
                <Input value={time} onChange={(e)=>setTime(e.target.value)} placeholder="e.g. 11:00 AM" />
              </div>
              <div>
                <Label>Contact Name</Label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="+91 XXXXX-XXXXX" />
              </div>
            </CardContent>
          </Card>
        )}

        {step===4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2"/>Confirmation</CardTitle>
              <CardDescription>Review and confirm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Service:</span> <span className="font-medium">{SERVICE_LABELS[service]}</span></div>
              <div><span className="text-muted-foreground">Task:</span> <span className="font-medium">{selectedTask || 'Not selected'}</span></div>
              <div><span className="text-muted-foreground">BHK:</span> <span className="font-medium">{bhk}</span></div>
              <div><span className="text-muted-foreground">Floors:</span> <span className="font-medium">{floors}</span></div>
              <div><span className="text-muted-foreground">Area:</span> <span className="font-medium">{area} sq.ft</span></div>
              <div><span className="text-muted-foreground">Project Type:</span> <span className="font-medium">{projectType || 'Not selected'}</span></div>
              <div><span className="text-muted-foreground">Schedule:</span> <span className="font-medium">{date? format(date,'PPP'): 'Not set'} {time}</span></div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prev} disabled={step===1}><ArrowLeft className="h-4 w-4 mr-2"/>Previous</Button>
          {step<4 ? (
            <Button onClick={next} disabled={(step===1 && !selectedTask) || (step===2 && !projectType)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirm}><CheckCircle className="h-4 w-4 mr-2"/>Confirm Booking</Button>
          )}
        </div>
      </div>
    </div>
  );
}
