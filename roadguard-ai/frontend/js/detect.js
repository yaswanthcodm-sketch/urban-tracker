/**
 * RoadGuard AI — AI Detection Page Controller
 */

let currentDetection = null;
let currentMode = 'image'; // 'image' or 'video'

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('media-file');
  const fileInfo = document.getElementById('file-info');
  const form = document.getElementById('detection-form');
  const btnGeolocate = document.getElementById('btn-geolocate');
  const tabImage = document.getElementById('tab-image');
  const tabVideo = document.getElementById('tab-video');

  // Mode switching
  tabImage.addEventListener('click', () => {
    currentMode = 'image';
    tabImage.style.borderColor = 'var(--accent-cyan)';
    tabVideo.style.borderColor = 'var(--border-light)';
    fileInput.accept = 'image/*';
    document.getElementById('dropzone-text').textContent = 'Drag & drop inspection image here';
  });

  tabVideo.addEventListener('click', () => {
    currentMode = 'video';
    tabVideo.style.borderColor = 'var(--accent-cyan)';
    tabImage.style.borderColor = 'var(--border-light)';
    fileInput.accept = 'video/*';
    document.getElementById('dropzone-text').textContent = 'Drag & drop road survey video clip here';
  });

  // Drag and drop handlers
  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      updateFileInfo(fileInput.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      updateFileInfo(fileInput.files[0]);
    }
  });

  function updateFileInfo(file) {
    fileInfo.style.display = 'block';
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    fileInfo.innerHTML = `<strong>Selected:</strong> ${file.name} (${sizeMb} MB)`;
  }

  // Browser Geolocation
  btnGeolocate.addEventListener('click', () => {
    if (!navigator.geolocation) {
      api.showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    btnGeolocate.textContent = '📍 Acquiring GPS signal...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById('input-lat').value = pos.coords.latitude.toFixed(6);
        document.getElementById('input-lon').value = pos.coords.longitude.toFixed(6);
        btnGeolocate.textContent = `📍 Position Acquired (±${Math.round(pos.coords.accuracy)}m)`;
        api.showToast('GPS coordinates updated successfully', 'success');
      },
      (err) => {
        btnGeolocate.textContent = '📍 Use Browser GPS Position';
        api.showToast(`GPS access failed: ${err.message}`, 'error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  // Submit Form for Detection
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!fileInput.files.length) {
      api.showToast('Please select an image or video file to analyze.', 'error');
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latitude', document.getElementById('input-lat').value);
    formData.append('longitude', document.getElementById('input-lon').value);
    formData.append('location_source', 'Inspector Camera / Geotagged Exif');
    formData.append('road_name', document.getElementById('input-road').value);

    const loader = document.getElementById('loader');
    const btnSubmit = document.getElementById('btn-run-ai');
    loader.style.display = 'block';
    btnSubmit.disabled = true;

    try {
      const endpoint = currentMode === 'video' ? '/api/detections/video' : '/api/detections/upload';
      const result = await api.upload(endpoint, formData);

      if (currentMode === 'video') {
        api.showToast(`Video analyzed! Found ${result.total_detections_found} defect events.`, 'success');
        if (result.detections && result.detections.length > 0) {
          const first = result.detections[0];
          displayDetectionResult({
            id: first.id,
            defect_type: first.defect_type,
            confidence: first.confidence,
            estimated_severity: first.severity,
            evidence_path: first.annotated_path || first.evidence_path,
            annotated_path: first.annotated_path,
            review_status: 'pending',
          });
        }
      } else {
        api.showToast('AI Detection complete!', 'success');
        displayDetectionResult(result.detection);
      }
    } catch (err) {
      api.showToast(`Detection failed: ${err.message}`, 'error');
    } finally {
      loader.style.display = 'none';
      btnSubmit.disabled = false;
    }
  });

  function displayDetectionResult(det) {
    currentDetection = det;
    document.getElementById('empty-results').style.display = 'none';
    document.getElementById('results-content').style.display = 'block';

    const imgElem = document.getElementById('result-image');
    imgElem.src = det.annotated_path || det.evidence_path;

    document.getElementById('res-defect-type').textContent = det.defect_type;
    document.getElementById('res-confidence').textContent = `${Math.round(det.confidence * 100)}%`;
    document.getElementById('res-severity').innerHTML = api.getSeverityBadge(det.estimated_severity);
    document.getElementById('res-detection-id').textContent = `#${det.id}`;

    const badgeStatus = document.getElementById('badge-review-status');
    badgeStatus.textContent = det.review_status.toUpperCase();
    badgeStatus.className = `badge ${det.review_status === 'confirmed' ? 'badge-resolved' : 'badge-submitted'}`;
  }

  // Inspector Review Actions
  document.getElementById('btn-confirm-review')?.addEventListener('click', async () => {
    if (!currentDetection) return;
    await submitReview('confirmed');
  });

  document.getElementById('btn-reject-review')?.addEventListener('click', async () => {
    if (!currentDetection) return;
    await submitReview('rejected');
  });

  async function submitReview(status) {
    const correctedType = document.getElementById('review-correct-type').value;
    const correctedSev = document.getElementById('review-correct-severity').value;

    try {
      const res = await api.put(`/api/detections/${currentDetection.id}/review`, {
        review_status: status,
        corrected_defect_type: correctedType || null,
        corrected_severity: correctedSev || null,
        notes: `Reviewed by officer: ${status}`,
      });

      api.showToast(res.message, 'success');
      currentDetection.review_status = res.review_status;
      if (res.defect_type) currentDetection.defect_type = res.defect_type;
      if (res.estimated_severity) currentDetection.estimated_severity = res.estimated_severity;
      displayDetectionResult(currentDetection);
    } catch (err) {
      api.showToast(`Review update failed: ${err.message}`, 'error');
    }
  }

  // Promote to Complaint
  document.getElementById('btn-generate-complaint')?.addEventListener('click', async () => {
    if (!currentDetection) return;
    const roadName = document.getElementById('input-road').value;

    try {
      const res = await api.post(`/api/detections/${currentDetection.id}/generate-complaint?road_name=${encodeURIComponent(roadName)}`, {});
      api.showToast(`Official Complaint registered: ${res.public_tracking_id}`, 'success');

      // Replace actions with tracking link
      const actionsDiv = document.querySelector('#results-content div[style*="border-top"]');
      if (actionsDiv) {
        actionsDiv.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.1rem; font-weight: 700; color: #34d399; margin-bottom: 0.25rem;">Complaint Generated Successfully!</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              Tracking ID: <strong style="color: white;">${res.public_tracking_id}</strong> &bull; Assigned to: <strong style="color: var(--accent-cyan);">${res.assigned_department}</strong>
            </div>
            <a href="/static/track.html?id=${res.public_tracking_id}" class="btn btn-primary btn-sm">
              <span>🔍</span> Track Complaint Live Timeline
            </a>
          </div>
        `;
      }
    } catch (err) {
      api.showToast(`Failed to generate complaint: ${err.message}`, 'error');
    }
  });

});
