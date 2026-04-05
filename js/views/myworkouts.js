import { t } from '../i18n.js';
import { getPrefs, getFavorites, getHistory, formatHistoryDate } from '../store.js';
import { buildPassCard } from './home.js';

export function renderMyWorkouts(data, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;

  const view = document.createElement('div');
  view.className = 'view';

  // Header
  view.innerHTML = `
    <div class="app-header">
      <div style="font-weight:800;font-size:1.1rem">${t(lang, 'myWorkouts.title')}</div>
    </div>
  `;

  const content = document.createElement('div');

  // Favorites
  const favHeader = document.createElement('div');
  favHeader.className = 'section-header';
  favHeader.style.cursor = 'default';
  favHeader.innerHTML = `<span class="section-label">${t(lang, 'myWorkouts.favorites')}</span>`;
  content.appendChild(favHeader);

  const favorites = getFavorites();
  const favPasses = data.pass.filter(p => favorites.includes(p.id) && p.aktiv);

  if (favPasses.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = t(lang, 'myWorkouts.noFavorites');
    content.appendChild(empty);
  } else {
    favPasses.forEach(pass => {
      content.appendChild(buildPassCard(pass, lang, data, navigate, true));
    });
  }

  // History
  const histHeader = document.createElement('div');
  histHeader.className = 'section-header';
  histHeader.style.cursor = 'default';
  histHeader.innerHTML = `<span class="section-label">${t(lang, 'myWorkouts.history')}</span>`;
  content.appendChild(histHeader);

  const history = getHistory();
  if (history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = lang === 'sv' ? 'Ingen historik ännu. Slutför ett pass för att se det här.' : 'No history yet. Complete a workout to see it here.';
    content.appendChild(empty);
  } else {
    history.forEach(entry => {
      const { datum, tid } = formatHistoryDate(entry.timestamp, lang);
      const pass = data.pass.find(p => p.id === entry.passId);
      const emoji = pass?.emoji || '🏃';
      const namn = entry.passNamn;
      const kl = t(lang, 'myWorkouts.kl');
      const min = t(lang, 'myWorkouts.min');

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="history-card">
          <span class="history-emoji">${emoji}</span>
          <div style="flex:1">
            <div class="history-name">${namn}</div>
            <div class="history-meta">${datum} ${kl} ${tid} · ${entry.minuter} ${min}</div>
          </div>
          <span class="badge history-done">${t(lang, 'myWorkouts.done')}</span>
        </div>
      `;
      content.appendChild(card);
    });
  }

  view.appendChild(content);
  return view;
}
