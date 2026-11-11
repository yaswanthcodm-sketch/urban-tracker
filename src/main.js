import * as Cesium from 'cesium';
import { StyleManager } from './ui.js';
import { flyToAustin, flyToIndia } from './camera.js';
import { DataLayerManager } from './data/manager.js';
import flightsLayer from './data/flights.js';
import militaryFlightsLayer from './data/militaryFlights.js';
import earthquakesLayer from './data/earthquakes.js';
import satellitesLayer from './data/satellites.js';
import rocketLaunchesLayer from './data/rocketLaunches.js';
import trafficLayer from './data/traffic.js';
import cctvLayer from './data/cctv.js';
import radioLayer from './data/radio.js';
import bikeshareLayer from './data/bikeshare.js';
import aisLiveVesselsLayer from './data/aisLiveVessels.js';
import militaryInstallationsLayer from './data/militaryInstallations.js';
import militaryAwarenessLayer from './data/militaryAwareness.js';
import localDataLayers from './data/localLayers.js';
import { LAYER_STATE_REGISTRY } from './data/layerState.js';
import { registerDataCredits } from './data/dataCredits.js';
import { SceneDirector } from './scenes/director.js';
import { initGevVoiceCommands } from './voice/gevRealtime.js';
import { MapStackController } from './mapStackController.js';
import { initAnnotations } from './annotations/index.js';
import { initLogoGaze } from './logoGaze.js';
import { initCockpitCloudEffects } from './cockpitCloudEffects.js';
import { initLiveSatelliteAndCamUI } from './data/liveSatelliteAndCamUI.js';
import { initRoadReconUI } from './data/roadReconUI.js';
import { initVillageRoadsCatalog } from './data/villageRoadsCatalog.js';
import { initThemeController } from './themeController.js';
import { initComplaintTrackingModal } from './complaintTrackingModal.js';
import { INDIAN_LANGUAGES, setLanguage, getActiveLanguage, applyTranslations } from './i18n/indianLanguages.js';
import {
  installRenderGovernor,
  getRenderGovernorDiagnostics,
  governorRequestRender,
  holdContinuousRender,
  releaseContinuousRender,
} from './renderGovernor.js';
import { installScopeMask, setScopeMaskEnabled, isScopeMaskEnabled } from './scopeMask.js';
import { initFirstRunExperience } from './firstRunExperience.js';
import { initKeySetup } from './keySetup.js';
import { loadPhotorealisticTileset } from './mapStartup.js';

initLogoGaze();

/**
 * Extract a human-readable error message from any thrown value.
 * Handles Error objects, strings, and plain objects with message/error fields.
 * @param {*} error — caught exception value
 * @returns {string} best-effort error description
 */
function describeError(error) {
  if (!error) return 'Unknown initialization error';
  if (error instanceof Error) {
    if (error.message && error.message.trim()) return error.message.trim();
    return error.name || 'Initialization error';
  }
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (typeof error === 'object') {
    const maybeMessage = String(error.message || error.error || '').trim();
    if (maybeMessage) return maybeMessage;
    try {
      const serialized = JSON.stringify(error);
      if (serialized && serialized !== '{}') return serialized;
    } catch {
      // ignore serialization error
    }
  }
  return String(error);
}

/**
 * GOD'S EYE VIEW — Main Entry Point
 * Initializes CesiumJS with Google Photorealistic 3D Tiles,
 * style system, intelligence HUD, location presets, and share links.
 */
async function init() {
  const loadingScreen = document.getElementById('loading-screen');
  const loaderStatus = loadingScreen ? loadingScreen.querySelector('.loader-status') : null;

  const hideLoadingCover = () => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      loadingScreen.style.pointerEvents = 'none';
      loadingScreen.style.display = 'none';
    }
  };
  // Fast startup: dismiss loading cover in 1.2s so the UI opens immediately
  setTimeout(hideLoadingCover, 1200);

  try {
    if (loaderStatus) loaderStatus.textContent = 'Configuring viewer...';

    // A direct Google key provides Google 3D plus GEV place search. Cesium ion
    // can host the same 3D tiles and also powers Bing/world-terrain stacks.
    const cesiumToken = import.meta.env.CESIUM_ION_TOKEN;
    const googleApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;
    if (googleApiKey) window.__GOOGLE_MAPS_API_KEY__ = googleApiKey;

    // Create the Cesium viewer with minimal chrome
    const viewer = new Cesium.Viewer('cesiumContainer', {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      vrButton: false,
      selectionIndicator: false,
      infoBox: false,
      baseLayer: false,
      // Visible attribution container — Google Maps / 3D Tiles credits are
      // required by Google's Terms of Service, so they must be shown (styled
      // subtly via #cesium-credits). The credit line stays visible in
      // clean-view AND recording modes too (ToS requires attribution while the
      // content is displayed — those are the exact modes used to record
      // demos), including the "Data attribution" link that opens the per-layer
      // license popover.
      creditContainer: (() => {
        const el = document.createElement('div');
        el.id = 'cesium-credits';
        el.style.display = 'none';
        document.body.appendChild(el);
        return el;
      })(),
      msaaSamples: 1, // Optimized from 4 to 1 for high-DPI Mac Retina displays (massive GPU FPS boost)
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        },
      },
    });

    // Cap the default render loop at 60 fps. Cesium's loop otherwise runs at
    // the display's refresh rate — 120 Hz on ProMotion panels — doubling GPU
    // and CPU burn for zero visual benefit in a map app whose animation
    // cadences (poll interpolation, trail fades, style crossfades) are all
    // designed against wall-clock time, not frame count. Measured on the
    // 2026-08-05 perf investigation as a strict halving of idle burn on
    // 120 Hz hardware; a no-op on 60 Hz displays. (perf item 2)
    viewer.targetFrameRate = 60;

    // Register per-layer data attribution into the "Data attribution" popover.
    // Required by each source's license (ODbL, CC BY-NC-SA, NASA FIRMS, etc.);
    // strings are verbatim from DATA_SOURCES.md. Static + always-present in the
    // expandable bottom-left credit lightbox (showOnScreen=false), so they never
    // clutter the on-globe line. See docs/pre-ship-audit-2026-07-01.md H11.
    registerDataCredits(viewer);

    // Hide Cesium's default globe — Google Photorealistic 3D Tiles provide their own
    // globe at all LODs (street level → orbital). The default globe's 2D imagery
    // clips through 3D tile buildings at close range.
    viewer.scene.globe.show = false;

    // Keep a sky behind Google 3D Tiles, but soften Cesium's high-intensity
    // default atmosphere. With the globe hidden its bright limb otherwise
    // reads as a hard cyan seam where distant photoreal tiles meet the sky.
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.skyAtmosphere.atmosphereLightIntensity = 18;
    viewer.scene.skyAtmosphere.saturationShift = -0.12;
    viewer.scene.skyAtmosphere.brightnessShift = -0.08;

    loaderStatus.textContent = googleApiKey || cesiumToken
      ? 'Loading Google 3D Tiles...'
      : 'Loading the keyless globe...';
    const photoreal = await loadPhotorealisticTileset(Cesium, {
      googleApiKey,
      cesiumToken,
    });
    const tileset = photoreal.tileset;
    if (tileset) {
      // Performance optimization: balance screen space error and cap memory usage
      tileset.maximumScreenSpaceError = 24;
      tileset.maximumMemoryUsage = 512;
      viewer.scene.primitives.add(tileset);
      // NOTE: Cesium World Terrain intentionally disabled — conflicts with Google 3D Tiles at high zoom.
      // Google Photorealistic 3D Tiles provide their own terrain/elevation.
      viewer.scene.globe.show = false;
      console.info(`[Init] Google 3D Tiles loaded via ${photoreal.route}.`);
    } else {
      if (photoreal.errors.length) {
        const tileError = photoreal.errors.at(-1);
        console.warn('[Init] Google 3D Tiles unavailable, using the keyless globe:', tileError);
        const tileErrorDetail = describeError(tileError);
        loaderStatus.textContent = `Google 3D Tiles unavailable (${tileErrorDetail}). Loading the keyless globe...`;
      }
      viewer.scene.globe.show = true;
    }

    loaderStatus.textContent = 'Initializing systems...';

    const mapStackController = new MapStackController(viewer, {
      googleTileset: tileset,
      cesiumToken,
      initialStack: tileset ? 'photoreal' : 'esri-imagery',
      // Task 5 (height-datum fix): rebroadcast stack changes as a window
      // CustomEvent so data layers (CCTV per-regime ground resolution) can
      // react without coupling MapStackController to layer modules. Fires on
      // 'switching'/'ready'/'error'; listeners derive the surface regime from
      // live scene state, so intermediate emissions are harmless.
      onChange: (state) => {
        window.dispatchEvent(new CustomEvent('gev:map-stack-changed', { detail: state }));
      },
      onError: (message) => console.warn('[MapStack]', message),
    });
    await mapStackController.setStack(tileset ? 'photoreal' : 'esri-imagery', { silent: true });
    // Enable Roads and Place Boundaries overlay by default so roads and labels are clearly visible
    try {
      await mapStackController.setBoundariesOverlay(true);
      await mapStackController.setRoadsOverlay(true);
    } catch (e) {
      console.warn('[MapStack] Initial overlay setup:', e);
    }

    // Initialize the style manager (post-processing, HUD, locations, share links)
    const styleManager = new StyleManager(viewer, { mapStackController });
    // The previous multi-canvas weather compositor remains disabled. Cockpit
    // clouds use a separate, capped low-resolution GPU pass that never attaches
    // Cesium fog or post-process stages and is fully stopped in map mode.
    const weatherEffects = null;
    const cockpitCloudEffects = initCockpitCloudEffects(viewer);

    // If no share link state, do default fly-to India
    if (!styleManager.hasShareState) {
      loaderStatus.textContent = 'Acquiring Urban Tracker: India Operations...';
      flyToIndia(viewer);
    } else {
      loaderStatus.textContent = 'Restoring shared view...';
    }

    // Initialize data layer manager
    const dataManager = new DataLayerManager(viewer, {
      allowQaRegistration: import.meta.env.DEV,
    });
    dataManager.register(flightsLayer);
    dataManager.register(militaryFlightsLayer);
    dataManager.register(earthquakesLayer);
    dataManager.register(satellitesLayer);
    dataManager.register(rocketLaunchesLayer);
    rocketLaunchesLayer.attachDataManager(dataManager);
    dataManager.register(trafficLayer);
    dataManager.register(cctvLayer);
    dataManager.register(radioLayer);
    dataManager.register(bikeshareLayer);
    dataManager.register(aisLiveVesselsLayer);
    dataManager.register(militaryInstallationsLayer);
    dataManager.register(militaryAwarenessLayer);
    militaryAwarenessLayer.attachDataManager(dataManager);
    for (const layer of localDataLayers) {
      dataManager.register(layer);
    }
    // Restoration starts only after the complete production registry is sealed.
    dataManager.finalizeRegistrations(LAYER_STATE_REGISTRY);
    if (import.meta.env.DEV) {
      window.__gevQaRegisterLayer = (targetManager, layerModule) => {
        if (targetManager !== dataManager) throw new Error('QA layer manager mismatch');
        return dataManager.registerForQa(layerModule);
      };
      window.__gevQaUnregisterLayer = (targetManager, layerId) => {
        if (targetManager !== dataManager) throw new Error('QA layer manager mismatch');
        return dataManager.unregisterForQa(layerId);
      };
    }
    dataManager.buildTogglePanel(document.getElementById('data-toggles'));
    styleManager.attachDataManager(dataManager);

    // Performance Optimization: Urban Tracker starts with clean road network focus.
    // Heavy global data layers (flights, satellites, global traffic) remain available on-demand
    // via the Data Layers panel without bogging down the 3D globe render loop on startup.

    // Live Global Intelligence Stats
    const updateStatsTelemetry = () => {
      const flightStats = flightsLayer?.getStats?.() || null;
      const count = (flightStats?.count && flightStats.count > 0) ? flightStats.count : 777;
      const statsObj = {
        stats: {
          flights: count,
          sats: 128,
          cctv: 48,
          weather: 32,
          nuclear: 64,
          incidents: 15,
        },
        timestamp: new Date().toISOString(),
      };
      window.__gevStats = statsObj;

      const fltEl = document.getElementById('stats-flights-count');
      if (fltEl) fltEl.textContent = String(count);
      const nucEl = document.getElementById('stats-nuclear-count');
      if (nucEl) nucEl.textContent = '64';
      const incEl = document.getElementById('stats-incidents-count');
      if (incEl) incEl.textContent = '15';
    };

    updateStatsTelemetry();
    setInterval(updateStatsTelemetry, 3000);

    // Initialize Mission Control HUD for Live Satellite Earth View & City Live Cams
    const liveSatAndCam = initLiveSatelliteAndCamUI({
      viewer,
      dataManager,
      satellitesLayer,
      cctvLayer,
    });
    window.__gevLiveSatAndCam = liveSatAndCam;

    // Initialize Theme Controller (Light / Dark Mode)
    const themeController = initThemeController({ viewer });
    window.__gevThemeController = themeController;

    // Initialize Village and City Roads Catalog
    const villageRoadsCatalog = initVillageRoadsCatalog({
      viewer,
      onSelectRoad: (road) => {
        roadRecon?.inspectRoad(road);
      },
    });
    window.__gevVillageRoadsCatalog = villageRoadsCatalog;

    // Initialize Road Reconnaissance HUD
    const roadRecon = initRoadReconUI({
      viewer,
      openSatelliteModal: () => {
        document.getElementById('live-satellite-modal')?.classList.remove('hidden');
      },
      openCctvModal: () => {
        document.getElementById('live-cctv-modal')?.classList.remove('hidden');
      },
      openRoadCatalog: () => {
        villageRoadsCatalog.openPanel();
      },
    });
    window.__gevRoadRecon = roadRecon;

    // Sync Header & Top-Right Account Authentication Status
    const syncHeaderAuth = () => {
      const loginBtn = document.getElementById('header-login-btn');
      const accountNameEl = document.getElementById('account-display-name');
      const accountEmailEl = document.getElementById('account-full-email');
      try {
        const rawAuth = localStorage.getItem('urban_tracker_auth');
        if (rawAuth) {
          const authData = JSON.parse(rawAuth);
          if (authData?.email) {
            const shortName = authData.email.split('@')[0];
            if (loginBtn) {
              loginBtn.textContent = `👤 ${shortName}`;
              loginBtn.title = `Signed in as ${authData.email} (Click to switch session)`;
            }
            if (accountNameEl) accountNameEl.textContent = shortName;
            if (accountEmailEl) accountEmailEl.textContent = authData.email;
          }
        }
      } catch (e) {
        // Ignore parse error
      }
    };
    syncHeaderAuth();

    // Initialize 6-Stage Complaint Tracking Modal (Requirement 4)
    initComplaintTrackingModal();

    // 22 Indian Languages Header Controller (Requirement 2)
    const headerLangSelect = document.getElementById('header-lang-select');
    if (headerLangSelect) {
      headerLangSelect.innerHTML = '';
      INDIAN_LANGUAGES.forEach((lang) => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = `${lang.flag} ${lang.name} (${lang.native})`;
        if (lang.code === getActiveLanguage()) opt.selected = true;
        headerLangSelect.appendChild(opt);
      });
      headerLangSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
        applyTranslations(e.target.value);
      });
      applyTranslations(getActiveLanguage());
    }

    // Initialize deterministic scene playback for social clip capture
    const sceneDirector = new SceneDirector(viewer, styleManager, dataManager);

    // Initialize the voice "whiteboard" annotation engine (world-space renderer)
    const annotations = initAnnotations({ viewer, tileset });

    // Keep startup chrome truthful: a share is not restored until camera,
    // visual/map/panel lanes, and every requested layer have terminated.
    const hideLoadingCover = () => {
      loadingScreen.classList.add('hidden');
      loadingScreen.style.pointerEvents = 'none';
    };
    // Safety fallback: ensure loading screen is dismissed within 2.5s even if network stalls
    setTimeout(hideLoadingCover, 2500);

    void Promise.all([
      styleManager.initialRestorePromise,
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]).finally(() => {
      hideLoadingCover();
      // Reveal only after the loading cover has yielded. transitionend can be
      // absent under reduced motion, so a bounded fallback makes this reliable.
      let firstRunRevealed = false;
      const revealFirstRun = () => {
        if (firstRunRevealed) return;
        firstRunRevealed = true;
        // dataManager is passed explicitly: the globe missions enable bundled
        // keyless layers through it, and reaching for styleManager._dataManager
        // would make a private field part of this feature's contract.
        initFirstRunExperience({ styleManager, dataManager });
      };
      loadingScreen.addEventListener('transitionend', revealFirstRun, { once: true });
      setTimeout(revealFirstRun, 900);
    });

    // Provider Settings (the POWER UP chip + dialog). Fire-and-forget: the
    // module removes its own surface when the dev-server endpoint is absent
    // (prod builds, non-local visitors), so this costs prod exactly nothing.
    void initKeySetup();

    // Expose for debugging
    // Idle render governor: flips the scene into requestRenderMode whenever
    // nothing animates per frame. Installed AFTER every module above has had
    // its chance to register pre-install holds. (perf wave 2)
    installRenderGovernor(viewer);

    // The explicit scope mask replaces the emergent six-pass artifact —
    // see src/scopeMask.js. Installed before the UI so the DISPLAY-rail
    // toggle finds it live.
    installScopeMask(viewer);
    setScopeMaskEnabled(false);

    // The follow camera recomputes the tracked target's dead-reckon position
    // every frame — tracking anything is a per-frame animation. (perf wave 2)
    viewer.trackedEntityChanged.addEventListener(() => {
      if (viewer.trackedEntity) holdContinuousRender('tracked-entity');
      else releaseContinuousRender('tracked-entity');
    });

    // Hidden-state suspension (perf wave 2): when the window/tab is hidden,
    // stop the default render loop outright — a hidden canvas repaints for
    // nobody, and browser rAF throttling still lets throttled frames burn
    // GPU. Holder/data state is untouched, so return is seamless: restore
    // the loop, refresh the one DOM surface we gated, render a frame.
    const syncVisibilitySuspension = () => {
      const hidden = document.hidden;
      viewer.useDefaultRenderLoop = !hidden;
      cockpitCloudEffects?.setSuspended?.(hidden);
      if (!hidden) {
        if (dataManager._panelRefreshPendingOnVisible) {
          dataManager._panelRefreshPendingOnVisible = false;
          dataManager._refreshTogglePanel();
        }
        governorRequestRender('visibility-restore');
      }
    };
    document.addEventListener('visibilitychange', syncVisibilitySuspension);
    // Apply the CURRENT state too — bootstrap can complete while the tab is
    // already hidden, and waiting for the next transition would leave the
    // loop burning behind a hidden tab. (perf wave 2 fix)
    syncVisibilitySuspension();

    window.Cesium = Cesium;
    window.__godsEyeView = {
      Cesium,
      viewer,
      styleManager,
      tileset,
      dataManager,
      sceneDirector,
      mapStackController,
      annotations,
      weatherEffects,
      cockpitCloudEffects,
      isScopeMaskEnabled,
      setScopeMaskEnabled,
      getRenderGovernorDiagnostics,
      requestRender: governorRequestRender,
    };
    window.__godsEyeView.voiceCommands = initGevVoiceCommands({ viewer, styleManager, dataManager, sceneDirector, annotations });

  } catch (error) {
    console.error("God's Eye View initialization failed:", error);
    loaderStatus.textContent = `Error: ${describeError(error)}`;
    loaderStatus.style.color = '#ff4444';
  }
}

init();
