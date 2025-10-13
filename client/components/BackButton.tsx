import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

export default function BackButton({ 
  href, 
  onClick, 
  text = "Back", 
  variant = "outline",
  className = ""
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleClick}
      className={`flex items-center ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}
