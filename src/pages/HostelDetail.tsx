import { toast } from 'sonner';
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, BedDouble, Users, ChevronLeft, Check } from "lucide-react";
import { useHostelDetail } from "../hooks/useHostelDetail";
import { useAuth } from "../hooks/useAuth";
import ReviewSection from "../components/ReviewSection";
import MapView from "../components/MapView";
import { formatPrice } from "../utils/formatPrice";
import { AMENITY_LABELS } from "../utils/constants";
import { StarRating } from "../components/figma/StarRating";
import { AmenityBadge } from "../components/figma/AmenityBadge";
import { Badge } from "../components/figma/ui/badge";
import { Button } from "../components/figma/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/figma/ui/carousel";
import { Separator } from "../components/figma/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/figma/ui/dialog";
import { Textarea } from "../components/figma/ui/textarea";
import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";



export default function HostelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hostel, loading, error } = useHostelDetail(id);
  const { profile } = useAuth();
  const isOwner = profile?.role === 'HOSTEL_OWNER';

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!profile || !hostel || !isSupabaseConfigured()) {
      toast.error("Please log in to send a message.");
      navigate("/login");
      return;
    }
    if (!messageText.trim()) return;

    setIsSending(true);
    const { error } = await supabase.from('messages').insert({
      student_id: profile.id,
      hostel_id: hostel.id,
      sender_id: profile.id,
      content: messageText
    });

    setIsSending(false);
    if (error) {
      toast.error("Failed to send message: " + error.message);
    } else {
      setMessageSent(true);
      setMessageText("");
      setTimeout(() => {
        setIsModalOpen(false);
        setMessageSent(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading details...</p>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 min-h-screen">
        <p className="text-2xl font-bold">Hostel not found</p>
        <p className="text-muted-foreground">This property might have been removed or the link is broken.</p>
        <Button onClick={() => navigate("/hostels")}>Browse All Hostels</Button>
      </div>
    );
  }

  const verified = hostel.verified;
  
  const amenities = [
    hostel.mess_available && 'mess_available',
    hostel.wifi && 'wifi',
    hostel.ac && 'ac',
    hostel.ups && 'ups',
    hostel.parking && 'parking',
  ].filter(Boolean) as string[];

  const lowestPrice = hostel.rooms?.length
    ? Math.min(...hostel.rooms.map(r => r.price_per_month))
    : 0;

  const images = hostel.hostel_images && hostel.hostel_images.length > 0
    ? hostel.hostel_images.map(img => img.image_url)
    : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&h=800&fit=crop'];

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-background text-foreground">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
          <ChevronLeft size={16} /> Back to Results
        </button>
      </div>

      {/* Image Gallery */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-muted">
                  <img src={img} alt={`${hostel.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">

                {verified && (
                  <Badge variant="secondary" className="gap-1 text-emerald-700 bg-emerald-50">
                    <Check size={11} /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={14} />{hostel.address}</span>
                {(hostel.review_count > 0 && hostel.rating) ? (
                  <StarRating rating={hostel.rating} reviews={hostel.review_count} />
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">New Property</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {hostel.description && (
              <div>
                <h2 className="text-xl font-bold mb-3">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{hostel.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <AmenityBadge key={a} type={AMENITY_LABELS[a] || a} size="md" />
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Room Types */}
            <div>
              <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
              <div className="space-y-3">
                {hostel.rooms?.map((room, i) => {
                  const isAvailable = room.available_count > 0;
                  return (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isAvailable ? 'border-border bg-card hover:border-primary/30' : 'bg-muted opacity-60 border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          <BedDouble size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm uppercase">{room.type}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users size={11} /> {isAvailable ? `${room.available_count} beds available` : 'Sold Out'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatPrice(room.price_per_month)}</p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </div>
                        {isOwner ? (
                          <Button size="sm" className="rounded-xl" disabled>Owner</Button>
                        ) : isAvailable ? (
                          <Button
                            size="sm"
                            className="rounded-xl"
                            onClick={() => navigate(`/book/${hostel.id}?roomType=${encodeURIComponent(room.type)}`)}
                          >
                            Book
                          </Button>
                        ) : (
                          <Button size="sm" className="rounded-xl" disabled>Sold Out</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Map */}
            {hostel.latitude && hostel.longitude && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <div className="h-64 rounded-2xl overflow-hidden border border-border">
                    <MapView latitude={hostel.latitude} longitude={hostel.longitude} title={hostel.name} />
                  </div>
                </div>
              </>
            )}

            {/* Reviews */}
            <Separator />
            <div>
              <h2 className="text-xl font-bold mb-5">Student Reviews</h2>
              <ReviewSection hostelId={hostel.id} />
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold text-primary mt-0.5">
                  {formatPrice(lowestPrice)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
              <Button
                className="w-full rounded-xl py-5 text-base"
                onClick={() => navigate(`/book/${hostel.id}`)}
              >
                Book Now
              </Button>
              <Separator />
              <div className="space-y-2 text-sm">
                {hostel.phone && (
                  <a href={`tel:${hostel.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone size={15} className="text-primary" />{hostel.phone}
                  </a>
                )}
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <Mail size={15} className="text-primary" />Contact Owner
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-left">
                      <DialogTitle>Message {hostel.name}</DialogTitle>
                      <DialogDescription>
                        Send a message directly to the hostel owner. They will reply to your dashboard.
                      </DialogDescription>
                    </DialogHeader>
                    {messageSent ? (
                      <div className="flex flex-col items-center justify-center py-6 text-emerald-600 gap-2">
                        <Check size={32} />
                        <p className="font-bold">Message sent successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <Textarea 
                          placeholder="I am interested in a single room. Is it available next month?" 
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!messageText.trim() || isSending} 
                          className="w-full font-bold"
                        >
                          {isSending ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs text-muted-foreground text-center">No payment required now. Confirm directly with the hostel.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center justify-between gap-4 shadow-lg z-50">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="font-bold text-primary">{formatPrice(lowestPrice)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
        </div>
        <Button className="rounded-xl px-8" onClick={() => navigate(`/book/${hostel.id}`)}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
