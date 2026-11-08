/**
 * RoadGuard AI — Complaint Tracking Controller
 */

async function fetchComplaintDetails(trackingId) {
  if (!trackingId || !trackingId.trim()) return;

  const cleanId = trackingId.trim().toUpperCase();
  const loader = document.getElementById('track-loader');
  const details = document.getElementById('track-details');

  loader.style.display = 'block';
  details.style.display = 'none';

  try {
    const c = await api.get(`/api/complaints/track/${encodeURIComponent(cleanId)}`);

    // Update summary
    document.getElementById('view-tracking-id').textContent = c.public_tracking_id;
    document.getElementById('view-status-badge').innerHTML = api.getStatusBadge(c.current_status);
    document.getElementById('view-defect-type').textContent = c.defect_type;
    document.getElementById('view-severity').innerHTML = api.getSeverityBadge(c.severity);
    document.getElementById('view-priority').textContent = c.priority;
    document.getElementById('view-department').textContent = c.department ? c.department.name : 'State PWD (Default Assigned)';
    document.getElementById('view-sla').textContent = c.target_resolution_at ? api.formatDate(c.target_resolution_at) : 'Under Review';
    document.getElementById('view-road-name').textContent = c.road_name;
    document.getElementById('view-coords').textContent = `${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)}`;
    document.getElementById('view-desc').textContent = c.description || 'No additional notes registered.';

    // Check for repair verification records
    const verifCard = document.getElementById('card-verification-proof');
    if (c.verifications && c.verifications.length > 0) {
      const v = c.verifications[c.verifications.length - 1];
      verifCard.style.display = 'block';

      document.getElementById('badge-verif-result').textContent = v.result.toUpperCase();
      document.getElementById('badge-verif-result').className = `badge ${v.result.toLowerCase() === 'approved' ? 'badge-resolved' : 'badge-critical'}`;
      document.getElementById('img-verif-before').src = v.before_evidence_reference || c.evidence_path || '/static/assets/placeholder.jpg';
      document.getElementById('img-verif-after').src = v.after_evidence_reference || '/static/assets/placeholder.jpg';
      document.getElementById('view-verif-notes').textContent = v.verification_notes || 'Verified on-site.';
      document.getElementById('view-verif-score').textContent = v.similarity_score ? `${Math.round(v.similarity_score * 100)}% Match` : 'N/A';
    } else {
      verifCard.style.display = 'none';
    }

    // Render Timeline
    const timeline = document.getElementById('timeline-container');
    const history = c.status_history || [];

    if (history.length === 0) {
      timeline.innerHTML = '<div style="color: var(--text-muted);">No timeline updates registered yet.</div>';
    } else {
      timeline.innerHTML = history.map(h => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-title">${h.new_status}</div>
          <div class="timeline-meta">${api.formatDate(h.changed_at)} &bull; Changed by: <strong style="color: var(--accent-cyan);">${h.changed_by}</strong></div>
          <div class="timeline-body">${h.notes || 'Status updated in system.'}</div>
        </div>
      `).join('');
    }

    loader.style.display = 'none';
    details.style.display = 'block';

  } catch (err) {
    loader.style.display = 'none';
    api.showToast(`Lookup failed: ${err.message}`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('track-id-input');
  const btn = document.getElementById('btn-search-tracking');

  btn.addEventListener('click', () => {
    fetchComplaintDetails(input.value);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchComplaintDetails(input.value);
  });

  // Check URL query param e.g. ?id=RD-2026-A109F2
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');
  if (idFromUrl) {
    input.value = idFromUrl;
    fetchComplaintDetails(idFromUrl);
  }
});
