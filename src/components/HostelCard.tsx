import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { StarRating } from "./figma/StarRating";
import { AmenityBadge } from "./figma/AmenityBadge";
import type { Hostel } from "../types";

interface HostelCardProps {
  hostel: Hostel;
}



export default function HostelCard({ hostel }: HostelCardProps) {
  // Map missing data
  const area = hostel.address || "Unknown Area";
  const city = hostel.city || "Faisalabad";
  const amenities: string[] = [];
  if (hostel.wifi) amenities.push("WiFi");
  if (hostel.ac) amenities.push("AC");
  if (hostel.ups) amenities.push("UPS");
  if (hostel.parking) amenities.push("Parking");
  if (hostel.mess_available) amenities.push("Mess");
  const priceFrom = hostel.rooms && hostel.rooms.length > 0
    ? Math.min(...hostel.rooms.map(r => r.price_per_month))
    : 0;
  const image = hostel.hostel_images?.[0]?.image_url || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop";

  return (
    <Link
      to={`/hostels/${hostel.id}`}
      className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={hostel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base leading-snug line-clamp-1">{hostel.name}</h3>
          {(hostel.review_count > 0 && hostel.rating) ? (
            <StarRating rating={hostel.rating} />
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">New</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center flex-wrap gap-1 mb-3">
          <MapPin size={11} />{area}, {city}
          {hostel.distanceFromUni !== undefined && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px]">
              {hostel.distanceFromUni.toFixed(1)} km from University
            </span>
          )}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {amenities.slice(0, 4).map((a) => <AmenityBadge key={a} type={a} />)}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-bold text-primary">
              PKR {priceFrom.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
