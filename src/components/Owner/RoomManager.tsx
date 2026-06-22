import { toast } from 'sonner';
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Hostel, Room } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { User, Users, BedDouble, Edit3 } from 'lucide-react';
import { Badge } from '../figma/ui/badge';
import { Button } from '../figma/ui/button';
import { Input } from '../figma/ui/input';
import { Label } from '../figma/ui/label';

interface Props {
  hostel: Hostel;
}

export default function RoomManager({ hostel }: Props) {
  const [rooms, setRooms] = useState<Room[]>(hostel.rooms || []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const saveRoom = async (id: string, updates: Partial<Room>) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('rooms').update(updates).eq('id', id);
      if (error) {
        console.error('Failed to update room:', error);
        toast.error('Failed to save room updates.');
        return;
      }
    }
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    setEditingId(null);
  };

  const addRoom = async () => {
    const roomType = prompt('Enter room type (SINGLE, DOUBLE, or TRIPLE):')?.toUpperCase();
    if (!roomType || !['SINGLE', 'DOUBLE', 'TRIPLE'].includes(roomType)) {
      if (roomType) toast.error('Invalid room type. Must be SINGLE, DOUBLE, or TRIPLE.');
      return;
    }

    const price = prompt('Enter price per month (PKR):');
    if (!price || isNaN(Number(price))) return;

    const total = prompt('Enter total number of beds:');
    if (!total || isNaN(Number(total))) return;

    const newRoom = {
      hostel_id: hostel.id,
      type: roomType as 'SINGLE' | 'DOUBLE' | 'TRIPLE',
      price_per_month: Number(price),
      total_count: Number(total),
      available_count: Number(total)
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('rooms').insert(newRoom).select().single();
      if (error) {
        console.error('Failed to add room:', error);
        toast.error('Failed to add room: ' + error.message);
        return;
      }
      if (data) setRooms(prev => [...prev, data as Room]);
    } else {
      setRooms(prev => [...prev, { ...newRoom, id: Math.random().toString(), created_at: new Date().toISOString() } as Room]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Rooms</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure pricing and track bed availability.</p>
        </div>
        <Button onClick={addRoom} className="gap-2 rounded-xl">
          <BedDouble size={18} /> Add Room Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => {
          const occupied = room.total_count - room.available_count;
          const occupancyRate = room.total_count > 0 ? occupied / room.total_count : 0;
          let barColor = "bg-primary";
          if (occupancyRate > 0.85) barColor = "bg-red-500";
          else if (occupancyRate > 0.6) barColor = "bg-amber-500";

          return (
            <div key={room.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {room.type === 'SINGLE' ? <User size={24} /> : room.type === 'DOUBLE' ? <Users size={24} /> : <Users size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground capitalize">{room.type.toLowerCase()} Room</h3>
                    <p className="text-sm text-muted-foreground">{room.total_count} Beds Total</p>
                  </div>
                </div>
                {!editingId && (
                  <Badge variant={room.available_count > 0 ? "secondary" : "outline"} className={room.available_count > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                    {room.available_count} Available
                  </Badge>
                )}
              </div>

              {editingId === room.id ? (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-1.5">
                    <Label>Price per month (PKR)</Label>
                    <Input 
                      type="number" 
                      defaultValue={room.price_per_month}
                      onBlur={(e) => saveRoom(room.id, { price_per_month: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Total Beds</Label>
                      <Input 
                        type="number" 
                        defaultValue={room.total_count}
                        onBlur={(e) => saveRoom(room.id, { total_count: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Available Beds</Label>
                      <Input 
                        type="number" 
                        defaultValue={room.available_count}
                        onBlur={(e) => saveRoom(room.id, { available_count: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-2 rounded-xl"
                    onClick={() => setEditingId(null)}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-3xl font-black text-foreground">
                      {formatPrice(room.price_per_month)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span>{occupied} / {room.total_count} Occupied</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                        style={{ width: `${occupancyRate * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-6 gap-2 rounded-xl"
                    onClick={() => setEditingId(room.id)}
                  >
                    <Edit3 size={16} /> Edit Capacity & Price
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {rooms.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-muted/50 text-lg text-muted-foreground">
            No rooms added yet.
          </div>
        )}
      </div>
    </div>
  );
}
