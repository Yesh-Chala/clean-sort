import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

export function FloatingActionButton() {
  return (
    <Link to="/scan">
      <Button
        size="lg"
        className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Camera className="h-6 w-6" />
        <span className="sr-only">Scan Receipt</span>
      </Button>
    </Link>
  );
}
