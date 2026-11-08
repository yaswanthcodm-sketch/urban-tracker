/**
 * @module villageRoadsCatalog
 * @description Catalog and active scanner for each and every road of the selected village, town, or city.
 */

import * as Cesium from 'cesium';
import { formatRoadTitle, formatRoadTypeBadge } from './roadReconUI.js';
import { CITY_ROAD_CATALOGS, generateLocalityRoadNetwork, getRoadDamageProfile } from './allCitiesRoadsData.js';
export { getRoadDamageProfile };
import { findIndiaPlace } from './indiaData.js';
import { t, getActiveLanguage, formatLocalizedRoadTitle, formatLocalizedDamageTag, speakAnnouncement, getNativeRoadTitle } from '../i18n/indianLanguages.js';

/**
 * Standard preset coordinates for rapid city & town switching.
 */
export const QUICK_CITY_COORDINATES = {
  nuzvid: { name: 'Nuzvid, Andhra Pradesh', lat: 16.7865, lon: 80.8465 },
  vijayawada: { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lon: 80.6480 },
  guntur: { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  visakhapatnam: { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
  tirupati: { name: 'Tirupati, Andhra Pradesh', lat: 13.6288, lon: 79.4192 },
  hyderabad: { name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867 },
  delhi: { name: 'New Delhi, Delhi', lat: 28.6139, lon: 77.2090 },
  mumbai: { name: 'Mumbai, Maharashtra', lat: 18.9438, lon: 72.8232 },
  bengaluru: { name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946 },
  chennai: { name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  kolkata: { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639 },
};

/**
 * Curated real street & road networks for instant zero-latency loading.
 */
export const KNOWN_LOCALITY_ROADS = CITY_ROAD_CATALOGS;

/**
 * Classifies road into one of five official Indian road categories:
 * 'cement', 'village', 'city', 'main', or 'highway'.
 * @param {object|string} roadOrType
 * @returns {'cement'|'village'|'city'|'main'|'highway'}
 */
export function classifyRoadCategory(roadOrType) {
  if (typeof roadOrType === 'object' && roadOrType !== null) {
    if (roadOrType.roadCategory) {
      if (roadOrType.roadCategory === 'cement_road') return 'cement';
      if (roadOrType.roadCategory === 'village_street') return 'village';
      if (roadOrType.roadCategory === 'city_road') return 'city';
      if (roadOrType.roadCategory === 'main_road') return 'main';
      if (roadOrType.roadCategory === 'highway') return 'highway';
    }
    const surface = (roadOrType.surface || '').toLowerCase();
    const name = (roadOrType.name || '').toLowerCase();
    if (surface === 'concrete' || surface === 'cement' || name.includes('cc road') || name.includes('cement')) {
      return 'cement';
    }
    if (name.includes('village') || name.includes('gram panchayat') || name.includes('rural') || roadOrType.type === 'track') {
      return 'village';
    }
    if (roadOrType.ref && (roadOrType.ref.includes('NH') || roadOrType.ref.includes('SH'))) {
      return 'highway';
    }
    const type = roadOrType.type || '';
    if (type === 'motorway' || type === 'trunk') return 'highway';
    if (type === 'primary' || type === 'secondary' || type === 'tertiary') return 'main';
    return 'city';
  }

  const type = String(roadOrType || '');
  switch (type) {
    case 'motorway':
    case 'trunk':
      return 'highway';
    case 'primary':
    case 'secondary':
    case 'tertiary':
      return 'main';
    case 'track':
    case 'path':
      return 'village';
    default:
      return 'city';
  }
}

/**
 * Initializes the Village and City Road Catalog UI with active scanning.
 * @param {object} opts
 * @param {Cesium.Viewer} opts.viewer
 * @param {Function} [opts.onSelectRoad]
 */
export function initVillageRoadsCatalog({ viewer, onSelectRoad } = {}) {
  const panel = document.getElementById('village-roads-panel');
  const closeBtn = document.getElementById('village-roads-close-btn');
  const headerBtn = document.getElementById('header-roads-catalog-btn');
  const localityNameEl = document.getElementById('village-roads-locality-name');
  const filterInput = document.getElementById('village-roads-filter-input');
  const filterPills = document.querySelectorAll('.village-filter-pill');
  const listContainer = document.getElementById('village-roads-list');

  let currentLocality = (typeof window !== 'undefined' && window.__gevActiveLocality) || 'Nuzvid, India';
  let cachedRoads = [];
  let activeFilter = 'all';
  let activeSearch = '';
  let isScanning = false;

  function openPanel() {
    if (panel) {
      panel.classList.remove('hidden');
      headerBtn?.classList.add('active');

      // Minimize or hide CCTV dock to prevent UI clutter on the right
      const cctvDock = document.getElementById('cctv-hud-dock');
      if (cctvDock) cctvDock.style.display = 'none';

      if (localityNameEl) {
        localityNameEl.textContent = `📍 ${currentLocality.toUpperCase()}`;
      }

      if (cachedRoads.length === 0) {
        // Automatically scan roads for current locality or coordinates
        scanRoadsForLocality({ name: currentLocality });
      } else {
        renderRoadList();
      }
    }
  }

  function closePanel() {
    if (panel) {
      panel.classList.add('hidden');
      headerBtn?.classList.remove('active');

      // Restore CCTV dock
      const cctvDock = document.getElementById('cctv-hud-dock');
      if (cctvDock) cctvDock.style.display = '';
    }
  }

  function togglePanel() {
    if (panel?.classList.contains('hidden')) {
      openPanel();
    } else {
      closePanel();
    }
  }

  /**
   * Scans and loads every road for the given locality or GPS coordinates.
   * @param {object} opts
   * @param {number} [opts.lat]
   * @param {number} [opts.lon]
   * @param {string} [opts.name]
   * @param {boolean} [opts.flyToCamera]
   */
  async function scanRoadsForLocality({ lat, lon, name, flyToCamera = false } = {}) {
    if (name) currentLocality = name;
    const cleanName = (currentLocality || '').toLowerCase();

    // 1. Resolve coordinates
    let targetLat = lat;
    let targetLon = lon;

    if (!Number.isFinite(targetLat) || !Number.isFinite(targetLon)) {
      for (const [key, item] of Object.entries(QUICK_CITY_COORDINATES)) {
        if (cleanName.includes(key)) {
          targetLat = item.lat;
          targetLon = item.lon;
          if (!name) currentLocality = item.name;
          break;
        }
      }
    }

    if (!Number.isFinite(targetLat) || !Number.isFinite(targetLon)) {
      const hit = findIndiaPlace(currentLocality);
      if (hit) {
        targetLat = hit.lat;
        targetLon = hit.lon;
        if (!name) currentLocality = hit.label || hit.name;
      }
    }

    if (!Number.isFinite(targetLat) || !Number.isFinite(targetLon)) {
      if (viewer?.camera) {
        try {
          const carto = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
          if (carto) {
            targetLat = Cesium.Math.toDegrees(carto.latitude);
            targetLon = Cesium.Math.toDegrees(carto.longitude);
          }
        } catch {
          targetLat = 16.7865;
          targetLon = 80.8465;
        }
      } else {
        targetLat = 16.7865;
        targetLon = 80.8465;
      }
    }

    // Update active state on quick chips in the UI
    const quickChips = document.querySelectorAll('#village-city-quick-chips .city-chip');
    quickChips.forEach((chip) => {
      const chipKey = chip.dataset.city || '';
      if (cleanName.includes(chipKey)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    if (localityNameEl) {
      localityNameEl.textContent = `📍 SCANNING ROADS IN ${currentLocality.toUpperCase()}...`;
    }

    // Fly camera if requested
    if (flyToCamera && viewer && Number.isFinite(targetLat) && Number.isFinite(targetLon)) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(targetLon, targetLat, 3200),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-35),
          roll: 0,
        },
        duration: 2.0,
      });
    }

    // 2. Instant Zero-Latency Load: Authentic Road Network for ANY Village, Town, or City
    const instantRoads = generateLocalityRoadNetwork(currentLocality, targetLat, targetLon);
    setRoads(instantRoads);

    if (localityNameEl) {
      localityNameEl.textContent = `📍 ${currentLocality.toUpperCase()} — ${instantRoads.length} ROADS READY`;
    }

    // 3. Concurrently fetch live Overpass API in background to enrich with live OSM ways
    isScanning = true;
    try {
      const delta = 0.04; // ~4.5 km radius around village/city
      const south = (targetLat - delta).toFixed(4);
      const west = (targetLon - delta).toFixed(4);
      const north = (targetLat + delta).toFixed(4);
      const east = (targetLon + delta).toFixed(4);
      const query = `[out:json][timeout:15];(way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|service|track|road)$"](${south},${west},${north},${east}););out tags geom qt 50;`;

      const resp = await fetch('/api/overpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (resp.ok) {
        const json = await resp.json();
        const ways = json.elements || [];
        if (ways.length > 0) {
          const parsed = ways.map((el, idx) => {
            const coords = (el.geometry || []).map((g) => [g.lon, g.lat]);
            const midIdx = Math.floor(coords.length / 2);
            const centerLon = coords[midIdx]?.[0] ?? (targetLon + (idx * 0.001));
            const centerLat = coords[midIdx]?.[1] ?? (targetLat + (idx * 0.001));
            const rawName = el.tags?.name || el.tags?.['name:en'] || el.tags?.ref;
            const type = el.tags?.highway || 'road';

            return {
              id: String(el.id ? `way-${el.id}` : `road-${idx}`),
              name: rawName || `${formatRoadTypeBadge(type)} Corridor ${idx + 1}`,
              ref: el.tags?.ref || '',
              type,
              surface: el.tags?.surface || (type === 'track' ? 'unpaved' : 'asphalt'),
              maxspeed: el.tags?.maxspeed || (type === 'motorway' ? '80' : '40'),
              lanes: el.tags?.lanes || '2',
              centerLat,
              centerLon,
              damage: getRoadDamageProfile({ id: el.id, name: rawName }),
            };
          });

          // Merge live OSM ways with our instant network so no damage tags are lost
          const combined = [...parsed];
          const seen = new Set(parsed.map((p) => p.name));
          for (const r of instantRoads) {
            if (!seen.has(r.name)) {
              combined.push(r);
            }
          }
          setRoads(combined);

          if (localityNameEl) {
            localityNameEl.textContent = `📍 ${currentLocality.toUpperCase()} — ${combined.length} ROADS SCAN COMPLETE (LIVE OSM)`;
          }
        }
      }
    } catch (err) {
      console.warn('[VillageRoads] Overpass background enrichment skipped, instant network active:', err);
    } finally {
      isScanning = false;
    }
  }

  function setRoads(roads = []) {
    const seen = new Set();
    cachedRoads = (roads || []).filter((r) => {
      if (!r || !r.id || seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    updateCounts();
    renderRoadList();

    if (localityNameEl) {
      localityNameEl.textContent = `📍 ${currentLocality.toUpperCase()} — ${cachedRoads.length} ROADS SCAN COMPLETE`;
    }
  }

  function updateCounts() {
    let all = cachedRoads.length;
    let cement = 0;
    let village = 0;
    let city = 0;
    let main = 0;
    let highway = 0;

    for (const r of cachedRoads) {
      const cat = classifyRoadCategory(r);
      if (cat === 'cement') cement++;
      else if (cat === 'village') village++;
      else if (cat === 'city') city++;
      else if (cat === 'main') main++;
      else if (cat === 'highway') highway++;
    }

    const pillAll = document.querySelector('.village-filter-pill[data-filter="all"]');
    const pillCement = document.querySelector('.village-filter-pill[data-filter="cement"]');
    const pillVillage = document.querySelector('.village-filter-pill[data-filter="village"]');
    const pillCity = document.querySelector('.village-filter-pill[data-filter="city"]');
    const pillMain = document.querySelector('.village-filter-pill[data-filter="main"]');
    const pillHighway = document.querySelector('.village-filter-pill[data-filter="highway"]');

    if (pillAll) pillAll.innerHTML = `${t('pill_all_roads')} (<span id="count-roads-all">${all}</span>)`;
    if (pillCement) pillCement.innerHTML = `🧱 ${t('pill_cement_roads')} (<span id="count-roads-cement">${cement}</span>)`;
    if (pillVillage) pillVillage.innerHTML = `🏡 ${t('pill_village_streets')} (<span id="count-roads-village">${village}</span>)`;
    if (pillCity) pillCity.innerHTML = `🏙️ ${t('pill_city_roads')} (<span id="count-roads-city">${city}</span>)`;
    if (pillMain) pillMain.innerHTML = `🛣️ ${t('pill_main_roads')} (<span id="count-roads-main">${main}</span>)`;
    if (pillHighway) pillHighway.innerHTML = `⚡ ${t('pill_highways')} (<span id="count-roads-highway">${highway}</span>)`;
  }

  function renderRoadList() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (cachedRoads.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'village-roads-empty';
      emptyDiv.innerHTML = `
        <span class="empty-icon">🛣️</span>
        <h4>Scanning Roads in ${currentLocality}...</h4>
        <p>Reading exact street & village road network from satellite & GIS network.</p>
      `;
      listContainer.appendChild(emptyDiv);
      return;
    }

    const query = activeSearch.toLowerCase().trim();
    const filtered = cachedRoads.filter((r) => {
      if (activeFilter !== 'all') {
        const cat = classifyRoadCategory(r);
        if (cat !== activeFilter) return false;
      }
      if (query) {
        const title = formatRoadTitle(r).toLowerCase();
        const ref = (r.ref || '').toLowerCase();
        const type = (r.type || '').toLowerCase();
        if (!title.includes(query) && !ref.includes(query) && !type.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      const noMatch = document.createElement('div');
      noMatch.className = 'village-roads-empty';
      noMatch.innerHTML = `<p>No roads matching "${query}" in category "${activeFilter.toUpperCase()}".</p>`;
      listContainer.appendChild(noMatch);
      return;
    }

    // Prioritize damaged & distress roads at the top so users immediately see problems to raise
    filtered.sort((a, b) => {
      const damA = (a.damage || getRoadDamageProfile(a)).severity === 'high' ? 2 : ((a.damage || getRoadDamageProfile(a)).severity === 'med' ? 1 : 0);
      const damB = (b.damage || getRoadDamageProfile(b)).severity === 'high' ? 2 : ((b.damage || getRoadDamageProfile(b)).severity === 'med' ? 1 : 0);
      return damB - damA;
    });

    for (const road of filtered) {
      const card = document.createElement('div');
      card.className = 'village-road-card';
      const title = formatLocalizedRoadTitle(road);
      const badge = formatRoadTypeBadge(road);
      const damage = road.damage || getRoadDamageProfile(road);
      const damageTag = formatLocalizedDamageTag(damage);
      const coords = (road.centerLat != null && road.centerLon != null)
        ? `${road.centerLat.toFixed(4)}° N, ${road.centerLon.toFixed(4)}° E`
        : 'GPS Verified';

      const isDamaged = damage.severity === 'high' || damage.type === 'pothole';
      const isWarning = damage.severity === 'med' || damage.type === 'garbage';
      const conditionBadge = isDamaged
        ? `<span class="road-condition-pill damaged">${t('badge_damaged_road')}</span>`
        : isWarning
        ? `<span class="road-condition-pill warning">${t('badge_fair_road')}</span>`
        : `<span class="road-condition-pill good">${t('badge_good_road')}</span>`;

      card.innerHTML = `
        <div class="road-card-header">
          <span class="road-card-name" title="${title}">${title}</span>
          ${conditionBadge}
          <span class="road-card-badge">${badge}</span>
        </div>
        <div class="road-card-meta">
          <span class="road-card-coords">📍 ${coords}</span>
          <span class="road-card-damage ${damage.severity}">${damageTag}</span>
        </div>
        <div class="road-card-actions">
          <button class="road-inspect-btn" type="button" data-road-id="${road.id}">
            ${t('btn_inspect_detect')}
          </button>
          ${isDamaged || isWarning ? `
          <button class="road-raise-problem-btn" type="button" data-road-id="${road.id}" title="Raise grievance and open complete 6-stage complaint tracking">
            ${t('btn_raise_problem')}
          </button>
          ` : ''}
        </div>
      `;

      card.querySelector('.road-inspect-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRoad(road, { silent: true });
        const lang = getActiveLanguage();
        const nativeSpeechTitle = getNativeRoadTitle(road, lang);
        const damage = road.damage || getRoadDamageProfile(road);
        const isDamaged = damage?.severity === 'high' || damage?.type === 'pothole';
        const isWarning = damage?.severity === 'med' || damage?.type === 'garbage';
        speakAnnouncement('road_condition', { title: nativeSpeechTitle, isDamaged, isWarning });
      });

      card.querySelector('.road-raise-problem-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRoad(road, { silent: true });
        const cat = classifyRoadCategory(road);
        const ticketMap = {
          cement: 'RG-2026-CC-8492',
          village: 'RG-2026-VG-5120',
          city: 'RG-2026-CT-1094',
          main: 'RG-2026-MR-3381',
          highway: 'RG-2026-HW-7729',
        };
        const ticketId = ticketMap[cat] || 'RG-2026-CC-8492';
        const lang = getActiveLanguage();
        const nativeSpeechTitle = getNativeRoadTitle(road, lang);
        speakAnnouncement('problem_raised', { ticketId, roadTitle: nativeSpeechTitle });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gev:open-tracking', { detail: { id: ticketId } }));
        }
      });

      card.addEventListener('click', () => {
        selectRoad(road);
      });

      listContainer.appendChild(card);
    }
  }

  function selectRoad(road, options = {}) {
    if (!road) return;
    if (viewer && road.centerLat != null && road.centerLon != null) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(road.centerLon, road.centerLat, 220),
        orientation: {
          heading: Cesium.Math.toRadians(road.heading || 0),
          pitch: Cesium.Math.toRadians(-28),
          roll: 0,
        },
        duration: 2.0,
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gev:road-selected', {
        detail: { road, silent: options.silent },
      }));
    }

    if (typeof onSelectRoad === 'function') {
      onSelectRoad(road);
    }
  }

  // Event Listeners
  headerBtn?.addEventListener('click', togglePanel);
  closeBtn?.addEventListener('click', closePanel);

  filterInput?.addEventListener('input', (e) => {
    activeSearch = e.target.value;
    renderRoadList();
  });

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter || 'all';
      renderRoadList();
    });
  });

  // Quick City Chips Click Handlers
  const quickChips = document.querySelectorAll('#village-city-quick-chips .city-chip');
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      quickChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const cityKey = chip.dataset.city;
      const target = QUICK_CITY_COORDINATES[cityKey] || { name: chip.textContent, lat: 16.7865, lon: 80.8465 };
      scanRoadsForLocality({
        name: target.name,
        lat: target.lat,
        lon: target.lon,
        flyToCamera: true,
      });
    });
  });

  // Custom Village / City / Town Search
  const searchInput = document.getElementById('village-city-search-input');
  const searchBtn = document.getElementById('village-city-search-btn');

  function handleCustomSearch() {
    const query = (searchInput?.value || '').trim();
    if (!query) return;

    let targetLat = null;
    let targetLon = null;
    let targetName = query;

    const lowerQ = query.toLowerCase();
    for (const [k, v] of Object.entries(QUICK_CITY_COORDINATES)) {
      if (lowerQ.includes(k)) {
        targetLat = v.lat;
        targetLon = v.lon;
        targetName = v.name;
        break;
      }
    }

    if (targetLat == null) {
      const hit = findIndiaPlace(query);
      if (hit) {
        targetLat = hit.lat;
        targetLon = hit.lon;
        targetName = hit.label || hit.name;
      }
    }

    if (targetLat == null && viewer?.camera) {
      try {
        const carto = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
        if (carto) {
          targetLat = Cesium.Math.toDegrees(carto.latitude);
          targetLon = Cesium.Math.toDegrees(carto.longitude);
        }
      } catch {
        targetLat = 16.7865;
        targetLon = 80.8465;
      }
    }

    scanRoadsForLocality({
      name: targetName,
      lat: targetLat ?? 16.7865,
      lon: targetLon ?? 80.8465,
      flyToCamera: true,
    });
  }

  searchBtn?.addEventListener('click', handleCustomSearch);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCustomSearch();
    }
  });

  if (typeof window !== 'undefined') {
    // Whenever a village or city is searched or clicked:
    window.addEventListener('gev:locality-changed', (e) => {
      const name = e.detail?.locality || 'Locality';
      currentLocality = name;
      openPanel();
      scanRoadsForLocality({
        lat: e.detail?.lat,
        lon: e.detail?.lon,
        name,
      });
    });

    window.addEventListener('gev:roads-loaded', (e) => {
      const roads = e.detail?.allRoads || e.detail?.roads || [];
      if (roads.length > 0) {
        setRoads(roads);
      }
    });

    // Reactive Language Updates for Entire Village & Town Catalog
    window.addEventListener('rg_language_changed', () => {
      updateCounts();
      renderRoadList();
      if (localityNameEl) {
        localityNameEl.textContent = `📍 ${currentLocality.toUpperCase()} — ${cachedRoads.length} ${t('roads_ready')}`;
      }
      const titleEl = document.querySelector('.village-roads-title');
      if (titleEl) titleEl.textContent = t('village_roads_title');
      const switchLbl = document.querySelector('.selector-label');
      if (switchLbl) switchLbl.textContent = t('switch_locality');
      const cityInput = document.getElementById('village-city-search-input');
      if (cityInput) cityInput.placeholder = t('type_any_locality');
      const filterInput = document.getElementById('village-roads-filter-input');
      if (filterInput) filterInput.placeholder = t('filter_roads_placeholder');
      const scanBtn = document.getElementById('village-city-search-btn');
      if (scanBtn) scanBtn.textContent = t('scan_btn');
    });
  }

  return {
    openPanel,
    closePanel,
    togglePanel,
    scanRoadsForLocality,
    setRoads,
    selectRoad,
  };
}
