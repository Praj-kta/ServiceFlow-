import PlaceholderPage from "./PlaceholderPage";
import { Users } from "lucide-react";

export default function Providers() {
  return (
    <PlaceholderPage
      title="Service Providers"
      description="Connect with verified professionals and manage provider relationships"
      icon={Users}
      suggestedActions={[
        "Browse verified service provider profiles",
        "View provider ratings, reviews, and portfolios", 
        "Apply to become a service provider",
        "Manage provider onboarding and verification",
        "Track provider performance analytics"
      ]}
    />
  );
}
