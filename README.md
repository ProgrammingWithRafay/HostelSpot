# HostelSpot

Find your hostel before you arrive.

A full-stack student hostel booking platform for university students. Browse, compare, and book verified hostels with a professional UI, real-time updates, and a comprehensive management system.

## Features

* **Student Dashboard**: Live booking status, referral tracking, and profile management
* **Owner Dashboard**: Manage bookings, room availability, and hostel details
* **Admin Panel**: Full control over users, hostels, and verification
* **Smart Filtering**: URL-persistent filters (useSearchParams) for price, amenities, and room types
* **Interactive Maps**: OpenStreetMap integration via Leaflet for exploring hostel locations
* **Auth System**: Secure Supabase Auth with Forgot/Reset Password flow
* **Realtime**: Live booking status updates via Supabase Realtime
* **Referral System**: Student referral program with reward tracking
* **Premium UI**: Modern, responsive design with smooth animations, skeleton loaders, and curated aesthetics
* **Demo Mode**: Fully functional mock-data mode for offline/credential-free testing

## Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS v4, Vite
* **State Management:** React Hooks, Supabase Auth Context
* **Routing:** React Router DOM v6 (Protected and Role-based routes)
* **Backend:** Supabase (PostgreSQL, Auth, Storage)
* **Maps:** Leaflet, React Leaflet (OpenStreetMap)
* **UI Components:** Radix UI primitives, Lucide React, Sonner (Toasts)

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

**Note on Demo Mode:** The app automatically detects if Supabase credentials are missing and switches to demo mode, loading local hostel data from `src/data/mockHostels.ts`.

## Configuration

Create a `.env` file in the project root to connect to your live backend:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Supabase Setup

### 1. SQL Schema
Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor. This sets up:
* Tables: `hostels`, `rooms`, `profiles`, `bookings`, `reviews`, `referrals`
* Row Level Security (RLS) policies
* Database triggers for auto-updating counts and ratings
* Strict Database CHECK constraints for data validation

### 2. Storage
Create a public bucket named `hostel-images` for hostel galleries in the Supabase Storage dashboard.

## Project Structure

```text
src/
├── components/           # Shared UI, Modals, and Role-based route guards
├── pages/                # 12 Pages (Home, Hostels, Dashboard, OwnerDashboard, Admin, etc.)
├── hooks/                # Custom hooks (useAuth, useHostels, useDebounce, etc.)
├── lib/                  # API Clients (Supabase configuration)
├── types/                # TypeScript interfaces and Enums
├── utils/                # Helper functions and Constants
└── data/                 # Mock data for Demo Mode

supabase/
├── migrations/           # Database schema and RLS policies
└── seed.sql              # Initial hostel and room records
```

## User Roles and Permissions

HostelSpot supports three distinct user roles:

### 1. STUDENT
* Default role upon registration.
* Can book hostels, write reviews, and track referrals.

### 2. HOSTEL_OWNER
* Can access the Owner Dashboard.
* Manages specific hostel listings and confirms bookings.
* Requires admin verification (`is_verified = true`).

### 3. ADMIN
* Full access to the Admin Panel.
* Can verify owners, manage all hostels, and update roles.

#### Promoting a User (SQL)
Run this in the Supabase SQL Editor to manually assign elevated roles:
```sql
update public.profiles set role = 'ADMIN' where email = 'admin@example.com';
update public.profiles set role = 'HOSTEL_OWNER', is_verified = true where email = 'owner@example.com';
```

## Deployment

* **Frontend:** Optimized for Vercel, Netlify, or any static hosting provider.
* **Backend:** Managed by Supabase.
