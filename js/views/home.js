import { t, getGreeting } from '../i18n.js';
import { getPrefs, toggleFavorite, isFavorite } from '../store.js';

export function renderHome(data, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;

  // Group passes by category, only active passes
  const activePasses = (data.pass || []).filter(p => p && p.aktiv);
  const categories = [...new Set(activePasses.map(p => p && p.kategori).filter(Boolean))];

  const view = document.createElement('div');
  view.className = 'view';
  view.id = 'view-home';

  // Header
  view.innerHTML = `
    <div class="app-header">
      <div>
        <div class="greeting-sub">${t(lang, 'orgName')}</div>
        <div class="greeting" id="greeting-text">${getGreeting(lang, prefs.name)}</div>
      </div>
    </div>
  `;

  const content = document.createElement('div');
  content.style.paddingTop = '4px';

  const collapsedState = {};

  categories.forEach(kat => {
    const passes = activePasses.filter(p => p.kategori === kat);
    const section = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <span class="section-label">${kat} (${passes.length})</span>
      <span class="section-toggle" id="toggle-${kat}">▾</span>
    `;

    const list = document.createElement('div');
    list.id = `section-${kat}`;

    passes.forEach(pass => {
      list.appendChild(buildPassCard(pass, lang, data, navigate));
    });

    header.addEventListener('click', () => {
      collapsedState[kat] = !collapsedState[kat];
      list.classList.toggle('hidden', collapsedState[kat]);
      document.getElementById(`toggle-${kat}`)?.classList.toggle('collapsed', collapsedState[kat]);
    });

    section.appendChild(header);
    section.appendChild(list);
    content.appendChild(section);
  });

  view.appendChild(content);
  return view;
}

export function buildPassCard(pass, lang, data, navigate, showFav = true) {
  const card = document.createElement('div');
  card.className = 'card';

  const fav = isFavorite(pass.id);
  const namn = (pass.namn && (pass.namn[lang] || pass.namn.sv)) || 'Unnamed Pass';
  const desc = (pass.beskrivning && (pass.beskrivning[lang] || pass.beskrivning.sv)) || '';

  card.innerHTML = `
    <div class="pass-card">
      <div class="pass-card-left">
        <span class="pass-emoji">${pass.emoji || '📋'}</span>
        <div>
          <div class="pass-name">${namn}</div>
          <div class="badges">
            <span class="badge badge-muted">${pass.kategori || 'Unknown'}</span>
            <span class="badge badge-accent">${pass.niva || 'Unknown'}</span>
          </div>
          <div class="pass-desc">${desc}</div>
        </div>
      </div>
      <div class="pass-card-right">
        <div class="pass-time">${pass.tid} min</div>
        <div class="pass-count">${pass.ovningar.length} ${t(lang, 'pass.ovningar')}</div>
        ${showFav ? `<button class="fav-btn" data-id="${pass.id}" aria-label="Favorit">${fav ? '⭐' : '☆'}</button>` : ''}
      </div>
    </div>
  `;

  card.querySelector('.fav-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(pass.id);
    e.currentTarget.textContent = isFavorite(pass.id) ? '⭐' : '☆';
  });

  card.addEventListener('click', () => navigate('workout', { passId: pass.id }));
  return card;
}
