import { t } from '../i18n.js';
import { getPrefs, setPrefs, clearHistory } from '../store.js';

export function renderSettings(data, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;

  const view = document.createElement('div');
  view.className = 'view';

  view.innerHTML = `
    <div class="app-header">
      <div style="font-weight:800;font-size:1.1rem">${t(lang, 'settings.title')}</div>
    </div>
  `;

  const content = document.createElement('div');
  content.style.padding = '4px 0 16px';

  // Profile
  content.innerHTML += `<div class="section-label" style="padding:10px 12px 6px">${t(lang, 'settings.profile')}</div>`;
  const profileGroup = document.createElement('div');
  profileGroup.className = 'settings-input-group';
  profileGroup.innerHTML = `
    <div class="settings-field">
      <label for="input-name">${t(lang, 'settings.name')}</label>
      <input id="input-name" type="text" value="${prefs.name}" placeholder="${t(lang, 'settings.namePlaceholder')}" autocomplete="name" />
    </div>
    <div class="settings-field">
      <label for="input-email">${t(lang, 'settings.email')}</label>
      <input id="input-email" type="email" value="${prefs.email}" placeholder="${t(lang, 'settings.emailPlaceholder')}" autocomplete="email" />
    </div>
  `;
  content.appendChild(profileGroup);

  // Appearance – theme dropdown
  content.innerHTML += `<div class="section-label" style="padding:10px 12px 6px">${t(lang, 'settings.appearance')}</div>`;
  const themeWrap = document.createElement('div');
  themeWrap.style.cssText = 'margin:0 12px 10px';

  const themeOptions = data.teman.map(tema => ({
    key: tema.key,
    label: t(lang, `themes.${tema.key}`) || tema.namn[lang] || tema.namn.sv
  }));

  themeWrap.appendChild(buildDropdown(
    themeOptions,
    prefs.theme,
    (key) => {
      setPrefs({ theme: key });
      document.documentElement.setAttribute('data-theme', key);
    }
  ));
  content.appendChild(themeWrap);

  // Language dropdown
  content.innerHTML += `<div class="section-label" style="padding:10px 12px 6px">${t(lang, 'settings.language')}</div>`;
  const langWrap = document.createElement('div');
  langWrap.style.cssText = 'margin:0 12px 10px';

  const langOptions = [
    { key: 'sv', label: 'Svenska' },
    { key: 'en', label: 'English' }
  ];

  langWrap.appendChild(buildDropdown(
    langOptions,
    prefs.lang,
    (key) => {
      setPrefs({ lang: key });
      navigate('settings'); // Re-render with new language
    }
  ));
  content.appendChild(langWrap);

  // Data
  content.innerHTML += `<div class="section-label" style="padding:10px 12px 6px">${t(lang, 'settings.data')}</div>`;
  const dataGroup = document.createElement('div');
  dataGroup.className = 'settings-group';
  dataGroup.innerHTML = `
    <div class="settings-row" id="btn-clear">
      <span class="settings-row-label settings-danger">${t(lang, 'settings.clearHistory')}</span>
      <span class="settings-arrow">→</span>
    </div>
  `;
  content.appendChild(dataGroup);

  // Support
  content.innerHTML += `<div class="section-label" style="padding:10px 12px 6px">${t(lang, 'settings.support')}</div>`;
  const supportGroup = document.createElement('div');
  supportGroup.className = 'settings-group';
  supportGroup.innerHTML = `
    <div class="settings-row" style="cursor:default">
      <span class="settings-row-label">${t(lang, 'settings.contact')}</span>
      <a href="mailto:appen@nynashamnsgymnastik.se" class="settings-mailto">appen@nynashamnsgymnastik.se</a>
    </div>
  `;
  content.appendChild(supportGroup);

  // Version
  const info = document.createElement('div');
  info.className = 'settings-info';
  info.textContent = t(lang, 'settings.version');
  content.appendChild(info);

  view.appendChild(content);

  // Save profile on blur
  view.querySelector('#input-name')?.addEventListener('blur', e => {
    setPrefs({ name: e.target.value.trim() });
  });
  view.querySelector('#input-email')?.addEventListener('blur', e => {
    setPrefs({ email: e.target.value.trim() });
  });

  // Clear history
  view.querySelector('#btn-clear')?.addEventListener('click', () => {
    showModal(view, lang, () => {
      clearHistory();
    });
  });

  return view;
}

function buildDropdown(options, current, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'dropdown';

  const currentLabel = options.find(o => o.key === current)?.label || current;

  wrap.innerHTML = `
    <button class="dropdown-trigger" type="button">
      <span class="dropdown-label">${currentLabel}</span>
      <span class="dropdown-arrow">▾</span>
    </button>
    <div class="dropdown-menu hidden"></div>
  `;

  const trigger = wrap.querySelector('.dropdown-trigger');
  const menu = wrap.querySelector('.dropdown-menu');
  const arrow = wrap.querySelector('.dropdown-arrow');
  const label = wrap.querySelector('.dropdown-label');

  options.forEach(opt => {
    const item = document.createElement('div');
    item.className = `dropdown-item${opt.key === current ? ' selected' : ''}`;
    item.innerHTML = `<span>${opt.label}</span>${opt.key === current ? '<span>✓</span>' : ''}`;
    item.addEventListener('click', () => {
      label.textContent = opt.label;
      menu.classList.add('hidden');
      arrow.classList.remove('open');
      onChange(opt.key);
    });
    menu.appendChild(item);
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    arrow.classList.toggle('open', !isOpen);
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
    arrow.classList.remove('open');
  }, { once: false });

  return wrap;
}

function showModal(container, lang, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-title">${t(lang, 'modal.clearTitle')}</div>
      <div class="modal-body">${t(lang, 'modal.clearBody')}</div>
      <div class="modal-btns">
        <button class="btn btn-secondary" id="modal-cancel" style="flex:1">${t(lang, 'modal.cancel')}</button>
        <button class="btn btn-danger" id="modal-confirm" style="flex:1">${t(lang, 'modal.confirm')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-confirm').addEventListener('click', () => {
    onConfirm();
    overlay.remove();
  });
}
