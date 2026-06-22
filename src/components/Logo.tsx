import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconSize?: number;
  containerSize?: string;
}

export default function Logo({ 
  className = "", 
  textClassName = "text-xl", 
  iconSize = 22,
  containerSize = "w-10 h-10"
}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 group ${className}`}>
      {/* Icon Container with Gradient and Shadow */}
      <div className={`relative flex items-center justify-center ${containerSize} rounded-[14px] bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}>
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-[14px] mix-blend-overlay"></div>
        
        {/* Custom SVG: Combination of a Location Pin and a House/Hostel */}
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10 drop-shadow-md"
        >
          {/* Location Pin Outline */}
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
          {/* Inner House Roof */}
          <path d="M8 11l4-3 4 3" />
          {/* Inner House Walls & Door */}
          <path d="M9 11v4h2v-2h2v2h2v-4" />
        </svg>
      </div>

      {/* Brand Name */}
      <span className={`font-black tracking-tight text-foreground ${textClassName}`}>
        Hostel<span className="text-primary">Spot</span>
      </span>
    </Link>
  );
}
