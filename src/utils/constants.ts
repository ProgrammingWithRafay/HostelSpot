export const WHATSAPP_NUMBER = '923287675530';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi! I need help with hostel booking on HostelSpot.'
);
export const WHATSAPP_SUPPORT_LINK = `${WHATSAPP_LINK}?text=${WHATSAPP_MESSAGE}`;

export const DEPOSIT_AMOUNT = 750;

export const CITIES = [
  'Faisalabad',
  'Lahore',
  'Islamabad',
];

export const UNIVERSITIES = [
  'University of Agriculture Faisalabad (UAF)',
  'Government College University Faisalabad (GCUF)',
  'National Textile University (NTU)',
  'University of Central Punjab (UCP) Faisalabad',
  'COMSATS University Faisalabad',
  'University of Faisalabad (TUF)',
  'Riphah International University Faisalabad',
  'University of Sargodha (Faisalabad Campus)',
  'Punjab Medical College',
  'FAST University Faisalabad',
  'Other',
];

export const UNIVERSITIES_BY_CITY: Record<string, string[]> = {
  Faisalabad: [
    "University of Agriculture Faisalabad (UAF)",
    "Government College University Faisalabad (GCUF)",
    "National Textile University (NTU)",
    "University of Central Punjab (UCP) Faisalabad",
    "COMSATS University Faisalabad",
    "University of Faisalabad (TUF)",
    "Riphah International University Faisalabad",
    "FAST University Chiniot-Faisalabad",
    "Faisalabad Medical University",
    "NFC Institute of Engineering and Fertilizer Research Faisalabad",
    "Independent Medical College Faisalabad",
    "University of Education Faisalabad",
    "Other"
  ],
  Lahore: [
    "LUMS Lahore",
    "University of the Punjab Lahore",
    "UET Lahore",
    "FAST NUCES Lahore",
    "FC College Lahore",
    "Lahore School of Economics",
    "University of Management and Technology Lahore",
    "University of Central Punjab Lahore",
    "Information Technology University Lahore",
    "National College of Arts Lahore",
    "King Edward Medical University Lahore",
    "University of Veterinary and Animal Sciences Lahore",
    "Allama Iqbal Medical College Lahore",
    "Beaconhouse National University Lahore",
    "Superior University Lahore",
    "COMSATS University Lahore",
    "Other"
  ],
  Islamabad: [
    "NUST Islamabad",
    "COMSATS University Islamabad",
    "FAST NUCES Islamabad",
    "IIU Islamabad",
    "Quaid-e-Azam University Islamabad",
    "Bahria University Islamabad",
    "Air University Islamabad",
    "National Defense University Islamabad",
    "Riphah International University Islamabad",
    "SZABIST Islamabad",
    "NUML Islamabad",
    "PIEAS Islamabad",
    "Institute of Space Technology Islamabad",
    "Shifa Tameer-e-Millat University Islamabad",
    "Other"
  ],
};

export const SEMESTERS = [
  'Fall 2026',
  'Spring 2027',
  'Fall 2027',
  'Spring 2028',
];

export const AMENITY_ICONS: Record<string, string> = {
  mess_available: '🍽️',
  wifi: '📶',
  ac: '❄️',
  ups: '🔋',
  parking: '🅿️',
};

export const AMENITY_LABELS: Record<string, string> = {
  mess_available: 'Mess/Food',
  wifi: 'Wi-Fi',
  ac: 'Air Conditioning',
  ups: 'UPS/Generator',
  parking: 'Parking',
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: 'Pending', color: '#92400e', bg: '#fef3c7' },
  CONFIRMED: { label: 'Confirmed', color: '#166534', bg: '#dcfce7' },
  CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2' },
  CHECKED_IN: { label: 'Checked In', color: '#1e40af', bg: '#dbeafe' },
};

export const UNIVERSITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Faisalabad
  "University of Agriculture Faisalabad (UAF)": { lat: 31.4339, lng: 73.0689 },
  "Government College University Faisalabad (GCUF)": { lat: 31.4157, lng: 73.0688 },
  "National Textile University (NTU)": { lat: 31.4878, lng: 73.1554 },
  "University of Central Punjab (UCP) Faisalabad": { lat: 31.3986, lng: 73.1440 },
  "COMSATS University Faisalabad": { lat: 31.3934, lng: 73.1493 },
  "University of Faisalabad (TUF)": { lat: 31.4576, lng: 73.1580 },
  "Riphah International University Faisalabad": { lat: 31.3924, lng: 73.1422 },
  "FAST University Chiniot-Faisalabad": { lat: 31.6020, lng: 73.0710 },
  "Faisalabad Medical University": { lat: 31.4514, lng: 73.0846 },
  "NFC Institute of Engineering and Fertilizer Research Faisalabad": { lat: 31.4560, lng: 73.1090 },
  "Independent Medical College Faisalabad": { lat: 31.4110, lng: 73.0820 },
  "University of Education Faisalabad": { lat: 31.3949, lng: 73.0695 },
  // Lahore
  "LUMS Lahore": { lat: 31.4703, lng: 74.4097 },
  "University of the Punjab Lahore": { lat: 31.4886, lng: 74.2926 },
  "UET Lahore": { lat: 31.5786, lng: 74.3546 },
  "FAST NUCES Lahore": { lat: 31.4816, lng: 74.3038 },
  "FC College Lahore": { lat: 31.5345, lng: 74.3411 },
  "Lahore School of Economics": { lat: 31.5027, lng: 74.4749 },
  "University of Management and Technology Lahore": { lat: 31.4514, lng: 74.2940 },
  "University of Central Punjab Lahore": { lat: 31.4472, lng: 74.2680 },
  "Information Technology University Lahore": { lat: 31.4760, lng: 74.3427 },
  "National College of Arts Lahore": { lat: 31.5682, lng: 74.3072 },
  "King Edward Medical University Lahore": { lat: 31.5707, lng: 74.3141 },
  "University of Veterinary and Animal Sciences Lahore": { lat: 31.5749, lng: 74.2995 },
  "Allama Iqbal Medical College Lahore": { lat: 31.4863, lng: 74.3004 },
  "Beaconhouse National University Lahore": { lat: 31.3648, lng: 74.2160 },
  "Superior University Lahore": { lat: 31.3193, lng: 74.2198 },
  "COMSATS University Lahore": { lat: 31.4022, lng: 74.2094 },
  // Islamabad
  "NUST Islamabad": { lat: 33.6448, lng: 72.9917 },
  "COMSATS University Islamabad": { lat: 33.6496, lng: 73.1549 },
  "FAST NUCES Islamabad": { lat: 33.6681, lng: 72.9877 },
  "IIU Islamabad": { lat: 33.6636, lng: 73.0266 },
  "Quaid-e-Azam University Islamabad": { lat: 33.7437, lng: 73.1585 },
  "Bahria University Islamabad": { lat: 33.7157, lng: 73.0283 },
  "Air University Islamabad": { lat: 33.7139, lng: 73.0258 },
  "National Defense University Islamabad": { lat: 33.7291, lng: 73.0118 },
  "Riphah International University Islamabad": { lat: 33.6169, lng: 72.9723 },
  "SZABIST Islamabad": { lat: 33.6772, lng: 73.0680 },
  "NUML Islamabad": { lat: 33.6671, lng: 73.0507 },
  "PIEAS Islamabad": { lat: 33.6531, lng: 73.2669 },
  "Institute of Space Technology Islamabad": { lat: 33.5197, lng: 73.1761 },
  "Shifa Tameer-e-Millat University Islamabad": { lat: 33.6931, lng: 73.0768 },
};
