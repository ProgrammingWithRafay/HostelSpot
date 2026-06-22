import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  height?: string;
}

export default function MapView({
  latitude,
  longitude,
  title,
  height = '350px',
}: MapViewProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-200 relative z-0"
      style={{ height, width: '100%' }}
    >
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={15} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            <div className="text-center font-semibold">
              {title}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
