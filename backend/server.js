require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');
const { sendReunificationAlert } = require('./notifications');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── Serve Frontend Statically ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..')));

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── MISSING CASES ────────────────────────────────────────────────────────────

// GET all missing cases (with optional filters)
app.get('/api/missing', async (req, res) => {
  try {
    const { status, district, name } = req.query;
    let query = 'SELECT * FROM missing_cases WHERE 1=1';
    const params = [];
    if (status)   { params.push(status);   query += ` AND status = $${params.length}`; }
    if (district) { params.push(`%${district}%`); query += ` AND district ILIKE $${params.length}`; }
    if (name)     { params.push(`%${name}%`);     query += ` AND person_name ILIKE $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single missing case by ID
app.get('/api/missing/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM missing_cases WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Case not found' });
    const timeline = await pool.query(
      'SELECT * FROM case_timeline WHERE case_id = $1 AND case_type = $2 ORDER BY event_time ASC',
      [req.params.id, 'missing']
    );
    res.json({ ...rows[0], timeline: timeline.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new missing case
app.post('/api/missing', async (req, res) => {
  try {
    const d = req.body;
    const id = 'RF-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
    await pool.query(
      `INSERT INTO missing_cases
       (id, person_name, age, gender, disaster_type, disaster_name, incident_date,
        district, state, last_seen_loc, evacuation_ctr, physical_desc, clothing_desc,
        medical_info, language, reporter_name, reporter_rel, reporter_phone, reporter_email,
        status, priority, lat, lng)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'MISSING','normal',$20,$21)`,
      [id, d.personName, d.age ? parseInt(d.age) : null, d.gender || null, d.disasterType || null, d.disasterName || null, d.incidentDate || null,
       d.district || null, d.state || null, d.lastSeenLocation || null, d.evacuationCentre || null, d.physicalDesc || null, d.clothingDesc || null,
       d.medicalInfo || null, d.language || null, d.reporterName, d.reporterRelation || null, d.reporterContact, d.reporterEmail || null,
       d.lat || null, d.lng || null]
    );
    await pool.query(
      'INSERT INTO case_timeline (case_id, case_type, status, performed_by) VALUES ($1, $2, $3, $4)',
      [id, 'missing', 'MISSING', `System (${d.reporterName})`]
    );
    res.status(201).json({ id, message: 'Missing case created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update missing case status
app.patch('/api/missing/:id/status', async (req, res) => {
  try {
    const { status, performedBy } = req.body;
    await pool.query(
      'UPDATE missing_cases SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, req.params.id]
    );
    await pool.query(
      'INSERT INTO case_timeline (case_id, case_type, status, performed_by) VALUES ($1, $2, $3, $4)',
      [req.params.id, 'missing', status, performedBy || 'System']
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── FOUND PERSONS ────────────────────────────────────────────────────────────

// GET all found persons
app.get('/api/found', async (req, res) => {
  try {
    const { status, district } = req.query;
    let query = 'SELECT * FROM found_persons WHERE 1=1';
    const params = [];
    if (status)   { params.push(status);   query += ` AND status = $${params.length}`; }
    if (district) { params.push(`%${district}%`); query += ` AND district ILIKE $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single found person by ID
app.get('/api/found/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM found_persons WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create found person record
app.post('/api/found', async (req, res) => {
  try {
    const d = req.body;
    const id = 'FP-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
    await pool.query(
      `INSERT INTO found_persons
       (id, name_if_known, estimated_age, gender, location_name, district, state,
        physical_desc, clothing_desc, medical_cond, language, reported_by, org_name, lat, lng)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [id, d.nameIfKnown || 'Unknown', d.estimatedAge ? parseInt(d.estimatedAge) : null, d.gender || null, d.locationFound || null,
       d.district || null, d.state || null, d.physicalDesc || null, d.clothingDesc || null, d.medicalCondition || null,
       d.language || null, d.foundBy || null, d.facilityName || null, d.lat || null, d.lng || null]
    );
    res.status(201).json({ id, message: 'Found person record created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MATCHES ──────────────────────────────────────────────────────────────────

// GET all matches (pending)
app.get('/api/matches', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, mc.person_name, mc.age AS missing_age, mc.gender AS missing_gender,
              fp.name_if_known, fp.location_name
       FROM matches m
       JOIN missing_cases mc ON m.missing_id = mc.id
       JOIN found_persons fp  ON m.found_id   = fp.id
       WHERE m.status = 'PENDING'
       ORDER BY m.total_score DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a match record
app.post('/api/matches', async (req, res) => {
  try {
    const d = req.body;
    const { rows } = await pool.query(
      `INSERT INTO matches
       (missing_id, found_id, total_score, name_score, age_score, gender_score,
        location_score, desc_score, clothing_score, medical_score, distance_km)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [d.missingId, d.foundId, d.totalScore, d.nameScore, d.ageScore, d.genderScore,
       d.locationScore, d.descScore, d.clothingScore, d.medicalScore, d.distanceKm]
    );
    await pool.query(
      'UPDATE missing_cases SET status=$1, match_id=$2, match_score=$3, updated_at=NOW() WHERE id=$4',
      ['MATCH_FOUND', d.foundId, d.totalScore, d.missingId]
    );
    res.status(201).json({ id: rows[0].id, message: 'Match created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH confirm or reject a match
app.patch('/api/matches/:id', async (req, res) => {
  try {
    const { action, verifiedBy } = req.body; // action: 'confirm' | 'reject'
    const matchStatus = action === 'confirm' ? 'CONFIRMED' : 'REJECTED';

    const { rows } = await pool.query('SELECT * FROM matches WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Match not found' });
    const match = rows[0];

    await pool.query(
      'UPDATE matches SET status=$1, verified_by=$2, verified_at=NOW() WHERE id=$3',
      [matchStatus, verifiedBy, req.params.id]
    );

    if (action === 'confirm') {
      await pool.query('UPDATE missing_cases SET status=$1, updated_at=NOW() WHERE id=$2', ['REUNITED', match.missing_id]);
      await pool.query('UPDATE found_persons  SET status=$1, updated_at=NOW() WHERE id=$2', ['REUNITED', match.found_id]);
      await pool.query(
        'INSERT INTO case_timeline (case_id, case_type, status, performed_by) VALUES ($1,$2,$3,$4)',
        [match.missing_id, 'missing', 'REUNITED', verifiedBy]
      );
      
      // Fetch missing case info for notification
      const caseRes = await pool.query('SELECT * FROM missing_cases WHERE id=$1', [match.missing_id]);
      if (caseRes.rows.length > 0) {
        const mc = caseRes.rows[0];
        // Trigger Email, WhatsApp, and SMS asynchronously
        sendReunificationAlert({
          caseId: mc.id,
          personName: mc.person_name,
          reporterName: mc.reporter_name,
          reporterPhone: mc.reporter_phone,
          reporterEmail: mc.reporter_email
        }).catch(err => console.error('Notification error:', err));
      }
    } else {
      await pool.query('UPDATE missing_cases SET status=$1, match_id=NULL, match_score=NULL, updated_at=NOW() WHERE id=$2', ['MISSING', match.missing_id]);
      await pool.query('UPDATE found_persons  SET status=$1, updated_at=NOW() WHERE id=$2', ['PENDING_MATCH', match.found_id]);
    }

    res.json({ message: `Match ${matchStatus.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [missing, found, reunited, pending] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM missing_cases WHERE status='MISSING'"),
      pool.query("SELECT COUNT(*) FROM found_persons  WHERE status='PENDING_MATCH'"),
      pool.query("SELECT COUNT(*) FROM missing_cases WHERE status='REUNITED'"),
      pool.query("SELECT COUNT(*) FROM matches        WHERE status='PENDING'")
    ]);
    res.json({
      activeMissing: parseInt(missing.rows[0].count),
      foundPersons:  parseInt(found.rows[0].count),
      reunited:      parseInt(reunited.rows[0].count),
      pendingMatches: parseInt(pending.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`FAMILYLINK-AI API running on port ${PORT}`));
