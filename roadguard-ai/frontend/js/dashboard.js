/**
 * RoadGuard AI — Dashboard Controller
 */

let severityChartInstance = null;
let trendsChartInstance = null;

async function loadDashboardData() {
  try {
    // 1. Fetch Analytics Overview
    const stats = await api.get('/api/analytics/overview');

    // Update KPI metrics
    document.getElementById('kpi-detections').textContent = stats.total_detections || 0;
    document.getElementById('kpi-complaints').textContent = stats.total_complaints || 0;
    document.getElementById('kpi-pending-ack').textContent = stats.pending_acknowledgment || 0;
    document.getElementById('kpi-high-priority').textContent = stats.high_priority_defects || 0;
    document.getElementById('kpi-repairs').textContent = stats.repairs_in_progress || 0;
    document.getElementById('kpi-overdue').textContent = stats.overdue_complaints || 0;
    document.getElementById('kpi-awaiting-verif').textContent = stats.awaiting_verification || 0;
    document.getElementById('kpi-verified').textContent = stats.verified_repairs || 0;

    // 2. Render Severity Donut Chart
    renderSeverityChart(stats.severity_distribution || {});

    // 3. Render Monthly Trends Line Chart
    renderTrendsChart(stats.monthly_trends || []);

    // 4. Render Department Performance Table
    renderDepartmentTable(stats.department_performance || []);

    // 5. Fetch Recent Complaints
    loadRecentComplaints();

    // 6. Fetch Recent Detections
    loadRecentDetections();

  } catch (err) {
    console.error('Error loading dashboard data:', err);
    api.showToast('Failed to refresh dashboard analytics. Ensure backend is running.', 'error');
  }
}

function renderSeverityChart(dist) {
  const ctx = document.getElementById('chart-severity').getContext('2d');
  if (severityChartInstance) severityChartInstance.destroy();

  const labels = Object.keys(dist);
  const data = Object.values(dist);

  const colors = {
    'Critical': '#ef4444',
    'High': '#f97316',
    'Medium': '#f59e0b',
    'Low': '#38bdf8',
  };

  const bgColors = labels.map(l => colors[l] || '#06b6d4');

  severityChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data.length > 0 && data.some(v => v > 0) ? data : [1],
        backgroundColor: data.length > 0 && data.some(v => v > 0) ? bgColors : ['#334155'],
        borderColor: '#1a284c',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#f8fafc', font: { size: 12 } }
        }
      },
      cutout: '65%'
    }
  });
}

function renderTrendsChart(trends) {
  const ctx = document.getElementById('chart-trends').getContext('2d');
  if (trendsChartInstance) trendsChartInstance.destroy();

  const labels = trends.map(t => t.month);
  const reportedData = trends.map(t => t.reported);
  const resolvedData = trends.map(t => t.resolved);

  trendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Defects Reported',
          data: reportedData,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
        {
          label: 'Repairs Verified',
          data: resolvedData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
      },
      plugins: {
        legend: { labels: { color: '#f8fafc' } }
      }
    }
  });
}

function renderDepartmentTable(depts) {
  const tbody = document.getElementById('table-department-body');
  if (!depts || depts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No departmental data recorded yet.</td></tr>';
    return;
  }

  tbody.innerHTML = depts.map(d => `
    <tr>
      <td><strong>${d.department_name}</strong></td>
      <td><span class="badge badge-low">${d.jurisdiction}</span></td>
      <td>${d.sla_hours} hrs</td>
      <td><strong>${d.total_assigned}</strong></td>
      <td><span class="badge badge-in-progress">${d.in_progress}</span></td>
      <td><span class="badge badge-resolved">${d.resolved}</span></td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="flex:1; background: #0b1329; height: 6px; border-radius:3px; overflow:hidden;">
            <div style="width: ${d.resolution_rate_percent}%; background: #10b981; height: 100%;"></div>
          </div>
          <span style="font-size:0.75rem; font-weight:700;">${d.resolution_rate_percent}%</span>
        </div>
      </td>
    </tr>
  `).join('');
}

async function loadRecentComplaints() {
  const tbody = document.getElementById('table-recent-complaints');
  try {
    const list = await api.get('/api/complaints?limit=5');
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No complaints recorded yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td><a href="/static/track.html?id=${c.public_tracking_id}"><strong>${c.public_tracking_id}</strong></a></td>
        <td>${c.defect_type}</td>
        <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.road_name}</td>
        <td>${api.getStatusBadge(c.current_status)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #ef4444;">Failed to load complaints.</td></tr>';
  }
}

async function loadRecentDetections() {
  const tbody = document.getElementById('table-recent-detections');
  try {
    const list = await api.get('/api/detections?limit=5');
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No detections processed yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(d => `
      <tr>
        <td><strong>${d.defect_type}</strong></td>
        <td>${Math.round(d.confidence * 100)}%</td>
        <td>${api.getSeverityBadge(d.estimated_severity)}</td>
        <td style="font-size:0.75rem; color: var(--text-muted);">${api.formatDate(d.detected_at)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #ef4444;">Failed to load detections.</td></tr>';
  }
}

// Attach listener
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  document.getElementById('btn-refresh')?.addEventListener('click', () => {
    loadDashboardData();
    api.showToast('Dashboard metrics refreshed', 'success');
  });
});
