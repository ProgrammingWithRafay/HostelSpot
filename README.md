# HostelSpot 🏠

**Find your hostel before you arrive.**

A premium, full-stack student hostel booking platform for Pakistani university students. Browse, compare, and book verified hostels with a professional UI, real-time updates, and a comprehensive management system.

---

## ✨ Features

| Feature | Status |
|---|---|
| **Student Dashboard** | ✅ Live booking status, referral tracking, and profile management |
| **Owner Dashboard** | ✅ Manage bookings, room availability, and hostel details |
| **Admin Panel** | ✅ Full control over users, hostels, and verification |
| **Smart Filtering** | ✅ URL-persistent filters (`useSearchParams`) for price, amenities, and room types |
| **Interactive Maps** | ✅ Google Maps integration with Places API for photos and reviews |
| **Auth System** | ✅ Secure Supabase Auth with Forgot/Reset Password flow |
| **Realtime** | ✅ Live booking status updates via Supabase Realtime |
| **Referral System** | ✅ Student referral program with reward tracking |
| **Premium UI** | ✅ Modern, responsive design with smooth animations and curated aesthetics |
| **Demo Mode** | ✅ Fully functional mock-data mode for offline/credential-free testing |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS v4 (Vite)
- **State Management:** React Hooks + Supabase Auth Context
- **Routing:** React Router DOM v6 (Protected & Role-based routes)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Maps:** Google Maps JavaScript API + Places API
- **Icons:** Lucide React

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

> 💡 **Demo Mode:** The app automatically detects if Supabase credentials are missing and switches to demo mode, loading Faisalabad hostel data from `src/data/mockHostels.ts`.

---

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_js_key
```

### Google Maps Setup
1. Enable **Maps JavaScript API** and **Places API** in [Google Cloud Console](https://console.cloud.google.com/).
2. Use the **Frontend key** for `VITE_GOOGLE_MAPS_API_KEY`.
3. Use a restricted **Backend key** for the Supabase Edge Function secret.

---

## 🗄️ Supabase Setup

### 1. SQL Schema
Run `supabase/migrations/001_init.sql` in the Supabase SQL Editor. This sets up:
- Tables: `hostels`, `rooms`, `profiles`, `bookings`, `reviews`, `referrals`, `place_cache`
- Row Level Security (RLS) policies
- Database triggers for auto-updating counts and ratings

### 2. Edge Functions
Deploy the photo proxy function to avoid exposing your Google Places API key:
```bash
supabase secrets set GOOGLE_MAPS_API_KEY=your_backend_key
supabase functions deploy get-place-details
```

### 3. Storage
Create a public bucket named `hostel-images` for hostel galleries.

---

## 📂 Project Structure

```
src/
├── components/           # Shared UI & Role-based routes (OwnerRoute, etc.)
├── pages/                # 12 Pages (Home, Hostels, Dashboard, OwnerDashboard, Admin, etc.)
├── hooks/                # Custom hooks (useAuth, useHostels, usePlaceDetails)
├── lib/                  # API Clients (Supabase, Google Maps)
├── types/                # TypeScript interfaces & Enums
├── utils/                # Helper functions & Constants
└── data/                 # Mock data for Demo Mode

supabase/
├── migrations/           # Database schema & RLS policies
├── seed.sql              # Initial hostel & room records
└── functions/            # Deno Edge Functions
```

---

## 🔑 User Roles & Permissions

HostelSpot supports three distinct user roles:

### 1. STUDENT
- Default role upon registration.
- Can book hostels, write reviews, and track referrals.

### 2. HOSTEL_OWNER
- Can access the **Owner Dashboard**.
- Manages specific hostel listings and confirms bookings.
- Requires admin verification (`is_verified = true`).

### 3. ADMIN
- Full access to the **Admin Panel**.
- Can verify owners, manage all hostels, and update roles.

#### Promoting a User (SQL)
Run this in the Supabase SQL Editor:
```sql
-- Make a user an Admin
update profiles set role = 'ADMIN' where id = 'user-uuid';

-- Make a user a Verified Hostel Owner
update profiles set role = 'HOSTEL_OWNER', is_verified = true where id = 'user-uuid';
```

---

## 📱 Deployment

- **Frontend:** Optimized for Vercel/Netlify.
- **Backend:** Managed by Supabase (PostgreSQL + Go/Rust Edge Runtime).

