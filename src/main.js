import './style.css';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import JSZip from 'jszip';

const isNativePlatform = Capacitor.getPlatform() !== 'web';
let updateSW = null;

if (!isNativePlatform) {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW?.(true);
    }
  });

  window.addEventListener('load', () => updateSW?.());
} else if ('serviceWorker' in navigator) {
  const swResetKey = 'playstori-sw-reset';
  navigator.serviceWorker.getRegistrations()
    .then((regs) => {
      if (!regs.length) return;
      return Promise.all(regs.map((reg) => reg.unregister())).then(() => {
        if (navigator.serviceWorker.controller && !sessionStorage.getItem(swResetKey)) {
          sessionStorage.setItem(swResetKey, '1');
          window.location.reload();
        }
      });
    })
    .catch((err) => console.warn('Failed to unregister service workers', err));
}

const els = {
  gamesGrid: document.getElementById('games-grid'),
  categoryRibbon: document.getElementById('category-ribbon'),
  searchShell: document.getElementById('search-shell'),
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  toast: document.getElementById('toast'),
  navHome: document.getElementById('nav-home'),
  navManager: document.getElementById('nav-manager'),
  homeView: document.getElementById('home-view'),
  managerView: document.getElementById('manager-view'),
  managerList: document.getElementById('manager-list'),
  storageStats: document.getElementById('storage-stats'),
  downloadAllBtn: document.getElementById('download-all'),
  deleteAllBtn: document.getElementById('delete-all')
};

const state = {
  games: [],
  disabled: new Set(),
  searchTerm: '',
  activeCategory: 'All',
  view: 'home', // 'home' or 'manager'
  manifestVersion: 0,
  downloading: new Set() // IDs of games being downloaded
};

const STORAGE_KEYS = {
  disabled: 'playstori-disabled',
  manifestVersion: 'playstori-manifest-version'
};

const GAME_ENTRY_FILE = '.entry.json';

const CATEGORIES = [
  'All',
  '🧩 Brain Puzzles',
  '🕹️ Super Arcade',
  '🏎️ Fast & Fun',
  '🎲 Classic Tabletop',
  '✨ Learning Adventures',
  '🎯 Target & Aim'
];

async function loadPrefs() {
  const [disabled, version] = await Promise.all([
    Preferences.get({ key: STORAGE_KEYS.disabled }),
    Preferences.get({ key: STORAGE_KEYS.manifestVersion })
  ]);
  state.disabled = new Set(JSON.parse(disabled.value || '[]'));
  state.manifestVersion = parseInt(version.value || '0', 10);
}

async function loadGames() {
  // 1. Load initial manifest
  // We try Filesystem first (persisted update), then fall back to bundled asset
  let manifestLoaded = false;

  if (Capacitor.getPlatform() !== 'web') {
    try {
      const saved = await Filesystem.readFile({
        path: 'games-update.json',
        directory: Directory.Data,
        encoding: 'utf8'
      });
      const data = JSON.parse(saved.data);
      state.games = data.games || [];
      state.manifestVersion = data.manifestVersion || 0;
      manifestLoaded = true;
      console.log('Loaded persisted manifest version:', state.manifestVersion);
    } catch (e) {
      console.log('No persisted manifest found or failed to parse. Falling back to assets.');
    }
  }

  if (!manifestLoaded) {
    try {
      const res = await fetch('/appstorage/games.json', { cache: 'no-cache' });
      if (res.ok) {
        const localData = await res.json();
        state.games = localData?.games || [];
        state.manifestVersion = localData?.manifestVersion || 0;
        console.log('Loaded bundled manifest version:', state.manifestVersion);
      }
    } catch (e) {
      console.warn('Local games.json could not be parsed.', e);
    }
  }

  // 2. Check for remote updates
  try {
    // We use CapacitorHttp directly to avoid CORS and because we disabled the global patch
    const remoteRes = await CapacitorHttp.get({
      url: 'https://playstori.org/appstorage/games.json'
    });

    // CapacitorHttp returns .data as parsed JSON if content-type matches, or string/obj
    if (remoteRes.status === 200) {
      const remoteData = remoteRes.data;
      // Depending on version/platform, data might be parsed object or string
      const dataObj = typeof remoteData === 'string' ? JSON.parse(remoteData) : remoteData;

      if (dataObj && dataObj.manifestVersion > state.manifestVersion) {
        console.log(`Updating manifest: ${state.manifestVersion} -> ${dataObj.manifestVersion}`);
        state.games = dataObj.games;
        state.manifestVersion = dataObj.manifestVersion;

        // Save for next restart
        if (Capacitor.getPlatform() !== 'web') {
          await Filesystem.writeFile({
            path: 'games-update.json',
            data: JSON.stringify(dataObj),
            directory: Directory.Data,
            encoding: 'utf8'
          });
        }

        await Preferences.set({ key: STORAGE_KEYS.manifestVersion, value: String(state.manifestVersion) });
        renderGames();
      }
    }
  } catch (e) {
    console.warn('Could not check for remote manifest update', e);
  }
}


function normalizeEntryPath(entryPath) {
  if (!entryPath) return null;
  let normalized = entryPath.replace(/\\/g, '/').trim();
  normalized = normalized.replace(/^\.?\//, '');
  while (normalized.startsWith('/')) normalized = normalized.slice(1);
  while (normalized.startsWith('../')) normalized = normalized.slice(3);
  return normalized || null;
}

function pickEntryPathFromZip(zip) {
  const fileNames = Object.keys(zip.files)
    .filter((name) => !zip.files[name].dir)
    .map((name) => name.replace(/\\/g, '/'));
  const indexFiles = fileNames.filter((name) => name.toLowerCase().endsWith('index.html'));
  if (!indexFiles.length) return null;
  const rootIndex = indexFiles.find((name) => !name.includes('/'));
  if (rootIndex) return rootIndex;
  return indexFiles.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aUnmin = aLower.includes('unmin') || aLower.includes('debug');
    const bUnmin = bLower.includes('unmin') || bLower.includes('debug');
    if (aUnmin !== bUnmin) return aUnmin ? 1 : -1;
    const aMin = aLower.includes('minify');
    const bMin = bLower.includes('minify');
    if (aMin !== bMin) return aMin ? -1 : 1;
    const depthDiff = a.split('/').length - b.split('/').length;
    return depthDiff || a.length - b.length;
  })[0];
}

function getEntryPathFromManifest(game) {
  if (!game?.path || !game?.id) return null;
  let path = game.path.replace(/\\/g, '/').trim();
  path = path.replace(/^\/+/, '');
  const primaryPrefix = `appstorage/games/${game.id}/`;
  if (path.startsWith(primaryPrefix)) {
    return normalizeEntryPath(path.slice(primaryPrefix.length));
  }
  const altPrefix = `/appstorage/games/${game.id}/`;
  if (path.startsWith(altPrefix)) {
    return normalizeEntryPath(path.slice(altPrefix.length));
  }
  const idMarker = `${game.id}/`;
  const idx = path.indexOf(idMarker);
  if (idx !== -1) {
    return normalizeEntryPath(path.slice(idx + idMarker.length));
  }
  return normalizeEntryPath(path);
}

async function saveGameEntryPath(gameId, entryPath) {
  const normalized = normalizeEntryPath(entryPath);
  if (!normalized) return;
  await Filesystem.writeFile({
    path: `games/${gameId}/${GAME_ENTRY_FILE}`,
    data: JSON.stringify({ path: normalized }),
    directory: Directory.Data,
    encoding: 'utf8'
  });
}

async function loadGameEntryPath(gameId) {
  try {
    const stored = await Filesystem.readFile({
      path: `games/${gameId}/${GAME_ENTRY_FILE}`,
      directory: Directory.Data,
      encoding: 'utf8'
    });
    const data = JSON.parse(stored.data);
    return normalizeEntryPath(data?.path);
  } catch {
    return null;
  }
}

async function findIndexHtmlPath(gameId) {
  const basePath = `games/${gameId}`;
  const queue = [basePath];

  while (queue.length) {
    const current = queue.shift();
    let entries;
    try {
      entries = await Filesystem.readdir({
        path: current,
        directory: Directory.Data
      });
    } catch {
      continue;
    }

    for (const entry of entries.files || []) {
      const name = typeof entry === 'string' ? entry : entry.name;
      if (!name) continue;
      const fullPath = `${current}/${name}`;
      const type = typeof entry === 'string' ? null : entry.type;

      if (type === 'directory') {
        queue.push(fullPath);
        continue;
      }

      if (name.toLowerCase() === 'index.html') {
        return fullPath;
      }

      if (type == null) {
        try {
          const stat = await Filesystem.stat({
            path: fullPath,
            directory: Directory.Data
          });
          if (stat.type === 'directory') {
            queue.push(fullPath);
          } else if (name.toLowerCase() === 'index.html') {
            return fullPath;
          }
        } catch {
          // ignore unknown entries
        }
      }
    }
  }

  return null;
}

const DownloadManager = {
  async isDownloaded(gameId) {
    try {
      const result = await Filesystem.readdir({
        path: `games/${gameId}`,
        directory: Directory.Data
      });
      return result.files.length > 0;
    } catch (e) {
      return false;
    }
  },

  async downloadAndUnpack(game) {
    if (state.downloading.has(game.id)) return;
    state.downloading.add(game.id);
    renderGames();
    renderManager();

    try {
      const zipUrl = `https://playstori.org/appstorage/games/${game.id}.zip`;

      const response = await CapacitorHttp.get({
        url: zipUrl,
        responseType: 'arraybuffer'
      });

      console.log(`Download status for ${game.id}:`, response.status);
      console.log(`Content-Type:`, response.headers['Content-Type'] || response.headers['content-type']);
      console.log(`Data Type:`, typeof response.data);

      if (response.status !== 200) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const contentType = (response.headers['Content-Type'] || response.headers['content-type'] || '').toLowerCase();
      if (contentType.includes('text/html')) {
        throw new Error('Received HTML instead of a ZIP file. Is the game uploaded to the server?');
      }

      let zipData = response.data;

      // Handle cases where CapacitorHttp might return base64 instead of ArrayBuffer
      if (typeof zipData === 'string') {
        console.log('Data is string, attempting base64 to ArrayBuffer conversion');
        try {
          const binaryString = window.atob(zipData);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          zipData = bytes.buffer;
        } catch (e) {
          console.error('Failed to convert string to binary. If it is not base64, JSZip might fail.');
        }
      }

      const zip = await JSZip.loadAsync(zipData);
      const gameDir = `games/${game.id}`;

      // Create game directory
      await Filesystem.mkdir({
        path: gameDir,
        directory: Directory.Data,
        recursive: true
      }).catch(() => { });

      // Extract files
      const files = Object.keys(zip.files);
      for (const filename of files) {
        const file = zip.files[filename];
        if (file.dir) {
          await Filesystem.mkdir({
            path: `${gameDir}/${filename}`,
            directory: Directory.Data,
            recursive: true
          }).catch(() => { });
        } else {
          const content = await file.async('base64');
          await Filesystem.writeFile({
            path: `${gameDir}/${filename}`,
            data: content,
            directory: Directory.Data
          });
        }
      }


      const entryPath = pickEntryPathFromZip(zip);
      const manifestEntry = getEntryPathFromManifest(game);
      if (manifestEntry) {
        await saveGameEntryPath(game.id, manifestEntry);
      } else if (entryPath) {
        await saveGameEntryPath(game.id, entryPath);
      }

      showToast(`${game.name} is ready to play!`);
    } catch (e) {
      console.error(e);
      showToast(`Failed to download ${game.name}`);
    } finally {
      state.downloading.delete(game.id);
      renderGames();
      renderManager();
    }
  },

  async deleteGame(gameId) {
    try {
      await Filesystem.rmdir({
        path: `games/${gameId}`,
        directory: Directory.Data,
        recursive: true
      });
      renderGames();
      renderManager();
      showToast('Game deleted to free up space.');
    } catch (e) {
      console.error(e);
      showToast('Failed to delete game.');
    }
  },

  async deleteAll() {
    if (!confirm('Are you sure you want to delete ALL downloaded games to free up space?')) return;
    try {
      const result = await Filesystem.readdir({
        path: 'games',
        directory: Directory.Data
      });

      for (const file of result.files) {
        await Filesystem.rmdir({
          path: `games/${file.name}`,
          directory: Directory.Data,
          recursive: true
        });
      }
      renderGames();
      renderManager();
      showToast('All local games deleted.');
    } catch (e) {
      console.error('Delete all failed', e);
      showToast('Cleanup failed.');
    }
  }
};

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  requestAnimationFrame(() => els.toast.classList.add('visible'));
  setTimeout(() => {
    els.toast.classList.remove('visible');
    setTimeout(() => els.toast.classList.add('hidden'), 200);
  }, 2200);
}

async function renderGames() {
  if (!els.gamesGrid) return;

  const term = state.searchTerm.trim().toLowerCase();
  let filtered = state.games.filter((g) => !state.disabled.has(g.id));

  if (state.activeCategory !== 'All') {
    filtered = filtered.filter(g => g.category === state.activeCategory);
  }

  if (term) {
    filtered = filtered.filter(g =>
      g.name.toLowerCase().includes(term) || (g.tag || '').toLowerCase().includes(term)
    );
  }

  // Split into "Ready to Play" and "Cloud"
  const ready = [];
  const cloud = [];
  const isWeb = Capacitor.getPlatform() === 'web';

  for (const game of filtered) {
    // On Web, everything is "Ready" because it streams on-demand
    if (isWeb || await DownloadManager.isDownloaded(game.id)) {
      ready.push(game);
    } else {
      cloud.push(game);
    }
  }

  els.gamesGrid.innerHTML = '';

  if (ready.length > 0) {
    const section = document.createElement('div');
    section.className = 'grid-section';
    section.innerHTML = '<h3 class="section-title">Ready to Play</h3>';
    const grid = document.createElement('div');
    grid.className = 'games-inner-grid';
    ready.forEach(g => grid.appendChild(createGameCard(g, true)));
    section.appendChild(grid);
    els.gamesGrid.appendChild(section);
  }

  if (cloud.length > 0) {
    const section = document.createElement('div');
    section.className = 'grid-section';
    section.innerHTML = `<h3 class="section-title">${ready.length > 0 ? 'More Games' : 'Discover'}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'games-inner-grid';
    cloud.forEach(g => grid.appendChild(createGameCard(g, false)));
    section.appendChild(grid);
    els.gamesGrid.appendChild(section);
  }

  if (filtered.length === 0) {
    els.gamesGrid.innerHTML = '<p class="muted">No games match your criteria.</p>';
  }
}

function createGameCard(game, isLocal) {
  const card = document.createElement('div');
  const isDownloading = state.downloading.has(game.id);

  // Centralized icon resolution: try local first, fallback to remote
  const localThumb = `/${game.thumb}`;
  const remoteThumb = `https://playstori.org/${game.thumb}`;

  card.className = `game-card ${!isLocal ? 'cloud' : ''} ${isDownloading ? 'loading' : ''}`;
  card.innerHTML = `
    <img class="game-thumb" 
         src="${localThumb}" 
         onerror="if(this.src !== '${remoteThumb}') this.src='${remoteThumb}'"
         alt="${game.name}" 
         loading="lazy" />
    <div class="game-overlay">
      <span class="game-name">${game.name}</span>
      <span class="game-status-icon">${isDownloading ? '⏳' : (isLocal ? '▶️' : '☁️')}</span>
    </div>
    ${isDownloading ? '<div class="progress-bar-container"><div class="progress-bar-fill"></div></div>' : ''}
  `;

  card.addEventListener('click', () => {
    if (isDownloading) return;
    if (isLocal) {
      openGame(game);
    } else {
      DownloadManager.downloadAndUnpack(game);
    }
  });

  return card;
}

async function openGame(game) {
  try {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      console.log('Running on web, using path from manifest:', game.path);
      // Use the exact path from the manifest
      window.location.href = `/${game.path}`;
      return;
    }

    let entryPath = getEntryPathFromManifest(game);
    if (!entryPath) {
      entryPath = await loadGameEntryPath(game.id);
    }
    if (!entryPath) {
      entryPath = 'index.html';
    }

    let fullPath = `games/${game.id}/${entryPath}`;
    let result;

    try {
      await Filesystem.stat({
        path: fullPath,
        directory: Directory.Data
      });
      result = await Filesystem.getUri({
        path: fullPath,
        directory: Directory.Data
      });
    } catch {
      const scannedPath = await findIndexHtmlPath(game.id);
      if (!scannedPath) {
        throw new Error('index.html not found for game.');
      }
      await saveGameEntryPath(game.id, scannedPath.replace(`games/${game.id}/`, ''));
      fullPath = scannedPath;
      result = await Filesystem.getUri({
        path: fullPath,
        directory: Directory.Data
      });
    }

    // Use Capacitor's utility to convert file:// to a URL the webview can load
    const gameUrl = Capacitor.convertFileSrc(result.uri);
    console.log('Launching game at:', gameUrl);

    // Load the game directly in the app WebView (no iframe)
    window.location.href = gameUrl;
  } catch (e) {
    console.error(e);
    showToast('Could not launch game. Try re-downloading.');
  }
}

function renderCategoryRibbon() {
  if (!els.categoryRibbon) return;
  els.categoryRibbon.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = `tag-pill ${state.activeCategory === cat ? 'active' : ''}`;
    pill.textContent = cat;
    pill.addEventListener('click', () => {
      state.activeCategory = cat;
      renderCategoryRibbon();
      renderGames();
    });
    els.categoryRibbon.appendChild(pill);
  });
}

async function renderManager() {
  if (!els.managerList) return;
  els.managerList.innerHTML = '';

  for (const game of state.games) {
    const isDownloaded = await DownloadManager.isDownloaded(game.id);
    const isDownloading = state.downloading.has(game.id);

    const row = document.createElement('div');
    row.className = 'manager-row';
    const localThumb = `/${game.thumb}`;
    const remoteThumb = `https://playstori.org/${game.thumb}`;

    row.innerHTML = `
      <div class="manager-info">
        <img class="manager-thumb" 
             src="${localThumb}" 
             onerror="if(this.src !== '${remoteThumb}') this.src='${remoteThumb}'" />
        <div>
          <div class="manager-name">${game.name}</div>
          <div class="manager-status">${isDownloading ? 'Downloading...' : (isDownloaded ? 'Installed' : 'Cloud')}</div>
        </div>
      </div>
      <div class="manager-actions">
        ${isDownloaded ? `
          <button class="delete-btn" title="Delete">🗑️</button>
        ` : `
          <button class="download-btn" ${isDownloading ? 'disabled' : ''}>${isDownloading ? '⏳' : '📥'}</button>
        `}
      </div>
    `;

    const deleteBtn = row.querySelector('.delete-btn');
    if (deleteBtn) deleteBtn.addEventListener('click', () => DownloadManager.deleteGame(game.id));

    const downloadBtn = row.querySelector('.download-btn');
    if (downloadBtn) downloadBtn.addEventListener('click', () => DownloadManager.downloadAndUnpack(game));

    els.managerList.appendChild(row);
  }
}

function switchView(view) {
  state.view = view;
  els.homeView.classList.toggle('hidden', view !== 'home');
  els.managerView.classList.toggle('hidden', view !== 'manager');
  els.navHome.classList.toggle('active', view === 'home');
  els.navManager.classList.toggle('active', view === 'manager');

  if (view === 'manager') renderManager();
}

function setupEvents() {
  if (els.searchInput) {
    els.searchInput.addEventListener('input', (event) => {
      state.searchTerm = event.target.value || '';
      renderGames();
    });
  }

  if (els.navHome) els.navHome.addEventListener('click', () => switchView('home'));
  if (els.navManager) els.navManager.addEventListener('click', () => switchView('manager'));

  if (els.deleteAllBtn) {
    els.deleteAllBtn.addEventListener('click', () => DownloadManager.deleteAll());
  }

  if (els.downloadAllBtn) {
    els.downloadAllBtn.addEventListener('click', async () => {
      const cloudGames = state.games.filter(g => !state.downloading.has(g.id));
      showToast(`Starting download of ${cloudGames.length} games...`);
      for (const g of cloudGames) {
        if (!(await DownloadManager.isDownloaded(g.id))) {
          await DownloadManager.downloadAndUnpack(g);
        }
      }
    });
  }
}

async function start() {
  try {
    await loadPrefs();
    await loadGames();
    renderCategoryRibbon();
    renderGames();
    setupEvents();
  } catch (err) {
    console.error(err);
    showToast('Initialization failed. Check connection.');
  }
}

start();
