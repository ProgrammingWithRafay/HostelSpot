import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { Users as UsersIcon, Building2, BookOpen, TrendingUp, CheckCircle2, XCircle, Search, UserCog, X, Trash2, Ban, RotateCcw } from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Button } from "../components/figma/ui/button";
import { Badge } from "../components/figma/ui/badge";
import { Input } from "../components/figma/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/figma/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/figma/ui/table";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Hostel, Booking, Profile } from "../types";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminDashboard() {
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [properties, setProperties] = useState<Hostel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningHostelId, setAssigningHostelId] = useState<Record<string, string>>({});
  const [modalConfig, setModalConfig] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void; confirmText?: string; variant?: 'danger' | 'primary' }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const confirmAction = (title: string, description: string, confirmText: string, onConfirm: () => void) => {
    setModalConfig({ open: true, title, description, confirmText, onConfirm });
  };

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const [usersRes, propsRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('hostels').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, room:rooms(*)')
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (propsRes.data) setProperties(propsRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);

      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleVerifyUser = async (id: string, currentStatus: boolean) => {
    const isVerifying = !currentStatus;
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: isVerifying })
      .eq('id', id);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_verified: isVerifying } : u));
    }
  };

  const toggleVerify = async (id: string, currentVerified: boolean) => {
    const { error } = await supabase
      .from('hostels')
      .update({ verified: !currentVerified })
      .eq('id', id);

    if (!error) {
      setProperties(prev => prev.map(h => h.id === id ? { ...h, verified: !currentVerified } : h));
    }
  };

  const assignProperty = async (ownerId: string) => {
    const hostelId = assigningHostelId[ownerId];
    if (!hostelId) return;

    const { error } = await supabase
      .from('profiles')
      .update({ hostel_id: hostelId })
      .eq('id', ownerId);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === ownerId ? { ...u, hostel_id: hostelId } : u));
    } else {
      toast.error("Failed to assign property");
    }
  };

  const unassignProperty = async (ownerId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ hostel_id: null })
      .eq('id', ownerId);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === ownerId ? { ...u, hostel_id: undefined } : u));
    } else {
      toast.error("Failed to unassign property");
    }
  };

  const deleteProperty = async (id: string) => {
    confirmAction(
      "Delete Property",
      "Are you sure you want to delete this property? This cannot be undone.",
      "Yes, Delete Property",
      async () => {
        if (isSupabaseConfigured()) {
          const { error } = await supabase.from('hostels').delete().eq('id', id);
          if (error) {
            toast.error("Failed to delete property: " + error.message);
            return;
          }
        }
        setProperties(prev => prev.filter(h => h.id !== id));
        setModalConfig(prev => ({ ...prev, open: false }));
      }
    );
  };

  const toggleSuspendUser = async (id: string, currentlySuspended: boolean) => {
    const action = currentlySuspended ? "restore" : "suspend";
    confirmAction(
      currentlySuspended ? "Restore User" : "Suspend User",
      `Are you sure you want to ${action} this user?`,
      currentlySuspended ? "Yes, Restore User" : "Yes, Suspend User",
      async () => {
        if (isSupabaseConfigured()) {
          const { error } = await supabase.from('profiles').update({ is_suspended: !currentlySuspended }).eq('id', id);
          if (error) {
            toast.error(`Failed to ${action} user: ${error.message}`);
            return;
          }
        }
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_suspended: !currentlySuspended } : u));
        setModalConfig(prev => ({ ...prev, open: false }));
      }
    );
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) => u.role === 'STUDENT' && ((u.full_name || "").toLowerCase().includes(userQuery.toLowerCase()) || 
           (u.id || "").toLowerCase().includes(userQuery.toLowerCase())) // Fallback to id since email isn't in profile struct
  );

  // Stats Calculations
  const totalRevenue = bookings.filter(b => b.status === "CONFIRMED" || b.status === "CHECKED_IN")
    .reduce((sum, b) => sum + (b.room?.price_per_month || 0), 0);
  
  // Platform Growth
  const monthlyData: Record<string, { month: string; users: number; bookings: number }> = {};
  users.forEach(u => {
    const m = new Date(u.created_at).toLocaleString('default', { month: 'short' });
    if (!monthlyData[m]) monthlyData[m] = { month: m, users: 0, bookings: 0 };
    monthlyData[m].users += 1;
  });
  bookings.forEach(b => {
    const m = new Date(b.booked_at).toLocaleString('default', { month: 'short' });
    if (!monthlyData[m]) monthlyData[m] = { month: m, users: 0, bookings: 0 };
    monthlyData[m].bookings += 1;
  });
  const platformGrowthData = Object.values(monthlyData);

  // Booking Pie Chart
  const statusCounts: Record<string, number> = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0, CHECKED_IN: 0 };
  bookings.forEach(b => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });
  const totalBookings = bookings.length || 1; // prevent div zero
  const pieColors = { PENDING: "#F59E0B", CONFIRMED: "#10B981", CANCELLED: "#EF4444", CHECKED_IN: "#3B82F6" };
  const bookingPieData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: Math.round((count / totalBookings) * 100),
      fill: pieColors[status as keyof typeof pieColors] || "#94A3B8",
      rawCount: count
    }));

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 bg-background">
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Platform overview and management</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="gap-2"><TrendingUp size={15} />Overview</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><UsersIcon size={15} />Users</TabsTrigger>
            <TabsTrigger value="owners" className="gap-2"><UserCog size={15} />Owners</TabsTrigger>
            <TabsTrigger value="properties" className="gap-2"><Building2 size={15} />Properties</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2"><BookOpen size={15} />Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users", value: users.length.toString(), delta: "", icon: UsersIcon, color: "text-blue-600" },
                { label: "Active Bookings", value: statusCounts.CONFIRMED.toString(), delta: "", icon: BookOpen, color: "text-emerald-600" },
                { label: "Properties Listed", value: properties.length.toString(), delta: "", icon: Building2, color: "text-purple-600" },
                { label: "Platform Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, delta: "", icon: TrendingUp, color: "text-rose-600" },
              ].map(({ label, value, delta, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <Icon size={17} className={color} />
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  {delta && <p className="text-xs text-emerald-600 mt-1">{delta}</p>}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-4">Platform Growth</h3>
                {platformGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={platformGrowthData}>
                      <defs>
                        <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="url(#userGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="bookings" stroke="#F43F5E" fill="url(#bookingGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No growth data yet</div>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-4">Booking Status Breakdown</h3>
                {bookingPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie data={bookingPieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false} style={{ fontSize: '12px', fontWeight: 'bold', fill: '#64748B' }}>
                        {bookingPieData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No bookings to breakdown</div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative max-w-xs">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9 h-9" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                    </TableRow>
                  )}
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className={u.is_suspended ? "opacity-50 bg-muted/20" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">{u.full_name || "Unknown User"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{u.email || "N/A"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.is_suspended ? "destructive" : "secondary"} className="capitalize">
                          {u.is_suspended ? "Suspended" : u.role.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={u.is_suspended ? "outline" : "destructive"}
                          className="h-8 px-2"
                          title={u.is_suspended ? "Restore User" : "Suspend User"}
                          onClick={() => toggleSuspendUser(u.id, !!u.is_suspended)}
                        >
                          {u.is_suspended ? <RotateCcw size={16} /> : <Ban size={16} />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Owners */}
          <TabsContent value="owners">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-lg">Hostel Owners Management</h2>
                <p className="text-sm text-muted-foreground">Verify owners and assign properties to their accounts.</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Assigned Property</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.role === 'HOSTEL_OWNER').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hostel owners found</TableCell>
                    </TableRow>
                  )}
                  {users.filter(u => u.role === 'HOSTEL_OWNER').map((u) => {
                    const assignedHostel = properties.find(p => p.id === u.hostel_id);
                    return (
                      <TableRow key={u.id} className={u.is_suspended ? "opacity-50 bg-muted/20" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm">{u.full_name || "Unknown Owner"}</p>
                            {u.is_suspended && <span className="text-xs font-bold text-destructive">SUSPENDED</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">{u.email || "N/A"}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Badge variant={u.is_verified ? "default" : "secondary"}>
                              {u.is_verified ? "Verified" : "Pending"}
                            </Badge>
                            <Button
                              size="sm"
                              className={`h-7 text-xs rounded-lg border shadow-none ${
                                u.is_verified
                                  ? "bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                  : "bg-emerald-600 text-white border-transparent hover:bg-emerald-700"
                              }`}
                              onClick={() => toggleVerifyUser(u.id, !!u.is_verified)}
                            >
                              {u.is_verified ? "Revoke" : "Verify"}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {assignedHostel ? (
                            <div className="flex items-center justify-between gap-2 bg-muted/50 py-1.5 px-3 rounded-lg border border-border">
                              <div className="flex items-center gap-2 truncate">
                                <Building2 size={14} className="text-primary shrink-0" />
                                <span className="text-sm font-medium truncate">{assignedHostel.name}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                onClick={() => unassignProperty(u.id)}
                                title="Remove assigned property"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">None Assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <div className="flex gap-2">
                              <select
                                className="flex-1 min-w-[150px] py-1.5 px-3 text-sm bg-transparent border border-input rounded-md outline-none"
                                value={assigningHostelId[u.id] || ""}
                                onChange={(e) => setAssigningHostelId(prev => ({ ...prev, [u.id]: e.target.value }))}
                              >
                                <option value="">Select Property...</option>
                                {properties.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              <Button
                                size="sm"
                                className="h-8"
                                onClick={() => assignProperty(u.id)}
                                disabled={!assigningHostelId[u.id]}
                              >
                                Assign
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant={u.is_suspended ? "outline" : "destructive"}
                              className="h-8 px-2"
                              title={u.is_suspended ? "Restore Owner" : "Suspend Owner"}
                              onClick={() => toggleSuspendUser(u.id, !!u.is_suspended)}
                            >
                              {u.is_suspended ? <RotateCcw size={16} /> : <Ban size={16} />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Properties */}
          <TabsContent value="properties">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No properties found</TableCell>
                    </TableRow>
                  )}
                  {properties.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>
                        <p className="font-semibold text-sm">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.address}</p>
                      </TableCell>
                      <TableCell className="text-sm">{h.city || "Faisalabad"}</TableCell>
                      <TableCell className="text-sm">⭐ {h.rating || 0}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${h.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {h.verified ? "Verified" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-lg gap-1"
                            onClick={() => toggleVerify(h.id, !!h.verified)}
                          >
                            {h.verified ? <XCircle size={11} /> : <CheckCircle2 size={11} />}
                            {h.verified ? "Unverify" : "Verify"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 rounded-lg"
                            title="Delete Property"
                            onClick={() => deleteProperty(h.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Bookings overview table */}
          <TabsContent value="bookings">
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">
              <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">All Bookings</p>
              <p className="text-sm mt-1">{bookings.length} total bookings across all properties</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-left">
                {bookingPieData.map(({ name, rawCount, fill }) => (
                  <div key={name} className="bg-muted/40 rounded-xl p-4 border border-border">
                    <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: fill }} />
                    <p className="font-bold text-xl">{rawCount}</p>
                    <p className="text-xs text-muted-foreground">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmModal
        open={modalConfig.open}
        onOpenChange={(open) => setModalConfig(prev => ({ ...prev, open }))}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText="Cancel"
      />
    </div>
  );
}
