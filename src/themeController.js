/**
 * @module themeController
 * @description Manages Dark Mode and Pure White Paper Light Mode transitions across Urban Tracker.
 */

const THEME_STORAGE_KEY = 'urban-tracker-theme';
let _viewerInstance = null;

/**
 * Returns current active theme ('dark' | 'light').
 * @returns {'dark'|'light'}
 */
export function getCurrentTheme() {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(THEME_STORAGE_KEY) === 'light') ? 'light' : 'dark';
}

/**
 * Applies the specified theme to the document, Cesium 3D scene, and updates toggle button.
 * @param {'dark'|'light'} theme
 * @param {object} [viewer]
 */
export function applyTheme(theme, viewer = _viewerInstance) {
  if (typeof document === 'undefined') return;

  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.body.classList.toggle('light-theme', isLight);

  const toggleBtn = document.getElementById('header-theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = isLight ? '🌙 DARK' : '☀️ LIGHT';
    toggleBtn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Pure White Light Mode';
    toggleBtn.classList.toggle('light-active', isLight);
  }

  // Pure White Paper background in Cesium 3D Scene
  const activeViewer = viewer || _viewerInstance;
  if (activeViewer?.scene && typeof window !== 'undefined') {
    const Cesium = window.Cesium;
    if (isLight) {
      // Light Mode: Pure White Paper background, disable dark space skybox
      if (Cesium) {
        activeViewer.scene.backgroundColor = Cesium.Color.WHITE;
        if (activeViewer.scene.globe) {
          activeViewer.scene.globe.baseColor = Cesium.Color.WHITE;
        }
      }
      if (activeViewer.scene.skyBox) activeViewer.scene.skyBox.show = false;
      if (activeViewer.scene.sun) activeViewer.scene.sun.show = false;
      if (activeViewer.scene.moon) activeViewer.scene.moon.show = false;
      if (activeViewer.scene.skyAtmosphere) activeViewer.scene.skyAtmosphere.show = false;
    } else {
      // Dark Mode: Deep Sci-Fi space background
      if (Cesium) {
        activeViewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0a0f');
        if (activeViewer.scene.globe) {
          activeViewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a0a0f');
        }
      }
      if (activeViewer.scene.skyBox) activeViewer.scene.skyBox.show = true;
      if (activeViewer.scene.sun) activeViewer.scene.sun.show = true;
      if (activeViewer.scene.moon) activeViewer.scene.moon.show = true;
      if (activeViewer.scene.skyAtmosphere) activeViewer.scene.skyAtmosphere.show = true;
    }
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors in private browsing
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gev:theme-changed', {
      detail: { theme, isLight },
    }));
  }
}

/**
 * Toggles between Dark Mode and Light Mode.
 * @returns {'dark'|'light'} The new theme.
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * Initializes theme controller and connects header toggle button.
 * @param {object} [opts]
 * @param {object} [opts.viewer]
 */
export function initThemeController({ viewer } = {}) {
  if (viewer) _viewerInstance = viewer;
  const initialTheme = getCurrentTheme();
  applyTheme(initialTheme, viewer);

  const toggleBtn = document.getElementById('header-theme-toggle-btn');
  toggleBtn?.addEventListener('click', () => {
    toggleTheme();
  });

  return {
    getCurrentTheme,
    applyTheme,
    toggleTheme,
    setViewer: (v) => { _viewerInstance = v; },
  };
}
