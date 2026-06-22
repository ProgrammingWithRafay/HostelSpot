import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "./figma/ui/sheet";
import { Button } from "./figma/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./figma/ui/dropdown-menu";
import Logo from "./Logo";


const NAV_LINKS = [
  { label: "Browse Hostels", to: "/hostels" },
  { label: "Cities", to: "/cities" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function getDashboardRoute(role?: string) {
  if (role === "HOSTEL_OWNER") return "/owner-dashboard";
  if (role === "ADMIN") return "/admin";
  return "/dashboard";
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name 
    || user?.user_metadata?.full_name 
    || user?.user_metadata?.name 
    || user?.email?.split('@')[0] 
    || "Student";

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={label} to={to} className="text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                  {displayName.split(" ")[0]}
                  <ChevronDown size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate(getDashboardRoute(profile?.role))}>
                  <LayoutDashboard size={15} className="mr-2" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut size={15} className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-xl">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full pt-14 px-6 pb-8 gap-6">
              <nav className="space-y-1">
                {NAV_LINKS.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border pt-4 space-y-2">
                {user ? (
                  <>
                    <Button className="w-full" onClick={() => { navigate(getDashboardRoute(profile?.role)); setMobileOpen(false); }}>
                      <LayoutDashboard size={16} className="mr-2" /> Dashboard
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
