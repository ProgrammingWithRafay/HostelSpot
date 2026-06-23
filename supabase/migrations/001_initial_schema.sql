-- ============================================================
-- HostelSpot — Database Initialization
-- ============================================================

-- HOSTELS
create table if not exists hostels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text default 'Faisalabad',
  phone text not null check (phone ~ '^\+92[0-9]{10}$'),
  google_place_id text,
  latitude float check (latitude >= -90 and latitude <= 90),
  longitude float check (longitude >= -180 and longitude <= 180),
  rating float check (rating >= 0 and rating <= 5),
  review_count integer default 0 check (review_count >= 0),
  mess_available boolean default false,
  wifi boolean default false,
  ac boolean default false,
  ups boolean default false,
  parking boolean default false,
  description text,
  verified boolean default false,
  badge text,
  badge_color text,
  created_at timestamp with time zone default now()
);

-- ROOMS
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid references hostels(id) on delete cascade,
  type text check (type in ('SINGLE', 'DOUBLE', 'TRIPLE')),
  price_per_month integer not null check (price_per_month > 0),
  total_count integer not null check (total_count >= 0),
  available_count integer not null check (available_count >= 0),
  created_at timestamp with time zone default now(),
  check (available_count <= total_count)
);

-- HOSTEL IMAGES
create table if not exists hostel_images (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid references hostels(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

-- PROFILES (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text check (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  full_name text check (length(full_name) >= 2),
  phone text unique check (phone ~ '^\+92[0-9]{10}$'),
  city_of_origin text,
  role text check (role in ('STUDENT', 'ADMIN', 'HOSTEL_OWNER')) default 'STUDENT',
  hostel_id uuid references hostels(id) on delete set null,
  is_verified boolean default false,
  is_suspended boolean default false,
  created_at timestamp with time zone default now()
);

-- BOOKINGS
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  hostel_id uuid references hostels(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  semester_start text,
  status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN')) default 'PENDING',
  deposit_amount integer default 750,
  deposit_refunded boolean default false,
  referral_code text,
  booked_at timestamp with time zone default now(),
  confirmed_at timestamp with time zone
);

-- REVIEWS
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  hostel_id uuid references hostels(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text check (length(comment) >= 5),
  created_at timestamp with time zone default now()
);

-- REFERRALS
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id),
  referred_id uuid references auth.users(id),
  booking_id uuid references bookings(id),
  reward_given boolean default false,
  created_at timestamp with time zone default now()
);

-- MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  hostel_id uuid references hostels(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- PLACE CACHE (Google Places API results)
create table if not exists place_cache (
  place_id text primary key,
  data jsonb not null,
  fetched_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY & POLICIES
-- ============================================================

alter table hostels enable row level security;
alter table rooms enable row level security;
alter table hostel_images enable row level security;
alter table profiles enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table referrals enable row level security;
alter table messages enable row level security;
alter table place_cache enable row level security;

-- Admin Helper Function
create or replace function public.is_admin()
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'ADMIN'
  );
end;
$$;

-- HOSTELS POLICIES
create policy "Hostels are publicly readable" on hostels for select using (true);
create policy "Admins can insert hostels" on hostels for insert with check (is_admin());
create policy "Admins can update hostels" on hostels for update using (is_admin());
create policy "Admins can delete hostels" on hostels for delete using (is_admin());
create policy "Hostel owners can update their hostel" on hostels for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = hostels.id)
);

-- ROOMS POLICIES
create policy "Rooms are publicly readable" on rooms for select using (true);
create policy "Admins can manage rooms" on rooms for all using (is_admin());
create policy "Hostel owners can manage their rooms" on rooms for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = rooms.hostel_id)
);

-- HOSTEL IMAGES POLICIES
create policy "Hostel images are publicly readable" on hostel_images for select using (true);
create policy "Admins can manage hostel images" on hostel_images for all using (is_admin());
create policy "Hostel owners can manage their hostel images" on hostel_images for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = hostel_images.hostel_id)
);

-- PROFILES POLICIES
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can read all profiles" on profiles for select using (is_admin());
create policy "Admins can update all profiles" on profiles for update using (is_admin());
create policy "Admins can delete profiles" on profiles for delete using (is_admin());

-- BOOKINGS POLICIES
create policy "Students can view own bookings" on bookings for select using (auth.uid() = student_id);
create policy "Authenticated users can create bookings" on bookings for insert with check (auth.uid() = student_id);
create policy "Students can cancel own pending bookings" on bookings for update using (
  auth.uid() = student_id and status = 'PENDING'
) with check (status = 'CANCELLED');
create policy "Admins can update any booking" on bookings for update using (is_admin());
create policy "Admins can view all bookings" on bookings for select using (is_admin());
create policy "Hostel owners can view their bookings" on bookings for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = bookings.hostel_id)
);
create policy "Hostel owners can update their bookings" on bookings for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = bookings.hostel_id)
);

-- REVIEWS POLICIES
create policy "Reviews are publicly readable" on reviews for select using (true);
create policy "Students can create reviews" on reviews for insert with check (auth.uid() = student_id);
create policy "Admins can delete reviews" on reviews for delete using (is_admin());

-- MESSAGES POLICIES
create policy "Students can read their messages" on messages for select using (auth.uid() = student_id);
create policy "Students can send messages" on messages for insert with check (auth.uid() = sender_id and auth.uid() = student_id);
create policy "Hostel owners can read messages for their hostel" on messages for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = messages.hostel_id) or is_admin()
);
create policy "Hostel owners can send messages" on messages for insert with check (
  auth.uid() = sender_id and (
    exists (select 1 from profiles where id = auth.uid() and role = 'HOSTEL_OWNER' and profiles.hostel_id = messages.hostel_id) or is_admin()
  )
);

-- PLACE CACHE POLICIES
create policy "Place cache is publicly readable" on place_cache for select using (true);
create policy "Service role can manage place cache" on place_cache for all using (true);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- 1. Auto-create profile on auth user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  _role text;
begin
  -- Extract role from metadata, default to STUDENT
  _role := coalesce(new.raw_user_meta_data->>'role', 'STUDENT');

  -- Sync role back to auth metadata if it was missing
  update auth.users 
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', _role)
  where id = new.id;

  insert into public.profiles (id, email, role, full_name, phone, city_of_origin)
  values (
    new.id, 
    new.email, 
    _role,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city_of_origin'
  )
  on conflict (id) do update set
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    city_of_origin = EXCLUDED.city_of_origin;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2. Decrease available_count when booking is created
create or replace function handle_booking_created()
returns trigger language plpgsql security definer as $$
begin
  update public.rooms
  set available_count = available_count - 1
  where id = new.room_id and available_count > 0;
  return new;
end;
$$;

drop trigger if exists on_booking_created on bookings;
create trigger on_booking_created
  after insert on bookings
  for each row execute function handle_booking_created();

-- 3. Restore available_count when booking is cancelled
create or replace function handle_booking_cancelled()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'CANCELLED' and old.status != 'CANCELLED' then
    update public.rooms
    set available_count = available_count + 1
    where id = new.room_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_booking_cancelled on bookings;
create trigger on_booking_cancelled
  after update on bookings
  for each row execute function handle_booking_cancelled();

-- 4. Update hostel rating when review is added
create or replace function handle_review_created()
returns trigger language plpgsql security definer as $$
begin
  update public.hostels
  set
    rating = (
      select avg(rating)::float from public.reviews where hostel_id = new.hostel_id
    ),
    review_count = (
      select count(*) from public.reviews where hostel_id = new.hostel_id
    )
  where id = new.hostel_id;
  return new;
end;
$$;

drop trigger if exists on_review_created on reviews;
create trigger on_review_created
  after insert on reviews
  for each row execute function handle_review_created();

-- ============================================================
-- CONTACT REQUESTS
-- ============================================================
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  user_id uuid references auth.users(id) on delete set null,
  admin_reply text,
  status text check (status in ('PENDING', 'REPLIED', 'CLOSED')) default 'PENDING',
  created_at timestamp with time zone default now(),
  replied_at timestamp with time zone
);

alter table contact_requests enable row level security;

-- POLICIES
create policy "Admins can manage contact requests" on contact_requests for all using (is_admin());
create policy "Authenticated students can view their own requests" on contact_requests for select using (auth.uid() = user_id);
create policy "Anyone can insert a contact request" on contact_requests for insert with check (true);
