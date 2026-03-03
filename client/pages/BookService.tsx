"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Select Service" },
  { id: 2, title: "Schedule & Address" },
  { id: 3, title: "Your Details" },
  { id: 4, title: "Additional Options" },
  { id: 5, title: "Review" },
  { id: 6, title: "Confirmation" },
];

const timeSlots = [
  { id: "morning", label: "Morning (9AM - 12PM)", price: 0 },
  { id: "afternoon", label: "Afternoon (12PM - 4PM)", price: 50 },
  { id: "evening", label: "Evening (4PM - 8PM)", price: 100 },
];

export default function BookingPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    serviceType: "",
    fullAddress: "",
    pincode: "",
    timeSlot: "",
    isUrgent: false,
    name: "",
    mobile: "",
    email: "",
    notes: "",
    acceptTerms: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceType !== "";
      case 2:
        return formData.fullAddress && selectedDate && formData.timeSlot;
      case 3:
        return formData.name && formData.mobile;
      case 6:
        return formData.acceptTerms;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      alert("Please complete required fields.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const calculateEstimatedCost = () => {
    let base = 500;

    if (formData.isUrgent) base += 200;

    const slot = timeSlots.find((s) => s.id === formData.timeSlot);
    if (slot?.price) base += slot.price;

    return base;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const bookingData = {
        ...formData,
        date: selectedDate,
        estimatedCost: calculateEstimatedCost(),
        status: "pending",
      };

      console.log("Booking Data:", bookingData);

      await new Promise((res) => setTimeout(res, 1500));

      alert("Booking Confirmed!");
      navigate("/user-dashboard");
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Service</h2>
            <select
              className="w-full border p-2 rounded"
              value={formData.serviceType}
              onChange={(e) =>
                handleInputChange("serviceType", e.target.value)
              }
            >
              <option value="">Select Service</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Schedule & Address
            </h2>

            <input
              type="date"
              className="w-full border p-2 rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <select
              className="w-full border p-2 rounded"
              value={formData.timeSlot}
              onChange={(e) =>
                handleInputChange("timeSlot", e.target.value)
              }
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Full Address"
              className="w-full border p-2 rounded"
              value={formData.fullAddress}
              onChange={(e) =>
                handleInputChange("fullAddress", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Pincode"
              className="w-full border p-2 rounded"
              value={formData.pincode}
              onChange={(e) =>
                handleInputChange("pincode", e.target.value)
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) =>
                  handleInputChange("isUrgent", e.target.checked)
                }
              />
              Mark as Urgent (+₹200)
            </label>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Your Details
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full border p-2 rounded"
              value={formData.mobile}
              onChange={(e) =>
                handleInputChange("mobile", e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email (Optional)"
              className="w-full border p-2 rounded"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Additional Notes
            </h2>
            <textarea
              placeholder="Describe your issue..."
              className="w-full border p-2 rounded"
              value={formData.notes}
              onChange={(e) =>
                handleInputChange("notes", e.target.value)
              }
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Review</h2>
            <p>Service: {formData.serviceType}</p>
            <p>Date: {selectedDate}</p>
            <p>Time Slot: {formData.timeSlot}</p>
            <p>Address: {formData.fullAddress}</p>
            <p>Estimated Cost: ₹{calculateEstimatedCost()}</p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Confirm Booking
            </h2>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange(
                    "acceptTerms",
                    e.target.checked
                  )
                }
              />
              I accept terms & conditions
            </label>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Service Booking
        </h1>

        <div className="mb-6">
          Step {currentStep} of {steps.length}
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.acceptTerms || loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}