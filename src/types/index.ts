export interface Hostel {
  id: string;
  name: string;
  address: string;
  phone: string;
  google_place_id: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  review_count: number;
  mess_available: boolean;
  wifi: boolean;
  ac: boolean;
  ups: boolean;
  parking: boolean;
  description: string | null;
  verified: boolean;
  badge: string | null;
  badge_color: string | null;
  city?: string;
  distanceFromUni?: number;
  created_at: string;
  rooms?: Room[];
  hostel_images?: HostelImage[];
  operating_hours?: {
    reception: string;
    check_in: string;
    check_out: string;
    quiet_hours: string;
  };
}

export interface Room {
  id: string;
  hostel_id: string;
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  price_per_month: number;
  total_count: number;
  available_count: number;
  created_at: string;
}

export interface HostelImage {
  id: string;
  hostel_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email?: string | null;
  phone: string | null;
  city_of_origin: string | null;
  role: 'STUDENT' | 'ADMIN' | 'HOSTEL_OWNER';
  is_verified?: boolean;
  is_suspended?: boolean;
  suspension_appeal?: string | null;
  hostel_id?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  hostel_id: string;
  room_id: string;
  semester_start: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';
  deposit_amount: number;
  deposit_refunded: boolean;
  booked_at: string;
  confirmed_at: string | null;
  // Joined relations
  hostel?: Hostel;
  room?: Room;
  profile?: Profile;
}

export interface Review {
  id: string;
  student_id: string;
  hostel_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined
  profile?: Profile;
  hostel?: Hostel;
}

export interface PlaceDetails {
  photos: PlacePhoto[];
  reviews: PlaceReview[];
  opening_hours?: string[];
  formatted_phone_number?: string;
}

export interface PlacePhoto {
  photo_reference: string;
  url?: string;
  width: number;
  height: number;
}

export interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

export interface HostelFilters {
  location?: string;
  university?: string;
  search: string;
  mess: boolean | null;
  wifi: boolean | null;
  ac: boolean | null;
  ups: boolean | null;
  parking: boolean | null;
  roomType: 'ALL' | 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  maxPrice: number;
  minPrice: number;
  sort: 'rating' | 'price_low' | 'price_high' | 'reviews' | 'distance';
  page?: number;
}

export interface Message {
  id: string;
  student_id: string;
  hostel_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  // Joined
  student?: Profile;
  hostel?: Hostel;
  sender?: Profile;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id: string | null;
  admin_reply: string | null;
  status: 'PENDING' | 'REPLIED' | 'CLOSED';
  created_at: string;
  replied_at: string | null;
}
