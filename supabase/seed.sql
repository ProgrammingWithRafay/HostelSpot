-- ============================================================
-- HostelSpot — Seed Data
-- Run AFTER 001_init.sql
-- ============================================================

-- 1. Madina Boys Hostel
with h as (
  insert into hostels (name, address, phone, google_place_id, latitude, longitude, rating, review_count,
    mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Madina Boys Hostel',
    'Plot 201, Younus Town, Faisalabad',
    '+923057747985',
    'ChIJJRN5CDVnIjkR690uX3FwTNo',
    31.3852958, 73.1242675,
    4.6, 155,
    true, true, false, true, true,
    'Well-managed hostel with spacious rooms, high-speed Wi-Fi, and a peaceful environment. Ideal for students and young professionals. Known for its cleanliness and cooperative staff.',
    true, 'Top Rated', '#16a34a'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8000, 4, 4 from h
union all
select id, 'DOUBLE', 5500, 8, 8 from h;

-- 2. A.S Boys Hostel
with h as (
  insert into hostels (name, address, phone, google_place_id, latitude, longitude, rating, review_count,
    mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'A.S Boys Hostel',
    'Jaranwala Rd, opp. University of Central Punjab, Hamayon Town, Faisalabad',
    '+923216619483',
    'ChIJnwYLGwBnIjkRfpYi0mgPoK4',
    31.4010201, 73.1452819,
    4.9, 28,
    true, true, true, true, false,
    'Excellent hostel right opposite University of Central Punjab. Safe, comfortable, and affordable. Rated highest in Faisalabad. Perfect for UCP students needing close accommodation.',
    true, 'Highest Rated', '#d97706'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7500, 3, 3 from h
union all
select id, 'DOUBLE', 5000, 6, 6 from h;

-- 3. Decent Boys Hostel
with h as (
  insert into hostels (name, address, phone, google_place_id, latitude, longitude, rating, review_count,
    mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Decent Boys Hostel',
    '380 A Colony, Haseeb Shaheed Colony Block A, Faisalabad',
    '+923057666482',
    'ChIJL-CrbuRnIjkRqHBgXGcWzxE',
    31.3952966, 73.1032601,
    4.2, 124,
    false, true, true, true, true,
    'Fully furnished hostel near Babar Chowk with AC, UPS, and hot/cold water. Wide parking space available. A clean and economical choice with a cooperative owner.',
    true, 'Fully Furnished', '#2563eb'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9000, 5, 5 from h
union all
select id, 'DOUBLE', 6000, 10, 10 from h;

-- 4. City Boys Hostel
with h as (
  insert into hostels (name, address, phone, google_place_id, latitude, longitude, rating, review_count,
    mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'City Boys Hostel',
    'Near Butt Biryani, Gobind Pura, opp. UAF GP Gate, Faisalabad',
    '+923051390261',
    'ChIJGfgb_NRDIjkRrNQ3sbOKwkg',
    31.4259794, 73.0643127,
    4.1, 114,
    true, true, false, true, false,
    'Right in front of University of Agriculture Faisalabad GP Gate. Well furnished with TV, Wi-Fi, and UPS. Best value for UAF students. Surrounded by restaurants and shops.',
    true, 'Best Value', '#7c3aed'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7000, 2, 2 from h
union all
select id, 'DOUBLE', 4500, 7, 7 from h;

-- 5. Al Haram Boys Hostel
with h as (
  insert into hostels (name, address, phone, google_place_id, latitude, longitude, rating, review_count,
    mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Al Haram Boys Hostel',
    'Imam Bargah Rd, 8/15 Douglaspura, Faisalabad',
    '+923005682701',
    'ChIJ5RNTbqhDIjkRnHGbHpOftYc',
    31.4155212, 73.0744172,
    4.2, 53,
    true, true, false, true, true,
    'Safe, comfortable residential hostel with 5+ years of trusted management. Home-like atmosphere with friendly staff. Excellent for students seeking a secure and peaceful environment.',
    true, 'Safe & Secure', '#0891b2'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8500, 3, 3 from h
union all
select id, 'DOUBLE', 5800, 5, 5 from h;


-- Additional Hostels Seed Data


with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Kasana Boys Hostel',
    'Younas Town, near Riphah University, Faisalabad',
    '+923001234567',
    31.385, 73.125,
    4.3, 85,
    true, true, false, true, true,
    'A comfortable hostel primarily for Riphah University students. Offers all basic amenities including reliable WiFi and UPS backup.',
    true, 'Student Choice', '#3b82f6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9810, 5, 4 from h
union all
select id, 'DOUBLE', 5961, 13, 9 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Burhan Centre Student Hostel',
    'Near GTS Chowk, Faisalabad',
    '+923217654321',
    31.418, 73.079,
    4, 120,
    false, true, false, true, true,
    'Centrally located near GTS Chowk, making it very easy to access public transport. Affordable rooms with good security.',
    true, 'Central Location', '#ef4444'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7348, 6, 2 from h
union all
select id, 'DOUBLE', 6811, 10, 4 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Grace Hostel for Boys',
    'Gulberg Road, Faisalabad',
    '+923339876543',
    31.42, 73.085,
    4.5, 45,
    true, true, true, true, false,
    'Premium hostel offering AC rooms and 3 meals a day. Very clean environment with a dedicated study room.',
    true, 'Premium', '#8b5cf6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 11119, 6, 4 from h
union all
select id, 'DOUBLE', 7700, 12, 5 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Jutt Boys Hostel',
    'Satyana Road, Faisalabad',
    '+923051112233',
    31.39, 73.11,
    3.8, 60,
    true, true, false, false, true,
    'Budget-friendly accommodation on Satyana road. Good food and friendly staff.',
    true, 'Budget Choice', '#eab308'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9013, 6, 5 from h
union all
select id, 'DOUBLE', 7084, 12, 4 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Riphah Boys Hostel (Abu Bakar Hall)',
    'Satiana Road, opposite Riphah International University, Faisalabad',
    '+923004445566',
    31.382, 73.12,
    4.7, 200,
    true, true, true, true, true,
    'Official standard hostel directly opposite to the university campus. Highly secure with biometric attendance.',
    true, 'Highly Recommended', '#10b981'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9406, 4, 2 from h
union all
select id, 'DOUBLE', 6350, 10, 5 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Abdullah Boys Hostel',
    'Near Al Noor Hospital, Jaranwala Road, Faisalabad',
    '+923457778899',
    31.405, 73.14,
    4.1, 35,
    true, true, false, true, false,
    'Quiet neighborhood, suitable for medical students doing rotations at nearby hospitals.',
    true, 'Quiet Environment', '#6366f1'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9062, 5, 5 from h
union all
select id, 'DOUBLE', 6715, 6, 6 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Student Inn Boys Hostel',
    'Amin Town, Canal Road, Faisalabad',
    '+923012223344',
    31.43, 73.13,
    4.4, 90,
    true, true, true, true, true,
    'Modern hostel built specifically for students. Large lounge area and high-speed fiber internet.',
    true, 'Modern', '#f59e0b'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8618, 6, 2 from h
union all
select id, 'DOUBLE', 6361, 12, 9 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Royal Boys Hostel',
    'Madina Town, Faisalabad',
    '+923225556677',
    31.41, 73.1,
    4.6, 110,
    true, true, true, true, true,
    'Upscale hostel in the posh area of Madina Town. Offers single rooms with attached baths.',
    true, 'Luxury', '#ec4899'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9223, 6, 6 from h
union all
select id, 'DOUBLE', 7346, 13, 9 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Elite Boys Hostel',
    'Peoples Colony No 1, Faisalabad',
    '+923338889900',
    31.4, 73.09,
    4.2, 75,
    false, true, true, true, true,
    'Located in the heart of the city. Close to D-Ground market and commercial areas.',
    true, 'Top Location', '#14b8a6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8928, 6, 4 from h
union all
select id, 'DOUBLE', 7266, 9, 7 from h;

with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'UAF Main Gate Hostel',
    'Jail Road, near UAF Main Gate, Faisalabad',
    '+923009998877',
    31.425, 73.07,
    4.3, 150,
    true, true, false, true, false,
    'Just 2 minutes walk from UAF Main Gate. Extremely popular among agriculture students.',
    true, 'UAF Favorite', '#84cc16'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9690, 4, 2 from h
union all
select id, 'DOUBLE', 5985, 11, 9 from h;


-- ============================================================
-- 15 Lahore Boys Hostels
-- ============================================================

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Johar Town Boys Hostel',
    'Lahore',
    'Block G, Johar Town, Lahore',
    '+923001111111',
    31.4697, 74.2728,
    4.0, 143,
    true, true, true, true, true,
    'A fantastic and secure boys hostel located in Block G, Johar Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Student Choice', '#3b82f6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7924, 4, 3 from h
union all
select id, 'DOUBLE', 4813, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Muslim Town Boys Hostel',
    'Lahore',
    'New Muslim Town, Lahore',
    '+923012222222',
    31.5165, 74.3219,
    3.8, 199,
    false, true, true, true, false,
    'A fantastic and secure boys hostel located in New Muslim Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Central Location', '#ef4444'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 10493, 4, 3 from h
union all
select id, 'DOUBLE', 4534, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Model Town Executive Boys Hostel',
    'Lahore',
    'Block C, Model Town, Lahore',
    '+923023333333',
    31.4826, 74.3204,
    4.3, 97,
    true, true, false, true, true,
    'A fantastic and secure boys hostel located in Block C, Model Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Premium', '#8b5cf6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 10261, 4, 3 from h
union all
select id, 'DOUBLE', 6226, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Gulberg Premier Boys Hostel',
    'Lahore',
    'Gulberg III, Lahore',
    '+923034444444',
    31.5102, 74.3441,
    4.5, 52,
    true, true, false, true, true,
    'A fantastic and secure boys hostel located in Gulberg III, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Luxury', '#ec4899'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8223, 4, 3 from h
union all
select id, 'DOUBLE', 5029, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Wapda Town Boys Hostel',
    'Lahore',
    'Wapda Town, Lahore',
    '+923045555555',
    31.4287, 74.2657,
    4.3, 65,
    true, true, true, true, false,
    'A fantastic and secure boys hostel located in Wapda Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Quiet Environment', '#6366f1'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8442, 4, 3 from h
union all
select id, 'DOUBLE', 6303, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Garden Town Student Inn',
    'Lahore',
    'Garden Town, Lahore',
    '+923056666666',
    31.5002, 74.3243,
    4.7, 66,
    true, true, true, true, true,
    'A fantastic and secure boys hostel located in Garden Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Top Location', '#14b8a6'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7192, 4, 3 from h
union all
select id, 'DOUBLE', 5248, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Allama Iqbal Town Boys Hostel',
    'Lahore',
    'Allama Iqbal Town, Lahore',
    '+923067777777',
    31.5113, 74.2856,
    4.4, 198,
    true, true, true, true, false,
    'A fantastic and secure boys hostel located in Allama Iqbal Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Budget Friendly', '#f59e0b'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9569, 4, 3 from h
union all
select id, 'DOUBLE', 4928, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Faisal Town Boys Hostel',
    'Lahore',
    'Faisal Town, Lahore',
    '+923078888888',
    31.4784, 74.3054,
    4.1, 163,
    false, true, true, true, true,
    'A fantastic and secure boys hostel located in Faisal Town, Lahore. Provides excellent facilities for students and professionals.',
    true, null, null
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 10012, 4, 3 from h
union all
select id, 'DOUBLE', 5060, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Barkat Market Boys Hostel',
    'Lahore',
    'Barkat Market, Garden Town, Lahore',
    '+923089999999',
    31.5034, 74.3201,
    4.0, 62,
    true, true, true, true, true,
    'A fantastic and secure boys hostel located in Barkat Market, Garden Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Best Value', '#7c3aed'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 10850, 4, 3 from h
union all
select id, 'DOUBLE', 5657, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Township Boys Hostel',
    'Lahore',
    'Township, Lahore',
    '+923090000000',
    31.4504, 74.3032,
    4.4, 164,
    true, true, false, false, true,
    'A fantastic and secure boys hostel located in Township, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Top Rated', '#16a34a'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8691, 4, 3 from h
union all
select id, 'DOUBLE', 5698, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'UCP Boys Hostel',
    'Lahore',
    'Khayaban-e-Jinnah, Johar Town, Lahore',
    '+923101111111',
    31.4646, 74.269,
    4.0, 209,
    false, true, false, true, true,
    'A fantastic and secure boys hostel located in Khayaban-e-Jinnah, Johar Town, Lahore. Provides excellent facilities for students and professionals.',
    true, 'UCP Favorite', '#84cc16'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9086, 4, 3 from h
union all
select id, 'DOUBLE', 4696, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'LUMS Executive Boys Hostel',
    'Lahore',
    'DHA Phase 5, Lahore',
    '+923112222222',
    31.4716, 74.4093,
    4.9, 81,
    true, true, true, true, true,
    'A fantastic and secure boys hostel located in DHA Phase 5, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Highly Recommended', '#10b981'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 7656, 4, 3 from h
union all
select id, 'DOUBLE', 5295, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'Punjab University Boys Hostel',
    'Lahore',
    'Quaid-e-Azam Campus, Lahore',
    '+923123333333',
    31.5006, 74.3021,
    4.4, 157,
    false, true, false, true, false,
    'A fantastic and secure boys hostel located in Quaid-e-Azam Campus, Lahore. Provides excellent facilities for students and professionals.',
    true, 'PU Favorite', '#84cc16'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 9109, 4, 3 from h
union all
select id, 'DOUBLE', 6020, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'GCU Boys Hostel',
    'Lahore',
    'Lower Mall, Lahore',
    '+923134444444',
    31.5714, 74.309,
    4.6, 40,
    false, true, true, true, false,
    'A fantastic and secure boys hostel located in Lower Mall, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Historic Area', '#d97706'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 8872, 4, 3 from h
union all
select id, 'DOUBLE', 6722, 8, 6 from h;

with h as (
  insert into hostels (name, city, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color)
  values (
    'DHA Phase 3 Boys Hostel',
    'Lahore',
    'DHA Phase 3, Lahore',
    '+923145555555',
    31.4788, 74.3813,
    3.8, 30,
    true, true, false, true, true,
    'A fantastic and secure boys hostel located in DHA Phase 3, Lahore. Provides excellent facilities for students and professionals.',
    true, 'Safe & Secure', '#0891b2'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 10555, 4, 3 from h
union all
select id, 'DOUBLE', 4156, 8, 6 from h;


-- ============================================================
-- ISLAMABAD HOSTELS (31-45)
-- ============================================================

-- 31. Capital Boys Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Capital Boys Hostel',
    'House 12, Street 45, G-11/2, Islamabad',
    '+923001112233',
    33.6761, 72.9917,
    4.8, 120,
    true, true, true, true, true,
    'Premium boys hostel located in the heart of G-11. Walking distance to NUST pick & drop. 3 meals a day, daily laundry, and high-speed Nayatel internet.',
    true, 'Premium Choice', '#eab308', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 15013, 5, 5 from h
union all
select id, 'DOUBLE', 12997, 10, 10 from h;

-- 32. Islamabad Premier Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Islamabad Premier Hostel',
    'House 4, Street 90, I-8/4, Islamabad',
    '+923334445566',
    33.6681, 73.0768,
    4.6, 85,
    true, true, false, true, false,
    'Excellent environment for students. Located near I-8 Markaz. Very close to SZABIST, NUML, and Iqra University.',
    true, 'Student Favorite', '#2563eb', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 15948, 5, 5 from h
union all
select id, 'DOUBLE', 12085, 10, 10 from h;

-- 33. Margalla View Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Margalla View Hostel',
    'Street 10, E-11/3, Islamabad',
    '+923219998877',
    33.702, 72.983,
    4.5, 50,
    true, true, true, true, true,
    'Scenic views of Margalla Hills. Quiet and peaceful environment ideal for studying. Furnished rooms with attached baths.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 19230, 5, 5 from h
union all
select id, 'DOUBLE', 12968, 10, 10 from h;

-- 34. NUSTian Boys Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'NUSTian Boys Hostel',
    'H-13, near NUST Gate 3, Islamabad',
    '+923456667788',
    33.64, 72.988,
    4.7, 210,
    true, true, true, true, true,
    'The go-to hostel for NUST students. Just a 2-minute walk from Gate 3. Fully equipped with study halls and recreational area.',
    true, 'Closest to NUST', '#16a34a', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 18273, 5, 5 from h
union all
select id, 'DOUBLE', 11785, 10, 10 from h;

-- 35. Elite Boys Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Elite Boys Hostel',
    'House 22, Street 30, F-8/1, Islamabad',
    '+923012223344',
    33.715, 73.034,
    4.9, 40,
    true, true, true, true, true,
    'Executive level living for professionals and university students. Situated in the upscale F-8 sector. Top-notch security and food.',
    true, 'Executive', '#9333ea', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 15239, 5, 5 from h
union all
select id, 'DOUBLE', 11481, 10, 10 from h;

-- 36. COMSATS Inn
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'COMSATS Inn',
    'Park Road, near COMSATS Gate 1, Chak Shahzad, Islamabad',
    '+923115554433',
    33.651, 73.156,
    4.3, 95,
    true, true, false, true, false,
    'Affordable accommodation right next to COMSATS. Friendly staff, decent food, and a very active student community.',
    true, 'Value for Money', '#ef4444', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 16554, 5, 5 from h
union all
select id, 'DOUBLE', 12620, 10, 10 from h;

-- 37. Blue Area Executive Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Blue Area Executive Hostel',
    'Behind D-Chowk, G-7/3, Islamabad',
    '+923058889900',
    33.708, 73.09,
    4.1, 65,
    false, true, false, true, true,
    'Central location near Blue Area. Great for job seekers and professionals. Self-catering kitchen available.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 17033, 5, 5 from h
union all
select id, 'DOUBLE', 12647, 10, 10 from h;

-- 38. Green Avenue Boys Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Green Avenue Boys Hostel',
    'Street 5, G-9/4, Islamabad',
    '+923361122334',
    33.689, 73.03,
    4.4, 112,
    true, true, false, true, true,
    'Near Karachi Company (G-9 Markaz). Everything you need is at walking distance. Good food and clean environment.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 16522, 5, 5 from h
union all
select id, 'DOUBLE', 11542, 10, 10 from h;

-- 39. FAST Residence
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'FAST Residence',
    'Street 7, Sector I-10/3, Islamabad',
    '+923007776655',
    33.652, 73.035,
    4.5, 88,
    true, true, true, true, false,
    'Highly recommended for FAST University students. Direct transport routes available. Study-friendly environment.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 15800, 5, 5 from h
union all
select id, 'DOUBLE', 12706, 10, 10 from h;

-- 40. F-10 Markaz Lodge
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'F-10 Markaz Lodge',
    'Street 40, F-10/4, Islamabad',
    '+923223334455',
    33.693, 73.006,
    4.7, 150,
    true, true, true, true, true,
    'Located near F-10 Markaz. Easy access to public transport, restaurants, and parks. Excellent security system.',
    true, 'Highly Secure', '#0891b2', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 16054, 5, 5 from h
union all
select id, 'DOUBLE', 10656, 10, 10 from h;

-- 41. Bahria Student Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Bahria Student Hostel',
    'Street 14, E-8, Naval Anchorage Rd, Islamabad',
    '+923339991122',
    33.712, 73.02,
    4.6, 70,
    true, true, false, true, true,
    'Conveniently located for students of Bahria and Air University. Clean rooms and cooperative management.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 19472, 5, 5 from h
union all
select id, 'DOUBLE', 11328, 10, 10 from h;

-- 42. I-8 Executive Boys
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'I-8 Executive Boys',
    'House 3, Street 25, I-8/1, Islamabad',
    '+923024447788',
    33.67, 73.06,
    4.8, 135,
    true, true, true, true, true,
    'One of the best hostels in I-8. Spacious rooms, carpeted floors, and a dedicated dining area.',
    true, 'Top Rated', '#ea580c', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 15230, 5, 5 from h
union all
select id, 'DOUBLE', 10668, 10, 10 from h;

-- 43. Quaidian Lodge
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'Quaidian Lodge',
    'Bari Imam Road, near Quaid-e-Azam University, Islamabad',
    '+923128887766',
    33.738, 73.135,
    4.2, 140,
    true, true, false, true, true,
    'Affordable housing for QAU students. Scenic and quiet. Bus stops right outside.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 16427, 5, 5 from h
union all
select id, 'DOUBLE', 10601, 10, 10 from h;

-- 44. G-10 Student Hostel
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'G-10 Student Hostel',
    'Street 60, G-10/3, Islamabad',
    '+923451119988',
    33.675, 73.01,
    4.4, 80,
    true, true, false, true, true,
    'Budget-friendly option in G-10. Close to metro station and local markets. 3 times meal included.',
    true, null, null, 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 18256, 5, 5 from h
union all
select id, 'DOUBLE', 10013, 10, 10 from h;

-- 45. IIUI Heights
with h as (
  insert into hostels (name, address, phone, latitude, longitude, rating, review_count, mess_available, wifi, ac, ups, parking, description, verified, badge, badge_color, city)
  values (
    'IIUI Heights',
    'Sector H-11, near IIUI campus, Islamabad',
    '+923005556677',
    33.655, 73.02,
    4.5, 160,
    true, true, false, true, true,
    'Custom built for students of International Islamic University. Very close to campus. Large rooms and great food.',
    true, 'Purpose Built', '#059669', 'Islamabad'
  ) returning id
)
insert into rooms (hostel_id, type, price_per_month, total_count, available_count)
select id, 'SINGLE', 16128, 5, 5 from h
union all
select id, 'DOUBLE', 11094, 10, 10 from h;

