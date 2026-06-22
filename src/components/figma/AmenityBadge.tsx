import { Wifi, Wind, Utensils, Zap, Car, Shield, WashingMachine, Droplets } from "lucide-react";
type AmenityKey = string;

const AMENITY_CONFIG: Record<AmenityKey, { label: string; Icon: React.ElementType }> = {
  wifi: { label: "WiFi", Icon: Wifi },
  ac: { label: "AC", Icon: Wind },
  meals: { label: "Meals", Icon: Utensils },
  ups: { label: "UPS", Icon: Zap },
  parking: { label: "Parking", Icon: Car },
  security: { label: "Security", Icon: Shield },
  laundry: { label: "Laundry", Icon: WashingMachine },
  water: { label: "24h Water", Icon: Droplets },
};

interface AmenityBadgeProps {
  type: AmenityKey;
  size?: "sm" | "md";
}

export function AmenityBadge({ type, size = "sm" }: AmenityBadgeProps) {
  const normalized = type.toLowerCase().replace(/[-_ ]/g, '');
  
  let configKey = Object.keys(AMENITY_CONFIG).find(k => k === normalized);
  
  if (!configKey) {
    if (normalized.includes('wifi')) configKey = 'wifi';
    else if (normalized.includes('ac') || normalized.includes('air')) configKey = 'ac';
    else if (normalized.includes('mess') || normalized.includes('food') || normalized.includes('meal')) configKey = 'meals';
    else if (normalized.includes('ups') || normalized.includes('gen')) configKey = 'ups';
    else if (normalized.includes('park')) configKey = 'parking';
    else if (normalized.includes('laundry') || normalized.includes('wash')) configKey = 'laundry';
  }

  const config = configKey ? AMENITY_CONFIG[configKey] : null;
  const Icon = config ? config.Icon : Shield;
  const label = config ? config.label : type;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-border bg-secondary text-secondary-foreground font-medium ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}>
      <Icon size={size === "sm" ? 11 : 14} />
      {label}
    </span>
  );
}
