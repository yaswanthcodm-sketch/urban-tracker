/**
 * @module complaintTrackingModal
 * @description Manages the interactive 6-stage complaint tracking modal within the main 3D application.
 */

import { SAMPLE_COMPLAINTS, getComplaintById } from './data/complaintTrackingData.js';
import { getAvailableLanguages, setLanguage, getActiveLanguage, applyTranslations, t, speakAnnouncement } from './i18n/indianLanguages.js';

export function initComplaintTrackingModal() {
  const modal = document.getElementById('tracking-modal');
  const openHeaderBtn = document.getElementById('header-track-complaint-btn');
  const closeBtn = document.getElementById('btn-close-modal');
  const closeBottomBtn = document.getElementById('btn-close-modal-bottom');
  const searchInput = document.getElementById('modal-track-input');
  const searchBtn = document.getElementById('btn-modal-search');
  const quickChips = document.querySelectorAll('.quick-chip');

  let activeComplaint = null;

  if (!modal) return;

  function open(id = 'RG-2026-CC-8492', shouldAnnounce = true) {
    const complaint = getComplaintById(id);
    activeComplaint = complaint;
    renderComplaint(complaint);
    modal.classList.remove('hidden');
    if (searchInput) searchInput.value = complaint.tracking_id;

    if (shouldAnnounce && complaint) {
      speakAnnouncement('problem_raised', {
        ticketId: complaint.tracking_id,
        roadTitle: complaint.road_name,
      });
    }
  }

  function close() {
    modal.classList.add('hidden');
  }

  // Header button listener
  openHeaderBtn?.addEventListener('click', () => open());
  closeBtn?.addEventListener('click', close);
  closeBottomBtn?.addEventListener('click', close);

  // Close on outside click or Esc
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });

  // Search button
  searchBtn?.addEventListener('click', () => {
    const val = searchInput?.value.trim();
    if (val) open(val);
  });
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = searchInput?.value.trim();
      if (val) open(val);
    }
  });

  // Quick Chips
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      quickChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const id = chip.dataset.id;
      if (id) open(id);
    });
  });

  // Global event listener (e.g. from road cards grievance lodging)
  window.addEventListener('gev:open-tracking', (e) => {
    const id = e.detail?.id || 'RG-2026-CC-8492';
    open(id, false);
  });

  function renderComplaint(c) {
    if (!c) return;

    // Header Summary
    const tokenIdEl = document.getElementById('track-token-id');
    const roadTypeEl = document.getElementById('track-road-type');
    const locationEl = document.getElementById('track-location');
    const coordsEl = document.getElementById('track-coords');
    const defectEl = document.getElementById('track-defect');
    const statusPill = document.getElementById('track-status-pill');

    if (tokenIdEl) tokenIdEl.textContent = c.tracking_id;
    if (roadTypeEl) roadTypeEl.textContent = c.road_type_name;
    if (locationEl) locationEl.textContent = `${c.road_name} (${c.locality})`;
    if (coordsEl) coordsEl.textContent = c.gps_coordinates;
    if (defectEl) defectEl.textContent = c.defect_type;

    const lang = getActiveLanguage();
    if (statusPill) {
      statusPill.className = 'status-pill';
      if (c.current_status === 'RESOLVED') {
        statusPill.classList.add('resolved');
        statusPill.textContent = '● ' + (t('stage_approved', lang) || 'RESOLVED & APPROVED');
      } else if (c.current_status === 'REPAIR_IN_PROGRESS') {
        statusPill.classList.add('in_progress');
        statusPill.textContent = '● ' + (t('stage_repair', lang) || 'REPAIR IN PROGRESS');
      } else if (c.current_status === 'WORKER_APPOINTED') {
        statusPill.classList.add('in_progress');
        statusPill.textContent = '● ' + (t('stage_worker', lang) || 'WORKER & CREW APPOINTED');
      } else if (c.current_status === 'AUTHORITY_ASSIGNED') {
        statusPill.classList.add('in_progress');
        statusPill.textContent = '● ' + (t('stage_authority', lang) || 'AUTHORITY ASSIGNED');
      } else {
        statusPill.classList.add('registered');
        statusPill.textContent = '● ' + (t('stage_registered', lang) || 'REGISTERED & LOGGED');
      }
    }

    // Stepper (Stages 1 through 6)
    const stepperNodes = document.querySelectorAll('#lifecycle-stepper .step-node');
    const connectors = document.querySelectorAll('#lifecycle-stepper .step-connector');

    stepperNodes.forEach((node) => {
      const stepNum = parseInt(node.dataset.step, 10);
      node.classList.remove('active', 'completed');
      if (stepNum < c.current_step) {
        node.classList.add('active', 'completed');
      } else if (stepNum === c.current_step) {
        node.classList.add('active');
        if (c.current_status === 'RESOLVED') node.classList.add('completed');
      }
    });

    connectors.forEach((conn, idx) => {
      conn.classList.remove('completed');
      if (idx + 1 < c.current_step) conn.classList.add('completed');
    });

    // Sub-labels on stepper
    const step1 = document.getElementById('step1-time');
    const step2 = document.getElementById('step2-dept');
    const step3 = document.getElementById('step3-worker');
    const step4 = document.getElementById('step4-status');

    if (step1) step1.textContent = c.registered_at.split(',')[0];
    if (step2) step2.textContent = c.department.jurisdiction.split(' ')[0] || 'Assigned';
    if (step3) step3.textContent = c.contractor.lead_supervisor.split(' ')[0] || 'Appointed';
    if (step4) step4.textContent = c.repair.status_label;

    // Card A: Authority & Worker
    const cardDept = document.getElementById('card-dept-name');
    const cardSla = document.getElementById('card-sla');
    const cardEng = document.getElementById('card-engineer');
    const cardContractor = document.getElementById('card-contractor');
    const cardSupervisor = document.getElementById('card-supervisor');
    const cardCrew = document.getElementById('card-crew');
    const cardWO = document.getElementById('card-work-order');

    if (cardDept) cardDept.textContent = c.department.name;
    if (cardSla) cardSla.textContent = `${c.department.jurisdiction} · Target: ${c.department.sla_hours} Hours SLA`;
    if (cardEng) cardEng.textContent = `${c.department.officer_in_charge} (${c.department.officer_badge})`;
    if (cardContractor) cardContractor.textContent = c.contractor.firm_name;
    if (cardSupervisor) cardSupervisor.textContent = `${c.contractor.lead_supervisor} · Phone: ${c.contractor.supervisor_phone}`;
    if (cardCrew) cardCrew.textContent = `${c.contractor.work_crew} · Vehicle: ${c.contractor.crew_vehicle_id}`;
    if (cardWO) cardWO.textContent = c.contractor.work_order_id;

    // Card B: Execution & Log
    const cardMethod = document.getElementById('card-repair-method');
    const cardTimeline = document.getElementById('card-repair-timeline');
    const execList = document.getElementById('card-execution-list');

    if (cardMethod) cardMethod.textContent = c.repair.repair_method;
    if (cardTimeline) cardTimeline.textContent = `Started: ${c.repair.started_at} · ${c.repair.completed_at ? 'Completed: ' + c.repair.completed_at : 'In Progress'}`;
    
    if (execList) {
      execList.innerHTML = '';
      c.repair.execution_log.forEach((entry) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.time}:</strong> ${entry.text}`;
        execList.appendChild(li);
      });
    }

    // Photometric Audit: Before & After Photos (Requirement 4.5)
    const imgBefore = document.getElementById('img-track-before');
    const imgAfter = document.getElementById('img-track-after');
    const auditScore = document.getElementById('audit-score-pill');
    const auditNotes = document.getElementById('audit-notes-text');
    const auditInspector = document.getElementById('audit-inspector-name');

    if (imgBefore) imgBefore.src = c.review.before_image;
    if (imgAfter) imgAfter.src = c.review.after_image;
    if (auditScore) auditScore.textContent = `Smoothness Index: ${c.review.smoothness_score}`;
    if (auditNotes) auditNotes.textContent = c.review.inspector_notes;
    if (auditInspector) auditInspector.textContent = c.review.inspected_by;

    // Resolution Certificate (Requirement 4.6)
    const resApproved = document.getElementById('res-approved-by');
    const resCert = document.getElementById('res-cert-id');

    if (resApproved) resApproved.textContent = `Officially approved by: ${c.approval.approved_by}. Status: ${c.approval.status}`;
    if (resCert) resCert.textContent = `Digital Audit Certificate: ${c.approval.digital_certificate_id}`;
  }

  // Reactive updates when language changes
  window.addEventListener('rg_language_changed', () => {
    applyTranslations();
    if (activeComplaint && !modal.classList.contains('hidden')) {
      renderComplaint(activeComplaint);
    }
  });
}
