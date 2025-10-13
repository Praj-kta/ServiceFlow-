import PlaceholderPage from "./PlaceholderPage";
import { Settings } from "lucide-react";

export default function MachineServices() {
  return (
    <PlaceholderPage
      title="Machine Services"
      description="Professional repair and maintenance for all your home appliances and machines"
      icon={Settings}
      suggestedActions={[
        "Book AC repair and maintenance services",
        "Schedule washing machine and dryer repairs",
        "Get refrigerator and freezer diagnostic services",
        "Microwave, dishwasher, and small appliance repairs",
        "Water heater and HVAC system maintenance"
      ]}
    />
  );
}
