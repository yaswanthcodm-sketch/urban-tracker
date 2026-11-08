/**
 * RoadGuard AI — Satellite Screening Controller
 */

let satMap = null;
let aoiRectangle = null;
let anomalyMarkersLayer = null;

function initSatelliteMap() {
  satMap = L.map('satellite-map').setView([16.5195, 80.6308], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors | RoadGuard AI Satellite Engine'
  }).addTo(satMap);

  anomalyMarkersLayer = L.layerGroup().addTo(satMap);
}

async function runScreening() {
  if (!satMap) return;

  const bounds = satMap.getBounds();
  const btn = document.getElementById('btn-run-screening');
  const badge = document.getElementById('sat-status-badge');
  const list = document.getElementById('anomalies-list');

  btn.disabled = true;
  btn.textContent = '🛰️ Processing Reflectance Bands...';
  badge.textContent = 'ANALYZING AOI';
  badge.className = 'badge badge-in-progress';

  try {
    const payload = {
      min_lat: bounds.getSouth(),
      max_lat: bounds.getNorth(),
      min_lon: bounds.getWest(),
      max_lon: bounds.getEast(),
      sensor_provider: 'Sentinel-2 / Cartosat-3 Optical High-Res',
      target_corridor_name: 'Selected Regional Corridor',
    };

    const res = await api.post('/api/satellite/analyze-aoi', payload);
    const meta = res.metadata;
    const anomalies = meta.flagged_segments || [];

    badge.textContent = 'SCREENING COMPLETE';
    badge.className = 'badge badge-resolved';

    // Draw AOI bounding box
    if (aoiRectangle) satMap.removeLayer(aoiRectangle);
    aoiRectangle = L.rectangle(bounds, {
      color: '#06b6d4',
      weight: 2,
      fillColor: '#06b6d4',
      fillOpacity: 0.08,
    }).addTo(satMap);

    // Update metadata panel
    document.getElementById('sat-metadata').innerHTML = `
      <div style="margin-bottom: 0.35rem;"><strong>Provider:</strong> ${meta.sensor_provider}</div>
      <div style="margin-bottom: 0.35rem;"><strong>Acquisition Date:</strong> ${meta.acquisition_date} &bull; <strong>Cloud Cover:</strong> ${meta.cloud_cover_percent}%</div>
      <div style="margin-bottom: 0.35rem;"><strong>GSD:</strong> ${meta.ground_sample_distance}</div>
      <div><strong>Model:</strong> ${meta.screening_model}</div>
    `;

    // Render anomalies
    anomalyMarkersLayer.clearLayers();

    if (anomalies.length === 0) {
      list.innerHTML = '<div style="text-align: center; color: #34d399; padding: 1.5rem;">No macroscopic corridor anomalies detected within this AOI.</div>';
    } else {
      list.innerHTML = anomalies.map(a => `
        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-left: 3px solid #f59e0b; padding: 0.75rem; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <strong style="color: white; font-size: 0.85rem;">${a.segment_id}</strong>
            <span class="badge badge-medium">${a.estimated_priority}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--accent-cyan);">${a.road_name}</div>
          <div style="font-size: 0.775rem; color: var(--text-muted); margin: 0.25rem 0;">${a.anomaly_type}</div>
          <div style="font-size: 0.725rem; color: var(--text-dim);">
            <strong>Action:</strong> ${a.recommended_action}
          </div>
        </div>
      `).join('');

      // Add pins to map
      anomalies.forEach(a => {
        const marker = L.circleMarker([a.latitude, a.longitude], {
          radius: 8,
          color: '#f59e0b',
          fillColor: '#ef4444',
          fillOpacity: 0.85,
        }).addTo(anomalyMarkersLayer);

        marker.bindPopup(`
          <div style="color: #111;">
            <strong>${a.segment_id}</strong><br>
            <span>${a.road_name}</span><br>
            <small style="color: #d97706;">${a.anomaly_type}</small><br>
            <strong>Recommended:</strong> ${a.recommended_action}
          </div>
        `);
      });

      document.getElementById('sat-action-box').style.display = 'block';
    }

    api.showToast(`AOI screening complete: ${anomalies.length} potential anomalies flagged`, 'success');
  } catch (err) {
    api.showToast(`Screening failed: ${err.message}`, 'error');
    badge.textContent = 'SCAN FAILED';
    badge.className = 'badge badge-critical';
  } finally {
    btn.disabled = false;
    btn.textContent = '🛰️ Run Optical Screening on AOI';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSatelliteMap();
  document.getElementById('btn-run-screening')?.addEventListener('click', runScreening);
  document.getElementById('btn-dispatch-drone')?.addEventListener('click', () => {
    api.showToast('Inspection survey work-order queued for corridor patrol', 'success');
  });
});
