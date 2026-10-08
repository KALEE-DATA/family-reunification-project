/* ============================================================
   FAMILYLINK-AI — AI-Assisted Matching Engine (Prototype)
   Clearly labelled prototype matching logic
   Weights are illustrative, not scientifically validated
   ============================================================ */

/**
 * PROTOTYPE MATCHING WEIGHTS
 * These are illustrative demonstration weights.
 * A production system would use validated, trained models.
 */
const MATCH_WEIGHTS = {
  name:        0.20,
  age:         0.15,
  gender:      0.05,
  location:    0.20,
  description: 0.10,
  clothing:    0.10,
  medical:     0.10,
  timeline:    0.05,
  photo:       0.05  // placeholder for future image similarity
};

/**
 * Simple string similarity using Jaccard + character overlap
 * Returns 0-100
 */
function stringSimilarity(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  if (a === b) return 100;

  // Exact word overlap
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = [...setA].filter(w => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  if (union === 0) return 0;
  const jaccard = intersection / union;

  // Character bigram overlap
  function bigrams(s) {
    const bg = new Set();
    for (let i = 0; i < s.length - 1; i++) bg.add(s.slice(i, i+2));
    return bg;
  }
  const bgA = bigrams(a), bgB = bigrams(b);
  const bgInter = [...bgA].filter(bg => bgB.has(bg)).length;
  const bgUnion = new Set([...bgA, ...bgB]).size;
  const bigramSim = bgUnion === 0 ? 0 : bgInter / bgUnion;

  return Math.round((jaccard * 0.5 + bigramSim * 0.5) * 100);
}

/**
 * Age similarity: returns 0-100 based on age difference
 */
function ageSimilarity(age1, age2) {
  if (!age1 || !age2) return 50; // partial credit for unknown
  const diff = Math.abs(age1 - age2);
  if (diff === 0) return 100;
  if (diff <= 2) return 95;
  if (diff <= 5) return 85;
  if (diff <= 8) return 70;
  if (diff <= 12) return 50;
  if (diff <= 20) return 30;
  return 0;
}

/**
 * Gender match: exact match = 100, else 0
 */
function genderMatch(g1, g2) {
  if (!g1 || !g2) return 50;
  return g1.toLowerCase() === g2.toLowerCase() ? 100 : 0;
}

/**
 * Location proximity: haversine distance -> score
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function locationScore(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lat2) return 40;
  const km = haversineKm(lat1, lng1, lat2, lng2);
  if (km <= 1)  return 100;
  if (km <= 3)  return 92;
  if (km <= 7)  return 82;
  if (km <= 15) return 68;
  if (km <= 30) return 50;
  if (km <= 50) return 30;
  return 10;
}

/**
 * Run matching between a missing case and a found person record
 * Returns detailed score breakdown
 */
function computeMatch(missing, found) {
  const nameSc     = stringSimilarity(missing.personName, found.nameIfKnown);
  const ageSc      = ageSimilarity(missing.age, found.estimatedAge);
  const genderSc   = genderMatch(missing.gender, found.gender);
  const locSc      = locationScore(missing.lat, missing.lng, found.lat, found.lng);
  const descSc     = stringSimilarity(missing.physicalDesc, found.physicalDesc);
  const clothingSc = stringSimilarity(missing.clothingDesc, found.clothingDesc);
  const medicalSc  = stringSimilarity(missing.medicalInfo, found.medicalCondition || '');
  const timelineSc = 75; // simplified: same disaster period assumed

  const weighted = (
    nameSc     * MATCH_WEIGHTS.name     +
    ageSc      * MATCH_WEIGHTS.age      +
    genderSc   * MATCH_WEIGHTS.gender   +
    locSc      * MATCH_WEIGHTS.location +
    descSc     * MATCH_WEIGHTS.description +
    clothingSc * MATCH_WEIGHTS.clothing +
    medicalSc  * MATCH_WEIGHTS.medical  +
    timelineSc * MATCH_WEIGHTS.timeline +
    50         * MATCH_WEIGHTS.photo    // placeholder
  );

  const distKm = (missing.lat && found.lat)
    ? haversineKm(missing.lat, missing.lng, found.lat, found.lng).toFixed(1)
    : '—';

  return {
    totalScore: Math.min(Math.round(weighted), 99),
    breakdown: {
      name:        { score: nameSc,     weight: MATCH_WEIGHTS.name,        label: 'Name Similarity' },
      age:         { score: ageSc,      weight: MATCH_WEIGHTS.age,         label: 'Age Similarity' },
      gender:      { score: genderSc,   weight: MATCH_WEIGHTS.gender,      label: 'Gender Match' },
      location:    { score: locSc,      weight: MATCH_WEIGHTS.location,    label: 'Location Proximity' },
      description: { score: descSc,     weight: MATCH_WEIGHTS.description, label: 'Physical Description' },
      clothing:    { score: clothingSc, weight: MATCH_WEIGHTS.clothing,    label: 'Clothing Description' },
      medical:     { score: medicalSc,  weight: MATCH_WEIGHTS.medical,     label: 'Medical Information' },
      timeline:    { score: timelineSc, weight: MATCH_WEIGHTS.timeline,    label: 'Timeline Consistency' },
      photo:       { score: 50,         weight: MATCH_WEIGHTS.photo,       label: 'Photo Similarity (Placeholder)' }
    },
    distanceKm: distKm
  };
}

/**
 * Find all candidate matches for a missing case
 * Returns array of {foundPerson, match} sorted by score desc
 */
function findCandidates(missingCase) {
  const candidates = [];
  for (const fp of AppState.foundPersons) {
    if (fp.status === 'reunited' || fp.status === 'rejected') continue;
    
    // Skip only if both genders are known and they don't match
    const fpG = fp.gender ? fp.gender.toLowerCase() : null;
    const mcG = missingCase.gender ? missingCase.gender.toLowerCase() : null;
    if (fpG && mcG && fpG !== 'unknown' && mcG !== 'unknown' && fpG !== mcG) {
      continue;
    }
    
    const match = computeMatch(missingCase, fp);
    if (match.totalScore >= 10) { // Lowered threshold for prototype testing
      candidates.push({ foundPerson: fp, match });
    }
  }
  candidates.sort((a, b) => b.match.totalScore - a.match.totalScore);
  return candidates;
}

/**
 * Compute priority score for a case
 */
function computePriority(missingCase) {
  let score = 0;
  if (missingCase.age < 12 || missingCase.age > 65) score += 30;
  if (missingCase.medicalInfo && missingCase.medicalInfo.length > 5) score += 20;
  const hoursElapsed = (new Date() - new Date(missingCase.createdAt)) / 3600000;
  if (hoursElapsed > 72) score += 25;
  else if (hoursElapsed > 24) score += 15;
  score += 10; // base

  if (score >= 55) return 'critical';
  if (score >= 40) return 'high';
  if (score >= 25) return 'medium';
  return 'normal';
}

/**
 * Render score bar (visual indicator)
 */
function renderScoreBar(score, maxWidth = 100) {
  const pct = Math.min(score, 100);
  let color = '#c8d3e0';
  if (pct >= 75) color = '#1e7e34';
  else if (pct >= 55) color = '#f39c12';
  else color = '#c0392b';
  return `<div style="height:6px;background:#e8edf3;border-radius:3px;overflow:hidden;">
    <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width .4s;"></div>
  </div>`;
}

/**
 * Score label
 */
function scoreLabel(score) {
  if (score >= 80) return { text: 'High Confidence', cls: 'match-score-high' };
  if (score >= 55) return { text: 'Moderate', cls: 'match-score-medium' };
  return { text: 'Low Confidence', cls: 'match-score-low' };
}
