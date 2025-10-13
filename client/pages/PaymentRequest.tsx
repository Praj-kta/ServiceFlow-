import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  CheckCircle,
  FileText,
  Camera,
  Upload,
  Smartphone,
  QrCode,
  Wallet,
  Receipt,
  Clock,
  User,
  MapPin,
  Star,
  Zap,
  Send,
  Calculator,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function PaymentRequest() {
  const [paymentData, setPaymentData] = useState({
    serviceId: 'SRV001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+91 9876543210',
    serviceType: 'House Deep Cleaning',
    completedDate: '2024-12-25',
    actualAmount: '',
    breakdown: {
      baseService: '',
      additionalWork: '',
      materials: '',
      discount: ''
    },
    workDescription: '',
    beforePhotos: [],
    afterPhotos: [],
    notes: '',
    paymentMethod: 'multiple'
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('breakdown.')) {
      const breakdownField = field.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        breakdown: { ...prev.breakdown, [breakdownField]: value }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateTotal = () => {
    const base = parseFloat(paymentData.breakdown.baseService) || 0;
    const additional = parseFloat(paymentData.breakdown.additionalWork) || 0;
    const materials = parseFloat(paymentData.breakdown.materials) || 0;
    const discount = parseFloat(paymentData.breakdown.discount) || 0;
    return base + additional + materials - discount;
  };

  const sendPaymentRequest = () => {
    alert(`Payment request of ₹${calculateTotal()} sent to ${paymentData.customerName}`);
  };

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
          <Button variant="outline" asChild>
            <a href="/provider-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Send Payment Request</h1>
            <p className="text-muted-foreground">Create and send payment request after service completion</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceId">Service ID</Label>
                      <Input 
                        id="serviceId"
                        value={paymentData.serviceId}
                        onChange={(e) => handleInputChange('serviceId', e.target.value)}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="completedDate">Completion Date</Label>
                      <Input 
                        id="completedDate"
                        type="date"
                        value={paymentData.completedDate}
                        onChange={(e) => handleInputChange('completedDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Input 
                      id="serviceType"
                      value={paymentData.serviceType}
                      onChange={(e) => handleInputChange('serviceType', e.target.value)}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input 
                      id="customerName"
                      value={paymentData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input 
                        id="customerEmail"
                        type="email"
                        value={paymentData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input 
                        id="customerPhone"
                        value={paymentData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Payment Breakdown
                  </CardTitle>
                  <CardDescription>Enter actual costs based on work completed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="baseService">Base Service Charge</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="baseService"
                          type="number"
                          placeholder="1000"
                          className="pl-10"
                          value={paymentData.breakdown.baseService}
                          onChange={(e) => handleInputChange('breakdown.baseService', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="additionalWork">Additional Work</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="additionalWork"
                          type="number"
                          placeholder="300"
                          className="pl-10"
                          value={paymentData.breakdown.additionalWork}
                          onChange={(e) => handleInputChange('breakdown.additionalWork', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="materials">Materials Used</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="materials"
                          type="number"
                          placeholder="200"
                          className="pl-10"
                          value={paymentData.breakdown.materials}
                          onChange={(e) => handleInputChange('breakdown.materials', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (if any)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="discount"
                          type="number"
                          placeholder="50"
                          className="pl-10"
                          value={paymentData.breakdown.discount}
                          onChange={(e) => handleInputChange('breakdown.discount', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">₹{calculateTotal()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Work Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Work Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="workDescription">Detailed Description of Work Done</Label>
                    <Textarea 
                      id="workDescription"
                      placeholder="Describe the work completed, any additional services provided, and materials used..."
                      className="min-h-[120px]"
                      value={paymentData.workDescription}
                      onChange={(e) => handleInputChange('workDescription', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes"
                      placeholder="Any additional notes for the customer..."
                      value={paymentData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Photo Evidence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Work Evidence
                  </CardTitle>
                  <CardDescription>Upload before and after photos of the work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Before Photos</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photos
                          </Button>
                          <p className="text-xs text-muted-foreground">Upload before work photos</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>After Photos</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photos
                          </Button>
                          <p className="text-xs text-muted-foreground">Upload completed work photos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Request Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Payment Request Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Base Service:</span>
                      <span>₹{paymentData.breakdown.baseService || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Additional Work:</span>
                      <span>₹{paymentData.breakdown.additionalWork || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Materials:</span>
                      <span>₹{paymentData.breakdown.materials || '0'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span className="text-red-600">-₹{paymentData.breakdown.discount || '0'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">₹{calculateTotal()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Payment Options for Customer</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit/Debit Cards
                      </div>
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        UPI/Digital Wallets
                      </div>
                      <div className="flex items-center">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code Payment
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cash Payment
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 text-sm">Important</h4>
                        <p className="text-xs text-yellow-700">
                          Customer will receive SMS and app notification with payment link and details
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={sendPaymentRequest}
                    disabled={!paymentData.breakdown.baseService || calculateTotal() <= 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Payment Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
