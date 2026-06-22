import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Booking } from '../types';

export function useBooking() {
  const { user, isDemoMode, isLocalUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user && !isDemoMode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isLocalUser) {
        // Load from localStorage for demo
        const stored = localStorage.getItem('hostelspot_bookings');
        setBookings(stored ? JSON.parse(stored) : []);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*, hostel:hostels(*), room:rooms(*)')
        .eq('student_id', user!.id)
        .order('booked_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [user, isDemoMode, isLocalUser]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Realtime subscription
  useEffect(() => {
    if (isLocalUser || !user) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `student_id=eq.${user.id}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isLocalUser, fetchBookings]);

  const createBooking = useCallback(async (booking: {
    hostel_id: string;
    room_id: string;
    semester_start: string;
  }) => {
    try {
      if (isLocalUser) {
        const newBooking: Booking = {
          id: crypto.randomUUID(),
          student_id: user?.id || 'demo-user',
          hostel_id: booking.hostel_id,
          room_id: booking.room_id,
          semester_start: booking.semester_start,
          status: 'PENDING',
          deposit_amount: 750,
          deposit_refunded: false,
          booked_at: new Date().toISOString(),
          confirmed_at: null,
        };
        const updated = [...bookings, newBooking];
        setBookings(updated);
        localStorage.setItem('hostelspot_bookings', JSON.stringify(updated));
        return { data: newBooking, error: null };
      }

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          student_id: user!.id,
          ...booking,
          deposit_amount: 750,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to create booking',
      };
    }
  }, [user, isLocalUser, bookings]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      if (isLocalUser) {
        const updated = bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
        );
        setBookings(updated);
        localStorage.setItem('hostelspot_bookings', JSON.stringify(updated));
        return { error: null };
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('id', bookingId)
        .eq('student_id', user!.id)
        .eq('status', 'PENDING');

      if (updateError) throw updateError;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to cancel booking',
      };
    }
  }, [user, isLocalUser, bookings]);

  return { bookings, loading, error, createBooking, cancelBooking, refetch: fetchBookings };
}
