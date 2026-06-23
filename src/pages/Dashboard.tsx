import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import { WHATSAPP_SUPPORT_LINK } from '../utils/constants';
import { Button } from '../components/figma/ui/button';
import { Badge } from '../components/figma/ui/badge';
import { CheckCircle2, Clock, Copy, Home, MessageCircle, ArrowUpRight, Building2, XCircle } from 'lucide-react';
import MessagesPanel from '../components/MessagesPanel';
import ConfirmModal from '../components/ConfirmModal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ContactRequest } from '../types';

const STATUS_CONFIG: Record<string, { label: string; className: string; Icon: React.ElementType }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700", Icon: Clock },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700", Icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700", Icon: XCircle },
  CHECKED_IN: { label: "Checked In", className: "bg-blue-100 text-blue-700", Icon: Home },
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { bookings, loading, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    if (profile?.id && isSupabaseConfigured()) {
      supabase.from('contact_requests')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setContactRequests(data);
        });
    }
  }, [profile?.id]);

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancellingId(bookingToCancel);
    await cancelBooking(bookingToCancel);
    setCancellingId(null);
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const statItems = useMemo(() => [
    { label: 'Total Stays', value: bookings.length, icon: Home, color: "text-primary" },
    { label: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length, icon: Clock, color: "text-amber-500" },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, icon: CheckCircle2, color: "text-emerald-500" },
    { label: 'Checked In', value: bookings.filter(b => b.status === 'CHECKED_IN').length, icon: Building2, color: "text-blue-500" },
  ], [bookings]);

  return (
    <main className="flex-1 bg-slate-50 min-h-screen py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Student Portal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-slate-500">Here's what's happening with your stay.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <Icon size={18} className={s.color} />
                </div>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Bookings Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">Your Bookings</h2>

            {loading ? (
              <div className="space-y-4">
                {[1,2].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <Building2 size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm">You haven't made any hostel reservations yet. Explore verified hostels to find your perfect stay.</p>
                <Link to="/hostels">
                  <Button size="lg" className="rounded-xl px-8 font-semibold">
                    Browse Hostels
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {bookings.map(b => {
                  const statusConf = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.Icon;

                  return (
                    <div key={b.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                      <div className="p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-xl font-bold text-slate-900">
                               {b.hostel?.name || 'Hostel'}
                             </h3>
                             <Badge variant="secondary" className={`px-2.5 py-0.5 flex items-center gap-1.5 ${statusConf.className} border-0`}>
                               <StatusIcon size={12} />
                               {statusConf.label}
                             </Badge>
                           </div>
                           <p className="text-sm font-mono text-slate-500 flex items-center gap-1.5">
                             <Copy size={12} className="cursor-pointer hover:text-primary" onClick={() => navigator.clipboard.writeText(b.id)} />
                             Ref: {b.id.substring(0, 8).toUpperCase()}
                           </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                           <span className="text-2xl font-bold text-primary">{formatPrice(b.deposit_amount)}</span>
                           <span className="text-xs text-slate-500">Deposit Paid</span>
                        </div>
                      </div>

                      <div className="p-6 py-5 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Room Type</span>
                          <span className="block text-sm font-medium text-slate-900 capitalize">{b.room?.type?.toLowerCase() || 'Room'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Semester Start</span>
                          <span className="block text-sm font-medium text-slate-900">{b.semester_start || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Booked On</span>
                          <span className="block text-sm font-medium text-slate-900">{formatDate(b.booked_at)}</span>
                        </div>
                      </div>

                      <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white">
                        <Link to={`/hostels/${b.hostel_id}`} className="flex-1">
                          <Button variant="outline" className="w-full font-semibold rounded-xl gap-2">
                            View Hostel <ArrowUpRight size={16} />
                          </Button>
                        </Link>
                        {b.status === 'PENDING' && (
                          <Button
                            variant="destructive"
                            className="flex-1 font-semibold rounded-xl"
                            onClick={() => handleCancelClick(b.id)}
                            disabled={cancellingId === b.id}
                          >
                            {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Messages</h2>
              <MessagesPanel type="student" profileId={profile?.id || ''} />
            </div>

            {contactRequests.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Support Tickets</h2>
                <div className="flex flex-col gap-4">
                  {contactRequests.map(req => (
                    <div key={req.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900">{req.subject}</h3>
                            <Badge variant={req.status === 'PENDING' ? 'secondary' : 'default'} className={req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
                              {req.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">{new Date(req.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 mb-4 border border-slate-100">
                        <span className="font-semibold block mb-1">Your Message:</span>
                        {req.message}
                      </div>
                      {req.status === 'REPLIED' && req.admin_reply && (
                        <div className="bg-primary/5 p-4 rounded-xl text-sm border border-primary/10">
                          <span className="font-bold text-primary block mb-1">Support Reply:</span>
                          <p className="text-slate-800">{req.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">



            {/* Support */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Need help?</h3>
              <p className="text-sm text-slate-500 mb-6">Our support team is available 24/7 to assist you with your stay.</p>
              <a
                href={WHATSAPP_SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full rounded-xl font-semibold gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
                  <MessageCircle size={16} /> Contact via WhatsApp
                </Button>
              </a>
            </div>


          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone and your deposit may be forfeited according to the hostel's policy."
        onConfirm={confirmCancel}
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep It"
      />
    </main>
  );
}
