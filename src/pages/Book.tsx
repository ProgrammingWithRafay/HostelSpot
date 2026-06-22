import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useHostelDetail } from '../hooks/useHostelDetail';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../hooks/useAuth';
import BookingForm from '../components/BookingForm';
import { useEffect } from 'react';

export default function Book() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hostel, loading, error } = useHostelDetail(id);
  const { createBooking } = useBooking();
  const { user, profile, isDemoMode } = useAuth();

  const preselectedRoom = searchParams.get('room') || undefined;

  // Redirect to login if not authenticated (backup for ProtectedRoute)
  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      navigate('/login', { replace: true });
    } else if (profile?.role === 'HOSTEL_OWNER') {
      navigate('/owner/dashboard', { replace: true });
    }
  }, [user, profile, loading, isDemoMode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-40 bg-slate-100 rounded-xl" />
            <div className="h-40 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-[448px] px-6 bg-card border border-border rounded-3xl shadow-sm p-10">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Hostel not found</h2>
          <p className="text-muted-foreground mb-8">{error}</p>
          <button onClick={() => navigate('/hostels')} className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity">
            Browse Hostels
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: {
    room_id: string;
    semester_start: string;
    full_name: string;
    phone: string;
    city: string;
    university: string;
  }) => {
    const { data: booking, error: bookingError } = await createBooking({
      hostel_id: hostel.id,
      room_id: data.room_id,
      semester_start: data.semester_start,
    });

    if (bookingError) {
      throw new Error(bookingError);
    }

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return { bookingId: booking?.id || 'demo-booking-id' };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Book Your Room
          </h1>
          <p className="text-lg text-muted-foreground">
            at <strong className="text-foreground font-bold">{hostel.name}</strong>
          </p>
        </div>

        {/* Booking Form Card */}
        <div className="bg-card border border-border rounded-3xl shadow-sm p-6 md:p-12">
          <BookingForm
            hostel={hostel}
            onSubmit={handleSubmit}
            preselectedRoom={preselectedRoom}
          />
        </div>
      </div>
    </div>
  );
}
