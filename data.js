/* ============================================================
   FAMILYLINK-AI — Demo Data & Application State
   All data is clearly fictional / synthetic for demonstration
   ============================================================ */

const DEMO_LABEL = '⚠ DEMO DATA — Not real persons or events';

// ============================================================
// MISSING CASES (Fictional Demo Data)
// ============================================================
const missingCases = [
  {
    id: 'RF-2026-000123',
    personName: 'Arun Kumar',
    age: 62,
    gender: 'Male',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Flood Evacuation Zone A, NH-45 Near Papanasam',
    evacuationCentre: 'Government Higher Secondary School, Papanasam',
    physicalDesc: 'Medium build, grey hair, height approx 5\'7", wears glasses',
    clothingDesc: 'White kurta, brown trousers at time of disappearance',
    medicalInfo: 'Diabetic, requires daily medication',
    language: 'Tamil, basic Hindi',
    phone: '9XXX-XXXXXX (Unavailable)',
    reporterName: 'Suresh Kumar',
    reporterRelation: 'Son',
    reporterContact: '9441-XXXXXX',
    reporterEmail: 's.kumar@example.com',
    status: 'MATCH_FOUND',
    priority: 'critical',
    matchId: 'FP-2026-000087',
    matchScore: 87,
    lat: 10.9102,
    lng: 79.0608,
    createdAt: '2026-09-29T08:30:00',
    updatedAt: '2026-10-01T14:22:00',
    assignedAuthority: 'Thanjavur District Relief Authority',
    photo: null,
    timeline: [
      { status: 'MISSING',              time: '2026-09-29 08:30', by: 'System (Suresh Kumar)' },
      { status: 'MATCH_FOUND',          time: '2026-09-30 11:15', by: 'AI Matching Engine v1.2' },
      { status: 'UNDER_VERIFICATION',   time: '2026-10-01 09:00', by: 'Officer: Meenakshi R.' }
    ]
  },
  {
    id: 'RF-2026-000124',
    personName: 'Lakshmi Devi',
    age: 45,
    gender: 'Female',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Srinivasan Nagar, Kumbakonam',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Slim build, long black hair, height approx 5\'3"',
    clothingDesc: 'Green saree',
    medicalInfo: 'None known',
    language: 'Tamil',
    phone: 'Unknown',
    reporterName: 'Rajesh Devi',
    reporterRelation: 'Husband',
    reporterContact: '9876-XXXXXX',
    reporterEmail: '',
    status: 'MISSING',
    priority: 'high',
    matchId: null,
    matchScore: null,
    lat: 10.9617,
    lng: 79.4068,
    createdAt: '2026-09-29T10:15:00',
    updatedAt: '2026-09-29T10:15:00',
    assignedAuthority: 'Thanjavur District Relief Authority',
    photo: null,
    timeline: [
      { status: 'MISSING', time: '2026-09-29 10:15', by: 'System (Rajesh Devi)' }
    ]
  },
  {
    id: 'RF-2026-000125',
    personName: 'Ravi Shankar',
    age: 8,
    gender: 'Male',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Near Cauvery River Bank, Old Town Area',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Small child, short hair, wearing school uniform (blue shirt, grey trousers)',
    clothingDesc: 'Blue school shirt, grey trousers',
    medicalInfo: 'None',
    language: 'Tamil',
    phone: 'N/A',
    reporterName: 'Priya Shankar',
    reporterRelation: 'Mother',
    reporterContact: '9123-XXXXXX',
    reporterEmail: '',
    status: 'MISSING',
    priority: 'critical',
    matchId: null,
    matchScore: null,
    lat: 10.8505,
    lng: 79.1236,
    createdAt: '2026-09-29T09:45:00',
    updatedAt: '2026-09-29T09:45:00',
    assignedAuthority: 'Unassigned',
    photo: null,
    timeline: [
      { status: 'MISSING', time: '2026-09-29 09:45', by: 'System (Priya Shankar)' }
    ]
  },
  {
    id: 'RF-2026-000126',
    personName: 'Murugesan Pillai',
    age: 70,
    gender: 'Male',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Nagapattinam',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Sirkazhi Town, Low-lying Area',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Elderly, white beard, walks with a cane',
    clothingDesc: 'White veshti, blue shirt',
    medicalInfo: 'Heart condition, requires medication',
    language: 'Tamil',
    phone: 'Unknown',
    reporterName: 'Karthik Pillai',
    reporterRelation: 'Son',
    reporterContact: '9234-XXXXXX',
    reporterEmail: '',
    status: 'VERIFIED',
    priority: 'high',
    matchId: 'FP-2026-000091',
    matchScore: 79,
    lat: 11.2385,
    lng: 79.7427,
    createdAt: '2026-09-29T11:30:00',
    updatedAt: '2026-10-02T16:00:00',
    assignedAuthority: 'Nagapattinam District Relief Authority',
    photo: null,
    timeline: [
      { status: 'MISSING',            time: '2026-09-29 11:30', by: 'System (Karthik Pillai)' },
      { status: 'MATCH_FOUND',        time: '2026-09-30 14:00', by: 'AI Matching Engine v1.2' },
      { status: 'UNDER_VERIFICATION', time: '2026-10-01 10:00', by: 'Officer: Tamil Selvan' },
      { status: 'VERIFIED',           time: '2026-10-02 16:00', by: 'Officer: Tamil Selvan' }
    ]
  },
  {
    id: 'RF-2026-000127',
    personName: 'Geetha Rao',
    age: 38,
    gender: 'Female',
    disasterType: 'Cyclone',
    disasterName: 'Cyclone Mithali 2026',
    incidentDate: '2026-10-01',
    district: 'Srikakulam',
    state: 'Andhra Pradesh',
    lastSeenLocation: 'Palasa Town, Coastal Area',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Medium height, brown skin, waist-length hair',
    clothingDesc: 'Red sari at time of cyclone',
    medicalInfo: 'Asthma',
    language: 'Telugu, Hindi',
    phone: 'Unknown',
    reporterName: 'Venkat Rao',
    reporterRelation: 'Husband',
    reporterContact: '9345-XXXXXX',
    reporterEmail: '',
    status: 'MISSING',
    priority: 'high',
    matchId: null,
    matchScore: null,
    lat: 18.7725,
    lng: 84.4065,
    createdAt: '2026-10-02T07:00:00',
    updatedAt: '2026-10-02T07:00:00',
    assignedAuthority: 'Unassigned',
    photo: null,
    timeline: [
      { status: 'MISSING', time: '2026-10-02 07:00', by: 'System (Venkat Rao)' }
    ]
  },
  {
    id: 'RF-2026-000128',
    personName: 'Ibrahim Khan',
    age: 55,
    gender: 'Male',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Flood-affected village near Vallam',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Stocky build, short beard, glasses',
    clothingDesc: 'Checked shirt, trousers',
    medicalInfo: 'Hypertension',
    language: 'Tamil, Urdu',
    phone: 'Unknown',
    reporterName: 'Fatima Khan',
    reporterRelation: 'Wife',
    reporterContact: '9456-XXXXXX',
    reporterEmail: '',
    status: 'REUNITED',
    priority: 'normal',
    matchId: 'FP-2026-000094',
    matchScore: 91,
    lat: 10.7905,
    lng: 79.0841,
    createdAt: '2026-09-29T14:00:00',
    updatedAt: '2026-10-03T10:30:00',
    assignedAuthority: 'Thanjavur District Relief Authority',
    photo: null,
    timeline: [
      { status: 'MISSING',            time: '2026-09-29 14:00', by: 'System (Fatima Khan)' },
      { status: 'MATCH_FOUND',        time: '2026-09-30 09:30', by: 'AI Matching Engine v1.2' },
      { status: 'UNDER_VERIFICATION', time: '2026-09-30 11:00', by: 'Officer: Meenakshi R.' },
      { status: 'VERIFIED',           time: '2026-09-30 13:00', by: 'Officer: Meenakshi R.' },
      { status: 'FAMILY_NOTIFIED',    time: '2026-09-30 13:15', by: 'System Notification' },
      { status: 'REUNITED',           time: '2026-10-03 10:30', by: 'Officer: Meenakshi R.' }
    ]
  },
  {
    id: 'RF-2026-000129',
    personName: 'Saroja Krishnan',
    age: 72,
    gender: 'Female',
    disasterType: 'Flood',
    disasterName: 'Kaveri Basin Flood 2026',
    incidentDate: '2026-09-28',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    lastSeenLocation: 'Pattukottai Town Centre',
    evacuationCentre: 'Unknown',
    physicalDesc: 'Elderly, white hair tied in bun, uses walking stick',
    clothingDesc: 'Purple saree',
    medicalInfo: 'Arthritis, hearing impaired',
    language: 'Tamil',
    phone: 'N/A',
    reporterName: 'Anand Krishnan',
    reporterRelation: 'Son',
    reporterContact: '9567-XXXXXX',
    reporterEmail: '',
    status: 'MISSING',
    priority: 'critical',
    matchId: null,
    matchScore: null,
    lat: 10.4297,
    lng: 79.3186,
    createdAt: '2026-09-29T12:00:00',
    updatedAt: '2026-09-29T12:00:00',
    assignedAuthority: 'Unassigned',
    photo: null,
    timeline: [
      { status: 'MISSING', time: '2026-09-29 12:00', by: 'System (Anand Krishnan)' }
    ]
  }
];

// ============================================================
// FOUND PERSON RECORDS (Fictional Demo Data)
// ============================================================
const foundPersons = [
  {
    id: 'FP-2026-000087',
    facilityName: 'District Relief Hospital – Centre B',
    facilityType: 'hospital',
    locationFound: 'Orathanadu Road, Near Flood Zone A Exit Point',
    dateFound: '2026-09-29',
    timeFound: '06:45',
    foundBy: 'NDRF Team Alpha',
    estimatedAge: 60,
    ageRange: '55-65',
    gender: 'Male',
    nameIfKnown: 'States name is "Arun" — unverified',
    physicalDesc: 'Medium build, grey hair, wears spectacles, slight limp',
    clothingDesc: 'White kurta, brown trousers (wet, dirty)',
    language: 'Tamil',
    medicalCondition: 'Mild dehydration, old diabetic medication found in pocket',
    identificationInfo: 'No ID documents; carries insulin tablets labelled Dr. Sharma, Thanjavur',
    notes: 'Conscious but disoriented. Mentions looking for his son.',
    status: 'matched',
    matchedTo: 'RF-2026-000123',
    lat: 10.8792,
    lng: 79.0841,
    photo: null,
    createdAt: '2026-09-29T07:30:00'
  },
  {
    id: 'FP-2026-000088',
    facilityName: 'Government School Relief Camp – Papanasam',
    facilityType: 'shelter',
    locationFound: 'Papanasam Bus Stand Area',
    dateFound: '2026-09-29',
    timeFound: '09:30',
    foundBy: 'Papanasam Police Station',
    estimatedAge: 45,
    ageRange: '40-50',
    gender: 'Female',
    nameIfKnown: 'Says she is Kamala — unverified',
    physicalDesc: 'Slim, long hair, medium height',
    clothingDesc: 'Wet green saree',
    language: 'Tamil',
    medicalCondition: 'Minor cuts on feet, anxious',
    identificationInfo: 'No documents',
    notes: 'Looking for husband; says she is from Kumbakonam',
    status: 'pending',
    matchedTo: null,
    lat: 10.9430,
    lng: 79.0440,
    photo: null,
    createdAt: '2026-09-29T10:00:00'
  },
  {
    id: 'FP-2026-000089',
    facilityName: 'Thanjavur Government Medical College Hospital',
    facilityType: 'hospital',
    locationFound: 'Thanjavur Flood Zone C',
    dateFound: '2026-09-29',
    timeFound: '11:00',
    foundBy: 'Red Cross Volunteer Team 3',
    estimatedAge: 9,
    ageRange: '7-11',
    gender: 'Male',
    nameIfKnown: 'Says name is "Ravi" — unverified',
    physicalDesc: 'Small child, short hair, wearing torn blue shirt and grey shorts',
    clothingDesc: 'Torn blue shirt, grey shorts',
    language: 'Tamil',
    medicalCondition: 'Malnourished, dehydrated, scared',
    identificationInfo: 'School bag found nearby — badge reads "Ravi S." in Tamil',
    notes: 'Crying, looking for mother. Says his mother\'s name is Priya.',
    status: 'potential',
    matchedTo: 'RF-2026-000125',
    lat: 10.8505,
    lng: 79.1200,
    photo: null,
    createdAt: '2026-09-29T11:45:00'
  },
  {
    id: 'FP-2026-000090',
    facilityName: 'Nagapattinam District Relief Camp Alpha',
    facilityType: 'shelter',
    locationFound: 'Sirkazhi Outskirts',
    dateFound: '2026-09-29',
    timeFound: '15:00',
    foundBy: 'SDRF Team B',
    estimatedAge: 68,
    ageRange: '65-75',
    gender: 'Male',
    nameIfKnown: 'Says name is "Murugesan" — unverified',
    physicalDesc: 'Elderly, white beard, walks slowly, cane was lost',
    clothingDesc: 'White veshti, blue shirt (wet)',
    language: 'Tamil',
    medicalCondition: 'Chest pain — admitted to medical unit',
    identificationInfo: 'Small card in pocket: "Murugesan, Sirkazhi" — partially readable',
    notes: 'Requires urgent medical attention; cardiac history suspected',
    status: 'pending',
    matchedTo: null,
    lat: 11.2290,
    lng: 79.7350,
    photo: null,
    createdAt: '2026-09-29T15:30:00'
  },
  {
    id: 'FP-2026-000091',
    facilityName: 'Nagapattinam Government Hospital',
    facilityType: 'hospital',
    locationFound: 'Sirkazhi Town',
    dateFound: '2026-09-30',
    timeFound: '08:00',
    foundBy: 'Medical Team',
    estimatedAge: 71,
    ageRange: '65-75',
    gender: 'Male',
    nameIfKnown: 'Confirmed: Murugesan Pillai — verified by ID',
    physicalDesc: 'Elderly, white beard, heart patient',
    clothingDesc: 'Hospital gown (original: white veshti)',
    language: 'Tamil',
    medicalCondition: 'Stable — cardiac monitoring',
    identificationInfo: 'Aadhaar card found in wallet — confirms identity',
    notes: 'Reunification in progress',
    status: 'verified',
    matchedTo: 'RF-2026-000126',
    lat: 11.2385,
    lng: 79.7427,
    photo: null,
    createdAt: '2026-09-30T08:30:00'
  },
  {
    id: 'FP-2026-000092',
    facilityName: 'Srikakulam Cyclone Relief Camp',
    facilityType: 'shelter',
    locationFound: 'Palasa Town Outskirts',
    dateFound: '2026-10-02',
    timeFound: '12:00',
    foundBy: 'NDRF Team Gamma',
    estimatedAge: 35,
    ageRange: '30-45',
    gender: 'Female',
    nameIfKnown: 'Unknown',
    physicalDesc: 'Medium height, brown skin, dishevelled hair',
    clothingDesc: 'Torn red fabric (possible sari)',
    language: 'Telugu',
    medicalCondition: 'Asthma attack — treated, stable',
    identificationInfo: 'None',
    notes: 'Possible match for cyclone missing cases',
    status: 'pending',
    matchedTo: null,
    lat: 18.7700,
    lng: 84.4100,
    photo: null,
    createdAt: '2026-10-02T12:30:00'
  },
  {
    id: 'FP-2026-000093',
    facilityName: 'Government School Relief Camp – Papanasam',
    facilityType: 'shelter',
    locationFound: 'Vallam-Thanjavur Road',
    dateFound: '2026-09-29',
    timeFound: '17:00',
    foundBy: 'Fire & Rescue Team',
    estimatedAge: 53,
    ageRange: '50-60',
    gender: 'Male',
    nameIfKnown: 'Says Ibrahim — unverified',
    physicalDesc: 'Stocky, short beard, wearing glasses',
    clothingDesc: 'Blue checked shirt, wet trousers',
    language: 'Tamil',
    medicalCondition: 'Elevated blood pressure — treated',
    identificationInfo: 'Carries small notebook with name: Ibrahim, Vallam',
    notes: 'Has been asking about his family; knows family is from Vallam area',
    status: 'potential',
    matchedTo: 'RF-2026-000128',
    lat: 10.8000,
    lng: 79.0900,
    photo: null,
    createdAt: '2026-09-29T17:30:00'
  },
  {
    id: 'FP-2026-000094',
    facilityName: 'District Relief Hospital – Centre B',
    facilityType: 'hospital',
    locationFound: 'Vallam Flood Zone',
    dateFound: '2026-09-29',
    timeFound: '19:00',
    foundBy: 'NDRF Team Alpha',
    estimatedAge: 55,
    ageRange: '50-60',
    gender: 'Male',
    nameIfKnown: 'Confirmed: Ibrahim Khan',
    physicalDesc: 'Stocky, short beard, spectacles',
    clothingDesc: 'Checked shirt, trousers',
    language: 'Tamil, Urdu',
    medicalCondition: 'Stable',
    identificationInfo: 'Voter ID found in pocket confirming identity',
    notes: 'Reunited with family on 03 Oct',
    status: 'reunited',
    matchedTo: 'RF-2026-000128',
    lat: 10.7905,
    lng: 79.0841,
    photo: null,
    createdAt: '2026-09-29T19:30:00'
  }
];

// ============================================================
// SHELTERS, HOSPITALS, RELIEF CENTRES (Fictional)
// ============================================================
const facilities = [
  { id: 'FAC-001', name: 'Government Higher Secondary School, Papanasam', type: 'shelter',  lat: 10.9430, lng: 79.0440, capacity: 800, current: 642, district: 'Thanjavur' },
  { id: 'FAC-002', name: 'District Relief Hospital – Centre B',            type: 'hospital', lat: 10.8792, lng: 79.0841, capacity: 200, current: 178, district: 'Thanjavur' },
  { id: 'FAC-003', name: 'Thanjavur Govt Medical College Hospital',         type: 'hospital', lat: 10.7905, lng: 79.1600, capacity: 300, current: 241, district: 'Thanjavur' },
  { id: 'FAC-004', name: 'Pattukottai Relief Camp – Zone A',               type: 'shelter',  lat: 10.4297, lng: 79.3186, capacity: 500, current: 387, district: 'Thanjavur' },
  { id: 'FAC-005', name: 'Nagapattinam District Relief Camp Alpha',        type: 'shelter',  lat: 11.2290, lng: 79.7350, capacity: 1000, current: 834, district: 'Nagapattinam' },
  { id: 'FAC-006', name: 'Nagapattinam Government Hospital',               type: 'hospital', lat: 11.2385, lng: 79.7427, capacity: 150, current: 120, district: 'Nagapattinam' },
  { id: 'FAC-007', name: 'Kumbakonam Relief Centre',                       type: 'relief',   lat: 10.9617, lng: 79.4068, capacity: 600, current: 411, district: 'Thanjavur' },
  { id: 'FAC-008', name: 'Srikakulam Cyclone Relief Camp',                 type: 'shelter',  lat: 18.7700, lng: 84.4100, capacity: 700, current: 560, district: 'Srikakulam' }
];

// ============================================================
// POTENTIAL MATCHES QUEUE (for Authority Dashboard)
// ============================================================
const matchQueue = [
  {
    missingId:   'RF-2026-000123',
    foundId:     'FP-2026-000087',
    score:       87,
    factors: {
      name:        { score: 90, note: 'High similarity (Arun / Arun Kumar)' },
      age:         { score: 88, note: 'Reported 62, estimated 60 — within range' },
      gender:      { score: 100, note: 'Match: Male' },
      location:    { score: 85, note: '4.2 km between last seen and found location' },
      description: { score: 80, note: 'Grey hair, glasses, medium build — consistent' },
      clothing:    { score: 78, note: 'White kurta / white kurta — consistent' },
      medical:     { score: 90, note: 'Diabetic medication found on person' },
      timeline:    { score: 75, note: 'Found next morning — consistent with flood timeline' }
    },
    status: 'PENDING_VERIFICATION',
    priority: 'critical',
    createdAt: '2026-09-30T11:15:00'
  },
  {
    missingId:   'RF-2026-000125',
    foundId:     'FP-2026-000089',
    score:       82,
    factors: {
      name:        { score: 85, note: 'Ravi S. on school badge — partial match' },
      age:         { score: 88, note: 'Reported 8, estimated 9 — close' },
      gender:      { score: 100, note: 'Match: Male' },
      location:    { score: 80, note: 'Same general flood zone' },
      description: { score: 82, note: 'Short hair, blue shirt — consistent' },
      clothing:    { score: 80, note: 'Blue shirt, grey shorts/trousers' },
      medical:     { score: 60, note: 'No medical info to compare' },
      timeline:    { score: 80, note: 'Same day — consistent' }
    },
    status: 'PENDING_VERIFICATION',
    priority: 'critical',
    createdAt: '2026-09-30T12:00:00'
  },
  {
    missingId:   'RF-2026-000127',
    foundId:     'FP-2026-000092',
    score:       62,
    factors: {
      name:        { score: 0,  note: 'Found person name unknown' },
      age:         { score: 70, note: 'Reported 38, estimated 30-45 — possible' },
      gender:      { score: 100, note: 'Match: Female' },
      location:    { score: 88, note: 'Same town — Palasa area' },
      description: { score: 55, note: 'Partial description match' },
      clothing:    { score: 70, note: 'Red clothing consistent with reported red sari' },
      medical:     { score: 80, note: 'Asthma reported and confirmed' },
      timeline:    { score: 85, note: 'Consistent with cyclone timing' }
    },
    status: 'PENDING_VERIFICATION',
    priority: 'high',
    createdAt: '2026-10-02T14:00:00'
  }
];

// ============================================================
// NOTIFICATIONS (Demo)
// ============================================================
const notifications = [
  {
    id: 'N001',
    type: 'match',
    title: 'Potential match identified',
    desc: 'Case RF-2026-000123 (Arun Kumar) has a potential match — Score: 87%',
    time: '2026-09-30 11:15',
    read: false,
    icon: '🔗',
    iconBg: '#ddeaf9'
  },
  {
    id: 'N002',
    type: 'update',
    title: 'Case updated: RF-2026-000126',
    desc: 'Murugesan Pillai — status changed to VERIFIED',
    time: '2026-10-02 16:00',
    read: false,
    icon: '✅',
    iconBg: '#e8f5e9'
  },
  {
    id: 'N003',
    type: 'reunited',
    title: 'Family reunification confirmed',
    desc: 'Case RF-2026-000128 (Ibrahim Khan) — REUNITED',
    time: '2026-10-03 10:30',
    read: true,
    icon: '🤝',
    iconBg: '#e8f5e9'
  },
  {
    id: 'N004',
    type: 'new',
    title: 'New missing case registered',
    desc: 'RF-2026-000129 — Saroja Krishnan, 72F, Thanjavur',
    time: '2026-09-29 12:00',
    read: true,
    icon: '📋',
    iconBg: '#fdecea'
  },
  {
    id: 'N005',
    type: 'match',
    title: 'Potential match identified',
    desc: 'Case RF-2026-000125 (Ravi Shankar, 8M) has a potential match — Score: 82%',
    time: '2026-09-30 12:00',
    read: true,
    icon: '🔗',
    iconBg: '#ddeaf9'
  }
];

// ============================================================
// AUDIT LOG (Demo)
// ============================================================
const auditLog = [
  { time: '10:47', user: 'Officer: Meenakshi R.',  action: 'Reviewed match — RF-2026-000123 / FP-2026-000087', type: 'review' },
  { time: '10:02', user: 'AI Matching Engine',      action: 'Generated candidate match — score 87% — RF-2026-000123', type: 'ai' },
  { time: '09:55', user: 'Officer: Tamil Selvan',   action: 'Verified identity — RF-2026-000126 / Murugesan Pillai', type: 'verify' },
  { time: '09:30', user: 'System',                  action: 'Case status updated: RF-2026-000128 → REUNITED', type: 'update' },
  { time: '09:15', user: 'Officer: Meenakshi R.',   action: 'Family notification sent — RF-2026-000128', type: 'notify' },
  { time: '08:45', user: 'Shelter Staff: Pandi',    action: 'Registered found person FP-2026-000093', type: 'create' },
  { time: '08:20', user: 'System',                  action: 'New missing case: RF-2026-000129 (Saroja Krishnan)', type: 'create' },
  { time: '07:55', user: 'AI Matching Engine',      action: 'Generated candidate match — score 82% — RF-2026-000125', type: 'ai' },
  { time: '07:30', user: 'NDRF Team Alpha',         action: 'Registered found person FP-2026-000087', type: 'create' }
];

// ============================================================
// DISASTER LOCATIONS (Demo)
// ============================================================
const disasterZones = [
  { name: 'Kaveri Basin Flood Zone A', lat: 10.9102, lng: 79.0608, type: 'flood', severity: 'high' },
  { name: 'Kaveri Basin Flood Zone B', lat: 10.9617, lng: 79.4068, type: 'flood', severity: 'medium' },
  { name: 'Coastal Cyclone Zone',      lat: 18.7725, lng: 84.4065, type: 'cyclone', severity: 'high' }
];

// ============================================================
// APP STATE
// ============================================================
const AppState = {
  currentPage:      'home',
  isOffline:        false,
  isLoggedIn:       false,
  currentUser:      null,
  currentRole:      null,
  demoMode:         false,
  pendingRecords:   [],
  missingCases:     [...missingCases],
  foundPersons:     [...foundPersons],
  matchQueue:       [...matchQueue],
  notifications:    [...notifications],
  auditLog:         [...auditLog],
  facilities:       [...facilities],
  disasterZones:    [...disasterZones],
  caseIdCounter:    130,
  fpIdCounter:      95,
  verificationStep: 0,
  activeTab:        'cases',
  demoScenarioStep: 0,
  mobileMenuOpen:   false,
  modalOpen:        null,
  modalData:        null
};

// Helper: get case status label
function getStatusLabel(s) {
  const map = {
    'MISSING':             'MISSING',
    'MATCH_FOUND':         'MATCH FOUND',
    'UNDER_VERIFICATION':  'UNDER VERIFICATION',
    'VERIFIED':            'VERIFIED',
    'FAMILY_NOTIFIED':     'FAMILY NOTIFIED',
    'REUNITED':            'REUNITED',
    'found':               'FOUND',
    'matched':             'MATCHED',
    'pending':             'PENDING',
    'potential':           'POTENTIAL MATCH',
    'reunited':            'REUNITED',
    'verified':            'VERIFIED',
    'rejected':            'REJECTED'
  };
  return map[s] || s;
}
function getStatusClass(s) {
  const map = {
    'MISSING':             'status-missing',
    'MATCH_FOUND':         'status-match-found',
    'UNDER_VERIFICATION':  'status-under-verification',
    'VERIFIED':            'status-verified',
    'FAMILY_NOTIFIED':     'status-notified',
    'REUNITED':            'status-reunited',
    'found':               'status-found',
    'matched':             'status-match-found',
    'pending':             'status-missing',
    'potential':           'status-match-found',
    'reunited':            'status-reunited',
    'verified':            'status-verified',
    'rejected':            'status-rejected'
  };
  return map[s] || 'status-missing';
}
function getPriorityLabel(p) {
  const map = { critical:'🔴 Critical', high:'🟠 High', medium:'🟡 Medium', normal:'🟢 Normal' };
  return map[p] || p;
}
function getPriorityClass(p) {
  const map = { critical:'priority-critical', high:'priority-high', medium:'priority-medium', normal:'priority-normal' };
  return map[p] || 'priority-normal';
}
function generateCaseId() {
  return `RF-2026-${String(AppState.caseIdCounter++).padStart(6,'0')}`;
}
function generateFPId() {
  return `FP-2026-${String(AppState.fpIdCounter++).padStart(6,'0')}`;
}
function formatDate(iso) {
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function formatDateTime(iso) {
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ============================================================
// API INTEGRATION (Live Render DB)
// ============================================================
const API_BASE_URL = '/api'; // Relative path since frontend and backend share same host on Render

async function loadLiveDatabase() {
  try {
    const missingRes = await fetch(API_BASE_URL + '/missing');
    const foundRes = await fetch(API_BASE_URL + '/found');
    const matchesRes = await fetch(API_BASE_URL + '/matches');
    
    if (missingRes.ok && foundRes.ok && matchesRes.ok) {
      const liveMissing = await missingRes.json();
      const liveFound = await foundRes.json();
      const liveMatches = await matchesRes.json();
      
      // Transform API snake_case keys to camelCase expected by frontend
      AppState.missingCases = liveMissing.map(c => ({
        id: c.id,
        personName: c.person_name,
        age: c.age,
        gender: c.gender,
        disasterType: c.disaster_type,
        disasterName: c.disaster_name,
        incidentDate: c.incident_date,
        district: c.district,
        state: c.state,
        lastSeenLocation: c.last_seen_loc,
        evacuationCentre: c.evacuation_ctr,
        physicalDesc: c.physical_desc,
        clothingDesc: c.clothing_desc,
        medicalInfo: c.medical_info,
        language: c.language,
        reporterName: c.reporter_name,
        reporterRelation: c.reporter_rel,
        reporterContact: c.reporter_phone,
        reporterEmail: c.reporter_email,
        status: c.status,
        priority: c.priority,
        matchId: c.match_id,
        matchScore: c.match_score,
        lat: Number(c.lat),
        lng: Number(c.lng),
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        assignedAuthority: c.assigned_auth,
        photo: c.photo_url
      }));

      AppState.foundPersons = liveFound.map(c => ({
        id: c.id,
        nameIfKnown: c.name_if_known,
        estimatedAge: c.estimated_age,
        gender: c.gender,
        locationFound: c.location_name,
        district: c.district,
        state: c.state,
        physicalDesc: c.physical_desc,
        clothingDesc: c.clothing_desc,
        medicalCondition: c.medical_cond,
        language: c.language,
        foundBy: c.reported_by,
        facilityName: c.org_name,
        status: c.status === 'PENDING_MATCH' ? 'pending' : (c.status === 'MATCHED' ? 'potential' : 'verified'),
        lat: Number(c.lat),
        lng: Number(c.lng),
        dateFound: c.created_at,
        createdAt: c.created_at
      }));
      
      // Prepare matches for authority queue
      AppState.matchQueue = liveMatches.map(m => ({
        id: m.id,
        missingId: m.missing_id,
        foundId: m.found_id,
        score: m.total_score,
        status: m.status,
        createdAt: m.created_at,
        factors: {
          name: { score: m.name_score, note: 'Name similarity' },
          age: { score: m.age_score, note: 'Age similarity' },
          gender: { score: m.gender_score, note: 'Gender match' },
          location: { score: m.location_score, note: m.distance_km + 'km distance' }
        }
      }));

      console.log('Live database loaded successfully!', AppState.missingCases.length, 'missing cases.');
    }
  } catch (err) {
    console.error('Failed to load live database. Falling back to demo data.', err);
  }
}
