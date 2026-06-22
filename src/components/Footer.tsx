import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { CITIES } from "../utils/constants";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border text-muted-foreground mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5">
            Pakistan&apos;s student housing platform. Find verified hostels near your university with one search.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Browse Hostels", to: "/hostels" },
              { label: "List Your Property", to: "/register" },
              { label: "About Us", to: "/about" },
              { label: "Contact Us", to: "/contact" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="hover:text-foreground transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Cities</h4>
          <ul className="space-y-2.5 text-sm">
            {CITIES.map((city) => (
              <li key={city} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-foreground">{city}</span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground/50">More soon</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 text-primary shrink-0" />
              <span>rafayalishah74@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 text-primary shrink-0" />
              <span>+92 3287675530</span>
            </li>

          </ul>
        </div>
      </div>

      <div className="border-t border-border max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-3 items-center justify-between text-xs text-muted-foreground">
        <p>© 2026 HostelSpot. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
