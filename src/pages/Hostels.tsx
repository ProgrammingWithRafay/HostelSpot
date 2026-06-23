import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Building2 } from "lucide-react";
import HostelCard from "../components/HostelCard";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { Checkbox } from "../components/figma/ui/checkbox";
import { Slider } from "../components/figma/ui/slider";
import { Label } from "../components/figma/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/figma/ui/select";
import { Button } from "../components/figma/ui/button";
import { useHostels } from "../hooks/useHostels";
import type { HostelFilters } from "../types";

const AMENITY_OPTIONS = [
  { key: "wifi", label: "WiFi" },
  { key: "ac", label: "AC" },
  { key: "mess", label: "Meals / Mess" },
  { key: "ups", label: "UPS Backup" },
  { key: "parking", label: "Parking" },
];


export default function Hostels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 20000);

  const filters: Partial<HostelFilters> = useMemo(() => {
    const loc = searchParams.get('location');
    const uni = searchParams.get('university');
    let sortVal = searchParams.get('sort') as HostelFilters['sort'];
    
    // Auto-sort by distance if university is selected and no sort is explicitly set
    if (uni && !sortVal) {
      sortVal = 'distance';
    } else if (!sortVal) {
      sortVal = 'rating';
    }

    return {
      location: loc || undefined,
      university: uni || undefined,
      search: searchParams.get('search') || '',
      mess: searchParams.get('mess') === 'true' ? true : null,
      wifi: searchParams.get('wifi') === 'true' ? true : null,
      ac: searchParams.get('ac') === 'true' ? true : null,
      parking: searchParams.get('parking') === 'true' ? true : null,
      roomType: (searchParams.get('roomType') as HostelFilters['roomType']) || 'ALL',
      maxPrice: Number(searchParams.get('maxPrice')) || 20000,
      minPrice: Number(searchParams.get('minPrice')) || 4000,
      sort: sortVal,
      page: Number(searchParams.get('page')) || 1,
    };
  }, [searchParams]);

  const { hostels, totalCount, totalPages, currentPage, loading } = useHostels(filters);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'false') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  // Sync local states if URL params change externally
  useEffect(() => {
    setLocalSearch(filters.search || '');
    setLocalMaxPrice(filters.maxPrice || 20000);
  }, [filters.search, filters.maxPrice]);

  const debouncedSearch = useDebounce(localSearch, 500);

  // Debounce search text
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('search') || '')) {
      updateFilter('search', debouncedSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, searchParams]);

  const toggleAmenity = (key: string) => {
    const current = searchParams.get(key) === 'true';
    updateFilter(key, current ? null : 'true');
  };

  const locationParam = filters.location || filters.search || "";

  const filterPanelContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Search</h3>
        <input
          type="text"
          placeholder="Name or location..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md"
        />
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Max Budget (PKR/mo)</h3>
        <Slider
          min={4000} max={20000} step={500}
          value={[localMaxPrice]}
          onValueChange={(val) => setLocalMaxPrice(val[0])}
          onValueCommit={(val) => updateFilter('maxPrice', val[0].toString())}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>PKR {filters.minPrice?.toLocaleString()}</span>
          <span>PKR {localMaxPrice.toLocaleString()}</span>
        </div>
      </div>




      {/* Amenities */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Amenities</h3>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map(({ key, label }) => {
            const isChecked = searchParams.get(key) === 'true';
            return (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`amenity-${key}`}
                  checked={isChecked}
                  onCheckedChange={() => toggleAmenity(key)}
                />
                <Label htmlFor={`amenity-${key}`} className="text-sm font-normal cursor-pointer">{label}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setSearchParams({})}
      >
        <X size={14} className="mr-1" /> Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">
              {locationParam ? `Hostels matching "${locationParam}"` : "All Hostels"}
            </h1>
            <p className="text-sm text-muted-foreground">{totalCount} hostel{totalCount !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={15} className="mr-1.5" /> Filters
            </Button>
            <Select value={filters.sort} onValueChange={(v) => updateFilter('sort', v)}>
              <SelectTrigger className="w-44 h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
                <SelectContent>
                {filters.university && <SelectItem value="distance">Closest to University</SelectItem>}
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Left: Filters */}
          <aside className={`space-y-5 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-primary" /> Filter Results
              </h2>
              {filterPanelContent}
            </div>
          </aside>

          {/* Right: Results */}
          <div>
            {loading && hostels.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex flex-col h-72 bg-muted rounded-2xl"></div>
                ))}
              </div>
            ) : hostels.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-semibold text-lg">No hostels match your filters</p>
                <p className="text-sm mt-1 text-muted-foreground">Try relaxing your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {hostels.map((h) => <HostelCard key={h.id} hostel={h} />)}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="mt-10">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(page) => {
                    updateFilter('page', page.toString());
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
