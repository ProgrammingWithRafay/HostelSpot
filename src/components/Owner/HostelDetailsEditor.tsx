import { toast } from 'sonner';
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Hostel } from '../../types';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Use CDN URLs for the marker icons to avoid bundler issues
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

interface Props {
  hostel: Hostel;
}

export default function HostelDetailsEditor({ hostel }: Props) {
  const [formData, setFormData] = useState({
    name: hostel.name,
    city: hostel.city || 'Faisalabad',
    address: hostel.address,
    phone: hostel.phone,
    description: hostel.description || '',
    mess_available: hostel.mess_available,
    wifi: hostel.wifi,
    ac: hostel.ac,
    ups: hostel.ups,
    parking: hostel.parking,
    latitude: hostel.latitude || '',
    longitude: hostel.longitude || '',
    reception_hours: hostel.operating_hours?.reception || '24 Hours',
    check_in: hostel.operating_hours?.check_in || 'From 2:00 PM',
    check_out: hostel.operating_hours?.check_out || 'Until 12:00 PM',
    quiet_hours: hostel.operating_hours?.quiet_hours || '10:00 PM - 7:00 AM',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (isSupabaseConfigured()) {
      const updatePayload = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        description: formData.description,
        mess_available: formData.mess_available,
        wifi: formData.wifi,
        ac: formData.ac,
        ups: formData.ups,
        parking: formData.parking,
        latitude: formData.latitude ? parseFloat(formData.latitude as string) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude as string) : null,
        operating_hours: {
          reception: formData.reception_hours,
          check_in: formData.check_in,
          check_out: formData.check_out,
          quiet_hours: formData.quiet_hours
        }
      };

      const { error } = await supabase
        .from('hostels')
        .update(updatePayload)
        .eq('id', hostel.id);
        
      if (error) {
        console.error('Error updating hostel:', error);
        toast.error('Failed to save changes.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const update = (key: string, value: string | boolean) => 
    setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-8">Hostel Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Hostel Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.name}
              onChange={e => update('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.phone}
              onChange={e => update('phone', e.target.value)}
            />
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">City</label>
            <select 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.city}
              onChange={e => update('city', e.target.value)}
            >
              <option value="Faisalabad">Faisalabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Full Address</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.address}
              onChange={e => update('address', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Pinpoint Location on Map</label>
          <div className="text-sm text-muted-foreground mb-4">Click or drag on the map to set your hostel's exact location.</div>
          <div className="border border-border rounded-xl overflow-hidden relative z-0 h-[350px] w-full bg-muted">
            <MapContainer 
              center={formData.latitude && formData.longitude ? [Number(formData.latitude), Number(formData.longitude)] : [31.418, 73.079]} 
              zoom={formData.latitude && formData.longitude ? 15 : 12} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker 
                position={formData.latitude && formData.longitude ? [Number(formData.latitude), Number(formData.longitude)] : null} 
                setPosition={(pos) => {
                  update('latitude', pos[0].toString());
                  update('longitude', pos[1].toString());
                }} 
              />
            </MapContainer>
          </div>
          {(formData.latitude && formData.longitude) && (
            <div className="text-sm text-muted-foreground mt-2">
              Selected Coordinates: {Number(formData.latitude).toFixed(4)}, {Number(formData.longitude).toFixed(4)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Reception Hours</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.reception_hours}
              onChange={e => update('reception_hours', e.target.value)}
              placeholder="e.g. 24 Hours"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Quiet Hours</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.quiet_hours}
              onChange={e => update('quiet_hours', e.target.value)}
              placeholder="e.g. 10:00 PM - 7:00 AM"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Check-in</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.check_in}
              onChange={e => update('check_in', e.target.value)}
              placeholder="e.g. From 2:00 PM"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Check-out</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              value={formData.check_out}
              onChange={e => update('check_out', e.target.value)}
              placeholder="e.g. Until 12:00 PM"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</label>
          <textarea 
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors min-h-[120px] resize-none"
            value={formData.description}
            onChange={e => update('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Amenities</label>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'mess_available', label: 'Mess' },
              { key: 'wifi', label: 'WiFi' },
              { key: 'ac', label: 'AC' },
              { key: 'ups', label: 'UPS' },
              { key: 'parking', label: 'Parking' },
            ].map(amenity => (
              <label key={amenity.key} className={`flex items-center gap-2 px-6 py-3 border rounded-xl cursor-pointer transition-colors ${formData[amenity.key as keyof typeof formData] ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={formData[amenity.key as keyof typeof formData] as boolean}
                  onChange={e => update(amenity.key, e.target.checked)}
                />
                <span className="text-sm font-bold">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-8 flex items-center justify-end gap-4 border-t border-border">
          {saved && <span className="text-sm text-emerald-600 font-bold">Changes saved!</span>}
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
