/**
 * RoadGuard AI — Citizen Complaint Submission Controller
 */

let pinMap = null;
let pinMarker = null;
let pendingComplaintData = null;
let duplicateComplaintId = null;

function initPinMap() {
  const initialLat = 16.5195;
  const initialLon = 80.6308;

  pinMap = L.map('pin-map').setView([initialLat, initialLon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(pinMap);

  // Draggable pin marker
  pinMarker = L.marker([initialLat, initialLon], {
    draggable: true
  }).addTo(pinMap);

  pinMarker.on('dragend', (e) => {
    const pos = e.target.getLatLng();
    document.getElementById('report-lat').value = pos.lat.toFixed(6);
    document.getElementById('report-lon').value = pos.lng.toFixed(6);
  });

  // Sync inputs back to map pin
  ['report-lat', 'report-lon'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      const lat = parseFloat(document.getElementById('report-lat').value);
      const lon = parseFloat(document.getElementById('report-lon').value);
      if (!isNaN(lat) && !isNaN(lon)) {
        pinMarker.setLatLng([lat, lon]);
        pinMap.panTo([lat, lon]);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPinMap();

  const fileInput = document.getElementById('report-file');
  const dropzone = document.getElementById('report-dropzone');
  const fileInfo = document.getElementById('report-file-info');
  const form = document.getElementById('citizen-report-form');

  // File pickers
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      fileInfo.style.display = 'block';
      fileInfo.innerHTML = `<strong>Selected Photo:</strong> ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
    }
  });

  // Browser Geolocation
  document.getElementById('btn-citizen-gps')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      api.showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    const btn = document.getElementById('btn-citizen-gps');
    btn.textContent = '📍 Reading GPS position...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        document.getElementById('report-lat').value = lat.toFixed(6);
        document.getElementById('report-lon').value = lon.toFixed(6);
        pinMarker.setLatLng([lat, lon]);
        pinMap.setView([lat, lon], 15);
        btn.textContent = `📍 Position Set (±${Math.round(pos.coords.accuracy)}m)`;
        api.showToast('GPS coordinates acquired from device', 'success');
      },
      (err) => {
        btn.textContent = '📍 Acquire GPS from Mobile / Browser';
        api.showToast(`GPS error: ${err.message}`, 'error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lat = parseFloat(document.getElementById('report-lat').value);
    const lon = parseFloat(document.getElementById('report-lon').value);
    const defectType = document.getElementById('report-defect-type').value;

    pendingComplaintData = {
      defect_type: defectType,
      severity: document.getElementById('report-severity').value,
      description: document.getElementById('report-desc').value || null,
      road_name: document.getElementById('report-road-name').value,
      latitude: lat,
      longitude: lon,
      reporter_name: document.getElementById('report-user-name').value || 'Citizen Reporter',
      reporter_contact: document.getElementById('report-user-contact').value || null,
      source_type: 'citizen_report',
    };

    // 1. Check for duplicates within 50m
    try {
      const dupCheck = await api.post('/api/complaints/check-duplicate', {
        latitude: lat,
        longitude: lon,
        defect_type: defectType,
        threshold_meters: 50.0,
      });

      if (dupCheck.is_duplicate && dupCheck.existing_complaints.length > 0) {
        showDuplicateModal(dupCheck.existing_complaints[0]);
        return;
      }
    } catch (err) {
      console.warn('Duplicate check non-blocking error:', err);
    }

    // No duplicate found -> proceed
    await executeSubmission(false);
  });

  function showDuplicateModal(dup) {
    duplicateComplaintId = dup.tracking_id;
    const modal = document.getElementById('duplicate-modal');
    const box = document.getElementById('dup-details-box');

    box.innerHTML = `
      <div style="font-size: 0.95rem; font-weight: 700; color: white; margin-bottom: 0.25rem;">
        Complaint ID: <span style="color: var(--accent-cyan);">${dup.tracking_id}</span>
      </div>
      <div style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.25rem;">
        <strong>Location:</strong> ${dup.road_name} (approx. ${dup.distance_meters} meters away)
      </div>
      <div style="font-size: 0.825rem; color: var(--text-muted);">
        <strong>Current Status:</strong> ${api.getStatusBadge(dup.status)}
      </div>
    `;

    modal.classList.add('open');
  }

  document.getElementById('btn-close-dup-modal')?.addEventListener('click', () => {
    document.getElementById('duplicate-modal').classList.remove('open');
  });

  document.getElementById('btn-view-existing-dup')?.addEventListener('click', () => {
    if (duplicateComplaintId) {
      window.location.href = `/static/track.html?id=${duplicateComplaintId}`;
    }
  });

  document.getElementById('btn-submit-anyway')?.addEventListener('click', async () => {
    document.getElementById('duplicate-modal').classList.remove('open');
    await executeSubmission(true);
  });

  async function executeSubmission(allowDuplicate = false) {
    const btn = document.getElementById('btn-submit-report');
    btn.disabled = true;
    btn.textContent = '🚀 Submitting complaint & resolving authority...';

    try {
      // If photo attached, upload it first to get evidence path
      if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('latitude', pendingComplaintData.latitude);
        formData.append('longitude', pendingComplaintData.longitude);
        formData.append('road_name', pendingComplaintData.road_name);

        const uploadRes = await api.upload('/api/detections/upload', formData);
        pendingComplaintData.evidence_path = uploadRes.detection.annotated_path || uploadRes.detection.evidence_path;
        pendingComplaintData.detection_id = uploadRes.detection.id;
      }

      const res = await api.post(`/api/complaints?allow_duplicate=${allowDuplicate}`, pendingComplaintData);
      api.showToast(`Complaint lodged successfully: ${res.public_tracking_id}`, 'success');

      // Redirect to tracking page
      setTimeout(() => {
        window.location.href = `/static/track.html?id=${res.public_tracking_id}`;
      }, 1200);

    } catch (err) {
      api.showToast(`Submission failed: ${err.message}`, 'error');
      btn.disabled = false;
      btn.textContent = '🚀 Submit Complaint & Generate Tracking ID';
    }
  }

});
