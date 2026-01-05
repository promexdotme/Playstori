# Playstori Historical Documentation (2025)

> **⚠️ ARCHIVED**: This file is for historical reference only. See `README.md` for current documentation.

---

## From: Original README.md

Open-source, offline-capable kids game launcher built with Vite + Capacitor. Safe, ad-free.

**Old Paths (Deprecated)**:
- Games: `public/games/<id>/`
- Manifest: `public/games.json`
- Thumbs: `games/<id>/<id>-logo.png`

**Note**: These paths were replaced by `public/appstorage/` in late 2025.

---

## From: BuyInstantHTML5Games Integration

Imported ~80 games from buyinstanthtml5games collection.

**Steps taken**:
- Copied game folders using slug format (e.g., `25_amazingcube` → `amazingcube`)
- Removed `c2runtime_data.js` license gates
- Disabled game service workers
- Added Playstori Home icon + fullscreen helper
- Backfilled missing icons

**Sample mappings**:
| Original | Slug |
|----------|------|
| 25_amazingcube | amazingcube |
| 104_angry_block | angry-block |
| 10_cars_movement | cars-movement |
| 03_tic_tac_toe | tic-tac-toe |

**Removed games** (broken): beat-hop, christmas-merge, color-tower, exit, falling-numbers, fill-the-holes, merge-numbers, neon-block, passage, pushout, snake-and-circles, spiral-paint, sticky-balls, switch-hexagon, the-blackwhite, turkey-adventure

---

## From: Paintgame.me (ig3) Import Notes

Special handling for `ig3/paintgame.me` sources:

1. Use `preview/v1` folder as source
2. Remove "Live preview on codecanyon.net" line
3. Disable service worker (`register-sw.js`)
4. Replace stub assets with real files from URL
5. Fix audio decode errors by re-downloading `.webm` files
6. Fix `box2d.wasm.js` by re-downloading from source
7. Unregister old Construct service workers
8. Replace "Live Preview On CodeCanyon.net" with "PlayStori" in `data.json`

---

## From: AIprompt.md (Dev Notes)

**UI Flow** (original):
- Single view showing all games (no categories)
- Clicking a game opens its `index.html` directly
- Top bar: logo, search button, settings, star counter
- Settings: PIN gate, enable/disable games, "Download all"

**Star Economy**:
```js
// Iframe mode
window.parent?.postMessage({ type: 'ADD_STAR', gameId: '<id>' }, '*');

// Direct navigation
const key = 'playstori-star-delta';
localStorage.setItem(key, (Number(localStorage.getItem(key) || '0') + 1).toString());
```

**Theming**:
- Primary: #ff69b4
- Secondary: #ffd700
- Background: #e0ffff
- Fonts: Plus Jakarta Sans, Lora

---

*Archived: January 2025*
