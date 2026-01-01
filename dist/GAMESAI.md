# Playstori Game Integration Checklist

Use this when adding or modifying any game under `public/games/<game-id>/`.

## Folder & naming
- Game lives at `public/games/<id>/index.html`.
- Thumbnail lives at `public/games/<id>/<id>-logo.png` (or `.svg`).
- In `public/games.json`, set:
  ```json
  {
    "id": "<id>",
    "name": "Game Name",
    "tag": "tag",
    "description": "Short pitch",
    "path": "games/<id>/index.html",
    "thumb": "games/<id>/<id>-logo.png"
  }
  ```

## Offline correctness
- All asset paths relative (e.g., `./assets/...`), no CDN dependencies.
- Remove/disable any game-specific service workers to avoid conflicts with the launcher PWA.
- Keep everything inside the page—no `window.open` or `top` navigation.

## Storage hygiene
- Prefix any `localStorage`/IndexedDB keys to avoid collisions: `playstori_<id>_...`.
- Save progress on pause/exit and on level complete so it survives reloads/offline.

## Stars (rewards)
- If launched inside an iframe: call on level complete  
  ```js
  window.parent?.postMessage({ type: 'ADD_STAR', gameId: '<id>' }, '*');
  ```
- If launched directly (current flow): increment shared counter so the launcher reads it next time  
  ```js
  const k = 'playstori-star-delta';
  const next = (Number(localStorage.getItem(k) || '0') + 1).toString();
  localStorage.setItem(k, next);
  ```

## Audio & pause
- Ensure audio stops/pauses on `visibilitychange` so exiting the game (back/home) doesn’t leave sounds playing.

## Back/Home UX
- Provide a visible “Home”/“Back” control that links to the launcher root (`/`) if the game runs full-page. Avoid `window.history.back()` if it may be unreliable.

## Testing steps
1) Drop the game folder under `public/games/<id>/`.
2) Add entry to `public/games.json` with the standardized paths.
3) Run `npm run dev`, open the launcher, launch the game, earn a star, and confirm the counter increases after returning (or on next load for direct-launch).
4) Run `npm run build && npm run preview` to verify production build and caching.

## Content/brand
- Keep tone gentle and non-exploitative (no ads/trackers). Use calm color palettes if you add any UI around the game.

## Gamonetize cleanup (html5.gamemonetize.co)
- Only copy the game folder from `gamonetize/<pack>/html5.gamemonetize.co/<hash>/` into `public/games/<id>/`.
- Do not copy other domain folders (`api.gamemonetize.com`, `imasdk.googleapis.com`, analytics, etc.) unless the game references them locally.
- Remove external font imports (`https://fonts.googleapis.com/...`) and keep fonts local or use system fonts.
- Verify there are no external ad/analytics scripts or network calls in the game HTML/CSS/JS.
- If the Unity `Build/*.data.unityweb` is tiny and contains a `No Content: https://...` stub, download the real file from that URL and replace it locally.
- If ad SDK calls still appear from inside a Unity build, add a small blocker/stub in the game `index.html` that intercepts ad domains and stubs `gdsdk` to keep the game offline/ad-free.
