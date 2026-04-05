import { t } from '../i18n.js';
import { getPrefs } from '../store.js';

export function renderComplete(data, params, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;
  const namn = params.passNamn || '';

  const view = document.createElement('div');
  view.className = 'view';
  view.style.display = 'flex';
  view.style.flexDirection = 'column';

  const title = prefs.name
    ? t(lang, 'complete.titleWith')(prefs.name)
    : t(lang, 'complete.title') + '!';

  view.innerHTML = `
    <div class="complete-screen">
      <div class="complete-icon">${t(lang, 'complete.icon')}</div>
      <div class="complete-title">${title}</div>
      <div class="complete-sub">${t(lang, 'complete.sub')(namn)}</div>
      <button class="btn btn-primary" id="btn-home">${t(lang, 'complete.home')}</button>
    </div>
  `;

  view.querySelector('#btn-home').addEventListener('click', () => navigate('home'));
  return view;
}
