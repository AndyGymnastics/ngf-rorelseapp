import { getPrefs } from './store.js';
import { t } from './i18n.js';
import { renderHome } from './views/home.js';
import { renderWorkout } from './views/workout.js';
import { renderExercise } from './views/exercise.js';
import { renderPlayer } from './views/player.js';
import { renderMyWorkouts } from './views/myworkouts.js';
import { renderSettings } from './views/settings.js';
import { renderComplete } from './views/complete.js';

let appData = null;
let currentView = 'home';
let currentParams = {};

// ── Load data ─────────────────────────────
async function loadData() {
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error('Failed to load data');
    return await res.json();
  } catch (e) {
    // Try cache if offline
    const cached = await caches.match('data/data.json');
    if (cached) return await cached.json();
    throw e;
  }
}

// ── Router ────────────────────────────────
function navigate(view, params = {}) {
  currentView = view;
  currentParams = params;
  renderView();
}

function renderView() {
  const app = document.getElementById('app');
  const prefs = getPrefs();
  const lang = prefs.lang;

  // Apply theme
  document.documentElement.setAttribute('data-theme', prefs.theme);

  // Clear content area (keep nav)
  const existing = app.querySelector('.view');
  if (existing) existing.remove();

  // Show/hide nav
  const nav = document.getElementById('bottom-nav');
  const mainViews = ['home', 'mina', 'settings'];
  if (nav) nav.classList.toggle('hidden', !mainViews.includes(currentView));

  // Update active nav item
  if (mainViews.includes(currentView)) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === currentView);
    });
  }

  // Render correct view
  let viewEl;
  switch (currentView) {
    case 'home':     viewEl = renderHome(appData, navigate); break;
    case 'workout':  viewEl = renderWorkout(appData, currentParams, navigate); break;
    case 'exercise': viewEl = renderExercise(appData, currentParams, navigate); break;
    case 'player':   viewEl = renderPlayer(appData, currentParams, navigate); break;
    case 'mina':     viewEl = renderMyWorkouts(appData, navigate); break;
    case 'settings': viewEl = renderSettings(appData, navigate); break;
    case 'complete': viewEl = renderComplete(appData, currentParams, navigate); break;
    default:         viewEl = renderHome(appData, navigate);
  }

  // Insert before nav
  app.insertBefore(viewEl, nav);
}

// ── Build nav ─────────────────────────────
function buildNav() {
  const prefs = getPrefs();
  const lang = prefs.lang;
  const nav = document.getElementById('bottom-nav');
  nav.innerHTML = `
    <div class="nav-item active" data-view="home">
      <span class="nav-icon">🏠</span>
      <span>${t(lang, 'nav.hem')}</span>
    </div>
    <div class="nav-item" data-view="mina">
      <span class="nav-icon">⭐</span>
      <span>${t(lang, 'nav.minaPass')}</span>
    </div>
    <div class="nav-item" data-view="settings">
      <span class="nav-icon">⚙️</span>
      <span>${t(lang, 'nav.installningar')}</span>
    </div>
  `;
  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.view));
  });
}

// ── Offline banner ────────────────────────
function setupOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  const update = () => {
    const prefs = getPrefs();
    banner.textContent = t(prefs.lang, 'offline');
    banner.classList.toggle('hidden', navigator.onLine);
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

// ── Register Service Worker ───────────────
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (e) {
      console.warn('SW registration failed:', e);
    }
  }
}

// ── Init ──────────────────────────────────
async function init() {
  try {
    appData = await loadData();
  } catch (e) {
    document.getElementById('app').innerHTML = `
      <div style="padding:32px;text-align:center;color:#6B6860">
        <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
        <div style="font-weight:700;margin-bottom:8px">Kunde inte ladda data</div>
        <div style="font-size:0.85rem">Kontrollera din internetanslutning och försök igen.</div>
      </div>
    `;
    return;
  }

  buildNav();
  setupOfflineBanner();
  renderView();
  await registerSW();
}

document.addEventListener('DOMContentLoaded', init);
