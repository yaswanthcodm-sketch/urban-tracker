/**
 * RoadGuard AI — Interactive Map Controller
 */

let mapInstance = null;
let markersLayer = null;
let allComplaints = [];

function initMap() {
  mapInstance = L.map('damage-map').setView([16.5195, 80.6308], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors | RoadGuard AI Spatial'
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
}

function getMarkerColor(complaint) {
  const status = (complaint.current_status || '').toLowerCase();
  if (status === 'resolved' || status === 'closed') return '#10b981';

  const sev = (complaint.severity || 'Medium').toLowerCase();
  if (sev.includes('critical')) return '#ef4444';
  if (sev.includes('high')) return '#f97316';
  if (sev.includes('low')) return '#38bdf8';
  return '#f59e0b'; // Medium
}

async function loadMapComplaints() {
  const search = document.getElementById('map-search').value.trim();
  const defect = document.getElementById('filter-defect').value;
  const severity = document.getElementById('filter-severity').value;
  const status = document.getElementById('filter-status').value;
  const unresolvedOnly = document.getElementById('filter-unresolved').checked;

  let url = `/api/complaints?limit=200`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (severity) url += `&severity=${encodeURIComponent(severity)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;

  try {
    const list = await api.get(url);
    allComplaints = list;

    // Filter unresolved in client if requested
    let filtered = list;
    if (unresolvedOnly && !status) {
      filtered = filtered.filter(c => !['Resolved', 'Closed', 'Rejected'].includes(c.current_status));
    }
    if (defect) {
      filtered = filtered.filter(c => c.defect_type.toLowerCase().includes(defect.toLowerCase()));
    }

    renderMarkers(filtered);
  } catch (err) {
    api.showToast(`Failed to load road damage markers: ${err.message}`, 'error');
  }
}

function renderMarkers(complaints) {
  markersLayer.clearLayers();

  if (!complaints || complaints.length === 0) {
    api.showToast('No road defects matched the current filters.', 'info');
    return;
  }

  const bounds = [];

  complaints.forEach(c => {
    const color = getMarkerColor(c);
    const marker = L.circleMarker([c.latitude, c.longitude], {
      radius: 9,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(markersLayer);

    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 0.85rem; color: #0b1329;">
        <strong style="color: #0284c7;">${c.public_tracking_id}</strong><br>
        <strong>${c.defect_type}</strong> (${c.severity})<br>
        <span style="font-size: 0.75rem; color: #475569;">${c.road_name}</span><br>
        <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;">Status: ${c.current_status}</span>
      </div>
    `);

    marker.on('click', () => {
      showDefectInDrawer(c);
    });

    bounds.push([c.latitude, c.longitude]);
  });

  if (bounds.length > 0) {
    mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
}

function showDefectInDrawer(c) {
  document.getElementById('drawer-empty').style.display = 'none';
  const content = document.getElementById('drawer-content');
  content.style.display = 'flex';

  document.getElementById('drawer-badge-status').textContent = c.current_status;
  document.getElementById('drawer-badge-status').className = `badge ${c.current_status === 'Resolved' ? 'badge-resolved' : 'badge-in-progress'}`;

  const img = document.getElementById('drawer-img');
  img.src = c.evidence_path || '/static/assets/placeholder.jpg';

  document.getElementById('drawer-tracking-id').textContent = c.public_tracking_id;
  document.getElementById('drawer-defect-type').textContent = c.defect_type;
  document.getElementById('drawer-severity-badge').innerHTML = api.getSeverityBadge(c.severity);
  document.getElementById('drawer-road-name').textContent = c.road_name;
  document.getElementById('drawer-coords').textContent = `GPS: ${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)}`;
  document.getElementById('drawer-desc').textContent = c.description || 'No additional field notes provided.';

  document.getElementById('drawer-track-link').href = `/static/track.html?id=${c.public_tracking_id}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadMapComplaints();

  document.getElementById('btn-apply-filters')?.addEventListener('click', loadMapComplaints);
  document.getElementById('filter-unresolved')?.addEventListener('change', loadMapComplaints);
  document.getElementById('filter-defect')?.addEventListener('change', loadMapComplaints);
  document.getElementById('filter-severity')?.addEventListener('change', loadMapComplaints);
  document.getElementById('filter-status')?.addEventListener('change', loadMapComplaints);

  document.getElementById('map-search')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadMapComplaints();
  });
});
