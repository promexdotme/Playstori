# Playstori
**Where Stories Come to Play.**

Open-source, offline-capable kids game launcher built with Vite + Capacitor. Safe, ad-free, and easy to extend by dropping HTML5 games into `public/games/` and editing a single JSON file.

---

## Quickstart (local)
1) Install deps: `npm install`
2) Dev server: `npm run dev` (open the printed URL)
3) Build: `npm run build`
4) Preview build: `npm run preview`

## Project structure
- `src/` — launcher UI/logic (built by Vite)
- `public/` — static content
  - `public/games.json` — game database (fetched at runtime)
  - `public/games/` — each game lives in its own folder
  - `public/manifest.json`, `public/icons/` — PWA assets

## How to add or edit games
1) Place the game folder in `public/games/<your-game-id>/` with `index.html` and a `thumb` image. Keep asset paths relative (no external CDNs) so it works offline.
2) Edit `public/games.json` and add/update the entry:
```json
{
  "id": "my-new-game",
  "name": "Super Logic",
  "path": "games/my-new-game/index.html",
  "thumb": "games/my-new-game/thumb.png",
  "description": "Calm logic puzzle."
}
```
3) If the dev server is running, refresh to see it. For production web/native builds, rerun `npm run build` before packaging or deploy.

To award a star from inside the game on level complete:
```js
window.parent?.postMessage({ type: 'ADD_STAR', gameId: '<your-game-id>' }, '*');
```

## Build and preview
- Dev: `npm run dev`
- Prod build: `npm run build`
- Preview prod build: `npm run preview`

## Ship to the web (PWA)
1) `npm run build`
2) Deploy the `dist/` folder to static hosting (Netlify/Vercel/S3/Cloudflare Pages, etc.).
3) When code or content changes, rebuild and redeploy `dist/`.

## Ship to native (Android/iOS)
1) `npm run build`
2) `npx cap sync` (copies `dist/` into the native shells)
3) Android: `npx cap open android`, then build/run or generate a signed bundle in Android Studio.
4) iOS (macOS): `npx cap open ios`, set signing in Xcode, then build/run or Archive for the App Store.
Repeat steps 1–2 after any code/content change you want packaged into the apps.

## Notes
- The app fetches `public/games.json` at runtime; no imports in code, so you can edit it without touching JS.
- Service worker (via vite-plugin-pwa) precaches the app shell; “Download all” in settings caches game assets into `playstori-games`.
- Keep `node_modules/` out of git; commit source + `public/` + lockfile.

## Contributing
PRs welcome: new games, UX polish, accessibility fixes, or content curation.

## License
MIT
