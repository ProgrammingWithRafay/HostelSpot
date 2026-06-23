import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { TrendingUp, Users, BedDouble, DollarSign, CheckCircle2, XCircle, Clock, Building2, PlusCircle, MessageCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../components/figma/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/figma/ui/tabs";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";
import { Textarea } from "../components/figma/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/figma/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/figma/ui/select";
import { useAuth } from "../hooks/useAuth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Hostel, Booking } from "../types";

import HostelDetailsEditor from "../components/Owner/HostelDetailsEditor";
import ImageGalleryEditor from "../components/Owner/ImageGalleryEditor";
import RoomManager from "../components/Owner/RoomManager";
import MessagesPanel from "../components/MessagesPanel";

const STATUS_CONFIG: Record<string, { className: string; Icon: React.ElementType }> = {
  PENDING: { className: "bg-amber-100 text-amber-700", Icon: Clock },
  CONFIRMED: { className: "bg-emerald-100 text-emerald-700", Icon: CheckCircle2 },
  CANCELLED: { className: "bg-red-100 text-red-700", Icon: XCircle },
  CHECKED_IN: { className: "bg-blue-100 text-blue-700", Icon: Users },
};

export default function OwnerDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // New Property Form State
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("Faisalabad");
  const [formAddress, setFormAddress] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [submittingProp, setSubmittingProp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.hostel_id || !isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      
      // Fetch hostel with rooms and images
      const { data: hData } = await supabase
        .from('hostels')
        .select('*, rooms(*), hostel_images(*)')
        .eq('id', profile.hostel_id)
        .single();
        
      if (hData) setHostel(hData);

      // Fetch bookings for this hostel
      const { data: bData } = await supabase
        .from('bookings')
        .select('*, room:rooms(*), profile:profiles(*)')
        .eq('hostel_id', profile.hostel_id)
        .order('booked_at', { ascending: false });

      if (bData) setBookings(bData);
      
      setLoading(false);
    };
    
    fetchData();
  }, [profile]);

  const handleAction = async (id: string, action: "CONFIRMED" | "CANCELLED" | "CHECKED_IN") => {
    if (!isSupabaseConfigured()) return;
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: action })
      .eq('id', id);

    if (!error) {
      setBookings((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !isSupabaseConfigured()) return;
    
    setSubmittingProp(true);
    try {
      // 1. Insert property
      const { data: newHostel, error: hostelError } = await supabase
        .from('hostels')
        .insert({
          name: formName,
          city: formCity,
          address: formAddress,
          phone: formPhone,
          description: formDesc,
          verified: false
        })
        .select()
        .single();
        
      if (hostelError) throw hostelError;
      
      // 2. Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ hostel_id: newHostel.id })
        .eq('id', profile.id);
        
      if (profileError) throw profileError;
      
      // Force reload to pick up new hostel data
      window.location.reload();
      
    } catch (err: unknown) {
      toast.error("Failed to create property: " + (err instanceof Error ? err.message : "Unknown error"));
      console.error(err);
    } finally {
      setSubmittingProp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile?.hostel_id || !hostel) {
    return (
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <Building2 className="mx-auto w-16 h-16 text-primary mb-6" />
          <h2 className="text-3xl font-black mb-4 text-foreground">Welcome to HostelSpot!</h2>
          <p className="text-muted-foreground text-lg">
            You are not assigned to a property yet. You can either wait for an admin to assign one to you, or register your property manually below.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PlusCircle className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Register My Property</h3>
              <p className="text-sm text-muted-foreground">Add your hostel details to get started.</p>
            </div>
          </div>

          <form onSubmit={handleCreateProperty} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="propName" className="font-bold">Hostel Name</Label>
                <Input id="propName" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Sunshine Boys Hostel" className="h-12 bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propPhone" className="font-bold">Contact Phone</Label>
                <Input id="propPhone" required value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className="h-12 bg-background" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="propCity" className="font-bold">City</Label>
                <Select value={formCity} onValueChange={setFormCity}>
                  <SelectTrigger className="h-12 bg-background w-full">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                    <SelectItem value="Lahore">Lahore</SelectItem>
                    <SelectItem value="Islamabad">Islamabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propAddress" className="font-bold">Complete Address</Label>
                <Input id="propAddress" required value={formAddress} onChange={e => setFormAddress(e.target.value)} placeholder="House #, Street, Block, Phase" className="h-12 bg-background" />
              </div>
            </div>



            <div className="space-y-2">
              <Label htmlFor="propDesc" className="font-bold">Description (Optional)</Label>
              <Textarea id="propDesc" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Tell students what makes your hostel great..." className="min-h-[100px] bg-background resize-none" />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={submittingProp} className="w-full h-12 text-base font-bold rounded-xl">
                {submittingProp ? "Registering Property..." : "Register Property & Continue"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const pendingCount = bookings.filter((r) => r.status === "PENDING").length;
  
  // Calculate dynamic stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED" || b.status === "CHECKED_IN");
  
  // Revenue calculations
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.room?.price_per_month || 0), 0);
  
  // Monthly Revenue Chart Data
  const monthlyDataMap: Record<string, number> = {};
  confirmedBookings.forEach(b => {
    const d = new Date(b.booked_at);
    const m = d.toLocaleString('default', { month: 'short' });
    monthlyDataMap[m] = (monthlyDataMap[m] || 0) + (b.room?.price_per_month || 0);
  });
  const monthlyRevenueData = Object.entries(monthlyDataMap).map(([month, revenue]) => ({ month, revenue }));

  // Room Occupancy Data
  const roomOccupancyData = (hostel.rooms || []).map(r => ({
    room: r.type,
    occupancy: r.total_count > 0 ? Math.round(((r.total_count - r.available_count) / r.total_count) * 100) : 0
  }));

  const overallOccupancy = roomOccupancyData.length > 0 
    ? Math.round(roomOccupancyData.reduce((sum, r) => sum + r.occupancy, 0) / roomOccupancyData.length)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 bg-background">
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {profile?.full_name ?? "Owner"}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="gap-2"><TrendingUp size={15} />Overview</TabsTrigger>
            <TabsTrigger value="requests" className="gap-2 relative">
              <Clock size={15} />Booking Requests
              {pendingCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{pendingCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2"><MessageCircle size={15} />Messages</TabsTrigger>
            <TabsTrigger value="properties" className="gap-2"><Building2 size={15} />My Property</TabsTrigger>
            <TabsTrigger value="rooms" className="gap-2"><BedDouble size={15} />Room Management</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: totalBookings.toString(), icon: Users, delta: "" },
                { label: "Pending Requests", value: String(pendingCount), icon: Clock, delta: pendingCount > 0 ? "Needs action" : "" },
                { label: "Total Revenue", value: `PKR ${(totalRevenue/1000).toFixed(0)}k`, icon: DollarSign, delta: "" },
                { label: "Occupancy Rate", value: `${overallOccupancy}%`, icon: BedDouble, delta: "" },
              ].map(({ label, value, icon: Icon, delta }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={17} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  {delta && <p className="text-xs text-emerald-600 mt-1">{delta}</p>}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-4">Monthly Revenue (PKR)</h3>
                {monthlyRevenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip formatter={(v: number) => [`PKR ${v.toLocaleString()}`, "Revenue"]} />
                      <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} dot={true} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No revenue data yet</div>
                )}
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-4">Room Occupancy (%)</h3>
                {roomOccupancyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={roomOccupancyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="room" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip formatter={(v: number) => [`${v}%`, "Occupancy"]} />
                      <Bar dataKey="occupancy" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No rooms configured</div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Booking Requests */}
          <TabsContent value="requests">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No bookings found</TableCell>
                    </TableRow>
                  )}
                  {bookings.map((req) => {
                    const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{req.profile?.full_name || 'Anonymous Student'}</p>
                            <p className="text-xs text-muted-foreground">Student</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{req.room?.type || "Unknown"}</TableCell>
                        <TableCell className="text-sm">{new Date(req.booked_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm font-semibold">PKR {(req.room?.price_per_month || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.className}`}>
                            <cfg.Icon size={11} />{req.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {req.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button size="sm" className="h-7 text-xs rounded-lg gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(req.id, "CONFIRMED")}>
                                <CheckCircle2 size={12} /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(req.id, "CANCELLED")}>
                                <XCircle size={12} /> Reject
                              </Button>
                            </div>
                          )}
                          {req.status === "CONFIRMED" && (
                            <Button size="sm" className="h-7 text-xs rounded-lg gap-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction(req.id, "CHECKED_IN")}>
                              <CheckCircle2 size={12} /> Check In
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <div className="pb-12">
              <MessagesPanel type="owner" profileId={profile?.id || ''} hostelId={hostel.id} />
            </div>
          </TabsContent>

          {/* My Properties */}
          <TabsContent value="properties">
            <div className="space-y-8 pb-12">
              <HostelDetailsEditor hostel={hostel} />
              <ImageGalleryEditor hostelId={hostel.id} images={hostel.hostel_images || []} />
            </div>
          </TabsContent>

          {/* Room Management */}
          <TabsContent value="rooms">
            <div className="pb-12">
              <RoomManager hostel={hostel} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
