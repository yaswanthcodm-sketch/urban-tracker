/**
 * RoadGuard AI — Frontend REST API Client
 */

const API_BASE = window.location.origin.includes(":8000") || window.location.origin.includes(":3000") || window.location.origin.includes(":5173")
  ? window.location.origin
  : "http://localhost:8000";

const api = {
  async get(endpoint) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[API GET ${endpoint}]`, err);
      throw err;
    }
  },

  async post(endpoint, data) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail?.message || err.detail || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[API POST ${endpoint}]`, err);
      throw err;
    }
  },

  async put(endpoint, data) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[API PUT ${endpoint}]`, err);
      throw err;
    }
  },

  async upload(endpoint, formData) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Upload failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[API UPLOAD ${endpoint}]`, err);
      throw err;
    }
  },

  formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  },

  getSeverityBadge(severity) {
    const s = (severity || "Medium").toLowerCase();
    let badgeClass = "badge-medium";
    if (s.includes("critical") || s.includes("high")) badgeClass = "badge-critical";
    if (s.includes("low")) badgeClass = "badge-low";
    return `<span class="badge ${badgeClass}">${severity || "Medium"}</span>`;
  },

  getStatusBadge(status) {
    const st = (status || "Submitted").toLowerCase();
    let badgeClass = "badge-submitted";
    if (st.includes("resolved") || st.includes("closed") || st.includes("approved")) badgeClass = "badge-resolved";
    else if (st.includes("progress")) badgeClass = "badge-in-progress";
    else if (st.includes("verification")) badgeClass = "badge-medium";
    else if (st.includes("scheduled")) badgeClass = "badge-in-progress";
    else if (st.includes("rejected")) badgeClass = "badge-critical";
    return `<span class="badge ${badgeClass}">${status || "Submitted"}</span>`;
  },

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bg = type === "error" ? "#dc2626" : type === "success" ? "#059669" : "#0284c7";
    toast.style.cssText = `background:${bg};color:white;padding:12px 18px;border-radius:8px;font-size:0.875rem;box-shadow:0 4px 15px rgba(0,0,0,0.3);max-width:360px;transition:opacity 0.3s;`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },
};
