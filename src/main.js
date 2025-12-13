import './style.css';
import { Preferences } from '@capacitor/preferences';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const els = {
  categories: document.getElementById('categories'),
  categoriesView: document.getElementById('categories-view'),
  gamesView: document.getElementById('games-view'),
  gamesGrid: document.getElementById('games-grid'),
  categoryCrumb: document.getElementById('category-crumb'),
  categoryTitle: document.getElementById('category-title'),
  categoryTagline: document.getElementById('category-tagline'),
  backToCategories: document.getElementById('back-to-categories'),
  playerView: document.getElementById('player-view'),
  playerCrumb: document.getElementById('player-crumb'),
  playerTitle: document.getElementById('player-title'),
  playerBack: document.getElementById('player-back'),
  playerExit: document.getElementById('player-exit'),
  starCount: document.getElementById('star-count'),
  starChip: document.getElementById('star-chip'),
  gameFrame: document.getElementById('game-frame'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  settingsGames: document.getElementById('settings-games'),
  pinInput: document.getElementById('pin-input'),
  downloadAll: document.getElementById('download-all'),
  cancelDownload: document.getElementById('cancel-download'),
  downloadStatus: document.getElementById('download-status'),
  closeSettings: document.getElementById('close-settings'),
  gateModal: document.getElementById('gate-modal'),
  gatePin: document.getElementById('gate-pin'),
  gateMath: document.getElementById('gate-math'),
  gateAnswer: document.getElementById('gate-answer'),
  gateSubmit: document.getElementById('gate-submit'),
  gateCancel: document.getElementById('gate-cancel'),
  sponsorLink: document.getElementById('sponsor-link'),
  toast: document.getElementById('toast')
};

const state = {
  data: null,
  activeCategory: null,
  activeGame: null,
  stars: 0,
  disabled: new Set(),
  pin: '0000',
  download: { busy: false, cancelled: false }
};

const STORAGE_KEYS = {
  stars: 'playstori-stars',
  disabled: 'playstori-disabled',
  pin: 'playstori-pin'
};

const mathPrompt = () => {
  const a = Math.floor(Math.random() * 5) + 3;
  const b = Math.floor(Math.random() * 6) + 4;
  return { question: `${a} + ${b} = ?`, answer: a + b };
};

function showView(view) {
  const views = ['categoriesView', 'gamesView', 'playerView'];
  views.forEach((v) => {
    const el = els[v];
    if (!el) return;
    if (view === v) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

async function loadPrefs() {
  const [stars, disabled, pin] = await Promise.all([
    Preferences.get({ key: STORAGE_KEYS.stars }),
    Preferences.get({ key: STORAGE_KEYS.disabled }),
    Preferences.get({ key: STORAGE_KEYS.pin })
  ]);
  state.stars = parseInt(stars.value ?? '0', 10) || 0;
  state.disabled = new Set(JSON.parse(disabled.value || '[]'));
  state.pin = pin.value || '0000';
  els.starCount.textContent = state.stars;
  els.pinInput.value = state.pin;
}

async function saveStars() {
  await Preferences.set({ key: STORAGE_KEYS.stars, value: String(state.stars) });
}

async function saveDisabled() {
  await Preferences.set({ key: STORAGE_KEYS.disabled, value: JSON.stringify([...state.disabled]) });
}

async function savePin() {
  state.pin = els.pinInput.value.trim() || '0000';
  await Preferences.set({ key: STORAGE_KEYS.pin, value: state.pin });
}

async function loadGames() {
  const res = await fetch('games.json');
  if (!res.ok) throw new Error('Failed to load games.json');
  state.data = await res.json();
  if (state.data?.settings?.sponsorUrl) {
    els.sponsorLink.href = state.data.settings.sponsorUrl;
  }
  renderCategories();
}

function renderCategories() {
  els.categories.innerHTML = '';
  const fragment = document.createDocumentFragment();
  (state.data?.categories || []).forEach((cat, idx) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-title">
        <div>
          <div class="eyebrow">Category ${idx + 1}</div>
          <h3>${cat.name}</h3>
        </div>
        <span class="pill">${cat.games?.length || 0} game${(cat.games?.length || 0) === 1 ? '' : 's'}</span>
      </div>
      <p>${cat.tagline || ''}</p>
    `;
    card.addEventListener('click', () => openCategory(cat));
    fragment.appendChild(card);
  });
  els.categories.appendChild(fragment);
}

function openCategory(cat) {
  state.activeCategory = cat;
  els.categoryCrumb.textContent = `Category ${cat.id}`;
  els.categoryTitle.textContent = cat.name;
  els.categoryTagline.textContent = cat.tagline || '';
  renderGames(cat);
  showView('gamesView');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGames(cat) {
  els.gamesGrid.innerHTML = '';
  const games = (cat.games || []).filter((game) => !state.disabled.has(game.id));
  if (!games.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No games enabled in this category.';
    els.gamesGrid.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  games.forEach((game) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img class="game-thumb" src="${game.thumb}" alt="${game.name} cover" loading="lazy" />
      <div class="game-meta">
        <h3>${game.name}</h3>
        <p class="muted">${game.description || 'Tap to play offline or online.'}</p>
      </div>
    `;
    card.addEventListener('click', () => openGame(game));
    fragment.appendChild(card);
  });
  els.gamesGrid.appendChild(fragment);
}

function openGame(game) {
  // Open game directly (no wrapper) for better mobile/fullscreen experience
  window.location.href = game.path;
}

function closeGame() {
  els.gameFrame.src = 'about:blank';
  state.activeGame = null;
  showView('gamesView');
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  requestAnimationFrame(() => els.toast.classList.add('visible'));
  setTimeout(() => {
    els.toast.classList.remove('visible');
    setTimeout(() => els.toast.classList.add('hidden'), 200);
  }, 2200);
}

async function incrementStars(gameId) {
  state.stars += 1;
  els.starCount.textContent = state.stars;
  els.starChip.classList.remove('bump');
  void els.starChip.offsetWidth; // restart animation
  els.starChip.classList.add('bump');
  await saveStars();
  showToast(`+1 star earned${gameId ? ` in ${gameId}` : ''}!`);
}

function handleMessages(event) {
  const { data } = event;
  if (!data || typeof data !== 'object') return;
  if (data.type === 'ADD_STAR') {
    incrementStars(data.gameId);
  }
}

function populateSettings() {
  els.settingsGames.innerHTML = '';
  const fragment = document.createDocumentFragment();
  (state.data?.categories || []).forEach((cat) => {
    (cat.games || []).forEach((game) => {
      const row = document.createElement('div');
      row.className = 'toggle-row';
      const id = `toggle-${game.id}`;
      row.innerHTML = `
        <div>
          <label for="${id}"><strong>${game.name}</strong></label>
          <p class="muted">${cat.name}</p>
        </div>
        <input id="${id}" type="checkbox" ${state.disabled.has(game.id) ? '' : 'checked'} />
      `;
      row.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) state.disabled.delete(game.id);
        else state.disabled.add(game.id);
        saveDisabled();
        if (state.activeCategory?.id === cat.id) renderGames(cat);
      });
      fragment.appendChild(row);
    });
  });
  els.settingsGames.appendChild(fragment);
  els.pinInput.value = state.pin;
}

async function openGate(onSuccess) {
  const math = mathPrompt();
  els.gateMath.textContent = math.question;
  els.gatePin.value = '';
  els.gateAnswer.value = '';
  els.gateModal.classList.remove('hidden');

  const submit = async () => {
    const pinOk = (els.gatePin.value || '').trim() === state.pin;
    const mathOk = Number(els.gateAnswer.value || '') === math.answer;
    if (!pinOk && !mathOk) {
      showToast('Try again.');
      return;
    }
    els.gateModal.classList.add('hidden');
    onSuccess();
  };

  const cleanup = () => {
    els.gateSubmit.removeEventListener('click', submit);
    els.gateCancel.removeEventListener('click', cancel);
  };
  const cancel = () => {
    els.gateModal.classList.add('hidden');
    cleanup();
  };

  els.gateSubmit.addEventListener('click', submit, { once: true });
  els.gateCancel.addEventListener('click', cancel, { once: true });
}

async function openSettings() {
  populateSettings();
  els.settingsModal.classList.remove('hidden');
}

function closeSettings() {
  els.settingsModal.classList.add('hidden');
  savePin();
}

function collectAssets() {
  const seen = new Set();
  const assets = ['games.json'];
  (state.data?.categories || []).forEach((cat) => {
    (cat.games || []).forEach((game) => {
      [game.path, game.thumb, ...(game.assets || [])].forEach((asset) => {
        if (asset && !seen.has(asset)) {
          seen.add(asset);
          assets.push(asset);
        }
      });
    });
  });
  return assets;
}

async function downloadAllGames() {
  if (state.download.busy) return;
  state.download.busy = true;
  state.download.cancelled = false;
  els.downloadStatus.textContent = 'Preparing download...';
  els.cancelDownload.classList.remove('hidden');

  try {
    const cache = await caches.open('playstori-games');
    const assets = collectAssets();
    let done = 0;
    for (const asset of assets) {
      if (state.download.cancelled) throw new Error('cancelled');
      try {
        await cache.add(new Request(asset, { cache: 'reload' }));
      } catch (err) {
        console.warn('Cache miss', asset, err);
      }
      done += 1;
      els.downloadStatus.textContent = `Cached ${done}/${assets.length} assets`;
    }
    if (!state.download.cancelled) {
      showToast('All games cached for offline play.');
      els.downloadStatus.textContent = 'Ready for offline play.';
    }
  } catch (err) {
    if (err.message === 'cancelled') {
      els.downloadStatus.textContent = 'Download cancelled.';
    } else {
      els.downloadStatus.textContent = 'Download failed. Try again.';
      showToast('Download failed. Check connection or storage.');
    }
  } finally {
    state.download.busy = false;
    state.download.cancelled = false;
    els.cancelDownload.classList.add('hidden');
  }
}

function setupEvents() {
  window.addEventListener('message', handleMessages);
  els.backToCategories.addEventListener('click', () => {
    state.activeCategory = null;
    showView('categoriesView');
  });
  els.playerBack.addEventListener('click', () => {
    closeGame();
    showView('gamesView');
  });
  els.playerExit.addEventListener('click', () => {
    closeGame();
    showView('categoriesView');
  });
  els.settingsBtn.addEventListener('click', () => openGate(openSettings));
  els.closeSettings.addEventListener('click', closeSettings);
  els.downloadAll.addEventListener('click', downloadAllGames);
  els.cancelDownload.addEventListener('click', () => {
    state.download.cancelled = true;
    els.downloadStatus.textContent = 'Stopping...';
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeGame();
      els.settingsModal.classList.add('hidden');
      els.gateModal.classList.add('hidden');
    }
  });
}

async function start() {
  try {
    await loadPrefs();
    await loadGames();
    setupEvents();
    showView('categoriesView');
  } catch (err) {
    console.error(err);
    showToast('Could not load games. Check files and try again.');
  }
}

start();
