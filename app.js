/* ============================================================
   FAMILYLINK-AI — Main Application
   Disaster-Affected Family Reunification System
   HACKATHON PROTOTYPE — Not an official government service
   ============================================================ */

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ============================================================
// MODAL SYSTEM
// ============================================================
function openModal(title, bodyHTML, footerHTML = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  document.getElementById('global-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('global-modal').classList.add('hidden');
}

// ============================================================
// NAVIGATION / ROUTING
// ============================================================
function navigate(page, extra = {}) {
  AppState.currentPage = page;
  AppState.mobileMenuOpen = false;
  Object.assign(AppState, extra);
  renderApp();
  window.scrollTo(0, 0);
}

// ============================================================
// TOP EMERGENCY STRIP
// ============================================================
function renderEmergencyStrip() {
  return `
  <div class="emergency-strip">
    <div class="container">
      <div class="emergency-strip-left">
        <span class="emergency-strip-badge">Emergency Portal</span>
        <span class="emergency-strip-status">
          <span class="status-dot"></span>
          System Operational
        </span>
        <span style="color:rgba(255,255,255,.5);font-size:11px;">|</span>
        <span style="color:rgba(255,255,255,.65);">For life-threatening emergencies, contact local emergency services (112)</span>
      </div>
      <div class="emergency-strip-right">
        ${AppState.isOffline ? '<span class="offline-badge">● OFFLINE</span>' : ''}
      </div>
    </div>
  </div>`;
}

// ============================================================
// NAVBAR
// ============================================================
function renderNavbar() {
  const pages = [
    { key: 'home',          label: 'Home' },
    { key: 'report-missing', label: 'Report Missing' },
    { key: 'report-found',  label: 'Report Found' },
    { key: 'search',        label: 'Find / Search' },
    { key: 'track',         label: 'Track Case' },
    { key: 'matching',      label: 'AI Matching' },
    { key: 'about',         label: 'About System' }
  ];
  const navLinks = pages.map(p => `
    <li>
      <button class="nav-link-btn ${AppState.currentPage === p.key ? 'active' : ''}"
              onclick="navigate('${p.key}')">${p.label}</button>
    </li>`).join('');

  const unread = AppState.notifications.filter(n => !n.read).length;

  return `
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <div class="nav-brand" onclick="navigate('home')" style="cursor:pointer;" role="banner">
        <div class="nav-logo-icon" aria-hidden="true" style="background:#fff; border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); overflow:hidden; border:2px solid var(--white);">
          <img src="logo.png" alt="FAMILYLINK-AI Logo" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div class="nav-brand-text">
          <div class="nav-brand-name">FAMILYLINK-AI</div>
          <div class="nav-brand-sub">Disaster • Family Reunification</div>
        </div>
      </div>
      <ul class="nav-links" role="menubar">
        ${navLinks}
      </ul>
      <div class="nav-right">
        ${AppState.isLoggedIn ? `
          <button class="btn-nav-login" onclick="navigate('notifications')" title="${unread} unread notifications">
            🔔 ${unread > 0 ? `<span style="background:#c0392b;color:#fff;border-radius:50%;padding:1px 5px;font-size:10px;">${unread}</span>` : ''}
          </button>
          <button class="btn-nav-login" onclick="logoutUser()">Logout (${AppState.currentUser?.name || 'User'})</button>
          ${AppState.currentRole === 'authority' || AppState.currentRole === 'rescue' ?
            `<button class="btn-nav-emergency" onclick="navigate('authority-dashboard')">Authority Portal</button>` : ''}
        ` : `
          <button class="btn-nav-login" onclick="navigate('login')">Login</button>
          <button class="btn-nav-emergency" onclick="navigate('login', {targetPage:'authority-dashboard'})">Authority Portal</button>
        `}
        <button class="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Open navigation menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
  ${renderMobileMenu()}`;
}

function toggleMobileMenu() {
  AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
  renderApp();
}

function renderMobileMenu() {
  const pages = [
    { key: 'home',           label: '🏠 Home' },
    { key: 'report-missing', label: '🔴 Report Missing Person' },
    { key: 'report-found',   label: '🟢 Report Found Person' },
    { key: 'search',         label: '🔍 Find / Search' },
    { key: 'track',          label: '📋 Track Case' },
    { key: 'matching',       label: '🤖 AI Matching' },
    { key: 'authority-dashboard', label: '🏛 Authority Dashboard' },
    { key: 'about',          label: 'ℹ️ About System' },
    { key: 'privacy',        label: '🔒 Privacy & Security' }
  ];
  return `
  <div class="mobile-menu ${AppState.mobileMenuOpen ? 'open' : ''}" onclick="if(event.target===this)toggleMobileMenu()">
    <div class="mobile-menu-panel">
      <button class="mobile-menu-close" onclick="toggleMobileMenu()">✕</button>
      <div style="padding:0 24px 16px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:8px;">
        <div style="font-size:18px;font-weight:800;color:#fff;">FAMILYLINK-AI</div>
        <div style="font-size:11px;color:rgba(255,255,255,.5);">Family Reunification System</div>
      </div>
      <ul class="mobile-nav-links">
        ${pages.map(p => `<li><button onclick="navigate('${p.key}')">${p.label}</button></li>`).join('')}
        ${AppState.isLoggedIn
          ? `<li><button onclick="logoutUser()" style="color:#e74c3c;">🚪 Logout</button></li>`
          : `<li><button onclick="navigate('login')">🔐 Login</button></li>`}
      </ul>
    </div>
  </div>`;
}

// ============================================================
// HOME PAGE
// ============================================================
function renderHome() {
  return `
  ${renderHero()}
  ${renderStatusBar()}
  ${renderQuickActions()}
  ${renderWorkflowPipeline()}
  ${renderStorySections()}
  ${renderDifferentiators()}
  `;
}

function renderHero() {
  return `
  <section class="hero" aria-labelledby="hero-heading">
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">
          <span>🇮🇳</span>
          Disaster Management • Family Reunification
        </div>
        <h1 id="hero-heading">Helping Families Find Their Loved Ones After Disasters</h1>
        <div class="hero-tagline" aria-label="System workflow">
          <span>Report</span><span class="arrow">→</span>
          <span>Match</span><span class="arrow">→</span>
          <span>Verify</span><span class="arrow">→</span>
          <span>Reunite</span>
        </div>
        <p class="hero-desc">
          A unified platform for reporting, AI-assisted matching, human verification and reconnecting disaster-affected individuals across shelters, hospitals, rescue teams and relief centres.
        </p>
        <div class="hero-btns">
          <button class="btn-hero-primary" onclick="navigate('report-missing')">🔴 Report Missing Person</button>
          <button class="btn-hero-secondary" onclick="navigate('report-found')">🟢 Report Found Person</button>
          <button class="btn-hero-track" onclick="navigate('track')">Track Existing Case →</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-img-card">
          <img src="hero.jpg" alt="Emergency response scene showing families, rescue workers, shelters and hospitals" />
        </div>
      </div>
    </div>
  </section>`;
}

function renderStatusBar() {
  const active = AppState.missingCases.filter(c => c.status === 'MISSING').length;
  const found = AppState.foundPersons.filter(f => f.status !== 'rejected').length;
  const reunited = AppState.missingCases.filter(c => c.status === 'REUNITED').length;
  return `
  <div class="status-bar" role="status">
    <div class="container">
      <div class="d-flex align-center gap-12">
        <span class="status-bar-label">Emergency Response Portal</span>
        <span class="status-item"><span class="status-dot"></span> <span class="status-green">System Operational</span></span>
      </div>
      <div class="status-bar-items">
        <div class="status-item">Active Missing: <strong>${active}</strong></div>
        <div class="status-item">Found Persons: <strong>${found}</strong></div>
        <div class="status-item">Reunited: <strong>${reunited}</strong></div>
        <span class="status-demo-note">⚠ All figures are demo data</span>
      </div>
    </div>
  </div>`;
}

function renderQuickActions() {
  return `
  <section class="quick-actions" aria-labelledby="quick-actions-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Quick Actions</div>
        <h2 class="section-title" id="quick-actions-heading">How Can We Help?</h2>
        <p class="section-desc">Select the appropriate service for your situation</p>
      </div>
      <div class="quick-grid">
        <div class="quick-card" onclick="navigate('report-missing')" role="button" tabindex="0" aria-label="Report a missing person">
          <div class="quick-card-icon icon-red">🔴</div>
          <h3>Report Missing Person</h3>
          <p>Report a family member who has gone missing during or after a disaster event. Our system will begin searching for potential matches immediately.</p>
          <button class="btn-card btn-red" onclick="event.stopPropagation();navigate('report-missing')">Start Report</button>
        </div>
        <div class="quick-card" onclick="navigate('report-found')" role="button" tabindex="0" aria-label="Report a found person">
          <div class="quick-card-icon icon-green">🟢</div>
          <h3>Report Found Person</h3>
          <p>Register an unidentified or found person at a shelter, hospital or relief centre. Helps match them with families searching for loved ones.</p>
          <button class="btn-card btn-green" onclick="event.stopPropagation();navigate('report-found')">Register Person</button>
        </div>
        <div class="quick-card" onclick="navigate('search')" role="button" tabindex="0" aria-label="Search for a case">
          <div class="quick-card-icon icon-blue">🔍</div>
          <h3>Find a Case</h3>
          <p>Search and track an existing case using a Case ID, name, or location. View real-time status updates for missing and found person records.</p>
          <button class="btn-card btn-blue" onclick="event.stopPropagation();navigate('search')">Search Case</button>
        </div>
        <div class="quick-card" onclick="navigate('login', {targetPage:'authority-dashboard'})" role="button" tabindex="0" aria-label="Authority login">
          <div class="quick-card-icon icon-navy">🏛</div>
          <h3>Authority Portal</h3>
          <p>Authorized organizations — rescue teams, shelters, hospitals and relief authorities — can review AI-suggested matches and verify identities.</p>
          <button class="btn-card" onclick="event.stopPropagation();navigate('login', {targetPage:'authority-dashboard'})">Authority Portal</button>
        </div>
      </div>
    </div>
  </section>`;
}

function renderWorkflowPipeline() {
  const steps = [
    { icon: '📋', label: 'Report', desc: 'Missing & found person registration' },
    { icon: '🗄', label: 'Normalize', desc: 'Data standardization' },
    { icon: '🤖', label: 'AI Match', desc: 'Candidate identification' },
    { icon: '📊', label: 'Rank', desc: 'Priority scoring' },
    { icon: '👤', label: 'Verify', desc: 'Human authorization' },
    { icon: '📱', label: 'Notify', desc: 'Family notification' },
    { icon: '🤝', label: 'Reunite', desc: 'Family reunification' }
  ];
  return `
  <section class="workflow-section" aria-labelledby="workflow-heading">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Core Workflow</div>
        <h2 class="section-title" id="workflow-heading">Report → Match → Verify → Reunite</h2>
        <p class="section-desc">A seven-stage pipeline converting fragmented disaster information into verified family reconnections</p>
      </div>
      <div class="workflow-steps" role="list">
        ${steps.map((s, i) => `
          <div class="workflow-step" role="listitem">
            <div class="workflow-icon${i < 4 ? ' active-step' : ''}">${s.icon}</div>
            <div class="workflow-step-label">${s.label}</div>
            <div style="font-size:11px;color:var(--gov-grey-text);text-align:center;">${s.desc}</div>
          </div>
          ${i < steps.length - 1 ? '<div class="workflow-connector"></div>' : ''}
        `).join('')}
      </div>
      <div class="notice-box notice-warning mt-16" role="note">
        <span class="notice-icon">⚠️</span>
        <div><strong>Important:</strong> AI systems in FAMILYLINK-AI are decision-support tools only. All identity confirmations require authorized human verification. <em>AI assists. Authorized humans verify.</em></div>
      </div>
    </div>
  </section>`;
}

function renderStorySections() {
  return `
  <section class="story-section" aria-labelledby="story-heading">
    <div class="container">
      <div class="section-header" style="padding-top:32px;">
        <div class="section-label">The Problem We Solve</div>
        <h2 class="section-title" id="story-heading">Before & After FAMILYLINK-AI</h2>
      </div>
      <div class="story-grid">
        <div class="story-card story-before">
          <h3>Before: Fragmented Information</h3>
          <ul class="story-list">
            <li>Family reports are isolated from hospital records</li>
            <li>Rescue teams have incomplete, uncoordinated data</li>
            <li>Shelters maintain separate, disconnected registers</li>
            <li>Manual search is slow and error-prone</li>
            <li>Families have no unified place to search</li>
            <li>Vulnerable persons remain unidentified longer</li>
          </ul>
        </div>
        <div class="story-arrow" aria-hidden="true">→</div>
        <div class="story-card story-with">
          <h3>With FAMILYLINK-AI: Unified Coordination</h3>
          <ul class="story-list">
            <li>One unified coordination platform</li>
            <li>AI-assisted candidate matching across all records</li>
            <li>Ranked match suggestions for authorities</li>
            <li>Location-aware proximity analysis</li>
            <li>Case tracking with real-time status updates</li>
            <li>Offline-first field reporting capability</li>
          </ul>
        </div>
        <div class="story-arrow" aria-hidden="true">→</div>
        <div class="story-card story-result">
          <h3>Result: Faster, Safer Reunification</h3>
          <ul class="story-list">
            <li>Faster information discovery</li>
            <li>Human-verified identity confirmation</li>
            <li>Better inter-agency coordination</li>
            <li>Prioritized attention for vulnerable groups</li>
            <li>Auditable verification trail</li>
            <li>Families reunited with confidence</li>
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}

function renderDifferentiators() {
  const rows = [
    ['Traditional Reporting',       'Registration only',              'Registration + AI-assisted candidate matching'],
    ['Fragmented Records',          'Multiple disconnected locations', 'Unified case coordination across all agencies'],
    ['Manual Searching',            'Time-consuming, error-prone',    'Ranked candidate suggestions in seconds'],
    ['Unverified AI Systems',       'Unsafe — AI declares identity',  'Human-in-the-loop verification always required'],
    ['Internet-dependent Systems',  'Non-functional during outages',  'Offline-first field workflow with sync'],
    ['Single-agency Focus',         'Siloed within one organization', 'Multi-agency: rescue, shelter, hospital, authority']
  ];
  return `
  <section style="padding:48px 0;background:var(--white);border-top:1px solid var(--gov-border);" aria-labelledby="diff-heading">
    <div class="container">
      <div class="section-header" style="padding-top:0;">
        <div class="section-label">Differentiation</div>
        <h2 class="section-title" id="diff-heading">How FAMILYLINK-AI Is Different</h2>
        <p class="section-desc">Compared to traditional approaches to disaster person-finding</p>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table" role="table" aria-label="Comparison with traditional approaches">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Traditional Approach</th>
              <th>FAMILYLINK-AI Approach</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td><strong>${r[0]}</strong></td>
                <td class="col-old">✗ ${r[1]}</td>
                <td class="col-new">✓ ${r[2]}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

// ============================================================
// REPORT MISSING PERSON PAGE
// ============================================================
function renderReportMissing() {
  const step = AppState.reportMissingStep || 1;
  const data = AppState.reportMissingData || {};

  if (AppState.reportMissingSuccess) {
    return renderReportSuccess('MISSING', AppState.reportMissingCaseId, 'missing');
  }

  const steps = ['Incident Info', 'Person Info', 'Reporter Info', 'Review & Submit'];
  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><span onclick="navigate('home')" style="cursor:pointer;">Home</span> <span>›</span> Report Missing Person</div>
      <h1>🔴 Report Missing Person</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Register a missing person to begin AI-assisted search and matching</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:860px;">
      <div class="notice-box notice-info">
        <span class="notice-icon">ℹ️</span>
        <div>All information will be securely stored and used only for family reunification purposes. Sensitive information is accessible only to authorized personnel.</div>
      </div>

      <div class="step-label-row">
        ${steps.map((s, i) => `<div class="step-label ${i+1 === step ? 'active' : i+1 < step ? 'completed' : ''}" style="max-width:200px;">${s}</div>`).join('')}
      </div>
      <div class="step-indicator" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="4" aria-label="Step ${step} of 4">
        ${steps.map((s, i) => `
          <div class="step-dot ${i+1 < step ? 'completed' : i+1 === step ? 'active' : ''}">${i+1 < step ? '✓' : i+1}</div>
          ${i < steps.length - 1 ? `<div class="step-line ${i+1 < step ? 'completed' : ''}"></div>` : ''}
        `).join('')}
      </div>

      ${step === 1 ? renderMissingStep1(data) : ''}
      ${step === 2 ? renderMissingStep2(data) : ''}
      ${step === 3 ? renderMissingStep3(data) : ''}
      ${step === 4 ? renderMissingStep4(data) : ''}
    </div>
  </div>`;
}

function renderMissingStep1(d) {
  return `
  <form class="form-card" onsubmit="saveMissingStep(event, 1)" novalidate>
    <div class="form-section-title">📋 Step 1: Incident Information</div>
    <div class="form-grid">
      <div class="form-group">
        <label for="rm-disaster-type">Disaster Type <span class="required">*</span></label>
        <select id="rm-disaster-type" class="form-control" required>
          <option value="">-- Select --</option>
          <option value="Flood"     ${d.disasterType==='Flood'?'selected':''}>Flood</option>
          <option value="Cyclone"   ${d.disasterType==='Cyclone'?'selected':''}>Cyclone</option>
          <option value="Earthquake"${d.disasterType==='Earthquake'?'selected':''}>Earthquake</option>
          <option value="Landslide" ${d.disasterType==='Landslide'?'selected':''}>Landslide</option>
          <option value="Fire"      ${d.disasterType==='Fire'?'selected':''}>Fire</option>
          <option value="Other"     ${d.disasterType==='Other'?'selected':''}>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="rm-disaster-name">Disaster Name / Reference</label>
        <input id="rm-disaster-name" class="form-control" type="text" placeholder="e.g. Kaveri Basin Flood 2026" value="${d.disasterName||''}"/>
      </div>
      <div class="form-group">
        <label for="rm-date">Date / Time of Separation <span class="required">*</span></label>
        <input id="rm-date" class="form-control" type="datetime-local" value="${d.incidentDate||''}" required/>
      </div>
      <div class="form-group">
        <label for="rm-state">State <span class="required">*</span></label>
        <select id="rm-state" class="form-control" required>
          <option value="">-- Select State --</option>
          ${['Tamil Nadu','Andhra Pradesh','Telangana','Kerala','Karnataka','Odisha','West Bengal','Assam','Bihar','Uttarakhand','Himachal Pradesh','Gujarat','Maharashtra','Rajasthan','Other'].map(s => `<option value="${s}" ${d.state===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="rm-district">District <span class="required">*</span></label>
        <input id="rm-district" class="form-control" type="text" placeholder="e.g. Thanjavur" value="${d.district||''}" required/>
      </div>
      <div class="form-group form-full">
        <label for="rm-location">Last Known Location (as specific as possible) <span class="required">*</span></label>
        <input id="rm-location" class="form-control" type="text" placeholder="e.g. Near River Bank Road, Old Town, Thanjavur" value="${d.lastSeenLocation||''}" required/>
      </div>
      <div class="form-group form-full">
        <label for="rm-evac">Evacuation Centre / Shelter (if known)</label>
        <input id="rm-evac" class="form-control" type="text" placeholder="e.g. Government School, Papanasam" value="${d.evacuationCentre||''}"/>
      </div>
    </div>
    <div style="margin-top:20px;display:flex;justify-content:flex-end;gap:12px;">
      <button type="submit" class="btn btn-primary btn-lg">Next: Person Information →</button>
    </div>
  </form>`;
}

function renderMissingStep2(d) {
  return `
  <form class="form-card" onsubmit="saveMissingStep(event, 2)" novalidate>
    <div class="form-section-title">👤 Step 2: Missing Person Information</div>
    <div class="form-grid">
      <div class="form-group">
        <label for="rm-name">Full Name <span class="required">*</span></label>
        <input id="rm-name" class="form-control" type="text" placeholder="Full name" value="${d.personName||''}" required/>
      </div>
      <div class="form-group">
        <label for="rm-age">Age <span class="required">*</span></label>
        <input id="rm-age" class="form-control" type="number" min="0" max="120" placeholder="Age in years" value="${d.age||''}" required/>
      </div>
      <div class="form-group">
        <label for="rm-gender">Gender <span class="required">*</span></label>
        <select id="rm-gender" class="form-control" required>
          <option value="">-- Select --</option>
          <option value="Male"   ${d.gender==='Male'?'selected':''}>Male</option>
          <option value="Female" ${d.gender==='Female'?'selected':''}>Female</option>
          <option value="Other"  ${d.gender==='Other'?'selected':''}>Other / Not Specified</option>
        </select>
      </div>
      <div class="form-group">
        <label for="rm-language">Primary Language</label>
        <input id="rm-language" class="form-control" type="text" placeholder="e.g. Tamil, Hindi, Telugu" value="${d.language||''}"/>
      </div>
      <div class="form-group form-full">
        <label for="rm-photo">Photograph (optional — helps matching)</label>
        <div class="upload-area" onclick="document.getElementById('rm-photo-file').click()">
          <div class="upload-icon">📷</div>
          <p>Click to upload a recent photograph</p>
          <p><strong>Accepted formats:</strong> JPG, PNG (max 5MB)</p>
        </div>
        <input type="file" id="rm-photo-file" accept="image/*" style="display:none;" onchange="previewPhoto(this,'rm-photo-preview')"/>
        <div id="rm-photo-preview" style="margin-top:8px;"></div>
      </div>
      <div class="form-group form-full">
        <label for="rm-physical">Physical Description <span class="required">*</span></label>
        <textarea id="rm-physical" class="form-control" rows="3" placeholder="Height, build, hair colour, skin tone, distinguishing features..." required>${d.physicalDesc||''}</textarea>
      </div>
      <div class="form-group form-full">
        <label for="rm-clothing">Clothing Description at Time of Separation</label>
        <textarea id="rm-clothing" class="form-control" rows="2" placeholder="Colour and type of clothing last seen wearing">${d.clothingDesc||''}</textarea>
      </div>
      <div class="form-group form-full">
        <label for="rm-medical">Medical Information / Identifying Details</label>
        <textarea id="rm-medical" class="form-control" rows="2" placeholder="Known medical conditions, medications, birthmarks, scars, other identifying information">${d.medicalInfo||''}</textarea>
        <span class="form-hint">This information will only be shared with authorized medical and relief personnel</span>
      </div>
      <div class="form-group">
        <label for="rm-phone">Phone Number (if known / available)</label>
        <input id="rm-phone" class="form-control" type="tel" placeholder="Last known mobile number" value="${d.phone||''}"/>
      </div>
    </div>
    <div style="margin-top:20px;display:flex;justify-content:space-between;gap:12px;">
      <button type="button" class="btn btn-secondary" onclick="AppState.reportMissingStep=1;renderApp()">← Back</button>
      <button type="submit" class="btn btn-primary btn-lg">Next: Reporter Information →</button>
    </div>
  </form>`;
}

function renderMissingStep3(d) {
  return `
  <form class="form-card" onsubmit="saveMissingStep(event, 3)" novalidate>
    <div class="form-section-title">📞 Step 3: Reporter / Contact Information</div>
    <div class="notice-box notice-info">
      <span class="notice-icon">ℹ️</span>
      <div>This information will be used to notify you of any updates on the case. It will not be published publicly.</div>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label for="rm-rep-name">Your Full Name <span class="required">*</span></label>
        <input id="rm-rep-name" class="form-control" type="text" placeholder="Your name" value="${d.reporterName||''}" required/>
      </div>
      <div class="form-group">
        <label for="rm-rep-rel">Relationship to Missing Person <span class="required">*</span></label>
        <select id="rm-rep-rel" class="form-control" required>
          <option value="">-- Select --</option>
          ${['Son','Daughter','Spouse','Parent','Sibling','Relative','Friend','Neighbour','Rescue Worker','Other'].map(r => `<option value="${r}" ${d.reporterRelation===r?'selected':''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="rm-rep-phone">Contact Phone Number <span class="required">*</span></label>
        <input id="rm-rep-phone" class="form-control" type="tel" placeholder="Your mobile number" value="${d.reporterContact||''}" required/>
      </div>
      <div class="form-group">
        <label for="rm-rep-email">Email Address (optional)</label>
        <input id="rm-rep-email" class="form-control" type="email" placeholder="Your email address" value="${d.reporterEmail||''}"/>
      </div>
      <div class="form-group form-full">
        <label for="rm-rep-comm">Preferred Contact Method</label>
        <select id="rm-rep-comm" class="form-control">
          <option value="phone">Phone Call</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
    </div>
    <div style="margin-top:20px;display:flex;justify-content:space-between;gap:12px;">
      <button type="button" class="btn btn-secondary" onclick="AppState.reportMissingStep=2;renderApp()">← Back</button>
      <button type="submit" class="btn btn-primary btn-lg">Next: Review & Submit →</button>
    </div>
  </form>`;
}

function renderMissingStep4(d) {
  return `
  <div class="form-card">
    <div class="form-section-title">✅ Step 4: Review & Submit</div>
    <div class="notice-box notice-warning">
      <span class="notice-icon">⚠️</span>
      <div><strong>Privacy Notice:</strong> Information submitted here will be stored securely and used exclusively for family reunification purposes. Sensitive details (medical, identification) are accessible only to authorized personnel. By submitting, you confirm that the information provided is accurate to the best of your knowledge.</div>
    </div>
    <div class="grid-2">
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Incident Details</h4>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          ${[
            ['Disaster Type', d.disasterType],
            ['District / State', `${d.district}, ${d.state}`],
            ['Last Known Location', d.lastSeenLocation]
          ].map(([k,v]) => `<tr><td style="padding:5px 0;color:var(--gov-grey-text);width:40%;">${k}</td><td style="padding:5px 0;font-weight:500;">${v||'—'}</td></tr>`).join('')}
        </table>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Missing Person</h4>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          ${[
            ['Name', d.personName],
            ['Age', d.age ? `${d.age} years` : '—'],
            ['Gender', d.gender],
            ['Language', d.language]
          ].map(([k,v]) => `<tr><td style="padding:5px 0;color:var(--gov-grey-text);width:40%;">${k}</td><td style="padding:5px 0;font-weight:500;">${v||'—'}</td></tr>`).join('')}
        </table>
      </div>
    </div>
    <div style="margin-top:16px;">
      <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">Physical & Description</h4>
      <p style="font-size:13.5px;color:var(--gov-text-light);">${d.physicalDesc || '—'}</p>
    </div>
    <hr style="border:none;border-top:1px solid var(--gov-border);margin:20px 0;"/>
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <button class="btn btn-secondary" onclick="AppState.reportMissingStep=3;renderApp()">← Back</button>
      <button class="btn btn-danger btn-lg" onclick="submitMissingReport()">🔴 Submit Missing Person Report</button>
    </div>
  </div>`;
}

function saveMissingStep(e, step) {
  e.preventDefault();
  const data = AppState.reportMissingData || {};

  if (step === 1) {
    data.disasterType     = document.getElementById('rm-disaster-type')?.value;
    data.disasterName     = document.getElementById('rm-disaster-name')?.value;
    data.incidentDate     = document.getElementById('rm-date')?.value;
    data.state            = document.getElementById('rm-state')?.value;
    data.district         = document.getElementById('rm-district')?.value;
    data.lastSeenLocation = document.getElementById('rm-location')?.value;
    data.evacuationCentre = document.getElementById('rm-evac')?.value;
    if (!data.disasterType || !data.state || !data.district || !data.lastSeenLocation) {
      showToast('Please fill in all required fields', 'error'); return;
    }
  } else if (step === 2) {
    data.personName  = document.getElementById('rm-name')?.value;
    data.age         = parseInt(document.getElementById('rm-age')?.value);
    data.gender      = document.getElementById('rm-gender')?.value;
    data.language    = document.getElementById('rm-language')?.value;
    data.physicalDesc= document.getElementById('rm-physical')?.value;
    data.clothingDesc= document.getElementById('rm-clothing')?.value;
    data.medicalInfo = document.getElementById('rm-medical')?.value;
    data.phone       = document.getElementById('rm-phone')?.value;
    if (!data.personName || !data.age || !data.gender || !data.physicalDesc) {
      showToast('Please fill in all required fields', 'error'); return;
    }
  } else if (step === 3) {
    data.reporterName     = document.getElementById('rm-rep-name')?.value;
    data.reporterRelation = document.getElementById('rm-rep-rel')?.value;
    data.reporterContact  = document.getElementById('rm-rep-phone')?.value;
    data.reporterEmail    = document.getElementById('rm-rep-email')?.value;
    if (!data.reporterName || !data.reporterRelation || !data.reporterContact) {
      showToast('Please fill in all required fields', 'error'); return;
    }
  }

  AppState.reportMissingData = data;
  AppState.reportMissingStep = step + 1;
  renderApp();
  window.scrollTo(0, 0);
}

async function submitMissingReport() {
  const data = AppState.reportMissingData || {};
  showToast('Connecting to database...', 'info');
  
  try {
    const res = await fetch('/api/missing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Server error');
    
    const caseId = result.id;
    
    // Create local object for matching
    const newCase = { ...data, id: caseId, gender: data.gender || 'Unknown', status: 'MISSING', priority: 'high', lat: 10.7905, lng: 79.1600 };
    
    // Run matching on frontend
    const candidates = typeof findCandidates === 'function' ? findCandidates(newCase) : [];
    if (candidates.length > 0 && candidates[0].match.totalScore >= 60) {
      // POST match to backend
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingId: caseId,
          foundId: candidates[0].foundPerson.id,
          totalScore: candidates[0].match.totalScore,
          nameScore: candidates[0].match.breakdown.name.score,
          ageScore: candidates[0].match.breakdown.age.score,
          genderScore: candidates[0].match.breakdown.gender.score,
          locationScore: candidates[0].match.breakdown.location.score,
          descScore: candidates[0].match.breakdown.description.score,
          clothingScore: candidates[0].match.breakdown.clothing.score,
          medicalScore: candidates[0].match.breakdown.medical.score,
          distanceKm: candidates[0].match.distanceKm === '—' ? null : candidates[0].match.distanceKm
        })
      });
    }

    // Refresh live database and render
    if (typeof loadLiveDatabase === 'function') await loadLiveDatabase();
    
    AppState.reportMissingCaseId = caseId;
    AppState.reportMissingSuccess = true;
    AppState.notifications.unshift({
      id: `N${Date.now()}`, type: 'new',
      title: 'Missing person report registered',
      desc: `Case ${caseId} — ${data.personName}`,
      time: new Date().toLocaleString('en-IN'), read: false, icon: '📋', iconBg: '#fdecea'
    });
    renderApp();
    showToast('Missing person report saved permanently!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Database connection error', 'error');
  }
}

function renderReportSuccess(type, caseId, kind) {
  const isMatch = AppState.missingCases.find(c => c.id === caseId)?.status === 'MATCH_FOUND';
  return `
  <div class="page-hero">
    <div class="container">
      <h1>${type === 'MISSING' ? '🔴' : '🟢'} Report Submitted Successfully</h1>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:700px;">
      <div class="case-success-card">
        <div style="font-size:48px;margin-bottom:12px;">✅</div>
        <h2 style="font-size:22px;font-weight:800;color:var(--gov-navy);margin-bottom:6px;">
          ${type === 'MISSING' ? 'Missing Person Report Registered' : 'Found Person Record Created'}
        </h2>
        <p style="color:var(--gov-text-light);margin-bottom:16px;">Your report has been securely registered in the system</p>
        <div style="font-size:13px;color:var(--gov-grey-text);margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em;">Your Case Reference Number</div>
        <div class="case-id-display">${caseId}</div>
        <div style="margin:16px 0;">
          <span class="status-badge ${isMatch ? 'status-match-found' : 'status-missing'}">
            ${isMatch ? '🔗 POTENTIAL MATCH FOUND' : `${type} – SEARCH IN PROGRESS`}
          </span>
        </div>
        ${isMatch ? `
          <div class="notice-box notice-success" style="text-align:left;margin-top:16px;">
            <span class="notice-icon">🔗</span>
            <div><strong>Potential match identified by AI:</strong> The system has found a candidate match. An authorized officer will review and verify. You will be notified of the outcome. <em>Note: AI recommendations require human verification before confirmation.</em></div>
          </div>
        ` : ''}
        <p style="font-size:13px;color:var(--gov-text-light);margin:16px 0;">Save your case reference number. You can use it to track your case status at any time.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
          <button class="btn btn-primary" onclick="navigate('track',{trackId:'${caseId}',trackResult:null})">📋 Track This Case</button>
          <button class="btn btn-secondary" onclick="${type === 'MISSING' ? 'resetMissingForm()' : 'resetFoundForm()'}">Submit Another Report</button>
          <button class="btn btn-secondary" onclick="navigate('home')">Return to Home</button>
        </div>
      </div>
    </div>
  </div>`;
}

function resetMissingForm() {
  AppState.reportMissingStep = 1;
  AppState.reportMissingData = {};
  AppState.reportMissingSuccess = false;
  AppState.reportMissingCaseId = null;
  renderApp();
}

function resetFoundForm() {
  AppState.reportFoundSuccess = false;
  AppState.reportFoundId = null;
  renderApp();
}

function previewPhoto(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" style="max-height:120px;border-radius:4px;border:1px solid var(--gov-border);"/>
        <span style="font-size:12px;color:var(--gov-text-light);margin-left:8px;">Photo selected ✓</span>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ============================================================
// REPORT FOUND PERSON PAGE
// ============================================================
function renderReportFound() {
  if (AppState.reportFoundSuccess) {
    return renderReportSuccess('FOUND', AppState.reportFoundId, 'found');
  }
  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><span onclick="navigate('home')" style="cursor:pointer;">Home</span> <span>›</span> Report Found Person</div>
      <h1>🟢 Report Found Person</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Register an unidentified or found person at your facility</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:860px;">
      <div class="notice-box notice-warning">
        <span class="notice-icon">⚠️</span>
        <div>This form is intended for authorized personnel at shelters, hospitals and relief centres. Information entered will be used only for family reunification purposes.</div>
      </div>
      <form class="form-card" onsubmit="submitFoundReport(event)" novalidate>
        <div class="form-section-title">📍 Location & Discovery Information</div>
        <div class="form-grid">
          <div class="form-group form-full">
            <label for="rf-location">Location Where Person Was Found <span class="required">*</span></label>
            <input id="rf-location" class="form-control" type="text" placeholder="Specific location where person was discovered" required/>
          </div>
          <div class="form-group">
            <label for="rf-date">Date Found <span class="required">*</span></label>
            <input id="rf-date" class="form-control" type="date" required/>
          </div>
          <div class="form-group">
            <label for="rf-time">Time Found</label>
            <input id="rf-time" class="form-control" type="time"/>
          </div>
          <div class="form-group">
            <label for="rf-foundby">Found By (Team / Authority) <span class="required">*</span></label>
            <input id="rf-foundby" class="form-control" type="text" placeholder="e.g. NDRF Team Alpha, Police Station" required/>
          </div>
          <div class="form-group">
            <label for="rf-facility-type">Current Facility Type <span class="required">*</span></label>
            <select id="rf-facility-type" class="form-control" required>
              <option value="">-- Select --</option>
              <option value="hospital">Hospital</option>
              <option value="shelter">Shelter / Relief Camp</option>
              <option value="relief">Relief Distribution Centre</option>
              <option value="police">Police Station</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group form-full">
            <label for="rf-facility-name">Facility Name <span class="required">*</span></label>
            <input id="rf-facility-name" class="form-control" type="text" placeholder="Full name of facility" required/>
          </div>
        </div>

        <div class="form-section-title" style="margin-top:24px;">👤 Found Person Description</div>
        <div class="form-grid">
          <div class="form-group">
            <label for="rf-name">Name (if known or stated)</label>
            <input id="rf-name" class="form-control" type="text" placeholder="Leave blank if unknown"/>
            <span class="form-hint">Add note "(unverified)" if stated by person but not confirmed by documents</span>
          </div>
          <div class="form-group">
            <label for="rf-gender">Gender <span class="required">*</span></label>
            <select id="rf-gender" class="form-control" required>
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Not Determined</option>
            </select>
          </div>
          <div class="form-group">
            <label for="rf-age-est">Estimated Age</label>
            <input id="rf-age-est" class="form-control" type="number" min="0" max="120" placeholder="Estimated age in years"/>
          </div>
          <div class="form-group">
            <label for="rf-language">Language(s) Spoken</label>
            <input id="rf-language" class="form-control" type="text" placeholder="e.g. Tamil, Telugu"/>
          </div>
          <div class="form-group form-full">
            <label for="rf-photo">Photograph of Found Person</label>
            <div class="upload-area" onclick="document.getElementById('rf-photo-file').click()">
              <div class="upload-icon">📷</div>
              <p>Upload a photograph to assist AI-based visual matching</p>
              <p><strong>Important:</strong> Photograph will only be shared with authorized personnel for verification</p>
            </div>
            <input type="file" id="rf-photo-file" accept="image/*" style="display:none;" onchange="previewPhoto(this,'rf-photo-preview')"/>
            <div id="rf-photo-preview" style="margin-top:8px;"></div>
          </div>
          <div class="form-group form-full">
            <label for="rf-physical">Physical Description <span class="required">*</span></label>
            <textarea id="rf-physical" class="form-control" rows="3" placeholder="Height, build, hair, distinguishing features..." required></textarea>
          </div>
          <div class="form-group form-full">
            <label for="rf-clothing">Clothing Description</label>
            <textarea id="rf-clothing" class="form-control" rows="2" placeholder="Colour and type of clothing at time found"></textarea>
          </div>
          <div class="form-group form-full">
            <label for="rf-medical">Medical Condition / Needs</label>
            <textarea id="rf-medical" class="form-control" rows="2" placeholder="Current medical condition, injuries, medications, urgency level"></textarea>
          </div>
          <div class="form-group form-full">
            <label for="rf-id-info">Identification Information</label>
            <textarea id="rf-id-info" class="form-control" rows="2" placeholder="Any ID documents, cards, or partial information found"></textarea>
            <span class="form-hint">Do not enter complete ID numbers in this field. Document securely through official channels.</span>
          </div>
          <div class="form-group form-full">
            <label for="rf-notes">Additional Notes</label>
            <textarea id="rf-notes" class="form-control" rows="3" placeholder="Any other relevant information — statements, observed behaviour, etc."></textarea>
          </div>
        </div>
        <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px;">
          <button type="button" class="btn btn-secondary" onclick="navigate('home')">Cancel</button>
          <button type="submit" class="btn btn-success btn-lg">🟢 Register Found Person Record</button>
        </div>
      </form>
    </div>
  </div>`;
}

async function submitFoundReport(e) {
  e.preventDefault();
  const location  = document.getElementById('rf-location')?.value;
  const foundBy   = document.getElementById('rf-foundby')?.value;
  const gender    = document.getElementById('rf-gender')?.value;
  const physical  = document.getElementById('rf-physical')?.value;
  const facility  = document.getElementById('rf-facility-name')?.value;
  if (!location || !foundBy || !gender || !physical || !facility) {
    showToast('Please fill in all required fields', 'error'); return;
  }
  
  showToast('Saving to live database...', 'info');
  const now  = new Date().toISOString();
  const payload = {
    facilityName: facility,
    facilityType: document.getElementById('rf-facility-type')?.value,
    locationFound: location,
    dateFound: document.getElementById('rf-date')?.value,
    timeFound: document.getElementById('rf-time')?.value,
    foundBy: foundBy,
    estimatedAge: parseInt(document.getElementById('rf-age-est')?.value) || null,
    gender: gender,
    nameIfKnown: document.getElementById('rf-name')?.value || 'Unknown',
    physicalDesc: physical,
    clothingDesc: document.getElementById('rf-clothing')?.value,
    language: document.getElementById('rf-language')?.value,
    medicalCondition: document.getElementById('rf-medical')?.value,
    identificationInfo: document.getElementById('rf-id-info')?.value,
    notes: document.getElementById('rf-notes')?.value,
    status: 'pending',
    lat: 10.8500,
    lng: 79.0800
  };

  try {
    const res = await fetch('/api/found', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Server error');
    
    const fpId = result.id;
    
    // Refresh live database and render
    if (typeof loadLiveDatabase === 'function') await loadLiveDatabase();
    
    AppState.reportFoundId = fpId;
    AppState.reportFoundSuccess = true;
    renderApp();
    showToast('Found person record registered permanently!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Database error', 'error');
  }
}

// ============================================================
// SEARCH / FIND PAGE
// ============================================================
function renderSearch() {
  const results = AppState.searchResults || null;
  const query   = AppState.searchQuery || '';
  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><span onclick="navigate('home')" style="cursor:pointer;">Home</span> <span>›</span> Find / Search</div>
      <h1>🔍 Search Cases</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Search for missing persons, found persons, or track a case by ID</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container">
      <div class="form-card" style="max-width:700px;margin:0 auto 28px;">
        <div class="form-section-title">Search Database</div>
        <div class="form-group">
          <label for="search-input">Search by Case ID, Name, Location, or Status</label>
          <div class="search-bar">
            <input id="search-input" type="text" placeholder="e.g. RF-2026-000123, Arun Kumar, Thanjavur..." value="${query}"
              onkeydown="if(event.key==='Enter')performSearch()" aria-label="Search input"/>
            <button onclick="performSearch()" aria-label="Search">🔍 Search</button>
          </div>
        </div>
        <div class="form-grid form-grid-3" style="margin-top:14px;">
          <div class="form-group">
            <label for="search-filter-type">Filter by Type</label>
            <select id="search-filter-type" class="form-control">
              <option value="">All Types</option>
              <option value="missing">Missing Cases</option>
              <option value="found">Found Persons</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-filter-status">Filter by Status</label>
            <select id="search-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="MISSING">Missing</option>
              <option value="MATCH_FOUND">Match Found</option>
              <option value="VERIFIED">Verified</option>
              <option value="REUNITED">Reunited</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-filter-state">State</label>
            <select id="search-filter-state" class="form-control">
              <option value="">All States</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>
          </div>
        </div>
        <div style="margin-top:14px;display:flex;gap:10px;">
          <button class="btn btn-primary" onclick="performSearch()">Search</button>
          <button class="btn btn-secondary" onclick="clearSearch()">Clear</button>
        </div>
      </div>

      ${results !== null ? renderSearchResults(results) : `
        <div class="notice-box notice-info" style="max-width:700px;margin:0 auto;">
          <span class="notice-icon">ℹ️</span>
          <div>Enter a name, case ID, or location to search the database. For privacy, only non-sensitive information is displayed in public search results. Authorized personnel can view full details after login.</div>
        </div>
        <div style="max-width:700px;margin:20px auto 0;">
          <h3 style="font-size:15px;font-weight:700;color:var(--gov-navy);margin-bottom:14px;">Quick Access — Demo Cases</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${AppState.missingCases.slice(0,5).map(c => `
              <div class="d-flex align-center gap-16" style="background:var(--white);border:1px solid var(--gov-border);border-radius:var(--radius-sm);padding:12px 16px;cursor:pointer;"
                onclick="navigate('track',{trackId:'${c.id}',trackResult:null})">
                <span class="font-mono" style="font-size:12px;color:var(--gov-blue);font-weight:700;">${c.id}</span>
                <span style="flex:1;font-weight:600;font-size:13.5px;">${c.personName}</span>
                <span class="text-sm color-muted">${c.age}y, ${c.gender}</span>
                <span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span>
              </div>`).join('')}
          </div>
        </div>
      `}
    </div>
  </div>`;
}

function performSearch() {
  const q    = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const type = document.getElementById('search-filter-type')?.value;
  const status = document.getElementById('search-filter-status')?.value;
  AppState.searchQuery = q;

  let missingResults = AppState.missingCases.filter(c => {
    const matchQ = !q || c.id.toLowerCase().includes(q) || c.personName.toLowerCase().includes(q) ||
      (c.district && c.district.toLowerCase().includes(q)) || (c.state && c.state.toLowerCase().includes(q));
    const matchStatus = !status || c.status === status;
    return matchQ && matchStatus && (!type || type === 'missing');
  });
  let foundResults = type === 'missing' ? [] : AppState.foundPersons.filter(f => {
    const matchQ = !q || f.id.toLowerCase().includes(q) ||
      (f.nameIfKnown && f.nameIfKnown.toLowerCase().includes(q)) ||
      (f.facilityName && f.facilityName.toLowerCase().includes(q));
    return matchQ;
  });

  AppState.searchResults = { missing: missingResults, found: foundResults };
  renderApp();
}

function clearSearch() {
  AppState.searchQuery   = '';
  AppState.searchResults = null;
  renderApp();
}

function renderSearchResults(results) {
  const total = results.missing.length + results.found.length;
  return `
  <div style="max-width:900px;margin:0 auto;">
    <div class="d-flex align-center gap-12 mb-16">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">Search Results</h3>
      <span class="tag">${total} result${total!==1?'s':''} found</span>
    </div>
    ${results.missing.length === 0 && results.found.length === 0 ? `
      <div class="notice-box notice-warning">
        <span class="notice-icon">⚠️</span>
        <div>No records found matching your search. Try a different name, Case ID, or location. If you believe there is an error, contact the support helpline.</div>
      </div>` : ''}
    ${results.missing.length > 0 ? `
      <h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gov-red);margin-bottom:10px;">Missing Person Cases (${results.missing.length})</h4>
      <div class="gov-table-wrap mb-24">
        <table class="gov-table">
          <thead><tr><th>Case ID</th><th>Name</th><th>Age/Gender</th><th>Last Known Location</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${results.missing.map(c => `
              <tr>
                <td class="case-id-cell">${c.id}</td>
                <td><strong>${c.personName}</strong></td>
                <td>${c.age}y, ${c.gender}</td>
                <td style="font-size:12px;">${c.lastSeenLocation || '—'}</td>
                <td><span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span></td>
                <td><button class="btn btn-secondary btn-sm" onclick="navigate('track',{trackId:'${c.id}',trackResult:null})">View Case</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : ''}
    ${results.found.length > 0 ? `
      <h4 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gov-green);margin-bottom:10px;">Found Person Records (${results.found.length})</h4>
      <div class="gov-table-wrap">
        <table class="gov-table">
          <thead><tr><th>Record ID</th><th>Name (if known)</th><th>Gender</th><th>Found At</th><th>Status</th></tr></thead>
          <tbody>
            ${results.found.map(f => `
              <tr>
                <td class="case-id-cell">${f.id}</td>
                <td>${f.nameIfKnown || 'Unknown'}</td>
                <td>${f.gender}</td>
                <td style="font-size:12px;">${f.facilityName}</td>
                <td><span class="status-badge ${getStatusClass(f.status)}">${getStatusLabel(f.status)}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : ''}
  </div>`;
}

// ============================================================
// TRACK CASE PAGE
// ============================================================
function renderTrackCase() {
  const trackResult = AppState.trackResult;
  const trackId     = AppState.trackId || '';
  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><span onclick="navigate('home')" style="cursor:pointer;">Home</span> <span>›</span> Track Case</div>
      <h1>📋 Track Case Status</h1>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:800px;">
      <div class="form-card">
        <div class="form-section-title">Enter Case Reference Number</div>
        <div class="search-bar">
          <input id="track-input" type="text" placeholder="e.g. RF-2026-000123"
            value="${trackId}" onkeydown="if(event.key==='Enter')trackCase()" aria-label="Case ID input"/>
          <button onclick="trackCase()">🔍 Track Case</button>
        </div>
        <div style="margin-top:10px;font-size:13px;color:var(--gov-grey-text);">
          Quick access:
          ${AppState.missingCases.slice(0,3).map(c => `<button onclick="AppState.trackId='${c.id}';trackCase()" style="background:none;border:none;color:var(--gov-blue);cursor:pointer;font-size:13px;text-decoration:underline;margin-left:8px;">${c.id}</button>`).join('')}
        </div>
      </div>
      ${trackResult === null ? `
        <div class="notice-box notice-warning">
          <span class="notice-icon">⚠️</span>
          <div>Case ID not found. Please check the reference number and try again. If you believe this is an error, contact support.</div>
        </div>` : ''}
      ${trackResult ? renderCaseDetail(trackResult) : ''}
    </div>
  </div>`;
}

function trackCase() {
  const id = (document.getElementById('track-input')?.value || AppState.trackId || '').trim().toUpperCase();
  AppState.trackId = id;
  const found = AppState.missingCases.find(c => c.id === id);
  AppState.trackResult = found || null;
  renderApp();
}

function renderCaseDetail(c) {
  const statusOrder = ['MISSING','MATCH_FOUND','UNDER_VERIFICATION','VERIFIED','FAMILY_NOTIFIED','REUNITED'];
  const currentIdx  = statusOrder.indexOf(c.status);

  return `
  <div class="form-card">
    <div class="d-flex align-center" style="justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--gov-grey-text);margin-bottom:4px;">Case Reference</div>
        <div class="font-mono" style="font-size:20px;font-weight:800;color:var(--gov-navy);">${c.id}</div>
      </div>
      <div style="text-align:right;">
        <span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span>
        <div style="font-size:12px;color:var(--gov-grey-text);margin-top:4px;">Last updated: ${formatDateTime(c.updatedAt)}</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:20px;">
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Person Details</h4>
        <table style="width:100%;font-size:13.5px;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);width:40%;">Name</td><td style="padding:5px 0;font-weight:600;">${c.personName}</td></tr>
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Age / Gender</td><td style="padding:5px 0;">${c.age} yrs, ${c.gender}</td></tr>
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Disaster</td><td style="padding:5px 0;">${c.disasterType} — ${c.disasterName||'—'}</td></tr>
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Last Seen</td><td style="padding:5px 0;font-size:12px;">${c.lastSeenLocation}</td></tr>
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Priority</td><td style="padding:5px 0;"><span class="status-badge ${getPriorityClass(c.priority)}">${getPriorityLabel(c.priority)}</span></td></tr>
        </table>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Assignment</h4>
        <table style="width:100%;font-size:13.5px;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);width:40%;">Authority</td><td style="padding:5px 0;font-size:12px;">${c.assignedAuthority}</td></tr>
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Match</td><td style="padding:5px 0;">${c.matchId ? `<span class="font-mono" style="font-size:12px;color:var(--gov-blue);">${c.matchId}</span>` : '—'}</td></tr>
          ${c.matchScore ? `<tr><td style="padding:5px 0;color:var(--gov-grey-text);">Match Score</td><td style="padding:5px 0;"><strong>${c.matchScore}%</strong> <span class="text-xs color-muted">(Illustrative)</span></td></tr>` : ''}
          <tr><td style="padding:5px 0;color:var(--gov-grey-text);">Registered</td><td style="padding:5px 0;">${formatDate(c.createdAt)}</td></tr>
        </table>
      </div>
    </div>

    <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin-bottom:14px;text-transform:uppercase;letter-spacing:.05em;">Case Status Timeline</h4>
    <div class="case-timeline" role="list" aria-label="Case status timeline">
      ${statusOrder.map((s, i) => `
        <div class="timeline-step" role="listitem">
          <div class="timeline-circle ${i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'future'}">
            ${i < currentIdx ? '✓' : i+1}
          </div>
          <div class="timeline-label ${i < currentIdx ? 'done' : i === currentIdx ? 'current' : ''}">
            ${getStatusLabel(s)}
          </div>
        </div>
        ${i < statusOrder.length-1 ? `<div class="timeline-connector ${i < currentIdx ? 'done' : ''}"></div>` : ''}
      `).join('')}
    </div>

    <h4 style="font-size:13px;font-weight:700;color:var(--gov-navy);margin:20px 0 10px;text-transform:uppercase;letter-spacing:.05em;">Activity Log</h4>
    <div class="audit-log">
      ${c.timeline.map(t => `
        <div class="audit-entry">
          <span class="audit-time">${t.time}</span>
          <span class="audit-user">${t.by}</span>
          <span class="audit-action">Status → ${getStatusLabel(t.status)}</span>
        </div>`).join('')}
    </div>

    ${c.status === 'MATCH_FOUND' || c.status === 'UNDER_VERIFICATION' ? `
      <div class="notice-box notice-info mt-16">
        <span class="notice-icon">🔗</span>
        <div>A potential match has been identified. An authorized officer is reviewing the details. <strong>Note: AI suggestions require human verification before any official confirmation.</strong> You will be notified of the outcome.</div>
      </div>` : ''}

    ${c.status === 'REUNITED' ? `
      <div class="reunite-success" style="margin-top:20px;">
        <div class="reunite-success-icon">🤝</div>
        <h2>Family Reunification Confirmed</h2>
        <p>This case has been successfully resolved. The family has been reunited.</p>
      </div>` : ''}

    <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
      ${c.matchId ? `<button class="btn btn-primary" onclick="navigate('matching',{selectedMissingId:'${c.id}'})">View AI Match Details</button>` : ''}
      <button class="btn btn-secondary" onclick="navigate('search')">Search Other Cases</button>
      <button class="btn btn-secondary" onclick="navigate('home')">Return to Home</button>
    </div>
  </div>`;
}

// ============================================================
// AI MATCHING PAGE
// ============================================================
function renderMatchingPage() {
  const selectedId = AppState.selectedMissingId;
  const selected   = selectedId ? AppState.missingCases.find(c => c.id === selectedId) : AppState.missingCases[0];

  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><span onclick="navigate('home')" style="cursor:pointer;">Home</span> <span>›</span> AI-Assisted Matching</div>
      <h1>🤖 AI-Assisted Matching Engine</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Candidate identification using prototype matching logic — human verification required</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container">
      <div class="notice-box notice-warning">
        <span class="notice-icon">⚠️</span>
        <div>
          <strong>Important — AI Safety Notice:</strong> Scores and matches shown here are generated by a prototype matching algorithm using illustrative weights. These are decision-support tools only.
          <strong> All identity confirmations must be performed by authorized human personnel.</strong>
          Do not treat any match score as a confirmed identity.
        </div>
      </div>

      <div class="grid-2">
        <div>
          <div class="form-card">
            <div class="form-section-title">📋 Select Missing Case</div>
            <select class="form-control" onchange="AppState.selectedMissingId=this.value;renderApp()" aria-label="Select missing case">
              ${AppState.missingCases.filter(c => c.status !== 'REUNITED').map(c =>
                `<option value="${c.id}" ${selected?.id===c.id?'selected':''}>${c.id} — ${c.personName} (${c.status})</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="notice-box notice-demo" style="margin:0;">
          <span class="notice-icon">🧪</span>
          <div><strong>Prototype Matching Weights</strong> (Illustrative — not validated)<br/>
            Name: 20% | Age: 15% | Location: 20% | Description: 10% | Clothing: 10% | Medical: 10% | Timeline: 5% | Photo: 5% | Gender: 5%
          </div>
        </div>
      </div>

      ${selected ? renderMissingCasePanel(selected) : ''}
      ${selected ? renderCandidateMatches(selected) : ''}
    </div>
  </div>`;
}

function renderMissingCasePanel(c) {
  return `
  <div class="form-card" style="margin-top:20px;">
    <div class="form-section-title">🔴 Missing Case — ${c.id}</div>
    <div class="d-flex gap-16 align-center">
      <div class="photo-placeholder" style="width:80px;height:80px;font-size:32px;flex-shrink:0;">👤</div>
      <div style="flex:1;">
        <div style="font-size:20px;font-weight:800;color:var(--gov-navy);">${c.personName}</div>
        <div style="color:var(--gov-text-light);margin-top:4px;">Age: ${c.age} years &nbsp;|&nbsp; Gender: ${c.gender} &nbsp;|&nbsp; Language: ${c.language||'—'}</div>
        <div style="font-size:13px;color:var(--gov-text-light);margin-top:6px;">Last Seen: ${c.lastSeenLocation}</div>
        <div style="margin-top:8px;">
          <span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span>
          <span class="status-badge ${getPriorityClass(c.priority)}" style="margin-left:6px;">${getPriorityLabel(c.priority)}</span>
        </div>
      </div>
      <div>
        <div style="font-size:12px;color:var(--gov-grey-text);margin-bottom:4px;">Physical Description</div>
        <div style="font-size:13px;max-width:280px;">${c.physicalDesc}</div>
        ${c.clothingDesc ? `<div style="font-size:12px;color:var(--gov-grey-text);margin-top:6px;">Clothing: ${c.clothingDesc}</div>` : ''}
        ${c.medicalInfo  ? `<div style="font-size:12px;color:var(--gov-grey-text);margin-top:4px;">Medical: ${c.medicalInfo}</div>` : ''}
      </div>
    </div>
  </div>`;
}

function renderCandidateMatches(missing) {
  const candidates = findCandidates(missing);
  if (candidates.length === 0) {
    return `
    <div class="notice-box notice-info" style="margin-top:12px;">
      <span class="notice-icon">ℹ️</span>
      <div>No candidate matches found above threshold (10%) for this case at this time. As more found-person records are registered, the system will continue searching.</div>
    </div>`;
  }

  return `
  <div style="margin-top:20px;">
    <div class="d-flex align-center gap-12 mb-16">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">Potential Match Candidates</h3>
      <span class="tag">${candidates.length} candidate${candidates.length!==1?'s':''}</span>
      <span class="tag" style="background:var(--gov-amber-pale);color:var(--gov-orange);border-color:var(--gov-amber);">Illustrative Scores</span>
    </div>
    ${candidates.map((c, i) => renderCandidateCard(missing, c, i+1)).join('')}
  </div>`;
}

function renderCandidateCard(missing, { foundPerson: fp, match }, rank) {
  const sl     = scoreLabel(match.totalScore);
  const topFactors = Object.entries(match.breakdown)
    .sort((a,b) => b[1].score - a[1].score)
    .slice(0, 5);

  return `
  <div class="match-candidate-card">
    <div class="match-candidate-header">
      <div>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gov-grey-text);">Potential Match #${rank}</span>
        <div style="font-size:16px;font-weight:700;color:var(--gov-navy);margin-top:4px;">${fp.nameIfKnown || 'Unidentified Person'}</div>
        <div style="font-size:13px;color:var(--gov-text-light);">Found at: <strong>${fp.facilityName}</strong></div>
        <div style="font-size:12px;color:var(--gov-text-light);">ID: <span class="font-mono">${fp.id}</span> | Distance: ~${match.distanceKm} km | Found: ${fp.dateFound}</div>
      </div>
      <div style="text-align:center;">
        <div class="match-score-circle ${sl.cls}" style="width:80px;height:80px;">
          <div class="match-score-num">${match.totalScore}%</div>
          <div class="match-score-pct">Match</div>
        </div>
        <div style="font-size:11px;font-weight:600;color:var(--gov-grey-text);">${sl.text}</div>
        <div style="font-size:10px;color:var(--gov-grey-text);margin-top:2px;">(Illustrative Score)</div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:14px;">
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gov-grey-text);margin-bottom:8px;">Match Factors</div>
        <ul class="match-factors">
          ${topFactors.map(([key, f]) => `
            <li>
              <span class="${f.score >= 70 ? 'factor-check' : f.score >= 45 ? 'factor-partial' : 'factor-cross'}">
                ${f.score >= 70 ? '✓' : f.score >= 45 ? '~' : '✗'}
              </span>
              <span><strong>${f.label}:</strong> ${f.note || Math.round(f.score)+'%'}</span>
            </li>`).join('')}
        </ul>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gov-grey-text);margin-bottom:8px;">Found Person Details</div>
        <table style="width:100%;font-size:12.5px;border-collapse:collapse;">
          <tr><td style="padding:3px 0;color:var(--gov-grey-text);">Gender</td><td>${fp.gender}</td></tr>
          <tr><td style="padding:3px 0;color:var(--gov-grey-text);">Est. Age</td><td>${fp.estimatedAge || '—'} yrs (${fp.ageRange || '—'})</td></tr>
          <tr><td style="padding:3px 0;color:var(--gov-grey-text);">Medical</td><td style="font-size:12px;">${fp.medicalCondition || '—'}</td></tr>
          <tr><td style="padding:3px 0;color:var(--gov-grey-text);">Language</td><td>${fp.language || '—'}</td></tr>
        </table>
      </div>
    </div>

    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gov-grey-text);margin-bottom:6px;">Score Breakdown</div>
      ${Object.entries(match.breakdown).map(([k, f]) => `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
          <span style="font-size:11.5px;width:140px;color:var(--gov-text-light);">${f.label}</span>
          <div style="flex:1;">${renderScoreBar(f.score)}</div>
          <span style="font-size:11.5px;font-weight:600;width:36px;text-align:right;">${Math.round(f.score)}%</span>
        </div>`).join('')}
    </div>

    <div class="notice-box notice-warning" style="margin-bottom:12px;">
      <span class="notice-icon">⚠️</span>
      <div style="font-size:12.5px;"><strong>REQUIRES HUMAN VERIFICATION</strong> — AI recommendations are decision-support only. Final identity confirmation must be performed by authorized personnel.</div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="openVerificationModal('${missing.id}','${fp.id}',${match.totalScore})">🔍 Review Match</button>
      <button class="btn btn-secondary" onclick="rejectMatch('${missing.id}','${fp.id}')">✗ Reject This Match</button>
    </div>
  </div>`;
}

// ============================================================
// HUMAN VERIFICATION MODAL
// ============================================================
function openVerificationModal(missingId, foundId, score) {
  const missing = AppState.missingCases.find(c => c.id === missingId);
  const found   = AppState.foundPersons.find(f => f.id === foundId);
  if (!missing || !found) return;

  const body = `
    <div class="notice-box notice-danger" style="margin-bottom:16px;">
      <span class="notice-icon">⚠️</span>
      <div><strong>AI recommendations are decision-support only.</strong> Final identity confirmation must be performed by authorized personnel who have reviewed all available evidence.</div>
    </div>
    <div class="match-comparison">
      <div class="match-person-card missing">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gov-red);margin-bottom:8px;">Missing Person</div>
        <div class="photo-placeholder" style="width:80px;height:80px;margin-bottom:10px;">👤</div>
        <div style="font-weight:700;font-size:16px;">${missing.personName}</div>
        <div style="font-size:13px;color:var(--gov-text-light);">Age: ${missing.age} | ${missing.gender}</div>
        <div style="font-size:12px;color:var(--gov-text-light);margin-top:6px;">${missing.physicalDesc}</div>
        <div style="font-size:12px;margin-top:4px;">Clothing: ${missing.clothingDesc||'—'}</div>
        <div style="font-size:12px;margin-top:4px;">Medical: ${missing.medicalInfo||'—'}</div>
        <div style="font-size:12px;margin-top:4px;">Last seen: ${missing.lastSeenLocation}</div>
        <div style="font-size:11px;color:var(--gov-grey-text);margin-top:6px;">Case ID: ${missing.id}</div>
      </div>
      <div class="match-vs">VS</div>
      <div class="match-person-card found">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--gov-green);margin-bottom:8px;">Found Person Record</div>
        <div class="photo-placeholder" style="width:80px;height:80px;margin-bottom:10px;">👤</div>
        <div style="font-weight:700;font-size:16px;">${found.nameIfKnown || 'Unknown'}</div>
        <div style="font-size:13px;color:var(--gov-text-light);">Est. Age: ${found.estimatedAge||'—'} | ${found.gender}</div>
        <div style="font-size:12px;color:var(--gov-text-light);margin-top:6px;">${found.physicalDesc}</div>
        <div style="font-size:12px;margin-top:4px;">Clothing: ${found.clothingDesc||'—'}</div>
        <div style="font-size:12px;margin-top:4px;">Medical: ${found.medicalCondition||'—'}</div>
        <div style="font-size:12px;margin-top:4px;">Found at: ${found.facilityName}</div>
        <div style="font-size:11px;color:var(--gov-grey-text);margin-top:6px;">Record ID: ${found.id}</div>
      </div>
    </div>
    <div class="d-flex align-center gap-12" style="margin-top:14px;padding:12px 16px;background:var(--gov-grey-bg);border-radius:var(--radius-sm);">
      <div class="match-score-circle ${scoreLabel(score).cls}" style="width:60px;height:60px;">
        <div style="font-size:18px;font-weight:800;">${score}%</div>
      </div>
      <div>
        <div style="font-weight:700;font-size:14px;">Illustrative Match Score: ${score}%</div>
        <div style="font-size:12px;color:var(--gov-text-light);">Prototype scoring — not scientifically validated</div>
      </div>
    </div>
    <div class="notice-box notice-info" style="margin-top:14px;">
      <span class="notice-icon">ℹ️</span>
      <div style="font-size:13px;">Before confirming, the authorized officer should verify: (1) Physical appearance in person or via video, (2) Any available identification documents, (3) Personal knowledge questions, (4) Family confirmation where possible.</div>
    </div>`;

  const footer = `
    <button class="btn btn-success" onclick="verifyMatch('${missingId}','${foundId}')">✅ VERIFY MATCH — Confirm Identity</button>
    <button class="btn btn-warning" onclick="requestMoreInfo('${missingId}','${foundId}')">❓ Request More Information</button>
    <button class="btn btn-danger" onclick="rejectMatchModal('${missingId}','${foundId}')">✗ REJECT MATCH</button>
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>`;

  openModal('Human Verification Required', body, footer);
}

async function verifyMatch(missingId, foundId) {
  const match = AppState.matchQueue.find(m => m.missingId === missingId && m.foundId === foundId);
  const matchId = match ? match.id : null;
  
  showToast('Verifying match on live database...', 'info');
  try {
    if (matchId) {
      const res = await fetch('/api/matches/' + matchId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', verifiedBy: AppState.currentUser?.name || 'Authorized Officer' })
      });
      if (!res.ok) throw new Error('Failed to verify match');
    } else {
      // If no match record exists but they verified manually (not possible from UI usually, but fallback)
      showToast('Could not find match ID', 'error'); return;
    }
    
    // Refresh live database and render
    if (typeof loadLiveDatabase === 'function') await loadLiveDatabase();
    
    AppState.notifications.unshift({ id: `N${Date.now()}`, type:'verify', title:'Identity verified', desc:`Case ${missingId} — Match confirmed`, time:new Date().toLocaleString('en-IN'), read:false, icon:'✅', iconBg:'#e8f5e9' });
    closeModal();
    showToast('Match verified! Family notification initiated.', 'success');
    renderApp();
  } catch (err) {
    showToast('Database error', 'error');
  }
}

function rejectMatch(missingId, foundId) {
  const fp = AppState.foundPersons.find(f => f.id === foundId);
  if (fp && fp.status === 'potential') { fp.status = 'pending'; fp.matchedTo = null; }
  showToast('Match rejected. Record returned to pending pool.', 'info');
  renderApp();
}

function rejectMatchModal(missingId, foundId) {
  rejectMatch(missingId, foundId);
  closeModal();
}

function requestMoreInfo(missingId, foundId) {
  const mc = AppState.missingCases.find(c => c.id === missingId);
  if (mc) {
    mc.timeline.push({ status: 'UNDER_VERIFICATION', time: new Date().toLocaleString('en-IN'), by: `Officer: ${AppState.currentUser?.name || 'Authorized Officer'} — Additional info requested` });
    mc.status = 'UNDER_VERIFICATION';
    mc.updatedAt = new Date().toISOString();
  }
  closeModal();
  showToast('Additional information request noted on case.', 'info');
  renderApp();
}

// ============================================================
// AUTHORITY DASHBOARD
// ============================================================
function renderAuthorityDashboard() {
  if (!AppState.isLoggedIn) {
    navigate('login', { targetPage: 'authority-dashboard' });
    return '';
  }

  const activeTab = AppState.authorityTab || 'overview';
  const missing = AppState.missingCases;
  const found   = AppState.foundPersons;

  const kpis = {
    activeMissing: missing.filter(c => c.status === 'MISSING').length,
    foundPersons:  found.filter(f => f.status === 'pending' || f.status === 'potential').length,
    potentialMatches: missing.filter(c => c.status === 'MATCH_FOUND').length,
    verified:      missing.filter(c => c.status === 'VERIFIED').length,
    reunited:      missing.filter(c => c.status === 'REUNITED').length
  };

  const sidebarItems = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'cases',    icon: '📋', label: 'Case Management' },
    { key: 'matches',  icon: '🔗', label: 'AI Match Queue' },
    { key: 'map',      icon: '🗺', label: 'Disaster Map' },
    { key: 'found',    icon: '🟢', label: 'Found Persons' },
    { key: 'audit',    icon: '📝', label: 'Audit Log' }
  ];

  return `
  <div class="dashboard-layout">
    <aside class="dashboard-sidebar" aria-label="Dashboard navigation">
      <div style="padding:0 20px 16px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:8px;">
        <div style="font-size:14px;font-weight:700;color:#fff;">Authority Portal</div>
        <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px;">${AppState.currentUser?.name || 'Officer'}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.35);">${AppState.currentUser?.role || 'District Authority'}</div>
      </div>
      <div class="sidebar-section-label">Navigation</div>
      <ul class="sidebar-nav">
        ${sidebarItems.map(item => `
          <li>
            <button class="${activeTab === item.key ? 'active' : ''}" onclick="AppState.authorityTab='${item.key}';renderApp()">
              ${item.icon} ${item.label}
            </button>
          </li>`).join('')}
      </ul>
      <div class="sidebar-section-label" style="margin-top:16px;">Quick Actions</div>
      <ul class="sidebar-nav">
        <li><button onclick="navigate('report-missing')">🔴 New Missing Report</button></li>
        <li><button onclick="navigate('report-found')">🟢 New Found Record</button></li>
        <li><button onclick="navigate('matching')">🤖 AI Matching</button></li>
        <li><button onclick="navigate('notifications')">🔔 Notifications</button></li>
      </ul>
    </aside>
    <main class="dashboard-content" role="main">
      <div class="d-flex align-center gap-16 mb-24" style="flex-wrap:wrap;justify-content:space-between;">
        <div>
          <h2 style="font-size:20px;font-weight:800;color:var(--gov-navy);">Authority Dashboard</h2>
          <div style="font-size:13px;color:var(--gov-grey-text);">Thanjavur District Relief Authority &nbsp;|&nbsp; Last updated: ${new Date().toLocaleString('en-IN')}</div>
        </div>
        <div class="d-flex gap-8">
          <span class="notice-demo" style="font-size:11px;padding:4px 10px;border-radius:var(--radius-sm);">⚠ DEMO DATA</span>
          <button class="btn btn-danger btn-sm" onclick="startDemoMode()">▶ Run Demo Scenario</button>
        </div>
      </div>

      ${activeTab === 'overview' ? renderAuthorityOverview(kpis) : ''}
      ${activeTab === 'cases'    ? renderCaseManagement() : ''}
      ${activeTab === 'matches'  ? renderMatchQueue() : ''}
      ${activeTab === 'map'      ? renderDisasterMap() : ''}
      ${activeTab === 'found'    ? renderFoundPersonsTable() : ''}
      ${activeTab === 'audit'    ? renderAuditPage() : ''}
    </main>
  </div>`;
}

function renderAuthorityOverview(kpis) {
  return `
  <div class="kpi-grid">
    <div class="kpi-card kpi-red">
      <div class="kpi-label">Active Missing</div>
      <div class="kpi-num">${kpis.activeMissing}</div>
      <div class="kpi-change">Require active search</div>
    </div>
    <div class="kpi-card kpi-blue">
      <div class="kpi-label">Found Persons</div>
      <div class="kpi-num">${kpis.foundPersons}</div>
      <div class="kpi-change">Awaiting match/verification</div>
    </div>
    <div class="kpi-card kpi-amber">
      <div class="kpi-label">Potential Matches</div>
      <div class="kpi-num">${kpis.potentialMatches}</div>
      <div class="kpi-change">Awaiting human review</div>
    </div>
    <div class="kpi-card kpi-blue">
      <div class="kpi-label">Verified Cases</div>
      <div class="kpi-num">${kpis.verified}</div>
      <div class="kpi-change">Identity confirmed</div>
    </div>
    <div class="kpi-card kpi-green">
      <div class="kpi-label">Reunited</div>
      <div class="kpi-num">${kpis.reunited}</div>
      <div class="kpi-change">Families reunited</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="bg-white border-card p-20">
      <h3 style="font-size:14px;font-weight:700;color:var(--gov-navy);margin-bottom:14px;text-transform:uppercase;letter-spacing:.05em;">🔗 High Priority Match Queue</h3>
      ${AppState.matchQueue.filter(m => m.priority==='critical'||m.priority==='high').slice(0,3).map(m => {
        const mc = AppState.missingCases.find(c => c.id === m.missingId);
        const fp = AppState.foundPersons.find(f => f.id === m.foundId);
        if (!mc || !fp) return '';
        return `
        <div style="border:1px solid var(--gov-border);border-radius:var(--radius-sm);padding:12px;margin-bottom:10px;">
          <div class="d-flex align-center gap-12">
            <div style="flex:1;">
              <div style="font-size:13.5px;font-weight:700;">${mc.personName} → ${fp.nameIfKnown||'Unknown'}</div>
              <div style="font-size:12px;color:var(--gov-text-light);">${m.missingId} / ${m.foundId}</div>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--gov-green);">${m.score}%</div>
            <button class="btn btn-primary btn-sm" onclick="openVerificationModal('${m.missingId}','${m.foundId}',${m.score})">Review</button>
          </div>
        </div>`;
      }).join('')}
      <button class="btn btn-secondary btn-sm" onclick="AppState.authorityTab='matches';renderApp()" style="width:100%;margin-top:4px;">View All Matches →</button>
    </div>
    <div class="bg-white border-card p-20">
      <h3 style="font-size:14px;font-weight:700;color:var(--gov-navy);margin-bottom:14px;text-transform:uppercase;letter-spacing:.05em;">📝 Recent Audit Log</h3>
      <div class="audit-log" style="max-height:200px;">
        ${AppState.auditLog.slice(0,6).map(e => `
          <div class="audit-entry">
            <span class="audit-time">${e.time}</span>
            <span class="audit-action">${e.action}</span>
          </div>`).join('')}
      </div>
      <button class="btn btn-secondary btn-sm" onclick="AppState.authorityTab='audit';renderApp()" style="width:100%;margin-top:8px;">View Full Log →</button>
    </div>
  </div>`;
}

function renderCaseManagement() {
  const cases = AppState.missingCases;
  return `
  <div>
    <div class="d-flex align-center gap-12 mb-16" style="flex-wrap:wrap;justify-content:space-between;">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">Case Management</h3>
      <div class="d-flex gap-8">
        <button class="btn btn-danger btn-sm" onclick="navigate('report-missing')">+ New Missing Case</button>
      </div>
    </div>
    <div class="gov-table-wrap">
      <table class="gov-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Person</th>
            <th>Age/Gender</th>
            <th>Location</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${cases.map(c => `
            <tr>
              <td class="case-id-cell">${c.id}</td>
              <td><strong>${c.personName}</strong></td>
              <td>${c.age}y, ${c.gender}</td>
              <td style="font-size:12px;">${c.district}, ${c.state}</td>
              <td><span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span></td>
              <td><span class="status-badge ${getPriorityClass(c.priority)}">${getPriorityLabel(c.priority)}</span></td>
              <td style="font-size:11.5px;">${formatDate(c.updatedAt)}</td>
              <td>
                <div class="d-flex gap-4">
                  <button class="btn btn-secondary btn-sm" onclick="navigate('track',{trackId:'${c.id}',trackResult:AppState.missingCases.find(x=>x.id==='${c.id}')})">View</button>
                  ${c.matchId ? `<button class="btn btn-primary btn-sm" onclick="openVerificationModal('${c.id}','${c.matchId}',${c.matchScore||0})">Verify</button>` : ''}
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderMatchQueue() {
  return `
  <div>
    <div class="d-flex align-center gap-12 mb-16" style="flex-wrap:wrap;justify-content:space-between;">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">AI Match Queue</h3>
      <span class="tag" style="background:var(--gov-amber-pale);color:var(--gov-orange);">⚠ All scores are illustrative prototype values</span>
    </div>
    <div class="notice-box notice-warning mb-16">
      <span class="notice-icon">⚠️</span>
      <div>Scores shown are generated by a prototype algorithm with illustrative weights. All matches MUST be reviewed and confirmed by authorized human personnel before any action is taken.</div>
    </div>
    ${AppState.matchQueue.length === 0 ? `<div class="notice-box notice-info"><span class="notice-icon">ℹ️</span><div>No pending matches in queue.</div></div>` : ''}
    ${AppState.matchQueue.map(m => {
      const mc = AppState.missingCases.find(c => c.id === m.missingId);
      const fp = AppState.foundPersons.find(f => f.id === m.foundId);
      if (!mc || !fp) return '';
      return `
      <div class="match-candidate-card">
        <div class="match-candidate-header">
          <div>
            <span class="status-badge ${getPriorityClass(m.priority)}">${getPriorityLabel(m.priority)}</span>
            <div style="font-size:16px;font-weight:700;color:var(--gov-navy);margin-top:8px;">${mc.personName} ↔ ${fp.nameIfKnown||'Unknown'}</div>
            <div style="font-size:12.5px;color:var(--gov-text-light);">${m.missingId} / ${m.foundId}</div>
            <div style="font-size:12px;color:var(--gov-text-light);margin-top:4px;">
              Missing: ${mc.district}, ${mc.state} &nbsp;|&nbsp; Found at: ${fp.facilityName}
            </div>
          </div>
          <div style="text-align:center;">
            <div class="match-score-circle ${scoreLabel(m.score).cls}" style="width:72px;height:72px;">
              <div class="match-score-num">${m.score}%</div>
            </div>
            <div style="font-size:10px;color:var(--gov-grey-text);margin-top:2px;">Illustrative</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
          ${Object.entries(m.factors).slice(0,5).map(([k,f]) => `
            <span class="tag" style="${f.score>=70?'background:var(--gov-green-pale);color:var(--gov-green);border-color:var(--gov-green-light);':''}">
              ${k}: ${f.score}%
            </span>`).join('')}
        </div>
        <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="navigate('matching',{selectedMissingId:'${m.missingId}'})">🤖 View AI Analysis</button>
          <button class="btn btn-success" onclick="openVerificationModal('${m.missingId}','${m.foundId}',${m.score})">🔍 Human Verification</button>
          <button class="btn btn-secondary" onclick="rejectMatch('${m.missingId}','${m.foundId}');AppState.matchQueue=AppState.matchQueue.filter(x=>!(x.missingId==='${m.missingId}'&&x.foundId==='${m.foundId}'));renderApp()">✗ Reject</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderFoundPersonsTable() {
  return `
  <div>
    <div class="d-flex align-center gap-12 mb-16" style="flex-wrap:wrap;justify-content:space-between;">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">Found Person Records</h3>
      <button class="btn btn-success btn-sm" onclick="navigate('report-found')">+ New Found Record</button>
    </div>
    <div class="gov-table-wrap">
      <table class="gov-table">
        <thead><tr><th>Record ID</th><th>Name (if known)</th><th>Gender</th><th>Est. Age</th><th>Facility</th><th>Medical</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${AppState.foundPersons.map(f => `
            <tr>
              <td class="case-id-cell">${f.id}</td>
              <td>${f.nameIfKnown||'Unknown'}</td>
              <td>${f.gender}</td>
              <td>${f.estimatedAge||'—'}</td>
              <td style="font-size:12px;">${f.facilityName}</td>
              <td style="font-size:12px;">${f.medicalCondition||'—'}</td>
              <td><span class="status-badge ${getStatusClass(f.status)}">${getStatusLabel(f.status)}</span></td>
              <td>
                ${f.matchedTo ? `<button class="btn btn-primary btn-sm" onclick="openVerificationModal('${f.matchedTo}','${f.id}',${AppState.missingCases.find(c=>c.id===f.matchedTo)?.matchScore||0})">Verify</button>` :
                  `<button class="btn btn-secondary btn-sm" onclick="navigate('matching')">Find Match</button>`}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderAuditPage() {
  return `
  <div>
    <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);margin-bottom:16px;">Authority Action Audit Log</h3>
    <div class="notice-box notice-info mb-16">
      <span class="notice-icon">ℹ️</span>
      <div>All actions performed on this system are logged with timestamp and user identification for accountability and audit purposes.</div>
    </div>
    <div class="bg-white border-card p-20">
      <div class="audit-log" style="max-height:500px;">
        ${AppState.auditLog.map(e => `
          <div class="audit-entry">
            <span class="audit-time">${e.time}</span>
            <span class="audit-user">${e.user}</span>
            <span class="audit-action">${e.action}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ============================================================
// DISASTER MAP
// ============================================================
let mapInstance = null;
function renderDisasterMap() {
  setTimeout(() => initMap(), 100);
  return `
  <div>
    <div class="d-flex align-center gap-12 mb-16" style="flex-wrap:wrap;justify-content:space-between;">
      <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">Disaster Response Map</h3>
      <span class="tag">OpenStreetMap + Leaflet</span>
    </div>
    <div id="map-container" role="img" aria-label="Disaster response map showing missing persons, found persons, shelters and hospitals"></div>
    <div class="map-legend">
      <span class="legend-item"><span class="legend-dot" style="background:#c0392b;"></span> Missing Person</span>
      <span class="legend-item"><span class="legend-dot" style="background:#1e7e34;"></span> Found Person</span>
      <span class="legend-item"><span class="legend-dot" style="background:#1c5eb5;"></span> Hospital</span>
      <span class="legend-item"><span class="legend-dot" style="background:#f39c12;"></span> Shelter</span>
      <span class="legend-item"><span class="legend-dot" style="background:#6c3483;"></span> Relief Centre</span>
    </div>
  </div>`;
}

function initMap() {
  const el = document.getElementById('map-container');
  if (!el || typeof L === 'undefined') return;
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  mapInstance = L.map('map-container').setView([11.5, 79.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  function makeIcon(color) {
    return L.divIcon({
      html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>`,
      className: '', iconSize: [14,14], iconAnchor: [7,7]
    });
  }

  AppState.missingCases.filter(c => c.lat && c.lng).forEach(c => {
    L.marker([c.lat, c.lng], { icon: makeIcon('#c0392b') })
      .addTo(mapInstance)
      .bindPopup(`<strong>MISSING: ${c.personName}</strong><br/>${c.id}<br/>${c.district}<br/><span style="font-size:11px;">${getStatusLabel(c.status)}</span>`);
  });

  AppState.foundPersons.filter(f => f.lat && f.lng).forEach(f => {
    L.marker([f.lat, f.lng], { icon: makeIcon('#1e7e34') })
      .addTo(mapInstance)
      .bindPopup(`<strong>FOUND: ${f.nameIfKnown||'Unknown'}</strong><br/>${f.id}<br/>${f.facilityName}`);
  });

  AppState.facilities.forEach(fac => {
    const colors = { hospital:'#1c5eb5', shelter:'#f39c12', relief:'#6c3483' };
    const c = colors[fac.type] || '#555';
    L.marker([fac.lat, fac.lng], {
      icon: L.divIcon({
        html: `<div style="background:${c};color:#fff;font-size:11px;font-weight:700;padding:3px 7px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.3);">${fac.type==='hospital'?'🏥':fac.type==='shelter'?'🏕':'🏛'}</div>`,
        className: '', iconSize: [40, 24], iconAnchor: [20, 12]
      })
    }).addTo(mapInstance)
     .bindPopup(`<strong>${fac.name}</strong><br/>Type: ${fac.type}<br/>Capacity: ${fac.current}/${fac.capacity}`);
  });
}

// ============================================================
// OFFLINE MODE PAGE
// ============================================================
function renderOfflinePage() {
  return `
  <div class="page-hero">
    <div class="container">
      <h1>📶 Offline / Low-Connectivity Mode</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Field reporting capability for areas with limited internet connectivity</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:800px;">
      <div class="offline-toggle-bar">
        <label class="toggle-switch" aria-label="Toggle online/offline mode">
          <input type="checkbox" id="offline-toggle" ${AppState.isOffline?'':'checked'} onchange="toggleOfflineMode(this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
        <div>
          <strong style="font-size:14px;">${AppState.isOffline ? '📴 OFFLINE MODE' : '🌐 ONLINE MODE'}</strong>
          <div style="font-size:12px;color:var(--gov-text-light);">
            ${AppState.isOffline ? 'Records saved locally — waiting for network synchronization' : 'Connected — all features available'}
          </div>
        </div>
        ${AppState.isOffline ? `
          <div class="sync-indicator sync-pending" style="margin-left:auto;">
            ⏳ ${AppState.pendingRecords.length} pending sync
          </div>` : `
          <div class="sync-indicator sync-done" style="margin-left:auto;">
            ✅ SYNC COMPLETE
          </div>`}
      </div>

      ${AppState.isOffline ? `
        <div class="offline-banner">
          <div class="offline-banner-left">
            <div class="offline-banner-icon">📴</div>
            <div>
              <h4>OFFLINE MODE ACTIVE</h4>
              <p>New reports will be saved locally and automatically synced when connectivity is restored</p>
            </div>
          </div>
          <div class="d-flex flex-direction-col gap-4" style="flex-direction:column;">
            <span class="sync-indicator sync-pending">⏳ ${AppState.pendingRecords.length} records pending sync</span>
          </div>
        </div>
        ${AppState.pendingRecords.length > 0 ? `
          <div class="bg-white border-card p-16 mb-24">
            <h4 style="font-size:14px;font-weight:700;color:var(--gov-navy);margin-bottom:10px;">Pending Sync Queue</h4>
            <div class="pending-records">
              ${AppState.pendingRecords.map(r => `<span class="pending-chip">📋 ${r}</span>`).join('')}
            </div>
          </div>` : ''}
      ` : `
        <div class="notice-box notice-success">
          <span class="notice-icon">✅</span>
          <div><strong>System is online.</strong> All ${AppState.pendingRecords.length > 0 ? AppState.pendingRecords.length + ' queued' : ''} records have been synchronized. All features are available.</div>
        </div>`}

      <div class="form-card">
        <div class="form-section-title">📡 Offline Mode Capabilities</div>
        <div class="grid-2">
          ${[
            { icon:'✅', title:'Create Missing Reports', desc:'Full form available offline — stored locally until sync', available: true },
            { icon:'✅', title:'Create Found Person Records', desc:'Register found persons without connectivity', available: true },
            { icon:'✅', title:'Capture Photographs', desc:'Photo upload queued for sync when online', available: true },
            { icon:'❌', title:'AI Matching Engine', desc:'Requires server connectivity — unavailable offline', available: false },
            { icon:'❌', title:'Real-time Status Updates', desc:'Status refresh requires connectivity', available: false },
            { icon:'✅', title:'Offline Case Storage', desc:'View previously loaded cases offline', available: true }
          ].map(f => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:12px;background:var(--gov-grey-bg);border-radius:var(--radius-sm);border:1px solid var(--gov-border);">
              <span style="font-size:18px;flex-shrink:0;">${f.icon}</span>
              <div>
                <div style="font-size:13.5px;font-weight:600;color:${f.available?'var(--gov-navy)':'var(--gov-grey-text)'};">${f.title}</div>
                <div style="font-size:12px;color:var(--gov-text-light);margin-top:2px;">${f.desc}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="form-card">
        <div class="form-section-title">🔄 Sync History (Demo)</div>
        <div class="audit-log" style="max-height:200px;">
          ${[
            { time:'10:32', msg:'12 records synced — RF-2026-000123 to RF-2026-000134', type:'sync' },
            { time:'09:15', msg:'3 pending records uploaded — FP-2026-000088 to FP-2026-000090', type:'sync' },
            { time:'08:45', msg:'Offline mode activated — connectivity lost', type:'offline' },
            { time:'08:20', msg:'AI matching run — 2 new candidates identified', type:'ai' },
            { time:'07:55', msg:'Full sync completed — all records up to date', type:'sync' }
          ].map(e => `
            <div class="audit-entry">
              <span class="audit-time">${e.time}</span>
              <span class="audit-action">${e.msg}</span>
            </div>`).join('')}
        </div>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="navigate('report-missing')">📋 Create Report (${AppState.isOffline?'Offline':'Online'})</button>
        ${AppState.isOffline ? `<button class="btn btn-success" onclick="simulateSync()">🔄 Simulate Sync</button>` : ''}
      </div>
    </div>
  </div>`;
}

function toggleOfflineMode(isOnline) {
  AppState.isOffline = !isOnline;
  if (!AppState.isOffline) { simulateSync(); return; }
  showToast('OFFLINE MODE activated. Reports will be queued for sync.', 'warning');
  renderApp();
}

function simulateSync() {
  AppState.isOffline = false;
  const count = AppState.pendingRecords.length;
  AppState.pendingRecords = [];
  showToast(`✅ Sync complete! ${count > 0 ? count + ' records uploaded.' : 'All records up to date.'}`, 'success');
  renderApp();
}

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================
function renderNotificationsPage() {
  return `
  <div class="page-hero">
    <div class="container">
      <h1>🔔 Notification Centre</h1>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:700px;">
      <div class="d-flex align-center gap-12 mb-16" style="justify-content:space-between;">
        <h3 style="font-size:15px;font-weight:700;color:var(--gov-navy);">All Notifications</h3>
        <button class="btn btn-secondary btn-sm" onclick="markAllRead()">Mark all as read</button>
      </div>
      <div class="bg-white border-card">
        <div class="notif-list">
          ${AppState.notifications.map(n => `
            <div class="notif-item ${n.read?'':'unread'}" onclick="markRead('${n.id}')">
              <div class="notif-icon" style="background:${n.iconBg||'#e8edf3'};">${n.icon}</div>
              <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <div class="notif-time">${n.time}</div>
              </div>
              ${!n.read ? '<div class="notif-dot"></div>' : ''}
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function markRead(id) {
  const n = AppState.notifications.find(x => x.id === id);
  if (n) n.read = true;
  renderApp();
}

function markAllRead() {
  AppState.notifications.forEach(n => n.read = true);
  renderApp();
}

// ============================================================
// LOGIN PAGE
// ============================================================
function renderLogin() {
  const roles = [
    { key:'citizen',   icon:'👨‍👩‍👧', name:'Family / Citizen',       desc:'Report and track missing family members' },
    { key:'rescue',    icon:'🚑', name:'Rescue Team',               desc:'Register found persons from the field' },
    { key:'shelter',   icon:'🏕', name:'Shelter / Relief Camp',     desc:'Manage shelter records and found persons' },
    { key:'hospital',  icon:'🏥', name:'Hospital / Medical Staff',  desc:'Register unidentified patients' },
    { key:'authority', icon:'🏛', name:'Authorized Authority',      desc:'Verify matches and manage all cases' }
  ];

  const selectedRole = AppState.loginRole || '';
  return `
  <div class="page-hero">
    <div class="container">
      <h1>🔐 Secure Login</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Role-based access control — select your role to proceed</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:700px;">
      <div class="notice-box notice-demo">
        <span class="notice-icon">⚠️</span>
        <div><strong>Demo Login:</strong> This is a prototype. No actual credentials are required. Select a role below to access the appropriate interface.</div>
      </div>
      <div class="form-card">
        <div class="form-section-title">Select Your Role</div>
        <div class="role-grid" style="margin-bottom:20px;">
          ${roles.map(r => `
            <div class="role-card ${selectedRole===r.key?'selected':''}" onclick="AppState.loginRole='${r.key}';renderApp()" role="radio" aria-checked="${selectedRole===r.key}" tabindex="0">
              <div class="role-icon">${r.icon}</div>
              <h3>${r.name}</h3>
              <p>${r.desc}</p>
            </div>`).join('')}
        </div>
        ${selectedRole ? `
          <div class="form-grid">
            <div class="form-group">
              <label for="login-name">Name / ID</label>
              <input id="login-name" class="form-control" type="text" placeholder="Enter your name or official ID" value="Officer Meenakshi R."/>
            </div>
            <div class="form-group">
              <label for="login-org">Organization</label>
              <input id="login-org" class="form-control" type="text" placeholder="Organization / facility name" value="Thanjavur District Relief Authority"/>
            </div>
          </div>
          <div class="notice-box notice-warning" style="margin-top:14px;">
            <span class="notice-icon">⚠️</span>
            <div>In a production system, this would require official government credentials, OTP verification, and role-based access certificates. This prototype uses simplified demo login.</div>
          </div>
          <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;">
            <button class="btn btn-secondary" onclick="AppState.loginRole=null;renderApp()">Cancel</button>
            <button class="btn btn-primary btn-lg" onclick="performLogin()">Login as ${roles.find(r=>r.key===selectedRole)?.name}</button>
          </div>
        ` : `
          <div class="notice-box notice-info">
            <span class="notice-icon">ℹ️</span>
            <div>Select a role above to proceed with demo login. Different roles have different access levels to the system.</div>
          </div>`}
      </div>
    </div>
  </div>`;
}

function performLogin() {
  const role  = AppState.loginRole;
  const name  = document.getElementById('login-name')?.value || 'Demo User';
  const org   = document.getElementById('login-org')?.value || '';
  if (!role) { showToast('Please select a role', 'error'); return; }
  AppState.isLoggedIn  = true;
  AppState.currentUser = { name, org, role };
  AppState.currentRole = role;
  AppState.auditLog.unshift({ time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}), user: name, action: `Login — Role: ${role}`, type:'login' });
  showToast(`Logged in as ${name} (${role})`, 'success');
  const target = AppState.targetPage || (role === 'citizen' ? 'family-dashboard' : 'authority-dashboard');
  AppState.targetPage = null;
  navigate(target);
}

function logoutUser() {
  AppState.isLoggedIn  = false;
  AppState.currentUser = null;
  AppState.currentRole = null;
  AppState.loginRole   = null;
  showToast('Logged out successfully', 'info');
  navigate('home');
}

// ============================================================
// FAMILY DASHBOARD
// ============================================================
function renderFamilyDashboard() {
  if (!AppState.isLoggedIn) {
    navigate('login', { targetPage: 'family-dashboard' }); return '';
  }
  const myCases = AppState.missingCases.slice(0, 3);
  return `
  <div class="page-hero">
    <div class="container">
      <h1>📁 My Cases — Family Dashboard</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Welcome, ${AppState.currentUser?.name} — track your submitted cases</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container">
      <div class="notice-box notice-demo mb-16">
        <span class="notice-icon">⚠️</span>
        <div>Demo data shown. In production, only your own submitted cases would be visible here.</div>
      </div>
      <div class="d-flex align-center gap-12 mb-16" style="justify-content:space-between;flex-wrap:wrap;">
        <h3 style="font-size:16px;font-weight:700;color:var(--gov-navy);">My Cases</h3>
        <button class="btn btn-danger btn-sm" onclick="navigate('report-missing')">+ Report New Missing Person</button>
      </div>
      ${myCases.map(c => `
        <div class="match-candidate-card">
          <div class="match-candidate-header">
            <div>
              <div class="font-mono" style="font-size:12px;color:var(--gov-blue);font-weight:700;">${c.id}</div>
              <div style="font-size:18px;font-weight:800;color:var(--gov-navy);margin-top:4px;">${c.personName}</div>
              <div style="font-size:13px;color:var(--gov-text-light);">${c.age} years, ${c.gender} | ${c.disasterType} — ${c.district}, ${c.state}</div>
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                <span class="status-badge ${getStatusClass(c.status)}">${getStatusLabel(c.status)}</span>
                <span class="status-badge ${getPriorityClass(c.priority)}">${getPriorityLabel(c.priority)}</span>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:12px;color:var(--gov-grey-text);">Last updated</div>
              <div style="font-size:13px;font-weight:600;">${formatDateTime(c.updatedAt)}</div>
              <div style="font-size:12px;color:var(--gov-grey-text);margin-top:6px;">Authority: ${c.assignedAuthority}</div>
            </div>
          </div>
          ${c.status === 'MATCH_FOUND' || c.status === 'UNDER_VERIFICATION' ? `
            <div class="notice-box notice-info" style="margin-bottom:12px;">
              <span class="notice-icon">🔗</span>
              <div style="font-size:13px;">A potential match has been identified (Score: ${c.matchScore}% — Illustrative). An authorized officer is reviewing the details. You will be notified of the outcome.</div>
            </div>` : ''}
          ${c.status === 'REUNITED' ? `
            <div class="notice-box notice-success" style="margin-bottom:12px;">
              <span class="notice-icon">🤝</span>
              <div style="font-size:13px;"><strong>Family Reunification Confirmed!</strong> This case has been resolved.</div>
            </div>` : ''}
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="navigate('track',{trackId:'${c.id}',trackResult:AppState.missingCases.find(x=>x.id==='${c.id}')})">📋 View Case</button>
            <button class="btn btn-secondary btn-sm" onclick="navigate('notifications')">🔔 View Updates</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

// ============================================================
// ABOUT PAGE
// ============================================================
function renderAbout() {
  return `
  <div class="page-hero">
    <div class="container">
      <h1>ℹ️ About FAMILYLINK-AI</h1>
      <p style="color:rgba(255,255,255,.7);margin-top:6px;">Disaster-Affected Family Reunification System — Hackathon Prototype</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:900px;">
      <div class="notice-box notice-demo mb-24">
        <span class="notice-icon">⚠️</span>
        <div><strong>Prototype Disclaimer:</strong> FAMILYLINK-AI is a hackathon prototype demonstrating a proposed system architecture. This is not an official government service. All data shown is synthetic demo data. Matching scores are generated by a prototype algorithm and are not validated metrics.</div>
      </div>

      <div class="form-card">
        <div class="form-section-title">What Problem Are We Solving?</div>
        <p style="font-size:15px;line-height:1.7;color:var(--gov-text-light);margin-bottom:14px;">
          During disasters such as floods, cyclones, earthquakes and landslides, families are often separated during emergency evacuation, rescue operations, medical transport and temporary relocation to relief shelters.
        </p>
        <p style="font-size:15px;line-height:1.7;color:var(--gov-text-light);">
          Information about affected individuals becomes fragmented across multiple disconnected systems: evacuation centre registers, hospital admission records, shelter logs, rescue team field notes, police missing-person records and family reports. There is no unified coordination layer, which means families cannot search effectively and response agencies cannot work together efficiently.
        </p>
      </div>

      <div class="form-card">
        <div class="form-section-title">What Does FAMILYLINK-AI Do?</div>
        <p style="font-size:15px;line-height:1.7;color:var(--gov-text-light);margin-bottom:16px;">
          FAMILYLINK-AI creates a unified coordination platform that helps authorized organizations register cases, identify potential matches using AI assistance, verify identities through human authorization, and reconnect families.
        </p>
        <div style="background:var(--gov-navy);color:#fff;border-radius:var(--radius-md);padding:20px;text-align:center;font-size:15px;font-weight:700;letter-spacing:.05em;margin-bottom:16px;">
          REPORT → NORMALIZE → MATCH → RANK → VERIFY → NOTIFY → REUNITE
        </div>
        <div class="grid-3">
          ${[
            { icon:'📋', title:'Unified Registration', desc:'Missing and found person reports from all agencies in one system' },
            { icon:'🤖', title:'AI-Assisted Matching', desc:'Prototype matching engine identifies candidate records across all data' },
            { icon:'📊', title:'Ranked Candidates', desc:'Weighted scoring helps prioritize most likely matches for human review' },
            { icon:'👤', title:'Human Verification', desc:'Authorized personnel confirm all identities — AI only recommends' },
            { icon:'📍', title:'Location Intelligence', desc:'Map-based proximity analysis for location-aware matching' },
            { icon:'📴', title:'Offline Capability', desc:'Field workers can register records without internet connectivity' }
          ].map(f => `
            <div style="padding:16px;background:var(--gov-grey-bg);border:1px solid var(--gov-border);border-radius:var(--radius-sm);">
              <div style="font-size:24px;margin-bottom:8px;">${f.icon}</div>
              <div style="font-weight:700;font-size:14px;color:var(--gov-navy);margin-bottom:4px;">${f.title}</div>
              <div style="font-size:13px;color:var(--gov-text-light);">${f.desc}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="form-card">
        <div class="form-section-title">AI Safety & Ethics</div>
        <div class="notice-box notice-warning" style="margin-bottom:16px;">
          <span class="notice-icon">⚠️</span>
          <div><strong>AI Assists. Authorized Humans Verify.</strong> This is the fundamental principle of FAMILYLINK-AI.</div>
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
          ${[
            'AI is used only for candidate suggestion and ranking — never for final identity confirmation',
            'All identity verifications must be performed by authorized human personnel',
            'Match scores are clearly labelled as illustrative/prototype values',
            'Users can reject any AI suggestion without restriction',
            'An audit trail is maintained for all human decisions',
            'Sensitive information (medical, identification) is restricted to authorized roles',
            'No information is shared publicly without authorization',
            'AI recommendations are presented as decision-support, never as conclusions'
          ].map(p => `<li style="display:flex;gap:10px;font-size:14px;color:var(--gov-text-light);"><span style="color:var(--gov-blue);font-weight:700;flex-shrink:0;">→</span><span>${p}</span></li>`).join('')}
        </ul>
      </div>

      <div class="form-card">
        <div class="form-section-title">Technology Stack (Prototype)</div>
        <div class="grid-2">
          ${[
            ['Frontend', 'Vanilla HTML/CSS/JavaScript — Progressive Web App'],
            ['AI Matching', 'Prototype: String similarity, age/location scoring, weighted ranking'],
            ['Map', 'Leaflet + OpenStreetMap — open source geospatial'],
            ['Target Backend', 'FastAPI (Python) + PostgreSQL + PostGIS'],
            ['Offline Mode', 'localStorage-based queuing (PWA service worker in production)'],
            ['Target AI Stack', 'NLP similarity, OCR, image embeddings, face similarity (authorized use only)']
          ].map(([k,v]) => `
            <div style="padding:12px;background:var(--gov-grey-bg);border:1px solid var(--gov-border);border-radius:var(--radius-sm);">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gov-blue);margin-bottom:4px;">${k}</div>
              <div style="font-size:13.5px;color:var(--gov-text);">${v}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// ============================================================
// PRIVACY PAGE
// ============================================================
function renderPrivacy() {
  return `
  <div class="page-hero">
    <div class="container">
      <h1>🔒 Privacy & Security Architecture</h1>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:800px;">
      <div class="notice-box notice-demo mb-24">
        <span class="notice-icon">⚠️</span>
        <div>This page describes the intended security architecture for a production deployment of FAMILYLINK-AI. <strong>This prototype demonstrates the design intent and does not represent a production-certified government system.</strong></div>
      </div>
      ${[
        { icon:'🔐', title:'Role-Based Access Control', items:['Five distinct user roles with different access levels','Citizens see only their own cases','Rescue/shelter staff access only their jurisdiction','Authority accounts have controlled expanded access','All roles defined and enforced by server-side authorization'] },
        { icon:'🔑', title:'Authentication', items:['Production system: government-issued credentials','OTP verification via registered mobile numbers','Session management with automatic timeout','Audit-logged login and logout events','No shared or generic accounts permitted'] },
        { icon:'🛡', title:'Data Protection', items:['Minimum necessary information principle applied','Sensitive medical information restricted to medical authority roles','Photograph/biometric data access logged and controlled','No public exposure of personal identification numbers','Encryption in transit (HTTPS/TLS) and at rest'] },
        { icon:'📝', title:'Audit & Accountability', items:['All actions logged with timestamp, user ID and role','AI-generated recommendations separately tracked','Human verification decisions recorded with authority identifier','Audit logs immutable and accessible to oversight authority','Regular audit log review procedures'] },
        { icon:'🗂', title:'Data Retention', items:['Case data retained only as long as legally required','Resolved cases archived after defined period','Photographs and biometric data deleted after verification','Data deletion rights for individuals where applicable','No unnecessary data aggregation or profiling'] },
        { icon:'🌐', title:'Transparency', items:['Users notified of what data is collected and why','All AI use is disclosed and labelled','AI limitations clearly communicated','Users can view their own case information','Mechanism for data correction requests'] }
      ].map(s => `
        <div class="privacy-section form-card" style="margin-bottom:16px;">
          <h3 style="font-size:15px;font-weight:700;color:var(--gov-navy);margin-bottom:12px;">${s.icon} ${s.title}</h3>
          <ul>
            ${s.items.map(i => `<li><span>🔒</span><span>${i}</span></li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>
  </div>`;
}

// ============================================================
// EMERGENCY HELP PAGE
// ============================================================
function renderEmergencyHelp() {
  return `
  <div class="page-hero" style="background:var(--gov-red);">
    <div class="container">
      <h1>🆘 Emergency Help</h1>
      <p style="color:rgba(255,255,255,.8);margin-top:6px;">For immediate life-threatening emergencies, contact local emergency services</p>
    </div>
  </div>
  <div class="page-content">
    <div class="container" style="max-width:800px;">
      <div class="notice-box notice-danger mb-24">
        <span class="notice-icon">⚠️</span>
        <div><strong>If you or someone near you is in immediate danger, do NOT use this system — call emergency services immediately.</strong></div>
      </div>
      <div class="form-card">
        <div class="form-section-title">Emergency Contact Numbers (India)</div>
        <div class="grid-2">
          ${[
            { num:'112', desc:'National Emergency Number (Police, Fire, Ambulance)', icon:'🚨' },
            { num:'101', desc:'Fire Department', icon:'🔥' },
            { num:'102', desc:'Ambulance Services', icon:'🚑' },
            { num:'1078', desc:'NDRF Disaster Helpline', icon:'🆘' },
            { num:'1800-180-1253', desc:'National Disaster Management Authority', icon:'🏛' },
            { num:'1070', desc:'State Disaster Management (varies by state)', icon:'📋' }
          ].map(e => `
            <div style="padding:16px;background:var(--gov-red-pale);border:1px solid #f5b7b1;border-radius:var(--radius-sm);display:flex;align-items:center;gap:14px;">
              <span style="font-size:28px;">${e.icon}</span>
              <div>
                <div style="font-size:22px;font-weight:800;color:var(--gov-red);">${e.num}</div>
                <div style="font-size:13px;color:var(--gov-text-light);">${e.desc}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div class="form-card">
        <div class="form-section-title">How to Use FAMILYLINK-AI in an Emergency</div>
        <ol style="padding-left:20px;display:flex;flex-direction:column;gap:12px;">
          ${[
            'Ensure your immediate safety first — contact emergency services (112) if needed',
            'Once safe, use Report Missing Person to register a missing family member',
            'Keep your Case Reference Number safe — you will need it to track updates',
            'Authorized rescue teams and shelter staff will register found persons',
            'The AI system will identify potential matches for human review by authorities',
            'You will be notified when a potential match is identified for verification',
            'Final confirmation is performed by authorized personnel — not by AI alone'
          ].map((s,i) => `<li style="font-size:14px;line-height:1.6;"><strong>Step ${i+1}:</strong> ${s}</li>`).join('')}
        </ol>
      </div>
    </div>
  </div>`;
}

// ============================================================
// DEMO MODE — Full Scenario Walkthrough
// ============================================================
function startDemoMode() {
  AppState.demoMode = true;
  AppState.demoStep = 0;
  runDemoStep();
}

function runDemoStep() {
  const steps = [
    () => { navigate('home'); showToast('📋 DEMO: Starting flood scenario — Kaveri Basin Flood 2026', 'info', 4000); },
    () => {
      navigate('report-missing');
      AppState.reportMissingStep = 1;
      AppState.reportMissingData = {
        disasterType:'Flood', disasterName:'Kaveri Basin Flood 2026', incidentDate:'2026-09-28T06:00',
        state:'Tamil Nadu', district:'Thanjavur', lastSeenLocation:'Flood Evacuation Zone A, NH-45 Near Papanasam', evacuationCentre:'Unknown'
      };
      renderApp();
      showToast('📋 DEMO: Missing person report — Arun Kumar, 62M', 'info', 4000);
    },
    () => {
      navigate('report-found');
      showToast('🟢 DEMO: Found person record — District Relief Hospital Centre B', 'info', 4000);
    },
    () => {
      AppState.selectedMissingId = 'RF-2026-000123';
      navigate('matching');
      showToast('🤖 DEMO: AI Matching Engine — analyzing candidate records...', 'info', 4000);
    },
    () => {
      navigate('matching', { selectedMissingId: 'RF-2026-000123' });
      showToast('🔗 DEMO: Illustrative match score 87% — RF-2026-000123 ↔ FP-2026-000087', 'info', 4000);
      setTimeout(() => openVerificationModal('RF-2026-000123','FP-2026-000087',87), 2000);
    },
    () => {
      verifyMatch('RF-2026-000123','FP-2026-000087');
      setTimeout(() => {
        const mc = AppState.missingCases.find(c => c.id === 'RF-2026-000123');
        if (mc) {
          mc.status = 'REUNITED';
          mc.updatedAt = new Date().toISOString();
          mc.timeline.push({ status:'REUNITED', time:new Date().toLocaleString('en-IN'), by:'Officer: Meenakshi R. — Demo Scenario' });
        }
        navigate('track', { trackId:'RF-2026-000123', trackResult: AppState.missingCases.find(c=>c.id==='RF-2026-000123') });
        showToast('🤝 DEMO COMPLETE: Family Reunification Confirmed — Arun Kumar', 'success', 6000);
      }, 1000);
    }
  ];

  if (AppState.demoStep >= steps.length) {
    AppState.demoMode = false;
    AppState.demoStep = 0;
    return;
  }

  steps[AppState.demoStep]();
  AppState.demoStep++;

  if (AppState.demoStep < steps.length) {
    setTimeout(runDemoStep, 3500);
  }
}

// ============================================================
// FOOTER
// ============================================================
function renderFooter() {
  return `
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">🔗 FAMILYLINK-AI</div>
          <div class="footer-brand-sub">Disaster-Affected Family Reunification System</div>
          <div class="footer-brand-desc">A unified coordination platform for reporting, AI-assisted matching, human verification and reconnecting disaster-affected individuals.</div>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="#" onclick="navigate('report-missing');return false;">Report Missing Person</a></li>
            <li><a href="#" onclick="navigate('report-found');return false;">Report Found Person</a></li>
            <li><a href="#" onclick="navigate('search');return false;">Search Cases</a></li>
            <li><a href="#" onclick="navigate('track');return false;">Track Case</a></li>
            <li><a href="#" onclick="navigate('emergency-help');return false;">Emergency Help</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Authority</h4>
          <ul class="footer-links">
            <li><a href="#" onclick="navigate('login',{targetPage:'authority-dashboard'});return false;">Authority Portal</a></li>
            <li><a href="#" onclick="navigate('matching');return false;">AI Matching</a></li>
            <li><a href="#" onclick="navigate('offline');return false;">Offline Mode</a></li>
            <li><a href="#" onclick="navigate('notifications');return false;">Notifications</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Information</h4>
          <ul class="footer-links">
            <li><a href="#" onclick="navigate('about');return false;">About System</a></li>
            <li><a href="#" onclick="navigate('privacy');return false;">Privacy & Security</a></li>
            <li><a href="#" onclick="navigate('emergency-help');return false;">Emergency Contacts</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-disclaimer">
          FAMILYLINK-AI is a hackathon prototype demonstrating a proposed disaster family reunification system. This platform is <strong>not an official government service</strong>. All data shown is synthetic demo data created for demonstration purposes only. No real personal information is stored or processed.
        </div>
        <div class="footer-prototype-badge">Hackathon Prototype</div>
      </div>
    </div>
  </footer>`;
}

// ============================================================
// MAIN APP RENDER
// ============================================================
function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const noNavPages   = [];
  const noFooterPages = ['authority-dashboard'];

  const showNav    = !noNavPages.includes(AppState.currentPage);
  const showFooter = !noFooterPages.includes(AppState.currentPage);

  let pageContent = '';
  switch(AppState.currentPage) {
    case 'home':               pageContent = renderHome();              break;
    case 'report-missing':     pageContent = renderReportMissing();     break;
    case 'report-found':       pageContent = renderReportFound();       break;
    case 'search':             pageContent = renderSearch();            break;
    case 'track':              pageContent = renderTrackCase();         break;
    case 'matching':           pageContent = renderMatchingPage();      break;
    case 'authority-dashboard':pageContent = renderAuthorityDashboard();break;
    case 'family-dashboard':   pageContent = renderFamilyDashboard();   break;
    case 'login':              pageContent = renderLogin();             break;
    case 'notifications':      pageContent = renderNotificationsPage(); break;
    case 'offline':            pageContent = renderOfflinePage();       break;
    case 'about':              pageContent = renderAbout();             break;
    case 'privacy':            pageContent = renderPrivacy();           break;
    case 'emergency-help':     pageContent = renderEmergencyHelp();     break;
    default:                   pageContent = renderHome();
  }

  root.innerHTML = `
    ${renderEmergencyStrip()}
    ${showNav ? renderNavbar() : ''}
    <main id="main-content" tabindex="-1">${pageContent}</main>
    ${showFooter ? renderFooter() : ''}
    <div id="toast-container" class="toast-container" role="status" aria-live="polite"></div>
    <div id="global-modal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title" onclick="if(event.target===this)closeModal()">
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="modal-title">—</h3>
          <button class="modal-close" onclick="closeModal()" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>
    </div>`;

  // Initialize map if needed
  if (AppState.currentPage === 'authority-dashboard' && AppState.authorityTab === 'map') {
    setTimeout(initMap, 200);
  }

  // Track page for offline queuing demo
  if (AppState.isOffline && (AppState.currentPage === 'report-missing' || AppState.currentPage === 'report-found')) {
    // already handled in submit functions
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Load real database data first
  if (typeof loadLiveDatabase === 'function') {
    await loadLiveDatabase();
  }
  
  // Initial render
  renderApp();

  // Handle keyboard navigation for role cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Service worker for PWA (stub)
  if ('serviceWorker' in navigator) {
    // Service worker would be registered here in production
    console.log('[FAMILYLINK-AI] PWA-ready architecture');
  }

  console.log('[FAMILYLINK-AI] Hackathon Prototype — Loaded successfully');
  console.log('[FAMILYLINK-AI] Report → Match → Verify → Reunite');
});
