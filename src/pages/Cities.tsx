import { MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useHostels } from "../hooks/useHostels";
import { useMemo } from "react";
import { CITIES } from "../utils/constants";

export default function Cities() {
  const { allData, loading } = useHostels();

  const cities = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allData) {
      allData.forEach((h) => {
        const city = h.city || "Faisalabad";
        counts[city] = (counts[city] || 0) + 1;
      });
    }

    const cityList = CITIES.filter((c) => c !== "Other").map((c) => ({
      name: c,
      active: !!counts[c] && counts[c] > 0,
      count: counts[c] || 0,
    }));

    // Add any dynamic cities that were created
    Object.keys(counts).forEach((c) => {
      if (c !== "Other" && !CITIES.includes(c)) {
        cityList.push({
          name: c,
          active: true,
          count: counts[c],
        });
      }
    });

    return cityList.sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return b.count - a.count;
    });
  }, [allData]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header Area ── */}
      <div className="bg-primary/5 border-b border-border text-foreground py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Cities We Cover</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We are expanding rapidly across Pakistan to bring you the best student accommodation experience.
          </p>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary/70 uppercase mb-2">Coverage</p>
            <h2 className="text-3xl font-bold">Browse by City</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground">More cities expanding soon</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {!loading && cities.map((city) => {
            const isActive = city.active;
            
            return isActive ? (
              <Link
                key={city.name}
                to={`/hostels?search=${city.name}`}
                className="group flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <MapPin className="mb-3 opacity-90" size={24} />
                <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                <p className="text-sm font-medium opacity-80">{city.count} hostels</p>
              </Link>
            ) : (
              <div
                key={city.name}
                className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-card border border-border text-muted-foreground opacity-60 cursor-not-allowed"
              >
                <MapPin className="mb-3 opacity-50" size={24} />
                <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                <p className="text-sm font-medium opacity-60">Coming soon</p>
              </div>
            );
          })}

          <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-card border border-dashed border-border text-muted-foreground opacity-70">
            <MapPin className="mb-3 opacity-50" size={24} />
            <h3 className="font-bold text-lg mb-1">More Cities</h3>
            <p className="text-sm font-medium opacity-80">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
