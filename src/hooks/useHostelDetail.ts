import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Hostel } from '../types';

export function useHostelDetail(id: string | undefined) {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchHostel = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!isSupabaseConfigured()) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('hostels')
          .select('*, rooms(*), hostel_images(*)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setHostel(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch hostel details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [id]);

  return { hostel, loading, error };
}
