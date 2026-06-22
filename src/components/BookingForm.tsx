import { useState } from 'react';
import type { Hostel, Room } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { UNIVERSITIES_BY_CITY, SEMESTERS, DEPOSIT_AMOUNT } from '../utils/constants';
import { Lightbulb, MapPin, PartyPopper } from 'lucide-react';

interface BookingFormProps {
  hostel: Hostel;
  preselectedRoom?: string;
  onSubmit: (data: {
    room_id: string;
    semester_start: string;
    full_name: string;
    phone: string;
    city: string;
    university: string;
  }) => Promise<{ bookingId: string } | null>;
}

export default function BookingForm({
  hostel,
  preselectedRoom,
  onSubmit,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    preselectedRoom
      ? hostel.rooms?.find((r) => r.type === preselectedRoom) || null
      : null
  );
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    university: '',
    semester_start: SEMESTERS[0],
  });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedRoom) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit({
        room_id: selectedRoom.id,
        semester_start: formData.semester_start,
        full_name: formData.full_name,
        phone: '+92' + formData.phone,
        city: formData.city,
        university: formData.university,
      });

      if (result) {
        setBookingId(result.bookingId);
        setStep(4);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Room' },
    { num: 2, label: 'Your Details' },
    { num: 3, label: 'Review' },
    { num: 4, label: 'Success' },
  ];

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-all rounded-full border-2 ${
                  step >= s.num
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-muted-foreground'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-xs uppercase tracking-wider font-bold hidden md:block ${
                  step >= s.num ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 border-t-2 transition-colors mx-4 ${
                  step > s.num ? 'border-primary' : 'border-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Select Room */}
      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold mb-2">
            Select Your Room
          </h3>
          <p className="text-muted-foreground mb-6">
            Choose your preferred room type at {hostel.name}
          </p>

          <div className="flex flex-col gap-4">
            {hostel.rooms?.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                disabled={room.available_count === 0}
                className={`p-6 text-left transition-all cursor-pointer w-full rounded-2xl border ${
                  selectedRoom?.id === room.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : room.available_count === 0
                    ? 'bg-muted opacity-60 border-transparent cursor-not-allowed'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{room.type} Room</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {room.available_count} of {room.total_count} rooms available
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(room.price_per_month)}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
                {room.available_count === 0 && (
                  <div className="mt-4 inline-block bg-destructive/10 text-destructive px-2.5 py-1 text-xs uppercase font-bold tracking-wider rounded-md">
                    Fully Booked
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Deposit info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p>
              A refundable deposit of <strong className="font-bold">{formatPrice(DEPOSIT_AMOUNT)}</strong> is
              collected at check-in (not online).
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedRoom}
            className="w-full bg-primary text-primary-foreground text-sm uppercase tracking-wider font-bold rounded-xl py-4 mt-8 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Student Details */}
      {step === 2 && (
        <div>
          <h3 className="text-2xl font-bold mb-2">
            Your Details
          </h3>
          <p className="text-muted-foreground mb-6">
            Fill in your information to proceed with the booking
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-bold block mb-2">Full Name *</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
                placeholder="Muhammad Ahmed Khan"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">WhatsApp Number *</label>
              <div className="flex border border-border rounded-xl focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-colors overflow-hidden bg-background">
                <span className="flex items-center px-4 bg-muted/30 border-r border-border text-sm text-muted-foreground select-none">
                  +92
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent"
                  placeholder="300 1234567"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phone: val });
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">City of Origin *</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
                placeholder="e.g. Multan, Karachi, etc."
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">University *</label>
              <select
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors appearance-none"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
              >
                <option value="">Select your university</option>
                {(UNIVERSITIES_BY_CITY[hostel.city || ''] || ['Other']).map((u: string) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Semester Start *</label>
              <select
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors appearance-none"
                value={formData.semester_start}
                onChange={(e) =>
                  setFormData({ ...formData, semester_start: e.target.value })
                }
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className="w-full bg-background text-foreground border border-border font-bold rounded-xl py-4 hover:bg-muted transition-colors flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={
                !formData.full_name ||
                !formData.phone ||
                !formData.city ||
                !formData.university
              }
              className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-4 hover:opacity-90 transition-opacity flex-1 disabled:opacity-50 disabled:pointer-events-none"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && selectedRoom && (
        <div>
          <h3 className="text-2xl font-bold mb-2">
            Review Your Booking
          </h3>
          <p className="text-muted-foreground mb-6">
            Please confirm all details are correct
          </p>

          <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-muted border-b border-border">
              <h4 className="text-lg font-bold">{hostel.name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" /> {hostel.address}
              </p>
            </div>

            <div className="p-6 flex flex-col gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-bold">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-bold text-primary">
                  {formatPrice(selectedRoom.price_per_month)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit</span>
                <span className="font-bold text-primary">
                  {formatPrice(DEPOSIT_AMOUNT)} <span className="text-muted-foreground font-normal">(refundable)</span>
                </span>
              </div>
              <hr className="border-border my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-bold">{formData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-bold">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Semester</span>
                <span className="font-bold">{formData.semester_start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">University</span>
                <span className="font-bold">{formData.university}</span>
              </div>
            </div>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 accent-primary rounded-sm border-border"
            />
            <span className="text-sm text-muted-foreground">
              I confirm that the details above are correct and I agree to the
              booking terms. I understand the deposit of{' '}
              <span className="font-bold text-foreground">{formatPrice(DEPOSIT_AMOUNT)}</span> is collected at check-in.
            </span>
          </label>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(2)}
              className="w-full bg-background text-foreground border border-border font-bold rounded-xl py-4 hover:bg-muted transition-colors flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!confirmed || submitting}
              className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-4 hover:opacity-90 transition-opacity flex-1 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10" aria-hidden="true" />
          </div>
          <h3 className="text-3xl font-bold mb-4">
            Booking Confirmed!
          </h3>
          <p className="text-muted-foreground mb-6">
            Your hostel room has been reserved successfully.
          </p>

          {bookingId && (
            <div className="inline-block bg-muted rounded-xl p-4 mb-6">
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Booking Reference</p>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">
                {bookingId.substring(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="bg-card border border-border shadow-sm rounded-2xl p-6 text-left mb-6 text-sm">
            <p className="font-bold mb-3 text-base">What's next?</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>Your booking status is <strong className="font-bold text-amber-600">PENDING</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>The hostel will confirm within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Deposit of <strong className="font-bold">{formatPrice(DEPOSIT_AMOUNT)}</strong> collected at check-in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Check your dashboard for live status updates</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>
      )}
    </div>
  );
}
