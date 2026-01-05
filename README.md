# Playstori 2026 Documentation
**Where Stories Come to Play.**

> **Note**: This is the **single source of truth** for Playstori development. All other MD files have been deprecated.

---

## Project Overview

Playstori is an open-source, offline-capable kids game launcher built with **Vite + Capacitor**. Safe, ad-free, and easy to extend.

- **Web**: PWA at [playstori.org](https://playstori.org)
- **Mobile**: Android/iOS via Capacitor
- **Games**: HTML5 games stored locally in `public/appstorage/`

---

## Directory Structure

```
playstori/
├── src/                    # Launcher UI/logic (Vite builds this)
├── public/
│   ├── appstorage/
│   │   ├── games/          # Game folders (each has index.html)
│   │   ├── icons/          # Game icons (256x256 PNG)
│   │   └── games.json      # Game manifest
│   ├── manifest.json       # PWA manifest
│   └── icons/              # Launcher icons & logo
├── dist/                   # Built output (= public_html)
├── StagingGames/           # Staging area for new games
└── add_game.py             # Automation script
```

> **Important**: The `dist/` folder IS the `public_html` for playstori.org

---

## Adding a New Game

### Option 1: Automated (Recommended)

```bash
python add_game.py <game-id> --staging-path StagingGames/<game-folder>
```

The script will:
1. Copy game to `public/appstorage/games/<game-id>/`
2. Create ZIP at `public/appstorage/games/<game-id>.zip`
3. Copy icon to `public/appstorage/icons/<game-id>.png`
4. Add entry to `public/appstorage/games.json`

### Option 2: Manual Steps

#### Step 1: Copy Game Assets
```
public/appstorage/games/<game-id>/
├── index.html          # Main entry (may be in subdirectory)
└── [game files...]
```

#### Step 2: Create ZIP for Mobile
```bash
# Create ZIP of the game folder
cd public/appstorage/games
zip -r <game-id>.zip <game-id>/
```
Save to: `public/appstorage/games/<game-id>.zip`

#### Step 3: Add Game Icon
- Extract or create a **256x256 PNG** icon
- Save to: `public/appstorage/icons/<game-id>.png`

#### Step 4: Update Manifest
Add entry to `public/appstorage/games.json`:

```json
{
    "id": "<game-id>",
    "name": "Game Name",
    "tag": "arcade",
    "category": "🕹️ Super Arcade",
    "version": 1,
    "description": "Short description.",
    "path": "appstorage/games/<game-id>/index.html",
    "thumb": "appstorage/icons/<game-id>.png"
}
```

**Path Examples**:
- Simple: `appstorage/games/tennis/index.html`
- Nested: `appstorage/games/tennis/html5/minify/index.html`

#### Step 5: Build & Deploy
```bash
npm run build
```
Upload `dist/` contents to server.

---

## Available Categories

| Emoji | Category |
|-------|----------|
| 🧩 | Brain Puzzles |
| 🕹️ | Super Arcade |
| 🏎️ | Fast & Fun |
| 🎲 | Classic Tabletop |
| ✨ | Learning Adventures |
| 🎯 | Target & Aim |

---

## Asset Checklist

When adding a game, ensure these files exist:

- [ ] `public/appstorage/games/<game-id>/index.html` (or subdirectory)
- [ ] `public/appstorage/games/<game-id>.zip`
- [ ] `public/appstorage/icons/<game-id>.png`
- [ ] Entry in `public/appstorage/games.json`

---

## Platform Behavior

| Platform | Icons | Games |
|----------|-------|-------|
| **Web** | Loads from `/appstorage/icons/` | Streams from `/appstorage/games/` |
| **Android/iOS** | Cached locally | Downloads ZIP, extracts to local storage |

---

## Build Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npx cap sync` | Sync to native apps |
| `npx cap open android` | Open in Android Studio |
| `npx cap open ios` | Open in Xcode (macOS) |

---

## Offline Requirements

All games must follow these rules for offline support:

1. **Relative paths only** - Use `./assets/...` not absolute URLs
2. **No CDN dependencies** - All assets must be local
3. **No external scripts** - No analytics, ads, or tracking
4. **Disable service workers** - Remove game-specific SW to prevent conflicts
5. **No navigation** - Avoid `window.open` or top-level redirects

---

## Storage Rules

- Prefix localStorage/IndexedDB keys: `playstori_<game-id>_...`
- Save progress on pause/exit
- Audio should pause on `visibilitychange`

---

## Importing from External Sources

### From Gamonetize (html5.gamemonetize.co)
1. Copy only the game folder, not ad/analytics folders
2. Remove external font imports
3. Verify no external network calls
4. If Unity `.data.unityweb` is a stub, download the real file
5. Add ad-blocker stub if needed for Unity builds

### From Paintgame.me (ig3)
1. Use the `preview/v1` folder as source
2. Remove "Live preview on codecanyon.net" line
3. Disable service worker (`register-sw.js`)
4. Replace stub assets with real files from URL
5. Fix audio decode errors by re-downloading `.webm` files

---

## Web Deployment

1. `npm run build`
2. Deploy contents of `dist/` to static hosting
3. The `dist/` folder becomes your `public_html`

---

## Native App Deployment

1. `npm run build`
2. `npx cap sync`
3. **Android**: `npx cap open android` → Build in Android Studio
4. **iOS**: `npx cap open ios` → Build in Xcode (macOS only)

---

## Star Economy

Games can award stars to players:

**For iframe mode:**
```js
window.parent?.postMessage({ type: 'ADD_STAR', gameId: '<id>' }, '*');
```

**For direct navigation:**
```js
const key = 'playstori-star-delta';
const next = (Number(localStorage.getItem(key) || '0') + 1).toString();
localStorage.setItem(key, next);
```

---

## Special Game Handling

### GameDistribution & GameMonetize (Ripped Games)
Games from these platforms often come as complex multi-domain rips. Follow these rules:

1.  **Locate the Core**: Look for the `index.html` nested deep (e.g., `StagingGames/GameName/html5.gamedistribution.com/.../index.html`).
2.  **Stub the SDK**: Most will fail to load offline because they try to fetch `main.min.js`. Replace the external script with a local stub:
    ```javascript
    // Offline SDK Stub
    window.gdsdk = {
        showAd: function() { 
            console.log("Offline Mode: showAd suppressed"); 
            // Auto-trigger game start event
            if (window.GD_OPTIONS && window.GD_OPTIONS.onEvent) {
                window.GD_OPTIONS.onEvent({ name: "SDK_GAME_START" });
            }
        },
        preloadAd: function() { return Promise.resolve(); }
    };
    ```
3.  **Clean up GDPR**: Remove GDPR/Tracking events from the `GD_OPTIONS` object to simplify.
4.  **Fix Rogue Redirects**: If the game redirects to `blocked.html` on startup, search for the SDK URL in `game.js` and neutralize it. Rogue redirects are often triggered by the SDK injection function. 
    > [!TIP]
    > For large `game.js` files (>4MB), use a script to replace `https://html5.api.gamedistribution.com/main.min.js` with `https://localhost/null.js`. Also ensure `window.GD_OPTIONS = {` is changed to `window.GD_OPTIONS = window.GD_OPTIONS || {` to prevent the engine from overwriting your local stub.
5.  **Relative Assets**: Ensure all assets (`game.js`, `vendor/`, `assets/`) are in the same directory and referenced relatively.

### Paintgame.me (ig3)
1. **Asset Paths**: Fix `.js` files that use hardcoded site URLs for assets.
2. **Service Worker**: Delete `sw.js` and remove the registration code from `index.html`.
3. **Box2D Fix**: For games using `box2d.wasm`, ensure the MIME type is correctly handled or provided locally.

---

## License

**CC BY-NC 4.0** - Free for personal and non-commercial use.

Commercial licensing available for schools, companies, and publishers.

---

*Last updated: January 2026*
