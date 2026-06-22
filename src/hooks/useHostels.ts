import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Hostel, HostelFilters } from '../types';
import { calculateDistance } from '../utils/distance';
import { UNIVERSITY_COORDINATES } from '../utils/constants';

const DEFAULT_FILTERS: HostelFilters = {
  search: '',
  mess: null,
  wifi: null,
  ac: null,
  ups: null,
  parking: null,
  roomType: 'ALL',
  maxPrice: 10000,
  minPrice: 4000,
  sort: 'rating',
  page: 1,
};

const ITEMS_PER_PAGE = 6;

export function useHostels(filters: Partial<HostelFilters> = {}) {
  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeFilters = useMemo(() => ({ ...DEFAULT_FILTERS, ...filters }), [filtersKey]);

  const fetchHostels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        console.log('📦 Supabase not configured');
        setAllHostels([]);
        setLoading(false);
        return;
      }

      // Supabase query - Fetch ALL hostels once
      const { data, error: fetchError } = await supabase
        .from('hostels')
        .select('*, rooms(*), hostel_images(*)');

      if (fetchError) throw fetchError;
      setAllHostels(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch hostels';
      console.error('❌ Error fetching hostels:', errorMsg);
      setError(errorMsg);
      setAllHostels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  // Apply filters instantly on the client side
  const filteredHostels = useMemo(() => {
    let result = [...allHostels];

    // Location (city) filter
    if (activeFilters.location) {
      const loc = activeFilters.location.toLowerCase();
      result = result.filter(
        (h) =>
          h.city?.toLowerCase() === loc ||
          h.address.toLowerCase().includes(loc)
      );
    }

    // Search filter
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          (h.city && h.city.toLowerCase().includes(q))
      );
    }

    // Boolean filters
    if (activeFilters.mess === true) result = result.filter((h) => h.mess_available);
    if (activeFilters.wifi === true) result = result.filter((h) => h.wifi);
    if (activeFilters.ac === true) result = result.filter((h) => h.ac);
    if (activeFilters.ups === true) result = result.filter((h) => h.ups);
    if (activeFilters.parking === true) result = result.filter((h) => h.parking);

    // Room type filter
    if (activeFilters.roomType !== 'ALL') {
      result = result.filter((h) =>
        h.rooms?.some((r) => r.type === activeFilters.roomType)
      );
    }

    // Price filter
    result = result.filter((h) => {
      if (!h.rooms || h.rooms.length === 0) return true;
      const minPrice = Math.min(...h.rooms.map((r) => r.price_per_month));
      return (
        minPrice >= activeFilters.minPrice &&
        minPrice <= activeFilters.maxPrice
      );
    });


    // Calculate distance if university is selected
    if (activeFilters.university) {
      const coords = UNIVERSITY_COORDINATES[activeFilters.university];
      if (coords) {
        result = result.map(h => {
          if (h.latitude && h.longitude) {
            h.distanceFromUni = calculateDistance(h.latitude, h.longitude, coords.lat, coords.lng);
          }
          return h;
        });
      }
    }

    // Sort
    switch (activeFilters.sort) {
      case 'distance':
        result.sort((a, b) => {
          const distA = a.distanceFromUni ?? Infinity;
          const distB = b.distanceFromUni ?? Infinity;
          return distA - distB;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'price_low':
        result.sort((a, b) => {
          const aPrice = Math.min(...(a.rooms?.map((r) => r.price_per_month) ?? [0]));
          const bPrice = Math.min(...(b.rooms?.map((r) => r.price_per_month) ?? [0]));
          return aPrice - bPrice;
        });
        break;
      case 'price_high':
        result.sort((a, b) => {
          const aPrice = Math.min(...(a.rooms?.map((r) => r.price_per_month) ?? [0]));
          const bPrice = Math.min(...(b.rooms?.map((r) => r.price_per_month) ?? [0]));
          return bPrice - aPrice;
        });
        break;
      case 'reviews':
        result.sort((a, b) => b.review_count - a.review_count);
        break;
    }

    return result;
  }, [allHostels, activeFilters]);

  const paginatedHostels = useMemo(() => {
    const page = activeFilters.page || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredHostels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHostels, activeFilters.page]);

  const totalPages = Math.ceil(filteredHostels.length / ITEMS_PER_PAGE);

  return { 
    hostels: paginatedHostels, 
    allData: allHostels,
    totalCount: filteredHostels.length,
    totalPages,
    currentPage: activeFilters.page || 1,
    loading, 
    error, 
    refetch: fetchHostels 
  };
}
