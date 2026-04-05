const KEYS = {
  PREFS: 'ngf_prefs',
  FAVORITES: 'ngf_favorites',
  HISTORY: 'ngf_history'
};

const DEFAULT_PREFS = {
  theme: 'light',
  lang: 'sv',
  name: '',
  email: '',
  autoPlay: false
};

// ── Preferences ───────────────────────────
export function getPrefs() {
  try {
    const raw = localStorage.getItem(KEYS.PREFS);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch { return { ...DEFAULT_PREFS }; }
}

export function setPrefs(updates) {
  const current = getPrefs();
  const next = { ...current, ...updates };
  localStorage.setItem(KEYS.PREFS, JSON.stringify(next));
  return next;
}

// ── Favorites ─────────────────────────────
export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function toggleFavorite(passId) {
  const favs = getFavorites();
  const next = favs.includes(passId)
    ? favs.filter(id => id !== passId)
    : [...favs, passId];
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(next));
  return next;
}

export function isFavorite(passId) {
  return getFavorites().includes(passId);
}

// ── History ───────────────────────────────
export function getHistory() {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addHistory(passId, passNamn, minuter) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    passId,
    passNamn,
    minuter,
    timestamp: new Date().toISOString()
  };
  const next = [entry, ...history].slice(0, 100); // Keep last 100
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(next));
  return next;
}

export function clearHistory() {
  localStorage.removeItem(KEYS.HISTORY);
}

// ── Format history date ───────────────────
export function formatHistoryDate(isoString, lang) {
  const date = new Date(isoString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const time = date.toLocaleTimeString(lang === 'sv' ? 'sv-SE' : 'en-GB', {
    hour: '2-digit', minute: '2-digit'
  });

  if (sameDay(date, now)) return { datum: lang === 'sv' ? 'Idag' : 'Today', tid: time };
  if (sameDay(date, yesterday)) return { datum: lang === 'sv' ? 'Igår' : 'Yesterday', tid: time };

  const datum = date.toLocaleDateString(lang === 'sv' ? 'sv-SE' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
  return { datum, tid: time };
}
