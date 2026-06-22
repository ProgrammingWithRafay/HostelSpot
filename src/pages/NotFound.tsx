import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "../components/figma/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center bg-background">
      <div className="max-w-md">
        <div className="text-[120px] font-bold text-primary/10 leading-none select-none mb-2">404</div>
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Looks like this hostel doesn&apos;t exist. Maybe you got the wrong address. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")} className="rounded-xl gap-2">
            <Home size={16} /> Go to Homepage
          </Button>
          <Button variant="outline" onClick={() => navigate("/hostels")} className="rounded-xl gap-2">
            <Search size={16} /> Browse Hostels
          </Button>
        </div>
      </div>
    </div>
  );
}
