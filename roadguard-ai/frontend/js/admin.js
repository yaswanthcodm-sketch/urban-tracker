/**
 * RoadGuard AI — Officer Portal Controller
 */

let activeComplaintsList = [];

async function loadAdminComplaints() {
  const statusFilter = document.getElementById('admin-filter-status').value;
  const tbody = document.getElementById('admin-complaints-tbody');

  let url = '/api/complaints?limit=100';
  if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

  try {
    const list = await api.get(url);
    activeComplaintsList = list;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No complaints matching filter criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <a href="/static/track.html?id=${c.public_tracking_id}"><strong>${c.public_tracking_id}</strong></a>
          <div style="font-size: 0.7rem; color: var(--text-dim);">${c.source_type}</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <strong>${c.defect_type}</strong>
            ${api.getSeverityBadge(c.severity)}
          </div>
        </td>
        <td>
          <div style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${c.road_name}
          </div>
          <div style="font-size: 0.725rem; color: var(--text-dim);">${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}</div>
        </td>
        <td>${api.getStatusBadge(c.current_status)}</td>
        <td style="font-size: 0.8rem; color: #fbbf24;">
          ${c.target_resolution_at ? api.formatDate(c.target_resolution_at) : 'N/A'}
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            <button onclick="openStatusModal(${c.id})" class="btn btn-secondary btn-sm" title="Advance Status">Status</button>
            <button onclick="openInspectionModal(${c.id})" class="btn btn-secondary btn-sm" title="Schedule Field Survey">Inspect</button>
            <button onclick="openRepairModal(${c.id})" class="btn btn-secondary btn-sm" title="Log Crew Work">Repair</button>
            <button onclick="openVerificationModal(${c.id})" class="btn btn-secondary btn-sm" title="Quality Verification">Verify</button>
            <button onclick="simulateDispatch(${c.id})" class="btn btn-secondary btn-sm" title="Simulate Gateway Dispatch" style="color: var(--accent-cyan);">Dispatch</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load complaints: ${err.message}</td></tr>`;
  }
}

// Modal opening functions
function openStatusModal(id) {
  document.getElementById('status-complaint-id').value = id;
  document.getElementById('modal-status-update').classList.add('open');
}

function openInspectionModal(id) {
  document.getElementById('insp-complaint-id').value = id;
  document.getElementById('modal-inspection').classList.add('open');
}

function openRepairModal(id) {
  document.getElementById('repair-complaint-id').value = id;
  document.getElementById('modal-repair').classList.add('open');
}

function openVerificationModal(id) {
  document.getElementById('verif-complaint-id').value = id;
  document.getElementById('modal-verification').classList.add('open');
}

// Close modals
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
}

async function simulateDispatch(id) {
  try {
    const res = await api.post(`/api/complaints/${id}/dispatch-simulation`, {});
    api.showToast(`Simulated dispatch created: ${res.external_reference_id}`, 'success');
  } catch (err) {
    api.showToast(`Dispatch failed: ${err.message}`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAdminComplaints();

  document.getElementById('admin-filter-status')?.addEventListener('change', loadAdminComplaints);
  document.getElementById('admin-refresh-btn')?.addEventListener('click', loadAdminComplaints);

  document.querySelectorAll('.btn-close-modal').forEach(b => {
    b.addEventListener('click', closeAllModals);
  });

  // Scan SLA
  document.getElementById('btn-scan-sla')?.addEventListener('click', async () => {
    try {
      const res = await api.post('/api/notifications/scan-escalations', {});
      api.showToast(`SLA scan completed: ${res.total_escalations_triggered} overdue complaints escalated`, 'info');
      loadAdminComplaints();
    } catch (err) {
      api.showToast(`SLA scan failed: ${err.message}`, 'error');
    }
  });

  // Modal 1 Submit: Status
  document.getElementById('form-status-update')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('status-complaint-id').value;
    const nextStatus = document.getElementById('status-select-next').value;
    const changedBy = document.getElementById('status-changed-by').value;
    const notes = document.getElementById('status-notes').value;

    try {
      await api.put(`/api/complaints/${cid}/status`, {
        status: nextStatus,
        changed_by: changedBy,
        notes: notes || null,
      });
      api.showToast('Complaint status updated successfully', 'success');
      closeAllModals();
      loadAdminComplaints();
    } catch (err) {
      api.showToast(`Status change failed: ${err.message}`, 'error');
    }
  });

  // Modal 2 Submit: Inspection
  document.getElementById('form-inspection')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('insp-complaint-id').value;
    const inspName = document.getElementById('insp-name').value;
    const findings = document.getElementById('insp-findings').value;
    const result = document.getElementById('insp-result').value;

    try {
      await api.post(`/api/complaints/${cid}/inspections`, {
        inspector_name: inspName,
        findings: findings,
        result: result,
      });
      api.showToast('Field inspection survey recorded!', 'success');
      closeAllModals();
      loadAdminComplaints();
    } catch (err) {
      api.showToast(`Inspection save failed: ${err.message}`, 'error');
    }
  });

  // Modal 3 Submit: Repair
  document.getElementById('form-repair')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('repair-complaint-id').value;
    const crew = document.getElementById('repair-crew').value;
    const notes = document.getElementById('repair-notes').value;
    const isCompleted = document.getElementById('repair-is-completed').checked;
    const fileInput = document.getElementById('repair-proof-file');

    const formData = new FormData();
    formData.append('assigned_team', crew);
    formData.append('repair_notes', notes);
    formData.append('is_completed', isCompleted ? 'true' : 'false');
    if (fileInput.files.length) {
      formData.append('file', fileInput.files[0]);
    }

    try {
      await api.upload(`/api/complaints/${cid}/repairs`, formData);
      api.showToast('Contractor repair work logged!', 'success');
      closeAllModals();
      loadAdminComplaints();
    } catch (err) {
      api.showToast(`Repair log failed: ${err.message}`, 'error');
    }
  });

  // Modal 4 Submit: Verification
  document.getElementById('form-verification')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cid = document.getElementById('verif-complaint-id').value;
    const reviewer = document.getElementById('verif-auditor-name').value;
    const verdict = document.getElementById('verif-result-select').value;
    const notes = document.getElementById('verif-notes').value;
    const fileInput = document.getElementById('verif-after-photo');

    const formData = new FormData();
    formData.append('reviewer_name', reviewer);
    formData.append('result', verdict);
    formData.append('verification_notes', notes);
    if (fileInput.files.length) {
      formData.append('after_image', fileInput.files[0]);
    }

    try {
      await api.upload(`/api/complaints/${cid}/verifications`, formData);
      api.showToast(`Verification completed: ${verdict}`, 'success');
      closeAllModals();
      loadAdminComplaints();
    } catch (err) {
      api.showToast(`Verification failed: ${err.message}`, 'error');
    }
  });
});
