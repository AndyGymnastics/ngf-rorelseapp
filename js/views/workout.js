import { t } from '../i18n.js';
import { getPrefs, toggleFavorite, isFavorite, setPrefs } from '../store.js';

export function renderWorkout(data, params, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;
  const pass = data.pass.find(p => p.id === params.passId);
  if (!pass) return navigate('home');

  const view = document.createElement('div');
  view.className = 'view';

  const namn = pass.namn[lang] || pass.namn.sv;
  const desc = pass.beskrivning[lang] || pass.beskrivning.sv;
  const fav = isFavorite(pass.id);

  // Header
  const header = document.createElement('div');
  header.className = 'app-header';
  header.innerHTML = `
    <button class="back-btn" id="btn-back">${t(lang, 'pass.back')}</button>
    <div style="font-weight:800;font-size:0.9rem;flex:1;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 8px">${namn}</div>
    <button class="fav-btn" id="btn-fav" aria-label="Favorit">${fav ? '⭐' : '☆'}</button>
  `;
  view.appendChild(header);

  // Hero
  const hero = document.createElement('div');
  hero.className = 'pass-detail-hero';
  hero.innerHTML = `
    <div class="pass-detail-emoji">${pass.emoji}</div>
    <div class="pass-detail-meta">${pass.tid} MIN · ${pass.ovningar.length} ${t(lang, 'pass.ovningar').toUpperCase()}</div>
    <div class="pass-detail-desc">${desc}</div>
  `;
  view.appendChild(hero);

  // Auto-play toggle
  const autoPlay = prefs.autoPlay;
  const toggleWrap = document.createElement('div');
  toggleWrap.className = 'toggle-row';
  toggleWrap.innerHTML = `
    <div>
      <div class="toggle-label">${t(lang, 'pass.autoPlay')}</div>
    </div>
    <button class="toggle-switch ${autoPlay ? 'on' : ''}" id="toggle-autoplay" aria-label="Auto-play">
      <div class="toggle-knob"></div>
    </button>
  `;
  view.appendChild(toggleWrap);

  // Section label
  const secLabel = document.createElement('div');
  secLabel.className = 'section-header' ;
  secLabel.style.cursor = 'default';
  secLabel.innerHTML = `<span class="section-label">${t(lang, 'pass.ovningar')}</span>`;
  view.appendChild(secLabel);

  // Exercise list
  pass.ovningar.forEach((item, i) => {
    const ovning = data.ovningar.find(o => o.id === item.ovningId);
    if (!ovning) return;
    const row = document.createElement('div');
    row.className = 'exercise-row';
    const namn = ovning.namn[lang] || ovning.namn.sv;
    row.innerHTML = `
      <div class="exercise-num">${i + 1}</div>
      <div>
        <div class="exercise-name">${namn}</div>
        <div class="exercise-val">${item.varde}${ovning.loop ? ` · ${t(lang, 'exercise.repeats')}` : ''}</div>
      </div>
      <div class="exercise-arrow">▶</div>
    `;
    row.addEventListener('click', () => navigate('exercise', { passId: pass.id, ovningIndex: i }));
    view.appendChild(row);
  });

  // Start button
  const btnRow = document.createElement('div');
  btnRow.className = 'btn-row';
  btnRow.innerHTML = `<button class="btn btn-primary btn-full" id="btn-start">${t(lang, 'pass.start')}</button>`;
  view.appendChild(btnRow);

  // Events
  view.querySelector('#btn-back').addEventListener('click', () => navigate('home'));

  view.querySelector('#btn-fav').addEventListener('click', e => {
    toggleFavorite(pass.id);
    e.currentTarget.textContent = isFavorite(pass.id) ? '⭐' : '☆';
  });

  view.querySelector('#toggle-autoplay').addEventListener('click', e => {
    const btn = e.currentTarget;
    const next = !btn.classList.contains('on');
    btn.classList.toggle('on', next);
    setPrefs({ autoPlay: next });
  });

  view.querySelector('#btn-start').addEventListener('click', () => {
    navigate('player', { passId: pass.id, ovningIndex: 0 });
  });

  return view;
}
