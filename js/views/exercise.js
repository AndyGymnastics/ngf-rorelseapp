import { t } from '../i18n.js';
import { getPrefs } from '../store.js';

export function renderExercise(data, params, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;
  const pass = data.pass.find(p => p.id === params.passId);
  if (!pass) return navigate('home');

  const item = pass.ovningar[params.ovningIndex];
  const ovning = data.ovningar.find(o => o.id === item?.ovningId);
  if (!ovning) return navigate('workout', { passId: params.passId });

  const view = document.createElement('div');
  view.className = 'view';

  const namn = ovning.namn[lang] || ovning.namn.sv;
  const desc = ovning.beskrivning[lang] || ovning.beskrivning.sv;

  // Header
  const header = document.createElement('div');
  header.className = 'app-header';
  header.innerHTML = `
    <button class="back-btn" id="btn-back">${t(lang, 'pass.back')}</button>
    <div style="font-weight:800;font-size:0.9rem;flex:1;text-align:center;padding:0 8px">${namn}</div>
    <div style="width:32px"></div>
  `;
  view.appendChild(header);

  // Video
  const videoWrap = document.createElement('div');
  videoWrap.className = 'video-container';

  if (!navigator.onLine) {
    videoWrap.innerHTML = `<div class="video-offline">📵 ${t(lang, 'exercise.videoOffline')}</div>`;
  } else if (ovning.video) {
    // Convert Google Drive share URL to embed URL
    const embedUrl = driveToEmbed(ovning.video);
    videoWrap.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay"></iframe>`;
  } else {
    videoWrap.innerHTML = `
      <div class="video-placeholder">
        <div class="play-icon">▶️</div>
        <p>${t(lang, 'exercise.videoTitle')}</p>
        <small>${t(lang, 'exercise.videoSource')}</small>
      </div>
    `;
  }
  view.appendChild(videoWrap);

  // Detail
  const detail = document.createElement('div');
  detail.className = 'exercise-detail';
  detail.innerHTML = `
    <div class="exercise-detail-name">${namn}</div>
    <div class="badges" style="margin-top:4px;margin-bottom:10px">
      <span class="badge badge-muted">${item.varde}</span>
      ${ovning.loop ? `<span class="badge badge-muted">🔁 ${t(lang, 'exercise.repeats')}</span>` : ''}
    </div>
    <div class="exercise-detail-desc">${desc || t(lang, 'exercise.instruction')}</div>
  `;
  view.appendChild(detail);

  view.querySelector('#btn-back').addEventListener('click', () =>
    navigate('workout', { passId: params.passId })
  );

  return view;
}

function driveToEmbed(url) {
  // Handle different Google Drive URL formats
  const idMatch = url.match(/[-\w]{25,}/);
  if (!idMatch) return url;
  return `https://drive.google.com/file/d/${idMatch[0]}/preview`;
}
