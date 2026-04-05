import { t } from '../i18n.js';
import { getPrefs, addHistory } from '../store.js';
import { driveToEmbed } from './exercise.js';

let timerInterval = null;

export function renderPlayer(data, params, navigate) {
  const prefs = getPrefs();
  const lang = prefs.lang;
  const pass = data.pass.find(p => p.id === params.passId);
  if (!pass) return navigate('home');

  let currentIndex = params.ovningIndex || 0;
  let seconds = 60;
  let running = false;
  const startTime = Date.now();

  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

  const view = document.createElement('div');
  view.className = 'view';

  function getCurrentOvning() {
    const item = pass.ovningar[currentIndex];
    return { item, ovning: data.ovningar.find(o => o.id === item?.ovningId) };
  }

  function buildHeader() {
    const total = pass.ovningar.length;
    const autoPlay = getPrefs().autoPlay;
    return `
      <div class="app-header">
        <button class="back-btn" id="btn-close">${t(lang, 'pass.close')}</button>
        <div style="font-weight:700;font-size:0.82rem">${currentIndex + 1} / ${total}</div>
        <span class="badge badge-accent">${autoPlay ? t(lang, 'player.auto') : t(lang, 'player.manual')}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress" style="width:${((currentIndex + 1) / total) * 100}%"></div>
      </div>
    `;
  }

  function buildBody() {
    const { item, ovning } = getCurrentOvning();
    if (!ovning) return '';
    const namn = ovning.namn[lang] || ovning.namn.sv;
    const autoPlay = getPrefs().autoPlay;

    let videoHtml = '';
    if (!navigator.onLine) {
      videoHtml = `<div class="video-container"><div class="video-offline">📵 ${t(lang, 'exercise.videoOffline')}</div></div>`;
    } else if (ovning.video) {
      const embedUrl = convertDriveUrl(ovning.video);
      videoHtml = `<div class="video-container"><iframe src="${embedUrl}" allowfullscreen allow="autoplay"></iframe></div>`;
    } else {
      videoHtml = `<div class="video-container"><div class="video-placeholder"><div class="play-icon">▶️</div><p>${t(lang, 'exercise.videoTitle')}</p></div></div>`;
    }

    return `
      ${videoHtml}
      <div class="timer-wrap">
        <div class="player-title">${namn}</div>
        <div class="player-val">${item.varde}</div>
        <div class="timer-circle">
          <div class="timer-num" id="timer-display">${seconds}</div>
          <div class="timer-label">${t(lang, 'player.sek')}</div>
        </div>
        <div class="player-btns">
          <button class="btn btn-secondary" id="btn-skip">${t(lang, 'player.skip')}</button>
          <button class="btn btn-primary" id="btn-playpause">${running ? t(lang, 'player.pause') : t(lang, 'player.play')}</button>
          ${!autoPlay ? `<button class="btn btn-secondary" id="btn-next">${t(lang, 'player.next')}</button>` : ''}
        </div>
      </div>
    `;
  }

  function render() {
    view.innerHTML = buildHeader() + buildBody();
    attachEvents();
  }

  function attachEvents() {
    view.querySelector('#btn-close')?.addEventListener('click', () => {
      stopTimer();
      navigate('workout', { passId: pass.id });
    });

    view.querySelector('#btn-playpause')?.addEventListener('click', () => {
      running ? pauseTimer() : startTimer();
    });

    view.querySelector('#btn-skip')?.addEventListener('click', goNext);
    view.querySelector('#btn-next')?.addEventListener('click', goNext);
  }

  function startTimer() {
    running = true;
    view.querySelector('#btn-playpause').textContent = t(lang, 'player.pause');
    timerInterval = setInterval(() => {
      seconds--;
      const display = view.querySelector('#timer-display');
      if (display) display.textContent = seconds;
      if (seconds <= 0) {
        stopTimer();
        const autoPlay = getPrefs().autoPlay;
        if (autoPlay) goNext();
      }
    }, 1000);
  }

  function pauseTimer() {
    running = false;
    clearInterval(timerInterval);
    timerInterval = null;
    const btn = view.querySelector('#btn-playpause');
    if (btn) btn.textContent = t(lang, 'player.play');
  }

  function stopTimer() {
    running = false;
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function goNext() {
    stopTimer();
    if (currentIndex < pass.ovningar.length - 1) {
      currentIndex++;
      seconds = 60;
      running = false;
      render();
    } else {
      // Workout complete
      const elapsed = Math.round((Date.now() - startTime) / 60000);
      const passNamn = pass.namn[lang] || pass.namn.sv;
      addHistory(pass.id, passNamn, Math.max(1, elapsed));
      navigate('complete', { passId: pass.id, passNamn });
    }
  }

  render();
  return view;
}

function convertDriveUrl(url) {
  const idMatch = url.match(/[-\w]{25,}/);
  if (!idMatch) return url;
  return `https://drive.google.com/file/d/${idMatch[0]}/preview`;
}
