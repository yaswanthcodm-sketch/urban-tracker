/**
 * RoadGuard AI — CCTV Cameras Controller
 */

let activeCapturedDetectionId = null;

async function loadCameras() {
  const grid = document.getElementById('camera-grid');
  try {
    const cameras = await api.get('/api/cameras');
    if (!cameras || cameras.length === 0) {
      grid.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No cameras configured yet. Click "Register New Camera" above.</div>';
      return;
    }

    grid.innerHTML = cameras.map(cam => `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="card-header" style="margin-bottom: 0.75rem; padding-bottom: 0.5rem;">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: white;">${cam.name}</h4>
            <span class="badge ${cam.connection_status === 'online' ? 'badge-resolved' : 'badge-critical'}">
              ${cam.connection_status.toUpperCase()}
            </span>
          </div>

          <div style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <div><strong>Corridor:</strong> ${cam.road_segment_id || 'Unassigned'}</div>
            <div><strong>Location:</strong> ${cam.latitude.toFixed(4)}, ${cam.longitude.toFixed(4)}</div>
            <div style="margin-top: 0.25rem;">
              <strong>Stream Config:</strong> 
              <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; color: var(--accent-cyan);">
                ${cam.stream_configuration_reference}
              </code>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.35rem;">
              Last heartbeat: ${api.formatDate(cam.last_seen_at)}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <button onclick="testCameraConnection(${cam.id})" class="btn btn-secondary btn-sm" style="flex: 1;">
            <span>🔄</span> Ping
          </button>
          <button onclick="captureAndDetect(${cam.id}, '${escapeHtml(cam.name)}')" class="btn btn-primary btn-sm" style="flex: 1.5;">
            <span>⚡</span> Capture & Detect
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<div class="card" style="grid-column: 1/-1; color: #ef4444; text-align: center;">Failed to load camera feeds: ${err.message}</div>`;
  }
}

function escapeHtml(str) {
  return (str || '').replace(/'/g, "\\'");
}

async function testCameraConnection(id) {
  try {
    api.showToast(`Pinging camera #${id}...`, 'info');
    const res = await api.post(`/api/cameras/${id}/test-connection`, {});
    api.showToast(`${res.name}: ${res.details}`, res.status === 'online' ? 'success' : 'error');
    loadCameras();
  } catch (err) {
    api.showToast(`Ping failed: ${err.message}`, 'error');
  }
}

async function captureAndDetect(id, name) {
  const modal = document.getElementById('capture-modal');
  const loader = document.getElementById('modal-loader');
  const content = document.getElementById('modal-content');

  document.getElementById('modal-cam-title').textContent = `AI Analysis: ${name}`;
  loader.style.display = 'block';
  content.style.display = 'none';
  modal.classList.add('open');

  try {
    const res = await api.post(`/api/cameras/${id}/capture-and-detect`, {});
    activeCapturedDetectionId = res.detection_id;

    document.getElementById('modal-frame-img').src = res.annotated_path || res.evidence_path;
    document.getElementById('modal-defect').textContent = res.defect_type;
    document.getElementById('modal-conf').textContent = `${Math.round(res.confidence * 100)}%`;
    document.getElementById('modal-sev').innerHTML = api.getSeverityBadge(res.estimated_severity);

    loader.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    loader.style.display = 'none';
    api.showToast(`Capture failed: ${err.message}`, 'error');
    modal.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCameras();

  // Close modals
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    document.getElementById('capture-modal').classList.remove('open');
  });

  document.getElementById('btn-close-add-modal')?.addEventListener('click', () => {
    document.getElementById('add-camera-modal').classList.remove('open');
  });

  // Open Add Camera Modal
  document.getElementById('btn-add-camera')?.addEventListener('click', () => {
    document.getElementById('add-camera-modal').classList.add('open');
  });

  // Add Camera Form Submit
  document.getElementById('add-camera-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('add-cam-name').value,
      stream_configuration_reference: document.getElementById('add-cam-url').value,
      latitude: parseFloat(document.getElementById('add-cam-lat').value),
      longitude: parseFloat(document.getElementById('add-cam-lon').value),
      road_segment_id: document.getElementById('add-cam-segment').value || null,
      feed_type: 'stream',
    };

    try {
      await api.post('/api/cameras', payload);
      api.showToast('Camera registered successfully!', 'success');
      document.getElementById('add-camera-modal').classList.remove('open');
      document.getElementById('add-camera-form').reset();
      loadCameras();
    } catch (err) {
      api.showToast(`Registration failed: ${err.message}`, 'error');
    }
  });

  // Generate Complaint from modal
  document.getElementById('modal-btn-generate')?.addEventListener('click', async () => {
    if (!activeCapturedDetectionId) return;
    try {
      const res = await api.post(`/api/detections/${activeCapturedDetectionId}/generate-complaint`, {});
      api.showToast(`Complaint registered: ${res.public_tracking_id}`, 'success');
      document.getElementById('capture-modal').classList.remove('open');
      window.location.href = `/static/track.html?id=${res.public_tracking_id}`;
    } catch (err) {
      api.showToast(`Failed to generate complaint: ${err.message}`, 'error');
    }
  });
});
