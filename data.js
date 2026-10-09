/* ============================================================
   FAMILYLINK-AI — Demo Data & Application State
   All data is clearly fictional / synthetic for demonstration
   ============================================================ */

const DEMO_LABEL = '⚠ DEMO DATA — Not real persons or events';

// ============================================================
// MISSING CASES (Fictional Demo Data)
// ============================================================
const missingCases = [];
const foundPersons = [];
const matchQueue = [];
const auditLog = [];
const disasterZones = [];

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
