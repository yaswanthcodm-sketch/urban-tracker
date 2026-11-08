/**
 * RoadGuard AI — Civic Portal Client Logic
 * Handles 22 Indian Languages, Role Switching, Authentication, and 6-Stage Complaint Tracking
 */

document.addEventListener('DOMContentLoaded', function() {
  const i18n = window.RoadGuardI18n;
  const db = window.ComplaintTrackingDB;

  // 1. Initialize 22 Indian Languages Dropdown
  const langSelect = document.getElementById('lang-select');
  if (langSelect && i18n) {
    langSelect.innerHTML = '';
    i18n.languages.forEach(function(lang) {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = `${lang.flag} ${lang.name} (${lang.native})`;
      if (lang.code === i18n.getActiveLanguage()) {
        opt.selected = true;
      }
      langSelect.appendChild(opt);
    });

    langSelect.addEventListener('change', function(e) {
      const selected = e.target.value;
      i18n.setLanguage(selected);
    });

    // Apply active language on page load
    i18n.apply(i18n.getActiveLanguage());
  }

  // 2. Role Tabs (Citizen vs Officer)
  const tabs = document.querySelectorAll('.auth-tab');
  const inputEmail = document.getElementById('input-email');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const role = tab.dataset.tab;
      if (role === 'officer') {
        inputEmail.placeholder = 'officer.pwd@roadguard.gov.in';
        inputEmail.value = 'officer.pwd@roadguard.gov.in';
      } else {
        inputEmail.placeholder = 'yaswanth@roadguard.gov.in or 9492323535';
        inputEmail.value = 'yaswanth@roadguard.gov.in';
      }
    });
  });

  // 3. Password Visibility Toggle
  const togglePassBtn = document.getElementById('btn-toggle-password');
  const passInput = document.getElementById('input-password');
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', function() {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
      togglePassBtn.style.opacity = type === 'text' ? '1' : '0.7';
    });
  }

  // 4. Fill Admin Credentials
  const fillAdminBtn = document.getElementById('btn-fill-admin');
  if (fillAdminBtn) {
    fillAdminBtn.addEventListener('click', function() {
      inputEmail.value = 'yaswanth@roadguard.gov.in';
      passInput.value = 'RoadGuard2026!';
    });
  }

  // 5. Authentication Form Submission
  const loginForm = document.getElementById('portal-login-form');
  const alertEl = document.getElementById('auth-alert');
  const alertText = document.getElementById('auth-alert-text');
  const submitBtn = document.getElementById('btn-submit');
  const submitText = document.getElementById('btn-submit-text');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alertEl.classList.add('hidden');
      const email = inputEmail.value.trim();
      const password = passInput.value.trim();

      if (!email || !password) {
        alertText.textContent = 'Please provide both identification and password.';
        alertEl.classList.remove('hidden');
        return;
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Verifying Credentials...';

      // Simulate verification / API check
      setTimeout(function() {
        const authData = {
          token: 'rg-jwt-sec-' + Math.random().toString(36).substring(2, 12),
          email: email,
          name: email.split('@')[0],
          role: email.includes('officer') ? 'officer' : 'citizen',
          login_time: new Date().toISOString()
        };
        try {
          localStorage.setItem('urban_tracker_auth', JSON.stringify(authData));
          localStorage.setItem('roadguard_token', authData.token);
        } catch(e) {}

        submitText.textContent = 'Access Granted · Redirecting...';
        setTimeout(function() {
          window.location.href = '/';
        }, 500);
      }, 600);
    });
  }

  // 6. Complete Complaint Tracking Modal Logic (Requirement 4)
  const modal = document.getElementById('tracking-modal');
  const btnOpenTracker = document.getElementById('btn-open-tracker');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalBottom = document.getElementById('btn-close-modal-bottom');
  const landingTrackInput = document.getElementById('landing-track-input');
  const btnLandingTrack = document.getElementById('btn-landing-track');
  const modalTrackInput = document.getElementById('modal-track-input');
  const btnModalSearch = document.getElementById('btn-modal-search');

  function openTracking(id) {
    const complaint = db.get(id);
    renderTrackingDetails(complaint);
    modal.classList.remove('hidden');
    modalTrackInput.value = complaint.tracking_id;
  }

  function closeTracking() {
    modal.classList.add('hidden');
  }

  if (btnOpenTracker) {
    btnOpenTracker.addEventListener('click', function() {
      openTracking(landingTrackInput.value || 'RG-2026-CC-8492');
    });
  }

  if (btnLandingTrack) {
    btnLandingTrack.addEventListener('click', function() {
      openTracking(landingTrackInput.value || 'RG-2026-CC-8492');
    });
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeTracking);
  if (btnCloseModalBottom) btnCloseModalBottom.addEventListener('click', closeTracking);

  // Close on Escape or click outside
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeTracking();
    }
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeTracking();
  });

  if (btnModalSearch) {
    btnModalSearch.addEventListener('click', function() {
      const id = modalTrackInput.value.trim();
      if (id) openTracking(id);
    });
  }

  modalTrackInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const id = modalTrackInput.value.trim();
      if (id) openTracking(id);
    }
  });

  // Demo Chips Click on Hero
  document.querySelectorAll('.demo-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      const id = chip.dataset.id;
      landingTrackInput.value = id;
      openTracking(id);
    });
  });

  // Road Type Showcase items click -> opens tracking
  document.querySelectorAll('.road-type-item').forEach(function(item) {
    item.addEventListener('click', function() {
      const id = item.dataset.id;
      if (id) openTracking(id);
    });
  });

  // Quick Chips in Modal
  document.querySelectorAll('.quick-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const id = chip.dataset.id;
      openTracking(id);
    });
  });

  // 7. Render Tracking Details (6 Stages, Worker Appointment, Before vs After)
  function renderTrackingDetails(c) {
    if (!c) return;

    // Header Summary
    document.getElementById('track-token-id').textContent = c.tracking_id;
    document.getElementById('track-road-type').textContent = c.road_type_name;
    document.getElementById('track-location').textContent = `${c.road_name} (${c.locality})`;
    document.getElementById('track-coords').textContent = c.gps_coordinates;
    document.getElementById('track-defect').textContent = c.defect_type;

    const statusPill = document.getElementById('track-status-pill');
    statusPill.className = 'status-pill';
    if (c.current_status === 'RESOLVED') {
      statusPill.classList.add('resolved');
      statusPill.textContent = '● RESOLVED & APPROVED';
    } else if (c.current_status === 'REPAIR_IN_PROGRESS') {
      statusPill.classList.add('in_progress');
      statusPill.textContent = '● REPAIR IN PROGRESS';
    } else if (c.current_status === 'WORKER_APPOINTED') {
      statusPill.classList.add('in_progress');
      statusPill.textContent = '● WORKER & CREW APPOINTED';
    } else if (c.current_status === 'AUTHORITY_ASSIGNED') {
      statusPill.classList.add('in_progress');
      statusPill.textContent = '● AUTHORITY ASSIGNED';
    } else {
      statusPill.classList.add('registered');
      statusPill.textContent = '● REGISTERED & LOGGED';
    }

    // Stepper (Stages 1 through 6)
    const stepperNodes = document.querySelectorAll('#lifecycle-stepper .step-node');
    const connectors = document.querySelectorAll('#lifecycle-stepper .step-connector');

    stepperNodes.forEach(function(node) {
      const stepNum = parseInt(node.dataset.step, 10);
      node.classList.remove('active', 'completed');
      if (stepNum < c.current_step) {
        node.classList.add('active', 'completed');
      } else if (stepNum === c.current_step) {
        node.classList.add('active');
        if (c.current_status === 'RESOLVED') node.classList.add('completed');
      }
    });

    connectors.forEach(function(conn, idx) {
      conn.classList.remove('completed');
      if (idx + 1 < c.current_step) {
        conn.classList.add('completed');
      }
    });

    // Sub-labels on stepper
    document.getElementById('step1-time').textContent = c.registered_at.split(',')[0];
    document.getElementById('step2-dept').textContent = c.department.jurisdiction.split(' ')[0] || 'Assigned';
    document.getElementById('step3-worker').textContent = c.contractor.lead_supervisor.split(' ')[0] || 'Appointed';
    document.getElementById('step4-status').textContent = c.repair.status_label;

    // Card A: Authority & Worker
    document.getElementById('card-dept-name').textContent = c.department.name;
    document.getElementById('card-sla').textContent = `${c.department.jurisdiction} · Target: ${c.department.sla_hours} Hours SLA`;
    document.getElementById('card-engineer').textContent = `${c.department.officer_in_charge} (${c.department.officer_badge})`;
    document.getElementById('card-contractor').textContent = c.contractor.firm_name;
    document.getElementById('card-supervisor').textContent = `${c.contractor.lead_supervisor} · Phone: ${c.contractor.supervisor_phone}`;
    document.getElementById('card-crew').textContent = `${c.contractor.work_crew} · Vehicle: ${c.contractor.crew_vehicle_id}`;
    document.getElementById('card-work-order').textContent = c.contractor.work_order_id;

    // Card B: Execution & Log
    document.getElementById('card-repair-method').textContent = c.repair.repair_method;
    document.getElementById('card-repair-timeline').textContent = `Started: ${c.repair.started_at} · ${c.repair.completed_at ? 'Completed: ' + c.repair.completed_at : 'In Progress'}`;
    
    const execList = document.getElementById('card-execution-list');
    execList.innerHTML = '';
    c.repair.execution_log.forEach(function(entry) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.time}:</strong> ${entry.text}`;
      execList.appendChild(li);
    });

    // Photometric Audit: Before & After Photos (Requirement 4.5)
    const imgBefore = document.getElementById('img-track-before');
    const imgAfter = document.getElementById('img-track-after');
    imgBefore.src = c.review.before_image;
    imgAfter.src = c.review.after_image;
    document.getElementById('audit-score-pill').textContent = `Smoothness Index: ${c.review.smoothness_score}`;
    document.getElementById('audit-notes-text').textContent = c.review.inspector_notes;
    document.getElementById('audit-inspector-name').textContent = c.review.inspected_by;

    // Resolution Certificate (Requirement 4.6)
    document.getElementById('res-approved-by').textContent = `Officially approved by: ${c.approval.approved_by}. Status: ${c.approval.status}`;
    document.getElementById('res-cert-id').textContent = `Digital Audit Certificate: ${c.approval.digital_certificate_id}`;
  }

  // Print button
  const btnPrint = document.getElementById('btn-print-receipt');
  if (btnPrint) {
    btnPrint.addEventListener('click', function() {
      window.print();
    });
  }

  // Auto-open tracking if URL has ?track=ID
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('track');
  if (trackParam) {
    openTracking(trackParam);
  }
});
